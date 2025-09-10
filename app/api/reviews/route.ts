import { NextRequest, NextResponse } from 'next/server';
import { connectDB } from '@/lib/db';
import { Review } from '@/lib/models/review';
import { User } from '@/lib/models/user';
import { Vendor } from '@/lib/models/vendor';
import { withAuth, requireUser } from '@/lib/middleware/auth-middleware';
import { withRateLimit, rateLimitConfigs } from '@/lib/middleware/rate-limit-middleware';

// GET - Get reviews for a vendor or user
async function getReviews(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const vendorId = searchParams.get('vendorId');
    const userId = searchParams.get('userId');
    const page = parseInt(searchParams.get('page') || '1');
    const limit = Math.min(parseInt(searchParams.get('limit') || '10'), 50);
    const sortBy = searchParams.get('sortBy') || 'newest';
    const rating = searchParams.get('rating');
    const verified = searchParams.get('verified');

    await connectDB();

    // Build query
    const query: any = { status: 'approved' };
    
    if (vendorId) {
      query.vendorId = vendorId;
    }
    
    if (userId) {
      query.userId = userId;
    }
    
    if (rating) {
      query.overallRating = parseInt(rating);
    }
    
    if (verified === 'true') {
      query.isVerified = true;
    }

    // Build sort criteria
    let sortCriteria: any = {};
    switch (sortBy) {
      case 'newest':
        sortCriteria.createdAt = -1;
        break;
      case 'oldest':
        sortCriteria.createdAt = 1;
        break;
      case 'highest_rating':
        sortCriteria.overallRating = -1;
        break;
      case 'lowest_rating':
        sortCriteria.overallRating = 1;
        break;
      case 'most_helpful':
        sortCriteria.helpful = -1;
        break;
      default:
        sortCriteria.createdAt = -1;
    }

    const reviews = await Review.find(query)
      .sort(sortCriteria)
      .skip((page - 1) * limit)
      .limit(limit)
      .lean();

    // Get total count for pagination
    const total = await Review.countDocuments(query);

    // Calculate average rating
    const avgRating = await Review.aggregate([
      { $match: { ...query, overallRating: { $exists: true } } },
      { $group: { _id: null, average: { $avg: '$overallRating' }, count: { $sum: 1 } } }
    ]);

    // Get rating distribution
    const ratingDistribution = await Review.aggregate([
      { $match: { ...query, overallRating: { $exists: true } } },
      { $group: { _id: '$overallRating', count: { $sum: 1 } } },
      { $sort: { _id: -1 } }
    ]);

    return NextResponse.json({
      success: true,
      reviews,
      pagination: {
        page,
        limit,
        total,
        totalPages: Math.ceil(total / limit)
      },
      statistics: {
        averageRating: avgRating[0]?.average || 0,
        totalReviews: avgRating[0]?.count || 0,
        ratingDistribution: ratingDistribution.reduce((acc, item) => {
          acc[item._id] = item.count;
          return acc;
        }, {})
      }
    });

  } catch (error) {
    console.error('Error fetching reviews:', error);
    return NextResponse.json({
      success: false,
      error: 'Failed to fetch reviews'
    }, { status: 500 });
  }
}

// POST - Create a new review
async function createReview(request: NextRequest) {
  try {
    const user = (request as any).user;
    const {
      vendorId,
      venueId,
      bookingId,
      overallRating,
      categoryRatings,
      title,
      comment,
      pros,
      cons,
      images,
      videos,
      isAnonymous
    } = await request.json();

    // Validate required fields
    if (!vendorId || !overallRating || !title || !comment) {
      return NextResponse.json({
        success: false,
        error: 'Missing required fields'
      }, { status: 400 });
    }

    // Validate rating
    if (overallRating < 1 || overallRating > 5) {
      return NextResponse.json({
        success: false,
        error: 'Rating must be between 1 and 5'
      }, { status: 400 });
    }

    await connectDB();

    // Check if user has already reviewed this vendor
    const existingReview = await Review.findOne({
      vendorId,
      userId: user.id
    });

    if (existingReview) {
      return NextResponse.json({
        success: false,
        error: 'You have already reviewed this vendor'
      }, { status: 400 });
    }

    // Verify user has a booking with this vendor (optional verification)
    if (bookingId) {
      const booking = await Booking.findOne({
        _id: bookingId,
        userId: user.id,
        vendorId,
        status: { $in: ['completed', 'confirmed'] }
      });

      if (!booking) {
        return NextResponse.json({
          success: false,
          error: 'Invalid booking reference'
        }, { status: 400 });
      }
    }

    // Create review
    const review = new Review({
      vendorId,
      venueId,
      userId: user.id,
      bookingId,
      overallRating,
      categoryRatings: categoryRatings || {
        service: overallRating,
        quality: overallRating,
        value: overallRating,
        communication: overallRating,
        timeliness: overallRating
      },
      title,
      comment,
      pros: pros || [],
      cons: cons || [],
      images: images || [],
      videos: videos || [],
      isAnonymous: isAnonymous || false,
      status: 'pending' // Will be auto-approved or require moderation
    });

    await review.save();

    // Update vendor rating (async)
    updateVendorRating(vendorId);

    return NextResponse.json({
      success: true,
      review: {
        id: review._id,
        overallRating: review.overallRating,
        title: review.title,
        comment: review.comment,
        createdAt: review.createdAt
      },
      message: 'Review submitted successfully'
    }, { status: 201 });

  } catch (error) {
    console.error('Error creating review:', error);
    return NextResponse.json({
      success: false,
      error: 'Failed to create review'
    }, { status: 500 });
  }
}

// Helper function to update vendor rating
async function updateVendorRating(vendorId: string) {
  try {
    const reviews = await Review.find({
      vendorId,
      status: 'approved'
    });

    if (reviews.length === 0) return;

    const totalRating = reviews.reduce((sum, review) => sum + review.overallRating, 0);
    const averageRating = totalRating / reviews.length;

    const categoryTotals = reviews.reduce((acc, review) => {
      Object.keys(review.categoryRatings).forEach(category => {
        acc[category] = (acc[category] || 0) + review.categoryRatings[category];
      });
      return acc;
    }, {});

    const categoryAverages = Object.keys(categoryTotals).reduce((acc, category) => {
      acc[category] = categoryTotals[category] / reviews.length;
      return acc;
    }, {});

    await Vendor.findByIdAndUpdate(vendorId, {
      rating: {
        average: Math.round(averageRating * 10) / 10,
        count: reviews.length,
        breakdown: {
          1: reviews.filter(r => r.overallRating === 1).length,
          2: reviews.filter(r => r.overallRating === 2).length,
          3: reviews.filter(r => r.overallRating === 3).length,
          4: reviews.filter(r => r.overallRating === 4).length,
          5: reviews.filter(r => r.overallRating === 5).length
        },
        categoryAverages
      }
    });
  } catch (error) {
    console.error('Error updating vendor rating:', error);
  }
}

export const GET = withRateLimit(
  rateLimitConfigs.public,
  getReviews
);

export const POST = withRateLimit(
  rateLimitConfigs.api,
  withAuth(createReview, requireUser())
);