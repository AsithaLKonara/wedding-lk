import { NextResponse } from 'next/server';
import { connectDB } from '@/lib/mongodb';
import { Notification } from '@/lib/models';

export async function GET() {
  try {
    await connectDB();

    // Test notification creation
    const testNotification = new Notification({
      userId: 'test-user-id',
      type: 'test',
      title: 'Test Notification',
      message: 'This is a test notification to verify the system is working',
      read: false,
      createdAt: new Date()
    });

    await testNotification.save();

    // Get notification count
    const totalNotifications = await Notification.countDocuments();
    const unreadNotifications = await Notification.countDocuments({ read: false });

    // Clean up test notification
    await Notification.findByIdAndDelete(testNotification._id);

    return NextResponse.json({
      success: true,
      working: true,
      stats: {
        totalNotifications,
        unreadNotifications,
        testNotificationCreated: true,
        testNotificationDeleted: true
      },
      message: 'Notification system is working correctly'
    });

  } catch (error) {
    console.error('Notification test error:', error);
    return NextResponse.json({
      success: false,
      working: false,
      error: error.message,
      message: 'Notification system has issues'
    }, { status: 500 });
  }
}
