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
    if (!user) {
      return NextResponse.json({ error: "User not found" }, { status: 404 });
    }

    const { searchParams } = new URL(request.url);
    const page = parseInt(searchParams.get('page') || '1');
    const limit = parseInt(searchParams.get('limit') || '20');
    const status = searchParams.get('status');
    const category = searchParams.get('category');
    const priority = searchParams.get('priority');
    const assignedTo = searchParams.get('assignedTo');

    console.log('📊 Fetching tasks from MongoDB Atlas...');

    // Build query
    const query: any = {};
    
    // For regular users, only show their tasks
    if (user.role === 'user') {
      query.assignedTo = user._id;
    } else if (assignedTo) {
      query.assignedTo = assignedTo;
    }

    if (status) {
      query.status = status;
    }

    if (category) {
      query.category = category;
    }

    if (priority) {
      query.priority = priority;
    }

    // Calculate skip value for pagination
    const skip = (page - 1) * limit;

    // Execute query with pagination
    const [tasks, total] = await Promise.all([
      Task.find(query)
        .populate('assignedTo', 'name email')
        .sort({ createdAt: -1 })
        .skip(skip)
        .limit(limit)
        .lean(),
      Task.countDocuments(query)
    ]);

    console.log(`✅ Found ${tasks.length} tasks`);

    return NextResponse.json({
      success: true,
      tasks,
      pagination: {
        total,
        page,
        limit,
        totalPages: Math.ceil(total / limit)
      }
    });

  } catch (error) {
    console.error('❌ Error fetching tasks:', error);
    return NextResponse.json({
      success: false,
      error: 'Failed to fetch tasks',
      message: error instanceof Error ? error.message : 'Unknown error'
    }, { status: 500 });
  }
}

export async function POST(request: NextRequest) {
  try {
    const session = await getServerSession();
    
    if (!token?.user?.email) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    await connectDB();

    const user = await User.findOne({ email: session.user.email });
    if (!user) {
      return NextResponse.json({ error: "User not found" }, { status: 404 });
    }

    const taskData = await request.json();
    
    console.log('📝 Creating new task...');

    // Validate required fields
    if (!taskData.title || !taskData.category) {
      return NextResponse.json({
        success: false,
        error: 'Title and category are required'
      }, { status: 400 });
    }

    // Create task
    const newTask = new Task({
      title: taskData.title,
      description: taskData.description || '',
      category: taskData.category,
      status: taskData.status || 'pending',
      priority: taskData.priority || 'medium',
      assignedTo: taskData.assignedTo || user._id,
      dueDate: taskData.dueDate ? new Date(taskData.dueDate) : null,
      tags: taskData.tags || [],
      estimatedHours: taskData.estimatedHours || 0,
      actualHours: 0,
      createdBy: user._id,
      createdAt: new Date(),
      updatedAt: new Date()
    });

    await newTask.save();

    console.log('✅ Task created successfully:', newTask._id);

    return NextResponse.json({
      success: true,
      task: newTask,
      message: 'Task created successfully'
    });

  } catch (error) {
    console.error('❌ Error creating task:', error);
    return NextResponse.json({
      success: false,
      error: 'Failed to create task',
      message: error instanceof Error ? error.message : 'Unknown error'
    }, { status: 500 });
  }
}

export async function PUT(request: NextRequest) {
  try {
    const session = await getServerSession();
    
    if (!token?.user?.email) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    await connectDB();

    const user = await User.findOne({ email: session.user.email });
    if (!user) {
      return NextResponse.json({ error: "User not found" }, { status: 404 });
    }

    const { taskId, ...updateData } = await request.json();
    
    console.log('📝 Updating task...', taskId);

    // Find the task
    const task = await Task.findById(taskId);
    if (!task) {
      return NextResponse.json({
        success: false,
        error: 'Task not found'
      }, { status: 404 });
    }

    // Check if user can update this task
    if (task.assignedTo.toString() !== user._id.toString() && user.role !== 'admin') {
      return NextResponse.json({
        success: false,
        error: 'Unauthorized to update this task'
      }, { status: 403 });
    }

    // Update task
    Object.assign(task, updateData);
    task.updatedAt = new Date();
    
    // If status is being changed to completed, set completedAt
    if (updateData.status === 'completed' && task.status !== 'completed') {
      task.completedAt = new Date();
    }

    await task.save();

    console.log('✅ Task updated successfully');

    return NextResponse.json({
      success: true,
      task,
      message: 'Task updated successfully'
    });

  } catch (error) {
    console.error('❌ Error updating task:', error);
    return NextResponse.json({
      success: false,
      error: 'Failed to update task',
      message: error instanceof Error ? error.message : 'Unknown error'
    }, { status: 500 });
  }
}

export async function DELETE(request: NextRequest) {
  try {
    const session = await getServerSession();
    
    if (!token?.user?.email) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    await connectDB();

    const user = await User.findOne({ email: session.user.email });
    if (!user) {
      return NextResponse.json({ error: "User not found" }, { status: 404 });
    }

    const { searchParams } = new URL(request.url);
    const taskId = searchParams.get('taskId');
    
    console.log('📝 Deleting task...', taskId);

    // Find the task
    const task = await Task.findById(taskId);
    if (!task) {
      return NextResponse.json({
        success: false,
        error: 'Task not found'
      }, { status: 404 });
    }

    // Check if user can delete this task
    if (task.createdBy.toString() !== user._id.toString() && user.role !== 'admin') {
      return NextResponse.json({
        success: false,
        error: 'Unauthorized to delete this task'
      }, { status: 403 });
    }

    // Delete task
    await Task.findByIdAndDelete(taskId);

    console.log('✅ Task deleted successfully');

    return NextResponse.json({
      success: true,
      message: 'Task deleted successfully'
    });

  } catch (error) {
    console.error('❌ Error deleting task:', error);
    return NextResponse.json({
      success: false,
      error: 'Failed to delete task',
      message: error instanceof Error ? error.message : 'Unknown error'
    }, { status: 500 });
  }
}