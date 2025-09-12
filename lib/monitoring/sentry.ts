// Sentry Error Tracking and Performance Monitoring
import * as Sentry from '@sentry/nextjs';

export function initSentry() {
  Sentry.init({
    dsn: process.env.NEXT_PUBLIC_SENTRY_DSN,
    environment: process.env.NODE_ENV,
    
    // Performance Monitoring
    tracesSampleRate: process.env.NODE_ENV === 'production' ? 0.1 : 1.0,
    
    // Session Replay
    replaysSessionSampleRate: 0.1,
    replaysOnErrorSampleRate: 1.0,
    
    // Release tracking
    release: process.env.NEXT_PUBLIC_APP_VERSION || '1.0.0',
    
    // Error filtering
    beforeSend(event, hint) {
      // Filter out non-error events in development
      if (process.env.NODE_ENV === 'development') {
        return event.level === 'error' ? event : null;
      }
      return event;
    },
    
    // User context
    beforeSendTransaction(event) {
      // Add custom transaction data
      return event;
    },
  });
}

// Custom error boundary
export function captureException(error: Error, context?: any) {
  Sentry.captureException(error, {
    tags: {
      section: context?.section || 'unknown',
    },
    extra: context,
  });
}

// Custom performance monitoring
export function captureTransaction(name: string, op: string, data?: any) {
  return Sentry.startTransaction({
    name,
    op,
    data,
  });
}

// User context tracking
export function setUserContext(user: {
  id: string;
  email?: string;
  role?: string;
}) {
  Sentry.setUser({
    id: user.id,
    email: user.email,
    role: user.role,
  });
}

// Breadcrumb tracking
export function addBreadcrumb(message: string, category: string, level: 'info' | 'warning' | 'error' = 'info') {
  Sentry.addBreadcrumb({
    message,
    category,
    level,
    timestamp: Date.now() / 1000,
  });
}

// Custom metrics
export function captureMetric(name: string, value: number, tags?: Record<string, string>) {
  Sentry.metrics.increment(name, value, tags);
}

// API route error handling
export function withSentry(handler: any) {
  return Sentry.withSentry(handler);
}

// Performance monitoring for API routes
export function withPerformanceMonitoring(handler: any, operationName: string) {
  return async (req: any, res: any) => {
    const transaction = captureTransaction(operationName, 'http.server');
    
    try {
      const result = await handler(req, res);
      transaction.setStatus('ok');
      return result;
    } catch (error) {
      transaction.setStatus('internal_error');
      captureException(error as Error, {
        section: 'api',
        operation: operationName,
        url: req.url,
        method: req.method,
      });
      throw error;
    } finally {
      transaction.finish();
    }
  };
}

// Client-side error tracking
export function captureClientError(error: Error, context?: any) {
  if (typeof window !== 'undefined') {
    Sentry.captureException(error, {
      tags: {
        section: 'client',
        ...context?.tags,
      },
      extra: context,
    });
  }
}

// Performance monitoring for client-side
export function trackPerformance(name: string, startTime: number, endTime: number, tags?: Record<string, string>) {
  if (typeof window !== 'undefined') {
    const duration = endTime - startTime;
    Sentry.metrics.timing(name, duration, tags);
  }
}

// Database query monitoring
export function trackDatabaseQuery(query: string, duration: number, success: boolean) {
  Sentry.metrics.timing('database.query.duration', duration, {
    query: query.substring(0, 100), // Truncate long queries
    success: success.toString(),
  });
}

// Payment monitoring
export function trackPaymentEvent(event: string, amount: number, currency: string, success: boolean) {
  Sentry.metrics.increment('payment.event', 1, {
    event,
    currency,
    success: success.toString(),
  });
  
  Sentry.metrics.timing('payment.amount', amount, {
    currency,
    success: success.toString(),
  });
}

// User action tracking
export function trackUserAction(action: string, resource: string, userId: string) {
  addBreadcrumb(`User ${action} ${resource}`, 'user.action', 'info');
  
  Sentry.metrics.increment('user.action', 1, {
    action,
    resource,
    userId,
  });
}

// Memory usage monitoring
export function trackMemoryUsage() {
  if (typeof window !== 'undefined' && 'memory' in performance) {
    const memory = (performance as any).memory;
    Sentry.metrics.gauge('memory.used', memory.usedJSHeapSize);
    Sentry.metrics.gauge('memory.total', memory.totalJSHeapSize);
    Sentry.metrics.gauge('memory.limit', memory.jsHeapSizeLimit);
  }
}

// Network monitoring
export function trackNetworkRequest(url: string, method: string, status: number, duration: number) {
  Sentry.metrics.timing('network.request.duration', duration, {
    url: url.substring(0, 100),
    method,
    status: status.toString(),
  });
}

// Custom error classes
export class WeddingLKError extends Error {
  constructor(
    message: string,
    public code: string,
    public statusCode: number = 500,
    public context?: any
  ) {
    super(message);
    this.name = 'WeddingLKError';
  }
}

export class ValidationError extends WeddingLKError {
  constructor(message: string, context?: any) {
    super(message, 'VALIDATION_ERROR', 400, context);
  }
}

export class AuthenticationError extends WeddingLKError {
  constructor(message: string = 'Authentication required', context?: any) {
    super(message, 'AUTHENTICATION_ERROR', 401, context);
  }
}

export class AuthorizationError extends WeddingLKError {
  constructor(message: string = 'Insufficient permissions', context?: any) {
    super(message, 'AUTHORIZATION_ERROR', 403, context);
  }
}

export class NotFoundError extends WeddingLKError {
  constructor(message: string = 'Resource not found', context?: any) {
    super(message, 'NOT_FOUND_ERROR', 404, context);
  }
}

export class ConflictError extends WeddingLKError {
  constructor(message: string, context?: any) {
    super(message, 'CONFLICT_ERROR', 409, context);
  }
}

export class RateLimitError extends WeddingLKError {
  constructor(message: string = 'Rate limit exceeded', context?: any) {
    super(message, 'RATE_LIMIT_ERROR', 429, context);
  }
}

export class PaymentError extends WeddingLKError {
  constructor(message: string, context?: any) {
    super(message, 'PAYMENT_ERROR', 402, context);
  }
}

// Error handler middleware
export function errorHandler(error: Error, req: any, res: any, next: any) {
  // Log error to Sentry
  captureException(error, {
    section: 'api',
    url: req.url,
    method: req.method,
    userAgent: req.get('User-Agent'),
    ip: req.ip,
  });

  // Handle custom errors
  if (error instanceof WeddingLKError) {
    return res.status(error.statusCode).json({
      error: error.message,
      code: error.code,
      ...(process.env.NODE_ENV === 'development' && { stack: error.stack }),
    });
  }

  // Handle unexpected errors
  return res.status(500).json({
    error: 'Internal server error',
    ...(process.env.NODE_ENV === 'development' && { 
      message: error.message,
      stack: error.stack 
    }),
  });
}

export default Sentry;


