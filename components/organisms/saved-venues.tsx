"use client"

import { useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger } from "@/components/ui/alert-dialog"
import { Heart, Star, MapPin, Eye, Trash2, Loader2, Calendar, Users } from "lucide-react"
import Image from "next/image"
import { useToast } from "@/hooks/use-toast"

interface SavedVenue {
  id: string
  name: string
  location: string
  price: number
  rating: number
  image: string
  savedDate: string
  capacity?: number
  description?: string
  amenities?: string[]
}

export function SavedVenues() {
  const { toast } = useToast()
  const [isLoading, setIsLoading] = useState<string | null>(null)

  const [savedVenues, setSavedVenues] = useState<SavedVenue[]>([
    {
      id: "1",
      name: "Grand Ballroom Hotel",
      location: "Colombo",
      price: 150000,
      rating: 4.8,
      image: "/placeholder.svg?height=100&width=150",
      savedDate: "2 days ago",
      capacity: 300,
      description: "Luxurious hotel ballroom with stunning city views",
      amenities: ["Parking", "Catering", "Audio/Visual"]
    },
    {
      id: "2",
      name: "Garden Paradise Resort",
      location: "Kandy",
      price: 120000,
      rating: 4.6,
      image: "/placeholder.svg?height=100&width=150",
      savedDate: "1 week ago",
      capacity: 200,
      description: "Beautiful garden setting with mountain views",
      amenities: ["Garden", "Catering", "Accommodation"]
    },
    {
      id: "3",
      name: "Seaside Wedding Villa",
      location: "Galle",
      price: 100000,
      rating: 4.9,
      image: "/placeholder.svg?height=100&width=150",
      savedDate: "2 weeks ago",
      capacity: 150,
      description: "Intimate beachfront venue for romantic weddings",
      amenities: ["Beach Access", "Catering", "Photography"]
    },
  ])

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat("en-LK", {
      style: "currency",
      currency: "LKR",
      minimumFractionDigits: 0,
    }).format(amount)
  }

  const handleViewVenue = async (venue: SavedVenue) => {
    setIsLoading(venue.id)
    try {
      // Simulate navigation delay
      await new Promise(resolve => setTimeout(resolve, 500))
      
      toast({
        title: "Opening Venue",
        description: `Taking you to ${venue.name}`,
      })
      
      // Here you would typically use Next.js router to navigate
      // router.push(`/venues/${venue.id}`)
      
    } catch (error) {
      toast({
        title: "Navigation Error",
        description: "Failed to open venue. Please try again.",
        variant: "destructive",
      })
    } finally {
      setIsLoading(null)
    }
  }

  const handleRemoveVenue = async (venueId: string, venueName: string) => {
    setIsLoading(venueId)
    try {
      setSavedVenues(prev => prev.filter(venue => venue.id !== venueId))
      toast({
        title: "Venue Removed",
        description: `${venueName} has been removed from your saved venues.`,
      })
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to remove venue. Please try again.",
        variant: "destructive",
      })
    } finally {
      setIsLoading(null)
    }
  }

  const handleBookVenue = async (venue: SavedVenue) => {
    setIsLoading(venue.id)
    try {
      // Simulate booking process
      await new Promise(resolve => setTimeout(resolve, 1000))
      
      toast({
        title: "Booking Initiated",
        description: `Starting booking process for ${venue.name}`,
      })
      
      // Here you would typically navigate to booking page
      // router.push(`/venues/${venue.id}/book`)
      
    } catch (error) {
      toast({
        title: "Booking Error",
        description: "Failed to start booking. Please try again.",
        variant: "destructive",
      })
    } finally {
      setIsLoading(null)
    }
  }

  return (
    <Card role="region" aria-label="Saved Venues">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Heart className="h-5 w-5 text-red-500" aria-hidden="true" />
          Saved Venues
          <Badge variant="secondary" className="ml-auto">
            {savedVenues.length} venues
          </Badge>
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        {savedVenues.length === 0 ? (
          <div className="text-center py-8 text-gray-500">
            <Heart className="h-12 w-12 mx-auto mb-4 text-gray-300" />
            <p className="text-lg font-medium">No saved venues yet</p>
            <p className="text-sm">Start exploring and save your favorite venues</p>
            <Button variant="outline" className="mt-4">
              Browse Venues
            </Button>
          </div>
        ) : (
          savedVenues.map((venue) => (
            <div 
              key={venue.id} 
              className="flex items-center space-x-4 p-3 border rounded-lg hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors group"
              role="listitem"
              aria-label={`Saved venue: ${venue.name} in ${venue.location}, rated ${venue.rating} stars, ${formatCurrency(venue.price)}`}
            >
              <div className="relative">
                <Image
                  src={venue.image || "/placeholder.svg"}
                  alt={venue.name}
                  width={60}
                  height={60}
                  className="rounded-lg object-cover"
                />
                {isLoading === venue.id && (
                  <div className="absolute inset-0 bg-background/80 flex items-center justify-center rounded-lg">
                    <Loader2 className="h-4 w-4 animate-spin" />
                  </div>
                )}
              </div>
              
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2">
                  <div className="font-medium text-gray-900 dark:text-white truncate">
                    {venue.name}
                  </div>
                  <Badge variant="outline" className="text-xs">
                    Saved {venue.savedDate}
                  </Badge>
                </div>
                
                <div className="flex items-center text-sm text-gray-600 dark:text-gray-400 mt-1">
                  <MapPin className="h-3 w-3 mr-1" aria-hidden="true" />
                  {venue.location}
                  {venue.capacity && (
                    <>
                      <span className="mx-2">•</span>
                      <Users className="h-3 w-3 mr-1" aria-hidden="true" />
                      {venue.capacity} guests
                    </>
                  )}
                </div>
                
                <div className="flex items-center justify-between mt-2">
                  <div className="flex items-center">
                    <Star className="h-3 w-3 text-yellow-400 fill-current mr-1" aria-hidden="true" />
                    <span className="text-sm font-medium">{venue.rating}</span>
                    <span className="text-xs text-gray-500 ml-1">({venue.rating >= 4.5 ? 'Excellent' : venue.rating >= 4.0 ? 'Very Good' : 'Good'})</span>
                  </div>
                  <div className="text-sm font-medium text-green-600">
                    {formatCurrency(venue.price)}
                  </div>
                </div>
                
                {venue.amenities && venue.amenities.length > 0 && (
                  <div className="flex flex-wrap gap-1 mt-2">
                    {venue.amenities.slice(0, 2).map((amenity, index) => (
                      <Badge key={index} variant="secondary" className="text-xs">
                        {amenity}
                      </Badge>
                    ))}
                    {venue.amenities.length > 2 && (
                      <Badge variant="secondary" className="text-xs">
                        +{venue.amenities.length - 2} more
                      </Badge>
                    )}
                  </div>
                )}
              </div>
              
              <div className="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                <Button
                  size="sm"
                  variant="ghost"
                  onClick={() => handleViewVenue(venue)}
                  disabled={isLoading !== null}
                  aria-label={`View ${venue.name} details`}
                >
                  <Eye className="h-4 w-4" />
                </Button>
                <Button
                  size="sm"
                  variant="ghost"
                  onClick={() => handleBookVenue(venue)}
                  disabled={isLoading !== null}
                  aria-label={`Book ${venue.name}`}
                >
                  <Calendar className="h-4 w-4" />
                </Button>
                <AlertDialog>
                  <AlertDialogTrigger asChild>
                    <Button
                      size="sm"
                      variant="ghost"
                      aria-label={`Remove ${venue.name} from saved venues`}
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </AlertDialogTrigger>
                  <AlertDialogContent>
                    <AlertDialogHeader>
                      <AlertDialogTitle>Remove Saved Venue</AlertDialogTitle>
                      <AlertDialogDescription>
                        Are you sure you want to remove "{venue.name}" from your saved venues? This action cannot be undone.
                      </AlertDialogDescription>
                    </AlertDialogHeader>
                    <AlertDialogFooter>
                      <AlertDialogCancel>Cancel</AlertDialogCancel>
                      <AlertDialogAction
                        onClick={() => handleRemoveVenue(venue.id, venue.name)}
                        disabled={isLoading !== null}
                      >
                        {isLoading === venue.id ? <Loader2 className="h-4 w-4 animate-spin" /> : "Remove"}
                      </AlertDialogAction>
                    </AlertDialogFooter>
                  </AlertDialogContent>
                </AlertDialog>
              </div>
            </div>
          ))
        )}
        
        {savedVenues.length > 0 && (
          <Button variant="outline" className="w-full" disabled={isLoading !== null}>
            View All Saved Venues
          </Button>
        )}
      </CardContent>
    </Card>
  )
}
