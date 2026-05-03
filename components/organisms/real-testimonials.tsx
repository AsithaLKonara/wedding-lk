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
      <section className="py-24 bg-background">
        <div className="container mx-auto px-4">
          <div className="flex flex-col items-center justify-center space-y-4">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-rose-500"></div>
            <p className="text-muted-foreground animate-pulse">Reading love stories...</p>
          </div>
        </div>
      </section>
    )
  }

  if (!testimonials || testimonials.length === 0) {
    return (
      <section className="py-24 bg-background">
        <div className="container mx-auto px-4 text-center">
          <div className="max-w-md mx-auto p-8 rounded-2xl border border-dashed border-muted-foreground/20">
            <p className="text-muted-foreground italic">No testimonials available at the moment. Be the first to share your story!</p>
          </div>
        </div>
      </section>
    )
  }

  return (
    <section className="py-24 bg-background relative overflow-hidden">
      {/* Decorative elements */}
      <div className="absolute top-1/2 left-0 -translate-y-1/2 -translate-x-1/2 w-64 h-64 bg-rose-500/10 rounded-full blur-3xl" />
      <div className="absolute top-1/2 right-0 -translate-y-1/2 translate-x-1/2 w-64 h-64 bg-purple-500/10 rounded-full blur-3xl" />

      <div className="container mx-auto px-4 relative z-10">
        <div className="text-center mb-16">
          <h2 className="text-4xl md:text-5xl font-bold mb-6 tracking-tight">
            What Our <span className="gradient-text">Couples Say</span>
          </h2>
          <p className="text-xl text-muted-foreground max-w-2xl mx-auto leading-relaxed">
            Real stories from happy couples who found their perfect wedding vendors and venues
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {testimonials.map((testimonial) => (
            <Card key={testimonial._id} className="group hover:shadow-2xl transition-all duration-500 border-border/50 bg-card/50 backdrop-blur-sm relative overflow-hidden">
              <div className="absolute top-0 left-0 w-1 h-full bg-gradient-to-b from-rose-500 to-purple-600 opacity-0 group-hover:opacity-100 transition-opacity" />
              
              <CardContent className="pt-10 pb-8 px-8">
                <div className="mb-8 relative">
                  <Quote className="h-12 w-12 text-rose-500/10 absolute -top-4 -left-4" />
                  <div className="flex items-center space-x-1 mb-4">
                    {[...Array(5)].map((_, i) => (
                      <Star
                        key={i}
                        className={`h-4 w-4 ${
                          i < testimonial.rating
                            ? 'text-yellow-400 fill-current'
                            : 'text-muted'
                        }`}
                      />
                    ))}
                  </div>
                  <blockquote className="text-lg text-foreground/90 font-medium leading-relaxed italic relative z-10">
                    "{testimonial.content}"
                  </blockquote>
                </div>

                <div className="flex items-center space-x-4">
                  <div className="h-12 w-12 rounded-full bg-gradient-to-br from-rose-100 to-purple-100 flex items-center justify-center border-2 border-white dark:border-gray-800 shadow-sm overflow-hidden">
                    {testimonial.user.avatar ? (
                      <img src={testimonial.user.avatar} alt={testimonial.user.name} className="w-full h-full object-cover" />
                    ) : (
                      <span className="text-rose-500 font-bold">{testimonial.user.name.charAt(0)}</span>
                    )}
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="font-bold text-foreground truncate">{testimonial.user.name}</p>
                    <div className="flex flex-col space-y-0.5">
                      {testimonial.vendor && (
                        <p className="text-xs font-medium text-muted-foreground">
                          Booked <span className="text-rose-500">{testimonial.vendor.businessName}</span>
                        </p>
                      )}
                      {testimonial.venue && (
                        <p className="text-xs font-medium text-muted-foreground">
                          At <span className="text-purple-500">{testimonial.venue.name}</span>
                        </p>
                      )}
                    </div>
                  </div>
                </div>

                <div className="mt-6 pt-6 border-t border-border/50 flex items-center justify-between text-[10px] font-bold text-muted-foreground uppercase tracking-widest">
                  <span>Verified Couple</span>
                  <span>{new Date(testimonial.createdAt).toLocaleDateString(undefined, { month: 'short', year: 'numeric' })}</span>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        <div className="text-center mt-20">
          <div className="inline-flex items-center space-x-3 bg-rose-500/5 text-rose-500 px-8 py-4 rounded-full border border-rose-500/10 backdrop-blur-sm">
            <Star className="h-5 w-5 fill-current animate-pulse" />
            <span className="text-base font-bold">
              Join {testimonials.length}+ happy couples
            </span>
          </div>
        </div>
      </div>
    </section>
  )
}
 