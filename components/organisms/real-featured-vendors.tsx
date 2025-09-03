"use client"

import { useState, useEffect } from 'react'
import Link from 'next/link'
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Star, MapPin, Phone, Mail } from 'lucide-react'

interface FeaturedVendor {
  _id: string
  businessName: string
  name: string
  description: string
  category: string
  location: {
    city: string
    province: string
  }
  contact: {
    phone: string
    email: string
  }
  reviewStats: {
    averageRating: number
    count: number
  }
  isVerified: boolean
  isActive: boolean
  featured: boolean
}

export default function RealFeaturedVendors() {
  const [vendors, setVendors] = useState<FeaturedVendor[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetchFeaturedVendors()
  }, [])

  const fetchFeaturedVendors = async () => {
    try {
      const response = await fetch('/api/home/featured-vendors')
      if (response.ok) {
        const data = await response.json()
        setVendors(data.vendors)
      }
    } catch (error) {
      console.error('Failed to fetch featured vendors:', error)
    } finally {
      setLoading(false)
    }
  }

  if (loading) {
    return (
      <section className="py-16 bg-white">
        <div className="container mx-auto px-4">
          <div className="text-center">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto"></div>
            <p className="mt-4 text-gray-600">Loading featured vendors...</p>
          </div>
        </div>
      </section>
    )
  }

  if (!vendors || vendors.length === 0) {
    return (
      <section className="py-16 bg-white">
        <div className="container mx-auto px-4">
          <div className="text-center text-gray-600">
            <p>No featured vendors available at the moment</p>
          </div>
        </div>
      </section>
    )
  }

  return (
    <section className="py-16 bg-white">
      <div className="container mx-auto px-4">
        <div className="text-center mb-12">
          <h2 className="text-3xl font-bold text-gray-900 mb-4">
            Featured Wedding Vendors
          </h2>
          <p className="text-lg text-gray-600 max-w-2xl mx-auto">
            Discover top-rated, verified vendors who will make your wedding day truly special
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {vendors.map((vendor) => (
            <Card key={vendor._id} className="hover:shadow-lg transition-shadow duration-300">
              <CardHeader className="pb-4">
                <div className="flex items-start justify-between">
                  <div>
                    <CardTitle className="text-lg font-semibold text-gray-900 mb-1">
                      {vendor.businessName}
                    </CardTitle>
                    <CardDescription className="text-sm text-gray-600">
                      {vendor.name} • {vendor.category}
                    </CardDescription>
                  </div>
                  {vendor.isVerified && (
                    <Badge variant="default" className="text-xs">
                      Verified
                    </Badge>
                  )}
                </div>
              </CardHeader>

              <CardContent className="space-y-4">
                <p className="text-gray-700 text-sm line-clamp-3">
                  {vendor.description}
                </p>

                <div className="flex items-center space-x-2">
                  <Star className="h-4 w-4 text-yellow-500 fill-current" />
                  <span className="text-sm font-medium text-gray-900">
                    {vendor.reviewStats.averageRating}
                  </span>
                  <span className="text-sm text-gray-500">
                    ({vendor.reviewStats.count} reviews)
                  </span>
                </div>

                <div className="flex items-center space-x-2 text-sm text-gray-600">
                  <MapPin className="h-4 w-4" />
                  <span>{vendor.location.city}, {vendor.location.province}</span>
                </div>

                <div className="flex items-center space-x-4 text-sm text-gray-600">
                  <div className="flex items-center space-x-1">
                    <Phone className="h-4 w-4" />
                    <span>{vendor.contact.phone}</span>
                  </div>
                  <div className="flex items-center space-x-1">
                    <Mail className="h-4 w-4" />
                    <span>{vendor.contact.email}</span>
                  </div>
                </div>

                <div className="pt-4">
                  <Link href={`/vendors/${vendor._id}`}>
                    <Button className="w-full" variant="default">
                      View Profile
                    </Button>
                  </Link>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        <div className="text-center mt-12">
          <Link href="/vendors">
            <Button variant="outline" size="lg">
              View All Vendors
            </Button>
          </Link>
        </div>
      </div>
    </section>
  )
} 