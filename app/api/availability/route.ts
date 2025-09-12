import { NextRequest, NextResponse } from 'next/server';
import { connectDB } from '@/lib/db';
import { Availability, Vendor, Venue } from '@/lib/models';
import { getServerSession, authOptions } from '@/lib/auth/nextauth-config';

export async function GET(request: NextRequest) {
  try {
    await connectDB();
    const session = await getServerSession(authOptions);

    const { searchParams } = new URL(request.url);
    const vendorId = searchParams.get('vendorId');
    const venueId = searchParams.get('venueId');
    const serviceId = searchParams.get('serviceId');
    const date = searchParams.get('date');
    const startDate = searchParams.get('startDate');
    const endDate = searchParams.get('endDate');

    console.log('📊 Fetching availability...');

    // Build query
    let query: any = { isActive: true };

    if (vendorId) {
      query.vendor = vendorId;
    }

    if (venueId) {
      query.venue = venueId;
    }

    if (serviceId) {
      query.service = serviceId;
    }

    if (date) {
      query.date = new Date(date);
    }

    if (startDate && endDate) {
      query.date = {
        $gte: new Date(startDate),
        $lte: new Date(endDate)
      };
    }

    // Execute query
    const availability = await Availability.find(query)
      .populate('vendor', 'businessName email phone')
      .populate('venue', 'name location')
      .populate('service', 'name description')
      .sort({ date: 1 })
      .lean();

    console.log(`✅ Found ${availability.length} availability records`);

    return NextResponse.json({
      success: true,
      availability,
      count: availability.length
    });

  } catch (error) {
    console.error('❌ Error fetching availability:', error);
    return NextResponse.json({
      success: false,
      error: 'Failed to fetch availability',
      message: error instanceof Error ? error.message : 'Unknown error'
    }, { status: 500 });
  }
}

export async function POST(request: NextRequest) {
  try {
    await connectDB();
    const session = await getServerSession(authOptions);

    if (!session?.user?.id) {
      return NextResponse.json({
        success: false,
        error: 'Authentication required'
      }, { status: 401 });
    }

    const availabilityData = await request.json();
    
    console.log('📝 Creating availability...');

    // Validate required fields
    if (!availabilityData.vendor || !availabilityData.date || !availabilityData.timeSlots) {
      return NextResponse.json({
        success: false,
        error: 'Vendor, date, and time slots are required'
      }, { status: 400 });
    }

    // Check if user is authorized to create availability for this vendor
    if (session.user.role !== 'admin' && session.user.role !== 'vendor') {
      return NextResponse.json({
        success: false,
        error: 'Insufficient permissions'
      }, { status: 403 });
    }

    if (session.user.role === 'vendor' && availabilityData.vendor !== session.user.id) {
      return NextResponse.json({
        success: false,
        error: 'Can only create availability for your own vendor account'
      }, { status: 403 });
    }

    // Check for existing availability on the same date
    const existingAvailability = await Availability.findOne({
      vendor: availabilityData.vendor,
      venue: availabilityData.venue || { $exists: false },
      service: availabilityData.service || { $exists: false },
      date: new Date(availabilityData.date),
      isActive: true
    });

    if (existingAvailability) {
      return NextResponse.json({
        success: false,
        error: 'Availability already exists for this vendor, venue, and date',
        existingId: existingAvailability._id
      }, { status: 409 });
    }

    // Create availability
    const newAvailability = new Availability({
      vendor: availabilityData.vendor,
      venue: availabilityData.venue,
      service: availabilityData.service,
      date: new Date(availabilityData.date),
      timeSlots: availabilityData.timeSlots.map((slot: any) => ({
        startTime: slot.startTime,
        endTime: slot.endTime,
        isAvailable: slot.isAvailable ?? true,
        price: slot.price,
        maxBookings: slot.maxBookings || 1,
        currentBookings: 0,
        capacity: slot.capacity,
        resources: slot.resources || []
      })),
      blackoutDates: availabilityData.blackoutDates || [],
      recurringAvailability: availabilityData.recurringAvailability || {
        daysOfWeek: [],
        startTime: '',
        endTime: '',
        isActive: false,
        exceptions: []
      },
      specialPricing: availabilityData.specialPricing || [],
      bufferTime: availabilityData.bufferTime || {
        before: 0,
        after: 0
      },
      timezone: availabilityData.timezone || 'UTC',
      isActive: true
    });

    await newAvailability.save();

    // Populate the response
    const populatedAvailability = await Availability.findById(newAvailability._id)
      .populate('vendor', 'businessName email phone')
      .populate('venue', 'name location')
      .populate('service', 'name description')
      .lean();

    console.log('✅ Availability created successfully:', newAvailability._id);

    return NextResponse.json({
      success: true,
      availability: populatedAvailability,
      message: 'Availability created successfully'
    }, { status: 201 });

  } catch (error) {
    console.error('❌ Error creating availability:', error);
    return NextResponse.json({
      success: false,
      error: 'Failed to create availability',
      message: error instanceof Error ? error.message : 'Unknown error'
    }, { status: 500 });
  }
}

export async function PUT(request: NextRequest) {
  try {
    await connectDB();
    const session = await getServerSession(authOptions);

    if (!session?.user?.id) {
      return NextResponse.json({
        success: false,
        error: 'Authentication required'
      }, { status: 401 });
    }

    const { searchParams } = new URL(request.url);
    const availabilityId = searchParams.get('id');
    const availabilityData = await request.json();

    if (!availabilityId) {
      return NextResponse.json({
        success: false,
        error: 'Availability ID is required'
      }, { status: 400 });
    }

    console.log('📝 Updating availability:', availabilityId);

    // Find availability
    const availability = await Availability.findById(availabilityId);
    if (!availability) {
      return NextResponse.json({
        success: false,
        error: 'Availability not found'
      }, { status: 404 });
    }

    // Check permissions
    if (session.user.role !== 'admin' && 
        (session.user.role !== 'vendor' || availability.vendor.toString() !== session.user.id)) {
      return NextResponse.json({
        success: false,
        error: 'Insufficient permissions'
      }, { status: 403 });
    }

    // Update availability
    const updatedAvailability = await Availability.findByIdAndUpdate(
      availabilityId,
      {
        ...availabilityData,
        updatedAt: new Date()
      },
      { new: true, runValidators: true }
    )
      .populate('vendor', 'businessName email phone')
      .populate('venue', 'name location')
      .populate('service', 'name description')
      .lean();

    console.log('✅ Availability updated successfully:', availabilityId);

    return NextResponse.json({
      success: true,
      availability: updatedAvailability,
      message: 'Availability updated successfully'
    });

  } catch (error) {
    console.error('❌ Error updating availability:', error);
    return NextResponse.json({
      success: false,
      error: 'Failed to update availability',
      message: error instanceof Error ? error.message : 'Unknown error'
    }, { status: 500 });
  }
}