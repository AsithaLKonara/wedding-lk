import { NextRequest, NextResponse } from 'next/server';
import { LocalDatabase } from '@/lib/local-database';

export async function GET(request: NextRequest) {
  try {
    console.log('📊 Fetching vendor messages from local database...');

    // Mock vendor messages (in real app, you'd filter by current vendor)
    const vendorMessages = [
      {
        id: 'message-1',
        clientName: 'John Smith',
        clientEmail: 'john.smith@example.com',
        subject: 'Venue Availability Inquiry',
        content: 'Hi, I would like to know if your venue is available for June 15th, 2024. We are planning a wedding for 120 guests.',
        timestamp: new Date(Date.now() - 2 * 60 * 60 * 1000).toISOString(),
        isRead: false,
        priority: 'high'
      },
      {
        id: 'message-2',
        clientName: 'Sarah Johnson',
        clientEmail: 'sarah.johnson@example.com',
        subject: 'Catering Menu Questions',
        content: 'Could you please send me the vegetarian menu options? We have several guests with dietary restrictions.',
        timestamp: new Date(Date.now() - 4 * 60 * 60 * 1000).toISOString(),
        isRead: true,
        priority: 'medium'
      },
      {
        id: 'message-3',
        clientName: 'Mike Brown',
        clientEmail: 'mike.brown@example.com',
        subject: 'Photography Package Details',
        content: 'I am interested in your premium photography package. Can you provide more details about what is included?',
        timestamp: new Date(Date.now() - 6 * 60 * 60 * 1000).toISOString(),
        isRead: true,
        priority: 'low'
      },
      {
        id: 'message-4',
        clientName: 'Lisa Davis',
        clientEmail: 'lisa.davis@example.com',
        subject: 'Booking Confirmation',
        content: 'Thank you for confirming our booking. We are very excited about our wedding day!',
        timestamp: new Date(Date.now() - 8 * 60 * 60 * 1000).toISOString(),
        isRead: true,
        priority: 'low'
      }
    ];

    console.log('✅ Vendor messages fetched successfully');

    return NextResponse.json({
      success: true,
      messages: vendorMessages
    });

  } catch (error) {
    console.error('❌ Error fetching vendor messages:', error);
    return NextResponse.json({
      success: false,
      error: 'Failed to fetch vendor messages',
      message: error instanceof Error ? error.message : 'Unknown error'
    }, { status: 500 });
  }
}