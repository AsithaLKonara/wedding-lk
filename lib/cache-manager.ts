import UpstashRedisService from './upstash-redis';

class CacheManager {
  private redis: UpstashRedisService;
  private isConnected: boolean = false;

  constructor() {
    // Use Upstash Redis service
    this.redis = UpstashRedisService.getInstance();
    this.isConnected = true; // Upstash service handles connection internally
  }

  async get(key: string): Promise<any> {
    if (!this.isConnected) return null;
    
    try {
      return await this.redis.get(key);
    } catch (error) {
      console.error('Cache get error:', error);
      return null;
    }
  }

  async set(key: string, value: any, ttl: number = 300): Promise<void> {
    if (!this.isConnected) return;
    
    try {
      await this.redis.set(key, value, ttl);
    } catch (error) {
      console.error('Cache set error:', error);
    }
  }

  async del(key: string): Promise<void> {
    if (!this.isConnected) return;
    
    try {
      await this.redis.del(key);
    } catch (error) {
      console.error('Cache delete error:', error);
    }
  }

  async flush(): Promise<void> {
    if (!this.isConnected) return;
    
    try {
      // Upstash Redis doesn't have flushall, skip for now
      console.log('⚠️ Cache flush skipped - Upstash Redis doesn\'t support flushall');
    } catch (error) {
      console.error('Cache flush error:', error);
    }
  }

  // Cache key generators
  static generateKey(prefix: string, params: Record<string, any>): string {
    const sortedParams = Object.keys(params)
      .sort()
      .map(key => `${key}:${params[key]}`)
      .join('|');
    return `${prefix}:${sortedParams}`;
  }

  // Health check
  async healthCheck(): Promise<boolean> {
    try {
      // Upstash Redis doesn't have ping, return true if connected
      return this.isConnected;
    } catch {
      return false;
    }
  }
}

// Export singleton instance
export const cacheManager = new CacheManager();

// Cache decorator for functions
export function Cache(ttl: number = 300, keyPrefix?: string) {
  return function (target: any, propertyName: string, descriptor: PropertyDescriptor) {
    const method = descriptor.value;

    descriptor.value = async function (...args: any[]) {
      const cacheKey = keyPrefix 
        ? CacheManager.generateKey(keyPrefix, { args: JSON.stringify(args) })
        : `${target.constructor.name}:${propertyName}:${JSON.stringify(args)}`;

      // Try to get from cache
      const cached = await cacheManager.get(cacheKey);
      if (cached) {
        console.log(`📦 Cache hit: ${cacheKey}`);
        return cached;
      }

      // Execute method and cache result
      const result = await method.apply(this, args);
      await cacheManager.set(cacheKey, result, ttl);
      console.log(`💾 Cache miss: ${cacheKey}`);
      
      return result;
    };
  };
}

export default cacheManager; 