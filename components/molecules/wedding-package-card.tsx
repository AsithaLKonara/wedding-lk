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

  const handleBookNow = () => {
    router.push(`/booking/${pkg.id}`)
  }

  const handleViewDetails = () => {
    router.push(`/packages/${pkg.id}`)
  }

  const handleSave = (packageId: number) => {
    try {
      const savedPackages = JSON.parse(localStorage.getItem('savedPackages') || '[]')
      const isAlreadySaved = savedPackages.some((p: any) => p.id === packageId.toString())
      
      if (isAlreadySaved) {
        const updatedPackages = savedPackages.filter((p: any) => p.id !== packageId.toString())
        localStorage.setItem('savedPackages', JSON.stringify(updatedPackages))
      } else {
        const packageToSave = {
          id: packageId.toString(),
          name: pkg.title,
          description: pkg.subtitle,
          price: pkg.price,
          originalPrice: pkg.originalPrice,
          rating: pkg.rating,
          reviewCount: pkg.reviewCount,
          badge: pkg.badge,
          badgeColor: pkg.badgeColor,
          features: pkg.features,
          venues: pkg.venues,
          vendors: pkg.vendors,
          savedAt: new Date().toISOString()
        }
        savedPackages.push(packageToSave)
        localStorage.setItem('savedPackages', JSON.stringify(savedPackages))
      }
    } catch (error) {
      console.error('Error saving package:', error)
    }
  }

  const handleShare = (packageId: number) => {
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
    <motion.div whileHover={{ y: -8 }} transition={{ duration: 0.5, ease: "circOut" }} className="h-full">
      <Card className="h-full border border-border/50 shadow-xl bg-card/80 backdrop-blur-sm overflow-hidden relative group">
        {/* Animated glow on hover */}
        <div className="absolute inset-0 bg-gradient-to-br from-rose-500/5 to-purple-600/5 opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
        
        {/* Badge */}
        <div className={`absolute top-5 right-5 ${pkg.badgeColor} text-white px-4 py-1.5 rounded-full text-xs font-bold z-10 shadow-lg`}>
          {pkg.badge}
        </div>

        <CardHeader className="pb-6 relative z-10">
          <div className="flex items-center space-x-4 mb-6">
            <div className="w-14 h-14 bg-gradient-to-br from-rose-500 to-purple-600 rounded-2xl flex items-center justify-center shadow-lg shadow-rose-500/20 group-hover:scale-110 transition-transform duration-500">
              <IconComponent className="h-7 w-7 text-white" />
            </div>
            <div className="flex-1 min-w-0">
              <h3 className="text-2xl font-bold truncate group-hover:text-rose-500 transition-colors">
                {pkg.title}
              </h3>
              <p className="text-sm text-muted-foreground font-medium truncate">{pkg.subtitle}</p>
            </div>
          </div>

          <div className="flex items-center justify-between mb-6">
            <div className="flex items-center space-x-2">
              <div className="flex items-center">
                <Star className="h-4 w-4 text-yellow-400 fill-current" />
                <span className="ml-1.5 font-bold">{pkg.rating}</span>
              </div>
              <span className="text-xs text-muted-foreground font-medium">({pkg.reviewCount} reviews)</span>
            </div>
            <Badge variant="outline" className="border-green-500/50 text-green-600 dark:text-green-400 font-bold">
              Save {savingsPercentage}%
            </Badge>
          </div>

          <div className="space-y-1">
            <div className="flex items-baseline space-x-2">
              <span className="text-3xl font-black text-foreground">LKR {pkg.price.toLocaleString()}</span>
              <span className="text-sm text-muted-foreground line-through font-medium">LKR {pkg.originalPrice.toLocaleString()}</span>
            </div>
            <p className="text-[10px] font-bold text-muted-foreground uppercase tracking-wider">Starting from per event</p>
          </div>
        </CardHeader>

        <CardContent className="space-y-8 relative z-10">
          <div className="space-y-4">
            <h4 className="text-sm font-bold uppercase tracking-widest text-muted-foreground">Premium Inclusions</h4>
            <div className="grid grid-cols-1 gap-3">
              {pkg.features.slice(0, 5).map((feature, index) => (
                <div key={index} className="flex items-start space-x-3">
                  <div className="mt-1 w-4 h-4 rounded-full bg-rose-500/10 flex items-center justify-center flex-shrink-0">
                    <Check className="h-2.5 w-2.5 text-rose-500" />
                  </div>
                  <span className="text-sm text-muted-foreground leading-tight">{feature}</span>
                </div>
              ))}
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <h4 className="text-[10px] font-bold uppercase tracking-widest text-muted-foreground mb-3">Partner Venues</h4>
              <div className="flex -space-x-3 overflow-hidden">
                {pkg.venues.slice(0, 3).map((venue, index) => (
                  <div key={index} className="relative w-10 h-10 rounded-full border-2 border-background overflow-hidden shadow-md">
                    <Image
                      src={venue.image || "/placeholder.svg"}
                      alt={venue?.name || 'Venue'}
                      fill
                      className="object-cover"
                    />
                  </div>
                ))}
              </div>
            </div>
            <div>
              <h4 className="text-[10px] font-bold uppercase tracking-widest text-muted-foreground mb-3">Top Vendors</h4>
              <div className="flex -space-x-3 overflow-hidden">
                {pkg.vendors.slice(0, 3).map((vendor, index) => (
                  <Avatar key={index} className="w-10 h-10 border-2 border-background shadow-md">
                    <AvatarFallback className="bg-muted text-[10px] font-bold">{vendor?.name?.[0] || 'V'}</AvatarFallback>
                  </Avatar>
                ))}
              </div>
            </div>
          </div>

          <div className="flex flex-col space-y-3">
            <Button
              className="w-full h-12 bg-gradient-to-r from-rose-500 to-purple-600 hover:from-rose-600 hover:to-purple-700 text-white font-bold shadow-lg shadow-rose-500/20 group-hover:scale-[1.02] transition-all"
              onClick={handleBookNow}
            >
              Book Now
            </Button>
            <div className="flex space-x-2">
              <Button variant="outline" size="sm" className="flex-1 rounded-xl h-10 hover:bg-rose-500 hover:text-white transition-colors" onClick={handleViewDetails}>
                <Eye className="h-4 w-4 mr-2" />
                Details
              </Button>
              <Button variant="outline" size="sm" className="w-12 h-10 rounded-xl hover:bg-rose-500 hover:text-white transition-colors" onClick={() => handleSave(pkg.id)}>
                <Heart className="h-4 w-4" />
              </Button>
              <Button variant="outline" size="sm" className="w-12 h-10 rounded-xl hover:bg-purple-600 hover:text-white transition-colors" onClick={() => handleShare(pkg.id)}>
                <Share2 className="h-4 w-4" />
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>
    </motion.div>
  )
}


export default WeddingPackageCard
