// DISABLED: Redis cache manager - using local cache instead
console.log('⚠️ Redis cache manager disabled - using local cache service');

class CacheManager {
  private isConnected: boolean = false;

  constructor() {
    // DISABLED: Redis connection - using local cache instead
    console.log('⚠️ Redis cache manager disabled - using local cache service');
    this.isConnected = true; // Mock as connected
  }

  async get(key: string): Promise<any> {
    if (!this.isConnected) return null;
    
    try {
      const value = await this.redis.get(key);
      return value ? JSON.parse(value) : null;
    } catch (error) {
      console.error('Cache get error:', error);
      return null;
    }
  }

  async set(key: string, value: any, ttl: number = 300): Promise<void> {
    if (!this.isConnected) return;
    
    try {
      await this.redis.setex(key, ttl, JSON.stringify(value));
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
      await this.redis.flushall();
      console.log('✅ Cache flushed successfully');
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
      await this.redis.ping();
      return true;
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