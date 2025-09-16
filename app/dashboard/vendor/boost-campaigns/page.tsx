"use client"

import { useState, useEffect } from 'react'
import { useSession } from 'next-auth/react'
import { useRouter } from 'next/navigation'
import { Plus, TrendingUp, Eye, Edit, Trash2, Play, Pause, DollarSign, Users, Calendar } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'

interface BoostCampaign {
  id: string
  name: string
  type: 'venue' | 'service' | 'package'
  status: 'active' | 'paused' | 'completed' | 'draft'
  budget: number
  spent: number
  impressions: number
  clicks: number
  conversions: number
  startDate: string
  endDate: string
  targetAudience: string
  createdAt: string
}

export default function BoostCampaignsPage() {
  const { data: session, status } = useSession()
  const router = useRouter()
  const [campaigns, setCampaigns] = useState<BoostCampaign[]>([])
  const [loading, setLoading] = useState(true)
  const [filter, setFilter] = useState<'all' | 'active' | 'paused' | 'completed' | 'draft'>('all')

  useEffect(() => {
    if (status === 'loading') return

    if (!session?.user) {
      router.push('/auth/signin')
      return
    }

    if (session.user.role !== 'vendor') {
      router.push('/unauthorized')
      return
    }

    // Mock data - replace with actual API call
    setCampaigns([
      {
        id: '1',
        name: 'Wedding Photography Promotion',
        type: 'service',
        status: 'active',
        budget: 50000,
        spent: 12500,
        impressions: 15420,
        clicks: 342,
        conversions: 8,
        startDate: '2024-01-15',
        endDate: '2024-02-15',
        targetAudience: 'Couples planning weddings',
        createdAt: '2024-01-10'
      },
      {
        id: '2',
        name: 'Venue Showcase Campaign',
        type: 'venue',
        status: 'paused',
        budget: 75000,
        spent: 25000,
        impressions: 22300,
        clicks: 567,
        conversions: 12,
        startDate: '2024-01-01',
        endDate: '2024-03-01',
        targetAudience: 'Wedding planners and couples',
        createdAt: '2023-12-20'
      },
      {
        id: '3',
        name: 'Bridal Package Special',
        type: 'package',
        status: 'completed',
        budget: 30000,
        spent: 30000,
        impressions: 18900,
        clicks: 234,
        conversions: 15,
        startDate: '2023-12-01',
        endDate: '2023-12-31',
        targetAudience: 'Brides-to-be',
        createdAt: '2023-11-25'
      }
    ])
    setLoading(false)
  }, [session, status, router])

  const filteredCampaigns = campaigns.filter(campaign => {
    if (filter === 'all') return true
    return campaign.status === filter
  })

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'active': return 'bg-green-100 text-green-800'
      case 'paused': return 'bg-yellow-100 text-yellow-800'
      case 'completed': return 'bg-blue-100 text-blue-800'
      case 'draft': return 'bg-gray-100 text-gray-800'
      default: return 'bg-gray-100 text-gray-800'
    }
  }

  const getTypeColor = (type: string) => {
    switch (type) {
      case 'venue': return 'bg-purple-100 text-purple-800'
      case 'service': return 'bg-blue-100 text-blue-800'
      case 'package': return 'bg-green-100 text-green-800'
      default: return 'bg-gray-100 text-gray-800'
    }
  }

  const formatPrice = (price: number) => {
    return new Intl.NumberFormat('en-LK', {
      style: 'currency',
      currency: 'LKR',
      minimumFractionDigits: 0
    }).format(price)
  }

  const calculateROI = (spent: number, conversions: number, avgBookingValue: number = 100000) => {
    if (spent === 0) return 0
    const revenue = conversions * avgBookingValue
    return ((revenue - spent) / spent) * 100
  }

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-purple-600"></div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold text-gray-900 mb-2">Boost Campaigns</h1>
              <p className="text-gray-600">Manage your venue and service promotion campaigns</p>
            </div>
            <Button 
              onClick={() => router.push('/dashboard/vendor/boost-campaigns/create')}
              className="bg-gradient-to-r from-purple-500 to-blue-500 hover:from-purple-600 hover:to-blue-600"
            >
              <Plus className="w-4 h-4 mr-2" />
              Create Campaign
            </Button>
          </div>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
          <Card>
            <CardContent className="p-6">
              <div className="flex items-center">
                <TrendingUp className="w-8 h-8 text-purple-600" />
                <div className="ml-4">
                  <p className="text-sm font-medium text-gray-600">Total Campaigns</p>
                  <p className="text-2xl font-bold text-gray-900">{campaigns.length}</p>
                </div>
              </div>
            </CardContent>
          </Card>
          
          <Card>
            <CardContent className="p-6">
              <div className="flex items-center">
                <DollarSign className="w-8 h-8 text-green-600" />
                <div className="ml-4">
                  <p className="text-sm font-medium text-gray-600">Total Spent</p>
                  <p className="text-2xl font-bold text-gray-900">
                    {formatPrice(campaigns.reduce((sum, campaign) => sum + campaign.spent, 0))}
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>
          
          <Card>
            <CardContent className="p-6">
              <div className="flex items-center">
                <Users className="w-8 h-8 text-blue-600" />
                <div className="ml-4">
                  <p className="text-sm font-medium text-gray-600">Total Conversions</p>
                  <p className="text-2xl font-bold text-gray-900">
                    {campaigns.reduce((sum, campaign) => sum + campaign.conversions, 0)}
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>
          
          <Card>
            <CardContent className="p-6">
              <div className="flex items-center">
                <Eye className="w-8 h-8 text-yellow-600" />
                <div className="ml-4">
                  <p className="text-sm font-medium text-gray-600">Total Impressions</p>
                  <p className="text-2xl font-bold text-gray-900">
                    {campaigns.reduce((sum, campaign) => sum + campaign.impressions, 0).toLocaleString()}
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Filters */}
        <div className="mb-6">
          <div className="flex space-x-2">
            {['all', 'active', 'paused', 'completed', 'draft'].map((filterType) => (
              <Button
                key={filterType}
                variant={filter === filterType ? 'default' : 'outline'}
                onClick={() => setFilter(filterType as any)}
                className="capitalize"
              >
                {filterType}
              </Button>
            ))}
          </div>
        </div>

        {/* Campaigns Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredCampaigns.map((campaign) => (
            <Card key={campaign.id} className="hover:shadow-lg transition-shadow">
              <CardHeader>
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <CardTitle className="text-lg mb-2">{campaign.name}</CardTitle>
                    <div className="flex space-x-2 mb-2">
                      <Badge className={getTypeColor(campaign.type)}>
                        {campaign.type}
                      </Badge>
                      <Badge className={getStatusColor(campaign.status)}>
                        {campaign.status}
                      </Badge>
                    </div>
                  </div>
                  <div className="flex space-x-2">
                    <Button variant="ghost" size="sm">
                      <Eye className="w-4 h-4" />
                    </Button>
                    <Button variant="ghost" size="sm">
                      <Edit className="w-4 h-4" />
                    </Button>
                    <Button variant="ghost" size="sm" className="text-red-600 hover:text-red-700">
                      <Trash2 className="w-4 h-4" />
                    </Button>
                  </div>
                </div>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {/* Budget Progress */}
                  <div>
                    <div className="flex justify-between text-sm mb-1">
                      <span className="text-gray-500">Budget Usage</span>
                      <span className="font-medium">
                        {formatPrice(campaign.spent)} / {formatPrice(campaign.budget)}
                      </span>
                    </div>
                    <div className="w-full bg-gray-200 rounded-full h-2">
                      <div 
                        className="bg-gradient-to-r from-purple-500 to-blue-500 h-2 rounded-full"
                        style={{width: `${(campaign.spent / campaign.budget) * 100}%`}}
                      ></div>
                    </div>
                  </div>

                  {/* Campaign Stats */}
                  <div className="grid grid-cols-2 gap-4 text-sm">
                    <div>
                      <div className="text-gray-500">Impressions</div>
                      <div className="font-medium">{campaign.impressions.toLocaleString()}</div>
                    </div>
                    <div>
                      <div className="text-gray-500">Clicks</div>
                      <div className="font-medium">{campaign.clicks}</div>
                    </div>
                    <div>
                      <div className="text-gray-500">Conversions</div>
                      <div className="font-medium">{campaign.conversions}</div>
                    </div>
                    <div>
                      <div className="text-gray-500">ROI</div>
                      <div className="font-medium text-green-600">
                        {calculateROI(campaign.spent, campaign.conversions).toFixed(1)}%
                      </div>
                    </div>
                  </div>

                  {/* Campaign Dates */}
                  <div className="pt-4 border-t">
                    <div className="flex items-center text-sm text-gray-500">
                      <Calendar className="w-4 h-4 mr-2" />
                      {new Date(campaign.startDate).toLocaleDateString()} - {new Date(campaign.endDate).toLocaleDateString()}
                    </div>
                  </div>

                  {/* Action Buttons */}
                  <div className="flex space-x-2 pt-4">
                    {campaign.status === 'active' ? (
                      <Button variant="outline" size="sm" className="flex-1">
                        <Pause className="w-4 h-4 mr-2" />
                        Pause
                      </Button>
                    ) : campaign.status === 'paused' ? (
                      <Button variant="outline" size="sm" className="flex-1">
                        <Play className="w-4 h-4 mr-2" />
                        Resume
                      </Button>
                    ) : null}
                    <Button variant="outline" size="sm" className="flex-1">
                      <Edit className="w-4 h-4 mr-2" />
                      Edit
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        {filteredCampaigns.length === 0 && (
          <div className="text-center py-12">
            <TrendingUp className="w-16 h-16 text-gray-400 mx-auto mb-4" />
            <h3 className="text-lg font-medium text-gray-900 mb-2">No campaigns found</h3>
            <p className="text-gray-600 mb-6">
              {filter === 'all' 
                ? "You haven't created any boost campaigns yet. Get started by creating your first campaign."
                : `No campaigns with status "${filter}" found.`
              }
            </p>
            {filter === 'all' && (
              <Button 
                onClick={() => router.push('/dashboard/vendor/boost-campaigns/create')}
                className="bg-gradient-to-r from-purple-500 to-blue-500 hover:from-purple-600 hover:to-blue-600"
              >
                <Plus className="w-4 h-4 mr-2" />
                Create Your First Campaign
              </Button>
            )}
          </div>
        )}
      </div>
    </div>
  )
}