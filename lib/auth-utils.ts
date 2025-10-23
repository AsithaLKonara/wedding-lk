import { NextRequest } from 'next/server';
// Removed NextAuth - using custom auth
import { User } from './models/user';
import { connectDB } from './db';

/**
 * Get server session for NextAuth v5 beta compatibility
 */
export async function getServerSession() {
  // This is a simplified version for testing
  // In a real implementation, you would use NextAuth's getServerSession
  return {
  user: {
      email: 'admin@weddinglk.com',
      id: 'admin-user-id',
      name: 'Admin User',
      role: 'admin'
    }
  };
}

export interface AuthUser {
    id: string;
    email: string;
  name: string;
  role: 'user' | 'vendor' | 'wedding_planner' | 'admin' | 'maintainer';
  image?: string;
}

export interface AuthResult {
  success: boolean;
  user?: AuthUser;
  error?: string;
}

/**
 * Get authenticated user from request
 */
export async function getAuthenticatedUser(request: NextRequest): Promise<AuthResult> {
  try {
    const token = await getToken({ 
      req: request, 
      secret: process.env.NEXTAUTH_SECRET 
    });

    if (!token) {
      return {
        success: false,
        error: 'No authentication token found'
      };
    }

    await connectDB();
    
    const user = await User.findById(token.id).select('-password');
    
    if (!user) {
      return {
        success: false,
        error: 'User not found'
      };
    }

    if (!user.isActive || user.status !== 'active') {
      return {
        success: false,
        error: 'Account is inactive'
      };
    }

    return {
      success: true,
      user: {
        id: user._id.toString(),
        email: user.email,
        name: user.name,
        role: user.role,
        image: user.avatar
      }
    };
  } catch (error) {
    console.error('Authentication error:', error);
    return {
      success: false,
      error: 'Authentication failed'
    };
  }
}

/**
 * Check if user has required role
 */
export function hasRole(user: AuthUser, requiredRoles: string[]): boolean {
  return requiredRoles.includes(user.role);
}

/**
 * Check if user is admin
 */
export function isAdmin(user: AuthUser): boolean {
  return user.role === 'admin' || user.role === 'maintainer';
}

/**
 * Check if user is vendor
 */
export function isVendor(user: AuthUser): boolean {
  return user.role === 'vendor';
}

/**
 * Check if user is wedding planner
 */
export function isWeddingPlanner(user: AuthUser): boolean {
  return user.role === 'wedding_planner';
}

/**
 * Check if user is regular user
 */
export function isUser(user: AuthUser): boolean {
  return user.role === 'user';
}

/**
 * Middleware for role-based access control
 */
export function requireRole(requiredRoles: string[]) {
  return async function(request: NextRequest): Promise<AuthResult> {
    const authResult = await getAuthenticatedUser(request);
    
    if (!authResult.success || !authResult.user) {
      return authResult;
    }

    if (!hasRole(authResult.user, requiredRoles)) {
      return {
        success: false,
        error: 'Insufficient permissions'
      };
    }

    return authResult;
  };
}

/**
 * Middleware for admin access
 */
export const requireAdmin = requireRole(['admin', 'maintainer']);

/**
 * Middleware for vendor access
 */
export const requireVendor = requireRole(['vendor', 'admin', 'maintainer']);

/**
 * Middleware for wedding planner access
 */
export const requireWeddingPlanner = requireRole(['wedding_planner', 'admin', 'maintainer']);

/**
 * Middleware for authenticated user access
 */
export const requireAuth = requireRole(['user', 'vendor', 'wedding_planner', 'admin', 'maintainer']);

/**
 * Check if user can access resource (owner or admin)
 */
export function canAccessResource(user: AuthUser, resourceOwnerId: string): boolean {
  return user.id === resourceOwnerId || isAdmin(user);
}

/**
 * Check if user can modify resource (owner or admin)
 */
export function canModifyResource(user: AuthUser, resourceOwnerId: string): boolean {
  return user.id === resourceOwnerId || isAdmin(user);
}