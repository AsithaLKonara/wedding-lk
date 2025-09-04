import { NextRequest, NextResponse } from 'next/server';
import { LocalDatabase } from '@/lib/local-database';

export async function GET(request: NextRequest, { params }: { params: { id: string } }) {
  try {
    const { id } = params;
    
    console.log('📊 Fetching task by ID:', id);

    const task = LocalDatabase.readById('tasks', id);

    if (!task) {
      return NextResponse.json({
        success: false,
        error: 'Task not found'
      }, { status: 404 });
    }

    console.log('✅ Task found:', task.id);

    return NextResponse.json({
      success: true,
      task
    });

  } catch (error) {
    console.error('❌ Error fetching task:', error);
    return NextResponse.json({
      success: false,
      error: 'Failed to fetch task',
      message: error instanceof Error ? error.message : 'Unknown error'
    }, { status: 500 });
  }
}

export async function PUT(request: NextRequest, { params }: { params: { id: string } }) {
  try {
    const { id } = params;
    const updates = await request.json();
    
    console.log('📝 Updating task:', id);

    const updatedTask = LocalDatabase.update('tasks', id, updates);

    if (!updatedTask) {
      return NextResponse.json({
        success: false,
        error: 'Task not found or update failed'
      }, { status: 404 });
    }

    console.log('✅ Task updated successfully:', updatedTask.id);

    return NextResponse.json({
      success: true,
      task: updatedTask,
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

export async function DELETE(request: NextRequest, { params }: { params: { id: string } }) {
  try {
    const { id } = params;
    
    console.log('🗑️ Deleting task:', id);

    const deleted = LocalDatabase.delete('tasks', id);

    if (!deleted) {
      return NextResponse.json({
        success: false,
        error: 'Task not found or deletion failed'
      }, { status: 404 });
    }

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
