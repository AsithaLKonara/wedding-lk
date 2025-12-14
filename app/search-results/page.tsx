"use client"

import { useState, useEffect, useCallback, Suspense } from 'react'
import { useSearchParams, useRouter } from 'next/navigation'
import { motion } from 'framer-motion'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Card, CardContent } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { 
  Search, 
  Calendar, 
  Users, 
  MapPin, 
  Star, 
  Heart, 
  Filter,
  Sparkles,
  Crown,
  Award,
  Mic,
  MicOff
} from 'lucide-react'
import Header from '@/components/organisms/header'
import Footer from '@/components/organisms/footer'
import { LocationDropdown } from '@/components/molecules/location-dropdown'
import { useToast } from '@/hooks/use-toast'

interface SearchResult {
  _id: string
  name: string
  businessName?: string
  category: string
  location: {
    city: string
    province: string
    address: string
  }
  rating: {
    average: number
    count: number
  }
  pricing?: {
    basePrice: number
    currency: string
  }
  images: string[]
  description: string
  type: 'venue' | 'vendor'
  contact: {
    phone: string
    email: string
  }
}

interface WeddingPackage {
  _id: string
  name: string
  description: string
  price: number
  originalPrice: number
  rating: {
    average: number
    count: number
  }
  features: string[]
  venues: any[]
  vendors: any[]
  badge?: string
  badgeColor?: string
}

function SearchResultsContent() {
  const searchParams = useSearchParams()
  const router = useRouter()
  const { toast } = useToast()
  
  const [searchQuery, setSearchQuery] = useState(searchParams.get('q') || '')
  const [selectedLocation, setSelectedLocation] = useState(searchParams.get('location') || '')
  const [selectedDate, setSelectedDate] = useState(searchParams.get('date') || '')
  const [guestCount, setGuestCount] = useState(searchParams.get('guests') || '')
  const [searchType, setSearchType] = useState(searchParams.get('type') || 'all')
  
  const [results, setResults] = useState<SearchResult[]>([])
  const [packages, setPackages] = useState<WeddingPackage[]>([])
  const [loading, setLoading] = useState(false)
  const [showFilters, setShowFilters] = useState(false)
  const [isListening, setIsListening] = useState(false)
  const [aiRecommendations, setAiRecommendations] = useState<any>(null)

  const performSearch = useCallback(async () => {
    setLoading(true)
    try {
      const queryParams = new URLSearchParams({
        q: searchQuery,
        location: selectedLocation,
        date: selectedDate,
        guests: guestCount,
        type: searchType
      })

      // Search for venues and vendors
      const searchResponse = await fetch(`/api/search?${queryParams.toString()}`)
      if (searchResponse.ok) {
        const searchData = await searchResponse.json()
        setResults(searchData.results || [])
      }

      // Search for wedding packages
      const packagesResponse = await fetch(`/api/packages?limit=6`)
      if (packagesResponse.ok) {
        const packagesData = await packagesResponse.json()
        if (packagesData.success) {
          const formattedPackages = packagesData.packages.map((pkg: any, index: number) => ({
            ...pkg,
            badge: index === 0 ? "Most Popular" : index === 1 ? "Best Value" : "Featured",
            badgeColor: index === 0 
              ? "bg-gradient-to-r from-yellow-400 to-orange-500"
              : index === 1 
              ? "bg-gradient-to-r from-green-400 to-blue-500"
              : "bg-gradient-to-r from-purple-400 to-pink-500"
          }))
          setPackages(formattedPackages)
        }
      }

      // Get AI recommendations if we have a search query
      if (searchQuery.trim()) {
        try {
          const aiResponse = await fetch('/api/ai-search-enhanced', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
              query: searchQuery,
              context: {
                budget: 1000000,
                guestCount: parseInt(guestCount) || 150,
                location: selectedLocation || "Colombo",
                date: selectedDate || "2024-12-15",
                style: "Traditional Sri Lankan",
                preferences: [],
                specialRequirements: []
              }
            })
          })
          
          if (aiResponse.ok) {
            const aiData = await aiResponse.json()
            setAiRecommendations(aiData.data)
          }
        } catch (error) {
          console.error('AI recommendations error:', error)
        }
      }

    } catch (error) {
      console.error('Search error:', error)
      toast({
        title: 'Search Error',
        description: 'Failed to perform search. Please try again.',
        variant: 'destructive'
      })
    } finally {
      setLoading(false)
    }
  }, [searchQuery, selectedLocation, selectedDate, guestCount, searchType, toast])

  useEffect(() => {
    performSearch()
  }, [performSearch])

  const handleVoiceSearch = () => {
    if ("webkitSpeechRecognition" in window) {
      const recognition = new (window as any).webkitSpeechRecognition()
      recognition.continuous = false
      recognition.interimResults = false
      recognition.lang = "en-US"

      recognition.onstart = () => setIsListening(true)
      recognition.onend = () => setIsListening(false)

      recognition.onresult = (event: any) => {
        const transcript = event.results[0][0].transcript
        setSearchQuery(transcript)
      }

      recognition.start()
    }
  }

  const quickSearches = [
    "Beach wedding venues in Galle",
    "Garden wedding under 200k",
    "Luxury hotel ballrooms Colombo",
    "Mountain view venues for 150 guests",
    "Traditional wedding venues Kandy",
  ]

  return (
    <>
      <Header />
      <main className="min-h-screen bg-gradient-to-br from-gray-50 to-white dark:from-gray-900 dark:to-gray-800">
        {/* AI Search Section */}
        <section className="py-12 bg-gradient-to-br from-pink-50 via-purple-50 to-rose-50 dark:from-gray-900 dark:via-purple-900/20 dark:to-pink-900/20">
          <div className="container mx-auto px-4">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
              className="max-w-4xl mx-auto"
            >
              <Card className="border-0 shadow-2xl bg-white/90 dark:bg-gray-800/90 backdrop-blur-md">
                <CardContent className="p-6">
                  <div className="space-y-4">
                    <div className="flex items-center space-x-2 mb-3">
                      <Sparkles className="h-5 w-5 text-purple-500" />
                      <span className="font-medium text-gray-700 dark:text-gray-300">Refine your search</span>
                    </div>
                    
                    <div className="relative">
                      <Input
                        placeholder="Describe your dream wedding..."
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                        className="pr-12 h-12 text-lg"
                      />
                      <Button
                        variant="ghost"
                        size="sm"
                        className={`absolute right-2 top-2 ${isListening ? "text-red-500" : "text-gray-400"}`}
                        onClick={handleVoiceSearch}
                      >
                        {isListening ? <MicOff className="h-5 w-5" /> : <Mic className="h-5 w-5" />}
                      </Button>
                    </div>

                    <div className="flex flex-wrap gap-2">
                      <span className="text-sm text-gray-600 dark:text-gray-400 mr-2">Quick searches:</span>
                      {quickSearches.map((search, index) => (
                        <Badge
                          key={index}
                          variant="secondary"
                          className="cursor-pointer hover:bg-purple-100 dark:hover:bg-purple-900/50"
                          onClick={() => setSearchQuery(search)}
                        >
                          {search}
                        </Badge>
                      ))}
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                      <div className="space-y-2">
                        <label className="text-sm font-medium text-gray-700 dark:text-gray-300">Location</label>
                        <LocationDropdown
                          value={selectedLocation}
                          onChange={setSelectedLocation}
                          placeholder="Select location"
                        />
                      </div>

                      <div className="space-y-2">
                        <label className="text-sm font-medium text-gray-700 dark:text-gray-300">Wedding Date</label>
                        <div className="relative">
                          <Calendar className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                          <Input
                            type="date"
                            value={selectedDate}
                            onChange={(e) => setSelectedDate(e.target.value)}
                            className="pl-10"
                          />
                        </div>
                      </div>

                      <div className="space-y-2">
                        <label className="text-sm font-medium text-gray-700 dark:text-gray-300">Guest Count</label>
                        <div className="relative">
                          <Users className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                          <Input
                            placeholder="Number of guests"
                            value={guestCount}
                            onChange={(e) => setGuestCount(e.target.value)}
                            className="pl-10"
                          />
                        </div>
                      </div>

                      <div className="space-y-2">
                        <label className="text-sm font-medium text-gray-700 dark:text-gray-300">Type</label>
                        <select
                          value={searchType}
                          onChange={(e) => setSearchType(e.target.value)}
                          className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-purple-500"
                        >
                          <option value="all">All</option>
                          <option value="venues">Venues</option>
                          <option value="vendors">Vendors</option>
                        </select>
                      </div>
                    </div>

                    <Button
                      onClick={performSearch}
                      disabled={loading}
                      className="w-full h-12 text-lg bg-gradient-to-r from-pink-500 via-purple-500 to-rose-500 hover:from-pink-600 hover:via-purple-600 hover:to-rose-600"
                    >
                      {loading ? (
                        <motion.div
                          animate={{ rotate: 360 }}
                          transition={{ duration: 1, repeat: Number.POSITIVE_INFINITY, ease: "linear" }}
                          className="mr-2"
                        >
                          <Sparkles className="h-5 w-5" />
                        </motion.div>
                      ) : (
                        <Search className="mr-2 h-5 w-5" />
                      )}
                      {loading ? "Searching..." : "Search Again"}
                    </Button>
                  </div>
                </CardContent>
              </Card>
            </motion.div>
          </div>
        </section>

        {/* AI Recommendations */}
        {aiRecommendations && (
          <section className="py-12 bg-white dark:bg-gray-800">
            <div className="container mx-auto px-4">
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6 }}
                className="text-center mb-8"
              >
                <h2 className="text-3xl font-bold bg-gradient-to-r from-pink-500 to-purple-600 bg-clip-text text-transparent mb-4">
                  AI Recommendations
                </h2>
                <p className="text-gray-600 dark:text-gray-300">
                  Based on your search, here are our AI-powered recommendations
                </p>
              </motion.div>

              {aiRecommendations.venues && aiRecommendations.venues.length > 0 && (
                <div className="mb-8">
                  <h3 className="text-xl font-semibold mb-4">Recommended Venues</h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {aiRecommendations.venues.slice(0, 3).map((venue: any, index: number) => (
                      <motion.div
                        key={index}
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.6, delay: index * 0.1 }}
                      >
                        <Card className="hover:shadow-lg transition-shadow">
                          <CardContent className="p-4">
                            <div className="aspect-video bg-gray-200 rounded-lg mb-3"></div>
                            <h4 className="font-semibold mb-2">{venue.name}</h4>
                            <p className="text-sm text-gray-600 mb-2">{venue.location}</p>
                            <div className="flex items-center justify-between">
                              <div className="flex items-center">
                                <Star className="h-4 w-4 text-yellow-500 mr-1" />
                                <span className="text-sm">{venue.rating}</span>
                              </div>
                              <span className="font-semibold text-green-600">LKR {venue.price?.toLocaleString()}</span>
                            </div>
                          </CardContent>
                        </Card>
                      </motion.div>
                    ))}
                  </div>
                </div>
              )}
            </div>
          </section>
        )}

        {/* Wedding Packages Section */}
        {packages.length > 0 && (
          <section className="py-12 bg-gradient-to-br from-gray-50 to-white dark:from-gray-900 dark:to-gray-800">
            <div className="container mx-auto px-4">
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6 }}
                className="text-center mb-8"
              >
                <h2 className="text-3xl font-bold bg-gradient-to-r from-pink-500 to-purple-600 bg-clip-text text-transparent mb-4">
                  Complete Wedding Packages
                </h2>
                <p className="text-gray-600 dark:text-gray-300">
                  AI-curated packages featuring our top venues and vendors
                </p>
              </motion.div>

              <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                {packages.map((pkg, index) => (
                  <motion.div
                    key={pkg._id}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.6, delay: index * 0.2 }}
                  >
                    <Card className="hover:shadow-xl transition-all duration-300 border-0 bg-white dark:bg-gray-800">
                      <CardContent className="p-6">
                        {pkg.badge && (
                          <Badge className={`${pkg.badgeColor} text-white mb-4`}>
                            {pkg.badge}
                          </Badge>
                        )}
                        
                        <h3 className="text-xl font-bold mb-2">{pkg.name}</h3>
                        <p className="text-gray-600 dark:text-gray-300 mb-4">{pkg.description}</p>
                        
                        <div className="flex items-center mb-4">
                          <div className="flex items-center mr-4">
                            <Star className="h-4 w-4 text-yellow-500 mr-1" />
                            <span className="text-sm">{pkg.rating.average}</span>
                            <span className="text-sm text-gray-500 ml-1">({pkg.rating.count})</span>
                          </div>
                        </div>

                        <div className="mb-4">
                          <span className="text-2xl font-bold text-green-600">LKR {pkg.price.toLocaleString()}</span>
                          {pkg.originalPrice > pkg.price && (
                            <span className="text-lg text-gray-500 line-through ml-2">
                              LKR {pkg.originalPrice.toLocaleString()}
                            </span>
                          )}
                        </div>

                        <ul className="space-y-2 mb-6">
                          {pkg.features.slice(0, 4).map((feature, idx) => (
                            <li key={idx} className="flex items-center text-sm">
                              <div className="w-2 h-2 bg-pink-500 rounded-full mr-2"></div>
                              {feature}
                            </li>
                          ))}
                        </ul>

                        <Button 
                          className="w-full bg-gradient-to-r from-pink-500 to-purple-600 hover:from-pink-600 hover:to-purple-700"
                          onClick={() => router.push(`/packages/${pkg._id}`)}
                        >
                          View Package Details
                        </Button>
                      </CardContent>
                    </Card>
                  </motion.div>
                ))}
              </div>

              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: 0.6 }}
                className="text-center mt-8"
              >
                <Button
                  onClick={() => router.push('/packages')}
                  size="lg"
                  className="bg-gradient-to-r from-pink-500 to-purple-600 hover:from-pink-600 hover:to-purple-700 text-white px-8 py-3"
                >
                  View All Packages
                </Button>
              </motion.div>
            </div>
          </section>
        )}

        {/* Search Results */}
        <section className="py-12 bg-white dark:bg-gray-800">
          <div className="container mx-auto px-4">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
              className="text-center mb-8"
            >
              <h2 className="text-3xl font-bold bg-gradient-to-r from-pink-500 to-purple-600 bg-clip-text text-transparent mb-4">
                Search Results
              </h2>
              <p className="text-gray-600 dark:text-gray-300">
                Found {results.length} results for your search
              </p>
            </motion.div>

            {loading ? (
              <div className="text-center">
                <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-pink-500 mx-auto"></div>
                <p className="mt-4 text-gray-600">Searching...</p>
              </div>
            ) : results.length > 0 ? (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {results.map((result, index) => (
                  <motion.div
                    key={result._id}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.6, delay: index * 0.1 }}
                  >
                    <Card className="hover:shadow-lg transition-shadow">
                      <CardContent className="p-4">
                        <div className="aspect-video bg-gray-200 rounded-lg mb-3"></div>
                        <h4 className="font-semibold mb-2">{result.name}</h4>
                        {result.businessName && (
                          <p className="text-sm text-gray-600 mb-2">{result.businessName}</p>
                        )}
                        <p className="text-sm text-gray-600 mb-2">{result.category}</p>
                        <div className="flex items-center mb-2">
                          <MapPin className="h-4 w-4 text-gray-400 mr-1" />
                          <span className="text-sm">{result.location.city}, {result.location.province}</span>
                        </div>
                        <div className="flex items-center justify-between">
                          <div className="flex items-center">
                            <Star className="h-4 w-4 text-yellow-500 mr-1" />
                            <span className="text-sm">{result.rating.average}</span>
                            <span className="text-sm text-gray-500 ml-1">({result.rating.count})</span>
                          </div>
                          {result.pricing && (
                            <span className="font-semibold text-green-600">
                              LKR {result.pricing.basePrice.toLocaleString()}
                            </span>
                          )}
                        </div>
                        <Button 
                          className="w-full mt-3"
                          onClick={() => router.push(`/${result.type}s/${result._id}`)}
                        >
                          View Details
                        </Button>
                      </CardContent>
                    </Card>
                  </motion.div>
                ))}
              </div>
            ) : (
              <div className="text-center py-12">
                <p className="text-gray-600 dark:text-gray-300 text-lg">
                  No results found for your search. Try adjusting your criteria.
                </p>
              </div>
            )}
          </div>
        </section>
      </main>
      <Footer />
    </>
  )
}

export default function SearchResultsPage() {
  return (
    <Suspense fallback={
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
      </div>
    }>
      <SearchResultsContent />
    </Suspense>
  )
}
