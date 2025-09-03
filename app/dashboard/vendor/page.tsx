"use client"

import { useSearchParams } from 'next/navigation'
import { useState, useEffect, Suspense } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { Store, Calendar, TrendingUp, MessageCircle, Settings, Star, DollarSign, Users, Loader2, Plus, Zap, Package, LayoutDashboard } from 'lucide-react'

function VendorDashboardContent() {
  const searchParams = useSearchParams()
  const [activeTab, setActiveTab] = useState('overview')
  const [isLoading, setIsLoading] = useState(true)
  const [stats, setStats] = useState({
    totalBookings: 0,
    totalRevenue: 0,
    averageRating: 0,
    activeServices: 0
  })
  const [analytics, setAnalytics] = useState<any>({})
  const [services, setServices] = useState<any[]>([])
  const [bookings, setBookings] = useState<any[]>([])
  const [messages, setMessages] = useState<any[]>([])
  const [analyticsLoading, setAnalyticsLoading] = useState(false)
  const [servicesLoading, setServicesLoading] = useState(false)
  const [bookingsLoading, setBookingsLoading] = useState(false)
  const [messagesLoading, setMessagesLoading] = useState(false)

  useEffect(() => {
    const tab = searchParams.get('tab') || 'overview'
    setActiveTab(tab)
    fetchVendorStats()
    
    if (tab === 'services') fetchServices()
    if (tab === 'bookings') fetchBookings()
    if (tab === 'analytics') fetchAnalytics()
    if (tab === 'messages') fetchMessages()

    // Add event listeners for table actions
    const handleServiceActionEvent = (event: CustomEvent) => {
      const { serviceId, action } = event.detail
      handleServiceAction(serviceId, action)
    }

    const handleBookingActionEvent = (event: CustomEvent) => {
      const { bookingId, action } = event.detail
      handleBookingAction(bookingId, action)
    }

    window.addEventListener('serviceAction', handleServiceActionEvent as EventListener)
    window.addEventListener('bookingAction', handleBookingActionEvent as EventListener)

    return () => {
      window.removeEventListener('serviceAction', handleServiceActionEvent as EventListener)
      window.removeEventListener('bookingAction', handleBookingActionEvent as EventListener)
    }
  }, [searchParams, activeTab])

  const fetchVendorStats = async () => {
    try {
      const response = await fetch('/api/dashboard/vendor/stats')
      if (response.ok) {
        const data = await response.json()
        setStats(data.stats)
      }
    } catch (error) {
      console.error('Error fetching vendor stats:', error)
    } finally {
      setIsLoading(false)
    }
  }

  const fetchServices = async () => {
    try {
      setServicesLoading(true)
      const response = await fetch('/api/dashboard/vendor/services')
      if (response.ok) {
        const data = await response.json()
        setServices(data.services)
      }
    } catch (error) {
      console.error('Error fetching services:', error)
    } finally {
      setServicesLoading(false)
    }
  }

  const fetchBookings = async () => {
    try {
      setBookingsLoading(true)
      const response = await fetch('/api/dashboard/vendor/bookings')
      if (response.ok) {
        const data = await response.json()
        setBookings(data.bookings)
      }
    } catch (error) {
      console.error('Error fetching bookings:', error)
    } finally {
      setBookingsLoading(false)
    }
  }

  const fetchAnalytics = async () => {
    try {
      setAnalyticsLoading(true)
      const response = await fetch('/api/dashboard/vendor/analytics')
      if (response.ok) {
        const data = await response.json()
        setAnalytics(data.analytics)
      }
    } catch (error) {
      console.error('Error fetching analytics:', error)
    } finally {
      setAnalyticsLoading(false)
    }
  }

  const fetchMessages = async () => {
    try {
      setMessagesLoading(true)
      const response = await fetch('/api/dashboard/vendor/messages')
      if (response.ok) {
        const data = await response.json()
        setMessages(data.messages)
      }
    } catch (error) {
      console.error('Error fetching messages:', error)
    } finally {
      setMessagesLoading(false)
    }
  }

  const handleServiceAction = async (serviceId: string, action: string) => {
    try {
      const response = await fetch('/api/dashboard/vendor/services', {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ 
          serviceId, 
          updates: { isActive: action === 'activate' } 
        })
      })
      
      if (response.ok) {
        fetchServices()
        fetchVendorStats()
      }
    } catch (error) {
      console.error('Error updating service:', error)
    }
  }

  const handleBookingAction = async (bookingId: string, action: string) => {
    try {
      const response = await fetch('/api/dashboard/vendor/bookings', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ bookingId, action })
      })
      
      if (response.ok) {
        fetchBookings()
        fetchVendorStats()
      }
    } catch (error) {
      console.error('Error processing booking action:', error)
    }
  }

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center">
          <Loader2 className="h-32 w-32 animate-spin text-blue-600 mx-auto" />
          <p className="mt-4 text-gray-600">Loading vendor dashboard...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="container mx-auto py-8 px-4 md:px-6">
      {/* Vendor Header */}
      <div className="flex items-center justify-between mb-8">
        <div className="flex items-center space-x-4">
          <div className="p-3 bg-blue-100 rounded-full">
            <Store className="h-8 w-8 text-blue-600" />
          </div>
          <div>
            <h1 className="text-3xl font-bold">Vendor Dashboard</h1>
            <p className="text-gray-600 mt-2">Manage your business, services, and bookings</p>
          </div>
        </div>
        <div className="flex items-center space-x-2">
          <Button variant="outline" size="icon">
            <Settings className="h-5 w-5" />
          </Button>
        </div>
      </div>

      {/* Quick Stats */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Bookings</CardTitle>
            <Calendar className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.totalBookings}</div>
            <p className="text-xs text-muted-foreground">+15% from last month</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Revenue</CardTitle>
            <DollarSign className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">LKR {stats.totalRevenue.toLocaleString()}</div>
            <p className="text-xs text-muted-foreground">Avg: LKR 39,000</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Avg Rating</CardTitle>
            <Star className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.averageRating}</div>
            <p className="text-xs text-muted-foreground">18 reviews</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Active Services</CardTitle>
            <Store className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.activeServices}</div>
            <p className="text-xs text-muted-foreground">All available</p>
          </CardContent>
        </Card>
      </div>

      {/* Vendor Tabs */}
      <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-6">
        <TabsList className="grid w-full grid-cols-5">
          <TabsTrigger value="overview">Overview</TabsTrigger>
          <TabsTrigger value="bookings">Bookings</TabsTrigger>
          <TabsTrigger value="services">Services</TabsTrigger>
          <TabsTrigger value="analytics">Analytics</TabsTrigger>
          <TabsTrigger value="messages">Messages</TabsTrigger>
        </TabsList>

        <TabsContent value="overview" className="space-y-6">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center">
                  <TrendingUp className="h-5 w-5 mr-2" />
                  Recent Activity
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="flex items-center space-x-3">
                    <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                    <div className="flex-1">
                      <p className="text-sm font-medium">New booking received</p>
                      <p className="text-xs text-gray-500">1 hour ago</p>
                    </div>
                  </div>
                  <div className="flex items-center space-x-3">
                    <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
                    <div className="flex-1">
                      <p className="text-sm font-medium">Payment received</p>
                      <p className="text-xs text-gray-500">3 hours ago</p>
                    </div>
                  </div>
                  <div className="flex items-center space-x-3">
                    <div className="w-2 h-2 bg-yellow-500 rounded-full"></div>
                    <div className="flex-1">
                      <p className="text-sm font-medium">New review posted</p>
                      <p className="text-xs text-gray-500">1 day ago</p>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Quick Actions</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm font-medium">Service Management</p>
                      <p className="text-xs text-gray-500">Manage your services</p>
                    </div>
                    <Button size="sm" variant="outline" onClick={() => setActiveTab('services')}>
                      Manage Services
                    </Button>
                  </div>
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm font-medium">Booking Calendar</p>
                      <p className="text-xs text-gray-500">View your schedule</p>
                    </div>
                    <Button size="sm" variant="outline" onClick={() => setActiveTab('bookings')}>
                      View Calendar
                    </Button>
                  </div>
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm font-medium">Business Profile</p>
                      <p className="text-xs text-gray-500">Update your profile</p>
                    </div>
                    <Button size="sm" variant="outline">
                      Update Profile
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="bookings" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center">
                <Calendar className="h-5 w-5 mr-2" />
                Booking Management
              </CardTitle>
            </CardHeader>
            <CardContent>
              {bookingsLoading ? (
                <div className="text-center py-8">
                  <Loader2 className="h-8 w-8 mx-auto mb-4 animate-spin" />
                  <p>Loading bookings...</p>
                </div>
              ) : bookings.length > 0 ? (
                <div className="space-y-4">
                  {bookings.map((booking: any) => (
                    <div key={booking._id} className="flex items-center justify-between p-4 border rounded-lg">
                      <div className="flex items-center space-x-3">
                        <div className="w-10 h-10 bg-blue-100 rounded-full flex items-center justify-center">
                          <Calendar className="h-5 w-5 text-blue-600" />
                        </div>
                        <div>
                          <p className="font-medium">{booking.client?.name || 'Unknown Client'}</p>
                          <p className="text-sm text-gray-500">{new Date(booking.date).toLocaleDateString()}</p>
                        </div>
                      </div>
                      <div className="flex items-center space-x-2">
                        <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                          booking.status === 'confirmed' ? 'bg-green-100 text-green-800' : 
                          booking.status === 'pending' ? 'bg-yellow-100 text-yellow-800' : 'bg-gray-100 text-gray-800'
                        }`}>
                          {booking.status}
                        </span>
                        <Button
                          size="sm"
                          variant="outline"
                          onClick={() => handleBookingAction(booking._id, 'confirm')}
                        >
                          Confirm
                        </Button>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="text-center py-8 text-gray-500">
                  <Calendar className="h-12 w-12 mx-auto mb-4 text-gray-300" />
                  <p>No bookings yet</p>
                  <p className="text-sm">Bookings will appear here once clients make reservations</p>
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="services" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center justify-between">
                <div className="flex items-center">
                  <Store className="h-5 w-5 mr-2" />
                  Service Management
                </div>
                <Button size="sm">
                  <Plus className="h-4 w-4 mr-2" />
                  Add Service
                </Button>
              </CardTitle>
            </CardHeader>
            <CardContent>
              {servicesLoading ? (
                <div className="text-center py-8">
                  <Loader2 className="h-8 w-8 mx-auto mb-4 animate-spin" />
                  <p>Loading services...</p>
                </div>
              ) : services.length > 0 ? (
                <div className="space-y-4">
                  {services.map((service: any) => (
                    <div key={service._id} className="flex items-center justify-between p-4 border rounded-lg">
                      <div className="flex items-center space-x-3">
                        <div className="w-10 h-10 bg-green-100 rounded-full flex items-center justify-center">
                          <Store className="h-5 w-5 text-green-600" />
                        </div>
                        <div>
                          <p className="font-medium">{service.name}</p>
                          <p className="text-sm text-gray-500">{service.category}</p>
                        </div>
                      </div>
                      <div className="flex items-center space-x-2">
                        <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                          service.isActive ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'
                        }`}>
                          {service.isActive ? 'Active' : 'Inactive'}
                        </span>
                        <Button
                          size="sm"
                          variant="outline"
                          onClick={() => handleServiceAction(service._id, service.isActive ? 'deactivate' : 'activate')}
                        >
                          {service.isActive ? 'Deactivate' : 'Activate'}
                        </Button>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="text-center py-8 text-gray-500">
                  <Store className="h-12 w-12 mx-auto mb-4 text-gray-300" />
                  <p>No services yet</p>
                  <p className="text-sm">Add your first service to start receiving bookings</p>
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="boosts" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center">
                <Zap className="h-5 w-5 mr-2" />
                Boost Campaigns
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-center py-8 text-gray-500">
                <Zap className="h-12 w-12 mx-auto mb-4 text-gray-300" />
                <p>Boost your venue visibility</p>
                <p className="text-sm">Create targeted campaigns to reach more couples</p>
                <Button className="mt-4 bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700">
                  <Plus className="h-4 w-4 mr-2" />
                  Create Boost Campaign
                </Button>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="analytics" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center">
                <TrendingUp className="h-5 w-5 mr-2" />
                Business Analytics
              </CardTitle>
            </CardHeader>
            <CardContent>
              {analyticsLoading ? (
                <div className="text-center py-8">
                  <Loader2 className="h-8 w-8 mx-auto mb-4 animate-spin" />
                  <p>Loading analytics...</p>
                </div>
              ) : analytics && analytics.bookings && analytics.revenue && analytics.reviews ? (
                <div className="space-y-6">
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <div className="p-4 border rounded-lg">
                      <h3 className="font-semibold">Bookings</h3>
                      <p className="text-2xl font-bold">{analytics.bookings.total || 0}</p>
                      <p className="text-sm text-gray-500">Total bookings in period</p>
                    </div>
                    <div className="p-4 border rounded-lg">
                      <h3 className="font-semibold">Revenue</h3>
                      <p className="text-2xl font-bold">LKR {analytics.revenue.data?.totalRevenue?.toLocaleString() || 0}</p>
                      <p className="text-sm text-gray-500">Total revenue in period</p>
                    </div>
                    <div className="p-4 border rounded-lg">
                      <h3 className="font-semibold">Reviews</h3>
                      <p className="text-2xl font-bold">{analytics.reviews.data?.averageRating?.toFixed(1) || 0}</p>
                      <p className="text-sm text-gray-500">Average rating</p>
                    </div>
                  </div>
                </div>
              ) : (
                <div className="text-center py-8 text-gray-500">
                  <TrendingUp className="h-12 w-12 mx-auto mb-4 text-gray-300" />
                  <p>No analytics data yet</p>
                  <p className="text-sm">Analytics will appear here once you have activity</p>
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="messages" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center">
                <MessageCircle className="h-5 w-5 mr-2" />
                Client Messages
              </CardTitle>
            </CardHeader>
            <CardContent>
              {messagesLoading ? (
                <div className="text-center py-8">
                  <Loader2 className="h-8 w-8 mx-auto mb-4 animate-spin" />
                  <p>Loading messages...</p>
                </div>
              ) : messages.length > 0 ? (
                <div className="space-y-4">
                  {messages.map((message: any) => (
                    <div key={message._id} className="flex items-center justify-between p-4 border rounded-lg">
                      <div className="flex items-center space-x-3">
                        <div className="w-10 h-10 bg-orange-100 rounded-full flex items-center justify-center">
                          <MessageCircle className="h-5 w-5 text-orange-600" />
                        </div>
                        <div>
                          <p className="font-medium">{message.client?.name || 'Unknown Client'}</p>
                          <p className="text-sm text-gray-500 line-clamp-2">{message.content}</p>
                        </div>
                      </div>
                      <div className="text-right">
                        <p className="text-sm text-gray-500">{new Date(message.createdAt).toLocaleDateString()}</p>
                        {!message.isRead && (
                          <div className="w-2 h-2 bg-blue-500 rounded-full mx-auto mt-2"></div>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="text-center py-8 text-gray-500">
                  <MessageCircle className="h-12 w-12 mx-auto mb-4 text-gray-300" />
                  <p>No messages yet</p>
                  <p className="text-sm">Client messages will appear here once they contact you</p>
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  )
}

export default function VendorDashboard() {
  return (
    <Suspense fallback={<div>Loading...</div>}>
      <VendorDashboardContent />
    </Suspense>
  )
}
