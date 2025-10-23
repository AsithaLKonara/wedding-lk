"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { 
  Calendar, 
  Heart, 
  CreditCard, 
  MessageSquare, 
  Settings, 
  Bell,
  User,
  LogOut,
  Plus,
  CheckCircle,
  Clock,
  Star,
  MapPin,
  Camera,
  Music,
  Utensils,
  Flower2,
  Gift,
  Car
} from "lucide-react"
// DashboardLayout is now handled by the main layout
import { formatCurrency, daysUntil, getRelativeTime } from "@/lib/utils/format"

interface UserStats {
  daysUntilWedding: number
  tasksCompleted: number
  totalTasks: number
  budgetUsed: number
  totalBudget: number
  newMessages: number
  favoriteVendors: number
  upcomingEvents: number
}

interface WeddingTask {
  id: string
  title: string
  category: string
  dueDate: string
  status: "completed" | "pending" | "overdue"
  priority: "high" | "medium" | "low"
}

interface UpcomingEvent {
  id: string
  title: string
  date: string
  time: string
  type: "meeting" | "consultation" | "tasting" | "fitting" | "rehearsal"
  vendor: string
  location: string
}

interface RecentActivity {
  id: string
  action: string
  timestamp: string
  status: "completed" | "pending"
}

export default function UserDashboard() {
  const [user, setUser] = useState(null);
  const [status, setStatus] = useState('loading');
  const [stats, setStats] = useState<UserStats>({
    daysUntilWedding: 0,
    tasksCompleted: 0,
    totalTasks: 0,
    budgetUsed: 0,
    totalBudget: 0,
    newMessages: 0,
    favoriteVendors: 0,
    upcomingEvents: 0,
  })
  const [tasks, setTasks] = useState<WeddingTask[]>([])
  const [upcomingEvents, setUpcomingEvents] = useState<UpcomingEvent[]>([])
  const [recentActivity, setRecentActivity] = useState<RecentActivity[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetchUserData()
  }, [])

  const fetchUserData = async () => {
    try {
      setLoading(true)
      
      // Fetch user stats from database
      const statsResponse = await fetch("/api/dashboard/user/stats")
      if (statsResponse.ok) {
        const statsData = await statsResponse.json()
        if (statsData.success) {
          setStats(statsData.stats)
        }
      }

      // Fetch tasks from database
      const tasksResponse = await fetch("/api/dashboard/user/tasks")
      if (tasksResponse.ok) {
        const tasksData = await tasksResponse.json()
        if (tasksData.success) {
          setTasks(tasksData.tasks)
        }
      }

      // Fetch upcoming events from database
      const eventsResponse = await fetch("/api/dashboard/user/events")
      if (eventsResponse.ok) {
        const eventsData = await eventsResponse.json()
        if (eventsData.success) {
          setUpcomingEvents(eventsData.events)
        }
      }

      // Fetch recent activity from database
      const activityResponse = await fetch("/api/dashboard/user/activity")
      if (activityResponse.ok) {
        const activityData = await activityResponse.json()
        if (activityData.success) {
          setRecentActivity(activityData.activity)
        }
      }
    } catch (error) {
      console.error("Error fetching user data:", error)
      // Set fallback data if API fails
      setStats({
        daysUntilWedding: 45,
        tasksCompleted: 0,
        totalTasks: 0,
        budgetUsed: 0,
        totalBudget: 500000,
        newMessages: 3,
        favoriteVendors: 5,
        upcomingEvents: 0,
      })
    } finally {
      setLoading(false)
    }
  }

  const getTaskIcon = (category: string) => {
    switch (category.toLowerCase()) {
      case "venue":
        return <MapPin className="h-4 w-4" />
      case "photography":
        return <Camera className="h-4 w-4" />
      case "music":
        return <Music className="h-4 w-4" />
      case "catering":
        return <Utensils className="h-4 w-4" />
      case "flowers":
        return <Flower2 className="h-4 w-4" />
      case "gifts":
        return <Gift className="h-4 w-4" />
      case "transportation":
        return <Car className="h-4 w-4" />
      default:
        return <Calendar className="h-4 w-4" />
    }
  }

  const getEventTypeColor = (type: string) => {
    switch (type) {
      case "meeting":
        return "bg-blue-100 text-blue-800"
      case "consultation":
        return "bg-purple-100 text-purple-800"
      case "tasting":
        return "bg-green-100 text-green-800"
      case "fitting":
        return "bg-pink-100 text-pink-800"
      case "rehearsal":
        return "bg-orange-100 text-orange-800"
      default:
        return "bg-gray-100 text-gray-800"
    }
  }

  const getTaskStatusColor = (status: string) => {
    switch (status) {
      case "completed":
        return "bg-green-100 text-green-800"
      case "pending":
        return "bg-yellow-100 text-yellow-800"
      case "overdue":
        return "bg-red-100 text-red-800"
      default:
        return "bg-gray-100 text-gray-800"
    }
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-96">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-purple-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Loading your wedding dashboard...</p>
        </div>
      </div>
    )
  }

  const progressPercentage = stats.totalTasks > 0 ? (stats.tasksCompleted / stats.totalTasks) * 100 : 0
  const budgetPercentage = stats.totalBudget > 0 ? (stats.budgetUsed / stats.totalBudget) * 100 : 0

  return (
    <div className="space-y-6">
      {/* Wedding Planning Section */}
      <div className="flex items-center space-x-4">
        <div className="p-3 bg-purple-100 rounded-full">
          <Heart className="h-8 w-8 text-purple-600" />
        </div>
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Wedding Planning Dashboard</h1>
          <p className="text-gray-600 mt-1">Plan your perfect wedding day</p>
        </div>
      </div>

        {/* Key Metrics */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          <Card>
            <CardContent className="p-6">
              <div className="flex items-center">
                <div className="p-2 bg-blue-100 rounded-lg">
                  <Calendar className="h-6 w-6 text-blue-600" />
                </div>
                <div className="ml-4">
                  <p className="text-sm font-medium text-gray-600">Days Until Wedding</p>
                  <p className="text-2xl font-bold text-gray-900">{stats.daysUntilWedding}</p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-6">
              <div className="flex items-center">
                <div className="p-2 bg-green-100 rounded-lg">
                  <CheckCircle className="h-6 w-6 text-green-600" />
                </div>
                <div className="ml-4">
                  <p className="text-sm font-medium text-gray-600">Tasks Completed</p>
                  <p className="text-2xl font-bold text-gray-900">
                    {stats.tasksCompleted}/{stats.totalTasks}
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-6">
              <div className="flex items-center">
                <div className="p-2 bg-purple-100 rounded-lg">
                  <CreditCard className="h-6 w-6 text-purple-600" />
                </div>
                <div className="ml-4">
                  <p className="text-sm font-medium text-gray-600">Budget Used</p>
                  <p className="text-2xl font-bold text-gray-900">
                    {formatCurrency(stats.budgetUsed)}
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-6">
              <div className="flex items-center">
                <div className="p-2 bg-orange-100 rounded-lg">
                  <MessageSquare className="h-6 w-6 text-orange-600" />
                </div>
                <div className="ml-4">
                  <p className="text-sm font-medium text-gray-600">New Messages</p>
                  <p className="text-2xl font-bold text-gray-900">{stats.newMessages}</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Progress Bars */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <Card>
            <CardHeader>
              <CardTitle>Task Progress</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-2">
                <div className="flex justify-between text-sm">
                  <span>Tasks Completed</span>
                  <span>{Math.round(progressPercentage)}%</span>
                </div>
                <div className="w-full bg-gray-200 rounded-full h-2">
                  <div 
                    className="bg-green-600 h-2 rounded-full transition-all duration-300"
                    style={{ width: `${progressPercentage}%` }}
                  ></div>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Budget Progress</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-2">
                <div className="flex justify-between text-sm">
                  <span>Budget Used</span>
                  <span>{Math.round(budgetPercentage)}%</span>
                </div>
                <div className="w-full bg-gray-200 rounded-full h-2">
                  <div 
                    className="bg-purple-600 h-2 rounded-full transition-all duration-300"
                    style={{ width: `${budgetPercentage}%` }}
                  ></div>
                </div>
                <p className="text-xs text-gray-500">
                  {formatCurrency(stats.budgetUsed)} of {formatCurrency(stats.totalBudget)}
                </p>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Main Content Tabs */}
        <Tabs defaultValue="overview" className="space-y-6">
          <TabsList className="grid w-full grid-cols-4">
            <TabsTrigger value="overview">Overview</TabsTrigger>
            <TabsTrigger value="tasks">Tasks</TabsTrigger>
            <TabsTrigger value="events">Events</TabsTrigger>
            <TabsTrigger value="activity">Activity</TabsTrigger>
          </TabsList>

          <TabsContent value="overview" className="space-y-6">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <Card>
                <CardHeader>
                  <CardTitle>Recent Activity</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {recentActivity.slice(0, 5).map((activity) => (
                      <div key={activity.id} className="flex items-center space-x-3 p-3 rounded-lg hover:bg-gray-50">
                        <div className={`w-2 h-2 rounded-full ${
                          activity.status === 'completed' ? 'bg-green-500' : 'bg-yellow-500'
                        }`} />
                        <div className="flex-1">
                          <p className="text-sm font-medium text-gray-900">{activity.action}</p>
                          <p className="text-xs text-gray-500">
                            {getRelativeTime(activity.timestamp)}
                          </p>
                        </div>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle>Quick Actions</CardTitle>
                </CardHeader>
                <CardContent className="space-y-3">
                  <Button className="w-full justify-start" variant="outline">
                    <Calendar className="h-4 w-4 mr-2" />
                    Schedule Meeting
                  </Button>
                  <Button className="w-full justify-start" variant="outline">
                    <Plus className="h-4 w-4 mr-2" />
                    Add Task
                  </Button>
                  <Button className="w-full justify-start" variant="outline">
                    <CreditCard className="h-4 w-4 mr-2" />
                    Track Expense
                  </Button>
                  <Button className="w-full justify-start" variant="outline">
                    <MessageSquare className="h-4 w-4 mr-2" />
                    Contact Vendor
                  </Button>
                  <Button className="w-full justify-start" variant="outline">
                    <Settings className="h-4 w-4 mr-2" />
                    Update Profile
                  </Button>
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          <TabsContent value="tasks" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center justify-between">
                  <span>Wedding Tasks</span>
                  <Button size="sm">
                    <Plus className="h-4 w-4 mr-2" />
                    Add Task
                  </Button>
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {tasks.map((task) => (
                    <div key={task.id} className="flex items-center justify-between p-4 border rounded-lg">
                      <div className="flex items-center space-x-3">
                        <div className="p-2 bg-gray-100 rounded-lg">
                          {getTaskIcon(task.category)}
                        </div>
                        <div>
                          <p className="font-medium">{task.title}</p>
                          <p className="text-sm text-gray-500">{task.category}</p>
                        </div>
                      </div>
                      <div className="flex items-center space-x-2">
                        <Badge className={getTaskStatusColor(task.status)}>
                          {task.status}
                        </Badge>
                        <span className="text-sm text-gray-500">
                          Due: {new Date(task.dueDate).toLocaleDateString()}
                        </span>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="events" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Upcoming Events</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {upcomingEvents.map((event) => (
                    <div key={event.id} className="p-4 border rounded-lg">
                      <div className="flex items-center justify-between">
                        <div>
                          <p className="font-medium">{event.title}</p>
                          <p className="text-sm text-gray-500">{event.vendor}</p>
                          <p className="text-sm text-gray-500">{event.location}</p>
                        </div>
                        <div className="text-right">
                          <p className="text-sm font-medium">{event.date}</p>
                          <p className="text-sm text-gray-500">{event.time}</p>
                          <Badge className={getEventTypeColor(event.type)}>
                            {event.type}
                          </Badge>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="activity" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Activity Timeline</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {recentActivity.map((activity) => (
                    <div key={activity.id} className="flex items-center space-x-3 p-3 border rounded-lg">
                      <div className={`w-3 h-3 rounded-full ${
                        activity.status === 'completed' ? 'bg-green-500' : 'bg-yellow-500'
                      }`} />
                      <div className="flex-1">
                        <p className="text-sm font-medium">{activity.action}</p>
                        <p className="text-xs text-gray-500">
                          {getRelativeTime(activity.timestamp)}
                        </p>
                      </div>
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