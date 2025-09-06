import { NextRequest, NextResponse } from 'next/server';
import { connectDB } from '@/lib/db';
import { getServerSession } from '@/lib/auth-utils';
import { User, Vendor, Venue, Booking, Payment, Review, Task, Post, Notification } from '@/lib/models';

export async function GET(request: NextRequest) {
  try {
    const session = await getServerSession();
    
    if (!session?.user?.email) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    await connectDB();

    const user = await User.findOne({ email: session.user.email });
    if (!user) {
      return NextResponse.json({ error: "User not found" }, { status: 404 });
    }

    const { searchParams } = new URL(request.url);
    const page = parseInt(searchParams.get('page') || '1');
    const limit = parseInt(searchParams.get('limit') || '20');
    const unreadOnly = searchParams.get('unreadOnly') === 'true';

    console.log('📊 Fetching notifications from MongoDB Atlas...');

    // Build query
    const query: any = { userId: user._id };
    
    if (unreadOnly) {
      query.isRead = false;
    }

    // Calculate skip value for pagination
    const skip = (page - 1) * limit;

    // Execute query with pagination
    const [notifications, total] = await Promise.all([
      Notification.find(query)
        .sort({ createdAt: -1 })
        .skip(skip)
        .limit(limit)
        .lean(),
      Notification.countDocuments(query)
    ]);

    console.log(`✅ Found ${notifications.length} notifications`);

    return NextResponse.json({
      success: true,
      notifications,
      pagination: {
        total,
        page,
        limit,
        totalPages: Math.ceil(total / limit)
      }
    });

  } catch (error) {
    console.error('❌ Error fetching notifications:', error);
    return NextResponse.json({
      success: false,
      error: 'Failed to fetch notifications',
      message: error instanceof Error ? error.message : 'Unknown error'
    }, { status: 500 });
  }
}

export async function POST(request: NextRequest) {
  try {
    const session = await getServerSession();
    
    if (!session?.user?.email) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    await connectDB();

    const user = await User.findOne({ email: session.user.email });
    if (!user) {
      return NextResponse.json({ error: "User not found" }, { status: 404 });
    }

    const notificationData = await request.json();
    
    console.log('📝 Creating new notification...');

    // Validate required fields
    if (!notificationData.type || !notificationData.title || !notificationData.message) {
      return NextResponse.json({
        success: false,
        error: 'Type, title, and message are required'
      }, { status: 400 });
    }

    // Create notification
    const newNotification = new Notification({
      userId: user._id,
      type: notificationData.type,
      title: notificationData.title,
      message: notificationData.message,
      data: notificationData.data || {},
      isRead: false,
      createdAt: new Date(),
      updatedAt: new Date()
    });

    await newNotification.save();

    console.log('✅ Notification created successfully:', newNotification._id);

    return NextResponse.json({
      success: true,
      notification: newNotification,
      message: 'Notification created successfully'
    });

  } catch (error) {
    console.error('❌ Error creating notification:', error);
    return NextResponse.json({
      success: false,
      error: 'Failed to create notification',
      message: error instanceof Error ? error.message : 'Unknown error'
    }, { status: 500 });
  }
}

export async function PUT(request: NextRequest) {
  try {
    const session = await getServerSession();
    
    if (!session?.user?.email) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    await connectDB();

    const user = await User.findOne({ email: session.user.email });
    if (!user) {
      return NextResponse.json({ error: "User not found" }, { status: 404 });
    }

    const { notificationId, action } = await request.json();
    
    console.log('📝 Updating notification...', { notificationId, action });

    if (action === 'markAsRead') {
      // Mark single notification as read
      await Notification.findByIdAndUpdate(notificationId, {
        isRead: true,
        updatedAt: new Date()
      });
    } else if (action === 'markAllAsRead') {
      // Mark all user notifications as read
      await Notification.updateMany(
        { userId: user._id, isRead: false },
        { 
          isRead: true,
          updatedAt: new Date()
        }
      );
    } else if (action === 'delete') {
      // Delete notification
      await Notification.findByIdAndDelete(notificationId);
    }

    console.log('✅ Notification updated successfully');

    return NextResponse.json({
      success: true,
      message: 'Notification updated successfully'
    });

  } catch (error) {
    console.error('❌ Error updating notification:', error);
    return NextResponse.json({
      success: false,
      error: 'Failed to update notification',
      message: error instanceof Error ? error.message : 'Unknown error'
    }, { status: 500 });
  }
}