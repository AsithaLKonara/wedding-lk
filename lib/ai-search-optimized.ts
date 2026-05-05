import { groq, GROQ_MODEL } from './groq';
import { connectDB } from './db';
import { Vendor } from './models/vendor';
import { Venue } from './models/venue';
import { PipelineStage } from 'mongoose';

// Simple in-memory cache (can be replaced with Redis)
interface CacheEntry {
  data: {
    vendors: Array<Record<string, unknown>>;
    venues: Array<Record<string, unknown>>;
    extractedParams: Record<string, unknown>;
    timestamp: string;
    cached: boolean;
  };
  timestamp: number;
}
const searchCache = new Map<string, CacheEntry>();
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
  vendors: Array<Record<string, unknown>>;
  venues: Array<Record<string, unknown>>;
  extractedParams: Record<string, unknown>;
  timestamp: string;
  cached: boolean;
}

export class OptimizedAISearch {
  
  /**
   * Extract search parameters from natural language query using Groq AI
   */
  private async extractSearchParams(query: string): Promise<SearchParams> {
    const defaultParams: SearchParams = {
      query,
      limit: 10
    };

    if (!groq) return defaultParams;

    try {
      const response = await groq.chat.completions.create({
        model: GROQ_MODEL,
        messages: [
          {
            role: "system",
            content: `Extract wedding search parameters from the user's query. Return a JSON object with:
            - businessType (one of: photography, catering, decoration, music, transport, beauty, flowers, venue)
            - location (city name)
            - priceRange (object with min and max numbers in LKR)
            - rating (minimum rating, number 1-5)
            
            Query: "${query}"
            JSON Result:`
          }
        ],
        response_format: { type: "json_object" },
        temperature: 0.1,
      });

      const aiParams = JSON.parse(response.choices[0]?.message?.content || "{}");
      return { ...defaultParams, ...aiParams };
    } catch (error) {
      console.error('Groq extraction error:', error);
      return defaultParams;
    }
  }

  
  /**
   * Build optimized MongoDB aggregation pipeline
   */
  private buildVendorPipeline(params: SearchParams): PipelineStage[] {
    const pipeline: PipelineStage[] = [
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
  private buildVenuePipeline(params: SearchParams): PipelineStage[] {
    const pipeline: PipelineStage[] = [
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
      const extractedParams = await this.extractSearchParams(params.query);
      
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
        extractedParams: extractedParams as unknown as Record<string, unknown>,
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