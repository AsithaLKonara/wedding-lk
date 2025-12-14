import { NextResponse } from 'next/server';
import { ZodError } from 'zod';

// Error types
export enum ErrorType {
  VALIDATION_ERROR = 'VALIDATION_ERROR',
  AUTHENTICATION_ERROR = 'AUTHENTICATION_ERROR',
  AUTHORIZATION_ERROR = 'AUTHORIZATION_ERROR',
  NOT_FOUND_ERROR = 'NOT_FOUND_ERROR',
  CONFLICT_ERROR = 'CONFLICT_ERROR',
  RATE_LIMIT_ERROR = 'RATE_LIMIT_ERROR',
  DATABASE_ERROR = 'DATABASE_ERROR',
  EXTERNAL_SERVICE_ERROR = 'EXTERNAL_SERVICE_ERROR',
  INTERNAL_SERVER_ERROR = 'INTERNAL_SERVER_ERROR',
  BAD_REQUEST_ERROR = 'BAD_REQUEST_ERROR'
}

// Custom error class
export class AppError extends Error {
  public readonly type: ErrorType;
  public readonly statusCode: number;
  public readonly isOperational: boolean;
  public readonly details?: any;

  constructor(
    message: string,
    type: ErrorType = ErrorType.INTERNAL_SERVER_ERROR,
    statusCode: number = 500,
    isOperational: boolean = true,
    details?: any
  ) {
    super(message);
    this.type = type;
    this.statusCode = statusCode;
    this.isOperational = isOperational;
    this.details = details;

    Error.captureStackTrace(this, this.constructor);
  }
}

// Error response interface
export interface ErrorResponse {
  success: false;
  error: string;
  type: ErrorType;
  statusCode: number;
  details?: any;
  timestamp: string;
  path?: string;
}

// Error handler class
export class ErrorHandler {
  private static instance: ErrorHandler;

  private constructor() {}

  public static getInstance(): ErrorHandler {
    if (!ErrorHandler.instance) {
      ErrorHandler.instance = new ErrorHandler();
    }
    return ErrorHandler.instance;
  }

  // Handle different types of errors
  public handleError(error: any, path?: string): NextResponse<ErrorResponse> {
    console.error('Error occurred:', {
      message: error.message,
      type: error.type || 'UNKNOWN',
      stack: error.stack,
      path
    });

    // Handle custom AppError
    if (error instanceof AppError) {
      return this.createErrorResponse(
        error.message,
        error.type,
        error.statusCode,
        error.details,
        path
      );
    }

    // Handle Zod validation errors
    if (error instanceof ZodError) {
      return this.handleValidationError(error, path);
    }

    // Handle MongoDB errors
    if (error.name === 'MongoError' || error.name === 'MongoServerError') {
      return this.handleMongoError(error, path);
    }

    // Handle Mongoose errors
    if (error.name === 'ValidationError') {
      return this.handleMongooseValidationError(error, path);
    }

    // Handle CastError (invalid ObjectId)
    if (error.name === 'CastError') {
      return this.handleCastError(error, path);
    }

    // Handle duplicate key error
    if (error.code === 11000) {
      return this.handleDuplicateKeyError(error, path);
    }

    // Handle JWT errors
    if (error.name === 'JsonWebTokenError') {
      return this.createErrorResponse(
        'Invalid token',
        ErrorType.AUTHENTICATION_ERROR,
        401,
        undefined,
        path
      );
    }

    if (error.name === 'TokenExpiredError') {
      return this.createErrorResponse(
        'Token expired',
        ErrorType.AUTHENTICATION_ERROR,
        401,
        undefined,
        path
      );
    }

    // Handle rate limiting errors
    if (error.status === 429) {
      return this.createErrorResponse(
        'Too many requests',
        ErrorType.RATE_LIMIT_ERROR,
        429,
        undefined,
        path
      );
    }

    // Handle default internal server error
    return this.createErrorResponse(
      process.env.NODE_ENV === 'production' 
        ? 'Internal server error' 
        : error.message || 'Something went wrong',
      ErrorType.INTERNAL_SERVER_ERROR,
      500,
      process.env.NODE_ENV === 'development' ? error.stack : undefined,
      path
    );
  }

  // Handle validation errors
  private handleValidationError(error: ZodError, path?: string): NextResponse<ErrorResponse> {
    const errorMessages = error.errors.map(err => ({
      field: err.path.join('.'),
      message: err.message,
      code: err.code
    }));

    return this.createErrorResponse(
      'Validation failed',
      ErrorType.VALIDATION_ERROR,
      400,
      { validationErrors: errorMessages },
      path
    );
  }

  // Handle MongoDB errors
  private handleMongoError(error: any, path?: string): NextResponse<ErrorResponse> {
    let message = 'Database error occurred';
    let statusCode = 500;

    switch (error.code) {
      case 11000:
        return this.handleDuplicateKeyError(error, path);
      case 11001:
        message = 'Duplicate key error';
        statusCode = 409;
        break;
      case 11002:
        message = 'Duplicate key error';
        statusCode = 409;
        break;
      default:
        message = 'Database operation failed';
    }

    return this.createErrorResponse(
      message,
      ErrorType.DATABASE_ERROR,
      statusCode,
      process.env.NODE_ENV === 'development' ? error : undefined,
      path
    );
  }

  // Handle Mongoose validation errors
  private handleMongooseValidationError(error: any, path?: string): NextResponse<ErrorResponse> {
    const validationErrors = Object.values(error.errors).map((err: any) => ({
      field: err.path,
      message: err.message,
      value: err.value
    }));

    return this.createErrorResponse(
      'Validation failed',
      ErrorType.VALIDATION_ERROR,
      400,
      { validationErrors },
      path
    );
  }

  // Handle cast errors (invalid ObjectId)
  private handleCastError(error: any, path?: string): NextResponse<ErrorResponse> {
    return this.createErrorResponse(
      'Invalid ID format',
      ErrorType.BAD_REQUEST_ERROR,
      400,
      { field: error.path, value: error.value },
      path
    );
  }

  // Handle duplicate key errors
  private handleDuplicateKeyError(error: any, path?: string): NextResponse<ErrorResponse> {
    const field = Object.keys(error.keyPattern || {})[0];
    const value = error.keyValue?.[field];

    return this.createErrorResponse(
      `${field} already exists`,
      ErrorType.CONFLICT_ERROR,
      409,
      { field, value },
      path
    );
  }

  // Create error response
  private createErrorResponse(
    message: string,
    type: ErrorType,
    statusCode: number,
    details?: any,
    path?: string
  ): NextResponse<ErrorResponse> {
    const errorResponse: ErrorResponse = {
      success: false,
      error: message,
      type,
      statusCode,
      details,
      timestamp: new Date().toISOString(),
      path
    };

    return NextResponse.json(errorResponse, { status: statusCode });
  }
}

// Convenience functions for common errors
export function createValidationError(message: string, details?: any): AppError {
  return new AppError(message, ErrorType.VALIDATION_ERROR, 400, true, details);
}

export function createAuthenticationError(message: string = 'Authentication required'): AppError {
  return new AppError(message, ErrorType.AUTHENTICATION_ERROR, 401, true);
}

export function createAuthorizationError(message: string = 'Insufficient permissions'): AppError {
  return new AppError(message, ErrorType.AUTHORIZATION_ERROR, 403, true);
}

export function createNotFoundError(resource: string = 'Resource'): AppError {
  return new AppError(`${resource} not found`, ErrorType.NOT_FOUND_ERROR, 404, true);
}

export function createConflictError(message: string, details?: any): AppError {
  return new AppError(message, ErrorType.CONFLICT_ERROR, 409, true, details);
}

export function createBadRequestError(message: string, details?: any): AppError {
  return new AppError(message, ErrorType.BAD_REQUEST_ERROR, 400, true, details);
}

export function createDatabaseError(message: string = 'Database operation failed', details?: any): AppError {
  return new AppError(message, ErrorType.DATABASE_ERROR, 500, true, details);
}

export function createExternalServiceError(service: string, details?: any): AppError {
  return new AppError(
    `External service error: ${service}`,
    ErrorType.EXTERNAL_SERVICE_ERROR,
    502,
    true,
    details
  );
}

// Global error handler
export function handleApiError(error: any, path?: string): NextResponse<ErrorResponse> {
  const errorHandler = ErrorHandler.getInstance();
  return errorHandler.handleError(error, path);
}

// Async error wrapper for API routes
export function withErrorHandling<T extends any[], R>(
  handler: (...args: T) => Promise<NextResponse<R>>,
  path?: string
) {
  return async (...args: T): Promise<NextResponse<R | ErrorResponse>> => {
    try {
      return await handler(...args);
    } catch (error) {
      return handleApiError(error, path);
    }
  };
}

// Error logging utility
export function logError(error: any, context?: string): void {
  const errorInfo = {
    message: error.message,
    type: error.type || 'UNKNOWN',
    stack: error.stack,
    context,
    timestamp: new Date().toISOString()
  };

  console.error('Error logged:', errorInfo);

  // In production, you might want to send this to a logging service
  if (process.env.NODE_ENV === 'production') {
    // Example: Send to external logging service
    // logToExternalService(errorInfo);
  }
}

// Success response helper
export function createSuccessResponse<T>(data: T, message?: string, statusCode: number = 200): NextResponse {
  return NextResponse.json({
    success: true,
    data,
    message,
    timestamp: new Date().toISOString()
  }, { status: statusCode });
}

// Pagination response helper
export function createPaginatedResponse<T>(
  data: T[],
  pagination: {
    page: number;
    limit: number;
    total: number;
    totalPages: number;
  },
  message?: string
): NextResponse {
  return NextResponse.json({
    success: true,
    data,
    pagination,
    message,
    timestamp: new Date().toISOString()
  });
}

