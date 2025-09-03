"use client"

import { useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Progress } from "@/components/ui/progress"
import { TrendingUp, DollarSign, Users, Calendar, MapPin, Eye, Loader2, Download, RefreshCw } from "lucide-react"
import { useToast } from "@/hooks/use-toast"

export function CommissionTracker() {
  const { toast } = useToast()
  const [isLoading, setIsLoading] = useState(false)
  const [selectedPeriod, setSelectedPeriod] = useState("month")

  const commissionData = {
    month: {
      totalEarnings: 2850000,
      totalBookings: 45,
      averageCommission: 63333,
      topLocation: "Colombo",
      growth: 15.5,
    },
    year: {
      totalEarnings: 28500000,
      totalBookings: 420,
      averageCommission: 67857,
      topLocation: "Colombo",
      growth: 23.2,
    },
  }

  const locationCommissions = [
    { location: "Colombo", rate: "18%", bookings: 15, earnings: 1200000, color: "bg-blue-500" },
    { location: "Gampaha", rate: "16%", bookings: 8, earnings: 640000, color: "bg-green-500" },
    { location: "Kandy", rate: "15%", bookings: 12, earnings: 720000, color: "bg-purple-500" },
    { location: "Galle", rate: "15%", bookings: 6, earnings: 450000, color: "bg-orange-500" },
    { location: "Other", rate: "12%", bookings: 4, earnings: 240000, color: "bg-gray-500" },
  ]

  const recentBookings = [
    {
      id: 1,
      venue: "Grand Ballroom Hotel",
      couple: "Sarah & Michael",
      amount: 180000,
      commission: 32400,
      location: "Colombo",
      date: "2024-06-15",
      status: "confirmed",
    },
    {
      id: 2,
      venue: "Garden Paradise Resort",
      couple: "Priya & Raj",
      amount: 150000,
      commission: 22500,
      location: "Kandy",
      date: "2024-07-20",
      status: "pending",
    },
    {
      id: 3,
      venue: "Seaside Villa",
      couple: "Emma & David",
      amount: 200000,
      commission: 30000,
      location: "Galle",
      date: "2024-08-10",
      status: "confirmed",
    },
  ]

  const data = commissionData[selectedPeriod as keyof typeof commissionData]

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat("en-LK", {
      style: "currency",
      currency: "LKR",
      minimumFractionDigits: 0,
    }).format(amount)
  }

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString("en-LK", {
      year: "numeric",
      month: "short",
      day: "numeric",
    })
  }

  const handleRefresh = async () => {
    setIsLoading(true)
    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1000))
      toast({
        title: "Data Refreshed",
        description: "Commission data has been updated successfully.",
      })
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to refresh data. Please try again.",
        variant: "destructive",
      })
    } finally {
      setIsLoading(false)
    }
  }

  const handleExport = async () => {
    setIsLoading(true)
    try {
      // Simulate export process
      await new Promise(resolve => setTimeout(resolve, 1500))
      toast({
        title: "Export Successful",
        description: "Commission report has been exported to your downloads.",
      })
    } catch (error) {
      toast({
        title: "Export Failed",
        description: "Failed to export report. Please try again.",
        variant: "destructive",
      })
    } finally {
      setIsLoading(false)
    }
  }

  const handlePeriodChange = (period: string) => {
    setSelectedPeriod(period)
    toast({
      title: "Period Changed",
      description: `Switched to ${period === "month" ? "monthly" : "yearly"} view.`,
    })
  }

  return (
    <div className="space-y-6" role="region" aria-label="Commission Tracker">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold text-gray-900 dark:text-white">Commission Dashboard</h2>
        <div className="flex space-x-2">
          <Button
            variant="outline"
            size="sm"
            onClick={handleRefresh}
            disabled={isLoading}
            aria-label="Refresh commission data"
          >
            {isLoading ? <Loader2 className="h-4 w-4 animate-spin" /> : <RefreshCw className="h-4 w-4" />}
          </Button>
          <Button
            variant="outline"
            size="sm"
            onClick={handleExport}
            disabled={isLoading}
            aria-label="Export commission report"
          >
            <Download className="h-4 w-4 mr-2" />
            Export
          </Button>
          <Button
            variant={selectedPeriod === "month" ? "default" : "outline"}
            size="sm"
            onClick={() => handlePeriodChange("month")}
            disabled={isLoading}
            aria-label="View monthly data"
            aria-pressed={selectedPeriod === "month"}
          >
            This Month
          </Button>
          <Button
            variant={selectedPeriod === "year" ? "default" : "outline"}
            size="sm"
            onClick={() => handlePeriodChange("year")}
            disabled={isLoading}
            aria-label="View yearly data"
            aria-pressed={selectedPeriod === "year"}
          >
            This Year
          </Button>
        </div>
      </div>

      {/* Overview Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600 dark:text-gray-400">Total Earnings</p>
                <p className="text-2xl font-bold text-gray-900 dark:text-white" aria-live="polite">
                  {formatCurrency(data.totalEarnings)}
                </p>
              </div>
              <DollarSign className="h-8 w-8 text-green-500" aria-hidden="true" />
            </div>
            <div className="flex items-center mt-2">
              <TrendingUp className="h-4 w-4 text-green-500 mr-1" aria-hidden="true" />
              <span className="text-sm text-green-600">
                +{data.growth}% from last {selectedPeriod}
              </span>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600 dark:text-gray-400">Total Bookings</p>
                <p className="text-2xl font-bold text-gray-900 dark:text-white" aria-live="polite">
                  {data.totalBookings}
                </p>
              </div>
              <Calendar className="h-8 w-8 text-blue-500" aria-hidden="true" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600 dark:text-gray-400">Avg Commission</p>
                <p className="text-2xl font-bold text-gray-900 dark:text-white" aria-live="polite">
                  {formatCurrency(data.averageCommission)}
                </p>
              </div>
              <Users className="h-8 w-8 text-purple-500" aria-hidden="true" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600 dark:text-gray-400">Top Location</p>
                <p className="text-2xl font-bold text-gray-900 dark:text-white" aria-live="polite">
                  {data.topLocation}
                </p>
              </div>
              <MapPin className="h-8 w-8 text-orange-500" aria-hidden="true" />
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Location-based Commission Breakdown */}
      <Card>
        <CardHeader>
          <CardTitle>Commission by Location</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {locationCommissions.length === 0 ? (
              <div className="text-center py-8 text-gray-500">
                <MapPin className="h-12 w-12 mx-auto mb-4 text-gray-300" />
                <p>No location data available</p>
              </div>
            ) : (
              locationCommissions.map((location, index) => (
                <div key={index} className="flex items-center justify-between p-3 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors">
                  <div className="flex items-center space-x-3">
                    <div 
                      className={`w-3 h-3 rounded-full ${location.color}`}
                      aria-label={`${location.location} location indicator`}
                    />
                    <div>
                      <div className="font-medium text-gray-900 dark:text-white">{location.location}</div>
                      <div className="text-sm text-gray-600 dark:text-gray-400">
                        {location.bookings} bookings • {location.rate} commission
                      </div>
                    </div>
                  </div>
                  <div className="text-right">
                    <div className="font-semibold text-gray-900 dark:text-white">
                      {formatCurrency(location.earnings)}
                    </div>
                    <Progress 
                      value={(location.earnings / data.totalEarnings) * 100} 
                      className="w-20 h-2 mt-1"
                      aria-label={`${location.location} represents ${Math.round((location.earnings / data.totalEarnings) * 100)}% of total earnings`}
                    />
                  </div>
                </div>
              ))
            )}
          </div>
        </CardContent>
      </Card>

      {/* Recent Bookings */}
      <Card>
        <CardHeader>
          <CardTitle>Recent Bookings</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {recentBookings.length === 0 ? (
              <div className="text-center py-8 text-gray-500">
                <Calendar className="h-12 w-12 mx-auto mb-4 text-gray-300" />
                <p>No recent bookings found</p>
              </div>
            ) : (
              recentBookings.map((booking) => (
                <div 
                  key={booking.id} 
                  className="flex items-center justify-between p-4 border rounded-lg hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors"
                  role="article"
                  aria-label={`Booking for ${booking.couple} at ${booking.venue}`}
                >
                  <div className="flex items-center space-x-4">
                    <div>
                      <div className="font-medium text-gray-900 dark:text-white">{booking.venue}</div>
                      <div className="text-sm text-gray-600 dark:text-gray-400">{booking.couple}</div>
                      <div className="text-xs text-gray-500">{formatDate(booking.date)}</div>
                    </div>
                    <Badge variant="outline">{booking.location}</Badge>
                    <Badge 
                      variant={booking.status === "confirmed" ? "default" : "secondary"}
                      aria-label={`Status: ${booking.status}`}
                    >
                      {booking.status}
                    </Badge>
                  </div>
                  <div className="text-right">
                    <div className="font-semibold text-gray-900 dark:text-white">
                      {formatCurrency(booking.commission)}
                    </div>
                    <div className="text-sm text-gray-600 dark:text-gray-400">
                      from {formatCurrency(booking.amount)}
                    </div>
                  </div>
                </div>
              ))
            )}
          </div>
          <Button 
            variant="outline" 
            className="w-full mt-4"
            disabled={isLoading}
            aria-label="View all bookings"
          >
            <Eye className="mr-2 h-4 w-4" />
            View All Bookings
          </Button>
        </CardContent>
      </Card>
    </div>
  )
}


export default CommissionTracker
