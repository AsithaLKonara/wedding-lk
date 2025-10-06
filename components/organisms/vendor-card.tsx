"use client"

import { useState, useEffect } from 'react'
import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Heart, MapPin, Star, MessageCircle, Phone, Mail } from "lucide-react"

interface VendorCardProps {
  vendor: {
    id: string | number
    name: string
    category: string
    location: string
    rating: number
    reviewCount: number
    priceRange: string
    image: string
    contact: {
      phone: string
      email: string
      website?: string
    }
  }
  onViewProfile?: (vendorId: string | number) => void
  onContact?: (vendorId: string | number) => void
}

export function VendorCard({ vendor, onViewProfile, onContact }: VendorCardProps) {
  const [isFavorited, setIsFavorited] = useState(false)
  const [loading, setLoading] = useState(false)

  // Check if vendor is favorited
  useEffect(() => {
    const checkFavoriteStatus = async () => {
      try {
        const response = await fetch(`/api/favorites/check?vendorId=${vendor.id}`)
        if (response.ok) {
          const data = await response.json()
          setIsFavorited(data.isFavorited || false)
        }
      } catch (error) {
        console.error('Error checking favorite status:', error)
      }
    }

    checkFavoriteStatus()
  }, [vendor.id])

  const handleToggleFavorite = async () => {
    try {
      setLoading(true)
      const response = await fetch('/api/favorites', {
        method: isFavorited ? 'DELETE' : 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          vendorId: vendor.id,
          type: 'vendor'
        })
      })

      if (response.ok) {
        setIsFavorited(!isFavorited)
      }
    } catch (error) {
      console.error('Error toggling favorite:', error)
    } finally {
      setLoading(false)
    }
  }

  const handleViewProfile = () => {
    if (onViewProfile) {
      onViewProfile(vendor.id)
    } else {
      window.location.href = `/vendors/${vendor.id}`
    }
  }

  const handleContact = () => {
    if (onContact) {
      onContact(vendor.id)
    } else {
      // Default contact action - could open a modal or redirect
      window.location.href = `mailto:${vendor.contact.email}`
    }
  }

  return (
    <Card className="group hover:shadow-lg transition-all duration-300 overflow-hidden">
      <div className="relative">
        <img
          src={vendor.image}
          alt={vendor.name}
          className="w-full h-48 object-cover group-hover:scale-105 transition-transform duration-300"
        />
        <button
          onClick={handleToggleFavorite}
          disabled={loading}
          className="absolute top-3 right-3 p-2 bg-white/80 backdrop-blur-sm rounded-full hover:bg-white transition-colors disabled:opacity-50"
        >
          <Heart 
            className={`h-5 w-5 ${
              isFavorited ? 'fill-red-500 text-red-500' : 'text-gray-600'
            }`} 
          />
        </button>
        <div className="absolute bottom-3 left-3 bg-white/90 backdrop-blur-sm px-2 py-1 rounded-md">
          <div className="flex items-center gap-1">
            <Star className="h-4 w-4 text-yellow-500 fill-current" />
            <span className="text-sm font-medium">{vendor.rating}</span>
            <span className="text-xs text-gray-600">({vendor.reviewCount})</span>
          </div>
        </div>
      </div>

      <CardContent className="p-6">
        <div className="space-y-3">
          <div>
            <h3 className="font-semibold text-lg text-gray-900 dark:text-white line-clamp-1">
              {vendor.name}
            </h3>
            <p className="text-sm text-blue-600 font-medium">{vendor.category}</p>
            <div className="flex items-center gap-1 text-gray-600 dark:text-gray-400">
              <MapPin className="h-4 w-4" />
              <span className="text-sm">{vendor.location}</span>
            </div>
          </div>

          <div className="flex items-center justify-between">
            <div className="text-sm">
              <p className="text-gray-600 dark:text-gray-400">Price Range</p>
              <p className="font-medium text-gray-900 dark:text-white">{vendor.priceRange}</p>
            </div>
          </div>

          <div className="flex flex-wrap gap-1">
            <span className="px-2 py-1 bg-blue-100 dark:bg-blue-900 text-blue-700 dark:text-blue-300 text-xs rounded-full">
              {vendor.category}
            </span>
            <span className="px-2 py-1 bg-green-100 dark:bg-green-900 text-green-700 dark:text-green-300 text-xs rounded-full">
              Available
            </span>
          </div>

          <div className="flex gap-2 pt-2">
            <Button 
              onClick={handleViewProfile}
              variant="outline" 
              className="flex-1"
            >
              <MessageCircle className="h-4 w-4 mr-2" />
              View Profile
            </Button>
            <Button 
              onClick={handleContact}
              className="flex-1 bg-gradient-to-r from-blue-500 to-purple-600 hover:from-blue-600 hover:to-purple-700"
            >
              Contact
            </Button>
          </div>

          <div className="flex gap-2 text-xs text-gray-500">
            <div className="flex items-center gap-1">
              <Phone className="h-3 w-3" />
              <span>{vendor.contact.phone}</span>
            </div>
            <div className="flex items-center gap-1">
              <Mail className="h-3 w-3" />
              <span className="truncate">{vendor.contact.email}</span>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  )
}
