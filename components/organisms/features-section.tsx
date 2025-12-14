"use client"

import { motion } from "framer-motion"
import { FeatureCard } from "@/components/molecules/feature-card"
import { Calendar, MapPin, Users, Heart, Camera, Music } from "lucide-react"

const features = [
  {
    icon: Calendar,
    title: "Event Planning",
    description: "Comprehensive timeline and checklist management for your wedding day.",
  },
  {
    icon: MapPin,
    title: "Venue Discovery",
    description: "Find and book the perfect venue from our curated collection.",
  },
  {
    icon: Users,
    title: "Vendor Network",
    description: "Connect with trusted photographers, caterers, and decorators.",
  },
  {
    icon: Heart,
    title: "Guest Management",
    description: "Manage invitations, RSVPs, and seating arrangements effortlessly.",
  },
  {
    icon: Camera,
    title: "Photo Sharing",
    description: "Create shared albums for guests to upload and share memories.",
  },
  {
    icon: Music,
    title: "Entertainment",
    description: "Book DJs, bands, and entertainment for your special day.",
  },
]

export function FeaturesSection() {
  return (
    <section className="py-20 sm:py-32">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div
          initial={{ y: 50, opacity: 0 }}
          whileInView={{ y: 0, opacity: 1 }}
          transition={{ duration: 0.8 }}
          viewport={{ once: true }}
          className="text-center"
        >
          <h2 className="text-3xl font-bold tracking-tight text-gray-900 dark:text-white sm:text-4xl">
            Everything You Need for Your Perfect Day
          </h2>
          <p className="mt-4 text-lg text-gray-600 dark:text-gray-300">
            Our platform provides all the tools and services to plan your dream wedding
          </p>
        </motion.div>

        <div className="mt-16 grid grid-cols-1 gap-8 sm:grid-cols-2 lg:grid-cols-3">
          {features.map((feature, index) => (
            <motion.div
              key={feature.title}
              initial={{ y: 50, opacity: 0 }}
              whileInView={{ y: 0, opacity: 1 }}
              transition={{ duration: 0.6, delay: index * 0.1 }}
              viewport={{ once: true }}
            >
              <FeatureCard {...feature} />
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  )
}


export default FeaturesSection
