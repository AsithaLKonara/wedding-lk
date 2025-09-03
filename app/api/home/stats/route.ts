import { NextRequest, NextResponse } from 'next/server';
import { connectDB } from '@/lib/db';
import { User, Vendor, Venue, Booking, Review } from '@/lib/models';
import { advancedCache } from '@/lib/advanced-cache-service';

// Cache configuration for home stats
const STATS_CACHE_CONFIG = {
  ttl: 600, // 10 minutes (stats don't change frequently)
  staleWhileRevalidate: 1800, // 30 minutes
};

// Optimized home stats API with caching
export async function GET(request: NextRequest) {
  const cacheKey = 'home:stats:comprehensive';

  // Declare cachedStats at function level for error handling
  let cachedStats: any = null;

  try {
    // Try to get from cache first
    cachedStats = await advancedCache.get('home', cacheKey);
    if (cachedStats && !cachedStats.isStale) {
      console.log(`📊 Home stats served from cache`);
      return NextResponse.json({
        success: true,
        data: cachedStats.data,
        timestamp: new Date().toISOString(),
        fromCache: true,
      });
    }

    // Connect to database
    await connectDB();

    console.log('📊 Computing fresh home stats...');

    // Execute all queries in parallel for better performance
    const [
      userStats,
      vendorStats,
      venueStats,
      bookingStats,
      reviewStats,
      categoryStats,
      performanceStats
    ] = await Promise.all([
      // User statistics
      User.aggregate([
        { $group: { _id: null, total: { $sum: 1 } } }
      ]).exec(),
      
      // Vendor statistics
      Vendor.aggregate([
        { $match: { isActive: true } },
        { $group: { _id: null, total: { $sum: 1 }, verified: { $sum: { $cond: ['$isVerified', 1, 0] } } } }
      ]).exec(),
      
      // Venue statistics
      Venue.aggregate([
        { $match: { isActive: true } },
        { $group: { _id: null, total: { $sum: 1 }, featured: { $sum: { $cond: ['$featured', 1, 0] } } } }
      ]).exec(),
      
      // Booking statistics
      Booking.aggregate([
        { $group: { _id: null, total: { $sum: 1 }, confirmed: { $sum: { $cond: [{ $eq: ['$status', 'confirmed'] }, 1, 0] } } } }
      ]).exec(),
      
      // Review statistics
      Review.aggregate([
        { $match: { isVerified: true } },
        { $group: { _id: null, total: { $sum: 1 }, avgRating: { $avg: '$rating' } } }
      ]).exec(),
      
      // Category statistics
      Vendor.aggregate([
        { $match: { isActive: true } },
        { $group: { _id: '$businessType', count: { $sum: 1 } } },
        { $sort: { count: -1 } },
        { $limit: 10 }
      ]).exec(),
      
      // Performance metrics
      getPerformanceMetrics()
    ]);

    const stats = {
      users: {
        total: userStats[0]?.total || 0,
        active: Math.floor((userStats[0]?.total || 0) * 0.8), // Estimate active users
      },
      vendors: {
        total: vendorStats[0]?.total || 0,
        verified: vendorStats[0]?.verified || 0,
        active: vendorStats[0]?.total || 0,
      },
      venues: {
        total: venueStats[0]?.total || 0,
        featured: venueStats[0]?.featured || 0,
        active: venueStats[0]?.total || 0,
      },
      bookings: {
        total: bookingStats[0]?.total || 0,
        confirmed: bookingStats[0]?.confirmed || 0,
        pending: Math.floor((bookingStats[0]?.total || 0) * 0.2), // Estimate pending
      },
      reviews: {
        total: reviewStats[0]?.total || 0,
        averageRating: Math.round((reviewStats[0]?.avgRating || 0) * 10) / 10,
      },
      categories: categoryStats,
      performance: performanceStats,
      lastUpdated: new Date().toISOString(),
    };

    // Cache the result
    await advancedCache.set('home', cacheKey, stats, STATS_CACHE_CONFIG);

    console.log(`📊 Home stats computed and cached successfully`);
    return NextResponse.json({
      success: true,
      data: stats,
      timestamp: new Date().toISOString(),
      fromCache: false,
    });

  } catch (error) {
    console.error('Error fetching home stats:', error);
    
    // If database fails, try to serve stale cache
    if (cachedStats && cachedStats.isStale) {
      console.log(`⚠️ Serving stale cache due to database error`);
      return NextResponse.json({
        success: true,
        data: cachedStats.data,
        timestamp: new Date().toISOString(),
        fromCache: true,
        stale: true,
      });
    }
    
    return NextResponse.json({
      success: false,
      error: 'Failed to fetch home stats',
      timestamp: new Date().toISOString(),
    }, { status: 500 });
  }
}

// Performance metrics calculation
async function getPerformanceMetrics() {
  try {
    const [avgRating, successRateData, totalBookings] = await Promise.all([
      // Average rating across all vendors and venues
      Review.aggregate([
        { $match: { isVerified: true } },
        { $group: { _id: null, avgRating: { $avg: '$rating' } } }
      ]).exec(),
      
      // Success rate (confirmed vs total bookings)
      Booking.aggregate([
        { $group: { _id: null, total: { $sum: 1 }, confirmed: { $sum: { $cond: [{ $eq: ['$status', 'confirmed'] }, 1, 0] } } } }
      ]).exec(),
      
      // Total bookings for conversion rate
      Booking.countDocuments()
    ]);

    const avgRatingValue = avgRating[0]?.avgRating || 0;
    const successRate = successRateData[0] ? (successRateData[0].confirmed / successRateData[0].total) * 100 : 0;

    return {
      averageRating: Math.round(avgRatingValue * 10) / 10,
      successRate: Math.round(successRate * 10) / 10,
      totalBookings,
      conversionRate: Math.round((successRateData[0]?.confirmed / totalBookings) * 100 * 10) / 10,
    };
  } catch (error) {
    console.error('Performance metrics error:', error);
    return {
      averageRating: 0,
      successRate: 0,
      totalBookings: 0,
      conversionRate: 0,
    };
  }
} 