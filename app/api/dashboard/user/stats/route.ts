import { NextRequest, NextResponse } from 'next/server';
import { LocalDatabase } from '@/lib/local-database';
import { formatCurrency } from '@/lib/utils/format';

export async function GET(request: NextRequest) {
  try {
    console.log('📊 Fetching user stats from local database...');

    // Get user data from local database
    const users = LocalDatabase.read('users');
    const bookings = LocalDatabase.read('bookings');
    const tasks = LocalDatabase.read('tasks');
    const payments = LocalDatabase.read('payments');

    // Mock user stats (in real app, you'd filter by current user)
    const userStats = {
      daysUntilWedding: 45,
      tasksCompleted: 8,
      totalTasks: 12,
      budgetUsed: 150000,
      totalBudget: 500000,
      newMessages: 3,
      favoriteVendors: 5,
      upcomingEvents: 2
    };

    console.log('✅ User stats fetched successfully');

    return NextResponse.json({
      success: true,
      stats: userStats
    });

  } catch (error) {
    console.error('❌ Error fetching user stats:', error);
    return NextResponse.json({
      success: false,
      error: 'Failed to fetch user stats',
      message: error instanceof Error ? error.message : 'Unknown error'
    }, { status: 500 });
  }
}