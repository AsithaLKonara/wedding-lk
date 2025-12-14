"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { 
  TrendingUp, 
  TrendingDown, 
  Users, 
  Calendar, 
  DollarSign, 
  Star,
  Activity,
  Zap,
  Clock,
  Target,
  BarChart3,
  PieChart,
  LineChart,
  Smartphone,
  Globe,
  Database
} from "lucide-react"
import { PerformanceMonitor, getMemoryUsage, measureNetworkPerformance } from "@/lib/performance"
import { cacheManager } from "@/lib/cache-manager"

interface AnalyticsData {
  users: {
    total: number
    active: number
    new: number
    growth: number
  }
  bookings: {
    total: number
    pending: number
    completed: number
    revenue: number
    growth: number
  }
  performance: {
    pageLoadTime: number
    apiResponseTime: number
    cacheHitRate: number
    memoryUsage: number
  }
  engagement: {
    pageViews: number
    sessions: number
    bounceRate: number
    avgSessionTime: number
  }
}

export function AdvancedAnalyticsDashboard() {
  const [analytics, setAnalytics] = useState<AnalyticsData>({
    users: { total: 0, active: 0, new: 0, growth: 0 },
    bookings: { total: 0, pending: 0, completed: 0, revenue: 0, growth: 0 },
    performance: { pageLoadTime: 0, apiResponseTime: 0, cacheHitRate: 0, memoryUsage: 0 },
    engagement: { pageViews: 0, sessions: 0, bounceRate: 0, avgSessionTime: 0 }
  })
  const [isLoading, setIsLoading] = useState(true)
  const [timeRange, setTimeRange] = useState("7d")

  useEffect(() => {
    loadAnalytics()
    const interval = setInterval(loadAnalytics, 30000) // Update every 30 seconds
    return () => clearInterval(interval)
  }, [timeRange])

  const loadAnalytics = async () => {
    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1000))
      
      // Get performance metrics
      const performanceMonitor = PerformanceMonitor.getInstance()
      const memoryUsage = getMemoryUsage()
      const cacheStats = { hits: 0, misses: 0, size: 0, hitRate: 0 }; // Mock cache stats
      
      setAnalytics({
        users: {
          total: 15420,
          active: 8920,
          new: 234,
          growth: 12.5
        },
        bookings: {
          total: 892,
          pending: 156,
          completed: 736,
          revenue: 45600000,
          growth: 8.3
        },
        performance: {
          pageLoadTime: performanceMonitor.getAverageMetric('pageLoad') || 1.2,
          apiResponseTime: performanceMonitor.getAverageMetric('apiResponse') || 0.8,
          cacheHitRate: cacheStats.hitRate * 100,
          memoryUsage: memoryUsage.usedJSHeapSize / 1024 / 1024 // Convert to MB
        },
        engagement: {
          pageViews: 45600,
          sessions: 12340,
          bounceRate: 32.5,
          avgSessionTime: 4.2
        }
      })
    } catch (error) {
      console.error('Failed to load analytics:', error)
    } finally {
      setIsLoading(false)
    }
  }

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('si-LK', {
      style: 'currency',
      currency: 'LKR',
      minimumFractionDigits: 0
    }).format(amount)
  }

  const formatNumber = (num: number) => {
    return new Intl.NumberFormat('en-US').format(num)
  }

  const getGrowthColor = (growth: number) => {
    return growth >= 0 ? "text-green-600" : "text-red-600"
  }

  const getGrowthIcon = (growth: number) => {
    return growth >= 0 ? <TrendingUp className="h-4 w-4" /> : <TrendingDown className="h-4 w-4" />
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold">Advanced Analytics Dashboard</h1>
          <p className="text-gray-600 dark:text-gray-400">
            Real-time insights and performance metrics
          </p>
        </div>
        <div className="flex items-center space-x-2">
          <Button
            variant="outline"
            size="sm"
            onClick={loadAnalytics}
            disabled={isLoading}
          >
            <Activity className="h-4 w-4 mr-2" />
            Refresh
          </Button>
          <select
            value={timeRange}
            onChange={(e) => setTimeRange(e.target.value)}
            className="border rounded-md px-3 py-2"
          >
            <option value="1d">Last 24 hours</option>
            <option value="7d">Last 7 days</option>
            <option value="30d">Last 30 days</option>
            <option value="90d">Last 90 days</option>
          </select>
        </div>
      </div>

      <Tabs defaultValue="overview" className="space-y-6">
        <TabsList>
          <TabsTrigger value="overview">Overview</TabsTrigger>
          <TabsTrigger value="performance">Performance</TabsTrigger>
          <TabsTrigger value="users">Users</TabsTrigger>
          <TabsTrigger value="revenue">Revenue</TabsTrigger>
        </TabsList>

        <TabsContent value="overview" className="space-y-6">
          {/* Key Metrics */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Total Users</CardTitle>
                <Users className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{formatNumber(analytics.users.total)}</div>
                <div className={`flex items-center text-xs ${getGrowthColor(analytics.users.growth)}`}>
                  {getGrowthIcon(analytics.users.growth)}
                  <span className="ml-1">{analytics.users.growth}% from last month</span>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Total Revenue</CardTitle>
                <DollarSign className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{formatCurrency(analytics.bookings.revenue)}</div>
                <div className={`flex items-center text-xs ${getGrowthColor(analytics.bookings.growth)}`}>
                  {getGrowthIcon(analytics.bookings.growth)}
                  <span className="ml-1">{analytics.bookings.growth}% from last month</span>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Active Sessions</CardTitle>
                <Activity className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{formatNumber(analytics.engagement.sessions)}</div>
                <p className="text-xs text-muted-foreground">
                  {formatNumber(analytics.engagement.pageViews)} page views
                </p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Performance Score</CardTitle>
                <Zap className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">
                  {Math.round(analytics.performance.cacheHitRate)}%
                </div>
                <p className="text-xs text-muted-foreground">
                  Cache hit rate
                </p>
              </CardContent>
            </Card>
          </div>

          {/* Performance Metrics */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center">
                  <BarChart3 className="h-5 w-5 mr-2" />
                  Performance Metrics
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex items-center justify-between">
                  <span className="text-sm">Page Load Time</span>
                  <Badge variant={analytics.performance.pageLoadTime < 2 ? "default" : "destructive"}>
                    {analytics.performance.pageLoadTime.toFixed(2)}s
                  </Badge>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-sm">API Response Time</span>
                  <Badge variant={analytics.performance.apiResponseTime < 1 ? "default" : "destructive"}>
                    {analytics.performance.apiResponseTime.toFixed(2)}s
                  </Badge>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-sm">Memory Usage</span>
                  <Badge variant={analytics.performance.memoryUsage < 100 ? "default" : "destructive"}>
                    {analytics.performance.memoryUsage.toFixed(1)} MB
                  </Badge>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-sm">Cache Hit Rate</span>
                  <Badge variant={analytics.performance.cacheHitRate > 80 ? "default" : "destructive"}>
                    {analytics.performance.cacheHitRate.toFixed(1)}%
                  </Badge>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="flex items-center">
                  <PieChart className="h-5 w-5 mr-2" />
                  User Engagement
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex items-center justify-between">
                  <span className="text-sm">Bounce Rate</span>
                  <Badge variant={analytics.engagement.bounceRate < 40 ? "default" : "destructive"}>
                    {analytics.engagement.bounceRate.toFixed(1)}%
                  </Badge>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-sm">Avg Session Time</span>
                  <Badge variant={analytics.engagement.avgSessionTime > 3 ? "default" : "destructive"}>
                    {analytics.engagement.avgSessionTime.toFixed(1)}m
                  </Badge>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-sm">Active Users</span>
                  <Badge variant="default">
                    {formatNumber(analytics.users.active)}
                  </Badge>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-sm">New Users</span>
                  <Badge variant="default">
                    {formatNumber(analytics.users.new)}
                  </Badge>
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="performance" className="space-y-6">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center">
                  <Clock className="h-5 w-5 mr-2" />
                  Response Times
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div>
                    <div className="flex justify-between text-sm mb-1">
                      <span>Page Load</span>
                      <span>{analytics.performance.pageLoadTime.toFixed(2)}s</span>
                    </div>
                    <div className="w-full bg-gray-200 rounded-full h-2">
                      <div 
                        className="bg-blue-600 h-2 rounded-full" 
                        style={{ width: `${Math.min(analytics.performance.pageLoadTime * 20, 100)}%` }}
                      />
                    </div>
                  </div>
                  <div>
                    <div className="flex justify-between text-sm mb-1">
                      <span>API Response</span>
                      <span>{analytics.performance.apiResponseTime.toFixed(2)}s</span>
                    </div>
                    <div className="w-full bg-gray-200 rounded-full h-2">
                      <div 
                        className="bg-green-600 h-2 rounded-full" 
                        style={{ width: `${Math.min(analytics.performance.apiResponseTime * 50, 100)}%` }}
                      />
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="flex items-center">
                  <Database className="h-5 w-5 mr-2" />
                  System Resources
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div>
                    <div className="flex justify-between text-sm mb-1">
                      <span>Memory Usage</span>
                      <span>{analytics.performance.memoryUsage.toFixed(1)} MB</span>
                    </div>
                    <div className="w-full bg-gray-200 rounded-full h-2">
                      <div 
                        className="bg-purple-600 h-2 rounded-full" 
                        style={{ width: `${Math.min(analytics.performance.memoryUsage / 2, 100)}%` }}
                      />
                    </div>
                  </div>
                  <div>
                    <div className="flex justify-between text-sm mb-1">
                      <span>Cache Hit Rate</span>
                      <span>{analytics.performance.cacheHitRate.toFixed(1)}%</span>
                    </div>
                    <div className="w-full bg-gray-200 rounded-full h-2">
                      <div 
                        className="bg-orange-600 h-2 rounded-full" 
                        style={{ width: `${analytics.performance.cacheHitRate}%` }}
                      />
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="users" className="space-y-6">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center">
                  <Users className="h-5 w-5 mr-2" />
                  User Growth
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-3xl font-bold">{formatNumber(analytics.users.total)}</div>
                <p className="text-sm text-muted-foreground">Total registered users</p>
                <div className={`flex items-center mt-2 ${getGrowthColor(analytics.users.growth)}`}>
                  {getGrowthIcon(analytics.users.growth)}
                  <span className="ml-1 text-sm">{analytics.users.growth}% growth</span>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="flex items-center">
                  <Activity className="h-5 w-5 mr-2" />
                  Active Users
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-3xl font-bold">{formatNumber(analytics.users.active)}</div>
                <p className="text-sm text-muted-foreground">Currently active</p>
                <div className="mt-2">
                  <div className="text-sm text-muted-foreground">
                    {((analytics.users.active / analytics.users.total) * 100).toFixed(1)}% of total users
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="flex items-center">
                  <Target className="h-5 w-5 mr-2" />
                  New Users
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-3xl font-bold">{formatNumber(analytics.users.new)}</div>
                <p className="text-sm text-muted-foreground">This period</p>
                <div className="mt-2">
                  <div className="text-sm text-green-600">
                    +{analytics.users.new} new registrations
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="revenue" className="space-y-6">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center">
                  <DollarSign className="h-5 w-5 mr-2" />
                  Revenue Overview
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-3xl font-bold">{formatCurrency(analytics.bookings.revenue)}</div>
                <p className="text-sm text-muted-foreground">Total revenue</p>
                <div className={`flex items-center mt-2 ${getGrowthColor(analytics.bookings.growth)}`}>
                  {getGrowthIcon(analytics.bookings.growth)}
                  <span className="ml-1 text-sm">{analytics.bookings.growth}% growth</span>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="flex items-center">
                  <Calendar className="h-5 w-5 mr-2" />
                  Booking Status
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="flex justify-between">
                    <span className="text-sm">Completed</span>
                    <Badge variant="default">{analytics.bookings.completed}</Badge>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-sm">Pending</span>
                    <Badge variant="secondary">{analytics.bookings.pending}</Badge>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-sm">Total</span>
                    <Badge variant="outline">{analytics.bookings.total}</Badge>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>
      </Tabs>
    </div>
  )
}

export default AdvancedAnalyticsDashboard 