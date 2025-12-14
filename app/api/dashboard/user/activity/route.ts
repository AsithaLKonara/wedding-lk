import { NextRequest, NextResponse } from 'next/server';
import { connectDB } from '@/lib/db';
import { getUserFromRequestWithError } from '@/lib/auth/get-user-from-request';
import { User, Booking, Payment, Task } from '@/lib/models';

export async function GET(request: NextRequest) {
  try {
    const { user: authUser, error } = getUserFromRequestWithError(request);
    if (error) return error;
    if (!authUser) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    await connectDB();

    const user = await User.findOne({ email: authUser.email });
    if (!user) {
      return NextResponse.json({ error: "User not found" }, { status: 404 });
    }

    console.log('📊 Fetching user activity from MongoDB Atlas...');

    // Get recent user activities from different collections
    const recentBookings = await Booking.find({ client: user._id })
      .sort({ createdAt: -1 })
      .limit(5)
      .populate('vendor', 'businessName')
      .lean();

    const recentPayments = await Payment.find({ userId: user._id })
      .sort({ createdAt: -1 })
      .limit(5)
      .lean();

    const recentTasks = await Task.find({ assignedTo: user._id })
      .sort({ updatedAt: -1 })
      .limit(5)
      .lean();

    // Format activities
    const activities: Array<{
      id: string;
      action: string;
      timestamp: Date | string;
      status: string;
    }> = [];

    // Add booking activities
    recentBookings.forEach(booking => {
      activities.push({
        id: `booking-${booking._id}`,
        action: `Booking ${booking.status} for ${booking.vendor?.businessName || 'vendor'}`,
        timestamp: booking.createdAt,
        status: booking.status === 'completed' ? 'completed' : 'pending'
      });
    });

    // Add payment activities
    recentPayments.forEach(payment => {
      activities.push({
        id: `payment-${payment._id}`,
        action: `Payment ${payment.status} - ${payment.amount} LKR`,
        timestamp: payment.createdAt,
        status: payment.status === 'completed' ? 'completed' : 'pending'
      });
    });

    // Add task activities
    recentTasks.forEach(task => {
      activities.push({
        id: `task-${task._id}`,
        action: `Task "${task.title}" ${task.status}`,
        timestamp: task.updatedAt || task.createdAt,
        status: task.status === 'completed' ? 'completed' : 'pending'
      });
    });

    // Sort by timestamp and limit to 10 most recent
    const userActivity = activities
      .sort((a, b) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime())
      .slice(0, 10);

    console.log('✅ User activity fetched successfully');

    return NextResponse.json({
      success: true,
      activity: userActivity
    });

  } catch (error) {
    console.error('❌ Error fetching user activity:', error);
    return NextResponse.json({
      success: false,
      error: 'Failed to fetch user activity',
      message: error instanceof Error ? error.message : 'Unknown error'
    }, { status: 500 });
  }
}
