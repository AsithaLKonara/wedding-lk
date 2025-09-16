"use client"

import { useState, useEffect } from 'react'
import { useSession } from 'next-auth/react'
import { useRouter, useParams } from 'next/navigation'
import { Calendar, Clock, User, MapPin, CreditCard, CheckCircle, ArrowLeft, Star } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { PaymentForm } from '@/components/molecules/payment-form'

interface Package {
  id: string
  name: string
  description: string
  price: number
  duration: number
  vendor: {
    id: string
    name: string
    rating: number
    location: string
    image: string
  }
  includes: string[]
  category: string
  availability: string[]
}

interface BookingForm {
  eventDate: string
  eventTime: string
  guestCount: number
  specialRequests: string
  contactPhone: string
  contactEmail: string
}

export default function BookingPage() {
  const { data: session, status } = useSession()
  const router = useRouter()
  const params = useParams()
  const packageId = params.id as string
  
  const [packageData, setPackageData] = useState<Package | null>(null)
  const [bookingForm, setBookingForm] = useState<BookingForm>({
    eventDate: '',
    eventTime: '',
    guestCount: 1,
    specialRequests: '',
    contactPhone: '',
    contactEmail: ''
  })
  const [loading, setLoading] = useState(true)
  const [submitting, setSubmitting] = useState(false)
  const [currentStep, setCurrentStep] = useState(1)
  const [showPayment, setShowPayment] = useState(false)
  const [bookingId, setBookingId] = useState<string | null>(null)

  useEffect(() => {
    if (status === 'loading') return

    if (!session?.user) {
      router.push('/auth/signin')
      return
    }

    // Mock data - replace with actual API call
    setPackageData({
      id: packageId,
      name: 'Premium Wedding Photography Package',
      description: 'Full day wedding photography with edited photos, online gallery, and 2 photographers',
      price: 150000,
      duration: 8,
      vendor: {
        id: '1',
        name: 'Elegant Photography Studio',
        rating: 4.8,
        location: 'Colombo',
        image: '/images/vendors/photography.jpg'
      },
      includes: [
        'Full day coverage (8 hours)',
        '2 professional photographers',
        '500+ edited photos',
        'Online gallery',
        'USB drive with all photos',
        'Engagement session included'
      ],
      category: 'Photography',
      availability: ['2024-03-15', '2024-03-22', '2024-03-29', '2024-04-05']
    })
    
    // Pre-fill email if user is logged in
    if (session?.user?.email) {
      setBookingForm(prev => ({ ...prev, contactEmail: session.user.email }))
    }
    
    setLoading(false)
  }, [session, status, router, packageId])

  const handleInputChange = (field: keyof BookingForm, value: string | number) => {
    setBookingForm(prev => ({ ...prev, [field]: value }))
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setSubmitting(true)

    try {
      // Create booking record
      const response = await fetch('/api/bookings', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          packageId: packageId,
          eventDate: bookingForm.eventDate,
          eventTime: bookingForm.eventTime,
          guestCount: bookingForm.guestCount,
          contactPhone: bookingForm.contactPhone,
          contactEmail: bookingForm.contactEmail,
          specialRequests: bookingForm.specialRequests,
          totalPrice: totalPrice
        })
      })

      if (response.ok) {
        const data = await response.json()
        setBookingId(data.booking._id)
        setShowPayment(true)
        setCurrentStep(2)
      } else {
        throw new Error('Failed to create booking')
      }
    } catch (error) {
      console.error('Booking error:', error)
    } finally {
      setSubmitting(false)
    }
  }

  const handlePaymentSuccess = () => {
    setCurrentStep(3)
  }

  const handlePaymentError = (error: string) => {
    console.error('Payment error:', error)
  }

  const formatPrice = (price: number) => {
    return new Intl.NumberFormat('en-LK', {
      style: 'currency',
      currency: 'LKR',
      minimumFractionDigits: 0
    }).format(price)
  }

  const totalPrice = packageData ? packageData.price * bookingForm.guestCount : 0

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-purple-600"></div>
      </div>
    )
  }

  if (!packageData) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-gray-900 mb-4">Package Not Found</h1>
          <Button onClick={() => router.push('/packages')}>
            Browse Packages
          </Button>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="mb-8">
          <Button 
            variant="ghost" 
            onClick={() => router.back()}
            className="mb-4"
          >
            <ArrowLeft className="w-4 h-4 mr-2" />
            Back
          </Button>
          <h1 className="text-3xl font-bold text-gray-900">Book Package</h1>
          <p className="text-gray-600">Complete your booking for {packageData.name}</p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Booking Form */}
          <div className="lg:col-span-2">
            {currentStep === 1 && (
              <Card>
                <CardHeader>
                  <CardTitle>Booking Details</CardTitle>
                </CardHeader>
                <CardContent>
                  <form onSubmit={handleSubmit} className="space-y-6">
                  {/* Event Details */}
                  <div className="space-y-4">
                    <h3 className="text-lg font-semibold text-gray-900">Event Details</h3>
                    
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          Event Date *
                        </label>
                        <input
                          type="date"
                          value={bookingForm.eventDate}
                          onChange={(e) => handleInputChange('eventDate', e.target.value)}
                          className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-purple-500"
                          required
                        />
                      </div>
                      
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          Event Time *
                        </label>
                        <input
                          type="time"
                          value={bookingForm.eventTime}
                          onChange={(e) => handleInputChange('eventTime', e.target.value)}
                          className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-purple-500"
                          required
                        />
                      </div>
                    </div>
                    
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Guest Count *
                      </label>
                      <input
                        type="number"
                        min="1"
                        value={bookingForm.guestCount}
                        onChange={(e) => handleInputChange('guestCount', parseInt(e.target.value))}
                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-purple-500"
                        required
                      />
                    </div>
                  </div>

                  {/* Contact Information */}
                  <div className="space-y-4">
                    <h3 className="text-lg font-semibold text-gray-900">Contact Information</h3>
                    
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          Phone Number *
                        </label>
                        <input
                          type="tel"
                          value={bookingForm.contactPhone}
                          onChange={(e) => handleInputChange('contactPhone', e.target.value)}
                          className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-purple-500"
                          required
                        />
                      </div>
                      
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          Email Address *
                        </label>
                        <input
                          type="email"
                          value={bookingForm.contactEmail}
                          onChange={(e) => handleInputChange('contactEmail', e.target.value)}
                          className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-purple-500"
                          required
                        />
                      </div>
                    </div>
                  </div>

                  {/* Special Requests */}
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Special Requests
                    </label>
                    <textarea
                      value={bookingForm.specialRequests}
                      onChange={(e) => handleInputChange('specialRequests', e.target.value)}
                      rows={4}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-purple-500"
                      placeholder="Any special requirements or requests..."
                    />
                  </div>

                    <Button 
                      type="submit" 
                      className="w-full bg-gradient-to-r from-purple-500 to-blue-500 hover:from-purple-600 hover:to-blue-600"
                      disabled={submitting}
                    >
                      {submitting ? 'Processing...' : 'Proceed to Payment'}
                    </Button>
                  </form>
                </CardContent>
              </Card>
            )}

            {currentStep === 2 && bookingId && (
              <PaymentForm
                bookingId={bookingId}
                amount={totalPrice}
                currency="lkr"
                description={`Booking for ${packageData.name}`}
                onSuccess={handlePaymentSuccess}
                onError={handlePaymentError}
              />
            )}

            {currentStep === 3 && (
              <Card>
                <CardContent className="text-center py-8">
                  <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
                    <CheckCircle className="w-8 h-8 text-green-600" />
                  </div>
                  <h3 className="text-xl font-semibold text-gray-900 mb-2">Booking Confirmed!</h3>
                  <p className="text-gray-600 mb-4">Your payment has been processed successfully.</p>
                  <Button 
                    onClick={() => router.push(`/booking/confirmation/${bookingId}`)}
                    className="bg-gradient-to-r from-purple-500 to-blue-500 hover:from-purple-600 hover:to-blue-600"
                  >
                    View Booking Details
                  </Button>
                </CardContent>
              </Card>
            )}
          </div>

          {/* Package Summary */}
          <div className="lg:col-span-1">
            <Card className="sticky top-8">
              <CardHeader>
                <CardTitle>Package Summary</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                {/* Package Info */}
                <div>
                  <h3 className="font-semibold text-gray-900 mb-2">{packageData.name}</h3>
                  <p className="text-sm text-gray-600 mb-3">{packageData.description}</p>
                  
                  <div className="flex items-center space-x-2 mb-3">
                    <Badge variant="secondary">{packageData.category}</Badge>
                    <div className="flex items-center text-sm text-gray-600">
                      <Clock className="w-4 h-4 mr-1" />
                      {packageData.duration} hours
                    </div>
                  </div>
                </div>

                {/* Vendor Info */}
                <div className="border-t pt-4">
                  <h4 className="font-medium text-gray-900 mb-2">Vendor</h4>
                  <div className="flex items-center space-x-3">
                    <div className="w-10 h-10 bg-gradient-to-r from-purple-500 to-blue-500 rounded-full flex items-center justify-center text-white font-semibold">
                      {packageData.vendor.name.charAt(0)}
                    </div>
                    <div>
                      <div className="font-medium text-gray-900">{packageData.vendor.name}</div>
                      <div className="flex items-center text-sm text-gray-600">
                        <Star className="w-4 h-4 text-yellow-500 mr-1" />
                        {packageData.vendor.rating}
                        <MapPin className="w-4 h-4 ml-2 mr-1" />
                        {packageData.vendor.location}
                      </div>
                    </div>
                  </div>
                </div>

                {/* Includes */}
                <div className="border-t pt-4">
                  <h4 className="font-medium text-gray-900 mb-2">Includes</h4>
                  <ul className="space-y-1">
                    {packageData.includes.map((item, index) => (
                      <li key={index} className="flex items-center text-sm text-gray-600">
                        <CheckCircle className="w-4 h-4 text-green-500 mr-2" />
                        {item}
                      </li>
                    ))}
                  </ul>
                </div>

                {/* Pricing */}
                <div className="border-t pt-4">
                  <div className="flex justify-between items-center mb-2">
                    <span className="text-gray-600">Base Price</span>
                    <span className="font-medium">{formatPrice(packageData.price)}</span>
                  </div>
                  <div className="flex justify-between items-center mb-2">
                    <span className="text-gray-600">Guest Count</span>
                    <span className="font-medium">{bookingForm.guestCount}</span>
                  </div>
                  <div className="border-t pt-2">
                    <div className="flex justify-between items-center">
                      <span className="font-semibold text-gray-900">Total</span>
                      <span className="font-bold text-lg text-purple-600">{formatPrice(totalPrice)}</span>
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
