import { NextRequest, NextResponse } from 'next/server';
import { connectDB } from '@/lib/db';
import { Favorite } from '@/lib/models/favorite';
import { Vendor } from '@/lib/models/vendor';
import { Venue } from '@/lib/models/venue';
import { Review } from '@/lib/models/review';
import { withAuth, requireUser } from '@/lib/middleware/auth-middleware';
import { withRateLimit, rateLimitConfigs } from '@/lib/middleware/rate-limit-middleware';

// GET - Get comparison data for items
async function getComparison(request: NextRequest) {
  try {
    const user = (request as any).user;
    const { searchParams } = new URL(request.url);
    const groupId = searchParams.get('groupId');
    const itemIds = searchParams.get('itemIds')?.split(',') || [];
    const type = searchParams.get('type') || 'vendor';

    await connectDB();

    let items = [];

    if (groupId) {
      // Get items from comparison group
      const favorites = await Favorite.find({
        userId: user.id,
        comparisonGroup: groupId,
        isForComparison: true
      }).populate('itemId');

      items = favorites.map(fav => fav.itemId);
    } else if (itemIds.length > 0) {
      // Get specific items by IDs
      if (type === 'vendor') {
        items = await Vendor.find({ _id: { $in: itemIds } });
      } else if (type === 'venue') {
        items = await Venue.find({ _id: { $in: itemIds } });
      }
    } else {
      return NextResponse.json({
        success: false,
        error: 'Either groupId or itemIds must be provided'
      }, { status: 400 });
    }

    if (items.length === 0) {
      return NextResponse.json({
        success: false,
        error: 'No items found for comparison'
      }, { status: 404 });
    }

    // Limit to 5 items for comparison
    if (items.length > 5) {
      items = items.slice(0, 5);
    }

    // Get detailed comparison data
    const comparisonData = await Promise.all(
      items.map(async (item) => {
        const itemId = item._id.toString();
        
        // Get reviews and ratings
        const reviews = await Review.find({
          vendorId: type === 'vendor' ? itemId : undefined,
          venueId: type === 'venue' ? itemId : undefined,
          status: 'approved'
        });

        const avgRating = reviews.length > 0 
          ? reviews.reduce((sum, review) => sum + review.overallRating, 0) / reviews.length
          : 0;

        const ratingBreakdown = {
          5: reviews.filter(r => r.overallRating === 5).length,
          4: reviews.filter(r => r.overallRating === 4).length,
          3: reviews.filter(r => r.overallRating === 3).length,
          2: reviews.filter(r => r.overallRating === 2).length,
          1: reviews.filter(r => r.overallRating === 1).length
        };

        // Get category ratings
        const categoryRatings = reviews.length > 0 ? {
          service: reviews.reduce((sum, r) => sum + r.categoryRatings.service, 0) / reviews.length,
          quality: reviews.reduce((sum, r) => sum + r.categoryRatings.quality, 0) / reviews.length,
          value: reviews.reduce((sum, r) => sum + r.categoryRatings.value, 0) / reviews.length,
          communication: reviews.reduce((sum, r) => sum + r.categoryRatings.communication, 0) / reviews.length,
          timeliness: reviews.reduce((sum, r) => sum + r.categoryRatings.timeliness, 0) / reviews.length
        } : {};

        return {
          id: itemId,
          name: item.businessName || item.name,
          type: type,
          description: item.description,
          location: item.location,
          price: item.price || 0,
          rating: {
            average: Math.round(avgRating * 10) / 10,
            count: reviews.length,
            breakdown: ratingBreakdown,
            categories: categoryRatings
          },
          features: item.features || [],
          images: item.images || [item.avatar] || [],
          contact: {
            phone: item.phone,
            email: item.email,
            website: item.website
          },
          availability: item.availability || 'Available',
          isVerified: item.isVerified || false,
          isActive: item.isActive !== false
        };
      })
    );

    // Generate comparison summary
    const summary = generateComparisonSummary(comparisonData);

    return NextResponse.json({
      success: true,
      comparison: {
        items: comparisonData,
        summary,
        totalItems: comparisonData.length,
        type
      }
    });

  } catch (error) {
    console.error('Error getting comparison:', error);
    return NextResponse.json({
      success: false,
      error: 'Failed to get comparison data'
    }, { status: 500 });
  }
}

// POST - Add items to comparison
async function addToComparison(request: NextRequest) {
  try {
    const user = (request as any).user;
    const { itemIds, type, groupId } = await request.json();

    if (!itemIds || !Array.isArray(itemIds) || itemIds.length === 0) {
      return NextResponse.json({
        success: false,
        error: 'Item IDs are required'
      }, { status: 400 });
    }

    if (itemIds.length > 5) {
      return NextResponse.json({
        success: false,
        error: 'Maximum 5 items can be compared at once'
      }, { status: 400 });
    }

    await connectDB();

    const results = [];

    for (const itemId of itemIds) {
      // Check if item exists
      let item;
      if (type === 'vendor') {
        item = await Vendor.findById(itemId);
      } else if (type === 'venue') {
        item = await Venue.findById(itemId);
      }

      if (!item) {
        results.push({
          itemId,
          success: false,
          error: 'Item not found'
        });
        continue;
      }

      // Add to favorites with comparison flag
      try {
        const favorite = await Favorite.findOneAndUpdate(
          {
            userId: user.id,
            itemId,
            type
          },
          {
            userId: user.id,
            itemId,
            type,
            isForComparison: true,
            comparisonGroup: groupId || `group_${Date.now()}`,
            priority: 'medium'
          },
          { upsert: true, new: true }
        );

        results.push({
          itemId,
          success: true,
          favoriteId: favorite._id
        });
      } catch (error) {
        results.push({
          itemId,
          success: false,
          error: 'Failed to add to comparison'
        });
      }
    }

    return NextResponse.json({
      success: true,
      results,
      message: 'Items added to comparison successfully'
    });

  } catch (error) {
    console.error('Error adding to comparison:', error);
    return NextResponse.json({
      success: false,
      error: 'Failed to add items to comparison'
    }, { status: 500 });
  }
}

// DELETE - Remove items from comparison
async function removeFromComparison(request: NextRequest) {
  try {
    const user = (request as any).user;
    const { searchParams } = new URL(request.url);
    const itemIds = searchParams.get('itemIds')?.split(',') || [];
    const groupId = searchParams.get('groupId');

    await connectDB();

    const query: any = {
      userId: user.id,
      isForComparison: true
    };

    if (itemIds.length > 0) {
      query.itemId = { $in: itemIds };
    }

    if (groupId) {
      query.comparisonGroup = groupId;
    }

    const result = await Favorite.updateMany(
      query,
      { isForComparison: false, comparisonGroup: null }
    );

    return NextResponse.json({
      success: true,
      message: `${result.modifiedCount} items removed from comparison`
    });

  } catch (error) {
    console.error('Error removing from comparison:', error);
    return NextResponse.json({
      success: false,
      error: 'Failed to remove items from comparison'
    }, { status: 500 });
  }
}

// Helper function to generate comparison summary
function generateComparisonSummary(items: any[]) {
  if (items.length === 0) return {};

  const priceRange = {
    min: Math.min(...items.map(item => item.price || 0)),
    max: Math.max(...items.map(item => item.price || 0))
  };

  const ratingRange = {
    min: Math.min(...items.map(item => item.rating.average)),
    max: Math.max(...items.map(item => item.rating.average))
  };

  const totalReviews = items.reduce((sum, item) => sum + item.rating.count, 0);

  const bestValue = items.reduce((best, item) => {
    const valueScore = item.rating.average / (item.price || 1) * 100;
    const bestValueScore = best.rating.average / (best.price || 1) * 100;
    return valueScore > bestValueScore ? item : best;
  }, items[0]);

  const highestRated = items.reduce((best, item) => 
    item.rating.average > best.rating.average ? item : best
  , items[0]);

  return {
    priceRange,
    ratingRange,
    totalReviews,
    bestValue: {
      id: bestValue.id,
      name: bestValue.name,
      valueScore: Math.round((bestValue.rating.average / (bestValue.price || 1)) * 100) / 100
    },
    highestRated: {
      id: highestRated.id,
      name: highestRated.name,
      rating: highestRated.rating.average
    },
    totalItems: items.length
  };
}

export const GET = withRateLimit(
  rateLimitConfigs.api,
  withAuth(getComparison, requireUser())
);

export const POST = withRateLimit(
  rateLimitConfigs.api,
  withAuth(addToComparison, requireUser())
);

export const DELETE = withRateLimit(
  rateLimitConfigs.api,
  withAuth(removeFromComparison, requireUser())
);

