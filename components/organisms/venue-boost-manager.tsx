"use client"

import { useState, useEffect } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { Badge } from '@/components/ui/badge'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Textarea } from '@/components/ui/textarea'
import { 
  TrendingUp, 
  Target, 
  Calendar, 
  DollarSign, 
  BarChart3, 
  Play, 
  Pause, 
  Square, 
  Plus,
  Eye,
  MousePointer,
  Users,
  MapPin,
  Clock,
  Zap
} from 'lucide-react'

interface VenueBoost {
  _id: string
  venue: {
    _id: string
    name: string
    location: {
      city: string
      province: string
    }
    images: string[]
  }
  boostType: 'basic' | 'premium' | 'featured' | 'trending'
  status: 'pending' | 'active' | 'paused' | 'completed' | 'cancelled'
  budget: {
    amount: number
    spent: number
    remaining: number
    currency: string
  }
  targeting: {
    locations: string[]
    guestCount: {
      min: number
      max: number
    }
    eventTypes: string[]
    priceRange: {
      min: number
      max: number
    }
  }
  schedule: {
    startDate: string
    endDate: string
    duration: number
  }
  performance: {
    impressions: number
    clicks: number
    views: number
    inquiries: number
    bookings: number
    ctr: number
    cpc: number
    cpm: number
    roi: number
  }
  settings: {
    autoRenew: boolean
    maxDailyBudget: number
    bidAmount: number
    priority: 'low' | 'medium' | 'high'
  }
}

interface BoostAnalytics {
  overview: {
    totalBoosts: number
    activeBoosts: number
    totalBudget: number
    totalSpent: number
    totalImpressions: number
    totalClicks: number
    totalViews: number
    totalInquiries: number
    totalBookings: number
  }
  performance: {
    ctr: number
    cpc: number
    cpm: number
    roi: number
  }
  trends: Array<{
    date: string
    impressions: number
    clicks: number
    views: number
    spent: number
  }>
  topPerforming: Array<{
    id: string
    venueName: string
    boostType: string
    status: string
    budget: number
    spent: number
    impressions: number
    clicks: number
    ctr: number
    cpc: number
  }>
}

export default function VenueBoostManager() {
  const [activeTab, setActiveTab] = useState('overview')
  const [boosts, setBoosts] = useState<VenueBoost[]>([])
  const [analytics, setAnalytics] = useState<BoostAnalytics | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const [showCreateForm, setShowCreateForm] = useState(false)
  const [selectedVenue, setSelectedVenue] = useState('')
  const [venues, setVenues] = useState([])

  useEffect(() => {
    fetchBoosts()
    fetchAnalytics()
    fetchVenues()
  }, [])

  const fetchBoosts = async () => {
    try {
      const response = await fetch('/api/venue-boosts')
      if (response.ok) {
        const data = await response.json()
        setBoosts(data.data)
      }
    } catch (error) {
      console.error('Error fetching boosts:', error)
    } finally {
      setIsLoading(false)
    }
  }

  const fetchAnalytics = async () => {
    try {
      const response = await fetch('/api/venue-boosts/analytics')
      if (response.ok) {
        const data = await response.json()
        setAnalytics(data.data)
      }
    } catch (error) {
      console.error('Error fetching analytics:', error)
    }
  }

  const fetchVenues = async () => {
    try {
      const response = await fetch('/api/dashboard/vendor/services')
      if (response.ok) {
        const data = await response.json()
        setVenues(data.services || [])
      }
    } catch (error) {
      console.error('Error fetching venues:', error)
    }
  }

  const handleBoostAction = async (boostId: string, action: string) => {
    try {
      const response = await fetch('/api/venue-boosts', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ boostId, status: action })
      })

      if (response.ok) {
        fetchBoosts()
        fetchAnalytics()
      }
    } catch (error) {
      console.error('Error updating boost:', error)
    }
  }

  const getBoostTypeInfo = (type: string) => {
    const types = {
      basic: { name: 'Basic Boost', color: 'bg-blue-100 text-blue-800', price: '1000 LKR' },
      premium: { name: 'Premium Boost', color: 'bg-purple-100 text-purple-800', price: '2500 LKR' },
      featured: { name: 'Featured Boost', color: 'bg-green-100 text-green-800', price: '5000 LKR' },
      trending: { name: 'Trending Boost', color: 'bg-orange-100 text-orange-800', price: '10000 LKR' }
    }
    return types[type as keyof typeof types] || types.basic
  }

  const getStatusColor = (status: string) => {
    const colors = {
      pending: 'bg-yellow-100 text-yellow-800',
      active: 'bg-green-100 text-green-800',
      paused: 'bg-blue-100 text-blue-800',
      completed: 'bg-gray-100 text-gray-800',
      cancelled: 'bg-red-100 text-red-800'
    }
    return colors[status as keyof typeof colors] || colors.pending
  }

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <div className="text-center">
          <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-blue-600 mx-auto"></div>
          <p className="mt-4 text-gray-600">Loading boost manager...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-4">
          <div className="p-3 bg-gradient-to-r from-blue-500 to-purple-600 rounded-full">
            <TrendingUp className="h-8 w-8 text-white" />
          </div>
          <div>
            <h1 className="text-3xl font-bold">Venue Boost Manager</h1>
            <p className="text-gray-600">Boost your venue visibility and reach more couples</p>
          </div>
        </div>
        <Button 
          onClick={() => setShowCreateForm(true)}
          className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700"
        >
          <Plus className="h-4 w-4 mr-2" />
          Create Boost
        </Button>
      </div>

      {/* Quick Stats */}
      {analytics && (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Active Boosts</CardTitle>
              <TrendingUp className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{analytics.overview.activeBoosts}</div>
              <p className="text-xs text-muted-foreground">Currently running</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Total Impressions</CardTitle>
              <Eye className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{analytics.overview.totalImpressions.toLocaleString()}</div>
              <p className="text-xs text-muted-foreground">Venue views</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Click Rate</CardTitle>
              <MousePointer className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{analytics.performance.ctr.toFixed(2)}%</div>
              <p className="text-xs text-muted-foreground">Engagement rate</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Total Spent</CardTitle>
              <DollarSign className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">LKR {analytics.overview.totalSpent.toLocaleString()}</div>
              <p className="text-xs text-muted-foreground">Budget used</p>
            </CardContent>
          </Card>
        </div>
      )}

      {/* Main Content */}
      <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-6">
        <TabsList className="grid w-full grid-cols-4">
          <TabsTrigger value="overview">Overview</TabsTrigger>
          <TabsTrigger value="campaigns">Campaigns</TabsTrigger>
          <TabsTrigger value="analytics">Analytics</TabsTrigger>
          <TabsTrigger value="create">Create</TabsTrigger>
        </TabsList>

        {/* Overview Tab */}
        <TabsContent value="overview" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center">
                <BarChart3 className="h-5 w-5 mr-2" />
                Performance Overview
              </CardTitle>
            </CardHeader>
            <CardContent>
              {analytics ? (
                <div className="space-y-6">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                      <h3 className="font-semibold mb-3">Campaign Summary</h3>
                      <div className="space-y-2">
                        <div className="flex justify-between">
                          <span>Total Campaigns:</span>
                          <span className="font-medium">{analytics.overview.totalBoosts}</span>
                        </div>
                        <div className="flex justify-between">
                          <span>Active Campaigns:</span>
                          <span className="font-medium text-green-600">{analytics.overview.activeBoosts}</span>
                        </div>
                        <div className="flex justify-between">
                          <span>Total Budget:</span>
                          <span className="font-medium">LKR {analytics.overview.totalBudget.toLocaleString()}</span>
                        </div>
                        <div className="flex justify-between">
                          <span>Budget Used:</span>
                          <span className="font-medium">LKR {analytics.overview.totalSpent.toLocaleString()}</span>
                        </div>
                      </div>
                    </div>
                    <div>
                      <h3 className="font-semibold mb-3">Performance Metrics</h3>
                      <div className="space-y-2">
                        <div className="flex justify-between">
                          <span>CTR:</span>
                          <span className="font-medium">{analytics.performance.ctr.toFixed(2)}%</span>
                        </div>
                        <div className="flex justify-between">
                          <span>CPC:</span>
                          <span className="font-medium">LKR {analytics.performance.cpc.toFixed(2)}</span>
                        </div>
                        <div className="flex justify-between">
                          <span>CPM:</span>
                          <span className="font-medium">LKR {analytics.performance.cpm.toFixed(2)}</span>
                        </div>
                        <div className="flex justify-between">
                          <span>ROI:</span>
                          <span className="font-medium">{analytics.performance.roi.toFixed(2)}%</span>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              ) : (
                <div className="text-center py-8 text-gray-500">
                  <BarChart3 className="h-12 w-12 mx-auto mb-4 text-gray-300" />
                  <p>No analytics data available</p>
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>

        {/* Campaigns Tab */}
        <TabsContent value="campaigns" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center">
                <Target className="h-5 w-5 mr-2" />
                Active Campaigns
              </CardTitle>
            </CardHeader>
            <CardContent>
              {boosts.length > 0 ? (
                <div className="space-y-4">
                  {boosts.map((boost) => (
                    <div key={boost._id} className="border rounded-lg p-4">
                      <div className="flex items-center justify-between mb-4">
                        <div className="flex items-center space-x-3">
                          <div className="w-12 h-12 bg-gray-200 rounded-lg flex items-center justify-center">
                            <img 
                              src={boost.venue.images[0] || '/placeholder.jpg'} 
                              alt={boost.venue.name}
                              className="w-full h-full object-cover rounded-lg"
                            />
                          </div>
                          <div>
                            <h3 className="font-semibold">{boost.venue.name}</h3>
                            <p className="text-sm text-gray-500">{boost.venue.location.city}, {boost.venue.location.province}</p>
                          </div>
                        </div>
                        <div className="flex items-center space-x-2">
                          <Badge className={getBoostTypeInfo(boost.boostType).color}>
                            {getBoostTypeInfo(boost.boostType).name}
                          </Badge>
                          <Badge className={getStatusColor(boost.status)}>
                            {boost.status}
                          </Badge>
                        </div>
                      </div>

                      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
                        <div className="text-center">
                          <p className="text-sm text-gray-500">Budget</p>
                          <p className="font-semibold">LKR {boost.budget.amount.toLocaleString()}</p>
                          <p className="text-xs text-gray-400">Spent: LKR {boost.budget.spent.toLocaleString()}</p>
                        </div>
                        <div className="text-center">
                          <p className="text-sm text-gray-500">Impressions</p>
                          <p className="font-semibold">{boost.performance.impressions.toLocaleString()}</p>
                          <p className="text-xs text-gray-400">CTR: {boost.performance.ctr.toFixed(2)}%</p>
                        </div>
                        <div className="text-center">
                          <p className="text-sm text-gray-500">Clicks</p>
                          <p className="font-semibold">{boost.performance.clicks.toLocaleString()}</p>
                          <p className="text-xs text-gray-400">CPC: LKR {boost.performance.cpc.toFixed(2)}</p>
                        </div>
                      </div>

                      <div className="flex items-center justify-between">
                        <div className="text-sm text-gray-500">
                          <Calendar className="h-4 w-4 inline mr-1" />
                          {new Date(boost.schedule.startDate).toLocaleDateString()} - {new Date(boost.schedule.endDate).toLocaleDateString()}
                        </div>
                        <div className="flex items-center space-x-2">
                          {boost.status === 'active' && (
                            <Button
                              variant="outline"
                              size="sm"
                              onClick={() => handleBoostAction(boost._id, 'paused')}
                            >
                              <Pause className="h-4 w-4 mr-1" />
                              Pause
                            </Button>
                          )}
                          {boost.status === 'paused' && (
                            <Button
                              variant="outline"
                              size="sm"
                              onClick={() => handleBoostAction(boost._id, 'active')}
                            >
                              <Play className="h-4 w-4 mr-1" />
                              Resume
                            </Button>
                          )}
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => handleBoostAction(boost._id, 'cancelled')}
                            className="text-red-600 hover:text-red-700"
                          >
                            <Square className="h-4 w-4 mr-1" />
                            Stop
                          </Button>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="text-center py-8 text-gray-500">
                  <Target className="h-12 w-12 mx-auto mb-4 text-gray-300" />
                  <p>No boost campaigns yet</p>
                  <p className="text-sm">Create your first campaign to get started</p>
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>

        {/* Analytics Tab */}
        <TabsContent value="analytics" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center">
                <BarChart3 className="h-5 w-5 mr-2" />
                Detailed Analytics
              </CardTitle>
            </CardHeader>
            <CardContent>
              {analytics ? (
                <div className="space-y-6">
                  <div>
                    <h3 className="font-semibold mb-3">Top Performing Campaigns</h3>
                    <div className="space-y-3">
                      {analytics.topPerforming.map((campaign) => (
                        <div key={campaign.id} className="flex items-center justify-between p-3 border rounded-lg">
                          <div>
                            <p className="font-medium">{campaign.venueName}</p>
                            <p className="text-sm text-gray-500">{campaign.boostType}</p>
                          </div>
                          <div className="text-right">
                            <p className="font-semibold">{campaign.ctr.toFixed(2)}% CTR</p>
                            <p className="text-sm text-gray-500">LKR {campaign.cpc.toFixed(2)} CPC</p>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              ) : (
                <div className="text-center py-8 text-gray-500">
                  <BarChart3 className="h-12 w-12 mx-auto mb-4 text-gray-300" />
                  <p>No analytics data available</p>
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>

        {/* Create Tab */}
        <TabsContent value="create" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center">
                <Plus className="h-5 w-5 mr-2" />
                Create New Boost Campaign
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-6">
                <div>
                  <Label htmlFor="venue">Select Venue</Label>
                  <Select value={selectedVenue} onValueChange={setSelectedVenue}>
                    <SelectTrigger>
                      <SelectValue placeholder="Choose a venue to boost" />
                    </SelectTrigger>
                    <SelectContent>
                      {venues.map((venue: any) => (
                        <SelectItem key={venue._id} value={venue._id}>
                          {venue.name} - {venue.location?.city}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="boostType">Boost Type</Label>
                    <Select>
                      <SelectTrigger>
                        <SelectValue placeholder="Select boost type" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="basic">
                          <div className="flex items-center space-x-2">
                            <Zap className="h-4 w-4" />
                            <span>Basic Boost - 1000 LKR</span>
                          </div>
                        </SelectItem>
                        <SelectItem value="premium">
                          <div className="flex items-center space-x-2">
                            <Zap className="h-4 w-4" />
                            <span>Premium Boost - 2500 LKR</span>
                          </div>
                        </SelectItem>
                        <SelectItem value="featured">
                          <div className="flex items-center space-x-2">
                            <Zap className="h-4 w-4" />
                            <span>Featured Boost - 5000 LKR</span>
                          </div>
                        </SelectItem>
                        <SelectItem value="trending">
                          <div className="flex items-center space-x-2">
                            <Zap className="h-4 w-4" />
                            <span>Trending Boost - 10000 LKR</span>
                          </div>
                        </SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  <div>
                    <Label htmlFor="budget">Budget (LKR)</Label>
                    <Input type="number" placeholder="1000" min="1000" />
                  </div>
                </div>

                <div>
                  <Label htmlFor="startDate">Campaign Duration</Label>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <Label htmlFor="startDate">Start Date</Label>
                      <Input type="date" />
                    </div>
                    <div>
                      <Label htmlFor="endDate">End Date</Label>
                      <Input type="date" />
                    </div>
                  </div>
                </div>

                <div>
                  <Label htmlFor="targeting">Targeting Options</Label>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <Label htmlFor="locations">Target Locations</Label>
                      <Input placeholder="Colombo, Gampaha, Kalutara" />
                    </div>
                    <div>
                      <Label htmlFor="guestCount">Guest Count Range</Label>
                      <div className="flex space-x-2">
                        <Input placeholder="Min" type="number" />
                        <Input placeholder="Max" type="number" />
                      </div>
                    </div>
                  </div>
                </div>

                <div className="flex justify-end space-x-2">
                  <Button variant="outline" onClick={() => setShowCreateForm(false)}>
                    Cancel
                  </Button>
                  <Button className="bg-gradient-to-r from-blue-600 to-purple-600">
                    Create Campaign
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  )
} 