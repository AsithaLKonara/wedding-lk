"use client"

import { SidebarProvider, SidebarMenu, SidebarMenuButton, SidebarMenuItem, SidebarContent, SidebarHeader, SidebarFooter } from "@/components/ui/sidebar"
import { motion } from "framer-motion"
import { useState } from "react"
import { 
  Home, 
  Calendar, 
  Users, 
  Settings, 
  Bell, 
  Search,
  TrendingUp,
  Eye,
  MessageCircle,
  Star,
  Plus,
  Edit,
  BarChart3,
  Clock,
  CheckCircle,
  AlertCircle,
  DollarSign,
  Heart,
  Camera,
  MapPin
} from "lucide-react"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Progress } from "@/components/ui/progress"

export default function VendorDashboardPage() {
  // Mock vendor data
  const vendorProfile = {
    name: "Perfect Moments Photography",
    email: "contact@perfectmoments.com",
    avatar: "/placeholder.svg?height=40&width=40",
    role: "vendor"
  }
  
  // Vendor statistics
  const stats = [
    { label: "Total Views", value: "2,847", change: "+12%", icon: Eye, color: "text-blue-600" },
    { label: "Inquiries", value: "23", change: "+8%", icon: MessageCircle, color: "text-green-600" },
    { label: "Bookings", value: "15", change: "+25%", icon: Calendar, color: "text-purple-600" },
    { label: "Rating", value: "4.9", change: "+0.1", icon: Star, color: "text-yellow-600" }
  ]

  // Recent inquiries
  const recentInquiries = [
    { 
      id: 1, 
      client: "Sarah & John", 
      event: "Wedding - Colombo", 
      date: "Dec 15, 2024", 
      status: "pending",
      message: "Interested in your photography package..."
    },
    { 
      id: 2, 
      client: "Emma & David", 
      event: "Engagement - Kandy", 
      date: "Dec 20, 2024", 
      status: "confirmed",
      message: "Please confirm the booking details..."
    },
    { 
      id: 3, 
      client: "Priya & Raj", 
      event: "Wedding - Galle", 
      date: "Jan 5, 2025", 
      status: "pending",
      message: "Love your portfolio! Available for our date?"
    }
  ]

  // Upcoming bookings
  const upcomingBookings = [
    { 
      id: 1, 
      client: "Emma & David", 
      event: "Engagement Shoot", 
      date: "Dec 20, 2024", 
      time: "2:00 PM",
      location: "Kandy Royal Botanical Gardens",
      status: "confirmed"
    },
    { 
      id: 2, 
      client: "Lisa & Mark", 
      event: "Wedding Ceremony", 
      date: "Dec 28, 2024", 
      time: "6:00 PM",
      location: "Grand Ballroom Hotel",
      status: "confirmed"
    },
    { 
      id: 3, 
      client: "Anna & Tom", 
      event: "Pre-wedding Shoot", 
      date: "Jan 10, 2025", 
      time: "10:00 AM",
      location: "Beachfront Resort",
      status: "pending"
    }
  ]

  return (
    <SidebarProvider>
      <div className="flex h-screen bg-gray-50 dark:bg-gray-900">
        {/* Sidebar */}
        <SidebarContent className="bg-white dark:bg-gray-800 border-r border-gray-200 dark:border-gray-700">
          <SidebarHeader className="p-6 border-b border-gray-200 dark:border-gray-700">
            <div className="flex items-center space-x-3">
              <div className="w-8 h-8 bg-gradient-to-r from-purple-500 to-pink-600 rounded-lg flex items-center justify-center">
                <Camera className="h-5 w-5 text-white" />
              </div>
              <div>
                <h2 className="text-lg font-semibold text-gray-900 dark:text-white">Vendor Portal</h2>
                <p className="text-sm text-gray-500 dark:text-gray-400">Business Dashboard</p>
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
                  <MessageCircle className="h-4 w-4" />
                  <span>Inquiries</span>
                  <Badge variant="secondary" className="ml-auto">5</Badge>
                </SidebarMenuButton>
              </SidebarMenuItem>
              
              <SidebarMenuItem>
                <SidebarMenuButton className="w-full justify-start">
                  <Calendar className="h-4 w-4" />
                  <span>Bookings</span>
                </SidebarMenuButton>
              </SidebarMenuItem>
              
              <SidebarMenuItem>
                <SidebarMenuButton className="w-full justify-start">
                  <BarChart3 className="h-4 w-4" />
                  <span>Analytics</span>
                </SidebarMenuButton>
              </SidebarMenuItem>
              
              <SidebarMenuItem>
                <SidebarMenuButton className="w-full justify-start">
                  <Edit className="h-4 w-4" />
                  <span>Portfolio</span>
                </SidebarMenuButton>
              </SidebarMenuItem>
              
              <SidebarMenuItem>
                <SidebarMenuButton className="w-full justify-start">
                  <DollarSign className="h-4 w-4" />
                  <span>Pricing</span>
                </SidebarMenuButton>
              </SidebarMenuItem>
              
              <SidebarMenuItem>
                <SidebarMenuButton className="w-full justify-start">
                  <Bell className="h-4 w-4" />
                  <span>Notifications</span>
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
                src={vendorProfile.avatar} 
                alt={vendorProfile.name}
                className="w-8 h-8 rounded-full"
              />
              <div className="flex-1 min-w-0">
                <p className="text-sm font-medium text-gray-900 dark:text-white truncate">
                  {vendorProfile.name}
                </p>
                <p className="text-xs text-gray-500 dark:text-gray-400 truncate">
                  {vendorProfile.email}
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
                Vendor Dashboard
              </h1>
              <p className="text-gray-600 dark:text-gray-400">
                Manage your business and grow your wedding photography services.
              </p>
            </div>

            {/* Statistics Cards */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
              {stats.map((stat, index) => (
                <motion.div
                  key={stat.label}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.1 }}
                >
                  <Card>
                    <CardContent className="p-6">
                      <div className="flex items-center justify-between">
                        <div>
                          <p className="text-sm font-medium text-gray-600 dark:text-gray-400">
                            {stat.label}
                          </p>
                          <p className="text-2xl font-bold text-gray-900 dark:text-white">
                            {stat.value}
                          </p>
                          <p className="text-xs text-green-600">
                            {stat.change}
                          </p>
                        </div>
                        <div className={`p-3 rounded-lg bg-gray-100 dark:bg-gray-700`}>
                          <stat.icon className={`h-6 w-6 ${stat.color}`} />
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                </motion.div>
              ))}
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
              {/* Recent Inquiries */}
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center justify-between">
                    <span className="flex items-center">
                      <MessageCircle className="h-5 w-5 mr-2" />
                      Recent Inquiries
                    </span>
                    <Button variant="outline" size="sm">
                      View All
                    </Button>
                  </CardTitle>
                  <CardDescription>
                    Latest inquiries from potential clients
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {recentInquiries.map((inquiry) => (
                      <div key={inquiry.id} className="p-4 bg-gray-50 dark:bg-gray-700 rounded-lg">
                        <div className="flex items-start justify-between mb-2">
                          <div>
                            <h4 className="text-sm font-medium text-gray-900 dark:text-white">
                              {inquiry.client}
                            </h4>
                            <p className="text-xs text-gray-600 dark:text-gray-400">
                              {inquiry.event} • {inquiry.date}
                            </p>
                          </div>
                          <Badge 
                            variant={inquiry.status === 'confirmed' ? 'default' : 'secondary'}
                          >
                            {inquiry.status}
                          </Badge>
                        </div>
                        <p className="text-sm text-gray-700 dark:text-gray-300 mb-3">
                          {inquiry.message}
                        </p>
                        <div className="flex space-x-2">
                          <Button size="sm" variant="outline">
                            Reply
                          </Button>
                          <Button size="sm">
                            View Details
                          </Button>
                        </div>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>

              {/* Upcoming Bookings */}
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center justify-between">
                    <span className="flex items-center">
                      <Calendar className="h-5 w-5 mr-2" />
                      Upcoming Bookings
                    </span>
                    <Button variant="outline" size="sm">
                      View All
                    </Button>
                  </CardTitle>
                  <CardDescription>
                    Your scheduled photography sessions
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {upcomingBookings.map((booking) => (
                      <div key={booking.id} className="p-4 bg-gray-50 dark:bg-gray-700 rounded-lg">
                        <div className="flex items-start justify-between mb-2">
                          <div>
                            <h4 className="text-sm font-medium text-gray-900 dark:text-white">
                              {booking.client}
                            </h4>
                            <p className="text-xs text-gray-600 dark:text-gray-400">
                              {booking.event}
                            </p>
                          </div>
                          <Badge 
                            variant={booking.status === 'confirmed' ? 'default' : 'secondary'}
                          >
                            {booking.status}
                          </Badge>
                        </div>
                        <div className="space-y-1 text-sm text-gray-700 dark:text-gray-300">
                          <div className="flex items-center">
                            <Clock className="h-3 w-3 mr-1" />
                            {booking.date} at {booking.time}
                          </div>
                          <div className="flex items-center">
                            <MapPin className="h-3 w-3 mr-1" />
                            {booking.location}
                          </div>
                        </div>
                        <div className="flex space-x-2 mt-3">
                          <Button size="sm" variant="outline">
                            Edit
                          </Button>
                          <Button size="sm">
                            View Details
                          </Button>
                        </div>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* Quick Actions */}
            <Card className="mt-8">
              <CardHeader>
                <CardTitle>Quick Actions</CardTitle>
                <CardDescription>
                  Manage your business efficiently
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                  <Button variant="outline" className="h-20 flex flex-col items-center justify-center">
                    <Plus className="h-6 w-6 mb-2" />
                    <span className="text-sm">Add New Service</span>
                  </Button>
                  <Button variant="outline" className="h-20 flex flex-col items-center justify-center">
                    <Edit className="h-6 w-6 mb-2" />
                    <span className="text-sm">Update Portfolio</span>
                  </Button>
                  <Button variant="outline" className="h-20 flex flex-col items-center justify-center">
                    <Edit className="h-6 w-6 mb-2" />
                    <span className="text-sm">Edit Profile</span>
                  </Button>
                  <Button variant="outline" className="h-20 flex flex-col items-center justify-center">
                    <BarChart3 className="h-6 w-6 mb-2" />
                    <span className="text-sm">View Analytics</span>
                  </Button>
                </div>
              </CardContent>
            </Card>

            {/* Performance Metrics */}
            <Card className="mt-8">
              <CardHeader>
                <CardTitle className="flex items-center">
                  <TrendingUp className="h-5 w-5 mr-2" />
                  Performance Metrics
                </CardTitle>
                <CardDescription>
                  Track your business performance
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                  <div>
                    <div className="flex items-center justify-between mb-2">
                      <span className="text-sm font-medium text-gray-700 dark:text-gray-300">
                        Conversion Rate
                      </span>
                      <span className="text-sm font-medium text-gray-900 dark:text-white">
                        65%
                      </span>
                    </div>
                    <Progress value={65} className="h-2" />
                  </div>
                  <div>
                    <div className="flex items-center justify-between mb-2">
                      <span className="text-sm font-medium text-gray-700 dark:text-gray-300">
                        Response Time
                      </span>
                      <span className="text-sm font-medium text-gray-900 dark:text-white">
                        2.3 hours
                      </span>
                    </div>
                    <Progress value={85} className="h-2" />
                  </div>
                  <div>
                    <div className="flex items-center justify-between mb-2">
                      <span className="text-sm font-medium text-gray-700 dark:text-gray-300">
                        Customer Satisfaction
                      </span>
                      <span className="text-sm font-medium text-gray-900 dark:text-white">
                        4.9/5
                      </span>
                    </div>
                    <Progress value={98} className="h-2" />
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </SidebarProvider>
  )
}