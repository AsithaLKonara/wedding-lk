"use client"

import { useState, useEffect } from "react"
import { MainLayout } from "@/components/templates/main-layout"

interface Vendor {
  id: number
  name: string
  category: string
  location: string
  rating: number
  reviewCount: number
  priceRange: string
  image: string
}

export default function VendorsPage() {
  const [vendors, setVendors] = useState<Vendor[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const fetchVendors = async () => {
      try {
        setLoading(true)
        const response = await fetch('/api/vendors')
        if (!response.ok) {
          throw new Error('Failed to fetch vendors')
        }
        const data = await response.json()
        
        const transformedVendors = data.data?.map((vendor: any, index: number) => ({
          id: vendor._id || index + 1,
          name: vendor.name || 'Unknown Vendor',
          category: vendor.category || 'General',
          location: vendor.location || 'Unknown Location',
          rating: vendor.rating || 4.0,
          reviewCount: vendor.reviewCount || 0,
          priceRange: vendor.priceRange || 'Contact for pricing',
          image: vendor.images?.[0] || `https://images.unsplash.com/photo-1560472354-b33ff0c44a43?w=400&h=300&fit=crop&${index}`
        })) || []

        setVendors(transformedVendors)
      } catch (err) {
        console.error('Error fetching vendors:', err)
        // Fallback to mock data
        setVendors([
          {
            id: 1,
            name: "Elegant Photography",
            category: "Photographer",
            location: "Colombo",
            rating: 4.8,
            reviewCount: 120,
            priceRange: "LKR 50,000 - 150,000",
            image: "https://images.unsplash.com/photo-1560472354-b33ff0c44a43?w=400&h=300&fit=crop"
          },
          {
            id: 2,
            name: "Blissful Blooms",
            category: "Florist",
            location: "Kandy",
            rating: 4.9,
            reviewCount: 90,
            priceRange: "LKR 30,000 - 100,000",
            image: "https://images.unsplash.com/photo-1578662996442-48f60103fc96?w=400&h=300&fit=crop"
          }
        ])
      } finally {
        setLoading(false)
      }
    }

    fetchVendors()
  }, [])

  return (
    <MainLayout>
      <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
        <div className="bg-white dark:bg-gray-800 border-b">
          <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-8">
            <div className="text-center">
              <h1 className="text-3xl md:text-4xl font-bold text-gray-900 dark:text-white mb-4">
                Find Wedding Vendors
              </h1>
              <p className="text-lg text-gray-600 dark:text-gray-300">
                Connect with trusted professionals for your special day
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
              {vendors.map((vendor) => (
                <div key={vendor.id} className="bg-white dark:bg-gray-800 rounded-lg shadow-sm overflow-hidden hover:shadow-lg transition-shadow duration-300">
                  <img
                    src={vendor.image}
                    alt={vendor.name}
                    className="w-full h-48 object-cover"
                  />
                  <div className="p-6">
                    <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-2">
                      {vendor.name}
                    </h3>
                    <p className="text-gray-600 dark:text-gray-400 mb-2">
                      {vendor.category} • {vendor.location}
                    </p>
                    <div className="flex items-center justify-between mb-4">
                      <div className="flex items-center">
                        <span className="text-yellow-500">★</span>
                        <span className="ml-1 text-gray-600 dark:text-gray-400">
                          {vendor.rating} ({vendor.reviewCount} reviews)
                        </span>
                      </div>
                      <span className="text-blue-600 font-medium">
                        {vendor.priceRange}
                      </span>
                    </div>
                    <button className="w-full bg-blue-600 text-white py-2 px-4 rounded-md hover:bg-blue-700 transition-colors duration-200">
                      View Profile
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