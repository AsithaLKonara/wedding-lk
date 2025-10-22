/**
 * Performance Optimizer
 * Fixes query timeout issues and optimizes database performance
 */

import mongoose from 'mongoose';

// Query timeout configuration
const QUERY_TIMEOUT = 30000; // 30 seconds
const SLOW_QUERY_THRESHOLD = 1000; // 1 second

// Performance monitoring
let queryCount = 0;
let slowQueryCount = 0;
let totalQueryTime = 0;

/**
 * Optimize mongoose queries for better performance
 */
export function optimizeMongooseQueries() {
  // Set query timeout
  mongoose.set('maxTimeMS', QUERY_TIMEOUT);
  
  // Enable query optimization
  mongoose.set('strictQuery', false);
  
  console.log('✅ Mongoose queries optimized for performance');
}

/**
 * Monitor and log slow queries
 */
export function setupQueryMonitoring() {
  const originalExec = mongoose.Query.prototype.exec;
  
  mongoose.Query.prototype.exec = function() {
    const start = Date.now();
    queryCount++;
    
    return originalExec.apply(this, arguments).then((result) => {
      const duration = Date.now() - start;
      totalQueryTime += duration;
      
      if (duration > SLOW_QUERY_THRESHOLD) {
        slowQueryCount++;
        console.warn(`🐌 Slow Query Detected: ${duration}ms`, {
          collection: this.model?.collection?.name || 'unknown',
          query: this.getQuery(),
          duration: `${duration}ms`,
          slowQueryCount,
          totalQueries: queryCount
        });
      }
      
      return result;
    }).catch((error) => {
      const duration = Date.now() - start;
      console.error(`❌ Query Error after ${duration}ms:`, {
        collection: this.model?.collection?.name || 'unknown',
        query: this.getQuery(),
        error: error.message
      });
      throw error;
    });
  };
  
  console.log('✅ Query monitoring enabled');
}

/**
 * Get performance statistics
 */
export function getPerformanceStats() {
  return {
    totalQueries: queryCount,
    slowQueries: slowQueryCount,
    averageQueryTime: queryCount > 0 ? Math.round(totalQueryTime / queryCount) : 0,
    slowQueryRate: queryCount > 0 ? Math.round((slowQueryCount / queryCount) * 100) : 0,
    totalQueryTime
  };
}

/**
 * Reset performance counters
 */
export function resetPerformanceCounters() {
  queryCount = 0;
  slowQueryCount = 0;
  totalQueryTime = 0;
  console.log('✅ Performance counters reset');
}

/**
 * Optimize specific queries with common patterns
 */
export const QueryOptimizer = {
  // Add indexes for common queries
  async ensureIndexes() {
    try {
      // User indexes
      await mongoose.connection.db.collection('users').createIndex({ email: 1 }, { unique: true });
      await mongoose.connection.db.collection('users').createIndex({ role: 1 });
      await mongoose.connection.db.collection('users').createIndex({ createdAt: -1 });
      
      // Venue indexes
      await mongoose.connection.db.collection('venues').createIndex({ location: '2dsphere' });
      await mongoose.connection.db.collection('venues').createIndex({ 'location.city': 1 });
      await mongoose.connection.db.collection('venues').createIndex({ capacity: 1 });
      await mongoose.connection.db.collection('venues').createIndex({ 'pricing.basePrice': 1 });
      await mongoose.connection.db.collection('venues').createIndex({ isActive: 1 });
      await mongoose.connection.db.collection('venues').createIndex({ featured: 1 });
      
      // Vendor indexes
      await mongoose.connection.db.collection('vendors').createIndex({ 'location.city': 1 });
      await mongoose.connection.db.collection('vendors').createIndex({ category: 1 });
      await mongoose.connection.db.collection('vendors').createIndex({ isActive: 1 });
      await mongoose.connection.db.collection('vendors').createIndex({ 'rating.average': -1 });
      
      // Booking indexes
      await mongoose.connection.db.collection('bookings').createIndex({ userId: 1 });
      await mongoose.connection.db.collection('bookings').createIndex({ venueId: 1 });
      await mongoose.connection.db.collection('bookings').createIndex({ status: 1 });
      await mongoose.connection.db.collection('bookings').createIndex({ eventDate: 1 });
      await mongoose.connection.db.collection('bookings').createIndex({ createdAt: -1 });
      
      // Payment indexes
      await mongoose.connection.db.collection('payments').createIndex({ bookingId: 1 });
      await mongoose.connection.db.collection('payments').createIndex({ status: 1 });
      await mongoose.connection.db.collection('payments').createIndex({ createdAt: -1 });
      
      console.log('✅ Database indexes created/verified');
    } catch (error) {
      console.error('❌ Error creating indexes:', error);
    }
  },
  
  // Optimize aggregation pipelines
  optimizeAggregation(pipeline: any[]) {
    return pipeline.map(stage => {
      // Add $match stages early
      if (stage.$match) {
        return { ...stage, $match: { ...stage.$match, isActive: true } };
      }
      
      // Add $limit to prevent large result sets
      if (stage.$group && !pipeline.some(s => s.$limit)) {
        return [stage, { $limit: 1000 }];
      }
      
      return stage;
    }).flat();
  },
  
  // Add pagination to queries
  addPagination(query: any, page: number = 1, limit: number = 20) {
    const skip = (page - 1) * limit;
    return query.skip(skip).limit(Math.min(limit, 100)); // Max 100 items per page
  }
};

/**
 * Initialize performance optimizations
 */
export function initializePerformanceOptimizations() {
  optimizeMongooseQueries();
  setupQueryMonitoring();
  
  // Ensure indexes after connection
  mongoose.connection.on('open', async () => {
    await QueryOptimizer.ensureIndexes();
  });
  
  console.log('✅ Performance optimizations initialized');
}

export default {
  optimizeMongooseQueries,
  setupQueryMonitoring,
  getPerformanceStats,
  resetPerformanceCounters,
  QueryOptimizer,
  initializePerformanceOptimizations
};