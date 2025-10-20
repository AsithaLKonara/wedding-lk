"use client"

import { MainLayout } from "@/components/templates/main-layout"
import { useState } from "react"
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { Search, Sparkles, MapPin, Calendar, Users, Heart, Star, Filter } from "lucide-react"
import { motion } from "framer-motion"

export default function AISearchPage() {
  const [searchQuery, setSearchQuery] = useState('')
  const [selectedLocation, setSelectedLocation] = useState('')
  const [isSearching, setIsSearching] = useState(false)
  const [searchResults, setSearchResults] = useState<any[]>([])
  const [recentSearches, setRecentSearches] = useState([
    "Beach wedding in Galle for 150 guests",
    "Traditional wedding venue in Kandy",
    "Luxury hotel ballroom Colombo under 300k",
    "Garden wedding venue with catering"
  ])

  const locations = [
    "All Locations",
    "Colombo",
    "Kandy", 
    "Galle",
    "Bentota",
    "Nuwara Eliya",
    "Negombo",
    "Anuradhapura",
    "Jaffna"
  ]

  const quickSearches = [
    "Beach wedding venues in Galle",
    "Garden wedding under 200k",
    "Luxury hotel ballrooms Colombo",
    "Mountain view venues for 150 guests",
    "Traditional wedding venues Kandy"
  ]

  const handleSearch = async () => {
    if (!searchQuery.trim()) return
    
    setIsSearching(true)
    
    // Simulate AI search processing
    await new Promise(resolve => setTimeout(resolve, 500))
    
    // Mock search results
    const mockResults = [
      {
        id: 1,
        type: 'venue',
        name: "Grand Ballroom Hotel",
        location: "Colombo",
        rating: 4.8,
        price: "LKR 200,000 - 300,000",
        capacity: 300,
        image: "https://images.unsplash.com/photo-1519167758481-83f29c0c0b8a?w=400&h=300&fit=crop",
        description: "Perfect match for your beach wedding request with ocean views and luxury amenities."
      },
      {
        id: 2,
        type: 'vendor',
        name: "Elegant Photography Studio",
        location: "Galle",
        rating: 4.9,
        price: "LKR 50,000 - 100,000",
        experience: "8+ years",
        image: "https://images.unsplash.com/photo-1560472354-b33ff0c44a43?w=400&h=300&fit=crop",
        description: "Specializes in beach and outdoor wedding photography with artistic flair."
      },
      {
        id: 3,
        type: 'venue',
        name: "Garden Paradise Resort",
        location: "Kandy",
        rating: 4.7,
        price: "LKR 150,000 - 250,000",
        capacity: 250,
        image: "https://images.unsplash.com/photo-1519225421980-715cb0215aed?w=400&h=300&fit=crop",
        description: "Beautiful garden setting perfect for traditional ceremonies and celebrations."
      }
    ]
    
    setSearchResults(mockResults)
    setIsSearching(false)
    
    // Add to recent searches
    if (!recentSearches.includes(searchQuery)) {
      setRecentSearches(prev => [searchQuery, ...prev.slice(0, 3)])
    }
  }

  const handleQuickSearch = (query: string) => {
    setSearchQuery(query)
    // Auto-search when quick search is clicked
    setTimeout(() => {
      handleSearch()
    }, 100)
  }

  return (
    <MainLayout>
      <div className="min-h-screen bg-gray-50 dark:bg-gray-900 py-8">
        <div className="container mx-auto px-4 max-w-6xl">
          {/* Header Section */}
          <div className="text-center mb-8">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
            >
              <div className="flex items-center justify-center gap-2 mb-4">
                <Sparkles className="h-8 w-8 text-purple-500" />
                <h1 className="text-4xl font-bold text-gray-900 dark:text-white">
                  AI-Powered Wedding Search
                </h1>
              </div>
              <p className="text-lg text-gray-600 dark:text-gray-400 max-w-2xl mx-auto">
                Describe your dream wedding in natural language and let our AI find the perfect 
                venues, vendors, and packages for you.
              </p>
            </motion.div>
          </div>

          {/* Search Section */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="mb-8"
          >
            <Card>
              <CardContent className="pt-6">
                <div className="space-y-4">
                  <div className="flex gap-4">
                    <div className="flex-1 relative">
                      <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                      <Input
                        placeholder="Describe your dream wedding..."
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                        onKeyPress={(e) => e.key === 'Enter' && handleSearch()}
                        className="pl-10 text-lg py-3"
                      />
                    </div>
                    <Button 
                      onClick={handleSearch}
                      disabled={isSearching || !searchQuery.trim()}
                      className="px-8"
                    >
                      {isSearching ? (
                        <>
                          <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                          Searching...
                        </>
                      ) : (
                        <>
                          <Sparkles className="w-4 h-4 mr-2" />
                          Search
                        </>
                      )}
                    </Button>
                  </div>
                  
                  {/* Location Selector */}
                  <div className="flex items-center gap-2">
                    <MapPin className="w-4 h-4 text-gray-500" />
                    <select
                      value={selectedLocation}
                      onChange={(e) => setSelectedLocation(e.target.value)}
                      className="flex-1 px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md bg-white dark:bg-gray-800 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-purple-500"
                    >
                      {locations.map((location) => (
                        <option key={location} value={location}>
                          {location}
                        </option>
                      ))}
                    </select>
                  </div>
                </div>
              </CardContent>
            </Card>
          </motion.div>

          {/* Quick Searches */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.4 }}
            className="mb-8"
          >
            <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-4">
              Quick searches:
            </h2>
            <div className="flex flex-wrap gap-2">
              {quickSearches.map((search, index) => (
                <Button
                  key={index}
                  variant="outline"
                  size="sm"
                  onClick={() => handleQuickSearch(search)}
                  className="text-sm"
                >
                  {search}
                </Button>
              ))}
            </div>
          </motion.div>

          {/* Recent Searches */}
          {recentSearches.length > 0 && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.6 }}
              className="mb-8"
            >
              <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-4">
                Recent searches:
              </h2>
              <div className="flex flex-wrap gap-2">
                {recentSearches.map((search, index) => (
                  <Button
                    key={index}
                    variant="ghost"
                    size="sm"
                    onClick={() => handleQuickSearch(search)}
                    className="text-sm text-gray-600 dark:text-gray-400"
                  >
                    {search}
                  </Button>
                ))}
              </div>
            </motion.div>
          )}

          {/* Search Results */}
          {searchResults.length > 0 && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.8 }}
            >
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-2xl font-bold text-gray-900 dark:text-white">
                  AI Search Results
                </h2>
                <Badge variant="secondary" className="flex items-center gap-1">
                  <Sparkles className="w-3 h-3" />
                  AI Recommended
                </Badge>
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {searchResults && searchResults.length > 0 ? searchResults.map((result) => (
                  <Card key={result.id} className="overflow-hidden hover:shadow-lg transition-shadow">
                    <div className="relative">
                      <img
                        src={result.image}
                        alt={result.name}
                        className="w-full h-48 object-cover"
                      />
                      <Badge className="absolute top-2 left-2 bg-purple-500">
                        {result.type === 'venue' ? 'Venue' : 'Vendor'}
                      </Badge>
                    </div>
                    
                    <CardContent className="p-4">
                      <h3 className="font-semibold text-lg mb-2">{result.name}</h3>
                      
                      <div className="flex items-center text-gray-600 dark:text-gray-400 text-sm mb-2">
                        <MapPin className="w-3 h-3 mr-1" />
                        {result.location}
                      </div>
                      
                      {result.capacity && (
                        <div className="flex items-center text-gray-600 dark:text-gray-400 text-sm mb-2">
                          <Users className="w-3 h-3 mr-1" />
                          Up to {result.capacity} guests
                        </div>
                      )}
                      
                      {result.experience && (
                        <div className="flex items-center text-gray-600 dark:text-gray-400 text-sm mb-2">
                          <Star className="w-3 h-3 mr-1" />
                          {result.experience} experience
                        </div>
                      )}
                      
                      <div className="flex items-center justify-between mb-3">
                        <div className="flex items-center">
                          <Star className="w-4 h-4 text-yellow-500 mr-1" />
                          <span className="text-sm text-gray-600 dark:text-gray-400">
                            {result.rating}
                          </span>
                        </div>
                        <span className="text-blue-600 font-medium text-sm">
                          {result.price}
                        </span>
                      </div>
                      
                      <p className="text-gray-600 dark:text-gray-400 text-sm mb-4">
                        {result.description}
                      </p>
                      
                      <Button size="sm" className="w-full">
                        View Details
                      </Button>
                    </CardContent>
                  </Card>
                )) : (
                  <div className="col-span-full text-center py-8">
                    <p className="text-gray-500">No results found</p>
                  </div>
                )}
              </div>
            </motion.div>
          )}

          {/* No Results State */}
          {searchResults.length === 0 && !isSearching && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.8 }}
              className="text-center py-12"
            >
              <Sparkles className="h-16 w-16 text-gray-400 mx-auto mb-4" />
              <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-2">
                Ready to Find Your Perfect Wedding?
              </h3>
              <p className="text-gray-600 dark:text-gray-400 mb-6">
                Describe your dream wedding and our AI will help you find the perfect venues and vendors.
              </p>
              <Button onClick={() => setSearchQuery("Beach wedding in Galle for 150 guests")}>
                Try a Sample Search
              </Button>
            </motion.div>
          )}
        </div>
      </div>
    </MainLayout>
  )
}