import { NextRequest, NextResponse } from 'next/server'
import { connectDB } from '@/lib/db'
import { User, Venue, Vendor, Booking } from '@/lib/models'
import { verifyToken } from '@/lib/auth/custom-auth'
import { apiCache, cacheKeys, cacheTTL } from '@/lib/api-cache'
import { DatabaseOptimizer, APIResponse, QueryOptimizer, ResponseOptimizer, TimeoutHandler } from '@/lib/api-optimization'

export async function GET(request: NextRequest) {
  try {
    // Get authenticated user from token
    const token = request.cookies.get('auth-token')?.value
    
    if (!token) {
      return NextResponse.json(
        { error: 'Unauthorized - missing token' },
        { status: 401 }
      )
    }
    
    const user = verifyToken(token)
    if (!user || !user.id) {
      return NextResponse.json(
        { error: 'Unauthorized - invalid token' },
        { status: 401 }
      )
    }

    // Check cache first
    const cacheKey = cacheKeys.dashboardStats(user.role)
    const cached = apiCache.get(cacheKey)
    if (cached) {
      return NextResponse.json(APIResponse.success(cached))
    }

    // Optimize database operations with timeout
    const dashboardData = await TimeoutHandler.withTimeout(async () => {
      await DatabaseOptimizer.ensureConnection()

      // Get user-specific dashboard data based on role
      const userRole = user.role
      let dashboardData: any = {
        user: ResponseOptimizer.compressUser(user),
        stats: {},
        recentActivity: []
      }

    if (userRole === 'user') {
      // User dashboard stats
      const [totalBookings, confirmedBookings, pendingBookings, favoriteVenues] = await Promise.all([
        Booking.countDocuments({ userId: user.id }),
        Booking.countDocuments({ userId: user.id, status: 'confirmed' }),
        Booking.countDocuments({ userId: user.id, status: 'pending' }),
        User.findById(user.id).select('favorites').populate('favorites').lean()
      ])

      dashboardData.stats = {
        totalBookings,
        confirmedBookings,
        pendingBookings,
        favoriteVenues: favoriteVenues?.favorites?.length || 0
      }

      // Recent bookings
      const recentBookings = await Booking.find({ userId: user.id })
        .populate('venueId', 'name location')
        .populate('vendorId', 'businessName category')
        .sort({ createdAt: -1 })
        .limit(5)
        .lean()

      dashboardData.recentActivity = recentBookings.map(booking => ({
        type: 'booking',
        title: `Booking for ${booking.venueId?.name || 'Unknown Venue'}`,
        date: booking.createdAt,
        status: booking.status
      }))

    } else if (userRole === 'vendor') {
      // Vendor dashboard stats
      const [totalBookings, confirmedBookings, pendingBookings, totalRevenue] = await Promise.all([
        Booking.countDocuments({ vendorId: user.id }),
        Booking.countDocuments({ vendorId: user.id, status: 'confirmed' }),
        Booking.countDocuments({ vendorId: user.id, status: 'pending' }),
        Booking.aggregate([
          { $match: { vendorId: user.id, status: 'confirmed' } },
          { $group: { _id: null, total: { $sum: '$totalPrice' } } }
        ])
      ])

      dashboardData.stats = {
        totalBookings,
        confirmedBookings,
        pendingBookings,
        totalRevenue: totalRevenue[0]?.total || 0
      }

      // Recent bookings for vendor
      const recentBookings = await Booking.find({ vendorId: user.id })
        .populate('userId', 'name email')
        .populate('venueId', 'name location')
        .sort({ createdAt: -1 })
        .limit(5)
        .lean()

      dashboardData.recentActivity = recentBookings.map(booking => ({
        type: 'booking',
        title: `Booking from ${booking.userId?.name || 'Unknown User'}`,
        date: booking.createdAt,
        status: booking.status
      }))

    } else if (userRole === 'admin') {
      // Admin dashboard stats
      const [totalUsers, totalVenues, totalVendors, totalBookings, totalRevenue] = await Promise.all([
        User.countDocuments({ role: 'user' }),
        Venue.countDocuments({ isActive: true }),
        Vendor.countDocuments({ isActive: true }),
        Booking.countDocuments(),
        Booking.aggregate([
          { $match: { status: 'confirmed' } },
          { $group: { _id: null, total: { $sum: '$totalPrice' } } }
        ])
      ])

      dashboardData.stats = {
        totalUsers,
        totalVenues,
        totalVendors,
        totalBookings,
        totalRevenue: totalRevenue[0]?.total || 0
      }

      // Recent activity for admin
      const recentBookings = await Booking.find()
        .populate('userId', 'name email')
        .populate('venueId', 'name')
        .populate('vendorId', 'businessName')
        .sort({ createdAt: -1 })
        .limit(5)
        .lean()

      dashboardData.recentActivity = recentBookings.map(booking => ({
        type: 'booking',
        title: `New booking: ${booking.venueId?.name || 'Unknown Venue'}`,
        date: booking.createdAt,
        status: booking.status
      }))
    }

      return dashboardData
    }, 8000, 'Dashboard data fetch timed out')

    // Cache the result
    apiCache.set(cacheKey, dashboardData, cacheTTL.MEDIUM)

    return NextResponse.json(APIResponse.success(dashboardData))

  } catch (error) {
    console.error('[Dashboard API] Error:', error)
    return NextResponse.json(
      APIResponse.error('Failed to fetch dashboard data', 'DASHBOARD_ERROR', error instanceof Error ? error.message : 'Unknown error'),
      { status: 500 }
    )
  }
}