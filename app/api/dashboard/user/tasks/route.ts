import { NextRequest, NextResponse } from 'next/server';
import { connectDB } from '@/lib/db';
import { getUserFromRequestWithError } from '@/lib/auth/get-user-from-request';
import { User, Task } from '@/lib/models';

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

    console.log('📊 Fetching user tasks from MongoDB Atlas...');

    // Get user tasks
    const tasks = await Task.find({ assignedTo: user._id })
      .populate('createdBy', 'name email')
      .sort({ createdAt: -1 })
      .lean();

    // Format tasks for frontend
    const userTasks = tasks.map(task => ({
      id: String(task._id),
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
