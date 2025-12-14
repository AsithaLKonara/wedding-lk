"use client"

import { motion } from "framer-motion"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Star, MapPin, Heart, Eye, Sparkles } from "lucide-react"
import Image from "next/image"

interface AISearchResultsProps {
  results: {
    interpretation: {
      weddingStyle: string
      budget: { min: number; max: number }
      preferences: string[]
    }
    recommendations: {
      venues: Array<{
        id: number
        name: string
        location: string
        rating: number
        price: number
        image: string
        matchScore: number
        reasons: string[]
      }>
      vendors: Array<{
        id: number
        name: string
        category: string
        rating: number
        price: number
        matchScore: number
        reasons: string[]
      }>
      packages: Array<{
        id: number
        title: string
        price: number
        originalPrice: number
        rating: number
        matchScore: number
        features: string[]
      }>
    }
    insights: string[]
  }
}

export function AISearchResults({ results }: AISearchResultsProps) {
  return (
    <div className="space-y-8">
      {/* AI Interpretation */}
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6 }}>
        <Card className="border-0 shadow-lg bg-gradient-to-r from-purple-50 to-pink-50 dark:from-purple-900/20 dark:to-pink-900/20">
          <CardHeader>
            <CardTitle className="flex items-center">
              <Sparkles className="mr-2 h-5 w-5 text-purple-500" />
              AI Wedding Analysis
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div>
                <h4 className="font-semibold text-gray-900 dark:text-white mb-2">Wedding Style</h4>
                <Badge
                  variant="secondary"
                  className="bg-purple-100 text-purple-800 dark:bg-purple-900 dark:text-purple-200"
                >
                  {results.interpretation.weddingStyle}
                </Badge>
              </div>
              <div>
                <h4 className="font-semibold text-gray-900 dark:text-white mb-2">Budget Range</h4>
                <p className="text-sm text-gray-600 dark:text-gray-300">
                  LKR {results.interpretation.budget.min.toLocaleString()} -{" "}
                  {results.interpretation.budget.max.toLocaleString()}
                </p>
              </div>
              <div>
                <h4 className="font-semibold text-gray-900 dark:text-white mb-2">Key Preferences</h4>
                <div className="flex flex-wrap gap-1">
                  {results.interpretation.preferences.map((pref, index) => (
                    <Badge key={index} variant="outline" className="text-xs">
                      {pref}
                    </Badge>
                  ))}
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      </motion.div>

      {/* Recommended Venues */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, delay: 0.2 }}
      >
        <h3 className="text-2xl font-bold text-gray-900 dark:text-white mb-6">Recommended Venues</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {results.recommendations.venues.map((venue, index) => (
            <Card key={venue.id} className="border-0 shadow-lg hover:shadow-xl transition-shadow">
              <div className="relative h-48">
                <Image
                  src={venue.image || "/placeholder.svg?height=200&width=400"}
                  alt={venue.name}
                  fill
                  className="object-cover rounded-t-lg"
                />
                <div className="absolute top-4 right-4">
                  <Badge className="bg-green-500 text-white">{venue.matchScore}% Match</Badge>
                </div>
              </div>
              <CardContent className="p-6">
                <div className="flex justify-between items-start mb-3">
                  <div>
                    <h4 className="font-semibold text-gray-900 dark:text-white">{venue.name}</h4>
                    <div className="flex items-center text-sm text-gray-600 dark:text-gray-300">
                      <MapPin className="h-3 w-3 mr-1" />
                      {venue.location}
                    </div>
                  </div>
                  <div className="flex items-center">
                    <Star className="h-4 w-4 text-yellow-400 fill-current mr-1" />
                    <span className="text-sm font-medium">{venue.rating}</span>
                  </div>
                </div>

                <div className="space-y-2 mb-4">
                  <h5 className="text-sm font-medium text-gray-900 dark:text-white">Why this matches:</h5>
                  {venue.reasons.map((reason, reasonIndex) => (
                    <div key={reasonIndex} className="flex items-start text-xs text-gray-600 dark:text-gray-300">
                      <div className="w-1 h-1 rounded-full bg-green-500 mt-2 mr-2 flex-shrink-0" />
                      {reason}
                    </div>
                  ))}
                </div>

                <div className="flex justify-between items-center">
                  <div className="text-lg font-bold text-gray-900 dark:text-white">
                    LKR {venue.price.toLocaleString()}
                  </div>
                  <div className="flex space-x-2">
                    <Button size="sm" variant="outline">
                      <Eye className="h-3 w-3 mr-1" />
                      View
                    </Button>
                    <Button size="sm" variant="outline">
                      <Heart className="h-3 w-3 mr-1" />
                      Save
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </motion.div>

      {/* Recommended Vendors */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, delay: 0.4 }}
      >
        <h3 className="text-2xl font-bold text-gray-900 dark:text-white mb-6">Recommended Vendors</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {results.recommendations.vendors.map((vendor, index) => (
            <Card key={vendor.id} className="border-0 shadow-lg">
              <CardContent className="p-6">
                <div className="flex justify-between items-start mb-3">
                  <div>
                    <h4 className="font-semibold text-gray-900 dark:text-white">{vendor.name}</h4>
                    <Badge variant="secondary" className="text-xs mt-1">
                      {vendor.category}
                    </Badge>
                  </div>
                  <Badge className="bg-green-500 text-white text-xs">{vendor.matchScore}% Match</Badge>
                </div>

                <div className="flex items-center mb-3">
                  <Star className="h-4 w-4 text-yellow-400 fill-current mr-1" />
                  <span className="text-sm font-medium mr-2">{vendor.rating}</span>
                  <span className="text-sm text-gray-600 dark:text-gray-300">LKR {vendor.price.toLocaleString()}</span>
                </div>

                <div className="space-y-1 mb-4">
                  {vendor.reasons.map((reason, reasonIndex) => (
                    <div key={reasonIndex} className="flex items-start text-xs text-gray-600 dark:text-gray-300">
                      <div className="w-1 h-1 rounded-full bg-green-500 mt-2 mr-2 flex-shrink-0" />
                      {reason}
                    </div>
                  ))}
                </div>

                <Button size="sm" className="w-full">
                  Contact Vendor
                </Button>
              </CardContent>
            </Card>
          ))}
        </div>
      </motion.div>

      {/* Recommended Packages */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, delay: 0.6 }}
      >
        <h3 className="text-2xl font-bold text-gray-900 dark:text-white mb-6">Recommended Packages</h3>
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {results.recommendations.packages.map((pkg, index) => (
            <Card key={pkg.id} className="border-0 shadow-lg">
              <CardHeader>
                <div className="flex justify-between items-start">
                  <CardTitle className="text-lg">{pkg.title}</CardTitle>
                  <Badge className="bg-green-500 text-white">{pkg.matchScore}% Match</Badge>
                </div>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex items-center justify-between">
                  <div>
                    <div className="flex items-baseline space-x-2">
                      <span className="text-2xl font-bold text-gray-900 dark:text-white">
                        LKR {pkg.price.toLocaleString()}
                      </span>
                      <span className="text-lg text-gray-500 line-through">
                        LKR {pkg.originalPrice.toLocaleString()}
                      </span>
                    </div>
                    <div className="flex items-center mt-1">
                      <Star className="h-4 w-4 text-yellow-400 fill-current mr-1" />
                      <span className="text-sm font-medium">{pkg.rating}</span>
                    </div>
                  </div>
                </div>

                <div className="space-y-2">
                  <h5 className="text-sm font-medium text-gray-900 dark:text-white">Package includes:</h5>
                  {pkg.features.slice(0, 4).map((feature, featureIndex) => (
                    <div key={featureIndex} className="flex items-start text-sm text-gray-600 dark:text-gray-300">
                      <div className="w-1 h-1 rounded-full bg-green-500 mt-2 mr-2 flex-shrink-0" />
                      {feature}
                    </div>
                  ))}
                  {pkg.features.length > 4 && (
                    <div className="text-sm text-purple-600 dark:text-purple-400">
                      +{pkg.features.length - 4} more features
                    </div>
                  )}
                </div>

                <Button className="w-full bg-gradient-to-r from-purple-500 to-pink-500">View Package Details</Button>
              </CardContent>
            </Card>
          ))}
        </div>
      </motion.div>

      {/* AI Insights */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, delay: 0.8 }}
      >
        <Card className="border-0 shadow-lg bg-blue-50 dark:bg-blue-900/20">
          <CardHeader>
            <CardTitle className="flex items-center">
              <Sparkles className="mr-2 h-5 w-5 text-blue-500" />
              AI Wedding Insights
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {results.insights.map((insight, index) => (
                <div key={index} className="flex items-start space-x-3">
                  <div className="w-2 h-2 rounded-full bg-blue-500 mt-2 flex-shrink-0" />
                  <p className="text-sm text-gray-700 dark:text-gray-300">{insight}</p>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </motion.div>
    </div>
  )
}


export default AISearchResults
