import { NextRequest, NextResponse } from 'next/server';

export interface AppError extends Error {
  statusCode?: number;
  isOperational?: boolean;
  code?: string;
  keyValue?: any;
  errors?: any;
}

export class CustomError extends Error implements AppError {
  public statusCode: number;
  public isOperational: boolean;
  public code?: string;

  constructor(message: string, statusCode: number = 500, isOperational: boolean = true) {
    super(message);
    this.statusCode = statusCode;
    this.isOperational = isOperational;
    
    Error.captureStackTrace(this, this.constructor);
  }
}

export class ValidationError extends CustomError {
  constructor(message: string, field?: string) {
    super(field ? `${field}: ${message}` : message, 400);
    this.name = 'ValidationError';
  }
}

export class AuthenticationError extends CustomError {
  constructor(message: string = 'Authentication failed') {
    super(message, 401);
    this.name = 'AuthenticationError';
  }
}

export class AuthorizationError extends CustomError {
  constructor(message: string = 'Access denied') {
    super(message, 403);
    this.name = 'AuthorizationError';
  }
}

export class NotFoundError extends CustomError {
  constructor(resource: string = 'Resource') {
    super(`${resource} not found`, 404);
    this.name = 'NotFoundError';
  }
}

export class ConflictError extends CustomError {
  constructor(message: string) {
    super(message, 409);
    this.name = 'ConflictError';
  }
}

export class RateLimitError extends CustomError {
  constructor(message: string = 'Too many requests') {
    super(message, 429);
    this.name = 'RateLimitError';
  }
}

export class DatabaseError extends CustomError {
  constructor(message: string = 'Database operation failed') {
    super(message, 500);
    this.name = 'DatabaseError';
  }
}

// Error handler middleware
export function handleError(error: AppError, req?: NextRequest): NextResponse {
  console.error('🚨 Error Handler:', {
    name: error.name,
    message: error.message,
    statusCode: error.statusCode,
    stack: error.stack,
    timestamp: new Date().toISOString(),
    url: req?.url,
    method: req?.method,
  });

  // Default error response
  let statusCode = error.statusCode || 500;
  let message = error.message || 'Internal server error';
  let code = error.code;

  // Handle specific error types
  if (error.name === 'ValidationError') {
    statusCode = 400;
    message = 'Validation failed';
  } else if (error.name === 'CastError') {
    statusCode = 400;
    message = 'Invalid data format';
  } else if (error.name === 'MongoError' && (error as any).code === 11000) {
    statusCode = 409;
    message = 'Duplicate entry';
    code = 'DUPLICATE_KEY';
  } else if (error.name === 'JsonWebTokenError') {
    statusCode = 401;
    message = 'Invalid token';
  } else if (error.name === 'TokenExpiredError') {
    statusCode = 401;
    message = 'Token expired';
  } else if (error.name === 'MulterError') {
    statusCode = 400;
    message = 'File upload error';
  }

  // Don't expose internal errors in production
  if (process.env.NODE_ENV === 'production' && statusCode === 500) {
    message = 'Something went wrong';
  }

  const errorResponse = {
    success: false,
    error: {
      message,
      code,
      statusCode,
      timestamp: new Date().toISOString(),
      ...(process.env.NODE_ENV === 'development' && {
        stack: error.stack,
        details: error,
      }),
    },
  };

  return NextResponse.json(errorResponse, { status: statusCode });
}

// Async error wrapper
export function asyncHandler(fn: Function) {
  return (req: NextRequest, ...args: any[]) => {
    return Promise.resolve(fn(req, ...args)).catch((error) => {
      return handleError(error, req);
    });
  };
}

// Database error handler
export function handleDatabaseError(error: any): AppError {
  console.error('🗄️ Database Error:', error);

  if (error.name === 'ValidationError') {
    const messages = Object.values(error.errors).map((err: any) => err.message);
    return new ValidationError(messages.join(', '));
  }

  if (error.name === 'CastError') {
    return new ValidationError(`Invalid ${error.path}: ${error.value}`);
  }

  if (error.code === 11000) {
    const field = Object.keys(error.keyValue)[0];
    return new ConflictError(`${field} already exists`);
  }

  if (error.name === 'MongoNetworkError') {
    return new DatabaseError('Database connection failed');
  }

  if (error.name === 'MongoTimeoutError') {
    return new DatabaseError('Database operation timeout');
  }

  return new DatabaseError(error.message);
}

// Validation error handler
export function handleValidationError(error: any): AppError {
  if (error.details) {
    const messages = error.details.map((detail: any) => detail.message);
    return new ValidationError(messages.join(', '));
  }
  return new ValidationError(error.message);
}

// Rate limiting error handler
export function handleRateLimitError(limit: number, windowMs: number): AppError {
  const message = `Rate limit exceeded. Maximum ${limit} requests per ${windowMs / 1000} seconds`;
  return new RateLimitError(message);
}

// Logging utility
export function logError(error: AppError, context?: any) {
  const logData = {
    timestamp: new Date().toISOString(),
    level: 'error',
    name: error.name,
    message: error.message,
    statusCode: error.statusCode,
    stack: error.stack,
    context,
  };

  // In production, you might want to send this to a logging service
  if (process.env.NODE_ENV === 'production') {
    // Send to external logging service (e.g., Sentry, LogRocket, etc.)
    console.error('Production Error Log:', JSON.stringify(logData));
  } else {
    console.error('Development Error Log:', logData);
  }
}

// Success response helper
export function successResponse(data: any, message: string = 'Success', statusCode: number = 200) {
  return NextResponse.json({
    success: true,
    message,
    data,
    timestamp: new Date().toISOString(),
  }, { status: statusCode });
}

// Pagination helper
export function paginateResponse(data: any[], page: number, limit: number, total: number) {
  const totalPages = Math.ceil(total / limit);
  
  return {
    data,
    pagination: {
      currentPage: page,
      totalPages,
      totalItems: total,
      itemsPerPage: limit,
      hasNextPage: page < totalPages,
      hasPrevPage: page > 1,
    },
  };
}