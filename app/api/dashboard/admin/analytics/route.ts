import { NextRequest, NextResponse } from "next/server"
import { connectDB } from "@/lib/db"
import { User } from "@/lib/models/user"
import { Vendor } from "@/lib/models/vendor"
import { Venue } from "@/lib/models/venue"
import { Booking } from "@/lib/models/booking"
import { Payment } from "@/lib/models/Payment"
import { Review } from "@/lib/models/review"
import { getServerSession } from '@/lib/auth-utils';

// Cache for analytics data (5 minutes)
const analyticsCache = new Map();
const CACHE_DURATION = 5 * 60 * 1000; // 5 minutes

export async function GET(request: NextRequest) {
  try {
    const session = await getServerSession()
    if (!session || session.user?.role !== 'admin') {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    const { searchParams } = new URL(request.url)
    const period = searchParams.get('period') || '30' // days
    const forceRefresh = searchParams.get('refresh') === 'true'

    // Check cache first
    const cacheKey = `analytics_${period}_${session.user.id}`
    if (!forceRefresh && analyticsCache.has(cacheKey)) {
      const cached = analyticsCache.get(cacheKey)
      if (Date.now() - cached.timestamp < CACHE_DURATION) {
        console.log('📊 Returning cached analytics data')
        return NextResponse.json({ analytics: cached.data })
      }
    }

    console.log('📊 Fetching fresh analytics data for period:', period)
    await connectDB()

    // Calculate date range
    const endDate = new Date()
    const startDate = new Date()
    startDate.setDate(startDate.getDate() - parseInt(period))

    // Get user growth analytics
    const userGrowth = await User.aggregate([
      {
        $match: {
          createdAt: { $gte: startDate, $lte: endDate }
        }
      },
      {
        $group: {
          _id: { $dateToString: { format: "%Y-%m-%d", date: "$createdAt" } },
          count: { $sum: 1 }
        }
      },
      { $sort: { _id: 1 } }
    ])

    // Get vendor growth analytics
    const vendorGrowth = await Vendor.aggregate([
      {
        $match: {
          createdAt: { $gte: startDate, $lte: endDate }
        }
      },
      {
        $group: {
          _id: { $dateToString: { format: "%Y-%m-%d", date: "$createdAt" } },
          count: { $sum: 1 }
        }
      },
      { $sort: { _id: 1 } }
    ])

    // Get revenue analytics
    const revenueStats = await Payment.aggregate([
      {
        $match: {
          status: 'completed',
          createdAt: { $gte: startDate, $lte: endDate }
        }
      },
      {
        $group: {
          _id: { $dateToString: { format: "%Y-%m-%d", date: "$createdAt" } },
          revenue: { $sum: "$amount" },
          count: { $sum: 1 }
        }
      },
      { $sort: { _id: 1 } }
    ])

    // Get booking analytics
    const bookingStats = await Booking.aggregate([
      {
        $match: {
          date: { $gte: startDate, $lte: endDate }
        }
      },
      {
        $group: {
          _id: { $dateToString: { format: "%Y-%m-%d", date: "$date" } },
          count: { $sum: 1 },
          revenue: { $sum: "$totalAmount" }
        }
      },
      { $sort: { _id: 1 } }
    ])

    // Get category performance
    const categoryPerformance = await Vendor.aggregate([
      {
        $lookup: {
          from: 'bookings',
          localField: '_id',
          foreignField: 'vendor',
          as: 'bookings'
        }
      },
      {
        $addFields: {
          totalBookings: { $size: '$bookings' },
          totalRevenue: {
            $sum: '$bookings.totalAmount'
          }
        }
      },
      {
        $group: {
          _id: '$category',
          vendorCount: { $sum: 1 },
          totalBookings: { $sum: '$totalBookings' },
          totalRevenue: { $sum: '$totalRevenue' },
          averageRating: { $avg: '$rating.average' }
        }
      },
      { $sort: { totalRevenue: -1 } }
    ])

    // Get geographic distribution
    const geographicDistribution = await Vendor.aggregate([
      {
        $group: {
          _id: '$location.province',
          vendorCount: { $sum: 1 },
          averageRating: { $avg: '$rating.average' }
        }
      },
      { $sort: { vendorCount: -1 } }
    ])

    // Get platform statistics
    const platformStats = {
      totalUsers: await User.countDocuments({ role: 'user' }),
      totalVendors: await Vendor.countDocuments(),
      totalVenues: await Venue.countDocuments(),
      totalBookings: await Booking.countDocuments(),
      totalRevenue: await Payment.aggregate([
        { $match: { status: 'completed' } },
        { $group: { _id: null, total: { $sum: '$amount' } } }
      ]).then(result => result[0]?.total || 0),
      averageRating: await Review.aggregate([
        { $group: { _id: null, average: { $avg: '$rating' } } }
      ]).then(result => result[0]?.average || 0)
    }

    // Get recent activity
    const recentActivity = await Promise.all([
      User.find().sort({ createdAt: -1 }).limit(5).select('name email role createdAt'),
      Vendor.find().sort({ createdAt: -1 }).limit(5).select('businessName category createdAt'),
      Booking.find().sort({ createdAt: -1 }).limit(5).populate('client', 'name').populate('vendor', 'businessName')
    ])

    const analytics = {
      period: `${period} days`,
      dateRange: { start: startDate, end: endDate },
      userGrowth: {
        data: userGrowth,
        total: userGrowth.reduce((sum, item) => sum + item.count, 0)
      },
      vendorGrowth: {
        data: vendorGrowth,
        total: vendorGrowth.reduce((sum, item) => sum + item.count, 0)
      },
      revenue: {
        data: revenueStats,
        total: revenueStats.reduce((sum, item) => sum + item.revenue, 0),
        average: revenueStats.length > 0 ? revenueStats.reduce((sum, item) => sum + item.revenue, 0) / revenueStats.length : 0
      },
      bookings: {
        data: bookingStats,
        total: bookingStats.reduce((sum, item) => sum + item.count, 0)
      },
      categories: categoryPerformance,
      geography: geographicDistribution,
      platform: platformStats,
      recentActivity: {
        users: recentActivity[0],
        vendors: recentActivity[1],
        bookings: recentActivity[2]
      }
    }

    // Cache the results
    analyticsCache.set(cacheKey, {
      data: analytics,
      timestamp: Date.now()
    })

    // Clean old cache entries
    for (const [key, value] of analyticsCache.entries()) {
      if (Date.now() - value.timestamp > CACHE_DURATION) {
        analyticsCache.delete(key)
      }
    }

    console.log('📊 Analytics data fetched and cached successfully')
    return NextResponse.json({ analytics })

  } catch (error) {
    console.error("❌ Error fetching admin analytics:", error)
    
    // Return cached data if available during error
    const cacheKey = `analytics_${period}_${session?.user?.id}`
    if (analyticsCache.has(cacheKey)) {
      console.log('📊 Returning cached data due to error')
      const cached = analyticsCache.get(cacheKey)
      return NextResponse.json({ analytics: cached.data })
    }
    
    return NextResponse.json(
      { 
        error: "Failed to fetch analytics",
        message: error.message,
        timestamp: new Date().toISOString()
      },
      { status: 500 }
    )
  }
} 