import { NextRequest, NextResponse } from 'next/server';
import { connectDB } from '@/lib/db';
import { getServerSession } from '@/lib/auth-utils';
import { User, Vendor, Venue, Booking, Payment, Review, Task, Post } from '@/lib/models';
import { formatCurrency } from '@/lib/utils/format';

export async function GET(request: NextRequest) {
  try {
    const session = await getServerSession();
    
    if (!session?.user?.email) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    await connectDB();

    const user = await User.findOne({ email: session.user.email });
    if (!user || user.role !== 'vendor') {
      return NextResponse.json({ error: "Vendor access required" }, { status: 403 });
    }

    console.log('📊 Fetching vendor stats from MongoDB Atlas...');

    // Get vendor-specific data
    const vendor = await Vendor.findOne({ email: session.user.email });
    if (!vendor) {
      return NextResponse.json({ error: "Vendor profile not found" }, { status: 404 });
    }

    // Get vendor bookings
    const bookings = await Booking.find({ vendor: vendor._id });
    const totalBookings = bookings.length;
    const pendingBookings = bookings.filter(b => b.status === 'pending').length;
    const completedBookings = bookings.filter(b => b.status === 'completed').length;

    // Get vendor revenue
    const payments = await Payment.find({ 
      booking: { $in: bookings.map(b => b._id) },
      status: 'completed' 
    });
    const totalRevenue = payments.reduce((sum, p) => sum + p.amount, 0);
    
    // Monthly revenue
    const thisMonth = new Date();
    thisMonth.setDate(1);
    const monthlyRevenue = payments
      .filter(p => new Date(p.createdAt) >= thisMonth)
      .reduce((sum, p) => sum + p.amount, 0);

    // Calculate growth
    const lastMonth = new Date();
    lastMonth.setMonth(lastMonth.getMonth() - 1);
    lastMonth.setDate(1);
    const lastMonthRevenue = payments
      .filter(p => new Date(p.createdAt) >= lastMonth && new Date(p.createdAt) < thisMonth)
      .reduce((sum, p) => sum + p.amount, 0);

    const revenueGrowth = lastMonthRevenue > 0 
      ? ((monthlyRevenue - lastMonthRevenue) / lastMonthRevenue) * 100
      : 0;

    // Get vendor reviews
    const reviews = await Review.find({ vendor: vendor._id });
    const averageRating = reviews.length > 0 
      ? reviews.reduce((sum, review) => sum + review.rating, 0) / reviews.length 
      : 0;

    // Count active services
    const activeServices = vendor.services ? vendor.services.length : 0;

    const vendorStats = {
      totalBookings,
      totalRevenue,
      averageRating: Math.round(averageRating * 10) / 10,
      activeServices,
      pendingBookings,
      completedBookings,
      monthlyRevenue,
      revenueGrowth: Math.round(revenueGrowth * 10) / 10
    };

    console.log('✅ Vendor stats fetched successfully');

    return NextResponse.json({
      success: true,
      stats: vendorStats
    });

  } catch (error) {
    console.error('❌ Error fetching vendor stats:', error);
    return NextResponse.json({
      success: false,
      error: 'Failed to fetch vendor stats',
      message: error instanceof Error ? error.message : 'Unknown error'
    }, { status: 500 });
  }
}