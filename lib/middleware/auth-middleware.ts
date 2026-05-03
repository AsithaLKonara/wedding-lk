import { NextRequest, NextResponse } from 'next/server';
import { getUserFromRequest } from '@/lib/auth/get-user-from-request';

export interface AuthUser {
  id: string;
  email: string;
  name: string;
  role: string;
  image?: string;
}

export interface AuthRequest extends NextRequest {
  user?: AuthUser;
}

export function withAuth(handler: (req: AuthRequest) => Promise<NextResponse>) {
  return async (req: NextRequest): Promise<NextResponse> => {
    let user: AuthUser | null = null;

    // First, resolve the authenticated user from the request.
    try {
      user = await getUserFromRequest(req);
    } catch (error) {
      console.error('Auth middleware error:', error);
      return NextResponse.json(
        { error: 'Authentication failed' },
        { status: 500 },
      );
    }
      
      if (!user) {
        return NextResponse.json(
          { error: 'Authentication required' },
        { status: 401 },
        );
      }

      // Add user to request object
      const authReq = req as AuthRequest;
      authReq.user = {
        id: user.id,
        email: user.email,
        name: user.name,
        role: user.role,
        image: (user as any).image || undefined,
      };

    // Ensure handler errors are surfaced as a 500 JSON response instead of
    // bubbling up as unhandled rejections.
    try {
      return await handler(authReq);
    } catch (error) {
      console.error('Handler error in withAuth:', error);
      const message =
        error instanceof Error ? error.message : 'Internal server error';
      return NextResponse.json(
        { error: message },
        { status: 500 },
      );
    }
  };
}

export function withRole(roles: string[]) {
  return function(handler: (req: AuthRequest) => Promise<NextResponse>) {
    return withAuth(async (req: AuthRequest) => {
      if (!req.user) {
        return NextResponse.json(
          { error: 'Authentication required' },
          { status: 401 }
        );
      }

      if (!roles.includes(req.user.role)) {
        return NextResponse.json(
          { error: 'Insufficient permissions' },
          { status: 403 }
        );
      }

      return handler(req);
    });
  };
}

export function withAdmin(handler: (req: AuthRequest) => Promise<NextResponse>) {
  return withRole(['admin', 'maintainer'])(handler);
}

export function withVendor(handler: (req: AuthRequest) => Promise<NextResponse>) {
  return withRole(['vendor', 'admin', 'maintainer'])(handler);
}

export function withWeddingPlanner(handler: (req: AuthRequest) => Promise<NextResponse>) {
  return withRole(['wedding_planner', 'admin', 'maintainer'])(handler);
}

export function withVerifiedEmail(handler: (req: AuthRequest) => Promise<NextResponse>) {
  return withAuth(async (req: AuthRequest) => {
    if (!req.user) {
      return NextResponse.json(
        { error: 'Authentication required' },
        { status: 401 }
      );
    }

    // Check if user has verified email
    // This would typically require a database query
    // For now, we'll assume all authenticated users have verified emails
    // In a real implementation, you'd check the user's isEmailVerified status

    return handler(req);
  });
}

// Legacy exports for backward compatibility
export const requireUser = withAuth;
export const requireAdmin = withAdmin;

export function withActiveAccount(handler: (req: AuthRequest) => Promise<NextResponse>) {
  return withAuth(async (req: AuthRequest) => {
    if (!req.user) {
      return NextResponse.json(
        { error: 'Authentication required' },
        { status: 401 }
      );
    }

    // Check if user account is active
    // This would typically require a database query
    // For now, we'll assume all authenticated users have active accounts
    // In a real implementation, you'd check the user's status and isActive fields

    return handler(req);
  });
}

// Utility function to check if user has specific role
export function hasRole(user: AuthUser, role: string): boolean {
  return user.role === role;
}

// Utility function to check if user has any of the specified roles
export function hasAnyRole(user: AuthUser, roles: string[]): boolean {
  return roles.includes(user.role);
}

// Utility function to check if user is admin
export function isAdmin(user: AuthUser): boolean {
  return ['admin', 'maintainer'].includes(user.role);
}

// Utility function to check if user is vendor
export function isVendor(user: AuthUser): boolean {
  return ['vendor', 'admin', 'maintainer'].includes(user.role);
}

// Utility function to check if user is wedding planner
export function isWeddingPlanner(user: AuthUser): boolean {
  return ['wedding_planner', 'admin', 'maintainer'].includes(user.role);
}