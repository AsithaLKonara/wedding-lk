"use client"

import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Search, MapPin, Calendar, Users, SlidersHorizontal } from "lucide-react"

export function SearchHeader() {
  return (
    <div className="bg-white dark:bg-gray-800 border-b shadow-sm">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-6">
        <div className="flex flex-col lg:flex-row gap-4">
          {/* Search Form */}
          <div className="flex-1 grid grid-cols-1 md:grid-cols-4 gap-4">
            <div className="relative">
              <MapPin className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
              <Input placeholder="Location" className="pl-10" />
            </div>

            <div className="relative">
              <Calendar className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
              <Input type="date" className="pl-10" />
            </div>

            <div className="relative">
              <Users className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
              <Input placeholder="Guests" className="pl-10" />
            </div>

            <Button className="bg-gradient-to-r from-pink-500 to-purple-600 hover:from-pink-600 hover:to-purple-700">
              <Search className="mr-2 h-4 w-4" />
              Search
            </Button>
          </div>

          {/* Advanced Filters */}
          <Button variant="outline" className="lg:w-auto">
            <SlidersHorizontal className="mr-2 h-4 w-4" />
            Filters
          </Button>
        </div>
      </div>
    </div>
  )
}


export default SearchHeader
