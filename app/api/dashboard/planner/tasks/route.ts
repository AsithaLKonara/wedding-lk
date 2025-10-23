import { NextRequest, NextResponse } from 'next/server';
import { connectDB } from '@/lib/db';
import { getServerSession } from '@/lib/auth-utils';
import { User, Vendor, Venue, Booking, Payment, Review, Task, Post } from '@/lib/models';

export async function GET(request: NextRequest) {
  try {
    const session = await getServerSession();
    
    if (!token?.user?.email) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    await connectDB();

    const user = await User.findOne({ email: session.user.email });
    if (!user || user.role !== 'wedding_planner') {
      return NextResponse.json({ error: "Wedding planner access required" }, { status: 403 });
    }

    console.log('📊 Fetching planner tasks from MongoDB Atlas...');

    // Get planner tasks with populated client data
    const tasks = await Task.find({ createdBy: user._id })
      .populate('assignedTo', 'name email')
      .sort({ createdAt: -1 })
      .lean();

    // Format tasks for frontend
    const plannerTasks = tasks.map(task => ({
      id: (task._id as any).toString(),
      title: task.title,
      description: task.description,
      clientId: task.assignedTo?._id?.toString() || '',
      clientName: task.assignedTo?.name || 'Unknown Client',
      category: task.category || 'general',
      priority: task.priority,
      dueDate: task.dueDate,
      status: task.status,
      estimatedHours: task.estimatedHours || 0,
      actualHours: task.actualHours || 0
    }));

    console.log('✅ Planner tasks fetched successfully');

    return NextResponse.json({
      success: true,
      tasks: plannerTasks
    });

  } catch (error) {
    console.error('❌ Error fetching planner tasks:', error);
    return NextResponse.json({
      success: false,
      error: 'Failed to fetch planner tasks',
      message: error instanceof Error ? error.message : 'Unknown error'
    }, { status: 500 });
  }
}

export async function PATCH(request: NextRequest) {
  try {
    const session = await getServerSession();
    
    if (!token?.user?.email) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    await connectDB();

    const user = await User.findOne({ email: session.user.email });
    if (!user || user.role !== 'wedding_planner') {
      return NextResponse.json({ error: "Wedding planner access required" }, { status: 403 });
    }

    const { taskId, action } = await request.json();
    
    console.log('📝 Processing task action:', { taskId, action });

    // Find the task
    const task = await Task.findById(taskId);
    if (!task) {
      return NextResponse.json({
        success: false,
        error: 'Task not found'
      }, { status: 404 });
    }

    // Verify planner owns this task
    if (task.createdBy.toString() !== user._id.toString()) {
      return NextResponse.json({
        success: false,
        error: 'Unauthorized to modify this task'
      }, { status: 403 });
    }

    // Process the action
    if (action === 'start') {
      task.status = 'in_progress';
      await task.save();
      console.log('✅ Task started:', taskId);
      return NextResponse.json({
        success: true,
        message: 'Task started successfully'
      });
    } else if (action === 'complete') {
      task.status = 'completed';
      await task.save();
      console.log('✅ Task completed:', taskId);
      return NextResponse.json({
        success: true,
        message: 'Task completed successfully'
      });
    } else {
      return NextResponse.json({
        success: false,
        error: 'Invalid action'
      }, { status: 400 });
    }

  } catch (error) {
    console.error('❌ Error processing task action:', error);
    return NextResponse.json({
      success: false,
      error: 'Failed to process task action',
      message: error instanceof Error ? error.message : 'Unknown error'
    }, { status: 500 });
  }
}
