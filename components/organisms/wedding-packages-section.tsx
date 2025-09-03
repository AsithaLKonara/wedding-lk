"use client"

import { motion } from "framer-motion"
import { WeddingPackageCard } from "@/components/molecules/wedding-package-card"
import { Button } from "@/components/ui/button"
import { Sparkles, Crown, Star, Award } from "lucide-react"
import { useRouter } from "next/navigation"
import { useEffect, useState } from "react"

interface Venue {
  _id: string
  name: string
  rating: { average: number; count: number }
  images: string[]
}

interface Vendor {
  _id: string
  name: string
  businessName: string
  category: string
  rating: { average: number; count: number }
}

interface WeddingPackage {
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
  venues: Array<{ 
    _id: string
    name: string
    rating: number
    image: string 
  }>
  vendors: Array<{ 
    _id: string
    name: string
    businessName: string
    category: string
    rating: any
  }>
}

export default function WeddingPackagesSection() {
  const router = useRouter()
  const [packages, setPackages] = useState<WeddingPackage[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const generateWeddingPackages = async () => {
      try {
        // Fetch featured venues and vendors
        const [venuesResponse, vendorsResponse] = await Promise.all([
          fetch('/api/home/featured-venues'),
          fetch('/api/home/featured-vendors')
        ])

        if (venuesResponse.ok && vendorsResponse.ok) {
          const venuesData = await venuesResponse.json()
          const vendorsData = await vendorsResponse.json()

          const featuredVenues = venuesData.venues || []
          const featuredVendors = vendorsData.vendors || []

          // Generate dynamic wedding packages based on available data
          const generatedPackages: WeddingPackage[] = [
            {
              id: 1,
              title: "Premium Elite Package",
              subtitle: "Top-rated venues & vendors",
              price: 850000,
              originalPrice: 1200000,
              rating: 4.9,
              reviewCount: 156,
              badge: "Most Popular",
              badgeColor: "bg-gradient-to-r from-yellow-400 to-orange-500",
              icon: Crown,
              features: [
                "5-star luxury venue (4.8+ rating)",
                "Award-winning photographer",
                "Premium catering (50+ menu options)",
                "Live band & DJ services",
                "Bridal suite & decoration",
                "Wedding coordinator",
                "Transportation for couple",
                "Honeymoon package included",
              ],
              venues: featuredVenues.slice(0, 3).map((venue: any) => ({
                _id: venue._id,
                name: venue.name,
                rating: venue.rating?.average || 0,
                image: venue.images?.[0] || '/placeholder.jpg'
              })),
              vendors: featuredVendors.slice(0, 3).map((vendor: any) => ({
                _id: vendor._id,
                name: vendor.name,
                businessName: vendor.businessName,
                category: vendor.category,
                rating: vendor.rating
              }))
            },
            {
              id: 2,
              title: "Luxury Complete Package",
              subtitle: "High-rated premium experience",
              price: 650000,
              originalPrice: 900000,
              rating: 4.7,
              reviewCount: 203,
              badge: "Best Value",
              badgeColor: "bg-gradient-to-r from-green-400 to-blue-500",
              icon: Star,
              features: [
                "4-star venue (4.5+ rating)",
                "Professional photographer",
                "Quality catering service",
                "DJ & sound system",
                "Basic decoration package",
                "Wedding planning assistance",
                "Bridal makeup included",
                "Guest accommodation discount",
              ],
              venues: featuredVenues.slice(3, 6).map((venue: any) => ({
                _id: venue._id,
                name: venue.name,
                rating: venue.rating?.average || 0,
                image: venue.images?.[0] || '/placeholder.jpg'
              })),
              vendors: featuredVendors.slice(3, 6).map((vendor: any) => ({
                _id: vendor._id,
                name: vendor.name,
                businessName: vendor.businessName,
                category: vendor.category,
                rating: vendor.rating
              }))
            },
            {
              id: 3,
              title: "Essential Wedding Package",
              subtitle: "Quality venues & trusted vendors",
              price: 450000,
              originalPrice: 650000,
              rating: 4.5,
              reviewCount: 89,
              badge: "Great Start",
              badgeColor: "bg-gradient-to-r from-purple-400 to-pink-500",
              icon: Award,
              features: [
                "Good venue (4.0+ rating)",
                "Experienced photographer",
                "Standard catering menu",
                "Music & sound system",
                "Simple decoration",
                "Basic planning support",
                "Digital photo album",
                "Wedding cake included",
              ],
              venues: featuredVenues.slice(6, 9).map((venue: any) => ({
                _id: venue._id,
                name: venue.name,
                rating: venue.rating?.average || 0,
                image: venue.images?.[0] || '/placeholder.jpg'
              })),
              vendors: featuredVendors.slice(6, 9).map((vendor: any) => ({
                _id: vendor._id,
                name: vendor.name,
                businessName: vendor.businessName,
                category: vendor.category,
                rating: vendor.rating
              }))
            }
          ]

          setPackages(generatedPackages)
        }
      } catch (error) {
        console.error('Error fetching wedding package data:', error)
        // Fallback to default packages if API fails
        setPackages(getDefaultPackages())
      } finally {
        setLoading(false)
      }
    }

    generateWeddingPackages()
  }, [])

  const getDefaultPackages = (): WeddingPackage[] => [
    // Default packages with placeholder data
    {
      id: 1,
      title: "Premium Elite Package",
      subtitle: "Top-rated venues & vendors",
      price: 850000,
      originalPrice: 1200000,
      rating: 4.9,
      reviewCount: 156,
      badge: "Most Popular",
      badgeColor: "bg-gradient-to-r from-yellow-400 to-orange-500",
      icon: Crown,
      features: [
        "5-star luxury venue (4.8+ rating)",
        "Award-winning photographer",
        "Premium catering (50+ menu options)",
        "Live band & DJ services",
        "Bridal suite & decoration",
        "Wedding coordinator",
        "Transportation for couple",
        "Honeymoon package included",
      ],
      venues: [],
      vendors: []
    },
    {
      id: 2,
      title: "Luxury Complete Package",
      subtitle: "High-rated premium experience",
      price: 650000,
      originalPrice: 900000,
      rating: 4.7,
      reviewCount: 203,
      badge: "Best Value",
      badgeColor: "bg-gradient-to-r from-green-400 to-blue-500",
      icon: Star,
      features: [
        "4-star venue (4.5+ rating)",
        "Professional photographer",
        "Quality catering service",
        "DJ & sound system",
        "Basic decoration package",
        "Wedding planning assistance",
        "Bridal makeup included",
        "Guest accommodation discount",
      ],
      venues: [],
      vendors: []
    },
    {
      id: 3,
      title: "Essential Wedding Package",
      subtitle: "Quality venues & trusted vendors",
      price: 450000,
      originalPrice: 650000,
      rating: 4.5,
      reviewCount: 89,
      badge: "Great Start",
      badgeColor: "bg-gradient-to-r from-purple-400 to-pink-500",
      icon: Award,
      features: [
        "Good venue (4.0+ rating)",
        "Experienced photographer",
        "Standard catering menu",
        "Music & sound system",
        "Simple decoration",
        "Basic planning support",
        "Digital photo album",
        "Wedding cake included",
      ],
      venues: [],
      vendors: []
    }
  ]

  if (loading) {
    return (
      <section className="py-20 bg-gradient-to-br from-gray-50 to-white dark:from-gray-900 dark:to-gray-800">
        <div className="container mx-auto px-4">
          <div className="text-center">
            <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-pink-500 mx-auto"></div>
            <p className="mt-4 text-gray-600">Loading wedding packages...</p>
          </div>
        </div>
      </section>
    )
  }

  return (
    <section className="py-20 bg-gradient-to-br from-gray-50 to-white dark:from-gray-900 dark:to-gray-800">
      <div className="container mx-auto px-4">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="text-center mb-16"
        >
          <div className="flex items-center justify-center mb-4">
            <Sparkles className="h-8 w-8 text-pink-500 mr-2" />
            <h2 className="text-4xl font-bold bg-gradient-to-r from-pink-500 to-purple-600 bg-clip-text text-transparent">
              AI-Recommended Wedding Packages
            </h2>
          </div>
          <p className="text-xl text-gray-600 dark:text-gray-300 max-w-3xl mx-auto">
            Discover perfectly curated wedding packages tailored to your preferences, 
            featuring our top-rated venues and trusted vendors
          </p>
        </motion.div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {packages.map((pkg, index) => (
            <motion.div
              key={pkg.id}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: index * 0.2 }}
            >
              <WeddingPackageCard package={pkg} />
            </motion.div>
          ))}
        </div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.6 }}
          className="text-center mt-12"
        >
          <Button
            onClick={() => router.push('/packages/custom')}
            size="lg"
            className="bg-gradient-to-r from-pink-500 to-purple-600 hover:from-pink-600 hover:to-purple-700 text-white px-8 py-3"
          >
            Create Custom Package
          </Button>
        </motion.div>
      </div>
    </section>
  )
}
