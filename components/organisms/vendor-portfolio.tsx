"use client"

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { ChevronLeft, ChevronRight } from "lucide-react"
import { useState } from "react"
import Image from "next/image"

interface VendorPortfolioProps {
  images: string[]
  vendorName: string
}

export function VendorPortfolio({ images, vendorName }: VendorPortfolioProps) {
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
            <Image
              src={images[currentIndex]}
              alt={`${vendorName} portfolio image ${currentIndex + 1}`}
              className="w-full h-full object-cover"
              fill
            />
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
              className="aspect-square bg-gray-100 dark:bg-gray-800 rounded overflow-hidden"
              onClick={() => setCurrentIndex(index)}
            >
              <img
                src={image}
                alt={`${vendorName} thumbnail ${index + 1}`}
                className="w-full h-full object-cover hover:opacity-75 transition-opacity"
              />
            </button>
          ))}
        </div>
      </CardContent>
    </Card>
  )
}


export default VendorPortfolio
