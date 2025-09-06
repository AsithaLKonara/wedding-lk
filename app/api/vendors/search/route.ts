import { NextRequest, NextResponse } from "next/server"
import { connectDB } from "@/lib/db"
import { Vendor } from "@/lib/models/vendor"

export async function GET(request: NextRequest) {
  try {
    await connectDB()

    const { searchParams } = new URL(request.url)
    const query = searchParams.get('q') || ''
    const category = searchParams.get('category') || ''
    const location = searchParams.get('location') || ''
    const minRating = searchParams.get('minRating') || '0'
    const maxPrice = searchParams.get('maxPrice') || ''
    const limit = parseInt(searchParams.get('limit') || '20')
    const offset = parseInt(searchParams.get('offset') || '0')

    console.log('🔍 Searching vendors in MongoDB Atlas...')

    // Build MongoDB query
    const mongoQuery: any = { isActive: true }

    // Text search
    if (query) {
      mongoQuery.$or = [
        { businessName: { $regex: query, $options: 'i' } },
        { description: { $regex: query, $options: 'i' } },
        { category: { $regex: query, $options: 'i' } }
      ]
    }

    // Category filter
    if (category) {
      mongoQuery.category = category
    }

    // Location filter
    if (location) {
      mongoQuery['location.city'] = { $regex: location, $options: 'i' }
    }

    // Rating filter
    if (minRating) {
      mongoQuery['rating.average'] = { $gte: parseFloat(minRating) }
    }

    // Price filter
    if (maxPrice) {
      mongoQuery['pricing.startingPrice'] = { $lte: parseInt(maxPrice) }
    }

    // Execute search with pagination
    const [vendors, totalCount] = await Promise.all([
      Vendor.find(mongoQuery)
        .select('businessName category description location rating pricing portfolio services isVerified')
        .sort({ 'rating.average': -1, createdAt: -1 })
        .skip(offset)
        .limit(limit)
        .lean(),
      Vendor.countDocuments(mongoQuery)
    ])

    console.log(`✅ Found ${vendors.length} vendors matching search criteria`)

    return NextResponse.json({
      vendors,
      pagination: {
        total: totalCount,
        limit,
        offset,
        hasMore: offset + limit < totalCount
      }
    })

  } catch (error) {
    console.error("Error searching vendors:", error)
    return NextResponse.json(
      { error: "Failed to search vendors" },
      { status: 500 }
    )
  }
}