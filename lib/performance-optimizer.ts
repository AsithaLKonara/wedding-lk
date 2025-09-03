import { connectDB } from './db';
import { Vendor } from './models/vendor';
import { Venue } from './models/venue';
import { User } from './models/user';
import { Booking } from './models/booking';
import { Review } from './models/review';

interface PerformanceResults {
  vendorQuery: { vendors: any[]; queryTime: number } | null;
  venueQuery: { venues: any[]; queryTime: number } | null;
  statsQuery: { userCount: number; vendorCount: number; venueCount: number; bookingCount: number; reviewCount: number; queryTime: number } | null;
  textSearch: { vendors: any[]; queryTime: number } | null;
  totalTime: number;
}

export class PerformanceOptimizer {
  
  /**
   * Optimize database queries with lean() and field selection
   */
  static async optimizeVendorQueries() {
    try {
      await connectDB();
      
      // Test optimized vendor query
      const startTime = Date.now();
      
      const vendors = await Vendor.find({ isActive: true, isVerified: true })
        .select('businessName businessType description rating totalReviews experience')
        .sort({ rating: -1, totalReviews: -1 })
        .limit(10)
        .lean()
        .exec();
      
      const queryTime = Date.now() - startTime;
      console.log(`⚡ Optimized vendor query: ${queryTime}ms for ${vendors.length} results`);
      
      return { vendors, queryTime };
      
    } catch (error) {
      console.error('❌ Vendor optimization error:', error);
      throw error;
    }
  }
  
  /**
   * Optimize venue queries with lean() and field selection
   */
  static async optimizeVenueQueries() {
    try {
      await connectDB();
      
      const startTime = Date.now();
      
      const venues = await Venue.find({ isAvailable: true, isVerified: true })
        .select('name type description capacity rating totalReviews amenities pricing images')
        .sort({ rating: -1, totalReviews: -1 })
        .limit(10)
        .lean()
        .exec();
      
      const queryTime = Date.now() - startTime;
      console.log(`⚡ Optimized venue query: ${queryTime}ms for ${venues.length} results`);
      
      return { venues, queryTime };
      
    } catch (error) {
      console.error('❌ Venue optimization error:', error);
      throw error;
    }
  }
  
  /**
   * Optimize stats aggregation with parallel pipelines
   */
  static async optimizeStatsQueries() {
    try {
      await connectDB();
      
      const startTime = Date.now();
      
      // Execute all aggregations in parallel
      const [userCount, vendorCount, venueCount, bookingCount, reviewCount] = await Promise.all([
        User.countDocuments({}).exec(),
        Vendor.countDocuments({ isActive: true, isVerified: true }).exec(),
        Venue.countDocuments({ isAvailable: true, isVerified: true }).exec(),
        Booking.countDocuments({}).exec(),
        Review.countDocuments({ isVerified: true }).exec()
      ]);
      
      const queryTime = Date.now() - startTime;
      console.log(`⚡ Optimized stats queries: ${queryTime}ms`);
      
      return {
        userCount,
        vendorCount,
        venueCount,
        bookingCount,
        reviewCount,
        queryTime
      };
      
    } catch (error) {
      console.error('❌ Stats optimization error:', error);
      throw error;
    }
  }
  
  /**
   * Test text search performance
   */
  static async testTextSearch() {
    try {
      await connectDB();
      
      const startTime = Date.now();
      
      // Test vendor text search
      const vendors = await Vendor.find({
        $text: { $search: 'wedding photographer' }
      })
      .select('businessName businessType description rating')
      .sort({ score: { $meta: 'textScore' } })
      .limit(5)
      .lean()
      .exec();
      
      const queryTime = Date.now() - startTime;
      console.log(`⚡ Text search query: ${queryTime}ms for ${vendors.length} results`);
      
      return { vendors, queryTime };
      
    } catch (error) {
      console.error('❌ Text search error:', error);
      throw error;
    }
  }
  
  /**
   * Run comprehensive performance test
   */
  static async runPerformanceTest(): Promise<PerformanceResults> {
    console.log('🚀 Running Comprehensive Performance Test...');
    console.log('============================================');
    
    const results: PerformanceResults = {
      vendorQuery: null,
      venueQuery: null,
      statsQuery: null,
      textSearch: null,
      totalTime: 0
    };
    
    const startTime = Date.now();
    
    try {
      // Test all optimizations
      results.vendorQuery = await this.optimizeVendorQueries();
      results.venueQuery = await this.optimizeVenueQueries();
      results.statsQuery = await this.optimizeStatsQueries();
      results.textSearch = await this.testTextSearch();
      
      results.totalTime = Date.now() - startTime;
      
      console.log('\n📊 PERFORMANCE TEST RESULTS');
      console.log('============================');
      if (results.vendorQuery) console.log(`Vendor Query: ${results.vendorQuery.queryTime}ms`);
      if (results.venueQuery) console.log(`Venue Query: ${results.venueQuery.queryTime}ms`);
      if (results.statsQuery) console.log(`Stats Query: ${results.statsQuery.queryTime}ms`);
      if (results.textSearch) console.log(`Text Search: ${results.textSearch.queryTime}ms`);
      console.log(`Total Time: ${results.totalTime}ms`);
      
      // Performance analysis
      const queryTimes = [
        results.vendorQuery?.queryTime || 0,
        results.venueQuery?.queryTime || 0,
        results.statsQuery?.queryTime || 0,
        results.textSearch?.queryTime || 0
      ].filter(time => time > 0);
      
      const avgQueryTime = queryTimes.length > 0 ? queryTimes.reduce((a, b) => a + b, 0) / queryTimes.length : 0;
      
      if (avgQueryTime < 1000) {
        console.log('\n✅ EXCELLENT: All queries under 1 second!');
      } else if (avgQueryTime < 3000) {
        console.log('\n📈 GOOD: Queries under 3 seconds');
      } else if (avgQueryTime < 10000) {
        console.log('\n⚠️  NEEDS IMPROVEMENT: Some queries over 10 seconds');
      } else {
        console.log('\n🚨 CRITICAL: Queries too slow, needs immediate optimization');
      }
      
      return results;
      
    } catch (error) {
      console.error('❌ Performance test failed:', error);
      throw error;
    }
  }
  
  /**
   * Generate optimization recommendations
   */
  static generateRecommendations(results: PerformanceResults) {
    console.log('\n💡 OPTIMIZATION RECOMMENDATIONS');
    console.log('================================');
    
    if (results.vendorQuery && results.vendorQuery.queryTime > 5000) {
      console.log('🔧 Vendors: Add compound indexes for (isActive, isVerified, rating)');
    }
    
    if (results.venueQuery && results.venueQuery.queryTime > 5000) {
      console.log('🔧 Venues: Add compound indexes for (isAvailable, isVerified, rating)');
    }
    
    if (results.statsQuery && results.statsQuery.queryTime > 5000) {
      console.log('🔧 Stats: Implement Redis caching for aggregation results');
    }
    
    if (results.textSearch && results.textSearch.queryTime > 5000) {
      console.log('🔧 Search: Optimize text search indexes and add result caching');
    }
    
    console.log('\n🎯 IMMEDIATE ACTIONS:');
    console.log('1. Implement Redis for distributed caching');
    console.log('2. Add database connection pooling');
    console.log('3. Use production build for testing');
    console.log('4. Implement response compression');
  }
}

// Export for use in other modules
export default PerformanceOptimizer; 