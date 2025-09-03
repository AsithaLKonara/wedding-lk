import { NextRequest, NextResponse } from 'next/server';
import { optimizedDataService } from '../../../lib/optimized-data-service';

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    
    const page = parseInt(searchParams.get('page') || '1');
    const limit = parseInt(searchParams.get('limit') || '10');
    const type = searchParams.get('type') || undefined;
    const rating = parseFloat(searchParams.get('rating') || '0');
    const minCapacity = parseInt(searchParams.get('minCapacity') || '0');
    const maxCapacity = parseInt(searchParams.get('maxCapacity') || '0');
    
    console.log('🏛️ Fetching venues with optimized service...');
    const startTime = Date.now();
    
    const result = await optimizedDataService.getVenues({
      page,
      limit,
      type,
      capacity: {
        min: minCapacity > 0 ? minCapacity : undefined,
        max: maxCapacity > 0 ? maxCapacity : undefined
      },
      rating: rating > 0 ? rating : undefined,
      available: true,
      verified: true
    });
    
    const fetchTime = Date.now() - startTime;
    console.log(`⚡ Venues fetched in ${fetchTime}ms (${result.venues.length} results)`);
    
    return NextResponse.json({
      ...result,
      performance: {
        fetchTime,
        cached: result.cached,
        timestamp: new Date().toISOString()
      }
    });
    
  } catch (error) {
    console.error('❌ Error fetching venues:', error);
    return NextResponse.json(
      { error: 'Failed to fetch venues' },
      { status: 500 }
    );
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    
    // This is a placeholder implementation
    // In a real app, you'd validate the data and save to database
    const venue = {
      _id: 'placeholder_venue_id',
      name: body.name || 'New Venue',
      type: body.type || 'General',
      description: body.description || 'Venue description',
      capacity: body.capacity || 100,
      location: body.location || { address: 'Address', city: 'City', country: 'Country' },
      amenities: body.amenities || [],
      pricing: body.pricing || { weekday: 1000, weekend: 1500, holiday: 2000 },
      images: body.images || [],
      rating: 0,
      totalReviews: 0,
      isAvailable: true,
      isVerified: false,
      owner: 'placeholder_user_id'
    };

    return NextResponse.json({
      success: true,
      venue,
      message: 'Venue created successfully',
    });
  } catch (error) {
    console.error('Error creating venue:', error);
    return NextResponse.json(
      { error: 'Failed to create venue' },
      { status: 500 }
    );
  }
}

export async function PUT(request: NextRequest) {
  try {
    const body = await request.json();
    const { venueId, ...updateData } = body;

    if (!venueId) {
      return NextResponse.json({ error: 'Venue ID is required' }, { status: 400 });
    }

    // This is a placeholder implementation
    const updatedVenue = {
      _id: venueId,
      ...updateData,
      updatedAt: new Date().toISOString()
    };

    return NextResponse.json({
      success: true,
      venue: updatedVenue,
      message: 'Venue updated successfully',
    });
  } catch (error) {
    console.error('Error updating venue:', error);
    return NextResponse.json(
      { error: 'Failed to update venue' },
      { status: 500 }
    );
  }
}

export async function DELETE(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const venueId = searchParams.get('id');

    if (!venueId) {
      return NextResponse.json({ error: 'Venue ID is required' }, { status: 400 });
    }

    // This is a placeholder implementation
    return NextResponse.json({
      success: true,
      message: 'Venue deleted successfully',
    });
  } catch (error) {
    console.error('Error deleting venue:', error);
    return NextResponse.json(
      { error: 'Failed to delete venue' },
      { status: 500 }
    );
  }
}

export async function OPTIONS(request: NextRequest) {
  return new NextResponse(null, {
    status: 200,
    headers: {
      "Access-Control-Allow-Origin": "*",
      "Access-Control-Allow-Methods": "GET, POST, PUT, DELETE, OPTIONS",
      "Access-Control-Allow-Headers": "Content-Type, Authorization",
    },
  })
}
