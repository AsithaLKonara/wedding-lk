"use client"

import { useState, useEffect } from "react"
import { Search, MapPin, Users, Star, Heart, Share2, Filter, Grid, List } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { motion, AnimatePresence } from "framer-motion"
import { MainLayout } from "@/components/templates/main-layout"

export default function VenuesPage() {
  const [venues, setVenues] = useState<any[]>([])
  const [filteredVenues, setFilteredVenues] = useState<any[]>([])
  const [searchQuery, setSearchQuery] = useState("")
  const [selectedLocation, setSelectedLocation] = useState("")
  const [selectedCapacity, setSelectedCapacity] = useState("")
  const [priceRange, setPriceRange] = useState([0, 500000])
  const [selectedAmenities, setSelectedAmenities] = useState<string[]>([])
  const [viewMode, setViewMode] = useState<"grid" | "list">("grid")
  const [favorites, setFavorites] = useState<Set<string>>(new Set())

  // Filter venues based on search criteria
  useEffect(() => {
    let filtered = venues.filter(venue => {
      // Search query filter
      if (searchQuery && !venue.name.toLowerCase().includes(searchQuery.toLowerCase()) && 
          !venue.location.toLowerCase().includes(searchQuery.toLowerCase())) {
        return false
      }
      
      // Location filter
      if (selectedLocation && !venue.location.toLowerCase().includes(selectedLocation.toLowerCase())) {
        return false
      }
      
      // Capacity filter
      if (selectedCapacity) {
        const [min, max] = selectedCapacity.split('-').map(Number)
        const venueCapacity = venue.capacity.split('-').map(Number)
        if (venueCapacity[0] > max || venueCapacity[1] < min) {
          return false
        }
      }
      
      // Price range filter
      const venuePrice = parseInt(venue.price.replace(/[^\d]/g, ''))
      if (venuePrice < priceRange[0] || venuePrice > priceRange[1]) {
        return false
      }
      
      // Amenities filter
      if (selectedAmenities.length > 0) {
        const hasAllAmenities = selectedAmenities.every(amenity => 
          venue.amenities.includes(amenity)
        )
        if (!hasAllAmenities) {
          return false
        }
      }
      
      return true
    })
    
    setFilteredVenues(filtered)
  }, [venues, searchQuery, selectedLocation, selectedCapacity, priceRange, selectedAmenities])

  useEffect(() => {
    // Simulate API call with timeout
    const timer = setTimeout(() => {
      const mockVenues = [
        {
          id: "1",
          name: "Grand Ballroom Hotel",
          location: "Colombo 07",
          capacity: "500-1000",
          price: "LKR 450,000 - 800,000",
          rating: 4.8,
          reviews: 124,
          image: "https://images.unsplash.com/photo-1519167758481-83f29c0c0b8a?w=800&h=600&fit=crop",
          description: "Elegant ballroom with crystal chandeliers and marble floors, perfect for grand weddings.",
          amenities: ["Air Conditioning", "Parking", "Catering", "Sound System"],
          availability: "Available"
        },
        {
          id: "2", 
          name: "Beachfront Bliss Resort",
          location: "Bentota",
          capacity: "200-400",
          price: "LKR 300,000 - 600,000",
          rating: 4.9,
          reviews: 89,
          image: "https://images.unsplash.com/photo-1519167758481-83f29c0c0b8a?w=800&h=600&fit=crop",
          description: "Stunning beachfront venue with ocean views and tropical gardens.",
          amenities: ["Beach Access", "Garden", "Catering", "Photography Spots"],
          availability: "Available"
        },
        {
          id: "3",
          name: "Garden Pavilion",
          location: "Kandy",
          capacity: "150-300",
          price: "LKR 200,000 - 400,000", 
          rating: 4.7,
          reviews: 67,
          image: "https://images.unsplash.com/photo-1519167758481-83f29c0c0b8a?w=800&h=600&fit=crop",
          description: "Beautiful garden venue surrounded by lush greenery and mountain views.",
          amenities: ["Garden", "Parking", "Catering", "Natural Scenery"],
          availability: "Limited"
        },
        {
          id: "4",
          name: "Royal Palace Hall",
          location: "Galle",
          capacity: "300-600",
          price: "LKR 350,000 - 700,000",
          rating: 4.6,
          reviews: 92,
          image: "https://images.unsplash.com/photo-1519167758481-83f29c0c0b8a?w=800&h=600&fit=crop",
          description: "Historic venue with colonial architecture and traditional charm.",
          amenities: ["Historic Setting", "Air Conditioning", "Parking", "Cultural Heritage"],
          availability: "Available"
        },
        {
          id: "5",
          name: "Mountain View Resort",
          location: "Nuwara Eliya",
          capacity: "100-250",
          price: "LKR 250,000 - 500,000",
          rating: 4.8,
          reviews: 45,
          image: "https://images.unsplash.com/photo-1519167758481-83f29c0c0b8a?w=800&h=600&fit=crop",
          description: "Scenic mountain venue with cool climate and breathtaking views.",
          amenities: ["Mountain Views", "Cool Climate", "Parking", "Natural Beauty"],
          availability: "Available"
        },
        {
          id: "6",
          name: "Luxury City Venue",
          location: "Colombo 03",
          capacity: "400-800",
          price: "LKR 500,000 - 1,000,000",
          rating: 4.9,
          reviews: 156,
          image: "https://images.unsplash.com/photo-1519167758481-83f29c0c0b8a?w=800&h=600&fit=crop",
          description: "Premium urban venue with modern amenities and city skyline views.",
          amenities: ["City Views", "Air Conditioning", "Valet Parking", "Premium Catering"],
          availability: "Limited"
        }
      ]
      setVenues(mockVenues)
    }, 100)

    return () => clearTimeout(timer)
  }, [])

  const toggleFavorite = (venueId: string) => {
    const newFavorites = new Set(favorites)
    if (newFavorites.has(venueId)) {
      newFavorites.delete(venueId)
    } else {
      newFavorites.add(venueId)
    }
    setFavorites(newFavorites)
  }

  const locations = ["Colombo", "Bentota", "Kandy", "Galle", "Nuwara Eliya"]
  const capacities = ["100-250", "200-400", "300-600", "400-800", "500-1000"]

  return (
    <MainLayout>
      <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      {/* Header */}
      <header className="bg-white dark:bg-gray-800 shadow-sm">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
            <div>
              <h1 className="text-3xl font-bold text-gray-900 dark:text-white">
                Wedding Venues
              </h1>
              <p className="text-gray-600 dark:text-gray-400 mt-2">
                Find the perfect venue for your special day
              </p>
            </div>
            
            {/* Search Bar */}
            <div className="flex-1 max-w-md">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
                <Input
                  type="text"
                  placeholder="Search venues or locations..."
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
                Filter Venues
              </h3>
              
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

              {/* Capacity Filter */}
              <div className="mb-6">
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Capacity
                </label>
                <select
                  value={selectedCapacity}
                  onChange={(e) => setSelectedCapacity(e.target.value)}
                  className="w-full p-2 border border-gray-300 dark:border-gray-600 rounded-md bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                >
                  <option value="">Any Capacity</option>
                  {capacities.map(capacity => (
                    <option key={capacity} value={capacity}>{capacity} guests</option>
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
                    max="1000000"
                    step="50000"
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

              {/* Amenities Filter */}
              <div className="mb-6">
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Amenities
                </label>
                <div className="space-y-2">
                  {["Air Conditioning", "Parking", "Catering", "Garden", "Beach Access"].map(amenity => (
                    <label key={amenity} className="flex items-center">
                      <input 
                        type="checkbox" 
                        className="mr-2"
                        checked={selectedAmenities.includes(amenity)}
                        onChange={(e) => {
                          if (e.target.checked) {
                            setSelectedAmenities([...selectedAmenities, amenity])
                          } else {
                            setSelectedAmenities(selectedAmenities.filter(a => a !== amenity))
                          }
                        }}
                      />
                      <span className="text-sm text-gray-700 dark:text-gray-300">{amenity}</span>
                    </label>
                  ))}
                </div>
              </div>

              <Button className="w-full">
                <Filter className="h-4 w-4 mr-2" />
                Apply Filters
              </Button>
            </div>
          </div>

          {/* Venues Grid/List */}
          <div className="lg:w-3/4">
            <div className="flex justify-between items-center mb-6">
              <p className="text-gray-600 dark:text-gray-400">
                Showing {filteredVenues.length} of {venues.length} venues
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
                {filteredVenues.map((venue, index) => (
                  <motion.div
                    key={venue.id}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: index * 0.1 }}
                    className={`bg-white dark:bg-gray-800 rounded-lg shadow-sm overflow-hidden hover:shadow-lg transition-shadow duration-200 ${
                      viewMode === "list" ? "flex" : ""
                    }`}
                  >
                    <div className={`relative ${viewMode === "list" ? "w-1/3" : "w-full"}`}>
                      <img
                        src={venue.image}
                        alt={venue.name}
                        className={`object-cover ${viewMode === "list" ? "h-48" : "h-48 w-full"}`}
                      />
                      <button
                        onClick={() => toggleFavorite(venue.id)}
                        className="absolute top-3 right-3 p-2 bg-white dark:bg-gray-800 rounded-full shadow-sm hover:shadow-md transition-shadow"
                      >
                        <Heart 
                          className={`h-4 w-4 ${
                            favorites.has(venue.id) 
                              ? "fill-red-500 text-red-500" 
                              : "text-gray-400 hover:text-red-500"
                          }`} 
                        />
                      </button>
                      <Badge 
                        variant={venue.availability === "Available" ? "default" : "secondary"}
                        className="absolute top-3 left-3"
                      >
                        {venue.availability}
                      </Badge>
                    </div>
                    
                    <div className={`p-6 ${viewMode === "list" ? "flex-1" : ""}`}>
                      <div className="flex items-start justify-between mb-2">
                        <h3 className="text-xl font-semibold text-gray-900 dark:text-white">
                          {venue.name}
                        </h3>
                        <button className="p-1 text-gray-400 hover:text-gray-600 dark:hover:text-gray-300">
                          <Share2 className="h-4 w-4" />
                        </button>
                      </div>
                      
                      <div className="flex items-center text-gray-600 dark:text-gray-400 mb-2">
                        <MapPin className="h-4 w-4 mr-1" />
                        <span>{venue.location}</span>
                      </div>
                      
                      <div className="flex items-center text-gray-600 dark:text-gray-400 mb-2">
                        <Users className="h-4 w-4 mr-1" />
                        <span>Up to {venue.capacity.split('-')[1]} guests</span>
                      </div>
                      
                      <div className="flex items-center mb-3">
                        <Star className="h-4 w-4 text-yellow-400 fill-current mr-1" />
                        <span className="text-sm font-medium text-gray-900 dark:text-white">
                          {venue.rating}
                        </span>
                        <span className="text-sm text-gray-600 dark:text-gray-400 ml-1">
                          ({venue.reviews} reviews)
                        </span>
                      </div>
                      
                      <p className="text-gray-700 dark:text-gray-300 mb-4 text-sm">
                        {venue.description}
                      </p>
                      
                      <div className="flex flex-wrap gap-2 mb-4">
                        {venue.amenities.slice(0, 3).map((amenity: string) => (
                          <Badge key={amenity} variant="secondary" className="text-xs">
                            {amenity}
                          </Badge>
                        ))}
                        {venue.amenities.length > 3 && (
                          <Badge variant="outline" className="text-xs">
                            +{venue.amenities.length - 3} more
                          </Badge>
                        )}
                      </div>
                      
                      <div className="flex items-center justify-between">
                        <div>
                          <p className="text-lg font-semibold text-gray-900 dark:text-white">
                            {venue.price}
                          </p>
                          <p className="text-sm text-gray-600 dark:text-gray-400">
                            per event
                          </p>
                        </div>
                        <Button>
                          View Details
                        </Button>
                      </div>
                    </div>
                  </motion.div>
                ))}
              </motion.div>
            </AnimatePresence>

            {filteredVenues.length === 0 && (
              <div className="text-center py-12">
                <div className="text-gray-400 mb-4">
                  <Search className="h-12 w-12 mx-auto" />
                </div>
                <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-2">
                  No venues found
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