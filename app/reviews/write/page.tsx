"use client"

import { useState } from 'react'
import { MainLayout } from "@/components/templates/main-layout"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Star } from "lucide-react"

export default function WriteReviewPage() {
  const [formData, setFormData] = useState({
    venueId: '',
    rating: 5,
    review: '',
    name: '',
    email: ''
  })

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    // Handle review submission
    console.log('Submitting review:', formData)
  }

  const handleRatingChange = (rating: number) => {
    setFormData({...formData, rating})
  }

  return (
    <MainLayout>
      <div className="min-h-screen bg-gray-50 dark:bg-gray-900 py-8">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8 max-w-2xl">
          <Card>
            <CardHeader>
              <CardTitle className="text-2xl font-bold text-center">Write a Review</CardTitle>
              <p className="text-center text-gray-600 dark:text-gray-400">
                Share your experience to help other couples
              </p>
            </CardHeader>
            <CardContent>
              <form onSubmit={handleSubmit} className="space-y-6">
                {/* Venue Selection */}
                <div>
                  <Label htmlFor="venueId">Select Venue/Vendor</Label>
                  <Select value={formData.venueId} onValueChange={(value) => setFormData({...formData, venueId: value})}>
                    <SelectTrigger>
                      <SelectValue placeholder="Choose a venue or vendor" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="1">Royal Garden Hotel</SelectItem>
                      <SelectItem value="2">Beach Paradise Resort</SelectItem>
                      <SelectItem value="3">Elegant Photography</SelectItem>
                      <SelectItem value="4">Blissful Blooms</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                {/* Rating */}
                <div>
                  <Label className="text-base font-medium">Rating</Label>
                  <div className="flex space-x-1 mt-2">
                    {[1, 2, 3, 4, 5].map((star) => (
                      <button
                        key={star}
                        type="button"
                        onClick={() => handleRatingChange(star)}
                        className="focus:outline-none"
                      >
                        <Star
                          className={`h-8 w-8 ${
                            star <= formData.rating
                              ? 'text-yellow-400 fill-current'
                              : 'text-gray-300'
                          }`}
                        />
                      </button>
                    ))}
                  </div>
                  <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">
                    {formData.rating} star{formData.rating !== 1 ? 's' : ''}
                  </p>
                </div>

                {/* Review Text */}
                <div>
                  <Label htmlFor="review">Your Review</Label>
                  <Textarea
                    id="review"
                    placeholder="Tell us about your experience..."
                    value={formData.review}
                    onChange={(e) => setFormData({...formData, review: e.target.value})}
                    rows={6}
                    required
                  />
                </div>

                {/* Name */}
                <div>
                  <Label htmlFor="name">Your Name</Label>
                  <Input
                    id="name"
                    type="text"
                    placeholder="John Doe"
                    value={formData.name}
                    onChange={(e) => setFormData({...formData, name: e.target.value})}
                    required
                  />
                </div>

                {/* Email */}
                <div>
                  <Label htmlFor="email">Email Address</Label>
                  <Input
                    id="email"
                    type="email"
                    placeholder="john@example.com"
                    value={formData.email}
                    onChange={(e) => setFormData({...formData, email: e.target.value})}
                    required
                  />
                </div>

                {/* Submit Button */}
                <Button type="submit" className="w-full bg-blue-600 hover:bg-blue-700">
                  Submit Review
                </Button>
              </form>
            </CardContent>
          </Card>
        </div>
      </div>
    </MainLayout>
  )
}
