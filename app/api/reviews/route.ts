import { NextRequest, NextResponse } from 'next/server';
import { connectDB } from '@/lib/db';
import { getServerSession } from '@/lib/auth-utils';
import { User, Vendor, Venue, Booking, Payment, Review, Task, Post } from '@/lib/models';

export async function GET(request: NextRequest) {
  try {
    await connectDB();

    const { searchParams } = new URL(request.url);
    const page = parseInt(searchParams.get('page') || '1');
    const limit = parseInt(searchParams.get('limit') || '10');
    const itemId = searchParams.get('itemId');
    const itemType = searchParams.get('itemType');
    const userId = searchParams.get('userId');

    console.log('📊 Fetching reviews from MongoDB Atlas...');

    // Build query
    const query: any = {};
    
    if (itemId && itemType) {
      query[`${itemType}Id`] = itemId;
    }

    if (userId) {
      query.userId = userId;
    }

    // Calculate skip value for pagination
    const skip = (page - 1) * limit;

    // Execute query with pagination
    const [reviews, total] = await Promise.all([
      Review.find(query)
        .populate('userId', 'name email')
        .sort({ createdAt: -1 })
        .skip(skip)
        .limit(limit)
        .lean(),
      Review.countDocuments(query)
    ]);

    console.log(`✅ Found ${reviews.length} reviews`);

    return NextResponse.json({
      success: true,
      reviews,
      pagination: {
        total,
        page,
        limit,
        totalPages: Math.ceil(total / limit)
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
    const session = await getServerSession();
    
    if (!session?.user?.email) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    await connectDB();

    const user = await User.findOne({ email: session.user.email });
    if (!user) {
      return NextResponse.json({ error: "User not found" }, { status: 404 });
    }

    const reviewData = await request.json();
    
    console.log('📝 Creating new review...');

    // Validate required fields
    if (!reviewData.itemId || !reviewData.itemType || !reviewData.rating) {
      return NextResponse.json({
        success: false,
        error: 'Item ID, item type, and rating are required'
      }, { status: 400 });
    }

    // Validate rating
    if (reviewData.rating < 1 || reviewData.rating > 5) {
      return NextResponse.json({
        success: false,
        error: 'Rating must be between 1 and 5'
      }, { status: 400 });
    }

    // Check if user has already reviewed this item
    const existingReview = await Review.findOne({
      userId: user._id,
      [`${reviewData.itemType}Id`]: reviewData.itemId
    });

    if (existingReview) {
      return NextResponse.json({
        success: false,
        error: 'You have already reviewed this item'
      }, { status: 400 });
    }

    // Create review
    const newReview = new Review({
      userId: user._id,
      [`${reviewData.itemType}Id`]: reviewData.itemId,
      itemType: reviewData.itemType,
      rating: reviewData.rating,
      comment: reviewData.comment || '',
      images: reviewData.images || [],
      isVerified: false, // Will be verified if user has booking
      createdAt: new Date(),
      updatedAt: new Date()
    });

    await newReview.save();

    // Update the item's rating
    await updateItemRating(reviewData.itemId, reviewData.itemType);

    console.log('✅ Review created successfully:', newReview._id);

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

export async function PUT(request: NextRequest) {
  try {
    const session = await getServerSession();
    
    if (!session?.user?.email) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    await connectDB();

    const user = await User.findOne({ email: session.user.email });
    if (!user) {
      return NextResponse.json({ error: "User not found" }, { status: 404 });
    }

    const { reviewId, ...updateData } = await request.json();
    
    console.log('📝 Updating review...', reviewId);

    // Find the review
    const review = await Review.findById(reviewId);
    if (!review) {
      return NextResponse.json({
        success: false,
        error: 'Review not found'
      }, { status: 404 });
    }

    // Check if user owns this review
    if (review.userId.toString() !== user._id.toString()) {
      return NextResponse.json({
        success: false,
        error: 'Unauthorized to update this review'
      }, { status: 403 });
    }

    // Update review
    Object.assign(review, updateData);
    review.updatedAt = new Date();
    await review.save();

    // Update the item's rating
    await updateItemRating(review[`${review.itemType}Id`], review.itemType);

    console.log('✅ Review updated successfully');

    return NextResponse.json({
      success: true,
      review,
      message: 'Review updated successfully'
    });

  } catch (error) {
    console.error('❌ Error updating review:', error);
    return NextResponse.json({
      success: false,
      error: 'Failed to update review',
      message: error instanceof Error ? error.message : 'Unknown error'
    }, { status: 500 });
  }
}

export async function DELETE(request: NextRequest) {
  try {
    const session = await getServerSession();
    
    if (!session?.user?.email) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    await connectDB();

    const user = await User.findOne({ email: session.user.email });
    if (!user) {
      return NextResponse.json({ error: "User not found" }, { status: 404 });
    }

    const { searchParams } = new URL(request.url);
    const reviewId = searchParams.get('reviewId');
    
    console.log('📝 Deleting review...', reviewId);

    // Find the review
    const review = await Review.findById(reviewId);
    if (!review) {
      return NextResponse.json({
        success: false,
        error: 'Review not found'
      }, { status: 404 });
    }

    // Check if user owns this review or is admin
    if (review.userId.toString() !== user._id.toString() && user.role !== 'admin') {
      return NextResponse.json({
        success: false,
        error: 'Unauthorized to delete this review'
      }, { status: 403 });
    }

    // Store item info before deletion
    const itemId = review[`${review.itemType}Id`];
    const itemType = review.itemType;

    // Delete review
    await Review.findByIdAndDelete(reviewId);

    // Update the item's rating
    await updateItemRating(itemId, itemType);

    console.log('✅ Review deleted successfully');

    return NextResponse.json({
      success: true,
      message: 'Review deleted successfully'
    });

  } catch (error) {
    console.error('❌ Error deleting review:', error);
    return NextResponse.json({
      success: false,
      error: 'Failed to delete review',
      message: error instanceof Error ? error.message : 'Unknown error'
    }, { status: 500 });
  }
}

// Helper function to update item rating
async function updateItemRating(itemId: string, itemType: string) {
  try {
    // Get all reviews for this item
    const reviews = await Review.find({
      [`${itemType}Id`]: itemId
    });

    if (reviews.length === 0) return;

    // Calculate average rating
    const totalRating = reviews.reduce((sum, review) => sum + review.rating, 0);
    const averageRating = totalRating / reviews.length;

    // Update the item's rating
    if (itemType === 'venue') {
      await Venue.findByIdAndUpdate(itemId, {
        'rating.average': Math.round(averageRating * 10) / 10,
        'rating.count': reviews.length
      });
    } else if (itemType === 'vendor') {
      await Vendor.findByIdAndUpdate(itemId, {
        'rating.average': Math.round(averageRating * 10) / 10,
        'rating.count': reviews.length
      });
    }

    console.log(`✅ Updated ${itemType} rating:`, averageRating);
  } catch (error) {
    console.error('Error updating item rating:', error);
  }
}