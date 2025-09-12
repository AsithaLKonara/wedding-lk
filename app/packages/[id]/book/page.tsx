"use client"

import { useState, useEffect } from 'react'
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

interface WeddingPackage {
  _id: string
  name: string
  description: string
  price: number
  originalPrice: number
  rating: {
    average: number
    count: number
  }
  features: string[]
  venues: any[]
  vendors: any[]
  badge?: string
  badgeColor?: string
  location?: string
}

interface BookingForm {
  weddingDate: string
  guestCount: string
  location: string
  specialRequests: string
  contactName: string
  contactEmail: string
  contactPhone: string
}

export default function BookPackagePage() {
  const params = useParams()
  const router = useRouter()
  const { toast } = useToast()
  const packageId = params.id as string
  
  const [package, setPackage] = useState<WeddingPackage | null>(null)
  const [loading, setLoading] = useState(true)
  const [booking, setBooking] = useState(false)
  const [formData, setFormData] = useState<BookingForm>({
    weddingDate: '',
    guestCount: '',
    location: '',
    specialRequests: '',
    contactName: '',
    contactEmail: '',
    contactPhone: ''
  })

  useEffect(() => {
    if (packageId) {
      fetchPackageDetails()
    }
  }, [packageId])

  const fetchPackageDetails = async () => {
    try {
      setLoading(true)
      const response = await fetch(`/api/packages/${packageId}`)
      if (response.ok) {
        const data = await response.json()
        if (data.success) {
          setPackage(data.package)
        }
      }
    } catch (error) {
      console.error('Error fetching package details:', error)
      toast({
        title: 'Error',
        description: 'Failed to load package details',
        variant: 'destructive'
      })
    } finally {
      setLoading(false)
    }
  }

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target
    setFormData(prev => ({
      ...prev,
      [name]: value
    }))
  }

  const handleBooking = async () => {
    if (!formData.weddingDate || !formData.guestCount || !formData.contactName || !formData.contactEmail) {
      toast({
        title: 'Missing Information',
        description: 'Please fill in all required fields',
        variant: 'destructive'
      })
      return
    }

    setBooking(true)
    try {
      // Simulate booking process
      await new Promise(resolve => setTimeout(resolve, 2000))
      
      toast({
        title: 'Booking Successful!',
        description: 'Your wedding package booking has been confirmed. You will receive a confirmation email shortly.'
      })
      
      // Redirect to success page or dashboard
      router.push('/dashboard/user')
    } catch (error) {
      toast({
        title: 'Booking Failed',
        description: 'There was an error processing your booking. Please try again.',
        variant: 'destructive'
      })
    } finally {
      setBooking(false)
    }
  }

  if (loading) {
    return (
      <>
        <Header />
        <main className="min-h-screen bg-gray-50 dark:bg-gray-900">
          <div className="container mx-auto px-4 py-8">
            <div className="text-center">
              <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-pink-500 mx-auto"></div>
              <p className="mt-4 text-gray-600">Loading package details...</p>
            </div>
          </div>
        </main>
        <Footer />
      </>
    )
  }

  if (!package) {
    return (
      <>
        <Header />
        <main className="min-h-screen bg-gray-50 dark:bg-gray-900">
          <div className="container mx-auto px-4 py-8">
            <div className="text-center">
              <h1 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">Package Not Found</h1>
              <p className="text-gray-600 dark:text-gray-300 mb-8">The package you're looking for doesn't exist.</p>
              <Button onClick={() => router.push('/packages')}>
                <ArrowLeft className="h-4 w-4 mr-2" />
                Back to Packages
              </Button>
            </div>
          </div>
        </main>
        <Footer />
      </>
    )
  }

  const savings = package.originalPrice - package.price
  const savingsPercentage = Math.round((savings / package.originalPrice) * 100)

  return (
    <>
      <Header />
      <main className="min-h-screen bg-gray-50 dark:bg-gray-900">
        <div className="container mx-auto px-4 py-8">
          {/* Back Button */}
          <Button 
            variant="outline" 
            onClick={() => router.back()}
            className="mb-6"
          >
            <ArrowLeft className="h-4 w-4 mr-2" />
            Back
          </Button>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Booking Form */}
            <div className="lg:col-span-2">
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6 }}
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
                          <div className="relative">
                            <Calendar className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                            <Input
                              id="weddingDate"
                              name="weddingDate"
                              type="date"
                              value={formData.weddingDate}
                              onChange={handleInputChange}
                              className="pl-10"
                              required
                            />
                          </div>
                        </div>
                        
                        <div>
                          <Label htmlFor="guestCount">Number of Guests *</Label>
                          <div className="relative">
                            <Users className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                            <Input
                              id="guestCount"
                              name="guestCount"
                              type="number"
                              placeholder="150"
                              value={formData.guestCount}
                              onChange={handleInputChange}
                              className="pl-10"
                              required
                            />
                          </div>
                        </div>
                      </div>

                      <div>
                        <Label htmlFor="location">Wedding Location</Label>
                        <div className="relative">
                          <MapPin className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                          <Input
                            id="location"
                            name="location"
                            placeholder="Colombo, Western Province"
                            value={formData.location}
                            onChange={handleInputChange}
                            className="pl-10"
                          />
                        </div>
                      </div>

                      <div>
                        <Label htmlFor="specialRequests">Special Requests</Label>
                        <Textarea
                          id="specialRequests"
                          name="specialRequests"
                          placeholder="Any special requirements or requests for your wedding..."
                          value={formData.specialRequests}
                          onChange={handleInputChange}
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
                            placeholder="John Doe"
                            value={formData.contactName}
                            onChange={handleInputChange}
                            required
                          />
                        </div>
                        
                        <div>
                          <Label htmlFor="contactEmail">Email Address *</Label>
                          <Input
                            id="contactEmail"
                            name="contactEmail"
                            type="email"
                            placeholder="john@example.com"
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
                          placeholder="+94 77 123 4567"
                          value={formData.contactPhone}
                          onChange={handleInputChange}
                        />
                      </div>
                    </div>

                    {/* Booking Button */}
                    <div className="pt-6">
                      <Button 
                        className="w-full bg-gradient-to-r from-pink-500 to-purple-600 hover:from-pink-600 hover:to-purple-700"
                        size="lg"
                        onClick={handleBooking}
                        disabled={booking}
                      >
                        {booking ? (
                          <>
                            <Clock className="h-4 w-4 mr-2 animate-spin" />
                            Processing Booking...
                          </>
                        ) : (
                          <>
                            <CreditCard className="h-4 w-4 mr-2" />
                            Book Package - LKR {package.price.toLocaleString()}
                          </>
                        )}
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              </motion.div>
            </div>

            {/* Package Summary */}
            <div className="lg:col-span-1">
              <motion.div
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.6, delay: 0.3 }}
                className="sticky top-4 space-y-6"
              >
                {/* Package Info */}
                <Card>
                  <CardHeader>
                    <CardTitle className="text-lg">Package Summary</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div>
                      <h4 className="font-semibold">{package.name}</h4>
                      <p className="text-sm text-gray-600 dark:text-gray-300">{package.description}</p>
                    </div>

                    <div className="flex items-center space-x-2">
                      <Star className="h-4 w-4 text-yellow-400 fill-current" />
                      <span className="text-sm">{package.rating.average} ({package.rating.count} reviews)</span>
                    </div>

                    <div className="border-t pt-4">
                      <div className="flex items-baseline space-x-2">
                        <span className="text-2xl font-bold text-green-600">LKR {package.price.toLocaleString()}</span>
                        <span className="text-lg text-gray-500 line-through">LKR {package.originalPrice.toLocaleString()}</span>
                      </div>
                      <Badge variant="secondary" className="bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200 mt-2">
                        Save {savingsPercentage}%
                      </Badge>
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
                      {package.features.slice(0, 6).map((feature, index) => (
                        <div key={index} className="flex items-start space-x-2">
                          <Check className="h-4 w-4 text-green-500 mt-0.5 flex-shrink-0" />
                          <span className="text-sm">{feature}</span>
                        </div>
                      ))}
                      {package.features.length > 6 && (
                        <div className="text-sm text-purple-600 dark:text-purple-400 font-medium">
                          +{package.features.length - 6} more features
                        </div>
                      )}
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
                      <div className="flex items-center space-x-2">
                        <Check className="h-4 w-4 text-green-500" />
                        <span>Free consultation included</span>
                      </div>
                      <div className="flex items-center space-x-2">
                        <Check className="h-4 w-4 text-green-500" />
                        <span>30-day money-back guarantee</span>
                      </div>
                      <div className="flex items-center space-x-2">
                        <Check className="h-4 w-4 text-green-500" />
                        <span>Professional wedding coordinator</span>
                      </div>
                      <div className="flex items-center space-x-2">
                        <Check className="h-4 w-4 text-green-500" />
                        <span>24/7 customer support</span>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </motion.div>
            </div>
          </div>
        </div>
      </main>
      <Footer />
    </>
  )
}
