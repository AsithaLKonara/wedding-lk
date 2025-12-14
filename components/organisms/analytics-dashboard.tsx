"use client"

import React, { useState, useEffect } from 'react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { 
  TrendingUp, 
  TrendingDown, 
  Users, 
  Calendar, 
  DollarSign, 
  Star,
  Eye,
  Heart,
  MessageSquare,
  ShoppingCart,
  BarChart3,
  PieChart,
  Activity,
  Target,
  Award,
  Clock
} from 'lucide-react'

interface AnalyticsData {
  overview: {
    totalBookings: number
    totalRevenue: number
    totalUsers: number
    totalVenues: number
    totalVendors: number
    averageRating: number
    conversionRate: number
    growthRate: number
  }
  bookings: {
    total: number
    pending: number
    confirmed: number
    completed: number
    cancelled: number
    monthlyData: Array<{ month: string; count: number; revenue: number }>
  }
  revenue: {
    total: number
    monthly: number
    average: number
    growth: number
    breakdown: {
      venueBookings: number
      vendorServices: number
      subscriptions: number
      commissions: number
    }
  }
  users: {
    total: number
    active: number
    new: number
    returning: number
    demographics: {
      ageGroups: Array<{ group: string; count: number }>
      locations: Array<{ location: string; count: number }>
    }
  }
  performance: {
    pageViews: number
    uniqueVisitors: number
    bounceRate: number
    averageSessionDuration: number
    topPages: Array<{ page: string; views: number }>
  }
  engagement: {
    totalReviews: number
    averageRating: number
    responseRate: number
    socialShares: number
    favorites: number
  }
}

interface AnalyticsDashboardProps {
  userRole?: 'admin' | 'vendor' | 'client'
  timeRange?: '7d' | '30d' | '90d' | '1y'
}

export function AnalyticsDashboard({ userRole = 'admin', timeRange = '30d' }: AnalyticsDashboardProps) {
  const [data, setData] = useState<AnalyticsData | null>(null)
  const [loading, setLoading] = useState(true)
  const [selectedTimeRange, setSelectedTimeRange] = useState(timeRange)
  const [selectedMetric, setSelectedMetric] = useState('overview')

  useEffect(() => {
    fetchAnalyticsData()
  }, [selectedTimeRange, userRole])

  const fetchAnalyticsData = async () => {
    try {
      setLoading(true)
      const response = await fetch(`/api/analytics?timeRange=${selectedTimeRange}&role=${userRole}`)
      const analyticsData = await response.json()
      setData(analyticsData)
    } catch (error) {
      console.error('Failed to fetch analytics data:', error)
    } finally {
      setLoading(false)
    }
  }

  if (loading) {
    return (
      <div className="space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          {[...Array(4)].map((_, i) => (
            <Card key={i} className="animate-pulse">
              <CardHeader className="pb-2">
                <div className="h-4 bg-gray-200 rounded w-3/4"></div>
                <div className="h-6 bg-gray-200 rounded w-1/2"></div>
              </CardHeader>
              <CardContent>
                <div className="h-8 bg-gray-200 rounded w-1/3"></div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    )
  }

  if (!data) {
    return (
      <div className="text-center py-8">
        <p className="text-gray-500">Failed to load analytics data</p>
        <Button onClick={fetchAnalyticsData} className="mt-2">
          Retry
        </Button>
      </div>
    )
  }

  const getMetricIcon = (metric: string) => {
    switch (metric) {
      case 'bookings': return <Calendar className="h-4 w-4" />
      case 'revenue': return <DollarSign className="h-4 w-4" />
      case 'users': return <Users className="h-4 w-4" />
      case 'rating': return <Star className="h-4 w-4" />
      default: return <Activity className="h-4 w-4" />
    }
  }

  const getTrendIcon = (value: number) => {
    return value >= 0 ? (
      <TrendingUp className="h-4 w-4 text-green-500" />
    ) : (
      <TrendingDown className="h-4 w-4 text-red-500" />
    )
  }

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-LK', {
      style: 'currency',
      currency: 'LKR',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(amount)
  }

  const formatNumber = (num: number) => {
    return new Intl.NumberFormat('en-LK').format(num)
  }

  const formatPercentage = (value: number) => {
    return `${value >= 0 ? '+' : ''}${value.toFixed(1)}%`
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-2xl font-bold tracking-tight">Analytics Dashboard</h1>
          <p className="text-muted-foreground">
            Real-time insights and performance metrics
          </p>
        </div>
        
        <div className="flex items-center gap-2">
          <Select value={selectedTimeRange} onValueChange={(value: string) => setSelectedTimeRange(value as "7d" | "30d" | "90d" | "1y")}>
            <SelectTrigger className="w-32">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="7d">Last 7 days</SelectItem>
              <SelectItem value="30d">Last 30 days</SelectItem>
              <SelectItem value="90d">Last 90 days</SelectItem>
              <SelectItem value="1y">Last year</SelectItem>
            </SelectContent>
          </Select>
          
          <Button onClick={fetchAnalyticsData} variant="outline" size="sm">
            <Activity className="h-4 w-4 mr-2" />
            Refresh
          </Button>
        </div>
      </div>

      {/* Overview Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Bookings</CardTitle>
            <Calendar className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{formatNumber(data.overview.totalBookings)}</div>
            <div className="flex items-center text-xs text-muted-foreground">
              {getTrendIcon(data.overview.growthRate)}
              <span className="ml-1">{formatPercentage(data.overview.growthRate)} from last period</span>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Revenue</CardTitle>
            <DollarSign className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{formatCurrency(data.overview.totalRevenue)}</div>
            <div className="flex items-center text-xs text-muted-foreground">
              {getTrendIcon(data.revenue.growth)}
              <span className="ml-1">{formatPercentage(data.revenue.growth)} from last period</span>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Active Users</CardTitle>
            <Users className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{formatNumber(data.users.active)}</div>
            <div className="flex items-center text-xs text-muted-foreground">
              <span>{formatNumber(data.users.new)} new this period</span>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Average Rating</CardTitle>
            <Star className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{data.overview.averageRating.toFixed(1)}</div>
            <div className="flex items-center text-xs text-muted-foreground">
              <span>Based on {formatNumber(data.engagement.totalReviews)} reviews</span>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Detailed Analytics */}
      <Tabs value={selectedMetric} onValueChange={setSelectedMetric} className="space-y-4">
        <TabsList className="grid w-full grid-cols-6">
          <TabsTrigger value="overview">Overview</TabsTrigger>
          <TabsTrigger value="bookings">Bookings</TabsTrigger>
          <TabsTrigger value="revenue">Revenue</TabsTrigger>
          <TabsTrigger value="users">Users</TabsTrigger>
          <TabsTrigger value="performance">Performance</TabsTrigger>
          <TabsTrigger value="engagement">Engagement</TabsTrigger>
        </TabsList>

        <TabsContent value="overview" className="space-y-4">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
            <Card>
              <CardHeader>
                <CardTitle>Key Metrics</CardTitle>
                <CardDescription>Performance indicators</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex justify-between items-center">
                  <span className="text-sm font-medium">Conversion Rate</span>
                  <Badge variant="secondary">{data.overview.conversionRate.toFixed(1)}%</Badge>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-sm font-medium">Growth Rate</span>
                  <Badge variant={data.overview.growthRate >= 0 ? "default" : "destructive"}>
                    {formatPercentage(data.overview.growthRate)}
                  </Badge>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-sm font-medium">Total Venues</span>
                  <span className="text-sm">{formatNumber(data.overview.totalVenues)}</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-sm font-medium">Total Vendors</span>
                  <span className="text-sm">{formatNumber(data.overview.totalVendors)}</span>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Quick Actions</CardTitle>
                <CardDescription>Common tasks</CardDescription>
              </CardHeader>
              <CardContent className="space-y-2">
                <Button variant="outline" className="w-full justify-start">
                  <BarChart3 className="h-4 w-4 mr-2" />
                  View Detailed Reports
                </Button>
                <Button variant="outline" className="w-full justify-start">
                  <Target className="h-4 w-4 mr-2" />
                  Set Goals
                </Button>
                <Button variant="outline" className="w-full justify-start">
                  <Award className="h-4 w-4 mr-2" />
                  Performance Awards
                </Button>
                <Button variant="outline" className="w-full justify-start">
                  <Clock className="h-4 w-4 mr-2" />
                  Schedule Reports
                </Button>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="bookings" className="space-y-4">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
            <Card>
              <CardHeader>
                <CardTitle>Booking Status</CardTitle>
                <CardDescription>Current booking distribution</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex justify-between items-center">
                  <span className="text-sm">Confirmed</span>
                  <Badge variant="default">{data.bookings.confirmed}</Badge>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-sm">Pending</span>
                  <Badge variant="secondary">{data.bookings.pending}</Badge>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-sm">Completed</span>
                  <Badge variant="outline">{data.bookings.completed}</Badge>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-sm">Cancelled</span>
                  <Badge variant="destructive">{data.bookings.cancelled}</Badge>
                </div>
              </CardContent>
            </Card>

            <Card className="lg:col-span-2">
              <CardHeader>
                <CardTitle>Monthly Bookings</CardTitle>
                <CardDescription>Booking trends over time</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-2">
                  {data.bookings.monthlyData.slice(-6).map((item, index) => (
                    <div key={index} className="flex justify-between items-center">
                      <span className="text-sm">{item.month}</span>
                      <div className="flex items-center gap-4">
                        <span className="text-sm">{item.count} bookings</span>
                        <span className="text-sm font-medium">{formatCurrency(item.revenue)}</span>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="revenue" className="space-y-4">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
            <Card>
              <CardHeader>
                <CardTitle>Revenue Breakdown</CardTitle>
                <CardDescription>Revenue by category</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex justify-between items-center">
                  <span className="text-sm">Venue Bookings</span>
                  <span className="text-sm font-medium">{formatCurrency(data.revenue.breakdown.venueBookings)}</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-sm">Vendor Services</span>
                  <span className="text-sm font-medium">{formatCurrency(data.revenue.breakdown.vendorServices)}</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-sm">Subscriptions</span>
                  <span className="text-sm font-medium">{formatCurrency(data.revenue.breakdown.subscriptions)}</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-sm">Commissions</span>
                  <span className="text-sm font-medium">{formatCurrency(data.revenue.breakdown.commissions)}</span>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Revenue Metrics</CardTitle>
                <CardDescription>Key revenue indicators</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex justify-between items-center">
                  <span className="text-sm">Monthly Revenue</span>
                  <span className="text-sm font-medium">{formatCurrency(data.revenue.monthly)}</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-sm">Average per Booking</span>
                  <span className="text-sm font-medium">{formatCurrency(data.revenue.average)}</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-sm">Growth Rate</span>
                  <Badge variant={data.revenue.growth >= 0 ? "default" : "destructive"}>
                    {formatPercentage(data.revenue.growth)}
                  </Badge>
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="users" className="space-y-4">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
            <Card>
              <CardHeader>
                <CardTitle>User Demographics</CardTitle>
                <CardDescription>Age group distribution</CardDescription>
              </CardHeader>
              <CardContent className="space-y-2">
                {data.users.demographics.ageGroups.map((group, index) => (
                  <div key={index} className="flex justify-between items-center">
                    <span className="text-sm">{group.group}</span>
                    <span className="text-sm font-medium">{group.count}</span>
                  </div>
                ))}
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Top Locations</CardTitle>
                <CardDescription>User distribution by location</CardDescription>
              </CardHeader>
              <CardContent className="space-y-2">
                {data.users.demographics.locations.slice(0, 5).map((location, index) => (
                  <div key={index} className="flex justify-between items-center">
                    <span className="text-sm">{location.location}</span>
                    <span className="text-sm font-medium">{location.count}</span>
                  </div>
                ))}
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="performance" className="space-y-4">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
            <Card>
              <CardHeader>
                <CardTitle>Website Performance</CardTitle>
                <CardDescription>Key performance metrics</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex justify-between items-center">
                  <span className="text-sm">Page Views</span>
                  <span className="text-sm font-medium">{formatNumber(data.performance.pageViews)}</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-sm">Unique Visitors</span>
                  <span className="text-sm font-medium">{formatNumber(data.performance.uniqueVisitors)}</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-sm">Bounce Rate</span>
                  <span className="text-sm font-medium">{data.performance.bounceRate.toFixed(1)}%</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-sm">Avg Session Duration</span>
                  <span className="text-sm font-medium">{Math.round(data.performance.averageSessionDuration / 60)}m</span>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Top Pages</CardTitle>
                <CardDescription>Most visited pages</CardDescription>
              </CardHeader>
              <CardContent className="space-y-2">
                {data.performance.topPages.slice(0, 5).map((page, index) => (
                  <div key={index} className="flex justify-between items-center">
                    <span className="text-sm truncate">{page.page}</span>
                    <span className="text-sm font-medium">{formatNumber(page.views)}</span>
                  </div>
                ))}
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="engagement" className="space-y-4">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
            <Card>
              <CardHeader>
                <CardTitle>Engagement Metrics</CardTitle>
                <CardDescription>User engagement indicators</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex justify-between items-center">
                  <span className="text-sm">Total Reviews</span>
                  <span className="text-sm font-medium">{formatNumber(data.engagement.totalReviews)}</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-sm">Average Rating</span>
                  <span className="text-sm font-medium">{data.engagement.averageRating.toFixed(1)}</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-sm">Response Rate</span>
                  <span className="text-sm font-medium">{data.engagement.responseRate.toFixed(1)}%</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-sm">Social Shares</span>
                  <span className="text-sm font-medium">{formatNumber(data.engagement.socialShares)}</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-sm">Favorites</span>
                  <span className="text-sm font-medium">{formatNumber(data.engagement.favorites)}</span>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Engagement Actions</CardTitle>
                <CardDescription>Quick engagement tools</CardDescription>
              </CardHeader>
              <CardContent className="space-y-2">
                <Button variant="outline" className="w-full justify-start">
                  <MessageSquare className="h-4 w-4 mr-2" />
                  Respond to Reviews
                </Button>
                <Button variant="outline" className="w-full justify-start">
                  <Heart className="h-4 w-4 mr-2" />
                  Manage Favorites
                </Button>
                <Button variant="outline" className="w-full justify-start">
                  <Eye className="h-4 w-4 mr-2" />
                  View Analytics
                </Button>
                <Button variant="outline" className="w-full justify-start">
                  <ShoppingCart className="h-4 w-4 mr-2" />
                  Track Conversions
                </Button>
              </CardContent>
            </Card>
          </div>
        </TabsContent>
      </Tabs>
    </div>
  )
} 