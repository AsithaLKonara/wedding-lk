import React from 'react'

/**
 * 🚀 CENTRALIZED RBAC SYSTEM - CLIENT SAFE
 * 
 * This file contains pure logic and types that are safe to use in the browser.
 * Server-side helpers are in lib/rbac/server.ts
 */

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
  badge?: string | number
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

// Re-export common functions (pure logic only)
export const hasRole = RBACManager.hasRole
export const hasPermission = RBACManager.hasPermission
