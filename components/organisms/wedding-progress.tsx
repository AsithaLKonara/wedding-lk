"use client"

import { useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Progress } from "@/components/ui/progress"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog"
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger } from "@/components/ui/alert-dialog"
import { CheckCircle, Circle, Clock, Plus, Edit, Trash2, Loader2, Calendar } from "lucide-react"
import { useToast } from "@/hooks/use-toast"

interface Milestone {
  id: string
  title: string
  completed: boolean
  date: string
  description?: string
}

export function WeddingProgress() {
  const { toast } = useToast()
  const [isLoading, setIsLoading] = useState(false)
  const [isAddMilestoneOpen, setIsAddMilestoneOpen] = useState(false)
  const [editingMilestone, setEditingMilestone] = useState<Milestone | null>(null)

  const [milestoneForm, setMilestoneForm] = useState({
    title: "",
    date: "",
    description: ""
  })

  const [milestones, setMilestones] = useState<Milestone[]>([
    { id: "1", title: "Set Wedding Date", completed: true, date: "Dec 1, 2023" },
    { id: "2", title: "Book Venue", completed: true, date: "Dec 15, 2023" },
    { id: "3", title: "Choose Photographer", completed: true, date: "Jan 10, 2024" },
    { id: "4", title: "Send Invitations", completed: false, date: "Mar 1, 2024" },
    { id: "5", title: "Final Menu Tasting", completed: false, date: "May 1, 2024" },
    { id: "6", title: "Wedding Day", completed: false, date: "Jun 15, 2024" },
  ])

  const completedCount = milestones.filter((m) => m.completed).length
  const progressPercentage = milestones.length > 0 ? (completedCount / milestones.length) * 100 : 0

  const handleToggleMilestone = async (milestoneId: string, milestoneTitle: string, currentStatus: boolean) => {
    setIsLoading(true)
    try {
      setMilestones(prev => prev.map(milestone => 
        milestone.id === milestoneId 
          ? { ...milestone, completed: !currentStatus }
          : milestone
      ))
      
      toast({
        title: currentStatus ? "Milestone Unmarked" : "Milestone Completed",
        description: `${milestoneTitle} has been ${currentStatus ? "marked as incomplete" : "marked as complete"}.`,
      })
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to update milestone status. Please try again.",
        variant: "destructive",
      })
    } finally {
      setIsLoading(false)
    }
  }

  const handleAddMilestone = async () => {
    if (!milestoneForm.title || !milestoneForm.date) {
      toast({
        title: "Validation Error",
        description: "Please fill in all required fields.",
        variant: "destructive",
      })
      return
    }

    setIsLoading(true)
    try {
      const newMilestone: Milestone = {
        id: Date.now().toString(),
        title: milestoneForm.title,
        completed: false,
        date: milestoneForm.date,
        description: milestoneForm.description
      }

      setMilestones(prev => [...prev, newMilestone])
      setMilestoneForm({ title: "", date: "", description: "" })
      setIsAddMilestoneOpen(false)
      
      toast({
        title: "Milestone Added",
        description: `${milestoneForm.title} has been added to your wedding progress.`,
      })
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to add milestone. Please try again.",
        variant: "destructive",
      })
    } finally {
      setIsLoading(false)
    }
  }

  const handleEditMilestone = async () => {
    if (!editingMilestone || !milestoneForm.title || !milestoneForm.date) {
      toast({
        title: "Validation Error",
        description: "Please fill in all required fields.",
        variant: "destructive",
      })
      return
    }

    setIsLoading(true)
    try {
      setMilestones(prev => prev.map(milestone => 
        milestone.id === editingMilestone.id 
          ? {
              ...milestone,
              title: milestoneForm.title,
              date: milestoneForm.date,
              description: milestoneForm.description
            }
          : milestone
      ))
      setMilestoneForm({ title: "", date: "", description: "" })
      setEditingMilestone(null)
      
      toast({
        title: "Milestone Updated",
        description: `${milestoneForm.title} has been updated.`,
      })
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to update milestone. Please try again.",
        variant: "destructive",
      })
    } finally {
      setIsLoading(false)
    }
  }

  const handleDeleteMilestone = async (milestoneId: string, milestoneTitle: string) => {
    setIsLoading(true)
    try {
      setMilestones(prev => prev.filter(milestone => milestone.id !== milestoneId))
      toast({
        title: "Milestone Deleted",
        description: `${milestoneTitle} has been removed from your wedding progress.`,
      })
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to delete milestone. Please try again.",
        variant: "destructive",
      })
    } finally {
      setIsLoading(false)
    }
  }

  const openEditMilestone = (milestone: Milestone) => {
    setEditingMilestone(milestone)
    setMilestoneForm({
      title: milestone.title,
      date: milestone.date,
      description: milestone.description || ""
    })
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

  return (
    <Card role="region" aria-label="Wedding Planning Progress">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Calendar className="h-5 w-5 text-blue-600" aria-hidden="true" />
          Wedding Planning Progress
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-6">
        <div>
          <div className="flex justify-between text-sm mb-2">
            <span>Overall Progress</span>
            <span aria-live="polite">{Math.round(progressPercentage)}% Complete</span>
          </div>
          <Progress 
            value={progressPercentage} 
            className="h-2"
            aria-label={`Wedding planning progress: ${Math.round(progressPercentage)}% complete`}
          />
          <div className="text-xs text-gray-500 mt-1">
            {completedCount} of {milestones.length} milestones completed
          </div>
        </div>

        <div className="space-y-4">
          {milestones.length === 0 ? (
            <div className="text-center py-8 text-gray-500">
              <Calendar className="h-12 w-12 mx-auto mb-4 text-gray-300" />
              <p className="text-lg font-medium">No milestones yet</p>
              <p className="text-sm">Start tracking your wedding planning progress</p>
              <Button
                variant="outline"
                className="mt-4"
                onClick={() => setIsAddMilestoneOpen(true)}
              >
                <Plus className="h-4 w-4 mr-2" />
                Add First Milestone
              </Button>
            </div>
          ) : (
            milestones.map((milestone, index) => (
              <div 
                key={milestone.id} 
                className="flex items-center space-x-3 p-3 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors"
                role="listitem"
                aria-label={`Milestone ${index + 1}: ${milestone.title}`}
              >
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => handleToggleMilestone(milestone.id, milestone.title, milestone.completed)}
                  disabled={isLoading}
                  aria-label={`${milestone.completed ? 'Mark' : 'Unmark'} ${milestone.title} as ${milestone.completed ? 'incomplete' : 'complete'}`}
                  className="p-0 h-auto"
                >
                  {milestone.completed ? (
                    <CheckCircle className="h-5 w-5 text-green-500" />
                  ) : (
                    <Circle className="h-5 w-5 text-gray-300" />
                  )}
                </Button>
                <div className="flex-1">
                  <div
                    className={`font-medium ${milestone.completed ? "text-gray-900 dark:text-white line-through" : "text-gray-900 dark:text-white"}`}
                  >
                    {milestone.title}
                  </div>
                  <div className="text-sm text-gray-500 flex items-center">
                    <Clock className="h-3 w-3 mr-1" aria-hidden="true" />
                    {formatDate(milestone.date)}
                  </div>
                  {milestone.description && (
                    <div className="text-xs text-gray-400 mt-1">
                      {milestone.description}
                    </div>
                  )}
                </div>
                <div className="flex items-center gap-1">
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => openEditMilestone(milestone)}
                    aria-label={`Edit ${milestone.title} milestone`}
                  >
                    <Edit className="h-4 w-4" />
                  </Button>
                  <AlertDialog>
                    <AlertDialogTrigger asChild>
                      <Button
                        variant="ghost"
                        size="sm"
                        aria-label={`Delete ${milestone.title} milestone`}
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </AlertDialogTrigger>
                    <AlertDialogContent>
                      <AlertDialogHeader>
                        <AlertDialogTitle>Delete Milestone</AlertDialogTitle>
                        <AlertDialogDescription>
                          Are you sure you want to delete "{milestone.title}"? This action cannot be undone.
                        </AlertDialogDescription>
                      </AlertDialogHeader>
                      <AlertDialogFooter>
                        <AlertDialogCancel>Cancel</AlertDialogCancel>
                        <AlertDialogAction
                          onClick={() => handleDeleteMilestone(milestone.id, milestone.title)}
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
        </div>

        {milestones.length > 0 && (
          <div className="pt-4 border-t">
            <Dialog open={isAddMilestoneOpen} onOpenChange={setIsAddMilestoneOpen}>
              <DialogTrigger asChild>
                <Button variant="outline" className="w-full">
                  <Plus className="h-4 w-4 mr-2" />
                  Add Milestone
                </Button>
              </DialogTrigger>
              <DialogContent>
                <DialogHeader>
                  <DialogTitle>Add Wedding Milestone</DialogTitle>
                </DialogHeader>
                <div className="space-y-4">
                  <div>
                    <Label htmlFor="milestone-title">Milestone Title *</Label>
                    <Input
                      id="milestone-title"
                      value={milestoneForm.title}
                      onChange={(e) => setMilestoneForm(prev => ({ ...prev, title: e.target.value }))}
                      placeholder="e.g., Book Venue"
                      required
                    />
                  </div>
                  <div>
                    <Label htmlFor="milestone-date">Target Date *</Label>
                    <Input
                      id="milestone-date"
                      type="date"
                      value={milestoneForm.date}
                      onChange={(e) => setMilestoneForm(prev => ({ ...prev, date: e.target.value }))}
                      required
                    />
                  </div>
                  <div>
                    <Label htmlFor="milestone-description">Description</Label>
                    <Input
                      id="milestone-description"
                      value={milestoneForm.description}
                      onChange={(e) => setMilestoneForm(prev => ({ ...prev, description: e.target.value }))}
                      placeholder="Optional description or notes"
                    />
                  </div>
                  <div className="flex gap-2">
                    <Button
                      onClick={handleAddMilestone}
                      disabled={isLoading}
                      className="flex-1"
                    >
                      {isLoading ? <Loader2 className="h-4 w-4 animate-spin" /> : "Add Milestone"}
                    </Button>
                    <Button
                      variant="outline"
                      onClick={() => setIsAddMilestoneOpen(false)}
                      disabled={isLoading}
                    >
                      Cancel
                    </Button>
                  </div>
                </div>
              </DialogContent>
            </Dialog>
          </div>
        )}
      </CardContent>

      {/* Edit Milestone Dialog */}
      <Dialog open={!!editingMilestone} onOpenChange={() => setEditingMilestone(null)}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Edit Wedding Milestone</DialogTitle>
          </DialogHeader>
          <div className="space-y-4">
            <div>
              <Label htmlFor="edit-milestone-title">Milestone Title *</Label>
              <Input
                id="edit-milestone-title"
                value={milestoneForm.title}
                onChange={(e) => setMilestoneForm(prev => ({ ...prev, title: e.target.value }))}
                placeholder="e.g., Book Venue"
                required
              />
            </div>
            <div>
              <Label htmlFor="edit-milestone-date">Target Date *</Label>
              <Input
                id="edit-milestone-date"
                type="date"
                value={milestoneForm.date}
                onChange={(e) => setMilestoneForm(prev => ({ ...prev, date: e.target.value }))}
                required
              />
            </div>
            <div>
              <Label htmlFor="edit-milestone-description">Description</Label>
              <Input
                id="edit-milestone-description"
                value={milestoneForm.description}
                onChange={(e) => setMilestoneForm(prev => ({ ...prev, description: e.target.value }))}
                placeholder="Optional description or notes"
              />
            </div>
            <div className="flex gap-2">
              <Button
                onClick={handleEditMilestone}
                disabled={isLoading}
                className="flex-1"
              >
                {isLoading ? <Loader2 className="h-4 w-4 animate-spin" /> : "Update Milestone"}
              </Button>
              <Button
                variant="outline"
                onClick={() => setEditingMilestone(null)}
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
