import { NextRequest, NextResponse } from 'next/server'
import { authOptions } from '@/lib/auth'
import { connectDB } from '@/lib/mongodb'
import { Favorite } from '@/lib/models'

export async function GET(request: NextRequest) {
  try {
    // Custom auth implementation
    const token = request.cookies.get('auth-token')?.value;
    if (!token) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }
    
    if (!user?.user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    await connectDB()

    const favorites = await Favorite.find({ userId: user.id })
      .populate('itemId')
      .sort({ createdAt: -1 })

    return NextResponse.json({ success: true, favorites })
  } catch (error) {
    console.error('Error fetching favorites:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}

export async function POST(request: NextRequest) {
  try {
    // Custom auth implementation
    const token = request.cookies.get('auth-token')?.value;
    if (!token) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }
    
    if (!user?.user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const { itemId, itemType } = await request.json()

    if (!itemId || !itemType) {
      return NextResponse.json({ error: 'Missing required fields' }, { status: 400 })
    }

    await connectDB()

    // Check if already favorited
    const existingFavorite = await Favorite.findOne({
      userId: user.id,
      itemId,
      itemType
    })

    if (existingFavorite) {
      return NextResponse.json({ error: 'Already favorited' }, { status: 400 })
    }

    const favorite = new Favorite({
      userId: user.id,
      itemId,
      itemType,
      createdAt: new Date()
    })

    await favorite.save()

    return NextResponse.json({ success: true, favorite })
  } catch (error) {
    console.error('Error adding favorite:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}

export async function DELETE(request: NextRequest) {
  try {
    // Custom auth implementation
    const token = request.cookies.get('auth-token')?.value;
    if (!token) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }
    
    if (!user?.user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const { searchParams } = new URL(request.url)
    const itemId = searchParams.get('itemId')
    const itemType = searchParams.get('itemType')

    if (!itemId || !itemType) {
      return NextResponse.json({ error: 'Missing required fields' }, { status: 400 })
    }

    await connectDB()

    const result = await Favorite.deleteOne({
      userId: user.id,
      itemId,
      itemType
    })

    if (result.deletedCount === 0) {
      return NextResponse.json({ error: 'Favorite not found' }, { status: 404 })
    }

    return NextResponse.json({ success: true })
  } catch (error) {
    console.error('Error removing favorite:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}