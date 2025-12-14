import { NextRequest, NextResponse } from 'next/server';

export interface ApiError {
  success: false;
  error: string;
  code?: string;
  details?: any;
}

export interface ApiSuccess<T = any> {
  success: true;
  data: T;
}

export type ApiResponse<T = any> = ApiSuccess<T> | ApiError;

/**
 * Standardized error response helper
 */
export function createErrorResponse(
  error: string | Error,
  code?: string,
  status: number = 500,
  details?: any
): NextResponse<ApiError> {
  const errorMessage = error instanceof Error ? error.message : error;
  
  return NextResponse.json(
    {
      success: false,
      error: errorMessage,
      code: code || 'INTERNAL_ERROR',
      ...(details && { details }),
    },
    { status }
  );
}

/**
 * Standardized success response helper
 */
export function createSuccessResponse<T>(
  data: T,
  status: number = 200
): NextResponse<ApiSuccess<T>> {
  return NextResponse.json(
    {
      success: true,
      data,
    },
    { status }
  );
}

/**
 * Wrapper for API route handlers with automatic error handling
 */
export function withErrorHandling<T = any>(
  handler: (request: NextRequest, context?: any) => Promise<NextResponse<ApiResponse<T>>>
) {
  return async (request: NextRequest, context?: any): Promise<NextResponse<ApiResponse<T>>> => {
    try {
      return await handler(request, context);
    } catch (error) {
      console.error('[API Error]', {
        path: request.nextUrl.pathname,
        method: request.method,
        error: error instanceof Error ? error.message : String(error),
        stack: error instanceof Error ? error.stack : undefined,
      });

      // Handle known error types
      if (error instanceof Error) {
        // Database connection errors
        if (error.message.includes('MongoServerError') || error.message.includes('MongoNetworkError')) {
          return createErrorResponse(
            'Database connection error',
            'DATABASE_ERROR',
            503
          );
        }

        // Validation errors
        if (error.message.includes('validation') || error.message.includes('ValidationError')) {
          return createErrorResponse(
            error.message,
            'VALIDATION_ERROR',
            400
          );
        }

        // Authentication errors
        if (error.message.includes('Unauthorized') || error.message.includes('authentication')) {
          return createErrorResponse(
            'Authentication required',
            'UNAUTHORIZED',
            401
          );
        }

        // Forbidden errors
        if (error.message.includes('Forbidden') || error.message.includes('permission')) {
          return createErrorResponse(
            'Access forbidden',
            'FORBIDDEN',
            403
          );
        }

        // Not found errors
        if (error.message.includes('Not found') || error.message.includes('not found')) {
          return createErrorResponse(
            error.message,
            'NOT_FOUND',
            404
          );
        }
      }

      // Generic error fallback
      return createErrorResponse(
        error instanceof Error ? error.message : 'Internal server error',
        'INTERNAL_ERROR',
        500
      );
    }
  };
}

/**
 * Request validation helper
 */
export function validateRequest(
  request: NextRequest,
  requiredFields?: string[],
  body?: any
): { valid: boolean; error?: NextResponse<ApiError> } {
  // Check required fields in body
  if (requiredFields && body) {
    const missingFields = requiredFields.filter(field => !(field in body) || body[field] === undefined);
    if (missingFields.length > 0) {
      return {
        valid: false,
        error: createErrorResponse(
          `Missing required fields: ${missingFields.join(', ')}`,
          'VALIDATION_ERROR',
          400
        ),
      };
    }
  }

  return { valid: true };
}

/**
 * Authentication check helper
 */
export function requireAuth(request: NextRequest): {
  authenticated: boolean;
  user?: any;
  error?: NextResponse<ApiError>;
} {
  const token = request.cookies.get('auth-token')?.value;
  
  if (!token) {
    return {
      authenticated: false,
      error: createErrorResponse(
        'Authentication required',
        'UNAUTHORIZED',
        401
      ),
    };
  }

  // Token verification would happen here
  // For now, return authenticated
  return { authenticated: true };
}

