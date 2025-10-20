"use client"

import { MainLayout } from "@/components/templates/main-layout"
import { useState, useEffect } from "react"
import { useParams } from "next/navigation"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { CheckCircle, Calendar, MapPin, Users, Star, Heart, ArrowLeft } from "lucide-react"
import { motion } from "framer-motion"
import Link from "next/link"

export default function BookingConfirmationPage() {
  const params = useParams()
  const packageId = params.id
  const [packageData, setPackageData] = useState<any>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    // Fetch package data
    const fetchPackage = async () => {
      try {
        const response = await fetch('/api/packages')
        const packages = await response.json()
        const selectedPackage = packages.find((pkg: any) => pkg._id === packageId)
        setPackageData(selectedPackage)
      } catch (error) {
        console.error('Error fetching package:', error)
      } finally {
        setLoading(false)
      }
    }

    fetchPackage()
  }, [packageId])

  if (loading) {
    return (
      <MainLayout>
        <div className="min-h-screen bg-gray-50 dark:bg-gray-900 flex items-center justify-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-rose-500"></div>
        </div>
      </MainLayout>
    )
  }

  if (!packageData) {
    return (
      <MainLayout>
        <div className="min-h-screen bg-gray-50 dark:bg-gray-900 flex items-center justify-center">
          <div className="text-center">
            <h1 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">
              Package Not Found
            </h1>
            <p className="text-gray-600 dark:text-gray-400 mb-6">
              The package you're looking for doesn't exist.
            </p>
            <Link href="/packages">
              <Button>
                <ArrowLeft className="w-4 h-4 mr-2" />
                Back to Packages
              </Button>
            </Link>
          </div>
        </div>
      </MainLayout>
    )
  }

  return (
    <MainLayout>
      <div className="min-h-screen bg-gray-50 dark:bg-gray-900 py-8">
        <div className="container mx-auto px-4 max-w-4xl">
          {/* Success Header */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="text-center mb-8"
          >
            <div className="inline-flex items-center justify-center w-16 h-16 bg-green-100 dark:bg-green-900 rounded-full mb-4">
              <CheckCircle className="w-8 h-8 text-green-600 dark:text-green-400" />
            </div>
            <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-2">
              Booking Confirmed!
            </h1>
            <p className="text-gray-600 dark:text-gray-400">
              Your wedding package has been successfully booked. We'll contact you soon!
            </p>
          </motion.div>

          {/* Package Details */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="mb-8"
          >
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center justify-between">
                  <span>{packageData.name}</span>
                  <Badge variant="secondary" className="bg-green-100 text-green-800">
                    Confirmed
                  </Badge>
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid md:grid-cols-2 gap-6">
                  <div>
                    <h3 className="font-semibold text-lg mb-4">Package Details</h3>
                    <div className="space-y-3">
                      <div className="flex items-center text-gray-600 dark:text-gray-400">
                        <Calendar className="w-4 h-4 mr-2" />
                        <span>Booking Date: {new Date().toLocaleDateString()}</span>
                      </div>
                      <div className="flex items-center text-gray-600 dark:text-gray-400">
                        <Star className="w-4 h-4 mr-2" />
                        <span>Rating: {packageData.rating}/5</span>
                      </div>
                      <div className="flex items-center text-gray-600 dark:text-gray-400">
                        <Heart className="w-4 h-4 mr-2" />
                        <span>Category: {packageData.category}</span>
                      </div>
                    </div>
                  </div>
                  
                  <div>
                    <h3 className="font-semibold text-lg mb-4">Pricing</h3>
                    <div className="bg-gray-50 dark:bg-gray-800 p-4 rounded-lg">
                      <div className="text-2xl font-bold text-gray-900 dark:text-white">
                        LKR {packageData.price?.toLocaleString()}
                      </div>
                      <p className="text-sm text-gray-600 dark:text-gray-400">
                        All-inclusive package
                      </p>
                    </div>
                  </div>
                </div>

                <div className="mt-6">
                  <h3 className="font-semibold text-lg mb-4">Package Features</h3>
                  <div className="grid grid-cols-2 md:grid-cols-3 gap-2">
                    {packageData.features && Object.entries(packageData.features).map(([feature, included]) => (
                      <div key={feature} className="flex items-center">
                        <CheckCircle className={`w-4 h-4 mr-2 ${included ? 'text-green-500' : 'text-gray-300'}`} />
                        <span className={`text-sm ${included ? 'text-gray-900 dark:text-white' : 'text-gray-400'}`}>
                          {feature}
                        </span>
                      </div>
                    ))}
                  </div>
                </div>

                <div className="mt-6">
                  <h3 className="font-semibold text-lg mb-4">Description</h3>
                  <p className="text-gray-600 dark:text-gray-400">
                    {packageData.description}
                  </p>
                </div>
              </CardContent>
            </Card>
          </motion.div>

          {/* Next Steps */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.4 }}
            className="mb-8"
          >
            <Card>
              <CardHeader>
                <CardTitle>What's Next?</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="flex items-start">
                    <div className="w-8 h-8 bg-blue-100 dark:bg-blue-900 rounded-full flex items-center justify-center mr-4 flex-shrink-0">
                      <span className="text-blue-600 dark:text-blue-400 font-semibold">1</span>
                    </div>
                    <div>
                      <h4 className="font-semibold text-gray-900 dark:text-white">Confirmation Email</h4>
                      <p className="text-gray-600 dark:text-gray-400 text-sm">
                        You'll receive a confirmation email with all the details within 24 hours.
                      </p>
                    </div>
                  </div>
                  
                  <div className="flex items-start">
                    <div className="w-8 h-8 bg-blue-100 dark:bg-blue-900 rounded-full flex items-center justify-center mr-4 flex-shrink-0">
                      <span className="text-blue-600 dark:text-blue-400 font-semibold">2</span>
                    </div>
                    <div>
                      <h4 className="font-semibold text-gray-900 dark:text-white">Wedding Coordinator Contact</h4>
                      <p className="text-gray-600 dark:text-gray-400 text-sm">
                        Our wedding coordinator will contact you within 48 hours to discuss your requirements.
                      </p>
                    </div>
                  </div>
                  
                  <div className="flex items-start">
                    <div className="w-8 h-8 bg-blue-100 dark:bg-blue-900 rounded-full flex items-center justify-center mr-4 flex-shrink-0">
                      <span className="text-blue-600 dark:text-blue-400 font-semibold">3</span>
                    </div>
                    <div>
                      <h4 className="font-semibold text-gray-900 dark:text-white">Planning Meeting</h4>
                      <p className="text-gray-600 dark:text-gray-400 text-sm">
                        Schedule a planning meeting to finalize all the details for your special day.
                      </p>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </motion.div>

          {/* Action Buttons */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.6 }}
            className="flex flex-col sm:flex-row gap-4 justify-center"
          >
            <Link href="/packages">
              <Button variant="outline" className="w-full sm:w-auto">
                <ArrowLeft className="w-4 h-4 mr-2" />
                Back to Packages
              </Button>
            </Link>
            <Link href="/dashboard">
              <Button className="w-full sm:w-auto">
                Go to Dashboard
              </Button>
            </Link>
          </motion.div>
        </div>
      </div>
    </MainLayout>
  )
}
