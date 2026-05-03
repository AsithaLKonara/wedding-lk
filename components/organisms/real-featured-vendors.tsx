"use client"

import { useState, useEffect } from 'react'
import Link from 'next/link'
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Star, MapPin, Phone, Mail } from 'lucide-react'

interface FeaturedVendor {
  _id: string
  businessName: string
  name: string
  description: string
  category: string
  location: {
    city: string
    province: string
  }
  contact: {
    phone: string
    email: string
  }
  rating?: {
    average?: number
    count?: number
  }
  isVerified: boolean
  isActive: boolean
  featured: boolean
}

export default function RealFeaturedVendors() {
  const [vendors, setVendors] = useState<FeaturedVendor[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetchFeaturedVendors()
  }, [])

  const fetchFeaturedVendors = async () => {
    try {
      const response = await fetch('/api/home/featured-vendors')
      if (response.ok) {
        const result = await response.json()
        setVendors(result.data?.vendors || [])
      }
    } catch (error) {
      console.error('Failed to fetch featured vendors:', error)
    } finally {
      setLoading(false)
    }
  }

  if (loading) {
    return (
      <section className="py-24 bg-background">
        <div className="container mx-auto px-4">
          <div className="flex flex-col items-center justify-center space-y-4">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-rose-500"></div>
            <p className="text-muted-foreground animate-pulse">Discovering perfect vendors...</p>
          </div>
        </div>
      </section>
    )
  }

  if (!vendors || vendors.length === 0) {
    return (
      <section className="py-24 bg-background">
        <div className="container mx-auto px-4 text-center">
          <div className="max-w-md mx-auto p-8 rounded-2xl border border-dashed border-muted-foreground/20">
            <p className="text-muted-foreground italic">No featured vendors available at the moment. Check back soon!</p>
          </div>
        </div>
      </section>
    )
  }

  return (
    <section className="py-24 bg-background relative overflow-hidden">
      {/* Decorative background elements */}
      <div className="absolute top-0 right-0 -translate-y-1/2 translate-x-1/2 w-96 h-96 bg-rose-500/5 rounded-full blur-3xl" />
      <div className="absolute bottom-0 left-0 translate-y-1/2 -translate-x-1/2 w-96 h-96 bg-purple-500/5 rounded-full blur-3xl" />

      <div className="container mx-auto px-4 relative z-10">
        <div className="text-center mb-16">
          <h2 className="text-4xl md:text-5xl font-bold mb-6 tracking-tight">
            Featured Wedding <span className="gradient-text">Vendors</span>
          </h2>
          <p className="text-xl text-muted-foreground max-w-2xl mx-auto leading-relaxed">
            Discover top-rated, verified vendors who will make your wedding day truly special
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {vendors.map((vendor) => (
            <Card key={vendor?._id || Math.random()} className="group hover:shadow-2xl hover:-translate-y-1 transition-all duration-500 border-border/50 bg-card/50 backdrop-blur-sm overflow-hidden">
              <CardHeader className="pb-4 relative">
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <CardTitle className="text-xl font-bold group-hover:text-rose-500 transition-colors duration-300">
                      {vendor?.businessName || 'Unknown Business'}
                    </CardTitle>
                    <CardDescription className="text-sm font-medium text-muted-foreground/80 mt-1 uppercase tracking-wider">
                      {vendor?.name || vendor?.businessName || 'Unknown'} • {vendor?.category || 'General'}
                    </CardDescription>
                  </div>
                  {vendor?.isVerified && (
                    <Badge className="bg-rose-500 hover:bg-rose-600 text-white border-none px-3 py-1 shadow-sm shadow-rose-500/20">
                      Verified
                    </Badge>
                  )}
                </div>
              </CardHeader>

              <CardContent className="space-y-6">
                <p className="text-muted-foreground text-sm leading-relaxed line-clamp-3 min-h-[4.5rem]">
                  {vendor?.description || 'No description available'}
                </p>

                <div className="flex items-center justify-between py-4 border-y border-border/50">
                  <div className="flex items-center space-x-2">
                    <div className="flex items-center">
                      {[...Array(5)].map((_, i) => (
                        <Star 
                          key={i} 
                          className={`h-4 w-4 ${i < Math.floor(vendor.rating?.average || 4.5) ? 'text-yellow-400 fill-current' : 'text-muted'}`} 
                        />
                      ))}
                    </div>
                    <span className="text-sm font-bold">
                      {vendor.rating?.average || 4.5}
                    </span>
                    <span className="text-xs text-muted-foreground font-medium uppercase tracking-tight">
                      ({vendor.rating?.count || 0} reviews)
                    </span>
                  </div>
                  <div className="flex items-center text-xs font-bold text-muted-foreground uppercase tracking-widest bg-muted/30 px-3 py-1 rounded-full">
                    <MapPin className="h-3 w-3 mr-1 text-rose-500" />
                    {vendor?.location?.city || 'Unknown'}
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div className="flex items-center space-x-2 text-xs text-muted-foreground hover:text-foreground transition-colors">
                    <div className="p-2 rounded-lg bg-muted/30">
                      <Phone className="h-3 w-3 text-rose-500" />
                    </div>
                    <span className="font-medium truncate">{vendor?.contact?.phone || 'N/A'}</span>
                  </div>
                  <div className="flex items-center space-x-2 text-xs text-muted-foreground hover:text-foreground transition-colors">
                    <div className="p-2 rounded-lg bg-muted/30">
                      <Mail className="h-3 w-3 text-rose-500" />
                    </div>
                    <span className="font-medium truncate">{vendor?.contact?.email || 'N/A'}</span>
                  </div>
                </div>

                <div className="pt-2">
                  <Link href={`/vendors/${vendor?._id || 'unknown'}`}>
                    <Button className="w-full h-12 bg-rose-500 hover:bg-rose-600 text-white shadow-lg shadow-rose-500/20 transition-all duration-300 group-hover:scale-[1.02]" variant="default">
                      View Profile
                    </Button>
                  </Link>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        <div className="text-center mt-20">
          <Link href="/vendors">
            <Button variant="outline" size="lg" className="px-12 h-14 rounded-full border-2 hover:bg-rose-500 hover:text-white hover:border-rose-500 transition-all duration-300 font-bold tracking-wide">
              Explore All Vendors
            </Button>
          </Link>
        </div>
      </div>
    </section>
  )
}
