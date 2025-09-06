import { NextRequest, NextResponse } from 'next/server';
import { connectDB } from '@/lib/db';
import { getAuthenticatedUser, requireAuth, requireAdmin, requireVendor, requireWeddingPlanner } from '@/lib/auth-utils';
import { User, Vendor, Venue, Booking, Payment, Review, Task, Post } from '@/lib/models';
export async function GET(request: NextRequest, { params }: { params: { id: string } }) {
  try {
    const { id } = params;
    
    console.log('📊 Fetching task by ID:', id);

    await connectDB();
    const task = await Task.findById(id);

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

    const updatedTask = await Task.findByIdAndUpdate(id, updates, { new: true });

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

    const deleted = await Task.findByIdAndDelete(id);

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
