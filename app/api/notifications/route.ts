import { NextRequest, NextResponse } from 'next/server';
import { connectDB } from '@/lib/db';
import { Notification } from '@/lib/models/notification';

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const limit = parseInt(searchParams.get('limit') || '20');
    const offset = parseInt(searchParams.get('offset') || '0');
    const userId = searchParams.get('userId');

    await connectDB();

    let query = {};
    if (userId) {
      query = { userId };
    }

    const notifications = await Notification.find(query)
      .sort({ createdAt: -1 })
      .limit(limit)
      .skip(offset)
      .lean();

    const total = await Notification.countDocuments(query);

    return NextResponse.json({
      success: true,
      notifications,
      pagination: {
        total,
        limit,
        offset,
        hasMore: offset + limit < total
      }
    });

  } catch (error) {
    console.error('Error fetching notifications:', error);
    return NextResponse.json({
      success: false,
      error: 'Failed to fetch notifications'
    }, { status: 500 });
  }
}

export async function POST(request: NextRequest) {
  try {
    const { userId, type, title, message, data } = await request.json();

    if (!userId || !type || !title || !message) {
      return NextResponse.json({
        success: false,
        error: 'Missing required fields'
      }, { status: 400 });
    }

    await connectDB();

    const notification = new Notification({
      userId,
      type,
      title,
      message,
      data: data || {},
      read: false
    });

    await notification.save();

    return NextResponse.json({
      success: true,
      notification
    });

  } catch (error) {
    console.error('Error creating notification:', error);
    return NextResponse.json({
      success: false,
      error: 'Failed to create notification'
    }, { status: 500 });
  }
}

export async function PUT(request: NextRequest) {
  try {
    const { notificationId, read } = await request.json();

    if (!notificationId) {
      return NextResponse.json({
        success: false,
        error: 'Notification ID is required'
      }, { status: 400 });
    }

    await connectDB();

    const notification = await Notification.findByIdAndUpdate(
      notificationId,
      { read },
      { new: true }
    );

    if (!notification) {
      return NextResponse.json({
        success: false,
        error: 'Notification not found'
      }, { status: 404 });
    }

    return NextResponse.json({
      success: true,
      notification
    });

  } catch (error) {
    console.error('Error updating notification:', error);
    return NextResponse.json({
      success: false,
      error: 'Failed to update notification'
    }, { status: 500 });
  }
}