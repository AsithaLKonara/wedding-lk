// Security Middleware for WeddingLK
// Enhanced security for cookies, sessions, and CSRF protection

import { NextRequest, NextResponse } from 'next/server';
// Removed NextAuth - using custom auth

export interface SecurityConfig {
  csrf: {
    enabled: boolean;
    tokenLength: number;
    rotationInterval: number;
    headerName: string;
  };
  cookies: {
    secure: boolean;
    httpOnly: boolean;
    sameSite: 'strict' | 'lax' | 'none';
    path: string;
    domain?: string;
  };
  headers: {
    hsts: boolean;
    csp: boolean;
    xss: boolean;
    frameOptions: boolean;
  };
  rateLimit: {
    enabled: boolean;
    windowMs: number;
    maxRequests: number;
  };
}

export interface SecurityHeaders {
  'Strict-Transport-Security'?: string;
  'X-Content-Type-Options'?: string;
  'X-Frame-Options'?: string;
  'X-XSS-Protection'?: string;
  'Referrer-Policy'?: string;
  'Content-Security-Policy'?: string;
  'Permissions-Policy'?: string;
}

export class SecurityMiddleware {
  private static instance: SecurityMiddleware;
  private config: SecurityConfig;
  private csrfTokens: Map<string, { token: string; expires: number }> = new Map();
  private rateLimitStore: Map<string, { count: number; resetTime: number }> = new Map();

  private constructor() {
    this.config = {
      csrf: {
        enabled: true,
        tokenLength: 32,
        rotationInterval: 3600000, // 1 hour
        headerName: 'X-CSRF-Token'
      },
      cookies: {
        secure: process.env.NODE_ENV === 'production',
        httpOnly: true,
        sameSite: 'strict',
        path: '/'
      },
      headers: {
        hsts: true,
        csp: true,
        xss: true,
        frameOptions: true
      },
      rateLimit: {
        enabled: true,
        windowMs: 900000, // 15 minutes
        maxRequests: 100
      }
    };

    this.startCSRFTokenCleanup();
  }

  public static getInstance(): SecurityMiddleware {
    if (!SecurityMiddleware.instance) {
      SecurityMiddleware.instance = new SecurityMiddleware();
    }
    return SecurityMiddleware.instance;
  }

  // Generate CSRF token
  generateCSRFToken(sessionId: string): string {
    const token = this.generateRandomToken(this.config.csrf.tokenLength);
    const expires = Date.now() + this.config.csrf.rotationInterval;
    
    this.csrfTokens.set(sessionId, { token, expires });
    
    return token;
  }

  // Validate CSRF token
  validateCSRFToken(sessionId: string, token: string): boolean {
    const stored = this.csrfTokens.get(sessionId);
    
    if (!stored) {
      return false;
    }

    if (Date.now() > stored.expires) {
      this.csrfTokens.delete(sessionId);
      return false;
    }

    return stored.token === token;
  }

  // Generate random token
  private generateRandomToken(length: number): string {
    const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
    let result = '';
    
    for (let i = 0; i < length; i++) {
      result += chars.charAt(Math.floor(Math.random() * chars.length));
    }
    
    return result;
  }

  // Set security headers
  setSecurityHeaders(response: NextResponse): NextResponse {
    const headers = this.getSecurityHeaders();
    
    Object.entries(headers).forEach(([key, value]) => {
      if (value) {
        response.headers.set(key, value);
      }
    });

    return response;
  }

  // Get security headers configuration
  private getSecurityHeaders(): SecurityHeaders {
    const headers: SecurityHeaders = {};

    if (this.config.headers.hsts) {
      headers['Strict-Transport-Security'] = 'max-age=31536000; includeSubDomains; preload';
    }

    if (this.config.headers.xss) {
      headers['X-Content-Type-Options'] = 'nosniff';
      headers['X-XSS-Protection'] = '1; mode=block';
    }

    if (this.config.headers.frameOptions) {
      headers['X-Frame-Options'] = 'DENY';
    }

    headers['Referrer-Policy'] = 'strict-origin-when-cross-origin';

    if (this.config.headers.csp) {
        headers['Content-Security-Policy'] = [
          "default-src 'self'",
          "script-src 'self' 'unsafe-inline' 'unsafe-eval' 'wasm-unsafe-eval' 'inline-speculation-rules' chrome-extension://* data: blob:",
          "style-src 'self' 'unsafe-inline' data: blob:",
          "img-src 'self' data: https: blob:",
          "font-src 'self' data: https:",
          "connect-src 'self' https: wss:",
          "frame-src 'self'",
          "object-src 'none'",
          "base-uri 'self'",
          "form-action 'self'"
        ].join('; ');
    }

    headers['Permissions-Policy'] = [
      'camera=()',
      'microphone=()',
      'geolocation=()',
      'interest-cohort=()'
    ].join(', ');

    return headers;
  }

  // Validate session
  async validateSession(request: NextRequest): Promise<{
    isValid: boolean;
    user?: any;
    error?: string;
  }> {
    try {
      const token = await getToken({ 
        req: request, 
        secret: process.env.NEXTAUTH_SECRET 
      });

      if (!token) {
        return { isValid: false, error: 'No valid session found' };
      }

      // Check if token is expired
      if (token.exp && Date.now() > token.exp * 1000) {
        return { isValid: false, error: 'Session expired' };
      }

      return { isValid: true, user: token };
    } catch (error) {
      console.error('Session validation error:', error);
      return { isValid: false, error: 'Session validation failed' };
    }
  }

  // Rate limiting
  checkRateLimit(identifier: string): {
    allowed: boolean;
    remaining: number;
    resetTime: number;
  } {
    if (!this.config.rateLimit.enabled) {
      return { allowed: true, remaining: Infinity, resetTime: 0 };
    }

    const now = Date.now();
    const windowStart = now - this.config.rateLimit.windowMs;
    
    // Clean up old entries
    for (const [key, value] of this.rateLimitStore.entries()) {
      if (value.resetTime < windowStart) {
        this.rateLimitStore.delete(key);
      }
    }

    const current = this.rateLimitStore.get(identifier);
    
    if (!current) {
      this.rateLimitStore.set(identifier, {
        count: 1,
        resetTime: now + this.config.rateLimit.windowMs
      });
      
      return {
        allowed: true,
        remaining: this.config.rateLimit.maxRequests - 1,
        resetTime: now + this.config.rateLimit.windowMs
      };
    }

    if (current.count >= this.config.rateLimit.maxRequests) {
      return {
        allowed: false,
        remaining: 0,
        resetTime: current.resetTime
      };
    }

    current.count++;
    
    return {
      allowed: true,
      remaining: this.config.rateLimit.maxRequests - current.count,
      resetTime: current.resetTime
    };
  }

  // Secure cookie configuration
  getSecureCookieConfig(name: string, value: string, options: {
    maxAge?: number;
    httpOnly?: boolean;
    secure?: boolean;
    sameSite?: 'strict' | 'lax' | 'none';
    path?: string;
    domain?: string;
  } = {}): string {
    const config = { ...this.config.cookies, ...options };
    
    const cookieParts = [`${name}=${value}`];
    
    if (config.maxAge) {
      cookieParts.push(`Max-Age=${config.maxAge}`);
    }
    
    if (config.httpOnly) {
      cookieParts.push('HttpOnly');
    }
    
    if (config.secure) {
      cookieParts.push('Secure');
    }
    
    if (config.sameSite) {
      cookieParts.push(`SameSite=${config.sameSite}`);
    }
    
    if (config.path) {
      cookieParts.push(`Path=${config.path}`);
    }
    
    if (config.domain) {
      cookieParts.push(`Domain=${config.domain}`);
    }

    return cookieParts.join('; ');
  }

  // Validate request origin
  validateOrigin(request: NextRequest): boolean {
    const origin = request.headers.get('origin');
    const referer = request.headers.get('referer');
    
    if (!origin && !referer) {
      return true; // Allow requests without origin (e.g., direct navigation)
    }

    const allowedOrigins = [
      process.env.NEXTAUTH_URL,
      process.env.NEXT_PUBLIC_APP_URL,
      'http://localhost:3000',
      'https://weddinglk.com'
    ].filter(Boolean);

    if (origin) {
      return allowedOrigins.some(allowed => allowed && origin.startsWith(allowed));
    }

    if (referer) {
      try {
        const refererUrl = new URL(referer);
        return allowedOrigins.some(allowed => {
          if (!allowed) return false;
          const allowedUrl = new URL(allowed);
          return refererUrl.origin === allowedUrl.origin;
        });
      } catch {
        return false;
      }
    }

    return false;
  }

  // Sanitize input
  sanitizeInput(input: string): string {
    return input
      .replace(/[<>]/g, '') // Remove potential HTML tags
      .replace(/javascript:/gi, '') // Remove javascript: protocol
      .replace(/on\w+=/gi, '') // Remove event handlers
      .trim();
  }

  // Validate file upload
  validateFileUpload(file: File): {
    isValid: boolean;
    error?: string;
  } {
    const maxSize = 10 * 1024 * 1024; // 10MB
    const allowedTypes = [
      'image/jpeg',
      'image/png',
      'image/webp',
      'image/gif',
      'application/pdf',
      'text/plain'
    ];

    if (file.size > maxSize) {
      return { isValid: false, error: 'File size too large' };
    }

    if (!allowedTypes.includes(file.type)) {
      return { isValid: false, error: 'File type not allowed' };
    }

    return { isValid: true };
  }

  // Start CSRF token cleanup
  private startCSRFTokenCleanup(): void {
    setInterval(() => {
      const now = Date.now();
      for (const [sessionId, token] of this.csrfTokens.entries()) {
        if (now > token.expires) {
          this.csrfTokens.delete(sessionId);
        }
      }
    }, 300000); // Clean up every 5 minutes
  }

  // Update configuration
  updateConfig(newConfig: Partial<SecurityConfig>): void {
    this.config = { ...this.config, ...newConfig };
    console.log('🔧 Security configuration updated');
  }

  // Get current configuration
  getConfig(): SecurityConfig {
    return { ...this.config };
  }

  // Security health check
  async securityHealthCheck(): Promise<{
    status: string;
    checks: Record<string, boolean>;
    recommendations: string[];
  }> {
    const checks: Record<string, boolean> = {
      csrfEnabled: this.config.csrf.enabled,
      secureCookies: this.config.cookies.secure,
      rateLimitEnabled: this.config.rateLimit.enabled,
      securityHeaders: this.config.headers.hsts && this.config.headers.csp
    };

    const recommendations: string[] = [];

    if (!checks.csrfEnabled) {
      recommendations.push('Enable CSRF protection for better security');
    }

    if (!checks.secureCookies && process.env.NODE_ENV === 'production') {
      recommendations.push('Enable secure cookies in production');
    }

    if (!checks.rateLimitEnabled) {
      recommendations.push('Enable rate limiting to prevent abuse');
    }

    if (!checks.securityHeaders) {
      recommendations.push('Enable all security headers');
    }

    const allChecksPass = Object.values(checks).every(check => check);
    
    return {
      status: allChecksPass ? 'secure' : 'needs_attention',
      checks,
      recommendations
    };
  }
}

// Export singleton instance
export const securityMiddleware = SecurityMiddleware.getInstance();
