"use client"

import { MainLayout } from "@/components/templates/main-layout"
import { useState, useEffect } from "react"
import { Search, Filter, MapPin, Users, Star, Heart, Share2 } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"

export default function VenuesPage() {
  const [venues, setVenues] = useState<any[]>([])
  const [loading, setLoading] = useState(true)
  const [searchQuery, setSearchQuery] = useState('')
  const [selectedLocation, setSelectedLocation] = useState('all')
  const [priceRange, setPriceRange] = useState([0, 500000])
  const [capacityRange, setCapacityRange] = useState([0, 500])
  const [selectedAmenities, setSelectedAmenities] = useState<string[]>([])
  const [favorites, setFavorites] = useState<number[]>([])
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid')

  const locations = [
    'all', 'colombo', 'kandy', 'galle', 'bentota', 'nuwara-eliya', 'anuradhapura', 'polonnaruwa'
  ]

  const amenities = [
    'parking', 'air-conditioning', 'catering', 'decorations', 'sound-system', 
    'photography', 'bridal-suite', 'garden', 'beach-access', 'traditional-hall'
  ]

  useEffect(() => {
    // Mock venue data - replace with API call
    const mockVenues = [
      {
        id: 1,
        name: "Grand Ballroom Hotel",
        location: "colombo",
        address: "123 Galle Road, Colombo 03",
        capacity: 300,
        priceRange: [150000, 250000],
        rating: 4.8,
        reviewCount: 127,
        amenities: ['parking', 'air-conditioning', 'catering', 'sound-system'],
        images: ["https://images.unsplash.com/photo-1519167758481-83f29c0c0b8a?w=400&h=300&fit=crop"],
        featured: true,
        description: "Elegant ballroom with panoramic city views, perfect for grand celebrations."
      },
      {
        id: 2,
        name: "Garden Paradise Resort",
        location: "kandy",
        address: "45 Temple Road, Kandy",
        capacity: 250,
        priceRange: [120000, 200000],
        rating: 4.9,
        reviewCount: 89,
        amenities: ['garden', 'parking', 'catering', 'decorations', 'bridal-suite'],
        images: ["https://images.unsplash.com/photo-1519225421980-715cb0215aed?w=400&h=300&fit=crop"],
        featured: false,
        description: "Beautiful garden setting with traditional architecture and modern amenities."
      },
      {
        id: 3,
        name: "Beachfront Villa",
        location: "bentota",
        address: "Beach Road, Bentota",
        capacity: 200,
        priceRange: [100000, 180000],
        rating: 4.7,
        reviewCount: 156,
        amenities: ['beach-access', 'parking', 'air-conditioning', 'photography'],
        images: ["https://images.unsplash.com/photo-1519741497674-611481863552?w=400&h=300&fit=crop"],
        featured: true,
        description: "Stunning beachfront location with ocean views and tropical atmosphere."
      },
      {
        id: 4,
        name: "Traditional Kandyan Hall",
        location: "kandy",
        address: "78 Peradeniya Road, Kandy",
        capacity: 400,
        priceRange: [80000, 150000],
        rating: 4.6,
        reviewCount: 203,
        amenities: ['traditional-hall', 'parking', 'sound-system', 'decorations'],
        images: ["https://images.unsplash.com/photo-1606800052052-a08af7148866?w=400&h=300&fit=crop"],
        featured: false,
        description: "Authentic traditional venue with cultural significance and heritage charm."
      },
      {
        id: 5,
        name: "Luxury Colombo Hotel",
        location: "colombo",
        address: "200 Independence Avenue, Colombo 07",
        capacity: 500,
        priceRange: [200000, 400000],
        rating: 4.9,
        reviewCount: 95,
        amenities: ['parking', 'air-conditioning', 'catering', 'bridal-suite', 'sound-system'],
        images: ["https://images.unsplash.com/photo-1519167758481-83f29c0c0b8a?w=400&h=300&fit=crop"],
        featured: true,
        description: "Premium luxury hotel with world-class facilities and impeccable service."
      },
      {
        id: 6,
        name: "Hill Country Estate",
        location: "nuwara-eliya",
        address: "Estate Road, Nuwara Eliya",
        capacity: 150,
        priceRange: [90000, 160000],
        rating: 4.8,
        reviewCount: 67,
        amenities: ['garden', 'parking', 'catering', 'photography'],
        images: ["https://images.unsplash.com/photo-1519225421980-715cb0215aed?w=400&h=300&fit=crop"],
        featured: false,
        description: "Charming hill country estate with cool climate and scenic mountain views."
      }
    ]
    
    setVenues(mockVenues)
    setLoading(false)
  }, [])

  const filteredVenues = venues.filter(venue => {
    const matchesSearch = venue.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         venue.address.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         venue.description.toLowerCase().includes(searchQuery.toLowerCase())
    const matchesLocation = selectedLocation === 'all' || venue.location === selectedLocation
    const matchesPrice = venue.priceRange[0] >= priceRange[0] && venue.priceRange[1] <= priceRange[1]
    const matchesCapacity = venue.capacity >= capacityRange[0] && venue.capacity <= capacityRange[1]
    const matchesAmenities = selectedAmenities.length === 0 || 
                           selectedAmenities.every(amenity => venue.amenities.includes(amenity))
    
    return matchesSearch && matchesLocation && matchesPrice && matchesCapacity && matchesAmenities
  })

  const toggleFavorite = (id: number) => {
    setFavorites(prev => 
      prev.includes(id) 
        ? prev.filter(fav => fav !== id)
        : [...prev, id]
    )
  }

  const toggleAmenity = (amenity: string) => {
    setSelectedAmenities(prev => 
      prev.includes(amenity)
        ? prev.filter(a => a !== amenity)
        : [...prev, amenity]
    )
  }

  if (loading) {
    return (
      <MainLayout>
        <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
          <div className="container mx-auto px-4 py-8">
            <div className="animate-pulse">
              <div className="h-8 bg-gray-200 dark:bg-gray-700 rounded w-1/3 mb-4"></div>
              <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-1/2 mb-8"></div>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {[...Array(6)].map((_, i) => (
                  <div key={i} className="bg-white dark:bg-gray-800 rounded-lg shadow-sm overflow-hidden">
                    <div className="h-48 bg-gray-200 dark:bg-gray-700"></div>
                    <div className="p-6">
                      <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded mb-2"></div>
                      <div className="h-3 bg-gray-200 dark:bg-gray-700 rounded mb-4"></div>
                      <div className="h-8 bg-gray-200 dark:bg-gray-700 rounded"></div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </MainLayout>
    )
  }

  return (
    <MainLayout>
      <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
        {/* Header Section */}
        <div className="bg-white dark:bg-gray-800 border-b border-gray-200 dark:border-gray-700">
          <div className="container mx-auto px-4 py-8">
            <div className="text-center mb-8">
              <h1 className="text-4xl font-bold text-gray-900 dark:text-white mb-4">
                Find Your Perfect Venue
              </h1>
              <p className="text-lg text-gray-600 dark:text-gray-400 max-w-2xl mx-auto">
                Discover beautiful wedding venues across Sri Lanka. From beachfront locations 
                to traditional halls, find the perfect setting for your special day.
              </p>
            </div>

            {/* Search Bar */}
            <div className="flex flex-col lg:flex-row gap-4 mb-6">
              <div className="flex-1 relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                <Input
                  placeholder="Search venues by name, location, or description..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="pl-10"
                />
              </div>
              
              <div className="flex gap-2">
                <Button
                  variant={viewMode === 'grid' ? 'default' : 'outline'}
                  size="sm"
                  onClick={() => setViewMode('grid')}
                >
                  Grid
                </Button>
                <Button
                  variant={viewMode === 'list' ? 'default' : 'outline'}
                  size="sm"
                  onClick={() => setViewMode('list')}
                >
                  List
                </Button>
              </div>
            </div>

            {/* Location Filters */}
            <div className="flex flex-wrap gap-2 mb-6">
              {locations.map((location) => (
                <Button
                  key={location}
                  variant={selectedLocation === location ? 'default' : 'outline'}
                  size="sm"
                  onClick={() => setSelectedLocation(location)}
                  className="capitalize"
                >
                  {location.replace('-', ' ')}
                </Button>
              ))}
            </div>
          </div>
        </div>

        {/* Filters Sidebar and Content */}
        <div className="container mx-auto px-4 py-8">
          <div className="flex flex-col lg:flex-row gap-8">
            {/* Filters Sidebar */}
            <div className="lg:w-1/4">
              <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm p-6 sticky top-4">
                <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
                  Filter Venues
                </h3>
                
                {/* Price Range */}
                <div className="mb-6">
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    Price Range (LKR)
                  </label>
                  <div className="flex gap-2">
                    <Input
                      type="number"
                      placeholder="Min"
                      value={priceRange[0]}
                      onChange={(e) => setPriceRange([parseInt(e.target.value) || 0, priceRange[1]])}
                      className="text-sm"
                    />
                    <Input
                      type="number"
                      placeholder="Max"
                      value={priceRange[1]}
                      onChange={(e) => setPriceRange([priceRange[0], parseInt(e.target.value) || 500000])}
                      className="text-sm"
                    />
                  </div>
                </div>

                {/* Capacity Range */}
                <div className="mb-6">
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    Guest Capacity
                  </label>
                  <div className="flex gap-2">
                    <Input
                      type="number"
                      placeholder="Min"
                      value={capacityRange[0]}
                      onChange={(e) => setCapacityRange([parseInt(e.target.value) || 0, capacityRange[1]])}
                      className="text-sm"
                    />
                    <Input
                      type="number"
                      placeholder="Max"
                      value={capacityRange[1]}
                      onChange={(e) => setCapacityRange([capacityRange[0], parseInt(e.target.value) || 500])}
                      className="text-sm"
                    />
                  </div>
                </div>

                {/* Amenities */}
                <div className="mb-6">
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    Amenities
                  </label>
                  <div className="space-y-2">
                    {amenities.map((amenity) => (
                      <label key={amenity} className="flex items-center">
                        <input
                          type="checkbox"
                          checked={selectedAmenities.includes(amenity)}
                          onChange={() => toggleAmenity(amenity)}
                          className="mr-2"
                        />
                        <span className="text-sm text-gray-600 dark:text-gray-400 capitalize">
                          {amenity.replace('-', ' ')}
                        </span>
                      </label>
                    ))}
                  </div>
                </div>

                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => {
                    setSearchQuery('')
                    setSelectedLocation('all')
                    setPriceRange([0, 500000])
                    setCapacityRange([0, 500])
                    setSelectedAmenities([])
                  }}
                  className="w-full"
                >
                  Clear All Filters
                </Button>
              </div>
            </div>

            {/* Venues Grid/List */}
            <div className="lg:w-3/4">
              <div className="flex justify-between items-center mb-6">
                <p className="text-gray-600 dark:text-gray-400">
                  Showing {filteredVenues.length} of {venues.length} venues
                </p>
              </div>

              {viewMode === 'grid' ? (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {filteredVenues.map((venue) => (
                    <div key={venue.id} className="bg-white dark:bg-gray-800 rounded-lg shadow-sm overflow-hidden hover:shadow-lg transition-shadow duration-300">
                      <div className="relative">
                        <img
                          src={venue.images[0]}
                          alt={venue.name}
                          className="w-full h-48 object-cover"
                        />
                        {venue.featured && (
                          <Badge className="absolute top-2 left-2 bg-red-500">
                            Featured
                          </Badge>
                        )}
                        <Button
                          variant="ghost"
                          size="sm"
                          className="absolute top-2 right-2 bg-white/80 hover:bg-white"
                          onClick={() => toggleFavorite(venue.id)}
                        >
                          <Heart 
                            className={`w-4 h-4 ${favorites.includes(venue.id) ? 'fill-red-500 text-red-500' : 'text-gray-600'}`} 
                          />
                        </Button>
                      </div>
                      
                      <div className="p-6">
                        <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-2">
                          {venue.name}
                        </h3>
                        <div className="flex items-center text-gray-600 dark:text-gray-400 text-sm mb-2">
                          <MapPin className="w-4 h-4 mr-1" />
                          {venue.address}
                        </div>
                        <div className="flex items-center text-gray-600 dark:text-gray-400 text-sm mb-3">
                          <Users className="w-4 h-4 mr-1" />
                          Up to {venue.capacity} guests
                        </div>
                        
                        <div className="flex justify-between items-center mb-3">
                          <div className="flex items-center">
                            <Star className="w-4 h-4 text-yellow-500 mr-1" />
                            <span className="text-gray-600 dark:text-gray-400 text-sm">
                              {venue.rating} ({venue.reviewCount} reviews)
                            </span>
                          </div>
                          <span className="text-blue-600 font-medium">
                            LKR {venue.priceRange[0].toLocaleString()} - {venue.priceRange[1].toLocaleString()}
                          </span>
                        </div>
                        
                        <p className="text-gray-600 dark:text-gray-400 text-sm mb-4">
                          {venue.description}
                        </p>
                        
                        <div className="flex gap-2 mb-4">
                          {venue.amenities.slice(0, 3).map((amenity: string) => (
                            <Badge key={amenity} variant="secondary" className="text-xs">
                              {amenity.replace('-', ' ')}
                            </Badge>
                          ))}
                          {venue.amenities.length > 3 && (
                            <Badge variant="secondary" className="text-xs">
                              +{venue.amenities.length - 3} more
                            </Badge>
                          )}
                        </div>
                        
                        <div className="flex gap-2">
                          <Button size="sm" className="flex-1">
                            View Details
                          </Button>
                          <Button variant="outline" size="sm">
                            <Share2 className="w-3 h-3" />
                          </Button>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="space-y-4">
                  {filteredVenues.map((venue) => (
                    <div key={venue.id} className="bg-white dark:bg-gray-800 rounded-lg shadow-sm overflow-hidden hover:shadow-lg transition-shadow duration-300">
                      <div className="flex">
                        <div className="relative w-48 h-32 flex-shrink-0">
                          <img
                            src={venue.images[0]}
                            alt={venue.name}
                            className="w-full h-full object-cover"
                          />
                          {venue.featured && (
                            <Badge className="absolute top-2 left-2 bg-red-500 text-xs">
                              Featured
                            </Badge>
                          )}
                        </div>
                        
                        <div className="flex-1 p-4">
                          <div className="flex justify-between items-start mb-2">
                            <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
                              {venue.name}
                            </h3>
                            <Button
                              variant="ghost"
                              size="sm"
                              onClick={() => toggleFavorite(venue.id)}
                            >
                              <Heart 
                                className={`w-4 h-4 ${favorites.includes(venue.id) ? 'fill-red-500 text-red-500' : 'text-gray-600'}`} 
                              />
                            </Button>
                          </div>
                          
                          <div className="flex items-center text-gray-600 dark:text-gray-400 text-sm mb-1">
                            <MapPin className="w-3 h-3 mr-1" />
                            {venue.address}
                          </div>
                          <div className="flex items-center text-gray-600 dark:text-gray-400 text-sm mb-2">
                            <Users className="w-3 h-3 mr-1" />
                            Up to {venue.capacity} guests
                          </div>
                          
                          <div className="flex justify-between items-center mb-2">
                            <div className="flex items-center">
                              <Star className="w-3 h-3 text-yellow-500 mr-1" />
                              <span className="text-gray-600 dark:text-gray-400 text-sm">
                                {venue.rating} ({venue.reviewCount} reviews)
                              </span>
                            </div>
                            <span className="text-blue-600 font-medium text-sm">
                              LKR {venue.priceRange[0].toLocaleString()} - {venue.priceRange[1].toLocaleString()}
                            </span>
                          </div>
                          
                          <p className="text-gray-600 dark:text-gray-400 text-sm mb-3 line-clamp-2">
                            {venue.description}
                          </p>
                          
                          <div className="flex justify-between items-center">
                            <div className="flex gap-1">
                              {venue.amenities.slice(0, 4).map((amenity: string) => (
                                <Badge key={amenity} variant="secondary" className="text-xs">
                                  {amenity.replace('-', ' ')}
                                </Badge>
                              ))}
                            </div>
                            <Button size="sm">View Details</Button>
                          </div>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              )}

              {filteredVenues.length === 0 && (
                <div className="text-center py-12">
                  <p className="text-gray-500 dark:text-gray-400 text-lg">
                    No venues found matching your criteria.
                  </p>
                  <Button 
                    variant="outline" 
                    className="mt-4"
                    onClick={() => {
                      setSearchQuery('')
                      setSelectedLocation('all')
                      setPriceRange([0, 500000])
                      setCapacityRange([0, 500])
                      setSelectedAmenities([])
                    }}
                  >
                    Clear All Filters
                  </Button>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </MainLayout>
  )
}