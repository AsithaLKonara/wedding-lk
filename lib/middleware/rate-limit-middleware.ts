import { NextRequest, NextResponse } from 'next/server';

interface RateLimitConfig {
  windowMs: number; // Time window in milliseconds
  maxRequests: number; // Maximum requests per window
  message?: string;
  skipSuccessfulRequests?: boolean;
  skipFailedRequests?: boolean;
}

interface RateLimitStore {
  [key: string]: {
    count: number;
    resetTime: number;
  };
}

// In-memory store for rate limiting (use Redis in production)
const store: RateLimitStore = {};

// Clean up expired entries every 5 minutes
setInterval(() => {
  const now = Date.now();
  Object.keys(store).forEach(key => {
    if (store[key].resetTime < now) {
      delete store[key];
    }
  });
}, 5 * 60 * 1000);

/**
 * Rate limiting middleware
 */
export function rateLimit(config: RateLimitConfig) {
  const {
    windowMs,
    maxRequests,
    message = 'Too many requests, please try again later',
    skipSuccessfulRequests = false,
    skipFailedRequests = false
  } = config;

  return (request: NextRequest): NextResponse | null => {
    const identifier = getClientIdentifier(request);
    const now = Date.now();
    const windowStart = now - windowMs;

    // Get or create rate limit entry
    let entry = store[identifier];
    
    if (!entry || entry.resetTime < windowStart) {
      // Create new entry or reset expired entry
      entry = {
        count: 0,
        resetTime: now + windowMs
      };
      store[identifier] = entry;
    }

    // Increment request count
    entry.count++;

    // Check if rate limit exceeded
    if (entry.count > maxRequests) {
      return NextResponse.json(
        {
          success: false,
          error: 'Rate limit exceeded',
          message,
          retryAfter: Math.ceil((entry.resetTime - now) / 1000),
          limit: maxRequests,
          remaining: 0,
          resetTime: new Date(entry.resetTime).toISOString()
        },
        { 
          status: 429,
          headers: {
            'Retry-After': Math.ceil((entry.resetTime - now) / 1000).toString(),
            'X-RateLimit-Limit': maxRequests.toString(),
            'X-RateLimit-Remaining': '0',
            'X-RateLimit-Reset': entry.resetTime.toString()
          }
        }
      );
    }

    // Add rate limit headers to successful requests
    const remaining = Math.max(0, maxRequests - entry.count);
    
    // Return null to continue processing
    return null;
  };
}

/**
 * Get client identifier for rate limiting
 */
function getClientIdentifier(request: NextRequest): string {
  // Try to get real IP from headers (for Vercel/proxy setups)
  const forwardedFor = request.headers.get('x-forwarded-for');
  const realIp = request.headers.get('x-real-ip');
  const cfConnectingIp = request.headers.get('cf-connecting-ip');
  
  const ip = forwardedFor?.split(',')[0] || 
            realIp || 
            cfConnectingIp || 
            'unknown';
  
  // Include user agent for more granular rate limiting
  const userAgent = request.headers.get('user-agent') || 'unknown';
  
  return `${ip}-${userAgent}`;
}

/**
 * Predefined rate limit configurations
 */
export const rateLimitConfigs = {
  // Strict rate limiting for authentication endpoints
  auth: {
    windowMs: 15 * 60 * 1000, // 15 minutes
    maxRequests: 5, // 5 attempts per 15 minutes
    message: 'Too many authentication attempts, please try again later'
  },
  
  // Moderate rate limiting for API endpoints
  api: {
    windowMs: 15 * 60 * 1000, // 15 minutes
    maxRequests: 100, // 100 requests per 15 minutes
    message: 'Too many API requests, please slow down'
  },
  
  // Lenient rate limiting for public endpoints
  public: {
    windowMs: 15 * 60 * 1000, // 15 minutes
    maxRequests: 200, // 200 requests per 15 minutes
    message: 'Too many requests, please try again later'
  },
  
  // Very strict rate limiting for sensitive operations
  sensitive: {
    windowMs: 60 * 60 * 1000, // 1 hour
    maxRequests: 3, // 3 attempts per hour
    message: 'Too many sensitive operations, please try again later'
  }
};

/**
 * Higher-order function to apply rate limiting to API routes
 */
export function withRateLimit(
  config: RateLimitConfig,
  handler: (request: NextRequest) => Promise<NextResponse>
) {
  return async (request: NextRequest): Promise<NextResponse> => {
    const rateLimitResponse = rateLimit(config)(request);
    
    if (rateLimitResponse) {
      return rateLimitResponse;
    }
    
    return handler(request);
  };
}

