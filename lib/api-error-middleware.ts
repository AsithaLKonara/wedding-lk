// API Error Handling Middleware for WeddingLK
// Provides consistent error responses and logging for all API routes

import { NextRequest, NextResponse } from 'next/server';
import { handleError, AppError, ValidationError, AuthenticationError, AuthorizationError, NotFoundError, ConflictError, RateLimitError, DatabaseError } from './error-handler';

export interface ApiResponse<T = any> {
  success: boolean;
  data?: T;
  error?: {
    code: string;
    message: string;
    details?: any;
    timestamp: string;
    requestId: string;
  };
  timestamp: string;
  requestId: string;
}

// Rate limiting configuration
const rateLimitConfig = {
  windowMs: 15 * 60 * 1000, // 15 minutes
  maxRequests: 100, // limit each IP to 100 requests per windowMs
  skipSuccessfulRequests: false,
  skipFailedRequests: false,
};

// In-memory store for rate limiting (use Redis in production)
const requestCounts = new Map<string, { count: number; resetTime: number }>();

// Rate limiting middleware
export function rateLimitMiddleware(request: NextRequest): NextResponse | null {
  const ip = request.headers.get('x-forwarded-for') || 
             request.headers.get('x-real-ip') || 
             'unknown';
  const now = Date.now();
  
  const requestData = requestCounts.get(ip);
  
  if (!requestData || now > requestData.resetTime) {
    // Reset counter for new window
    requestCounts.set(ip, {
      count: 1,
      resetTime: now + rateLimitConfig.windowMs,
    });
    return null;
  }
  
  if (requestData.count >= rateLimitConfig.maxRequests) {
    return NextResponse.json(
      {
        success: false,
        error: {
          code: 'RATE_LIMIT_EXCEEDED',
          message: 'Too many requests. Please try again later.',
          timestamp: new Date().toISOString(),
          requestId: generateRequestId(),
        },
      },
      { status: 429 }
    );
  }
  
  requestData.count++;
  return null;
}

// Request ID generator
function generateRequestId(): string {
  return `req_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
}

// Main API error handler wrapper
export function withErrorHandling<T = any>(
  handler: (request: NextRequest) => Promise<NextResponse<T>>
) {
  return async (request: NextRequest): Promise<NextResponse> => {
    const requestId = generateRequestId();
    const startTime = Date.now();
    
    try {
      // Add request ID to headers for tracking
      request.headers.set('x-request-id', requestId);
      
      // Apply rate limiting
      const rateLimitResponse = rateLimitMiddleware(request);
      if (rateLimitResponse) {
        return rateLimitResponse;
      }
      
      // Execute the handler
      const response = await handler(request);
      
      // Add performance headers
      const duration = Date.now() - startTime;
      response.headers.set('x-response-time', `${duration}ms`);
      response.headers.set('x-request-id', requestId);
      
      return response;
      
    } catch (error: any) {
      // Handle the error
      const errorResponse = handleError(error);
      
      // Log error with request details
      console.error('API Error:', {
        requestId,
        method: request.method,
        url: request.url,
        ip: request.headers.get('x-forwarded-for') || request.headers.get('x-real-ip') || 'unknown',
        error: error.message || 'Unknown error',
        stack: error.stack,
        timestamp: new Date().toISOString(),
      });
      
      // Return error response
      return NextResponse.json(errorResponse, {
        status: error.statusCode || 500,
        headers: {
          'x-request-id': requestId,
          'x-response-time': `${Date.now() - startTime}ms`,
        },
      });
    }
  };
}

// Validation middleware
export function validateRequest<T>(
  schema: any,
  handler: (request: NextRequest, validatedData: T) => Promise<NextResponse>
) {
  return withErrorHandling(async (request: NextRequest) => {
    let body;
    
    try {
      if (request.method !== 'GET') {
        body = await request.json();
      }
    } catch {
      throw new ValidationError('Invalid JSON in request body');
    }
    
    // Validate request data
    const validationResult = schema.safeParse(body);
    if (!validationResult.success) {
      throw new ValidationError('Request validation failed');
    }
    
    return handler(request, validationResult.data);
  });
}

// Authentication middleware
export function requireAuth(
  handler: (request: NextRequest, userId: string) => Promise<NextResponse>
) {
  return withErrorHandling(async (request: NextRequest) => {
    const authHeader = request.headers.get('authorization');
    
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      throw new AuthenticationError('Missing or invalid authorization header');
    }
    
    const token = authHeader.substring(7);
    
    try {
      // Verify JWT token (implement your JWT verification logic here)
      const userId = await verifyJWT(token);
      return handler(request, userId);
    } catch (error) {
      throw new AuthenticationError('Invalid or expired token');
    }
  });
}

// Role-based authorization middleware
export function requireRole(
  requiredRole: string,
  handler: (request: NextRequest, userId: string) => Promise<NextResponse>
) {
  return requireAuth(async (request: NextRequest, userId: string) => {
    // Check user role (implement your role checking logic here)
    const userRole = await getUserRole(userId);
    
    if (userRole !== requiredRole) {
      throw new AuthorizationError(`Insufficient permissions. Required role: ${requiredRole}`);
    }
    
    return handler(request, userId);
  });
}

// Database operation wrapper with error handling
export function withDatabaseOperation<T>(
  operation: () => Promise<T>
): Promise<T> {
  return new Promise((resolve, reject) => {
    operation()
      .then(resolve)
      .catch((error: any) => {
        if (error.name === 'MongoServerError' || error.name === 'MongooseError') {
          reject(new DatabaseError('Database operation failed'));
        } else {
          reject(error);
        }
      });
  });
}

// External service call wrapper with error handling
export function withExternalService<T>(
  serviceName: string,
  operation: () => Promise<T>
): Promise<T> {
  return new Promise((resolve, reject) => {
    operation()
      .then(resolve)
      .catch((error: any) => {
        reject(new DatabaseError(`External service ${serviceName} failed: ${error.message}`));
      });
  });
}

// JWT verification and role checking functions
async function verifyJWT(token: string): Promise<string> {
  try {
    const { verify } = await import('jsonwebtoken');
    const secret = process.env.JWT_SECRET || process.env.NEXTAUTH_SECRET;
    
    if (!secret) {
      throw new Error('JWT secret not configured');
    }
    
    const decoded = verify(token, secret) as any;
    return decoded.userId || decoded.sub;
  } catch (error) {
    throw new Error('Invalid JWT token');
  }
}

async function getUserRole(userId: string): Promise<string> {
  try {
    const { connectDB } = await import('./db');
    const { User } = await import('./models');
    
    await connectDB();
    const user = await User.findById(userId).select('role');
    
    if (!user) {
      throw new Error('User not found');
    }
    
    return user.role || 'user';
  } catch (error) {
    console.error('Error getting user role:', error);
    return 'user'; // Default role
  }
}

// Utility function to create success responses
export function createApiResponse<T>(
  data: T,
  status: number = 200
): NextResponse<ApiResponse<T>> {
  const response: ApiResponse<T> = {
    success: true,
    data,
    timestamp: new Date().toISOString(),
    requestId: generateRequestId(),
  };
  
  return NextResponse.json(response, { status });
}

// Utility function to create error responses
export function createErrorResponse(
  error: AppError,
  requestId?: string
): NextResponse<ApiResponse<never>> {
  const response: ApiResponse<never> = {
    success: false,
    error: {
      code: (error as any).code || 'UNKNOWN_ERROR',
      message: error.message,
      details: (error as any).details || undefined,
      timestamp: new Date().toISOString(),
      requestId: requestId || generateRequestId(),
    },
    timestamp: new Date().toISOString(),
    requestId: requestId || generateRequestId(),
  };
  
  return NextResponse.json(response, { status: error.statusCode });
} 