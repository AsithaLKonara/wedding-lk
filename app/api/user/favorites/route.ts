import { NextRequest, NextResponse } from 'next/server'
import { connectDB } from '@/lib/db'
import { User } from '@/lib/models'
import { verifyToken } from '@/lib/auth/custom-auth'

export async function GET(request: NextRequest) {
  try {
    const token = request.cookies.get('auth-token')?.value
    
    if (!token) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      )
    }
    
    const user = verifyToken(token)
    if (!user?.id) {
      return NextResponse.json(
        { error: 'Invalid token' },
        { status: 401 }
      )
    }

    await connectDB()
    const userDoc = await User.findById(user.id)
      .populate('favorites')
      .lean()

    if (!userDoc) {
      return NextResponse.json(
        { error: 'User not found' },
        { status: 404 }
      )
    }

    return NextResponse.json({ 
      success: true, 
      favorites: userDoc.favorites || []
    })
  } catch (error) {
    console.error('[User Favorites] Error:', error)
    return NextResponse.json(
      { error: 'Failed to fetch favorites' },
      { status: 500 }
    )
  }
}

export async function POST(request: NextRequest) {
  try {
    const token = request.cookies.get('auth-token')?.value
    if (!token) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }
    
    const user = verifyToken(token)
    if (!user?.id) {
      return NextResponse.json({ error: 'Invalid token' }, { status: 401 })
    }

    const { itemId, itemType } = await request.json()
    await connectDB()

    const updatedUser = await User.findByIdAndUpdate(
      user.id,
      { $addToSet: { favorites: itemId } },
      { new: true }
    ).populate('favorites').lean()

    return NextResponse.json({ success: true, favorites: updatedUser.favorites })
  } catch (error) {
    console.error('[User Favorites] Error:', error)
    return NextResponse.json(
      { error: 'Failed to add favorite' },
      { status: 500 }
    )
  }
}
