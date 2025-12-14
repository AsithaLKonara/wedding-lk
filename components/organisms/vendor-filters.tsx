"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Slider } from "@/components/ui/slider"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { MapPin, Star, Filter } from "lucide-react"

interface VendorFiltersProps {
  filters: any
  onFiltersChange: (filters: any) => void
}

export function VendorFilters({ filters, onFiltersChange }: VendorFiltersProps) {
  const categories = ["Photography", "Catering", "Entertainment", "Decoration", "Planning"]
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
        </div>

        {/* Category */}
        <div>
          <Label className="text-sm font-medium mb-3 block">Category</Label>
          <Select value={filters.category} onValueChange={(value) => onFiltersChange({ ...filters, category: value })}>
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

        {/* Price Range */}
        <div>
          <Label className="text-sm font-medium mb-3 block">
            Price Range: LKR {filters.priceRange[0].toLocaleString()} - {filters.priceRange[1].toLocaleString()}
          </Label>
          <Slider
            value={filters.priceRange}
            onValueChange={(value) => onFiltersChange({ ...filters, priceRange: value })}
            max={200000}
            min={10000}
            step={5000}
            className="w-full"
          />
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

        <Button
          variant="outline"
          className="w-full"
          onClick={() =>
            onFiltersChange({
              location: "",
              category: "",
              priceRange: [0, 200000],
              rating: 0,
              experience: "",
            })
          }
        >
          Clear Filters
        </Button>
      </CardContent>
    </Card>
  )
}


export default VendorFilters
