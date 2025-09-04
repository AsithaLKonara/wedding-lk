import { NextRequest, NextResponse } from 'next/server';
import { LocalDatabase } from '@/lib/local-database';
import { formatCurrency } from '@/lib/utils/format';

export async function GET(request: NextRequest) {
  try {
    console.log('📊 Fetching planner stats from local database...');

    // Get planner data from local database
    const users = LocalDatabase.read('users');
    const tasks = LocalDatabase.read('tasks');
    const bookings = LocalDatabase.read('bookings');
    const payments = LocalDatabase.read('payments');

    // Mock planner stats (in real app, you'd filter by current planner)
    const plannerStats = {
      totalTasks: 25,
      completedTasks: 18,
      activeClients: 8,
      upcomingEvents: 5,
      totalRevenue: 320000,
      monthlyRevenue: 45000,
      averageRating: 4.8,
      completedWeddings: 12
    };

    console.log('✅ Planner stats fetched successfully');

    return NextResponse.json({
      success: true,
      stats: plannerStats
    });

  } catch (error) {
    console.error('❌ Error fetching planner stats:', error);
    return NextResponse.json({
      success: false,
      error: 'Failed to fetch planner stats',
      message: error instanceof Error ? error.message : 'Unknown error'
    }, { status: 500 });
  }
}