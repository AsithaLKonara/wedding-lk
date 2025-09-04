import { NextRequest, NextResponse } from 'next/server';
import { LocalDatabase } from '@/lib/local-database';

export async function GET(request: NextRequest) {
  try {
    console.log('📊 Fetching vendor services from local database...');

    // Mock vendor services (in real app, you'd filter by current vendor)
    const vendorServices = [
      {
        id: 'service-1',
        name: 'Basic Venue Package',
        category: 'venue',
        price: 150000,
        description: 'Standard venue rental with basic amenities',
        isActive: true,
        bookings: 15,
        rating: 4.5
      },
      {
        id: 'service-2',
        name: 'Premium Venue Package',
        category: 'venue',
        price: 250000,
        description: 'Premium venue with full amenities and decoration',
        isActive: true,
        bookings: 8,
        rating: 4.8
      },
      {
        id: 'service-3',
        name: 'Basic Catering Package',
        category: 'catering',
        price: 80000,
        description: 'Traditional Sri Lankan buffet for 100 guests',
        isActive: true,
        bookings: 12,
        rating: 4.6
      },
      {
        id: 'service-4',
        name: 'Premium Catering Package',
        category: 'catering',
        price: 120000,
        description: 'Multi-cuisine buffet with live cooking stations',
        isActive: false,
        bookings: 5,
        rating: 4.9
      }
    ];

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
    const { serviceId, updates } = await request.json();
    
    console.log('📝 Updating vendor service:', { serviceId, updates });

    // Mock service update
    console.log('✅ Service updated successfully:', serviceId);
    return NextResponse.json({
      success: true,
      message: 'Service updated successfully'
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