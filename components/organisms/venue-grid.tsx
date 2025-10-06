"use client"

import { useState, useEffect } from 'react'

interface VenueGridProps {
  filters: any
  sortBy: string
  onSortChange: (sortBy: string) => void
  viewMode: string
  onViewModeChange: (viewMode: string) => void
}

interface Venue {
  id: number
  name: string
  location: string
  price: number
  capacity: number
  rating: number
  image: string
  amenities: string[]
}

export default function VenueGrid({ 
  filters, 
  sortBy, 
  onSortChange, 
  viewMode, 
  onViewModeChange 
}: VenueGridProps) {
  const [venues, setVenues] = useState<Venue[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  // Fetch venues from API
  useEffect(() => {
    const fetchVenues = async () => {
      try {
        setLoading(true)
        const response = await fetch('/api/venues')
        if (!response.ok) {
          throw new Error('Failed to fetch venues')
        }
        const data = await response.json()
        
        // Transform API data to match component interface
        const transformedVenues = data.data?.map((venue: any, index: number) => ({
          id: venue._id || index + 1,
          name: venue.name || 'Unknown Venue',
          location: venue.location || 'Unknown Location',
          price: venue.price || 100000,
          capacity: venue.capacity || 100,
          rating: venue.rating || 4.0,
          image: venue.images?.[0] || `https://images.unsplash.com/photo-1519741497674-611481863552?w=400&h=300&fit=crop&${index}`,
          amenities: venue.amenities || ['Basic Amenities']
        })) || []

        setVenues(transformedVenues)
      } catch (err) {
        console.error('Error fetching venues:', err)
        setError(err instanceof Error ? err.message : 'Failed to load venues')
        // Fallback to mock data
        const mockVenues = [
          {
            id: 1,
            name: "Grand Ballroom Hotel",
            location: "Colombo",
            price: 150000,
            capacity: 200,
            rating: 4.5,
            image: "https://images.unsplash.com/photo-1519741497674-611481863552?w=400&h=300&fit=crop",
            amenities: ["Parking", "Air Conditioning", "Catering"],
          },
          {
            id: 2,
            name: "Garden Paradise",
            location: "Kandy",
            price: 120000,
            capacity: 150,
            rating: 4.8,
            image: "https://images.unsplash.com/photo-1511285560929-80b456fea0bc?w=400&h=300&fit=crop",
            amenities: ["Garden", "Photography", "Decoration"],
          },
          {
            id: 3,
            name: "Beach Resort",
            location: "Galle",
            price: 200000,
            capacity: 300,
            rating: 4.2,
            image: "https://images.unsplash.com/photo-1465495976277-4387d4b0e4a6?w=400&h=300&fit=crop",
            amenities: ["Beach Access", "Sound System", "Lighting"],
          },
        ]
        setVenues(mockVenues)
      } finally {
        setLoading(false)
      }
    }

    fetchVenues()
  }, [filters])

  if (loading) {
    return (
      <div className="space-y-6">
        <div className="flex justify-center items-center h-64">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
        </div>
      </div>
    )
  }

  if (error) {
    return (
      <div className="space-y-6">
        <div className="bg-red-50 border border-red-200 rounded-md p-4">
          <p className="text-red-800">Error: {error}</p>
          <p className="text-red-600 text-sm mt-1">Showing mock data instead.</p>
        </div>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      {/* Header with sort and view options */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h2 className="text-2xl font-bold text-gray-900 dark:text-white">
            Wedding Venues
          </h2>
          <p className="text-gray-600 dark:text-gray-400">
            {venues.length} venues found
          </p>
        </div>
        
        <div className="flex items-center gap-4">
          {/* Sort dropdown */}
          <select
            value={sortBy}
            onChange={(e) => onSortChange(e.target.value)}
            className="px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent dark:bg-gray-700 dark:text-white"
          >
            <option value="popular">Most Popular</option>
            <option value="price-low">Price: Low to High</option>
            <option value="price-high">Price: High to Low</option>
            <option value="rating">Highest Rated</option>
            <option value="capacity">Largest Capacity</option>
          </select>
          
          {/* View mode toggle */}
          <div className="flex border border-gray-300 dark:border-gray-600 rounded-md">
            <button
              onClick={() => onViewModeChange("grid")}
              className={`px-3 py-2 text-sm ${
                viewMode === "grid"
                  ? "bg-blue-600 text-white"
                  : "bg-white dark:bg-gray-700 text-gray-700 dark:text-gray-300"
              }`}
            >
              Grid
            </button>
            <button
              onClick={() => onViewModeChange("list")}
              className={`px-3 py-2 text-sm ${
                viewMode === "list"
                  ? "bg-blue-600 text-white"
                  : "bg-white dark:bg-gray-700 text-gray-700 dark:text-gray-300"
              }`}
            >
              List
            </button>
          </div>
        </div>
      </div>

      {/* Venue Grid */}
      <div className={`grid gap-6 ${
        viewMode === "grid" 
          ? "grid-cols-1 md:grid-cols-2 lg:grid-cols-3" 
          : "grid-cols-1"
      }`}>
        {venues.map((venue) => (
          <div
            key={venue.id}
            className="bg-white dark:bg-gray-800 rounded-lg shadow-sm overflow-hidden hover:shadow-lg transition-shadow duration-300"
          >
            <img
              src={venue.image}
              alt={venue.name}
              className="w-full h-48 object-cover"
            />
            <div className="p-6">
              <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-2">
                {venue.name}
              </h3>
              <p className="text-gray-600 dark:text-gray-400 mb-2">
                {venue.location}
              </p>
              <div className="flex items-center justify-between mb-4">
                <span className="text-2xl font-bold text-blue-600">
                  LKR {venue.price.toLocaleString()}
                </span>
                <div className="flex items-center">
                  <span className="text-yellow-500">★</span>
                  <span className="ml-1 text-gray-600 dark:text-gray-400">
                    {venue.rating}
                  </span>
                </div>
              </div>
              <div className="flex items-center justify-between text-sm text-gray-600 dark:text-gray-400 mb-4">
                <span>Capacity: {venue.capacity} guests</span>
              </div>
              <div className="flex flex-wrap gap-2 mb-4">
                {venue.amenities.slice(0, 3).map((amenity) => (
                  <span
                    key={amenity}
                    className="px-2 py-1 bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 text-xs rounded-full"
                  >
                    {amenity}
                  </span>
                ))}
                {venue.amenities.length > 3 && (
                  <span className="px-2 py-1 bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 text-xs rounded-full">
                    +{venue.amenities.length - 3} more
                  </span>
                )}
              </div>
              <button className="w-full bg-blue-600 text-white py-2 px-4 rounded-md hover:bg-blue-700 transition-colors duration-200">
                View Details
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}
