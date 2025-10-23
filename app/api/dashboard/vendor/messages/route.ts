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

    console.log('📊 Fetching vendor messages from MongoDB Atlas...');

    // Get vendor profile
    const vendor = await Vendor.findOne({ email: session.user.email });
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