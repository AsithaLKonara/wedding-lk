import { NextRequest, NextResponse } from 'next/server';
import { connectDB } from '@/lib/db';
import { Booking } from '@/lib/models';

export async function GET(request: NextRequest) {
  try {
    await connectDB();

    const { searchParams } = new URL(request.url);
    const page = parseInt(searchParams.get('page') || '1');
    const limit = parseInt(searchParams.get('limit') || '10');
    const clientId = searchParams.get('clientId');
    const vendorId = searchParams.get('vendorId');
    const status = searchParams.get('status');
    const date = searchParams.get('date');

    console.log('📊 Fetching bookings from MongoDB Atlas...');

    // Build query
    const query: any = {};
    
    if (clientId) {
      query.user = clientId;
    }

    if (vendorId) {
      query.vendor = vendorId;
    }

    if (status) {
      query.status = status;
    }

    if (date) {
      const targetDate = new Date(date);
      const startOfDay = new Date(targetDate.setHours(0, 0, 0, 0));
      const endOfDay = new Date(targetDate.setHours(23, 59, 59, 999));
      query.date = { $gte: startOfDay, $lte: endOfDay };
    }

    // Calculate skip value for pagination
    const skip = (page - 1) * limit;

    // Execute query with pagination
    const [bookings, total] = await Promise.all([
      Booking.find(query)
        .populate('user', 'name email')
        .populate('vendor', 'businessName email')
        .populate('venue', 'name location')
        .sort({ createdAt: -1 })
        .skip(skip)
        .limit(limit)
        .lean(),
      Booking.countDocuments(query)
    ]);

    console.log(`✅ Found ${bookings.length} bookings`);

    return NextResponse.json({
      success: true,
      bookings,
      pagination: {
        total,
        page,
        limit,
        totalPages: Math.ceil(total / limit)
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
    await connectDB();

    const bookingData = await request.json();
    
    console.log('📝 Creating new booking...');

    // Validate required fields
    if (!bookingData.user || !bookingData.date || !bookingData.totalAmount) {
      return NextResponse.json({
        success: false,
        error: 'User, date, and total amount are required'
      }, { status: 400 });
    }

    // Create booking
    const newBooking = new Booking({
      ...bookingData,
      status: 'pending'
    });

    await newBooking.save();

    console.log('✅ Booking created successfully:', newBooking._id);

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