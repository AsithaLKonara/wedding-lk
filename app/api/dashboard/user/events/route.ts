import { NextRequest, NextResponse } from 'next/server';
import { LocalDatabase } from '@/lib/local-database';

export async function GET(request: NextRequest) {
  try {
    console.log('📊 Fetching user events from local database...');

    // Mock user events (in real app, you'd filter by current user)
    const userEvents = [
      {
        id: 'event-1',
        title: 'Venue Visit',
        date: '2024-03-20T00:00:00.000Z',
        time: '10:00',
        type: 'meeting',
        vendor: 'Royal Wedding Hall',
        location: '123 Royal Street, Colombo 07'
      },
      {
        id: 'event-2',
        title: 'Menu Tasting',
        date: '2024-03-25T00:00:00.000Z',
        time: '14:00',
        type: 'tasting',
        vendor: 'Spice Garden Catering',
        location: '456 Spice Lane, Kandy'
      },
      {
        id: 'event-3',
        title: 'Photography Consultation',
        date: '2024-04-05T00:00:00.000Z',
        time: '16:00',
        type: 'consultation',
        vendor: 'Golden Moments Photography',
        location: '789 Photo Street, Galle'
      },
      {
        id: 'event-4',
        title: 'Dress Fitting',
        date: '2024-04-10T00:00:00.000Z',
        time: '11:00',
        type: 'fitting',
        vendor: 'Elegant Bridal',
        location: '321 Fashion Avenue, Colombo'
      },
      {
        id: 'event-5',
        title: 'Wedding Rehearsal',
        date: '2024-06-10T00:00:00.000Z',
        time: '18:00',
        type: 'rehearsal',
        vendor: 'Royal Wedding Hall',
        location: '123 Royal Street, Colombo 07'
      }
    ];

    console.log('✅ User events fetched successfully');

    return NextResponse.json({
      success: true,
      events: userEvents
    });

  } catch (error) {
    console.error('❌ Error fetching user events:', error);
    return NextResponse.json({
      success: false,
      error: 'Failed to fetch user events',
      message: error instanceof Error ? error.message : 'Unknown error'
    }, { status: 500 });
  }
}
