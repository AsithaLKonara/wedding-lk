"use client"

interface GalleryFiltersProps {
  selectedCategory: string
  selectedVenue: string
  onCategoryChange: (category: string) => void
  onVenueChange: (venue: string) => void
}

export default function GalleryFilters({
  selectedCategory,
  selectedVenue,
  onCategoryChange,
  onVenueChange,
}: GalleryFiltersProps) {
  const categories = [
    { id: "all", name: "All Photos" },
    { id: "ceremony", name: "Ceremony" },
    { id: "reception", name: "Reception" },
    { id: "pre-wedding", name: "Pre-Wedding" },
    { id: "engagement", name: "Engagement" },
  ]

  const venues = [
    { id: "all", name: "All Venues" },
    { id: "hotel", name: "Hotels" },
    { id: "garden", name: "Garden Venues" },
    { id: "beach", name: "Beach Venues" },
    { id: "traditional", name: "Traditional Venues" },
  ]

  return (
    <div className="flex flex-wrap gap-4 justify-center">
      <div className="flex flex-wrap gap-2">
        {categories.map((category) => (
          <button
            key={category.id}
            onClick={() => onCategoryChange(category.id)}
            className={`px-4 py-2 rounded-full text-sm font-medium transition-colors ${
              selectedCategory === category.id
                ? "bg-blue-600 text-white"
                : "bg-gray-200 text-gray-700 hover:bg-gray-300 dark:bg-gray-700 dark:text-gray-300 dark:hover:bg-gray-600"
            }`}
          >
            {category.name}
          </button>
        ))}
      </div>
      
      <div className="flex flex-wrap gap-2">
        {venues.map((venue) => (
          <button
            key={venue.id}
            onClick={() => onVenueChange(venue.id)}
            className={`px-4 py-2 rounded-full text-sm font-medium transition-colors ${
              selectedVenue === venue.id
                ? "bg-green-600 text-white"
                : "bg-gray-200 text-gray-700 hover:bg-gray-300 dark:bg-gray-700 dark:text-gray-300 dark:hover:bg-gray-600"
            }`}
          >
            {venue.name}
          </button>
        ))}
      </div>
    </div>
  )
}