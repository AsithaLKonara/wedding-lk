import { NextRequest, NextResponse } from 'next/server';
import { LocalDatabase } from '@/lib/local-database';

export async function GET(request: NextRequest) {
  try {
    console.log('📊 Fetching vendor bookings from local database...');

    // Get bookings from local database
    const bookings = LocalDatabase.read('bookings');

    // Mock vendor bookings (in real app, you'd filter by current vendor)
    const vendorBookings = [
      {
        id: 'booking-1',
        clientName: 'John & Jane Smith',
        clientEmail: 'john.smith@example.com',
        service: 'Basic Venue Package',
        date: '2024-06-15T00:00:00.000Z',
        time: '10:00',
        status: 'confirmed',
        amount: 150000,
        guestCount: 120,
        specialRequirements: 'Vegetarian menu required'
      },
      {
        id: 'booking-2',
        clientName: 'Mike & Sarah Johnson',
        clientEmail: 'mike.johnson@example.com',
        service: 'Premium Catering Package',
        date: '2024-07-20T00:00:00.000Z',
        time: '12:00',
        status: 'pending',
        amount: 120000,
        guestCount: 80,
        specialRequirements: 'Halal food required'
      },
      {
        id: 'booking-3',
        clientName: 'David & Lisa Brown',
        clientEmail: 'david.brown@example.com',
        service: 'Basic Photography Package',
        date: '2024-08-10T00:00:00.000Z',
        time: '08:00',
        status: 'completed',
        amount: 60000,
        guestCount: 50,
        specialRequirements: 'Outdoor ceremony photos'
      }
    ];

    console.log('✅ Vendor bookings fetched successfully');

    return NextResponse.json({
      success: true,
      bookings: vendorBookings
    });

  } catch (error) {
    console.error('❌ Error fetching vendor bookings:', error);
    return NextResponse.json({
      success: false,
      error: 'Failed to fetch vendor bookings',
      message: error instanceof Error ? error.message : 'Unknown error'
    }, { status: 500 });
  }
}

export async function POST(request: NextRequest) {
  try {
    const { bookingId, action } = await request.json();
    
    console.log('📝 Processing booking action:', { bookingId, action });

    // Mock booking action processing
    if (action === 'confirm') {
      console.log('✅ Booking confirmed:', bookingId);
      return NextResponse.json({
        success: true,
        message: 'Booking confirmed successfully'
      });
    } else if (action === 'reject') {
      console.log('❌ Booking rejected:', bookingId);
      return NextResponse.json({
        success: true,
        message: 'Booking rejected successfully'
      });
    } else {
      return NextResponse.json({
        success: false,
        error: 'Invalid action'
      }, { status: 400 });
    }

  } catch (error) {
    console.error('❌ Error processing booking action:', error);
    return NextResponse.json({
      success: false,
      error: 'Failed to process booking action',
      message: error instanceof Error ? error.message : 'Unknown error'
    }, { status: 500 });
  }
}