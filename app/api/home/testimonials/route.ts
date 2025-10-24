import { NextRequest, NextResponse } from 'next/server'
import { connectDB } from '@/lib/db'
import { Review } from '@/lib/models'

export async function GET(request: NextRequest) {
  try {
    const limit = 6

    await connectDB()

    // Get verified, high-rating reviews as testimonials
    const testimonials = await Review.find({
      isVerified: true,
      rating: { $gte: 4 }
    })
      .sort({ rating: -1, createdAt: -1 })
      .limit(limit)
      .populate('userId', 'name image')
      .lean()

    return NextResponse.json({
      success: true,
      testimonials: testimonials.map(t => ({
        _id: t._id,
        author: t.userId?.name || 'Anonymous',
        authorImage: t.userId?.image || null,
        rating: t.rating,
        content: t.content || t.review,
        createdAt: t.createdAt
      }))
    })
  } catch (error) {
    console.error('[Testimonials API] Error:', error)
    return NextResponse.json(
      { error: 'Failed to fetch testimonials' },
      { status: 500 }
    )
  }
} 