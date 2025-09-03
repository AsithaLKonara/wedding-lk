"use client"

import { useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Activity, Heart, MessageCircle, Calendar, Eye, Trash2, Loader2, RefreshCw, Filter } from "lucide-react"
import { useToast } from "@/hooks/use-toast"

interface ActivityItem {
  id: string
  type: "saved" | "message" | "booking" | "review" | "payment"
  title: string
  time: string
  icon: any
  color: string
  description?: string
  actionUrl?: string
}

export function RecentActivity() {
  const { toast } = useToast()
  const [isLoading, setIsLoading] = useState(false)
  const [selectedFilter, setSelectedFilter] = useState<string>("all")

  const [activities, setActivities] = useState<ActivityItem[]>([
    {
      id: "1",
      type: "saved",
      title: "Saved Grand Ballroom Hotel",
      time: "2 hours ago",
      icon: Heart,
      color: "text-red-500",
      description: "Added to your favorites",
    },
    {
      id: "2",
      type: "message",
      title: "Message from Perfect Moments Photography",
      time: "1 day ago",
      icon: MessageCircle,
      color: "text-blue-500",
      description: "New inquiry about wedding package",
    },
    {
      id: "3",
      type: "booking",
      title: "Venue viewing scheduled",
      time: "2 days ago",
      icon: Calendar,
      color: "text-green-500",
      description: "Appointment confirmed for March 15th",
    },
    {
      id: "4",
      type: "saved",
      title: "Saved Harmony Live Band",
      time: "3 days ago",
      icon: Heart,
      color: "text-red-500",
      description: "Added to your favorites",
    },
    {
      id: "5",
      type: "review",
      title: "Left review for Elegant Catering",
      time: "4 days ago",
      icon: MessageCircle,
      color: "text-purple-500",
      description: "5-star rating submitted",
    },
    {
      id: "6",
      type: "payment",
      title: "Payment processed for DJ Services",
      time: "5 days ago",
      icon: Calendar,
      color: "text-green-500",
      description: "Deposit payment of LKR 25,000",
    },
  ])

  const getTypeLabel = (type: string) => {
    switch (type) {
      case "saved":
        return "Saved"
      case "message":
        return "Message"
      case "booking":
        return "Booking"
      case "review":
        return "Review"
      case "payment":
        return "Payment"
      default:
        return "Activity"
    }
  }

  const getTypeColor = (type: string) => {
    switch (type) {
      case "saved":
        return "bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200"
      case "message":
        return "bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200"
      case "booking":
        return "bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200"
      case "review":
        return "bg-purple-100 text-purple-800 dark:bg-purple-900 dark:text-purple-200"
      case "payment":
        return "bg-emerald-100 text-emerald-800 dark:bg-emerald-900 dark:text-emerald-200"
      default:
        return "bg-gray-100 text-gray-800 dark:bg-gray-900 dark:text-gray-200"
    }
  }

  const handleRefresh = async () => {
    setIsLoading(true)
    try {
      // Simulate API call to refresh activities
      await new Promise(resolve => setTimeout(resolve, 1000))
      toast({
        title: "Activities Refreshed",
        description: "Recent activities have been updated.",
      })
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to refresh activities. Please try again.",
        variant: "destructive",
      })
    } finally {
      setIsLoading(false)
    }
  }

  const handleViewActivity = (activity: ActivityItem) => {
    toast({
      title: "Viewing Activity",
      description: `Opening ${activity.title}`,
    })
    // Here you would typically navigate to the activity detail page
  }

  const handleDeleteActivity = async (activityId: string, activityTitle: string) => {
    setIsLoading(true)
    try {
      setActivities(prev => prev.filter(activity => activity.id !== activityId))
      toast({
        title: "Activity Removed",
        description: `${activityTitle} has been removed from your activity feed.`,
      })
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to remove activity. Please try again.",
        variant: "destructive",
      })
    } finally {
      setIsLoading(false)
    }
  }

  const filteredActivities = selectedFilter === "all" 
    ? activities 
    : activities.filter(activity => activity.type === selectedFilter)

  const filterOptions = [
    { value: "all", label: "All Activities" },
    { value: "saved", label: "Saved Items" },
    { value: "message", label: "Messages" },
    { value: "booking", label: "Bookings" },
    { value: "review", label: "Reviews" },
    { value: "payment", label: "Payments" },
  ]

  return (
    <Card role="region" aria-label="Recent Activity">
      <CardHeader>
        <div className="flex items-center justify-between">
          <CardTitle className="flex items-center gap-2">
            <Activity className="h-5 w-5 text-blue-600" aria-hidden="true" />
            Recent Activity
            <Badge variant="secondary">
              {filteredActivities.length}
            </Badge>
          </CardTitle>
          <div className="flex items-center gap-2">
            <Button
              variant="outline"
              size="sm"
              onClick={handleRefresh}
              disabled={isLoading}
              aria-label="Refresh activities"
            >
              {isLoading ? <Loader2 className="h-4 w-4 animate-spin" /> : <RefreshCw className="h-4 w-4" />}
            </Button>
            <div className="relative">
              <select
                value={selectedFilter}
                onChange={(e) => setSelectedFilter(e.target.value)}
                className="text-sm border rounded-md px-2 py-1 bg-background"
                aria-label="Filter activities by type"
              >
                {filterOptions.map((option) => (
                  <option key={option.value} value={option.value}>
                    {option.label}
                  </option>
                ))}
              </select>
            </div>
          </div>
        </div>
      </CardHeader>
      <CardContent className="space-y-4">
        {filteredActivities.length === 0 ? (
          <div className="text-center py-8 text-gray-500">
            <Activity className="h-12 w-12 mx-auto mb-4 text-gray-300" />
            <p className="text-lg font-medium">No activities found</p>
            <p className="text-sm">
              {selectedFilter === "all" 
                ? "Start planning your wedding to see activity here"
                : `No ${selectedFilter} activities at the moment`
              }
            </p>
          </div>
        ) : (
          filteredActivities.map((activity) => {
            const IconComponent = activity.icon
            return (
              <div 
                key={activity.id} 
                className="flex items-center space-x-3 p-3 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors"
                role="listitem"
                aria-label={`Activity: ${activity.title}, ${activity.time}`}
              >
                <div className="flex-shrink-0">
                  <IconComponent className={`h-4 w-4 ${activity.color}`} aria-hidden="true" />
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2">
                    <div className="text-sm font-medium text-gray-900 dark:text-white truncate">
                      {activity.title}
                    </div>
                    <Badge className={`text-xs ${getTypeColor(activity.type)}`}>
                      {getTypeLabel(activity.type)}
                    </Badge>
                  </div>
                  {activity.description && (
                    <div className="text-xs text-gray-600 dark:text-gray-400 mt-1">
                      {activity.description}
                    </div>
                  )}
                  <div className="text-xs text-gray-500 mt-1">
                    {activity.time}
                  </div>
                </div>
                <div className="flex items-center gap-1">
                  <Button
                    size="sm"
                    variant="ghost"
                    onClick={() => handleViewActivity(activity)}
                    disabled={isLoading}
                    aria-label={`View ${activity.title}`}
                  >
                    <Eye className="h-3 w-3" />
                  </Button>
                  <Button
                    size="sm"
                    variant="ghost"
                    onClick={() => handleDeleteActivity(activity.id, activity.title)}
                    disabled={isLoading}
                    aria-label={`Remove ${activity.title} from activity feed`}
                  >
                    <Trash2 className="h-3 w-3" />
                  </Button>
                </div>
              </div>
            )
          })
        )}
        
        {filteredActivities.length > 0 && (
          <div className="pt-4 border-t">
            <Button variant="outline" className="w-full" disabled={isLoading}>
              View All Activities
            </Button>
          </div>
        )}
      </CardContent>
    </Card>
  )
}


export default RecentActivity
