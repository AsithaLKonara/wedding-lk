"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Slider } from "@/components/ui/slider"
import { Checkbox } from "@/components/ui/checkbox"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { MapPin, DollarSign, Users, Star, Filter, X, Wifi, Car, Utensils, Music } from "lucide-react"

interface VenueFiltersProps {
  filters: {
    location: string
    priceRange: [number, number]
    capacity: string
    amenities: string[]
    rating: number
  }
  onFiltersChange: (filters: VenueFiltersProps['filters']) => void
}

export default function VenueFilters({ filters, onFiltersChange }: VenueFiltersProps) {
  const amenities = [
    { id: "wifi", label: "Free WiFi", icon: Wifi },
    { id: "parking", label: "Parking", icon: Car },
    { id: "catering", label: "Catering", icon: Utensils },
    { id: "music", label: "Music System", icon: Music },
    { id: "ac", label: "Air Conditioning" },
    { id: "garden", label: "Garden" },
    { id: "beach", label: "Beach Access" },
    { id: "pool", label: "Swimming Pool" },
  ]

  const handleAmenityChange = (amenityId: string, checked: boolean) => {
    const newAmenities = checked
      ? [...filters.amenities, amenityId]
      : filters.amenities.filter(id => id !== amenityId)
    onFiltersChange({ ...filters, amenities: newAmenities })
  }

  const clearFilters = () => {
    onFiltersChange({
      location: "",
      priceRange: [0, 500000],
      capacity: "",
      amenities: [],
      rating: 0,
    })
  }

  const hasActiveFilters = filters.location || filters.capacity || filters.amenities.length > 0 || filters.rating > 0

  return (
    <Card className="sticky top-4">
      <CardHeader className="pb-4">
        <div className="flex items-center justify-between">
          <CardTitle className="text-lg font-semibold flex items-center">
            <Filter className="w-4 h-4 mr-2" />
            Filter Venues
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
            onChange={(e) => onFiltersChange({ ...filters, location: e.target.value })}
            className="w-full"
          />
        </div>

        {/* Price Range Filter */}
        <div className="space-y-3">
          <Label className="flex items-center text-sm font-medium">
            <DollarSign className="w-4 h-4 mr-2" />
            Price Range (LKR)
          </Label>
          <div className="px-2">
            <Slider
              value={filters.priceRange}
              onValueChange={(value) => onFiltersChange({ ...filters, priceRange: value as [number, number] })}
              max={1000000}
              min={0}
              step={25000}
              className="w-full"
            />
            <div className="flex justify-between text-xs text-gray-500 mt-1">
              <span>LKR {filters.priceRange[0].toLocaleString()}</span>
              <span>LKR {filters.priceRange[1].toLocaleString()}</span>
            </div>
          </div>
        </div>

        {/* Capacity Filter */}
        <div className="space-y-2">
          <Label className="flex items-center text-sm font-medium">
            <Users className="w-4 h-4 mr-2" />
            Minimum Capacity
          </Label>
          <Select value={filters.capacity} onValueChange={(value) => onFiltersChange({ ...filters, capacity: value })}>
            <SelectTrigger>
              <SelectValue placeholder="Select capacity" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="">Any capacity</SelectItem>
              <SelectItem value="50">50+ guests</SelectItem>
              <SelectItem value="100">100+ guests</SelectItem>
              <SelectItem value="200">200+ guests</SelectItem>
              <SelectItem value="300">300+ guests</SelectItem>
              <SelectItem value="500">500+ guests</SelectItem>
            </SelectContent>
          </Select>
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
                    checked ? onFiltersChange({ ...filters, rating }) : onFiltersChange({ ...filters, rating: 0 })
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

        {/* Amenities Filter */}
        <div className="space-y-3">
          <Label className="text-sm font-medium">Amenities</Label>
          <div className="space-y-2">
            {amenities.map((amenity) => (
              <div key={amenity.id} className="flex items-center space-x-2">
                <Checkbox
                  id={amenity.id}
                  checked={filters.amenities.includes(amenity.id)}
                  onCheckedChange={(checked) => handleAmenityChange(amenity.id, checked as boolean)}
                />
                <Label htmlFor={amenity.id} className="flex items-center text-sm">
                  {amenity.icon && <amenity.icon className="w-4 h-4 mr-2" />}
                  {amenity.label}
                </Label>
              </div>
            ))}
          </div>
        </div>

        {/* Quick Filters */}
        <div className="space-y-3">
          <Label className="text-sm font-medium">Quick Filters</Label>
          <div className="space-y-2">
            <div className="flex items-center space-x-2">
              <Checkbox id="available" />
              <Label htmlFor="available" className="text-sm">Available this month</Label>
            </div>
            <div className="flex items-center space-x-2">
              <Checkbox id="budget-friendly" />
              <Label htmlFor="budget-friendly" className="text-sm">Budget friendly</Label>
            </div>
            <div className="flex items-center space-x-2">
              <Checkbox id="outdoor" />
              <Label htmlFor="outdoor" className="text-sm">Outdoor venues</Label>
            </div>
          </div>
        </div>

        {/* Results Count */}
        <div className="pt-4 border-t">
          <p className="text-sm text-gray-600 dark:text-gray-400">
            Showing venues matching your criteria
          </p>
        </div>
      </CardContent>
    </Card>
  )
}