"use client"

import { useParams } from "next/navigation"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Badge } from "@/components/ui/badge"
import { Calendar, Users, MapPin, ArrowLeft, Check } from "lucide-react"
import { useState } from "react"
import Link from "next/link"

const packages = {
  "1": {
    id: 1,
    title: "Complete Wedding Package - Beach Paradise",
    vendor: "Paradise Wedding Planners",
    location: "Bentota",
    price: 450000,
    originalPrice: 550000,
    capacity: "150 guests",
    features: [
      "Beachfront venue for 150 guests",
      "Full decoration with flowers and lighting",
      "Traditional Sri Lankan cuisine buffet",
      "Professional photography & videography",
      "Wedding cake and desserts",
      "Bridal makeup and hair styling",
      "Live music and DJ services",
      "Transportation for guests",
      "Wedding coordinator on the day"
    ]
  },
  "2": {
    id: 2,
    title: "Luxury Garden Wedding Package",
    vendor: "Royal Garden Events",
    location: "Kandy",
    price: 380000,
    originalPrice: 450000,
    capacity: "200 guests",
    features: [
      "Garden venue for 200 guests",
      "Traditional Kandyan decorations",
      "Multi-course Sri Lankan feast",
      "Professional photography package",
      "Traditional drummers and dancers",
      "Bridal bouquet and groom's boutonniere",
      "Wedding cake with traditional designs",
      "Guest accommodation arrangements",
      "Day-of wedding coordination"
    ]
  },
  "3": {
    id: 3,
    title: "Intimate Hill Country Wedding",
    vendor: "Misty Mountain Weddings",
    location: "Nuwara Eliya",
    price: 280000,
    originalPrice: 320000,
    capacity: "50 guests",
    features: [
      "Intimate venue for 50 guests",
      "Mountain view ceremony setup",
      "Local cuisine with tea service",
      "Professional photography",
      "Simple elegant decorations",
      "Bridal styling services",
      "Small wedding cake",
      "Guest transportation",
      "Personal wedding coordinator"
    ]
  }
}

export default function PackageBookPage() {
  const params = useParams()
  const packageId = params.id as string
  const packageData = packages[packageId as keyof typeof packages]
  const [isLoading, setIsLoading] = useState(false)
  const [formData, setFormData] = useState({
    weddingDate: '',
    guestCount: '',
    ceremonyTime: '',
    receptionTime: '',
    brideName: '',
    groomName: '',
    email: '',
    phone: '',
    specialRequests: ''
  })

  if (!packageData) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="max-w-4xl mx-auto text-center">
          <h1 className="text-4xl font-bold text-gray-900 dark:text-white mb-4">
            Package Not Found
          </h1>
          <p className="text-xl text-gray-600 dark:text-gray-400 mb-8">
            The wedding package you're looking for doesn't exist.
          </p>
          <Button asChild>
            <Link href="/packages">Browse All Packages</Link>
          </Button>
        </div>
      </div>
    )
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsLoading(true)
    
    try {
      // Simulate booking process
      await new Promise(resolve => setTimeout(resolve, 2000))
      
      // Here you would typically send the booking data to your API
      console.log('Booking data:', { packageId, ...formData })
      
      // Redirect to confirmation page
      window.location.href = `/packages/${packageId}/confirmation`
    } catch (error) {
      console.error('Booking error:', error)
    } finally {
      setIsLoading(false)
    }
  }

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target
    setFormData(prev => ({ ...prev, [name]: value }))
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="max-w-4xl mx-auto">
        {/* Back Button */}
        <div className="mb-8">
          <Link href={`/packages/${packageId}`}>
            <Button variant="outline">
              <ArrowLeft className="h-4 w-4 mr-2" />
              Back to Package
            </Button>
          </Link>
        </div>

        <div className="grid lg:grid-cols-3 gap-8">
          {/* Booking Form */}
          <div className="lg:col-span-2">
            <Card>
              <CardHeader>
                <CardTitle>Book Your Wedding Package</CardTitle>
              </CardHeader>
              <CardContent>
                <form onSubmit={handleSubmit} className="space-y-6">
                  {/* Wedding Details */}
                  <div className="space-y-4">
                    <h3 className="text-lg font-semibold">Wedding Details</h3>
                    
                    <div className="grid md:grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <Label htmlFor="weddingDate">Wedding Date</Label>
                        <Input
                          id="weddingDate"
                          name="weddingDate"
                          type="date"
                          value={formData.weddingDate}
                          onChange={handleInputChange}
                          required
                        />
                      </div>
                      
                      <div className="space-y-2">
                        <Label htmlFor="guestCount">Expected Guest Count</Label>
                        <Input
                          id="guestCount"
                          name="guestCount"
                          type="number"
                          placeholder="e.g., 150"
                          value={formData.guestCount}
                          onChange={handleInputChange}
                          required
                        />
                      </div>
                    </div>

                    <div className="grid md:grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <Label htmlFor="ceremonyTime">Ceremony Time</Label>
                        <Input
                          id="ceremonyTime"
                          name="ceremonyTime"
                          type="time"
                          value={formData.ceremonyTime}
                          onChange={handleInputChange}
                          required
                        />
                      </div>
                      
                      <div className="space-y-2">
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
                  </div>

                  {/* Couple Information */}
                  <div className="space-y-4">
                    <h3 className="text-lg font-semibold">Couple Information</h3>
                    
                    <div className="grid md:grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <Label htmlFor="brideName">Bride's Name</Label>
                        <Input
                          id="brideName"
                          name="brideName"
                          placeholder="Enter bride's full name"
                          value={formData.brideName}
                          onChange={handleInputChange}
                          required
                        />
                      </div>
                      
                      <div className="space-y-2">
                        <Label htmlFor="groomName">Groom's Name</Label>
                        <Input
                          id="groomName"
                          name="groomName"
                          placeholder="Enter groom's full name"
                          value={formData.groomName}
                          onChange={handleInputChange}
                          required
                        />
                      </div>
                    </div>

                    <div className="grid md:grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <Label htmlFor="email">Email Address</Label>
                        <Input
                          id="email"
                          name="email"
                          type="email"
                          placeholder="your@email.com"
                          value={formData.email}
                          onChange={handleInputChange}
                          required
                        />
                      </div>
                      
                      <div className="space-y-2">
                        <Label htmlFor="phone">Phone Number</Label>
                        <Input
                          id="phone"
                          name="phone"
                          type="tel"
                          placeholder="+94 77 123 4567"
                          value={formData.phone}
                          onChange={handleInputChange}
                          required
                        />
                      </div>
                    </div>
                  </div>

                  {/* Special Requests */}
                  <div className="space-y-2">
                    <Label htmlFor="specialRequests">Special Requests or Notes</Label>
                    <Textarea
                      id="specialRequests"
                      name="specialRequests"
                      placeholder="Any special dietary requirements, accessibility needs, or other requests..."
                      value={formData.specialRequests}
                      onChange={handleInputChange}
                      rows={4}
                    />
                  </div>

                  <Button 
                    type="submit" 
                    className="w-full" 
                    size="lg"
                    disabled={isLoading}
                  >
                    {isLoading ? "Processing Booking..." : "Book This Package"}
                  </Button>
                </form>
              </CardContent>
            </Card>
          </div>

          {/* Package Summary */}
          <div className="space-y-6">
            <Card className="sticky top-4">
              <CardHeader>
                <CardTitle>Package Summary</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <h4 className="font-semibold text-lg mb-2">{packageData.title}</h4>
                  <div className="flex items-center gap-2 text-sm text-gray-600 dark:text-gray-400 mb-2">
                    <MapPin className="h-4 w-4" />
                    {packageData.location}
                  </div>
                  <div className="flex items-center gap-2 text-sm text-gray-600 dark:text-gray-400">
                    <Users className="h-4 w-4" />
                    {packageData.capacity}
                  </div>
                </div>

                <div className="border-t pt-4">
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-lg font-semibold">Total Price</span>
                    <span className="text-2xl font-bold text-green-600">
                      LKR {packageData.price.toLocaleString()}
                    </span>
                  </div>
                  {packageData.originalPrice > packageData.price && (
                    <div className="flex items-center justify-between text-sm text-gray-500">
                      <span>Original Price</span>
                      <span className="line-through">
                        LKR {packageData.originalPrice.toLocaleString()}
                      </span>
                    </div>
                  )}
                </div>

                <div className="border-t pt-4">
                  <h5 className="font-semibold mb-3">What's Included</h5>
                  <div className="space-y-2">
                    {packageData.features.slice(0, 5).map((feature, index) => (
                      <div key={index} className="flex items-center gap-2 text-sm">
                        <Check className="h-4 w-4 text-green-500 flex-shrink-0" />
                        <span>{feature}</span>
                      </div>
                    ))}
                    {packageData.features.length > 5 && (
                      <p className="text-sm text-gray-500">
                        +{packageData.features.length - 5} more features
                      </p>
                    )}
                  </div>
                </div>

                <div className="bg-blue-50 dark:bg-blue-900/20 p-4 rounded-lg">
                  <h6 className="font-semibold text-blue-900 dark:text-blue-100 mb-2">
                    Booking Process
                  </h6>
                  <ol className="text-sm text-blue-800 dark:text-blue-200 space-y-1">
                    <li>1. Submit your booking request</li>
                    <li>2. Vendor will contact you within 24 hours</li>
                    <li>3. Confirm details and make payment</li>
                    <li>4. Receive booking confirmation</li>
                  </ol>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  )
}