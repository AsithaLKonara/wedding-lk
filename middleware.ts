import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'
import { jwtVerify } from 'jose'

const JWT_SECRET = new TextEncoder().encode(
  process.env.JWT_SECRET || process.env.NEXTAUTH_SECRET || 'your-secret-key'
)

// Simple JWT verification for middleware using jose (Edge compatible)
async function verifyToken(token: string) {
  try {
    const { payload } = await jwtVerify(token, JWT_SECRET)
    return payload
  } catch {
    return null
  }
}

const PUBLIC_ROUTES = [
  '/',
  '/auth/signin',
  '/auth/signup',
  '/login',
  '/register',
  '/about',
  '/contact',
  '/vendors',
  '/venues',
  '/features',
  '/gallery',
  '/packages',
  '/api/auth/signin',
  '/api/auth/signup',
  '/api/auth/me',
  '/api/health',
  '/api/test',
  '/api/dev/seed',
  '/api/home/featured-vendors',
  '/api/home/featured-venues',
  '/api/home/testimonials'
]

export async function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl
  
  // Static assets and internal next.js routes are always public
  if (
    pathname.startsWith('/_next') ||
    pathname.startsWith('/static') ||
    pathname.includes('/favicon.ico') ||
    pathname.startsWith('/icons/')
  ) {
    return NextResponse.next()
  }

  // Check if current route is in PUBLIC_ROUTES or is an API route
  const isPublicRoute = PUBLIC_ROUTES.some(route => 
    pathname === route || pathname.startsWith(`${route}/`)
  )
  
  const isApiRoute = pathname.startsWith('/api')
  
  if (isPublicRoute || isApiRoute) {
    return NextResponse.next()
  }
  
  // Check authentication
  const token = request.cookies.get('auth-token')?.value
  
  if (!token) {
    return NextResponse.redirect(new URL('/login', request.url))
  }
  
  const user = await verifyToken(token)
  
  if (!user) {
    return NextResponse.redirect(new URL('/login', request.url))
  }
  
  // RBAC checks for dashboard and admin routes
  if (pathname.startsWith('/dashboard/admin') || pathname.startsWith('/admin')) {
    const userRole = (user as any).role
    if (userRole !== 'admin' && userRole !== 'maintainer') {
      return NextResponse.redirect(new URL('/dashboard', request.url))
    }
  }
  
  if (pathname.startsWith('/dashboard/vendor')) {
    const userRole = (user as any).role
    if (userRole !== 'vendor') {
      return NextResponse.redirect(new URL('/dashboard', request.url))
    }
  }
  
  if (pathname.startsWith('/dashboard/planner')) {
    const userRole = (user as any).role
    if (userRole !== 'wedding_planner') {
      return NextResponse.redirect(new URL('/dashboard', request.url))
    }
  }
  
  return NextResponse.next()
}

export const config = {
  matcher: ['/((?!_next/static|_next/image|favicon.ico).*)']
}