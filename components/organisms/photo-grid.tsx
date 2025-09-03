"use client"

import { useState, useEffect } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { Heart, Share2, Download, Eye, Calendar, MapPin, X, Loader2 } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Dialog, DialogContent } from "@/components/ui/dialog"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"

interface Photo {
  id: string
  url: string
  title: string
  category: string
  venue: string
  venueId: string
  photographer: string
  photographerAvatar: string
  date: string
  likes: number
  views: number
  isLiked: boolean
  tags: string[]
  description: string
  postId?: string
}

interface PhotoGridProps {
  category: string
  venue: string
}



export function PhotoGrid({ category, venue }: PhotoGridProps) {
  const [photos, setPhotos] = useState<Photo[]>([])
  const [selectedPhoto, setSelectedPhoto] = useState<Photo | null>(null)
  const [loading, setLoading] = useState(true)

  // Fetch photos from API
  useEffect(() => {
    const fetchPhotos = async () => {
      try {
        setLoading(true)
        const params = new URLSearchParams({
          category,
          venue,
          limit: '50'
        })
        
        const response = await fetch(`/api/gallery?${params}`)
        if (response.ok) {
          const data = await response.json()
          setPhotos(data.data || [])
        }
      } catch (error) {
        console.error('Error fetching gallery photos:', error)
      } finally {
        setLoading(false)
      }
    }

    fetchPhotos()
  }, [category, venue])

  // Filter photos based on category and venue (client-side filtering for additional precision)
  const filteredPhotos = photos.filter((photo) => {
    const categoryMatch = category === "all" || photo.category === category
    const venueMatch = venue === "all" || photo.venue.toLowerCase().includes(venue.toLowerCase())
    return categoryMatch && venueMatch
  })

  const toggleLike = (photoId: string) => {
    setPhotos((prev) =>
      prev.map((photo) =>
        photo.id === photoId
          ? { ...photo, isLiked: !photo.isLiked, likes: photo.isLiked ? photo.likes - 1 : photo.likes + 1 }
          : photo,
      ),
    )
  }

  const openPhoto = (photo: Photo) => {
    setSelectedPhoto(photo)
    // Increment view count
    setPhotos((prev) => prev.map((p) => (p.id === photo.id ? { ...p, views: p.views + 1 } : p)))
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center py-20">
        <Loader2 className="h-8 w-8 animate-spin text-rose-500" />
        <span className="ml-2 text-gray-600">Loading gallery photos...</span>
      </div>
    )
  }

  return (
    <>
      <div className="space-y-6">
        {/* Results Count */}
        <div className="flex items-center justify-between">
          <p className="text-gray-600">
            Showing {filteredPhotos.length} photos
            {category !== "all" && ` in ${category}`}
            {venue !== "all" && ` from selected venue`}
          </p>
        </div>

        {/* Photo Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          <AnimatePresence>
            {filteredPhotos.map((photo, index) => (
              <motion.div
                key={photo.id}
                layout
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.9 }}
                transition={{ duration: 0.3, delay: index * 0.05 }}
                className="group relative bg-white rounded-xl overflow-hidden shadow-md hover:shadow-xl transition-all duration-300"
              >
                {/* Photo */}
                <div className="relative aspect-[3/4] overflow-hidden cursor-pointer" onClick={() => openPhoto(photo)}>
                  <img
                    src={photo.url || "/placeholder.svg"}
                    alt={photo.title}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                  />

                  {/* Overlay */}
                  <div className="absolute inset-0 bg-black/0 group-hover:bg-black/20 transition-all duration-300" />

                  {/* View Count */}
                  <div className="absolute top-3 right-3 bg-black/50 text-white px-2 py-1 rounded-full text-xs flex items-center gap-1">
                    <Eye className="h-3 w-3" />
                    {photo.views}
                  </div>

                  {/* Category Badge */}
                  <div className="absolute top-3 left-3">
                    <Badge variant="secondary" className="bg-white/90 text-gray-800">
                      {photo.category}
                    </Badge>
                  </div>
                </div>

                {/* Photo Info */}
                <div className="p-4">
                  <h3 className="font-semibold text-gray-900 mb-2 line-clamp-2">{photo.title}</h3>

                  <div className="flex items-center gap-2 text-sm text-gray-600 mb-3">
                    <Avatar className="h-6 w-6">
                      <AvatarImage src={photo.photographerAvatar || "/placeholder.svg"} />
                      <AvatarFallback>{photo.photographer[0]}</AvatarFallback>
                    </Avatar>
                    <span>{photo.photographer}</span>
                  </div>

                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <button
                        onClick={() => toggleLike(photo.id)}
                        className={`flex items-center gap-1 text-sm transition-colors ${
                          photo.isLiked ? "text-rose-500" : "text-gray-500 hover:text-rose-500"
                        }`}
                      >
                        <Heart className={`h-4 w-4 ${photo.isLiked ? "fill-current" : ""}`} />
                        {photo.likes}
                      </button>

                      <button className="flex items-center gap-1 text-sm text-gray-500 hover:text-gray-700">
                        <Share2 className="h-4 w-4" />
                      </button>
                    </div>

                    <span className="text-xs text-gray-500">{new Date(photo.date).toLocaleDateString()}</span>
                  </div>
                </div>
              </motion.div>
            ))}
          </AnimatePresence>
        </div>

        {/* Empty State */}
        {filteredPhotos.length === 0 && (
          <div className="text-center py-12">
            <div className="text-gray-400 mb-4">
              <Eye className="h-12 w-12 mx-auto" />
            </div>
            <h3 className="text-lg font-semibold text-gray-900 mb-2">No photos found</h3>
            <p className="text-gray-600">Try adjusting your filters to see more photos</p>
          </div>
        )}
      </div>

      {/* Photo Modal */}
      <Dialog open={!!selectedPhoto} onOpenChange={() => setSelectedPhoto(null)}>
        <DialogContent className="max-w-4xl w-full p-0">
          {selectedPhoto && (
            <div className="flex flex-col lg:flex-row">
              {/* Photo */}
              <div className="flex-1 relative">
                <img
                  src={selectedPhoto.url || "/placeholder.svg"}
                  alt={selectedPhoto.title}
                  className="w-full h-[60vh] lg:h-[80vh] object-cover"
                />
              </div>

              {/* Photo Details */}
              <div className="w-full lg:w-80 p-6 space-y-4">
                <div className="flex items-start justify-between">
                  <h2 className="text-xl font-bold text-gray-900">{selectedPhoto.title}</h2>
                  <Button variant="ghost" size="sm" onClick={() => setSelectedPhoto(null)}>
                    <X className="h-4 w-4" />
                  </Button>
                </div>

                <div className="flex items-center gap-3">
                  <Avatar>
                    <AvatarImage src={selectedPhoto.photographerAvatar || "/placeholder.svg"} />
                    <AvatarFallback>{selectedPhoto.photographer[0]}</AvatarFallback>
                  </Avatar>
                  <div>
                    <p className="font-medium">{selectedPhoto.photographer}</p>
                    <p className="text-sm text-gray-600">Photographer</p>
                  </div>
                </div>

                <p className="text-gray-700">{selectedPhoto.description}</p>

                <div className="space-y-2">
                  <div className="flex items-center gap-2 text-sm text-gray-600">
                    <MapPin className="h-4 w-4" />
                    <span>Venue: {selectedPhoto.venue}</span>
                  </div>
                  <div className="flex items-center gap-2 text-sm text-gray-600">
                    <Calendar className="h-4 w-4" />
                    <span>{new Date(selectedPhoto.date).toLocaleDateString()}</span>
                  </div>
                  <div className="flex items-center gap-2 text-sm text-gray-600">
                    <Eye className="h-4 w-4" />
                    <span>{selectedPhoto.views} views</span>
                  </div>
                </div>

                <div className="flex flex-wrap gap-2">
                  {selectedPhoto.tags.map((tag) => (
                    <Badge key={tag} variant="outline">
                      {tag}
                    </Badge>
                  ))}
                </div>

                <div className="flex items-center gap-2 pt-4 border-t">
                  <Button
                    variant={selectedPhoto.isLiked ? "default" : "outline"}
                    size="sm"
                    onClick={() => toggleLike(selectedPhoto.id)}
                    className="flex-1"
                  >
                    <Heart className={`h-4 w-4 mr-2 ${selectedPhoto.isLiked ? "fill-current" : ""}`} />
                    {selectedPhoto.likes}
                  </Button>
                  <Button variant="outline" size="sm">
                    <Share2 className="h-4 w-4" />
                  </Button>
                  <Button variant="outline" size="sm">
                    <Download className="h-4 w-4" />
                  </Button>
                </div>
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </>
  )
}


export default PhotoGrid
