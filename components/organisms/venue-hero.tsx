"use client"

import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Star, MapPin, Users, Heart, Share2, Phone } from "lucide-react"
import Image from "next/image"

interface VenueHeroProps {
  venue: {
    id: string
    name: string
    location: string
    capacity: number
    price: number
    rating: number
    reviewCount: number
    images: string[]
    amenities: string[]
    description: string
    contact: {
      phone: string
      email: string
      website: string
    }
  }
}

export function VenueHero({ venue }: VenueHeroProps) {
  return (
    <div className="relative">
      {/* Hero Image */}
      <div className="relative h-96 md:h-[500px]">
        <Image
          src={venue.images[0] || "/placeholder.svg?height=500&width=1200"}
          alt={venue.name}
          fill
          className="object-cover"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent" />

        {/* Floating Action Buttons */}
        <div className="absolute top-4 right-4 flex space-x-2">
          <Button size="sm" variant="secondary" className="bg-white/90 hover:bg-white">
            <Heart className="h-4 w-4" />
          </Button>
          <Button size="sm" variant="secondary" className="bg-white/90 hover:bg-white">
            <Share2 className="h-4 w-4" />
          </Button>
        </div>

        {/* Venue Info Overlay */}
        <div className="absolute bottom-0 left-0 right-0 p-6 text-white">
          <div className="flex items-center space-x-2 mb-2">
            <Badge className="bg-green-500 text-white">Available</Badge>
            <div className="flex items-center">
              <Star className="h-4 w-4 text-yellow-400 fill-current mr-1" />
              <span className="font-medium">{venue.rating}</span>
              <span className="text-white/80 ml-1">({venue.reviewCount} reviews)</span>
            </div>
          </div>

          <h1 className="text-3xl md:text-4xl font-bold mb-2">{venue.name}</h1>

          <div className="flex items-center space-x-4 text-white/90">
            <div className="flex items-center">
              <MapPin className="h-4 w-4 mr-1" />
              {venue.location}
            </div>
            <div className="flex items-center">
              <Users className="h-4 w-4 mr-1" />
              Up to {venue.capacity} guests
            </div>
          </div>
        </div>
      </div>

      {/* Quick Actions Bar */}
      <div className="bg-white dark:bg-gray-800 border-b px-6 py-4">
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center space-y-4 md:space-y-0">
          <div>
            <div className="text-2xl font-bold text-gray-900 dark:text-white">LKR {venue.price.toLocaleString()}</div>
            <div className="text-sm text-gray-600 dark:text-gray-400">Starting price per event</div>
          </div>

          <div className="flex space-x-3">
            <Button variant="outline">
              <Phone className="h-4 w-4 mr-2" />
              Call Now
            </Button>
            <Button className="bg-gradient-to-r from-pink-500 to-purple-600">Check Availability</Button>
          </div>
        </div>
      </div>
    </div>
  )
}
