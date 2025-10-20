"use client"

import { useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog"
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger } from "@/components/ui/alert-dialog"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Calendar, Clock, MapPin, Users, Camera, Music, Plus, Edit, Trash2, Loader2 } from "lucide-react"
import { motion } from "framer-motion"
import { useToast } from "@/hooks/use-toast"

interface TimelineEvent {
  id: string
  time: string
  title: string
  description: string
  location: string
  duration: string
  type: "ceremony" | "reception" | "photo" | "preparation" | "other"
  participants: string[]
}

export function WeddingTimeline() {
  const { toast } = useToast()
  const [isLoading, setIsLoading] = useState(false)
  const [isAddEventOpen, setIsAddEventOpen] = useState(false)
  const [editingEvent, setEditingEvent] = useState<TimelineEvent | null>(null)

  const [eventForm, setEventForm] = useState({
    title: "",
    description: "",
    time: "",
    duration: "",
    location: "",
    type: "ceremony" as const,
    participants: ""
  })

  const [timelineEvents, setTimelineEvents] = useState<TimelineEvent[]>([
    {
      id: "1",
      time: "08:00 AM",
      title: "Bridal Preparation",
      description: "Hair, makeup, and getting dressed",
      location: "Bridal Suite",
      duration: "3 hours",
      type: "preparation",
      participants: ["Bride", "Bridesmaids", "Makeup Artist"],
    },
    {
      id: "2",
      time: "10:00 AM",
      title: "Groom Preparation",
      description: "Getting ready with groomsmen",
      location: "Groom's Room",
      duration: "2 hours",
      type: "preparation",
      participants: ["Groom", "Groomsmen", "Best Man"],
    },
    {
      id: "3",
      time: "11:30 AM",
      title: "First Look Photos",
      description: "Private moment and photos before ceremony",
      location: "Garden Area",
      duration: "30 minutes",
      type: "photo",
      participants: ["Bride", "Groom", "Photographer"],
    },
    {
      id: "4",
      time: "12:00 PM",
      title: "Family Photos",
      description: "Group photos with families",
      location: "Photo Studio",
      duration: "1 hour",
      type: "photo",
      participants: ["All Families", "Photographer"],
    },
    {
      id: "5",
      time: "02:00 PM",
      title: "Wedding Ceremony",
      description: "Exchange of vows and rings",
      location: "Main Hall",
      duration: "1 hour",
      type: "ceremony",
      participants: ["All Guests", "Officiant"],
    },
    {
      id: "6",
      time: "03:30 PM",
      title: "Cocktail Hour",
      description: "Drinks and appetizers",
      location: "Terrace",
      duration: "1.5 hours",
      type: "reception",
      participants: ["All Guests"],
    },
    {
      id: "7",
      time: "05:00 PM",
      title: "Reception Dinner",
      description: "Wedding feast and speeches",
      location: "Banquet Hall",
      duration: "2 hours",
      type: "reception",
      participants: ["All Guests"],
    },
    {
      id: "8",
      time: "07:30 PM",
      title: "First Dance",
      description: "Couple's first dance",
      location: "Dance Floor",
      duration: "30 minutes",
      type: "reception",
      participants: ["Bride", "Groom", "DJ"],
    },
    {
      id: "9",
      time: "08:00 PM",
      title: "Dancing & Celebration",
      description: "Open dancing and celebration",
      location: "Dance Floor",
      duration: "3 hours",
      type: "reception",
      participants: ["All Guests", "DJ"],
    },
  ])

  const getEventIcon = (type: string) => {
    switch (type) {
      case "ceremony":
        return Calendar
      case "reception":
        return Users
      case "photo":
        return Camera
      case "preparation":
        return Clock
      default:
        return Music
    }
  }

  const getEventColor = (type: string) => {
    switch (type) {
      case "ceremony":
        return "bg-rose-100 text-rose-800 dark:bg-rose-900 dark:text-rose-200"
      case "reception":
        return "bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200"
      case "photo":
        return "bg-purple-100 text-purple-800 dark:bg-purple-900 dark:text-purple-200"
      case "preparation":
        return "bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200"
      default:
        return "bg-gray-100 text-gray-800 dark:bg-gray-900 dark:text-gray-200"
    }
  }

  const handleAddEvent = async () => {
    if (!eventForm.title || !eventForm.time || !eventForm.duration || !eventForm.location) {
      toast({
        title: "Validation Error",
        description: "Please fill in all required fields.",
        variant: "destructive",
      })
      return
    }

    setIsLoading(true)
    try {
      const newEvent: TimelineEvent = {
        id: Date.now().toString(),
        title: eventForm.title,
        description: eventForm.description,
        time: eventForm.time,
        duration: eventForm.duration,
        location: eventForm.location,
        type: eventForm.type,
        participants: eventForm.participants ? eventForm.participants.split(",").map(p => p.trim()) : []
      }

      setTimelineEvents(prev => [...prev, newEvent])
      setEventForm({
        title: "",
        description: "",
        time: "",
        duration: "",
        location: "",
        type: "ceremony",
        participants: ""
      })
      setIsAddEventOpen(false)
      
      toast({
        title: "Event Added",
        description: `${eventForm.title} has been added to your timeline.`,
      })
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to add event. Please try again.",
        variant: "destructive",
      })
    } finally {
      setIsLoading(false)
    }
  }

  const handleEditEvent = async () => {
    if (!editingEvent || !eventForm.title || !eventForm.time || !eventForm.duration || !eventForm.location) {
      toast({
        title: "Validation Error",
        description: "Please fill in all required fields.",
        variant: "destructive",
      })
      return
    }

    setIsLoading(true)
    try {
      setTimelineEvents(prev => prev.map(event => 
        event.id === editingEvent.id 
          ? {
              ...event,
              title: eventForm.title,
              description: eventForm.description,
              time: eventForm.time,
              duration: eventForm.duration,
              location: eventForm.location,
              type: eventForm.type,
              participants: eventForm.participants ? eventForm.participants.split(",").map(p => p.trim()) : []
            }
          : event
      ))
      setEventForm({
        title: "",
        description: "",
        time: "",
        duration: "",
        location: "",
        type: "ceremony",
        participants: ""
      })
      setEditingEvent(null)
      
      toast({
        title: "Event Updated",
        description: `${eventForm.title} has been updated.`,
      })
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to update event. Please try again.",
        variant: "destructive",
      })
    } finally {
      setIsLoading(false)
    }
  }

  const handleDeleteEvent = async (eventId: string, eventTitle: string) => {
    setIsLoading(true)
    try {
      setTimelineEvents(prev => prev.filter(event => event.id !== eventId))
      toast({
        title: "Event Deleted",
        description: `${eventTitle} has been removed from your timeline.`,
      })
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to delete event. Please try again.",
        variant: "destructive",
      })
    } finally {
      setIsLoading(false)
    }
  }

  const openEditEvent = (event: TimelineEvent) => {
    setEditingEvent(event)
    setEventForm({
      title: event.title,
      description: event.description,
      time: event.time,
      duration: event.duration,
      location: event.location,
      type: event.type as "ceremony",
      participants: event.participants.join(", ")
    })
  }

  const eventTypes = [
    { value: "ceremony", label: "Ceremony" },
    { value: "reception", label: "Reception" },
    { value: "photo", label: "Photo Session" },
    { value: "preparation", label: "Preparation" },
    { value: "other", label: "Other" },
  ]

  const totalHours = timelineEvents.reduce((total, event) => {
    const duration = event.duration
    if (duration.includes("hour")) {
      const hours = parseFloat(duration.split(" ")[0])
      return total + hours
    } else if (duration.includes("minute")) {
      const minutes = parseFloat(duration.split(" ")[0])
      return total + (minutes / 60)
    }
    return total
  }, 0)

  const uniqueLocations = [...new Set(timelineEvents.map(event => event.location))]

  return (
    <div className="space-y-6" role="region" aria-label="Wedding Timeline">
      {/* Timeline Header */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Calendar className="h-5 w-5 text-rose-600" aria-hidden="true" />
            Wedding Day Timeline
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-center">
            <div>
              <div className="text-2xl font-bold text-rose-600" aria-live="polite">
                {timelineEvents.length}
              </div>
              <div className="text-sm text-gray-500">Events Planned</div>
            </div>
            <div>
              <div className="text-2xl font-bold text-blue-600" aria-live="polite">
                {Math.round(totalHours)}
              </div>
              <div className="text-sm text-gray-500">Total Hours</div>
            </div>
            <div>
              <div className="text-2xl font-bold text-green-600" aria-live="polite">
                {uniqueLocations.length}
              </div>
              <div className="text-sm text-gray-500">Locations</div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Timeline Events */}
      <div className="relative">
        {/* Timeline Line */}
        <div 
          className="absolute left-8 top-0 bottom-0 w-0.5 bg-gray-200 dark:bg-gray-700"
          aria-hidden="true"
        ></div>

        <div className="space-y-6">
          {timelineEvents.length === 0 ? (
            <div className="text-center py-12 text-gray-500">
              <Calendar className="h-16 w-16 mx-auto mb-4 text-gray-300" />
              <p className="text-lg font-medium">No timeline events yet</p>
              <p className="text-sm">Start building your wedding day timeline</p>
              <Button
                variant="outline"
                className="mt-4"
                onClick={() => setIsAddEventOpen(true)}
              >
                <Plus className="h-4 w-4 mr-2" />
                Add First Event
              </Button>
            </div>
          ) : (
            timelineEvents.map((event, index) => {
              const Icon = getEventIcon(event.type)

              return (
                <motion.div
                  key={event.id}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ duration: 0.3, delay: index * 0.1 }}
                  className="relative"
                >
                  {/* Timeline Dot */}
                  <div 
                    className="absolute left-6 w-4 h-4 bg-rose-600 rounded-full border-4 border-white dark:border-gray-900 z-10"
                    aria-hidden="true"
                  ></div>

                  {/* Event Card */}
                  <div className="ml-16">
                    <Card className="hover:shadow-md transition-shadow">
                      <CardContent className="p-4">
                        <div className="flex items-start justify-between mb-3">
                          <div className="flex items-center gap-3">
                            <div className="p-2 bg-rose-100 dark:bg-rose-900 rounded-lg">
                              <Icon className="h-4 w-4 text-rose-600" aria-hidden="true" />
                            </div>
                            <div>
                              <h3 className="font-semibold text-lg">{event.title}</h3>
                              <p className="text-sm text-gray-600 dark:text-gray-400">{event.description}</p>
                            </div>
                          </div>
                          <div className="flex items-center gap-2">
                            <Badge className={getEventColor(event.type)}>{event.type}</Badge>
                            <Button
                              variant="ghost"
                              size="sm"
                              onClick={() => openEditEvent(event)}
                              aria-label={`Edit ${event.title} event`}
                            >
                              <Edit className="h-4 w-4" />
                            </Button>
                            <AlertDialog>
                              <AlertDialogTrigger asChild>
                                <Button
                                  variant="ghost"
                                  size="sm"
                                  aria-label={`Delete ${event.title} event`}
                                >
                                  <Trash2 className="h-4 w-4" />
                                </Button>
                              </AlertDialogTrigger>
                              <AlertDialogContent>
                                <AlertDialogHeader>
                                  <AlertDialogTitle>Delete Event</AlertDialogTitle>
                                  <AlertDialogDescription>
                                    Are you sure you want to delete "{event.title}"? This action cannot be undone.
                                  </AlertDialogDescription>
                                </AlertDialogHeader>
                                <AlertDialogFooter>
                                  <AlertDialogCancel>Cancel</AlertDialogCancel>
                                  <AlertDialogAction
                                    onClick={() => handleDeleteEvent(event.id, event.title)}
                                    disabled={isLoading}
                                  >
                                    {isLoading ? <Loader2 className="h-4 w-4 animate-spin" /> : "Delete"}
                                  </AlertDialogAction>
                                </AlertDialogFooter>
                              </AlertDialogContent>
                            </AlertDialog>
                          </div>
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm">
                          <div className="flex items-center gap-2">
                            <Clock className="h-4 w-4 text-gray-400" aria-hidden="true" />
                            <span className="font-medium">{event.time}</span>
                            <span className="text-gray-500">({event.duration})</span>
                          </div>
                          <div className="flex items-center gap-2">
                            <MapPin className="h-4 w-4 text-gray-400" aria-hidden="true" />
                            <span>{event.location}</span>
                          </div>
                          <div className="flex items-center gap-2">
                            <Users className="h-4 w-4 text-gray-400" aria-hidden="true" />
                            <span>{event.participants.join(", ")}</span>
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  </div>
                </motion.div>
              )
            })
          )}
        </div>
      </div>

      {/* Add Event Button */}
      <Card className="border-dashed ml-16">
        <CardContent className="p-6 text-center">
          <Dialog open={isAddEventOpen} onOpenChange={setIsAddEventOpen}>
            <DialogTrigger asChild>
              <Button variant="outline" className="w-full">
                <Calendar className="h-4 w-4 mr-2" />
                Add Timeline Event
              </Button>
            </DialogTrigger>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>Add Timeline Event</DialogTitle>
              </DialogHeader>
              <div className="space-y-4">
                <div>
                  <Label htmlFor="event-title">Event Title *</Label>
                  <Input
                    id="event-title"
                    value={eventForm.title}
                    onChange={(e) => setEventForm(prev => ({ ...prev, title: e.target.value }))}
                    placeholder="e.g., Wedding Ceremony"
                    required
                  />
                </div>
                <div>
                  <Label htmlFor="event-description">Description</Label>
                  <Textarea
                    id="event-description"
                    value={eventForm.description}
                    onChange={(e) => setEventForm(prev => ({ ...prev, description: e.target.value }))}
                    placeholder="Brief description of the event"
                    rows={3}
                  />
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="event-time">Time *</Label>
                    <Input
                      id="event-time"
                      type="time"
                      value={eventForm.time}
                      onChange={(e) => setEventForm(prev => ({ ...prev, time: e.target.value }))}
                      required
                    />
                  </div>
                  <div>
                    <Label htmlFor="event-duration">Duration *</Label>
                    <Input
                      id="event-duration"
                      value={eventForm.duration}
                      onChange={(e) => setEventForm(prev => ({ ...prev, duration: e.target.value }))}
                      placeholder="e.g., 2 hours"
                      required
                    />
                  </div>
                </div>
                <div>
                  <Label htmlFor="event-location">Location *</Label>
                  <Input
                    id="event-location"
                    value={eventForm.location}
                    onChange={(e) => setEventForm(prev => ({ ...prev, location: e.target.value }))}
                    placeholder="e.g., Main Hall"
                    required
                  />
                </div>
                <div>
                  <Label htmlFor="event-type">Event Type</Label>
                  <Select value={eventForm.type} onValueChange={(value) => setEventForm(prev => ({ ...prev, type: value as any }))}>
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      {eventTypes.map((type) => (
                        <SelectItem key={type.value} value={type.value}>
                          {type.label}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                <div>
                  <Label htmlFor="event-participants">Participants</Label>
                  <Input
                    id="event-participants"
                    value={eventForm.participants}
                    onChange={(e) => setEventForm(prev => ({ ...prev, participants: e.target.value }))}
                    placeholder="e.g., Bride, Groom, All Guests (comma separated)"
                  />
                </div>
                <div className="flex gap-2">
                  <Button
                    onClick={handleAddEvent}
                    disabled={isLoading}
                    className="flex-1"
                  >
                    {isLoading ? <Loader2 className="h-4 w-4 animate-spin" /> : "Add Event"}
                  </Button>
                  <Button
                    variant="outline"
                    onClick={() => setIsAddEventOpen(false)}
                    disabled={isLoading}
                  >
                    Cancel
                  </Button>
                </div>
              </div>
            </DialogContent>
          </Dialog>
        </CardContent>
      </Card>

      {/* Edit Event Dialog */}
      <Dialog open={!!editingEvent} onOpenChange={() => setEditingEvent(null)}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Edit Timeline Event</DialogTitle>
          </DialogHeader>
          <div className="space-y-4">
            <div>
              <Label htmlFor="edit-event-title">Event Title *</Label>
              <Input
                id="edit-event-title"
                value={eventForm.title}
                onChange={(e) => setEventForm(prev => ({ ...prev, title: e.target.value }))}
                placeholder="e.g., Wedding Ceremony"
                required
              />
            </div>
            <div>
              <Label htmlFor="edit-event-description">Description</Label>
              <Textarea
                id="edit-event-description"
                value={eventForm.description}
                onChange={(e) => setEventForm(prev => ({ ...prev, description: e.target.value }))}
                placeholder="Brief description of the event"
                rows={3}
              />
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label htmlFor="edit-event-time">Time *</Label>
                <Input
                  id="edit-event-time"
                  type="time"
                  value={eventForm.time}
                  onChange={(e) => setEventForm(prev => ({ ...prev, time: e.target.value }))}
                  required
                />
              </div>
              <div>
                <Label htmlFor="edit-event-duration">Duration *</Label>
                <Input
                  id="edit-event-duration"
                  value={eventForm.duration}
                  onChange={(e) => setEventForm(prev => ({ ...prev, duration: e.target.value }))}
                  placeholder="e.g., 2 hours"
                  required
                />
              </div>
            </div>
            <div>
              <Label htmlFor="edit-event-location">Location *</Label>
              <Input
                id="edit-event-location"
                value={eventForm.location}
                onChange={(e) => setEventForm(prev => ({ ...prev, location: e.target.value }))}
                placeholder="e.g., Main Hall"
                required
              />
            </div>
            <div>
              <Label htmlFor="edit-event-type">Event Type</Label>
              <Select value={eventForm.type} onValueChange={(value) => setEventForm(prev => ({ ...prev, type: value as any }))}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {eventTypes.map((type) => (
                    <SelectItem key={type.value} value={type.value}>
                      {type.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div>
              <Label htmlFor="edit-event-participants">Participants</Label>
              <Input
                id="edit-event-participants"
                value={eventForm.participants}
                onChange={(e) => setEventForm(prev => ({ ...prev, participants: e.target.value }))}
                placeholder="e.g., Bride, Groom, All Guests (comma separated)"
              />
            </div>
            <div className="flex gap-2">
              <Button
                onClick={handleEditEvent}
                disabled={isLoading}
                className="flex-1"
              >
                {isLoading ? <Loader2 className="h-4 w-4 animate-spin" /> : "Update Event"}
              </Button>
              <Button
                variant="outline"
                onClick={() => setEditingEvent(null)}
                disabled={isLoading}
              >
                Cancel
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  )
}


export default WeddingTimeline;
