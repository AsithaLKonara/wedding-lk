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
  Clock,
  Plus,
  Star,
  Camera,
  Music,
  Utensils,
  Flower2,
  Car,
  Building2,
  Activity,
  Gift,
  Zap
} from "lucide-react"

import { formatCurrency, formatNumber, getRelativeTime } from "@/lib/utils/format"

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
}

export default function PlannerDashboard() {
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
      const statsResponse = await fetch("/api/dashboard/planner/stats")
      if (statsResponse.ok) {
        const statsData = await statsResponse.json()
        setStats(statsData.stats)
      }
      const tasksResponse = await fetch("/api/dashboard/planner/tasks")
      if (tasksResponse.ok) {
        const tasksData = await tasksResponse.json()
        setTasks(tasksData.tasks)
      }
      const clientsResponse = await fetch("/api/dashboard/planner/clients")
      if (clientsResponse.ok) {
        const clientsData = await clientsResponse.json()
        setClients(clientsData.clients)
      }
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
      if (response.ok) fetchPlannerData()
    } catch (error) {
      console.error("Error updating task:", error)
    }
  }

  const getTaskIcon = (category: string) => {
    switch (category.toLowerCase()) {
      case "venue": return <Building2 className="h-4 w-4" />
      case "photography": return <Camera className="h-4 w-4" />
      case "music": return <Music className="h-4 w-4" />
      case "catering": return <Utensils className="h-4 w-4" />
      case "flowers": return <Flower2 className="h-4 w-4" />
      case "gifts": return <Gift className="h-4 w-4" />
      case "transportation": return <Car className="h-4 w-4" />
      default: return <CheckSquare className="h-4 w-4" />
    }
  }

  const getStatusColor = (status: string) => {
    switch (status) {
      case "completed": return "bg-green-500/10 text-green-500 border-green-500/20"
      case "in_progress": return "bg-blue-500/10 text-blue-500 border-blue-500/20"
      case "pending": return "bg-yellow-500/10 text-yellow-500 border-yellow-500/20"
      case "overdue": return "bg-red-500/10 text-red-500 border-red-500/20"
      default: return "bg-gray-500/10 text-gray-500 border-gray-500/20"
    }
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[60vh]">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-4 border-purple-600 border-t-transparent mx-auto mb-4"></div>
          <p className="text-gray-400 font-medium">Loading planner workspace...</p>
        </div>
      </div>
    );
  }

  const taskCompletionPercentage = stats.totalTasks > 0 ? (stats.completedTasks / stats.totalTasks) * 100 : 0

  return (
    <div className="space-y-6">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div className="flex items-center space-x-4">
          <div className="p-3 bg-purple-500/10 border border-purple-500/20 rounded-2xl shadow-lg shadow-purple-500/5">
            <CheckSquare className="h-8 w-8 text-purple-500" />
          </div>
          <div>
            <h1 className="text-3xl font-black text-white tracking-tight uppercase">Planner Studio</h1>
            <p className="text-gray-400 font-medium">Manage your portfolio and clients</p>
          </div>
        </div>
        <div className="flex items-center space-x-2">
          <Button variant="outline" className="bg-white/5 border-white/10 hover:bg-white/10 text-white rounded-xl h-10 px-4">
            <Settings className="h-4 w-4 mr-2" />
            Settings
          </Button>
          <Button className="bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 text-white border-none rounded-xl h-10 px-6 font-black shadow-lg shadow-purple-500/20">
            <Plus className="h-4 w-4 mr-2" />
            NEW PROJECT
          </Button>
        </div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        <MetricCard label="Active Tasks" value={stats.totalTasks} trend={`${stats.completedTasks} Done`} icon={CheckSquare} color="purple" />
        <MetricCard label="Live Clients" value={stats.activeClients} trend="Currently Planning" icon={Users} color="blue" />
        <MetricCard label="Avg Rating" value={stats.averageRating.toFixed(1)} trend={`${stats.completedWeddings} Events`} icon={Star} color="yellow" />
        <MetricCard label="Total Revenue" value={formatCurrency(stats.totalRevenue)} trend={formatCurrency(stats.monthlyRevenue)} icon={TrendingUp} color="emerald" />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card className="bg-white/5 border-white/10">
          <CardHeader><CardTitle className="text-xs font-black text-gray-500 uppercase tracking-widest">Global Progress</CardTitle></CardHeader>
          <CardContent>
            <div className="flex justify-between items-end mb-4">
              <div>
                <p className="text-4xl font-black text-white">{Math.round(taskCompletionPercentage)}%</p>
                <p className="text-[10px] text-gray-600 font-black uppercase">Tasks Finished</p>
              </div>
              <p className="text-sm font-bold text-gray-400">{stats.completedTasks} / {stats.totalTasks}</p>
            </div>
            <div className="w-full bg-white/5 rounded-full h-2">
              <div className="bg-gradient-to-r from-purple-500 to-pink-500 h-2 rounded-full shadow-lg shadow-purple-500/20" style={{ width: `${taskCompletionPercentage}%` }} />
            </div>
          </CardContent>
        </Card>
        <Card className="bg-white/5 border-white/10 flex items-center px-8">
          <div className="flex-1">
            <h3 className="text-xl font-black text-white mb-1">Scale Your Business</h3>
            <p className="text-xs text-gray-400 font-medium">Unlock premium tools for faster planning</p>
          </div>
          <Button className="bg-white/5 hover:bg-white/10 text-white border-white/10 font-black h-12 rounded-xl px-6">
            <Zap className="h-4 w-4 mr-2 text-yellow-400" />
            GO PRO
          </Button>
        </Card>
      </div>

      <Tabs defaultValue="overview" className="space-y-6">
        <TabsList className="bg-white/5 border border-white/10 p-1 rounded-xl h-12">
          <TabsTrigger value="overview" className="rounded-lg data-[state=active]:bg-white/10 font-black px-6 text-[10px] uppercase tracking-widest">Overview</TabsTrigger>
          <TabsTrigger value="tasks" className="rounded-lg data-[state=active]:bg-white/10 font-black px-6 text-[10px] uppercase tracking-widest">Tasks</TabsTrigger>
          <TabsTrigger value="clients" className="rounded-lg data-[state=active]:bg-white/10 font-black px-6 text-[10px] uppercase tracking-widest">Clients</TabsTrigger>
          <TabsTrigger value="timeline" className="rounded-lg data-[state=active]:bg-white/10 font-black px-6 text-[10px] uppercase tracking-widest">Timeline</TabsTrigger>
        </TabsList>

        <TabsContent value="overview" className="space-y-6">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <Card className="bg-white/5 border-white/10">
              <CardHeader><CardTitle className="text-xs font-black text-white uppercase tracking-widest">Recent Activity</CardTitle></CardHeader>
              <CardContent className="space-y-4">
                <ActivityRow label="New client added" time="2h ago" color="emerald" />
                <ActivityRow label="Task 'Venue Setup' done" time="4h ago" color="blue" />
                <ActivityRow label="Budget approved" time="1d ago" color="purple" />
              </CardContent>
            </Card>
            <Card className="bg-white/5 border-white/10">
              <CardHeader><CardTitle className="text-xs font-black text-white uppercase tracking-widest">Quick Actions</CardTitle></CardHeader>
              <CardContent className="grid grid-cols-2 gap-4">
                <ActionBtn icon={CheckSquare} label="Manage Tasks" color="blue" />
                <ActionBtn icon={Users} label="View Clients" color="purple" />
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="tasks" className="space-y-6">
          <Card className="bg-white/5 border-white/10">
            <CardHeader className="flex flex-row items-center justify-between"><CardTitle className="text-xs font-black text-white uppercase tracking-widest">Planning Queue</CardTitle></CardHeader>
            <CardContent className="space-y-4">
              {tasks.map(task => (
                <div key={task.id} className="flex items-center justify-between p-4 bg-white/5 border border-white/10 rounded-2xl hover:bg-white/10 transition-all">
                  <div className="flex items-center space-x-4">
                    <div className="p-3 bg-white/5 border border-white/10 rounded-xl text-gray-500">{getTaskIcon(task.category)}</div>
                    <div>
                      <p className="font-bold text-white">{task.title}</p>
                      <p className="text-[10px] text-gray-500 font-black uppercase tracking-tighter">{task.clientName} • {task.category}</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-4">
                    <Badge className={`${getStatusColor(task.status)} uppercase text-[9px] font-black tracking-widest`}>{task.status.replace('_', ' ')}</Badge>
                    <Button size="sm" variant="ghost" className="text-[10px] font-black uppercase tracking-widest text-purple-400" onClick={() => handleTaskAction(task.id, 'complete')}>Complete</Button>
                  </div>
                </div>
              ))}
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="timeline" className="space-y-6">
          <Card className="bg-white/5 border-white/10">
            <CardHeader><CardTitle className="text-xs font-black text-white uppercase tracking-widest">Event Timeline</CardTitle></CardHeader>
            <CardContent className="space-y-6">
              {timeline.map(event => (
                <div key={event.id} className="flex gap-6 group">
                  <div className="w-12 h-12 bg-white/5 border-2 border-white/5 rounded-2xl flex items-center justify-center text-pink-400 shadow-xl group-hover:border-pink-500/30 transition-all"><Clock className="h-5 w-5" /></div>
                  <div className="flex-1 p-4 bg-white/5 border border-white/10 rounded-2xl">
                    <div className="flex justify-between items-center mb-1">
                      <h4 className="font-black text-white">{event.event}</h4>
                      <span className="text-[10px] font-black text-pink-400 uppercase tracking-widest">{event.category}</span>
                    </div>
                    <p className="text-[10px] text-gray-500 font-bold uppercase">{event.clientName} • {event.date} at {event.time}</p>
                  </div>
                </div>
              ))}
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  )
}

function MetricCard({ label, value, trend, icon: Icon, color }: any) {
  return (
    <Card className="bg-white/5 border-white/10 group overflow-hidden relative">
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
        <CardTitle className="text-[10px] font-black text-gray-500 uppercase tracking-widest">{label}</CardTitle>
        <Icon className={`h-4 w-4 text-${color}-400 opacity-50 group-hover:opacity-100 transition-opacity`} />
      </CardHeader>
      <CardContent>
        <div className="text-3xl font-black text-white tracking-tighter">{value}</div>
        <p className="text-[10px] text-gray-500 font-bold uppercase mt-1 tracking-tight">{trend}</p>
      </CardContent>
    </Card>
  )
}

function ActivityRow({ label, time, color }: any) {
  return (
    <div className="flex items-center space-x-3 p-3 rounded-xl bg-white/5 border border-white/5">
      <div className={`w-2 h-2 bg-${color}-500 rounded-full animate-pulse shadow-[0_0_8px_rgba(0,0,0,0.5)]`} />
      <div className="flex-1">
        <p className="text-sm font-bold text-white">{label}</p>
        <p className="text-[10px] text-gray-600 font-black uppercase mt-0.5">{time}</p>
      </div>
    </div>
  )
}

function ActionBtn({ icon: Icon, label, color }: any) {
  return (
    <Button variant="outline" className="h-24 flex flex-col justify-center items-center bg-white/5 border-white/10 hover:bg-white/10 text-white rounded-2xl group transition-all">
      <Icon className={`h-6 w-6 mb-2 text-${color}-400 group-hover:scale-110 transition-transform`} />
      <span className="font-black text-[10px] uppercase tracking-widest">{label}</span>
    </Button>
  )
}