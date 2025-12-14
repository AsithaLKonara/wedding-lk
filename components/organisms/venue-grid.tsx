"use client"

import React, { useState, useEffect } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Skeleton } from "@/components/ui/skeleton"
import { useToast } from "@/hooks/use-toast"
import { MapPin, Users, Star, Calendar, Heart, Eye } from "lucide-react"
import Link from "next/link"

interface Venue {
  _id: string
  name: string
  description: string
  location: {
    address: string
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
  amenities: string[]
  images: string[]
  rating: {
    average: number
    count: number
  }
  featured: boolean
  isActive: boolean
}

interface VenueGridProps {
  limit?: number
  featured?: boolean
  location?: string
  className?: string
  filters?: {
    location: string
    priceRange: number[]
    capacity: string
    amenities: string[]
    rating: number
  }
  sortBy?: string
  onSortChange?: (value: string) => void
  viewMode?: string
  onViewModeChange?: (value: string) => void
}

export function VenueGrid({ limit = 6, featured = false, location, className = "" }: VenueGridProps) {
  const [venues, setVenues] = useState<Venue[]>([])
  const [favorites, setFavorites] = useState<string[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const { toast } = useToast()

  useEffect(() => {
    loadVenues()
    loadFavorites()
  }, [limit, featured, location])

  const loadVenues = async () => {
    try {
      setIsLoading(true)
      setError(null)

      // Build query parameters
      const params = new URLSearchParams({
        limit: limit.toString(),
        offset: '0',
      })

      if (featured) {
        params.append('featured', 'true')
      }

      if (location) {
        params.append('location', location)
      }

      const response = await fetch(`/api/venues?${params}`)
      const data = await response.json()

      if (data.success) {
        setVenues(data.venues)
      } else {
        setError(data.error || 'Failed to load venues')
        toast({
          title: "Error",
          description: data.error || 'Failed to load venues',
          variant: "destructive",
        })
      }
    } catch (error) {
      console.error('Error loading venues:', error)
      setError('Failed to load venues')
      toast({
        title: "Error",
        description: 'Failed to load venues',
        variant: "destructive",
      })
    } finally {
      setIsLoading(false)
    }
  }

  const loadFavorites = async () => {
    try {
      const response = await fetch('/api/favorites')
      const data = await response.json()
      
      if (data.success) {
        const venueIds = data.favorites.venues.map((venue: any) => venue._id || venue)
        setFavorites(venueIds)
      }
    } catch (error) {
      console.error('Error loading favorites:', error)
    }
  }

  const formatPrice = (price: number, currency: string) => {
    return new Intl.NumberFormat('en-LK', {
      style: 'currency',
      currency: currency || 'LKR',
      minimumFractionDigits: 0,
    }).format(price)
  }

  const handleFavorite = async (venueId: string) => {
    try {
      const isFavorited = favorites.includes(venueId)
      const method = isFavorited ? 'DELETE' : 'POST'
      
      const response = await fetch('/api/favorites', {
        method,
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          type: 'venue',
          itemId: venueId,
        }),
      })

      const data = await response.json()

      if (data.success) {
        if (isFavorited) {
          setFavorites(favorites.filter(id => id !== venueId))
          toast({
            title: "Removed from favorites",
            description: "Venue removed from your favorites list",
          })
        } else {
          setFavorites([...favorites, venueId])
          toast({
            title: "Added to favorites",
            description: "Venue added to your favorites list",
          })
        }
      } else {
        toast({
          title: "Error",
          description: data.error || 'Failed to update favorites',
          variant: "destructive",
        })
      }
    } catch (error) {
      console.error('Error updating favorites:', error)
      toast({
        title: "Error",
        description: 'Failed to update favorites',
        variant: "destructive",
      })
    }
  }

  if (isLoading) {
    return (
      <div className={`grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 ${className}`}>
        {Array.from({ length: limit }).map((_, index) => (
          <Card key={index} className="overflow-hidden">
            <Skeleton className="h-48 w-full" />
            <CardHeader className="p-4">
              <Skeleton className="h-6 w-3/4 mb-2" />
              <Skeleton className="h-4 w-1/2" />
            </CardHeader>
            <CardContent className="p-4 pt-0">
              <Skeleton className="h-4 w-full mb-2" />
              <Skeleton className="h-4 w-2/3" />
            </CardContent>
          </Card>
        ))}
      </div>
    )
  }

  if (error) {
    return (
      <div className={`text-center py-8 ${className}`}>
        <p className="text-red-500 mb-4">{error}</p>
        <Button onClick={loadVenues} variant="outline">
          Try Again
        </Button>
      </div>
    )
  }

  if (venues.length === 0) {
    return (
      <div className={`text-center py-8 ${className}`}>
        <p className="text-gray-500 mb-4">No venues found</p>
        <Button onClick={loadVenues} variant="outline">
          Refresh
        </Button>
      </div>
    )
  }

  return (
    <div className={`grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 ${className}`}>
      {venues.map((venue) => {
        const isFavorited = favorites.includes(venue._id)
        
        return (
          <Card key={venue._id} className="overflow-hidden hover:shadow-lg transition-shadow">
            <div className="relative">
              <img
                src={venue?.images?.[0] || '/placeholder.svg'}
                alt={venue?.name || 'Venue'}
                className="w-full h-48 object-cover"
              />
              {venue?.featured && (
                <Badge className="absolute top-2 left-2 bg-yellow-500 text-white">
                  Featured
                </Badge>
              )}
              <Button
                size="sm"
                variant="ghost"
                className={`absolute top-2 right-2 h-8 w-8 p-0 bg-white/80 hover:bg-white ${
                  isFavorited ? 'text-red-500' : 'text-gray-600'
                }`}
                onClick={() => handleFavorite(venue._id)}
              >
                <Heart className={`h-4 w-4 ${isFavorited ? 'fill-current' : ''}`} />
              </Button>
            </div>

            <CardHeader className="p-4">
              <div className="flex items-start justify-between">
                <div className="flex-1">
                  <CardTitle className="text-lg font-semibold mb-1 line-clamp-1">
                    {venue?.name || 'N/A'}
                  </CardTitle>
                  <div className="flex items-center text-sm text-gray-600 mb-2">
                    <MapPin className="h-4 w-4 mr-1" />
                    <span>{venue?.location?.city || 'N/A'}, {venue?.location?.province || 'N/A'}</span>
                  </div>
                </div>
              </div>

              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-4">
                  <div className="flex items-center text-sm text-gray-600">
                    <Users className="h-4 w-4 mr-1" />
                    <span>{venue?.capacity?.min || 0}-{venue?.capacity?.max || 0}</span>
                  </div>
                  <div className="flex items-center text-sm text-gray-600">
                    <Star className="h-4 w-4 mr-1 text-yellow-500" />
                    <span>{venue?.rating?.average?.toFixed(1) || '4.5'} ({venue?.rating?.count || 0})</span>
                  </div>
                </div>
              </div>
            </CardHeader>

            <CardContent className="p-4 pt-0">
              <div className="mb-4">
                <p className="text-sm text-gray-600 line-clamp-2 mb-2">
                  {venue?.description || 'No description available'}
                </p>
                <div className="flex flex-wrap gap-1">
                  {(venue?.amenities || []).slice(0, 3).map((amenity, index) => (
                    <Badge key={index} variant="secondary" className="text-xs">
                      {amenity}
                    </Badge>
                  ))}
                  {(venue?.amenities?.length || 0) > 3 && (
                    <Badge variant="secondary" className="text-xs">
                      +{(venue?.amenities?.length || 0) - 3} more
                    </Badge>
                  )}
                </div>
              </div>

              <div className="flex items-center justify-between">
                <div>
                  <p className="text-lg font-semibold text-green-600">
                    {formatPrice(venue?.pricing?.basePrice || 0, venue?.pricing?.currency || 'LKR')}
                  </p>
                  <p className="text-xs text-gray-500">Starting price</p>
                </div>
                <div className="flex space-x-2">
                  <Button
                    size="sm"
                    variant="outline"
                    asChild
                  >
                    <Link href={`/venues/${venue?._id || ''}`}>
                      <Eye className="h-4 w-4 mr-1" />
                      View
                    </Link>
                  </Button>
                  <Button
                    size="sm"
                    asChild
                  >
                    <Link href={`/venues/${venue?._id || ''}`}>
                      <Calendar className="h-4 w-4 mr-1" />
                      Book Now
                    </Link>
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
        )
      })}
    </div>
  )
}

export default VenueGrid
