'use client'

import { useState, useEffect, Suspense } from 'react'
import { useSearchParams } from 'next/navigation'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Badge } from '@/components/ui/badge'
import { Search, Filter, MapPin, Star, Calendar, Users, DollarSign } from 'lucide-react'
import { toast } from 'sonner'

interface SearchResult {
  _id: string
  type: 'venue' | 'vendor' | 'package'
  name: string
  description: string
  price?: number
  rating: number
  reviewCount: number
  location: string
  image: string
  category?: string
  features?: string[]
}

function SearchContent() {
  const searchParams = useSearchParams()
  const [searchQuery, setSearchQuery] = useState(searchParams.get('q') || '')
  const [searchResults, setSearchResults] = useState<SearchResult[]>([])
  const [loading, setLoading] = useState(false)
  const [filters, setFilters] = useState({
    type: 'all',
    category: 'all',
    location: 'all',
    priceRange: 'all',
    rating: 'all'
  })

  useEffect(() => {
    if (searchQuery) {
      performSearch()
    }
  }, [searchQuery])

  const performSearch = async () => {
    setLoading(true)
    try {
      const response = await fetch('/api/ai-search', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          query: searchQuery,
          filters
        })
      })
      
      if (response.ok) {
        const data = await response.json()
        setSearchResults(data.results || [])
      } else {
        // Mock data for testing
        setSearchResults([
          {
            _id: '1',
            type: 'venue',
            name: 'Grand Ballroom Colombo',
            description: 'Elegant ballroom with stunning city views',
            price: 150000,
            rating: 4.8,
            reviewCount: 45,
            location: 'Colombo',
            image: '/images/venue-1.jpg',
            category: 'Ballroom',
            features: ['Air Conditioning', 'Parking', 'Catering']
          },
          {
            _id: '2',
            type: 'vendor',
            name: 'Elegant Photography',
            description: 'Professional wedding photography services',
            price: 75000,
            rating: 4.9,
            reviewCount: 32,
            location: 'Colombo',
            image: '/images/vendor-1.jpg',
            category: 'Photography',
            features: ['Full Day Coverage', 'Edited Photos', 'Online Gallery']
          },
          {
            _id: '3',
            type: 'package',
            name: 'Premium Wedding Package',
            description: 'Complete wedding package with all services',
            price: 2500000,
            rating: 4.7,
            reviewCount: 28,
            location: 'Colombo',
            image: '/images/package-1.jpg',
            category: 'Complete Package',
            features: ['Venue', 'Catering', 'Photography', 'Decoration']
          }
        ])
      }
    } catch (error) {
      console.error('Error performing search:', error)
      toast.error('Failed to perform search')
    } finally {
      setLoading(false)
    }
  }

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault()
    performSearch()
  }

  const handleFilterChange = (key: string, value: string) => {
    setFilters(prev => ({
      ...prev,
      [key]: value
    }))
  }

  const getTypeIcon = (type: string) => {
    switch (type) {
      case 'venue': return <MapPin className="h-4 w-4" />
      case 'vendor': return <Users className="h-4 w-4" />
      case 'package': return <Calendar className="h-4 w-4" />
      default: return <Search className="h-4 w-4" />
    }
  }

  const getTypeColor = (type: string) => {
    switch (type) {
      case 'venue': return 'bg-blue-100 text-blue-800'
      case 'vendor': return 'bg-green-100 text-green-800'
      case 'package': return 'bg-purple-100 text-purple-800'
      default: return 'bg-gray-100 text-gray-800'
    }
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Search Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-4">Search Results</h1>
          
          {/* Search Form */}
          <form onSubmit={handleSearch} className="mb-6">
            <div className="flex space-x-2">
              <Input
                placeholder="Search venues, vendors, packages..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="flex-1"
              />
              <Button type="submit" disabled={loading}>
                <Search className="h-4 w-4 mr-2" />
                {loading ? 'Searching...' : 'Search'}
              </Button>
            </div>
          </form>

          {/* Filters */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center">
                <Filter className="h-5 w-5 mr-2" />
                Filters
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-5 gap-4">
                <div>
                  <label className="text-sm font-medium text-gray-700 mb-2 block">Type</label>
                  <Select value={filters.type} onValueChange={(value) => handleFilterChange('type', value)}>
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">All Types</SelectItem>
                      <SelectItem value="venue">Venues</SelectItem>
                      <SelectItem value="vendor">Vendors</SelectItem>
                      <SelectItem value="package">Packages</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                
                <div>
                  <label className="text-sm font-medium text-gray-700 mb-2 block">Category</label>
                  <Select value={filters.category} onValueChange={(value) => handleFilterChange('category', value)}>
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">All Categories</SelectItem>
                      <SelectItem value="photography">Photography</SelectItem>
                      <SelectItem value="catering">Catering</SelectItem>
                      <SelectItem value="decoration">Decoration</SelectItem>
                      <SelectItem value="music">Music</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                
                <div>
                  <label className="text-sm font-medium text-gray-700 mb-2 block">Location</label>
                  <Select value={filters.location} onValueChange={(value) => handleFilterChange('location', value)}>
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">All Locations</SelectItem>
                      <SelectItem value="colombo">Colombo</SelectItem>
                      <SelectItem value="negombo">Negombo</SelectItem>
                      <SelectItem value="galle">Galle</SelectItem>
                      <SelectItem value="kandy">Kandy</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                
                <div>
                  <label className="text-sm font-medium text-gray-700 mb-2 block">Price Range</label>
                  <Select value={filters.priceRange} onValueChange={(value) => handleFilterChange('priceRange', value)}>
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">All Prices</SelectItem>
                      <SelectItem value="under-50k">Under LKR 50,000</SelectItem>
                      <SelectItem value="50k-100k">LKR 50,000 - 100,000</SelectItem>
                      <SelectItem value="100k-500k">LKR 100,000 - 500,000</SelectItem>
                      <SelectItem value="over-500k">Over LKR 500,000</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                
                <div>
                  <label className="text-sm font-medium text-gray-700 mb-2 block">Rating</label>
                  <Select value={filters.rating} onValueChange={(value) => handleFilterChange('rating', value)}>
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">All Ratings</SelectItem>
                      <SelectItem value="4.5+">4.5+ Stars</SelectItem>
                      <SelectItem value="4.0+">4.0+ Stars</SelectItem>
                      <SelectItem value="3.5+">3.5+ Stars</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Search Results */}
        <div className="space-y-4">
          {loading ? (
            <div className="text-center py-8">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto"></div>
              <p className="mt-2 text-gray-600">Searching...</p>
            </div>
          ) : searchResults.length > 0 ? (
            searchResults.map((result) => (
              <Card key={result._id} className="hover:shadow-md transition-shadow">
                <CardContent className="p-6">
                  <div className="flex space-x-4">
                    <img
                      src={result.image || '/images/placeholder.jpg'}
                      alt={result.name}
                      className="w-24 h-24 object-cover rounded-lg"
                    />
                    <div className="flex-1">
                      <div className="flex items-start justify-between">
                        <div>
                          <div className="flex items-center space-x-2 mb-2">
                            <Badge className={getTypeColor(result.type)}>
                              {getTypeIcon(result.type)}
                              <span className="ml-1">{result.type}</span>
                            </Badge>
                            {result.category && (
                              <Badge variant="outline">{result.category}</Badge>
                            )}
                          </div>
                          <h3 className="text-lg font-semibold text-gray-900 mb-1">
                            {result.name}
                          </h3>
                          <p className="text-gray-600 mb-2">{result.description}</p>
                          <div className="flex items-center space-x-4 text-sm text-gray-500">
                            <div className="flex items-center">
                              <MapPin className="h-4 w-4 mr-1" />
                              {result.location}
                            </div>
                            <div className="flex items-center">
                              <Star className="h-4 w-4 mr-1 text-yellow-400" />
                              {result.rating} ({result.reviewCount} reviews)
                            </div>
                            {result.price && (
                              <div className="flex items-center">
                                <DollarSign className="h-4 w-4 mr-1" />
                                LKR {result.price.toLocaleString()}
                              </div>
                            )}
                          </div>
                        </div>
                        <Button
                          onClick={() => window.location.href = `/${result.type}s/${result._id}`}
                        >
                          View Details
                        </Button>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))
          ) : (
            <Card>
              <CardContent className="p-8 text-center">
                <Search className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                <h3 className="text-lg font-semibold text-gray-900 mb-2">No Results Found</h3>
                <p className="text-gray-600 mb-4">
                  Try adjusting your search terms or filters to find what you're looking for.
                </p>
                <Button onClick={() => setSearchQuery('')}>
                  Clear Search
                </Button>
              </CardContent>
            </Card>
          )}
        </div>
      </div>
    </div>
  )
}
