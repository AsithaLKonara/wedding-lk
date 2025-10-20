"use client"

import dynamic from "next/dynamic"

import { MainLayout } from "@/components/templates/main-layout"

const VendorProfile = dynamic(() => import("@/components/organisms/vendor-profile"), { ssr: false })
const VendorPortfolio = dynamic(() => import("@/components/organisms/vendor-portfolio"), { ssr: false })
const VendorReviews = dynamic(() => import("@/components/organisms/vendor-reviews"), { ssr: false })
const VendorContact = dynamic(() => import("@/components/organisms/vendor-contact"), { ssr: false })

import { motion } from "framer-motion"

interface VendorPageProps {
  params: {
    id: string
  }
}

export default async function VendorPage({ params }: VendorPageProps) {
  const { id } = params
  
  const vendor = {
    id,
    name: "Perfect Moments Photography",
    category: "Photography",
    location: "Colombo",
    rating: 4.9,
    reviewCount: 89,
    experience: "8 years",
    price: 75000,
    avatar: "/placeholder.svg?height=150&width=150",
    coverImage: "/placeholder.svg?height=400&width=800",
    description: "Professional wedding photographer specializing in candid moments and artistic compositions.",
    services: ["Wedding Photography", "Pre-wedding Shoots", "Event Coverage", "Photo Editing"],
    portfolio: [
      "/placeholder.svg?height=300&width=400",
      "/placeholder.svg?height=300&width=400",
      "/placeholder.svg?height=300&width=400",
    ],
    contact: {
      phone: "+94771234567",
      email: "info@perfectmoments.lk",
      website: "www.perfectmoments.lk",
    },
  }

  return (
    <MainLayout>
      <div className="min-h-screen bg-white dark:bg-gray-900">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-8 grid lg:grid-cols-3 gap-8">
          <div className="lg:col-span-2">
            <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6 }}>
              <VendorProfile vendor={vendor} />
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.2 }}
            >
              <VendorPortfolio portfolio={vendor.portfolio} />
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.4 }}
            >
              <VendorReviews vendorId={vendor.id} />
            </motion.div>
          </div>

          <div className="lg:col-span-1">
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.6, delay: 0.3 }}
              className="sticky top-24"
            >
              <VendorContact vendor={vendor} />
            </motion.div>
          </div>
        </div>
      </div>
    </MainLayout>
  )
}
