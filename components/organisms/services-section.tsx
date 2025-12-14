"use client"

import { motion } from "framer-motion"
import { ServiceCard } from "@/components/molecules/service-card"
import { MapPin, Users, Camera, Music, Utensils, Flower } from "lucide-react"

const services = [
  {
    icon: MapPin,
    title: "Venues",
    description: "Find the perfect location for your special day",
    color: "from-pink-500 to-rose-500",
    count: "500+",
  },
  {
    icon: Camera,
    title: "Photography",
    description: "Capture every precious moment beautifully",
    color: "from-purple-500 to-indigo-500",
    count: "200+",
  },
  {
    icon: Utensils,
    title: "Catering",
    description: "Delicious food for your guests to enjoy",
    color: "from-blue-500 to-cyan-500",
    count: "150+",
  },
  {
    icon: Music,
    title: "Entertainment",
    description: "DJs, bands, and entertainment services",
    color: "from-green-500 to-emerald-500",
    count: "100+",
  },
  {
    icon: Flower,
    title: "Decoration",
    description: "Beautiful decorations and floral arrangements",
    color: "from-yellow-500 to-orange-500",
    count: "180+",
  },
  {
    icon: Users,
    title: "Planning",
    description: "Professional wedding planning services",
    color: "from-red-500 to-pink-500",
    count: "50+",
  },
]

export default function ServicesSection(props: any) {
  return (
    <section className="py-20 bg-white dark:bg-gray-900">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          viewport={{ once: true }}
          className="text-center mb-16"
        >
          <h2 className="text-3xl md:text-4xl font-bold text-gray-900 dark:text-white mb-4">
            Everything You Need for Your Wedding
          </h2>
          <p className="text-lg text-gray-600 dark:text-gray-300 max-w-2xl mx-auto">
            From venues to vendors, we have everything to make your wedding day perfect
          </p>
        </motion.div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {services.map((service, index) => (
            <motion.div
              key={service.title}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: index * 0.1 }}
              viewport={{ once: true }}
            >
              <ServiceCard {...service} />
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  )
}
