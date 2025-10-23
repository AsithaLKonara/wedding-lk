"use client"

import { useState, useEffect } from 'react'
import { useRouter, useParams } from 'next/navigation'
import { CheckCircle, Calendar, Clock, User, MapPin, CreditCard, Download, Share2, Home } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'

interface BookingConfirmation {
  id: string
  packageName: string
  vendorName: string
  eventDate: string
  eventTime: string
  guestCount: number
  totalPrice: number
  status: 'confirmed' | 'pending' | 'cancelled'
  bookingDate: string
  contactEmail: string
  contactPhone: string
  specialRequests?: string
}

export default function BookingConfirmationPage() {
  const [user, setUser] = useState(null);
  const [status, setStatus] = useState('loading');
  const router = useRouter()
  const params = useParams()
  const bookingId = params.id as string
  
  const [booking, setBooking] = useState<BookingConfirmation | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    if (status === 'loading') return

    if (!user?.user) {
      router.push('/auth/signin')
      return
    }

    // Mock data - replace with actual API call
    setBooking({
      id: bookingId,
      packageName: 'Premium Wedding Photography Package',
      vendorName: 'Elegant Photography Studio',
      eventDate: '2024-06-15',
      eventTime: '09:00',
      guestCount: 150,
      totalPrice: 150000,
      status: 'confirmed',
      bookingDate: new Date().toISOString(),
      contactEmail: user.email || '',
      contactPhone: '+94 77 123 4567',
      specialRequests: 'Outdoor ceremony preferred'
    })
    
    setLoading(false)
  }, [session, status, router, bookingId])

  const formatPrice = (price: number) => {
    return new Intl.NumberFormat('en-LK', {
      style: 'currency',
      currency: 'LKR',
      minimumFractionDigits: 0
    }).format(price)
  }

  const handleDownloadInvoice = () => {
    // Implement invoice download
    console.log('Downloading invoice...')
  }

  const handleShareBooking = () => {
    // Implement booking sharing
    console.log('Sharing booking...')
  }

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-purple-600"></div>
      </div>
    )
  }

  if (!booking) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-gray-900 mb-4">Booking Not Found</h1>
          <Button onClick={() => router.push('/dashboard')}>
            Go to Dashboard
          </Button>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Success Header */}
        <div className="text-center mb-8">
          <div className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <CheckCircle className="w-12 h-12 text-green-600" />
          </div>
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Booking Confirmed!</h1>
          <p className="text-gray-600">Your booking has been successfully confirmed</p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Booking Details */}
          <div className="lg:col-span-2">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center justify-between">
                  <span>Booking Details</span>
                  <Badge className="bg-green-100 text-green-800">
                    {booking.status}
                  </Badge>
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-6">
                {/* Package Information */}
                <div>
                  <h3 className="text-lg font-semibold text-gray-900 mb-3">Package Information</h3>
                  <div className="bg-gray-50 rounded-lg p-4">
                    <h4 className="font-medium text-gray-900 mb-2">{booking.packageName}</h4>
                    <p className="text-gray-600">Vendor: {booking.vendorName}</p>
                  </div>
                </div>

                {/* Event Details */}
                <div>
                  <h3 className="text-lg font-semibold text-gray-900 mb-3">Event Details</h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="flex items-center space-x-3">
                      <Calendar className="w-5 h-5 text-purple-600" />
                      <div>
                        <div className="text-sm text-gray-500">Event Date</div>
                        <div className="font-medium">{new Date(booking.eventDate).toLocaleDateString()}</div>
                      </div>
                    </div>
                    <div className="flex items-center space-x-3">
                      <Clock className="w-5 h-5 text-purple-600" />
                      <div>
                        <div className="text-sm text-gray-500">Event Time</div>
                        <div className="font-medium">{booking.eventTime}</div>
                      </div>
                    </div>
                    <div className="flex items-center space-x-3">
                      <User className="w-5 h-5 text-purple-600" />
                      <div>
                        <div className="text-sm text-gray-500">Guest Count</div>
                        <div className="font-medium">{booking.guestCount} guests</div>
                      </div>
                    </div>
                    <div className="flex items-center space-x-3">
                      <CreditCard className="w-5 h-5 text-purple-600" />
                      <div>
                        <div className="text-sm text-gray-500">Total Amount</div>
                        <div className="font-medium">{formatPrice(booking.totalPrice)}</div>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Contact Information */}
                <div>
                  <h3 className="text-lg font-semibold text-gray-900 mb-3">Contact Information</h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <div className="text-sm text-gray-500">Email</div>
                      <div className="font-medium">{booking.contactEmail}</div>
                    </div>
                    <div>
                      <div className="text-sm text-gray-500">Phone</div>
                      <div className="font-medium">{booking.contactPhone}</div>
                    </div>
                  </div>
                </div>

                {/* Special Requests */}
                {booking.specialRequests && (
                  <div>
                    <h3 className="text-lg font-semibold text-gray-900 mb-3">Special Requests</h3>
                    <div className="bg-gray-50 rounded-lg p-4">
                      <p className="text-gray-700">{booking.specialRequests}</p>
                    </div>
                  </div>
                )}

                {/* Next Steps */}
                <div>
                  <h3 className="text-lg font-semibold text-gray-900 mb-3">What's Next?</h3>
                  <div className="space-y-3">
                    <div className="flex items-start space-x-3">
                      <div className="w-6 h-6 bg-purple-100 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5">
                        <span className="text-xs font-semibold text-purple-600">1</span>
                      </div>
                      <div>
                        <div className="font-medium text-gray-900">Confirmation Email</div>
                        <div className="text-sm text-gray-600">You'll receive a confirmation email with all the details</div>
                      </div>
                    </div>
                    <div className="flex items-start space-x-3">
                      <div className="w-6 h-6 bg-purple-100 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5">
                        <span className="text-xs font-semibold text-purple-600">2</span>
                      </div>
                      <div>
                        <div className="font-medium text-gray-900">Vendor Contact</div>
                        <div className="text-sm text-gray-600">The vendor will contact you within 24 hours to discuss details</div>
                      </div>
                    </div>
                    <div className="flex items-start space-x-3">
                      <div className="w-6 h-6 bg-purple-100 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5">
                        <span className="text-xs font-semibold text-purple-600">3</span>
                      </div>
                      <div>
                        <div className="font-medium text-gray-900">Final Confirmation</div>
                        <div className="text-sm text-gray-600">Final details will be confirmed 1 week before your event</div>
                      </div>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Action Panel */}
          <div className="lg:col-span-1">
            <Card className="sticky top-8">
              <CardHeader>
                <CardTitle>Booking Actions</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <Button 
                  onClick={handleDownloadInvoice}
                  className="w-full"
                  variant="outline"
                >
                  <Download className="w-4 h-4 mr-2" />
                  Download Invoice
                </Button>
                
                <Button 
                  onClick={handleShareBooking}
                  className="w-full"
                  variant="outline"
                >
                  <Share2 className="w-4 h-4 mr-2" />
                  Share Booking
                </Button>
                
                <Button 
                  onClick={() => router.push('/dashboard/bookings')}
                  className="w-full"
                  variant="outline"
                >
                  <Calendar className="w-4 h-4 mr-2" />
                  View All Bookings
                </Button>
                
                <Button 
                  onClick={() => router.push('/')}
                  className="w-full bg-gradient-to-r from-purple-500 to-blue-500 hover:from-purple-600 hover:to-blue-600"
                >
                  <Home className="w-4 h-4 mr-2" />
                  Back to Home
                </Button>
              </CardContent>
            </Card>

            {/* Booking Summary */}
            <Card className="mt-6">
              <CardHeader>
                <CardTitle>Booking Summary</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  <div className="flex justify-between">
                    <span className="text-gray-600">Booking ID</span>
                    <span className="font-medium">#{booking.id}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">Booking Date</span>
                    <span className="font-medium">{new Date(booking.bookingDate).toLocaleDateString()}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">Status</span>
                    <Badge className="bg-green-100 text-green-800">
                      {booking.status}
                    </Badge>
                  </div>
                  <div className="border-t pt-3">
                    <div className="flex justify-between">
                      <span className="font-semibold text-gray-900">Total Amount</span>
                      <span className="font-bold text-lg text-purple-600">{formatPrice(booking.totalPrice)}</span>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  )
}
