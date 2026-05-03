"use client"

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Calendar, Heart, MessageSquare, CreditCard } from 'lucide-react'

interface DashboardOverviewProps {
  stats: {
    totalBookings: number
    totalFavorites: number
    totalMessages: number
    totalPayments: number
  }
}

export function DashboardOverview({ stats }: DashboardOverviewProps) {
  return (
    <div className="space-y-6">
      {/* Quick Stats */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
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

      {/* Quick Actions */}
      <Card>
        <CardHeader>
          <CardTitle>Quick Actions</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="p-4 border border-white/10 rounded-lg hover:bg-white/5 cursor-pointer transition-all">
              <h3 className="font-medium mb-2 text-white">Find Venues</h3>
              <p className="text-sm text-gray-400">Browse wedding venues</p>
            </div>
            <div className="p-4 border border-white/10 rounded-lg hover:bg-white/5 cursor-pointer transition-all">
              <h3 className="font-medium mb-2 text-white">Find Vendors</h3>
              <p className="text-sm text-gray-400">Browse wedding services</p>
            </div>
            <div className="p-4 border border-white/10 rounded-lg hover:bg-white/5 cursor-pointer transition-all">
              <h3 className="font-medium mb-2 text-white">Wedding Planning</h3>
              <p className="text-sm text-gray-400">Use planning tools</p>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  )
} 