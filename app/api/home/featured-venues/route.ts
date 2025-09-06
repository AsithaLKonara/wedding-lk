import { NextRequest, NextResponse } from "next/server"
import { connectDB } from "@/lib/db"
import { Venue } from "@/lib/models/venue"

export async function GET(request: NextRequest) {
  try {
    await connectDB()

    // Get featured venues without populate to avoid User model issues
    let venues = await Venue.find({ 
      featured: true, 
      isActive: true 
    })
    .select('name description location capacity pricing rating images amenities')
    .limit(6)
    .sort({ 'rating.average': -1, createdAt: -1 })

    // If not enough featured venues, get top-rated active venues
    if (venues.length < 6) {
      const additionalVenues = await Venue.find({ 
        isActive: true,
        featured: { $ne: true }
      })
      .select('name description location capacity pricing rating images amenities')
      .sort({ 'rating.average': -1, createdAt: -1 })
      .limit(6 - venues.length)

      venues.push(...additionalVenues)
    }

    // If still no venues, get any active venues
    if (venues.length === 0) {
      venues = await Venue.find({ isActive: true })
        .select('name description location capacity pricing rating images amenities')
        .limit(6)
        .sort({ 'rating.average': -1, createdAt: -1 })
    }

    // If still no venues, return empty array
    if (venues.length === 0) {
      return NextResponse.json({ venues: [] })
    }

    return NextResponse.json({ venues })

  } catch (error) {
    console.error("Error fetching featured venues:", error)
    return NextResponse.json(
      { error: "Failed to fetch featured venues" },
      { status: 500 }
    )
  }
} 