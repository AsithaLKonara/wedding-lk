import { NextRequest, NextResponse } from 'next/server';
import { LocalDatabase } from '@/lib/local-database';

export async function GET(request: NextRequest) {
  try {
    console.log('📊 Fetching user activity from local database...');

    // Mock user activity (in real app, you'd filter by current user)
    const userActivity = [
      {
        id: 'activity-1',
        action: 'Completed venue selection task',
        timestamp: new Date(Date.now() - 2 * 60 * 60 * 1000).toISOString(),
        status: 'completed'
      },
      {
        id: 'activity-2',
        action: 'Added new vendor to favorites',
        timestamp: new Date(Date.now() - 4 * 60 * 60 * 1000).toISOString(),
        status: 'completed'
      },
      {
        id: 'activity-3',
        action: 'Updated wedding budget',
        timestamp: new Date(Date.now() - 6 * 60 * 60 * 1000).toISOString(),
        status: 'completed'
      },
      {
        id: 'activity-4',
        action: 'Scheduled venue visit',
        timestamp: new Date(Date.now() - 8 * 60 * 60 * 1000).toISOString(),
        status: 'completed'
      },
      {
        id: 'activity-5',
        action: 'Sent message to photographer',
        timestamp: new Date(Date.now() - 12 * 60 * 60 * 1000).toISOString(),
        status: 'completed'
      },
      {
        id: 'activity-6',
        action: 'Payment processed for venue booking',
        timestamp: new Date(Date.now() - 24 * 60 * 60 * 1000).toISOString(),
        status: 'completed'
      }
    ];

    console.log('✅ User activity fetched successfully');

    return NextResponse.json({
      success: true,
      activity: userActivity
    });

  } catch (error) {
    console.error('❌ Error fetching user activity:', error);
    return NextResponse.json({
      success: false,
      error: 'Failed to fetch user activity',
      message: error instanceof Error ? error.message : 'Unknown error'
    }, { status: 500 });
  }
}
