import { NextRequest, NextResponse } from 'next/server'
import { connectDB } from '@/lib/db'
import { User, Venue, Vendor, Booking } from '@/lib/models'
import { verifyToken } from '@/lib/auth/custom-auth'

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

    await connectDB()

    // Get dashboard data based on user role
    const dashboardData = await getDashboardData(user.role, user.id)

    return NextResponse.json({ 
      success: true, 
      dashboard: dashboardData,
      user: {
        id: user.id,
        name: user.name,
        email: user.email,
        role: user.role
      }
    })
  } catch (error) {
    console.error('[Dashboard API] Error:', error)
    return NextResponse.json(
      { error: 'Failed to fetch dashboard data', message: error instanceof Error ? error.message : 'Unknown error' },
      { status: 500 }
    )
  }
}

async function getDashboardData(role: string, userId: string) {
  const baseData = {
    totalUsers: 0,
    totalVenues: 0,
    totalVendors: 0,
    totalBookings: 0,
    recentBookings: [],
    stats: {
      usersOnline: 0,
      activeListings: 0,
      bookingsThisMonth: 0
    }
  }

  try {
    // Get basic counts
    const [userCount, venueCount, vendorCount, bookingCount] = await Promise.all([
      User.countDocuments({ role: 'user' }),
      Venue.countDocuments({ isActive: true }),
      Vendor.countDocuments({ isActive: true }),
      Booking.countDocuments()
    ])

    // Get recent bookings
    const recentBookings = await Booking.find()
      .populate('userId', 'name email')
      .populate('vendorId', 'businessName')
      .populate('venueId', 'name')
      .sort({ createdAt: -1 })
      .limit(5)
      .lean()

    // Role-specific data
    let roleSpecificData = {}

    if (role === 'admin') {
      roleSpecificData = {
        pendingApprovals: await Vendor.countDocuments({ isVerified: false }),
        totalRevenue: await Booking.aggregate([
          { $match: { status: 'confirmed' } },
          { $group: { _id: null, total: { $sum: '$totalPrice' } } }
        ]).then(result => result[0]?.total || 0),
        monthlyGrowth: 0 // Calculate based on previous month
      }
    } else if (role === 'vendor') {
      const vendorBookings = await Booking.find({ vendorId: userId })
      roleSpecificData = {
        myBookings: vendorBookings.length,
        myRevenue: vendorBookings.reduce((sum, booking) => sum + (booking.totalPrice || 0), 0),
        pendingBookings: await Booking.countDocuments({ vendorId: userId, status: 'pending' })
      }
    } else if (role === 'user') {
      const userBookings = await Booking.find({ userId })
      roleSpecificData = {
        myBookings: userBookings.length,
        myFavorites: 0, // Get from user favorites
        upcomingEvents: await Booking.countDocuments({ 
          userId, 
          eventDate: { $gte: new Date() },
          status: 'confirmed'
        })
      }
    }

    return {
      ...baseData,
      totalUsers: userCount,
      totalVenues: venueCount,
      totalVendors: vendorCount,
      totalBookings: bookingCount,
      recentBookings,
      stats: {
        usersOnline: Math.floor(userCount * 0.1), // Estimate
        activeListings: venueCount + vendorCount,
        bookingsThisMonth: bookingCount
      },
      ...roleSpecificData
    }
  } catch (error) {
    console.error('[Dashboard] Error getting data:', error)
    return baseData
  }
}
