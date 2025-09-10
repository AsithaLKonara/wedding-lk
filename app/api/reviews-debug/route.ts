import { NextRequest, NextResponse } from 'next/server';
import { connectDB } from '@/lib/db';
import { Review } from '@/lib/models/review';

// GET - Debug reviews without population
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const page = parseInt(searchParams.get('page') || '1');
    const limit = Math.min(parseInt(searchParams.get('limit') || '10'), 50);

    await connectDB();

    // Simple query without population
    const reviews = await Review.find({ status: 'approved' })
      .sort({ createdAt: -1 })
      .skip((page - 1) * limit)
      .limit(limit)
      .lean();

    // Get total count
    const total = await Review.countDocuments({ status: 'approved' });

    // Calculate average rating
    const avgRating = await Review.aggregate([
      { $match: { status: 'approved', overallRating: { $exists: true } } },
      { $group: { _id: null, average: { $avg: '$overallRating' }, count: { $sum: 1 } } }
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
        totalReviews: avgRating[0]?.count || 0
      },
      debug: {
        query: { status: 'approved' },
        foundReviews: reviews.length,
        sampleReview: reviews[0] || null
      }
    });

  } catch (error) {
    console.error('Error in debug reviews:', error);
    return NextResponse.json({
      success: false,
      error: error.message,
      stack: error.stack
    }, { status: 500 });
  }
}
