"use client"

import { motion } from "framer-motion"
import { VendorCategoryCard } from "@/components/molecules/vendor-category-card"
import { Button } from "@/components/ui/button"
import { useRouter } from "next/navigation"
import { useEffect, useState } from "react"

interface VendorCategory {
  _id: string
  name: string
  description: string
  icon: string
  vendorCount: number
  averageRating: number
  popularServices: string[]
}

export default function VendorCategoriesSection() {
  const router = useRouter()
  const [categories, setCategories] = useState<VendorCategory[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const fetchVendorCategories = async () => {
      try {
        const response = await fetch('/api/vendors/categories')
        if (response.ok) {
          const data = await response.json()
          setCategories(data.categories || [])
        }
      } catch (error) {
        console.error('Error fetching vendor categories:', error)
        // Fallback to default categories
        setCategories(getDefaultCategories())
      } finally {
        setLoading(false)
      }
    }

    fetchVendorCategories()
  }, [])

  const getDefaultCategories = (): VendorCategory[] => [
    {
      _id: "photographer",
      name: "Photography",
      description: "Capture your special moments with professional photographers",
      icon: "📸",
      vendorCount: 25,
      averageRating: 4.8,
      popularServices: ["Wedding Photography", "Engagement Shoots", "Photo Albums"]
    },
    {
      _id: "decorator",
      name: "Decoration",
      description: "Transform venues with stunning floral and decor arrangements",
      icon: "🌸",
      vendorCount: 18,
      averageRating: 4.7,
      popularServices: ["Floral Arrangements", "Venue Decoration", "Wedding Arches"]
    },
    {
      _id: "catering",
      name: "Catering",
      description: "Delight your guests with exquisite culinary experiences",
      icon: "🍽️",
      vendorCount: 32,
      averageRating: 4.6,
      popularServices: ["Wedding Buffet", "Plated Dinners", "Wedding Cakes"]
    },
    {
      _id: "music",
      name: "Entertainment",
      description: "Set the perfect mood with live music and DJ services",
      icon: "🎵",
      vendorCount: 15,
      averageRating: 4.9,
      popularServices: ["Live Bands", "DJ Services", "String Quartets"]
    },
    {
      _id: "makeup",
      name: "Beauty",
      description: "Look your best with professional makeup and styling",
      icon: "💄",
      vendorCount: 22,
      averageRating: 4.7,
      popularServices: ["Bridal Makeup", "Hair Styling", "Bridal Party"]
    },
    {
      _id: "transport",
      name: "Transportation",
      description: "Arrive in style with luxury wedding transportation",
      icon: "🚗",
      vendorCount: 12,
      averageRating: 4.5,
      popularServices: ["Luxury Cars", "Wedding Buses", "VIP Transport"]
    }
  ]

  if (loading) {
    return (
      <section className="py-20 bg-white dark:bg-gray-900">
        <div className="container mx-auto px-4">
          <div className="text-center">
            <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-pink-500 mx-auto"></div>
            <p className="mt-4 text-gray-600">Loading vendor categories...</p>
          </div>
        </div>
      </section>
    )
  }

  return (
    <section className="py-20 bg-white dark:bg-gray-900">
      <div className="container mx-auto px-4">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="text-center mb-16"
        >
          <h2 className="text-4xl font-bold text-gray-900 dark:text-white mb-4">
            Explore Vendor Categories
          </h2>
          <p className="text-xl text-gray-600 dark:text-gray-300 max-w-3xl mx-auto">
            Discover specialized vendors for every aspect of your perfect wedding
          </p>
        </motion.div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {categories.map((category, index) => (
            <motion.div
              key={category._id}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: index * 0.1 }}
            >
              <VendorCategoryCard 
                title={category.name}
                count={`${category.vendorCount} vendors`}
                image={`/api/vendors/categories/${category._id}/image`}
                description={category.description}
              />
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
            onClick={() => router.push('/vendors')}
            size="lg"
            variant="outline"
            className="px-8 py-3"
          >
              View All Vendors
          </Button>
        </motion.div>
      </div>
    </section>
  )
} 