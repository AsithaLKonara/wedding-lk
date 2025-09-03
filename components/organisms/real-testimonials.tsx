"use client"

import { useState, useEffect } from 'react'
import { Card, CardContent } from '@/components/ui/card'
import { Star, Quote } from 'lucide-react'

interface Testimonial {
  _id: string
  content: string
  rating: number
  user: {
    name: string
    avatar?: string
  }
  vendor?: {
    name: string
    businessName: string
  }
  venue?: {
    name: string
  }
  createdAt: string
}

export default function RealTestimonials() {
  const [testimonials, setTestimonials] = useState<Testimonial[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetchTestimonials()
  }, [])

  const fetchTestimonials = async () => {
    try {
      const response = await fetch('/api/home/testimonials')
      if (response.ok) {
        const data = await response.json()
        setTestimonials(data.testimonials)
      }
    } catch (error) {
      console.error('Failed to fetch testimonials:', error)
    } finally {
      setLoading(false)
    }
  }

  if (loading) {
    return (
      <section className="py-16 bg-white">
        <div className="container mx-auto px-4">
          <div className="text-center">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-pink-600 mx-auto"></div>
            <p className="mt-4 text-gray-600">Loading testimonials...</p>
          </div>
        </div>
      </section>
    )
  }

  if (!testimonials || testimonials.length === 0) {
    return (
      <section className="py-16 bg-white">
        <div className="container mx-auto px-4">
          <div className="text-center text-gray-600">
            <p>No testimonials available at the moment</p>
          </div>
        </div>
      </section>
    )
  }

  return (
    <section className="py-16 bg-white">
      <div className="container mx-auto px-4">
        <div className="text-center mb-12">
          <h2 className="text-3xl font-bold text-gray-900 mb-4">
            What Our Couples Say
          </h2>
          <p className="text-lg text-gray-600 max-w-2xl mx-auto">
            Real stories from happy couples who found their perfect wedding vendors and venues
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {testimonials.map((testimonial) => (
            <Card key={testimonial._id} className="hover:shadow-lg transition-shadow duration-300">
              <CardContent className="pt-6">
                <div className="flex items-center mb-4">
                  <Quote className="h-8 w-8 text-pink-200" />
                  <div className="flex items-center ml-2">
                    {[...Array(5)].map((_, i) => (
                      <Star
                        key={i}
                        className={`h-4 w-4 ${
                          i < testimonial.rating
                            ? 'text-yellow-500 fill-current'
                            : 'text-gray-300'
                        }`}
                      />
                    ))}
                  </div>
                </div>

                <blockquote className="text-gray-700 mb-4 italic">
                  "{testimonial.content}"
                </blockquote>

                <div className="flex items-center justify-between">
                  <div>
                    <p className="font-medium text-gray-900">{testimonial.user.name}</p>
                    {testimonial.vendor && (
                      <p className="text-sm text-gray-600">
                        Booked with {testimonial.vendor.businessName}
                      </p>
                    )}
                    {testimonial.venue && (
                      <p className="text-sm text-gray-600">
                        Venue: {testimonial.venue.name}
                      </p>
                    )}
                  </div>
                  <div className="text-xs text-gray-500">
                    {new Date(testimonial.createdAt).toLocaleDateString()}
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        <div className="text-center mt-12">
          <div className="inline-flex items-center space-x-2 bg-pink-50 text-pink-700 px-4 py-2 rounded-full">
            <Star className="h-4 w-4 fill-current" />
            <span className="text-sm font-medium">
              Join {testimonials.length}+ happy couples
            </span>
          </div>
        </div>
      </div>
    </section>
  )
} 