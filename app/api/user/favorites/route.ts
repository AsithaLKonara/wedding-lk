import { NextRequest, NextResponse } from 'next/server';
import { connectDB } from '@/lib/db';
import { User } from '@/lib/models/user';
import { Vendor } from '@/lib/models/vendor';
import { Venue } from '@/lib/models/venue';
import { withAuth } from '@/lib/middleware/auth-middleware';

async function handler(req: NextRequest) {
  try {
    await connectDB();

    if (req.method === 'GET') {
      // Get user's favorites
      const user = await User.findById(req.user?.id).populate('favorites.vendors favorites.venues');
      
      if (!user) {
        return NextResponse.json(
          { error: 'User not found' },
          { status: 404 }
        );
      }

      return NextResponse.json({
        success: true,
        vendors: user.favorites?.vendors || [],
        venues: user.favorites?.venues || []
      });

    } else if (req.method === 'POST') {
      // Add to favorites
      const { type, id } = await req.json();
      
      if (!type || !id) {
        return NextResponse.json(
          { error: 'Type and ID are required' },
          { status: 400 }
        );
      }

      const user = await User.findById(req.user?.id);
      if (!user) {
        return NextResponse.json(
          { error: 'User not found' },
          { status: 404 }
        );
      }

      // Initialize favorites if not exists
      if (!user.favorites) {
        user.favorites = { vendors: [], venues: [] };
      }

      if (type === 'vendor') {
        if (!user.favorites.vendors.includes(id)) {
          user.favorites.vendors.push(id);
        }
      } else if (type === 'venue') {
        if (!user.favorites.venues.includes(id)) {
          user.favorites.venues.push(id);
        }
      }

      await user.save();

      return NextResponse.json({
        success: true,
        message: `${type} added to favorites`
      });

    } else if (req.method === 'DELETE') {
      // Remove from favorites
      const { type, id } = await req.json();
      
      if (!type || !id) {
        return NextResponse.json(
          { error: 'Type and ID are required' },
          { status: 400 }
        );
      }

      const user = await User.findById(req.user?.id);
      if (!user) {
        return NextResponse.json(
          { error: 'User not found' },
          { status: 404 }
        );
      }

      if (user.favorites) {
        if (type === 'vendor') {
          user.favorites.vendors = user.favorites.vendors.filter((vendorId: string) => vendorId.toString() !== id);
        } else if (type === 'venue') {
          user.favorites.venues = user.favorites.venues.filter((venueId: string) => venueId.toString() !== id);
        }
      }

      await user.save();

      return NextResponse.json({
        success: true,
        message: `${type} removed from favorites`
      });

    } else {
      return NextResponse.json(
        { error: 'Method not allowed' },
        { status: 405 }
      );
    }

  } catch (error: unknown) {
    console.error('❌ Favorites API error:', error);
    
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}

export const GET = withAuth(handler);
export const POST = withAuth(handler);
export const DELETE = withAuth(handler);
