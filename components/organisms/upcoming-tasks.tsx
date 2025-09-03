"use client"

import { useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog"
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger } from "@/components/ui/alert-dialog"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { CheckCircle, Clock, AlertCircle, Plus, Edit, Trash2, Loader2, Calendar } from "lucide-react"
import { useToast } from "@/hooks/use-toast"

interface Task {
  id: string
  title: string
  dueDate: string
  priority: "high" | "medium" | "low"
  status: "pending" | "completed"
  category: string
  description?: string
}

export function UpcomingTasks() {
  const { toast } = useToast()
  const [isLoading, setIsLoading] = useState(false)
  const [isAddTaskOpen, setIsAddTaskOpen] = useState(false)
  const [editingTask, setEditingTask] = useState<Task | null>(null)

  const [taskForm, setTaskForm] = useState<{
    title: string
    dueDate: string
    priority: "high" | "medium" | "low"
    category: string
    description: string
  }>({
    title: "",
    dueDate: "",
    priority: "medium",
    category: "",
    description: ""
  })

  const [tasks, setTasks] = useState<Task[]>([
    {
      id: "1",
      title: "Send Wedding Invitations",
      dueDate: "2024-03-01",
      priority: "high",
      status: "pending",
      category: "Invitations",
    },
    {
      id: "2",
      title: "Final Menu Tasting",
      dueDate: "2024-04-15",
      priority: "medium",
      status: "pending",
      category: "Catering",
    },
    {
      id: "3",
      title: "Book Transportation",
      dueDate: "2024-05-01",
      priority: "low",
      status: "pending",
      category: "Transportation",
    },
    {
      id: "4",
      title: "Confirm Guest Count",
      dueDate: "2024-05-15",
      priority: "high",
      status: "pending",
      category: "Planning",
    },
  ])

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case "high":
        return "bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200"
      case "medium":
        return "bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200"
      case "low":
        return "bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200"
      default:
        return "bg-gray-100 text-gray-800 dark:bg-gray-900 dark:text-gray-200"
    }
  }

  const formatDate = (dateString: string) => {
    try {
      return new Date(dateString).toLocaleDateString("en-US", {
        year: "numeric",
        month: "short",
        day: "numeric",
      })
    } catch {
      return dateString
    }
  }

  const isOverdue = (dueDate: string) => {
    return new Date(dueDate) < new Date()
  }

  const handleCompleteTask = async (taskId: string, taskTitle: string) => {
    setIsLoading(true)
    try {
      setTasks(prev => prev.map(task => 
        task.id === taskId 
          ? { ...task, status: "completed" as const }
          : task
      ))
      
      toast({
        title: "Task Completed",
        description: `&ldquo;${taskTitle}&rdquo; has been marked as completed.`,
      })
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to complete task. Please try again.",
        variant: "destructive",
      })
    } finally {
      setIsLoading(false)
    }
  }

  const handleAddTask = async () => {
    if (!taskForm.title || !taskForm.dueDate || !taskForm.category) {
      toast({
        title: "Validation Error",
        description: "Please fill in all required fields.",
        variant: "destructive",
      })
      return
    }

    setIsLoading(true)
    try {
      const newTask: Task = {
        id: Date.now().toString(),
        title: taskForm.title,
        dueDate: taskForm.dueDate,
        priority: taskForm.priority,
        status: "pending",
        category: taskForm.category,
        description: taskForm.description
      }

      setTasks(prev => [...prev, newTask])
      setTaskForm({ title: "", dueDate: "", priority: "medium", category: "", description: "" })
      setIsAddTaskOpen(false)
      
      toast({
        title: "Task Added",
        description: `${taskForm.title} has been added to your tasks.`,
      })
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to add task. Please try again.",
        variant: "destructive",
      })
    } finally {
      setIsLoading(false)
    }
  }

  const handleEditTask = async () => {
    if (!editingTask || !taskForm.title || !taskForm.dueDate || !taskForm.category) {
      toast({
        title: "Validation Error",
        description: "Please fill in all required fields.",
        variant: "destructive",
      })
      return
    }

    setIsLoading(true)
    try {
      setTasks(prev => prev.map(task => 
        task.id === editingTask.id 
          ? {
              ...task,
              title: taskForm.title,
              dueDate: taskForm.dueDate,
              priority: taskForm.priority,
              category: taskForm.category,
              description: taskForm.description
            }
          : task
      ))
      setTaskForm({ title: "", dueDate: "", priority: "medium", category: "", description: "" })
      setEditingTask(null)
      
      toast({
        title: "Task Updated",
        description: `${taskForm.title} has been updated.`,
      })
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to update task. Please try again.",
        variant: "destructive",
      })
    } finally {
      setIsLoading(false)
    }
  }

  const handleDeleteTask = async (taskId: string, taskTitle: string) => {
    setIsLoading(true)
    try {
      setTasks(prev => prev.filter(task => task.id !== taskId))
      toast({
        title: "Task Deleted",
        description: `${taskTitle} has been removed from your tasks.`,
      })
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to delete task. Please try again.",
        variant: "destructive",
      })
    } finally {
      setIsLoading(false)
    }
  }

  const openEditTask = (task: Task) => {
    setEditingTask(task)
    setTaskForm({
      title: task.title,
      dueDate: task.dueDate,
      priority: task.priority,
      category: task.category,
      description: task.description || ""
    })
  }

  const priorityOptions = [
    { value: "high", label: "High" },
    { value: "medium", label: "Medium" },
    { value: "low", label: "Low" },
  ]

  const categoryOptions = [
    "Invitations", "Catering", "Transportation", "Planning", "Decorations", "Music", "Photography", "Attire", "Other"
  ]

  const pendingTasks = tasks.filter(task => task.status === "pending").slice(0, 5)

  return (
    <Card role="region" aria-label="Upcoming Tasks">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Clock className="h-5 w-5 text-blue-600" aria-hidden="true" />
          Upcoming Tasks
          <Badge variant="secondary" className="ml-auto">
            {pendingTasks.length} pending
          </Badge>
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        {pendingTasks.length === 0 ? (
          <div className="text-center py-8 text-gray-500">
            <CheckCircle className="h-12 w-12 mx-auto mb-4 text-gray-300" />
            <p className="text-lg font-medium">All caught up!</p>
            <p className="text-sm">No pending tasks at the moment</p>
            <Button
              variant="outline"
              className="mt-4"
              onClick={() => setIsAddTaskOpen(true)}
            >
              <Plus className="h-4 w-4 mr-2" />
              Add New Task
            </Button>
          </div>
        ) : (
          pendingTasks.map((task) => (
            <div 
              key={task.id} 
              className={`flex items-center justify-between p-3 border rounded-lg hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors ${
                isOverdue(task.dueDate) ? 'border-red-200 bg-red-50 dark:bg-red-900/20' : ''
              }`}
              role="listitem"
              aria-label={`Task: ${task.title}, due ${formatDate(task.dueDate)}, ${task.priority} priority`}
            >
              <div className="flex items-center space-x-3">
                {isOverdue(task.dueDate) ? (
                  <AlertCircle className="h-4 w-4 text-red-500" aria-label="Overdue task" />
                ) : (
                  <Clock className="h-4 w-4 text-orange-500" aria-hidden="true" />
                )}
                <div>
                  <div className="font-medium text-gray-900 dark:text-white">{task.title}</div>
                  <div className="text-sm text-gray-600 dark:text-gray-400">
                    {formatDate(task.dueDate)}
                    {isOverdue(task.dueDate) && (
                      <span className="text-red-600 ml-2">(Overdue)</span>
                    )}
                  </div>
                  {task.description && (
                    <div className="text-xs text-gray-500 mt-1">
                      {task.description}
                    </div>
                  )}
                </div>
              </div>
              <div className="flex items-center space-x-2">
                <Badge className={getPriorityColor(task.priority)}>{task.priority}</Badge>
                <Button
                  size="sm"
                  variant="outline"
                  onClick={() => handleCompleteTask(task.id, task.title)}
                  disabled={isLoading}
                  aria-label={`Mark ${task.title} as complete`}
                >
                  {isLoading ? <Loader2 className="h-3 w-3 animate-spin" /> : <CheckCircle className="h-3 w-3" />}
                </Button>
                <Button
                  size="sm"
                  variant="ghost"
                  onClick={() => openEditTask(task)}
                  aria-label={`Edit ${task.title} task`}
                >
                  <Edit className="h-3 w-3" />
                </Button>
                <AlertDialog>
                  <AlertDialogTrigger asChild>
                    <Button
                      size="sm"
                      variant="ghost"
                      aria-label={`Delete ${task.title} task`}
                    >
                      <Trash2 className="h-3 w-3" />
                    </Button>
                  </AlertDialogTrigger>
                  <AlertDialogContent>
                    <AlertDialogHeader>
                      <AlertDialogTitle>Delete Task</AlertDialogTitle>
                      <AlertDialogDescription>
                        Are you sure you want to delete "{task.title}"? This action cannot be undone.
                      </AlertDialogDescription>
                    </AlertDialogHeader>
                    <AlertDialogFooter>
                      <AlertDialogCancel>Cancel</AlertDialogCancel>
                      <AlertDialogAction
                        onClick={() => handleDeleteTask(task.id, task.title)}
                        disabled={isLoading}
                      >
                        {isLoading ? <Loader2 className="h-4 w-4 animate-spin" /> : "Delete"}
                      </AlertDialogAction>
                    </AlertDialogFooter>
                  </AlertDialogContent>
                </AlertDialog>
              </div>
            </div>
          ))
        )}
        
        <div className="pt-4 border-t">
          <Dialog open={isAddTaskOpen} onOpenChange={setIsAddTaskOpen}>
            <DialogTrigger asChild>
              <Button variant="outline" className="w-full">
                <Plus className="h-4 w-4 mr-2" />
                Add New Task
              </Button>
            </DialogTrigger>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>Add New Task</DialogTitle>
              </DialogHeader>
              <div className="space-y-4">
                <div>
                  <Label htmlFor="task-title">Task Title *</Label>
                  <Input
                    id="task-title"
                    value={taskForm.title}
                    onChange={(e) => setTaskForm(prev => ({ ...prev, title: e.target.value }))}
                    placeholder="e.g., Send Wedding Invitations"
                    required
                  />
                </div>
                <div>
                  <Label htmlFor="task-due-date">Due Date *</Label>
                  <Input
                    id="task-due-date"
                    type="date"
                    value={taskForm.dueDate}
                    onChange={(e) => setTaskForm(prev => ({ ...prev, dueDate: e.target.value }))}
                    required
                  />
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="task-priority">Priority</Label>
                    <Select value={taskForm.priority} onValueChange={(value) => setTaskForm(prev => ({ ...prev, priority: value as any }))}>
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        {priorityOptions.map((priority) => (
                          <SelectItem key={priority.value} value={priority.value}>
                            {priority.label}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                  <div>
                    <Label htmlFor="task-category">Category *</Label>
                    <Select value={taskForm.category} onValueChange={(value) => setTaskForm(prev => ({ ...prev, category: value }))}>
                      <SelectTrigger>
                        <SelectValue placeholder="Select category" />
                      </SelectTrigger>
                      <SelectContent>
                        {categoryOptions.map((category) => (
                          <SelectItem key={category} value={category}>
                            {category}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                </div>
                <div>
                  <Label htmlFor="task-description">Description</Label>
                  <Input
                    id="task-description"
                    value={taskForm.description}
                    onChange={(e) => setTaskForm(prev => ({ ...prev, description: e.target.value }))}
                    placeholder="Optional description or notes"
                  />
                </div>
                <div className="flex gap-2">
                  <Button
                    onClick={handleAddTask}
                    disabled={isLoading}
                    className="flex-1"
                  >
                    {isLoading ? <Loader2 className="h-4 w-4 animate-spin" /> : "Add Task"}
                  </Button>
                  <Button
                    variant="outline"
                    onClick={() => setIsAddTaskOpen(false)}
                    disabled={isLoading}
                  >
                    Cancel
                  </Button>
                </div>
              </div>
            </DialogContent>
          </Dialog>
        </div>

        <Button variant="outline" className="w-full" disabled={isLoading}>
          View All Tasks
        </Button>
      </CardContent>

      {/* Edit Task Dialog */}
      <Dialog open={!!editingTask} onOpenChange={() => setEditingTask(null)}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Edit Task</DialogTitle>
          </DialogHeader>
          <div className="space-y-4">
            <div>
              <Label htmlFor="edit-task-title">Task Title *</Label>
              <Input
                id="edit-task-title"
                value={taskForm.title}
                onChange={(e) => setTaskForm(prev => ({ ...prev, title: e.target.value }))}
                placeholder="e.g., Send Wedding Invitations"
                required
              />
            </div>
            <div>
              <Label htmlFor="edit-task-due-date">Due Date *</Label>
              <Input
                id="edit-task-due-date"
                type="date"
                value={taskForm.dueDate}
                onChange={(e) => setTaskForm(prev => ({ ...prev, dueDate: e.target.value }))}
                required
              />
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label htmlFor="edit-task-priority">Priority</Label>
                <Select value={taskForm.priority} onValueChange={(value) => setTaskForm(prev => ({ ...prev, priority: value as any }))}>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    {priorityOptions.map((priority) => (
                      <SelectItem key={priority.value} value={priority.value}>
                        {priority.label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <div>
                <Label htmlFor="edit-task-category">Category *</Label>
                <Select value={taskForm.category} onValueChange={(value) => setTaskForm(prev => ({ ...prev, category: value }))}>
                  <SelectTrigger>
                    <SelectValue placeholder="Select category" />
                  </SelectTrigger>
                  <SelectContent>
                    {categoryOptions.map((category) => (
                      <SelectItem key={category} value={category}>
                        {category}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </div>
            <div>
              <Label htmlFor="edit-task-description">Description</Label>
              <Input
                id="edit-task-description"
                value={taskForm.description}
                onChange={(e) => setTaskForm(prev => ({ ...prev, description: e.target.value }))}
                placeholder="Optional description or notes"
              />
            </div>
            <div className="flex gap-2">
              <Button
                onClick={handleEditTask}
                disabled={isLoading}
                className="flex-1"
              >
                {isLoading ? <Loader2 className="h-4 w-4 animate-spin" /> : "Update Task"}
              </Button>
              <Button
                variant="outline"
                onClick={() => setEditingTask(null)}
                disabled={isLoading}
              >
                Cancel
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </Card>
  )
}


export default UpcomingTasks
