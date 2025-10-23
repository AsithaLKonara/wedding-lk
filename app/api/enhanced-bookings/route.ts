import { NextRequest, NextResponse } from 'next/server';
import { connectDB } from '@/lib/db';
import { EnhancedBooking, Availability, DynamicPricing } from '@/lib/models';

export async function GET(request: NextRequest) {
  try {
    await connectDB();
    // Custom auth implementation
    const token = request.cookies.get('auth-token')?.value;
    if (!token) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    if (!token?.user?.id) {
      return NextResponse.json({
        success: false,
        error: 'Authentication required'
      }, { status: 401 });
    }

    const { searchParams } = new URL(request.url);
    const page = parseInt(searchParams.get('page') || '1');
    const limit = parseInt(searchParams.get('limit') || '10');
    const status = searchParams.get('status');
    const vendorId = searchParams.get('vendorId');
    const venueId = searchParams.get('venueId');
    const date = searchParams.get('date');
    const startDate = searchParams.get('startDate');
    const endDate = searchParams.get('endDate');

    console.log('📊 Fetching enhanced bookings...');

    // Build query based on user role
    let query: any = { isActive: true };

    if (session.user.role === 'user') {
      query.user = session.user.id;
    } else if (session.user.role === 'vendor') {
      query.vendor = session.user.id;
    }

    // Apply filters
    if (status) {
      query.status = status;
    }

    if (vendorId) {
      query.vendor = vendorId;
    }

    if (venueId) {
      query.venue = venueId;
    }

    if (date) {
      const targetDate = new Date(date);
      const startOfDay = new Date(targetDate.setHours(0, 0, 0, 0));
      const endOfDay = new Date(targetDate.setHours(23, 59, 59, 999));
      query['schedule.date'] = { $gte: startOfDay, $lte: endOfDay };
    }

    if (startDate && endDate) {
      query['schedule.date'] = {
        $gte: new Date(startDate),
        $lte: new Date(endDate)
      };
    }

    // Calculate skip value for pagination
    const skip = (page - 1) * limit;

    // Execute query with pagination
    const [bookings, total] = await Promise.all([
      EnhancedBooking.find(query)
        .populate('user', 'name email phone')
        .populate('vendor', 'businessName email phone')
        .populate('venue', 'name location')
        .populate('services.service', 'name description')
        .sort({ createdAt: -1 })
        .skip(skip)
        .limit(limit)
        .lean(),
      EnhancedBooking.countDocuments(query)
    ]);

    console.log(`✅ Found ${bookings.length} enhanced bookings`);

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
    console.error('❌ Error fetching enhanced bookings:', error);
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
    // Custom auth implementation
    const token = request.cookies.get('auth-token')?.value;
    if (!token) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    if (!token?.user?.id) {
      return NextResponse.json({
        success: false,
        error: 'Authentication required'
      }, { status: 401 });
    }

    const bookingData = await request.json();
    
    console.log('📝 Creating enhanced booking...');

    // Validate required fields
    if (!bookingData.vendor || !bookingData.services || !bookingData.schedule) {
      return NextResponse.json({
        success: false,
        error: 'Vendor, services, and schedule are required'
      }, { status: 400 });
    }

    // Check availability
    const availability = await checkAvailability(
      bookingData.vendor,
      bookingData.venue,
      bookingData.schedule.date,
      bookingData.schedule.startTime,
      bookingData.schedule.endTime
    );

    if (!availability.available) {
      return NextResponse.json({
        success: false,
        error: 'Time slot not available',
        details: availability.conflicts
      }, { status: 409 });
    }

    // Calculate dynamic pricing
    const pricing = await calculateDynamicPricing(
      bookingData.vendor,
      bookingData.services,
      bookingData.schedule.date,
      bookingData.schedule.startTime
    );

    // Create enhanced booking
    const newBooking = new EnhancedBooking({
      user: session.user.id,
      vendor: bookingData.vendor,
      venue: bookingData.venue,
      services: bookingData.services,
      schedule: {
        date: new Date(bookingData.schedule.date),
        startTime: bookingData.schedule.startTime,
        endTime: bookingData.schedule.endTime,
        duration: bookingData.schedule.duration || 60,
        timezone: bookingData.schedule.timezone || 'UTC',
        recurring: bookingData.schedule.recurring
      },
      pricing: {
        basePrice: pricing.basePrice,
        dynamicPricing: pricing.dynamicPricing,
        discounts: pricing.discounts,
        totalPrice: pricing.totalPrice,
        currency: pricing.currency || 'LKR',
        taxRate: pricing.taxRate || 0,
        taxAmount: pricing.taxAmount || 0,
        finalPrice: pricing.finalPrice
      },
      status: 'pending',
      payment: {
        status: 'pending',
        method: bookingData.paymentMethod || 'stripe',
        amount: pricing.finalPrice
      },
      notifications: {
        reminders: [],
        followUps: [],
        lastSent: new Date()
      },
      metadata: {
        source: 'web',
        referrer: bookingData.referrer,
        campaign: bookingData.campaign,
        notes: bookingData.notes,
        customFields: bookingData.customFields || []
      },
      waitlist: {
        isWaitlisted: false,
        position: 0,
        priority: 'medium'
      },
      conflicts: [],
      reviews: {},
      attachments: [],
      isActive: true
    });

    await newBooking.save();

    // Update availability
    await updateAvailability(
      bookingData.vendor,
      bookingData.venue,
      bookingData.schedule.date,
      bookingData.schedule.startTime,
      bookingData.schedule.endTime,
      'book'
    );

    // Populate the response
    const populatedBooking = await EnhancedBooking.findById(newBooking._id)
      .populate('user', 'name email phone')
      .populate('vendor', 'businessName email phone')
      .populate('venue', 'name location')
      .populate('services.service', 'name description')
      .lean();

    console.log('✅ Enhanced booking created successfully:', newBooking._id);

    return NextResponse.json({
      success: true,
      booking: populatedBooking,
      message: 'Booking created successfully'
    }, { status: 201 });

  } catch (error) {
    console.error('❌ Error creating enhanced booking:', error);
    return NextResponse.json({
      success: false,
      error: 'Failed to create booking',
      message: error instanceof Error ? error.message : 'Unknown error'
    }, { status: 500 });
  }
}

async function checkAvailability(vendorId: string, venueId: string, date: string, startTime: string, endTime: string) {
  try {
    const availability = await Availability.findOne({
      vendor: vendorId,
      venue: venueId || { $exists: false },
      date: new Date(date),
      isActive: true
    });

    if (!availability) {
      return { available: false, conflicts: ['No availability found for this vendor and date'] };
    }

    const timeSlot = availability.timeSlots.find(slot => 
      slot.startTime === startTime && slot.endTime === endTime
    );

    if (!timeSlot) {
      return { available: false, conflicts: ['Time slot not found'] };
    }

    if (!timeSlot.isAvailable || timeSlot.currentBookings >= timeSlot.maxBookings) {
      return { available: false, conflicts: ['Time slot is fully booked'] };
    }

    return { available: true, conflicts: [] };
  } catch (error) {
    console.error('Error checking availability:', error);
    return { available: false, conflicts: ['Error checking availability'] };
  }
}

async function calculateDynamicPricing(vendorId: string, services: any[], date: string, startTime: string) {
  try {
    // Get dynamic pricing rules
    const pricingRules = await DynamicPricing.findOne({
      vendor: vendorId,
      isActive: true
    });

    let basePrice = 0;
    let multiplier = 1;
    const discounts: any[] = [];

    // Calculate base price from services
    services.forEach(service => {
      basePrice += service.price * service.quantity;
    });

    // Apply dynamic pricing if rules exist
    if (pricingRules) {
      // Apply time-based pricing
      const timeBasedRule = pricingRules.timeBasedPricing.find(rule => 
        rule.isActive && 
        rule.dayOfWeek.includes(new Date(date).getDay()) &&
        startTime >= rule.startTime && 
        startTime <= rule.endTime
      );

      if (timeBasedRule) {
        multiplier *= timeBasedRule.multiplier;
      }

      // Apply seasonal pricing
      const currentDate = new Date(date);
      const monthDay = `${String(currentDate.getMonth() + 1).padStart(2, '0')}-${String(currentDate.getDate()).padStart(2, '0')}`;
      
      const seasonalRule = pricingRules.seasonalPricing.find(rule => 
        rule.isActive && 
        monthDay >= rule.startDate && 
        monthDay <= rule.endDate
      );

      if (seasonalRule) {
        multiplier *= seasonalRule.multiplier;
      }
    }

    const totalPrice = basePrice * multiplier;
    const taxRate = 0.15; // 15% tax
    const taxAmount = totalPrice * taxRate;
    const finalPrice = totalPrice + taxAmount;

    return {
      basePrice,
      dynamicPricing: {
        multiplier,
        factors: ['time', 'season'],
        appliedAt: new Date()
      },
      discounts,
      totalPrice,
      currency: 'LKR',
      taxRate,
      taxAmount,
      finalPrice
    };
  } catch (error) {
    console.error('Error calculating dynamic pricing:', error);
    // Return base pricing if dynamic pricing fails
    const basePrice = services.reduce((sum, service) => sum + (service.price * service.quantity), 0);
    return {
      basePrice,
      dynamicPricing: { multiplier: 1, factors: [], appliedAt: new Date() },
      discounts: [],
      totalPrice: basePrice,
      currency: 'LKR',
      taxRate: 0.15,
      taxAmount: basePrice * 0.15,
      finalPrice: basePrice * 1.15
    };
  }
}

async function updateAvailability(vendorId: string, venueId: string, date: string, startTime: string, endTime: string, action: 'book' | 'cancel') {
  try {
    const availability = await Availability.findOne({
      vendor: vendorId,
      venue: venueId || { $exists: false },
      date: new Date(date),
      isActive: true
    });

    if (availability) {
      const timeSlot = availability.timeSlots.find(slot => 
        slot.startTime === startTime && slot.endTime === endTime
      );

      if (timeSlot) {
        if (action === 'book') {
          timeSlot.currentBookings += 1;
          if (timeSlot.currentBookings >= timeSlot.maxBookings) {
            timeSlot.isAvailable = false;
          }
        } else if (action === 'cancel') {
          timeSlot.currentBookings = Math.max(0, timeSlot.currentBookings - 1);
          if (timeSlot.currentBookings < timeSlot.maxBookings) {
            timeSlot.isAvailable = true;
          }
        }

        await availability.save();
      }
    }
  } catch (error) {
    console.error('Error updating availability:', error);
  }
}
