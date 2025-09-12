import { NextRequest, NextResponse } from 'next/server';
import { connectDB } from '@/lib/db';
import { EnhancedBooking, VendorPackage, Availability } from '@/lib/models';
import { getServerSession, authOptions } from '@/lib/auth/nextauth-config';

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

    const bookingData = await request.json();
    
    console.log('📝 Creating vendor package booking...');

    // Validate required fields
    if (!bookingData.packageId || !bookingData.schedule) {
      return NextResponse.json({
        success: false,
        error: 'Package ID and schedule are required'
      }, { status: 400 });
    }

    // Get package details
    const packageData = await VendorPackage.findById(bookingData.packageId)
      .populate('vendor', 'businessName email phone')
      .populate('services.service', 'name description');

    if (!packageData) {
      return NextResponse.json({
        success: false,
        error: 'Package not found'
      }, { status: 404 });
    }

    // Check package availability
    if (!packageData.availability.isAvailable) {
      return NextResponse.json({
        success: false,
        error: 'Package is not currently available'
      }, { status: 409 });
    }

    if (packageData.availability.currentBookings >= packageData.availability.maxBookings) {
      return NextResponse.json({
        success: false,
        error: 'Package is fully booked'
      }, { status: 409 });
    }

    // Check date availability
    const bookingDate = new Date(bookingData.schedule.date);
    const today = new Date();
    const advanceBookingDays = packageData.availability.advanceBookingDays;
    const maxBookingDate = new Date(today.getTime() + (advanceBookingDays * 24 * 60 * 60 * 1000));

    if (bookingDate < today || bookingDate > maxBookingDate) {
      return NextResponse.json({
        success: false,
        error: `Booking must be between today and ${advanceBookingDays} days in advance`
      }, { status: 400 });
    }

    // Check blackout dates
    if (packageData.availability.blackoutDates.some(date => 
      new Date(date).toDateString() === bookingDate.toDateString()
    )) {
      return NextResponse.json({
        success: false,
        error: 'Selected date is not available for this package'
      }, { status: 409 });
    }

    // Calculate pricing
    const basePrice = packageData.pricing.discountedPrice || packageData.pricing.basePrice;
    const taxRate = 0.15; // 15% tax
    const taxAmount = basePrice * taxRate;
    const finalPrice = basePrice + taxAmount;

    // Create booking
    const newBooking = new EnhancedBooking({
      user: session.user.id,
      vendor: packageData.vendor._id,
      venue: bookingData.venueId,
      services: packageData.services.map(service => ({
        service: service.service._id,
        quantity: service.quantity,
        price: service.price,
        customizations: bookingData.customizations?.[service.service._id] || []
      })),
      schedule: {
        date: bookingDate,
        startTime: bookingData.schedule.startTime,
        endTime: bookingData.schedule.endTime,
        duration: bookingData.schedule.duration || 8, // Default 8 hours
        timezone: bookingData.schedule.timezone || 'UTC',
        recurring: bookingData.schedule.recurring
      },
      pricing: {
        basePrice: packageData.pricing.basePrice,
        dynamicPricing: {
          multiplier: 1,
          factors: []
        },
        discounts: packageData.pricing.discountedPrice ? [{
          type: 'percentage',
          amount: packageData.pricing.discountPercentage || 0,
          reason: 'Package discount',
          appliedAt: new Date()
        }] : [],
        totalPrice: basePrice,
        currency: packageData.pricing.currency,
        taxRate,
        taxAmount,
        finalPrice
      },
      status: 'pending',
      payment: {
        status: 'pending',
        method: bookingData.paymentMethod || 'stripe',
        amount: finalPrice
      },
      notifications: {
        reminders: [],
        followUps: [],
        lastSent: new Date()
      },
      metadata: {
        source: 'web',
        packageId: bookingData.packageId,
        packageName: packageData.name,
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

    // Update package booking count
    await VendorPackage.findByIdAndUpdate(bookingData.packageId, {
      $inc: { 'availability.currentBookings': 1 }
    });

    // Update availability if needed
    if (packageData.availability.currentBookings + 1 >= packageData.availability.maxBookings) {
      await VendorPackage.findByIdAndUpdate(bookingData.packageId, {
        'availability.isAvailable': false
      });
    }

    // Populate the response
    const populatedBooking = await EnhancedBooking.findById(newBooking._id)
      .populate('user', 'name email phone')
      .populate('vendor', 'businessName email phone')
      .populate('venue', 'name location')
      .populate('services.service', 'name description')
      .lean();

    console.log('✅ Vendor package booking created successfully:', newBooking._id);

    return NextResponse.json({
      success: true,
      booking: populatedBooking,
      message: 'Package booking created successfully'
    }, { status: 201 });

  } catch (error) {
    console.error('❌ Error creating vendor package booking:', error);
    return NextResponse.json({
      success: false,
      error: 'Failed to create booking',
      message: error instanceof Error ? error.message : 'Unknown error'
    }, { status: 500 });
  }
}
