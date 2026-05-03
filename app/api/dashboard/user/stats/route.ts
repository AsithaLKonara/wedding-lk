import { NextRequest, NextResponse } from 'next/server';
import { connectDB } from '@/lib/db';
import { getUserFromRequestWithError } from '@/lib/auth/get-user-from-request';
import { User, Booking, Payment, Task } from '@/lib/models';

export async function GET(request: NextRequest) {
  try {
    const { user: authUser, error } = await getUserFromRequestWithError(request);
    if (error) return error;
    if (!authUser) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    await connectDB();

    const user = await User.findOne({ email: authUser.email });
    if (!user) {
      return NextResponse.json({ error: "User not found" }, { status: 404 });
    }

    console.log('📊 Fetching user stats from MongoDB Atlas...');

    // Get user-specific data
    const userId = user._id;

    // Get user tasks
    const tasks = await Task.find({ assignedTo: userId });
    const totalTasks = tasks.length;
    const tasksCompleted = tasks.filter(t => t.status === 'completed').length;

    // Get user bookings
    const bookings = await Booking.find({ client: userId });
    const upcomingEvents = bookings.filter(b => 
      new Date(b.date) > new Date() && b.status !== 'cancelled'
    ).length;

    // Get user payments
    const payments = await Payment.find({ userId });
    const budgetUsed = payments
      .filter(p => p.status === 'completed')
      .reduce((sum, p) => sum + p.amount, 0);

    // Mock data for features not yet implemented
    const totalBudget = 500000; // This could be stored in user profile
    const daysUntilWedding = 45; // This could be calculated from user's wedding date
    const newMessages = 3; // This would come from message system
    const favoriteVendors = 5; // This would come from favorites system

    const userStats = {
      daysUntilWedding,
      tasksCompleted,
      totalTasks,
      budgetUsed,
      totalBudget,
      newMessages,
      favoriteVendors,
      upcomingEvents
    };

    console.log('✅ User stats fetched successfully');

    return NextResponse.json({
      success: true,
      stats: userStats
    });

  } catch (error) {
    console.error('❌ Error fetching user stats:', error);
    return NextResponse.json({
      success: false,
      error: 'Failed to fetch user stats',
      message: error instanceof Error ? error.message : 'Unknown error'
    }, { status: 500 });
  }
}