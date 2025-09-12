import { NextRequest, NextResponse } from 'next/server';

interface RateLimitConfig {
  windowMs: number; // Time window in milliseconds
  max: number; // Maximum number of requests per window
  message?: string;
  keyGenerator?: (request: NextRequest) => string;
}

interface RateLimitEntry {
  count: number;
  resetTime: number;
}

// In-memory store for rate limiting (in production, use Redis)
const rateLimitStore = new Map<string, RateLimitEntry>();

// Clean up expired entries every 5 minutes
setInterval(() => {
  const now = Date.now();
  for (const [key, entry] of rateLimitStore.entries()) {
    if (now > entry.resetTime) {
      rateLimitStore.delete(key);
    }
  }
}, 5 * 60 * 1000);

export class RateLimiter {
  private config: RateLimitConfig;

  constructor(config: RateLimitConfig) {
    this.config = {
      message: 'Too many requests, please try again later',
      keyGenerator: (request: NextRequest) => {
        // Default key generator uses IP address
        const forwarded = request.headers.get('x-forwarded-for');
        const ip = forwarded ? forwarded.split(',')[0] : request.ip || 'unknown';
        return ip;
      },
      ...config,
    };
  }

  async check(request: NextRequest): Promise<{
    allowed: boolean;
    remaining: number;
    resetTime: number;
    error?: NextResponse;
  }> {
    const key = this.config.keyGenerator!(request);
    const now = Date.now();
    const windowStart = now - this.config.windowMs;

    // Get or create rate limit entry
    let entry = rateLimitStore.get(key);
    
    if (!entry || now > entry.resetTime) {
      // Create new entry or reset expired entry
      entry = {
        count: 0,
        resetTime: now + this.config.windowMs,
      };
    }

    // Increment count
    entry.count++;
    rateLimitStore.set(key, entry);

    const remaining = Math.max(0, this.config.max - entry.count);
    const allowed = entry.count <= this.config.max;

    if (!allowed) {
      const error = NextResponse.json(
        {
          success: false,
          error: 'Rate limit exceeded',
          message: this.config.message,
          retryAfter: Math.ceil((entry.resetTime - now) / 1000),
        },
        { 
          status: 429,
          headers: {
            'Retry-After': Math.ceil((entry.resetTime - now) / 1000).toString(),
            'X-RateLimit-Limit': this.config.max.toString(),
            'X-RateLimit-Remaining': remaining.toString(),
            'X-RateLimit-Reset': entry.resetTime.toString(),
          },
        }
      );
      
      return { allowed: false, remaining, resetTime: entry.resetTime, error };
    }

    return { allowed: true, remaining, resetTime: entry.resetTime };
  }
}

// Pre-configured rate limiters for different endpoints
export const authRateLimit = new RateLimiter({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 5, // 5 login attempts per 15 minutes
  message: 'Too many login attempts, please try again later',
});

export const apiRateLimit = new RateLimiter({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 100, // 100 API calls per 15 minutes
  message: 'Too many API requests, please try again later',
});

export const uploadRateLimit = new RateLimiter({
  windowMs: 60 * 60 * 1000, // 1 hour
  max: 10, // 10 uploads per hour
  message: 'Too many file uploads, please try again later',
});

export const searchRateLimit = new RateLimiter({
  windowMs: 60 * 1000, // 1 minute
  max: 30, // 30 searches per minute
  message: 'Too many search requests, please try again later',
});

export const paymentRateLimit = new RateLimiter({
  windowMs: 60 * 1000, // 1 minute
  max: 3, // 3 payment attempts per minute
  message: 'Too many payment attempts, please try again later',
});

// Middleware function for rate limiting
export async function withRateLimit(
  request: NextRequest,
  rateLimiter: RateLimiter,
  handler: (request: NextRequest) => Promise<NextResponse>
): Promise<NextResponse> {
  const rateLimitResult = await rateLimiter.check(request);
  
  if (!rateLimitResult.allowed) {
    return rateLimitResult.error!;
  }
  
  const response = await handler(request);
  
  // Add rate limit headers to successful responses
  response.headers.set('X-RateLimit-Limit', rateLimiter.config.max.toString());
  response.headers.set('X-RateLimit-Remaining', rateLimitResult.remaining.toString());
  response.headers.set('X-RateLimit-Reset', rateLimitResult.resetTime.toString());
  
  return response;
}

// Utility function to create custom rate limiters
export function createRateLimiter(config: Partial<RateLimitConfig>): RateLimiter {
  return new RateLimiter({
    windowMs: 15 * 60 * 1000,
    max: 100,
    ...config,
  });
}

// IP-based rate limiting with different limits for different IP types
export function createIPBasedRateLimiter(
  request: NextRequest,
  configs: {
    default: RateLimitConfig;
    trusted?: RateLimitConfig;
    blocked?: string[];
  }
): RateLimiter {
  const ip = request.headers.get('x-forwarded-for')?.split(',')[0] || request.ip || 'unknown';
  
  // Check if IP is blocked
  if (configs.blocked?.includes(ip)) {
    return new RateLimiter({
      windowMs: 60 * 60 * 1000, // 1 hour
      max: 0, // Block all requests
      message: 'IP address is blocked',
    });
  }
  
  // Check if IP is trusted (e.g., internal networks, CDN)
  const isTrusted = request.headers.get('x-trusted-ip') === 'true' || 
                   ip.startsWith('192.168.') || 
                   ip.startsWith('10.') ||
                   ip === '127.0.0.1';
  
  if (isTrusted && configs.trusted) {
    return new RateLimiter(configs.trusted);
  }
  
  return new RateLimiter(configs.default);
}

// User-based rate limiting (requires authentication)
export function createUserBasedRateLimiter(
  userId: string,
  config: RateLimitConfig
): RateLimiter {
  return new RateLimiter({
    ...config,
    keyGenerator: () => `user:${userId}`,
  });
}

// Endpoint-specific rate limiting
export const endpointRateLimits = {
  '/api/auth/login': authRateLimit,
  '/api/auth/register': authRateLimit,
  '/api/auth/forgot-password': new RateLimiter({
    windowMs: 60 * 60 * 1000, // 1 hour
    max: 3, // 3 password reset attempts per hour
    message: 'Too many password reset attempts, please try again later',
  }),
  '/api/upload': uploadRateLimit,
  '/api/search': searchRateLimit,
  '/api/payments': paymentRateLimit,
  '/api/boosts/purchase': paymentRateLimit,
};

// Get rate limiter for a specific endpoint
export function getRateLimiterForEndpoint(pathname: string): RateLimiter | null {
  for (const [endpoint, rateLimiter] of Object.entries(endpointRateLimits)) {
    if (pathname.startsWith(endpoint)) {
      return rateLimiter;
    }
  }
  return apiRateLimit; // Default rate limiter
}


