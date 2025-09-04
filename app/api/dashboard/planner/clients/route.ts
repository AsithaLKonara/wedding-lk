import { NextRequest, NextResponse } from 'next/server';
import { LocalDatabase } from '@/lib/local-database';

export async function GET(request: NextRequest) {
  try {
    console.log('📊 Fetching planner clients from local database...');

    // Mock planner clients
    const plannerClients = [
      {
        id: 'user-1',
        name: 'John & Jane Smith',
        email: 'john.smith@example.com',
        phone: '+94 77 111 1111',
        weddingDate: '2024-06-15T00:00:00.000Z',
        budget: 500000,
        location: 'Colombo',
        status: 'active',
        tasksCompleted: 8,
        totalTasks: 12,
        lastContact: '2024-01-15T00:00:00.000Z',
        rating: 4.8
      },
      {
        id: 'user-2',
        name: 'Mike & Sarah Johnson',
        email: 'mike.johnson@example.com',
        phone: '+94 77 111 1112',
        weddingDate: '2024-07-20T00:00:00.000Z',
        budget: 750000,
        location: 'Kandy',
        status: 'active',
        tasksCompleted: 5,
        totalTasks: 15,
        lastContact: '2024-01-20T00:00:00.000Z',
        rating: 4.9
      },
      {
        id: 'user-3',
        name: 'David & Lisa Brown',
        email: 'david.brown@example.com',
        phone: '+94 77 111 1113',
        weddingDate: '2024-08-10T00:00:00.000Z',
        budget: 600000,
        location: 'Galle',
        status: 'completed',
        tasksCompleted: 15,
        totalTasks: 15,
        lastContact: '2024-01-10T00:00:00.000Z',
        rating: 5.0
      }
    ];

    console.log('✅ Planner clients fetched successfully');

    return NextResponse.json({
      success: true,
      clients: plannerClients
    });

  } catch (error) {
    console.error('❌ Error fetching planner clients:', error);
    return NextResponse.json({
      success: false,
      error: 'Failed to fetch planner clients',
      message: error instanceof Error ? error.message : 'Unknown error'
    }, { status: 500 });
  }
}
