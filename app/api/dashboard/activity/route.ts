import { NextRequest, NextResponse } from 'next/server'
import { RBACManager, AuthHelpers } from '@/lib/rbac'
import { connectDB } from '@/lib/db'
import { Booking } from '@/lib/models/booking'
import { User } from '@/lib/models/user'

export async function GET(request: NextRequest) {
  try {
    // Get authenticated user
    const authResult = await AuthHelpers.getAuthenticatedUser(request)
    
    if (!authResult.success || !authResult.user) {
      return NextResponse.json(
        { error: 'Authentication required' },
        { status: 401 }
      )
    }

    const user = authResult.user
    await connectDB()

    let activities = []

    if (RBACManager.hasRole(user, ['admin', 'maintainer'])) {
      // Admin activities
      const recentBookings = await Booking.find()
        .sort({ createdAt: -1 })
        .limit(10)
        .populate('userId', 'name email')
        .populate('vendorId', 'name email')

      activities = recentBookings.map(booking => ({
        id: booking._id.toString(),
        type: 'booking',
        message: `New booking from ${booking.userId?.name || 'Unknown User'}`,
        timestamp: booking.createdAt.toISOString(),
        priority: 'high' as const
      }))
    } else if (RBACManager.hasRole(user, ['vendor'])) {
      // Vendor activities
      const vendorBookings = await Booking.find({ vendorId: user.id })
        .sort({ createdAt: -1 })
        .limit(10)
        .populate('userId', 'name email')

      activities = vendorBookings.map(booking => ({
        id: booking._id.toString(),
        type: 'booking',
        message: `New booking from ${booking.userId?.name || 'Unknown User'}`,
        timestamp: booking.createdAt.toISOString(),
        priority: booking.status === 'pending' ? 'high' as const : 'medium' as const
      }))
    } else {
      // User activities
      const userBookings = await Booking.find({ userId: user.id })
        .sort({ createdAt: -1 })
        .limit(10)
        .populate('vendorId', 'name email')

      activities = userBookings.map(booking => ({
        id: booking._id.toString(),
        type: 'booking',
        message: `Booking with ${booking.vendorId?.name || 'Unknown Vendor'} ${booking.status}`,
        timestamp: booking.createdAt.toISOString(),
        priority: booking.status === 'confirmed' ? 'high' as const : 'medium' as const
      }))
    }

    // Add some mock activities for demonstration
    activities = [
      ...activities,
      {
        id: 'mock-1',
        type: 'payment',
        message: 'Payment received successfully',
        timestamp: new Date(Date.now() - 2 * 60 * 60 * 1000).toISOString(),
        priority: 'medium' as const
      },
      {
        id: 'mock-2',
        type: 'review',
        message: 'New review posted',
        timestamp: new Date(Date.now() - 24 * 60 * 60 * 1000).toISOString(),
        priority: 'low' as const
      }
    ]

    return NextResponse.json({
      success: true,
      activities: activities.slice(0, 10) // Limit to 10 activities
    })

  } catch (error) {
    console.error('Dashboard activity error:', error)
    return NextResponse.json(
      { error: 'Failed to fetch dashboard activity' },
      { status: 500 }
    )
  }
}
