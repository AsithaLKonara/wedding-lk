"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { 
  CheckSquare, 
  Users, 
  Calendar, 
  Settings, 
  TrendingUp, 
  FileText, 
  Clock,
  Plus,
  Edit,
  Trash2,
  Star,
  MapPin,
  Phone,
  Mail,
  Heart,
  Gift,
  Camera,
  Music,
  Utensils,
  Flower2,
  Car,
  Building2
} from "lucide-react"
import { DashboardLayout } from "@/components/layouts/dashboard-layout"
import { formatCurrency, formatNumber, getRelativeTime, daysUntil } from "@/lib/utils/format"

interface PlannerStats {
  totalTasks: number
  completedTasks: number
  activeClients: number
  upcomingEvents: number
  totalRevenue: number
  monthlyRevenue: number
  averageRating: number
  completedWeddings: number
}

interface Task {
  id: string
  title: string
  description: string
  clientId: string
  clientName: string
  category: string
  priority: "high" | "medium" | "low"
  dueDate: string
  status: "pending" | "in_progress" | "completed" | "overdue"
  estimatedHours: number
  actualHours?: number
}

interface Client {
  id: string
  name: string
  email: string
  phone: string
  weddingDate: string
  budget: number
  location: string
  status: "active" | "completed" | "on_hold"
  tasksCompleted: number
  totalTasks: number
  lastContact: string
  rating?: number
}

interface Timeline {
  id: string
  clientId: string
  clientName: string
  event: string
  date: string
  time: string
  status: "upcoming" | "completed" | "cancelled"
  category: string
  notes?: string
}

export default function PlannerDashboard() {
  const [user, setUser] = useState(null);
  const [status, setStatus] = useState('loading');
  const [stats, setStats] = useState<PlannerStats>({
    totalTasks: 0,
    completedTasks: 0,
    activeClients: 0,
    upcomingEvents: 0,
    totalRevenue: 0,
    monthlyRevenue: 0,
    averageRating: 0,
    completedWeddings: 0,
  })
  const [tasks, setTasks] = useState<Task[]>([])
  const [clients, setClients] = useState<Client[]>([])
  const [timeline, setTimeline] = useState<Timeline[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetchPlannerData()
  }, [])

  const fetchPlannerData = async () => {
    try {
      setLoading(true)
      
      // Fetch planner stats
      const statsResponse = await fetch("/api/dashboard/planner/stats")
      if (statsResponse.ok) {
        const statsData = await statsResponse.json()
        setStats(statsData.stats)
      }

      // Fetch tasks
      const tasksResponse = await fetch("/api/dashboard/planner/tasks")
      if (tasksResponse.ok) {
        const tasksData = await tasksResponse.json()
        setTasks(tasksData.tasks)
      }

      // Fetch clients
      const clientsResponse = await fetch("/api/dashboard/planner/clients")
      if (clientsResponse.ok) {
        const clientsData = await clientsResponse.json()
        setClients(clientsData.clients)
      }

      // Fetch timeline
      const timelineResponse = await fetch("/api/dashboard/planner/timeline")
      if (timelineResponse.ok) {
        const timelineData = await timelineResponse.json()
        setTimeline(timelineData.timeline)
      }
    } catch (error) {
      console.error("Error fetching planner data:", error)
    } finally {
      setLoading(false)
    }
  }

  const handleTaskAction = async (taskId: string, action: string) => {
    try {
      const response = await fetch("/api/dashboard/planner/tasks", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ taskId, action }),
      })
      
      if (response.ok) {
        fetchPlannerData() // Refresh data
      }
    } catch (error) {
      console.error("Error updating task:", error)
    }
  }

  const getTaskIcon = (category: string) => {
    switch (category.toLowerCase()) {
      case "venue":
        return <Building2 className="h-4 w-4" />
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
        return <CheckSquare className="h-4 w-4" />
    }
  }

  const getStatusColor = (status: string) => {
    switch (status) {
      case "completed":
        return "bg-green-100 text-green-800"
      case "in_progress":
        return "bg-blue-100 text-blue-800"
      case "pending":
        return "bg-yellow-100 text-yellow-800"
      case "overdue":
        return "bg-red-100 text-red-800"
      default:
        return "bg-gray-100 text-gray-800"
    }
  }

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case "high":
        return "bg-red-100 text-red-800"
      case "medium":
        return "bg-yellow-100 text-yellow-800"
      case "low":
        return "bg-green-100 text-green-800"
      default:
        return "bg-gray-100 text-gray-800"
    }
  }

  const getClientStatusColor = (status: string) => {
    switch (status) {
      case "active":
        return "bg-green-100 text-green-800"
      case "completed":
        return "bg-blue-100 text-blue-800"
      case "on_hold":
        return "bg-yellow-100 text-yellow-800"
      default:
        return "bg-gray-100 text-gray-800"
    }
  }

  if (loading) {
    return (
      <DashboardLayout>
        <div className="flex items-center justify-center min-h-96">
          <div className="text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-green-600 mx-auto mb-4"></div>
            <p className="text-gray-600">Loading planner dashboard...</p>
          </div>
        </div>
      </DashboardLayout>
    )
  }

  const taskCompletionPercentage = stats.totalTasks > 0 ? (stats.completedTasks / stats.totalTasks) * 100 : 0

  return (
    <DashboardLayout>
      <div className="space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-4">
            <div className="p-3 bg-green-100 rounded-full">
              <CheckSquare className="h-8 w-8 text-green-600" />
            </div>
            <div>
              <h1 className="text-3xl font-bold text-gray-900">Wedding Planner Dashboard</h1>
              <p className="text-gray-600 mt-1">Manage your wedding planning business</p>
            </div>
          </div>
          <div className="flex items-center space-x-2">
            <Button variant="outline" size="sm">
              <Settings className="h-4 w-4 mr-2" />
              Settings
            </Button>
          </div>
        </div>

        {/* Key Metrics */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Total Tasks</CardTitle>
              <CheckSquare className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{formatNumber(stats.totalTasks)}</div>
              <p className="text-xs text-muted-foreground">
                {stats.completedTasks} completed
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Active Clients</CardTitle>
              <Users className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{formatNumber(stats.activeClients)}</div>
              <p className="text-xs text-muted-foreground">Currently planning</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Upcoming Events</CardTitle>
              <Clock className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{formatNumber(stats.upcomingEvents)}</div>
              <p className="text-xs text-muted-foreground">Next 30 days</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Total Revenue</CardTitle>
              <TrendingUp className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{formatCurrency(stats.totalRevenue)}</div>
              <p className="text-xs text-muted-foreground">
                {formatCurrency(stats.monthlyRevenue)} this month
              </p>
            </CardContent>
          </Card>
        </div>

        {/* Progress Overview */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <Card>
            <CardHeader>
              <CardTitle>Task Completion Progress</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-2">
                <div className="flex justify-between text-sm">
                  <span>Tasks Completed</span>
                  <span>{Math.round(taskCompletionPercentage)}%</span>
                </div>
                <div className="w-full bg-gray-200 rounded-full h-2">
                  <div 
                    className="bg-green-600 h-2 rounded-full transition-all duration-300"
                    style={{ width: `${taskCompletionPercentage}%` }}
                  ></div>
                </div>
                <p className="text-xs text-gray-500">
                  {stats.completedTasks} of {stats.totalTasks} tasks completed
                </p>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Client Satisfaction</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex items-center space-x-4">
                <div className="text-3xl font-bold text-green-600">
                  {stats.averageRating.toFixed(1)}
                </div>
                <div>
                  <div className="flex items-center space-x-1">
                    {[...Array(5)].map((_, i) => (
                      <Star 
                        key={i} 
                        className={`h-4 w-4 ${
                          i < Math.floor(stats.averageRating) 
                            ? "text-yellow-400 fill-current" 
                            : "text-gray-300"
                        }`} 
                      />
                    ))}
                  </div>
                  <p className="text-xs text-gray-500">
                    Based on {stats.completedWeddings} completed weddings
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Main Content Tabs */}
        <Tabs defaultValue="overview" className="space-y-6">
          <TabsList className="grid w-full grid-cols-5">
            <TabsTrigger value="overview">Overview</TabsTrigger>
            <TabsTrigger value="tasks">Tasks</TabsTrigger>
            <TabsTrigger value="clients">Clients</TabsTrigger>
            <TabsTrigger value="timeline">Timeline</TabsTrigger>
            <TabsTrigger value="settings">Settings</TabsTrigger>
          </TabsList>

          <TabsContent value="overview" className="space-y-6">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center">
                    <TrendingUp className="h-5 w-5 mr-2" />
                    Recent Activity
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <div className="flex items-center space-x-3">
                      <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                      <div className="flex-1">
                        <p className="text-sm font-medium">New client added</p>
                        <p className="text-xs text-gray-500">2 hours ago</p>
                      </div>
                    </div>
                    <div className="flex items-center space-x-3">
                      <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
                      <div className="flex-1">
                        <p className="text-sm font-medium">Task completed</p>
                        <p className="text-xs text-gray-500">4 hours ago</p>
                      </div>
                    </div>
                    <div className="flex items-center space-x-3">
                      <div className="w-2 h-2 bg-yellow-500 rounded-full"></div>
                      <div className="flex-1">
                        <p className="text-sm font-medium">Wedding scheduled</p>
                        <p className="text-xs text-gray-500">1 day ago</p>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle>Quick Actions</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="text-sm font-medium">Task Management</p>
                        <p className="text-xs text-gray-500">Manage planning tasks</p>
                      </div>
                      <Button size="sm" variant="outline">
                        Manage Tasks
                      </Button>
                    </div>
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="text-sm font-medium">Client Management</p>
                        <p className="text-xs text-gray-500">Manage client relationships</p>
                      </div>
                      <Button size="sm" variant="outline">
                        Manage Clients
                      </Button>
                    </div>
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="text-sm font-medium">Timeline Planning</p>
                        <p className="text-xs text-gray-500">Create wedding timelines</p>
                      </div>
                      <Button size="sm" variant="outline">
                        View Timeline
                      </Button>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          <TabsContent value="tasks" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center justify-between">
                  <span>Task Management</span>
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
                          <p className="text-sm text-gray-500">{task.clientName}</p>
                          <p className="text-sm text-gray-500">{task.category}</p>
                        </div>
                      </div>
                      <div className="flex items-center space-x-2">
                        <Badge className={getStatusColor(task.status)}>
                          {task.status.replace("_", " ")}
                        </Badge>
                        <Badge className={getPriorityColor(task.priority)}>
                          {task.priority}
                        </Badge>
                        <span className="text-sm text-gray-500">
                          Due: {new Date(task.dueDate).toLocaleDateString()}
                        </span>
                        {task.status === "pending" && (
                          <Button
                            size="sm"
                            variant="outline"
                            onClick={() => handleTaskAction(task.id, "start")}
                          >
                            Start
                          </Button>
                        )}
                        {task.status === "in_progress" && (
                          <Button
                            size="sm"
                            variant="outline"
                            onClick={() => handleTaskAction(task.id, "complete")}
                          >
                            Complete
                          </Button>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="clients" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center justify-between">
                  <span>Client Management</span>
                  <Button size="sm">
                    <Plus className="h-4 w-4 mr-2" />
                    Add Client
                  </Button>
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {clients.map((client) => (
                    <div key={client.id} className="flex items-center justify-between p-4 border rounded-lg">
                      <div className="flex items-center space-x-3">
                        <div className="w-10 h-10 bg-blue-100 rounded-full flex items-center justify-center">
                          <Users className="h-5 w-5 text-blue-600" />
                        </div>
                        <div>
                          <p className="font-medium">{client.name}</p>
                          <p className="text-sm text-gray-500">{client.email}</p>
                          <p className="text-sm text-gray-500">
                            Wedding: {new Date(client.weddingDate).toLocaleDateString()}
                          </p>
                        </div>
                      </div>
                      <div className="flex items-center space-x-2">
                        <Badge className={getClientStatusColor(client.status)}>
                          {client.status.replace("_", " ")}
                        </Badge>
                        <span className="text-sm text-gray-500">
                          {client.tasksCompleted}/{client.totalTasks} tasks
                        </span>
                        <span className="text-sm font-medium">
                          {formatCurrency(client.budget)}
                        </span>
                        {client.rating && (
                          <div className="flex items-center space-x-1">
                            <Star className="h-4 w-4 text-yellow-400 fill-current" />
                            <span className="text-sm">{client.rating.toFixed(1)}</span>
                          </div>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="timeline" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center justify-between">
                  <span>Wedding Timeline</span>
                  <Button size="sm">
                    <Plus className="h-4 w-4 mr-2" />
                    Add Event
                  </Button>
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {timeline.map((event) => (
                    <div key={event.id} className="flex items-center justify-between p-4 border rounded-lg">
                      <div className="flex items-center space-x-3">
                        <div className="p-2 bg-purple-100 rounded-lg">
                          <Calendar className="h-5 w-5 text-purple-600" />
                        </div>
                        <div>
                          <p className="font-medium">{event.event}</p>
                          <p className="text-sm text-gray-500">{event.clientName}</p>
                          <p className="text-sm text-gray-500">{event.category}</p>
                        </div>
                      </div>
                      <div className="flex items-center space-x-2">
                        <Badge className={getStatusColor(event.status)}>
                          {event.status}
                        </Badge>
                        <span className="text-sm text-gray-500">
                          {new Date(event.date).toLocaleDateString()}
                        </span>
                        <span className="text-sm text-gray-500">{event.time}</span>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="settings" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center">
                  <Settings className="h-5 w-5 mr-2" />
                  Account Settings
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="flex items-center justify-between p-4 border rounded-lg">
                    <div className="flex items-center space-x-3">
                      <div className="w-10 h-10 bg-gray-100 rounded-full flex items-center justify-center">
                        <Settings className="h-5 w-5 text-gray-600" />
                      </div>
                      <div>
                        <p className="font-medium">Account Configuration</p>
                        <p className="text-sm text-gray-500">Manage your account settings</p>
                      </div>
                    </div>
                    <Button>Configure</Button>
                  </div>
                  <p className="text-sm text-gray-600">
                    Settings functionality will be implemented here. This will include account preferences, 
                    notification settings, and business profile management.
                  </p>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </DashboardLayout>
  )
}