"use client"

import { useRouter, usePathname } from "next/navigation"
import { useEffect, useState } from "react";

interface RoleRouterProps {
  children: React.ReactNode
}

export default function RoleRouter({ children }: RoleRouterProps) {
  const [user, setUser] = useState(null);
  const [status, setStatus] = useState('loading');
  const router = useRouter()
  const pathname = usePathname()

  useEffect(() => {
    // Only run after authentication is complete
    if (status === 'loading') return
    
    // If not authenticated, don't redirect (let middleware handle it)
    if (status === 'unauthenticated') return
    
    // If authenticated, check role-based routing
    if (user ?.user?.role) {
      const userRole = user.role
      const currentPath = pathname

      // Define role-based routing rules
      const roleRoutes = {
        vendor: {
          default: '/dashboard/vendor',
          allowed: ['/dashboard', '/dashboard/vendor', '/dashboard/vendor/onboarding', '/planning', '/profile', '/bookings', '/payments']
        },
        admin: {
          default: '/dashboard/admin',
          allowed: ['/dashboard', '/dashboard/admin', '/dashboard/vendor', '/dashboard/vendor/onboarding', '/planning', '/profile', '/bookings', '/payments']
        },
        user: {
          default: '/dashboard',
          allowed: ['/dashboard', '/planning', '/profile', '/bookings', '/payments']
        }
      }

      const userRouteConfig = roleRoutes[userRole as keyof typeof roleRoutes]
      
      if (userRouteConfig) {
        // If user is on main dashboard and should be redirected to role-specific dashboard
        if (currentPath === '/dashboard' && userRole !== 'user') {
          router.push(userRouteConfig.default)
          return
        }
        
        // If user is trying to access a route they don't have permission for
        if (!userRouteConfig.allowed.some(route => currentPath.startsWith(route))) {
          router.push(userRouteConfig.default)
          return
        }
      }
    }
  }, [session, status, router, pathname])

  // Temporarily disable permission checking for development
  // Show loading while checking authentication
  if (status === 'loading') {
    // Temporarily bypass loading state for development
    return <>{children}</>
    
    // Original code (commented out):
    // return (
    //   <div className="flex items-center justify-center min-h-screen">
    //     <div className="text-center">
    //       <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-blue-600 mx-auto"></div>
    //       <p className="mt-4 text-gray-600">Checking permissions...</p>
    //     </div>
    //   </div>
    // )
  }

  return <>{children}</>
} 