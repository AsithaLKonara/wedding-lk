"use client"

import { MainLayout } from "@/components/templates/main-layout"
import { useState, useEffect } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Progress } from "@/components/ui/progress"
import { 
  BarChart3, 
  Users, 
  MessageCircle, 
  Calendar, 
  Camera, 
  Star, 
  TrendingUp, 
  Eye,
  Phone,
  Mail,
  Settings,
  Plus,
  Edit,
  CheckCircle,
  AlertCircle
} from "lucide-react"

interface VendorStats {
  totalViews: number
  totalInquiries: number
  totalBookings: number
  conversionRate: number
  averageRating: number
  totalReviews: number
}

interface Inquiry {
  id: string
  coupleName: string
  email: string
  phone: string
  eventDate: string
  message: string
  status: 'new' | 'contacted' | 'quoted' | 'booked' | 'declined'
  timestamp: Date
}

interface Booking {
  id: string
  coupleName: string
  eventDate: string
  service: string
  amount: number
  status: 'confirmed' | 'pending' | 'completed' | 'cancelled'
}

export default function VendorDashboardPage() {
  const [stats, setStats] = useState<VendorStats>({
    totalViews: 1247,
    totalInquiries: 89,
    totalBookings: 23,
    conversionRate: 25.8,
    averageRating: 4.7,
    totalReviews: 156
  })

  const [recentInquiries, setRecentInquiries] = useState<Inquiry[]>([
    {
      id: '1',
      coupleName: 'Sarah & John',
      email: 'sarah.john@email.com',
      phone: '+94 77 123 4567',
      eventDate: '2024-06-15',
      message: 'Hi, we\'re interested in your photography services for our beach wedding in Galle. Could you please share your portfolio and pricing?',
      status: 'new',
      timestamp: new Date(Date.now() - 2 * 60 * 60 * 1000) // 2 hours ago
    },
    {
      id: '2',
      coupleName: 'Priya & Raj',
      email: 'priya.raj@email.com',
      phone: '+94 71 987 6543',
      eventDate: '2024-07-22',
      message: 'We love your work! Could you tell us about your traditional wedding photography packages?',
      status: 'contacted',
      timestamp: new Date(Date.now() - 5 * 60 * 60 * 1000) // 5 hours ago
    },
    {
      id: '3',
      coupleName: 'Lisa & Mike',
      email: 'lisa.mike@email.com',
      phone: '+94 76 555 7777',
      eventDate: '2024-08-10',
      message: 'Thank you for the quote. We\'d like to book you for our wedding. What are the next steps?',
      status: 'quoted',
      timestamp: new Date(Date.now() - 24 * 60 * 60 * 1000) // 1 day ago
    }
  ])

  const [upcomingBookings, setUpcomingBookings] = useState<Booking[]>([
    {
      id: '1',
      coupleName: 'Emma & David',
      eventDate: '2024-03-15',
      service: 'Wedding Photography',
      amount: 120000,
      status: 'confirmed'
    },
    {
      id: '2',
      coupleName: 'Nisha & Kumar',
      eventDate: '2024-03-22',
      service: 'Pre-wedding + Wedding Photography',
      amount: 180000,
      status: 'confirmed'
    },
    {
      id: '3',
      coupleName: 'Anna & Tom',
      eventDate: '2024-04-05',
      service: 'Wedding Photography',
      amount: 95000,
      status: 'pending'
    }
  ])

  const [profileCompletion, setProfileCompletion] = useState(85)

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'new': return 'bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200'
      case 'contacted': return 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200'
      case 'quoted': return 'bg-purple-100 text-purple-800 dark:bg-purple-900 dark:text-purple-200'
      case 'booked': return 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200'
      case 'declined': return 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200'
      default: return 'bg-gray-100 text-gray-800 dark:bg-gray-900 dark:text-gray-200'
    }
  }

  const getBookingStatusColor = (status: string) => {
    switch (status) {
      case 'confirmed': return 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200'
      case 'pending': return 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200'
      case 'completed': return 'bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200'
      case 'cancelled': return 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200'
      default: return 'bg-gray-100 text-gray-800 dark:bg-gray-900 dark:text-gray-200'
    }
  }

  return (
    <MainLayout>
      <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
        <div className="container mx-auto px-4 py-8">
          <div className="max-w-7xl mx-auto">
            {/* Header */}
            <div className="flex justify-between items-center mb-8">
              <div>
                <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-2">
                  Vendor Dashboard
                </h1>
                <p className="text-gray-600 dark:text-gray-400">
                  Manage your business, track performance, and grow your wedding service
                </p>
              </div>
              <div className="flex gap-3">
                <Button variant="outline">
                  <Settings className="h-4 w-4 mr-2" />
                  Settings
                </Button>
                <Button>
                  <Plus className="h-4 w-4 mr-2" />
                  Add Service
                </Button>
              </div>
            </div>

            {/* Profile Completion Alert */}
            {profileCompletion < 100 && (
              <div className="mb-6 p-4 bg-yellow-50 dark:bg-yellow-900/20 border border-yellow-200 dark:border-yellow-800 rounded-lg">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <AlertCircle className="h-5 w-5 text-yellow-600" />
                    <div>
                      <h3 className="font-semibold text-yellow-800 dark:text-yellow-200">
                        Complete Your Profile
                      </h3>
                      <p className="text-sm text-yellow-700 dark:text-yellow-300">
                        {profileCompletion}% complete. Complete your profile to get more bookings.
                      </p>
                    </div>
                  </div>
                  <Button size="sm" variant="outline">
                    Complete Profile
                  </Button>
                </div>
                <Progress value={profileCompletion} className="mt-3 h-2" />
              </div>
            )}

            {/* Stats Cards */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
              <Card>
                <CardContent className="p-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm font-medium text-gray-600 dark:text-gray-400">Total Views</p>
                      <p className="text-2xl font-bold text-gray-900 dark:text-white">{stats.totalViews.toLocaleString()}</p>
                    </div>
                    <Eye className="h-8 w-8 text-blue-500" />
                  </div>
                  <div className="flex items-center mt-2">
                    <TrendingUp className="h-4 w-4 text-green-500 mr-1" />
                    <span className="text-sm text-green-600">+12% from last month</span>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardContent className="p-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm font-medium text-gray-600 dark:text-gray-400">Inquiries</p>
                      <p className="text-2xl font-bold text-gray-900 dark:text-white">{stats.totalInquiries}</p>
                    </div>
                    <MessageCircle className="h-8 w-8 text-green-500" />
                  </div>
                  <div className="flex items-center mt-2">
                    <TrendingUp className="h-4 w-4 text-green-500 mr-1" />
                    <span className="text-sm text-green-600">+8% from last month</span>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardContent className="p-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm font-medium text-gray-600 dark:text-gray-400">Bookings</p>
                      <p className="text-2xl font-bold text-gray-900 dark:text-white">{stats.totalBookings}</p>
                    </div>
                    <Calendar className="h-8 w-8 text-purple-500" />
                  </div>
                  <div className="flex items-center mt-2">
                    <TrendingUp className="h-4 w-4 text-green-500 mr-1" />
                    <span className="text-sm text-green-600">+15% from last month</span>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardContent className="p-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm font-medium text-gray-600 dark:text-gray-400">Rating</p>
                      <p className="text-2xl font-bold text-gray-900 dark:text-white">{stats.averageRating}</p>
                    </div>
                    <Star className="h-8 w-8 text-yellow-500 fill-current" />
                  </div>
                  <div className="flex items-center mt-2">
                    <span className="text-sm text-gray-600">{stats.totalReviews} reviews</span>
                  </div>
                </CardContent>
              </Card>
            </div>

            <div className="grid lg:grid-cols-3 gap-8">
              {/* Main Content */}
              <div className="lg:col-span-2 space-y-8">
                {/* Recent Inquiries */}
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <MessageCircle className="h-5 w-5" />
                      Recent Inquiries
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-4">
                      {recentInquiries.map((inquiry) => (
                        <div key={inquiry.id} className="border rounded-lg p-4 hover:shadow-md transition-shadow">
                          <div className="flex items-start justify-between mb-3">
                            <div>
                              <h4 className="font-semibold text-gray-900 dark:text-white">
                                {inquiry.coupleName}
                              </h4>
                              <p className="text-sm text-gray-600 dark:text-gray-400">
                                Wedding Date: {new Date(inquiry.eventDate).toLocaleDateString()}
                              </p>
                            </div>
                            <Badge className={getStatusColor(inquiry.status)}>
                              {inquiry.status}
                            </Badge>
                          </div>
                          
                          <p className="text-sm text-gray-700 dark:text-gray-300 mb-3">
                            {inquiry.message}
                          </p>
                          
                          <div className="flex items-center justify-between">
                            <div className="flex items-center gap-4 text-sm text-gray-500">
                              <span className="flex items-center gap-1">
                                <Mail className="h-3 w-3" />
                                {inquiry.email}
                              </span>
                              <span className="flex items-center gap-1">
                                <Phone className="h-3 w-3" />
                                {inquiry.phone}
                              </span>
                            </div>
                            <div className="flex gap-2">
                              <Button size="sm" variant="outline">
                                <MessageCircle className="h-3 w-3 mr-1" />
                                Reply
                              </Button>
                              <Button size="sm">
                                View Details
                              </Button>
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  </CardContent>
                </Card>

                {/* Upcoming Bookings */}
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <Calendar className="h-5 w-5" />
                      Upcoming Bookings
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-4">
                      {upcomingBookings.map((booking) => (
                        <div key={booking.id} className="border rounded-lg p-4 hover:shadow-md transition-shadow">
                          <div className="flex items-center justify-between mb-2">
                            <h4 className="font-semibold text-gray-900 dark:text-white">
                              {booking.coupleName}
                            </h4>
                            <Badge className={getBookingStatusColor(booking.status)}>
                              {booking.status}
                            </Badge>
                          </div>
                          
                          <div className="flex items-center justify-between">
                            <div className="text-sm text-gray-600 dark:text-gray-400">
                              <p>{booking.service}</p>
                              <p>{new Date(booking.eventDate).toLocaleDateString()}</p>
                            </div>
                            <div className="text-right">
                              <p className="font-semibold text-gray-900 dark:text-white">
                                LKR {booking.amount.toLocaleString()}
                              </p>
                              <Button size="sm" variant="outline">
                                View Details
                              </Button>
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  </CardContent>
                </Card>
              </div>

              {/* Sidebar */}
              <div className="space-y-6">
                {/* Quick Actions */}
                <Card>
                  <CardHeader>
                    <CardTitle>Quick Actions</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-3">
                    <Button variant="outline" className="w-full justify-start">
                      <Plus className="h-4 w-4 mr-2" />
                      Add New Service
                    </Button>
                    <Button variant="outline" className="w-full justify-start">
                      <Camera className="h-4 w-4 mr-2" />
                      Update Portfolio
                    </Button>
                    <Button variant="outline" className="w-full justify-start">
                      <Edit className="h-4 w-4 mr-2" />
                      Edit Profile
                    </Button>
                    <Button variant="outline" className="w-full justify-start">
                      <BarChart3 className="h-4 w-4 mr-2" />
                      View Analytics
                    </Button>
                  </CardContent>
                </Card>

                {/* Performance Metrics */}
                <Card>
                  <CardHeader>
                    <CardTitle>Performance</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div>
                      <div className="flex justify-between text-sm mb-1">
                        <span>Conversion Rate</span>
                        <span>{stats.conversionRate}%</span>
                      </div>
                      <Progress value={stats.conversionRate} className="h-2" />
                    </div>
                    
                    <div>
                      <div className="flex justify-between text-sm mb-1">
                        <span>Response Time</span>
                        <span>2.3 hours</span>
                      </div>
                      <Progress value={85} className="h-2" />
                    </div>
                    
                    <div>
                      <div className="flex justify-between text-sm mb-1">
                        <span>Customer Satisfaction</span>
                        <span>{stats.averageRating}/5</span>
                      </div>
                      <Progress value={stats.averageRating * 20} className="h-2" />
                    </div>
                  </CardContent>
                </Card>

                {/* Tips & Resources */}
                <Card>
                  <CardHeader>
                    <CardTitle>Tips & Resources</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-3">
                    <div className="p-3 bg-blue-50 dark:bg-blue-900/20 rounded-lg">
                      <h4 className="font-semibold text-blue-900 dark:text-blue-100 text-sm">
                        💡 Tip of the Day
                      </h4>
                      <p className="text-blue-800 dark:text-blue-200 text-xs mt-1">
                        Respond to inquiries within 2 hours to increase booking chances by 40%.
                      </p>
                    </div>
                    
                    <div className="p-3 bg-green-50 dark:bg-green-900/20 rounded-lg">
                      <h4 className="font-semibold text-green-900 dark:text-green-100 text-sm">
                        📈 Performance
                      </h4>
                      <p className="text-green-800 dark:text-green-200 text-xs mt-1">
                        Your conversion rate is above average! Keep up the great work.
                      </p>
                    </div>
                  </CardContent>
                </Card>
              </div>
            </div>
          </div>
        </div>
      </div>
    </MainLayout>
  )
}