import { NextRequest, NextResponse } from 'next/server'
import { connectDB } from '@/lib/db'
import { Venue, Vendor } from '@/lib/models'

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const query = searchParams.get('q') || ''
    const limit = parseInt(searchParams.get('limit') || '20')

    if (!query.trim()) {
      return NextResponse.json({
        success: true,
        venues: [],
        vendors: [],
        total: 0
      })
    }

    await connectDB()

    // Search in venues
    const venues = await Venue.find({
      $or: [
        { name: { $regex: query, $options: 'i' } },
        { description: { $regex: query, $options: 'i' } },
        { 'location.city': { $regex: query, $options: 'i' } }
      ]
    })
      .limit(limit)
      .lean()

    // Search in vendors
    const vendors = await Vendor.find({
      $or: [
        { businessName: { $regex: query, $options: 'i' } },
        { description: { $regex: query, $options: 'i' } },
        { category: { $regex: query, $options: 'i' } }
      ]
    })
      .limit(limit)
      .lean()

    return NextResponse.json({
      success: true,
      venues,
      vendors,
      total: venues.length + vendors.length
    })
  } catch (error) {
    console.error('[Search API] Error:', error)
    return NextResponse.json(
      { error: 'Search failed' },
      { status: 500 }
    )
  }
}