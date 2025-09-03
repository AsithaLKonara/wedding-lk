"use client"

import { useSearchParams } from 'next/navigation'
import { useState, useEffect, Suspense, lazy } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { Badge } from '@/components/ui/badge'
import { LayoutDashboard, Calendar, Heart, MessageSquare, CreditCard, Settings, Loader2, Users, Star, MapPin } from 'lucide-react'
import { DashboardOverview } from './components/dashboard-overview'
import { usePerformanceMonitor } from '@/hooks/use-performance-monitor'

// Lazy load heavy components
const BookingsTab = lazy(() => import('./components/bookings-tab'))
const FavoritesTab = lazy(() => import('./components/favorites-tab'))
const MessagesTab = lazy(() => import('./components/messages-tab'))
const PaymentsTab = lazy(() => import('./components/payments-tab'))

function DashboardContent() {
  const searchParams = useSearchParams()
  const [activeTab, setActiveTab] = useState('overview')
  const [isLoading, setIsLoading] = useState(true)
  const [stats, setStats] = useState({
    totalBookings: 0,
    totalFavorites: 0,
    totalMessages: 0,
    totalPayments: 0
  })
  const [bookings, setBookings] = useState([])
  const [favorites, setFavorites] = useState([])
  const [messages, setMessages] = useState([])
  const [payments, setPayments] = useState([])
  
  // Performance monitoring
  usePerformanceMonitor()

  useEffect(() => {
    const tab = searchParams.get('tab') || 'overview'
    setActiveTab(tab)
    
    // Fetch stats immediately
    fetchUserStats()
    
    // Prefetch all data in background for instant tab switching
    const prefetchData = async () => {
      try {
        await Promise.all([
          fetchBookings(),
          fetchFavorites(),
          fetchMessages(),
          fetchPayments()
        ])
      } catch (error) {
        console.log('Background prefetch completed')
      }
    }
    
    // Start prefetching after a short delay
    setTimeout(prefetchData, 100)
  }, [searchParams])

  const fetchUserStats = async () => {
    try {
      const response = await fetch('/api/dashboard/user/stats')
      if (response.ok) {
        const data = await response.json()
        setStats(data.stats)
      }
    } catch (error) {
      console.error('Error fetching user stats:', error)
    } finally {
      setIsLoading(false)
    }
  }

  const fetchBookings = async () => {
    try {
      const response = await fetch('/api/dashboard/user/bookings')
      if (response.ok) {
        const data = await response.json()
        setBookings(data.bookings)
      }
    } catch (error) {
      console.error('Error fetching bookings:', error)
    }
  }

  const fetchFavorites = async () => {
    try {
      const response = await fetch('/api/dashboard/user/favorites')
      if (response.ok) {
        const data = await response.json()
        setFavorites(data.favorites)
      }
    } catch (error) {
      console.error('Error fetching favorites:', error)
    }
  }

  const fetchMessages = async () => {
    try {
      const response = await fetch('/api/dashboard/user/messages')
      if (response.ok) {
        const data = await response.json()
        setMessages(data.messages)
      }
    } catch (error) {
      console.error('Error fetching messages:', error)
    }
  }

  const fetchPayments = async () => {
    try {
      const response = await fetch('/api/dashboard/user/payments')
      if (response.ok) {
        const data = await response.json()
        setPayments(data.payments)
      }
    } catch (error) {
      console.error('Error fetching payments:', error)
    }
  }

  // Show immediate content while loading
  if (isLoading) {
    return (
      <div className="container mx-auto py-8 px-4 md:px-6">
        {/* User Header */}
        <div className="flex items-center justify-between mb-8">
          <div className="flex items-center space-x-4">
            <div className="p-3 bg-blue-100 rounded-full">
              <LayoutDashboard className="h-8 w-8 text-blue-600" />
            </div>
            <div>
              <h1 className="text-3xl font-bold">Wedding Planning Dashboard</h1>
              <p className="text-gray-600 mt-2">Loading your data...</p>
            </div>
          </div>
        </div>
        
        {/* Show skeleton stats while loading */}
        <DashboardOverview stats={{ totalBookings: 0, totalFavorites: 0, totalMessages: 0, totalPayments: 0 }} />
        
        {/* Loading indicator */}
        <div className="text-center py-8">
          <Loader2 className="h-8 w-8 animate-spin text-blue-600 mx-auto" />
          <p className="mt-2 text-gray-600">Loading your dashboard data...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="container mx-auto py-8 px-4 md:px-6">
      {/* User Header */}
      <div className="flex items-center justify-between mb-8">
        <div className="flex items-center space-x-4">
          <div className="p-3 bg-blue-100 rounded-full">
            <LayoutDashboard className="h-8 w-8 text-blue-600" />
          </div>
          <div>
            <h1 className="text-3xl font-bold">Wedding Planning Dashboard</h1>
            <p className="text-gray-600 mt-2">Manage your wedding planning journey</p>
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
            <p className="text-xs text-muted-foreground">Venues & vendors</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Favorites</CardTitle>
            <Heart className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.totalFavorites}</div>
            <p className="text-xs text-muted-foreground">Saved items</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Messages</CardTitle>
            <MessageSquare className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.totalMessages}</div>
            <p className="text-xs text-muted-foreground">Unread messages</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Payments</CardTitle>
            <CreditCard className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.totalPayments}</div>
            <p className="text-xs text-muted-foreground">Total transactions</p>
          </CardContent>
        </Card>
      </div>

      {/* User Tabs */}
      <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-6">
        <TabsList className="grid w-full grid-cols-5">
          <TabsTrigger value="overview">Overview</TabsTrigger>
          <TabsTrigger value="bookings">Bookings</TabsTrigger>
          <TabsTrigger value="favorites">Favorites</TabsTrigger>
          <TabsTrigger value="messages">Messages</TabsTrigger>
          <TabsTrigger value="payments">Payments</TabsTrigger>
        </TabsList>

        <TabsContent value="overview" className="space-y-6">
          <DashboardOverview stats={stats} />
        </TabsContent>

        <TabsContent value="bookings" className="space-y-6">
          <Suspense fallback={
            <Card>
              <CardContent className="p-8">
                <div className="flex items-center justify-center">
                  <Loader2 className="h-8 w-8 animate-spin text-blue-600" />
                  <span className="ml-2">Loading bookings...</span>
                </div>
              </CardContent>
            </Card>
          }>
            <BookingsTab />
          </Suspense>
        </TabsContent>

        <TabsContent value="favorites" className="space-y-6">
          <Suspense fallback={
            <Card>
              <CardContent className="p-8">
                <div className="flex items-center justify-center">
                  <Loader2 className="h-8 w-8 animate-spin text-blue-600" />
                  <span className="ml-2">Loading favorites...</span>
                </div>
              </CardContent>
            </Card>
          }>
            <FavoritesTab />
          </Suspense>
        </TabsContent>

        <TabsContent value="messages" className="space-y-6">
          <Suspense fallback={
            <Card>
              <CardContent className="p-8">
                <div className="flex items-center justify-center">
                  <Loader2 className="h-8 w-8 animate-spin text-blue-600" />
                  <span className="ml-2">Loading messages...</span>
                </div>
              </CardContent>
            </Card>
          }>
            <MessagesTab />
          </Suspense>
        </TabsContent>

        <TabsContent value="payments" className="space-y-6">
          <Suspense fallback={
            <Card>
              <CardContent className="p-8">
                <div className="flex items-center justify-center">
                  <Loader2 className="h-8 w-8 animate-spin text-blue-600" />
                  <span className="ml-2">Loading payments...</span>
                </div>
              </CardContent>
            </Card>
          }>
            <PaymentsTab />
          </Suspense>
        </TabsContent>
      </Tabs>
    </div>
  )
}

export default function UserDashboard() {
  return (
    <Suspense fallback={<div>Loading...</div>}>
      <DashboardContent />
    </Suspense>
  )
}
