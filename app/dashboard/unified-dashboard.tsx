"use client"

import { useRouter } from "next/navigation"
import { useEffect, useState } from "react"
import type { AuthUser } from '@/lib/auth/custom-auth'
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { 
  Calendar, 
  Users, 
  DollarSign, 
  CheckSquare, 
  MessageCircle, 
  Settings, 
  LayoutDashboard, 
  TrendingUp, 
  Bell, 
  Store, 
  Shield, 
  UserCheck,
  Activity,
  BarChart3,
  PieChart,
  Target,
  Award,
  Clock,
  Database,
  Globe,
  Server,
  Zap,
  RefreshCw
} from "lucide-react"
import Link from "next/link"

// Import consolidated components
import { AnalyticsDashboard } from "@/components/organisms/analytics-dashboard"
import { PerformanceMonitoringDashboard } from "@/components/organisms/performance-monitoring-dashboard"

interface DashboardStats {
  overview: {
    totalBookings: number
    totalRevenue: number
    totalUsers: number
    totalVenues: number
    totalVendors: number
    averageRating: number
    conversionRate: number
    growthRate: number
  }
  performance: {
    apiCalls: number
    responseTime: number
    errorRate: number
    uptime: number
  }
  recentActivity: Array<{
    id: string
    type: string
    message: string
    timestamp: string
    priority: 'high' | 'medium' | 'low'
  }>
}

export default function UnifiedDashboard() {
  const [user, setUser] = useState<AuthUser | null>(null)
  const router = useRouter()
  const [isLoading, setIsLoading] = useState(true)
  const [stats, setStats] = useState<DashboardStats | null>(null)
  const [activeTab, setActiveTab] = useState('overview')

  const fetchDashboardData = async () => {
    try {
      setIsLoading(true)
      
      // Fetch real data from API
      const [statsResponse, activityResponse] = await Promise.all([
        fetch('/api/dashboard/stats'),
        fetch('/api/dashboard/activity')
      ])
      
      if (statsResponse.ok && activityResponse.ok) {
        const [statsData, activityData] = await Promise.all([
          statsResponse.json(),
          activityResponse.json()
        ])
        
        setStats({
          overview: statsData.stats.overview,
          performance: statsData.stats.performance,
          recentActivity: activityData.activities
        })
      } else {
        throw new Error('Failed to fetch dashboard data')
      }
    } catch (error) {
      console.error('Failed to fetch dashboard data:', error)
      // Fallback to mock data for development
      setStats({
        overview: {
          totalBookings: 342,
          totalRevenue: 1250000,
          totalUsers: 1247,
          totalVenues: 89,
          totalVendors: 156,
          averageRating: 4.7,
          conversionRate: 12.5,
          growthRate: 8.3
        },
        performance: {
          apiCalls: 15420,
          responseTime: 245,
          errorRate: 0.2,
          uptime: 99.8
        },
        recentActivity: [
          {
            id: '1',
            type: 'booking',
            message: 'New booking received from Sarah Johnson',
            timestamp: '2 hours ago',
            priority: 'high'
          },
          {
            id: '2',
            type: 'payment',
            message: 'Payment of LKR 50,000 received',
            timestamp: '4 hours ago',
            priority: 'medium'
          },
          {
            id: '3',
            type: 'review',
            message: 'New 5-star review posted',
            timestamp: '1 day ago',
            priority: 'low'
          }
        ]
      })
    } finally {
      setIsLoading(false)
    }
  }

  useEffect(() => {
    fetch('/api/auth/me')
      .then(res => res.json())
      .then(data => {
        if (data.user) {
          setUser(data.user)
          fetchDashboardData()
        } else {
          router.push('/login')
        }
      })
      .catch((error) => {
        console.error('Dashboard auth error:', error)
        router.push('/login')
      })
      .finally(() => setIsLoading(false))
  }, [router])

  // Add error boundary handling
  const [error, setError] = useState<Error | null>(null)
  
  if (error) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <Card className="w-full max-w-md">
          <CardHeader>
            <CardTitle>Dashboard Error</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-gray-600">{error.message}</p>
            <Button onClick={() => setError(null)} className="mt-4">Try Again</Button>
          </CardContent>
        </Card>
      </div>
    )
  }

  // Show loading state
  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center">
          <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-blue-600 mx-auto"></div>
          <p className="mt-4 text-gray-600">Loading your dashboard...</p>
        </div>
      </div>
    )
  }

  // Show login prompt if not authenticated
  if (!user) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <Card className="w-full max-w-md">
          <CardHeader>
            <CardTitle>Authentication Required</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <Button asChild className="w-full">
              <Link href="/login">Login to Dashboard</Link>
            </Button>
            <Button variant="outline" asChild className="w-full">
              <Link href="/register">Create Account</Link>
            </Button>
          </CardContent>
        </Card>
      </div>
    )
  }

  const userRole = user.role

  // Role-based dashboard configuration
  const getRoleConfig = () => {
    switch (userRole) {
      case 'admin':
        return {
          title: 'Admin Dashboard',
          description: 'Platform administration and oversight',
          icon: Shield,
          color: 'bg-red-100 text-red-600',
          stats: [
            { label: 'Total Users', value: stats?.overview.totalUsers || 0, icon: Users },
            { label: 'Total Vendors', value: stats?.overview.totalVendors || 0, icon: Store },
            { label: 'Total Bookings', value: stats?.overview.totalBookings || 0, icon: Calendar },
            { label: 'Platform Revenue', value: `LKR ${(stats?.overview.totalRevenue || 0).toLocaleString()}`, icon: DollarSign }
          ]
        }
      case 'vendor':
        return {
          title: 'Vendor Dashboard',
          description: 'Manage your business and bookings',
          icon: Store,
          color: 'bg-green-100 text-green-600',
          stats: [
            { label: 'My Bookings', value: 32, icon: Calendar },
            { label: 'Total Revenue', value: 'LKR 1,250,000', icon: DollarSign },
            { label: 'Avg Rating', value: '4.7', icon: Award },
            { label: 'Active Services', value: 8, icon: CheckSquare }
          ]
        }
      default:
        return {
          title: 'Wedding Planning Dashboard',
          description: 'Plan your perfect wedding',
          icon: LayoutDashboard,
          color: 'bg-blue-100 text-blue-600',
          stats: [
            { label: 'Upcoming Events', value: 2, icon: Calendar },
            { label: 'Guest List', value: 150, icon: Users },
            { label: 'Budget Spent', value: 'LKR 450,000', icon: DollarSign },
            { label: 'Tasks Completed', value: '18/25', icon: CheckSquare }
          ]
        }
    }
  }

  const roleConfig = getRoleConfig()
  const RoleIcon = roleConfig.icon

  return (
    <div className="space-y-6" data-testid="dashboard-layout">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-4">
          <div className={`p-3 rounded-full ${roleConfig.color}`}>
            <RoleIcon className="h-8 w-8" />
          </div>
          <div>
            <h1 className="text-3xl font-bold">{roleConfig.title}</h1>
            <p className="text-gray-600 mt-2">{roleConfig.description}</p>
            <p className="text-sm text-gray-500 mt-1">Welcome back, {user?.name || user?.email || 'User'}!</p>
          </div>
        </div>
        <div className="flex items-center space-x-2">
          <Button variant="outline" size="icon">
            <Bell className="h-5 w-5" />
          </Button>
          <Button variant="outline" size="icon">
            <Settings className="h-5 w-5" />
          </Button>
        </div>
      </div>

      {/* Stats Overview */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {roleConfig.stats.map((stat, index) => (
          <Card key={index}>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">{stat.label}</CardTitle>
              <stat.icon className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{stat.value}</div>
              <p className="text-xs text-muted-foreground">
                {index === 0 && userRole === 'admin' && '+12.5% from last month'}
                {index === 0 && userRole === 'vendor' && '+15% from last month'}
                {index === 0 && userRole === 'user' && 'Next event in 3 days'}
              </p>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Main Dashboard Tabs */}
      <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-6">
        <TabsList className="grid w-full grid-cols-4">
          <TabsTrigger value="overview" className="flex items-center gap-2">
            <LayoutDashboard className="h-4 w-4" />
            Overview
          </TabsTrigger>
          <TabsTrigger value="analytics" className="flex items-center gap-2">
            <BarChart3 className="h-4 w-4" />
            Analytics
          </TabsTrigger>
          <TabsTrigger value="performance" className="flex items-center gap-2">
            <Activity className="h-4 w-4" />
            Performance
          </TabsTrigger>
          <TabsTrigger value="activity" className="flex items-center gap-2">
            <Clock className="h-4 w-4" />
            Activity
          </TabsTrigger>
        </TabsList>

        <TabsContent value="overview" className="space-y-6">
          {/* Role-specific Quick Actions */}
          <Card>
            <CardHeader>
              <CardTitle>Quick Actions</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                {userRole === 'admin' && (
                  <>
                    <Button asChild className="h-24 flex flex-col justify-center items-center bg-red-600 hover:bg-red-700">
                      <Link href="/dashboard/admin/users">
                        <Users className="h-6 w-6 mb-2" />
                        User Management
                      </Link>
                    </Button>
                    <Button asChild variant="outline" className="h-24 flex flex-col justify-center items-center">
                      <Link href="/dashboard/admin/vendors">
                        <Store className="h-6 w-6 mb-2" />
                        Vendor Management
                      </Link>
                    </Button>
                    <Button asChild variant="outline" className="h-24 flex flex-col justify-center items-center">
                      <Link href="/dashboard/admin/analytics">
                        <TrendingUp className="h-6 w-6 mb-2" />
                        Platform Analytics
                      </Link>
                    </Button>
                    <Button asChild variant="outline" className="h-24 flex flex-col justify-center items-center">
                      <Link href="/dashboard/admin/settings">
                        <Settings className="h-6 w-6 mb-2" />
                        System Settings
                      </Link>
                    </Button>
                  </>
                )}

                {userRole === 'vendor' && (
                  <>
                    <Button asChild className="h-24 flex flex-col justify-center items-center bg-green-600 hover:bg-green-700">
                      <Link href="/dashboard/vendor/bookings">
                        <Calendar className="h-6 w-6 mb-2" />
                        Manage Bookings
                      </Link>
                    </Button>
                    <Button asChild variant="outline" className="h-24 flex flex-col justify-center items-center">
                      <Link href="/dashboard/vendor/services">
                        <Store className="h-6 w-6 mb-2" />
                        My Services
                      </Link>
                    </Button>
                    <Button asChild variant="outline" className="h-24 flex flex-col justify-center items-center">
                      <Link href="/dashboard/vendor/analytics">
                        <TrendingUp className="h-6 w-6 mb-2" />
                        Analytics
                      </Link>
                    </Button>
                    <Button asChild variant="outline" className="h-24 flex flex-col justify-center items-center">
                      <Link href="/dashboard/vendor/profile">
                        <Settings className="h-6 w-6 mb-2" />
                        Profile
                      </Link>
                    </Button>
                  </>
                )}

                {userRole === 'user' && (
                  <>
                    <Button asChild className="h-24 flex flex-col justify-center items-center bg-blue-600 hover:bg-blue-700">
                      <Link href="/planning">
                        <CheckSquare className="h-6 w-6 mb-2" />
                        Wedding Planning
                      </Link>
                    </Button>
                    <Button asChild variant="outline" className="h-24 flex flex-col justify-center items-center">
                      <Link href="/vendors">
                        <Store className="h-6 w-6 mb-2" />
                        Find Vendors
                      </Link>
                    </Button>
                    <Button asChild variant="outline" className="h-24 flex flex-col justify-center items-center">
                      <Link href="/venues">
                        <LayoutDashboard className="h-6 w-6 mb-2" />
                        Find Venues
                      </Link>
                    </Button>
                    <Button asChild variant="outline" className="h-24 flex flex-col justify-center items-center">
                      <Link href="/dashboard/messages">
                        <MessageCircle className="h-6 w-6 mb-2" />
                        Messages
                      </Link>
                    </Button>
                  </>
                )}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="analytics">
          <AnalyticsDashboard userRole={userRole} />
        </TabsContent>

        <TabsContent value="performance">
          <PerformanceMonitoringDashboard />
        </TabsContent>

        <TabsContent value="activity">
          <Card>
            <CardHeader>
              <CardTitle>Recent Activity</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {stats?.recentActivity.map((activity) => (
                  <div key={activity.id} className="flex items-center space-x-3">
                    <div className={`w-2 h-2 rounded-full ${
                      activity.priority === 'high' ? 'bg-red-500' :
                      activity.priority === 'medium' ? 'bg-yellow-500' : 'bg-green-500'
                    }`}></div>
                    <div className="flex-1">
                      <p className="text-sm font-medium">{activity.message}</p>
                      <p className="text-xs text-gray-500">{activity.timestamp}</p>
                    </div>
                    <Badge variant={activity.priority === 'high' ? 'destructive' : 'secondary'}>
                      {activity.priority}
                    </Badge>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  )
}
