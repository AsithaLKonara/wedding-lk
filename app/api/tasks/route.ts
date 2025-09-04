import { NextRequest, NextResponse } from 'next/server';
import { LocalDatabase } from '@/lib/local-database';

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const page = parseInt(searchParams.get('page') || '1');
    const limit = parseInt(searchParams.get('limit') || '10');
    const clientId = searchParams.get('clientId');
    const plannerId = searchParams.get('plannerId');
    const status = searchParams.get('status');
    const category = searchParams.get('category');
    const priority = searchParams.get('priority');

    console.log('📊 Fetching tasks from local database...');

    let tasks = LocalDatabase.read('tasks');

    // Filter by client if provided
    if (clientId) {
      tasks = tasks.filter((task: any) => task.client === clientId);
    }

    // Filter by planner if provided
    if (plannerId) {
      tasks = tasks.filter((task: any) => task.planner === plannerId);
    }

    // Filter by status if provided
    if (status) {
      tasks = tasks.filter((task: any) => task.status === status);
    }

    // Filter by category if provided
    if (category) {
      tasks = tasks.filter((task: any) => task.category === category);
    }

    // Filter by priority if provided
    if (priority) {
      tasks = tasks.filter((task: any) => task.priority === priority);
    }

    // Get paginated results
    const paginatedResult = LocalDatabase.paginate('tasks', page, limit);

    console.log(`✅ Found ${tasks.length} tasks`);

    return NextResponse.json({
      success: true,
      tasks: paginatedResult.data,
      pagination: {
        total: paginatedResult.total,
        page: paginatedResult.page,
        limit: paginatedResult.limit,
        totalPages: paginatedResult.totalPages
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
    const taskData = await request.json();
    
    console.log('📝 Creating new task...');

    // Validate required fields
    if (!taskData.title || !taskData.client || !taskData.planner || !taskData.category || !taskData.dueDate) {
      return NextResponse.json({
        success: false,
        error: 'Title, client, planner, category, and due date are required'
      }, { status: 400 });
    }

    // Create task
    const newTask = LocalDatabase.create('tasks', {
      ...taskData,
      status: 'pending',
      priority: taskData.priority || 'medium',
      estimatedHours: taskData.estimatedHours || 1
    });

    if (!newTask) {
      return NextResponse.json({
        success: false,
        error: 'Failed to create task'
      }, { status: 500 });
    }

    console.log('✅ Task created successfully:', newTask.id);

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