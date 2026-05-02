import { NextRequest, NextResponse } from 'next/server';
import { connectDB } from '@/lib/db';
import { getUserFromRequestWithError } from '@/lib/auth/get-user-from-request';
import { User, Vendor, Booking } from '@/lib/models';

export async function GET(request: NextRequest) {
  try {
    const { user: authUser, error } = getUserFromRequestWithError(request);
    if (error) return error;
    if (!authUser || authUser.role !== 'vendor') {
      return NextResponse.json({ error: "Vendor access required" }, { status: 403 });
    }

    await connectDB();

    const user = await User.findOne({ email: authUser.email });
    if (!user) {
      return NextResponse.json({ error: "User not found" }, { status: 404 });
    }

    console.log('📊 Fetching vendor services from MongoDB Atlas...');

    // Get vendor profile with services
    const vendor = await Vendor.findOne({ owner: authUser.id });
    if (!vendor) {
      return NextResponse.json({ error: "Vendor profile not found" }, { status: 404 });
    }

    // Get vendor bookings to calculate service statistics
    const bookings = await Booking.find({ vendor: vendor._id });

    // Format services for frontend
    const vendorServices = vendor.services ? vendor.services.map((service: { name: string; price: number; description?: string }, index: number) => {
      const serviceBookings = bookings.filter(b => 
        b.service?.name === service.name
      ).length;

      return {
        id: `${vendor._id}-service-${index}`,
        name: service.name,
        category: vendor.category || 'general',
        price: service.price,
        description: service.description,
        isActive: true, // All services in vendor profile are considered active
        bookings: serviceBookings,
        rating: vendor.rating?.average || 0
      };
    }) : [];

    console.log('✅ Vendor services fetched successfully');

    return NextResponse.json({
      success: true,
      services: vendorServices
    });

  } catch (error) {
    console.error('❌ Error fetching vendor services:', error);
    return NextResponse.json({
      success: false,
      error: 'Failed to fetch vendor services',
      message: error instanceof Error ? error.message : 'Unknown error'
    }, { status: 500 });
  }
}

export async function PATCH(request: NextRequest) {
  try {
    const { user: authUser, error } = getUserFromRequestWithError(request);
    if (error) return error;
    if (!authUser || authUser.role !== 'vendor') {
      return NextResponse.json({ error: "Vendor access required" }, { status: 403 });
    }

    await connectDB();

    const user = await User.findOne({ email: authUser.email });
    if (!user || user.role !== 'vendor') {
      return NextResponse.json({ error: "Vendor access required" }, { status: 403 });
    }

    const { serviceId, updates } = await request.json();
    
    console.log('📝 Updating vendor service:', { serviceId, updates });

    // Get vendor profile
    const vendor = await Vendor.findOne({ owner: authUser.id });
    if (!vendor) {
      return NextResponse.json({ error: "Vendor profile not found" }, { status: 404 });
    }

    // For now, we'll just return success since service management
    // would require more complex logic to update individual services
    // in the vendor's services array
    console.log('✅ Service update request received:', serviceId);
    return NextResponse.json({
      success: true,
      message: 'Service update request received. Full service management will be implemented in future updates.'
    });

  } catch (error) {
    console.error('❌ Error updating vendor service:', error);
    return NextResponse.json({
      success: false,
      error: 'Failed to update vendor service',
      message: error instanceof Error ? error.message : 'Unknown error'
    }, { status: 500 });
  }
}