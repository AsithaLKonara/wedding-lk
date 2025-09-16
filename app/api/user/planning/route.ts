import { NextRequest, NextResponse } from 'next/server';
import { connectDB } from '@/lib/db';
import { User } from '@/lib/models/user';
import { PlanningTask } from '@/lib/models/planningTask';
import { withAuth } from '@/lib/middleware/auth-middleware';

async function handler(req: NextRequest) {
  try {
    await connectDB();

    if (req.method === 'GET') {
      // Get user's planning data
      const tasks = await PlanningTask.find({ userId: req.user?.id })
        .sort({ dueDate: 1, priority: -1 });

      const user = await User.findById(req.user?.id);
      const weddingDetails = user?.weddingDetails || null;

      return NextResponse.json({
        success: true,
        tasks,
        weddingDetails
      });

    } else if (req.method === 'PATCH') {
      // Update wedding details
      const updateData = await req.json();
      
      const user = await User.findById(req.user?.id);
      if (!user) {
        return NextResponse.json(
          { error: 'User not found' },
          { status: 404 }
        );
      }

      user.weddingDetails = {
        ...user.weddingDetails,
        ...updateData
      };

      await user.save();

      return NextResponse.json({
        success: true,
        message: 'Wedding details updated successfully',
        weddingDetails: user.weddingDetails
      });

    } else {
      return NextResponse.json(
        { error: 'Method not allowed' },
        { status: 405 }
      );
    }

  } catch (error: unknown) {
    console.error('❌ Planning API error:', error);
    
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}

export const GET = withAuth(handler);
export const PATCH = withAuth(handler);
