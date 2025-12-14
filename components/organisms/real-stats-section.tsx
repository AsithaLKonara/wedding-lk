"use client"

import { useState, useEffect } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Users, Calendar, Star, TrendingUp } from 'lucide-react'

interface PlatformStats {
  overview: {
    totalUsers: number
    totalVendors: number
    totalVenues: number
    totalBookings: number
    totalReviews: number
  }
  growth: {
    users: number
    vendors: number
  }
}

export default function RealStatsSection() {
  const [stats, setStats] = useState<PlatformStats | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetchStats()
  }, [])

  const fetchStats = async () => {
    try {
      const response = await fetch('/api/home/stats')
      if (response.ok) {
        const data = await response.json()
        setStats(data.stats)
      }
    } catch (error) {
      console.error('Failed to fetch stats:', error)
    } finally {
      setLoading(false)
    }
  }

  if (loading) {
    return (
      <section className="py-16 bg-gray-50">
        <div className="container mx-auto px-4">
          <div className="text-center">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto"></div>
            <p className="mt-4 text-gray-600">Loading platform statistics...</p>
          </div>
        </div>
      </section>
    )
  }

  if (!stats) {
    return (
      <section className="py-16 bg-gray-50">
        <div className="container mx-auto px-4">
          <div className="text-center text-gray-600">
            <p>Statistics not available at the moment</p>
          </div>
        </div>
      </section>
    )
  }

  return (
    <section className="py-16 bg-gray-50">
      <div className="container mx-auto px-4">
        <div className="text-center mb-12">
          <h2 className="text-3xl font-bold text-gray-900 mb-4">
            WeddingLK Platform Statistics
          </h2>
          <p className="text-lg text-gray-600 max-w-2xl mx-auto">
            Join thousands of couples who have found their perfect wedding vendors and venues
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-12">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Total Users</CardTitle>
              <Users className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{stats.overview.totalUsers.toLocaleString()}+</div>
              <p className="text-xs text-muted-foreground">
                {stats.growth.users > 0 ? '+' : ''}{stats.growth.users}% from last month
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Verified Vendors</CardTitle>
              <Star className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{stats.overview.totalVendors.toLocaleString()}+</div>
              <p className="text-xs text-muted-foreground">
                {stats.growth.vendors > 0 ? '+' : ''}{stats.growth.vendors}% from last month
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Wedding Venues</CardTitle>
              <Calendar className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{stats.overview.totalVenues.toLocaleString()}+</div>
              <p className="text-xs text-muted-foreground">
                Beautiful locations across Sri Lanka
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Happy Couples</CardTitle>
              <TrendingUp className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{stats.overview.totalBookings.toLocaleString()}+</div>
              <p className="text-xs text-muted-foreground">
                Successful wedding bookings
              </p>
            </CardContent>
          </Card>
        </div>

        <div className="text-center">
          <div className="inline-flex items-center space-x-2 bg-blue-50 text-blue-700 px-4 py-2 rounded-full">
            <Star className="h-4 w-4 fill-current" />
            <span className="text-sm font-medium">
              {stats.overview.totalReviews.toLocaleString()}+ verified reviews
            </span>
          </div>
        </div>
      </div>
    </section>
  )
} 