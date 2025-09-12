"use client"

import { useState, useEffect } from 'react'
import { useParams, useRouter } from 'next/navigation'
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
  MapPin, 
  Calendar, 
  Users, 
  ArrowLeft,
  Camera,
  Music,
  Utensils,
  Flower2,
  Car,
  Gift
} from 'lucide-react'
import Image from 'next/image'
import Header from '@/components/organisms/header'
import Footer from '@/components/organisms/footer'
import { useToast } from '@/hooks/use-toast'

interface WeddingPackage {
  _id: string
  name: string
  description: string
  price: number
  originalPrice: number
  rating: {
    average: number
    count: number
  }
  features: string[]
  venues: any[]
  vendors: any[]
  badge?: string
  badgeColor?: string
  location?: string
}

export default function PackageDetailPage() {
  const params = useParams()
  const router = useRouter()
  const { toast } = useToast()
  const packageId = params.id as string
  
  const [package, setPackage] = useState<WeddingPackage | null>(null)
  const [loading, setLoading] = useState(true)
  const [isSaved, setIsSaved] = useState(false)

  useEffect(() => {
    if (packageId) {
      fetchPackageDetails()
    }
  }, [packageId])

  const fetchPackageDetails = async () => {
    try {
      setLoading(true)
      const response = await fetch(`/api/packages/${packageId}`)
      if (response.ok) {
        const data = await response.json()
        if (data.success) {
          setPackage(data.package)
        }
      }
    } catch (error) {
      console.error('Error fetching package details:', error)
      toast({
        title: 'Error',
        description: 'Failed to load package details',
        variant: 'destructive'
      })
    } finally {
      setLoading(false)
    }
  }

  const handleSave = () => {
    setIsSaved(!isSaved)
    toast({
      title: isSaved ? 'Removed from favorites' : 'Added to favorites',
      description: isSaved ? 'Package removed from your saved items' : 'Package added to your favorites'
    })
  }

  const handleShare = () => {
    if (navigator.share) {
      navigator.share({
        title: package?.name || 'Wedding Package',
        text: package?.description || 'Check out this wedding package',
        url: window.location.href,
      })
    } else {
      navigator.clipboard.writeText(window.location.href)
      toast({
        title: 'Link copied',
        description: 'Package link copied to clipboard'
      })
    }
  }

  const handleBookPackage = () => {
    router.push(`/packages/${packageId}/book`)
  }

  if (loading) {
    return (
      <>
        <Header />
        <main className="min-h-screen bg-gray-50 dark:bg-gray-900">
          <div className="container mx-auto px-4 py-8">
            <div className="text-center">
              <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-pink-500 mx-auto"></div>
              <p className="mt-4 text-gray-600">Loading package details...</p>
            </div>
          </div>
        </main>
        <Footer />
      </>
    )
  }

  if (!package) {
    return (
      <>
        <Header />
        <main className="min-h-screen bg-gray-50 dark:bg-gray-900">
          <div className="container mx-auto px-4 py-8">
            <div className="text-center">
              <h1 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">Package Not Found</h1>
              <p className="text-gray-600 dark:text-gray-300 mb-8">The package you're looking for doesn't exist.</p>
              <Button onClick={() => router.push('/packages')}>
                <ArrowLeft className="h-4 w-4 mr-2" />
                Back to Packages
              </Button>
            </div>
          </div>
        </main>
        <Footer />
      </>
    )
  }

  const savings = package.originalPrice - package.price
  const savingsPercentage = Math.round((savings / package.originalPrice) * 100)

  return (
    <>
      <Header />
      <main className="min-h-screen bg-gray-50 dark:bg-gray-900">
        <div className="container mx-auto px-4 py-8">
          {/* Back Button */}
          <Button 
            variant="outline" 
            onClick={() => router.back()}
            className="mb-6"
          >
            <ArrowLeft className="h-4 w-4 mr-2" />
            Back
          </Button>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Main Content */}
            <div className="lg:col-span-2 space-y-6">
              {/* Package Header */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6 }}
              >
                <Card>
                  <CardHeader>
                    <div className="flex items-start justify-between">
                      <div>
                        {package.badge && (
                          <Badge className={`${package.badgeColor} text-white mb-4`}>
                            {package.badge}
                          </Badge>
                        )}
                        <CardTitle className="text-3xl mb-2">{package.name}</CardTitle>
                        <p className="text-gray-600 dark:text-gray-300 text-lg">{package.description}</p>
                      </div>
                      <div className="flex space-x-2">
                        <Button variant="outline" size="sm" onClick={handleSave}>
                          <Heart className={`h-4 w-4 mr-1 ${isSaved ? 'fill-red-500 text-red-500' : ''}`} />
                          {isSaved ? 'Saved' : 'Save'}
                        </Button>
                        <Button variant="outline" size="sm" onClick={handleShare}>
                          <Share2 className="h-4 w-4 mr-1" />
                          Share
                        </Button>
                      </div>
                    </div>

                    {/* Rating and Location */}
                    <div className="flex items-center space-x-6 mt-4">
                      <div className="flex items-center">
                        <Star className="h-5 w-5 text-yellow-400 fill-current" />
                        <span className="ml-1 font-medium text-lg">{package.rating.average}</span>
                        <span className="ml-1 text-gray-600 dark:text-gray-300">({package.rating.count} reviews)</span>
                      </div>
                      {package.location && (
                        <div className="flex items-center">
                          <MapPin className="h-4 w-4 text-gray-400 mr-1" />
                          <span className="text-gray-600 dark:text-gray-300">{package.location}</span>
                        </div>
                      )}
                    </div>

                    {/* Pricing */}
                    <div className="mt-6">
                      <div className="flex items-baseline space-x-3">
                        <span className="text-4xl font-bold text-green-600">LKR {package.price.toLocaleString()}</span>
                        <span className="text-2xl text-gray-500 line-through">LKR {package.originalPrice.toLocaleString()}</span>
                      </div>
                      <div className="flex items-center space-x-2 mt-2">
                        <Badge variant="secondary" className="bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200">
                          Save {savingsPercentage}%
                        </Badge>
                        <span className="text-sm text-gray-600 dark:text-gray-300">
                          You save LKR {savings.toLocaleString()}
                        </span>
                      </div>
                    </div>
                  </CardHeader>
                </Card>
              </motion.div>

              {/* Features */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: 0.2 }}
              >
                <Card>
                  <CardHeader>
                    <CardTitle>Package Includes</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      {package.features.map((feature, index) => (
                        <div key={index} className="flex items-start space-x-3">
                          <Check className="h-5 w-5 text-green-500 mt-0.5 flex-shrink-0" />
                          <span className="text-gray-700 dark:text-gray-300">{feature}</span>
                        </div>
                      ))}
                    </div>
                  </CardContent>
                </Card>
              </motion.div>

              {/* Featured Venues */}
              {package.venues && package.venues.length > 0 && (
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.6, delay: 0.4 }}
                >
                  <Card>
                    <CardHeader>
                      <CardTitle>Featured Venues</CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        {package.venues.map((venue, index) => (
                          <div key={index} className="border rounded-lg p-4 hover:shadow-md transition-shadow">
                            <div className="flex items-center space-x-3">
                              <Image
                                src={venue.image || "/placeholder.svg"}
                                alt={venue.name}
                                width={60}
                                height={60}
                                className="rounded-lg object-cover"
                              />
                              <div>
                                <h4 className="font-semibold">{venue.name}</h4>
                                <div className="flex items-center">
                                  <Star className="h-4 w-4 text-yellow-400 fill-current mr-1" />
                                  <span className="text-sm">{venue.rating}</span>
                                </div>
                              </div>
                            </div>
                          </div>
                        ))}
                      </div>
                    </CardContent>
                  </Card>
                </motion.div>
              )}

              {/* Top Vendors */}
              {package.vendors && package.vendors.length > 0 && (
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.6, delay: 0.6 }}
                >
                  <Card>
                    <CardHeader>
                      <CardTitle>Top Vendors</CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="space-y-4">
                        {package.vendors.map((vendor, index) => (
                          <div key={index} className="flex items-center justify-between p-4 border rounded-lg">
                            <div className="flex items-center space-x-3">
                              <Avatar className="h-10 w-10">
                                <AvatarImage src="/placeholder.svg" />
                                <AvatarFallback>{vendor.name[0]}</AvatarFallback>
                              </Avatar>
                              <div>
                                <h4 className="font-semibold">{vendor.name}</h4>
                                <p className="text-sm text-gray-600 dark:text-gray-300">{vendor.category}</p>
                              </div>
                            </div>
                            <div className="flex items-center">
                              <Star className="h-4 w-4 text-yellow-400 fill-current mr-1" />
                              <span className="font-medium">{vendor.rating}</span>
                            </div>
                          </div>
                        ))}
                      </div>
                    </CardContent>
                  </Card>
                </motion.div>
              )}
            </div>

            {/* Sidebar */}
            <div className="lg:col-span-1">
              <motion.div
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.6, delay: 0.3 }}
                className="sticky top-4"
              >
                <Card>
                  <CardHeader>
                    <CardTitle>Book This Package</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="text-center">
                      <div className="text-3xl font-bold text-green-600 mb-2">
                        LKR {package.price.toLocaleString()}
                      </div>
                      <p className="text-sm text-gray-600 dark:text-gray-300">
                        All-inclusive wedding package
                      </p>
                    </div>

                    <Button 
                      className="w-full bg-gradient-to-r from-pink-500 to-purple-600 hover:from-pink-600 hover:to-purple-700"
                      size="lg"
                      onClick={handleBookPackage}
                    >
                      Book This Package
                    </Button>

                    <div className="text-center text-sm text-gray-600 dark:text-gray-300">
                      <p>✓ Free consultation included</p>
                      <p>✓ 30-day money-back guarantee</p>
                      <p>✓ Professional wedding coordinator</p>
                    </div>
                  </CardContent>
                </Card>
              </motion.div>
            </div>
          </div>
        </div>
      </main>
      <Footer />
    </>
  )
}
