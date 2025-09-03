"use client"

import React, { useState, useEffect } from "react"
import { useParams } from "next/navigation"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Skeleton } from "@/components/ui/skeleton"
import { useToast } from "@/hooks/use-toast"
import { MapPin, Star, Phone, Mail, Globe, Clock, DollarSign, Award, Users } from "lucide-react"
import { VendorProfile } from "@/components/organisms/vendor-profile"
import { VendorPortfolio } from "@/components/organisms/vendor-portfolio"
import { VendorReviews } from "@/components/organisms/vendor-reviews"
import { VendorContact } from "@/components/organisms/vendor-contact"

interface Vendor {
  _id: string
  name: string
  businessName: string
  category: string
  description: string
  location: {
    address: string
    city: string
    province: string
    coordinates?: {
      lat: number
      lng: number
    }
  }
  contact: {
    phone: string
    email: string
    website?: string
  }
  services: Array<{
    name: string
    description: string
    price: number
  }>
  portfolio: string[]
  pricing: {
    startingPrice: number
    currency: string
    packages?: Array<{
      name: string
      description: string
      price: number
      includes: string[]
    }>
  }
  rating: {
    average: number
    count: number
  }
  reviews: Array<{
    _id: string
    user: {
      firstName: string
      lastName: string
    }
    rating: number
    comment: string
    createdAt: string
  }>
  owner: {
    firstName: string
    lastName: string
    email: string
    phone: string
  }
  experience: number
  awards: string[]
  availability: {
    isAvailable: boolean
    nextAvailableDate?: string
  }
  createdAt: string
}

export default function VendorDetailPage() {
  const params = useParams()
  const vendorId = params.id as string
  const [vendor, setVendor] = useState<Vendor | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const { toast } = useToast()

  useEffect(() => {
    loadVendor()
  }, [vendorId])

  const loadVendor = async () => {
    try {
      setIsLoading(true)
      setError(null)

      const response = await fetch(`/api/vendors?vendorId=${vendorId}`)
      const data = await response.json()

      if (data.success) {
        setVendor(data.vendor)
      } else {
        setError(data.error || 'Failed to load vendor')
        toast({
          title: "Error",
          description: data.error || 'Failed to load vendor',
          variant: "destructive",
        })
      }
    } catch (error) {
      console.error('Error loading vendor:', error)
      setError('Failed to load vendor')
      toast({
        title: "Error",
        description: 'Failed to load vendor',
        variant: "destructive",
      })
    } finally {
      setIsLoading(false)
    }
  }

  const formatPrice = (price: number, currency: string) => {
    return new Intl.NumberFormat('en-LK', {
      style: 'currency',
      currency: currency || 'LKR',
      minimumFractionDigits: 0,
    }).format(price)
  }

  const getCategoryColor = (category: string) => {
    const colors: { [key: string]: string } = {
      photographer: 'bg-blue-100 text-blue-800',
      caterer: 'bg-green-100 text-green-800',
      decorator: 'bg-purple-100 text-purple-800',
      music: 'bg-yellow-100 text-yellow-800',
      transport: 'bg-red-100 text-red-800',
      makeup: 'bg-pink-100 text-pink-800',
      jewelry: 'bg-orange-100 text-orange-800',
      clothing: 'bg-indigo-100 text-indigo-800',
    }
    return colors[category.toLowerCase()] || 'bg-gray-100 text-gray-800'
  }

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-50">
        <div className="container mx-auto px-4 py-8">
          <div className="space-y-8">
            {/* Hero Skeleton */}
            <div className="relative h-96 bg-gray-200 rounded-lg">
              <Skeleton className="h-full w-full" />
            </div>

            {/* Content Skeleton */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
              <div className="lg:col-span-2 space-y-6">
                <Card>
                  <CardHeader>
                    <Skeleton className="h-8 w-3/4" />
                    <Skeleton className="h-4 w-1/2" />
                  </CardHeader>
                  <CardContent>
                    <Skeleton className="h-4 w-full mb-2" />
                    <Skeleton className="h-4 w-full mb-2" />
                    <Skeleton className="h-4 w-2/3" />
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader>
                    <Skeleton className="h-6 w-1/3" />
                  </CardHeader>
                  <CardContent>
                    <div className="grid grid-cols-2 gap-4">
                      {Array.from({ length: 6 }).map((_, index) => (
                        <Skeleton key={index} className="h-4 w-full" />
                      ))}
                    </div>
                  </CardContent>
                </Card>
              </div>

              <div className="space-y-6">
                <Card>
                  <CardHeader>
                    <Skeleton className="h-6 w-1/2" />
                  </CardHeader>
                  <CardContent>
                    <Skeleton className="h-12 w-full mb-4" />
                    <Skeleton className="h-4 w-full mb-2" />
                    <Skeleton className="h-4 w-2/3" />
                  </CardContent>
                </Card>
              </div>
            </div>
          </div>
        </div>
      </div>
    )
  }

  if (error || !vendor) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-gray-900 mb-4">Vendor Not Found</h1>
          <p className="text-gray-600 mb-6">{error || 'The vendor you are looking for does not exist.'}</p>
          <Button onClick={() => window.history.back()} variant="outline">
            Go Back
          </Button>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Hero Section */}
      <div className="relative h-96 bg-gradient-to-r from-purple-600 to-pink-600">
        <div className="absolute inset-0 bg-black/40"></div>
        <div className="relative h-full flex items-center">
          <div className="container mx-auto px-4">
            <div className="max-w-4xl">
              <Badge className={`mb-4 ${getCategoryColor(vendor.category)}`}>
                {vendor.category}
              </Badge>
              <h1 className="text-4xl md:text-5xl font-bold text-white mb-4">
                {vendor.businessName}
              </h1>
              <p className="text-xl text-white/90 mb-6 max-w-2xl">
                {vendor.description}
              </p>
              <div className="flex items-center space-x-6 text-white">
                <div className="flex items-center">
                  <MapPin className="h-5 w-5 mr-2" />
                  <span>{vendor.location.city}, {vendor.location.province}</span>
                </div>
                <div className="flex items-center">
                  <Star className="h-5 w-5 mr-2 text-yellow-400" />
                  <span>{vendor.rating.average.toFixed(1)} ({vendor.rating.count} reviews)</span>
                </div>
                <div className="flex items-center">
                  <Award className="h-5 w-5 mr-2" />
                  <span>{vendor.experience} years experience</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="container mx-auto px-4 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Main Content */}
          <div className="lg:col-span-2 space-y-8">
            {/* Vendor Profile */}
            <VendorProfile vendor={vendor} />

            {/* Portfolio */}
            <VendorPortfolio images={vendor.portfolio} vendorName={vendor.businessName} />

            {/* Services */}
            <Card>
              <CardHeader>
                <CardTitle>Services & Pricing</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {vendor.services.map((service, index) => (
                    <div key={index} className="border rounded-lg p-4">
                      <div className="flex items-center justify-between mb-2">
                        <h3 className="font-semibold">{service.name}</h3>
                        <span className="text-lg font-bold text-green-600">
                          {formatPrice(service.price, vendor.pricing.currency)}
                        </span>
                      </div>
                      <p className="text-gray-600 text-sm">{service.description}</p>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>

            {/* Reviews */}
            <VendorReviews 
              reviews={vendor.reviews} 
              rating={vendor.rating} 
              vendorId={vendor._id}
              vendorName={vendor.businessName}
            />
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            {/* Contact Card */}
            <VendorContact vendor={vendor} />

            {/* Quick Info */}
            <Card>
              <CardHeader>
                <CardTitle>Quick Info</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex items-center justify-between">
                  <span className="text-sm text-gray-600">Category</span>
                  <Badge className={getCategoryColor(vendor.category)}>
                    {vendor.category}
                  </Badge>
                </div>
                
                <div className="flex items-center justify-between">
                  <span className="text-sm text-gray-600">Starting Price</span>
                  <span className="font-semibold text-green-600">
                    {formatPrice(vendor.pricing.startingPrice, vendor.pricing.currency)}
                  </span>
                </div>

                <div className="flex items-center justify-between">
                  <span className="text-sm text-gray-600">Rating</span>
                  <div className="flex items-center">
                    <Star className="h-4 w-4 text-yellow-500 mr-1" />
                    <span className="font-semibold">{vendor.rating.average.toFixed(1)}</span>
                    <span className="text-sm text-gray-500 ml-1">({vendor.rating.count})</span>
                  </div>
                </div>

                <div className="flex items-center justify-between">
                  <span className="text-sm text-gray-600">Experience</span>
                  <span className="font-semibold">{vendor.experience} years</span>
                </div>

                <div className="flex items-center justify-between">
                  <span className="text-sm text-gray-600">Availability</span>
                  <Badge variant={vendor.availability.isAvailable ? "default" : "secondary"}>
                    {vendor.availability.isAvailable ? "Available" : "Busy"}
                  </Badge>
                </div>
              </CardContent>
            </Card>

            {/* Awards */}
            {vendor.awards.length > 0 && (
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center">
                    <Award className="h-5 w-5 mr-2" />
                    Awards & Recognition
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-2">
                    {vendor.awards.map((award, index) => (
                      <div key={index} className="flex items-center text-sm">
                        <Award className="h-4 w-4 text-yellow-500 mr-2" />
                        <span>{award}</span>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            )}

            {/* Contact Information */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center">
                  <Phone className="h-5 w-5 mr-2" />
                  Contact Information
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <p className="font-semibold">{vendor.owner.firstName} {vendor.owner.lastName}</p>
                  <p className="text-sm text-gray-600">Business Owner</p>
                </div>
                
                <div className="space-y-2">
                  <div className="flex items-center text-sm">
                    <Phone className="h-4 w-4 mr-2 text-gray-500" />
                    <span>{vendor.contact.phone}</span>
                  </div>
                  <div className="flex items-center text-sm">
                    <Mail className="h-4 w-4 mr-2 text-gray-500" />
                    <span>{vendor.contact.email}</span>
                  </div>
                  {vendor.contact.website && (
                    <div className="flex items-center text-sm">
                      <Globe className="h-4 w-4 mr-2 text-gray-500" />
                      <span>{vendor.contact.website}</span>
                    </div>
                  )}
                </div>

                <Button className="w-full" variant="outline">
                  <Mail className="h-4 w-4 mr-2" />
                  Send Message
                </Button>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  )
}
