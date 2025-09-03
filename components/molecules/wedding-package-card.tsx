"use client"

import { motion } from "framer-motion"
import { Card, CardContent, CardHeader } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Star, Check, Heart, Share2, Eye } from "lucide-react"
import Image from "next/image"
import { useRouter } from "next/navigation"

interface WeddingPackageCardProps {
  package: {
    id: number
    title: string
    subtitle: string
    price: number
    originalPrice: number
    rating: number
    reviewCount: number
    badge: string
    badgeColor: string
    icon: any
    features: string[]
    venues: Array<{ name: string; rating: number; image: string }>
    vendors: Array<{ name: string; category: string; rating: number }>
  }
}

export function WeddingPackageCard({ package: pkg }: WeddingPackageCardProps) {
  const router = useRouter()

  const handleSave = (packageId: number) => {
    // Add to favorites logic
    console.log("Saving package:", packageId)
  }

  const handleShare = (packageId: number) => {
    // Share functionality
    if (navigator.share) {
      navigator.share({
        title: pkg.title,
        text: pkg.subtitle,
        url: `${window.location.origin}/packages/${packageId}`,
      })
    }
  }

  const IconComponent = pkg.icon
  const savings = pkg.originalPrice - pkg.price
  const savingsPercentage = Math.round((savings / pkg.originalPrice) * 100)

  return (
    <motion.div whileHover={{ y: -8, scale: 1.02 }} transition={{ duration: 0.3 }} className="h-full">
      <Card className="h-full border-0 shadow-xl bg-white dark:bg-gray-800 overflow-hidden relative">
        {/* Badge */}
        <div
          className={`absolute top-4 right-4 ${pkg.badgeColor} text-white px-3 py-1 rounded-full text-xs font-medium z-10`}
        >
          {pkg.badge}
        </div>

        <CardHeader className="pb-4">
          <div className="flex items-center space-x-3 mb-4">
            <div className="w-12 h-12 bg-gradient-to-r from-pink-500 to-purple-600 rounded-full flex items-center justify-center">
              <IconComponent className="h-6 w-6 text-white" />
            </div>
            <div>
              <h3 className="text-xl font-bold text-gray-900 dark:text-white">{pkg.title}</h3>
              <p className="text-sm text-gray-600 dark:text-gray-300">{pkg.subtitle}</p>
            </div>
          </div>

          {/* Rating */}
          <div className="flex items-center space-x-2 mb-4">
            <div className="flex items-center">
              <Star className="h-4 w-4 text-yellow-400 fill-current" />
              <span className="ml-1 font-medium text-gray-900 dark:text-white">{pkg.rating}</span>
            </div>
            <span className="text-sm text-gray-600 dark:text-gray-300">({pkg.reviewCount} reviews)</span>
          </div>

          {/* Pricing */}
          <div className="space-y-2">
            <div className="flex items-baseline space-x-2">
              <span className="text-3xl font-bold text-gray-900 dark:text-white">LKR {pkg.price.toLocaleString()}</span>
              <span className="text-lg text-gray-500 line-through">LKR {pkg.originalPrice.toLocaleString()}</span>
            </div>
            <div className="flex items-center space-x-2">
              <Badge variant="secondary" className="bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200">
                Save {savingsPercentage}%
              </Badge>
              <span className="text-sm text-gray-600 dark:text-gray-300">You save LKR {savings.toLocaleString()}</span>
            </div>
          </div>
        </CardHeader>

        <CardContent className="space-y-6">
          {/* Features */}
          <div>
            <h4 className="font-semibold text-gray-900 dark:text-white mb-3">Package Includes:</h4>
            <div className="space-y-2">
              {pkg.features.slice(0, 6).map((feature, index) => (
                <div key={index} className="flex items-start space-x-2">
                  <Check className="h-4 w-4 text-green-500 mt-0.5 flex-shrink-0" />
                  <span className="text-sm text-gray-600 dark:text-gray-300">{feature}</span>
                </div>
              ))}
              {pkg.features.length > 6 && (
                <div className="text-sm text-purple-600 dark:text-purple-400 font-medium">
                  +{pkg.features.length - 6} more features
                </div>
              )}
            </div>
          </div>

          {/* Featured Venues */}
          <div>
            <h4 className="font-semibold text-gray-900 dark:text-white mb-3">Featured Venues:</h4>
            <div className="grid grid-cols-3 gap-2">
              {pkg.venues.map((venue, index) => (
                <div key={index} className="relative group">
                  <Image
                    src={venue.image || "/placeholder.svg"}
                    alt={venue.name}
                    width={150}
                    height={100}
                    className="w-full h-16 object-cover rounded-lg"
                  />
                  <div className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 transition-opacity rounded-lg flex items-center justify-center">
                    <div className="text-white text-center">
                      <div className="text-xs font-medium">{venue.name}</div>
                      <div className="flex items-center justify-center text-xs">
                        <Star className="h-3 w-3 text-yellow-400 fill-current mr-1" />
                        {venue.rating}
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Top Vendors */}
          <div>
            <h4 className="font-semibold text-gray-900 dark:text-white mb-3">Top Vendors:</h4>
            <div className="space-y-2">
              {pkg.vendors.slice(0, 3).map((vendor, index) => (
                <div key={index} className="flex items-center justify-between">
                  <div className="flex items-center space-x-2">
                    <Avatar className="h-6 w-6">
                      <AvatarImage src="/placeholder.svg" />
                      <AvatarFallback className="text-xs">{vendor.name[0]}</AvatarFallback>
                    </Avatar>
                    <div>
                      <div className="text-sm font-medium text-gray-900 dark:text-white">{vendor.name}</div>
                      <div className="text-xs text-gray-500">{vendor.category}</div>
                    </div>
                  </div>
                  <div className="flex items-center">
                    <Star className="h-3 w-3 text-yellow-400 fill-current mr-1" />
                    <span className="text-xs font-medium">{vendor.rating}</span>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Action Buttons */}
          <div className="space-y-3 pt-4">
            <Button
              className="w-full bg-gradient-to-r from-pink-500 to-purple-600 hover:from-pink-600 hover:to-purple-700"
              onClick={() => router.push(`/packages/${pkg.id}/book`)}
            >
              Book This Package
            </Button>
            <div className="flex space-x-2">
              <Button variant="outline" size="sm" className="flex-1" onClick={() => router.push(`/packages/${pkg.id}`)}>
                <Eye className="h-4 w-4 mr-1" />
                View Details
              </Button>
              <Button variant="outline" size="sm" className="flex-1" onClick={() => handleSave(pkg.id)}>
                <Heart className="h-4 w-4 mr-1" />
                Save
              </Button>
              <Button variant="outline" size="sm" className="flex-1" onClick={() => handleShare(pkg.id)}>
                <Share2 className="h-4 w-4 mr-1" />
                Share
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>
    </motion.div>
  )
}


export default WeddingPackageCard
