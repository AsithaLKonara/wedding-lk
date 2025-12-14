import { connectDB } from './db';
import { User } from './models/user';
import { Vendor } from './models/vendor';
import { Venue } from './models/venue';
import { Booking } from './models/booking';
import { Review } from './models/review';

// Cache for stats (5 minutes TTL)
const statsCache = new Map<string, { data: any; timestamp: number }>();
const STATS_CACHE_TTL = 5 * 60 * 1000;

export class OptimizedStatsService {
  
  /**
   * Get comprehensive home page stats using aggregation pipelines
   */
  async getHomeStats() {
    const cacheKey = 'home_stats';
    const now = Date.now();
    
    // Check cache
    const cached = statsCache.get(cacheKey);
    if (cached && (now - cached.timestamp) < STATS_CACHE_TTL) {
      console.log('🚀 Returning cached home stats');
      return { ...cached.data, cached: true };
    }
    
    console.log('📊 Computing fresh home stats...');
    const startTime = Date.now();
    
    try {
      await connectDB();
      
      // Execute all aggregations in parallel for maximum performance
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
          { $group: { _id: null, total: { $sum: 1 } } },
          { $project: { _id: 0, total: 1 } }
        ]).exec(),
        
        // Vendor statistics
        Vendor.aggregate([
          { $match: { isActive: true, isVerified: true } },
          { $group: { _id: null, total: { $sum: 1 } } },
          { $project: { _id: 0, total: 1 } }
        ]).exec(),
        
        // Venue statistics
        Venue.aggregate([
          { $match: { isAvailable: true, isVerified: true } },
          { $group: { _id: null, total: { $sum: 1 } } },
          { $project: { _id: 0, total: 1 } }
        ]).exec(),
        
        // Booking statistics
        Booking.aggregate([
          { $group: { _id: null, total: { $sum: 1 } } },
          { $project: { _id: 0, total: 1 } }
        ]).exec(),
        
        // Review statistics
        Review.aggregate([
          { $match: { isVerified: true } },
          { $group: { _id: null, total: { $sum: 1 } } },
          { $project: { _id: 0, total: 1 } }
        ]).exec(),
        
        // Category distribution
        Vendor.aggregate([
          { $match: { isActive: true } },
          { $group: { _id: '$businessType', count: { $sum: 1 } } },
          { $sort: { count: -1 } },
          { $limit: 10 }
        ]).exec(),
        
        // Performance metrics
        this.getPerformanceMetrics()
      ]);
      
      const stats = {
        overview: {
          totalUsers: userStats[0]?.total || 0,
          totalVendors: vendorStats[0]?.total || 0,
          totalVenues: venueStats[0]?.total || 0,
          totalBookings: bookingStats[0]?.total || 0,
          totalReviews: reviewStats[0]?.total || 0
        },
        performance: performanceStats,
        categories: categoryStats,
        testimonials: await this.getTopTestimonials()
      };
      
      const computeTime = Date.now() - startTime;
      console.log(`⚡ Stats computed in ${computeTime}ms`);
      
      // Cache the result
      statsCache.set(cacheKey, {
        data: stats,
        timestamp: now
      });
      
      return { ...stats, cached: false };
      
    } catch (error) {
      console.error('❌ Stats computation error:', error);
      throw error;
    }
  }
  
  /**
   * Get performance metrics using aggregation
   */
  private async getPerformanceMetrics() {
    try {
      const [avgRating, successRateData, totalBookings] = await Promise.all([
        // Average rating across all vendors and venues
        Review.aggregate([
          { $match: { isVerified: true } },
          { $group: { _id: null, avgRating: { $avg: '$rating' } } },
          { $project: { _id: 0, avgRating: { $round: ['$avgRating', 2] } } }
        ]).exec(),
        
        // Success rate (completed vs total bookings)
        Booking.aggregate([
          { $group: { _id: '$status', count: { $sum: 1 } } }
        ]).exec(),
        
        // Total bookings count
        Booking.aggregate([
          { $group: { _id: null, total: { $sum: 1 } } },
          { $project: { _id: 0, total: 1 } }
        ]).exec()
      ]);
      
      // Calculate success rate
      let successRate = 0;
      if (successRateData.length > 0) {
        const completed = successRateData.find(s => s._id === 'completed')?.count || 0;
        const total = totalBookings[0]?.total || 0;
        successRate = total > 0 ? Math.round((completed / total) * 100) : 0;
      }
      
      return {
        averageRating: avgRating[0]?.avgRating || 0,
        successRate,
        totalBookingsCount: totalBookings[0]?.total || 0
      };
      
    } catch (error) {
      console.error('❌ Performance metrics error:', error);
      return {
        averageRating: 0,
        successRate: 0,
        totalBookingsCount: 0
      };
    }
  }
  
  /**
   * Get top testimonials for home page
   */
  private async getTopTestimonials() {
    try {
      const testimonials = await Review.aggregate([
        { $match: { isVerified: true, rating: { $gte: 4 } } },
        { $sort: { rating: -1, createdAt: -1 } },
        { $limit: 5 },
        {
          $lookup: {
            from: 'users',
            localField: 'reviewerId',
            foreignField: '_id',
            as: 'reviewer'
          }
        },
        { $unwind: '$reviewer' },
        {
          $project: {
            _id: 1,
            rating: 1,
            title: 1,
            comment: 1,
            reviewerName: { $concat: ['$reviewer.firstName', ' ', '$reviewer.lastName'] },
            category: 1,
            createdAt: 1
          }
        }
      ]).exec();
      
      return testimonials;
      
    } catch (error) {
      console.error('❌ Testimonials error:', error);
      return [];
    }
  }
  
  /**
   * Get vendor analytics
   */
  async getVendorAnalytics() {
    const cacheKey = 'vendor_analytics';
    const now = Date.now();
    
    const cached = statsCache.get(cacheKey);
    if (cached && (now - cached.timestamp) < STATS_CACHE_TTL) {
      return { ...cached.data, cached: true };
    }
    
    try {
      await connectDB();
      
      const analytics = await Vendor.aggregate([
        { $match: { isActive: true } },
        {
          $group: {
            _id: '$businessType',
            count: { $sum: 1 },
            avgRating: { $avg: '$rating' },
            avgExperience: { $avg: '$experience' },
            totalReviews: { $sum: '$totalReviews' }
          }
        },
        { $sort: { count: -1 } }
      ]).exec();
      
      const result = { analytics, timestamp: new Date().toISOString() };
      
      statsCache.set(cacheKey, {
        data: result,
        timestamp: now
      });
      
      return { ...result, cached: false };
      
    } catch (error) {
      console.error('❌ Vendor analytics error:', error);
      throw error;
    }
  }
  
  /**
   * Clear stats cache
   */
  clearCache() {
    statsCache.clear();
    console.log('🧹 Stats cache cleared');
  }
  
  /**
   * Get cache statistics
   */
  getCacheStats() {
    const now = Date.now();
    let validEntries = 0;
    let expiredEntries = 0;
    
    for (const [key, value] of statsCache.entries()) {
      if ((now - value.timestamp) < STATS_CACHE_TTL) {
        validEntries++;
      } else {
        expiredEntries++;
      }
    }
    
    return {
      totalEntries: statsCache.size,
      validEntries,
      expiredEntries,
      cacheSize: statsCache.size
    };
  }
}

export const optimizedStatsService = new OptimizedStatsService(); 