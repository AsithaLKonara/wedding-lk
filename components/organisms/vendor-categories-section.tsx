"use client"

import { motion } from "framer-motion"
import { VendorCategoryCard } from "@/components/molecules/vendor-category-card"

const categories = [
  {
    title: "Photography & Videography",
    count: "200+ vendors",
    image: "/placeholder.svg?height=300&width=400",
    description: "Professional photographers and videographers",
  },
  {
    title: "Catering Services",
    count: "150+ vendors",
    image: "/placeholder.svg?height=300&width=400",
    description: "Delicious catering for all tastes",
  },
  {
    title: "Wedding Decorations",
    count: "180+ vendors",
    image: "/placeholder.svg?height=300&width=400",
    description: "Beautiful decorations and flowers",
  },
  {
    title: "Entertainment",
    count: "100+ vendors",
    image: "/placeholder.svg?height=300&width=400",
    description: "DJs, bands, and live entertainment",
  },
]

interface VendorCategoriesSectionProps {
  [key: string]: any;
}

export default function VendorCategoriesSection(props: VendorCategoriesSectionProps) {
  return (
    <section className="py-20 bg-gray-50 dark:bg-gray-800">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          viewport={{ once: true }}
          className="text-center mb-16"
        >
          <h2 className="text-3xl md:text-4xl font-bold text-gray-900 dark:text-white mb-4">Browse by Category</h2>
          <p className="text-lg text-gray-600 dark:text-gray-300 max-w-2xl mx-auto">
            Find the perfect vendors for every aspect of your wedding
          </p>
        </motion.div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {categories.map((category, index) => (
            <motion.div
              key={category.title}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: index * 0.1 }}
              viewport={{ once: true }}
            >
              <VendorCategoryCard {...category} />
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  )
}
