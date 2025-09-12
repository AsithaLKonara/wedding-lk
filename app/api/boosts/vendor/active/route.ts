import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from '@/lib/auth-utils';
import { authOptions } from '@/lib/auth';
import { connectDB } from '@/lib/db';
import { User } from '@/lib/models/user';
import VenueBoost from '@/lib/models/venueBoost';

export async function GET(request: NextRequest) {
  try {
    const session = await getServerSession();
    
    if (!session?.user?.email) {
      return NextResponse.json(
        { success: false, error: 'Authentication required' },
        { status: 401 }
      );
    }

    await connectDB();

    // Get the user
    const user = await User.findOne({ email: session.user.email });
    if (!user) {
      return NextResponse.json(
        { success: false, error: 'User not found' },
        { status: 404 }
      );
    }

    // Check if user is a vendor
    if (user.role !== 'vendor') {
      return NextResponse.json(
        { success: false, error: 'Only vendors can view boost data' },
        { status: 403 }
      );
    }

    // Get all boosts for this vendor
    const boosts = await VenueBoost.find({ vendorId: user._id })
      .sort({ createdAt: -1 })
      .lean();

    // Transform the data for the frontend
    const transformedBoosts = boosts.map((boost: any) => ({
      id: boost._id.toString(),
      packageId: boost.packageId.toString(),
      packageName: boost.packageName,
      type: boost.packageType,
      startDate: boost.startDate.toISOString(),
      endDate: boost.endDate.toISOString(),
      status: boost.status,
      views: boost.views || 0,
      clicks: boost.clicks || 0,
      bookings: boost.bookings || 0,
      revenue: boost.revenue || 0,
      price: boost.price,
      features: boost.features || [],
      createdAt: boost.createdAt.toISOString(),
    }));

    return NextResponse.json({
      success: true,
      boosts: transformedBoosts,
    });

  } catch (error) {
    console.error('Error fetching vendor boosts:', error);
    return NextResponse.json(
      { success: false, error: 'Internal server error' },
      { status: 500 }
    );
  }
}
