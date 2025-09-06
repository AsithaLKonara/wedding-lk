import { NextRequest, NextResponse } from 'next/server';
import { connectDB } from '@/lib/db';
import { Favorite } from '@/lib/models/favorite';

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const userId = searchParams.get('userId');
    const type = searchParams.get('type'); // 'venue' or 'vendor'

    // If no userId provided, return empty array for now
    if (!userId) {
      return NextResponse.json({
        success: true,
        favorites: [],
        message: 'No user ID provided'
      });
    }

    await connectDB();

    let query: any = { userId };
    if (type) {
      query.type = type;
    }

    const favorites = await Favorite.find(query)
      .populate('itemId')
      .sort({ createdAt: -1 })
      .lean();

    return NextResponse.json({
      success: true,
      favorites
    });

  } catch (error) {
    console.error('Error fetching favorites:', error);
    return NextResponse.json({
      success: false,
      error: 'Failed to fetch favorites'
    }, { status: 500 });
  }
}

export async function POST(request: NextRequest) {
  try {
    const { userId, itemId, type } = await request.json();

    if (!userId || !itemId || !type) {
      return NextResponse.json({
        success: false,
        error: 'Missing required fields'
      }, { status: 400 });
    }

    await connectDB();

    // Check if already favorited
    const existingFavorite = await Favorite.findOne({ userId, itemId, type });
    if (existingFavorite) {
      return NextResponse.json({
        success: false,
        error: 'Item already in favorites'
      }, { status: 400 });
    }

    const favorite = new Favorite({
      userId,
      itemId,
      type
    });

    await favorite.save();

    return NextResponse.json({
      success: true,
      favorite
    });

  } catch (error) {
    console.error('Error adding favorite:', error);
    return NextResponse.json({
      success: false,
      error: 'Failed to add favorite'
    }, { status: 500 });
  }
}

export async function DELETE(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const userId = searchParams.get('userId');
    const itemId = searchParams.get('itemId');
    const type = searchParams.get('type');

    if (!userId || !itemId || !type) {
      return NextResponse.json({
        success: false,
        error: 'Missing required parameters'
      }, { status: 400 });
    }

    await connectDB();

    const favorite = await Favorite.findOneAndDelete({ userId, itemId, type });

    if (!favorite) {
      return NextResponse.json({
        success: false,
        error: 'Favorite not found'
      }, { status: 404 });
    }

    return NextResponse.json({
      success: true,
      message: 'Favorite removed successfully'
    });

  } catch (error) {
    console.error('Error removing favorite:', error);
    return NextResponse.json({
      success: false,
      error: 'Failed to remove favorite'
    }, { status: 500 });
  }
}