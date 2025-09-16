"use client"

import { useState, useEffect } from 'react'
import { useRouter, useSearchParams } from 'next/navigation'
import { Search, Filter, MapPin, DollarSign, Star, Calendar, X } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Slider } from '@/components/ui/slider'

interface SearchFilters {
  query: string
  type: string
  category: string
  location: string
  minPrice: number
  maxPrice: number
  rating: number
  sortBy: string
}

interface SearchResult {
  _id: string
  name: string
  description: string
  price?: number
  rating?: number
  location?: string
  category?: string
  image?: string
  type: 'vendor' | 'venue' | 'package'
  searchScore?: number
}

interface SearchResponse {
  success: boolean
  results: SearchResult[]
  pagination: {
    page: number
    limit: number
    totalCount: number
    totalPages: number
    hasNext: boolean
    hasPrev: boolean
  }
  filters: SearchFilters
}

export function AdvancedSearch() {
  const router = useRouter()
  const searchParams = useSearchParams()
  
  const [filters, setFilters] = useState<SearchFilters>({
    query: searchParams.get('q') || '',
    type: searchParams.get('type') || 'all',
    category: searchParams.get('category') || '',
    location: searchParams.get('location') || '',
    minPrice: parseInt(searchParams.get('minPrice') || '0'),
    maxPrice: parseInt(searchParams.get('maxPrice') || '1000000'),
    rating: parseInt(searchParams.get('rating') || '0'),
    sortBy: searchParams.get('sortBy') || 'relevance'
  })

  const [results, setResults] = useState<SearchResult[]>([])
  const [loading, setLoading] = useState(false)
  const [pagination, setPagination] = useState<SearchResponse['pagination'] | null>(null)
  const [showFilters, setShowFilters] = useState(false)

  const categories = [
    'Photography', 'Videography', 'Catering', 'Music', 'Decorations',
    'Transportation', 'Wedding Planning', 'Beauty & Makeup', 'Flowers',
    'Venue', 'DJ', 'Lighting', 'Security', 'Other'
  ]

  const locations = [
    'Colombo', 'Kandy', 'Galle', 'Negombo', 'Anuradhapura', 'Polonnaruwa',
    'Trincomalee', 'Batticaloa', 'Jaffna', 'Ratnapura', 'Kurunegala',
    'Matara', 'Hambantota', 'Kalutara', 'Puttalam', 'Mannar', 'Vavuniya'
  ]

  useEffect(() => {
    if (filters.query || filters.type !== 'all' || filters.category || filters.location) {
      performSearch()
    }
  }, [filters])

  const performSearch = async () => {
    setLoading(true)
    
    try {
      const params = new URLSearchParams()
      Object.entries(filters).forEach(([key, value]) => {
        if (value && value !== 'all' && value !== '0') {
          params.append(key, value.toString())
        }
      })

      const response = await fetch(`/api/search?${params.toString()}`)
      const data: SearchResponse = await response.json()

      if (data.success) {
        setResults(data.results)
        setPagination(data.pagination)
      }
    } catch (error) {
      console.error('Search error:', error)
    } finally {
      setLoading(false)
    }
  }

  const handleFilterChange = (key: keyof SearchFilters, value: string | number) => {
    setFilters(prev => ({ ...prev, [key]: value }))
  }

  const clearFilters = () => {
    setFilters({
      query: '',
      type: 'all',
      category: '',
      location: '',
      minPrice: 0,
      maxPrice: 1000000,
      rating: 0,
      sortBy: 'relevance'
    })
    setResults([])
    setPagination(null)
  }

  const formatPrice = (price: number) => {
    return new Intl.NumberFormat('en-LK', {
      style: 'currency',
      currency: 'LKR',
      minimumFractionDigits: 0
    }).format(price)
  }

  const getTypeColor = (type: string) => {
    switch (type) {
      case 'vendor': return 'bg-blue-100 text-blue-800'
      case 'venue': return 'bg-green-100 text-green-800'
      case 'package': return 'bg-purple-100 text-purple-800'
      default: return 'bg-gray-100 text-gray-800'
    }
  }

  const handleResultClick = (result: SearchResult) => {
    const basePath = result.type === 'vendor' ? '/vendors' : 
                    result.type === 'venue' ? '/venues' : '/packages'
    router.push(`${basePath}/${result._id}`)
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      {/* Search Header */}
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900 mb-2">Advanced Search</h1>
        <p className="text-gray-600">Find the perfect vendors, venues, and packages for your wedding</p>
      </div>

      {/* Search Bar */}
      <Card className="mb-6">
        <CardContent className="p-6">
          <div className="flex flex-col lg:flex-row gap-4">
            <div className="flex-1">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                <Input
                  placeholder="Search for vendors, venues, or packages..."
                  value={filters.query}
                  onChange={(e) => handleFilterChange('query', e.target.value)}
                  className="pl-10"
                />
              </div>
            </div>
            <div className="flex gap-2">
              <Select value={filters.type} onValueChange={(value) => handleFilterChange('type', value)}>
                <SelectTrigger className="w-32">
                  <SelectValue placeholder="Type" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All</SelectItem>
                  <SelectItem value="vendors">Vendors</SelectItem>
                  <SelectItem value="venues">Venues</SelectItem>
                  <SelectItem value="packages">Packages</SelectItem>
                </SelectContent>
              </Select>
              <Button
                variant="outline"
                onClick={() => setShowFilters(!showFilters)}
                className="flex items-center gap-2"
              >
                <Filter className="w-4 h-4" />
                Filters
              </Button>
              <Button onClick={performSearch} className="bg-gradient-to-r from-purple-500 to-blue-500 hover:from-purple-600 hover:to-blue-600">
                Search
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Advanced Filters */}
      {showFilters && (
        <Card className="mb-6">
          <CardHeader>
            <div className="flex items-center justify-between">
              <CardTitle>Advanced Filters</CardTitle>
              <Button variant="ghost" size="sm" onClick={clearFilters}>
                <X className="w-4 h-4 mr-1" />
                Clear All
              </Button>
            </div>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
              {/* Category */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Category</label>
                <Select value={filters.category} onValueChange={(value) => handleFilterChange('category', value)}>
                  <SelectTrigger>
                    <SelectValue placeholder="Select category" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="">All Categories</SelectItem>
                    {categories.map(category => (
                      <SelectItem key={category} value={category}>{category}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              {/* Location */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Location</label>
                <Select value={filters.location} onValueChange={(value) => handleFilterChange('location', value)}>
                  <SelectTrigger>
                    <SelectValue placeholder="Select location" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="">All Locations</SelectItem>
                    {locations.map(location => (
                      <SelectItem key={location} value={location}>{location}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              {/* Price Range */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Price Range: {formatPrice(filters.minPrice)} - {formatPrice(filters.maxPrice)}
                </label>
                <Slider
                  value={[filters.minPrice, filters.maxPrice]}
                  onValueChange={([min, max]) => {
                    handleFilterChange('minPrice', min)
                    handleFilterChange('maxPrice', max)
                  }}
                  max={1000000}
                  min={0}
                  step={10000}
                  className="w-full"
                />
              </div>

              {/* Rating */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Minimum Rating</label>
                <Select value={filters.rating.toString()} onValueChange={(value) => handleFilterChange('rating', parseInt(value))}>
                  <SelectTrigger>
                    <SelectValue placeholder="Select rating" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="0">Any Rating</SelectItem>
                    <SelectItem value="3">3+ Stars</SelectItem>
                    <SelectItem value="4">4+ Stars</SelectItem>
                    <SelectItem value="4.5">4.5+ Stars</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>

            {/* Sort Options */}
            <div className="mt-4 pt-4 border-t">
              <label className="block text-sm font-medium text-gray-700 mb-2">Sort By</label>
              <Select value={filters.sortBy} onValueChange={(value) => handleFilterChange('sortBy', value)}>
                <SelectTrigger className="w-48">
                  <SelectValue placeholder="Sort by" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="relevance">Relevance</SelectItem>
                  <SelectItem value="price">Price: Low to High</SelectItem>
                  <SelectItem value="price-desc">Price: High to Low</SelectItem>
                  <SelectItem value="rating">Rating</SelectItem>
                  <SelectItem value="name">Name</SelectItem>
                  <SelectItem value="created">Newest</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Results */}
      {loading ? (
        <div className="flex items-center justify-center py-12">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-purple-600"></div>
        </div>
      ) : results.length > 0 ? (
        <>
          {/* Results Header */}
          <div className="flex items-center justify-between mb-6">
            <div>
              <h2 className="text-xl font-semibold text-gray-900">
                {pagination?.totalCount} results found
              </h2>
              <p className="text-gray-600">
                Showing {((pagination?.page || 1) - 1) * (pagination?.limit || 12) + 1} - {Math.min((pagination?.page || 1) * (pagination?.limit || 12), pagination?.totalCount || 0)} of {pagination?.totalCount}
              </p>
            </div>
          </div>

          {/* Results Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
            {results.map((result) => (
              <Card
                key={result._id}
                className="cursor-pointer hover:shadow-lg transition-shadow"
                onClick={() => handleResultClick(result)}
              >
                <CardContent className="p-6">
                  <div className="flex items-start justify-between mb-3">
                    <Badge className={getTypeColor(result.type)}>
                      {result.type}
                    </Badge>
                    {result.rating && (
                      <div className="flex items-center text-sm text-gray-600">
                        <Star className="w-4 h-4 text-yellow-500 mr-1" />
                        {result.rating}
                      </div>
                    )}
                  </div>
                  
                  <h3 className="text-lg font-semibold text-gray-900 mb-2">
                    {result.name}
                  </h3>
                  
                  <p className="text-gray-600 text-sm mb-3 line-clamp-2">
                    {result.description}
                  </p>
                  
                  <div className="flex items-center justify-between">
                    <div className="flex items-center text-sm text-gray-500">
                      {result.location && (
                        <>
                          <MapPin className="w-4 h-4 mr-1" />
                          {result.location}
                        </>
                      )}
                    </div>
                    {result.price && (
                      <div className="font-semibold text-purple-600">
                        {formatPrice(result.price)}
                      </div>
                    )}
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>

          {/* Pagination */}
          {pagination && pagination.totalPages > 1 && (
            <div className="flex items-center justify-center space-x-2">
              <Button
                variant="outline"
                disabled={!pagination.hasPrev}
                onClick={() => {
                  const newFilters = { ...filters, page: pagination.page - 1 }
                  setFilters(newFilters)
                }}
              >
                Previous
              </Button>
              
              <span className="px-4 py-2 text-sm text-gray-600">
                Page {pagination.page} of {pagination.totalPages}
              </span>
              
              <Button
                variant="outline"
                disabled={!pagination.hasNext}
                onClick={() => {
                  const newFilters = { ...filters, page: pagination.page + 1 }
                  setFilters(newFilters)
                }}
              >
                Next
              </Button>
            </div>
          )}
        </>
      ) : (
        <div className="text-center py-12">
          <Search className="w-16 h-16 mx-auto text-gray-400 mb-4" />
          <h3 className="text-lg font-medium text-gray-900 mb-2">No results found</h3>
          <p className="text-gray-600 mb-4">Try adjusting your search criteria or filters</p>
          <Button variant="outline" onClick={clearFilters}>
            Clear Filters
          </Button>
        </div>
      )}
    </div>
  )
}