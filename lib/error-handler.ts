// Comprehensive Error Handling System for WeddingLK
// Provides consistent error responses, logging, and error recovery

export interface ErrorResponse {
  success: false;
  error: {
    code: string;
    message: string;
    details?: any;
    timestamp: string;
    requestId?: string;
  };
}

export interface SuccessResponse<T = any> {
  success: true;
  data: T;
  timestamp: string;
  requestId?: string;
}

export class AppError extends Error {
  public readonly statusCode: number;
  public readonly code: string;
  public readonly isOperational: boolean;
  public readonly details?: any;

  constructor(
    message: string,
    statusCode: number = 500,
    code: string = 'INTERNAL_ERROR',
    details?: any,
    isOperational: boolean = true
  ) {
    super(message);
    this.statusCode = statusCode;
    this.code = code;
    this.details = details;
    this.isOperational = isOperational;

    // Maintains proper stack trace for where our error was thrown (only available on V8)
    if (Error.captureStackTrace) {
      Error.captureStackTrace(this, AppError);
    }
  }
}

export class ValidationError extends AppError {
  constructor(message: string, details?: any) {
    super(message, 400, 'VALIDATION_ERROR', details);
  }
}

export class AuthenticationError extends AppError {
  constructor(message: string = 'Authentication required', details?: any) {
    super(message, 401, 'AUTHENTICATION_ERROR', details);
  }
}

export class AuthorizationError extends AppError {
  constructor(message: string = 'Insufficient permissions', details?: any) {
    super(message, 403, 'AUTHORIZATION_ERROR', details);
  }
}

export class NotFoundError extends AppError {
  constructor(resource: string, details?: any) {
    super(`${resource} not found`, 404, 'NOT_FOUND_ERROR', details);
  }
}

export class ConflictError extends AppError {
  constructor(message: string, details?: any) {
    super(message, 409, 'CONFLICT_ERROR', details);
  }
}

export class RateLimitError extends AppError {
  constructor(message: string = 'Too many requests', details?: any) {
    super(message, 429, 'RATE_LIMIT_ERROR', details);
  }
}

export class DatabaseError extends AppError {
  constructor(message: string, details?: any) {
    super(message, 500, 'DATABASE_ERROR', details);
  }
}

export class ExternalServiceError extends AppError {
  constructor(service: string, message: string, details?: any) {
    super(`External service error: ${message}`, 502, 'EXTERNAL_SERVICE_ERROR', { service, ...details });
  }
}

// Error handler for API routes
export function handleApiError(error: any): ErrorResponse {
  const requestId = generateRequestId();
  const timestamp = new Date().toISOString();

  // Log the error
  console.error(`[${timestamp}] [${requestId}] API Error:`, {
    message: error.message,
    stack: error.stack,
    code: error.code || 'UNKNOWN_ERROR',
    statusCode: error.statusCode || 500,
    details: error.details,
    url: error.url,
    method: error.method,
  });

  // Handle known error types
  if (error instanceof AppError) {
    return {
      success: false,
      error: {
        code: error.code,
        message: error.message,
        details: error.details,
        timestamp,
        requestId,
      },
    };
  }

  // Handle Mongoose validation errors
  if (error.name === 'ValidationError') {
    const validationErrors = Object.values(error.errors).map((err: any) => ({
      field: err.path,
      message: err.message,
      value: err.value,
    }));

    return {
      success: false,
      error: {
        code: 'VALIDATION_ERROR',
        message: 'Validation failed',
        details: { fields: validationErrors },
        timestamp,
        requestId,
      },
    };
  }

  // Handle MongoDB duplicate key errors
  if (error.code === 11000) {
    const field = Object.keys(error.keyPattern)[0];
    return {
      success: false,
      error: {
        code: 'DUPLICATE_KEY_ERROR',
        message: `${field} already exists`,
        details: { field, value: error.keyValue[field] },
        timestamp,
        requestId,
      },
    };
  }

  // Handle MongoDB connection errors
  if (error.name === 'MongoServerError' || error.name === 'MongooseError') {
    return {
      success: false,
      error: {
        code: 'DATABASE_ERROR',
        message: 'Database operation failed',
        details: { originalError: error.message },
        timestamp,
        requestId,
      },
    };
  }

  // Handle JWT errors
  if (error.name === 'JsonWebTokenError') {
    return {
      success: false,
      error: {
        code: 'INVALID_TOKEN',
        message: 'Invalid authentication token',
        timestamp,
        requestId,
      },
    };
  }

  // Handle JWT expiration
  if (error.name === 'TokenExpiredError') {
    return {
      success: false,
      error: {
        code: 'TOKEN_EXPIRED',
        message: 'Authentication token expired',
        timestamp,
        requestId,
      },
    };
  }

  // Generic error fallback
  return {
    success: false,
    error: {
      code: 'INTERNAL_ERROR',
      message: process.env.NODE_ENV === 'production' 
        ? 'An internal error occurred' 
        : error.message,
      details: process.env.NODE_ENV === 'development' ? error.stack : undefined,
      timestamp,
      requestId,
    },
  };
}

// Success response helper
export function createSuccessResponse<T>(data: T): SuccessResponse<T> {
  return {
    success: true,
    data,
    timestamp: new Date().toISOString(),
    requestId: generateRequestId(),
  };
}

// Request ID generator
function generateRequestId(): string {
  return `req_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
}

// Error recovery utilities
export class ErrorRecovery {
  // Retry mechanism with exponential backoff
  static async retry<T>(
    operation: () => Promise<T>,
    maxRetries: number = 3,
    baseDelay: number = 1000
  ): Promise<T> {
    let lastError: Error;
    
    for (let attempt = 1; attempt <= maxRetries; attempt++) {
      try {
        return await operation();
      } catch (error) {
        lastError = error as Error;
        
        if (attempt === maxRetries) {
          throw lastError;
        }
        
        const delay = baseDelay * Math.pow(2, attempt - 1);
        console.warn(`Attempt ${attempt} failed, retrying in ${delay}ms:`, error);
        
        await new Promise(resolve => setTimeout(resolve, delay));
      }
    }
    
    throw lastError!;
  }

  // Circuit breaker pattern
  static createCircuitBreaker(
    failureThreshold: number = 5,
    resetTimeout: number = 60000
  ) {
    let failureCount = 0;
    let lastFailureTime = 0;
    let state: 'CLOSED' | 'OPEN' | 'HALF_OPEN' = 'CLOSED';

    return {
      async execute<T>(operation: () => Promise<T>): Promise<T> {
        if (state === 'OPEN') {
          if (Date.now() - lastFailureTime > resetTimeout) {
            state = 'HALF_OPEN';
          } else {
            throw new AppError('Circuit breaker is open', 503, 'CIRCUIT_BREAKER_OPEN');
          }
        }

        try {
          const result = await operation();
          if (state === 'HALF_OPEN') {
            state = 'CLOSED';
            failureCount = 0;
          }
          return result;
        } catch (error) {
          failureCount++;
          lastFailureTime = Date.now();
          
          if (failureCount >= failureThreshold) {
            state = 'OPEN';
          }
          
          throw error;
        }
      },
      
      getState() {
        return state;
      },
      
      getStats() {
        return { failureCount, lastFailureTime, state };
      }
    };
  }
}

// Global error handler for unhandled rejections
export function setupGlobalErrorHandlers() {
  process.on('unhandledRejection', (reason, promise) => {
    console.error('Unhandled Rejection at:', promise, 'reason:', reason);
  });

  process.on('uncaughtException', (error) => {
    console.error('Uncaught Exception:', error);
    process.exit(1);
  });
}

// Database connection error handler
export function handleDatabaseError(error: any): never {
  console.error('Database connection error:', error);
  
  if (error.name === 'MongoServerError' && error.code === 18) {
    throw new DatabaseError('Authentication failed. Please check database credentials.');
  }
  
  if (error.name === 'MongoNetworkError') {
    throw new DatabaseError('Database connection failed. Please check if MongoDB is running.');
  }
  
  throw new DatabaseError('Database operation failed', { originalError: error.message });
} 