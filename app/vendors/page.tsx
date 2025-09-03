"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Star, MapPin, Phone, Mail, Search, Filter } from "lucide-react"
import Link from "next/link"
import { MainLayout } from "@/components/templates/main-layout"

interface Vendor {
  _id: string
  name: string
  businessName: string
  category: string
  description: string
  location: {
    city: string
    province: string
  }
  contact: {
    phone: string
    email: string
  }
  rating: {
    average: number
    count: number
  }
  reviewStats: {
    averageRating: number
    count: number
  }
  isVerified: boolean
  isActive: boolean
}

interface VendorCategory {
  value: string
  label: string
  count: number
}

export default function VendorsPage() {
  const [vendors, setVendors] = useState<Vendor[]>([])
  const [categories, setCategories] = useState<VendorCategory[]>([])
  const [loading, setLoading] = useState(true)
  const [searchQuery, setSearchQuery] = useState("")
  const [selectedCategory, setSelectedCategory] = useState("all")
  const [selectedLocation, setSelectedLocation] = useState("all")

  useEffect(() => {
    fetchVendors()
    fetchCategories()
  }, [])

  const fetchVendors = async () => {
    try {
      setLoading(true)
      const params = new URLSearchParams({
        limit: '20',
        offset: '0'
      })
      
      if (selectedCategory !== 'all') params.append('category', selectedCategory)
      if (selectedLocation && selectedLocation !== 'all') params.append('location', selectedLocation)
      if (searchQuery) params.append('q', searchQuery)

      const response = await fetch(`/api/vendors/search?${params}`)
      if (response.ok) {
        const data = await response.json()
        setVendors(data.vendors)
      }
    } catch (error) {
      console.error('Failed to fetch vendors:', error)
    } finally {
      setLoading(false)
    }
  }

  const fetchCategories = async () => {
    try {
      const response = await fetch('/api/vendors/categories')
      if (response.ok) {
        const data = await response.json()
        setCategories(data.all)
      }
    } catch (error) {
      console.error('Failed to fetch categories:', error)
    }
  }

  useEffect(() => {
    fetchVendors()
  }, [searchQuery, selectedCategory, selectedLocation])

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault()
    fetchVendors()
  }

  const handleReset = () => {
    setSearchQuery("")
    setSelectedCategory("all")
    setSelectedLocation("")
  }

  return (
    <MainLayout>
      <div className="min-h-screen bg-gray-50">
      {/* Hero Section */}
      <div className="bg-gradient-to-r from-blue-600 to-purple-600 text-white py-16">
        <div className="container mx-auto px-4 text-center">
          <h1 className="text-4xl font-bold mb-4">Find Your Perfect Wedding Vendors</h1>
          <p className="text-xl text-blue-100 max-w-2xl mx-auto">
            Discover verified, professional vendors who will make your wedding day truly special
          </p>
        </div>
      </div>

      <div className="container mx-auto px-4 py-8">
        {/* Search and Filters */}
        <Card className="mb-8">
          <CardHeader>
            <CardTitle className="flex items-center space-x-2">
              <Search className="h-5 w-5" />
              <span>Search & Filter Vendors</span>
            </CardTitle>
            <CardDescription>
              Find vendors by category, location, or search terms
            </CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSearch} className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div>
                  <Input
                    placeholder="Search vendors, services, or locations..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                  />
                </div>
                <Select value={selectedCategory} onValueChange={setSelectedCategory}>
                  <SelectTrigger>
                    <SelectValue placeholder="Select Category" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Categories</SelectItem>
                    {categories.map((category) => (
                      <SelectItem key={category.value} value={category.value}>
                        {category.label} ({category.count})
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                <Select value={selectedLocation} onValueChange={setSelectedLocation}>
                  <SelectTrigger>
                    <SelectValue placeholder="Select Location" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Locations</SelectItem>
                    <SelectItem value="Colombo">Colombo</SelectItem>
                    <SelectItem value="Kandy">Kandy</SelectItem>
                    <SelectItem value="Galle">Galle</SelectItem>
                    <SelectItem value="Jaffna">Jaffna</SelectItem>
                    <SelectItem value="Anuradhapura">Anuradhapura</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              
              <div className="flex justify-between items-center">
                <Button type="submit" className="flex items-center space-x-2">
                  <Search className="h-4 w-4" />
                  <span>Search</span>
                </Button>
                <Button type="button" variant="outline" onClick={handleReset}>
                  Reset Filters
                </Button>
              </div>
            </form>
          </CardContent>
        </Card>

        {/* Results */}
        <div className="mb-8">
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-2xl font-bold text-gray-900">
              {loading ? 'Loading...' : `${vendors.length} Vendors Found`}
            </h2>
            <div className="text-sm text-gray-600">
              Showing {vendors.length} results
            </div>
          </div>

          {loading ? (
            <div className="text-center py-12">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
              <p className="mt-4 text-gray-600">Searching for vendors...</p>
            </div>
          ) : vendors.length === 0 ? (
            <div className="text-center py-12">
              <Search className="h-12 w-12 text-gray-400 mx-auto mb-4" />
              <h3 className="text-lg font-medium text-gray-900 mb-2">No vendors found</h3>
              <p className="text-gray-600 mb-4">
                Try adjusting your search criteria or browse all categories
              </p>
              <Button onClick={handleReset}>Reset Filters</Button>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {vendors.map((vendor) => (
                <Card key={vendor._id} className="hover:shadow-lg transition-shadow duration-300">
                  <CardHeader className="pb-4">
                    <div className="flex items-start justify-between">
                      <div>
                        <CardTitle className="text-lg font-semibold text-gray-900 mb-1">
                          {vendor.businessName}
                        </CardTitle>
                        <CardDescription className="text-sm text-gray-600">
                          {vendor.name} • {vendor.category}
                        </CardDescription>
                      </div>
                      {vendor.isVerified && (
                        <Badge variant="default" className="text-xs">
                          Verified
                        </Badge>
                      )}
                    </div>
                  </CardHeader>

                  <CardContent className="space-y-4">
                    <p className="text-gray-700 text-sm line-clamp-3">
                      {vendor.description}
                    </p>

                    <div className="flex items-center space-x-2">
                      <Star className="h-4 w-4 text-yellow-500 fill-current" />
                      <span className="text-sm font-medium text-gray-900">
                        {vendor.reviewStats?.averageRating || 4.5}
                      </span>
                      <span className="text-sm text-gray-500">
                        ({vendor.reviewStats?.count || 0} reviews)
                      </span>
                    </div>

                    <div className="flex items-center space-x-2 text-sm text-gray-600">
                      <MapPin className="h-4 w-4" />
                      <span>{vendor.location.city}, {vendor.location.province}</span>
                    </div>

                    <div className="flex items-center space-x-4 text-sm text-gray-600">
                      <div className="flex items-center space-x-1">
                        <Phone className="h-4 w-4" />
                        <span>{vendor.contact.phone}</span>
                      </div>
                      <div className="flex items-center space-x-1">
                        <Mail className="h-4 w-4" />
                        <span>{vendor.contact.email}</span>
                      </div>
                    </div>

                    <div className="pt-4">
                      <Link href={`/vendors/${vendor._id}`}>
                        <Button className="w-full" variant="default">
                          View Profile
                        </Button>
                      </Link>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          )}
        </div>

        {/* Popular Categories */}
        <Card>
          <CardHeader>
            <CardTitle>Popular Categories</CardTitle>
            <CardDescription>
              Browse vendors by popular wedding service categories
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-4">
              {[
                { name: 'Photography', count: '45+' },
                { name: 'Catering', count: '38+' },
                { name: 'Decoration', count: '32+' },
                { name: 'Music', count: '28+' },
                { name: 'Transport', count: '25+' },
                { name: 'Beauty', count: '22+' }
              ].map((category) => (
                <Link key={category.name} href={`/vendors?category=${category.name.toLowerCase()}`}>
                  <div className="text-center p-4 border rounded-lg hover:bg-gray-50 transition-colors cursor-pointer">
                    <div className="text-lg font-semibold text-gray-900">
                      {category.name}
                    </div>
                    <div className="text-sm text-gray-500">
                      {category.count} vendors
                    </div>
                  </div>
                </Link>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>
      </div>
    </MainLayout>
  )
} 