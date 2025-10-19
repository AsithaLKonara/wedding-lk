"use client"

import { useParams } from "next/navigation"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Star, MapPin, Calendar, Users, Check, Heart, Share2, MessageCircle } from "lucide-react"
import { useState } from "react"

const packages = {
  "1": {
    id: 1,
    title: "Complete Wedding Package - Beach Paradise",
    vendor: "Paradise Wedding Planners",
    location: "Bentota",
    price: 450000,
    originalPrice: 550000,
    rating: 4.9,
    reviewCount: 127,
    description: "A comprehensive wedding package that includes everything you need for your perfect beach wedding. From venue decoration to catering and photography, we handle it all.",
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
    ],
    images: [
      "/placeholder.jpg",
      "/placeholder.jpg",
      "/placeholder.jpg"
    ],
    category: "Complete Package",
    duration: "Full Day",
    capacity: "150 guests",
    availableDates: ["2024-06-15", "2024-06-22", "2024-06-29", "2024-07-06"],
    vendorInfo: {
      name: "Paradise Wedding Planners",
      experience: "8+ years",
      location: "Bentota, Sri Lanka",
      rating: 4.9,
      reviewCount: 127,
      phone: "+94 77 123 4567",
      email: "info@paradiseweddings.lk"
    }
  },
  "2": {
    id: 2,
    title: "Luxury Garden Wedding Package",
    vendor: "Royal Garden Events",
    location: "Kandy",
    price: 380000,
    originalPrice: 450000,
    rating: 4.8,
    reviewCount: 89,
    description: "Experience the elegance of a garden wedding with our luxury package. Perfect for couples who want a romantic outdoor ceremony with traditional Sri Lankan touches.",
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
    ],
    images: [
      "/placeholder.jpg",
      "/placeholder.jpg",
      "/placeholder.jpg"
    ],
    category: "Luxury Package",
    duration: "Full Day",
    capacity: "200 guests",
    availableDates: ["2024-07-13", "2024-07-20", "2024-07-27", "2024-08-03"],
    vendorInfo: {
      name: "Royal Garden Events",
      experience: "12+ years",
      location: "Kandy, Sri Lanka",
      rating: 4.8,
      reviewCount: 89,
      phone: "+94 81 234 5678",
      email: "info@royalgardenevents.lk"
    }
  },
  "3": {
    id: 3,
    title: "Intimate Hill Country Wedding",
    vendor: "Misty Mountain Weddings",
    location: "Nuwara Eliya",
    price: 280000,
    originalPrice: 320000,
    rating: 4.7,
    reviewCount: 156,
    description: "A romantic intimate wedding package perfect for couples who want a cozy celebration in the beautiful hill country. Includes all essentials for a memorable day.",
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
    ],
    images: [
      "/placeholder.jpg",
      "/placeholder.jpg",
      "/placeholder.jpg"
    ],
    category: "Intimate Package",
    duration: "Half Day",
    capacity: "50 guests",
    availableDates: ["2024-08-10", "2024-08-17", "2024-08-24", "2024-08-31"],
    vendorInfo: {
      name: "Misty Mountain Weddings",
      experience: "5+ years",
      location: "Nuwara Eliya, Sri Lanka",
      rating: 4.7,
      reviewCount: 156,
      phone: "+94 52 345 6789",
      email: "info@mistymountainweddings.lk"
    }
  }
}

export default function PackagePage() {
  const params = useParams()
  const packageId = params.id as string
  const packageData = packages[packageId as keyof typeof packages]
  const [selectedImage, setSelectedImage] = useState(0)
  const [isFavorited, setIsFavorited] = useState(false)

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
            <a href="/packages">Browse All Packages</a>
          </Button>
        </div>
      </div>
    )
  }

  const discountPercentage = Math.round(((packageData.originalPrice - packageData.price) / packageData.originalPrice) * 100)

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="max-w-6xl mx-auto">
        {/* Package Header */}
        <div className="mb-8">
          <Badge variant="secondary" className="mb-4">{packageData.category}</Badge>
          <h1 className="text-4xl md:text-5xl font-bold text-gray-900 dark:text-white mb-4">
            {packageData.title}
          </h1>
          <div className="flex items-center gap-4 mb-6">
            <div className="flex items-center gap-1">
              <Star className="h-5 w-5 text-yellow-500 fill-current" />
              <span className="font-semibold">{packageData.rating}</span>
              <span className="text-gray-500">({packageData.reviewCount} reviews)</span>
            </div>
            <div className="flex items-center gap-1 text-gray-500">
              <MapPin className="h-4 w-4" />
              {packageData.location}
            </div>
            <div className="flex items-center gap-1 text-gray-500">
              <Users className="h-4 w-4" />
              Up to {packageData.capacity}
            </div>
          </div>
        </div>

        <div className="grid lg:grid-cols-3 gap-8">
          {/* Main Content */}
          <div className="lg:col-span-2 space-y-8">
            {/* Images */}
            <Card>
              <CardContent className="p-0">
                <div className="relative">
                  <img
                    src={packageData.images[selectedImage]}
                    alt={packageData.title}
                    className="w-full h-64 md:h-96 object-cover rounded-t-lg"
                  />
                  {discountPercentage > 0 && (
                    <Badge className="absolute top-4 left-4 bg-red-500">
                      {discountPercentage}% OFF
                    </Badge>
                  )}
                </div>
                <div className="p-4">
                  <div className="flex gap-2">
                    {packageData.images.map((image, index) => (
                      <button
                        key={index}
                        onClick={() => setSelectedImage(index)}
                        className={`w-16 h-16 rounded-md overflow-hidden border-2 ${
                          selectedImage === index ? 'border-blue-500' : 'border-gray-200'
                        }`}
                      >
                        <img src={image} alt={`View ${index + 1}`} className="w-full h-full object-cover" />
                      </button>
                    ))}
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Description */}
            <Card>
              <CardHeader>
                <CardTitle>Package Description</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-gray-700 dark:text-gray-300 leading-relaxed">
                  {packageData.description}
                </p>
              </CardContent>
            </Card>

            {/* Features */}
            <Card>
              <CardHeader>
                <CardTitle>What's Included</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid gap-3">
                  {packageData.features.map((feature, index) => (
                    <div key={index} className="flex items-center gap-3">
                      <Check className="h-5 w-5 text-green-500 flex-shrink-0" />
                      <span className="text-gray-700 dark:text-gray-300">{feature}</span>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>

            {/* Vendor Information */}
            <Card>
              <CardHeader>
                <CardTitle>Vendor Information</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <div>
                      <h4 className="font-semibold text-lg">{packageData.vendorInfo.name}</h4>
                      <p className="text-gray-600 dark:text-gray-400">{packageData.vendorInfo.experience} experience</p>
                    </div>
                    <div className="text-right">
                      <div className="flex items-center gap-1">
                        <Star className="h-4 w-4 text-yellow-500 fill-current" />
                        <span className="font-semibold">{packageData.vendorInfo.rating}</span>
                      </div>
                      <p className="text-sm text-gray-500">{packageData.vendorInfo.reviewCount} reviews</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-2 text-gray-600 dark:text-gray-400">
                    <MapPin className="h-4 w-4" />
                    {packageData.vendorInfo.location}
                  </div>
                  <div className="flex items-center gap-2 text-gray-600 dark:text-gray-400">
                    <MessageCircle className="h-4 w-4" />
                    {packageData.vendorInfo.email}
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            {/* Pricing */}
            <Card className="sticky top-4">
              <CardHeader>
                <CardTitle>Package Details</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <div className="flex items-center gap-2 mb-2">
                    <span className="text-3xl font-bold text-gray-900 dark:text-white">
                      LKR {packageData.price.toLocaleString()}
                    </span>
                    {packageData.originalPrice > packageData.price && (
                      <span className="text-lg text-gray-500 line-through">
                        LKR {packageData.originalPrice.toLocaleString()}
                      </span>
                    )}
                  </div>
                  <p className="text-sm text-gray-600 dark:text-gray-400">
                    Duration: {packageData.duration}
                  </p>
                </div>

                <div className="space-y-3">
                  <Button 
                    className="w-full" 
                    size="lg"
                    onClick={() => window.location.href = `/packages/${packageData.id}/book`}
                  >
                    <Calendar className="h-4 w-4 mr-2" />
                    Book This Package
                  </Button>
                  
                  <div className="flex gap-2">
                    <Button 
                      variant="outline" 
                      className="flex-1"
                      onClick={() => setIsFavorited(!isFavorited)}
                    >
                      <Heart className={`h-4 w-4 mr-2 ${isFavorited ? 'fill-red-500 text-red-500' : ''}`} />
                      {isFavorited ? 'Saved' : 'Save'}
                    </Button>
                    <Button variant="outline" className="flex-1">
                      <Share2 className="h-4 w-4 mr-2" />
                      Share
                    </Button>
                  </div>
                </div>

                <div className="pt-4 border-t">
                  <h4 className="font-semibold mb-2">Available Dates</h4>
                  <div className="grid grid-cols-2 gap-2 text-sm">
                    {packageData.availableDates.slice(0, 4).map((date, index) => (
                      <div key={index} className="p-2 bg-gray-50 dark:bg-gray-800 rounded text-center">
                        {new Date(date).toLocaleDateString()}
                      </div>
                    ))}
                  </div>
                  <p className="text-xs text-gray-500 mt-2">
                    Contact vendor for more available dates
                  </p>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  )
}