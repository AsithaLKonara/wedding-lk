"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Star, MapPin, Users, DollarSign, Calendar, Search, Filter } from "lucide-react"
import Link from "next/link"
import { MainLayout } from "@/components/templates/main-layout"

interface Venue {
  _id: string
  name: string
  description: string
  location: {
    city: string
    province: string
  }
  capacity: {
    min: number
    max: number
  }
  pricing: {
    basePrice: number
    perPerson: number
    minimumGuests: number
  }
  amenities: string[]
  reviewStats: {
    averageRating: number
    count: number
  }
  isActive: boolean
}

export default function VenuesPage() {
  const [venues, setVenues] = useState<Venue[]>([])
  const [loading, setLoading] = useState(true)
  const [searchQuery, setSearchQuery] = useState("")
  const [selectedLocation, setSelectedLocation] = useState("all")
  const [minCapacity, setMinCapacity] = useState("")
  const [maxCapacity, setMaxCapacity] = useState("")
  const [minRating, setMinRating] = useState("all")

  const fetchVenues = async () => {
    try {
      setLoading(true)
      const params = new URLSearchParams({
        limit: '20',
        offset: '0'
      })
      
      if (selectedLocation && selectedLocation !== 'all') params.append('location', selectedLocation)
      if (minCapacity) params.append('minCapacity', minCapacity)
      if (maxCapacity) params.append('maxCapacity', maxCapacity)
      if (minRating && minRating !== 'all') params.append('minRating', minRating)
      if (searchQuery) params.append('q', searchQuery)

      const response = await fetch(`/api/venues/search?${params}`)
      if (response.ok) {
        const data = await response.json()
        setVenues(data.venues)
      }
    } catch (error) {
      console.error('Failed to fetch venues:', error)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchVenues()
  }, [searchQuery, selectedLocation, minCapacity, maxCapacity, minRating])

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault()
    fetchVenues()
  }

  const handleReset = () => {
    setSearchQuery("")
    setSelectedLocation("")
    setMinCapacity("")
    setMaxCapacity("")
    setMinRating("")
  }

  return (
    <MainLayout>
      <div className="min-h-screen bg-gray-50">
      {/* Hero Section */}
      <div className="bg-gradient-to-r from-purple-600 to-pink-600 text-white py-16">
        <div className="container mx-auto px-4 text-center">
          <h1 className="text-4xl font-bold mb-4">Discover Perfect Wedding Venues</h1>
          <p className="text-xl text-purple-100 max-w-2xl mx-auto">
            From intimate gardens to grand ballrooms, find the perfect setting for your special day
          </p>
        </div>
      </div>

      <div className="container mx-auto px-4 py-8">
        {/* Search and Filters */}
        <Card className="mb-8">
          <CardHeader>
            <CardTitle className="flex items-center space-x-2">
              <Search className="h-5 w-5" />
              <span>Search & Filter Venues</span>
            </CardTitle>
            <CardDescription>
              Find venues by location, capacity, rating, or search terms
            </CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSearch} className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4">
                <div>
                  <Input
                    placeholder="Search venues or locations..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                  />
                </div>
                <Select value={selectedLocation} onValueChange={setSelectedLocation}>
                  <SelectTrigger>
                    <SelectValue placeholder="Select Location" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Locations</SelectItem>
                    <SelectItem value="Colombo">Colombo</SelectItem>
                    <SelectItem value="Kandy">Kandy</SelectItem>
                    <SelectItem value="Galle">Galle</SelectItem>
                    <SelectItem value="Jaffna">Jaffna</SelectItem>
                    <SelectItem value="Anuradhapura">Anuradhapura</SelectItem>
                  </SelectContent>
                </Select>
                <Input
                  type="number"
                  placeholder="Min Capacity"
                  value={minCapacity}
                  onChange={(e) => setMinCapacity(e.target.value)}
                />
                <Input
                  type="number"
                  placeholder="Max Capacity"
                  value={maxCapacity}
                  onChange={(e) => setMaxCapacity(e.target.value)}
                />
                <Select value={minRating} onValueChange={setMinRating}>
                  <SelectTrigger>
                    <SelectValue placeholder="Min Rating" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">Any Rating</SelectItem>
                    <SelectItem value="4">4+ Stars</SelectItem>
                    <SelectItem value="4.5">4.5+ Stars</SelectItem>
                    <SelectItem value="5">5 Stars</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              
              <div className="flex justify-between items-center">
                <Button type="submit" className="flex items-center space-x-2">
                  <Search className="h-4 w-4" />
                  <span>Search</span>
                </Button>
                <Button type="button" variant="outline" onClick={handleReset}>
                  Reset Filters
                </Button>
              </div>
            </form>
          </CardContent>
        </Card>

        {/* Results */}
        <div className="mb-8">
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-2xl font-bold text-gray-900">
              {loading ? 'Loading...' : `${venues.length} Venues Found`}
            </h2>
            <div className="text-sm text-gray-600">
              Showing {venues.length} results
            </div>
          </div>

          {loading ? (
            <div className="text-center py-12">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-purple-600 mx-auto"></div>
              <p className="mt-4 text-gray-600">Searching for venues...</p>
            </div>
          ) : venues.length === 0 ? (
            <div className="text-center py-12">
              <Calendar className="h-12 w-12 text-gray-400 mx-auto mb-4" />
              <h3 className="text-lg font-medium text-gray-900 mb-2">No venues found</h3>
              <p className="text-gray-600 mb-4">
                Try adjusting your search criteria or browse all locations
              </p>
              <Button onClick={handleReset}>Reset Filters</Button>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {venues.map((venue) => (
                <Card key={venue._id} className="hover:shadow-lg transition-shadow duration-300">
                  <CardHeader className="pb-4">
                    <CardTitle className="text-lg font-semibold text-gray-900 mb-1">
                      {venue.name}
                    </CardTitle>
                    <CardDescription className="text-sm text-gray-600">
                      {venue.location.city}, {venue.location.province}
                    </CardDescription>
                  </CardHeader>

                  <CardContent className="space-y-4">
                    <p className="text-gray-700 text-sm line-clamp-3">
                      {venue.description}
                    </p>

                    <div className="flex items-center space-x-2">
                      <Star className="h-4 w-4 text-yellow-500 fill-current" />
                      <span className="text-sm font-medium text-gray-900">
                        {venue.reviewStats?.averageRating || 4.5}
                      </span>
                      <span className="text-sm text-gray-500">
                        ({venue.reviewStats?.count || 0} reviews)
                      </span>
                    </div>

                    <div className="grid grid-cols-2 gap-4 text-sm">
                      <div className="flex items-center space-x-2">
                        <Users className="h-4 w-4 text-blue-600" />
                        <span className="text-gray-700">
                          {venue.capacity.min}-{venue.capacity.max} guests
                        </span>
                      </div>
                      <div className="flex items-center space-x-2">
                        <DollarSign className="h-4 w-4 text-green-600" />
                        <span className="text-gray-700">
                          From LKR {venue.pricing?.basePrice?.toLocaleString() || "0"}
                        </span>
                      </div>
                    </div>

                    <div className="flex flex-wrap gap-2">
                      {venue.amenities.slice(0, 3).map((amenity, index) => (
                        <Badge key={index} variant="secondary" className="text-xs">
                          {amenity}
                        </Badge>
                      ))}
                      {venue.amenities.length > 3 && (
                        <Badge variant="outline" className="text-xs">
                          +{venue.amenities.length - 3} more
                        </Badge>
                      )}
                    </div>

                    <div className="pt-4">
                      <Link href={`/venues/${venue._id}`}>
                        <Button className="w-full" variant="default">
                          View Venue
                        </Button>
                      </Link>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          )}
        </div>

        {/* Popular Locations */}
        <Card>
          <CardHeader>
            <CardTitle>Popular Locations</CardTitle>
            <CardDescription>
              Browse venues by popular wedding destinations
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-4">
              {[
                { name: 'Colombo', count: '50+' },
                { name: 'Kandy', count: '30+' },
                { name: 'Galle', count: '25+' },
                { name: 'Jaffna', count: '20+' },
                { name: 'Anuradhapura', count: '15+' },
                { name: 'Other Cities', count: '40+' }
              ].map((location) => (
                <Link key={location.name} href={`/venues?location=${location.name}`}>
                  <div className="text-center p-4 border rounded-lg hover:bg-gray-50 transition-colors cursor-pointer">
                    <div className="text-lg font-semibold text-gray-900">
                      {location.name}
                    </div>
                    <div className="text-sm text-gray-400">
                      {location.count} venues
                    </div>
                  </div>
                </Link>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>
      </div>
    </MainLayout>
  )
} 