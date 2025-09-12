import { NextRequest, NextResponse } from 'next/server';
import { getToken } from 'next-auth/jwt';

export interface AuthenticatedRequest extends NextRequest {
  user?: {
    id: string;
    email: string;
    name: string;
    role: string;
    image?: string;
  };
}

export interface AuthMiddlewareOptions {
  requireAuth?: boolean;
  requiredRoles?: string[];
  allowPublic?: boolean;
}

/**
 * Authentication middleware for API routes
 */
export async function authMiddleware(
  request: NextRequest,
  options: AuthMiddlewareOptions = {}
): Promise<{ 
  success: boolean; 
  response?: NextResponse; 
  user?: any;
  error?: string;
}> {
  const {
    requireAuth = true,
    requiredRoles = [],
    allowPublic = false
  } = options;

  try {
    // Get JWT token
    const token = await getToken({ 
      req: request,
      secret: process.env.NEXTAUTH_SECRET 
    });

    // If authentication is not required and no token, allow public access
    if (!requireAuth && !token && allowPublic) {
      return { success: true, user: null };
    }

    // If authentication is required but no token
    if (requireAuth && !token) {
      return {
        success: false,
        response: NextResponse.json(
          { 
            success: false,
            error: 'Authentication required',
            message: 'Please login to access this resource'
          },
          { status: 401 }
        ),
        error: 'No authentication token found'
      };
    }

    // If token exists but user data is missing
    if (token && (!token.id || !token.email || !token.role)) {
      return {
        success: false,
        response: NextResponse.json(
          { 
            success: false,
            error: 'Invalid token',
            message: 'Authentication token is malformed'
          },
          { status: 401 }
        ),
        error: 'Malformed authentication token'
      };
    }

    // Check role-based access
    if (requiredRoles.length > 0 && token && !requiredRoles.includes(token.role as string)) {
      return {
        success: false,
        response: NextResponse.json(
          { 
            success: false,
            error: 'Insufficient permissions',
            message: `This resource requires one of the following roles: ${requiredRoles.join(', ')}`
          },
          { status: 403 }
        ),
        error: `User role '${token.role}' not in required roles: ${requiredRoles.join(', ')}`
      };
    }

    // Return success with user data
    return {
      success: true,
      user: token ? {
        id: token.id as string,
        email: token.email as string,
        name: token.name as string,
        role: token.role as string,
        image: token.picture as string
      } : null
    };

  } catch (error) {
    console.error('Auth middleware error:', error);
    return {
      success: false,
      response: NextResponse.json(
        { 
          success: false,
          error: 'Authentication failed',
          message: 'Internal server error during authentication'
        },
        { status: 500 }
      ),
      error: error instanceof Error ? error.message : 'Unknown authentication error'
    };
  }
}

/**
 * Higher-order function to wrap API route handlers with authentication
 */
export function withAuth(
  handler: (request: AuthenticatedRequest) => Promise<NextResponse>,
  options: AuthMiddlewareOptions = {}
) {
  return async (request: NextRequest): Promise<NextResponse> => {
    const authResult = await authMiddleware(request, options);
    
    if (!authResult.success) {
      return authResult.response!;
    }

    // Add user to request object
    (request as AuthenticatedRequest).user = authResult.user;
    
    return handler(request as AuthenticatedRequest);
  };
}

/**
 * Role-based access control helper
 */
export function requireRole(roles: string | string[]) {
  const roleArray = Array.isArray(roles) ? roles : [roles];
  return { requiredRoles: roleArray };
}

/**
 * Public access helper (no authentication required)
 */
export function allowPublic() {
  return { requireAuth: false, allowPublic: true };
}

/**
 * Admin-only access helper
 */
export function requireAdmin() {
  return { requiredRoles: ['admin'] };
}

/**
 * Vendor access helper
 */
export function requireVendor() {
  return { requiredRoles: ['vendor', 'admin'] };
}

/**
 * User access helper
 */
export function requireUser() {
  return { requiredRoles: ['user', 'vendor', 'wedding_planner', 'admin'] };
}

