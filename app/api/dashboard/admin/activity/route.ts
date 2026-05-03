import { NextRequest, NextResponse } from 'next/server';
import { connectDB } from '@/lib/db';
import { getUserFromRequestWithError } from '@/lib/auth/get-user-from-request';
import { User, Vendor, Booking } from '@/lib/models';

export async function GET(request: NextRequest) {
  try {
    const { user, error } = await getUserFromRequestWithError(request);
    if (error) return error;
    if (!user || user.role !== 'admin') {
      return NextResponse.json({ error: "Admin access required" }, { status: 403 });
    }

    await connectDB();
    
    // Fetch recent users, vendors, and bookings to construct activity
    const recentUsers = await User.find().sort({ createdAt: -1 }).limit(5);
    const recentVendors = await Vendor.find().sort({ createdAt: -1 }).limit(5);
    const recentBookings = await Booking.find().sort({ createdAt: -1 }).limit(5).populate('userId', 'name');

    const activity: any[] = [];

    recentUsers.forEach(u => {
      activity.push({
        id: `user-${u._id}`,
        type: 'user_registration',
        description: `New user registered: ${u.name}`,
        timestamp: u.createdAt,
        status: 'success'
      });
    });

    recentVendors.forEach(v => {
      activity.push({
        id: `vendor-${v._id}`,
        type: 'vendor_approval',
        description: `Vendor application: ${v.businessName}`,
        timestamp: v.createdAt,
        status: v.status === 'approved' ? 'success' : 'warning'
      });
    });

    recentBookings.forEach(b => {
      activity.push({
        id: `booking-${b._id}`,
        type: 'booking_created',
        description: `New booking by ${(b.userId as any)?.name || 'User'}`,
        timestamp: b.createdAt,
        status: 'success'
      });
    });

    // Sort by timestamp
    activity.sort((a, b) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime());

    return NextResponse.json({
      success: true,
      activity: activity.slice(0, 10)
    });
  } catch (error) {
    console.error('Error fetching admin activity:', error);
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}
