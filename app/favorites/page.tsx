"use client"

import { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import { 
  Star, 
  Check, 
  Heart, 
  Share2, 
  Eye, 
  MapPin,
  Trash2,
  ShoppingCart
} from 'lucide-react'
import Image from 'next/image'
import Header from '@/components/organisms/header'
import Footer from '@/components/organisms/footer'
import { useRouter } from 'next/navigation'
import { useToast } from '@/hooks/use-toast'

interface SavedPackage {
  id: string
  name: string
  description: string
  price: number
  originalPrice: number
  rating: number
  reviewCount: number
  badge: string
  badgeColor: string
  features: string[]
  venues: Array<{ name: string; rating: number; image: string }>
  vendors: Array<{ name: string; category: string; rating: number }>
  savedAt: string
}

export default function FavoritesPage() {
  const router = useRouter()
  const { toast } = useToast()
  const [savedPackages, setSavedPackages] = useState<SavedPackage[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetchSavedPackages()
  }, [])

  const fetchSavedPackages = async () => {
    try {
      setLoading(true)
      // In a real app, this would fetch from the database
      // For now, we'll use localStorage or show empty state
      const saved = localStorage.getItem('savedPackages')
      if (saved) {
        setSavedPackages(JSON.parse(saved))
      }
    } catch (error) {
      console.error('Error fetching saved packages:', error)
    } finally {
      setLoading(false)
    }
  }

  const handleRemoveFromFavorites = (packageId: string) => {
    const updatedPackages = savedPackages.filter(pkg => pkg.id !== packageId)
    setSavedPackages(updatedPackages)
    localStorage.setItem('savedPackages', JSON.stringify(updatedPackages))
    toast({
      title: 'Removed from favorites',
      description: 'Package removed from your saved items'
    })
  }

  const handleViewDetails = (packageId: string) => {
    router.push(`/packages/${packageId}`)
  }

  const handleBookPackage = (packageId: string) => {
    router.push(`/packages/${packageId}/book`)
  }

  const handleShare = (packageData: SavedPackage) => {
    if (navigator.share) {
      navigator.share({
        title: packageData.name,
        text: packageData.description,
        url: `${window.location.origin}/packages/${packageData.id}`,
      })
    } else {
      navigator.clipboard.writeText(`${window.location.origin}/packages/${packageData.id}`)
      toast({
        title: 'Link copied',
        description: 'Package link copied to clipboard'
      })
    }
  }

  if (loading) {
    return (
      <>
        <Header />
        <main className="min-h-screen bg-gray-50 dark:bg-gray-900">
          <div className="container mx-auto px-4 py-8">
            <div className="text-center">
              <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-pink-500 mx-auto"></div>
              <p className="mt-4 text-gray-600">Loading your favorites...</p>
            </div>
          </div>
        </main>
        <Footer />
      </>
    )
  }

  return (
    <>
      <Header />
      <main className="min-h-screen bg-gray-50 dark:bg-gray-900">
        <div className="container mx-auto px-4 py-8">
          {/* Header */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="text-center mb-12"
          >
            <h1 className="text-4xl font-bold text-gray-900 dark:text-white mb-4">
              Your Saved Packages
            </h1>
            <p className="text-xl text-gray-600 dark:text-gray-300">
              Wedding packages you've saved for later
            </p>
          </motion.div>

          {savedPackages.length === 0 ? (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
              className="text-center py-16"
            >
              <div className="max-w-md mx-auto">
                <Heart className="h-24 w-24 text-gray-300 mx-auto mb-6" />
                <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">
                  No Saved Packages Yet
                </h2>
                <p className="text-gray-600 dark:text-gray-300 mb-8">
                  Start exploring wedding packages and save your favorites to view them here.
                </p>
                <Button 
                  onClick={() => router.push('/packages')}
                  className="bg-gradient-to-r from-pink-500 to-purple-600 hover:from-pink-600 hover:to-purple-700"
                >
                  <ShoppingCart className="h-4 w-4 mr-2" />
                  Explore Packages
                </Button>
              </div>
            </motion.div>
          ) : (
            <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-6">
              {savedPackages.map((pkg, index) => (
                <motion.div
                  key={pkg.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.6, delay: index * 0.1 }}
                >
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
                          <Heart className="h-6 w-6 text-white" />
                        </div>
                        <div>
                          <h3 className="text-xl font-bold text-gray-900 dark:text-white">{pkg.name}</h3>
                          <p className="text-sm text-gray-600 dark:text-gray-300">{pkg.description}</p>
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
                            Save {Math.round(((pkg.originalPrice - pkg.price) / pkg.originalPrice) * 100)}%
                          </Badge>
                          <span className="text-sm text-gray-600 dark:text-gray-300">
                            You save LKR {(pkg.originalPrice - pkg.price).toLocaleString()}
                          </span>
                        </div>
                      </div>
                    </CardHeader>

                    <CardContent className="space-y-6">
                      {/* Features */}
                      <div>
                        <h4 className="font-semibold text-gray-900 dark:text-white mb-3">Package Includes:</h4>
                        <div className="space-y-2">
                          {pkg.features.slice(0, 4).map((feature, idx) => (
                            <div key={idx} className="flex items-start space-x-2">
                              <Check className="h-4 w-4 text-green-500 mt-0.5 flex-shrink-0" />
                              <span className="text-sm text-gray-600 dark:text-gray-300">{feature}</span>
                            </div>
                          ))}
                          {pkg.features.length > 4 && (
                            <div className="text-sm text-purple-600 dark:text-purple-400 font-medium">
                              +{pkg.features.length - 4} more features
                            </div>
                          )}
                        </div>
                      </div>

                      {/* Featured Venues */}
                      {pkg.venues.length > 0 && (
                        <div>
                          <h4 className="font-semibold text-gray-900 dark:text-white mb-3">Featured Venues:</h4>
                          <div className="grid grid-cols-3 gap-2">
                            {pkg.venues.slice(0, 3).map((venue, idx) => (
                              <div key={idx} className="relative group">
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
                      )}

                      {/* Top Vendors */}
                      {pkg.vendors.length > 0 && (
                        <div>
                          <h4 className="font-semibold text-gray-900 dark:text-white mb-3">Top Vendors:</h4>
                          <div className="space-y-2">
                            {pkg.vendors.slice(0, 2).map((vendor, idx) => (
                              <div key={idx} className="flex items-center justify-between">
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
                      )}

                      {/* Action Buttons */}
                      <div className="space-y-3 pt-4">
                        <Button
                          className="w-full bg-gradient-to-r from-pink-500 to-purple-600 hover:from-pink-600 hover:to-purple-700"
                          onClick={() => handleBookPackage(pkg.id)}
                        >
                          Book This Package
                        </Button>
                        <div className="flex space-x-2">
                          <Button variant="outline" size="sm" className="flex-1" onClick={() => handleViewDetails(pkg.id)}>
                            <Eye className="h-4 w-4 mr-1" />
                            View Details
                          </Button>
                          <Button variant="outline" size="sm" className="flex-1" onClick={() => handleShare(pkg)}>
                            <Share2 className="h-4 w-4 mr-1" />
                            Share
                          </Button>
                          <Button 
                            variant="outline" 
                            size="sm" 
                            className="flex-1 text-red-500 hover:text-red-600 hover:bg-red-50"
                            onClick={() => handleRemoveFromFavorites(pkg.id)}
                          >
                            <Trash2 className="h-4 w-4 mr-1" />
                            Remove
                          </Button>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                </motion.div>
              ))}
            </div>
          )}
        </div>
      </main>
      <Footer />
    </>
  )
}