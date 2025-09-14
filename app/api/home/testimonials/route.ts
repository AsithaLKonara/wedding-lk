import { NextRequest, NextResponse } from "next/server"
import { connectDB } from "@/lib/db"
import Testimonial from "@/lib/models/testimonial"

export async function GET(request: NextRequest) {
  try {
    await connectDB()

    // Get featured testimonials
    const testimonials = await Testimonial.find({ 
      featured: true, 
      isActive: true,
      rating: { $gte: 4 }
    })
      .sort({ rating: -1, createdAt: -1 })
      .limit(8)
      .lean()

    // If no testimonials found, return empty array instead of error
    if (!testimonials || testimonials.length === 0) {
      return NextResponse.json({ 
        success: true,
        testimonials: [] 
      })
    }

    // Format testimonials for display
    const formattedTestimonials = testimonials.map(testimonial => ({
      id: testimonial._id,
      name: testimonial.name,
      location: testimonial.location,
      rating: testimonial.rating,
      text: testimonial.text,
      weddingDate: testimonial.weddingDate,
      venue: testimonial.venue,
      vendor: testimonial.vendor,
      isVerified: testimonial.isVerified,
      date: testimonial.createdAt
    }))

    return NextResponse.json({ 
      success: true,
      testimonials: formattedTestimonials 
    })

  } catch (error) {
    console.error("Error fetching testimonials:", error)
    // Return empty array instead of error to prevent frontend crashes
    return NextResponse.json({ 
      success: true,
      testimonials: [] 
    })
  }
} 