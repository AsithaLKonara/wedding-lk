"use client"

import React from "react"
import { useState } from "react"
import { MainLayout } from "@/components/templates/main-layout"
import { GalleryFilters } from "@/components/organisms/gallery-filters"
import { PhotoGrid } from "@/components/organisms/photo-grid"
import { motion } from "framer-motion"

export default function GalleryPage() {
  const [selectedCategory, setSelectedCategory] = useState("all")
  const [selectedVenue, setSelectedVenue] = useState("all")

  return (
    <MainLayout>
      <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
        <div className="bg-white dark:bg-gray-800 border-b">
          <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-8">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
              className="text-center"
            >
              <h1 className="text-3xl md:text-4xl font-bold text-gray-900 dark:text-white mb-4">Wedding Gallery</h1>
              <p className="text-lg text-gray-600 dark:text-gray-300">
                Get inspired by beautiful weddings from our venues and vendors
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
            <GalleryFilters
              selectedCategory={selectedCategory}
              selectedVenue={selectedVenue}
              onCategoryChange={setSelectedCategory}
              onVenueChange={setSelectedVenue}
            />
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.4 }}
          >
            <PhotoGrid category={selectedCategory} venue={selectedVenue} />
          </motion.div>
        </div>
      </div>
    </MainLayout>
  )
}

// Prevent static generation and force dynamic rendering
export const dynamic = 'force-dynamic'
