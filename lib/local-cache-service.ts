// Local Cache Service - Replaces Redis for development
export interface CacheStats {
  hits: number;
  misses: number;
  hitRate: number;
  totalRequests: number;
  memoryUsage: string;
}

export class LocalCacheService {
  private static instance: LocalCacheService;
  private memoryCache: Map<string, { data: any; timestamp: number; ttl: number }> = new Map();
  private stats: CacheStats;

  private constructor() {
    this.stats = {
      hits: 0,
      misses: 0,
      hitRate: 0,
      totalRequests: 0,
      memoryUsage: '0B'
    };
  }

  public static getInstance(): LocalCacheService {
    if (!LocalCacheService.instance) {
      LocalCacheService.instance = new LocalCacheService();
    }
    return LocalCacheService.instance;
  }

  // Set cache value
  async set(key: string, value: any, ttl: number = 3600): Promise<boolean> {
    try {
      const timestamp = Date.now();
      this.memoryCache.set(key, {
        data: value,
        timestamp,
        ttl: ttl * 1000 // Convert to milliseconds
      });
      return true;
    } catch (error) {
      console.error('Cache set error:', error);
      return false;
    }
  }

  // Get cache value
  async get(key: string): Promise<any> {
    try {
      this.stats.totalRequests++;
      
      const cached = this.memoryCache.get(key);
      if (!cached) {
        this.stats.misses++;
        this.updateHitRate();
        return null;
      }

      // Check if expired
      const now = Date.now();
      if (now - cached.timestamp > cached.ttl) {
        this.memoryCache.delete(key);
        this.stats.misses++;
        this.updateHitRate();
        return null;
      }

      this.stats.hits++;
      this.updateHitRate();
      return cached.data;
    } catch (error) {
      console.error('Cache get error:', error);
      this.stats.misses++;
      this.updateHitRate();
      return null;
    }
  }

  // Delete cache value
  async del(key: string): Promise<boolean> {
    try {
      return this.memoryCache.delete(key);
    } catch (error) {
      console.error('Cache delete error:', error);
      return false;
    }
  }

  // Clear all cache
  async flushAll(): Promise<boolean> {
    try {
      this.memoryCache.clear();
      return true;
    } catch (error) {
      console.error('Cache flush error:', error);
      return false;
    }
  }

  // Get cache statistics
  getStats(): CacheStats {
    return { ...this.stats };
  }

  // Update hit rate
  private updateHitRate(): void {
    if (this.stats.totalRequests > 0) {
      this.stats.hitRate = (this.stats.hits / this.stats.totalRequests) * 100;
    }
  }

  // Clean expired entries
  cleanExpired(): void {
    const now = Date.now();
    for (const [key, value] of this.memoryCache.entries()) {
      if (now - value.timestamp > value.ttl) {
        this.memoryCache.delete(key);
      }
    }
  }

  // Get cache size
  getSize(): number {
    return this.memoryCache.size;
  }

  // Check if key exists
  async exists(key: string): Promise<boolean> {
    const cached = this.memoryCache.get(key);
    if (!cached) return false;
    
    const now = Date.now();
    if (now - cached.timestamp > cached.ttl) {
      this.memoryCache.delete(key);
      return false;
    }
    
    return true;
  }

  // Set multiple keys
  async mset(keyValuePairs: Record<string, any>, ttl: number = 3600): Promise<boolean> {
    try {
      for (const [key, value] of Object.entries(keyValuePairs)) {
        await this.set(key, value, ttl);
      }
      return true;
    } catch (error) {
      console.error('Cache mset error:', error);
      return false;
    }
  }

  // Get multiple keys
  async mget(keys: string[]): Promise<Record<string, any>> {
    const result: Record<string, any> = {};
    for (const key of keys) {
      result[key] = await this.get(key);
    }
    return result;
  }
}

// Export singleton instance
export const localCache = LocalCacheService.getInstance();

// Clean expired entries every 5 minutes
setInterval(() => {
  localCache.cleanExpired();
}, 5 * 60 * 1000);

export default localCache;
