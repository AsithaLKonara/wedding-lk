import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'
import { getToken } from 'next-auth/jwt'
import { RBACManager, type UserRole, type Permission } from '@/lib/rbac'

// Route access configuration
const ROUTE_ACCESS = {
  // Public routes (no authentication required)
  public: [
    '/',
    '/login',
    '/auth/signin',
    '/register',
    '/about',
    '/contact',
    '/vendors',
    '/venues',
    '/features',
    '/gallery',
    '/feed',
    '/favorites',
    '/packages',
    '/planning',
    '/premium',
    '/subscription',
    '/roadmap',
    '/status',
    '/verify-email',
    '/api/auth',
    '/api/venues',
    '/api/vendors',
    '/api/ai-search',
    '/api/errors',
    '/api/health',
    '/api/users/avatars',
    '/api/vendors/with-avatars',
    '/api/venues/with-avatars',
    '/api/test',
    '/api/test-models',
    '/api/home/stats',
    '/api/home/featured-vendors',
    '/api/home/featured-venues',
    '/api/home/testimonials',
    '/_next',
    '/favicon.ico',
    '/placeholder',
  ],
  
  // User routes (authenticated users)
  user: [
    '/dashboard',
    '/dashboard/profile',
    '/dashboard/planning',
    '/dashboard/favorites',
    '/dashboard/messages',
    '/dashboard/payments',
    '/dashboard/settings',
    '/api/dashboard/user',
    '/api/bookings',
    '/api/payments',
    '/api/favorites',
    '/api/messages',
  ],
  
  // Vendor routes (authenticated vendors)
  vendor: [
    '/dashboard/vendor',
    '/dashboard/vendor/services',
    '/dashboard/vendor/bookings',
    '/dashboard/vendor/analytics',
    '/dashboard/vendor/boost-campaigns',
    '/dashboard/vendor/portfolio',
    '/dashboard/vendor/onboarding',
    '/api/dashboard/vendor',
    '/api/vendors',
    '/api/services',
  ],
  
  // Planner routes (authenticated planners)
  planner: [
    '/dashboard/planner',
    '/dashboard/planner/tasks',
    '/dashboard/planner/clients',
    '/dashboard/planner/timeline',
    '/api/dashboard/planner',
    '/api/tasks',
    '/api/planning',
  ],
  
  // Admin routes (authenticated admins)
  admin: [
    '/dashboard/admin',
    '/dashboard/admin/users',
    '/dashboard/admin/vendors',
    '/dashboard/admin/analytics',
    '/dashboard/admin/performance',
    '/dashboard/admin/settings',
    '/dashboard/admin/reports',
    '/api/dashboard/admin',
    '/api/admin',
    '/api/users',
    '/api/analytics',
    '/api/performance',
  ],
  
  // Maintainer routes (system maintainers)
  maintainer: [
    '/dashboard/admin',
    '/dashboard/admin/users',
    '/dashboard/admin/vendors',
    '/dashboard/admin/analytics',
    '/dashboard/admin/performance',
    '/dashboard/admin/settings',
    '/dashboard/admin/reports',
    '/api/dashboard/admin',
    '/api/admin',
    '/api/users',
    '/api/analytics',
    '/api/performance',
  ]
}

// Helper function to check if path matches any pattern
function pathMatches(path: string, patterns: string[]): boolean {
  return patterns.some(pattern => {
    if (pattern.endsWith('*')) {
      return path.startsWith(pattern.slice(0, -1))
    }
    return path === pattern || path.startsWith(pattern + '/')
  })
}

// Helper function to get user role from token
async function getUserRole(request: NextRequest): Promise<UserRole | null> {
  try {
    const token = await getToken({ 
      req: request,
      secret: process.env.NEXTAUTH_SECRET 
    })
    
    if (!token || !token.role) return null
    
    return token.role as UserRole
  } catch (error) {
    console.error('Error getting user role:', error)
    return null
  }
}

// Helper function to check route access
function hasRouteAccess(path: string, userRole: UserRole | null): boolean {
  // Allow public routes
  if (pathMatches(path, ROUTE_ACCESS.public)) {
    return true
  }
  
  // Require authentication for protected routes
  if (!userRole) {
    return false
  }
  
  // Check role-based access
  const allowedRoutes = ROUTE_ACCESS[userRole] || []
  return pathMatches(path, allowedRoutes)
}

// Helper function to redirect to appropriate login page
function getLoginRedirect(path: string): string {
  // Redirect to specific login pages based on intended destination
  if (path.startsWith('/dashboard/admin')) {
    return '/login?callbackUrl=/dashboard/admin'
  }
  if (path.startsWith('/dashboard/vendor')) {
    return '/login?callbackUrl=/dashboard/vendor'
  }
  if (path.startsWith('/dashboard/planner')) {
    return '/login?callbackUrl=/dashboard/planner'
  }
  return '/login?callbackUrl=' + encodeURIComponent(path)
}

export async function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl
  
  // Skip middleware for static files and API routes that don't need auth
  if (
    pathname.startsWith('/_next/') ||
    pathname.startsWith('/api/') ||
    pathname.startsWith('/favicon.ico') ||
    pathname.startsWith('/placeholder')
  ) {
    return NextResponse.next()
  }
  
  // Get user role
  const userRole = await getUserRole(request)
  
  // Check if user has access to the route
  if (!hasRouteAccess(pathname, userRole)) {
    // Redirect to login if not authenticated
    if (!userRole) {
      const loginUrl = getLoginRedirect(pathname)
      return NextResponse.redirect(new URL(loginUrl, request.url))
    }
    
    // Redirect to appropriate dashboard if authenticated but no access
    const dashboardUrl = userRole === 'admin' || userRole === 'maintainer' 
      ? '/dashboard/admin' 
      : userRole === 'vendor' 
      ? '/dashboard/vendor' 
      : userRole === 'wedding_planner'
      ? '/dashboard/planner'
      : '/dashboard'
    
    return NextResponse.redirect(new URL(dashboardUrl, request.url))
  }
  
  // Add user role to headers for use in components
  const response = NextResponse.next()
  if (userRole) {
    response.headers.set('x-user-role', userRole)
  }
  
  return response
}

export const config = {
  matcher: [
    /*
     * Match all request paths except for the ones starting with:
     * - api (API routes)
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico (favicon file)
     * - public (public files)
     */
    '/((?!api|_next/static|_next/image|favicon.ico|public).*)',
  ],
}