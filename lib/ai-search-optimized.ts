import { connectDB } from './db';
import { Vendor } from './models/vendor';
import { Venue } from './models/venue';

// Simple in-memory cache (can be replaced with Redis)
const searchCache = new Map<string, { data: any; timestamp: number }>();
const CACHE_TTL = 5 * 60 * 1000; // 5 minutes

interface SearchParams {
  query: string;
  businessType?: string;
  location?: string;
  priceRange?: { min: number; max: number };
  rating?: number;
  limit?: number;
}

interface SearchResult {
  vendors: any[];
  venues: any[];
  extractedParams: any;
  timestamp: string;
  cached: boolean;
}

export class OptimizedAISearch {
  
  /**
   * Extract search parameters from natural language query
   */
  private extractSearchParams(query: string): any {
    const params: any = {};
    
    // Business type extraction
    const businessTypes = ['photography', 'catering', 'decoration', 'music', 'transport', 'beauty', 'flowers'];
    for (const type of businessTypes) {
      if (query.toLowerCase().includes(type)) {
        params.businessType = type;
        break;
      }
    }
    
    // Location extraction (simple pattern matching)
    const locationPattern = /(in|at|near|around)\s+([a-zA-Z\s]+)/i;
    const locationMatch = query.match(locationPattern);
    if (locationMatch) {
      params.location = locationMatch[2].trim();
    }
    
    // Price indicators
    if (query.toLowerCase().includes('budget') || query.toLowerCase().includes('cheap')) {
      params.priceRange = { min: 0, max: 50000 };
    } else if (query.toLowerCase().includes('premium') || query.toLowerCase().includes('luxury')) {
      params.priceRange = { min: 100000, max: 1000000 };
    }
    
    // Rating requirements
    if (query.toLowerCase().includes('best') || query.toLowerCase().includes('top rated')) {
      params.rating = 4.5;
    }
    
    return params;
  }
  
  /**
   * Build optimized MongoDB aggregation pipeline
   */
  private buildVendorPipeline(params: SearchParams) {
    const pipeline: any[] = [
      { $match: { isActive: true, isVerified: true } }
    ];
    
    // Business type filter
    if (params.businessType) {
      pipeline.push({
        $match: { businessType: { $regex: params.businessType, $options: 'i' } }
      });
    }
    
    // Rating filter
    if (params.rating) {
      pipeline.push({
        $match: { rating: { $gte: params.rating } }
      });
    }
    
    // Text search if no specific filters
    if (!params.businessType && !params.location) {
      pipeline.push({
        $match: {
          $text: { $search: params.query }
        }
      });
    }
    
    // Sort by relevance and rating
    pipeline.push({
      $sort: {
        score: { $meta: "textScore" },
        rating: -1,
        totalReviews: -1
      }
    });
    
    // Limit results
    pipeline.push({
      $limit: params.limit || 10
    });
    
    // Project only needed fields
    pipeline.push({
      $project: {
        _id: 1,
        businessName: 1,
        businessType: 1,
        description: 1,
        rating: 1,
        totalReviews: 1,
        experience: 1,
        services: 1,
        portfolio: 1,
        availability: 1,
        isVerified: 1,
        isActive: 1
      }
    });
    
    return pipeline;
  }
  
  /**
   * Build optimized venue pipeline
   */
  private buildVenuePipeline(params: SearchParams) {
    const pipeline: any[] = [
      { $match: { isAvailable: true, isVerified: true } }
    ];
    
    // Type filter
    if (params.businessType) {
      const venueTypeMap: { [key: string]: string } = {
        'photography': 'outdoor',
        'catering': 'hotel',
        'decoration': 'garden',
        'music': 'modern hall',
        'transport': 'hotel'
      };
      
      if (venueTypeMap[params.businessType]) {
        pipeline.push({
          $match: { type: { $regex: venueTypeMap[params.businessType], $options: 'i' } }
        });
      }
    }
    
    // Rating filter
    if (params.rating) {
      pipeline.push({
        $match: { rating: { $gte: params.rating } }
      });
    }
    
    // Text search
    pipeline.push({
      $match: {
        $text: { $search: params.query }
      }
    });
    
    // Sort by relevance and rating
    pipeline.push({
      $sort: {
        score: { $meta: "textScore" },
        rating: -1,
        totalReviews: -1
      }
    });
    
    // Limit results
    pipeline.push({
      $limit: params.limit || 5
    });
    
    // Project only needed fields
    pipeline.push({
      $project: {
        _id: 1,
        name: 1,
        type: 1,
        description: 1,
        capacity: 1,
        rating: 1,
        totalReviews: 1,
        amenities: 1,
        pricing: 1,
        images: 1,
        isAvailable: 1,
        isVerified: 1
      }
    });
    
    return pipeline;
  }
  
  /**
   * Perform optimized search with caching
   */
  async search(params: SearchParams): Promise<SearchResult> {
    const cacheKey = JSON.stringify(params);
    const now = Date.now();
    
    // Check cache first
    const cached = searchCache.get(cacheKey);
    if (cached && (now - cached.timestamp) < CACHE_TTL) {
      console.log('🚀 Returning cached search results');
      return {
        ...cached.data,
        cached: true
      };
    }
    
    console.log('🔍 Performing fresh search...');
    const startTime = Date.now();
    
    try {
      await connectDB();
      
      // Extract search parameters
      const extractedParams = this.extractSearchParams(params.query);
      
      // Build optimized pipelines
      const vendorPipeline = this.buildVendorPipeline({ ...params, ...extractedParams });
      const venuePipeline = this.buildVenuePipeline({ ...params, ...extractedParams });
      
      // Execute searches in parallel
      const [vendors, venues] = await Promise.all([
        Vendor.aggregate(vendorPipeline).exec(),
        Venue.aggregate(venuePipeline).exec()
      ]);
      
      const searchTime = Date.now() - startTime;
      console.log(`⚡ Search completed in ${searchTime}ms`);
      
      const result: SearchResult = {
        vendors,
        venues,
        extractedParams,
        timestamp: new Date().toISOString(),
        cached: false
      };
      
      // Cache the result
      searchCache.set(cacheKey, {
        data: result,
        timestamp: now
      });
      
      return result;
      
    } catch (error) {
      console.error('❌ Search error:', error);
      throw error;
    }
  }
  
  /**
   * Clear cache (useful for testing)
   */
  clearCache() {
    searchCache.clear();
    console.log('🧹 Search cache cleared');
  }
  
  /**
   * Get cache statistics
   */
  getCacheStats() {
    const now = Date.now();
    let validEntries = 0;
    let expiredEntries = 0;
    
    for (const [key, value] of searchCache.entries()) {
      if ((now - value.timestamp) < CACHE_TTL) {
        validEntries++;
      } else {
        expiredEntries++;
      }
    }
    
    return {
      totalEntries: searchCache.size,
      validEntries,
      expiredEntries,
      cacheSize: searchCache.size
    };
  }
}

export const optimizedAISearch = new OptimizedAISearch(); 