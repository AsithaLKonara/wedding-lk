import { NextRequest, NextResponse } from 'next/server';
import { connectDB } from '@/lib/db';
import { Booking } from '@/lib/models';
import { bookingSchemas } from '@/lib/validations/api-validators';
import { handleApiError, createSuccessResponse, createPaginatedResponse } from '@/lib/utils/error-handler';

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

    // Validate input data
    const validation = bookingSchemas.create.safeParse(bookingData);
    if (!validation.success) {
      return NextResponse.json({
        success: false,
        error: 'Validation failed',
        details: validation.error.errors
      }, { status: 400 });
    }

    const validatedData = validation.data;

    // Create booking
    const newBooking = new Booking({
      ...validatedData,
      status: 'pending'
    });

    await newBooking.save();

    console.log('✅ Booking created successfully:', newBooking._id);

    return createSuccessResponse(newBooking, 'Booking created successfully', 201);

  } catch (error) {
    console.error('❌ Error creating booking:', error);
    return handleApiError(error, '/api/bookings');
  }
}

// PUT - Update booking
export async function PUT(request: NextRequest) {
  try {
    await connectDB();

    const { searchParams } = new URL(request.url);
    const bookingId = searchParams.get('id');
    const bookingData = await request.json();

    if (!bookingId) {
      return NextResponse.json({
        success: false,
        error: 'Booking ID is required'
      }, { status: 400 });
    }

    console.log('📝 Updating booking:', bookingId);

    // Validate input data
    const validation = bookingSchemas.update.safeParse(bookingData);
    if (!validation.success) {
      return NextResponse.json({
        success: false,
        error: 'Validation failed',
        details: validation.error.errors
      }, { status: 400 });
    }

    const validatedData = validation.data;

    // Find booking
    const booking = await Booking.findById(bookingId);
    if (!booking) {
      return NextResponse.json({
        success: false,
        error: 'Booking not found'
      }, { status: 404 });
    }

    // Update booking
    const updatedBooking = await Booking.findByIdAndUpdate(
      bookingId,
      { 
        ...validatedData,
        updatedAt: new Date()
      },
      { new: true, runValidators: true }
    ).populate('user', 'name email')
     .populate('vendor', 'businessName email')
     .populate('venue', 'name location');

    console.log('✅ Booking updated successfully:', updatedBooking._id);

    return createSuccessResponse(updatedBooking, 'Booking updated successfully');

  } catch (error) {
    console.error('❌ Error updating booking:', error);
    return handleApiError(error, '/api/bookings');
  }
}

// DELETE - Delete booking (soft delete)
export async function DELETE(request: NextRequest) {
  try {
    await connectDB();

    const { searchParams } = new URL(request.url);
    const bookingId = searchParams.get('id');

    if (!bookingId) {
      return NextResponse.json({
        success: false,
        error: 'Booking ID is required'
      }, { status: 400 });
    }

    console.log('📝 Deleting booking:', bookingId);

    // Find booking
    const booking = await Booking.findById(bookingId);
    if (!booking) {
      return NextResponse.json({
        success: false,
        error: 'Booking not found'
      }, { status: 404 });
    }

    // Soft delete - set isActive to false
    await Booking.findByIdAndUpdate(bookingId, {
      isActive: false,
      updatedAt: new Date()
    });

    console.log('✅ Booking deleted successfully:', booking._id);

    return createSuccessResponse(null, 'Booking deleted successfully');

  } catch (error) {
    console.error('❌ Error deleting booking:', error);
    return handleApiError(error, '/api/bookings');
  }
}