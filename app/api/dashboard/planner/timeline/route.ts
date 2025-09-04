import { NextRequest, NextResponse } from 'next/server';
import { LocalDatabase } from '@/lib/local-database';

export async function GET(request: NextRequest) {
  try {
    console.log('📊 Fetching planner timeline from local database...');

    // Mock planner timeline
    const plannerTimeline = [
      {
        id: 'timeline-1',
        clientId: 'user-1',
        clientName: 'John & Jane Smith',
        event: 'Venue Visit',
        date: '2024-03-20T00:00:00.000Z',
        time: '10:00',
        status: 'upcoming',
        category: 'venue'
      },
      {
        id: 'timeline-2',
        clientId: 'user-1',
        clientName: 'John & Jane Smith',
        event: 'Menu Tasting',
        date: '2024-03-25T00:00:00.000Z',
        time: '14:00',
        status: 'upcoming',
        category: 'catering'
      },
      {
        id: 'timeline-3',
        clientId: 'user-2',
        clientName: 'Mike & Sarah Johnson',
        event: 'Photography Consultation',
        date: '2024-04-05T00:00:00.000Z',
        time: '16:00',
        status: 'upcoming',
        category: 'photography'
      },
      {
        id: 'timeline-4',
        clientId: 'user-3',
        clientName: 'David & Lisa Brown',
        event: 'Wedding Ceremony',
        date: '2024-08-10T00:00:00.000Z',
        time: '18:00',
        status: 'upcoming',
        category: 'ceremony'
      }
    ];

    console.log('✅ Planner timeline fetched successfully');

    return NextResponse.json({
      success: true,
      timeline: plannerTimeline
    });

  } catch (error) {
    console.error('❌ Error fetching planner timeline:', error);
    return NextResponse.json({
      success: false,
      error: 'Failed to fetch planner timeline',
      message: error instanceof Error ? error.message : 'Unknown error'
    }, { status: 500 });
  }
}
