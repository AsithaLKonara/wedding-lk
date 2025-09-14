"use client"

import React, { useState, useEffect } from 'react'
import { useParams, useRouter } from 'next/navigation'
import { motion } from 'framer-motion'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
import { Badge } from '@/components/ui/badge'
import { 
  ArrowLeft, 
  Calendar, 
  Users, 
  MapPin, 
  CreditCard,
  Check,
  Star,
  Clock
} from 'lucide-react'
import Header from '@/components/organisms/header'
import Footer from '@/components/organisms/footer'
import { useToast } from '@/hooks/use-toast'

interface PackageData {
  id: string
  name: string
  description: string
  price: number
  originalPrice?: number
  location: string
  vendor: {
    name: string
    rating: number
    reviewCount: number
  }
  features: string[]
  includes: string[]
  images: string[]
  category: string
  duration: string
  guestCapacity: number
  availability: boolean
}

interface BookingFormData {
  weddingDate: string
  guestCount: number
  specialRequests: string
  contactName: string
  contactEmail: string
  contactPhone: string
  venueAddress: string
  ceremonyTime: string
  receptionTime: string
}

export default function BookPackagePage() {
  const params = useParams()
  const router = useRouter()
  const { toast } = useToast()
  const packageId = params.id as string

  const [packageData, setPackageData] = useState<PackageData | null>(null)
  const [loading, setLoading] = useState(true)
  const [booking, setBooking] = useState(false)
  const [formData, setFormData] = useState<BookingFormData>({
    weddingDate: '',
    guestCount: 0,
    specialRequests: '',
    contactName: '',
    contactEmail: '',
    contactPhone: '',
    venueAddress: '',
    ceremonyTime: '',
    receptionTime: ''
  })

  useEffect(() => {
    const fetchPackage = async () => {
      try {
        const response = await fetch(`/api/packages/${packageId}`)
        if (response.ok) {
          const data = await response.json()
          setPackageData(data)
        } else {
          toast({
            title: "Error",
            description: "Package not found",
            variant: "destructive"
          })
          router.push('/packages')
        }
      } catch (error) {
        console.error('Error fetching package:', error)
        toast({
          title: "Error",
          description: "Failed to load package details",
          variant: "destructive"
        })
      } finally {
        setLoading(false)
      }
    }

    if (packageId) {
      fetchPackage()
    }
  }, [packageId, router, toast])

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target
    setFormData(prev => ({
      ...prev,
      [name]: name === 'guestCount' ? parseInt(value) || 0 : value
    }))
  }

  const handleBooking = async () => {
    if (!packageData) return

    // Basic validation
    if (!formData.weddingDate || !formData.contactName || !formData.contactEmail) {
      toast({
        title: "Missing Information",
        description: "Please fill in all required fields",
        variant: "destructive"
      })
      return
    }

    setBooking(true)
    try {
      const response = await fetch('/api/bookings', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          packageId: packageData.id,
          ...formData,
          totalAmount: packageData.price
        })
      })

      if (response.ok) {
        toast({
          title: "Booking Successful!",
          description: "Your wedding package has been booked successfully",
        })
        router.push('/dashboard/user')
      } else {
        const error = await response.json()
        toast({
          title: "Booking Failed",
          description: error.message || "Failed to book package",
          variant: "destructive"
        })
      }
    } catch (error) {
      console.error('Booking error:', error)
      toast({
        title: "Error",
        description: "An error occurred while booking",
        variant: "destructive"
      })
    } finally {
      setBooking(false)
    }
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 dark:bg-gray-900 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-pink-500 mx-auto"></div>
          <p className="mt-4 text-gray-600 dark:text-gray-300">Loading package details...</p>
        </div>
      </div>
    )
  }

  if (!packageData) {
    return (
      <div className="min-h-screen bg-gray-50 dark:bg-gray-900 flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">Package Not Found</h1>
          <p className="text-gray-600 dark:text-gray-300 mb-6">The package you're looking for doesn't exist.</p>
          <Button onClick={() => router.push('/packages')}>
            <ArrowLeft className="w-4 h-4 mr-2" />
            Back to Packages
          </Button>
        </div>
      </div>
    )
  }

  const savings = packageData.originalPrice ? packageData.originalPrice - packageData.price : 0
  const savingsPercentage = packageData.originalPrice ? Math.round((savings / packageData.originalPrice) * 100) : 0

  return (
    <div>
      <Header />
      <main className="min-h-screen bg-gray-50 dark:bg-gray-900">
        <div className="container mx-auto px-4 py-8">
          {/* Back Button */}
          <Button 
            variant="outline" 
            onClick={() => router.back()}
            className="mb-6"
          >
            <ArrowLeft className="w-4 h-4 mr-2" />
            Back
          </Button>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Booking Form */}
            <div className="lg:col-span-2">
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5 }}
              >
                <Card>
                  <CardHeader>
                    <CardTitle className="text-2xl">Book Your Wedding Package</CardTitle>
                    <p className="text-gray-600 dark:text-gray-300">
                      Fill in your wedding details to book this package
                    </p>
                  </CardHeader>
                  <CardContent className="space-y-6">
                    {/* Wedding Details */}
                    <div className="space-y-4">
                      <h3 className="text-lg font-semibold">Wedding Details</h3>
                      
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div>
                          <Label htmlFor="weddingDate">Wedding Date *</Label>
                          <Input
                            id="weddingDate"
                            name="weddingDate"
                            type="date"
                            value={formData.weddingDate}
                            onChange={handleInputChange}
                            required
                          />
                        </div>
                        
                        <div>
                          <Label htmlFor="guestCount">Guest Count *</Label>
                          <Input
                            id="guestCount"
                            name="guestCount"
                            type="number"
                            value={formData.guestCount}
                            onChange={handleInputChange}
                            min="1"
                            required
                          />
                        </div>
                      </div>

                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div>
                          <Label htmlFor="ceremonyTime">Ceremony Time</Label>
                          <Input
                            id="ceremonyTime"
                            name="ceremonyTime"
                            type="time"
                            value={formData.ceremonyTime}
                            onChange={handleInputChange}
                          />
                        </div>
                        
                        <div>
                          <Label htmlFor="receptionTime">Reception Time</Label>
                          <Input
                            id="receptionTime"
                            name="receptionTime"
                            type="time"
                            value={formData.receptionTime}
                            onChange={handleInputChange}
                          />
                        </div>
                      </div>

                      <div>
                        <Label htmlFor="venueAddress">Venue Address</Label>
                        <Input
                          id="venueAddress"
                          name="venueAddress"
                          value={formData.venueAddress}
                          onChange={handleInputChange}
                          placeholder="Enter venue address"
                        />
                      </div>

                      <div>
                        <Label htmlFor="specialRequests">Special Requests</Label>
                        <Textarea
                          id="specialRequests"
                          name="specialRequests"
                          value={formData.specialRequests}
                          onChange={handleInputChange}
                          placeholder="Any special requirements or requests..."
                          rows={4}
                        />
                      </div>
                    </div>

                    {/* Contact Information */}
                    <div className="space-y-4">
                      <h3 className="text-lg font-semibold">Contact Information</h3>
                      
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div>
                          <Label htmlFor="contactName">Full Name *</Label>
                          <Input
                            id="contactName"
                            name="contactName"
                            value={formData.contactName}
                            onChange={handleInputChange}
                            required
                          />
                        </div>
                        
                        <div>
                          <Label htmlFor="contactEmail">Email *</Label>
                          <Input
                            id="contactEmail"
                            name="contactEmail"
                            type="email"
                            value={formData.contactEmail}
                            onChange={handleInputChange}
                            required
                          />
                        </div>
                      </div>

                      <div>
                        <Label htmlFor="contactPhone">Phone Number</Label>
                        <Input
                          id="contactPhone"
                          name="contactPhone"
                          type="tel"
                          value={formData.contactPhone}
                          onChange={handleInputChange}
                          placeholder="+94 XX XXX XXXX"
                        />
                      </div>
                    </div>

                    {/* Booking Button */}
                    <Button 
                      onClick={handleBooking}
                      disabled={booking}
                      className="w-full bg-pink-600 hover:bg-pink-700 text-white py-3 text-lg"
                    >
                      {booking ? (
                        <>
                          <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                          Processing...
                        </>
                      ) : (
                        <>
                          <CreditCard className="w-5 h-5 mr-2" />
                          Book This Package - LKR {packageData.price.toLocaleString()}
                        </>
                      )}
                    </Button>
                  </CardContent>
                </Card>
              </motion.div>
            </div>

            {/* Package Info */}
            <div className="space-y-6">
              <Card>
                <CardHeader>
                  <CardTitle className="text-lg">Package Summary</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div>
                    <h4 className="font-semibold text-lg">{packageData.name}</h4>
                    <p className="text-gray-600 dark:text-gray-300 text-sm mt-1">
                      {packageData.description}
                    </p>
                  </div>

                  <div className="flex items-center justify-between">
                    <div>
                      <span className="text-2xl font-bold text-pink-600">
                        LKR {packageData.price.toLocaleString()}
                      </span>
                      {packageData.originalPrice && (
                        <span className="text-lg text-gray-500 line-through ml-2">
                          LKR {packageData.originalPrice.toLocaleString()}
                        </span>
                      )}
                    </div>
                    {savings > 0 && (
                      <Badge variant="secondary" className="bg-green-100 text-green-800">
                        Save LKR {savings.toLocaleString()} ({savingsPercentage}%)
                      </Badge>
                    )}
                  </div>

                  <div className="space-y-2 text-sm">
                    <div className="flex items-center">
                      <MapPin className="w-4 h-4 mr-2 text-gray-500" />
                      <span>{packageData.location}</span>
                    </div>
                    <div className="flex items-center">
                      <Users className="w-4 h-4 mr-2 text-gray-500" />
                      <span>Up to {packageData.guestCapacity} guests</span>
                    </div>
                    <div className="flex items-center">
                      <Clock className="w-4 h-4 mr-2 text-gray-500" />
                      <span>{packageData.duration}</span>
                    </div>
                    <div className="flex items-center">
                      <Star className="w-4 h-4 mr-2 text-yellow-500" />
                      <span>{packageData.vendor.rating} ({packageData.vendor.reviewCount} reviews)</span>
                    </div>
                  </div>
                </CardContent>
              </Card>

              {/* What's Included */}
              <Card>
                <CardHeader>
                  <CardTitle className="text-lg">What's Included</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-2">
                    {packageData.includes.map((item, index) => (
                      <div key={index} className="flex items-center">
                        <Check className="w-4 h-4 mr-2 text-green-500" />
                        <span className="text-sm">{item}</span>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>

              {/* Booking Guarantee */}
              <Card>
                <CardHeader>
                  <CardTitle className="text-lg">Booking Guarantee</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-2 text-sm">
                    <div className="flex items-center">
                      <Check className="w-4 h-4 mr-2 text-green-500" />
                      <span>Secure payment processing</span>
                    </div>
                    <div className="flex items-center">
                      <Check className="w-4 h-4 mr-2 text-green-500" />
                      <span>24/7 customer support</span>
                    </div>
                    <div className="flex items-center">
                      <Check className="w-4 h-4 mr-2 text-green-500" />
                      <span>Free cancellation up to 30 days</span>
                    </div>
                    <div className="flex items-center">
                      <Check className="w-4 h-4 mr-2 text-green-500" />
                      <span>Quality guarantee</span>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>
        </div>
      </main>
      <Footer />
    </div>
  )
}