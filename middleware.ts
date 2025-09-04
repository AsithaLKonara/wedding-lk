import { withAuth } from "next-auth/middleware"
import { NextResponse } from "next/server"

export default withAuth(
  function middleware(req) {
    const token = req.nextauth.token
    const isAuth = !!token
    const isAuthPage = req.nextUrl.pathname.startsWith("/login") || 
                      req.nextUrl.pathname.startsWith("/register")

    if (isAuthPage) {
      if (isAuth) {
        // Redirect authenticated users to their role-based dashboard
        const role = token?.role as string
        return NextResponse.redirect(new URL(`/dashboard/${role}`, req.url))
      }
      return null
    }

    if (!isAuth) {
      let from = req.nextUrl.pathname
      if (req.nextUrl.search) {
        from += req.nextUrl.search
      }
      return NextResponse.redirect(new URL(`/login?from=${encodeURIComponent(from)}`, req.url))
    }

    // Role-based access control
    const pathname = req.nextUrl.pathname
    const userRole = token?.role as string

    // Admin routes
    if (pathname.startsWith("/dashboard/admin")) {
      if (userRole !== "admin") {
        return NextResponse.redirect(new URL(`/dashboard/${userRole}`, req.url))
      }
    }

    // Vendor routes
    if (pathname.startsWith("/dashboard/vendor")) {
      if (userRole !== "vendor") {
        return NextResponse.redirect(new URL(`/dashboard/${userRole}`, req.url))
      }
    }

    // Planner routes
    if (pathname.startsWith("/dashboard/planner")) {
      if (userRole !== "wedding_planner") {
        return NextResponse.redirect(new URL(`/dashboard/${userRole}`, req.url))
      }
    }

    // User routes
    if (pathname.startsWith("/dashboard/user")) {
      if (userRole !== "user") {
        return NextResponse.redirect(new URL(`/dashboard/${userRole}`, req.url))
      }
    }

    return null
  },
  {
    callbacks: {
      authorized: ({ token, req }) => {
        const pathname = req.nextUrl.pathname
        
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
            pathname.startsWith("/features")) {
          return true
        }

        // Require authentication for dashboard routes
        if (pathname.startsWith("/dashboard")) {
          return !!token
        }

        return true
      },
    },
  }
)

export const config = {
  matcher: [
    "/dashboard/:path*",
    "/login",
    "/register",
    "/api/dashboard/:path*"
  ]
}
