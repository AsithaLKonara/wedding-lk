import { NextRequest, NextResponse } from 'next/server'
import { requireAuth } from '@/lib/api-auth'
import { connectDB } from '@/lib/db'
import { User, Venue, Vendor } from '@/lib/models'

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

    const itemId = params.id
    await connectDB()

    // Try to find as venue first, then vendor
    const venue = await Venue.findById(itemId)
    const vendor = await Vendor.findById(itemId)

    if (!venue && !vendor) {
      return NextResponse.json(
        { success: false, error: 'Item not found' },
        { status: 404 }
      )
    }

    const user = await User.findById(authResult.user.id)
    if (!user) {
      return NextResponse.json(
        { success: false, error: 'User not found' },
        { status: 404 }
      )
    }

    // Check if already favorited
    const isAlreadyFavorite = user.favorites?.some(
      (fav: any) => fav.toString() === itemId
    )

    if (!isAlreadyFavorite) {
      if (!user.favorites) {
        user.favorites = []
      }
      user.favorites.push(itemId)
      await user.save()
    }

    return NextResponse.json(
      { success: true, message: 'Item added to favorites' },
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

    const itemId = params.id
    await connectDB()

    const user = await User.findById(authResult.user.id)
    if (!user) {
      return NextResponse.json(
        { success: false, error: 'User not found' },
        { status: 404 }
      )
    }

    if (user.favorites) {
      user.favorites = user.favorites.filter(
        (fav: any) => fav.toString() !== itemId
      )
      await user.save()
    }

    return NextResponse.json(
      { success: true, message: 'Item removed from favorites' },
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

