"use client"

import { useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { ChevronLeft, ChevronRight, Expand } from "lucide-react"
import Image from "next/image"

interface VenueGalleryProps {
  images: string[]
}

export function VenueGallery({ images }: VenueGalleryProps) {
  const [currentImage, setCurrentImage] = useState(0)

  const nextImage = () => {
    setCurrentImage((prev) => (prev + 1) % images.length)
  }

  const prevImage = () => {
    setCurrentImage((prev) => (prev - 1 + images.length) % images.length)
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Photo Gallery</CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        {/* Main Image */}
        <div className="relative h-96 rounded-lg overflow-hidden">
          <Image
            src={images[currentImage] || "/placeholder.svg?height=400&width=600"}
            alt={`Gallery image ${currentImage + 1}`}
            fill
            className="object-cover"
          />

          {/* Navigation Buttons */}
          <Button
            variant="secondary"
            size="sm"
            className="absolute left-2 top-1/2 transform -translate-y-1/2 bg-white/90 hover:bg-white"
            onClick={prevImage}
          >
            <ChevronLeft className="h-4 w-4" />
          </Button>
          <Button
            variant="secondary"
            size="sm"
            className="absolute right-2 top-1/2 transform -translate-y-1/2 bg-white/90 hover:bg-white"
            onClick={nextImage}
          >
            <ChevronRight className="h-4 w-4" />
          </Button>

          {/* Expand Button */}
          <Button variant="secondary" size="sm" className="absolute top-2 right-2 bg-white/90 hover:bg-white">
            <Expand className="h-4 w-4" />
          </Button>

          {/* Image Counter */}
          <div className="absolute bottom-2 right-2 bg-black/60 text-white px-2 py-1 rounded text-sm">
            {currentImage + 1} / {images.length}
          </div>
        </div>

        {/* Thumbnail Grid */}
        <div className="grid grid-cols-4 md:grid-cols-6 gap-2">
          {images.map((image, index) => (
            <button
              key={index}
              onClick={() => setCurrentImage(index)}
              className={`relative h-20 rounded-lg overflow-hidden ${
                currentImage === index ? "ring-2 ring-purple-500" : ""
              }`}
            >
              <Image
                src={image || "/placeholder.svg?height=80&width=120"}
                alt={`Thumbnail ${index + 1}`}
                fill
                className="object-cover hover:opacity-80 transition-opacity"
              />
            </button>
          ))}
        </div>
      </CardContent>
    </Card>
  )
}


export default VenueGallery;
