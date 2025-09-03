"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Progress } from "@/components/ui/progress"
import { Calendar, CheckCircle, TrendingUp, Users, DollarSign, Star } from "lucide-react"
import Link from "next/link"

interface DashboardStats {
  overview: {
    totalBookings: number
    totalTasks: number
    totalVendors: number
    totalVenues: number
  }
  tasks: {
    total: number
    completed: number
    pending: number
    overdue: number
  }
  bookings: {
    total: number
    confirmed: number
    pending: number
    completed: number
  }
  budget: {
    total: number
    spent: number
    remaining: number
  }
}

interface RecentActivity {
  id: string
  type: 'booking' | 'task'
  title: string
  status: string
  date: string
  amount?: number
  priority?: string
}

export default function DashboardContent() {
  const [stats, setStats] = useState<DashboardStats>({
    overview: {
      totalBookings: 0,
      totalTasks: 0,
      totalVendors: 0,
      totalVenues: 0
    },
    tasks: {
      total: 0,
      completed: 0,
      pending: 0,
      overdue: 0
    },
    bookings: {
      total: 0,
      confirmed: 0,
      pending: 0,
      completed: 0
    },
    budget: {
      total: 0,
      spent: 0,
      remaining: 0
    }
  })

  const [recentActivity, setRecentActivity] = useState<RecentActivity[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetchDashboardData()
  }, [])

  const fetchDashboardData = async () => {
    try {
      setLoading(true)
      
      // Fetch user stats
      const statsResponse = await fetch('/api/dashboard/user-stats')
      if (statsResponse.ok) {
        const statsData = await statsResponse.json()
        setStats(statsData.stats)
      }

      // Fetch recent activity
      const activityResponse = await fetch('/api/dashboard/recent-activity')
      if (activityResponse.ok) {
        const activityData = await activityResponse.json()
        setRecentActivity(activityData.activities)
      }
    } catch (error) {
      console.error('Failed to fetch dashboard data:', error)
    } finally {
      setLoading(false)
    }
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
          <p className="mt-4 text-gray-600">Loading dashboard...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      {/* Overview Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Bookings</CardTitle>
            <Calendar className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.overview.totalBookings}</div>
            <p className="text-xs text-muted-foreground">
              {stats.bookings.confirmed} confirmed
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Tasks</CardTitle>
            <CheckCircle className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.overview.totalTasks}</div>
            <p className="text-xs text-muted-foreground">
              {stats.tasks.completed} completed
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Vendors</CardTitle>
            <Users className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.overview.totalVendors}</div>
            <p className="text-xs text-muted-foreground">
              Working with you
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Budget Used</CardTitle>
            <DollarSign className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              LKR {stats.budget.spent.toLocaleString()}
            </div>
            <p className="text-xs text-muted-foreground">
              of LKR {stats.budget.total.toLocaleString()}
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Progress Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle>Task Progress</CardTitle>
            <CardDescription>
              Track your wedding planning tasks
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <span className="text-sm font-medium">Overall Progress</span>
                <span className="text-sm text-gray-500">
                  {Math.round((stats.tasks.completed / Math.max(stats.tasks.total, 1)) * 100)}%
                </span>
              </div>
              <Progress value={(stats.tasks.completed / Math.max(stats.tasks.total, 1)) * 100} />
              
              <div className="grid grid-cols-3 gap-4 text-center">
                <div>
                  <div className="text-2xl font-bold text-green-600">{stats.tasks.completed}</div>
                  <div className="text-sm text-gray-600">Completed</div>
                </div>
                <div>
                  <div className="text-2xl font-bold text-yellow-600">{stats.tasks.pending}</div>
                  <div className="text-sm text-gray-600">Pending</div>
                </div>
                <div>
                  <div className="text-2xl font-bold text-red-600">{stats.tasks.overdue}</div>
                  <div className="text-sm text-gray-600">Overdue</div>
                </div>
              </div>
            </div>
            
            <div className="mt-4">
              <Link href="/dashboard/planner">
                <Button variant="outline" className="w-full">View All Tasks</Button>
              </Link>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Booking Status</CardTitle>
            <CardDescription>
              Overview of your venue and vendor bookings
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="grid grid-cols-2 gap-4 text-center">
                <div>
                  <div className="text-2xl font-bold text-blue-600">{stats.bookings.confirmed}</div>
                  <div className="text-sm text-gray-600">Confirmed</div>
                </div>
                <div>
                  <div className="text-2xl font-bold text-yellow-600">{stats.bookings.pending}</div>
                  <div className="text-sm text-gray-600">Pending</div>
                </div>
              </div>
              
              <div className="space-y-2">
                <div className="flex items-center justify-between text-sm">
                  <span>Confirmed Bookings</span>
                  <span className="font-medium">{stats.bookings.confirmed}</span>
                </div>
                <div className="flex items-center justify-between text-sm">
                  <span>Pending Bookings</span>
                  <span className="font-medium">{stats.bookings.pending}</span>
                </div>
                <div className="flex items-center justify-between text-sm">
                  <span>Completed Bookings</span>
                  <span className="font-medium">{stats.bookings.completed}</span>
                </div>
              </div>
            </div>
            
            <div className="mt-4">
              <Link href="/dashboard/bookings">
                <Button variant="outline" className="w-full">View All Bookings</Button>
              </Link>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Recent Activity */}
      <Card>
        <CardHeader>
          <CardTitle>Recent Activity</CardTitle>
          <CardDescription>
            Your latest bookings and task updates
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {recentActivity.length > 0 ? (
              recentActivity.map((activity) => (
                <div key={activity.id} className="flex items-center justify-between p-3 border rounded-lg">
                  <div className="flex items-center space-x-3">
                    <div className={`p-2 rounded-full ${
                      activity.type === 'booking' ? 'bg-blue-100 text-blue-600' : 'bg-green-100 text-green-600'
                    }`}>
                      {activity.type === 'booking' ? <Calendar className="h-4 w-4" /> : <CheckCircle className="h-4 w-4" />}
                    </div>
                    <div>
                      <p className="font-medium">{activity.title}</p>
                      <p className="text-sm text-gray-500">
                        {activity.type === 'booking' ? 'Booking' : 'Task'} • {activity.date}
                      </p>
                    </div>
                  </div>
                  <div className="flex items-center space-x-2">
                    <Badge variant={
                      activity.status === 'confirmed' || activity.status === 'completed' ? 'default' :
                      activity.status === 'pending' ? 'secondary' : 'destructive'
                    }>
                      {activity.status}
                    </Badge>
                    {activity.amount && (
                      <span className="text-sm font-medium text-green-600">
                        LKR {activity.amount.toLocaleString()}
                      </span>
                    )}
                    {activity.priority && (
                      <Badge variant={
                        activity.priority === 'urgent' ? 'destructive' :
                        activity.priority === 'high' ? 'default' : 'secondary'
                      }>
                        {activity.priority}
                      </Badge>
                    )}
                  </div>
                </div>
              ))
            ) : (
              <div className="text-center py-8 text-gray-500">
                <Calendar className="h-12 w-12 mx-auto mb-4 text-gray-300" />
                <p>No recent activity</p>
                <p className="text-sm">Start planning your wedding to see activity here</p>
              </div>
            )}
          </div>
          
          {recentActivity.length > 0 && (
            <div className="mt-4 text-center">
              <Link href="/dashboard/bookings">
                <Button variant="outline">View All Activity</Button>
              </Link>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Quick Actions */}
      <Card>
        <CardHeader>
          <CardTitle>Quick Actions</CardTitle>
          <CardDescription>
            Common tasks and shortcuts
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <Link href="/vendors">
              <Button variant="outline" className="w-full h-20 flex flex-col items-center justify-center space-y-2">
                <Users className="h-6 w-6" />
                <span className="text-sm">Find Vendors</span>
              </Button>
            </Link>
            
            <Link href="/venues">
              <Button variant="outline" className="w-full h-20 flex flex-col items-center justify-center space-y-2">
                <Calendar className="h-6 w-6" />
                <span className="text-sm">Book Venue</span>
              </Button>
            </Link>
            
            <Link href="/dashboard/planner">
              <Button variant="outline" className="w-full h-20 flex flex-col items-center justify-center space-y-2">
                <CheckCircle className="h-6 w-6" />
                <span className="text-sm">View Tasks</span>
              </Button>
            </Link>
            
            <Link href="/dashboard/bookings">
              <Button variant="outline" className="w-full h-20 flex flex-col items-center justify-center space-y-2">
                <TrendingUp className="h-6 w-6" />
                <span className="text-sm">Bookings</span>
              </Button>
            </Link>
          </div>
        </CardContent>
      </Card>
    </div>
  )
} 