"use client"

import { Button } from "@/components/ui/button"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Badge } from "@/components/ui/badge"
import { Filter, X } from "lucide-react"
import { motion } from "framer-motion"

interface GalleryFiltersProps {
  selectedCategory: string
  selectedVenue: string
  onCategoryChange: (category: string) => void
  onVenueChange: (venue: string) => void
}

const categories = [
  { id: "all", label: "All Photos", count: 1250 },
  { id: "ceremonies", label: "Ceremonies", count: 320 },
  { id: "receptions", label: "Receptions", count: 280 },
  { id: "decorations", label: "Decorations", count: 195 },
  { id: "venues", label: "Venues", count: 165 },
  { id: "couples", label: "Couples", count: 145 },
  { id: "traditional", label: "Traditional", count: 125 },
  { id: "modern", label: "Modern", count: 95 },
]

const venues = [
  { id: "all", label: "All Venues" },
  { id: "cinnamon-grand", label: "Cinnamon Grand Colombo" },
  { id: "galle-face", label: "Galle Face Hotel" },
  { id: "kingsbury", label: "The Kingsbury" },
  { id: "hilton-colombo", label: "Hilton Colombo" },
  { id: "taj-samudra", label: "Taj Samudra" },
  { id: "shangri-la", label: "Shangri-La Colombo" },
  { id: "jetwing-blue", label: "Jetwing Blue Negombo" },
  { id: "heritance-kandalama", label: "Heritance Kandalama" },
]

export function GalleryFilters({
  selectedCategory,
  selectedVenue,
  onCategoryChange,
  onVenueChange,
}: GalleryFiltersProps) {
  const activeFilters = []
  if (selectedCategory !== "all") {
    const category = categories.find((c) => c.id === selectedCategory)
    if (category) activeFilters.push({ type: "category", value: category.label })
  }
  if (selectedVenue !== "all") {
    const venue = venues.find((v) => v.id === selectedVenue)
    if (venue) activeFilters.push({ type: "venue", value: venue.label })
  }

  const clearFilter = (type: string) => {
    if (type === "category") onCategoryChange("all")
    if (type === "venue") onVenueChange("all")
  }

  const clearAllFilters = () => {
    onCategoryChange("all")
    onVenueChange("all")
  }

  return (
    <div className="space-y-6">
      {/* Filter Controls */}
      <div className="flex flex-col lg:flex-row gap-4 items-start lg:items-center justify-between">
        <div className="flex flex-wrap gap-3">
          <Select value={selectedCategory} onValueChange={onCategoryChange}>
            <SelectTrigger className="w-[200px]">
              <Filter className="h-4 w-4 mr-2" />
              <SelectValue placeholder="Category" />
            </SelectTrigger>
            <SelectContent>
              {categories.map((category) => (
                <SelectItem key={category.id} value={category.id}>
                  <div className="flex items-center justify-between w-full">
                    <span>{category.label}</span>
                    <Badge variant="secondary" className="ml-2">
                      {category.count}
                    </Badge>
                  </div>
                </SelectItem>
              ))}
            </SelectContent>
          </Select>

          <Select value={selectedVenue} onValueChange={onVenueChange}>
            <SelectTrigger className="w-[200px]">
              <SelectValue placeholder="Venue" />
            </SelectTrigger>
            <SelectContent>
              {venues.map((venue) => (
                <SelectItem key={venue.id} value={venue.id}>
                  {venue.label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        {activeFilters.length > 0 && (
          <Button variant="outline" size="sm" onClick={clearAllFilters} className="text-gray-600 hover:text-gray-900">
            Clear All
          </Button>
        )}
      </div>

      {/* Category Pills */}
      <div className="flex flex-wrap gap-2">
        {categories.map((category) => (
          <motion.button
            key={category.id}
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={() => onCategoryChange(category.id)}
            className={`px-4 py-2 rounded-full text-sm font-medium transition-all duration-200 ${
              selectedCategory === category.id
                ? "bg-rose-500 text-white shadow-lg"
                : "bg-white text-gray-700 border border-gray-200 hover:border-rose-300 hover:text-rose-600"
            }`}
          >
            {category.label}
            <Badge
              variant="secondary"
              className={`ml-2 ${
                selectedCategory === category.id ? "bg-white/20 text-white" : "bg-gray-100 text-gray-600"
              }`}
            >
              {category.count}
            </Badge>
          </motion.button>
        ))}
      </div>

      {/* Active Filters */}
      {activeFilters.length > 0 && (
        <div className="flex flex-wrap gap-2 items-center">
          <span className="text-sm text-gray-600 font-medium">Active filters:</span>
          {activeFilters.map((filter, index) => (
            <Badge key={index} variant="secondary" className="flex items-center gap-1 px-3 py-1">
              {filter.value}
              <button onClick={() => clearFilter(filter.type)} className="ml-1 hover:bg-gray-300 rounded-full p-0.5">
                <X className="h-3 w-3" />
              </button>
            </Badge>
          ))}
        </div>
      )}
    </div>
  )
}


export default GalleryFilters
