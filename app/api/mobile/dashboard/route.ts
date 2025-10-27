import { NextRequest, NextResponse } from 'next/server'
import { requireAuth } from '@/lib/api-auth'
import { connectDB } from '@/lib/db'
import { Booking, User } from '@/lib/models'

export async function GET(request: NextRequest) {
  try {
    const authResult = await requireAuth(request)
    
    if (!authResult.authorized || !authResult.user) {
      return NextResponse.json(
        { success: false, error: 'Unauthorized' },
        { status: 401 }
      )
    }

    await connectDB()

    const user = await User.findById(authResult.user.id)
    if (!user) {
      return NextResponse.json(
        { success: false, error: 'User not found' },
        { status: 404 }
      )
    }

    // Get user statistics (lightweight for mobile)
    const totalBookings = await Booking.countDocuments({ userId: user._id })
    const totalFavorites = user.favorites?.length || 0
    
    // Get recent bookings (limit to 3 for mobile)
    const recentBookings = await Booking.find({ userId: user._id })
      .sort({ createdAt: -1 })
      .limit(3)
      .select('_id status createdAt eventDate totalPrice')
      .lean()

    // Mobile-optimized response
    const dashboardData = {
      user: {
        id: user._id.toString(),
        name: user.name,
        email: user.email,
        role: user.role
      },
      stats: {
        totalBookings,
        totalFavorites,
        upcomingBookings: await Booking.countDocuments({ 
          userId: user._id, 
          status: { $in: ['confirmed', 'pending'] }
        })
      },
      recentBookings: recentBookings.map(b => ({
        id: b._id.toString(),
        date: b.eventDate,
        status: b.status,
        amount: b.totalPrice
      })),
      notifications: {
        unread: 0, // TODO: implement notification count
        recent: []
      }
    }

    return NextResponse.json({
      success: true,
      data: dashboardData
    })
  } catch (error) {
    console.error('Mobile dashboard error:', error)
    return NextResponse.json(
      { success: false, error: 'Failed to fetch dashboard data' },
      { status: 500 }
    )
  }
}

