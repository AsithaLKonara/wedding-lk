import { NextRequest, NextResponse } from 'next/server';

// Simple in-memory cache for API responses
const apiCache = new Map<string, { data: any; timestamp: number; ttl: number }>();

export interface CacheOptions {
  ttl?: number; // Time to live in milliseconds
  key?: string; // Custom cache key
  tags?: string[]; // Cache tags for invalidation
}

export function withCache(handler: Function, options: CacheOptions = {}) {
  const { ttl = 5 * 60 * 1000, tags = [] } = options; // Default 5 minutes
  
  return async (request: NextRequest, ...args: any[]) => {
    // Generate cache key
    const url = request.url;
    const cacheKey = options.key || `${request.method}:${url}`;
    
    // Check cache
    const cached = apiCache.get(cacheKey);
    if (cached && (Date.now() - cached.timestamp) < cached.ttl) {
      console.log(`🚀 Cache hit for ${cacheKey}`);
      return NextResponse.json({
        ...cached.data,
        _cached: true,
        _cacheTimestamp: cached.timestamp
      });
    }
    
    // Execute handler
    const startTime = Date.now();
    const result = await handler(request, ...args);
    const executionTime = Date.now() - startTime;
    
    // Cache the result
    apiCache.set(cacheKey, {
      data: result,
      timestamp: Date.now(),
      ttl
    });
    
    console.log(`💾 Cached result for ${cacheKey} (${executionTime}ms)`);
    
    // Add cache metadata to response
    if (result && typeof result === 'object') {
      return {
        ...result,
        _cached: false,
        _executionTime: executionTime,
        _cacheKey: cacheKey
      };
    }
    
    return result;
  };
}

/**
 * Clear cache by tag or specific key
 */
export function clearCache(tagOrKey?: string) {
  if (tagOrKey) {
    // Clear specific cache entry
    if (apiCache.has(tagOrKey)) {
      apiCache.delete(tagOrKey);
      console.log(`🧹 Cleared cache for: ${tagOrKey}`);
    }
  } else {
    // Clear all cache
    apiCache.clear();
    console.log('🧹 Cleared all API cache');
  }
}

/**
 * Get cache statistics
 */
export function getCacheStats() {
  const now = Date.now();
  let validEntries = 0;
  let expiredEntries = 0;
  let totalSize = 0;
  
  for (const [key, value] of apiCache.entries()) {
    totalSize += JSON.stringify(value.data).length;
    if ((now - value.timestamp) < value.ttl) {
      validEntries++;
    } else {
      expiredEntries++;
    }
  }
  
  return {
    totalEntries: apiCache.size,
    validEntries,
    expiredEntries,
    totalSize: `${(totalSize / 1024).toFixed(2)} KB`,
    cacheSize: apiCache.size
  };
}

/**
 * Cache invalidation by pattern
 */
export function invalidateCacheByPattern(pattern: string) {
  let clearedCount = 0;
  
  for (const key of apiCache.keys()) {
    if (key.includes(pattern)) {
      apiCache.delete(key);
      clearedCount++;
    }
  }
  
  if (clearedCount > 0) {
    console.log(`🧹 Cleared ${clearedCount} cache entries matching pattern: ${pattern}`);
  }
  
  return clearedCount;
} 