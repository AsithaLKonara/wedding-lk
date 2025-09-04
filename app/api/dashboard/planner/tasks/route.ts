import { NextRequest, NextResponse } from 'next/server';
import { LocalDatabase } from '@/lib/local-database';

export async function GET(request: NextRequest) {
  try {
    console.log('📊 Fetching planner tasks from local database...');

    // Get tasks from local database
    const tasks = LocalDatabase.read('tasks');

    // Mock planner tasks (in real app, you'd filter by current planner)
    const plannerTasks = [
      {
        id: 'task-1',
        title: 'Venue Selection',
        description: 'Research and select wedding venue',
        clientId: 'user-1',
        clientName: 'John & Jane Smith',
        category: 'venue',
        priority: 'high',
        dueDate: '2024-03-15T00:00:00.000Z',
        status: 'completed',
        estimatedHours: 8,
        actualHours: 6
      },
      {
        id: 'task-2',
        title: 'Catering Menu Finalization',
        description: 'Finalize wedding menu with caterer',
        clientId: 'user-1',
        clientName: 'John & Jane Smith',
        category: 'catering',
        priority: 'medium',
        dueDate: '2024-04-01T00:00:00.000Z',
        status: 'in_progress',
        estimatedHours: 4,
        actualHours: 2
      },
      {
        id: 'task-3',
        title: 'Photography Booking',
        description: 'Book photographer and plan photo sessions',
        clientId: 'user-2',
        clientName: 'Mike & Sarah Johnson',
        category: 'photography',
        priority: 'high',
        dueDate: '2024-04-15T00:00:00.000Z',
        status: 'pending',
        estimatedHours: 3,
        actualHours: 0
      },
      {
        id: 'task-4',
        title: 'Music Selection',
        description: 'Select music and book DJ/band',
        clientId: 'user-2',
        clientName: 'Mike & Sarah Johnson',
        category: 'music',
        priority: 'medium',
        dueDate: '2024-05-01T00:00:00.000Z',
        status: 'pending',
        estimatedHours: 2,
        actualHours: 0
      },
      {
        id: 'task-5',
        title: 'Flower Arrangements',
        description: 'Design and order flower arrangements',
        clientId: 'user-3',
        clientName: 'David & Lisa Brown',
        category: 'flowers',
        priority: 'medium',
        dueDate: '2024-05-15T00:00:00.000Z',
        status: 'pending',
        estimatedHours: 5,
        actualHours: 0
      }
    ];

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
    const { taskId, action } = await request.json();
    
    console.log('📝 Processing task action:', { taskId, action });

    // Mock task action processing
    if (action === 'start') {
      console.log('✅ Task started:', taskId);
      return NextResponse.json({
        success: true,
        message: 'Task started successfully'
      });
    } else if (action === 'complete') {
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
