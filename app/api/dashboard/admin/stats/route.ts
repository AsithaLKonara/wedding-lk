import { NextRequest, NextResponse } from 'next/server';
import { connectDB } from '@/lib/db';
import { getUserFromRequestWithError } from '@/lib/auth/get-user-from-request';
import { User, Vendor, Venue, Booking, Payment, Review } from '@/lib/models';

export async function GET(request: NextRequest) {
  try {
    const { user: authUser, error } = getUserFromRequestWithError(request);
    if (error) return error;
    if (!authUser) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    await connectDB();

    const user = await User.findOne({ email: authUser.email });
    if (!user || user.role !== 'admin') {
      return NextResponse.json({ error: "Admin access required" }, { status: 403 });
    }

    console.log('📊 Fetching admin stats from MongoDB Atlas...');

    // Get total counts
    const totalUsers = await User.countDocuments({ role: 'user' });
    const totalVendors = await Vendor.countDocuments();
    const totalVenues = await Venue.countDocuments();
    const totalBookings = await Booking.countDocuments();

    // Get revenue data
    const payments = await Payment.find({ status: 'completed' });
    const totalRevenue = payments.reduce((sum, p) => sum + p.amount, 0);
    
    // Calculate average rating
    const reviews = await Review.find();
    const averageRating = reviews.length > 0 
      ? reviews.reduce((sum, review) => sum + review.rating, 0) / reviews.length 
      : 0;

    // Calculate growth (mock data for now - can be enhanced with historical data)
    const userGrowth = 15; // 15% growth
    const revenueGrowth = 25; // 25% growth

    const adminStats = {
      totalUsers,
      totalVendors,
      totalVenues,
      totalBookings,
      totalRevenue,
      averageRating: Math.round(averageRating * 10) / 10,
      userGrowth,
      revenueGrowth
    };

    console.log('✅ Admin stats fetched successfully');

    return NextResponse.json({
      success: true,
      stats: adminStats
    });

  } catch (error) {
    console.error('❌ Error fetching admin stats:', error);
    return NextResponse.json({
      success: false,
      error: 'Failed to fetch admin stats',
      message: error instanceof Error ? error.message : 'Unknown error'
    }, { status: 500 });
  }
}
