"use client"

import { useState, useEffect } from 'react'
import Link from 'next/link'
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Star, MapPin, Users, DollarSign } from 'lucide-react'

interface FeaturedVenue {
  _id: string
  name: string
  description: string
  location: {
    city: string
    province: string
  }
  capacity: {
    min: number
    max: number
  }
  pricing: {
    basePrice: number
    currency: string
  }
  reviewStats?: {
    averageRating?: number
    count?: number
  }
  isVerified: boolean
  isActive: boolean
  featured: boolean
}

export default function RealFeaturedVenues() {
  const [venues, setVenues] = useState<FeaturedVenue[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetchFeaturedVenues()
  }, [])

  const fetchFeaturedVenues = async () => {
    try {
      const response = await fetch('/api/home/featured-venues')
      if (response.ok) {
        const data = await response.json()
        setVenues(data.venues)
      }
    } catch (error) {
      console.error('Failed to fetch featured venues:', error)
    } finally {
      setLoading(false)
    }
  }

  if (loading) {
    return (
      <section className="py-16 bg-gray-50">
        <div className="container mx-auto px-4">
          <div className="text-center">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-purple-600 mx-auto"></div>
            <p className="mt-4 text-gray-600">Loading featured venues...</p>
          </div>
        </div>
      </section>
    )
  }

  if (!venues || venues.length === 0) {
    return (
      <section className="py-16 bg-gray-50">
        <div className="container mx-auto px-4">
          <div className="text-center text-gray-600">
            <p>No featured venues available at the moment</p>
          </div>
        </div>
      </section>
    )
  }

  return (
    <section className="py-16 bg-gray-50">
      <div className="container mx-auto px-4">
        <div className="text-center mb-12">
          <h2 className="text-3xl font-bold text-gray-900 mb-4">
            Featured Wedding Venues
          </h2>
          <p className="text-lg text-gray-600 max-w-2xl mx-auto">
            Discover stunning venues that will provide the perfect backdrop for your special day
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {venues.map((venue) => (
            <Card key={venue._id} className="hover:shadow-lg transition-shadow duration-300">
              <CardHeader className="pb-4">
                <div className="flex items-start justify-between">
                  <div>
                    <CardTitle className="text-lg font-semibold text-gray-900 mb-1">
                      {venue.name}
                    </CardTitle>
                    <CardDescription className="text-sm text-gray-600">
                      {venue.location.city}, {venue.location.province}
                    </CardDescription>
                  </div>
                  {venue.isVerified && (
                    <Badge variant="default" className="text-xs">
                      Verified
                    </Badge>
                  )}
                </div>
              </CardHeader>

              <CardContent className="space-y-4">
                <p className="text-gray-700 text-sm line-clamp-3">
                  {venue.description}
                </p>

                <div className="flex items-center space-x-2">
                  <Star className="h-4 w-4 text-yellow-500 fill-current" />
                  <span className="text-sm font-medium text-gray-900">
                    {venue.reviewStats?.averageRating || 4.5}
                  </span>
                  <span className="text-sm text-gray-500">
                    ({venue.reviewStats?.count || 0} reviews)
                  </span>
                </div>

                <div className="grid grid-cols-2 gap-4 text-sm">
                  <div className="flex items-center space-x-2">
                    <Users className="h-4 w-4 text-blue-600" />
                    <span className="text-gray-700">
                      {venue.capacity.min}-{venue.capacity.max} guests
                    </span>
                  </div>
                  <div className="flex items-center space-x-2">
                    <DollarSign className="h-4 w-4 text-green-600" />
                    <span className="text-gray-700">
                      From {venue.pricing.currency} {venue.pricing.basePrice.toLocaleString()}
                    </span>
                  </div>
                </div>

                <div className="pt-4">
                  <Link href={`/venues/${venue._id}`}>
                    <Button className="w-full" variant="default">
                      View Venue
                    </Button>
                  </Link>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        <div className="text-center mt-12">
          <Link href="/venues">
            <Button variant="outline" size="lg">
              View All Venues
            </Button>
          </Link>
        </div>
      </div>
    </section>
  )
} 