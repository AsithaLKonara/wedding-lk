"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Users, Car, Wifi, Music, Utensils } from "lucide-react"

interface VenueDetailsProps {
  venue: {
    name: string
    description: string
    amenities: string[]
    capacity: number
    location: string
  }
}

export function VenueDetails({ venue }: VenueDetailsProps) {
  const getAmenityIcon = (amenity: string) => {
    switch (amenity.toLowerCase()) {
      case "parking":
        return Car
      case "wifi":
        return Wifi
      case "sound system":
        return Music
      case "catering":
        return Utensils
      default:
        return Users
    }
  }

  return (
    <div className="space-y-6">
      {/* Description */}
      <Card>
        <CardHeader>
          <CardTitle>About {venue.name}</CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-gray-600 dark:text-gray-300 leading-relaxed">{venue.description}</p>
        </CardContent>
      </Card>

      {/* Amenities */}
      <Card>
        <CardHeader>
          <CardTitle>Amenities & Features</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
            {venue.amenities.map((amenity, index) => {
              const IconComponent = getAmenityIcon(amenity)
              return (
                <div key={index} className="flex items-center space-x-3 p-3 bg-gray-50 dark:bg-gray-700 rounded-lg">
                  <IconComponent className="h-5 w-5 text-purple-500" />
                  <span className="text-sm font-medium text-gray-900 dark:text-white">{amenity}</span>
                </div>
              )
            })}
          </div>
        </CardContent>
      </Card>

      {/* Venue Specifications */}
      <Card>
        <CardHeader>
          <CardTitle>Venue Specifications</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="flex items-center justify-between p-3 bg-gray-50 dark:bg-gray-700 rounded-lg">
              <span className="text-sm font-medium text-gray-600 dark:text-gray-400">Maximum Capacity</span>
              <Badge variant="secondary">{venue.capacity} guests</Badge>
            </div>
            <div className="flex items-center justify-between p-3 bg-gray-50 dark:bg-gray-700 rounded-lg">
              <span className="text-sm font-medium text-gray-600 dark:text-gray-400">Location</span>
              <Badge variant="secondary">{venue.location}</Badge>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
