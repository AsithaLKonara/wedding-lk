import { NextRequest, NextResponse } from 'next/server';
import { connectDB } from '@/lib/db';
import { getUserFromRequestWithError } from '@/lib/auth/get-user-from-request';
import { User, Vendor, Booking } from '@/lib/models';

export async function GET(request: NextRequest) {
  try {
    const { user: authUser, error } = await getUserFromRequestWithError(request);
    if (error) return error;
    if (!authUser || authUser.role !== 'vendor') {
      return NextResponse.json({ error: "Vendor access required" }, { status: 403 });
    }

    await connectDB();

    const user = await User.findOne({ email: authUser.email });
    if (!user) {
      return NextResponse.json({ error: "User not found" }, { status: 404 });
    }

    console.log('📊 Fetching vendor messages from MongoDB Atlas...');

    // Get vendor profile
    const vendor = await Vendor.findOne({ userId: authUser.id });
    if (!vendor) {
      return NextResponse.json({ error: "Vendor profile not found" }, { status: 404 });
    }

    // Get vendor's bookings to create mock messages from clients
    const bookings = await Booking.find({ vendor: vendor._id })
      .populate('client', 'name email')
      .sort({ createdAt: -1 })
      .limit(10)
      .lean();

    // Create mock messages based on bookings
    const vendorMessages = bookings.map((booking, index) => ({
      id: `message-${booking._id}`,
      clientName: booking.client?.name || 'Unknown Client',
      clientEmail: booking.client?.email || 'unknown@example.com',
      subject: `Inquiry about ${booking.service?.name || 'service'}`,
      content: `Hello, I am interested in your ${booking.service?.name || 'service'} for my wedding. Could you please provide more details?`,
      timestamp: booking.createdAt,
      isRead: index > 2, // First 3 messages are unread
      priority: booking.status === 'pending' ? 'high' : 
                booking.status === 'confirmed' ? 'medium' : 'low'
    }));

    console.log('✅ Vendor messages fetched successfully');

    return NextResponse.json({
      success: true,
      messages: vendorMessages
    });

  } catch (error) {
    console.error('❌ Error fetching vendor messages:', error);
    return NextResponse.json({
      success: false,
      error: 'Failed to fetch vendor messages',
      message: error instanceof Error ? error.message : 'Unknown error'
    }, { status: 500 });
  }
}