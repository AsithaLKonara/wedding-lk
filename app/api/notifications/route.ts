import { NextRequest, NextResponse } from 'next/server';
import { connectDB } from '@/lib/db';
import { Notification } from '@/lib/models';
import { getToken } from 'next-auth/jwt';

export async function GET(request: NextRequest) {
  try {
    // Get authentication token
    const token = await getToken({ 
      req: request, 
      secret: process.env.NEXTAUTH_SECRET 
    });

    // If no token, return empty notifications instead of 401
    if (!token) {
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
      userId: token.userId || token.sub
    })
    .sort({ createdAt: -1 })
    .skip(skip)
    .limit(limit)
    .lean();

    const total = await Notification.countDocuments({
      userId: token.userId || token.sub
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
      error: error.message
    }, { status: 500 });
  }
}

export async function POST(request: NextRequest) {
  try {
    // Get authentication token
    const token = await getToken({ 
      req: request, 
      secret: process.env.NEXTAUTH_SECRET 
    });

    // If no token, return success but don't create notification
    if (!token) {
      return NextResponse.json({
        success: true,
        message: 'No authentication - notification not created'
      });
    }

    await connectDB();

    const body = await request.json();
    const { type, title, message, data } = body;

    // Create new notification
    const notification = new Notification({
      userId: token.userId || token.sub,
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
      error: error.message
    }, { status: 500 });
  }
}