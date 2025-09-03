"use client"

import { useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { MapPin, Users, Camera, Utensils, Music, Flower, Loader2, TrendingUp, Star } from "lucide-react"
import { useToast } from "@/hooks/use-toast"

interface QuickAction {
  id: string
  icon: any
  label: string
  href: string
  color: string
  description?: string
  isPopular?: boolean
  isNew?: boolean
  count?: number
}

export function QuickActions() {
  const { toast } = useToast()
  const [isLoading, setIsLoading] = useState<string | null>(null)

  const actions: QuickAction[] = [
    { 
      id: "venues",
      icon: MapPin, 
      label: "Find Venues", 
      href: "/venues", 
      color: "bg-pink-500",
      description: "Discover perfect wedding venues",
      isPopular: true,
      count: 156
    },
    { 
      id: "photography",
      icon: Camera, 
      label: "Browse Photographers", 
      href: "/vendors?category=photography", 
      color: "bg-purple-500",
      description: "Capture your special moments",
      count: 89
    },
    { 
      id: "catering",
      icon: Utensils, 
      label: "Book Catering", 
      href: "/vendors?category=catering", 
      color: "bg-blue-500",
      description: "Delicious wedding catering options",
      isNew: true,
      count: 124
    },
    { 
      id: "entertainment",
      icon: Music, 
      label: "Find Entertainment", 
      href: "/vendors?category=entertainment", 
      color: "bg-green-500",
      description: "Music and entertainment services",
      count: 67
    },
    { 
      id: "decoration",
      icon: Flower, 
      label: "Decoration Services", 
      href: "/vendors?category=decoration", 
      color: "bg-yellow-500",
      description: "Beautiful wedding decorations",
      count: 93
    },
    { 
      id: "guests",
      icon: Users, 
      label: "Manage Guest List", 
      href: "/planning?tab=guests", 
      color: "bg-red-500",
      description: "Organize your guest list",
      count: 0
    },
  ]

  const handleActionClick = async (action: QuickAction) => {
    setIsLoading(action.id)
    try {
      // Simulate navigation delay
      await new Promise(resolve => setTimeout(resolve, 500))
      
      toast({
        title: "Navigating",
        description: `Taking you to ${action.label}`,
      })
      
      // Here you would typically use Next.js router to navigate
      // router.push(action.href)
      
    } catch (error) {
      toast({
        title: "Navigation Error",
        description: "Failed to navigate. Please try again.",
        variant: "destructive",
      })
    } finally {
      setIsLoading(null)
    }
  }

  const getActionStatus = (action: QuickAction) => {
    if (action.isPopular) {
      return { icon: TrendingUp, label: "Popular", color: "bg-orange-100 text-orange-800 dark:bg-orange-900 dark:text-orange-200" }
    }
    if (action.isNew) {
      return { icon: Star, label: "New", color: "bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200" }
    }
    return null
  }

  return (
    <Card role="region" aria-label="Quick Actions">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
          Quick Actions
          <Badge variant="secondary" className="ml-auto">
            {actions.length} actions
          </Badge>
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
          {actions.map((action, index) => {
            const status = getActionStatus(action)
            const IconComponent = action.icon
            
            return (
              <Button
                key={action.id}
                variant="outline"
                className="h-24 flex-col space-y-2 hover:shadow-md transition-all duration-200 hover:scale-105 relative group"
                onClick={() => handleActionClick(action)}
                disabled={isLoading !== null}
                aria-label={`${action.label} - ${action.description}`}
              >
                {isLoading === action.id && (
                  <div className="absolute inset-0 bg-background/80 flex items-center justify-center rounded-md">
                    <Loader2 className="h-6 w-6 animate-spin" />
                  </div>
                )}
                
                <div className="flex items-center gap-2">
                  <div className={`w-8 h-8 rounded-full ${action.color} flex items-center justify-center`}>
                    <IconComponent className="h-4 w-4 text-white" aria-hidden="true" />
                  </div>
                  {status && (
                    <Badge className={`text-xs ${status.color}`}>
                      {status.label}
                    </Badge>
                  )}
                </div>
                
                <div className="text-center">
                  <span className="text-sm font-medium block">{action.label}</span>
                  {action.count !== undefined && action.count > 0 && (
                    <span className="text-xs text-gray-500">
                      {action.count} available
                    </span>
                  )}
                </div>
                
                {action.description && (
                  <div className="absolute bottom-0 left-0 right-0 bg-gray-900 text-white text-xs p-2 rounded-b-md opacity-0 group-hover:opacity-100 transition-opacity duration-200 pointer-events-none">
                    {action.description}
                  </div>
                )}
              </Button>
            )
          })}
        </div>
        
        <div className="mt-6 pt-4 border-t">
          <div className="flex items-center justify-between text-sm text-gray-600 dark:text-gray-400">
            <span>Need help? Contact our wedding planning experts</span>
            <Button variant="link" size="sm" className="p-0 h-auto">
              Get Support
            </Button>
          </div>
        </div>
      </CardContent>
    </Card>
  )
}


export default QuickActions
