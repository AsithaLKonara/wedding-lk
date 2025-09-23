"use client"

import { useState, useCallback } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Slider } from "@/components/ui/slider"
import { Checkbox } from "@/components/ui/checkbox"
import { Search, Filter, MapPin, Calendar, Users, DollarSign, Star, X } from "lucide-react"
import { useToast } from "@/hooks/use-toast"

interface SearchFilters {
  query: string
  category: string
  location: string
  priceRange: [number, number]
  capacity: [number, number]
  rating: number
  amenities: string[]
  date: string
  sortBy: string
}

interface SearchResult {
  id: string
  type: 'venue' | 'vendor' | 'service'
  name: string
  location: string
  price: number
  rating: number
  capacity?: number
  category: string
  image: string
  amenities: string[]
}

export function AdvancedSearch() {
  const { toast } = useToast()
  const [isLoading, setIsLoading] = useState(false)
  const [showFilters, setShowFilters] = useState(false)
  const [results, setResults] = useState<SearchResult[]>([])
  const [filters, setFilters] = useState<SearchFilters>({
    query: "",
    category: "all",
    location: "",
    priceRange: [0, 500000],
    capacity: [0, 500],
    rating: 0,
    amenities: [],
    date: "",
    sortBy: "relevance"
  })

  const categories = [
    { value: "all", label: "All Categories" },
    { value: "venues", label: "Venues" },
    { value: "photography", label: "Photography" },
    { value: "catering", label: "Catering" },
    { value: "entertainment", label: "Entertainment" },
    { value: "decoration", label: "Decoration" },
    { value: "transportation", label: "Transportation" },
    { value: "beauty", label: "Beauty & Styling" },
    { value: "music", label: "Music & DJ" },
  ]

  const amenities = [
    "Parking", "Catering", "Audio/Visual", "Garden", "Beach Access",
    "Accommodation", "Photography", "Transportation", "Decoration",
    "Entertainment", "Spa Services", "Childcare"
  ]

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
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1000))
      
      // Mock results based on filters
      const mockResults: SearchResult[] = [
        {
          id: "1",
          type: "venue",
          name: "Grand Ballroom Hotel",
          location: "Colombo",
          price: 150000,
          rating: 4.8,
          capacity: 300,
          category: "venues",
          image: "/placeholder.svg",
          amenities: ["Parking", "Catering", "Audio/Visual"]
        },
        {
          id: "2",
          type: "vendor",
          name: "Perfect Moments Photography",
          location: "Kandy",
          price: 45000,
          rating: 4.9,
          category: "photography",
          image: "/placeholder.svg",
          amenities: ["Photography", "Videography"]
        },
        {
          id: "3",
          type: "service",
          name: "Elegant Catering Services",
          location: "Galle",
          price: 25000,
          rating: 4.7,
          category: "catering",
          image: "/placeholder.svg",
          amenities: ["Catering", "Setup", "Cleanup"]
        }
      ]

      setResults(mockResults)
      toast({
        title: "Search Complete",
        description: `Found ${mockResults.length} results for your search.`,
      })
    } catch (error) {
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

  const handleAmenityToggle = (amenity: string) => {
    setFilters(prev => ({
      ...prev,
      amenities: prev.amenities.includes(amenity)
        ? prev.amenities.filter(a => a !== amenity)
        : [...prev.amenities, amenity]
    }))
  }

  const clearFilters = () => {
    setFilters({
      query: "",
      category: "all",
      location: "",
      priceRange: [0, 500000],
      capacity: [0, 500],
      rating: 0,
      amenities: [],
      date: "",
      sortBy: "relevance"
    })
  }

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat("en-LK", {
      style: "currency",
      currency: "LKR",
      minimumFractionDigits: 0,
    }).format(amount)
  }

  return (
    <div className="space-y-6">
      {/* Search Bar */}
      <Card>
        <CardContent className="pt-6">
          <div className="flex gap-4">
            <div className="flex-1">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                <Input
                  placeholder="Search venues, vendors, services..."
                  value={filters.query}
                  onChange={(e) => handleFilterChange("query", e.target.value)}
                  className="pl-10"
                />
              </div>
            </div>
            <Button
              variant="outline"
              onClick={() => setShowFilters(!showFilters)}
              className="flex items-center gap-2"
            >
              <Filter className="h-4 w-4" />
              Filters
            </Button>
            <Button onClick={handleSearch} disabled={isLoading}>
              {isLoading ? "Searching..." : "Search"}
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Advanced Filters */}
      {showFilters && (
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center justify-between">
              <span>Advanced Filters</span>
              <Button variant="ghost" size="sm" onClick={clearFilters}>
                <X className="h-4 w-4 mr-2" />
                Clear All
              </Button>
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-6">
            {/* Category and Location */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="text-sm font-medium mb-2 block">Category</label>
                <Select value={filters.category} onValueChange={(value) => handleFilterChange("category", value)}>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    {categories.map((category) => (
                      <SelectItem key={category.value} value={category.value}>
                        {category.label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <div>
                <label className="text-sm font-medium mb-2 block">Location</label>
                <div className="relative">
                  <MapPin className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                  <Input
                    placeholder="Enter location..."
                    value={filters.location}
                    onChange={(e) => handleFilterChange("location", e.target.value)}
                    className="pl-10"
                  />
                </div>
              </div>
            </div>

            {/* Price Range */}
            <div>
              <label className="text-sm font-medium mb-2 block">
                Price Range: {formatCurrency(filters.priceRange[0])} - {formatCurrency(filters.priceRange[1])}
              </label>
              <Slider
                value={filters.priceRange}
                onValueChange={(value) => handleFilterChange("priceRange", value)}
                max={500000}
                min={0}
                step={10000}
                className="w-full"
              />
            </div>

            {/* Capacity Range */}
            <div>
              <label className="text-sm font-medium mb-2 block">
                Capacity: {filters.capacity[0]} - {filters.capacity[1]} guests
              </label>
              <Slider
                value={filters.capacity}
                onValueChange={(value) => handleFilterChange("capacity", value)}
                max={500}
                min={0}
                step={10}
                className="w-full"
              />
            </div>

            {/* Rating */}
            <div>
              <label className="text-sm font-medium mb-2 block">
                Minimum Rating: {filters.rating} stars
              </label>
              <Slider
                value={[filters.rating]}
                onValueChange={(value) => handleFilterChange("rating", value[0])}
                max={5}
                min={0}
                step={0.5}
                className="w-full"
              />
            </div>

            {/* Amenities */}
            <div>
              <label className="text-sm font-medium mb-2 block">Amenities</label>
              <div className="grid grid-cols-2 md:grid-cols-3 gap-2">
                {amenities.map((amenity) => (
                  <div key={amenity} className="flex items-center space-x-2">
                    <Checkbox
                      id={amenity}
                      checked={filters.amenities.includes(amenity)}
                      onCheckedChange={() => handleAmenityToggle(amenity)}
                    />
                    <label htmlFor={amenity} className="text-sm">
                      {amenity}
                    </label>
                  </div>
                ))}
              </div>
            </div>

            {/* Sort By */}
            <div>
              <label className="text-sm font-medium mb-2 block">Sort By</label>
              <Select value={filters.sortBy} onValueChange={(value) => handleFilterChange("sortBy", value)}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {sortOptions.map((option) => (
                    <SelectItem key={option.value} value={option.value}>
                      {option.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Search Results */}
      {results.length > 0 && (
        <Card>
          <CardHeader>
            <CardTitle>Search Results ({results.length})</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {results.map((result) => (
                <div key={result.id} className="flex items-center space-x-4 p-4 border rounded-lg hover:bg-gray-50 transition-colors">
                  <div className="w-16 h-16 bg-gray-200 rounded-lg flex-shrink-0"></div>
                  <div className="flex-1">
                    <div className="flex items-center gap-2">
                      <h3 className="font-semibold">{result.name}</h3>
                      <Badge variant="outline">{result.type}</Badge>
                      <Badge variant="outline">{result.category}</Badge>
                    </div>
                    <p className="text-sm text-gray-600">{result.location}</p>
                    <div className="flex items-center gap-4 mt-2">
                      <div className="flex items-center gap-1">
                        <Star className="h-4 w-4 text-yellow-400 fill-current" />
                        <span className="text-sm">{result.rating}</span>
                      </div>
                      <div className="flex items-center gap-1">
                        <DollarSign className="h-4 w-4 text-green-600" />
                        <span className="text-sm">{formatCurrency(result.price)}</span>
                      </div>
                      {result.capacity && (
                        <div className="flex items-center gap-1">
                          <Users className="h-4 w-4 text-blue-600" />
                          <span className="text-sm">{result.capacity} guests</span>
                        </div>
                      )}
                    </div>
                  </div>
                  <Button variant="outline">View Details</Button>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  )
} 