"use client"

import dynamic from "next/dynamic"

import { MainLayout } from "@/components/templates/main-layout"

const VenueHero = dynamic(() => import("@/components/organisms/venue-hero"), { ssr: false })
const VenueDetails = dynamic(() => import("@/components/organisms/venue-details"), { ssr: false })
const VenueGallery = dynamic(() => import("@/components/organisms/venue-gallery"), { ssr: false })
const VenueReviews = dynamic(() => import("@/components/organisms/venue-reviews"), { ssr: false })
const SimilarVenues = dynamic(() => import("@/components/organisms/similar-venues"), { ssr: false })
const VenueBooking = dynamic(() => import("@/components/organisms/venue-booking"), { ssr: false })

import { motion } from "framer-motion"

interface VenuePageProps {
  params: Promise<{
    id: string
  }>
}

export default async function VenuePage({ params }: VenuePageProps) {
  const { id } = await params
  
  const venue = {
    id,
    name: "Grand Ballroom at Hilton",
    location: "Colombo",
    price: 150000,
    capacity: 300,
    rating: 4.8,
    reviewCount: 156,
    description: "Elegant ballroom with stunning city views, perfect for your dream wedding.",
    amenities: ["Parking", "Catering", "Decoration", "Music System", "Photography"],
    images: [
      "/placeholder.svg?height=400&width=600",
      "/placeholder.svg?height=400&width=600",
      "/placeholder.svg?height=400&width=600",
    ],
    contact: {
      phone: "+94771234567",
      email: "events@hilton.lk",
      website: "www.hilton.lk",
    },
  }

  return (
    <MainLayout>
      <div className="min-h-screen bg-white dark:bg-gray-900">
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6 }}>
          <VenueHero venue={venue} />
        </motion.div>

        <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="grid lg:grid-cols-3 gap-8">
            <div className="lg:col-span-2 space-y-8">
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: 0.2 }}
              >
                <VenueDetails venue={venue} />
              </motion.div>

              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: 0.4 }}
              >
                <VenueGallery images={venue.images} />
              </motion.div>

              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: 0.6 }}
              >
                <VenueReviews venueId={venue.id} />
              </motion.div>

              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: 0.8 }}
              >
                <SimilarVenues currentVenueId={venue.id} />
              </motion.div>
            </div>

            <div className="lg:col-span-1">
              <motion.div
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.6, delay: 0.3 }}
                className="sticky top-24"
              >
                <VenueBooking venue={venue} />
              </motion.div>
            </div>
          </div>
        </div>
      </div>
    </MainLayout>
  )
}
