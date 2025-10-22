/**
 * 🚀 CENTRALIZED RBAC SYSTEM
 * 
 * This replaces 5 conflicting RBAC implementations with ONE unified system
 * - lib/auth-utils.ts
 * - lib/middleware/auth-middleware.ts  
 * - lib/api-error-middleware.ts
 * - components/ProtectedRoute.tsx
 * - components/providers/role-router.tsx
 */

import { NextRequest, NextResponse } from 'next/server'
import { getToken } from 'next-auth/jwt'

// Role definitions
export type UserRole = 'user' | 'vendor' | 'wedding_planner' | 'admin' | 'maintainer'

// Permission definitions
export type Permission = 
  | 'dashboard:read'
  | 'dashboard:write'
  | 'users:read'
  | 'users:write'
  | 'vendors:read'
  | 'vendors:write'
  | 'bookings:read'
  | 'bookings:write'
  | 'analytics:read'
  | 'analytics:write'
  | 'admin:read'
  | 'admin:write'
  | 'settings:read'
  | 'settings:write'

// Role-based permissions mapping
export const ROLE_PERMISSIONS: Record<UserRole, Permission[]> = {
  user: [
    'dashboard:read',
    'bookings:read',
    'bookings:write',
    'settings:read'
  ],
  vendor: [
    'dashboard:read',
    'dashboard:write',
    'bookings:read',
    'bookings:write',
    'analytics:read',
    'settings:read',
    'settings:write'
  ],
  wedding_planner: [
    'dashboard:read',
    'dashboard:write',
    'users:read',
    'bookings:read',
    'bookings:write',
    'analytics:read',
    'settings:read',
    'settings:write'
  ],
  admin: [
    'dashboard:read',
    'dashboard:write',
    'users:read',
    'users:write',
    'vendors:read',
    'vendors:write',
    'bookings:read',
    'bookings:write',
    'analytics:read',
    'analytics:write',
    'admin:read',
    'admin:write',
    'settings:read',
    'settings:write'
  ],
  maintainer: [
    'dashboard:read',
    'dashboard:write',
    'users:read',
    'users:write',
    'vendors:read',
    'vendors:write',
    'bookings:read',
    'bookings:write',
    'analytics:read',
    'analytics:write',
    'admin:read',
    'admin:write',
    'settings:read',
    'settings:write'
  ]
}

// Navigation items with role-based access
export interface NavigationItem {
  title: string
  href: string
  icon: React.ReactNode
  description: string
  roles: UserRole[]
  permissions?: Permission[]
}

// User interface
export interface AuthUser {
  id: string
  name: string
  email: string
  role: UserRole
  image?: string
  isActive?: boolean
}

// Authentication result
export interface AuthResult {
  success: boolean
  user?: AuthUser
  error?: string
}

/**
 * 🎯 CENTRALIZED RBAC MANAGER
 */
export class RBACManager {
  /**
   * Check if user has specific permission
   */
  static hasPermission(user: AuthUser, permission: Permission): boolean {
    if (!user || !user.role) return false
    
    const userPermissions = ROLE_PERMISSIONS[user.role] || []
    return userPermissions.includes(permission)
  }

  /**
   * Check if user has any of the required permissions
   */
  static hasAnyPermission(user: AuthUser, permissions: Permission[]): boolean {
    if (!user || !user.role) return false
    
    const userPermissions = ROLE_PERMISSIONS[user.role] || []
    return permissions.some(permission => userPermissions.includes(permission))
  }

  /**
   * Check if user has all required permissions
   */
  static hasAllPermissions(user: AuthUser, permissions: Permission[]): boolean {
    if (!user || !user.role) return false
    
    const userPermissions = ROLE_PERMISSIONS[user.role] || []
    return permissions.every(permission => userPermissions.includes(permission))
  }

  /**
   * Check if user role is in allowed roles
   */
  static hasRole(user: AuthUser, roles: UserRole[]): boolean {
    if (!user || !user.role) return false
    return roles.includes(user.role)
  }

  /**
   * Get user permissions
   */
  static getUserPermissions(user: AuthUser): Permission[] {
    if (!user || !user.role) return []
    return ROLE_PERMISSIONS[user.role] || []
  }

  /**
   * Filter navigation items based on user role and permissions
   */
  static filterNavigation(navigationItems: NavigationItem[], user: AuthUser): NavigationItem[] {
    if (!user || !user.role) return []

    return navigationItems.filter(item => {
      // Check role access
      if (!item.roles.includes(user.role)) return false
      
      // Check permission access if specified
      if (item.permissions && item.permissions.length > 0) {
        return this.hasAnyPermission(user, item.permissions)
      }
      
      return true
    })
  }

  /**
   * Get role display name
   */
  static getRoleDisplayName(role: UserRole): string {
    const displayNames: Record<UserRole, string> = {
      user: 'Wedding Couple',
      vendor: 'Service Provider',
      wedding_planner: 'Wedding Planner',
      admin: 'Administrator',
      maintainer: 'System Maintainer'
    }
    return displayNames[role] || role
  }

  /**
   * Get role theme colors
   */
  static getRoleTheme(role: UserRole) {
    const themes: Record<UserRole, { bg: string; text: string; border: string }> = {
      user: { bg: 'bg-blue-100', text: 'text-blue-600', border: 'border-blue-200' },
      vendor: { bg: 'bg-green-100', text: 'text-green-600', border: 'border-green-200' },
      wedding_planner: { bg: 'bg-purple-100', text: 'text-purple-600', border: 'border-purple-200' },
      admin: { bg: 'bg-red-100', text: 'text-red-600', border: 'border-red-200' },
      maintainer: { bg: 'bg-orange-100', text: 'text-orange-600', border: 'border-orange-200' }
    }
    return themes[role] || themes.user
  }
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
      const token = await getToken({ 
        req: request,
        secret: process.env.NEXTAUTH_SECRET 
      })

      if (!token || !token.userId) {
        return {
          success: false,
          error: 'No authentication token found'
        }
      }

      // In a real app, you'd fetch user from database
      const user: AuthUser = {
        id: token.userId as string,
        name: token.name as string,
        email: token.email as string,
        role: (token.role as UserRole) || 'user',
        image: token.picture as string,
        isActive: true
      }

      return {
        success: true,
        user
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

/**
 * 🎯 EXPORT UNIFIED RBAC SYSTEM
 */
export {
  RBACManager as RBAC,
  AuthHelpers as Auth,
  MiddlewareHelpers as Middleware
}

// Legacy exports for backward compatibility
export const requireRole = MiddlewareHelpers.requireRole
export const requireAuth = MiddlewareHelpers.requireAuth
export const requireAdmin = MiddlewareHelpers.requireAdmin
export const hasRole = RBACManager.hasRole
export const hasPermission = RBACManager.hasPermission
export const isAdmin = AuthHelpers.isAdmin
export const isVendor = AuthHelpers.isVendor
export const isWeddingPlanner = AuthHelpers.isWeddingPlanner
export const isUser = AuthHelpers.isUser
