import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from '@/lib/auth-utils';
import { authOptions } from '@/lib/auth';
import { connectDB } from '@/lib/db';
import { User } from '@/lib/models/user';
import { BoostPackage } from '@/lib/models/boostPackage';
import VenueBoost from '@/lib/models/venueBoost';

export async function POST(request: NextRequest) {
  try {
    const session = await getServerSession();
    
    if (!session?.user?.email) {
      return NextResponse.json(
        { success: false, error: 'Authentication required' },
        { status: 401 }
      );
    }

    await connectDB();

    const { packageId, vendorId } = await request.json();

    if (!packageId) {
      return NextResponse.json(
        { success: false, error: 'Package ID is required' },
        { status: 400 }
      );
    }

    // Get the boost package
    const boostPackage = await BoostPackage.findById(packageId);
    if (!boostPackage) {
      return NextResponse.json(
        { success: false, error: 'Boost package not found' },
        { status: 404 }
      );
    }

    if (!boostPackage.isActive) {
      return NextResponse.json(
        { success: false, error: 'Boost package is not available' },
        { status: 400 }
      );
    }

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
        { success: false, error: 'Only vendors can purchase boosts' },
        { status: 403 }
      );
    }

    // Calculate boost duration
    const startDate = new Date();
    const endDate = new Date();
    endDate.setDate(startDate.getDate() + boostPackage.duration);

    // Create the boost purchase
    const boostPurchase = new VenueBoost({
      vendorId: user._id,
      packageId: boostPackage._id,
      packageName: boostPackage.name,
      packageType: boostPackage.type,
      price: boostPackage.price,
      startDate,
      endDate,
      status: 'pending',
      features: boostPackage.features,
      views: 0,
      clicks: 0,
      bookings: 0,
      revenue: 0,
    });

    await boostPurchase.save();

    // TODO: Integrate with payment system (Stripe)
    // For now, we'll simulate a successful payment
    boostPurchase.status = 'active';
    await boostPurchase.save();

    return NextResponse.json({
      success: true,
      message: 'Boost package purchased successfully',
      boost: {
        id: boostPurchase._id,
        packageName: boostPackage.name,
        type: boostPackage.type,
        startDate: boostPurchase.startDate,
        endDate: boostPurchase.endDate,
        status: boostPurchase.status,
      },
    });

  } catch (error) {
    console.error('Error purchasing boost:', error);
    return NextResponse.json(
      { success: false, error: 'Internal server error' },
      { status: 500 }
    );
  }
}
