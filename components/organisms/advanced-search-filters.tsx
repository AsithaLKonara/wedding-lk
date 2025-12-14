"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Slider } from "@/components/ui/slider"
import { Checkbox } from "@/components/ui/checkbox"
import { Badge } from "@/components/ui/badge"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { 
  Search, 
  Filter, 
  MapPin, 
  Calendar, 
  Users, 
  DollarSign, 
  Star,
  Sparkles,
  X,
  Save,
  Loader2
} from "lucide-react"
import { useToast } from "@/hooks/use-toast"
import { aiSearch, SearchQuery } from "@/lib/ai-search-enhancement"

interface SearchFilters {
  query: string
  location: string
  priceRange: [number, number]
  date: string
  guestCount: number
  category: string
  rating: number
  amenities: string[]
  style: string
  budget: number
  priority: 'price' | 'quality' | 'location'
}

interface AdvancedSearchFiltersProps {
  onSearch: (filters: SearchFilters) => void
  onSaveFilters?: (name: string, filters: SearchFilters) => void
  onLoadFilters?: (name: string) => void
  savedFilters?: { name: string; filters: SearchFilters }[]
}

export function AdvancedSearchFilters({
  onSearch,
  onSaveFilters,
  onLoadFilters,
  savedFilters = []
}: AdvancedSearchFiltersProps) {
  const { toast } = useToast()
  const [filters, setFilters] = useState<SearchFilters>({
    query: '',
    location: '',
    priceRange: [0, 1000000],
    date: '',
    guestCount: 100,
    category: '',
    rating: 0,
    amenities: [],
    style: '',
    budget: 500000,
    priority: 'quality'
  })

  const [suggestions, setSuggestions] = useState<string[]>([])
  const [isLoading, setIsLoading] = useState(false)
  const [showAI, setShowAI] = useState(false)
  const [aiSuggestions, setAiSuggestions] = useState<string[]>([])

  const categories = [
    'Venues',
    'Photography',
    'Catering',
    'Decoration',
    'Music',
    'Transportation',
    'Beauty',
    'Attire',
    'Jewelry',
    'Gifts'
  ]

  const amenities = [
    'Parking',
    'Catering',
    'Decoration',
    'Music',
    'Photography',
    'Videography',
    'Transportation',
    'Accommodation',
    'WiFi',
    'Air Conditioning',
    'Garden',
    'Beach Access',
    'Mountain View',
    'City View',
    'Pool',
    'Spa'
  ]

  const styles = [
    'Traditional',
    'Modern',
    'Rustic',
    'Elegant',
    'Bohemian',
    'Vintage',
    'Minimalist',
    'Luxury',
    'Garden',
    'Beach',
    'Mountain',
    'Urban',
    'Cultural',
    'Religious'
  ]

  useEffect(() => {
    if (filters.query.length > 2) {
      loadSuggestions()
    } else {
      setSuggestions([])
    }
  }, [filters.query])

  const loadSuggestions = async () => {
    try {
      const searchSuggestions = aiSearch.getSearchSuggestions(filters.query)
      setSuggestions(searchSuggestions)
    } catch (error) {
      console.error('Failed to load suggestions:', error)
    }
  }

  const handleAISearch = async () => {
    if (!filters.query.trim()) return

    setIsLoading(true)
    try {
      const searchQuery: SearchQuery = {
        query: filters.query,
        filters: {
          location: filters.location,
          priceRange: filters.priceRange,
          date: filters.date,
          guestCount: filters.guestCount,
          category: filters.category
        },
        userPreferences: {
          style: filters.style,
          budget: filters.budget,
          priority: filters.priority
        }
      }

      const results = await aiSearch.search(searchQuery)
      
      // Extract AI suggestions from results
      const suggestions = results
        .map(result => result.features)
        .flat()
        .filter((feature, index, arr) => arr.indexOf(feature) === index)
        .slice(0, 5)

      setAiSuggestions(suggestions)
      setShowAI(true)

      toast({
        title: "AI Search Complete",
        description: `Found ${results.length} results with AI-powered insights`,
        variant: "default"
      })
    } catch (error) {
      toast({
        title: "AI Search Failed",
        description: "Please try again later",
        variant: "destructive"
      })
    } finally {
      setIsLoading(false)
    }
  }

  const handleSearch = () => {
    onSearch(filters)
    toast({
      title: "Search Applied",
      description: "Filters have been applied to your search",
      variant: "default"
    })
  }

  const handleSaveFilters = () => {
    const name = prompt("Enter a name for these filters:")
    if (name && onSaveFilters) {
      onSaveFilters(name, filters)
      toast({
        title: "Filters Saved",
        description: `"${name}" has been saved`,
        variant: "default"
      })
    }
  }

  const handleLoadFilters = (name: string) => {
    if (onLoadFilters) {
      onLoadFilters(name)
      toast({
        title: "Filters Loaded",
        description: `"${name}" has been loaded`,
        variant: "default"
      })
    }
  }

  const handleReset = () => {
    setFilters({
      query: '',
      location: '',
      priceRange: [0, 1000000],
      date: '',
      guestCount: 100,
      category: '',
      rating: 0,
      amenities: [],
      style: '',
      budget: 500000,
      priority: 'quality'
    })
    setShowAI(false)
    setAiSuggestions([])
  }

  const handleSuggestionClick = (suggestion: string) => {
    setFilters(prev => ({ ...prev, query: suggestion }))
  }

  const handleAmenityToggle = (amenity: string) => {
    setFilters(prev => ({
      ...prev,
      amenities: prev.amenities.includes(amenity)
        ? prev.amenities.filter(a => a !== amenity)
        : [...prev.amenities, amenity]
    }))
  }

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('si-LK', {
      style: 'currency',
      currency: 'LKR',
      minimumFractionDigits: 0
    }).format(amount)
  }

  return (
    <div className="space-y-6">
      {/* Search Bar */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center">
            <Search className="h-5 w-5 mr-2" />
            Advanced Search
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
            <Input
              placeholder="Search for venues, vendors, or services..."
              value={filters.query}
              onChange={(e) => setFilters(prev => ({ ...prev, query: e.target.value }))}
              className="pl-10 pr-20"
            />
            <Button
              size="sm"
              className="absolute right-2 top-1/2 transform -translate-y-1/2"
              onClick={handleAISearch}
              disabled={isLoading || !filters.query.trim()}
            >
              {isLoading ? (
                <Loader2 className="h-4 w-4 animate-spin" />
              ) : (
                <Sparkles className="h-4 w-4" />
              )}
            </Button>
          </div>

          {/* Search Suggestions */}
          {suggestions.length > 0 && (
            <div className="space-y-2">
              <Label className="text-sm font-medium">Suggestions</Label>
              <div className="flex flex-wrap gap-2">
                {suggestions.map((suggestion, index) => (
                  <Badge
                    key={index}
                    variant="outline"
                    className="cursor-pointer hover:bg-gray-100"
                    onClick={() => handleSuggestionClick(suggestion)}
                  >
                    {suggestion}
                  </Badge>
                ))}
              </div>
            </div>
          )}

          {/* AI Suggestions */}
          {showAI && aiSuggestions.length > 0 && (
            <div className="space-y-2">
              <Label className="text-sm font-medium flex items-center">
                <Sparkles className="h-4 w-4 mr-1" />
                AI Recommendations
              </Label>
              <div className="flex flex-wrap gap-2">
                {aiSuggestions.map((suggestion, index) => (
                  <Badge
                    key={index}
                    variant="default"
                    className="cursor-pointer"
                    onClick={() => handleAmenityToggle(suggestion)}
                  >
                    {suggestion}
                  </Badge>
                ))}
              </div>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Filters */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center justify-between">
            <span className="flex items-center">
              <Filter className="h-5 w-5 mr-2" />
              Filters
            </span>
            <div className="flex items-center space-x-2">
              <Button variant="outline" size="sm" onClick={handleSaveFilters}>
                <Save className="h-4 w-4 mr-1" />
                Save
              </Button>
              <Button variant="outline" size="sm" onClick={handleReset}>
                <X className="h-4 w-4 mr-1" />
                Reset
              </Button>
            </div>
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-6">
          {/* Basic Filters */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label>Location</Label>
              <div className="relative">
                <MapPin className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                <Input
                  placeholder="Enter location..."
                  value={filters.location}
                  onChange={(e) => setFilters(prev => ({ ...prev, location: e.target.value }))}
                  className="pl-10"
                />
              </div>
            </div>

            <div className="space-y-2">
              <Label>Category</Label>
              <Select value={filters.category} onValueChange={(value) => setFilters(prev => ({ ...prev, category: value }))}>
                <SelectTrigger>
                  <SelectValue placeholder="Select category" />
                </SelectTrigger>
                <SelectContent>
                  {categories.map((category) => (
                    <SelectItem key={category} value={category.toLowerCase()}>
                      {category}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label>Wedding Date</Label>
              <div className="relative">
                <Calendar className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                <Input
                  type="date"
                  value={filters.date}
                  onChange={(e) => setFilters(prev => ({ ...prev, date: e.target.value }))}
                  className="pl-10"
                />
              </div>
            </div>

            <div className="space-y-2">
              <Label>Guest Count</Label>
              <div className="relative">
                <Users className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                <Input
                  type="number"
                  placeholder="Number of guests"
                  value={filters.guestCount}
                  onChange={(e) => setFilters(prev => ({ ...prev, guestCount: parseInt(e.target.value) || 0 }))}
                  className="pl-10"
                />
              </div>
            </div>
          </div>

          {/* Price Range */}
          <div className="space-y-2">
            <Label>Price Range: {formatCurrency(filters.priceRange[0])} - {formatCurrency(filters.priceRange[1])}</Label>
            <Slider
              value={filters.priceRange}
              onValueChange={(value) => setFilters(prev => ({ ...prev, priceRange: value as [number, number] }))}
              max={1000000}
              min={0}
              step={10000}
              className="w-full"
            />
            <div className="flex justify-between text-sm text-gray-500">
              <span>LKR 0</span>
              <span>LKR 1,000,000</span>
            </div>
          </div>

          {/* Budget and Priority */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label>Budget</Label>
              <div className="relative">
                <DollarSign className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                <Input
                  type="number"
                  placeholder="Your budget"
                  value={filters.budget}
                  onChange={(e) => setFilters(prev => ({ ...prev, budget: parseInt(e.target.value) || 0 }))}
                  className="pl-10"
                />
              </div>
            </div>

            <div className="space-y-2">
              <Label>Priority</Label>
              <Select value={filters.priority} onValueChange={(value: 'price' | 'quality' | 'location') => setFilters(prev => ({ ...prev, priority: value }))}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="price">Best Price</SelectItem>
                  <SelectItem value="quality">Best Quality</SelectItem>
                  <SelectItem value="location">Best Location</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>

          {/* Style */}
          <div className="space-y-2">
            <Label>Wedding Style</Label>
            <Select value={filters.style} onValueChange={(value) => setFilters(prev => ({ ...prev, style: value }))}>
              <SelectTrigger>
                <SelectValue placeholder="Select wedding style" />
              </SelectTrigger>
              <SelectContent>
                {styles.map((style) => (
                  <SelectItem key={style} value={style.toLowerCase()}>
                    {style}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          {/* Rating */}
          <div className="space-y-2">
            <Label>Minimum Rating: {filters.rating}+</Label>
            <div className="flex items-center space-x-2">
              <Slider
                value={[filters.rating]}
                onValueChange={(value) => setFilters(prev => ({ ...prev, rating: value[0] }))}
                max={5}
                min={0}
                step={0.5}
                className="flex-1"
              />
              <div className="flex items-center space-x-1">
                <Star className="h-4 w-4 text-yellow-500 fill-current" />
                <span className="text-sm font-medium">{filters.rating}</span>
              </div>
            </div>
          </div>

          {/* Amenities */}
          <div className="space-y-2">
            <Label>Amenities</Label>
            <div className="grid grid-cols-2 md:grid-cols-3 gap-2">
              {amenities.map((amenity) => (
                <div key={amenity} className="flex items-center space-x-2">
                  <Checkbox
                    id={amenity}
                    checked={filters.amenities.includes(amenity)}
                    onCheckedChange={() => handleAmenityToggle(amenity)}
                  />
                  <Label htmlFor={amenity} className="text-sm cursor-pointer">
                    {amenity}
                  </Label>
                </div>
              ))}
            </div>
          </div>

          {/* Action Buttons */}
          <div className="flex items-center justify-between pt-4 border-t">
            <div className="flex items-center space-x-2">
              {savedFilters.length > 0 && (
                <Select onValueChange={handleLoadFilters}>
                  <SelectTrigger className="w-48">
                    <SelectValue placeholder="Load saved filters" />
                  </SelectTrigger>
                  <SelectContent>
                    {savedFilters.map((saved) => (
                      <SelectItem key={saved.name} value={saved.name}>
                        {saved.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              )}
            </div>
            <Button onClick={handleSearch} className="flex items-center">
              <Search className="h-4 w-4 mr-2" />
              Search
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}

export default AdvancedSearchFilters 