import { NextRequest, NextResponse } from 'next/server';
import { connectDB } from '@/lib/db';
import { PlanningTask } from '@/lib/models/planningTask';
import { withAuth } from '@/lib/middleware/auth-middleware';

async function handler(req: NextRequest, { params }: { params: { taskId: string } }) {
  try {
    await connectDB();
    const { taskId } = params;

    if (req.method === 'PATCH') {
      // Update task
      const updateData = await req.json();

      const task = await PlanningTask.findOne({
        _id: taskId,
        userId: req.user?.id
      });

      if (!task) {
        return NextResponse.json(
          { error: 'Task not found' },
          { status: 404 }
        );
      }

      Object.assign(task, updateData);
      await task.save();

      return NextResponse.json({
        success: true,
        message: 'Task updated successfully',
        task
      });

    } else if (req.method === 'DELETE') {
      // Delete task
      const task = await PlanningTask.findOneAndDelete({
        _id: taskId,
        userId: req.user?.id
      });

      if (!task) {
        return NextResponse.json(
          { error: 'Task not found' },
          { status: 404 }
        );
      }

      return NextResponse.json({
        success: true,
        message: 'Task deleted successfully'
      });

    } else {
      return NextResponse.json(
        { error: 'Method not allowed' },
        { status: 405 }
      );
    }

  } catch (error: unknown) {
    console.error('❌ Planning task API error:', error);
    
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}

export const PATCH = withAuth(handler);
export const DELETE = withAuth(handler);
