"use client"

import { motion } from "framer-motion"
import { VendorCategoryCard } from "@/components/molecules/vendor-category-card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
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
          if (data.success && (data.featured || data.all)) {
            const rawCategories = data.featured || data.all
            const mappedCategories = rawCategories.map((cat: any) => ({
              _id: cat._id || cat.value,
              name: cat.label || cat._id,
              description: `Top-rated ${cat._id} services in Sri Lanka`,
              icon: getCategoryIcon(cat._id || cat.value),
              vendorCount: cat.count || 0,
              averageRating: 4.5 + Math.random() * 0.5,
              popularServices: [`Professional ${cat._id}`]
            }))
            setCategories(mappedCategories)
          }
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

  const getCategoryIcon = (category: string): string => {
    const icons: Record<string, string> = {
      'photographer': '📸',
      'photography': '📸',
      'decorator': '🌸',
      'decoration': '🌸',
      'catering': '🍽️',
      'music': '🎵',
      'entertainment': '🎵',
      'makeup': '💄',
      'beauty': '💄',
      'transport': '🚗',
      'transportation': '🚗',
      'jewelry': '💎',
      'venue': '🏛️',
      'planner': '📋'
    }
    return icons[category.toLowerCase()] || '✨'
  }

  if (loading) {
    return (
      <section className="py-24 bg-background">
        <div className="container mx-auto px-4">
          <div className="flex flex-col items-center justify-center space-y-4">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-rose-500"></div>
            <p className="text-muted-foreground animate-pulse">Gathering categories...</p>
          </div>
        </div>
      </section>
    )
  }

  return (
    <section className="py-24 bg-background relative overflow-hidden">
      <div className="absolute bottom-0 right-0 w-[600px] h-[600px] bg-purple-500/5 rounded-full blur-[120px] translate-y-1/2 translate-x-1/3" />

      <div className="container mx-auto px-4 relative z-10">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          viewport={{ once: true }}
          className="text-center mb-20"
        >
          <div className="inline-flex items-center px-4 py-1.5 rounded-full bg-purple-500/10 text-purple-500 text-sm font-bold mb-6 tracking-wide uppercase">
            Specialized Services
          </div>
          <h2 className="text-4xl md:text-6xl font-bold mb-8 tracking-tight">
            Explore <span className="gradient-text">Vendor Categories</span>
          </h2>
          <p className="text-xl text-muted-foreground max-w-3xl mx-auto leading-relaxed">
            Discover specialized vendors for every aspect of your perfect wedding, from traditional dancers to modern photographers.
          </p>
        </motion.div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-10">
          {categories.map((category, index) => (
            <motion.div
              key={category._id}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: index * 0.1 }}
              viewport={{ once: true }}
              className="group cursor-pointer"
              onClick={() => router.push(`/vendors?category=${category._id}`)}
            >
              <div className="relative aspect-[4/3] rounded-[2rem] overflow-hidden mb-6 shadow-xl transition-all duration-500 group-hover:shadow-2xl group-hover:shadow-purple-500/20 group-hover:-translate-y-2">
                <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent z-10" />
                <div className="absolute inset-0 bg-purple-500/20 opacity-0 group-hover:opacity-100 transition-opacity duration-500 z-20" />
                
                {/* Placeholder/Icon representation since actual images might be missing */}
                <div className="absolute inset-0 flex items-center justify-center bg-muted text-8xl group-hover:scale-110 transition-transform duration-700">
                  {category.icon}
                </div>

                <div className="absolute bottom-0 left-0 right-0 p-8 z-30 transform translate-y-2 group-hover:translate-y-0 transition-transform duration-500">
                  <div className="flex items-center justify-between mb-2">
                    <h3 className="text-2xl font-bold text-white tracking-tight">
                      {category.name}
                    </h3>
                    <Badge className="bg-white/20 hover:bg-white/30 text-white backdrop-blur-md border-none">
                      {category.vendorCount} Vendors
                    </Badge>
                  </div>
                  <p className="text-white/70 text-sm line-clamp-2 opacity-0 group-hover:opacity-100 transition-opacity duration-500">
                    {category.description}
                  </p>
                </div>
              </div>
            </motion.div>
          ))}
        </div>

        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.6 }}
          viewport={{ once: true }}
          className="text-center mt-20"
        >
          <Button
            onClick={() => router.push('/vendors')}
            size="lg"
            variant="outline"
            className="px-12 h-14 rounded-full border-2 hover:bg-foreground hover:text-background transition-all duration-300 font-bold tracking-wide"
          >
            Discover All Vendors
          </Button>
        </motion.div>
      </div>
    </section>
  )
}
 