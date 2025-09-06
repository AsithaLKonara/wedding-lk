"use client"

import { useState, useEffect } from "react"
import { useSession } from "next-auth/react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Progress } from "@/components/ui/progress"
import { Calendar, CheckCircle, Clock, AlertCircle, Plus } from "lucide-react"
import { formatDate } from "@/lib/utils/format"

interface PlanningTask {
  id: string
  title: string
  description: string
  category: string
  priority: 'low' | 'medium' | 'high'
  status: 'pending' | 'in_progress' | 'completed'
  dueDate: string
  completedDate?: string
  estimatedHours: number
  actualHours?: number
}

export default function PlanningPage() {
  const { data: session } = useSession()
  const [tasks, setTasks] = useState<PlanningTask[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetchTasks()
  }, [])

  const fetchTasks = async () => {
    try {
      setLoading(true)
      const response = await fetch('/api/tasks?limit=20')
      if (response.ok) {
        const data = await response.json()
        if (data.success) {
          const formattedTasks = data.tasks.map((task: any) => ({
            id: task._id,
            title: task.title,
            description: task.description,
            category: task.category,
            priority: task.priority,
            status: task.status,
            dueDate: task.dueDate,
            completedDate: task.completedAt,
            estimatedHours: task.estimatedHours || 0,
            actualHours: task.actualHours || 0
          }))
          setTasks(formattedTasks)
        }
      }
    } catch (error) {
      console.error('Error fetching tasks:', error)
      // Fallback to empty array if API fails
      setTasks([])
    } finally {
      setLoading(false)
    }
  }

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'high': return 'bg-red-100 text-red-800'
      case 'medium': return 'bg-yellow-100 text-yellow-800'
      case 'low': return 'bg-green-100 text-green-800'
      default: return 'bg-gray-100 text-gray-800'
    }
  }

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'completed': return <CheckCircle className="h-5 w-5 text-green-500" />
      case 'in_progress': return <Clock className="h-5 w-5 text-blue-500" />
      case 'pending': return <AlertCircle className="h-5 w-5 text-yellow-500" />
      default: return <Clock className="h-5 w-5 text-gray-500" />
    }
  }

  const completedTasks = tasks.filter(task => task.status === 'completed').length
  const totalTasks = tasks.length
  const progressPercentage = totalTasks > 0 ? (completedTasks / totalTasks) * 100 : 0

  if (loading) {
    return (
      <div className="container mx-auto p-6">
        <div className="flex items-center justify-center h-64">
          <div className="text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-pink-500 mx-auto mb-4"></div>
            <p className="text-gray-600">Loading your planning tasks...</p>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="container mx-auto p-6">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900 mb-2">Wedding Planning</h1>
        <p className="text-gray-600">Track your wedding planning progress and tasks</p>
      </div>

      {/* Progress Overview */}
      <Card className="mb-8">
        <CardHeader>
          <CardTitle className="flex items-center">
            <Calendar className="h-5 w-5 mr-2" />
            Planning Progress
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <div className="flex justify-between text-sm">
              <span>Overall Progress</span>
              <span>{completedTasks} of {totalTasks} tasks completed</span>
            </div>
            <Progress value={progressPercentage} className="h-2" />
            <div className="text-2xl font-bold text-pink-600">
              {Math.round(progressPercentage)}%
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Tasks List */}
      <div className="space-y-6">
        <div className="flex justify-between items-center">
          <h2 className="text-2xl font-semibold text-gray-900">Planning Tasks</h2>
          <Button>
            <Plus className="h-4 w-4 mr-2" />
            Add Task
          </Button>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {tasks.map((task) => (
            <Card key={task.id} className="hover:shadow-lg transition-shadow">
              <CardHeader>
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <CardTitle className="text-lg mb-2">{task.title}</CardTitle>
                    <CardDescription className="mb-3">
                      {task.description}
                    </CardDescription>
                  </div>
                  <div className="flex items-center space-x-2">
                    {getStatusIcon(task.status)}
                    <Badge className={getPriorityColor(task.priority)}>
                      {task.priority}
                    </Badge>
                  </div>
                </div>
              </CardHeader>
              
              <CardContent>
                <div className="space-y-3">
                  <div className="flex items-center text-sm text-gray-600">
                    <Calendar className="h-4 w-4 mr-2" />
                    Due: {formatDate(task.dueDate)}
                  </div>
                  
                  <div className="flex items-center text-sm text-gray-600">
                    <Clock className="h-4 w-4 mr-2" />
                    Estimated: {task.estimatedHours}h
                    {task.actualHours && (
                      <span className="ml-2">• Actual: {task.actualHours}h</span>
                    )}
                  </div>
                  
                  <div className="flex items-center text-sm text-gray-600">
                    <Badge variant="outline">{task.category}</Badge>
                  </div>
                  
                  {task.completedDate && (
                    <div className="flex items-center text-sm text-green-600">
                      <CheckCircle className="h-4 w-4 mr-2" />
                      Completed: {formatDate(task.completedDate)}
                    </div>
                  )}
                  
                  <div className="flex gap-2 pt-2">
                    <Button size="sm" variant="outline" className="flex-1">
                      Edit
                    </Button>
                    {task.status !== 'completed' && (
                      <Button size="sm" className="flex-1">
                        Mark Complete
                      </Button>
                    )}
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </div>
  )
}
