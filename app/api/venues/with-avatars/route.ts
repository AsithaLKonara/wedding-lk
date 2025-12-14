import { NextRequest, NextResponse } from "next/server"
import { UserAvatarService } from "@/lib/services/user-avatar-service"

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const venueId = searchParams.get('venueId')
    const limit = parseInt(searchParams.get('limit') || '50')

    if (venueId) {
      // Get single venue with avatar
      const venues = await UserAvatarService.getAllVenues()
      const venue = venues.find(v => v._id === venueId)
      
      if (!venue) {
        return NextResponse.json({ error: 'Venue not found' }, { status: 404 })
      }
      return NextResponse.json({ venue })
    }

    // Get all venues with avatars
    const venues = await UserAvatarService.getAllVenues()
    return NextResponse.json({ 
      venues: venues.slice(0, limit),
      total: venues.length 
    })

  } catch (error) {
    console.error('Error fetching venues with avatars:', error)
    return NextResponse.json(
      { error: 'Failed to fetch venues with avatars' },
      { status: 500 }
    )
  }
} 