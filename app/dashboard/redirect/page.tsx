"use client"

import { useEffect } from 'react'
import { useSession } from 'next-auth/react'
import { useRouter } from 'next/navigation'
import { Loader2 } from 'lucide-react'

export default function DashboardRedirect() {
  const { data: session, status } = useSession()
  const router = useRouter()

  useEffect(() => {
    if (status === 'loading') return // Still loading

    if (!session) {
      router.push('/login')
      return
    }

    // Role-based routing
    const userRole = (session.user as any)?.role || 'user'
    
    console.log('🎯 Dashboard redirect - User role:', userRole)
    
    switch (userRole) {
      case 'admin':
        router.push('/dashboard/admin')
        break
      case 'vendor':
        router.push('/dashboard/vendor')
        break
      case 'wedding_planner':
        router.push('/dashboard/planner')
        break
      case 'maintainer':
        router.push('/dashboard/maintainer')
        break
      case 'user':
      default:
        router.push('/dashboard/user')
        break
    }
  }, [session, status, router])

  return (
    <div className="min-h-screen flex items-center justify-center">
      <div className="text-center">
        <Loader2 className="h-8 w-8 animate-spin mx-auto mb-4 text-rose-500" />
        <p className="text-gray-600">Redirecting to your dashboard...</p>
      </div>
    </div>
  )
}
