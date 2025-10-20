"use client"

import { useState, useEffect } from "react"
import { Search, MapPin, Star, Heart, Share2, Filter, Grid, List, Camera, Music, Utensils, Car } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { motion, AnimatePresence } from "framer-motion"
import { MainLayout } from "@/components/templates/main-layout"

export default function VendorsPage() {
  const [vendors, setVendors] = useState<any[]>([])
  const [filteredVendors, setFilteredVendors] = useState<any[]>([])
  const [searchQuery, setSearchQuery] = useState("")
  const [selectedCategory, setSelectedCategory] = useState("")
  const [selectedLocation, setSelectedLocation] = useState("")
  const [priceRange, setPriceRange] = useState([0, 200000])
  const [viewMode, setViewMode] = useState<"grid" | "list">("grid")
  const [favorites, setFavorites] = useState<Set<string>>(new Set())

  // Filter vendors based on search criteria
  useEffect(() => {
    let filtered = vendors.filter(vendor => {
      // Search query filter
      if (searchQuery && !vendor.name.toLowerCase().includes(searchQuery.toLowerCase()) && 
          !vendor.location.toLowerCase().includes(searchQuery.toLowerCase()) &&
          !vendor.category.toLowerCase().includes(searchQuery.toLowerCase())) {
        return false
      }
      
      // Category filter
      if (selectedCategory && vendor.category !== selectedCategory) {
        return false
      }
      
      // Location filter
      if (selectedLocation && !vendor.location.toLowerCase().includes(selectedLocation.toLowerCase())) {
        return false
      }
      
      // Price range filter
      const vendorPrice = parseInt(vendor.price.replace(/[^\d]/g, ''))
      if (vendorPrice < priceRange[0] || vendorPrice > priceRange[1]) {
        return false
      }
      
      return true
    })
    
    setFilteredVendors(filtered)
  }, [vendors, searchQuery, selectedCategory, selectedLocation, priceRange])

  useEffect(() => {
    // Simulate API call with timeout
    const timer = setTimeout(() => {
      const mockVendors = [
        {
          id: "1",
          name: "Perfect Moments Photography",
          category: "Photography",
          location: "Colombo",
          rating: 4.9,
          reviews: 156,
          price: "LKR 75,000 - 150,000",
          image: "https://images.unsplash.com/photo-1560472354-b33ff0c44a43?w=800&h=600&fit=crop",
          description: "Award-winning wedding photographers specializing in candid and artistic shots.",
          services: ["Wedding Photography", "Engagement Shoots", "Pre-wedding", "Post-wedding"],
          availability: "Available"
        },
        {
          id: "2",
          name: "Melody Makers DJ",
          category: "Entertainment",
          location: "Kandy",
          rating: 4.8,
          reviews: 89,
          price: "LKR 50,000 - 100,000",
          image: "https://images.unsplash.com/photo-1560472354-b33ff0c44a43?w=800&h=600&fit=crop",
          description: "Professional DJ services with state-of-the-art sound systems and lighting.",
          services: ["DJ Services", "Sound System", "Lighting", "MC Services"],
          availability: "Available"
        },
        {
          id: "3",
          name: "Dream Catering",
          category: "Catering",
          location: "Galle",
          rating: 4.7,
          reviews: 124,
          price: "LKR 2,500 - 5,000",
          image: "https://images.unsplash.com/photo-1560472354-b33ff0c44a43?w=800&h=600&fit=crop",
          description: "Premium catering services with traditional and international cuisine options.",
          services: ["Traditional Cuisine", "International Menu", "Beverages", "Service Staff"],
          availability: "Limited"
        },
        {
          id: "4",
          name: "Luxury Transport",
          category: "Transportation",
          location: "Colombo",
          rating: 4.6,
          reviews: 67,
          price: "LKR 25,000 - 75,000",
          image: "https://images.unsplash.com/photo-1560472354-b33ff0c44a43?w=800&h=600&fit=crop",
          description: "Elegant transportation services for your special day with luxury vehicles.",
          services: ["Wedding Cars", "Guest Transport", "Airport Transfer", "City Tours"],
          availability: "Available"
        },
        {
          id: "5",
          name: "Blissful Blooms",
          category: "Floral Design",
          location: "Bentota",
          rating: 4.8,
          reviews: 92,
          price: "LKR 15,000 - 50,000",
          image: "https://images.unsplash.com/photo-1560472354-b33ff0c44a43?w=800&h=600&fit=crop",
          description: "Creative floral arrangements and decorations for your wedding day.",
          services: ["Bridal Bouquets", "Ceremony Decor", "Reception Centerpieces", "Venue Styling"],
          availability: "Available"
        },
        {
          id: "6",
          name: "Elegant Makeup Studio",
          category: "Beauty & Makeup",
          location: "Colombo",
          rating: 4.9,
          reviews: 178,
          price: "LKR 12,000 - 25,000",
          image: "https://images.unsplash.com/photo-1560472354-b33ff0c44a43?w=800&h=600&fit=crop",
          description: "Professional makeup artists specializing in bridal and wedding party styling.",
          services: ["Bridal Makeup", "Hair Styling", "Bridal Party", "Trial Sessions"],
          availability: "Limited"
        }
      ]
      setVendors(mockVendors)
    }, 100)

    return () => clearTimeout(timer)
  }, [])

  const toggleFavorite = (vendorId: string) => {
    const newFavorites = new Set(favorites)
    if (newFavorites.has(vendorId)) {
      newFavorites.delete(vendorId)
    } else {
      newFavorites.add(vendorId)
    }
    setFavorites(newFavorites)
  }

  const categories = ["Photography", "Entertainment", "Catering", "Transportation", "Floral Design", "Beauty & Makeup"]
  const locations = ["Colombo", "Kandy", "Galle", "Bentota", "Nuwara Eliya"]

  const getCategoryIcon = (category: string) => {
    switch (category) {
      case "Photography": return Camera
      case "Entertainment": return Music
      case "Catering": return Utensils
      case "Transportation": return Car
      default: return Star
    }
  }

  return (
    <MainLayout>
      <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      {/* Header */}
      <header className="bg-white dark:bg-gray-800 shadow-sm">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
            <div>
              <h1 className="text-3xl font-bold text-gray-900 dark:text-white">
                Wedding Vendors
              </h1>
              <p className="text-gray-600 dark:text-gray-400 mt-2">
                Find the best wedding vendors for your special day
              </p>
            </div>
            
            {/* Search Bar */}
            <div className="flex-1 max-w-md">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
                <Input
                  type="text"
                  placeholder="Search vendors, categories, or locations..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="pl-10"
                />
              </div>
            </div>
          </div>
        </div>
      </header>

      <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="flex flex-col lg:flex-row gap-8">
          {/* Filters Sidebar */}
          <div className="lg:w-1/4">
            <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm p-6 sticky top-4">
              <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
                Filter Vendors
              </h3>
              
              {/* Category Filter */}
              <div className="mb-6">
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Category
                </label>
                <select
                  value={selectedCategory}
                  onChange={(e) => setSelectedCategory(e.target.value)}
                  className="w-full p-2 border border-gray-300 dark:border-gray-600 rounded-md bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                >
                  <option value="">All Categories</option>
                  {categories.map(category => (
                    <option key={category} value={category}>{category}</option>
                  ))}
                </select>
              </div>

              {/* Location Filter */}
              <div className="mb-6">
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Location
                </label>
                <select
                  value={selectedLocation}
                  onChange={(e) => setSelectedLocation(e.target.value)}
                  className="w-full p-2 border border-gray-300 dark:border-gray-600 rounded-md bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                >
                  <option value="">All Locations</option>
                  {locations.map(location => (
                    <option key={location} value={location}>{location}</option>
                  ))}
                </select>
              </div>

              {/* Price Range */}
              <div className="mb-6">
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Price Range (LKR)
                </label>
                <div className="space-y-2">
                  <input
                    type="range"
                    min="0"
                    max="200000"
                    step="10000"
                    value={priceRange[1]}
                    onChange={(e) => setPriceRange([priceRange[0], parseInt(e.target.value)])}
                    className="w-full"
                  />
                  <div className="flex justify-between text-sm text-gray-600 dark:text-gray-400">
                    <span>LKR {priceRange[0].toLocaleString()}</span>
                    <span>LKR {priceRange[1].toLocaleString()}</span>
                  </div>
                </div>
              </div>

              <Button className="w-full">
                <Filter className="h-4 w-4 mr-2" />
                Apply Filters
              </Button>
            </div>
          </div>

          {/* Vendors Grid/List */}
          <div className="lg:w-3/4">
            <div className="flex justify-between items-center mb-6">
              <p className="text-gray-600 dark:text-gray-400">
                Showing {filteredVendors.length} of {vendors.length} vendors
              </p>
              <div className="flex items-center gap-2">
                <Button
                  variant={viewMode === "grid" ? "default" : "outline"}
                  size="sm"
                  onClick={() => setViewMode("grid")}
                >
                  <Grid className="h-4 w-4" />
                </Button>
                <Button
                  variant={viewMode === "list" ? "default" : "outline"}
                  size="sm"
                  onClick={() => setViewMode("list")}
                >
                  <List className="h-4 w-4" />
                </Button>
              </div>
            </div>

            <AnimatePresence>
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className={viewMode === "grid" 
                  ? "grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6"
                  : "space-y-6"
                }
              >
                {filteredVendors.map((vendor, index) => {
                  const CategoryIcon = getCategoryIcon(vendor.category)
                  return (
                    <motion.div
                      key={vendor.id}
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: index * 0.1 }}
                      className={`bg-white dark:bg-gray-800 rounded-lg shadow-sm overflow-hidden hover:shadow-lg transition-shadow duration-200 ${
                        viewMode === "list" ? "flex" : ""
                      }`}
                    >
                      <div className={`relative ${viewMode === "list" ? "w-1/3" : "w-full"}`}>
                        <img
                          src={vendor.image}
                          alt={vendor.name}
                          className={`object-cover ${viewMode === "list" ? "h-48" : "h-48 w-full"}`}
                        />
                        <button
                          onClick={() => toggleFavorite(vendor.id)}
                          className="absolute top-3 right-3 p-2 bg-white dark:bg-gray-800 rounded-full shadow-sm hover:shadow-md transition-shadow"
                        >
                          <Heart 
                            className={`h-4 w-4 ${
                              favorites.has(vendor.id) 
                                ? "fill-red-500 text-red-500" 
                                : "text-gray-400 hover:text-red-500"
                            }`} 
                          />
                        </button>
                        <Badge 
                          variant={vendor.availability === "Available" ? "default" : "secondary"}
                          className="absolute top-3 left-3"
                        >
                          {vendor.availability}
                        </Badge>
                        <div className="absolute bottom-3 left-3">
                          <div className="flex items-center bg-white dark:bg-gray-800 rounded-lg px-2 py-1 shadow-sm">
                            <CategoryIcon className="h-4 w-4 text-gray-600 dark:text-gray-400 mr-1" />
                            <span className="text-xs font-medium text-gray-900 dark:text-white">
                              {vendor.category}
                            </span>
                          </div>
                        </div>
                      </div>
                      
                      <div className={`p-6 ${viewMode === "list" ? "flex-1" : ""}`}>
                        <div className="flex items-start justify-between mb-2">
                          <h3 className="text-xl font-semibold text-gray-900 dark:text-white">
                            {vendor.name}
                          </h3>
                          <button className="p-1 text-gray-400 hover:text-gray-600 dark:hover:text-gray-300">
                            <Share2 className="h-4 w-4" />
                          </button>
                        </div>
                        
                        <div className="flex items-center text-gray-600 dark:text-gray-400 mb-2">
                          <MapPin className="h-4 w-4 mr-1" />
                          <span>{vendor.location}</span>
                        </div>
                        
                        <div className="flex items-center mb-3">
                          <Star className="h-4 w-4 text-yellow-400 fill-current mr-1" />
                          <span className="text-sm font-medium text-gray-900 dark:text-white">
                            {vendor.rating}
                          </span>
                          <span className="text-sm text-gray-600 dark:text-gray-400 ml-1">
                            ({vendor.reviews} reviews)
                          </span>
                        </div>
                        
                        <p className="text-gray-700 dark:text-gray-300 mb-4 text-sm">
                          {vendor.description}
                        </p>
                        
                        <div className="flex flex-wrap gap-2 mb-4">
                          {vendor.services.slice(0, 2).map((service: string) => (
                            <Badge key={service} variant="secondary" className="text-xs">
                              {service}
                            </Badge>
                          ))}
                          {vendor.services.length > 2 && (
                            <Badge variant="outline" className="text-xs">
                              +{vendor.services.length - 2} more
                            </Badge>
                          )}
                        </div>
                        
                        <div className="flex items-center justify-between">
                          <div>
                            <p className="text-lg font-semibold text-gray-900 dark:text-white">
                              {vendor.price}
                            </p>
                            <p className="text-sm text-gray-600 dark:text-gray-400">
                              per service
                            </p>
                          </div>
                          <Button>
                            View Details
                          </Button>
                        </div>
                      </div>
                    </motion.div>
                  )
                })}
              </motion.div>
            </AnimatePresence>

            {filteredVendors.length === 0 && (
              <div className="text-center py-12">
                <div className="text-gray-400 mb-4">
                  <Search className="h-12 w-12 mx-auto" />
                </div>
                <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-2">
                  No vendors found
                </h3>
                <p className="text-gray-600 dark:text-gray-400">
                  Try adjusting your search criteria or filters
                </p>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Footer */}
      <footer className="bg-gray-900 text-white py-12 mt-16">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
            <div>
              <h3 className="text-lg font-semibold mb-4">Wedding.lk</h3>
              <p className="text-gray-400 text-sm">
                Your one-stop destination for planning the perfect wedding in Sri Lanka.
              </p>
            </div>
            <div>
              <h4 className="font-medium mb-4">Services</h4>
              <ul className="space-y-2 text-sm text-gray-400">
                <li>Venues</li>
                <li>Vendors</li>
                <li>Planning Tools</li>
                <li>Inspiration</li>
              </ul>
            </div>
            <div>
              <h4 className="font-medium mb-4">Support</h4>
              <ul className="space-y-2 text-sm text-gray-400">
                <li>Help Center</li>
                <li>Contact Us</li>
                <li>FAQ</li>
                <li>Community</li>
              </ul>
            </div>
            <div>
              <h4 className="font-medium mb-4">Connect</h4>
              <ul className="space-y-2 text-sm text-gray-400">
                <li>Facebook</li>
                <li>Instagram</li>
                <li>Twitter</li>
                <li>YouTube</li>
              </ul>
            </div>
          </div>
          <div className="border-t border-gray-800 mt-8 pt-8 text-center text-gray-400">
            <p>© 2024 Wedding.lk. All rights reserved.</p>
          </div>
        </div>
      </footer>
      </div>
    </MainLayout>
  )
}
