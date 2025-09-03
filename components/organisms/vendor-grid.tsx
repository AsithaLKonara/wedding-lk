"use client"

import React, { useState, useEffect } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Skeleton } from "@/components/ui/skeleton"
import { useToast } from "@/hooks/use-toast"
import { MapPin, Star, Calendar, Heart, Eye, Phone, Mail } from "lucide-react"
import Link from "next/link"

interface Vendor {
  _id: string
  name: string
  businessName: string
  category: string
  description: string
  location: {
    address: string
    city: string
    province: string
  }
  contact: {
    phone: string
    email: string
    website?: string
  }
  services: Array<{
    name: string
    description: string
    price: number
  }>
  portfolio: string[]
  pricing: {
    startingPrice: number
    currency: string
  }
  rating: {
    average: number
    count: number
  }
}

interface VendorGridProps {
  limit?: number
  category?: string
  location?: string
  className?: string
  filters?: {
    location: string
    priceRange: number[]
    rating: number
    experience: string
  }
}

export function VendorGrid({ limit = 6, category, location, className = "" }: VendorGridProps) {
  const [vendors, setVendors] = useState<Vendor[]>([])
  const [favorites, setFavorites] = useState<string[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const { toast } = useToast()

  useEffect(() => {
    loadVendors()
    loadFavorites()
  }, [limit, category, location])

  const loadVendors = async () => {
    try {
      setIsLoading(true)
      setError(null)

      // Build query parameters
      const params = new URLSearchParams({
        limit: limit.toString(),
        offset: '0',
      })

      if (category) {
        params.append('category', category)
      }

      if (location) {
        params.append('location', location)
      }

      const response = await fetch(`/api/vendors?${params}`)
      const data = await response.json()

      if (data.success) {
        setVendors(data.vendors)
      } else {
        setError(data.error || 'Failed to load vendors')
        toast({
          title: "Error",
          description: data.error || 'Failed to load vendors',
          variant: "destructive",
        })
      }
    } catch (error) {
      console.error('Error loading vendors:', error)
      setError('Failed to load vendors')
      toast({
        title: "Error",
        description: 'Failed to load vendors',
        variant: "destructive",
      })
    } finally {
      setIsLoading(false)
    }
  }

  const loadFavorites = async () => {
    try {
      const response = await fetch('/api/favorites')
      const data = await response.json()
      
      if (data.success) {
        const vendorIds = data.favorites.vendors.map((vendor: any) => vendor._id || vendor)
        setFavorites(vendorIds)
      }
    } catch (error) {
      console.error('Error loading favorites:', error)
    }
  }

  const formatPrice = (price: number, currency: string) => {
    return new Intl.NumberFormat('en-LK', {
      style: 'currency',
      currency: currency || 'LKR',
      minimumFractionDigits: 0,
    }).format(price)
  }

  const getCategoryColor = (category: string) => {
    const colors: { [key: string]: string } = {
      photographer: 'bg-blue-100 text-blue-800',
      caterer: 'bg-green-100 text-green-800',
      decorator: 'bg-purple-100 text-purple-800',
      music: 'bg-yellow-100 text-yellow-800',
      transport: 'bg-red-100 text-red-800',
      makeup: 'bg-pink-100 text-pink-800',
      jewelry: 'bg-orange-100 text-orange-800',
      clothing: 'bg-indigo-100 text-indigo-800',
    }
    return colors[category.toLowerCase()] || 'bg-gray-100 text-gray-800'
  }

  const handleFavorite = async (vendorId: string) => {
    try {
      const isFavorited = favorites.includes(vendorId)
      const method = isFavorited ? 'DELETE' : 'POST'
      
      const response = await fetch('/api/favorites', {
        method,
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          type: 'vendor',
          itemId: vendorId,
        }),
      })

      const data = await response.json()

      if (data.success) {
        if (isFavorited) {
          setFavorites(favorites.filter(id => id !== vendorId))
          toast({
            title: "Removed from favorites",
            description: "Vendor removed from your favorites list",
          })
        } else {
          setFavorites([...favorites, vendorId])
          toast({
            title: "Added to favorites",
            description: "Vendor added to your favorites list",
          })
        }
      } else {
        toast({
          title: "Error",
          description: data.error || 'Failed to update favorites',
          variant: "destructive",
        })
      }
    } catch (error) {
      console.error('Error updating favorites:', error)
      toast({
        title: "Error",
        description: 'Failed to update favorites',
        variant: "destructive",
      })
    }
  }

  const handleContact = async (vendor: Vendor) => {
    try {
      // Create a message to the vendor
      const response = await fetch('/api/messages', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          recipientId: vendor._id,
          recipientType: 'vendor',
          subject: `Inquiry about ${vendor.businessName}`,
          message: `Hi ${vendor.businessName},\n\nI'm interested in your services and would like to discuss my wedding requirements. Please contact me at your earliest convenience.\n\nThank you!`,
        }),
      })

      const data = await response.json()

      if (data.success) {
        toast({
          title: "Message Sent",
          description: `Your message has been sent to ${vendor.businessName}`,
        })
      } else {
        toast({
          title: "Error",
          description: data.error || 'Failed to send message',
          variant: "destructive",
        })
      }
    } catch (error) {
      console.error('Error sending message:', error)
      toast({
        title: "Error",
        description: 'Failed to send message',
        variant: "destructive",
      })
    }
  }

  if (isLoading) {
    return (
      <div className={`grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 ${className}`}>
        {Array.from({ length: limit }).map((_, index) => (
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
    )
  }

  if (error) {
    return (
      <div className={`text-center py-8 ${className}`}>
        <p className="text-red-500 mb-4">{error}</p>
        <Button onClick={loadVendors} variant="outline">
          Try Again
        </Button>
      </div>
    )
  }

  if (vendors.length === 0) {
    return (
      <div className={`text-center py-8 ${className}`}>
        <p className="text-gray-500 mb-4">No vendors found</p>
        <Button onClick={loadVendors} variant="outline">
          Refresh
        </Button>
      </div>
    )
  }

  return (
    <div className={`grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 ${className}`}>
      {vendors.map((vendor) => {
        const isFavorited = favorites.includes(vendor._id)
        
        return (
          <Card key={vendor._id} className="overflow-hidden hover:shadow-lg transition-shadow">
            <div className="relative">
              <img
                src={vendor.portfolio[0] || '/placeholder.svg'}
                alt={vendor.businessName}
                className="w-full h-48 object-cover"
              />
              <Button
                size="sm"
                variant="ghost"
                className={`absolute top-2 right-2 h-8 w-8 p-0 bg-white/80 hover:bg-white ${
                  isFavorited ? 'text-red-500' : 'text-gray-600'
                }`}
                onClick={() => handleFavorite(vendor._id)}
              >
                <Heart className={`h-4 w-4 ${isFavorited ? 'fill-current' : ''}`} />
              </Button>
            </div>

            <CardHeader className="p-4">
              <div className="flex items-start justify-between">
                <div className="flex-1">
                  <CardTitle className="text-lg font-semibold mb-1 line-clamp-1">
                    {vendor.businessName}
                  </CardTitle>
                  <div className="flex items-center text-sm text-gray-600 mb-2">
                    <MapPin className="h-4 w-4 mr-1" />
                    <span>{vendor.location.city}, {vendor.location.province}</span>
                  </div>
                </div>
              </div>

              <div className="flex items-center justify-between">
                <Badge className={getCategoryColor(vendor.category)}>
                  {vendor.category}
                </Badge>
                <div className="flex items-center text-sm text-gray-600">
                  <Star className="h-4 w-4 mr-1 text-yellow-500" />
                  <span>{vendor.rating?.average?.toFixed(1) || '4.5'} ({vendor.rating?.count || 0})</span>
                </div>
              </div>
            </CardHeader>

            <CardContent className="p-4 pt-0">
              <div className="mb-4">
                <p className="text-sm text-gray-600 line-clamp-2 mb-2">
                  {vendor.description}
                </p>
                <div className="flex flex-wrap gap-1">
                  {vendor.services.slice(0, 2).map((service, index) => (
                    <Badge key={index} variant="secondary" className="text-xs">
                      {service.name}
                    </Badge>
                  ))}
                  {vendor.services.length > 2 && (
                    <Badge variant="secondary" className="text-xs">
                      +{vendor.services.length - 2} more
                    </Badge>
                  )}
                </div>
              </div>

              <div className="flex items-center justify-between">
                <div>
                  <p className="text-lg font-semibold text-green-600">
                    {formatPrice(vendor.pricing.startingPrice, vendor.pricing.currency)}
                  </p>
                  <p className="text-xs text-gray-500">Starting price</p>
                </div>
                <div className="flex space-x-2">
                  <Button
                    size="sm"
                    variant="outline"
                    asChild
                  >
                    <Link href={`/vendors/${vendor._id}`}>
                      <Eye className="h-4 w-4 mr-1" />
                      View
                    </Link>
                  </Button>
                  <Button
                    size="sm"
                    onClick={() => handleContact(vendor)}
                  >
                    <Phone className="h-4 w-4 mr-1" />
                    Contact
                  </Button>
                </div>
              </div>

              <div className="mt-3 pt-3 border-t">
                <div className="flex items-center justify-between text-xs text-gray-500">
                  <div className="flex items-center">
                    <Phone className="h-3 w-3 mr-1" />
                    <span>{vendor.contact?.phone || 'N/A'}</span>
                  </div>
                  <div className="flex items-center">
                    <Mail className="h-3 w-3 mr-1" />
                    <span>{vendor.contact?.email || 'N/A'}</span>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        )
      })}
    </div>
  )
}

export default VendorGrid
