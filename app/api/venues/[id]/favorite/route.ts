import { NextRequest, NextResponse } from 'next/server'
import { requireAuth } from '@/lib/api-auth'
import { connectDB } from '@/lib/db'
import { User, Venue } from '@/lib/models'

export async function POST(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const authResult = await requireAuth(request)
    
    if (!authResult.authorized || !authResult.user) {
      return NextResponse.json(
        { success: false, error: 'Unauthorized' },
        { status: 401 }
      )
    }

    const venueId = params.id
    await connectDB()

    // Verify venue exists
    const venue = await Venue.findById(venueId)
    if (!venue) {
      return NextResponse.json(
        { success: false, error: 'Venue not found' },
        { status: 404 }
      )
    }

    // Add to user favorites
    const user = await User.findById(authResult.user.id)
    if (!user) {
      return NextResponse.json(
        { success: false, error: 'User not found' },
        { status: 404 }
      )
    }

    // Check if already favorited
    const isAlreadyFavorite = user.favorites?.some(
      (fav: any) => fav.toString() === venueId
    )

    if (!isAlreadyFavorite) {
      if (!user.favorites) {
        user.favorites = []
      }
      user.favorites.push(venueId)
      await user.save()
    }

    return NextResponse.json(
      { success: true, message: 'Venue added to favorites' },
      { status: 200 }
    )
  } catch (error) {
    console.error('Error adding to favorites:', error)
    return NextResponse.json(
      { success: false, error: 'Internal server error' },
      { status: 500 }
    )
  }
}

export async function DELETE(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const authResult = await requireAuth(request)
    
    if (!authResult.authorized || !authResult.user) {
      return NextResponse.json(
        { success: false, error: 'Unauthorized' },
        { status: 401 }
      )
    }

    const venueId = params.id
    await connectDB()

    // Remove from user favorites
    const user = await User.findById(authResult.user.id)
    if (!user) {
      return NextResponse.json(
        { success: false, error: 'User not found' },
        { status: 404 }
      )
    }

    if (user.favorites) {
      user.favorites = user.favorites.filter(
        (fav: any) => fav.toString() !== venueId
      )
      await user.save()
    }

    return NextResponse.json(
      { success: true, message: 'Venue removed from favorites' },
      { status: 204 }
    )
  } catch (error) {
    console.error('Error removing from favorites:', error)
    return NextResponse.json(
      { success: false, error: 'Internal server error' },
      { status: 500 }
    )
  }
}

