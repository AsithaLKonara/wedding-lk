"use client"

import { Users, ListChecks, BarChart2 } from "lucide-react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Button } from "@/components/ui/button"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter, DialogTrigger, DialogClose } from "@/components/ui/dialog"
import { LoadingSpinner } from "@/components/ui/loading-spinner"
import { Label } from "@/components/ui/label"

import { useToast } from "@/hooks/use-toast"
import { useState, useEffect } from "react"

interface Task {
  _id: string
  id: string
  task: string
  date: string
  status: string
}

interface Client {
  _id: string
  name: string
  email: string
  phone: string
  weddingDate: string
}

const mockTasks: Task[] = [
  { _id: "1", id: "1", task: "Venue Visit with Sarah & Michael", date: "2024-06-20", status: "pending" },
  { _id: "2", id: "2", task: "Menu Tasting for Priya & Raj", date: "2024-07-01", status: "pending" },
  { _id: "3", id: "3", task: "Dress Fitting for Emma & David", date: "2024-07-10", status: "done" },
]

const analyticsData = {
  totalClients: 12,
  tasksCompleted: 34,
  upcomingWeddings: 4,
}

// Card will be imported above => <div className="animate-pulse bg-gray-100 dark:bg-gray-800 h-32 rounded-lg" /> })

// CardContent will be imported above => <div className="animate-pulse bg-gray-100 dark:bg-gray-800 h-32 rounded-lg" /> })

// CardHeader will be imported above => <div className="animate-pulse bg-gray-100 dark:bg-gray-800 h-32 rounded-lg" /> })

// CardTitle will be imported above => <div className="animate-pulse bg-gray-100 dark:bg-gray-800 h-32 rounded-lg" /> })

// Tabs will be imported above => <div className="animate-pulse bg-gray-100 dark:bg-gray-800 h-32 rounded-lg" /> })

// TabsContent will be imported above => <div className="animate-pulse bg-gray-100 dark:bg-gray-800 h-32 rounded-lg" /> })

// TabsList will be imported above => <div className="animate-pulse bg-gray-100 dark:bg-gray-800 h-32 rounded-lg" /> })

// TabsTrigger will be imported above => <div className="animate-pulse bg-gray-100 dark:bg-gray-800 h-32 rounded-lg" /> })

// Table will be imported above => <div className="animate-pulse bg-gray-100 dark:bg-gray-800 h-32 rounded-lg" /> })

// TableBody will be imported above => <div className="animate-pulse bg-gray-100 dark:bg-gray-800 h-32 rounded-lg" /> })

// TableCell will be imported above => <div className="animate-pulse bg-gray-100 dark:bg-gray-800 h-32 rounded-lg" /> })

// TableHead will be imported above => <div className="animate-pulse bg-gray-100 dark:bg-gray-800 h-32 rounded-lg" /> })

// TableHeader will be imported above => <div className="animate-pulse bg-gray-100 dark:bg-gray-800 h-32 rounded-lg" /> })

// TableRow will be imported above => <div className="animate-pulse bg-gray-100 dark:bg-gray-800 h-32 rounded-lg" /> })

// Button will be imported above => <div className="animate-pulse bg-gray-100 dark:bg-gray-800 h-32 rounded-lg" /> })

// Dialog will be imported above => <div className="animate-pulse bg-gray-100 dark:bg-gray-800 h-32 rounded-lg" /> })

// DialogContent will be imported above => <div className="animate-pulse bg-gray-100 dark:bg-gray-800 h-32 rounded-lg" /> })

// DialogHeader will be imported above => <div className="animate-pulse bg-gray-100 dark:bg-gray-800 h-32 rounded-lg" /> })

// DialogTitle will be imported above => <div className="animate-pulse bg-gray-100 dark:bg-gray-800 h-32 rounded-lg" /> })

// DialogFooter will be imported above => <div className="animate-pulse bg-gray-100 dark:bg-gray-800 h-32 rounded-lg" /> })

// DialogTrigger will be imported above => <div className="animate-pulse bg-gray-100 dark:bg-gray-800 h-32 rounded-lg" /> })

// DialogClose will be imported above => <div className="animate-pulse bg-gray-100 dark:bg-gray-800 h-32 rounded-lg" /> })

// LoadingSpinner will be imported above => <div className="animate-pulse bg-gray-100 dark:bg-gray-800 h-32 rounded-lg" /> })

// Label will be imported above => <div className="animate-pulse bg-gray-100 dark:bg-gray-800 h-32 rounded-lg" /> })

export default function PlannerDashboardPage() {
  const { toast } = useToast()
  const [tasks, setTasks] = useState<Task[]>([])
  const [tasksLoading, setTasksLoading] = useState(true)
  const [clients, setClients] = useState<Client[]>([])
  const [clientsLoading, setClientsLoading] = useState(true)
  const [loadingId, setLoadingId] = useState<string | null>(null)
  const [isAddTaskOpen, setIsAddTaskOpen] = useState(false)
  const [isEditTaskOpen, setIsEditTaskOpen] = useState(false)
  const [editTask, setEditTask] = useState<Task | null>(null)
  const [taskForm, setTaskForm] = useState({ task: "", date: "", status: "pending" })
  const [taskFormErrors, setTaskFormErrors] = useState<{ task?: string; date?: string }>({})

  useEffect(() => {
    async function fetchTasks() {
      setTasksLoading(true)
      try {
        const res = await fetch("/api/tasks")
        const data = await res.json()
        if (res.ok && data.tasks) {
          setTasks(data.tasks)
        }
      } catch (e) {
        toast({ title: "Failed to load tasks", variant: "destructive" })
      } finally {
        setTasksLoading(false)
      }
    }
    async function fetchClients() {
      setClientsLoading(true)
      try {
        const res = await fetch("/api/clients")
        const data = await res.json()
        if (res.ok && data.clients) {
          setClients(data.clients)
        }
      } catch (e) {
        toast({ title: "Failed to load clients", variant: "destructive" })
      } finally {
        setClientsLoading(false)
      }
    }
    fetchTasks()
    fetchClients()
  }, [toast])

  // Add Task Modal
  const handleAddTask = async () => {
    // Client-side validation
    let errors: { task?: string; date?: string } = {}
    if (!taskForm.task) errors.task = "Task name is required"
    if (!taskForm.date) errors.date = "Date is required"
    setTaskFormErrors(errors)
    if (Object.keys(errors).length > 0) return
    try {
      const res = await fetch("/api/tasks", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(taskForm),
      })
      const data = await res.json()
      if (res.ok && data.task) {
        setTasks(prev => [...prev, data.task])
        setIsAddTaskOpen(false)
        setTaskForm({ task: "", date: "", status: "pending" })
        setTaskFormErrors({})
        toast({ title: "Task added!", variant: "default" })
      } else {
        toast({ title: data.error || "Failed to add task", variant: "destructive" })
      }
    } catch {
      toast({ title: "Failed to add task", variant: "destructive" })
    }
  }

  // Edit Task Modal
  const handleEditTask = async () => {
    if (!editTask) return
    // Client-side validation
    let errors: { task?: string; date?: string } = {}
    if (!taskForm.task) errors.task = "Task name is required"
    if (!taskForm.date) errors.date = "Date is required"
    setTaskFormErrors(errors)
    if (Object.keys(errors).length > 0) return
    try {
      const res = await fetch("/api/tasks", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ id: editTask._id, ...taskForm }),
      })
      const data = await res.json()
      if (res.ok && data.task) {
        setTasks(prev => prev.map(t => t._id === editTask._id ? data.task : t))
        setIsEditTaskOpen(false)
        setEditTask(null)
        setTaskForm({ task: "", date: "", status: "pending" })
        setTaskFormErrors({})
        toast({ title: "Task updated!", variant: "default" })
      } else {
        toast({ title: data.error || "Failed to update task", variant: "destructive" })
      }
    } catch {
      toast({ title: "Failed to update task", variant: "destructive" })
    }
  }

  // Delete Task
  const handleDeleteTask = async (id: string) => {
    try {
      const res = await fetch("/api/tasks", {
        method: "DELETE",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ id }),
      })
      const data = await res.json()
      if (res.ok && data.success) {
        setTasks(prev => prev.filter(t => t._id !== id))
        toast({ title: "Task deleted.", variant: "destructive" })
      } else {
        toast({ title: data.error || "Failed to delete task", variant: "destructive" })
      }
    } catch {
      toast({ title: "Failed to delete task", variant: "destructive" })
    }
  }

  // Delete Client
  const handleDeleteClient = async (id: string) => {
    try {
      const res = await fetch("/api/clients", {
        method: "DELETE",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ id }),
      })
      const data = await res.json()
      if (res.ok && data.success) {
        setClients(prev => prev.filter(c => c._id !== id))
        toast({ title: "Client deleted.", variant: "destructive" })
      } else {
        toast({ title: data.error || "Failed to delete client", variant: "destructive" })
      }
    } catch {
      toast({ title: "Failed to delete client", variant: "destructive" })
    }
  }

  return (
    <div className="container mx-auto px-4 py-8 max-w-5xl">
      <h1 className="text-3xl font-bold mb-8">Planner Dashboard</h1>
      <Tabs defaultValue="clients" className="w-full">
        <TabsList className="mb-6">
          <TabsTrigger value="clients"><Users className="inline mr-2 h-4 w-4" />Clients</TabsTrigger>
          <TabsTrigger value="tasks"><ListChecks className="inline mr-2 h-4 w-4" />Tasks</TabsTrigger>
          <TabsTrigger value="analytics"><BarChart2 className="inline mr-2 h-4 w-4" />Analytics</TabsTrigger>
        </TabsList>
        <TabsContent value="clients">
          {clientsLoading ? (
            <div className="flex justify-center items-center py-12"><LoadingSpinner /></div>
          ) : (
            <Card>
              <CardHeader>
                <CardTitle>Clients</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="flex flex-col items-center justify-center py-12 text-gray-400">
                  <span className="text-5xl mb-2">👥</span>
                  <span>No clients yet. Client management coming soon!</span>
                </div>
              </CardContent>
            </Card>
          )}
        </TabsContent>
        <TabsContent value="tasks">
          {tasksLoading ? (
            <div className="flex justify-center items-center py-12"><LoadingSpinner /></div>
          ) : (
            <Card>
              <CardHeader className="flex flex-row items-center justify-between">
                <CardTitle>Tasks</CardTitle>
                <Dialog open={isAddTaskOpen} onOpenChange={setIsAddTaskOpen}>
                  <DialogTrigger asChild>
                    <Button>Add Task</Button>
                  </DialogTrigger>
                  <DialogContent>
                    <DialogHeader>
                      <DialogTitle>Add New Task</DialogTitle>
                    </DialogHeader>
                    <div className="space-y-4">
                      <div>
                        <Label htmlFor="task">Task Name</Label>
                        <input
                          id="task"
                          type="text"
                          value={taskForm.task}
                          onChange={(e) => setTaskForm({ ...taskForm, task: e.target.value })}
                          className="w-full p-2 border rounded"
                        />
                        {taskFormErrors.task && <p className="text-red-500 text-sm">{taskFormErrors.task}</p>}
                      </div>
                      <div>
                        <Label htmlFor="date">Date</Label>
                        <input
                          id="date"
                          type="date"
                          value={taskForm.date}
                          onChange={(e) => setTaskForm({ ...taskForm, date: e.target.value })}
                          className="w-full p-2 border rounded"
                        />
                        {taskFormErrors.date && <p className="text-red-500 text-sm">{taskFormErrors.date}</p>}
                      </div>
                    </div>
                    <DialogFooter>
                      <DialogClose asChild>
                        <Button variant="outline">Cancel</Button>
                      </DialogClose>
                      <Button onClick={handleAddTask}>Add Task</Button>
                    </DialogFooter>
                  </DialogContent>
                </Dialog>
              </CardHeader>
              <CardContent>
                {tasks.length === 0 ? (
                  <div className="flex flex-col items-center justify-center py-12 text-gray-400">
                    <span className="text-5xl mb-2">📝</span>
                    <span>No tasks yet. Add your first task!</span>
                  </div>
                ) : (
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead>Task</TableHead>
                        <TableHead>Date</TableHead>
                        <TableHead>Status</TableHead>
                        <TableHead>Actions</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {tasks.map((task) => (
                        <TableRow key={task.id}>
                          <TableCell>{task.task}</TableCell>
                          <TableCell>{task.date}</TableCell>
                          <TableCell>{task.status.charAt(0).toUpperCase() + task.status.slice(1)}</TableCell>
                          <TableCell>
                            <div className="flex space-x-2">
                              <Dialog open={isEditTaskOpen} onOpenChange={setIsEditTaskOpen}>
                                <DialogTrigger asChild>
                                  <Button
                                    variant="outline"
                                    size="sm"
                                    onClick={() => {
                                      setEditTask(task)
                                      setTaskForm({ task: task.task, date: task.date, status: task.status })
                                    }}
                                  >
                                    Edit
                                  </Button>
                                </DialogTrigger>
                                <DialogContent>
                                  <DialogHeader>
                                    <DialogTitle>Edit Task</DialogTitle>
                                  </DialogHeader>
                                  <div className="space-y-4">
                                    <div>
                                      <Label htmlFor="edit-task">Task Name</Label>
                                      <input
                                        id="edit-task"
                                        type="text"
                                        value={taskForm.task}
                                        onChange={(e) => setTaskForm({ ...taskForm, task: e.target.value })}
                                        className="w-full p-2 border rounded"
                                      />
                                      {taskFormErrors.task && <p className="text-red-500 text-sm">{taskFormErrors.task}</p>}
                                    </div>
                                    <div>
                                      <Label htmlFor="edit-date">Date</Label>
                                      <input
                                        id="edit-date"
                                        type="date"
                                        value={taskForm.date}
                                        onChange={(e) => setTaskForm({ ...taskForm, date: e.target.value })}
                                        className="w-full p-2 border rounded"
                                      />
                                      {taskFormErrors.date && <p className="text-red-500 text-sm">{taskFormErrors.date}</p>}
                                    </div>
                                  </div>
                                  <DialogFooter>
                                    <DialogClose asChild>
                                      <Button variant="outline">Cancel</Button>
                                    </DialogClose>
                                    <Button onClick={handleEditTask}>Update Task</Button>
                                  </DialogFooter>
                                </DialogContent>
                              </Dialog>
                              <Button variant="destructive" size="sm" onClick={() => handleDeleteTask(task._id)}>Delete</Button>
                            </div>
                            {task.status === "pending" ? (
                              <Button
                                variant="outline"
                                size="sm"
                                className="mt-2"
                                disabled={loadingId === task.id}
                                onClick={async () => {
                                  setLoadingId(task.id)
                                  try {
                                    const res = await fetch("/api/tasks", {
                                      method: "PATCH",
                                      headers: { "Content-Type": "application/json" },
                                      body: JSON.stringify({ id: task._id, status: "done" }),
                                    })
                                    if (res.ok) {
                                      setTasks((prev) => prev.map((t) => t.id === task.id ? { ...t, status: "done" } : t))
                                      toast({ title: "Task marked as done!", variant: "default" })
                                    }
                                  } catch {
                                    toast({ title: "Failed to update task", variant: "destructive" })
                                  } finally {
                                    setLoadingId(null)
                                  }
                                }}
                              >
                                {loadingId === task.id ? "Saving..." : "Mark Done"}
                              </Button>
                            ) : null}
                          </TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                )}
              </CardContent>
            </Card>
          )}
        </TabsContent>
        <TabsContent value="analytics">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <Card>
              <CardHeader>
                <CardTitle className="text-lg">Total Clients</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-3xl font-bold">{analyticsData.totalClients}</div>
              </CardContent>
            </Card>
            <Card>
              <CardHeader>
                <CardTitle className="text-lg">Tasks Completed</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-3xl font-bold">{analyticsData.tasksCompleted}</div>
              </CardContent>
            </Card>
            <Card>
              <CardHeader>
                <CardTitle className="text-lg">Upcoming Weddings</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-3xl font-bold">{analyticsData.upcomingWeddings}</div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>
      </Tabs>
    </div>
  )
}
