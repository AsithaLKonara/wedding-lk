"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { 
  Users, 
  Building2, 
  Calendar, 
  Settings, 
  Shield,
  TrendingUp,
  DollarSign,
  Star,
  Activity,
  AlertTriangle,
  CheckCircle,
  Clock,
  BarChart3,
  PieChart
} from "lucide-react"
import { formatCurrency, formatNumber, getRelativeTime } from "@/lib/utils/format"

interface AdminStats {
  totalUsers: number
  totalVendors: number
  totalVenues: number
  totalBookings: number
  totalRevenue: number
  averageRating: number
  userGrowth: number
  revenueGrowth: number
}

interface RecentActivity {
  id: string
  type: "user_registration" | "vendor_approval" | "booking_created" | "payment_received"
  description: string
  timestamp: string
  status: "success" | "warning" | "error"
}

export default function AdminDashboard() {
  const router = useRouter()
  const [user, setUser] = useState(null);
  const [unauthorized, setUnauthorized] = useState(false);
  const [stats, setStats] = useState<AdminStats>({
    totalUsers: 0,
    totalVendors: 0,
    totalVenues: 0,
    totalBookings: 0,
    totalRevenue: 0,
    averageRating: 0,
    userGrowth: 0,
    revenueGrowth: 0,
  })
  const [recentActivity, setRecentActivity] = useState<RecentActivity[]>([])
  const [loading, setLoading] = useState(true)

  const fetchAdminData = async () => {
    try {
      setLoading(true)
      const analyticsResponse = await fetch("/api/dashboard/admin/analytics")
      if (analyticsResponse.ok) {
        const analyticsData = await analyticsResponse.json()
        setStats(analyticsData.analytics.platform)
      }
      const activityResponse = await fetch("/api/dashboard/admin/activity")
      if (activityResponse.ok) {
        const activityData = await activityResponse.json()
        setRecentActivity(activityData.activity)
      }
    } catch (error) {
      console.error("Error fetching admin data:", error)
    } finally {
      setLoading(false)
    }
  }

  const getActivityIcon = (type: string) => {
    switch (type) {
      case "user_registration": return <Users className="h-4 w-4" />
      case "vendor_approval": return <Building2 className="h-4 w-4" />
      case "booking_created": return <Calendar className="h-4 w-4" />
      case "payment_received": return <DollarSign className="h-4 w-4" />
      default: return <Activity className="h-4 w-4" />
    }
  }

  const getActivityColor = (status: string) => {
    switch (status) {
      case "success": return "text-green-400 bg-green-500/10 border-green-500/20"
      case "warning": return "text-yellow-400 bg-yellow-500/10 border-yellow-500/20"
      case "error": return "text-red-400 bg-red-500/10 border-red-500/20"
      default: return "text-gray-400 bg-gray-500/10 border-gray-500/20"
    }
  }

  useEffect(() => {
    fetch('/api/auth/me')
      .then(res => res.json())
      .then(data => {
        if (data.user) {
          setUser(data.user)
          if (data.user.role !== 'admin' && data.user.role !== 'maintainer') {
            setUnauthorized(true)
            setTimeout(() => { router.push('/dashboard') }, 2000)
          } else {
            fetchAdminData()
          }
        } else {
          router.push('/login')
        }
      })
      .catch(() => router.push('/login'))
  }, [router])

  if (unauthorized) {
    return (
      <div className="flex items-center justify-center min-h-[60vh]">
        <Card className="w-full max-w-md bg-white/5 border-white/10">
          <CardHeader>
            <CardTitle className="text-red-500 flex items-center gap-2 font-black">
              <AlertTriangle className="h-6 w-6" />
              Unauthorized Access
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-gray-400 font-medium">You do not have permission to access this page.</p>
            <p className="text-sm text-gray-500 mt-2 font-bold animate-pulse uppercase tracking-widest">Redirecting...</p>
          </CardContent>
        </Card>
      </div>
    )
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[60vh]">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-4 border-red-600 border-t-transparent mx-auto mb-4"></div>
          <p className="text-gray-400 font-medium animate-pulse">Loading admin console...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div className="flex items-center space-x-4">
          <div className="p-3 bg-red-500/10 border border-red-500/20 rounded-2xl shadow-lg shadow-red-500/5">
            <Shield className="h-8 w-8 text-red-500" />
          </div>
          <div>
            <h1 className="text-3xl font-black text-white tracking-tight uppercase">Admin Console</h1>
            <p className="text-gray-400 font-medium">Manage platform ecosystem</p>
          </div>
        </div>
        <Badge className="bg-red-500/10 text-red-500 border-red-500/20 px-4 py-1.5 text-[10px] font-black uppercase tracking-[0.2em] h-fit w-fit">
          Secure Access
        </Badge>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        <StatCard label="Total Users" value={formatNumber(stats.totalUsers)} trend={`+${stats.userGrowth}%`} icon={Users} color="blue" />
        <StatCard label="Vendors" value={formatNumber(stats.totalVendors)} trend="Active" icon={Building2} color="purple" />
        <StatCard label="Venues" value={formatNumber(stats.totalVenues)} trend="Live" icon={Building2} color="pink" />
        <StatCard label="Bookings" value={formatNumber(stats.totalBookings)} trend="Current" icon={Calendar} color="emerald" />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <Card className="bg-gradient-to-br from-white/10 to-white/5 border-white/10 relative overflow-hidden group">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-[10px] font-black text-gray-400 uppercase tracking-widest">Platform Revenue</CardTitle>
            <DollarSign className="h-4 w-4 text-yellow-400" />
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-black text-white">{formatCurrency(stats.totalRevenue)}</div>
            <p className="text-xs text-green-400 font-bold mt-1">+{stats.revenueGrowth}% growth</p>
          </CardContent>
        </Card>

        <Card className="bg-white/5 border-white/10">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-[10px] font-black text-gray-400 uppercase tracking-widest">Avg Rating</CardTitle>
            <Star className="h-4 w-4 text-yellow-400 fill-yellow-400" />
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-black text-white">{stats.averageRating.toFixed(1)}</div>
            <p className="text-xs text-gray-500 font-bold uppercase tracking-tighter mt-1">Platform excellence</p>
          </CardContent>
        </Card>

        <Card className="bg-white/5 border-white/10">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-[10px] font-black text-gray-400 uppercase tracking-widest">Platform Health</CardTitle>
            <CheckCircle className="h-4 w-4 text-emerald-400" />
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-black text-emerald-400">99.9%</div>
            <p className="text-xs text-gray-500 font-bold uppercase tracking-tighter mt-1">System Uptime</p>
          </CardContent>
        </Card>
      </div>

      <Tabs defaultValue="overview" className="space-y-6">
        <TabsList className="bg-white/5 border border-white/10 p-1 rounded-xl h-12 w-fit">
          <TabsTrigger value="overview" className="rounded-lg data-[state=active]:bg-white/10 data-[state=active]:text-white transition-all font-black px-6 text-[10px] uppercase tracking-widest">Overview</TabsTrigger>
          <TabsTrigger value="management" className="rounded-lg data-[state=active]:bg-white/10 data-[state=active]:text-white transition-all font-black px-6 text-[10px] uppercase tracking-widest">Management</TabsTrigger>
          <TabsTrigger value="activity" className="rounded-lg data-[state=active]:bg-white/10 data-[state=active]:text-white transition-all font-black px-6 text-[10px] uppercase tracking-widest">Activity Log</TabsTrigger>
        </TabsList>

        <TabsContent value="overview" className="space-y-6">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <Card className="bg-white/5 border-white/10">
              <CardHeader>
                <CardTitle className="text-white font-black text-xs uppercase tracking-widest">Recent Activity</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {recentActivity.slice(0, 5).map((activity) => (
                    <div key={activity.id} className="flex items-center space-x-3 p-3 rounded-xl bg-white/5 border border-white/5 group hover:bg-white/10 transition-all">
                      <div className={`p-2.5 rounded-xl border ${getActivityColor(activity.status)}`}>
                        {getActivityIcon(activity.type)}
                      </div>
                      <div className="flex-1">
                        <p className="text-sm font-bold text-white">{activity.description}</p>
                        <p className="text-[10px] text-gray-500 font-bold uppercase tracking-widest mt-0.5">{getRelativeTime(activity.timestamp)}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>

            <Card className="bg-white/5 border-white/10">
              <CardHeader>
                <CardTitle className="text-white font-black text-xs uppercase tracking-widest">Quick Actions</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-2 gap-4">
                  <QuickActionBtn icon={Users} label="Users" color="blue" />
                  <QuickActionBtn icon={Building2} label="Vendors" color="purple" />
                  <QuickActionBtn icon={BarChart3} label="Analytics" color="pink" />
                  <QuickActionBtn icon={Settings} label="Settings" color="emerald" />
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="management" className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <ManagementCard title="User Management" desc="Manage accounts and roles." btnLabel="Open Console" color="blue" />
            <ManagementCard title="Vendor Approval" desc="Review vendor applications." btnLabel="Verify Now" color="purple" />
            <ManagementCard title="System Settings" desc="Configure platform limits." btnLabel="Update" color="emerald" />
          </div>
        </TabsContent>
      </Tabs>
    </div>
  )
}

function StatCard({ label, value, trend, icon: Icon, color }: any) {
  return (
    <Card className="bg-white/5 border-white/10 group">
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
        <CardTitle className="text-[10px] font-black text-gray-500 uppercase tracking-widest">{label}</CardTitle>
        <Icon className={`h-4 w-4 text-${color}-400 opacity-50 group-hover:opacity-100 transition-opacity`} />
      </CardHeader>
      <CardContent>
        <div className="text-3xl font-black text-white">{value}</div>
        <p className="text-[10px] text-gray-500 font-bold uppercase mt-1">{trend}</p>
      </CardContent>
    </Card>
  )
}

function QuickActionBtn({ icon: Icon, label, color }: any) {
  return (
    <Button className="h-24 flex flex-col justify-center items-center bg-white/5 hover:bg-white/10 border-white/10 text-white rounded-2xl group transition-all" variant="outline">
      <Icon className={`h-6 w-6 mb-2 text-${color}-400 group-hover:scale-110 transition-transform`} />
      <span className="font-black text-[10px] uppercase tracking-widest">{label}</span>
    </Button>
  )
}

function ManagementCard({ title, desc, btnLabel, color }: any) {
  return (
    <Card className="bg-white/5 border-white/10">
      <CardHeader><CardTitle className="text-white font-black text-sm uppercase">{title}</CardTitle></CardHeader>
      <CardContent>
        <p className="text-xs text-gray-500 font-medium mb-6">{desc}</p>
        <Button className={`w-full bg-${color}-600 hover:bg-${color}-700 font-black rounded-xl h-11 text-[10px] uppercase tracking-widest`}>{btnLabel}</Button>
      </CardContent>
    </Card>
  )
}