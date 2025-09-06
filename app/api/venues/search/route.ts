import { NextRequest, NextResponse } from "next/server"
import { connectDB } from "@/lib/db"
import { Venue } from "@/lib/models/venue"

export async function GET(request: NextRequest) {
  try {
    await connectDB()

    const { searchParams } = new URL(request.url)
    const query = searchParams.get('q') || ''
    const location = searchParams.get('location') || ''
    const minCapacity = searchParams.get('minCapacity') || ''
    const maxCapacity = searchParams.get('maxCapacity') || ''
    const minRating = searchParams.get('minRating') || '0'
    const maxPrice = searchParams.get('maxPrice') || ''
    const amenities = searchParams.get('amenities') || ''
    const limit = parseInt(searchParams.get('limit') || '20')
    const offset = parseInt(searchParams.get('offset') || '0')

    console.log('🔍 Searching venues in MongoDB Atlas...')

    // Build MongoDB query
    const mongoQuery: any = { isActive: true }

    // Text search
    if (query) {
      mongoQuery.$or = [
        { name: { $regex: query, $options: 'i' } },
        { description: { $regex: query, $options: 'i' } },
        { 'location.city': { $regex: query, $options: 'i' } }
      ]
    }

    // Location filter
    if (location) {
      mongoQuery['location.city'] = { $regex: location, $options: 'i' }
    }

    // Capacity filters
    if (minCapacity) {
      mongoQuery.capacity = { $gte: parseInt(minCapacity) }
    }
    if (maxCapacity) {
      mongoQuery.capacity = { ...mongoQuery.capacity, $lte: parseInt(maxCapacity) }
    }

    // Rating filter
    if (minRating) {
      mongoQuery['rating.average'] = { $gte: parseFloat(minRating) }
    }

    // Price filter
    if (maxPrice) {
      mongoQuery['pricing.basePrice'] = { $lte: parseInt(maxPrice) }
    }

    // Amenities filter
    if (amenities) {
      const amenityList = amenities.split(',').map(a => a.trim())
      mongoQuery.amenities = { $in: amenityList }
    }

    // Execute search with pagination
    const [venues, totalCount] = await Promise.all([
      Venue.find(mongoQuery)
        .select('name description location capacity pricing rating amenities images')
        .sort({ 'rating.average': -1, createdAt: -1 })
        .skip(offset)
        .limit(limit)
        .lean(),
      Venue.countDocuments(mongoQuery)
    ])

    console.log(`✅ Found ${venues.length} venues matching search criteria`)

    return NextResponse.json({
      venues,
      pagination: {
        total: totalCount,
        limit,
        offset,
        hasMore: offset + limit < totalCount
      }
    })

  } catch (error) {
    console.error("Error searching venues:", error)
    return NextResponse.json(
      { error: "Failed to search venues" },
      { status: 500 }
    )
  }
} 