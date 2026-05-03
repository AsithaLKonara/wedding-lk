"use client"

import { useState, useEffect } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Calendar, Loader2 } from 'lucide-react'

export default function BookingsTab() {
  const [bookings, setBookings] = useState([])
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    fetchBookings()
  }, [])

  const fetchBookings = async () => {
    try {
      const response = await fetch('/api/dashboard/user/bookings')
      if (response.ok) {
        const data = await response.json()
        setBookings(data.bookings || [])
      }
    } catch (error) {
      console.error('Error fetching bookings:', error)
    } finally {
      setIsLoading(false)
    }
  }

  if (isLoading) {
    return (
      <Card>
        <CardContent className="p-8">
          <div className="flex items-center justify-center">
            <Loader2 className="h-8 w-8 animate-spin text-blue-600" />
            <span className="ml-2">Loading bookings...</span>
          </div>
        </CardContent>
      </Card>
    )
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center">
          <Calendar className="h-5 w-5 mr-2" />
          Your Bookings
        </CardTitle>
      </CardHeader>
      <CardContent>
        {bookings.length > 0 ? (
          <div className="space-y-4">
            {bookings.map((booking: any) => (
              <div key={booking._id} className="flex items-center justify-between p-4 border border-white/5 rounded-lg hover:bg-white/5 transition-colors">
                <div className="flex items-center space-x-3">
                  <div className="w-10 h-10 bg-blue-500/10 rounded-full flex items-center justify-center">
                    <Calendar className="h-5 w-5 text-blue-500" />
                  </div>
                  <div>
                    <p className="font-medium text-white">{booking.venue?.name || 'Vendor Service'}</p>
                    <p className="text-sm text-gray-400">{new Date(booking.date).toLocaleDateString()}</p>
                  </div>
                </div>
                <div className="text-right">
                  <p className="font-medium text-white">LKR {booking.totalAmount?.toLocaleString() || "0"}</p>
                  <Badge variant={booking.status === 'confirmed' ? 'default' : 'secondary'} className={booking.status === 'confirmed' ? 'bg-green-500/10 text-green-500 border-green-500/20' : 'bg-gray-500/10 text-gray-400 border-gray-500/20'}>
                    {booking.status}
                  </Badge>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="text-center py-8 text-gray-500">
            <Calendar className="h-12 w-12 mx-auto mb-4 text-gray-300" />
            <p>No bookings yet</p>
            <p className="text-sm">Start planning your wedding by booking venues and vendors</p>
          </div>
        )}
      </CardContent>
    </Card>
  )
} 