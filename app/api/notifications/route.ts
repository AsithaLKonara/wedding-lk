import { NextRequest, NextResponse } from 'next/server';
import { connectDB } from '@/lib/db';
import { Notification } from '@/lib/models';
import { getUserFromRequest } from '@/lib/auth/get-user-from-request';

export async function GET(request: NextRequest) {
  try {
    // Get authentication user
    const authUser = getUserFromRequest(request);

    // If no user, return empty notifications instead of 401
    if (!authUser) {
      return NextResponse.json({
        success: true,
        notifications: [],
        pagination: {
          page: 1,
          limit: 20,
          total: 0,
          pages: 0
        }
      });
    }

    await connectDB();

    const { searchParams } = new URL(request.url);
    const limit = parseInt(searchParams.get('limit') || '20');
    const page = parseInt(searchParams.get('page') || '1');
    const skip = (page - 1) * limit;

    // Get notifications for the user
    const notifications = await Notification.find({
      userId: authUser.id
    })
    .sort({ createdAt: -1 })
    .skip(skip)
    .limit(limit)
    .lean();

    const total = await Notification.countDocuments({
      userId: authUser.id
    });

    return NextResponse.json({
      success: true,
      notifications,
      pagination: {
        page,
        limit,
        total,
        pages: Math.ceil(total / limit)
      }
    });

  } catch (error) {
    console.error('Notifications API error:', error);
    return NextResponse.json({
      success: false,
      message: 'Failed to fetch notifications',
      error: error instanceof Error ? error.message : String(error)
    }, { status: 500 });
  }
}

export async function POST(request: NextRequest) {
  try {
    // Get authentication user
    const authUser = getUserFromRequest(request);

    // If no user, return success but don't create notification
    if (!authUser) {
      return NextResponse.json({
        success: true,
        message: 'No authentication - notification not created'
      });
    }

    await connectDB();

    const body = await request.json();
    const { type, title, message, data } = body;

    if (!authUser) {
      return NextResponse.json({
        success: false,
        message: 'No authentication - notification not created'
      }, { status: 401 });
    }

    // Create new notification
    const notification = new Notification({
      userId: authUser.id,
      type: type || 'info',
      title: title || 'New Notification',
      message: message || '',
      data: data || {},
      read: false,
      createdAt: new Date()
    });

    await notification.save();

    return NextResponse.json({
      success: true,
      notification,
      message: 'Notification created successfully'
    });

  } catch (error) {
    console.error('Create notification error:', error);
    return NextResponse.json({
      success: false,
      message: 'Failed to create notification',
      error: error instanceof Error ? error.message : String(error)
    }, { status: 500 });
  }
}