import { NextRequest, NextResponse } from 'next/server';
import { connectDB } from '@/lib/db';
import { Venue } from '@/lib/models';

export async function GET(request: NextRequest) {
  try {
    await connectDB();

    const { searchParams } = new URL(request.url);
    const page = parseInt(searchParams.get('page') || '1');
    const limit = parseInt(searchParams.get('limit') || '10');
    const city = searchParams.get('city');
    const minCapacity = parseInt(searchParams.get('minCapacity') || '0');
    const maxPrice = parseInt(searchParams.get('maxPrice') || '999999999');
    const search = searchParams.get('search');

    console.log('📊 Fetching venues from MongoDB Atlas...');

    // Build query
    const query: any = { isActive: true };
    
    if (city) {
      query['location.city'] = city;
    }

    if (minCapacity > 0) {
      query['capacity.min'] = { $gte: minCapacity };
    }

    if (maxPrice < 999999999) {
      query['pricing.startingPrice'] = { $lte: maxPrice };
    }

    if (search) {
      query.$or = [
        { name: { $regex: search, $options: 'i' } },
        { description: { $regex: search, $options: 'i' } },
        { 'location.address': { $regex: search, $options: 'i' } }
      ];
    }

    // Calculate skip value for pagination
    const skip = (page - 1) * limit;

    // Execute query with pagination
    const [venues, total] = await Promise.all([
      Venue.find(query)
        .sort({ createdAt: -1 })
        .skip(skip)
        .limit(limit)
        .lean(),
      Venue.countDocuments(query)
    ]);

    console.log(`✅ Found ${venues.length} venues`);

    return NextResponse.json({
      success: true,
      venues,
      pagination: {
        total,
        page,
        limit,
        totalPages: Math.ceil(total / limit)
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
    await connectDB();

    const venueData = await request.json();
    
    console.log('📝 Creating new venue...');

    // Validate required fields
    if (!venueData.name || !venueData.capacity || !venueData.pricing || !venueData.vendor) {
      return NextResponse.json({
        success: false,
        error: 'Name, capacity, pricing, and vendor are required'
      }, { status: 400 });
    }

    // Create venue
    const newVenue = new Venue({
      ...venueData,
      isActive: true,
      isAvailable: true,
      rating: {
        average: 0,
        count: 0
      },
      amenities: venueData.amenities || [],
      images: venueData.images || []
    });

    await newVenue.save();

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