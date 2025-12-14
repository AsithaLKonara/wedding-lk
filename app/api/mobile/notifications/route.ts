import { NextRequest, NextResponse } from 'next/server'
import { requireAuth } from '@/lib/api-auth'
import { connectDB } from '@/lib/db'
import { Notification, User } from '@/lib/models'

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

    // Get unread count
    const unreadCount = await Notification.countDocuments({
      userId: user._id,
      isRead: false
    })

    // Get recent notifications (last 10)
    const recentNotifications = await Notification.find({
      userId: user._id
    })
      .sort({ createdAt: -1 })
      .limit(10)
      .select('title message type isRead createdAt')
      .lean()

    return NextResponse.json({
      success: true,
      notifications: {
        unreadCount,
        recent: recentNotifications
      }
    })
  } catch (error) {
    console.error('Mobile notifications error:', error)
    return NextResponse.json(
      { success: false, error: 'Failed to fetch notifications' },
      { status: 500 }
    )
  }
}

