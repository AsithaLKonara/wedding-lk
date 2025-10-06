"use client"

import { useState, useEffect } from 'react'
import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Heart, MapPin, Users, Star, Calendar } from "lucide-react"

interface VenueCardProps {
  venue: {
    id: string | number
    name: string
    location: string
    price: number
    capacity: number
    rating: number
    image: string
    amenities: string[]
  }
  onViewDetails?: (venueId: string | number) => void
  onBookNow?: (venueId: string | number) => void
}

export function VenueCard({ venue, onViewDetails, onBookNow }: VenueCardProps) {
  const [isFavorited, setIsFavorited] = useState(false)
  const [loading, setLoading] = useState(false)

  // Check if venue is favorited
  useEffect(() => {
    const checkFavoriteStatus = async () => {
      try {
        const response = await fetch(`/api/favorites/check?venueId=${venue.id}`)
        if (response.ok) {
          const data = await response.json()
          setIsFavorited(data.isFavorited || false)
        }
      } catch (error) {
        console.error('Error checking favorite status:', error)
      }
    }

    checkFavoriteStatus()
  }, [venue.id])

  const handleToggleFavorite = async () => {
    try {
      setLoading(true)
      const response = await fetch('/api/favorites', {
        method: isFavorited ? 'DELETE' : 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          venueId: venue.id,
          type: 'venue'
        })
      })

      if (response.ok) {
        setIsFavorited(!isFavorited)
      }
    } catch (error) {
      console.error('Error toggling favorite:', error)
    } finally {
      setLoading(false)
    }
  }

  const handleViewDetails = () => {
    if (onViewDetails) {
      onViewDetails(venue.id)
    } else {
      window.location.href = `/venues/${venue.id}`
    }
  }

  const handleBookNow = () => {
    if (onBookNow) {
      onBookNow(venue.id)
    } else {
      window.location.href = `/venues/${venue.id}/book`
    }
  }

  return (
    <Card className="group hover:shadow-lg transition-all duration-300 overflow-hidden">
      <div className="relative">
        <img
          src={venue.image}
          alt={venue.name}
          className="w-full h-48 object-cover group-hover:scale-105 transition-transform duration-300"
        />
        <button
          onClick={handleToggleFavorite}
          disabled={loading}
          className="absolute top-3 right-3 p-2 bg-white/80 backdrop-blur-sm rounded-full hover:bg-white transition-colors disabled:opacity-50"
        >
          <Heart 
            className={`h-5 w-5 ${
              isFavorited ? 'fill-red-500 text-red-500' : 'text-gray-600'
            }`} 
          />
        </button>
        <div className="absolute bottom-3 left-3 bg-white/90 backdrop-blur-sm px-2 py-1 rounded-md">
          <div className="flex items-center gap-1">
            <Star className="h-4 w-4 text-yellow-500 fill-current" />
            <span className="text-sm font-medium">{venue.rating}</span>
          </div>
        </div>
      </div>

      <CardContent className="p-6">
        <div className="space-y-3">
          <div>
            <h3 className="font-semibold text-lg text-gray-900 dark:text-white line-clamp-1">
              {venue.name}
            </h3>
            <div className="flex items-center gap-1 text-gray-600 dark:text-gray-400">
              <MapPin className="h-4 w-4" />
              <span className="text-sm">{venue.location}</span>
            </div>
          </div>

          <div className="flex items-center justify-between">
            <div className="flex items-center gap-1 text-gray-600 dark:text-gray-400">
              <Users className="h-4 w-4" />
              <span className="text-sm">{venue.capacity} guests</span>
            </div>
            <div className="text-right">
              <p className="text-2xl font-bold text-blue-600">
                LKR {venue.price.toLocaleString()}
              </p>
              <p className="text-xs text-gray-500">per event</p>
            </div>
          </div>

          <div className="flex flex-wrap gap-1">
            {venue.amenities.slice(0, 3).map((amenity, index) => (
              <span
                key={index}
                className="px-2 py-1 bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 text-xs rounded-full"
              >
                {amenity}
              </span>
            ))}
            {venue.amenities.length > 3 && (
              <span className="px-2 py-1 bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 text-xs rounded-full">
                +{venue.amenities.length - 3}
              </span>
            )}
          </div>

          <div className="flex gap-2 pt-2">
            <Button 
              onClick={handleViewDetails}
              variant="outline" 
              className="flex-1"
            >
              View Details
            </Button>
            <Button 
              onClick={handleBookNow}
              className="flex-1 bg-gradient-to-r from-rose-500 to-pink-600 hover:from-rose-600 hover:to-pink-700"
            >
              Book Now
            </Button>
          </div>
        </div>
      </CardContent>
    </Card>
  )
}
