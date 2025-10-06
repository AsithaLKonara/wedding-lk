'use client'


import { useState, Suspense } from 'react'
import { useSearchParams } from 'next/navigation'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Star, Upload, X } from 'lucide-react'
import { toast } from 'sonner'

interface ReviewForm {
  title: string
  content: string
  rating: number
  vendorId?: string
  venueId?: string
  packageId?: string
  images: File[]
  isAnonymous: boolean
}

function WriteReviewContent() {
  const searchParams = useSearchParams()
  const [formData, setFormData] = useState<ReviewForm>({
    title: '',
    content: '',
    rating: 0,
    vendorId: searchParams.get('vendorId') || undefined,
    venueId: searchParams.get('venueId') || undefined,
    packageId: searchParams.get('packageId') || undefined,
    images: [],
    isAnonymous: false
  })
  const [submitting, setSubmitting] = useState(false)
  const [hoveredRating, setHoveredRating] = useState(0)

  const handleInputChange = (field: keyof ReviewForm, value: any) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }))
  }

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(e.target.files || [])
    setFormData(prev => ({
      ...prev,
      images: [...prev.images, ...files]
    }))
  }

  const removeImage = (index: number) => {
    setFormData(prev => ({
      ...prev,
      images: prev.images.filter((_, i) => i !== index)
    }))
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setSubmitting(true)

    try {
      const formDataToSend = new FormData()
      formDataToSend.append('title', formData.title)
      formDataToSend.append('content', formData.content)
      formDataToSend.append('rating', formData.rating.toString())
      formDataToSend.append('isAnonymous', formData.isAnonymous.toString())
      
      if (formData.vendorId) formDataToSend.append('vendorId', formData.vendorId)
      if (formData.venueId) formDataToSend.append('venueId', formData.venueId)
      if (formData.packageId) formDataToSend.append('packageId', formData.packageId)
      
      formData.images.forEach((image, index) => {
        formDataToSend.append(`images`, image)
      })

      const response = await fetch('/api/reviews', {
        method: 'POST',
        body: formDataToSend
      })

      if (response.ok) {
        const review = await response.json()
        toast.success('Review submitted successfully!')
        window.location.href = `/reviews/${review._id}`
      } else {
        const error = await response.json()
        toast.error(error.message || 'Failed to submit review')
      }
    } catch (error) {
      console.error('Error submitting review:', error)
      toast.error('Failed to submit review')
    } finally {
      setSubmitting(false)
    }
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-2xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-4">Write a Review</h1>
          <p className="text-gray-600">Share your experience to help others make informed decisions</p>
        </div>

        <form onSubmit={handleSubmit}>
          <Card>
            <CardHeader>
              <CardTitle>Review Details</CardTitle>
              <CardDescription>
                Please provide honest feedback about your experience
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              {/* Rating */}
              <div>
                <Label htmlFor="rating">Overall Rating</Label>
                <div className="flex items-center space-x-1 mt-2">
                  {[1, 2, 3, 4, 5].map((star) => (
                    <button
                      key={star}
                      type="button"
                      onClick={() => handleInputChange('rating', star)}
                      onMouseEnter={() => setHoveredRating(star)}
                      onMouseLeave={() => setHoveredRating(0)}
                      className="focus:outline-none"
                    >
                      <Star
                        className={`h-8 w-8 ${
                          star <= (hoveredRating || formData.rating)
                            ? 'text-yellow-400 fill-current'
                            : 'text-gray-300'
                        }`}
                      />
                    </button>
                  ))}
                  <span className="ml-2 text-sm text-gray-600">
                    {formData.rating > 0 ? `${formData.rating} out of 5` : 'Select rating'}
                  </span>
                </div>
              </div>

              {/* Title */}
              <div>
                <Label htmlFor="title">Review Title</Label>
                <Input
                  id="title"
                  placeholder="Summarize your experience in a few words"
                  value={formData.title}
                  onChange={(e) => handleInputChange('title', e.target.value)}
                  required
                />
              </div>

              {/* Content */}
              <div>
                <Label htmlFor="content">Review Content</Label>
                <Textarea
                  id="content"
                  placeholder="Tell us about your experience in detail..."
                  value={formData.content}
                  onChange={(e) => handleInputChange('content', e.target.value)}
                  rows={6}
                  required
                />
              </div>

              {/* Images */}
              <div>
                <Label htmlFor="images">Photos (Optional)</Label>
                <div className="mt-2">
                  <input
                    id="images"
                    type="file"
                    multiple
                    accept="image/*"
                    onChange={handleImageUpload}
                    className="hidden"
                  />
                  <Button
                    type="button"
                    variant="outline"
                    onClick={() => document.getElementById('images')?.click()}
                    className="w-full"
                  >
                    <Upload className="h-4 w-4 mr-2" />
                    Upload Photos
                  </Button>
                  
                  {formData.images.length > 0 && (
                    <div className="grid grid-cols-2 md:grid-cols-3 gap-2 mt-4">
                      {formData.images.map((image, index) => (
                        <div key={index} className="relative">
                          <img
                            src={URL.createObjectURL(image)}
                            alt={`Preview ${index + 1}`}
                            className="w-full h-24 object-cover rounded-lg"
                          />
                          <button
                            type="button"
                            onClick={() => removeImage(index)}
                            className="absolute -top-2 -right-2 bg-red-500 text-white rounded-full p-1 hover:bg-red-600"
                          >
                            <X className="h-3 w-3" />
                          </button>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              </div>

              {/* Anonymous Option */}
              <div className="flex items-center space-x-2">
                <input
                  id="anonymous"
                  type="checkbox"
                  checked={formData.isAnonymous}
                  onChange={(e) => handleInputChange('isAnonymous', e.target.checked)}
                  className="rounded border-gray-300"
                />
                <Label htmlFor="anonymous">Submit anonymously</Label>
              </div>

              {/* Submit Button */}
              <div className="flex space-x-4">
                <Button
                  type="submit"
                  disabled={submitting || formData.rating === 0}
                  className="flex-1"
                >
                  {submitting ? 'Submitting...' : 'Submit Review'}
                </Button>
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => window.history.back()}
                >
                  Cancel
                </Button>
              </div>
            </CardContent>
          </Card>
        </form>
      </div>
    </div>
  )
}



