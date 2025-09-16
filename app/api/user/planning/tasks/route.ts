import { NextRequest, NextResponse } from 'next/server';
import { connectDB } from '@/lib/db';
import { PlanningTask } from '@/lib/models/planningTask';
import { withAuth } from '@/lib/middleware/auth-middleware';

async function handler(req: NextRequest) {
  try {
    await connectDB();

    if (req.method === 'POST') {
      // Create new planning task
      const { title, description, category, dueDate, priority } = await req.json();

      if (!title || !category) {
        return NextResponse.json(
          { error: 'Title and category are required' },
          { status: 400 }
        );
      }

      const task = new PlanningTask({
        userId: req.user?.id,
        title,
        description,
        category,
        dueDate: dueDate ? new Date(dueDate) : undefined,
        priority: priority || 'medium',
        completed: false
      });

      await task.save();

      return NextResponse.json({
        success: true,
        message: 'Task created successfully',
        task
      });

    } else {
      return NextResponse.json(
        { error: 'Method not allowed' },
        { status: 405 }
      );
    }

  } catch (error: unknown) {
    console.error('❌ Planning tasks API error:', error);
    
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}

export const POST = withAuth(handler);
