"use client"

import { useState, useEffect } from 'react'
import Link from 'next/link'
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Star, MapPin, Users, DollarSign } from 'lucide-react'

interface FeaturedVenue {
  _id: string
  name: string
  description: string
  location: {
    city: string
    province: string
  }
  capacity: {
    min: number
    max: number
  }
  pricing: {
    basePrice: number
    currency: string
  }
  rating?: {
    average?: number
    count?: number
  }
  isVerified: boolean
  isActive: boolean
  featured: boolean
}

export default function RealFeaturedVenues() {
  const [venues, setVenues] = useState<FeaturedVenue[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetchFeaturedVenues()
  }, [])

  const fetchFeaturedVenues = async () => {
    try {
      const response = await fetch('/api/home/featured-venues')
      if (response.ok) {
        const result = await response.json()
        setVenues(result.data?.venues || [])
      }
    } catch (error) {
      console.error('Failed to fetch featured venues:', error)
    } finally {
      setLoading(false)
    }
  }

  if (loading) {
    return (
      <section className="py-24 bg-muted/30">
        <div className="container mx-auto px-4">
          <div className="flex flex-col items-center justify-center space-y-4">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-purple-500"></div>
            <p className="text-muted-foreground animate-pulse">Finding breathtaking venues...</p>
          </div>
        </div>
      </section>
    )
  }

  if (!venues || venues.length === 0) {
    return (
      <section className="py-24 bg-muted/30">
        <div className="container mx-auto px-4 text-center">
          <div className="max-w-md mx-auto p-8 rounded-2xl border border-dashed border-muted-foreground/20">
            <p className="text-muted-foreground italic">No featured venues available at the moment. Your dream venue is coming soon!</p>
          </div>
        </div>
      </section>
    )
  }

  return (
    <section className="py-24 bg-muted/30 relative overflow-hidden">
      {/* Subtle patterns/decorations */}
      <div className="absolute top-0 left-1/4 w-64 h-64 bg-purple-500/5 rounded-full blur-3xl" />
      <div className="absolute bottom-0 right-1/4 w-64 h-64 bg-rose-500/5 rounded-full blur-3xl" />

      <div className="container mx-auto px-4 relative z-10">
        <div className="text-center mb-16">
          <h2 className="text-4xl md:text-5xl font-bold mb-6 tracking-tight">
            Featured Wedding <span className="gradient-text">Venues</span>
          </h2>
          <p className="text-xl text-muted-foreground max-w-2xl mx-auto leading-relaxed">
            Discover stunning venues that will provide the perfect backdrop for your special day
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {venues.map((venue) => (
            <Card key={venue._id} className="group hover:shadow-2xl hover:-translate-y-1 transition-all duration-500 border-border/50 bg-card/50 backdrop-blur-sm overflow-hidden">
              <CardHeader className="pb-4">
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <CardTitle className="text-xl font-bold group-hover:text-purple-500 transition-colors duration-300">
                      {venue?.name || 'N/A'}
                    </CardTitle>
                    <CardDescription className="text-sm font-medium text-muted-foreground/80 mt-1 flex items-center">
                      <MapPin className="h-3 w-3 mr-1 text-purple-500" />
                      {venue?.location?.city || 'N/A'}, {venue?.location?.province || 'N/A'}
                    </CardDescription>
                  </div>
                  {venue?.isVerified && (
                    <Badge className="bg-purple-500 hover:bg-purple-600 text-white border-none px-3 py-1 shadow-sm shadow-purple-500/20">
                      Verified
                    </Badge>
                  )}
                </div>
              </CardHeader>

              <CardContent className="space-y-6">
                <p className="text-muted-foreground text-sm leading-relaxed line-clamp-3 min-h-[4.5rem]">
                  {venue?.description || 'No description available'}
                </p>

                <div className="flex items-center justify-between py-4 border-y border-border/50">
                  <div className="flex items-center space-x-2">
                    <div className="flex items-center">
                      {[...Array(5)].map((_, i) => (
                        <Star 
                          key={i} 
                          className={`h-4 w-4 ${i < Math.floor(venue.rating?.average || 4.5) ? 'text-yellow-400 fill-current' : 'text-muted'}`} 
                        />
                      ))}
                    </div>
                    <span className="text-sm font-bold">
                      {venue.rating?.average || 4.5}
                    </span>
                  </div>
                  <div className="text-xs font-bold text-muted-foreground uppercase tracking-widest bg-muted/50 px-3 py-1 rounded-full">
                    {venue.rating?.count || 0} Reviews
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div className="flex flex-col space-y-1">
                    <span className="text-[10px] font-bold text-muted-foreground uppercase tracking-wider">Capacity</span>
                    <div className="flex items-center text-sm font-semibold">
                      <Users className="h-4 w-4 mr-2 text-purple-500" />
                      {venue?.capacity?.min || 0}-{venue?.capacity?.max || 0}
                    </div>
                  </div>
                  <div className="flex flex-col space-y-1">
                    <span className="text-[10px] font-bold text-muted-foreground uppercase tracking-wider">Starting From</span>
                    <div className="flex items-center text-sm font-semibold text-rose-500">
                      <DollarSign className="h-4 w-4 mr-1" />
                      {venue?.pricing?.basePrice?.toLocaleString() || "0"}
                    </div>
                  </div>
                </div>

                <div className="pt-2">
                  <Link href={`/venues/${venue?._id || ''}`}>
                    <Button className="w-full h-12 bg-purple-500 hover:bg-purple-600 text-white shadow-lg shadow-purple-500/20 transition-all duration-300 group-hover:scale-[1.02]" variant="default">
                      View Venue
                    </Button>
                  </Link>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        <div className="text-center mt-20">
          <Link href="/venues">
            <Button variant="outline" size="lg" className="px-12 h-14 rounded-full border-2 hover:bg-purple-500 hover:text-white hover:border-purple-500 transition-all duration-300 font-bold tracking-wide">
              Explore All Venues
            </Button>
          </Link>
        </div>
      </div>
    </section>
  )
}
 