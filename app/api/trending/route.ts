import { NextRequest, NextResponse } from 'next/server'
import { connectDB } from '@/lib/db'
import { Venue, Vendor } from '@/lib/models'

export async function GET(request: NextRequest) {
  try {
    const limit = 10

    await connectDB()

    // Get top-rated venues
    const venues = await Venue.find({ isActive: true })
      .sort({ rating: -1, 'reviews.length': -1 })
      .limit(limit)
      .lean()

    // Get top-rated vendors
    const vendors = await Vendor.find({ isActive: true, isVerified: true })
      .sort({ rating: -1, 'reviews.length': -1 })
      .limit(limit)
      .lean()

    return NextResponse.json({
      success: true,
      trending: {
        venues: venues.map(v => ({
          _id: v._id,
          name: v.name,
          rating: v.rating || 0,
          reviewCount: v.reviews?.length || 0
        })),
        vendors: vendors.map(v => ({
          _id: v._id,
          businessName: v.businessName,
          rating: v.rating || 0,
          reviewCount: v.reviews?.length || 0
        }))
      }
    })
  } catch (error) {
    console.error('[Trending API] Error:', error)
    return NextResponse.json(
      { error: 'Failed to fetch trending content' },
      { status: 500 }
    )
  }
}
