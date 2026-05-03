import { NextRequest, NextResponse } from 'next/server';
import { getUserFromRequestWithError } from '@/lib/auth/get-user-from-request';
import { connectDB } from '@/lib/db';
import { User } from '@/lib/models/user';
import { Notification } from '@/lib/models/notification';

export async function PUT(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { user: authUser, error } = await getUserFromRequestWithError(request);
    if (error) return error;
    if (!authUser) {
      return NextResponse.json(
        { success: false, error: 'Authentication required' },
        { status: 401 }
      );
    }

    await connectDB();

    // Get the user
    const user = await User.findOne({ email: authUser.email });
    if (!user) {
      return NextResponse.json(
        { success: false, error: 'User not found' },
        { status: 404 }
      );
    }

    const { id } = await params;
    // Find and update the notification
    const notification = await Notification.findOneAndUpdate(
      { _id: id, userId: user._id },
      { isRead: true, readAt: new Date() },
      { new: true }
    );

    if (!notification) {
      return NextResponse.json(
        { success: false, error: 'Notification not found' },
        { status: 404 }
      );
    }

    return NextResponse.json({
      success: true,
      message: 'Notification marked as read',
      notification: {
        id: notification._id,
        isRead: notification.isRead,
        readAt: notification.readAt
      }
    });

  } catch (error) {
    console.error('Error marking notification as read:', error);
    return NextResponse.json(
      { success: false, error: 'Internal server error' },
      { status: 500 }
    );
  }
}
