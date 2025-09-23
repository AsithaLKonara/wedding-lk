"use client"

import dynamic from "next/dynamic"

import { useState } from "react"
import { MainLayout } from "@/components/templates/main-layout"

import { motion } from "framer-motion"

const VendorFilters = dynamic(() => import("@/components/organisms/vendor-filters"), { ssr: false })

const VendorGrid = dynamic(() => import("@/components/organisms/vendor-grid"), { ssr: false })

const VendorCategories = dynamic(() => import("@/components/organisms/vendor-categories"), { ssr: false })

export default function VendorsPage() {
  const [selectedCategory, setSelectedCategory] = useState("all")
  const [filters, setFilters] = useState({
    location: "",
    priceRange: [0, 200000],
    rating: 0,
    experience: "",
  })

  return (
    <MainLayout>
      <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
        <div className="bg-white dark:bg-gray-800 border-b">
          <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-8">
            <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6 }}>
              <h1 className="text-3xl md:text-4xl font-bold text-gray-900 dark:text-white mb-4">
                Find Wedding Vendors
              </h1>
              <p className="text-lg text-gray-600 dark:text-gray-300">
                Connect with trusted professionals for your special day
              </p>
            </motion.div>
          </div>
        </div>

        <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="mb-8"
          >
            <VendorCategories selectedCategory={selectedCategory} onCategoryChange={setSelectedCategory} />
          </motion.div>

          <div className="flex flex-col lg:flex-row gap-8">
            <div className="lg:w-1/4">
              <VendorFilters filters={filters} onFiltersChange={setFilters} />
            </div>

            <div className="lg:w-3/4">
              <VendorGrid category={selectedCategory} filters={filters} />
            </div>
          </div>
        </div>
      </div>
    </MainLayout>
  )
}
