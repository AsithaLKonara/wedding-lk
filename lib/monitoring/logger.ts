import winston from 'winston';
import { NextRequest, NextResponse } from 'next/server';

// Log levels
export enum LogLevel {
  ERROR = 'error',
  WARN = 'warn',
  INFO = 'info',
  HTTP = 'http',
  VERBOSE = 'verbose',
  DEBUG = 'debug',
  SILLY = 'silly',
}

// Log categories
export enum LogCategory {
  AUTH = 'auth',
  API = 'api',
  DATABASE = 'database',
  CACHE = 'cache',
  PAYMENT = 'payment',
  EMAIL = 'email',
  SECURITY = 'security',
  PERFORMANCE = 'performance',
  BUSINESS = 'business',
  SYSTEM = 'system',
}

// Custom log format
const logFormat = winston.format.combine(
  winston.format.timestamp({ format: 'YYYY-MM-DD HH:mm:ss' }),
  winston.format.errors({ stack: true }),
  winston.format.json(),
  winston.format.printf(({ timestamp, level, message, category, userId, requestId, ...meta }) => {
    return JSON.stringify({
      timestamp,
      level,
      category: category || 'system',
      message,
      userId,
      requestId,
      ...meta,
    });
  })
);

// Create logger instance
const logger = winston.createLogger({
  level: process.env.LOG_LEVEL || 'info',
  format: logFormat,
  defaultMeta: {
    service: 'weddinglk',
    environment: process.env.NODE_ENV || 'development',
  },
  transports: [
    // Console transport for development
    new winston.transports.Console({
      format: winston.format.combine(
        winston.format.colorize(),
        winston.format.simple()
      ),
    }),
    
    // File transport for errors
    new winston.transports.File({
      filename: 'logs/error.log',
      level: 'error',
      maxsize: 5242880, // 5MB
      maxFiles: 5,
    }),
    
    // File transport for all logs
    new winston.transports.File({
      filename: 'logs/combined.log',
      maxsize: 5242880, // 5MB
      maxFiles: 5,
    }),
  ],
});

// Add MongoDB transport for production
if (process.env.NODE_ENV === 'production' && process.env.MONGODB_URI) {
  const MongoDB = require('winston-mongodb').MongoDB;
  
  logger.add(new MongoDB({
    db: process.env.MONGODB_URI,
    collection: 'logs',
    options: {
      useUnifiedTopology: true,
    },
    level: 'info',
    expireAfterSeconds: 2592000, // 30 days
  }));
}

// Structured logger class
export class Logger {
  private static instance: Logger;
  private logger: winston.Logger;
  private requestId: string | null = null;
  private userId: string | null = null;

  constructor() {
    this.logger = logger;
  }

  static getInstance(): Logger {
    if (!Logger.instance) {
      Logger.instance = new Logger();
    }
    return Logger.instance;
  }

  // Set context for the current request
  setContext(requestId: string, userId?: string) {
    this.requestId = requestId;
    this.userId = userId || null;
  }

  // Clear context
  clearContext() {
    this.requestId = null;
    this.userId = null;
  }

  // Log methods
  error(message: string, category: LogCategory = LogCategory.SYSTEM, meta?: any) {
    this.logger.error(message, {
      category,
      requestId: this.requestId,
      userId: this.userId,
      ...meta,
    });
  }

  warn(message: string, category: LogCategory = LogCategory.SYSTEM, meta?: any) {
    this.logger.warn(message, {
      category,
      requestId: this.requestId,
      userId: this.userId,
      ...meta,
    });
  }

  info(message: string, category: LogCategory = LogCategory.SYSTEM, meta?: any) {
    this.logger.info(message, {
      category,
      requestId: this.requestId,
      userId: this.userId,
      ...meta,
    });
  }

  http(message: string, meta?: any) {
    this.logger.http(message, {
      category: LogCategory.API,
      requestId: this.requestId,
      userId: this.userId,
      ...meta,
    });
  }

  debug(message: string, category: LogCategory = LogCategory.SYSTEM, meta?: any) {
    this.logger.debug(message, {
      category,
      requestId: this.requestId,
      userId: this.userId,
      ...meta,
    });
  }

  // Business logic logging
  logUserAction(action: string, userId: string, meta?: any) {
    this.info(`User action: ${action}`, LogCategory.BUSINESS, {
      action,
      userId,
      ...meta,
    });
  }

  logAPICall(method: string, url: string, statusCode: number, duration: number, meta?: any) {
    this.http(`API ${method} ${url}`, {
      method,
      url,
      statusCode,
      duration,
      ...meta,
    });
  }

  logDatabaseQuery(query: string, duration: number, meta?: any) {
    this.debug(`Database query executed`, LogCategory.DATABASE, {
      query,
      duration,
      ...meta,
    });
  }

  logPaymentEvent(event: string, amount: number, currency: string, meta?: any) {
    this.info(`Payment event: ${event}`, LogCategory.PAYMENT, {
      event,
      amount,
      currency,
      ...meta,
    });
  }

  logSecurityEvent(event: string, severity: 'low' | 'medium' | 'high' | 'critical', meta?: any) {
    this.warn(`Security event: ${event}`, LogCategory.SECURITY, {
      event,
      severity,
      ...meta,
    });
  }

  logPerformanceMetric(metric: string, value: number, unit: string, meta?: any) {
    this.info(`Performance metric: ${metric}`, LogCategory.PERFORMANCE, {
      metric,
      value,
      unit,
      ...meta,
    });
  }
}

// Request logging middleware
export function withRequestLogging(handler: Function) {
  return async (req: NextRequest, ...args: any[]) => {
    const logger = Logger.getInstance();
    const requestId = req.headers.get('x-request-id') || 
                     req.headers.get('x-correlation-id') || 
                     `req_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
    
    const startTime = Date.now();
    const method = req.method;
    const url = req.url;
    
    // Set context
    logger.setContext(requestId);
    
    // Log request
    logger.http(`Incoming ${method} ${url}`, {
      method,
      url,
      userAgent: req.headers.get('user-agent'),
      ip: req.headers.get('x-forwarded-for') || req.headers.get('x-real-ip'),
      referer: req.headers.get('referer'),
    });
    
    try {
      // Execute handler
      const response = await handler(req, ...args);
      
      // Log response
      const duration = Date.now() - startTime;
      logger.logAPICall(method, url, response.status, duration);
      
      return response;
    } catch (error) {
      // Log error
      const duration = Date.now() - startTime;
      logger.error(`API Error: ${method} ${url}`, LogCategory.API, {
        method,
        url,
        duration,
        error: error instanceof Error ? error.message : String(error),
        stack: error instanceof Error ? error.stack : undefined,
      });
      
      throw error;
    } finally {
      // Clear context
      logger.clearContext();
    }
  };
}

// Error logging utility
export function logError(error: Error, context?: any) {
  const logger = Logger.getInstance();
  logger.error(`Unhandled error: ${error.message}`, LogCategory.SYSTEM, {
    error: error.message,
    stack: error.stack,
    ...context,
  });
}

// Performance monitoring
export class PerformanceMonitor {
  private static instance: PerformanceMonitor;
  private logger: Logger;

  constructor() {
    this.logger = Logger.getInstance();
  }

  static getInstance(): PerformanceMonitor {
    if (!PerformanceMonitor.instance) {
      PerformanceMonitor.instance = new PerformanceMonitor();
    }
    return PerformanceMonitor.instance;
  }

  // Measure function execution time
  async measure<T>(
    name: string,
    fn: () => Promise<T>,
    category: LogCategory = LogCategory.PERFORMANCE
  ): Promise<T> {
    const startTime = Date.now();
    
    try {
      const result = await fn();
      const duration = Date.now() - startTime;
      
      this.logger.logPerformanceMetric(name, duration, 'ms', {
        success: true,
      });
      
      return result;
    } catch (error) {
      const duration = Date.now() - startTime;
      
      this.logger.logPerformanceMetric(name, duration, 'ms', {
        success: false,
        error: error instanceof Error ? error.message : String(error),
      });
      
      throw error;
    }
  }

  // Measure database query performance
  async measureDatabaseQuery<T>(
    queryName: string,
    fn: () => Promise<T>
  ): Promise<T> {
    return this.measure(`db_query_${queryName}`, fn, LogCategory.DATABASE);
  }

  // Measure API endpoint performance
  async measureAPIEndpoint<T>(
    endpoint: string,
    fn: () => Promise<T>
  ): Promise<T> {
    return this.measure(`api_${endpoint}`, fn, LogCategory.API);
  }
}

// Health check logger
export function logHealthCheck(component: string, status: 'healthy' | 'unhealthy', details?: any) {
  const logger = Logger.getInstance();
  logger.info(`Health check: ${component}`, LogCategory.SYSTEM, {
    component,
    status,
    ...details,
  });
}

// Audit logger for sensitive operations
export function logAuditEvent(
  action: string,
  userId: string,
  resource: string,
  details?: any
) {
  const logger = Logger.getInstance();
  logger.info(`Audit: ${action}`, LogCategory.SECURITY, {
    action,
    userId,
    resource,
    timestamp: new Date().toISOString(),
    ...details,
  });
}

export default Logger;

