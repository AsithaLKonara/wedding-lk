import { NextRequest, NextResponse } from 'next/server';
import { LocalDatabase } from '@/lib/local-database';

export async function GET(request: NextRequest) {
  try {
    console.log('📊 Fetching admin activity from local database...');

    // Mock admin activity
    const adminActivity = [
      {
        id: 'activity-1',
        type: 'user_registration',
        description: 'New user registered',
        timestamp: new Date(Date.now() - 2 * 60 * 60 * 1000).toISOString(),
        status: 'success'
      },
      {
        id: 'activity-2',
        type: 'vendor_approval',
        description: 'Vendor approved',
        timestamp: new Date(Date.now() - 4 * 60 * 60 * 1000).toISOString(),
        status: 'success'
      },
      {
        id: 'activity-3',
        type: 'booking_created',
        description: 'New booking created',
        timestamp: new Date(Date.now() - 6 * 60 * 60 * 1000).toISOString(),
        status: 'success'
      },
      {
        id: 'activity-4',
        type: 'payment_received',
        description: 'Payment received',
        timestamp: new Date(Date.now() - 8 * 60 * 60 * 1000).toISOString(),
        status: 'success'
      },
      {
        id: 'activity-5',
        type: 'user_registration',
        description: 'New user registered',
        timestamp: new Date(Date.now() - 12 * 60 * 60 * 1000).toISOString(),
        status: 'success'
      }
    ];

    console.log('✅ Admin activity fetched successfully');

    return NextResponse.json({
      success: true,
      activity: adminActivity
    });

  } catch (error) {
    console.error('❌ Error fetching admin activity:', error);
    return NextResponse.json({
      success: false,
      error: 'Failed to fetch admin activity',
      message: error instanceof Error ? error.message : 'Unknown error'
    }, { status: 500 });
  }
}
