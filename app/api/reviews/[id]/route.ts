import { NextRequest, NextResponse } from 'next/server';
import { connectDB } from '@/lib/db';
import { Review } from '@/lib/models/review';
import { withAuth, requireUser, requireAdmin } from '@/lib/middleware/auth-middleware';
import { withRateLimit, rateLimitConfigs } from '@/lib/middleware/rate-limit-middleware';

// GET - Get a specific review
async function getReview(request: NextRequest, { params }: { params: { id: string } }) {
  try {
    const { id } = params;

    await connectDB();

    const review = await Review.findById(id)
      .populate('userId', 'name avatar')
      .populate('vendorId', 'businessName')
      .populate('bookingId', 'bookingDate status')
      .lean();

    if (!review) {
      return NextResponse.json({
        success: false,
        error: 'Review not found'
      }, { status: 404 });
    }

    return NextResponse.json({
      success: true,
      review
    });

  } catch (error) {
    console.error('Error fetching review:', error);
    return NextResponse.json({
      success: false,
      error: 'Failed to fetch review'
    }, { status: 500 });
  }
}

// PUT - Update a review (only by the author)
async function updateReview(request: NextRequest, { params }: { params: { id: string } }) {
  try {
    const user = (request as any).user;
    const { id } = params;
    const updateData = await request.json();

    await connectDB();

    const review = await Review.findById(id);

    if (!review) {
      return NextResponse.json({
        success: false,
        error: 'Review not found'
      }, { status: 404 });
    }

    // Check if user is the author
    if (review.userId.toString() !== user.id) {
      return NextResponse.json({
        success: false,
        error: 'You can only update your own reviews'
      }, { status: 403 });
    }

    // Check if review can be updated (not too old)
    const daysSinceCreated = (Date.now() - review.createdAt.getTime()) / (1000 * 60 * 60 * 24);
    if (daysSinceCreated > 30) {
      return NextResponse.json({
        success: false,
        error: 'Reviews can only be updated within 30 days of creation'
      }, { status: 400 });
    }

    // Update allowed fields
    const allowedUpdates = ['overallRating', 'categoryRatings', 'title', 'comment', 'pros', 'cons', 'images', 'videos'];
    const updates: any = {};
    
    allowedUpdates.forEach(field => {
      if (updateData[field] !== undefined) {
        updates[field] = updateData[field];
      }
    });

    const updatedReview = await Review.findByIdAndUpdate(
      id,
      { ...updates, status: 'pending' }, // Reset to pending for moderation
      { new: true }
    );

    // Update vendor rating if overall rating changed
    if (updateData.overallRating) {
      updateVendorRating(review.vendorId.toString());
    }

    return NextResponse.json({
      success: true,
      review: updatedReview,
      message: 'Review updated successfully'
    });

  } catch (error) {
    console.error('Error updating review:', error);
    return NextResponse.json({
      success: false,
      error: 'Failed to update review'
    }, { status: 500 });
  }
}

// DELETE - Delete a review (only by the author or admin)
async function deleteReview(request: NextRequest, { params }: { params: { id: string } }) {
  try {
    const user = (request as any).user;
    const { id } = params;

    await connectDB();

    const review = await Review.findById(id);

    if (!review) {
      return NextResponse.json({
        success: false,
        error: 'Review not found'
      }, { status: 404 });
    }

    // Check if user is the author or admin
    if (review.userId.toString() !== user.id && user.role !== 'admin') {
      return NextResponse.json({
        success: false,
        error: 'You can only delete your own reviews'
      }, { status: 403 });
    }

    await Review.findByIdAndDelete(id);

    // Update vendor rating
    updateVendorRating(review.vendorId.toString());

    return NextResponse.json({
      success: true,
      message: 'Review deleted successfully'
    });

  } catch (error) {
    console.error('Error deleting review:', error);
    return NextResponse.json({
      success: false,
      error: 'Failed to delete review'
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
        }
      }
    });
  } catch (error) {
    console.error('Error updating vendor rating:', error);
  }
}

export const GET = withRateLimit(
  rateLimitConfigs.public,
  getReview
);

export const PUT = withRateLimit(
  rateLimitConfigs.api,
  withAuth(updateReview, requireUser())
);

export const DELETE = withRateLimit(
  rateLimitConfigs.api,
  withAuth(deleteReview, requireUser())
);