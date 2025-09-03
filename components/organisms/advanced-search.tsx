"use client"

import React, { useState, useCallback } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Skeleton } from "@/components/ui/skeleton"
import { useToast } from "@/hooks/use-toast"
import { Search, MapPin, Calendar, Users, DollarSign, Star, Filter, X } from "lucide-react"
import Link from "next/link"

interface SearchResult {
  _id: string
  type: "venue" | "vendor"
  name: string
  businessName?: string
  location: {
    city: string
    province: string
  }
  pricing: {
    basePrice?: number
    startingPrice?: number
    currency: string
  }
  rating: {
    average: number
    count: number
  }
  capacity?: {
    min: number
    max: number
  }
  category?: string
  images: string[]
  amenities?: string[]
  services?: Array<{
    name: string
    description: string
    price: number
  }>
}

interface SearchFilters {
  location: string
  date: string
  guestCount: number
  budget: {
    min: number
    max: number
  }
  type: "venue" | "vendor" | "all"
  category: string
  rating: number
}

export function AdvancedSearch() {
  const { toast } = useToast()
  const [filters, setFilters] = useState<SearchFilters>({
    location: "",
    date: "",
    guestCount: 0,
    budget: { min: 0, max: 1000000 },
    type: "all",
    category: "",
    rating: 0,
  })
  const [results, setResults] = useState<SearchResult[]>([])
  const [isLoading, setIsLoading] = useState(false)
  const [showFilters, setShowFilters] = useState(false)

  const sortOptions = [
    { value: "relevance", label: "Relevance" },
    { value: "price-low", label: "Price: Low to High" },
    { value: "price-high", label: "Price: High to Low" },
    { value: "rating", label: "Highest Rated" },
    { value: "distance", label: "Distance" },
  ]

  const handleSearch = useCallback(async () => {
    setIsLoading(true)
    try {
      // Build query parameters
      const params = new URLSearchParams()
      
      if (filters.location) params.append('location', filters.location)
      if (filters.date) params.append('date', filters.date)
      if (filters.guestCount > 0) params.append('guestCount', filters.guestCount.toString())
      if (filters.budget.min > 0) params.append('minPrice', filters.budget.min.toString())
      if (filters.budget.max < 1000000) params.append('maxPrice', filters.budget.max.toString())
      if (filters.type !== 'all') params.append('type', filters.type)
      if (filters.category) params.append('category', filters.category)
      if (filters.rating > 0) params.append('rating', filters.rating.toString())

      // Search venues
      let venueResults: SearchResult[] = []
      if (filters.type === 'all' || filters.type === 'venue') {
        const venueResponse = await fetch(`/api/venues?${params}`)
        const venueData = await venueResponse.json()
        if (venueData.success) {
          venueResults = venueData.venues.map((venue: any) => ({
            _id: venue._id,
            type: 'venue' as const,
            name: venue.name,
            location: venue.location,
            pricing: venue.pricing,
            rating: venue.rating,
            capacity: venue.capacity,
            images: venue.images,
            amenities: venue.amenities,
          }))
        }
      }

      // Search vendors
      let vendorResults: SearchResult[] = []
      if (filters.type === 'all' || filters.type === 'vendor') {
        const vendorResponse = await fetch(`/api/vendors?${params}`)
        const vendorData = await vendorResponse.json()
        if (vendorData.success) {
          vendorResults = vendorData.vendors.map((vendor: any) => ({
            _id: vendor._id,
            type: 'vendor' as const,
            name: vendor.name,
            businessName: vendor.businessName,
            location: vendor.location,
            pricing: vendor.pricing,
            rating: vendor.rating,
            category: vendor.category,
            images: vendor.portfolio,
            services: vendor.services,
          }))
        }
      }

      // Combine and sort results
      const allResults = [...venueResults, ...vendorResults]
      
      // Apply additional client-side filtering
      const filteredResults = allResults.filter(result => {
        if (filters.rating > 0 && result.rating.average < filters.rating) return false
        if (filters.guestCount > 0 && result.type === 'venue' && result.capacity) {
          if (result.capacity.max < filters.guestCount) return false
        }
        return true
      })

      setResults(filteredResults)
      
      toast({
        title: "Search Complete",
        description: `Found ${filteredResults.length} results for your search.`,
      })
    } catch (error) {
      console.error('Search error:', error)
      toast({
        title: "Search Error",
        description: "Failed to perform search. Please try again.",
        variant: "destructive",
      })
    } finally {
      setIsLoading(false)
    }
  }, [filters, toast])

  const handleFilterChange = (key: keyof SearchFilters, value: any) => {
    setFilters(prev => ({ ...prev, [key]: value }))
  }

  const handleBudgetChange = (type: 'min' | 'max', value: number) => {
    setFilters(prev => ({
      ...prev,
      budget: { ...prev.budget, [type]: value }
    }))
  }

  const clearFilters = () => {
    setFilters({
      location: "",
      date: "",
      guestCount: 0,
      budget: { min: 0, max: 1000000 },
      type: "all",
      category: "",
      rating: 0,
    })
  }

  const formatPrice = (price: number, currency: string) => {
    return new Intl.NumberFormat('en-LK', {
      style: 'currency',
      currency: currency || 'LKR',
      minimumFractionDigits: 0,
    }).format(price)
  }

  const getResultLink = (result: SearchResult) => {
    return result.type === 'venue' ? `/venues/${result._id}` : `/vendors/${result._id}`
  }

  const getResultTitle = (result: SearchResult) => {
    return result.type === 'venue' ? result.name : (result.businessName || result.name)
  }

  return (
    <div className="space-y-6">
      {/* Search Header */}
      <div className="bg-gradient-to-r from-pink-50 to-purple-50 p-6 rounded-lg">
        <h2 className="text-2xl font-bold text-gray-900 mb-4">Find Your Perfect Wedding Vendors</h2>
        
        {/* Quick Search */}
        <div className="flex flex-col md:flex-row gap-4">
          <div className="flex-1">
            <Input
              placeholder="Location (e.g., Colombo, Kandy)"
              value={filters.location}
              onChange={(e) => handleFilterChange('location', e.target.value)}
              className="h-12"
            />
          </div>
          <div className="flex-1">
            <Input
              type="date"
              value={filters.date}
              onChange={(e) => handleFilterChange('date', e.target.value)}
              className="h-12"
            />
          </div>
          <div className="flex-1">
            <Input
              type="number"
              placeholder="Guest count"
              value={filters.guestCount || ''}
              onChange={(e) => handleFilterChange('guestCount', parseInt(e.target.value) || 0)}
              className="h-12"
            />
          </div>
          <Button onClick={handleSearch} className="h-12 px-8">
            <Search className="h-4 w-4 mr-2" />
            Search
          </Button>
        </div>

        {/* Filter Toggle */}
        <div className="mt-4 flex items-center justify-between">
          <Button
            variant="outline"
            size="sm"
            onClick={() => setShowFilters(!showFilters)}
          >
            <Filter className="h-4 w-4 mr-2" />
            {showFilters ? 'Hide' : 'Show'} Filters
          </Button>
          
          {Object.values(filters).some(val => 
            typeof val === 'string' ? val !== '' : 
            typeof val === 'number' ? val > 0 :
            typeof val === 'object' ? Object.values(val).some(v => v !== 0 && v !== '') : false
          ) && (
            <Button variant="ghost" size="sm" onClick={clearFilters}>
              <X className="h-4 w-4 mr-2" />
              Clear Filters
            </Button>
          )}
        </div>
      </div>

      {/* Advanced Filters */}
      {showFilters && (
        <Card>
          <CardHeader>
            <CardTitle>Advanced Filters</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
              <div>
                <Label>Type</Label>
                <Select value={filters.type} onValueChange={(value) => handleFilterChange('type', value)}>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All</SelectItem>
                    <SelectItem value="venue">Venues</SelectItem>
                    <SelectItem value="vendor">Vendors</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div>
                <Label>Category</Label>
                <Select value={filters.category} onValueChange={(value) => handleFilterChange('category', value)}>
                  <SelectTrigger>
                    <SelectValue placeholder="Select category" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="">All Categories</SelectItem>
                    <SelectItem value="photographer">Photography</SelectItem>
                    <SelectItem value="caterer">Catering</SelectItem>
                    <SelectItem value="decorator">Decoration</SelectItem>
                    <SelectItem value="music">Music</SelectItem>
                    <SelectItem value="transport">Transport</SelectItem>
                    <SelectItem value="makeup">Makeup</SelectItem>
                    <SelectItem value="jewelry">Jewelry</SelectItem>
                    <SelectItem value="clothing">Clothing</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div>
                <Label>Minimum Rating</Label>
                <Select value={filters.rating.toString()} onValueChange={(value) => handleFilterChange('rating', parseFloat(value))}>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="0">Any Rating</SelectItem>
                    <SelectItem value="4.5">4.5+ Stars</SelectItem>
                    <SelectItem value="4.0">4.0+ Stars</SelectItem>
                    <SelectItem value="3.5">3.5+ Stars</SelectItem>
                    <SelectItem value="3.0">3.0+ Stars</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div>
                <Label>Budget Range (LKR)</Label>
                <div className="flex gap-2">
                  <Input
                    type="number"
                    placeholder="Min"
                    value={filters.budget.min || ''}
                    onChange={(e) => handleBudgetChange('min', parseInt(e.target.value) || 0)}
                  />
                  <Input
                    type="number"
                    placeholder="Max"
                    value={filters.budget.max || ''}
                    onChange={(e) => handleBudgetChange('max', parseInt(e.target.value) || 1000000)}
                  />
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Results */}
      {isLoading ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {Array.from({ length: 6 }).map((_, index) => (
            <Card key={index} className="overflow-hidden">
              <Skeleton className="h-48 w-full" />
              <CardHeader className="p-4">
                <Skeleton className="h-6 w-3/4 mb-2" />
                <Skeleton className="h-4 w-1/2" />
              </CardHeader>
              <CardContent className="p-4 pt-0">
                <Skeleton className="h-4 w-full mb-2" />
                <Skeleton className="h-4 w-2/3" />
              </CardContent>
            </Card>
          ))}
        </div>
      ) : results.length > 0 ? (
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="text-lg font-semibold">{results.length} results found</h3>
            <Select defaultValue="relevance">
              <SelectTrigger className="w-40">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                {sortOptions.map(option => (
                  <SelectItem key={option.value} value={option.value}>
                    {option.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {results.map((result) => (
              <Card key={result._id} className="overflow-hidden hover:shadow-lg transition-shadow">
                <div className="relative">
                  <img
                    src={result.images[0] || '/placeholder.svg'}
                    alt={getResultTitle(result)}
                    className="w-full h-48 object-cover"
                  />
                  <Badge className="absolute top-2 left-2">
                    {result.type === 'venue' ? 'Venue' : 'Vendor'}
                  </Badge>
                </div>

                <CardHeader className="p-4">
                  <CardTitle className="text-lg font-semibold line-clamp-1">
                    {getResultTitle(result)}
                  </CardTitle>
                  <div className="flex items-center text-sm text-gray-600">
                    <MapPin className="h-4 w-4 mr-1" />
                    <span>{result.location.city}, {result.location.province}</span>
                  </div>
                </CardHeader>

                <CardContent className="p-4 pt-0">
                  <div className="flex items-center justify-between mb-3">
                    <div className="flex items-center">
                      <Star className="h-4 w-4 text-yellow-500 mr-1" />
                      <span className="text-sm font-medium">{result.rating.average.toFixed(1)}</span>
                      <span className="text-sm text-gray-500 ml-1">({result.rating.count})</span>
                    </div>
                    <div className="text-lg font-semibold text-green-600">
                      {formatPrice(
                        result.pricing.basePrice || result.pricing.startingPrice || 0,
                        result.pricing.currency
                      )}
                    </div>
                  </div>

                  {result.type === 'venue' && result.capacity && (
                    <div className="flex items-center text-sm text-gray-600 mb-3">
                      <Users className="h-4 w-4 mr-1" />
                      <span>Capacity: {result.capacity.min}-{result.capacity.max} guests</span>
                    </div>
                  )}

                  {result.type === 'vendor' && result.category && (
                    <div className="mb-3">
                      <Badge variant="secondary">{result.category}</Badge>
                    </div>
                  )}

                  <Button asChild className="w-full">
                    <Link href={getResultLink(result)}>
                      View Details
                    </Link>
                  </Button>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      ) : (
        <div className="text-center py-12">
          <Search className="h-12 w-12 text-gray-400 mx-auto mb-4" />
          <h3 className="text-lg font-semibold text-gray-900 mb-2">No results found</h3>
          <p className="text-gray-600 mb-4">Try adjusting your search criteria or filters</p>
          <Button onClick={clearFilters} variant="outline">
            Clear Filters
          </Button>
        </div>
      )}
    </div>
  )
} 

export default AdvancedSearch
