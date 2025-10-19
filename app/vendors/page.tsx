"use client"

import { useState, useEffect } from "react"
import { Search, Filter, MapPin, Users, Star, Heart, Share2, Camera, Music, Utensils, Flower } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import Link from "next/link"

export default function VendorsPage() {
  const [vendors, setVendors] = useState<any[]>([])
  const [loading, setLoading] = useState(true)
  const [searchQuery, setSearchQuery] = useState('')
  const [selectedCategory, setSelectedCategory] = useState('all')
  const [selectedLocation, setSelectedLocation] = useState('all')
  const [priceRange, setPriceRange] = useState([0, 200000])
  const [favorites, setFavorites] = useState<number[]>([])
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid')

  const categories = [
    { id: 'all', name: 'All', icon: null },
    { id: 'photography', name: 'Photography', icon: Camera },
    { id: 'music', name: 'Music & DJ', icon: Music },
    { id: 'catering', name: 'Catering', icon: Utensils },
    { id: 'flowers', name: 'Flowers', icon: Flower },
    { id: 'decorations', name: 'Decorations', icon: null },
    { id: 'transportation', name: 'Transportation', icon: null },
    { id: 'makeup', name: 'Makeup & Hair', icon: null },
    { id: 'planning', name: 'Planning', icon: null }
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
        portfolio: ["https://images.unsplash.com/photo-1519167758481-83f29c0c0b8a?w=400&h=300&fit=crop"],
        featured: true,
        description: "Professional wedding photography with a modern artistic approach."
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
        portfolio: ["https://images.unsplash.com/photo-1519225421980-715cb0215aed?w=400&h=300&fit=crop"],
        featured: false,
        description: "Beautiful floral arrangements with fresh, locally sourced flowers."
      },
      {
        id: 3,
        name: "Royal Catering Services",
        category: "catering",
        location: "colombo",
        address: "78 Main Street, Colombo 02",
        rating: 4.7,
        reviewCount: 156,
        priceRange: [40000, 120000],
        experience: "15+ years",
        portfolio: ["https://images.unsplash.com/photo-1519741497674-611481863552?w=400&h=300&fit=crop"],
        featured: true,
        description: "Premium catering services with authentic Sri Lankan and international cuisine."
      },
      {
        id: 4,
        name: "Melody Masters",
        category: "music",
        location: "colombo",
        address: "56 Music Lane, Colombo 05",
        rating: 4.6,
        reviewCount: 73,
        priceRange: [25000, 80000],
        experience: "10+ years",
        portfolio: ["https://images.unsplash.com/photo-1606800052052-a08af7148866?w=400&h=300&fit=crop"],
        featured: false,
        description: "Professional DJ and live music services for all wedding celebrations."
      },
      {
        id: 5,
        name: "Glamour Makeup Studio",
        category: "makeup",
        location: "kandy",
        address: "34 Beauty Street, Kandy",
        rating: 4.8,
        reviewCount: 94,
        priceRange: [15000, 50000],
        experience: "6+ years",
        portfolio: ["https://images.unsplash.com/photo-1519167758481-83f29c0c0b8a?w=400&h=300&fit=crop"],
        featured: true,
        description: "Professional makeup and hair styling for brides and wedding parties."
      },
      {
        id: 6,
        name: "Dream Decorations",
        category: "decorations",
        location: "colombo",
        address: "89 Decor Avenue, Colombo 04",
        rating: 4.7,
        reviewCount: 112,
        priceRange: [35000, 90000],
        experience: "9+ years",
        portfolio: ["https://images.unsplash.com/photo-1519225421980-715cb0215aed?w=400&h=300&fit=crop"],
        featured: false,
        description: "Creative wedding decorations and event styling services."
      }
    ]
    
    // Simulate API call delay
    setTimeout(() => {
      setVendors(mockVendors)
      setLoading(false)
    }, 1000)
  }, [])

  const filteredVendors = vendors.filter(vendor => {
    const matchesSearch = vendor.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         vendor.description.toLowerCase().includes(searchQuery.toLowerCase())
    const matchesCategory = selectedCategory === 'all' || vendor.category === selectedCategory
    const matchesLocation = selectedLocation === 'all' || vendor.location === selectedLocation
    const matchesPrice = vendor.priceRange[0] >= priceRange[0] && vendor.priceRange[1] <= priceRange[1]
    
    return matchesSearch && matchesCategory && matchesLocation && matchesPrice
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
    )
  }

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      {/* Simple Header */}
      <header className="sticky top-0 z-50 w-full bg-white/95 backdrop-blur-md dark:bg-gray-900/95 border-b border-gray-200 dark:border-gray-700">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex h-16 items-center justify-between">
            <Link href="/" className="flex items-center space-x-2">
              <Heart className="h-8 w-8 text-rose-500 fill-current" />
              <span className="text-xl font-bold text-gray-900 dark:text-white">Wedding.lk</span>
            </Link>
            
            <nav className="hidden lg:block">
              <div className="flex justify-center space-x-8 px-4 sm:px-6 lg:px-8">
                <Link href="/venues" className="text-gray-700 hover:text-rose-500 dark:text-gray-300 dark:hover:text-rose-400 font-medium transition-colors">Venues</Link>
                <Link href="/vendors" className="text-gray-700 hover:text-rose-500 dark:text-gray-300 dark:hover:text-rose-400 font-medium transition-colors">Vendors</Link>
                <Link href="/feed" className="text-gray-700 hover:text-rose-500 dark:text-gray-300 dark:hover:text-rose-400 font-medium transition-colors">Feed</Link>
                <Link href="/gallery" className="text-gray-700 hover:text-rose-500 dark:text-gray-300 dark:hover:text-rose-400 font-medium transition-colors">Gallery</Link>
                <Link href="/ai-search" className="text-gray-700 hover:text-rose-500 dark:text-gray-300 dark:hover:text-rose-400 font-medium transition-colors">AI Search</Link>
                <Link href="/chat" className="text-gray-700 hover:text-rose-500 dark:text-gray-300 dark:hover:text-rose-400 font-medium transition-colors">Chat</Link>
                <Link href="/about" className="text-gray-700 hover:text-rose-500 dark:text-gray-300 dark:hover:text-rose-400 font-medium transition-colors">About</Link>
              </div>
            </nav>
            
            <div className="flex items-center space-x-3">
              <div className="hidden md:flex items-center space-x-2">
                <Link href="/login" className="inline-flex items-center justify-center gap-2 whitespace-nowrap rounded-md text-sm font-medium ring-offset-background transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 hover:bg-accent hover:text-accent-foreground h-10 px-4 py-2">Sign In</Link>
                <Link href="/register" className="inline-flex items-center justify-center gap-2 whitespace-nowrap rounded-md text-sm font-medium ring-offset-background transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 bg-primary text-primary-foreground hover:bg-primary/90 h-10 px-4 py-2 bg-gradient-to-r from-pink-500 to-purple-600 hover:from-pink-600 hover:to-purple-700">Get Started</Link>
              </div>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="flex-1">
        {/* Header Section */}
        <div className="bg-white dark:bg-gray-800 border-b border-gray-200 dark:border-gray-700">
          <div className="container mx-auto px-4 py-8">
            <div className="text-center mb-8">
              <h1 className="text-4xl font-bold text-gray-900 dark:text-white mb-4">
                Find Your Perfect Vendors
              </h1>
              <p className="text-lg text-gray-600 dark:text-gray-400 max-w-2xl mx-auto">
                Discover talented wedding vendors across Sri Lanka. From photographers to caterers, 
                find the perfect professionals to make your wedding day unforgettable.
              </p>
            </div>

            {/* Search Bar */}
            <div className="flex flex-col lg:flex-row gap-4 mb-6">
              <div className="flex-1 relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                <Input
                  placeholder="Search vendors by name, category, or description..."
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
              {categories.map((category) => {
                const IconComponent = category.icon
                return (
                  <Button
                    key={category.id}
                    variant={selectedCategory === category.id ? 'default' : 'outline'}
                    size="sm"
                    onClick={() => setSelectedCategory(category.id)}
                    className="capitalize"
                  >
                    {IconComponent && <IconComponent className="w-4 h-4 mr-2" />}
                    {category.name}
                  </Button>
                )
              })}
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

        {/* Content */}
        <div className="container mx-auto px-4 py-8">
          <div className="flex justify-between items-center mb-6">
            <p className="text-gray-600 dark:text-gray-400">
              Showing {filteredVendors.length} of {vendors.length} vendors
            </p>
          </div>

          {viewMode === 'grid' ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {filteredVendors.map((vendor) => (
                <div key={vendor.id} className="bg-white dark:bg-gray-800 rounded-lg shadow-sm overflow-hidden hover:shadow-lg transition-shadow duration-300">
                  <div className="relative">
                    <img
                      src={vendor.portfolio[0]}
                      alt={`${vendor.name} - ${vendor.category} vendor`}
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
                    <div className="flex items-center justify-between mb-2">
                      <h3 className="text-xl font-semibold text-gray-900 dark:text-white">
                        {vendor.name}
                      </h3>
                      <Badge variant="secondary" className="capitalize">
                        {vendor.category}
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
                      <span className="text-blue-600 font-medium text-sm">
                        {vendor.experience}
                      </span>
                    </div>
                    
                    <p className="text-gray-600 dark:text-gray-400 text-sm mb-4">
                      {vendor.description}
                    </p>
                    
                    <div className="flex justify-between items-center mb-4">
                      <span className="text-green-600 font-medium">
                        LKR {vendor.priceRange[0].toLocaleString()} - {vendor.priceRange[1].toLocaleString()}
                      </span>
                    </div>
                    
                    <div className="flex gap-2">
                      <Button size="sm" className="flex-1">
                        View Profile
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
              {filteredVendors.map((vendor) => (
                <div key={vendor.id} className="bg-white dark:bg-gray-800 rounded-lg shadow-sm overflow-hidden hover:shadow-lg transition-shadow duration-300">
                  <div className="flex">
                    <div className="relative w-48 h-32 flex-shrink-0">
                      <img
                        src={vendor.portfolio[0]}
                        alt={`${vendor.name} - ${vendor.category} vendor`}
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
                        <div>
                          <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
                            {vendor.name}
                          </h3>
                          <Badge variant="secondary" className="capitalize text-xs">
                            {vendor.category}
                          </Badge>
                        </div>
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
                        <span className="text-blue-600 font-medium text-sm">
                          {vendor.experience}
                        </span>
                      </div>
                      
                      <p className="text-gray-600 dark:text-gray-400 text-sm mb-3 line-clamp-2">
                        {vendor.description}
                      </p>
                      
                      <div className="flex justify-between items-center">
                        <span className="text-green-600 font-medium text-sm">
                          LKR {vendor.priceRange[0].toLocaleString()} - {vendor.priceRange[1].toLocaleString()}
                        </span>
                        <Button size="sm">View Profile</Button>
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
                  setPriceRange([0, 200000])
                }}
              >
                Clear All Filters
              </Button>
            </div>
          )}
        </div>
      </main>

      {/* Simple Footer */}
      <footer className="bg-gray-900 text-white">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-12">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
            <div className="col-span-1 md:col-span-2">
              <Link href="/" className="flex items-center space-x-2">
                <Heart className="h-8 w-8 text-rose-500 fill-current" />
                <span className="text-xl font-bold text-white">Wedding.lk</span>
              </Link>
              <p className="mt-4 text-gray-400 max-w-md">
                Your trusted partner in creating unforgettable wedding experiences. Plan, organize, and celebrate your special day with ease.
              </p>
            </div>
            <div>
              <h3 className="font-semibold text-lg mb-4">Services</h3>
              <ul className="space-y-2 text-gray-400">
                <li><Link href="/venues" className="hover:text-white transition-colors">Venues</Link></li>
                <li><Link href="/vendors" className="hover:text-white transition-colors">Vendors</Link></li>
                <li><Link href="/planning" className="hover:text-white transition-colors">Planning Tools</Link></li>
                <li><Link href="/gallery" className="hover:text-white transition-colors">Gallery</Link></li>
              </ul>
            </div>
            <div>
              <h3 className="font-semibold text-lg mb-4">Company</h3>
              <ul className="space-y-2 text-gray-400">
                <li><Link href="/about" className="hover:text-white transition-colors">About</Link></li>
                <li><Link href="/contact" className="hover:text-white transition-colors">Contact</Link></li>
                <li><Link href="/privacy" className="hover:text-white transition-colors">Privacy</Link></li>
                <li><Link href="/terms" className="hover:text-white transition-colors">Terms</Link></li>
              </ul>
            </div>
          </div>
          <div className="border-t border-gray-800 mt-8 pt-8 text-center text-gray-400">
            <p>© 2024 Wedding.lk. All rights reserved.</p>
          </div>
        </div>
      </footer>
    </div>
  )
}