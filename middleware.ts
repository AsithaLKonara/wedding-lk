import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import { getToken } from "next-auth/jwt";

export async function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;
  
  console.log('🔍 Middleware triggered for:', pathname);
  
  const token = await getToken({ 
    req: request,
    secret: process.env.NEXTAUTH_SECRET 
  });
  
  console.log('🔑 Token status:', token ? 'present' : 'missing');

  // Public routes that don't require authentication
  const publicRoutes = [
    '/',
    '/login',
    '/register',
    '/forgot-password',
    '/reset-password',
    '/api/auth/signin',
    '/api/auth/signout',
    '/api/auth/callback',
    '/api/health',
    '/api/vendors',
    '/api/venues',
    '/api/gallery',
    '/_next',
    '/favicon.ico',
    '/images',
    '/icons',
    '/api/auth/[...nextauth]'
  ];

  // Check if route is public
  const isPublicRoute = publicRoutes.some(route => 
    pathname === route || pathname.startsWith(route)
  );

  if (isPublicRoute) {
    return NextResponse.next();
  }

  // For API routes, return 401 if no token
  if (pathname.startsWith('/api/')) {
    if (!token) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }
  } else {
    // For page routes, redirect to login if no token
    if (!token) {
      const loginUrl = new URL('/login', request.url);
      loginUrl.searchParams.set('callbackUrl', pathname);
      return NextResponse.redirect(loginUrl);
    }
  }

  // Role-based access control
  const userRole = token.role as string;

  // Admin routes
  if (pathname.startsWith('/dashboard/admin')) {
    if (userRole !== 'admin') {
      return NextResponse.redirect(new URL('/unauthorized', request.url));
    }
  }

  // Vendor routes
  if (pathname.startsWith('/dashboard/vendor')) {
    if (userRole !== 'vendor') {
      return NextResponse.redirect(new URL('/unauthorized', request.url));
    }
  }

  // Planner routes
  if (pathname.startsWith('/dashboard/planner')) {
    if (userRole !== 'wedding_planner') {
      return NextResponse.redirect(new URL('/unauthorized', request.url));
    }
  }

  // User routes
  if (pathname.startsWith('/dashboard/user')) {
    if (userRole !== 'user') {
      return NextResponse.redirect(new URL('/unauthorized', request.url));
    }
  }

  // API route protection
  if (pathname.startsWith('/api/dashboard/admin')) {
    if (userRole !== 'admin') {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }
  }

  if (pathname.startsWith('/api/dashboard/vendor')) {
    if (userRole !== 'vendor') {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }
  }

  if (pathname.startsWith('/api/dashboard/planner')) {
    if (userRole !== 'wedding_planner') {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }
  }

  if (pathname.startsWith('/api/dashboard/user')) {
    if (userRole !== 'user') {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }
  }

  return NextResponse.next();
}

export const config = {
  matcher: [
    '/dashboard/:path*',
    '/api/dashboard/:path*',
    '/api/auth/:path*'
  ],
};