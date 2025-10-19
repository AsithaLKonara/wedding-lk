"use client"

import { SidebarProvider, SidebarMenu, SidebarMenuButton, SidebarMenuItem, SidebarContent, SidebarHeader, SidebarFooter } from "@/components/ui/sidebar"
import { motion } from "framer-motion"
import { useEffect, useState } from "react"
import { useRouter } from "next/navigation"
import { 
  CheckCircle, 
  AlertCircle, 
  Home, 
  Calendar, 
  Heart, 
  Settings, 
  Users, 
  Bell, 
  Search,
  Star,
  Plus,
  TrendingUp,
  Clock,
  MapPin,
  Camera,
  Music,
  Utensils
} from "lucide-react"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Progress } from "@/components/ui/progress"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"

export default function DashboardPage() {
  const router = useRouter()
  
  // Mock user data
  const userProfile = {
    name: "Sarah & Michael",
    email: "sarah.michael@example.com",
    avatar: "/placeholder.svg?height=40&width=40",
    role: "couple"
  }
  
  // Wedding progress data
  const weddingProgress = {
    overall: 65,
    milestones: [
      { id: 1, title: "Book Venue", completed: true, priority: "high" },
      { id: 2, title: "Choose Photographer", completed: false, priority: "high" },
      { id: 3, title: "Select Catering", completed: false, priority: "medium" },
      { id: 4, title: "Book Entertainment", completed: false, priority: "medium" },
      { id: 5, title: "Finalize Guest List", completed: true, priority: "low" }
    ]
  }

  // Quick actions data
  const quickActions = [
    { id: 1, title: "Find Venues", icon: MapPin, color: "bg-pink-500", href: "/venues" },
    { id: 2, title: "Browse Photographers", icon: Camera, color: "bg-purple-500", href: "/vendors?category=photography" },
    { id: 3, title: "Book Catering", icon: Utensils, color: "bg-green-500", href: "/vendors?category=catering" },
    { id: 4, title: "Find Entertainment", icon: Music, color: "bg-blue-500", href: "/vendors?category=entertainment" }
  ]

  // Recent activity data
  const recentActivity = [
    { id: 1, type: "venue", message: "Viewed Grand Ballroom Hotel", time: "2 hours ago", icon: MapPin },
    { id: 2, type: "vendor", message: "Contacted Perfect Moments Photography", time: "1 day ago", icon: Camera },
    { id: 3, type: "booking", message: "Scheduled venue visit for tomorrow", time: "2 days ago", icon: Calendar },
    { id: 4, type: "review", message: "Left review for Dream Catering", time: "3 days ago", icon: Star }
  ]

  // Saved venues data
  const savedVenues = [
    { id: 1, name: "Grand Ballroom Hotel", location: "Colombo 07", rating: 4.8, price: "LKR 450,000" },
    { id: 2, name: "Beachfront Bliss Resort", location: "Bentota", rating: 4.9, price: "LKR 300,000" },
    { id: 3, name: "Garden Pavilion", location: "Kandy", rating: 4.7, price: "LKR 200,000" }
  ]

  return (
    <SidebarProvider>
      <div className="flex h-screen bg-gray-50 dark:bg-gray-900">
        {/* Sidebar */}
        <SidebarContent className="bg-white dark:bg-gray-800 border-r border-gray-200 dark:border-gray-700">
          <SidebarHeader className="p-6 border-b border-gray-200 dark:border-gray-700">
            <div className="flex items-center space-x-3">
              <div className="w-8 h-8 bg-gradient-to-r from-pink-500 to-purple-600 rounded-lg flex items-center justify-center">
                <Heart className="h-5 w-5 text-white" />
              </div>
              <div>
                <h2 className="text-lg font-semibold text-gray-900 dark:text-white">WeddingLK</h2>
                <p className="text-sm text-gray-500 dark:text-gray-400">Dashboard</p>
              </div>
            </div>
          </SidebarHeader>
          
          <div className="flex-1 overflow-y-auto p-4">
            <SidebarMenu>
              <SidebarMenuItem>
                <SidebarMenuButton className="w-full justify-start" isActive>
                  <Home className="h-4 w-4" />
                  <span>Dashboard</span>
                </SidebarMenuButton>
              </SidebarMenuItem>
              
              <SidebarMenuItem>
                <SidebarMenuButton className="w-full justify-start">
                  <Calendar className="h-4 w-4" />
                  <span>Wedding Timeline</span>
                </SidebarMenuButton>
              </SidebarMenuItem>
              
              <SidebarMenuItem>
                <SidebarMenuButton className="w-full justify-start">
                  <MapPin className="h-4 w-4" />
                  <span>Venues</span>
                </SidebarMenuButton>
              </SidebarMenuItem>
              
              <SidebarMenuItem>
                <SidebarMenuButton className="w-full justify-start">
                  <Users className="h-4 w-4" />
                  <span>Vendors</span>
                </SidebarMenuButton>
              </SidebarMenuItem>
              
              <SidebarMenuItem>
                <SidebarMenuButton className="w-full justify-start">
                  <Heart className="h-4 w-4" />
                  <span>Favorites</span>
                </SidebarMenuButton>
              </SidebarMenuItem>
              
              <SidebarMenuItem>
                <SidebarMenuButton className="w-full justify-start">
                  <Search className="h-4 w-4" />
                  <span>AI Search</span>
                </SidebarMenuButton>
              </SidebarMenuItem>
              
              <SidebarMenuItem>
                <SidebarMenuButton className="w-full justify-start">
                  <Bell className="h-4 w-4" />
                  <span>Notifications</span>
                  <Badge variant="secondary" className="ml-auto">3</Badge>
                </SidebarMenuButton>
              </SidebarMenuItem>
              
              <SidebarMenuItem>
                <SidebarMenuButton className="w-full justify-start">
                  <Settings className="h-4 w-4" />
                  <span>Settings</span>
                </SidebarMenuButton>
              </SidebarMenuItem>
            </SidebarMenu>
          </div>
          
          <SidebarFooter className="p-4 border-t border-gray-200 dark:border-gray-700">
            <div className="flex items-center space-x-3">
              <img 
                src={userProfile.avatar} 
                alt={userProfile.name}
                className="w-8 h-8 rounded-full"
              />
              <div className="flex-1 min-w-0">
                <p className="text-sm font-medium text-gray-900 dark:text-white truncate">
                  {userProfile.name}
                </p>
                <p className="text-xs text-gray-500 dark:text-gray-400 truncate">
                  {userProfile.email}
                </p>
              </div>
            </div>
          </SidebarFooter>
        </SidebarContent>

        {/* Main Content */}
        <div className="flex-1 overflow-y-auto">
          <div className="p-6">
            {/* Header */}
            <div className="mb-8">
              <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-2">
                Welcome back, Sarah!
              </h1>
              <p className="text-gray-600 dark:text-gray-400">
                Your wedding planning journey continues. Let's make your dream day perfect.
              </p>
            </div>

            {/* Wedding Progress */}
            <Card className="mb-8">
              <CardHeader>
                <CardTitle className="flex items-center">
                  <TrendingUp className="h-5 w-5 mr-2" />
                  Wedding Progress
                </CardTitle>
                <CardDescription>
                  Track your wedding planning milestones
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="mb-4">
                  <div className="flex justify-between items-center mb-2">
                    <span className="text-sm font-medium text-gray-700 dark:text-gray-300">
                      Overall Progress
                    </span>
                    <span className="text-sm font-medium text-gray-900 dark:text-white">
                      {weddingProgress.overall}%
                    </span>
                  </div>
                  <Progress value={weddingProgress.overall} className="h-2" />
                </div>
                
                <div className="space-y-3">
                  {weddingProgress.milestones.map((milestone) => (
                    <div key={milestone.id} className="flex items-center space-x-3">
                      {milestone.completed ? (
                        <CheckCircle className="h-5 w-5 text-green-500" />
                      ) : (
                        <AlertCircle className="h-5 w-5 text-gray-400" />
                      )}
                      <span className={`text-sm ${
                        milestone.completed ? 'text-gray-900 dark:text-white' : 'text-gray-600 dark:text-gray-400'
                      }`}>
                        {milestone.title}
                      </span>
                      <Badge 
                        variant={milestone.priority === 'high' ? 'destructive' : milestone.priority === 'medium' ? 'default' : 'secondary'}
                        className="ml-auto"
                      >
                        {milestone.priority}
                      </Badge>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>

            {/* Quick Actions */}
            <Card className="mb-8">
              <CardHeader>
                <CardTitle>Quick Actions</CardTitle>
                <CardDescription>
                  Jump into planning your perfect wedding
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                  {quickActions.map((action) => (
                    <motion.div
                      key={action.id}
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.95 }}
                    >
                      <Button 
                        variant="outline" 
                        className="w-full h-24 flex flex-col items-center justify-center space-y-2"
                        onClick={() => router.push(action.href)}
                      >
                        <div className={`p-2 rounded-lg ${action.color}`}>
                          <action.icon className="h-6 w-6 text-white" />
                        </div>
                        <span className="text-sm font-medium">{action.title}</span>
                      </Button>
                    </motion.div>
                  ))}
                </div>
              </CardContent>
            </Card>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
              {/* Recent Activity */}
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center">
                    <Clock className="h-5 w-5 mr-2" />
                    Recent Activity
                  </CardTitle>
                  <CardDescription>
                    Your latest wedding planning activities
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {recentActivity.map((activity) => (
                      <div key={activity.id} className="flex items-start space-x-3">
                        <div className="p-2 bg-gray-100 dark:bg-gray-700 rounded-lg">
                          <activity.icon className="h-4 w-4 text-gray-600 dark:text-gray-400" />
                        </div>
                        <div className="flex-1 min-w-0">
                          <p className="text-sm text-gray-900 dark:text-white">
                            {activity.message}
                          </p>
                          <p className="text-xs text-gray-500 dark:text-gray-400">
                            {activity.time}
                          </p>
                        </div>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>

              {/* Saved Venues */}
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center">
                    <Heart className="h-5 w-5 mr-2" />
                    Saved Venues
                  </CardTitle>
                  <CardDescription>
                    Your favorite wedding venues
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {savedVenues.map((venue) => (
                      <div key={venue.id} className="flex items-center justify-between p-3 bg-gray-50 dark:bg-gray-700 rounded-lg">
                        <div>
                          <h4 className="text-sm font-medium text-gray-900 dark:text-white">
                            {venue.name}
                          </h4>
                          <p className="text-xs text-gray-600 dark:text-gray-400">
                            {venue.location}
                          </p>
                        </div>
                        <div className="text-right">
                          <div className="flex items-center space-x-1 mb-1">
                            <Star className="h-3 w-3 text-yellow-400 fill-current" />
                            <span className="text-xs text-gray-900 dark:text-white">
                              {venue.rating}
                            </span>
                          </div>
                          <p className="text-xs text-gray-600 dark:text-gray-400">
                            {venue.price}
                          </p>
                        </div>
                      </div>
                    ))}
                  </div>
                  <Button variant="outline" className="w-full mt-4">
                    <Plus className="h-4 w-4 mr-2" />
                    View All Saved Venues
                  </Button>
                </CardContent>
              </Card>
            </div>
          </div>
        </div>
      </div>
    </SidebarProvider>
  )
}