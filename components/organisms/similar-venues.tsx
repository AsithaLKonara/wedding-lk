"use client"

import React from "react"
import { useState, useEffect } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { VenueCard } from "@/components/molecules/venue-card"
import { Loader2, RefreshCw, MapPin, Star, Heart } from "lucide-react"
import { useToast } from "@/hooks/use-toast"

interface SimilarVenue {
  id: string
  name: string
  location: string
  capacity: number
  price: number
  rating: number
  image: string
  amenities: string[]
  distance?: number
  similarity?: number
}

interface SimilarVenuesProps {
  currentVenueId: string
  currentVenueLocation?: string
  currentVenuePrice?: number
}

export function SimilarVenues({ currentVenueId, currentVenueLocation, currentVenuePrice }: SimilarVenuesProps) {
  const { toast } = useToast()
  const [isLoading, setIsLoading] = useState(true)
  const [isRefreshing, setIsRefreshing] = useState(false)
  const [similarVenues, setSimilarVenues] = useState<SimilarVenue[]>([])

  // Mock similar venues data
  const mockSimilarVenues: SimilarVenue[] = [
    {
      id: "2",
      name: "Garden Paradise Resort",
      location: "Kandy",
      capacity: 200,
      price: 120000,
      rating: 4.6,
      image: "/placeholder.svg?height=300&width=400",
      amenities: ["Garden", "Pool", "Accommodation"],
      distance: 115,
      similarity: 85
    },
    {
      id: "3",
      name: "Seaside Wedding Villa",
      location: "Galle",
      capacity: 150,
      price: 100000,
      rating: 4.9,
      image: "/placeholder.svg?height=300&width=400",
      amenities: ["Beach View", "Photography", "Catering"],
      distance: 180,
      similarity: 78
    },
    {
      id: "4",
      name: "Mountain View Resort",
      location: "Ella",
      capacity: 120,
      price: 90000,
      rating: 4.7,
      image: "/placeholder.svg?height=300&width=400",
      amenities: ["Mountain View", "Garden", "Accommodation"],
      distance: 220,
      similarity: 72
    },
    {
      id: "5",
      name: "Luxury Beach Resort",
      location: "Bentota",
      capacity: 250,
      price: 140000,
      rating: 4.8,
      image: "/placeholder.svg?height=300&width=400",
      amenities: ["Beach Access", "Spa", "Water Sports"],
      distance: 95,
      similarity: 81
    },
    {
      id: "6",
      name: "Historic Manor House",
      location: "Galle Fort",
      capacity: 80,
      price: 85000,
      rating: 4.5,
      image: "/placeholder.svg?height=300&width=400",
      amenities: ["Historic Setting", "Garden", "Photography"],
      distance: 185,
      similarity: 69
    },
  ]

  const loadSimilarVenues = async () => {
    try {
      // Simulate API call to fetch similar venues
      await new Promise(resolve => setTimeout(resolve, 1000))
      
      // Filter out the current venue and sort by similarity
      const filteredVenues = mockSimilarVenues
        .filter(venue => venue.id !== currentVenueId)
        .sort((a, b) => (b.similarity || 0) - (a.similarity || 0))
        .slice(0, 6)
      
      setSimilarVenues(filteredVenues)
      
      if (!isLoading) {
        toast({
          title: "Similar Venues Updated",
          description: "Found new venues that match your preferences.",
        })
      }
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to load similar venues. Please try again.",
        variant: "destructive",
      })
    } finally {
      setIsLoading(false)
      setIsRefreshing(false)
    }
  }

  useEffect(() => {
    loadSimilarVenues()
  }, [currentVenueId])

  const handleRefresh = () => {
    setIsRefreshing(true)
    loadSimilarVenues()
  }

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat("en-LK", {
      style: "currency",
      currency: "LKR",
      minimumFractionDigits: 0,
    }).format(amount)
  }

  const getSimilarityColor = (similarity: number) => {
    if (similarity >= 80) return "bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200"
    if (similarity >= 70) return "bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200"
    return "bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200"
  }

  const getSimilarityLabel = (similarity: number) => {
    if (similarity >= 80) return "Very Similar"
    if (similarity >= 70) return "Similar"
    return "Somewhat Similar"
  }

  if (isLoading) {
    return (
      <Card role="region" aria-label="Similar Venues">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <MapPin className="h-5 w-5 text-blue-600" aria-hidden="true" />
            Similar Venues
            <Badge variant="secondary">Loading...</Badge>
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex items-center justify-center py-12">
            <div className="text-center">
              <Loader2 className="h-8 w-8 animate-spin mx-auto mb-4 text-blue-600" />
              <p className="text-gray-600 dark:text-gray-400">Finding similar venues...</p>
            </div>
          </div>
        </CardContent>
      </Card>
    )
  }

  return (
    <Card role="region" aria-label="Similar Venues">
      <CardHeader>
        <div className="flex items-center justify-between">
          <CardTitle className="flex items-center gap-2">
            <MapPin className="h-5 w-5 text-blue-600" aria-hidden="true" />
            Similar Venues
            <Badge variant="secondary">
              {similarVenues.length} venues
            </Badge>
          </CardTitle>
          <Button
            variant="outline"
            size="sm"
            onClick={handleRefresh}
            disabled={isRefreshing}
            aria-label="Refresh similar venues"
          >
            {isRefreshing ? <Loader2 className="h-4 w-4 animate-spin" /> : <RefreshCw className="h-4 w-4" />}
          </Button>
        </div>
        {currentVenueLocation && (
          <p className="text-sm text-gray-600 dark:text-gray-400">
            Based on venues near {currentVenueLocation}
            {currentVenuePrice && ` with similar pricing to ${formatCurrency(currentVenuePrice)}`}
          </p>
        )}
      </CardHeader>
      <CardContent>
        {similarVenues.length === 0 ? (
          <div className="text-center py-8 text-gray-500">
            <MapPin className="h-12 w-12 mx-auto mb-4 text-gray-300" />
            <p className="text-lg font-medium">No similar venues found</p>
            <p className="text-sm">Try adjusting your search criteria</p>
          </div>
        ) : (
          <div className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {similarVenues.map((venue) => (
                <div key={venue.id} className="relative group">
                  <VenueCard {...venue} id={parseInt(venue.id)} />
                  
                  {/* Similarity indicator */}
                  {venue.similarity && (
                    <div className="absolute top-2 right-2 z-10">
                      <Badge className={`text-xs ${getSimilarityColor(venue.similarity)}`}>
                        {getSimilarityLabel(venue.similarity)}
                      </Badge>
                    </div>
                  )}
                  
                  {/* Distance indicator */}
                  {venue.distance && (
                    <div className="absolute top-2 left-2 z-10">
                      <Badge variant="secondary" className="text-xs">
                        {venue.distance}km away
                      </Badge>
                    </div>
                  )}
                  
                  {/* Quick actions on hover */}
                  <div className="absolute bottom-2 right-2 opacity-0 group-hover:opacity-100 transition-opacity duration-200">
                    <div className="flex gap-1">
                      <Button size="sm" variant="secondary" className="h-8 w-8 p-0">
                        <Heart className="h-4 w-4" />
                      </Button>
                      <Button size="sm" variant="secondary" className="h-8 w-8 p-0">
                        <Star className="h-4 w-4" />
                      </Button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
            
            <div className="pt-4 border-t">
              <div className="flex items-center justify-between">
                <p className="text-sm text-gray-600 dark:text-gray-400">
                  Showing {similarVenues.length} similar venues
                </p>
                <Button variant="outline" size="sm">
                  View More Similar Venues
                </Button>
              </div>
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  )
}


export default SimilarVenues
