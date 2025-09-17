import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import { monitoringService } from '@/lib/monitoring';
import { connectDB } from '@/lib/mongodb';
import { User, Booking, Vendor, Venue } from '@/lib/models';

export async function GET(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions);
    
    if (!session?.user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    // Get time range (default to last 24 hours)
    const { searchParams } = new URL(request.url);
    const hours = parseInt(searchParams.get('hours') || '24');
    const timeRange = {
      start: new Date(Date.now() - hours * 60 * 60 * 1000),
      end: new Date()
    };

    await connectDB();

    // Get business metrics from database
    const totalUsers = await User.countDocuments();
    const totalBookings = await Booking.countDocuments();
    const totalVendors = await Vendor.countDocuments();
    const totalVenues = await Venue.countDocuments();

    // Get recent bookings for revenue calculation
    const recentBookings = await Booking.find({
      createdAt: { $gte: timeRange.start }
    }).select('payment.amount');

    const totalRevenue = recentBookings.reduce((sum, booking) => {
      return sum + (booking.payment?.amount || 0);
    }, 0);

    const averageBookingValue = totalBookings > 0 ? totalRevenue / totalBookings : 0;
    const conversionRate = totalUsers > 0 ? (totalBookings / totalUsers) * 100 : 0;

    // Log business metrics
    monitoringService.logBusinessMetrics({
      totalUsers,
      activeUsers: totalUsers, // Simplified - in production, track active users separately
      totalBookings,
      totalRevenue,
      conversionRate,
      averageBookingValue
    });

    // Get all metrics
    const apiMetrics = monitoringService.getApiMetrics(timeRange);
    const performanceMetrics = monitoringService.getPerformanceMetrics(timeRange);
    const businessMetrics = monitoringService.getBusinessMetrics(timeRange);
    const healthStatus = monitoringService.getHealthStatus();

    // Calculate additional metrics
    const dashboardData = {
      overview: {
        health: healthStatus,
        totalUsers,
        totalBookings,
        totalVendors,
        totalVenues,
        totalRevenue: Math.round(totalRevenue * 100) / 100,
        conversionRate: Math.round(conversionRate * 100) / 100,
        averageBookingValue: Math.round(averageBookingValue * 100) / 100
      },
      api: apiMetrics,
      performance: performanceMetrics,
      business: businessMetrics,
      timeRange,
      lastUpdated: new Date()
    };

    return NextResponse.json({
      success: true,
      data: dashboardData
    });

  } catch (error) {
    console.error('Error fetching dashboard data:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
