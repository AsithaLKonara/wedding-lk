import { NextRequest, NextResponse } from 'next/server';
import { connectDB } from '@/lib/db';
import { getServerSession } from '@/lib/auth-utils';
import { User, Vendor, Venue, Booking, Payment, Review, Task, Post } from '@/lib/models';

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

    console.log('📊 Fetching user tasks from MongoDB Atlas...');

    // Get user tasks
    const tasks = await Task.find({ assignedTo: user._id })
      .populate('createdBy', 'name email')
      .sort({ createdAt: -1 })
      .lean();

    // Format tasks for frontend
    const userTasks = tasks.map(task => ({
      id: (task._id as any).toString(),
      title: task.title,
      category: task.category || 'general',
      dueDate: task.dueDate,
      status: task.status,
      priority: task.priority,
      description: task.description,
      createdBy: task.createdBy?.name || 'System',
      estimatedHours: task.estimatedHours || 0,
      actualHours: task.actualHours || 0
    }));

    console.log('✅ User tasks fetched successfully');

    return NextResponse.json({
      success: true,
      tasks: userTasks
    });

  } catch (error) {
    console.error('❌ Error fetching user tasks:', error);
    return NextResponse.json({
      success: false,
      error: 'Failed to fetch user tasks',
      message: error instanceof Error ? error.message : 'Unknown error'
    }, { status: 500 });
  }
}
