// Simplified Redis Service for WeddingLK
// This service provides caching functionality without external Redis dependencies

// In-memory cache implementation
class InMemoryCache {
  private cache: Map<string, { data: any; timestamp: number; ttl: number }> = new Map();
  private readonly defaultTTL: number = 300000; // 5 minutes in milliseconds

  // Set cache with TTL
  set(key: string, value: any, ttl: number = this.defaultTTL): void {
    const timestamp = Date.now();
    this.cache.set(key, { data: value, timestamp, ttl });
    
    // Clean up expired entries
    this.cleanup();
  }

  // Get cache value
  get<T>(key: string): T | null {
    const item = this.cache.get(key);
    if (!item) return null;

    const now = Date.now();
    if (now - item.timestamp > item.ttl) {
      this.cache.delete(key);
      return null;
    }

    return item.data as T;
  }

  // Delete cache key
  del(key: string): void {
    this.cache.delete(key);
  }

  // Clear all cache
  clear(): void {
    this.cache.clear();
    console.log('🧹 In-memory cache cleared successfully');
  }

  // Get cache statistics
  getStats(): any {
    const now = Date.now();
    let validEntries = 0;
    let expiredEntries = 0;

    for (const [key, item] of Array.from(this.cache.entries())) {
      if (now - item.timestamp > item.ttl) {
        expiredEntries++;
      } else {
        validEntries++;
      }
    }

    return {
      total: this.cache.size,
      valid: validEntries,
      expired: expiredEntries,
      memory: this.estimateMemoryUsage()
    };
  }

  // Pattern-based cache invalidation
  invalidatePattern(pattern: string): void {
    const regex = new RegExp(pattern.replace(/\*/g, '.*'));
    let deletedCount = 0;

    for (const key of Array.from(this.cache.keys())) {
      if (regex.test(key)) {
        this.cache.delete(key);
        deletedCount++;
      }
    }

    if (deletedCount > 0) {
      console.log(`🗑️ Invalidated ${deletedCount} cache keys matching pattern: ${pattern}`);
    }
  }

  // Cache with fallback function
  async cacheWithFallback<T>(
    key: string, 
    fallback: () => Promise<T>, 
    ttl: number = this.defaultTTL
  ): Promise<T> {
    try {
      // Try to get from cache first
      const cached = this.get<T>(key);
      if (cached !== null) {
        return cached;
      }

      // Execute fallback function
      const result = await fallback();
      
      // Cache the result
      this.set(key, result, ttl);
      
      return result;
    } catch (error) {
      console.error('❌ Cache with fallback error:', error);
      // Return fallback result even if caching fails
      return await fallback();
    }
  }

  // Health check
  healthCheck(): { status: string; responseTime: number; error?: string } {
    const start = Date.now();
    
    try {
      // Simple operation to test cache functionality
      this.set('health-check', 'ok', 1000);
      const result = this.get('health-check');
      
      if (result === 'ok') {
        const responseTime = Date.now() - start;
        return {
          status: 'healthy',
          responseTime
        };
      } else {
        return {
          status: 'unhealthy',
          responseTime: 0,
          error: 'Cache read/write test failed'
        };
      }
    } catch (error) {
      return {
        status: 'error',
        responseTime: 0,
        error: error instanceof Error ? error.message : 'Unknown error'
      };
    }
  }

  // Add caching for health checks
  async cacheHealthCheck(data: any, ttl: number = 30): Promise<void> {
    try {
      await this.set('health:check', data, ttl);
    } catch (error) {
      console.warn('Failed to cache health check:', error);
    }
  }

  async getCachedHealthCheck(): Promise<any | null> {
    try {
      const cached = await this.get('health:check');
      return cached ? JSON.parse(cached as string) : null;
    } catch (error) {
      console.warn('Failed to get cached health check:', error);
      return null;
    }
  }

  // Clean up expired entries
  private cleanup(): void {
    const now = Date.now();
    for (const [key, item] of Array.from(this.cache.entries())) {
      if (now - item.timestamp > item.ttl) {
        this.cache.delete(key);
      }
    }
  }

  // Estimate memory usage
  private estimateMemoryUsage(): string {
    const size = this.cache.size;
    const estimatedBytes = size * 1000; // Rough estimate: 1KB per cache entry
    
    if (estimatedBytes < 1024) return `${estimatedBytes} B`;
    if (estimatedBytes < 1024 * 1024) return `${(estimatedBytes / 1024).toFixed(2)} KB`;
    return `${(estimatedBytes / (1024 * 1024)).toFixed(2)} MB`;
  }

  // Get all keys
  getKeys(): string[] {
    return Array.from(this.cache.keys());
  }
}

// Export singleton instance
export const cacheService = new InMemoryCache();

// Utility functions for common caching patterns
export async function cacheJson<T>(
  key: string, 
  ttlSec: number, 
  fn: () => Promise<T>
): Promise<T> {
  return cacheService.cacheWithFallback(key, fn, ttlSec * 1000);
}

export async function cacheStats(
  key: string, 
  ttlSec: number, 
  fn: () => Promise<any>
): Promise<any> {
  return cacheService.cacheWithFallback(key, fn, ttlSec * 1000);
}

export async function cacheSearch(
  key: string, 
  ttlSec: number, 
  fn: () => Promise<any>
): Promise<any> {
  return cacheService.cacheWithFallback(key, fn, ttlSec * 1000);
}

// Export for use in other modules
export default cacheService; 