import { NextRequest, NextResponse } from 'next/server';
import { LocalDatabase } from '@/lib/local-database';

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const page = parseInt(searchParams.get('page') || '1');
    const limit = parseInt(searchParams.get('limit') || '10');
    const clientId = searchParams.get('clientId');
    const vendorId = searchParams.get('vendorId');
    const venueId = searchParams.get('venueId');
    const bookingId = searchParams.get('bookingId');
    const minRating = parseInt(searchParams.get('minRating') || '1');
    const isVerified = searchParams.get('isVerified');

    console.log('📊 Fetching reviews from local database...');

    let reviews = LocalDatabase.read('reviews');

    // Filter by client if provided
    if (clientId) {
      reviews = reviews.filter((review: any) => review.client === clientId);
    }

    // Filter by vendor if provided
    if (vendorId) {
      reviews = reviews.filter((review: any) => review.vendor === vendorId);
    }

    // Filter by venue if provided
    if (venueId) {
      reviews = reviews.filter((review: any) => review.venue === venueId);
    }

    // Filter by booking if provided
    if (bookingId) {
      reviews = reviews.filter((review: any) => review.booking === bookingId);
    }

    // Filter by minimum rating
    reviews = reviews.filter((review: any) => review.rating >= minRating);

    // Filter by verification status if provided
    if (isVerified !== null) {
      const verified = isVerified === 'true';
      reviews = reviews.filter((review: any) => review.isVerified === verified);
    }

    // Get paginated results
    const paginatedResult = LocalDatabase.paginate('reviews', page, limit);

    console.log(`✅ Found ${reviews.length} reviews`);

    return NextResponse.json({
      success: true,
      reviews: paginatedResult.data,
      pagination: {
        total: paginatedResult.total,
        page: paginatedResult.page,
        limit: paginatedResult.limit,
        totalPages: paginatedResult.totalPages
      }
    });

  } catch (error) {
    console.error('❌ Error fetching reviews:', error);
    return NextResponse.json({
      success: false,
      error: 'Failed to fetch reviews',
      message: error instanceof Error ? error.message : 'Unknown error'
    }, { status: 500 });
  }
}

export async function POST(request: NextRequest) {
  try {
    const reviewData = await request.json();
    
    console.log('📝 Creating new review...');

    // Validate required fields
    if (!reviewData.client || !reviewData.rating || !reviewData.review) {
      return NextResponse.json({
        success: false,
        error: 'Client, rating, and review text are required'
      }, { status: 400 });
    }

    // Validate rating
    if (reviewData.rating < 1 || reviewData.rating > 5) {
      return NextResponse.json({
        success: false,
        error: 'Rating must be between 1 and 5'
      }, { status: 400 });
    }

    // Create review
    const newReview = LocalDatabase.create('reviews', {
      ...reviewData,
      isVerified: false,
      helpful: 0,
      images: reviewData.images || []
    });

    if (!newReview) {
      return NextResponse.json({
        success: false,
        error: 'Failed to create review'
      }, { status: 500 });
    }

    console.log('✅ Review created successfully:', newReview.id);

    return NextResponse.json({
      success: true,
      review: newReview,
      message: 'Review created successfully'
    });

  } catch (error) {
    console.error('❌ Error creating review:', error);
    return NextResponse.json({
      success: false,
      error: 'Failed to create review',
      message: error instanceof Error ? error.message : 'Unknown error'
    }, { status: 500 });
  }
}