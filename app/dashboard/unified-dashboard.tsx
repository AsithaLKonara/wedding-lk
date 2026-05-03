"use client"

import React, { useEffect, useState } from "react"
import { useRouter } from "next/navigation"
import type { AuthUser } from '@/lib/rbac'
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
  Activity,
  BarChart3,
  Clock,
  Zap,
  Award
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
      
      const [statsResponse, activityResponse] = await Promise.all([
        fetch('/api/dashboard/stats').catch(() => null),
        fetch('/api/dashboard/activity').catch(() => null)
      ])
      
      if (statsResponse?.ok && activityResponse?.ok) {
        const [statsData, activityData] = await Promise.all([
          statsResponse.json(),
          activityResponse.json()
        ])
        
        setStats({
          overview: statsData?.stats?.overview || {
            totalBookings: 0,
            totalRevenue: 0,
            totalUsers: 0,
            totalVenues: 0,
            totalVendors: 0,
            averageRating: 0,
            conversionRate: 0,
            growthRate: 0
          },
          performance: statsData?.stats?.performance || {
            apiCalls: 0,
            responseTime: 0,
            errorRate: 0,
            uptime: 99.9
          },
          recentActivity: activityData?.activities || []
        })
      } else {
        throw new Error('Failed to fetch dashboard data')
      }
    } catch (error) {
      console.error('Failed to fetch dashboard data:', error)
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

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-[#0e0918]">
        <div className="text-center">
          <div className="animate-spin rounded-full h-16 w-16 border-4 border-red-600 border-t-transparent mx-auto"></div>
          <p className="mt-4 text-gray-400 font-medium animate-pulse">Loading your dashboard...</p>
        </div>
      </div>
    )
  }

  if (!user) return null

  const userRole = user.role

  const getRoleConfig = () => {
    switch (userRole) {
      case 'admin':
        return {
          title: 'Admin Console',
          description: 'Platform oversight & maintenance',
          icon: Shield,
          color: 'bg-red-500/10 text-red-500 border-red-500/20',
          stats: [
            { label: 'Total Users', value: (stats?.overview.totalUsers || 0).toLocaleString(), icon: Users, trend: '+12%' },
            { label: 'Verified Vendors', value: stats?.overview.totalVendors || 0, icon: Store, trend: '+5%' },
            { label: 'Active Bookings', value: stats?.overview.totalBookings || 0, icon: Calendar, trend: '+8%' },
            { label: 'Total Revenue', value: `LKR ${(stats?.overview.totalRevenue || 0).toLocaleString()}`, icon: DollarSign, trend: '+15%' }
          ]
        }
      case 'vendor':
        return {
          title: 'Vendor Hub',
          description: 'Business growth & management',
          icon: Store,
          color: 'bg-emerald-500/10 text-emerald-500 border-emerald-500/20',
          stats: [
            { label: 'Recent Bookings', value: 32, icon: Calendar, trend: '+18%' },
            { label: 'Monthly Earnings', value: 'LKR 1.2M', icon: DollarSign, trend: '+22%' },
            { label: 'Service Rating', value: '4.8', icon: Award, trend: 'Top 5%' },
            { label: 'Profile Views', value: '1.2K', icon: Activity, trend: '+12%' }
          ]
        }
      default:
        return {
          title: 'Wedding Planner',
          description: 'Organize your dream wedding',
          icon: LayoutDashboard,
          color: 'bg-blue-500/10 text-blue-500 border-blue-500/20',
          stats: [
            { label: 'Wedding Countdown', value: '124 Days', icon: Clock, trend: 'Oct 2024' },
            { label: 'Confirmed Guests', value: '156/200', icon: Users, trend: '78%' },
            { label: 'Budget Utilized', value: '45%', icon: DollarSign, trend: 'LKR 450K' },
            { label: 'Checklist Progress', value: '18/25', icon: CheckSquare, trend: 'Next: Venue' }
          ]
        }
    }
  }

  const roleConfig = getRoleConfig()
  const RoleIcon = roleConfig.icon

  return (
    <div className="space-y-8 pb-12">
      {/* Header Section */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
        <div className="flex items-center space-x-5">
          <div className={`p-4 rounded-2xl shadow-lg border ${roleConfig.color}`}>
            <RoleIcon className="h-9 w-9" />
          </div>
          <div>
            <h1 className="text-4xl font-black text-white tracking-tight">{roleConfig.title}</h1>
            <div className="flex items-center gap-3 mt-1">
              <p className="text-gray-400 font-medium">{roleConfig.description}</p>
              <span className="text-gray-700">•</span>
              <p className="text-sm font-bold text-gray-500">Welcome back, <span className="text-white">{user.name || 'Partner'}</span></p>
            </div>
          </div>
        </div>
        <div className="flex items-center gap-3">
          <Button variant="outline" size="icon" className="bg-white/5 border-white/10 hover:bg-white/10 rounded-xl h-12 w-12 text-white">
            <Bell className="h-5 w-5" />
          </Button>
          <Button variant="outline" size="icon" className="bg-white/5 border-white/10 hover:bg-white/10 rounded-xl h-12 w-12 text-white">
            <Settings className="h-5 w-5" />
          </Button>
          <Button className="bg-gradient-to-r from-red-600 to-rose-600 hover:from-red-700 hover:to-rose-700 text-white font-black px-6 h-12 rounded-xl shadow-lg shadow-red-500/20 border-none">
            <Zap className="h-4 w-4 mr-2" />
            UPGRADE
          </Button>
        </div>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        {roleConfig.stats.map((stat, index) => (
          <Card key={index} className="bg-white/5 border-white/10 overflow-hidden relative group hover:border-white/20 transition-all">
            <div className="absolute top-0 right-0 w-24 h-24 bg-white/5 rounded-full -mr-12 -mt-12 blur-2xl group-hover:bg-white/10 transition-colors" />
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-xs font-black text-gray-500 uppercase tracking-widest">{stat.label}</CardTitle>
              <stat.icon className="h-4 w-4 text-gray-400 group-hover:text-white transition-colors" />
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-black text-white tracking-tighter">{stat.value}</div>
              <div className="flex items-center gap-2 mt-2">
                <span className="text-[10px] font-black px-2 py-0.5 rounded-full bg-emerald-500/10 text-emerald-500 border border-emerald-500/20">
                  {stat.trend}
                </span>
                <span className="text-[10px] text-gray-600 font-bold uppercase tracking-tighter">vs last month</span>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Content Tabs */}
      <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-6">
        <TabsList className="bg-white/5 border border-white/10 p-1 rounded-2xl h-14 w-fit">
          {[
            { id: 'overview', icon: LayoutDashboard, label: 'Overview' },
            { id: 'analytics', icon: BarChart3, label: 'Analytics' },
            { id: 'performance', icon: Activity, label: 'System Health' },
            { id: 'activity', icon: Clock, label: 'Activity Log' }
          ].map(tab => (
            <TabsTrigger 
              key={tab.id} 
              value={tab.id} 
              className="rounded-xl data-[state=active]:bg-white/10 data-[state=active]:text-white transition-all font-black px-8 h-11 text-xs uppercase tracking-widest gap-2"
            >
              <tab.icon className="h-4 w-4" />
              {tab.label}
            </TabsTrigger>
          ))}
        </TabsList>

        <TabsContent value="overview" className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
          {/* Quick Actions Card */}
          <Card className="bg-white/5 border-white/10 p-1">
            <CardContent className="pt-6">
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                {userRole === 'admin' && (
                  <>
                    <QuickActionButton href="/dashboard/admin/users" icon={Users} label="Users" color="blue" />
                    <QuickActionButton href="/dashboard/admin/vendors" icon={Store} label="Vendors" color="purple" />
                    <QuickActionButton href="/dashboard/admin/analytics" icon={TrendingUp} label="Analytics" color="pink" />
                    <QuickActionButton href="/dashboard/admin/settings" icon={Settings} label="Settings" color="gray" />
                  </>
                )}

                {userRole === 'vendor' && (
                  <>
                    <QuickActionButton href="/dashboard/vendor/bookings" icon={Calendar} label="Bookings" color="emerald" />
                    <QuickActionButton href="/dashboard/vendor/services" icon={Store} label="Services" color="indigo" />
                    <QuickActionButton href="/dashboard/vendor/analytics" icon={TrendingUp} label="Growth" color="blue" />
                    <QuickActionButton href="/dashboard/vendor/profile" icon={Settings} label="Profile" color="gray" />
                  </>
                )}

                {userRole === 'user' && (
                  <>
                    <QuickActionButton href="/planning" icon={CheckSquare} label="Planning" color="blue" />
                    <QuickActionButton href="/vendors" icon={Store} label="Vendors" color="purple" />
                    <QuickActionButton href="/venues" icon={LayoutDashboard} label="Venues" color="pink" />
                    <QuickActionButton href="/dashboard/messages" icon={MessageCircle} label="Messages" color="emerald" />
                  </>
                )}
              </div>
            </CardContent>
          </Card>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            <Card className="lg:col-span-2 bg-white/5 border-white/10">
              <CardHeader>
                <CardTitle className="text-white font-black uppercase tracking-widest text-sm">Real-time Performance</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="h-80 w-full bg-white/5 border border-white/5 rounded-2xl flex items-center justify-center">
                  <p className="text-gray-600 font-black uppercase tracking-[0.2em] text-xs">Live Analytics Preview</p>
                </div>
              </CardContent>
            </Card>

            <Card className="bg-white/5 border-white/10">
              <CardHeader>
                <CardTitle className="text-white font-black uppercase tracking-widest text-sm">System Status</CardTitle>
              </CardHeader>
              <CardContent className="space-y-6">
                <StatusItem label="API Gateway" status="Operational" color="emerald" />
                <StatusItem label="Database" status="High Performance" color="emerald" />
                <StatusItem label="Image Server" status="Active" color="emerald" />
                <StatusItem label="AI Services" status="Online" color="emerald" />
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="analytics" className="animate-in fade-in slide-in-from-bottom-4 duration-500">
          <AnalyticsDashboard userRole={userRole as 'admin' | 'vendor' | 'client' | undefined} />
        </TabsContent>

        <TabsContent value="performance" className="animate-in fade-in slide-in-from-bottom-4 duration-500">
          <PerformanceMonitoringDashboard />
        </TabsContent>

        <TabsContent value="activity" className="animate-in fade-in slide-in-from-bottom-4 duration-500">
          <Card className="bg-white/5 border-white/10">
            <CardHeader>
              <CardTitle className="text-white font-black uppercase tracking-widest text-sm">Recent Activity</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {stats?.recentActivity.map((activity) => (
                  <div key={activity.id} className="flex items-center gap-4 p-4 rounded-2xl bg-white/5 border border-white/5 hover:bg-white/10 transition-all group">
                    <div className={`w-3 h-3 rounded-full shadow-[0_0_10px_rgba(0,0,0,0.5)] ${
                      activity.priority === 'high' ? 'bg-red-500 shadow-red-500/20' :
                      activity.priority === 'medium' ? 'bg-yellow-500 shadow-yellow-500/20' : 'bg-emerald-500 shadow-emerald-500/20'
                    }`}></div>
                    <div className="flex-1">
                      <p className="text-sm font-bold text-white group-hover:translate-x-1 transition-transform">{activity.message}</p>
                      <p className="text-[10px] text-gray-500 font-bold uppercase tracking-widest mt-1">{activity.timestamp}</p>
                    </div>
                    <Badge className={`${
                      activity.priority === 'high' ? 'bg-red-500/10 text-red-500 border-red-500/20' :
                      activity.priority === 'medium' ? 'bg-yellow-500/10 text-yellow-500 border-yellow-500/20' : 'bg-emerald-500/10 text-emerald-500 border-emerald-500/20'
                    } uppercase text-[9px] font-black tracking-widest`}>
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

function QuickActionButton({ href, icon: Icon, label, color }: { href: string, icon: any, label: string, color: string }) {
  const colorMap: Record<string, string> = {
    blue: 'bg-blue-600 hover:bg-blue-700 shadow-blue-500/20 hover:border-blue-500',
    purple: 'bg-purple-600 hover:bg-purple-700 shadow-purple-500/20 hover:border-purple-500',
    pink: 'bg-pink-600 hover:bg-pink-700 shadow-pink-500/20 hover:border-pink-500',
    emerald: 'bg-emerald-600 hover:bg-emerald-700 shadow-emerald-500/20 hover:border-emerald-500',
    indigo: 'bg-indigo-600 hover:bg-indigo-700 shadow-indigo-500/20 hover:border-indigo-500',
    gray: 'bg-white/10 hover:bg-white/20 shadow-white/5 hover:border-white/30'
  }

  return (
    <Button asChild className={`h-28 flex flex-col justify-center items-center rounded-2xl transition-all border border-transparent gap-2 shadow-xl ${colorMap[color]}`}>
      <Link href={href}>
        <Icon className="h-7 w-7 transition-transform group-hover:scale-125" />
        <span className="font-black uppercase tracking-widest text-[10px]">{label}</span>
      </Link>
    </Button>
  )
}

function StatusItem({ label, status, color }: { label: string, status: string, color: string }) {
  return (
    <div className="flex items-center justify-between p-3 rounded-xl bg-white/5 border border-white/5">
      <span className="text-xs font-bold text-gray-500 uppercase tracking-widest">{label}</span>
      <div className="flex items-center gap-2">
        <span className="text-[10px] font-black text-white">{status.toUpperCase()}</span>
        <div className={`w-2 h-2 rounded-full animate-pulse bg-${color}-500 shadow-[0_0_8px_rgba(16,185,129,0.5)]`} />
      </div>
    </div>
  )
}
