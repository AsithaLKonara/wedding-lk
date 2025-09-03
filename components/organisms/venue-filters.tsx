"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Checkbox } from "@/components/ui/checkbox"
import { Slider } from "@/components/ui/slider"
import { MapPin, Users, Star, Filter } from "lucide-react"

interface VenueFiltersProps {
  filters: any
  onFiltersChange: (filters: any) => void
}

export function VenueFilters({ filters, onFiltersChange }: VenueFiltersProps) {
  const amenities = ["Parking", "Catering", "Decoration", "Sound System", "AC", "WiFi", "Garden", "Pool", "Beach View"]

  const locations = ["Colombo", "Kandy", "Galle", "Negombo", "Ella"]

  return (
    <Card className="sticky top-24">
      <CardHeader>
        <CardTitle className="flex items-center">
          <Filter className="mr-2 h-5 w-5" />
          Filters
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-6">
        {/* Location */}
        <div>
          <Label className="text-sm font-medium mb-3 block">Location</Label>
          <div className="relative">
            <MapPin className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
            <Input
              placeholder="Enter location"
              className="pl-10"
              value={filters.location}
              onChange={(e) => onFiltersChange({ ...filters, location: e.target.value })}
            />
          </div>
          <div className="mt-2 space-y-2">
            {locations.map((location) => (
              <div key={location} className="flex items-center space-x-2">
                <Checkbox
                  id={location}
                  checked={filters.location === location}
                  onCheckedChange={(checked) => onFiltersChange({ ...filters, location: checked ? location : "" })}
                />
                <Label htmlFor={location} className="text-sm">
                  {location}
                </Label>
              </div>
            ))}
          </div>
        </div>

        {/* Price Range */}
        <div>
          <Label className="text-sm font-medium mb-3 block">
            Price Range: LKR {filters.priceRange[0].toLocaleString()} - {filters.priceRange[1].toLocaleString()}
          </Label>
          <Slider
            value={filters.priceRange}
            onValueChange={(value) => onFiltersChange({ ...filters, priceRange: value })}
            max={500000}
            min={50000}
            step={10000}
            className="w-full"
          />
        </div>

        {/* Capacity */}
        <div>
          <Label className="text-sm font-medium mb-3 block">Guest Capacity</Label>
          <div className="relative">
            <Users className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
            <Input
              placeholder="Number of guests"
              className="pl-10"
              value={filters.capacity}
              onChange={(e) => onFiltersChange({ ...filters, capacity: e.target.value })}
            />
          </div>
        </div>

        {/* Rating */}
        <div>
          <Label className="text-sm font-medium mb-3 block">Minimum Rating</Label>
          <div className="flex items-center space-x-2">
            {[1, 2, 3, 4, 5].map((rating) => (
              <button
                key={rating}
                onClick={() => onFiltersChange({ ...filters, rating })}
                className={`p-1 ${filters.rating >= rating ? "text-yellow-400" : "text-gray-300"}`}
              >
                <Star className="h-4 w-4 fill-current" />
              </button>
            ))}
          </div>
        </div>

        {/* Amenities */}
        <div>
          <Label className="text-sm font-medium mb-3 block">Amenities</Label>
          <div className="space-y-2 max-h-40 overflow-y-auto">
            {amenities.map((amenity) => (
              <div key={amenity} className="flex items-center space-x-2">
                <Checkbox
                  id={amenity}
                  checked={filters.amenities.includes(amenity)}
                  onCheckedChange={(checked) => {
                    const newAmenities = checked
                      ? [...filters.amenities, amenity]
                      : filters.amenities.filter((a: string) => a !== amenity)
                    onFiltersChange({ ...filters, amenities: newAmenities })
                  }}
                />
                <Label htmlFor={amenity} className="text-sm">
                  {amenity}
                </Label>
              </div>
            ))}
          </div>
        </div>

        <Button
          variant="outline"
          className="w-full"
          onClick={() =>
            onFiltersChange({
              location: "",
              priceRange: [0, 500000],
              capacity: "",
              amenities: [],
              rating: 0,
            })
          }
        >
          Clear Filters
        </Button>
      </CardContent>
    </Card>
  )
}


export default VenueFilters
