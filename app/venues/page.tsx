"use client"

import { useState } from "react"
import { MainLayout } from "@/components/templates/main-layout"
import { motion } from "framer-motion"
import VenueFilters from "@/components/organisms/venue-filters"
import VenueGrid from "@/components/organisms/venue-grid"
import SearchHeader from "@/components/organisms/search-header"

export default function VenuesPage() {
  const [filters, setFilters] = useState({
    location: "",
    priceRange: [0, 500000],
    capacity: "",
    amenities: [],
    rating: 0,
  })

  const [sortBy, setSortBy] = useState("popular")
  const [viewMode, setViewMode] = useState("grid")

  return (
    <MainLayout>
      <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
        <SearchHeader />

        <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="flex flex-col lg:flex-row gap-8"
          >
            {/* Filters Sidebar */}
            <div className="lg:w-1/4">
              <VenueFilters filters={filters} onFiltersChange={setFilters} />
            </div>

            {/* Main Content */}
            <div className="lg:w-3/4">
              <VenueGrid
                filters={filters}
                sortBy={sortBy}
                onSortChange={setSortBy}
                viewMode={viewMode}
                onViewModeChange={setViewMode}
              />
            </div>
          </motion.div>
        </div>
      </div>
    </MainLayout>
  )
}
