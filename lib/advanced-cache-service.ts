// Advanced Caching Service for WeddingLK
// Provides intelligent caching strategies for slow API endpoints

import { Redis } from 'ioredis';

export interface CacheConfig {
  ttl: number; // Time to live in seconds
  staleWhileRevalidate: number; // How long to serve stale data while revalidating
  maxRetries: number; // Maximum retry attempts for failed operations
  retryDelay: number; // Delay between retries in milliseconds
}

export interface CacheResult<T> {
  data: T;
  isStale: boolean;
  isFromCache: boolean;
  timestamp: number;
  ttl: number;
}

export class AdvancedCacheService {
  private redis: Redis;
  private defaultConfig: CacheConfig = {
    ttl: 300, // 5 minutes
    staleWhileRevalidate: 600, // 10 minutes
    maxRetries: 3,
    retryDelay: 1000,
  };

  constructor() {
    this.redis = new Redis(process.env.REDIS_URL || 'redis://redis:6379', {
      maxRetriesPerRequest: 3,
      lazyConnect: true,
      keepAlive: 30000,
    });

    this.redis.on('error', (err) => {
      console.error('Redis connection error:', err);
    });

    this.redis.on('connect', () => {
      console.log('✅ Redis connected for advanced caching');
    });
  }

  // Generate cache key with namespace
  private generateKey(namespace: string, key: string): string {
    return `weddinglk:${namespace}:${key}`;
  }

  // Set cache with metadata
  async set<T>(
    namespace: string,
    key: string,
    data: T,
    config: Partial<CacheConfig> = {}
  ): Promise<void> {
    const finalConfig = { ...this.defaultConfig, ...config };
    const cacheKey = this.generateKey(namespace, key);
    
    const cacheData = {
      data,
      timestamp: Date.now(),
      ttl: finalConfig.ttl,
      staleWhileRevalidate: finalConfig.staleWhileRevalidate,
    };

    try {
      await this.redis.setex(cacheKey, finalConfig.ttl, JSON.stringify(cacheData));
      console.log(`💾 Cached: ${namespace}:${key} (TTL: ${finalConfig.ttl}s)`);
    } catch (error) {
      console.warn(`Failed to cache ${namespace}:${key}:`, error);
    }
  }

  // Get cache with stale-while-revalidate logic
  async get<T>(
    namespace: string,
    key: string
  ): Promise<CacheResult<T> | null> {
    const cacheKey = this.generateKey(namespace, key);
    
    try {
      const cached = await this.redis.get(cacheKey);
      if (!cached) return null;

      const cacheData = JSON.parse(cached);
      const now = Date.now();
      const age = now - cacheData.timestamp;
      
      // Check if data is fresh
      const isFresh = age < (cacheData.ttl * 1000);
      // Check if data is stale but still usable
      const isStale = age < ((cacheData.ttl + cacheData.staleWhileRevalidate) * 1000);

      if (!isStale) {
        // Data is too old, remove it
        await this.redis.del(cacheKey);
        return null;
      }

      return {
        data: cacheData.data,
        isStale: !isFresh,
        isFromCache: true,
        timestamp: cacheData.timestamp,
        ttl: cacheData.ttl,
      };
    } catch (error) {
      console.warn(`Failed to get cache ${namespace}:${key}:`, error);
      return null;
    }
  }

  // Delete cache
  async delete(namespace: string, key: string): Promise<void> {
    const cacheKey = this.generateKey(namespace, key);
    try {
      await this.redis.del(cacheKey);
      console.log(`🗑️ Deleted cache: ${namespace}:${key}`);
    } catch (error) {
      console.warn(`Failed to delete cache ${namespace}:${key}:`, error);
    }
  }

  // Clear all cache for a namespace
  async clearNamespace(namespace: string): Promise<void> {
    try {
      const keys = await this.redis.keys(`weddinglk:${namespace}:*`);
      if (keys.length > 0) {
        await this.redis.del(...keys);
        console.log(`🗑️ Cleared namespace: ${namespace} (${keys.length} keys)`);
      }
    } catch (error) {
      console.warn(`Failed to clear namespace ${namespace}:`, error);
    }
  }

  // Cache with background refresh
  async getWithBackgroundRefresh<T>(
    namespace: string,
    key: string,
    fetchFunction: () => Promise<T>,
    config: Partial<CacheConfig> = {}
  ): Promise<T> {
    const finalConfig = { ...this.defaultConfig, ...config };
    
    // Try to get from cache first
    const cached = await this.get<T>(namespace, key);
    
    if (cached && !cached.isStale) {
      // Return fresh data immediately
      return cached.data;
    }

    if (cached && cached.isStale) {
      // Return stale data immediately, but refresh in background
      this.refreshInBackground(namespace, key, fetchFunction, finalConfig);
      return cached.data;
    }

    // No cache, fetch fresh data
    try {
      const data = await fetchFunction();
      await this.set(namespace, key, data, finalConfig);
      return data;
    } catch (error) {
      console.error(`Failed to fetch data for ${namespace}:${key}:`, error);
      throw error;
    }
  }

  // Refresh cache in background
  private async refreshInBackground<T>(
    namespace: string,
    key: string,
    fetchFunction: () => Promise<T>,
    config: CacheConfig
  ): Promise<void> {
    setTimeout(async () => {
      try {
        const data = await fetchFunction();
        await this.set(namespace, key, data, config);
        console.log(`🔄 Background refresh completed: ${namespace}:${key}`);
      } catch (error) {
        console.warn(`Background refresh failed for ${namespace}:${key}:`, error);
      }
    }, 100); // Small delay to avoid blocking
  }

  // Batch operations
  async mget<T>(namespace: string, keys: string[]): Promise<(T | null)[]> {
    const cacheKeys = keys.map(key => this.generateKey(namespace, key));
    
    try {
      const results = await this.redis.mget(...cacheKeys);
      return results.map(result => {
        if (!result) return null;
        try {
          const cacheData = JSON.parse(result);
          return cacheData.data;
        } catch {
          return null;
        }
      });
    } catch (error) {
      console.warn('Batch get failed:', error);
      return new Array(keys.length).fill(null);
    }
  }

  // Cache warming
  async warmCache<T>(
    namespace: string,
    key: string,
    fetchFunction: () => Promise<T>,
    config: Partial<CacheConfig> = {}
  ): Promise<void> {
    try {
      const data = await fetchFunction();
      await this.set(namespace, key, data, config);
      console.log(`🔥 Cache warmed: ${namespace}:${key}`);
    } catch (error) {
      console.warn(`Cache warming failed for ${namespace}:${key}:`, error);
    }
  }

  // Health check
  async healthCheck(): Promise<boolean> {
    try {
      await this.redis.ping();
      return true;
    } catch {
      return false;
    }
  }

  // Get cache statistics
  async getStats(): Promise<{
    totalKeys: number;
    memoryUsage: string;
    hitRate: number;
  }> {
    try {
      const info = await this.redis.info('memory');
      const keys = await this.redis.dbsize();
      
      // Parse memory info
      const memoryMatch = info.match(/used_memory_human:(\S+)/);
      const memoryUsage = memoryMatch ? memoryMatch[1] : 'Unknown';
      
      return {
        totalKeys: keys,
        memoryUsage,
        hitRate: 0.95, // Placeholder - would need to implement hit tracking
      };
    } catch (error) {
      console.warn('Failed to get cache stats:', error);
      return {
        totalKeys: 0,
        memoryUsage: 'Unknown',
        hitRate: 0,
      };
    }
  }

  // Close connection
  async close(): Promise<void> {
    await this.redis.quit();
  }
}

// Export singleton instance
export const advancedCache = new AdvancedCacheService(); 