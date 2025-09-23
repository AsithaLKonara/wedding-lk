"use client"

import { motion } from "framer-motion"
import { WeddingPackageCard } from "@/components/molecules/wedding-package-card"
import { Button } from "@/components/ui/button"
import { Sparkles, Crown, Star, Award } from "lucide-react"
import { useRouter } from "next/navigation"

interface WeddingPackagesSectionProps {
  [key: string]: any;
}

export default function WeddingPackagesSection(props: WeddingPackagesSectionProps) {
  const router = useRouter()
  const packages = [
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
      venues: [
        { name: "Grand Ballroom Hotel", rating: 4.9, image: "/placeholder.svg?height=100&width=150" },
        { name: "Royal Garden Resort", rating: 4.8, image: "/placeholder.svg?height=100&width=150" },
        { name: "Ocean View Palace", rating: 4.9, image: "/placeholder.svg?height=100&width=150" },
      ],
      vendors: [
        { name: "Perfect Moments Photography", category: "Photography", rating: 4.9 },
        { name: "Elite Catering Co.", category: "Catering", rating: 4.8 },
        { name: "Harmony Live Band", category: "Entertainment", rating: 4.9 },
      ],
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
      venues: [
        { name: "City Center Ballroom", rating: 4.7, image: "/placeholder.svg?height=100&width=150" },
        { name: "Garden Paradise Resort", rating: 4.6, image: "/placeholder.svg?height=100&width=150" },
        { name: "Lakeside Pavilion", rating: 4.8, image: "/placeholder.svg?height=100&width=150" },
      ],
      vendors: [
        { name: "Creative Lens Studio", category: "Photography", rating: 4.7 },
        { name: "Delicious Catering", category: "Catering", rating: 4.6 },
        { name: "Party DJ Services", category: "Entertainment", rating: 4.7 },
      ],
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
      venues: [
        { name: "Community Hall Deluxe", rating: 4.5, image: "/placeholder.svg?height=100&width=150" },
        { name: "Suburban Garden Venue", rating: 4.3, image: "/placeholder.svg?height=100&width=150" },
        { name: "Heritage Banquet Hall", rating: 4.6, image: "/placeholder.svg?height=100&width=150" },
      ],
      vendors: [
        { name: "Moments Photography", category: "Photography", rating: 4.5 },
        { name: "Tasty Treats Catering", category: "Catering", rating: 4.4 },
        { name: "Sound & Music Co.", category: "Entertainment", rating: 4.5 },
      ],
    },
  ]

  return (
    <section className="py-20 bg-gradient-to-br from-gray-50 to-purple-50 dark:from-gray-900 dark:to-purple-900/20">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          viewport={{ once: true }}
          className="text-center mb-16"
        >
          <div className="inline-flex items-center bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm rounded-full px-4 py-2 mb-6">
            <Sparkles className="h-4 w-4 text-purple-500 mr-2" />
            <span className="text-sm font-medium text-gray-700 dark:text-gray-300">AI-Curated Packages</span>
          </div>

          <h2 className="text-3xl md:text-4xl font-bold text-gray-900 dark:text-white mb-4">
            Complete Wedding Packages
          </h2>
          <p className="text-lg text-gray-600 dark:text-gray-300 max-w-3xl mx-auto">
            Carefully curated packages featuring top-rated venues and vendors based on your preferences and budget
          </p>
        </motion.div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {packages.map((pkg, index) => (
            <motion.div
              key={pkg.id}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: index * 0.2 }}
              viewport={{ once: true }}
            >
              <WeddingPackageCard package={pkg} />
            </motion.div>
          ))}
        </div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.8 }}
          viewport={{ once: true }}
          className="text-center mt-12"
        >
          <Button size="lg" variant="outline" className="mr-4" onClick={() => router.push("/packages/compare")}>
            Compare All Packages
          </Button>
          <Button
            size="lg"
            className="bg-gradient-to-r from-pink-500 to-purple-600"
            onClick={() => router.push("/packages/custom")}
          >
            Create Custom Package
          </Button>
        </motion.div>
      </div>
    </section>
  )
}
