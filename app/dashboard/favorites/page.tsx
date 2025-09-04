"use client"

import { useState, useEffect } from "react"
import { useSession } from "next-auth/react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Heart, MapPin, Star, Phone, Mail } from "lucide-react"
import { formatCurrency } from "@/lib/utils/format"

interface Favorite {
  id: string
  type: 'vendor' | 'venue'
  name: string
  description: string
  location: string
  rating: number
  price: number
  image: string
  category: string
  phone?: string
  email?: string
}

export default function FavoritesPage() {
  const { data: session } = useSession()
  const [favorites, setFavorites] = useState<Favorite[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    // Mock favorites data - in real app, this would come from API
    const mockFavorites: Favorite[] = [
      {
        id: "fav-1",
        type: "vendor",
        name: "Royal Wedding Photography",
        description: "Professional wedding photography capturing your precious moments with artistic flair.",
        location: "Colombo",
        rating: 4.8,
        price: 75000,
        image: "/images/royal-photo-1.jpg",
        category: "Photography",
        phone: "+94 77 444 4441",
        email: "royal@photography.lk"
      },
      {
        id: "fav-2",
        type: "venue",
        name: "Garden Paradise Resort",
        description: "Beautiful outdoor venue surrounded by lush gardens and tropical plants.",
        location: "Kandy",
        rating: 4.5,
        price: 180000,
        image: "/images/garden-paradise-1.jpg",
        category: "Venue",
        phone: "+94 77 444 4442",
        email: "info@gardenparadise.lk"
      },
      {
        id: "fav-3",
        type: "vendor",
        name: "Spice Garden Catering",
        description: "Authentic Sri Lankan cuisine with international options for your special day.",
        location: "Kandy",
        rating: 4.7,
        price: 85000,
        image: "/images/spice-garden-1.jpg",
        category: "Catering",
        phone: "+94 77 444 4443",
        email: "spice@catering.lk"
      }
    ]

    setTimeout(() => {
      setFavorites(mockFavorites)
      setLoading(false)
    }, 1000)
  }, [])

  const removeFavorite = (id: string) => {
    setFavorites(favorites.filter(fav => fav.id !== id))
  }

  if (loading) {
    return (
      <div className="container mx-auto p-6">
        <div className="flex items-center justify-center h-64">
          <div className="text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-pink-500 mx-auto mb-4"></div>
            <p className="text-gray-600">Loading your favorites...</p>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="container mx-auto p-6">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900 mb-2">My Favorites</h1>
        <p className="text-gray-600">Your saved vendors and venues for your special day</p>
      </div>

      {favorites.length === 0 ? (
        <Card>
          <CardContent className="text-center py-12">
            <Heart className="h-16 w-16 text-gray-300 mx-auto mb-4" />
            <h3 className="text-xl font-semibold text-gray-900 mb-2">No favorites yet</h3>
            <p className="text-gray-600 mb-6">Start exploring vendors and venues to add them to your favorites!</p>
            <Button asChild>
              <a href="/vendors">Explore Vendors</a>
            </Button>
          </CardContent>
        </Card>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {favorites.map((favorite) => (
            <Card key={favorite.id} className="overflow-hidden hover:shadow-lg transition-shadow">
              <div className="relative">
                <img
                  src={favorite.image}
                  alt={favorite.name}
                  className="w-full h-48 object-cover"
                />
                <Badge className="absolute top-3 left-3 bg-pink-500 text-white">
                  {favorite.type === 'vendor' ? 'Vendor' : 'Venue'}
                </Badge>
                <Button
                  variant="ghost"
                  size="sm"
                  className="absolute top-3 right-3 bg-white/80 hover:bg-white"
                  onClick={() => removeFavorite(favorite.id)}
                >
                  <Heart className="h-4 w-4 fill-red-500 text-red-500" />
                </Button>
              </div>
              
              <CardHeader>
                <CardTitle className="text-lg">{favorite.name}</CardTitle>
                <CardDescription className="line-clamp-2">
                  {favorite.description}
                </CardDescription>
              </CardHeader>
              
              <CardContent>
                <div className="space-y-3">
                  <div className="flex items-center text-sm text-gray-600">
                    <MapPin className="h-4 w-4 mr-2" />
                    {favorite.location}
                  </div>
                  
                  <div className="flex items-center text-sm text-gray-600">
                    <Star className="h-4 w-4 mr-2 fill-yellow-400 text-yellow-400" />
                    {favorite.rating} ({favorite.category})
                  </div>
                  
                  <div className="text-lg font-semibold text-pink-600">
                    From {formatCurrency(favorite.price)}
                  </div>
                  
                  {favorite.phone && (
                    <div className="flex items-center text-sm text-gray-600">
                      <Phone className="h-4 w-4 mr-2" />
                      {favorite.phone}
                    </div>
                  )}
                  
                  {favorite.email && (
                    <div className="flex items-center text-sm text-gray-600">
                      <Mail className="h-4 w-4 mr-2" />
                      {favorite.email}
                    </div>
                  )}
                  
                  <div className="flex gap-2 pt-2">
                    <Button size="sm" className="flex-1">
                      View Details
                    </Button>
                    <Button size="sm" variant="outline">
                      Contact
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </div>
  )
}
