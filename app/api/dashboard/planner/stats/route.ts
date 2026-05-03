import { NextRequest, NextResponse } from 'next/server';
import { connectDB } from '@/lib/db';
import { getUserFromRequestWithError } from '@/lib/auth/get-user-from-request';
import { WeddingPlannerProfile, Task, Client } from '@/lib/models';

export async function GET(request: NextRequest) {
  try {
    const { user, error } = await getUserFromRequestWithError(request);
    if (error) return error;
    if (!user || user.role !== 'wedding_planner') {
      return NextResponse.json({ error: "Planner access required" }, { status: 403 });
    }

    await connectDB();
    const profile = await WeddingPlannerProfile.findOne({ userId: user.id });
    if (!profile) {
      return NextResponse.json({ error: "Planner profile not found" }, { status: 404 });
    }

    // Fetch related counts
    const totalTasks = await Task.countDocuments({ plannerId: user.id });
    const completedTasks = await Task.countDocuments({ plannerId: user.id, status: 'completed' });
    const activeClients = await Client.countDocuments({ plannerId: user.id, status: 'active' });
    
    // For now, return profile metrics or zeros if no data
    return NextResponse.json({
      success: true,
      stats: {
        totalTasks,
        completedTasks,
        activeClients,
        upcomingEvents: 0, // Need to implement event logic
        totalRevenue: profile.totalRevenue || 0,
        monthlyRevenue: 0,
        averageRating: profile.rating?.average || 0,
        completedWeddings: profile.completedWeddings || 0,
      }
    });
  } catch (error) {
    console.error('Error fetching planner stats:', error);
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}