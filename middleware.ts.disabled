import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'
import { getToken } from 'next-auth/jwt'

// Define role-based route access
const routeAccess = {
  // Public routes (no authentication required)
  public: [
    '/',
    '/login',
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
    '/profile',
    '/bookings',
    '/payments',
    '/subscription',
    '/favorites',
    '/api/bookings',
    '/api/payments',
    '/api/clients',
    '/api/reviews',
  ],
  
  // Vendor routes (authenticated vendors)
  vendor: [
    '/dashboard/vendor',
    '/dashboard/vendor/onboarding',
    '/api/services',
    '/api/vendors',
  ],
  
  // Admin routes (authenticated admins)
  admin: [
    '/dashboard/admin',
    '/api/users',
    '/api/admin',
    '/debug',
  ],
  
  // Planner routes (authenticated planners)
  planner: [
    '/dashboard/planner',
    '/api/tasks',
    '/api/planning',
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
function getUserRole(token: any): string {
  if (!token) return 'guest'
  
  // Check for admin role first
  if (token.role === 'admin') return 'admin'
  
  // Check for vendor role
  if (token.role === 'vendor') return 'vendor'
  
  // Check for planner role
  if (token.role === 'planner') return 'planner'
  
  // Default to user role for authenticated users
  return 'user'
}

// Helper function to check if user has access to route
function hasRouteAccess(path: string, role: string): boolean {
  // Public routes are accessible to everyone
  if (pathMatches(path, routeAccess.public)) {
    return true
  }
  
  // Check role-specific access
  switch (role) {
    case 'admin':
      return pathMatches(path, routeAccess.admin) || 
             pathMatches(path, routeAccess.user) ||
             pathMatches(path, routeAccess.vendor) ||
             pathMatches(path, routeAccess.planner)
    
    case 'vendor':
      return pathMatches(path, routeAccess.vendor) || 
             pathMatches(path, routeAccess.user)
    
    case 'planner':
      return pathMatches(path, routeAccess.planner) || 
             pathMatches(path, routeAccess.user)
    
    case 'user':
      return pathMatches(path, routeAccess.user)
    
    default:
      return false
  }
}

export async function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl
  
  // Skip middleware for static files and API routes that don't need auth
  if (
    pathname.startsWith('/_next') ||
    pathname.startsWith('/favicon.ico') ||
    pathname.startsWith('/placeholder') ||
    pathname.includes('.') // Static files
  ) {
    return NextResponse.next()
  }
  
  try {
    // Get the JWT token from the request
    const token = await getToken({ 
      req: request, 
      secret: process.env.NEXTAUTH_SECRET 
    })
    
    // Get user role
    const userRole = getUserRole(token)
    
    // Check if user has access to the requested route
    if (!hasRouteAccess(pathname, userRole)) {
      // Redirect based on authentication status and role
      if (!token) {
        // Not authenticated - redirect to login
        const loginUrl = new URL('/login', request.url)
        loginUrl.searchParams.set('callbackUrl', pathname)
        return NextResponse.redirect(loginUrl)
      } else {
        // Authenticated but no access - redirect to appropriate dashboard
        let redirectPath = '/dashboard'
        
        switch (userRole) {
          case 'admin':
            redirectPath = '/dashboard/admin'
            break
          case 'vendor':
            redirectPath = '/dashboard/vendor'
            break
          case 'planner':
            redirectPath = '/dashboard/planner'
            break
          default:
            redirectPath = '/dashboard'
        }
        
        const redirectUrl = new URL(redirectPath, request.url)
        return NextResponse.redirect(redirectUrl)
      }
    }
    
    // Add user role to headers for use in components
    const response = NextResponse.next()
    response.headers.set('x-user-role', userRole)
    if (token?.email) {
      response.headers.set('x-user-email', token.email)
    }
    
    return response
    
  } catch (error) {
    console.error('Middleware error:', error)
    
    // On error, allow the request to proceed but log it
    // This prevents breaking the app if there are auth issues
    return NextResponse.next()
  }
}

// Configure which paths the middleware should run on
export const config = {
  matcher: [
    /*
     * Match all request paths except for the ones starting with:
     * - api/auth (auth endpoints)
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico (favicon file)
     * - placeholder (placeholder images)
     */
    '/((?!api/auth|_next/static|_next/image|favicon.ico|placeholder).*)',
  ],
} 