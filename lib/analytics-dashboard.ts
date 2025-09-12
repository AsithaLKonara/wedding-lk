import { connectDB } from './db';
import { User, Vendor, Venue, Booking, Payment, Review } from './models';

export interface AnalyticsMetrics {
  totalUsers: number;
  totalVendors: number;
  totalVenues: number;
  totalBookings: number;
  totalRevenue: number;
  averageRating: number;
  conversionRate: number;
  monthlyGrowth: {
    users: number;
    vendors: number;
    bookings: number;
    revenue: number;
  };
}

export interface ChartData {
  labels: string[];
  datasets: {
    label: string;
    data: number[];
    backgroundColor?: string;
    borderColor?: string;
  }[];
}

export interface RealTimeData {
  activeUsers: number;
  recentBookings: number;
  pendingPayments: number;
  systemHealth: 'healthy' | 'warning' | 'critical';
}

export class AnalyticsDashboard {
  /**
   * Get comprehensive analytics metrics
   */
  static async getAnalyticsMetrics(): Promise<AnalyticsMetrics> {
    try {
      await connectDB();

      const [
        totalUsers,
        totalVendors,
        totalVenues,
        totalBookings,
        totalRevenue,
        averageRating,
        monthlyGrowth
      ] = await Promise.all([
        User.countDocuments(),
        Vendor.countDocuments(),
        Venue.countDocuments(),
        Booking.countDocuments(),
        Payment.aggregate([
          { $match: { status: 'completed' } },
          { $group: { _id: null, total: { $sum: '$amount' } } }
        ]),
        Review.aggregate([
          { $group: { _id: null, average: { $avg: '$rating' } } }
        ]),
        this.getMonthlyGrowth()
      ]);

      const revenue = totalRevenue[0]?.total || 0;
      const avgRating = averageRating[0]?.average || 0;
      const conversionRate = totalUsers > 0 ? (totalBookings / totalUsers) * 100 : 0;

      return {
        totalUsers,
        totalVendors,
        totalVenues,
        totalBookings,
        totalRevenue: revenue,
        averageRating: Math.round(avgRating * 10) / 10,
        conversionRate: Math.round(conversionRate * 100) / 100,
        monthlyGrowth
      };
    } catch (error) {
      console.error('Analytics metrics error:', error);
      throw error;
    }
  }

  /**
   * Get chart data for different time periods
   */
  static async getChartData(days: number = 30): Promise<ChartData> {
    try {
      await connectDB();

      const endDate = new Date();
      const startDate = new Date();
      startDate.setDate(endDate.getDate() - days);

      // Get daily data
      const dailyData = await this.getDailyData(startDate, endDate);

      const labels = dailyData.map(item => 
        new Date(item.date).toLocaleDateString('en-US', { 
          month: 'short', 
          day: 'numeric' 
        })
      );

      return {
        labels,
        datasets: [
          {
            label: 'Bookings',
            data: dailyData.map(item => item.bookings),
            backgroundColor: 'rgba(59, 130, 246, 0.1)',
            borderColor: 'rgba(59, 130, 246, 1)',
          },
          {
            label: 'Revenue (LKR)',
            data: dailyData.map(item => item.revenue),
            backgroundColor: 'rgba(34, 197, 94, 0.1)',
            borderColor: 'rgba(34, 197, 94, 1)',
          },
          {
            label: 'New Users',
            data: dailyData.map(item => item.newUsers),
            backgroundColor: 'rgba(168, 85, 247, 0.1)',
            borderColor: 'rgba(168, 85, 247, 1)',
          }
        ]
      };
    } catch (error) {
      console.error('Chart data error:', error);
      throw error;
    }
  }

  /**
   * Get real-time data
   */
  static async getRealTimeData(): Promise<RealTimeData> {
    try {
      await connectDB();

      const oneHourAgo = new Date();
      oneHourAgo.setHours(oneHourAgo.getHours() - 1);

      const [
        activeUsers,
        recentBookings,
        pendingPayments
      ] = await Promise.all([
        User.countDocuments({ lastActive: { $gte: oneHourAgo } }),
        Booking.countDocuments({ 
          createdAt: { $gte: oneHourAgo },
          status: { $in: ['pending', 'confirmed'] }
        }),
        Payment.countDocuments({ status: 'pending' })
      ]);

      // Simple system health check
      const systemHealth = this.getSystemHealth(activeUsers, recentBookings, pendingPayments);

      return {
        activeUsers,
        recentBookings,
        pendingPayments,
        systemHealth
      };
    } catch (error) {
      console.error('Real-time data error:', error);
      throw error;
    }
  }

  /**
   * Get vendor-specific analytics
   */
  static async getVendorAnalytics(vendorId: string): Promise<{
    totalBookings: number;
    totalRevenue: number;
    averageRating: number;
    monthlyBookings: number;
    monthlyRevenue: number;
    topVenues: Array<{ name: string; bookings: number; revenue: number }>;
    recentReviews: Array<{ rating: number; comment: string; date: Date }>;
  }> {
    try {
      await connectDB();

      const startOfMonth = new Date();
      startOfMonth.setDate(1);
      startOfMonth.setHours(0, 0, 0, 0);

      const [
        totalBookings,
        totalRevenue,
        averageRating,
        monthlyBookings,
        monthlyRevenue,
        topVenues,
        recentReviews
      ] = await Promise.all([
        Booking.countDocuments({ vendorId }),
        Payment.aggregate([
          { $match: { vendorId, status: 'completed' } },
          { $group: { _id: null, total: { $sum: '$amount' } } }
        ]),
        Review.aggregate([
          { $match: { vendorId } },
          { $group: { _id: null, average: { $avg: '$rating' } } }
        ]),
        Booking.countDocuments({ 
          vendorId, 
          createdAt: { $gte: startOfMonth } 
        }),
        Payment.aggregate([
          { 
            $match: { 
              vendorId, 
              status: 'completed',
              createdAt: { $gte: startOfMonth }
            } 
          },
          { $group: { _id: null, total: { $sum: '$amount' } } }
        ]),
        this.getVendorTopVenues(vendorId),
        this.getVendorRecentReviews(vendorId)
      ]);

      return {
        totalBookings,
        totalRevenue: totalRevenue[0]?.total || 0,
        averageRating: averageRating[0]?.average || 0,
        monthlyBookings,
        monthlyRevenue: monthlyRevenue[0]?.total || 0,
        topVenues,
        recentReviews
      };
    } catch (error) {
      console.error('Vendor analytics error:', error);
      throw error;
    }
  }

  /**
   * Get user-specific analytics
   */
  static async getUserAnalytics(userId: string): Promise<{
    totalBookings: number;
    totalSpent: number;
    favoriteCategories: Array<{ category: string; count: number }>;
    upcomingEvents: Array<{ name: string; date: Date; venue: string }>;
    recentActivity: Array<{ type: string; description: string; date: Date }>;
  }> {
    try {
      await connectDB();

      const [
        totalBookings,
        totalSpent,
        favoriteCategories,
        upcomingEvents,
        recentActivity
      ] = await Promise.all([
        Booking.countDocuments({ userId }),
        Payment.aggregate([
          { $match: { userId, status: 'completed' } },
          { $group: { _id: null, total: { $sum: '$amount' } } }
        ]),
        this.getUserFavoriteCategories(userId),
        this.getUserUpcomingEvents(userId),
        this.getUserRecentActivity(userId)
      ]);

      return {
        totalBookings,
        totalSpent: totalSpent[0]?.total || 0,
        favoriteCategories,
        upcomingEvents,
        recentActivity
      };
    } catch (error) {
      console.error('User analytics error:', error);
      throw error;
    }
  }

  /**
   * Get monthly growth data
   */
  private static async getMonthlyGrowth(): Promise<{
    users: number;
    vendors: number;
    bookings: number;
    revenue: number;
  }> {
    const startOfMonth = new Date();
    startOfMonth.setDate(1);
    startOfMonth.setHours(0, 0, 0, 0);

    const startOfLastMonth = new Date(startOfMonth);
    startOfLastMonth.setMonth(startOfLastMonth.getMonth() - 1);

    const [
      currentMonthUsers,
      lastMonthUsers,
      currentMonthVendors,
      lastMonthVendors,
      currentMonthBookings,
      lastMonthBookings,
      currentMonthRevenue,
      lastMonthRevenue
    ] = await Promise.all([
      User.countDocuments({ createdAt: { $gte: startOfMonth } }),
      User.countDocuments({ 
        createdAt: { $gte: startOfLastMonth, $lt: startOfMonth } 
      }),
      Vendor.countDocuments({ createdAt: { $gte: startOfMonth } }),
      Vendor.countDocuments({ 
        createdAt: { $gte: startOfLastMonth, $lt: startOfMonth } 
      }),
      Booking.countDocuments({ createdAt: { $gte: startOfMonth } }),
      Booking.countDocuments({ 
        createdAt: { $gte: startOfLastMonth, $lt: startOfMonth } 
      }),
      Payment.aggregate([
        { 
          $match: { 
            status: 'completed',
            createdAt: { $gte: startOfMonth } 
          } 
        },
        { $group: { _id: null, total: { $sum: '$amount' } } }
      ]),
      Payment.aggregate([
        { 
          $match: { 
            status: 'completed',
            createdAt: { $gte: startOfLastMonth, $lt: startOfMonth } 
          } 
        },
        { $group: { _id: null, total: { $sum: '$amount' } } }
      ])
    ]);

    const calculateGrowth = (current: number, last: number) => 
      last > 0 ? ((current - last) / last) * 100 : 0;

    return {
      users: calculateGrowth(currentMonthUsers, lastMonthUsers),
      vendors: calculateGrowth(currentMonthVendors, lastMonthVendors),
      bookings: calculateGrowth(currentMonthBookings, lastMonthBookings),
      revenue: calculateGrowth(
        currentMonthRevenue[0]?.total || 0,
        lastMonthRevenue[0]?.total || 0
      )
    };
  }

  /**
   * Get daily data for charts
   */
  private static async getDailyData(startDate: Date, endDate: Date) {
    const dailyData = [];
    const currentDate = new Date(startDate);

    while (currentDate <= endDate) {
      const nextDate = new Date(currentDate);
      nextDate.setDate(nextDate.getDate() + 1);

      const [bookings, revenue, newUsers] = await Promise.all([
        Booking.countDocuments({
          createdAt: { $gte: currentDate, $lt: nextDate }
        }),
        Payment.aggregate([
          {
            $match: {
              status: 'completed',
              createdAt: { $gte: currentDate, $lt: nextDate }
            }
          },
          { $group: { _id: null, total: { $sum: '$amount' } } }
        ]),
        User.countDocuments({
          createdAt: { $gte: currentDate, $lt: nextDate }
        })
      ]);

      dailyData.push({
        date: currentDate.toISOString(),
        bookings,
        revenue: revenue[0]?.total || 0,
        newUsers
      });

      currentDate.setDate(currentDate.getDate() + 1);
    }

    return dailyData;
  }

  /**
   * Get system health status
   */
  private static getSystemHealth(
    activeUsers: number,
    recentBookings: number,
    pendingPayments: number
  ): 'healthy' | 'warning' | 'critical' {
    if (pendingPayments > 100 || activeUsers === 0) {
      return 'critical';
    }
    if (pendingPayments > 50 || recentBookings === 0) {
      return 'warning';
    }
    return 'healthy';
  }

  /**
   * Get vendor's top venues
   */
  private static async getVendorTopVenues(vendorId: string) {
    return Booking.aggregate([
      { $match: { vendorId } },
      { $group: { _id: '$venueId', bookings: { $sum: 1 } } },
      { $lookup: { from: 'venues', localField: '_id', foreignField: '_id', as: 'venue' } },
      { $unwind: '$venue' },
      { $project: { name: '$venue.name', bookings: 1, revenue: 0 } },
      { $sort: { bookings: -1 } },
      { $limit: 5 }
    ]);
  }

  /**
   * Get vendor's recent reviews
   */
  private static async getVendorRecentReviews(vendorId: string) {
    const reviews = await Review.find({ vendorId })
      .sort({ createdAt: -1 })
      .limit(5)
      .select('rating comment createdAt')
      .lean();
    
    return reviews.map(review => ({
      rating: review.rating,
      comment: review.comment,
      date: review.createdAt
    }));
  }

  /**
   * Get user's favorite categories
   */
  private static async getUserFavoriteCategories(userId: string) {
    return Booking.aggregate([
      { $match: { userId } },
      { $lookup: { from: 'vendors', localField: 'vendorId', foreignField: '_id', as: 'vendor' } },
      { $unwind: '$vendor' },
      { $group: { _id: '$vendor.category', count: { $sum: 1 } } },
      { $project: { category: '$_id', count: 1, _id: 0 } },
      { $sort: { count: -1 } },
      { $limit: 5 }
    ]);
  }

  /**
   * Get user's upcoming events
   */
  private static async getUserUpcomingEvents(userId: string) {
    const now = new Date();
    const bookings = await Booking.find({
      userId,
      eventDate: { $gte: now },
      status: { $in: ['confirmed', 'pending'] }
    })
      .populate('venueId', 'name')
      .sort({ eventDate: 1 })
      .limit(5)
      .select('eventDate venueId')
      .lean();
    
    return bookings.map(booking => ({
      name: `Event at ${booking.venueId?.name || 'Unknown Venue'}`,
      date: booking.eventDate,
      venue: booking.venueId?.name || 'Unknown Venue'
    }));
  }

  /**
   * Get user's recent activity
   */
  private static async getUserRecentActivity(userId: string) {
    const activities: Array<{ type: string; description: string; date: Date }> = [];
    
    // Recent bookings
    const recentBookings = await Booking.find({ userId })
      .sort({ createdAt: -1 })
      .limit(3)
      .select('createdAt status')
      .lean();

    recentBookings.forEach(booking => {
      activities.push({
        type: 'booking',
        description: `Booking ${booking.status}`,
        date: booking.createdAt
      });
    });

    // Recent reviews
    const recentReviews = await Review.find({ userId })
      .sort({ createdAt: -1 })
      .limit(3)
      .select('createdAt rating')
      .lean();

    recentReviews.forEach(review => {
      activities.push({
        type: 'review',
        description: `Posted ${review.rating}-star review`,
        date: review.createdAt
      });
    });

    return activities.sort((a, b) => b.date.getTime() - a.date.getTime()).slice(0, 10);
  }
}