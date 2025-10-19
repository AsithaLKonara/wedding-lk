"use client"

import { MainLayout } from "@/components/templates/main-layout"
import { useState, useEffect } from "react"
import { Search, Filter, MapPin, Star, Heart, Share2, Award, Phone, Mail } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"

export default function VendorsPage() {
  const [vendors, setVendors] = useState<any[]>([])
  const [loading, setLoading] = useState(true)
  const [searchQuery, setSearchQuery] = useState('')
  const [selectedCategory, setSelectedCategory] = useState('all')
  const [selectedLocation, setSelectedLocation] = useState('all')
  const [priceRange, setPriceRange] = useState([0, 100000])
  const [minRating, setMinRating] = useState(0)
  const [favorites, setFavorites] = useState<number[]>([])
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid')

  const categories = [
    'all', 'photography', 'catering', 'decorations', 'music', 'flowers', 
    'makeup', 'transportation', 'planning', 'videography', 'cake'
  ]

  const locations = [
    'all', 'colombo', 'kandy', 'galle', 'bentota', 'nuwara-eliya', 'anuradhapura', 'polonnaruwa'
  ]

  useEffect(() => {
    // Mock vendor data - replace with API call
    const mockVendors = [
      {
        id: 1,
        name: "Elegant Photography Studio",
        category: "photography",
        location: "colombo",
        address: "123 Galle Road, Colombo 03",
        rating: 4.8,
        reviewCount: 127,
        priceRange: [50000, 150000],
        experience: "8+ years",
        portfolio: ["https://images.unsplash.com/photo-1560472354-b33ff0c44a43?w=400&h=300&fit=crop"],
        featured: true,
        description: "Professional wedding photography with a modern artistic approach.",
        contact: {
          phone: "0771234567",
          email: "info@elegantphoto.lk",
          website: "elegantphoto.lk"
        },
        services: ["Pre-wedding", "Ceremony", "Reception", "Photo Editing", "Albums"]
      },
      {
        id: 2,
        name: "Blissful Blooms",
        category: "flowers",
        location: "kandy",
        address: "45 Temple Road, Kandy",
        rating: 4.9,
        reviewCount: 89,
        priceRange: [30000, 100000],
        experience: "12+ years",
        portfolio: ["https://images.unsplash.com/photo-1578662996442-48f60103fc96?w=400&h=300&fit=crop"],
        featured: false,
        description: "Beautiful floral arrangements with fresh, locally sourced flowers.",
        contact: {
          phone: "0719876543",
          email: "info@blissfulblooms.lk",
          website: "blissfulblooms.lk"
        },
        services: ["Bridal Bouquets", "Centerpieces", "Ceremony Decor", "Reception Flowers", "Delivery"]
      },
      {
        id: 3,
        name: "Royal Catering Services",
        category: "catering",
        location: "galle",
        address: "Beach Road, Galle",
        rating: 4.7,
        reviewCount: 156,
        priceRange: [25000, 80000],
        experience: "15+ years",
        portfolio: ["https://images.unsplash.com/photo-1556909114-f6e7ad7d3136?w=400&h=300&fit=crop"],
        featured: true,
        description: "Premium catering with traditional and international cuisine options.",
        contact: {
          phone: "0912345678",
          email: "info@royalcatering.lk",
          website: "royalcatering.lk"
        },
        services: ["Buffet", "Plated Service", "Traditional Sri Lankan", "International Cuisine", "Beverages"]
      },
      {
        id: 4,
        name: "Melody Masters",
        category: "music",
        location: "colombo",
        address: "200 Independence Avenue, Colombo 07",
        rating: 4.6,
        reviewCount: 203,
        priceRange: [40000, 120000],
        experience: "10+ years",
        portfolio: ["https://images.unsplash.com/photo-1493225457124-a3eb161ffa5f?w=400&h=300&fit=crop"],
        featured: false,
        description: "Live music and DJ services for unforgettable wedding celebrations.",
        contact: {
          phone: "0779876543",
          email: "info@melodymasters.lk",
          website: "melodymasters.lk"
        },
        services: ["Live Band", "DJ Services", "Sound System", "Lighting", "MC Services"]
      },
      {
        id: 5,
        name: "Glamour Makeup Studio",
        category: "makeup",
        location: "bentota",
        address: "Resort Road, Bentota",
        rating: 4.9,
        reviewCount: 95,
        priceRange: [20000, 60000],
        experience: "6+ years",
        portfolio: ["https://images.unsplash.com/photo-1594736797933-d0401ba2fe65?w=400&h=300&fit=crop"],
        featured: true,
        description: "Professional bridal makeup and hair styling services.",
        contact: {
          phone: "0712345678",
          email: "info@glamourmakeup.lk",
          website: "glamourmakeup.lk"
        },
        services: ["Bridal Makeup", "Hair Styling", "Bridal Party", "Trial Sessions", "Touch-ups"]
      },
      {
        id: 6,
        name: "Dream Decorations",
        category: "decorations",
        location: "nuwara-eliya",
        address: "Estate Road, Nuwara Eliya",
        rating: 4.8,
        reviewCount: 67,
        priceRange: [35000, 90000],
        experience: "7+ years",
        portfolio: ["https://images.unsplash.com/photo-1519225421980-715cb0215aed?w=400&h=300&fit=crop"],
        featured: false,
        description: "Creative wedding decorations and theme design services.",
        contact: {
          phone: "0521234567",
          email: "info@dreamdecorations.lk",
          website: "dreamdecorations.lk"
        },
        services: ["Theme Design", "Venue Decoration", "Lighting", "Props", "Setup & Breakdown"]
      }
    ]
    
    setVendors(mockVendors)
    setLoading(false)
  }, [])

  const filteredVendors = vendors.filter(vendor => {
    const matchesSearch = vendor.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         vendor.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         vendor.services.some((service: string) => service.toLowerCase().includes(searchQuery.toLowerCase()))
    const matchesCategory = selectedCategory === 'all' || vendor.category === selectedCategory
    const matchesLocation = selectedLocation === 'all' || vendor.location === selectedLocation
    const matchesPrice = vendor.priceRange[0] >= priceRange[0] && vendor.priceRange[1] <= priceRange[1]
    const matchesRating = vendor.rating >= minRating
    
    return matchesSearch && matchesCategory && matchesLocation && matchesPrice && matchesRating
  })

  const toggleFavorite = (id: number) => {
    setFavorites(prev => 
      prev.includes(id) 
        ? prev.filter(fav => fav !== id)
        : [...prev, id]
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
                Find Wedding Vendors
              </h1>
              <p className="text-lg text-gray-600 dark:text-gray-400 max-w-2xl mx-auto">
                Connect with the best wedding vendors in Sri Lanka. From photographers to caterers, 
                find trusted professionals for your special day.
              </p>
            </div>

            {/* Search Bar */}
            <div className="flex flex-col lg:flex-row gap-4 mb-6">
              <div className="flex-1 relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                <Input
                  placeholder="Search vendors by name, service, or description..."
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

            {/* Category Filters */}
            <div className="flex flex-wrap gap-2 mb-6">
              {categories.map((category) => (
                <Button
                  key={category}
                  variant={selectedCategory === category ? 'default' : 'outline'}
                  size="sm"
                  onClick={() => setSelectedCategory(category)}
                  className="capitalize"
                >
                  {category.replace('-', ' ')}
                </Button>
              ))}
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
                  Filter Vendors
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
                      onChange={(e) => setPriceRange([priceRange[0], parseInt(e.target.value) || 100000])}
                      className="text-sm"
                    />
                  </div>
                </div>

                {/* Rating Filter */}
                <div className="mb-6">
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    Minimum Rating
                  </label>
                  <div className="flex gap-2">
                    {[0, 4, 4.5, 4.8].map((rating) => (
                      <Button
                        key={rating}
                        variant={minRating === rating ? 'default' : 'outline'}
                        size="sm"
                        onClick={() => setMinRating(rating)}
                      >
                        {rating === 0 ? 'Any' : `${rating}+`}
                      </Button>
                    ))}
                  </div>
                </div>

                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => {
                    setSearchQuery('')
                    setSelectedCategory('all')
                    setSelectedLocation('all')
                    setPriceRange([0, 100000])
                    setMinRating(0)
                  }}
                  className="w-full"
                >
                  Clear All Filters
                </Button>
              </div>
            </div>

            {/* Vendors Grid/List */}
            <div className="lg:w-3/4">
              <div className="flex justify-between items-center mb-6">
                <p className="text-gray-600 dark:text-gray-400">
                  Showing {filteredVendors.length} of {vendors.length} vendors
                </p>
              </div>

              {viewMode === 'grid' ? (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {filteredVendors.map((vendor) => (
                    <div key={vendor.id} className="bg-white dark:bg-gray-800 rounded-lg shadow-sm overflow-hidden hover:shadow-lg transition-shadow duration-300">
                      <div className="relative">
                        <img
                          src={vendor.portfolio[0]}
                          alt={vendor.name}
                          className="w-full h-48 object-cover"
                        />
                        {vendor.featured && (
                          <Badge className="absolute top-2 left-2 bg-red-500">
                            Featured
                          </Badge>
                        )}
                        <Button
                          variant="ghost"
                          size="sm"
                          className="absolute top-2 right-2 bg-white/80 hover:bg-white"
                          onClick={() => toggleFavorite(vendor.id)}
                        >
                          <Heart 
                            className={`w-4 h-4 ${favorites.includes(vendor.id) ? 'fill-red-500 text-red-500' : 'text-gray-600'}`} 
                          />
                        </Button>
                      </div>
                      
                      <div className="p-6">
                        <div className="flex justify-between items-start mb-2">
                          <h3 className="text-xl font-semibold text-gray-900 dark:text-white">
                            {vendor.name}
                          </h3>
                          <Badge variant="secondary" className="capitalize">
                            {vendor.category.replace('-', ' ')}
                          </Badge>
                        </div>
                        
                        <div className="flex items-center text-gray-600 dark:text-gray-400 text-sm mb-2">
                          <MapPin className="w-4 h-4 mr-1" />
                          {vendor.address}
                        </div>
                        
                        <div className="flex justify-between items-center mb-3">
                          <div className="flex items-center">
                            <Star className="w-4 h-4 text-yellow-500 mr-1" />
                            <span className="text-gray-600 dark:text-gray-400 text-sm">
                              {vendor.rating} ({vendor.reviewCount} reviews)
                            </span>
                          </div>
                          <div className="flex items-center text-gray-600 dark:text-gray-400 text-sm">
                            <Award className="w-4 h-4 mr-1" />
                            {vendor.experience}
                          </div>
                        </div>
                        
                        <span className="text-blue-600 font-medium text-sm">
                          LKR {vendor.priceRange[0].toLocaleString()} - {vendor.priceRange[1].toLocaleString()}
                        </span>
                        
                        <p className="text-gray-600 dark:text-gray-400 text-sm mb-4 mt-2">
                          {vendor.description}
                        </p>
                        
                        <div className="flex gap-1 mb-4">
                          {vendor.services.slice(0, 3).map((service: string) => (
                            <Badge key={service} variant="outline" className="text-xs">
                              {service}
                            </Badge>
                          ))}
                          {vendor.services.length > 3 && (
                            <Badge variant="outline" className="text-xs">
                              +{vendor.services.length - 3} more
                            </Badge>
                          )}
                        </div>
                        
                        <div className="flex gap-2">
                          <Button size="sm" className="flex-1">
                            View Profile
                          </Button>
                          <Button variant="outline" size="sm">
                            <Phone className="w-3 h-3" />
                          </Button>
                          <Button variant="outline" size="sm">
                            <Mail className="w-3 h-3" />
                          </Button>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="space-y-4">
                  {filteredVendors.map((vendor) => (
                    <div key={vendor.id} className="bg-white dark:bg-gray-800 rounded-lg shadow-sm overflow-hidden hover:shadow-lg transition-shadow duration-300">
                      <div className="flex">
                        <div className="relative w-48 h-32 flex-shrink-0">
                          <img
                            src={vendor.portfolio[0]}
                            alt={vendor.name}
                            className="w-full h-full object-cover"
                          />
                          {vendor.featured && (
                            <Badge className="absolute top-2 left-2 bg-red-500 text-xs">
                              Featured
                            </Badge>
                          )}
                        </div>
                        
                        <div className="flex-1 p-4">
                          <div className="flex justify-between items-start mb-2">
                            <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
                              {vendor.name}
                            </h3>
                            <div className="flex gap-2">
                              <Badge variant="secondary" className="capitalize">
                                {vendor.category.replace('-', ' ')}
                              </Badge>
                              <Button
                                variant="ghost"
                                size="sm"
                                onClick={() => toggleFavorite(vendor.id)}
                              >
                                <Heart 
                                  className={`w-4 h-4 ${favorites.includes(vendor.id) ? 'fill-red-500 text-red-500' : 'text-gray-600'}`} 
                                />
                              </Button>
                            </div>
                          </div>
                          
                          <div className="flex items-center text-gray-600 dark:text-gray-400 text-sm mb-1">
                            <MapPin className="w-3 h-3 mr-1" />
                            {vendor.address}
                          </div>
                          
                          <div className="flex justify-between items-center mb-2">
                            <div className="flex items-center">
                              <Star className="w-3 h-3 text-yellow-500 mr-1" />
                              <span className="text-gray-600 dark:text-gray-400 text-sm">
                                {vendor.rating} ({vendor.reviewCount} reviews)
                              </span>
                            </div>
                            <div className="flex items-center text-gray-600 dark:text-gray-400 text-sm">
                              <Award className="w-3 h-3 mr-1" />
                              {vendor.experience}
                            </div>
                          </div>
                          
                          <span className="text-blue-600 font-medium text-sm">
                            LKR {vendor.priceRange[0].toLocaleString()} - {vendor.priceRange[1].toLocaleString()}
                          </span>
                          
                          <p className="text-gray-600 dark:text-gray-400 text-sm mb-3 line-clamp-2">
                            {vendor.description}
                          </p>
                          
                          <div className="flex justify-between items-center">
                            <div className="flex gap-1">
                              {vendor.services.slice(0, 4).map((service: string) => (
                                <Badge key={service} variant="outline" className="text-xs">
                                  {service}
                                </Badge>
                              ))}
                            </div>
                            <div className="flex gap-2">
                              <Button size="sm">View Profile</Button>
                              <Button variant="outline" size="sm">
                                <Phone className="w-3 h-3" />
                              </Button>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              )}

              {filteredVendors.length === 0 && (
                <div className="text-center py-12">
                  <p className="text-gray-500 dark:text-gray-400 text-lg">
                    No vendors found matching your criteria.
                  </p>
                  <Button 
                    variant="outline" 
                    className="mt-4"
                    onClick={() => {
                      setSearchQuery('')
                      setSelectedCategory('all')
                      setSelectedLocation('all')
                      setPriceRange([0, 100000])
                      setMinRating(0)
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