"use client"

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { ChevronLeft, ChevronRight, Image as ImageIcon } from "lucide-react"
import { useState, Suspense, lazy } from "react"
import dynamic from 'next/dynamic'

// Lazy load the heavy image component
const OptimizedImage = dynamic(() => import('./optimized-image'), {
  loading: () => <ImageSkeleton />,
  ssr: false
})

interface VendorPortfolioProps {
  images: string[]
  vendorName: string
}

function ImageSkeleton() {
  return (
    <div className="aspect-video bg-gray-100 dark:bg-gray-800 rounded-lg animate-pulse flex items-center justify-center">
      <ImageIcon className="h-12 w-12 text-gray-400" />
    </div>
  )
}

export function LazyVendorPortfolio({ images, vendorName }: VendorPortfolioProps) {
  const [currentIndex, setCurrentIndex] = useState(0)

  // Handle empty images array
  if (!images || images.length === 0) {
    return (
      <Card className="mb-8">
        <CardHeader>
          <CardTitle>Portfolio</CardTitle>
          <CardDescription>View our latest work and projects</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="text-center py-8 text-gray-500">
            No portfolio images available
          </div>
        </CardContent>
      </Card>
    )
  }

  const nextImage = () => {
    setCurrentIndex((prev) => (prev + 1) % images.length)
  }

  const prevImage = () => {
    setCurrentIndex((prev) => (prev - 1 + images.length) % images.length)
  }

  return (
    <Card className="mb-8">
      <CardHeader>
        <CardTitle>Portfolio</CardTitle>
        <CardDescription>View our latest work and projects</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="relative">
          <div className="aspect-video bg-gray-100 dark:bg-gray-800 rounded-lg overflow-hidden">
            <Suspense fallback={<ImageSkeleton />}>
              <OptimizedImage
                src={images[currentIndex]}
                alt={`${vendorName} portfolio image ${currentIndex + 1}`}
                priority={currentIndex === 0}
              />
            </Suspense>
          </div>
          
          {images.length > 1 && (
            <>
              <Button
                variant="outline"
                size="sm"
                className="absolute left-2 top-1/2 transform -translate-y-1/2"
                onClick={prevImage}
                aria-label="Previous image"
              >
                <ChevronLeft className="h-4 w-4" />
              </Button>
              <Button
                variant="outline"
                size="sm"
                className="absolute right-2 top-1/2 transform -translate-y-1/2"
                onClick={nextImage}
                aria-label="Next image"
              >
                <ChevronRight className="h-4 w-4" />
              </Button>
            </>
          )}
        </div>

        {images.length > 1 && (
          <div className="flex justify-center mt-4 space-x-2">
            {images.map((_: string, index: number) => (
              <button
                key={index}
                className={`w-2 h-2 rounded-full ${
                  index === currentIndex ? "bg-rose-500" : "bg-gray-300"
                }`}
                onClick={() => setCurrentIndex(index)}
              />
            ))}
          </div>
        )}

        <div className="grid grid-cols-2 md:grid-cols-4 gap-2 mt-4">
          {images.map((image: string, index: number) => (
            <button
              key={index}
              className={`aspect-square rounded-lg overflow-hidden border-2 ${
                index === currentIndex ? "border-rose-500" : "border-transparent"
              }`}
              onClick={() => setCurrentIndex(index)}
            >
              <Suspense fallback={<div className="w-full h-full bg-gray-200 animate-pulse" />}>
                <OptimizedImage
                  src={image}
                  alt={`${vendorName} portfolio thumbnail ${index + 1}`}
                  className="w-full h-full object-cover"
                  priority={false}
                />
              </Suspense>
            </button>
          ))}
        </div>
      </CardContent>
    </Card>
  )
} 