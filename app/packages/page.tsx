"use client"

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { motion } from 'framer-motion'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Card, CardContent } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { 
  Search, 
  Calendar, 
  Users, 
  Star, 
  Heart, 
  Filter,
  Sparkles,
  Crown,
  Award,
  MapPin,
  Mic,
  MicOff
} from 'lucide-react'
import Header from '@/components/organisms/header'
import Footer from '@/components/organisms/footer'
import { LocationDropdown } from '@/components/molecules/location-dropdown'
import { useToast } from '@/hooks/use-toast'

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
  location?: string
}

export default function PackagesPage() {
  const router = useRouter()
  const { toast } = useToast()
  
  const [searchQuery, setSearchQuery] = useState('')
  const [selectedLocation, setSelectedLocation] = useState('')
  const [selectedDate, setSelectedDate] = useState('')
  const [guestCount, setGuestCount] = useState('')
  const [priceRange, setPriceRange] = useState([0, 2000000])
  const [sortBy, setSortBy] = useState('featured')
  
  const [packages, setPackages] = useState<WeddingPackage[]>([])
  const [filteredPackages, setFilteredPackages] = useState<WeddingPackage[]>([])
  const [loading, setLoading] = useState(true)
  const [showFilters, setShowFilters] = useState(false)
  const [isListening, setIsListening] = useState(false)

  useEffect(() => {
    fetchPackages()
  }, [])

  useEffect(() => {
    filterPackages()
  }, [packages, searchQuery, selectedLocation, priceRange, sortBy])

  const fetchPackages = async () => {
    setLoading(true)
    try {
      const response = await fetch('/api/packages?limit=50')
      if (response.ok) {
        const data = await response.json()
        if (data.success) {
          const formattedPackages = data.packages.map((pkg: any, index: number) => ({
            ...pkg,
            badge: index === 0 ? "Most Popular" : index === 1 ? "Best Value" : index === 2 ? "Featured" : undefined,
            badgeColor: index === 0 
              ? "bg-gradient-to-r from-yellow-400 to-orange-500"
              : index === 1 
              ? "bg-gradient-to-r from-green-400 to-blue-500"
              : index === 2
              ? "bg-gradient-to-r from-purple-400 to-pink-500"
              : undefined,
            location: getLocationFromVenues(pkg.venues)
          }))
          setPackages(formattedPackages)
        }
      }
    } catch (error) {
      console.error('Error fetching packages:', error)
      toast({
        title: 'Error',
        description: 'Failed to fetch packages. Please try again.',
        variant: 'destructive'
      })
    } finally {
      setLoading(false)
    }
  }

  const getLocationFromVenues = (venues: any[]) => {
    if (!venues || venues.length === 0) return 'Various Locations'
    const locations = venues.map(venue => venue.location?.city || venue.city).filter(Boolean)
    return locations.length > 0 ? locations.join(', ') : 'Various Locations'
  }

  const filterPackages = () => {
    let filtered = [...packages]

    // Search filter
    if (searchQuery.trim()) {
      filtered = filtered.filter(pkg => 
        pkg.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        pkg.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
        pkg.location?.toLowerCase().includes(searchQuery.toLowerCase())
      )
    }

    // Location filter
    if (selectedLocation) {
      filtered = filtered.filter(pkg => 
        pkg.location?.toLowerCase().includes(selectedLocation.toLowerCase())
      )
    }

    // Price filter
    filtered = filtered.filter(pkg => 
      pkg.price >= priceRange[0] && pkg.price <= priceRange[1]
    )

    // Sort
    switch (sortBy) {
      case 'price-low':
        filtered.sort((a, b) => a.price - b.price)
        break
      case 'price-high':
        filtered.sort((a, b) => b.price - a.price)
        break
      case 'rating':
        filtered.sort((a, b) => b.rating.average - a.rating.average)
        break
      case 'featured':
      default:
        filtered.sort((a, b) => {
          if (a.badge && !b.badge) return -1
          if (!a.badge && b.badge) return 1
          return b.rating.average - a.rating.average
        })
        break
    }

    setFilteredPackages(filtered)
  }

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
    "Beach wedding packages Galle",
    "Garden wedding packages Kandy",
    "Luxury wedding packages Colombo",
    "Budget wedding packages under 500k",
    "Traditional wedding packages",
  ]

  const locationBasedPackages = [
    {
      city: "Colombo",
      packages: packages.filter(pkg => pkg.location?.toLowerCase().includes('colombo')).slice(0, 3),
      color: "from-blue-500 to-cyan-500"
    },
    {
      city: "Kandy",
      packages: packages.filter(pkg => pkg.location?.toLowerCase().includes('kandy')).slice(0, 3),
      color: "from-green-500 to-emerald-500"
    },
    {
      city: "Galle",
      packages: packages.filter(pkg => pkg.location?.toLowerCase().includes('galle')).slice(0, 3),
      color: "from-purple-500 to-pink-500"
    }
  ]

  return (
    <>
      <Header />
      <main className="min-h-screen bg-gradient-to-br from-gray-50 to-white dark:from-gray-900 dark:to-gray-800">
        {/* Hero Section */}
        <section className="py-20 bg-gradient-to-br from-pink-50 via-purple-50 to-rose-50 dark:from-gray-900 dark:via-purple-900/20 dark:to-pink-900/20">
          <div className="container mx-auto px-4">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8 }}
              className="text-center mb-12"
            >
              <div className="inline-flex items-center bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm rounded-full px-4 py-2 mb-6">
                <Sparkles className="h-4 w-4 text-purple-500 mr-2" />
                <span className="text-sm font-medium text-gray-700 dark:text-gray-300">AI-Curated Wedding Packages</span>
              </div>

              <h1 className="text-4xl md:text-6xl font-bold text-gray-900 dark:text-white mb-6">
                Complete Wedding
                <span className="block bg-gradient-to-r from-pink-500 via-purple-500 to-rose-500 bg-clip-text text-transparent">
                  Packages
                </span>
              </h1>

              <p className="text-xl text-gray-600 dark:text-gray-300 max-w-3xl mx-auto">
                Discover perfectly curated wedding packages featuring our top-rated venues and trusted vendors, 
                all in one convenient package
              </p>
            </motion.div>

            {/* Search Section */}
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.2 }}
              className="max-w-4xl mx-auto"
            >
              <Card className="border-0 shadow-2xl bg-white/90 dark:bg-gray-800/90 backdrop-blur-md">
                <CardContent className="p-8">
                  <div className="space-y-6">
                    <div className="relative">
                      <div className="flex items-center space-x-2 mb-3">
                        <Sparkles className="h-5 w-5 text-purple-500" />
                        <span className="font-medium text-gray-700 dark:text-gray-300">Search packages</span>
                      </div>
                      <div className="relative">
                        <Input
                          placeholder="Search for wedding packages..."
                          value={searchQuery}
                          onChange={(e) => setSearchQuery(e.target.value)}
                          className="pr-12 h-14 text-lg"
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
                          placeholder="All locations"
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
                        <label className="text-sm font-medium text-gray-700 dark:text-gray-300">Sort By</label>
                        <select
                          value={sortBy}
                          onChange={(e) => setSortBy(e.target.value)}
                          className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-purple-500"
                        >
                          <option value="featured">Featured</option>
                          <option value="price-low">Price: Low to High</option>
                          <option value="price-high">Price: High to Low</option>
                          <option value="rating">Highest Rated</option>
                        </select>
                      </div>
                    </div>

                    <div className="space-y-2">
                      <label className="text-sm font-medium text-gray-700 dark:text-gray-300">
                        Price Range: LKR {priceRange[0].toLocaleString()} - LKR {priceRange[1].toLocaleString()}
                      </label>
                      <input
                        type="range"
                        min="0"
                        max="2000000"
                        step="50000"
                        value={priceRange[1]}
                        onChange={(e) => setPriceRange([priceRange[0], parseInt(e.target.value)])}
                        className="w-full"
                      />
                    </div>
                  </div>
                </CardContent>
              </Card>
            </motion.div>
          </div>
        </section>

        {/* Location-Based Packages */}
        <section className="py-16 bg-white dark:bg-gray-800">
          <div className="container mx-auto px-4">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
              className="text-center mb-12"
            >
              <h2 className="text-3xl font-bold bg-gradient-to-r from-pink-500 to-purple-600 bg-clip-text text-transparent mb-4">
                Packages by Location
              </h2>
              <p className="text-gray-600 dark:text-gray-300">
                Popular wedding packages in major Sri Lankan cities
              </p>
            </motion.div>

            <div className="space-y-16">
              {locationBasedPackages.map((location, locationIndex) => (
                <motion.div
                  key={location.city}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.6, delay: locationIndex * 0.2 }}
                >
                  <div className="flex items-center mb-6">
                    <div className={`w-4 h-4 bg-gradient-to-r ${location.color} rounded-full mr-3`}></div>
                    <h3 className="text-2xl font-bold text-gray-900 dark:text-white">{location.city}</h3>
                  </div>

                  {location.packages.length > 0 ? (
                    <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                      {location.packages.map((pkg, index) => (
                        <motion.div
                          key={pkg._id}
                          initial={{ opacity: 0, y: 20 }}
                          animate={{ opacity: 1, y: 0 }}
                          transition={{ duration: 0.6, delay: index * 0.1 }}
                        >
                          <Card className="hover:shadow-xl transition-all duration-300 border-0 bg-white dark:bg-gray-800">
                            <CardContent className="p-6">
                              {pkg.badge && (
                                <Badge className={`${pkg.badgeColor} text-white mb-4`}>
                                  {pkg.badge}
                                </Badge>
                              )}
                              
                              <h4 className="text-xl font-bold mb-2">{pkg.name}</h4>
                              <p className="text-gray-600 dark:text-gray-300 mb-4">{pkg.description}</p>
                              
                              <div className="flex items-center mb-4">
                                <div className="flex items-center mr-4">
                                  <Star className="h-4 w-4 text-yellow-500 mr-1" />
                                  <span className="text-sm">{pkg.rating.average}</span>
                                  <span className="text-sm text-gray-500 ml-1">({pkg.rating.count})</span>
                                </div>
                                <div className="flex items-center">
                                  <MapPin className="h-4 w-4 text-gray-400 mr-1" />
                                  <span className="text-sm">{location.city}</span>
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
                  ) : (
                    <div className="text-center py-8">
                      <p className="text-gray-600 dark:text-gray-300">
                        No packages available for {location.city} yet. Check back soon!
                      </p>
                    </div>
                  )}
                </motion.div>
              ))}
            </div>
          </div>
        </section>

        {/* All Packages */}
        <section className="py-16 bg-gradient-to-br from-gray-50 to-white dark:from-gray-900 dark:to-gray-800">
          <div className="container mx-auto px-4">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
              className="text-center mb-8"
            >
              <h2 className="text-3xl font-bold bg-gradient-to-r from-pink-500 to-purple-600 bg-clip-text text-transparent mb-4">
                All Wedding Packages
              </h2>
              <p className="text-gray-600 dark:text-gray-300">
                {filteredPackages.length} packages found
              </p>
            </motion.div>

            {loading ? (
              <div className="text-center">
                <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-pink-500 mx-auto"></div>
                <p className="mt-4 text-gray-600">Loading packages...</p>
              </div>
            ) : filteredPackages.length > 0 ? (
              <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                {filteredPackages.map((pkg, index) => (
                  <motion.div
                    key={pkg._id}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.6, delay: index * 0.1 }}
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
                          <div className="flex items-center">
                            <MapPin className="h-4 w-4 text-gray-400 mr-1" />
                            <span className="text-sm">{pkg.location}</span>
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
            ) : (
              <div className="text-center py-12">
                <p className="text-gray-600 dark:text-gray-300 text-lg">
                  No packages found matching your criteria. Try adjusting your filters.
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
