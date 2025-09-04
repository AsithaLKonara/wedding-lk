import { NextRequest, NextResponse } from 'next/server';
import { LocalDatabase } from '@/lib/local-database';

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const page = parseInt(searchParams.get('page') || '1');
    const limit = parseInt(searchParams.get('limit') || '10');
    const city = searchParams.get('city');
    const minCapacity = parseInt(searchParams.get('minCapacity') || '0');
    const maxPrice = parseInt(searchParams.get('maxPrice') || '999999999');
    const search = searchParams.get('search');

    console.log('📊 Fetching venues from local database...');

    let venues = LocalDatabase.read('venues');

    // Filter by city if provided
    if (city) {
      venues = venues.filter((venue: any) => venue.location.city === city);
    }

    // Filter by capacity
    venues = venues.filter((venue: any) => venue.capacity.min >= minCapacity);

    // Filter by price
    venues = venues.filter((venue: any) => venue.pricing.startingPrice <= maxPrice);

    // Search functionality
    if (search) {
      venues = LocalDatabase.search('venues', search, ['name', 'description', 'location.address']);
    }

    // Get paginated results
    const paginatedResult = LocalDatabase.paginate('venues', page, limit);

    console.log(`✅ Found ${venues.length} venues`);

    return NextResponse.json({
      success: true,
      venues: paginatedResult.data,
      pagination: {
        total: paginatedResult.total,
        page: paginatedResult.page,
        limit: paginatedResult.limit,
        totalPages: paginatedResult.totalPages
      }
    });

  } catch (error) {
    console.error('❌ Error fetching venues:', error);
    return NextResponse.json({
      success: false,
      error: 'Failed to fetch venues',
      message: error instanceof Error ? error.message : 'Unknown error'
    }, { status: 500 });
  }
}

export async function POST(request: NextRequest) {
  try {
    const venueData = await request.json();
    
    console.log('📝 Creating new venue...');

    // Validate required fields
    if (!venueData.name || !venueData.capacity || !venueData.price || !venueData.vendor) {
      return NextResponse.json({
        success: false,
        error: 'Name, capacity, price, and vendor are required'
      }, { status: 400 });
    }

    // Create venue
    const newVenue = LocalDatabase.create('venues', {
      ...venueData,
      isAvailable: true,
      rating: {
        average: 0,
        count: 0
      },
      amenities: venueData.amenities || [],
      images: venueData.images || []
    });

    if (!newVenue) {
      return NextResponse.json({
        success: false,
        error: 'Failed to create venue'
      }, { status: 500 });
    }

    console.log('✅ Venue created successfully:', newVenue.name);

    return NextResponse.json({
      success: true,
      venue: newVenue,
      message: 'Venue created successfully'
    });

  } catch (error) {
    console.error('❌ Error creating venue:', error);
    return NextResponse.json({
      success: false,
      error: 'Failed to create venue',
      message: error instanceof Error ? error.message : 'Unknown error'
    }, { status: 500 });
  }
}