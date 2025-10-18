"use client"

import { useState, useEffect } from "react"
import { MainLayout } from "@/components/templates/main-layout"

interface Venue {
  id: number
  name: string
  location: string
  price: number
  capacity: number
  rating: number
  image: string
}

export default function VenuesPage() {
  const [venues, setVenues] = useState<Venue[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const fetchVenues = async () => {
      try {
        setLoading(true)
        const response = await fetch('/api/venues')
        if (!response.ok) {
          throw new Error('Failed to fetch venues')
        }
        const data = await response.json()
        
        const transformedVenues = data.data?.map((venue: any, index: number) => ({
          id: venue._id || index + 1,
          name: venue.name || 'Unknown Venue',
          location: venue.location || 'Unknown Location',
          price: venue.price || 0,
          capacity: venue.capacity || 0,
          rating: venue.rating || 4.0,
          image: venue.images?.[0] || `https://images.unsplash.com/photo-1519741497674-611481863552?w=400&h=300&fit=crop&${index}`
        })) || []

        setVenues(transformedVenues)
      } catch (err) {
        console.error('Error fetching venues:', err)
        // Fallback to mock data
        setVenues([
          {
            id: 1,
            name: "Grand Ballroom",
            location: "Colombo",
            price: 150000,
            capacity: 300,
            rating: 4.8,
            image: "https://images.unsplash.com/photo-1519741497674-611481863552?w=400&h=300&fit=crop"
          },
          {
            id: 2,
            name: "Garden Paradise",
            location: "Kandy",
            price: 200000,
            capacity: 250,
            rating: 4.9,
            image: "https://images.unsplash.com/photo-1532712938310-fd79c48d5f1d?w=400&h=300&fit=crop"
          }
        ])
      } finally {
        setLoading(false)
      }
    }

    fetchVenues()
  }, [])

  return (
    <MainLayout>
      <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
        <div className="bg-white dark:bg-gray-800 border-b">
          <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-8">
            <div className="text-center">
              <h1 className="text-3xl md:text-4xl font-bold text-gray-900 dark:text-white mb-4">
                Find Your Perfect Wedding Venue
              </h1>
              <p className="text-lg text-gray-600 dark:text-gray-300">
                Discover beautiful venues across Sri Lanka for your special day
              </p>
            </div>
          </div>
        </div>

        <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-8">
          {loading ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {[...Array(6)].map((_, i) => (
                <div key={i} className="bg-white dark:bg-gray-800 rounded-lg shadow-sm overflow-hidden animate-pulse">
                  <div className="h-48 bg-gray-200 dark:bg-gray-700"></div>
                  <div className="p-6">
                    <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded mb-2"></div>
                    <div className="h-3 bg-gray-200 dark:bg-gray-700 rounded mb-4"></div>
                    <div className="h-8 bg-gray-200 dark:bg-gray-700 rounded"></div>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {venues.map((venue) => (
                <div key={venue.id} className="bg-white dark:bg-gray-800 rounded-lg shadow-sm overflow-hidden hover:shadow-lg transition-shadow duration-300">
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
                      {venue.location} • Capacity: {venue.capacity} guests
                    </p>
                    <div className="flex items-center justify-between mb-4">
                      <div className="flex items-center">
                        <span className="text-yellow-500">★</span>
                        <span className="ml-1 text-gray-600 dark:text-gray-400">
                          {venue.rating}
                        </span>
                      </div>
                      <span className="text-blue-600 font-medium">
                        LKR {venue.price.toLocaleString()}
                      </span>
                    </div>
                    <button className="w-full bg-blue-600 text-white py-2 px-4 rounded-md hover:bg-blue-700 transition-colors duration-200">
                      View Details
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </MainLayout>
  )
}