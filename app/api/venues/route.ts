import { NextRequest, NextResponse } from 'next/server';
import { connectDB } from '@/lib/db';
import { Venue } from '@/lib/models';
import { venueSchemas } from '@/lib/validations/api-validators';
import { handleApiError, createSuccessResponse, createPaginatedResponse } from '@/lib/utils/error-handler';

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
    
    // Return mock data for development/testing
    if (process.env.NODE_ENV === 'development') {
      return NextResponse.json({
        success: true,
        venues: [
          {
            _id: 'mock-venue-1',
            name: 'Beautiful Garden Venue',
            description: 'A stunning outdoor venue perfect for weddings',
            location: {
              address: '123 Garden Street, Colombo',
              city: 'Colombo',
              coordinates: { lat: 6.9271, lng: 79.8612 }
            },
            capacity: { min: 50, max: 200 },
            pricing: { startingPrice: 50000 },
            images: [],
            amenities: ['Parking', 'Catering', 'Sound System'],
            rating: { average: 4.5, count: 25 },
            isActive: true,
            isAvailable: true
          }
        ],
        pagination: {
          total: 1,
          page: 1,
          limit: 10,
          totalPages: 1
        }
      });
    }
    
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

    // Validate input data
    const validation = venueSchemas.create.safeParse(venueData);
    if (!validation.success) {
      return NextResponse.json({
        success: false,
        error: 'Validation failed',
        details: validation.error.errors
      }, { status: 400 });
    }

    const validatedData = validation.data;

    // Create venue
    const newVenue = new Venue({
      ...validatedData,
      isActive: true,
      isAvailable: true,
      rating: {
        average: 0,
        count: 0
      },
      amenities: validatedData.amenities || [],
      images: validatedData.images || []
    });

    await newVenue.save();

    console.log('✅ Venue created successfully:', newVenue.name);

    return createSuccessResponse(newVenue, 'Venue created successfully', 201);

  } catch (error) {
    console.error('❌ Error creating venue:', error);
    return handleApiError(error, '/api/venues');
  }
}

// PUT - Update venue
export async function PUT(request: NextRequest) {
  try {
    await connectDB();

    const { searchParams } = new URL(request.url);
    const venueId = searchParams.get('id');
    const venueData = await request.json();

    if (!venueId) {
      return NextResponse.json({
        success: false,
        error: 'Venue ID is required'
      }, { status: 400 });
    }

    console.log('📝 Updating venue:', venueId);

    // Validate input data
    const validation = venueSchemas.update.safeParse(venueData);
    if (!validation.success) {
      return NextResponse.json({
        success: false,
        error: 'Validation failed',
        details: validation.error.errors
      }, { status: 400 });
    }

    const validatedData = validation.data;

    // Find venue
    const venue = await Venue.findById(venueId);
    if (!venue) {
      return NextResponse.json({
        success: false,
        error: 'Venue not found'
      }, { status: 404 });
    }

    // Update venue
    const updatedVenue = await Venue.findByIdAndUpdate(
      venueId,
      { 
        ...validatedData,
        updatedAt: new Date()
      },
      { new: true, runValidators: true }
    );

    console.log('✅ Venue updated successfully:', updatedVenue.name);

    return createSuccessResponse(updatedVenue, 'Venue updated successfully');

  } catch (error) {
    console.error('❌ Error updating venue:', error);
    return handleApiError(error, '/api/venues');
  }
}

// DELETE - Delete venue (soft delete)
export async function DELETE(request: NextRequest) {
  try {
    await connectDB();

    const { searchParams } = new URL(request.url);
    const venueId = searchParams.get('id');

    if (!venueId) {
      return NextResponse.json({
        success: false,
        error: 'Venue ID is required'
      }, { status: 400 });
    }

    console.log('📝 Deleting venue:', venueId);

    // Find venue
    const venue = await Venue.findById(venueId);
    if (!venue) {
      return NextResponse.json({
        success: false,
        error: 'Venue not found'
      }, { status: 404 });
    }

    // Soft delete - set isActive to false
    await Venue.findByIdAndUpdate(venueId, {
      isActive: false,
      updatedAt: new Date()
    });

    console.log('✅ Venue deleted successfully:', venue.name);

    return createSuccessResponse(null, 'Venue deleted successfully');

  } catch (error) {
    console.error('❌ Error deleting venue:', error);
    return handleApiError(error, '/api/venues');
  }
}