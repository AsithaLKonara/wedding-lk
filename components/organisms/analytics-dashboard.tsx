"use client"

import React, { useState, useEffect } from 'react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { 
  TrendingUp, 
  Users, 
  Calendar, 
  DollarSign, 
  Star,
  Activity,
  BarChart3,
  Clock
} from 'lucide-react'

interface AnalyticsData {
  overview: {
    totalBookings: number
    totalRevenue: number
    growthRate: number
    averageRating: number
  }
  bookings: {
    confirmed: number
    pending: number
    completed: number
    cancelled: number
  }
  revenue: {
    monthly: number
    growth: number
    breakdown: {
      venueBookings: number
      vendorServices: number
      subscriptions: number
      commissions: number
    }
  }
  users: {
    active: number
    new: number
  }
  performance: {
    pageViews: number
    uniqueVisitors: number
  }
  engagement: {
    totalReviews: number
  }
}

export function AnalyticsDashboard({ userRole = 'admin' }: { userRole?: string }) {
  const [data, setData] = useState<AnalyticsData | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetchAnalyticsData()
  }, [userRole])

  const fetchAnalyticsData = async () => {
    try {
      setLoading(true)
      const response = await fetch(`/api/analytics?role=${userRole}`)
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
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        {[...Array(4)].map((_, i) => (
          <Card key={i} className="bg-white/5 border-white/10 animate-pulse h-32"></Card>
        ))}
      </div>
    )
  }

  if (!data) return null

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <MetricCard label="Conversion" value={`${data.overview.growthRate}%`} trend="+2.4%" icon={TrendingUp} color="emerald" />
        <MetricCard label="Active Sessions" value={data.users.active} trend="+124" icon={Activity} color="blue" />
        <MetricCard label="System Load" value="24%" trend="Optimal" icon={Clock} color="purple" />
        <MetricCard label="Revenue Flow" value={`LKR ${formatNumber(data.overview.totalRevenue)}`} trend="+8.2%" icon={DollarSign} color="emerald" />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <Card className="lg:col-span-2 bg-white/5 border-white/10">
          <CardHeader>
            <CardTitle className="text-xs font-black text-white uppercase tracking-widest">Growth trajectory</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="h-64 flex items-end justify-between gap-2 pt-10">
              {[40, 70, 45, 90, 65, 80, 55, 95, 75, 85, 60, 100].map((h, i) => (
                <div key={i} className="flex-1 bg-white/5 group relative rounded-t-lg overflow-hidden transition-all hover:bg-white/10">
                  <div className="absolute bottom-0 w-full bg-gradient-to-t from-purple-600 to-pink-600 transition-all duration-1000" style={{ height: `${h}%` }} />
                </div>
              ))}
            </div>
            <div className="flex justify-between mt-4">
              {['JAN', 'FEB', 'MAR', 'APR', 'MAY', 'JUN', 'JUL', 'AUG', 'SEP', 'OCT', 'NOV', 'DEC'].map(m => (
                <span key={m} className="text-[10px] font-black text-gray-600">{m}</span>
              ))}
            </div>
          </CardContent>
        </Card>

        <Card className="bg-white/5 border-white/10">
          <CardHeader>
            <CardTitle className="text-xs font-black text-white uppercase tracking-widest">Revenue Source</CardTitle>
          </CardHeader>
          <CardContent className="space-y-6">
            <ProgressItem label="Venues" value={65} color="emerald" />
            <ProgressItem label="Vendors" value={25} color="blue" />
            <ProgressItem label="Ad Spend" value={10} color="purple" />
          </CardContent>
        </Card>
      </div>
    </div>
  )
}

function MetricCard({ label, value, trend, icon: Icon, color }: any) {
  return (
    <Card className="bg-white/5 border-white/10 relative overflow-hidden group">
      <CardContent className="p-6">
        <div className="flex justify-between items-start mb-4">
          <div className={`p-2 rounded-xl bg-${color}-500/10 text-${color}-500`}>
            <Icon className="w-5 h-5" />
          </div>
          <Badge className="bg-white/5 border-white/10 text-[9px] font-black uppercase tracking-widest">{trend}</Badge>
        </div>
        <p className="text-2xl font-black text-white tracking-tighter">{value}</p>
        <p className="text-[10px] font-black text-gray-500 uppercase tracking-widest mt-1">{label}</p>
      </CardContent>
    </Card>
  )
}

function ProgressItem({ label, value, color }: any) {
  return (
    <div className="space-y-2">
      <div className="flex justify-between text-[10px] font-black uppercase tracking-widest">
        <span className="text-gray-500">{label}</span>
        <span className="text-white">{value}%</span>
      </div>
      <div className="w-full bg-white/5 rounded-full h-1.5">
        <div className={`bg-${color}-500 h-1.5 rounded-full shadow-[0_0_8px_rgba(0,0,0,0.3)]`} style={{ width: `${value}%` }} />
      </div>
    </div>
  )
}

function formatNumber(num: number) {
  if (num >= 1000000) return (num / 1000000).toFixed(1) + 'M'
  if (num >= 1000) return (num / 1000).toFixed(1) + 'K'
  return num.toString()
}