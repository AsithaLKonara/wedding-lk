import { NextResponse } from "next/server"
import type { NextRequest } from "next/server"

export function middleware(request: NextRequest) {
  const pathname = request.nextUrl.pathname
  
  // Allow access to public routes
  if (pathname.startsWith("/api/auth") || 
      pathname.startsWith("/_next") || 
      pathname.startsWith("/favicon.ico") ||
      pathname === "/" ||
      pathname.startsWith("/about") ||
      pathname.startsWith("/contact") ||
      pathname.startsWith("/vendors") ||
      pathname.startsWith("/venues") ||
      pathname.startsWith("/gallery") ||
      pathname.startsWith("/features") ||
      pathname.startsWith("/login") ||
      pathname.startsWith("/register")) {
    return NextResponse.next()
  }

  // For dashboard routes, we'll handle auth in the components
  // This is a simplified middleware for deployment
  return NextResponse.next()
}

export const config = {
  matcher: [
    "/dashboard/:path*",
    "/login",
    "/register",
    "/api/dashboard/:path*"
  ]
}
