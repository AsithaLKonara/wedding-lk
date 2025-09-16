import { NextRequest, NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'
import { connectDB } from '@/lib/mongodb'
import { Notification } from '@/lib/models'

export async function GET(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions)
    
    if (!session?.user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const { searchParams } = new URL(request.url)
    const unreadOnly = searchParams.get('unreadOnly') === 'true'
    const limit = parseInt(searchParams.get('limit') || '20')
    const page = parseInt(searchParams.get('page') || '1')

    await connectDB()

    const query: any = { userId: session.user.id }
    if (unreadOnly) {
      query.read = false
    }

    const notifications = await Notification.find(query)
      .populate('relatedId')
      .sort({ createdAt: -1 })
      .limit(limit)
      .skip((page - 1) * limit)

    const totalCount = await Notification.countDocuments(query)
    const unreadCount = await Notification.countDocuments({ userId: session.user.id, read: false })

    return NextResponse.json({
      success: true,
      notifications,
      pagination: {
        page,
        limit,
        totalCount,
        totalPages: Math.ceil(totalCount / limit),
        hasNext: page < Math.ceil(totalCount / limit),
        hasPrev: page > 1
      },
      unreadCount
    })
  } catch (error) {
    console.error('Error fetching notifications:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}

export async function POST(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions)
    
    if (!session?.user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const { userId, type, title, message, relatedId, relatedType } = await request.json()

    if (!userId || !type || !title || !message) {
      return NextResponse.json({ error: 'Missing required fields' }, { status: 400 })
    }

    await connectDB()

    const notification = new Notification({
      userId,
      type,
      title,
      message,
      relatedId: relatedId || null,
      relatedType: relatedType || null,
      read: false,
      createdAt: new Date()
    })

    await notification.save()

    // In a real application, you would send a push notification here
    // For now, we'll just return the created notification

    return NextResponse.json({ success: true, notification })
  } catch (error) {
    console.error('Error creating notification:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}

export async function PUT(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions)
    
    if (!session?.user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const { notificationId, read } = await request.json()

    if (!notificationId) {
      return NextResponse.json({ error: 'Missing notification ID' }, { status: 400 })
    }

    await connectDB()

    const notification = await Notification.findOneAndUpdate(
      { _id: notificationId, userId: session.user.id },
      { read: read !== undefined ? read : true },
      { new: true }
    )

    if (!notification) {
      return NextResponse.json({ error: 'Notification not found' }, { status: 404 })
    }

    return NextResponse.json({ success: true, notification })
  } catch (error) {
    console.error('Error updating notification:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}