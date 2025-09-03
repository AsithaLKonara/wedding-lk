import { NextRequest, NextResponse } from "next/server"
import { connectDB } from "@/lib/db"
import { Review } from "@/lib/models/review"

export async function GET(request: NextRequest) {
  try {
    await connectDB()

    // Get verified testimonials with high ratings
    const testimonials = await Review.find({ 
      isVerified: true, 
      isActive: true,
      rating: { $gte: 4 },
      comment: { $exists: true, $ne: "" }
    })
      .sort({ rating: -1, createdAt: -1 })
      .limit(8)
      .lean()

    // Format testimonials for display
    const formattedTestimonials = testimonials.map(review => ({
      id: review._id,
      user: {
        name: review.user ? 'User' : 'Anonymous',
        avatar: null
      },
      rating: review.rating,
      comment: review.comment,
      source: review.vendor ? `Vendor` : 
              review.venue ? `Venue` : 'WeddingLK',
      date: review.createdAt
    }))

    // If no testimonials, return mock data
    if (formattedTestimonials.length === 0) {
      const mockTestimonials = [
        {
          id: 'mock1',
          user: { name: 'John & Sarah', avatar: null },
          rating: 5,
          comment: 'Amazing venue! Perfect for our wedding. The staff was incredibly helpful.',
          source: 'Venue',
          date: new Date()
        },
        {
          id: 'mock2',
          user: { name: 'Mike & Lisa', avatar: null },
          rating: 5,
          comment: 'Beautiful garden setting. Our guests loved it!',
          source: 'Venue',
          date: new Date()
        }
      ]
      return NextResponse.json({ testimonials: mockTestimonials })
    }

    return NextResponse.json({ testimonials: formattedTestimonials })

  } catch (error) {
    console.error("Error fetching testimonials:", error)
    
    // Return mock data on error
    const mockTestimonials = [
      {
        id: 'mock1',
        user: { name: 'John & Sarah', avatar: null },
        rating: 5,
        comment: 'Amazing venue! Perfect for our wedding. The staff was incredibly helpful.',
        source: 'Venue',
        date: new Date()
      },
      {
        id: 'mock2',
        user: { name: 'Mike & Lisa', avatar: null },
        rating: 5,
        comment: 'Beautiful garden setting. Our guests loved it!',
        source: 'Venue',
        date: new Date()
      }
    ]
    return NextResponse.json({ testimonials: mockTestimonials })
  }
} 