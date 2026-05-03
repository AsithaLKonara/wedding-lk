import { NextRequest, NextResponse } from 'next/server'
import { connectDB } from '@/lib/db'
import { Review } from '@/lib/models'

export async function GET(_request: NextRequest) {
  try {
    const limit = 6

    await connectDB()

    // Get verified, high-rating reviews as testimonials
    const testimonials = await Review.find({
      isVerified: true,
      overallRating: { $gte: 4 },
      status: 'approved'
    })
      .sort({ overallRating: -1, createdAt: -1 })
      .limit(limit)
      .populate('userId', 'name image')
      .populate('vendorId', 'name businessName')
      .populate('venueId', 'name')
      .lean()

    return NextResponse.json({
      success: true,
      testimonials: testimonials.map(t => ({
        _id: t._id,
        content: t.comment || t.title,
        rating: t.overallRating,
        user: {
          name: t.userId?.name || 'Anonymous',
          avatar: t.userId?.image || null
        },
        vendor: t.vendorId ? {
          name: t.vendorId.name,
          businessName: t.vendorId.businessName
        } : null,
        venue: t.venueId ? {
          name: t.venueId.name
        } : null,
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