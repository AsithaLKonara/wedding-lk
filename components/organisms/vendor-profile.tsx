"use client"

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Star, MapPin, Clock, DollarSign, Phone, Mail, Globe } from "lucide-react"
import Image from "next/image"

interface VendorProfileProps {
  vendor: {
    _id: string
    businessName: string
    category: string
    location: {
      address: string
      city: string
      province: string
      coordinates?: { lat: number; lng: number }
    }
    rating?: { average: number; count: number }
    experience?: number
    pricing?: { startingPrice: number }
    avatar?: string
    coverImage?: string
    description: string
    services?: Array<{
      name: string
      description: string
      price: number
    }>
    contact: {
      phone: string
      email: string
      website?: string
    }
  }
}

export function VendorProfile({ vendor }: VendorProfileProps) {
  return (
    <Card className="mb-8">
      <div className="relative h-48 bg-gradient-to-r from-rose-500 to-pink-600 rounded-t-lg">
        <Image
          src={vendor.coverImage || '/placeholder-venue.jpg'}
          alt={vendor.businessName}
          fill
          className="object-cover rounded-t-lg"
          priority
        />
        <div className="absolute inset-0 bg-black bg-opacity-40 rounded-t-lg" />
        <div className="absolute bottom-4 left-4 text-white">
          <h1 className="text-3xl font-bold">{vendor.businessName}</h1>
          <p className="text-lg opacity-90">{vendor.category}</p>
        </div>
      </div>
      
      <CardContent className="p-6">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center space-x-4">
                      <div className="flex items-center space-x-1">
            <Star className="h-5 w-5 text-yellow-500 fill-current" />
            <span className="font-semibold">{vendor.rating?.average?.toFixed(1) || '4.5'}</span>
            <span className="text-gray-500">({vendor.rating?.count || 0} reviews)</span>
          </div>
            <Badge variant="secondary">{vendor.category}</Badge>
          </div>
          <Button>Contact Vendor</Button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
          <div className="flex items-center space-x-2">
            <MapPin className="h-4 w-4 text-gray-500" />
            <span>{vendor.location.address}, {vendor.location.city}</span>
          </div>
          <div className="flex items-center space-x-2">
            <Clock className="h-4 w-4 text-gray-500" />
            <span>{vendor.experience || 0} years experience</span>
          </div>
          <div className="flex items-center space-x-2">
            <DollarSign className="h-4 w-4 text-gray-500" />
            <span>Starting from LKR {(vendor.pricing?.startingPrice || 0).toLocaleString()}</span>
          </div>
        </div>

        <p className="text-gray-600 dark:text-gray-300 mb-6">{vendor.description}</p>

        <div className="space-y-4">
          <h3 className="font-semibold">Services Offered</h3>
          <div className="flex flex-wrap gap-2">
            {vendor.services?.map((service, index) => (
              <Badge key={index} variant="outline">{service.name}</Badge>
            )) || <span className="text-gray-500">No services listed</span>}
          </div>
        </div>

        <div className="mt-6 pt-6 border-t">
          <h3 className="font-semibold mb-4">Contact Information</h3>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="flex items-center space-x-2">
              <Phone className="h-4 w-4 text-gray-500" />
              <span>{vendor.contact?.phone || 'N/A'}</span>
            </div>
            <div className="flex items-center space-x-2">
              <Mail className="h-4 w-4 text-gray-500" />
              <span>{vendor.contact?.email || 'N/A'}</span>
            </div>
            <div className="flex items-center space-x-2">
              <Globe className="h-4 w-4 text-gray-500" />
              <span>{vendor.contact?.website || 'N/A'}</span>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  )
}


export default VendorProfile
