import { NextRequest, NextResponse } from 'next/server';
import { connectDB } from '@/lib/db';
import { getServerSession } from '@/lib/auth-utils';
import { User, Vendor, Venue, Booking, Payment, Review, Task, Post } from '@/lib/models';

export async function GET(request: NextRequest) {
  try {
    const session = await getServerSession();
    
    if (!token?.user?.email) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    await connectDB();

    const user = await User.findOne({ email: session.user.email });
    if (!user || user.role !== 'vendor') {
      return NextResponse.json({ error: "Vendor access required" }, { status: 403 });
    }

    console.log('📊 Fetching vendor bookings from MongoDB Atlas...');

    // Get vendor profile
    const vendor = await Vendor.findOne({ email: session.user.email });
    if (!vendor) {
      return NextResponse.json({ error: "Vendor profile not found" }, { status: 404 });
    }

    // Get vendor bookings with populated client data
    const bookings = await Booking.find({ vendor: vendor._id })
      .populate('client', 'name email')
      .sort({ createdAt: -1 })
      .lean();

    // Format bookings for frontend
    const vendorBookings = bookings.map(booking => ({
      id: (booking._id as any).toString(),
      clientName: booking.client?.name || 'Unknown Client',
      clientEmail: booking.client?.email || 'unknown@example.com',
      service: booking.service?.name || 'Service',
      date: booking.date,
      time: booking.date ? new Date(booking.date).toLocaleTimeString('en-US', { 
        hour: '2-digit', 
        minute: '2-digit' 
      }) : 'TBD',
      status: booking.status,
      amount: booking.totalAmount || 0,
      guestCount: booking.guestCount || 0,
      specialRequirements: booking.notes || 'None'
    }));

    console.log('✅ Vendor bookings fetched successfully');

    return NextResponse.json({
      success: true,
      bookings: vendorBookings
    });

  } catch (error) {
    console.error('❌ Error fetching vendor bookings:', error);
    return NextResponse.json({
      success: false,
      error: 'Failed to fetch vendor bookings',
      message: error instanceof Error ? error.message : 'Unknown error'
    }, { status: 500 });
  }
}

export async function POST(request: NextRequest) {
  try {
    const session = await getServerSession();
    
    if (!token?.user?.email) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    await connectDB();

    const user = await User.findOne({ email: session.user.email });
    if (!user || user.role !== 'vendor') {
      return NextResponse.json({ error: "Vendor access required" }, { status: 403 });
    }

    const { bookingId, action } = await request.json();
    
    console.log('📝 Processing booking action:', { bookingId, action });

    // Find the booking
    const booking = await Booking.findById(bookingId);
    if (!booking) {
      return NextResponse.json({
        success: false,
        error: 'Booking not found'
      }, { status: 404 });
    }

    // Verify vendor owns this booking
    const vendor = await Vendor.findOne({ email: session.user.email });
    if (!vendor || booking.vendor.toString() !== vendor._id.toString()) {
      return NextResponse.json({
        success: false,
        error: 'Unauthorized to modify this booking'
      }, { status: 403 });
    }

    // Process the action
    if (action === 'confirm') {
      booking.status = 'confirmed';
      await booking.save();
      console.log('✅ Booking confirmed:', bookingId);
      return NextResponse.json({
        success: true,
        message: 'Booking confirmed successfully'
      });
    } else if (action === 'reject') {
      booking.status = 'cancelled';
      await booking.save();
      console.log('❌ Booking rejected:', bookingId);
      return NextResponse.json({
        success: true,
        message: 'Booking rejected successfully'
      });
    } else {
      return NextResponse.json({
        success: false,
        error: 'Invalid action'
      }, { status: 400 });
    }

  } catch (error) {
    console.error('❌ Error processing booking action:', error);
    return NextResponse.json({
      success: false,
      error: 'Failed to process booking action',
      message: error instanceof Error ? error.message : 'Unknown error'
    }, { status: 500 });
  }
}