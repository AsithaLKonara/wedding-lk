"use client"

import { motion } from "framer-motion"
import { VenueCard } from "@/components/molecules/venue-card"
import { Button } from "@/components/ui/button"
import { ArrowRight } from "lucide-react"
import Link from "next/link"

const featuredVenues = [
  {
    id: 1,
    name: "Grand Ballroom Hotel",
    location: "Colombo",
    capacity: 300,
    price: 150000,
    rating: 4.8,
    image: "/placeholder.svg?height=300&width=400",
    amenities: ["Parking", "Catering", "Decoration"],
  },
  {
    id: 2,
    name: "Garden Paradise Resort",
    location: "Kandy",
    capacity: 200,
    price: 120000,
    rating: 4.6,
    image: "/placeholder.svg?height=300&width=400",
    amenities: ["Garden", "Pool", "Accommodation"],
  },
  {
    id: 3,
    name: "Seaside Wedding Villa",
    location: "Galle",
    capacity: 150,
    price: 100000,
    rating: 4.9,
    image: "/placeholder.svg?height=300&width=400",
    amenities: ["Beach View", "Photography", "Catering"],
  },
]

export function FeaturedVenuesSection() {
  return (
    <section className="py-20 bg-white dark:bg-gray-900">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          viewport={{ once: true }}
          className="flex justify-between items-center mb-16"
        >
          <div>
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 dark:text-white mb-4">Featured Venues</h2>
            <p className="text-lg text-gray-600 dark:text-gray-300">Handpicked venues for your perfect wedding day</p>
          </div>
          <Button variant="outline" className="hidden md:flex" asChild>
            <Link href="/venues">
              View All Venues
              <ArrowRight className="ml-2 h-4 w-4" />
            </Link>
          </Button>
        </motion.div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {featuredVenues.map((venue, index) => (
            <motion.div
              key={venue.id}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: index * 0.1 }}
              viewport={{ once: true }}
            >
              <VenueCard {...venue} />
            </motion.div>
          ))}
        </div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.4 }}
          viewport={{ once: true }}
          className="text-center mt-12 md:hidden"
        >
          <Button asChild>
            <Link href="/venues">
              View All Venues
              <ArrowRight className="ml-2 h-4 w-4" />
            </Link>
          </Button>
        </motion.div>
      </div>
    </section>
  )
}
