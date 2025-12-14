import { NextRequest, NextResponse } from 'next/server';
import { connectDB } from '@/lib/db';
import { getUserFromRequestWithError } from '@/lib/auth/get-user-from-request';
import { User, Booking } from '@/lib/models';

export async function GET(request: NextRequest) {
  try {
    const { user: authUser, error } = getUserFromRequestWithError(request);
    if (error) return error;
    if (!authUser) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    await connectDB();

    const user = await User.findOne({ email: authUser.email });
    if (!user) {
      return NextResponse.json({ error: "User not found" }, { status: 404 });
    }

    console.log('📊 Fetching user events from MongoDB Atlas...');

    // Get user's upcoming bookings as events
    const upcomingBookings = await Booking.find({ 
      client: user._id,
      date: { $gte: new Date() },
      status: { $in: ['confirmed', 'pending'] }
    })
      .populate('vendor', 'businessName category')
      .populate('venue', 'name location')
      .sort({ date: 1 })
      .lean();

    // Format bookings as events
    const userEvents = upcomingBookings.map(booking => ({
      id: String(booking._id),
      title: `${booking.service?.name || 'Service'} - ${booking.vendor?.businessName || 'Vendor'}`,
      date: booking.date,
      time: new Date(booking.date).toLocaleTimeString('en-US', { 
        hour: '2-digit', 
        minute: '2-digit' 
      }),
      type: 'booking',
      vendor: booking.vendor?.businessName || 'Unknown Vendor',
      location: booking.venue?.location?.address || booking.vendor?.location?.address || 'TBD'
    }));

    console.log('✅ User events fetched successfully');

    return NextResponse.json({
      success: true,
      events: userEvents
    });

    } catch (error) {
    console.error('❌ Error fetching user events:', error);
    return NextResponse.json({
      success: false,
      error: 'Failed to fetch user events',
      message: error instanceof Error ? error.message : 'Unknown error'
    }, { status: 500 });
  }
}
