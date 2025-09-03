"use client"

import { useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Checkbox } from "@/components/ui/checkbox"
import { Button } from "@/components/ui/button"
import { Progress } from "@/components/ui/progress"
import { Badge } from "@/components/ui/badge"
import { Calendar, CheckCircle2, Circle } from "lucide-react"
import { motion } from "framer-motion"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter, DialogTrigger, DialogClose } from "@/components/ui/dialog"
import { useToast } from "@/hooks/use-toast"

interface ChecklistItem {
  id: string
  title: string
  description: string
  category: string
  timeline: string
  priority: "high" | "medium" | "low"
  completed: boolean
}

export function WeddingChecklist() {
  const [checklist, setChecklist] = useState<ChecklistItem[]>([
    {
      id: "1",
      title: "Set Wedding Date",
      description: "Choose your perfect wedding date",
      category: "Planning",
      timeline: "12 months before",
      priority: "high",
      completed: true,
    },
    {
      id: "2",
      title: "Book Venue",
      description: "Reserve your dream wedding venue",
      category: "Venue",
      timeline: "10-12 months before",
      priority: "high",
      completed: true,
    },
    {
      id: "3",
      title: "Choose Wedding Theme",
      description: "Decide on colors, style, and overall theme",
      category: "Design",
      timeline: "8-10 months before",
      priority: "medium",
      completed: false,
    },
    {
      id: "4",
      title: "Send Invitations",
      description: "Design and send wedding invitations",
      category: "Invitations",
      timeline: "6-8 weeks before",
      priority: "high",
      completed: false,
    },
    {
      id: "5",
      title: "Book Photographer",
      description: "Hire professional wedding photographer",
      category: "Photography",
      timeline: "6-8 months before",
      priority: "high",
      completed: false,
    },
    {
      id: "6",
      title: "Choose Wedding Dress",
      description: "Find and order your perfect wedding dress",
      category: "Attire",
      timeline: "4-6 months before",
      priority: "high",
      completed: false,
    },
    {
      id: "7",
      title: "Plan Menu",
      description: "Finalize catering and menu options",
      category: "Catering",
      timeline: "3-4 months before",
      priority: "medium",
      completed: false,
    },
    {
      id: "8",
      title: "Book Transportation",
      description: "Arrange transportation for wedding day",
      category: "Transportation",
      timeline: "2-3 months before",
      priority: "low",
      completed: false,
    },
  ])

  const [isAddOpen, setIsAddOpen] = useState(false)
  const [isEditOpen, setIsEditOpen] = useState(false)
  const [editTask, setEditTask] = useState<ChecklistItem | null>(null)
  const [taskForm, setTaskForm] = useState<any>({ title: "", description: "", category: "Planning", timeline: "", priority: "medium" })
  const [taskFormErrors, setTaskFormErrors] = useState<any>({})
  const [isTaskSaving, setIsTaskSaving] = useState(false)
  const { toast } = useToast()

  const openAddTask = () => { setTaskForm({ title: "", description: "", category: "Planning", timeline: "", priority: "medium" }); setTaskFormErrors({}); setIsAddOpen(true) }
  const openEditTask = (task: ChecklistItem) => { setEditTask(task); setTaskForm({ ...task }); setTaskFormErrors({}); setIsEditOpen(true) }

  const handleSaveTask = async () => {
    const err: any = {}
    if (!taskForm.title) err.title = "Title is required"
    if (!taskForm.description) err.description = "Description is required"
    if (!taskForm.timeline) err.timeline = "Timeline is required"
    setTaskFormErrors(err)
    if (Object.keys(err).length > 0) return
    setIsTaskSaving(true)
    try {
      await new Promise(res => setTimeout(res, 800))
      if (isAddOpen) {
        setChecklist(prev => [...prev, { ...taskForm, id: Date.now().toString(), completed: false }])
        toast({ title: "Task added!", variant: "default" })
        setIsAddOpen(false)
      } else if (isEditOpen && editTask) {
        setChecklist(prev => prev.map(t => t.id === editTask.id ? { ...taskForm, id: editTask.id, completed: t.completed } : t))
        toast({ title: "Task updated!", variant: "default" })
        setIsEditOpen(false)
        setEditTask(null)
      }
    } catch (err) {
      console.error('Error updating task:', err);
      toast({ title: "Failed to update task", variant: "destructive" });
    }
    setIsTaskSaving(false)
  }

  const toggleItem = (id: string) => {
    setChecklist((prev) => prev.map((item) => {
      if (item.id === id) {
        const updated = { ...item, completed: !item.completed }
        toast({ title: updated.completed ? "Task marked as complete!" : "Task marked as incomplete!", variant: "default" })
        return updated
      }
      return item
    }))
  }

  const completedItems = checklist.filter((item) => item.completed).length
  const totalItems = checklist.length
  const progressPercentage = (completedItems / totalItems) * 100

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

  return (
    <div className="space-y-6">
      {/* Progress Overview */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <CheckCircle2 className="h-5 w-5 text-rose-600" />
            Wedding Planning Progress
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <div className="flex justify-between text-sm">
              <span>
                {completedItems} of {totalItems} tasks completed
              </span>
              <span>{Math.round(progressPercentage)}%</span>
            </div>
            <Progress value={progressPercentage} className="h-2" />
            <div className="grid grid-cols-3 gap-4 text-center">
              <div>
                <div className="text-2xl font-bold text-green-600">{completedItems}</div>
                <div className="text-sm text-gray-500">Completed</div>
              </div>
              <div>
                <div className="text-2xl font-bold text-blue-600">{totalItems - completedItems}</div>
                <div className="text-sm text-gray-500">Remaining</div>
              </div>
              <div>
                <div className="text-2xl font-bold text-rose-600">{totalItems}</div>
                <div className="text-sm text-gray-500">Total Tasks</div>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Checklist Items */}
      <div className="space-y-4">
        {checklist.length === 0 ? (
          <Card>
            <CardContent className="p-8 text-center text-gray-400">
              <div className="text-5xl mb-2">✅</div>
              <div>No tasks yet. Add your first task!</div>
            </CardContent>
          </Card>
        ) : checklist.map((item, index) => (
          <motion.div
            key={item.id}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3, delay: index * 0.1 }}
          >
            <Card
              className={`transition-all duration-200 ${
                item.completed ? "bg-green-50 dark:bg-green-900/20 border-green-200" : ""
              }`}
            >
              <CardContent className="p-4">
                <div className="flex items-start gap-4">
                  <Checkbox checked={item.completed} onCheckedChange={() => toggleItem(item.id)} className="mt-1" />
                  <div className="flex-1 space-y-2">
                    <div className="flex items-center justify-between">
                      <h3 className={`font-medium ${item.completed ? "line-through text-gray-500" : ""}`}>
                        {item.title}
                      </h3>
                      <div className="flex items-center gap-2">
                        <Badge className={getPriorityColor(item.priority)}>{item.priority}</Badge>
                        {item.completed && <CheckCircle2 className="h-4 w-4 text-green-600" />}
                        <Button variant="outline" size="sm" onClick={() => openEditTask(item)}>Edit</Button>
                      </div>
                    </div>
                    <p className={`text-sm ${item.completed ? "line-through text-gray-400" : "text-gray-600"}`}>
                      {item.description}
                    </p>
                    <div className="flex items-center gap-4 text-xs text-gray-500">
                      <div className="flex items-center gap-1">
                        <Calendar className="h-3 w-3" />
                        {item.timeline}
                      </div>
                      <div className="flex items-center gap-1">
                        <Circle className="h-3 w-3" />
                        {item.category}
                      </div>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </motion.div>
        ))}
      </div>

      {/* Add Task Button */}
      <Card className="border-dashed">
        <CardContent className="p-6 text-center">
          <Dialog open={isAddOpen} onOpenChange={setIsAddOpen}>
            <DialogTrigger asChild>
              <Button variant="outline" className="w-full" onClick={openAddTask}>
                <Circle className="h-4 w-4 mr-2" />
                Add Custom Task
              </Button>
            </DialogTrigger>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>Add Task</DialogTitle>
              </DialogHeader>
              <div className="space-y-3">
                <input placeholder="Title" value={taskForm.title} onChange={e => setTaskForm({ ...taskForm, title: e.target.value })} aria-invalid={!!taskFormErrors.title} aria-describedby={taskFormErrors.title ? "task-title-error" : undefined} className="w-full border p-2 rounded" />
                {taskFormErrors.title && <div id="task-title-error" className="text-xs text-destructive">{taskFormErrors.title}</div>}
                <input placeholder="Description" value={taskForm.description} onChange={e => setTaskForm({ ...taskForm, description: e.target.value })} aria-invalid={!!taskFormErrors.description} aria-describedby={taskFormErrors.description ? "task-desc-error" : undefined} className="w-full border p-2 rounded" />
                {taskFormErrors.description && <div id="task-desc-error" className="text-xs text-destructive">{taskFormErrors.description}</div>}
                <input placeholder="Timeline" value={taskForm.timeline} onChange={e => setTaskForm({ ...taskForm, timeline: e.target.value })} aria-invalid={!!taskFormErrors.timeline} aria-describedby={taskFormErrors.timeline ? "task-timeline-error" : undefined} className="w-full border p-2 rounded" />
                {taskFormErrors.timeline && <div id="task-timeline-error" className="text-xs text-destructive">{taskFormErrors.timeline}</div>}
                <select value={taskForm.category} onChange={e => setTaskForm({ ...taskForm, category: e.target.value })} className="w-full border p-2 rounded">
                  <option value="Planning">Planning</option>
                  <option value="Venue">Venue</option>
                  <option value="Design">Design</option>
                  <option value="Invitations">Invitations</option>
                  <option value="Photography">Photography</option>
                  <option value="Attire">Attire</option>
                  <option value="Catering">Catering</option>
                  <option value="Transportation">Transportation</option>
                </select>
                <select value={taskForm.priority} onChange={e => setTaskForm({ ...taskForm, priority: e.target.value })} className="w-full border p-2 rounded">
                  <option value="high">High</option>
                  <option value="medium">Medium</option>
                  <option value="low">Low</option>
                </select>
              </div>
              <DialogFooter>
                <DialogClose asChild>
                  <Button variant="outline">Cancel</Button>
                </DialogClose>
                <Button onClick={handleSaveTask} disabled={isTaskSaving}>{isTaskSaving ? "Saving..." : "Add Task"}</Button>
              </DialogFooter>
            </DialogContent>
          </Dialog>
          <Dialog open={isEditOpen} onOpenChange={setIsEditOpen}>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>Edit Task</DialogTitle>
              </DialogHeader>
              <div className="space-y-3">
                <input placeholder="Title" value={taskForm.title} onChange={e => setTaskForm({ ...taskForm, title: e.target.value })} aria-invalid={!!taskFormErrors.title} aria-describedby={taskFormErrors.title ? "edit-task-title-error" : undefined} className="w-full border p-2 rounded" />
                {taskFormErrors.title && <div id="edit-task-title-error" className="text-xs text-destructive">{taskFormErrors.title}</div>}
                <input placeholder="Description" value={taskForm.description} onChange={e => setTaskForm({ ...taskForm, description: e.target.value })} aria-invalid={!!taskFormErrors.description} aria-describedby={taskFormErrors.description ? "edit-task-desc-error" : undefined} className="w-full border p-2 rounded" />
                {taskFormErrors.description && <div id="edit-task-desc-error" className="text-xs text-destructive">{taskFormErrors.description}</div>}
                <input placeholder="Timeline" value={taskForm.timeline} onChange={e => setTaskForm({ ...taskForm, timeline: e.target.value })} aria-invalid={!!taskFormErrors.timeline} aria-describedby={taskFormErrors.timeline ? "edit-task-timeline-error" : undefined} className="w-full border p-2 rounded" />
                {taskFormErrors.timeline && <div id="edit-task-timeline-error" className="text-xs text-destructive">{taskFormErrors.timeline}</div>}
                <select value={taskForm.category} onChange={e => setTaskForm({ ...taskForm, category: e.target.value })} className="w-full border p-2 rounded">
                  <option value="Planning">Planning</option>
                  <option value="Venue">Venue</option>
                  <option value="Design">Design</option>
                  <option value="Invitations">Invitations</option>
                  <option value="Photography">Photography</option>
                  <option value="Attire">Attire</option>
                  <option value="Catering">Catering</option>
                  <option value="Transportation">Transportation</option>
                </select>
                <select value={taskForm.priority} onChange={e => setTaskForm({ ...taskForm, priority: e.target.value })} className="w-full border p-2 rounded">
                  <option value="high">High</option>
                  <option value="medium">Medium</option>
                  <option value="low">Low</option>
                </select>
              </div>
              <DialogFooter>
                <DialogClose asChild>
                  <Button variant="outline">Cancel</Button>
                </DialogClose>
                <Button onClick={handleSaveTask} disabled={isTaskSaving}>{isTaskSaving ? "Saving..." : "Save Changes"}</Button>
              </DialogFooter>
            </DialogContent>
          </Dialog>
        </CardContent>
      </Card>
    </div>
  )
}


export default WeddingChecklist
