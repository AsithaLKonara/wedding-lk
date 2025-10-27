import { NextRequest, NextResponse } from 'next/server'
import { requireAuth } from '@/lib/api-auth'
import { connectDB } from '@/lib/db'
import { User, Booking, Vendor, Venue } from '@/lib/models'

export async function GET(request: NextRequest) {
  try {
    const authResult = await requireAuth(request)
    
    if (!authResult.authorized || !authResult.user) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      )
    }

    const user = authResult.user
    await connectDB()

    // Get user statistics
    const totalBookings = await Booking.countDocuments({ userId: user.id })
    const totalFavorites = await User.findById(user.id).then(u => u?.favorites?.length || 0)
    const totalSpent = await Booking.aggregate([
      { $match: { userId: user.id, status: { $in: ['confirmed', 'completed'] } } },
      { $group: { _id: null, total: { $sum: '$totalPrice' } } }
    ]).then(result => result[0]?.total || 0)

    // Get recent bookings
    const recentBookings = await Booking.find({ userId: user.id })
      .sort({ createdAt: -1 })
      .limit(5)
      .populate('vendorId', 'name businessName')
      .populate('venueId', 'name')

    const stats = {
      user: {
        id: user.id,
        name: user.name,
        email: user.email,
        role: user.role
      },
      stats: {
        totalBookings,
        totalFavorites,
        totalSpent,
        upcomingBookings: totalBookings,
        completedBookings: 0
      },
      recentBookings: recentBookings.map(booking => ({
        id: booking._id.toString(),
        vendor: booking.vendorId?.name || booking.vendorId?.businessName || 'Unknown',
        venue: booking.venueId?.name || 'Unknown',
        date: booking.date,
        status: booking.status
      }))
    }

    return NextResponse.json({ success: true, data: stats })
  } catch (error) {
    console.error('User dashboard error:', error)
    return NextResponse.json(
      { error: 'Failed to fetch dashboard data' },
      { status: 500 }
    )
  }
}

