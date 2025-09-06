import { NextRequest, NextResponse } from 'next/server';
import { connectDB } from '@/lib/db';
import { getAuthenticatedUser, requireAuth, requireAdmin, requireVendor, requireWeddingPlanner } from '@/lib/auth-utils';
import { User, Vendor, Venue, Booking, Payment, Review, Task, Post } from '@/lib/models';
import { formatCurrency } from '@/lib/utils/format';

export async function GET(request: NextRequest) {
  const authResult = await requireAdmin(request);
  if (!authResult.success) {
    return NextResponse.json({ error: authResult.error }, { status: 401 });
  }
  try {
    await connectDB();
    console.log('📊 Fetching admin analytics from MongoDB Atlas...');

    // Get all data from MongoDB Atlas
    const [users, vendors, venues, bookings, payments, reviews] = await Promise.all([
      User.find({}).lean(),
      Vendor.find({}).lean(),
      Venue.find({}).lean(),
      Booking.find({}).lean(),
      Payment.find({}).lean(),
      Review.find({}).lean()
    ]);

    // Calculate platform statistics
    const totalUsers = users.length;
    const totalVendors = vendors.length;
    const totalVenues = venues.length;
    const totalBookings = bookings.length;
    const totalRevenue = payments.reduce((sum, payment) => sum + (payment.amount || 0), 0);
    const averageRating = reviews.length > 0 
      ? reviews.reduce((sum, review) => sum + review.rating, 0) / reviews.length 
      : 0;

    // Calculate growth (mock data for now)
    const userGrowth = 15; // 15% growth
    const revenueGrowth = 25; // 25% growth

    // Recent activity (mock data)
    const recentActivity = [
      {
        id: 'activity-1',
        type: 'user_registration',
        description: 'New user registered',
        timestamp: new Date(Date.now() - 2 * 60 * 60 * 1000).toISOString(), // 2 hours ago
        status: 'success'
      },
      {
        id: 'activity-2',
        type: 'vendor_approval',
        description: 'Vendor approved',
        timestamp: new Date(Date.now() - 4 * 60 * 60 * 1000).toISOString(), // 4 hours ago
        status: 'success'
      },
      {
        id: 'activity-3',
        type: 'booking_created',
        description: 'New booking created',
        timestamp: new Date(Date.now() - 6 * 60 * 60 * 1000).toISOString(), // 6 hours ago
        status: 'success'
      },
      {
        id: 'activity-4',
        type: 'payment_received',
        description: 'Payment received',
        timestamp: new Date(Date.now() - 8 * 60 * 60 * 1000).toISOString(), // 8 hours ago
        status: 'success'
      },
      {
        id: 'activity-5',
        type: 'user_registration',
        description: 'New user registered',
        timestamp: new Date(Date.now() - 12 * 60 * 60 * 1000).toISOString(), // 12 hours ago
        status: 'success'
      }
    ];

    const analytics = {
      platform: {
        totalUsers,
        totalVendors,
        totalVenues,
        totalBookings,
        totalRevenue,
        averageRating,
        userGrowth,
        revenueGrowth
      },
      recentActivity,
      charts: {
      revenue: {
          labels: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun'],
          data: [120000, 150000, 180000, 200000, 220000, 250000]
        },
        users: {
          labels: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun'],
          data: [50, 75, 100, 125, 150, 175]
        }
      }
    };

    console.log('✅ Admin analytics fetched successfully');

    return NextResponse.json({
      success: true,
      analytics
    });

  } catch (error) {
    console.error('❌ Error fetching admin analytics:', error);
    return NextResponse.json({
      success: false,
      error: 'Failed to fetch analytics',
      message: error instanceof Error ? error.message : 'Unknown error'
    }, { status: 500 });
  }
}