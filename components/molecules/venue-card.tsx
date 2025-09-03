"use client"

import { motion } from "framer-motion"
import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import Image from "next/image"
import { Star, MapPin, Users, Heart } from "lucide-react"
import Link from "next/link"

interface VenueCardProps {
  id: number
  name: string
  location: string
  capacity: number
  price: number
  rating: number
  image: string
  amenities: string[]
  className?: string
}

export function VenueCard({
  id,
  name,
  location,
  capacity,
  price,
  rating,
  image,
  amenities,
  className = "",
}: VenueCardProps) {
  return (
    <motion.div whileHover={{ y: -5 }} transition={{ duration: 0.2 }} className={`cursor-pointer ${className}`}>
      <Link href={`/venues/${id}`}>
        <Card className="h-full border-0 bg-white dark:bg-gray-800 shadow-lg hover:shadow-xl transition-shadow duration-300 overflow-hidden">
          <div className="relative h-48">
            <Image src={image || "/placeholder.svg"} alt={name} fill className="object-cover" />
            <div className="absolute top-4 right-4">
              <motion.button
                onClick={(e) => e.stopPropagation()}
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.9 }}
                className="w-8 h-8 bg-white/90 rounded-full flex items-center justify-center shadow-md"
              >
                <Heart className="h-4 w-4 text-gray-600" />
              </motion.button>
            </div>
            <div className="absolute bottom-4 left-4">
              <div className="flex items-center space-x-1 bg-white/90 rounded-full px-2 py-1">
                <Star className="h-3 w-3 text-yellow-400 fill-current" />
                <span className="text-xs font-medium">{rating}</span>
              </div>
            </div>
          </div>

          <CardContent className="p-4 space-y-3">
            <div>
              <h3 className="font-semibold text-gray-900 dark:text-white mb-1">{name}</h3>
              <div className="flex items-center text-sm text-gray-600 dark:text-gray-300">
                <MapPin className="h-3 w-3 mr-1" />
                {location}
              </div>
            </div>

            <div className="flex items-center justify-between text-sm">
              <div className="flex items-center text-gray-600 dark:text-gray-300">
                <Users className="h-3 w-3 mr-1" />
                Up to {capacity} guests
              </div>
              <div className="font-semibold text-gray-900 dark:text-white">LKR {price.toLocaleString()}</div>
            </div>

            <div className="flex flex-wrap gap-1">
              {amenities.slice(0, 3).map((amenity) => (
                <Badge key={amenity} variant="secondary" className="text-xs">
                  {amenity}
                </Badge>
              ))}
              {amenities.length > 3 && (
                <Badge variant="outline" className="text-xs">
                  +{amenities.length - 3} more
                </Badge>
              )}
            </div>
          </CardContent>
        </Card>
      </Link>
    </motion.div>
  )
}


export default VenueCard
