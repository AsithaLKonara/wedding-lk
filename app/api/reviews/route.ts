import { NextRequest, NextResponse } from 'next/server'
import { connectDB } from "@/lib/db"
import { Review } from "@/lib/models/review"
import { User } from "@/lib/models/user"
import { Vendor } from "@/lib/models/vendor"
import { Venue } from "@/lib/models/venue"
import { getServerSession } from '@/lib/auth-utils';

// POST /api/reviews - Submit review
export async function POST(request: NextRequest) {
  try {
    const session = await getServerSession()
    if (!session?.user?.email) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    await connectDB()

    const user = await User.findOne({ email: session.user.email })
    if (!user) {
      return NextResponse.json({ error: "User not found" }, { status: 404 })
    }

    const body = await request.json()
    const { vendorId, venueId, rating, comment, images, title } = body

    if (!rating || !comment) {
      return NextResponse.json({
        error: 'Rating and comment are required'
      }, { status: 400 })
    }

    if (rating < 1 || rating > 5) {
      return NextResponse.json({
        error: 'Rating must be between 1 and 5'
      }, { status: 400 })
    }

    // Validate that either vendor or venue is provided
    if (!vendorId && !venueId) {
      return NextResponse.json({
        error: 'Either vendor ID or venue ID is required'
      }, { status: 400 })
    }

    // Check if user has already reviewed this vendor/venue
    const existingReview = await Review.findOne({
      user: user._id,
      $or: [
        { vendor: vendorId },
        { venue: venueId }
      ]
    })

    if (existingReview) {
      return NextResponse.json({
        error: 'You have already reviewed this vendor/venue'
      }, { status: 409 })
    }

    // Validate vendor/venue exists
    if (vendorId) {
      const vendor = await Vendor.findById(vendorId)
      if (!vendor) {
        return NextResponse.json({ error: 'Vendor not found' }, { status: 404 })
      }
    }

    if (venueId) {
      const venue = await Venue.findById(venueId)
      if (!venue) {
        return NextResponse.json({ error: 'Venue not found' }, { status: 404 })
      }
    }

    // Create new review
    const review = new Review({
      user: user._id,
      vendor: vendorId || null,
      venue: venueId || null,
      rating: parseInt(rating),
      comment: comment.trim(),
      title: title || comment.substring(0, 50),
      images: images || [],
      isVerified: false,
      isActive: true
    })

    await review.save()

    // Populate related data
    await review.populate('user', 'name email')
    if (vendorId) {
      await review.populate('vendor', 'businessName category')
    }
    if (venueId) {
      await review.populate('venue', 'name location')
    }

    // Update vendor/venue rating
    if (vendorId) {
      await updateVendorRating(vendorId)
    }
    if (venueId) {
      await updateVenueRating(venueId)
    }

    return NextResponse.json({
      success: true,
      data: review,
      message: 'Review submitted successfully'
    })

  } catch (error) {
    console.error('Review submission error:', error)
    return NextResponse.json(
      {
        success: false,
        error: 'Failed to submit review',
        message: 'Internal server error'
      },
      { status: 500 }
    )
  }
}

// GET /api/reviews - Get reviews
export async function GET(request: NextRequest) {
  try {
    await connectDB()

    const { searchParams } = new URL(request.url)
    const vendorId = searchParams.get('vendorId')
    const venueId = searchParams.get('venueId')
    const rating = searchParams.get('rating')
    const limit = parseInt(searchParams.get('limit') || '10')
    const offset = parseInt(searchParams.get('offset') || '0')
    const verifiedOnly = searchParams.get('verifiedOnly') === 'true'

    // Build query
    const query: any = { isActive: true }
    
    if (vendorId) {
      query.vendor = vendorId
    }
    
    if (venueId) {
      query.venue = venueId
    }
    
    if (rating) {
      query.rating = { $gte: parseInt(rating) }
    }
    
    if (verifiedOnly) {
      query.isVerified = true
    }

    // Get reviews with pagination
    const reviews = await Review.find(query)
      .populate('user', 'name email avatar')
      .populate('vendor', 'businessName category')
      .populate('venue', 'name location')
      .sort({ createdAt: -1 })
      .skip(offset)
      .limit(limit)

    // Get total count
    const total = await Review.countDocuments(query)

    // Calculate average rating
    const ratingStats = await Review.aggregate([
      { $match: query },
      {
        $group: {
          _id: null,
          averageRating: { $avg: '$rating' },
          totalReviews: { $sum: 1 },
          ratingDistribution: {
            $push: '$rating'
          }
        }
      }
    ])

    let averageRating = 0
    let ratingDistribution = { 1: 0, 2: 0, 3: 0, 4: 0, 5: 0 }

    if (ratingStats.length > 0) {
      const stats = ratingStats[0]
      averageRating = Math.round(stats.averageRating * 10) / 10
      
      // Calculate rating distribution
      stats.ratingDistribution.forEach((rating: number) => {
        ratingDistribution[rating as keyof typeof ratingDistribution]++
      })
    }

    return NextResponse.json({
      success: true,
      data: reviews,
      pagination: {
        total,
        limit,
        offset,
        hasMore: offset + limit < total
      },
      stats: {
        averageRating,
        totalReviews: total,
        ratingDistribution
      }
    })

  } catch (error) {
    console.error('Reviews fetch error:', error)
    return NextResponse.json(
      {
        success: false,
        error: 'Failed to fetch reviews',
        message: 'Internal server error'
      },
      { status: 500 }
    )
  }
}

// PUT /api/reviews - Update review
export async function PUT(request: NextRequest) {
  try {
    const session = await getServerSession()
    if (!session?.user?.email) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    await connectDB()

    const user = await User.findOne({ email: session.user.email })
    if (!user) {
      return NextResponse.json({ error: "User not found" }, { status: 404 })
    }

    const body = await request.json()
    const { reviewId, rating, comment, title, images } = body

    if (!reviewId) {
      return NextResponse.json({ error: 'Review ID is required' }, { status: 400 })
    }

    // Find review and check permissions
    const review = await Review.findById(reviewId)
    if (!review) {
      return NextResponse.json({ error: 'Review not found' }, { status: 404 })
    }

    // Check if user has permission to update this review
    if (user.role !== 'admin' && review.user.toString() !== user._id.toString()) {
      return NextResponse.json({ error: 'Unauthorized to update this review' }, { status: 403 })
    }

    // Update review fields
    const updateData: any = {}
    if (rating) updateData.rating = parseInt(rating)
    if (comment) updateData.comment = comment.trim()
    if (title) updateData.title = title
    if (images) updateData.images = images

    const updatedReview = await Review.findByIdAndUpdate(
      reviewId,
      updateData,
      { new: true }
    ).populate('user vendor venue')

    // Update vendor/venue rating if rating changed
    if (rating && rating !== review.rating) {
      if (review.vendor) {
        await updateVendorRating(review.vendor.toString())
      }
      if (review.venue) {
        await updateVenueRating(review.venue.toString())
      }
    }

    return NextResponse.json({
      success: true,
      data: updatedReview,
      message: 'Review updated successfully'
    })

  } catch (error) {
    console.error('Review update error:', error)
    return NextResponse.json(
      {
        success: false,
        error: 'Failed to update review',
        message: 'Internal server error'
      },
      { status: 500 }
    )
  }
}

// DELETE /api/reviews - Delete review
export async function DELETE(request: NextRequest) {
  try {
    const session = await getServerSession()
    if (!session?.user?.email) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    await connectDB()

    const user = await User.findOne({ email: session.user.email })
    if (!user) {
      return NextResponse.json({ error: "User not found" }, { status: 404 })
    }

    const { searchParams } = new URL(request.url)
    const reviewId = searchParams.get('id')

    if (!reviewId) {
      return NextResponse.json({ error: 'Review ID is required' }, { status: 400 })
    }

    // Find review and check permissions
    const review = await Review.findById(reviewId)
    if (!review) {
      return NextResponse.json({ error: 'Review not found' }, { status: 404 })
    }

    // Check if user has permission to delete this review
    if (user.role !== 'admin' && review.user.toString() !== user._id.toString()) {
      return NextResponse.json({ error: 'Unauthorized to delete this review' }, { status: 403 })
    }

    // Soft delete review
    await Review.findByIdAndUpdate(reviewId, {
      isActive: false,
      deletedAt: new Date(),
      deletedBy: user._id
    })

    // Update vendor/venue rating
    if (review.vendor) {
      await updateVendorRating(review.vendor.toString())
    }
    if (review.venue) {
      await updateVenueRating(review.venue.toString())
    }

    return NextResponse.json({
      success: true,
      message: 'Review deleted successfully'
    })

  } catch (error) {
    console.error('Review deletion error:', error)
    return NextResponse.json(
      {
        success: false,
        error: 'Failed to delete review',
        message: 'Internal server error'
      },
      { status: 500 }
    )
  }
}

// Helper function to update vendor rating
async function updateVendorRating(vendorId: string) {
  try {
    const reviews = await Review.find({ 
      vendor: vendorId, 
      isActive: true, 
      isVerified: true 
    })
    
    if (reviews.length > 0) {
      const averageRating = reviews.reduce((sum, review) => sum + review.rating, 0) / reviews.length
      
      await Vendor.findByIdAndUpdate(vendorId, {
        'rating.average': Math.round(averageRating * 10) / 10,
        'rating.count': reviews.length
      })
    }
  } catch (error) {
    console.error('Error updating vendor rating:', error)
  }
}

// Helper function to update venue rating
async function updateVenueRating(venueId: string) {
  try {
    const reviews = await Review.find({ 
      venue: venueId, 
      isActive: true, 
      isVerified: true 
    })
    
    if (reviews.length > 0) {
      const averageRating = reviews.reduce((sum, review) => sum + review.rating, 0) / reviews.length
      
      await Venue.findByIdAndUpdate(venueId, {
        'rating.average': Math.round(averageRating * 10) / 10,
        'rating.count': reviews.length
      })
    }
  } catch (error) {
    console.error('Error updating venue rating:', error)
  }
} 