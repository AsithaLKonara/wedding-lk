import { NextRequest, NextResponse } from 'next/server';
import { getUserFromRequestWithError } from '@/lib/auth/get-user-from-request';
import { connectDB } from '@/lib/db';
import { User } from '@/lib/models/user';
import { Notification } from '@/lib/models/notification';

export async function PUT(request: NextRequest) {
  try {
    const { user: authUser, error } = getUserFromRequestWithError(request);
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

    // Mark all notifications as read for this user
    await Notification.updateMany(
      { userId: user._id, isRead: false },
      { isRead: true, readAt: new Date() }
    );

    return NextResponse.json({
      success: true,
      message: 'All notifications marked as read'
    });

  } catch (error) {
    console.error('Error marking all notifications as read:', error);
    return NextResponse.json(
      { success: false, error: 'Internal server error' },
      { status: 500 }
    );
  }
}
