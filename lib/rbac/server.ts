import { NextRequest, NextResponse } from 'next/server'
import { verifyToken } from '@/lib/auth/tokens'
import { AuthUser, UserRole, Permission, RBACManager } from './index'

export { type AuthUser, type UserRole, type Permission, RBACManager }

export interface AuthResult {
  success: boolean
  user?: AuthUser
  error?: string
}

/**
 * 🔐 AUTHENTICATION HELPERS
 */
export class AuthHelpers {
  /**
   * Get authenticated user from request
   */
  static async getAuthenticatedUser(request: NextRequest): Promise<AuthResult> {
    try {
      // Custom auth implementation
      const token = request.cookies.get('auth-token')?.value
      
      if (!token) {
        return {
          success: false,
          error: 'No authentication token found'
        }
      }

      // Verify token using custom auth
      const user = await verifyToken(token)
      
      if (!user) {
        return {
          success: false,
          error: 'Invalid authentication token'
        }
      }

      return {
        success: true,
        user: user as AuthUser
      }
    } catch (error) {
      console.error('Authentication error:', error)
      return {
        success: false,
        error: 'Authentication failed'
      }
    }
  }

  /**
   * Check if user is admin
   */
  static isAdmin(user: AuthUser): boolean {
    return user.role === 'admin' || user.role === 'maintainer'
  }

  /**
   * Check if user is vendor
   */
  static isVendor(user: AuthUser): boolean {
    return user.role === 'vendor'
  }

  /**
   * Check if user is wedding planner
   */
  static isWeddingPlanner(user: AuthUser): boolean {
    return user.role === 'wedding_planner'
  }

  /**
   * Check if user is regular user
   */
  static isUser(user: AuthUser): boolean {
    return user.role === 'user'
  }
}

/**
 * 🛡️ MIDDLEWARE HELPERS
 */
export class MiddlewareHelpers {
  /**
   * Require authentication middleware
   */
  static requireAuth(handler: (request: NextRequest, user: AuthUser) => Promise<NextResponse>) {
    return async (request: NextRequest): Promise<NextResponse> => {
      const authResult = await AuthHelpers.getAuthenticatedUser(request)
      
      if (!authResult.success || !authResult.user) {
        return NextResponse.json(
          { error: 'Authentication required' },
          { status: 401 }
        )
      }

      return handler(request, authResult.user)
    }
  }

  /**
   * Require specific role middleware
   */
  static requireRole(roles: UserRole[]) {
    return (handler: (request: NextRequest, user: AuthUser) => Promise<NextResponse>) => {
      return MiddlewareHelpers.requireAuth(async (request: NextRequest, user: AuthUser) => {
        if (!RBACManager.hasRole(user, roles)) {
          return NextResponse.json(
            { error: 'Insufficient permissions' },
            { status: 403 }
          )
        }

        return handler(request, user)
      })
    }
  }

  /**
   * Require specific permission middleware
   */
  static requirePermission(permissions: Permission[]) {
    return (handler: (request: NextRequest, user: AuthUser) => Promise<NextResponse>) => {
      return MiddlewareHelpers.requireAuth(async (request: NextRequest, user: AuthUser) => {
        if (!RBACManager.hasAnyPermission(user, permissions)) {
          return NextResponse.json(
            { error: 'Insufficient permissions' },
            { status: 403 }
          )
        }

        return handler(request, user)
      })
    }
  }

  /**
   * Require admin middleware
   */
  static requireAdmin(handler: (request: NextRequest, user: AuthUser) => Promise<NextResponse>) {
    return MiddlewareHelpers.requireRole(['admin', 'maintainer'])(handler)
  }
}

// Legacy exports for backward compatibility in server-side files
export const Middleware = MiddlewareHelpers
export const requireRole = MiddlewareHelpers.requireRole
export const requireAuth = MiddlewareHelpers.requireAuth
export const requireAdmin = MiddlewareHelpers.requireAdmin
export const isAdmin = AuthHelpers.isAdmin
export const isVendor = AuthHelpers.isVendor
export const isWeddingPlanner = AuthHelpers.isWeddingPlanner
export const isUser = AuthHelpers.isUser
