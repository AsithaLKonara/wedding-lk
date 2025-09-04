import { NextRequest, NextResponse } from 'next/server';
import { LocalDatabase } from '@/lib/local-database';

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const page = parseInt(searchParams.get('page') || '1');
    const limit = parseInt(searchParams.get('limit') || '10');
    const clientId = searchParams.get('clientId');
    const vendorId = searchParams.get('vendorId');
    const status = searchParams.get('status');
    const date = searchParams.get('date');

    console.log('📊 Fetching bookings from local database...');

    let bookings = LocalDatabase.read('bookings');

    // Filter by client if provided
    if (clientId) {
      bookings = bookings.filter((booking: any) => booking.client === clientId);
    }

    // Filter by vendor if provided
    if (vendorId) {
      bookings = bookings.filter((booking: any) => booking.vendor === vendorId);
    }

    // Filter by status if provided
    if (status) {
      bookings = bookings.filter((booking: any) => booking.status === status);
    }

    // Filter by date if provided
    if (date) {
      const targetDate = new Date(date);
      bookings = bookings.filter((booking: any) => {
        const bookingDate = new Date(booking.date);
        return bookingDate.toDateString() === targetDate.toDateString();
      });
    }

    // Get paginated results
    const paginatedResult = LocalDatabase.paginate('bookings', page, limit);

    console.log(`✅ Found ${bookings.length} bookings`);

    return NextResponse.json({
      success: true,
      bookings: paginatedResult.data,
      pagination: {
        total: paginatedResult.total,
        page: paginatedResult.page,
        limit: paginatedResult.limit,
        totalPages: paginatedResult.totalPages
      }
    });

  } catch (error) {
    console.error('❌ Error fetching bookings:', error);
    return NextResponse.json({
      success: false,
      error: 'Failed to fetch bookings',
      message: error instanceof Error ? error.message : 'Unknown error'
    }, { status: 500 });
  }
}

export async function POST(request: NextRequest) {
  try {
    const bookingData = await request.json();
    
    console.log('📝 Creating new booking...');

    // Validate required fields
    if (!bookingData.client || !bookingData.vendor || !bookingData.service || !bookingData.date) {
      return NextResponse.json({
        success: false,
        error: 'Client, vendor, service, and date are required'
      }, { status: 400 });
    }

    // Create booking
    const newBooking = LocalDatabase.create('bookings', {
      ...bookingData,
      status: 'pending',
      paymentStatus: 'pending'
    });

    if (!newBooking) {
      return NextResponse.json({
        success: false,
        error: 'Failed to create booking'
      }, { status: 500 });
    }

    console.log('✅ Booking created successfully:', newBooking.id);

    return NextResponse.json({
      success: true,
      booking: newBooking,
      message: 'Booking created successfully'
    });

  } catch (error) {
    console.error('❌ Error creating booking:', error);
    return NextResponse.json({
      success: false,
      error: 'Failed to create booking',
      message: error instanceof Error ? error.message : 'Unknown error'
    }, { status: 500 });
  }
}