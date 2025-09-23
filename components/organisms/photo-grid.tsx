"use client"

import { useState } from "react"
import { X, ZoomIn } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"

interface PhotoGridProps {
  category: string
  venue: string
}

export default function PhotoGrid({ category, venue }: PhotoGridProps) {
  const [selectedPhoto, setSelectedPhoto] = useState<{
    id: number
    src: string
    alt: string
    category: string
    venue: string
  } | null>(null)

  // Mock photo data
  const photos = [
    {
      id: 1,
      src: "https://images.unsplash.com/photo-1519741497674-611481863552?w=800&h=600&fit=crop",
      alt: "Beautiful wedding ceremony",
      category: "ceremony",
      venue: "hotel",
    },
    {
      id: 2,
      src: "https://images.unsplash.com/photo-1511285560929-80b456fea0bc?w=800&h=600&fit=crop",
      alt: "Wedding reception",
      category: "reception",
      venue: "garden",
    },
    {
      id: 3,
      src: "https://images.unsplash.com/photo-1465495976277-4387d4b0e4a6?w=800&h=600&fit=crop",
      alt: "Pre-wedding photos",
      category: "pre-wedding",
      venue: "beach",
    },
    {
      id: 4,
      src: "https://images.unsplash.com/photo-1519741497674-611481863552?w=800&h=600&fit=crop",
      alt: "Engagement photos",
      category: "engagement",
      venue: "traditional",
    },
    {
      id: 5,
      src: "https://images.unsplash.com/photo-1511285560929-80b456fea0bc?w=800&h=600&fit=crop",
      alt: "Wedding ceremony",
      category: "ceremony",
      venue: "hotel",
    },
    {
      id: 6,
      src: "https://images.unsplash.com/photo-1465495976277-4387d4b0e4a6?w=800&h=600&fit=crop",
      alt: "Reception party",
      category: "reception",
      venue: "garden",
    },
    {
      id: 7,
      src: "https://images.unsplash.com/photo-1606800052052-a08af7148866?w=800&h=600&fit=crop",
      alt: "Wedding decorations",
      category: "decorations",
      venue: "indoor",
    },
    {
      id: 8,
      src: "https://images.unsplash.com/photo-1594736797933-d0401ba2fe65?w=800&h=600&fit=crop",
      alt: "Wedding cake",
      category: "reception",
      venue: "hotel",
    },
    {
      id: 9,
      src: "https://images.unsplash.com/photo-1519225421980-715cb0215aed?w=800&h=600&fit=crop",
      alt: "Bridal party",
      category: "ceremony",
      venue: "outdoor",
    },
  ]

  // Filter photos based on selected category and venue
  const filteredPhotos = photos.filter((photo) => {
    const categoryMatch = category === "all" || photo.category === category
    const venueMatch = venue === "all" || photo.venue === venue
    return categoryMatch && venueMatch
  })

  const openModal = (photo: typeof photos[0]) => {
    setSelectedPhoto(photo)
  }

  const closeModal = () => {
    setSelectedPhoto(null)
  }

  return (
    <>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredPhotos.map((photo) => (
          <div
            key={photo.id}
            className="group relative overflow-hidden rounded-lg shadow-lg hover:shadow-xl transition-all duration-300 cursor-pointer"
            onClick={() => openModal(photo)}
          >
            <img
              src={photo.src}
              alt={photo.alt}
              className="w-full h-64 object-cover group-hover:scale-105 transition-transform duration-300"
            />
            <div className="absolute inset-0 bg-black bg-opacity-0 group-hover:bg-opacity-30 transition-all duration-300 flex items-center justify-center">
              <div className="opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                <Button
                  variant="secondary"
                  size="sm"
                  className="bg-white/90 text-gray-900 hover:bg-white"
                >
                  <ZoomIn className="w-4 h-4 mr-2" />
                  View Full Size
                </Button>
              </div>
            </div>
            <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/60 to-transparent p-4">
              <p className="text-white text-sm font-medium">{photo.alt}</p>
              <p className="text-white/80 text-xs capitalize">
                {photo.category} • {photo.venue}
              </p>
            </div>
          </div>
        ))}
        
        {filteredPhotos.length === 0 && (
          <div className="col-span-full text-center py-12">
            <p className="text-gray-500 dark:text-gray-400 text-lg">
              No photos found for the selected filters.
            </p>
          </div>
        )}
      </div>

      {/* Full Size Image Modal */}
      <Dialog open={!!selectedPhoto} onOpenChange={closeModal}>
        <DialogContent className="max-w-4xl max-h-[90vh] p-0">
          <DialogHeader className="p-6 pb-0">
            <DialogTitle className="text-lg font-semibold">
              {selectedPhoto?.alt}
            </DialogTitle>
          </DialogHeader>
          <div className="relative">
            {selectedPhoto && (
              <img
                src={selectedPhoto.src}
                alt={selectedPhoto.alt}
                className="w-full h-auto max-h-[70vh] object-contain"
              />
            )}
            <Button
              variant="outline"
              size="icon"
              className="absolute top-4 right-4 bg-white/90 hover:bg-white"
              onClick={closeModal}
            >
              <X className="w-4 h-4" />
            </Button>
          </div>
          {selectedPhoto && (
            <div className="p-6 pt-0">
              <div className="flex items-center justify-between text-sm text-gray-600">
                <span className="capitalize">{selectedPhoto.category}</span>
                <span className="capitalize">{selectedPhoto.venue}</span>
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </>
  )
}