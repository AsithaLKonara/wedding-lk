import { NextRequest, NextResponse } from "next/server"
import { connectDB } from "@/lib/db"
import { Venue } from "@/lib/models/venue"
import { Review } from "@/lib/models/review"

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

    // Build search query
    const searchQuery: any = { isActive: true }

    // Text search
    if (query) {
      searchQuery.$or = [
        { name: { $regex: query, $options: 'i' } },
        { description: { $regex: query, $options: 'i' } },
        { 'location.city': { $regex: query, $options: 'i' } },
        { 'location.province': { $regex: query, $options: 'i' } }
      ]
    }

    // Location filter
    if (location) {
      searchQuery.$or = searchQuery.$or || []
      searchQuery.$or.push(
        { 'location.city': { $regex: location, $options: 'i' } },
        { 'location.province': { $regex: location, $options: 'i' } }
      )
    }

    // Capacity filter
    if (minCapacity) {
      searchQuery['capacity.max'] = { $gte: parseInt(minCapacity) }
    }
    if (maxCapacity) {
      searchQuery['capacity.min'] = { $lte: parseInt(maxCapacity) }
    }

    // Rating filter
    if (minRating && minRating !== '0') {
      searchQuery['rating.average'] = { $gte: parseFloat(minRating) }
    }

    // Amenities filter
    if (amenities) {
      const amenitiesList = amenities.split(',').map(a => a.trim())
      searchQuery.amenities = { $in: amenitiesList }
    }

    // Execute search
    const venues = await Venue.find(searchQuery)
      .populate('owner', 'name email avatar')
      .sort({ 'rating.average': -1, 'rating.count': -1 })
      .skip(offset)
      .limit(limit)

    // Get total count for pagination
    const totalCount = await Venue.countDocuments(searchQuery)

    // Enhance venue data with review statistics
    const enhancedVenues = await Promise.all(
      venues.map(async (venue) => {
        const reviews = await Review.find({ 
          venue: venue._id, 
          isVerified: true, 
          isActive: true 
        })

        const averageRating = reviews.length > 0 
          ? reviews.reduce((sum, r) => sum + r.rating, 0) / reviews.length 
          : 0

        return {
          ...venue.toObject(),
          reviewStats: {
            averageRating: Math.round(averageRating * 10) / 10,
            count: reviews.length
          }
        }
      })
    )

    return NextResponse.json({
      venues: enhancedVenues,
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