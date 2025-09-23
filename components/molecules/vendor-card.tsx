"use client"

import { motion } from "framer-motion"
import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import Image from "next/image"
import { Star, MapPin, Heart, MessageCircle } from "lucide-react"
import Link from "next/link"

interface VendorCardProps {
  id: number
  name: string
  category: string
  location: string
  rating: number
  price: number
  image: string
  portfolio: string[]
  className?: string
}

export function VendorCard({
  id,
  name,
  category,
  location,
  rating,
  price,
  image,
  portfolio,
  className = "",
}: VendorCardProps) {
  return (
    <motion.div whileHover={{ y: -5 }} transition={{ duration: 0.2 }} className={`cursor-pointer ${className}`}>
      <Link href={`/vendors/${id}`} className="cursor-pointer">
        <Card className="h-full border-0 bg-white dark:bg-gray-800 shadow-lg hover:shadow-xl transition-shadow duration-300 overflow-hidden">
          <div className="relative h-48">
            <Image src={image || "/placeholder.svg"} alt={name} fill className="object-cover" />
            <div className="absolute top-4 right-4">
              <motion.button
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.9 }}
                className="w-8 h-8 bg-white/90 rounded-full flex items-center justify-center shadow-md"
              >
                <Heart className="h-4 w-4 text-gray-600" />
              </motion.button>
            </div>
            <div className="absolute bottom-4 left-4">
              <Badge variant="secondary" className="bg-white/90">
                {category}
              </Badge>
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

            <div className="flex items-center justify-between">
              <div className="flex items-center">
                <Star className="h-4 w-4 text-yellow-400 fill-current mr-1" />
                <span className="text-sm font-medium">{rating}</span>
              </div>
              <div className="text-sm font-semibold text-gray-900 dark:text-white">
                From LKR {price.toLocaleString()}
              </div>
            </div>

            <div className="flex space-x-2">
              <Button size="sm" className="flex-1" onClick={(e) => e.stopPropagation()}>
                <MessageCircle className="h-3 w-3 mr-1" />
                Contact
              </Button>
              <Button size="sm" variant="outline" onClick={(e) => e.stopPropagation()}>
                View Profile
              </Button>
            </div>
          </CardContent>
        </Card>
      </Link>
    </motion.div>
  )
}
