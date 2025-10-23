"use client"

import { useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { Loader2 } from 'lucide-react'

export default function DashboardRedirect() {
  const [user, setUser] = useState(null);
  const [status, setStatus] = useState('loading');
  const router = useRouter()

  useEffect(() => {
    if (status === 'loading') return // Still loading

    if (!user) {
      router.push('/login')
      return
    }

    // Role-based routing
    const userRole = (user as any)?.role || 'user'
    
    console.log('🎯 Dashboard redirect - User role:', userRole)
    console.log('🎯 Session data:', session)
    
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
      case 'user':
      default:
        router.push('/dashboard/user')
        break
    }
  }, [session, status, router])

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50">
      <div className="text-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
        <h2 className="text-xl font-semibold text-gray-900 mb-2">Redirecting to your dashboard...</h2>
        <p className="text-gray-600">Please wait while we set up your personalized experience</p>
      </div>
    </div>
  )
}
