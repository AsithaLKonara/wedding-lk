import { NextRequest, NextResponse } from 'next/server';
import { connectDB } from '@/lib/db';
import { getServerSession } from '@/lib/auth-utils';
import { User, Vendor, Venue, Booking, Payment, Review, Task, Post } from '@/lib/models';

export async function GET(request: NextRequest) {
  try {
    const session = await getServerSession();
    
    if (!session?.user?.email) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    await connectDB();

    const user = await User.findOne({ email: session.user.email });
    if (!user) {
      return NextResponse.json({ error: "User not found" }, { status: 404 });
    }

    console.log('📊 Fetching user favorites from MongoDB Atlas...');

    // Get user's favorites from their profile
    const userFavorites = user.favorites || {
      venues: [],
      vendors: [],
      packages: []
    };

    // Fetch detailed data for each favorite
    const [favoriteVenues, favoriteVendors] = await Promise.all([
      Venue.find({ 
        _id: { $in: userFavorites.venues },
        isActive: true 
      }).lean(),
      Vendor.find({ 
        _id: { $in: userFavorites.vendors },
        isActive: true 
      }).lean()
    ]);

    const favorites = {
      venues: favoriteVenues.map(venue => ({
        _id: venue._id,
        name: venue.name,
        location: venue.location,
        pricing: venue.pricing,
        rating: venue.rating,
        images: venue.images,
        type: 'venue'
      })),
      vendors: favoriteVendors.map(vendor => ({
        _id: vendor._id,
        name: vendor.businessName,
        category: vendor.category,
        location: vendor.location,
        pricing: vendor.pricing,
        rating: vendor.rating,
        portfolio: vendor.portfolio,
        type: 'vendor'
      })),
      packages: userFavorites.packages // For now, packages are stored as IDs
    };

    console.log('✅ User favorites fetched successfully');

    return NextResponse.json({
      success: true,
      favorites
    });

  } catch (error) {
    console.error('❌ Error fetching favorites:', error);
    return NextResponse.json({
      success: false,
      error: 'Failed to fetch favorites',
      message: error instanceof Error ? error.message : 'Unknown error'
    }, { status: 500 });
  }
}

export async function POST(request: NextRequest) {
  try {
    const session = await getServerSession();
    
    if (!session?.user?.email) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    await connectDB();

    const user = await User.findOne({ email: session.user.email });
    if (!user) {
      return NextResponse.json({ error: "User not found" }, { status: 404 });
    }

    const { itemId, itemType } = await request.json();
    
    console.log('📝 Adding item to favorites...', { itemId, itemType });

    // Validate item type
    if (!['venue', 'vendor', 'package'].includes(itemType)) {
      return NextResponse.json({
        success: false,
        error: 'Invalid item type. Must be venue, vendor, or package'
      }, { status: 400 });
    }

    // Initialize favorites if not exists
    if (!user.favorites) {
      user.favorites = {
        venues: [],
        vendors: [],
        packages: []
      };
    }

    // Add item to appropriate favorites array
    const favoritesArray = user.favorites[`${itemType}s` as keyof typeof user.favorites] as string[];
    
    if (!favoritesArray.includes(itemId)) {
      favoritesArray.push(itemId);
      await user.save();
      console.log('✅ Item added to favorites');
    }

    return NextResponse.json({
      success: true,
      message: 'Item added to favorites successfully'
    });

  } catch (error) {
    console.error('❌ Error adding to favorites:', error);
    return NextResponse.json({
      success: false,
      error: 'Failed to add to favorites',
      message: error instanceof Error ? error.message : 'Unknown error'
    }, { status: 500 });
  }
}

export async function DELETE(request: NextRequest) {
  try {
    const session = await getServerSession();
    
    if (!session?.user?.email) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    await connectDB();

    const user = await User.findOne({ email: session.user.email });
    if (!user) {
      return NextResponse.json({ error: "User not found" }, { status: 404 });
    }

    const { searchParams } = new URL(request.url);
    const itemId = searchParams.get('itemId');
    const itemType = searchParams.get('itemType');
    
    console.log('📝 Removing item from favorites...', { itemId, itemType });

    // Validate item type
    if (!['venue', 'vendor', 'package'].includes(itemType || '')) {
      return NextResponse.json({
        success: false,
        error: 'Invalid item type. Must be venue, vendor, or package'
      }, { status: 400 });
    }

    // Initialize favorites if not exists
    if (!user.favorites) {
      user.favorites = {
        venues: [],
        vendors: [],
        packages: []
      };
    }

    // Remove item from appropriate favorites array
    const favoritesArray = user.favorites[`${itemType}s` as keyof typeof user.favorites] as string[];
    const index = favoritesArray.indexOf(itemId || '');
    
    if (index > -1) {
      favoritesArray.splice(index, 1);
      await user.save();
      console.log('✅ Item removed from favorites');
    }

    return NextResponse.json({
      success: true,
      message: 'Item removed from favorites successfully'
    });

  } catch (error) {
    console.error('❌ Error removing from favorites:', error);
    return NextResponse.json({
      success: false,
      error: 'Failed to remove from favorites',
      message: error instanceof Error ? error.message : 'Unknown error'
    }, { status: 500 });
  }
}