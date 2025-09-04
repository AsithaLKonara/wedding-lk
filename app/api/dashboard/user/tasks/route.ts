import { NextRequest, NextResponse } from 'next/server';
import { LocalDatabase } from '@/lib/local-database';

export async function GET(request: NextRequest) {
  try {
    console.log('📊 Fetching user tasks from local database...');

    // Get tasks from local database
    const tasks = LocalDatabase.read('tasks');

    // Mock user tasks (in real app, you'd filter by current user)
    const userTasks = [
      {
        id: 'task-1',
        title: 'Venue Selection',
        category: 'venue',
        dueDate: '2024-03-15T00:00:00.000Z',
        status: 'completed',
        priority: 'high'
      },
      {
        id: 'task-2',
        title: 'Catering Menu Finalization',
        category: 'catering',
        dueDate: '2024-04-01T00:00:00.000Z',
        status: 'in_progress',
        priority: 'medium'
      },
      {
        id: 'task-3',
        title: 'Photography Booking',
        category: 'photography',
        dueDate: '2024-04-15T00:00:00.000Z',
        status: 'pending',
        priority: 'high'
      },
      {
        id: 'task-4',
        title: 'Music Selection',
        category: 'music',
        dueDate: '2024-05-01T00:00:00.000Z',
        status: 'pending',
        priority: 'low'
      },
      {
        id: 'task-5',
        title: 'Flower Arrangements',
        category: 'flowers',
        dueDate: '2024-05-15T00:00:00.000Z',
        status: 'pending',
        priority: 'medium'
      }
    ];

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
