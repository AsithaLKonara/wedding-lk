"use client"

import { useState, useEffect } from 'react'

interface VendorGridProps {
  category: string;
  filters: {
    location: string;
    priceRange: number[];
    rating: number;
    experience: string;
  };
}

interface Vendor {
  id: number
  name: string
  category: string
  location: string
  rating: number
  reviewCount: number
  priceRange: string
  image: string
  contact: {
    phone: string
    email: string
    website: string
  }
}

export default function VendorGrid({ category, filters }: VendorGridProps) {
  const [vendors, setVendors] = useState<Vendor[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  // Fetch vendors from API
  useEffect(() => {
    const fetchVendors = async () => {
      try {
        setLoading(true)
        const response = await fetch('/api/vendors')
        if (!response.ok) {
          throw new Error('Failed to fetch vendors')
        }
        const data = await response.json()
        
        // Transform API data to match component interface
        const transformedVendors = data.data?.map((vendor: any, index: number) => ({
          id: vendor._id || index + 1,
          name: vendor.name || 'Unknown Vendor',
          category: vendor.category || 'General',
          location: vendor.location || 'Unknown Location',
          rating: vendor.rating || 4.0,
          reviewCount: vendor.reviewCount || 0,
          priceRange: vendor.priceRange || 'Contact for pricing',
          image: vendor.images?.[0] || `https://images.unsplash.com/photo-1560472354-b33ff0c44a43?w=400&h=300&fit=crop&${index}`,
          contact: {
            phone: vendor.contact?.phone || 'Not provided',
            email: vendor.contact?.email || 'Not provided',
            website: vendor.contact?.website || 'Not provided'
          }
        })) || []

        // Filter by category if specified
        const filteredVendors = category && category !== 'all' 
          ? transformedVendors.filter((vendor: Vendor) => 
              vendor.category.toLowerCase().includes(category.toLowerCase())
            )
          : transformedVendors

        setVendors(filteredVendors)
      } catch (err) {
        console.error('Error fetching vendors:', err)
        setError(err instanceof Error ? err.message : 'Failed to load vendors')
        // Fallback to mock data
        const mockVendors = [
          {
            id: 1,
            name: "Elegant Photography",
            category: "Photographer",
            location: "Colombo",
            rating: 4.8,
            reviewCount: 120,
            priceRange: "LKR 50,000 - 150,000",
            image: "https://images.unsplash.com/photo-1560472354-b33ff0c44a43?w=400&h=300&fit=crop",
            contact: {
              phone: "0771234567",
              email: "info@elegantphoto.lk",
              website: "elegantphoto.lk"
            }
          },
          {
            id: 2,
            name: "Blissful Blooms",
            category: "Florist",
            location: "Kandy",
            rating: 4.9,
            reviewCount: 90,
            priceRange: "LKR 30,000 - 100,000",
            image: "https://images.unsplash.com/photo-1578662996442-48f60103fc96?w=400&h=300&fit=crop",
            contact: {
              phone: "0719876543",
              email: "info@blissfulblooms.lk",
              website: "blissfulblooms.lk"
            }
          }
        ]
        setVendors(mockVendors)
      } finally {
        setLoading(false)
      }
    }

    fetchVendors()
  }, [category, filters])

  if (loading) {
    return (
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
    )
  }

  if (error) {
    return (
      <div className="bg-red-50 border border-red-200 rounded-md p-4 mb-6">
        <p className="text-red-800">Error: {error}</p>
        <p className="text-red-600 text-sm mt-1">Showing mock data instead.</p>
      </div>
    )
  }

  return (
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
            <div className="flex gap-2">
              <button className="flex-1 bg-blue-600 text-white py-2 px-4 rounded-md hover:bg-blue-700 transition-colors duration-200">
                View Profile
              </button>
              <button className="px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-md hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors duration-200">
                Contact
              </button>
            </div>
          </div>
        </div>
      ))}
    </div>
  );
}