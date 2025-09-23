"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Slider } from "@/components/ui/slider"
import { Checkbox } from "@/components/ui/checkbox"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { MapPin, DollarSign, Star, Clock, Filter, X } from "lucide-react"

interface VendorFiltersProps {
  filters: {
    location: string
    priceRange: [number, number]
    rating: number
    experience: string
  }
  onFiltersChange: (filters: any) => void
}

export default function VendorFilters({ filters, onFiltersChange }: VendorFiltersProps) {
  const [isExpanded, setIsExpanded] = useState(false)

  const handleLocationChange = (value: string) => {
    onFiltersChange({ ...filters, location: value })
  }

  const handlePriceRangeChange = (value: number[]) => {
    onFiltersChange({ ...filters, priceRange: value })
  }

  const handleRatingChange = (value: number) => {
    onFiltersChange({ ...filters, rating: value })
  }

  const handleExperienceChange = (value: string) => {
    onFiltersChange({ ...filters, experience: value })
  }

  const clearFilters = () => {
    onFiltersChange({
      location: "",
      priceRange: [0, 200000],
      rating: 0,
      experience: "",
    })
  }

  const hasActiveFilters = filters.location || filters.rating > 0 || filters.experience

  return (
    <Card className="sticky top-4">
      <CardHeader className="pb-4">
        <div className="flex items-center justify-between">
          <CardTitle className="text-lg font-semibold flex items-center">
            <Filter className="w-4 h-4 mr-2" />
            Filters
          </CardTitle>
          {hasActiveFilters && (
            <Button
              variant="ghost"
              size="sm"
              onClick={clearFilters}
              className="text-red-600 hover:text-red-700"
            >
              <X className="w-4 h-4 mr-1" />
              Clear
            </Button>
          )}
        </div>
      </CardHeader>
      <CardContent className="space-y-6">
        {/* Location Filter */}
        <div className="space-y-2">
          <Label htmlFor="location" className="flex items-center text-sm font-medium">
            <MapPin className="w-4 h-4 mr-2" />
            Location
          </Label>
          <Input
            id="location"
            placeholder="Enter city or area"
            value={filters.location}
            onChange={(e) => handleLocationChange(e.target.value)}
            className="w-full"
          />
        </div>

        {/* Price Range Filter */}
        <div className="space-y-3">
          <Label className="flex items-center text-sm font-medium">
            <DollarSign className="w-4 h-4 mr-2" />
            Price Range
          </Label>
          <div className="px-2">
            <Slider
              value={filters.priceRange}
              onValueChange={handlePriceRangeChange}
              max={500000}
              min={0}
              step={10000}
              className="w-full"
            />
            <div className="flex justify-between text-xs text-gray-500 mt-1">
              <span>LKR {filters.priceRange[0].toLocaleString()}</span>
              <span>LKR {filters.priceRange[1].toLocaleString()}</span>
            </div>
          </div>
        </div>

        {/* Rating Filter */}
        <div className="space-y-3">
          <Label className="flex items-center text-sm font-medium">
            <Star className="w-4 h-4 mr-2" />
            Minimum Rating
          </Label>
          <div className="space-y-2">
            {[5, 4, 3, 2, 1].map((rating) => (
              <div key={rating} className="flex items-center space-x-2">
                <Checkbox
                  id={`rating-${rating}`}
                  checked={filters.rating === rating}
                  onCheckedChange={(checked) => 
                    checked ? handleRatingChange(rating) : handleRatingChange(0)
                  }
                />
                <Label htmlFor={`rating-${rating}`} className="flex items-center text-sm">
                  {Array.from({ length: 5 }).map((_, i) => (
                    <Star
                      key={i}
                      className={`w-4 h-4 ${
                        i < rating ? "text-yellow-400 fill-current" : "text-gray-300"
                      }`}
                    />
                  ))}
                  <span className="ml-2">& up</span>
                </Label>
              </div>
            ))}
          </div>
        </div>

        {/* Experience Filter */}
        <div className="space-y-2">
          <Label className="flex items-center text-sm font-medium">
            <Clock className="w-4 h-4 mr-2" />
            Experience
          </Label>
          <Select value={filters.experience} onValueChange={handleExperienceChange}>
            <SelectTrigger>
              <SelectValue placeholder="Select experience level" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="">Any experience</SelectItem>
              <SelectItem value="1-2">1-2 years</SelectItem>
              <SelectItem value="3-5">3-5 years</SelectItem>
              <SelectItem value="5-10">5-10 years</SelectItem>
              <SelectItem value="10+">10+ years</SelectItem>
            </SelectContent>
          </Select>
        </div>

        {/* Quick Filters */}
        <div className="space-y-3">
          <Label className="text-sm font-medium">Quick Filters</Label>
          <div className="space-y-2">
            <div className="flex items-center space-x-2">
              <Checkbox id="verified" />
              <Label htmlFor="verified" className="text-sm">Verified vendors only</Label>
            </div>
            <div className="flex items-center space-x-2">
              <Checkbox id="available" />
              <Label htmlFor="available" className="text-sm">Available this month</Label>
            </div>
            <div className="flex items-center space-x-2">
              <Checkbox id="budget-friendly" />
              <Label htmlFor="budget-friendly" className="text-sm">Budget friendly</Label>
            </div>
          </div>
        </div>

        {/* Results Count */}
        <div className="pt-4 border-t">
          <p className="text-sm text-gray-600 dark:text-gray-400">
            Showing vendors matching your criteria
          </p>
        </div>
      </CardContent>
    </Card>
  )
}