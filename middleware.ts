import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'
import jwt from 'jsonwebtoken'

// Simple JWT verification for middleware (no Mongoose)
function verifyToken(token: string) {
  try {
    return jwt.verify(token, process.env.JWT_SECRET || process.env.NEXTAUTH_SECRET || 'your-secret-key')
  } catch {
    return null
  }
}

const PUBLIC_ROUTES = [
  '/',
  '/login',
  '/register',
  '/about',
  '/contact',
  '/vendors',
  '/venues',
  '/api/auth/signin',
  '/api/auth/signup',
  '/api/health',
  '/api/test',
  '/_next',
  '/favicon.ico'
]

export function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl
  
  // Allow public routes
  if (PUBLIC_ROUTES.some(route => pathname.startsWith(route))) {
    return NextResponse.next()
  }
  
  // Check authentication
  const token = request.cookies.get('auth-token')?.value
  
  if (!token) {
    return NextResponse.redirect(new URL('/login', request.url))
  }
  
  const user = verifyToken(token)
  
  if (!user) {
    return NextResponse.redirect(new URL('/login', request.url))
  }
  
  // RBAC checks for dashboard routes
  if (pathname.startsWith('/dashboard/admin')) {
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