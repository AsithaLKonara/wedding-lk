import { NextRequest, NextResponse } from "next/server"
import { connectDB } from "@/lib/db"
import { Vendor } from "@/lib/models/vendor"
import { Review } from "@/lib/models/review"

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

    // Build search query
    const searchQuery: any = { isVerified: true, isActive: true }

    // Text search
    if (query) {
      searchQuery.$or = [
        { name: { $regex: query, $options: 'i' } },
        { businessName: { $regex: query, $options: 'i' } },
        { description: { $regex: query, $options: 'i' } },
        { 'location.city': { $regex: query, $options: 'i' } },
        { 'location.province': { $regex: query, $options: 'i' } }
      ]
    }

    // Category filter
    if (category && category !== 'all') {
      searchQuery.category = category
    }

    // Location filter
    if (location) {
      searchQuery.$or = searchQuery.$or || []
      searchQuery.$or.push(
        { 'location.city': { $regex: location, $options: 'i' } },
        { 'location.province': { $regex: location, $options: 'i' } }
      )
    }

    // Rating filter
    if (minRating && minRating !== '0') {
      searchQuery['rating.average'] = { $gte: parseFloat(minRating) }
    }

    // Execute search
    const vendors = await Vendor.find(searchQuery)
      .populate('owner', 'name email avatar')
      .sort({ 'rating.average': -1, 'rating.count': -1 })
      .skip(offset)
      .limit(limit)

    // Get total count for pagination
    const totalCount = await Vendor.countDocuments(searchQuery)

    // Enhance vendor data with review statistics
    const enhancedVendors = await Promise.all(
      vendors.map(async (vendor) => {
        const reviews = await Review.find({ 
          vendor: vendor._id, 
          isVerified: true, 
          isActive: true 
        })

        const averageRating = reviews.length > 0 
          ? reviews.reduce((sum, r) => sum + r.rating, 0) / reviews.length 
          : 0

        return {
          ...vendor.toObject(),
          reviewStats: {
            averageRating: Math.round(averageRating * 10) / 10,
            count: reviews.length
          }
        }
      })
    )

    return NextResponse.json({
      vendors: enhancedVendors,
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