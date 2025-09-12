import Redis from 'ioredis';
import { NextRequest, NextResponse } from 'next/server';

// Redis client configuration
const redis = new Redis({
  host: process.env.REDIS_HOST || 'localhost',
  port: parseInt(process.env.REDIS_PORT || '6379'),
  password: process.env.REDIS_PASSWORD,
  retryDelayOnFailover: 100,
  enableReadyCheck: false,
  maxRetriesPerRequest: null,
  lazyConnect: true,
  keepAlive: 30000,
  connectTimeout: 10000,
  commandTimeout: 5000,
});

// Cache configuration
export const CACHE_TTL = {
  SHORT: 300,      // 5 minutes
  MEDIUM: 1800,    // 30 minutes
  LONG: 3600,      // 1 hour
  VERY_LONG: 86400, // 24 hours
  STATIC: 604800,  // 7 days
};

// Cache key generators
export const CACHE_KEYS = {
  USER: (id: string) => `user:${id}`,
  VENDOR: (id: string) => `vendor:${id}`,
  VENDORS_LIST: (filters: string) => `vendors:list:${filters}`,
  SEARCH: (query: string, filters: string) => `search:${query}:${filters}`,
  BOOKING: (id: string) => `booking:${id}`,
  REVIEWS: (vendorId: string) => `reviews:${vendorId}`,
  ANALYTICS: (entityId: string, period: string) => `analytics:${entityId}:${period}`,
  SESSION: (sessionId: string) => `session:${sessionId}`,
  RATE_LIMIT: (ip: string, endpoint: string) => `rate_limit:${ip}:${endpoint}`,
};

// Cache utility functions
export class CacheManager {
  private static instance: CacheManager;
  private redis: Redis;

  constructor() {
    this.redis = redis;
  }

  static getInstance(): CacheManager {
    if (!CacheManager.instance) {
      CacheManager.instance = new CacheManager();
    }
    return CacheManager.instance;
  }

  // Basic cache operations
  async get<T>(key: string): Promise<T | null> {
    try {
      const value = await this.redis.get(key);
      return value ? JSON.parse(value) : null;
    } catch (error) {
      console.error('Cache get error:', error);
      return null;
    }
  }

  async set(key: string, value: any, ttl: number = CACHE_TTL.MEDIUM): Promise<boolean> {
    try {
      await this.redis.setex(key, ttl, JSON.stringify(value));
      return true;
    } catch (error) {
      console.error('Cache set error:', error);
      return false;
    }
  }

  async del(key: string): Promise<boolean> {
    try {
      await this.redis.del(key);
      return true;
    } catch (error) {
      console.error('Cache delete error:', error);
      return false;
    }
  }

  async exists(key: string): Promise<boolean> {
    try {
      const result = await this.redis.exists(key);
      return result === 1;
    } catch (error) {
      console.error('Cache exists error:', error);
      return false;
    }
  }

  // Pattern-based operations
  async delPattern(pattern: string): Promise<number> {
    try {
      const keys = await this.redis.keys(pattern);
      if (keys.length === 0) return 0;
      return await this.redis.del(...keys);
    } catch (error) {
      console.error('Cache delPattern error:', error);
      return 0;
    }
  }

  // Hash operations for complex data
  async hget<T>(key: string, field: string): Promise<T | null> {
    try {
      const value = await this.redis.hget(key, field);
      return value ? JSON.parse(value) : null;
    } catch (error) {
      console.error('Cache hget error:', error);
      return null;
    }
  }

  async hset(key: string, field: string, value: any): Promise<boolean> {
    try {
      await this.redis.hset(key, field, JSON.stringify(value));
      return true;
    } catch (error) {
      console.error('Cache hset error:', error);
      return false;
    }
  }

  async hgetall<T>(key: string): Promise<Record<string, T> | null> {
    try {
      const hash = await this.redis.hgetall(key);
      if (Object.keys(hash).length === 0) return null;
      
      const result: Record<string, T> = {};
      for (const [field, value] of Object.entries(hash)) {
        result[field] = JSON.parse(value);
      }
      return result;
    } catch (error) {
      console.error('Cache hgetall error:', error);
      return null;
    }
  }

  // List operations
  async lpush(key: string, ...values: any[]): Promise<number> {
    try {
      const stringValues = values.map(v => JSON.stringify(v));
      return await this.redis.lpush(key, ...stringValues);
    } catch (error) {
      console.error('Cache lpush error:', error);
      return 0;
    }
  }

  async lrange<T>(key: string, start: number, stop: number): Promise<T[]> {
    try {
      const values = await this.redis.lrange(key, start, stop);
      return values.map(v => JSON.parse(v));
    } catch (error) {
      console.error('Cache lrange error:', error);
      return [];
    }
  }

  // Set operations
  async sadd(key: string, ...members: any[]): Promise<number> {
    try {
      const stringMembers = members.map(m => JSON.stringify(m));
      return await this.redis.sadd(key, ...stringMembers);
    } catch (error) {
      console.error('Cache sadd error:', error);
      return 0;
    }
  }

  async smembers<T>(key: string): Promise<T[]> {
    try {
      const members = await this.redis.smembers(key);
      return members.map(m => JSON.parse(m));
    } catch (error) {
      console.error('Cache smembers error:', error);
      return [];
    }
  }

  // Atomic operations
  async incr(key: string, ttl?: number): Promise<number> {
    try {
      const result = await this.redis.incr(key);
      if (ttl) {
        await this.redis.expire(key, ttl);
      }
      return result;
    } catch (error) {
      console.error('Cache incr error:', error);
      return 0;
    }
  }

  async decr(key: string): Promise<number> {
    try {
      return await this.redis.decr(key);
    } catch (error) {
      console.error('Cache decr error:', error);
      return 0;
    }
  }

  // Cache invalidation strategies
  async invalidateUser(userId: string): Promise<void> {
    const patterns = [
      CACHE_KEYS.USER(userId),
      `bookings:user:${userId}`,
      `favorites:user:${userId}`,
      `analytics:user:${userId}:*`,
    ];
    
    for (const pattern of patterns) {
      await this.delPattern(pattern);
    }
  }

  async invalidateVendor(vendorId: string): Promise<void> {
    const patterns = [
      CACHE_KEYS.VENDOR(vendorId),
      CACHE_KEYS.REVIEWS(vendorId),
      `bookings:vendor:${vendorId}`,
      `analytics:vendor:${vendorId}:*`,
      'vendors:list:*', // Invalidate all vendor lists
    ];
    
    for (const pattern of patterns) {
      await this.delPattern(pattern);
    }
  }

  async invalidateSearch(): Promise<void> {
    await this.delPattern('search:*');
    await this.delPattern('vendors:list:*');
  }

  // Cache warming
  async warmCache(): Promise<void> {
    try {
      // Warm frequently accessed data
      console.log('Warming cache...');
      
      // Add cache warming logic here
      // For example, pre-load popular vendors, categories, etc.
      
      console.log('Cache warmed successfully');
    } catch (error) {
      console.error('Cache warming error:', error);
    }
  }

  // Health check
  async healthCheck(): Promise<boolean> {
    try {
      const result = await this.redis.ping();
      return result === 'PONG';
    } catch (error) {
      console.error('Redis health check failed:', error);
      return false;
    }
  }

  // Get cache statistics
  async getStats(): Promise<{
    connected: boolean;
    memory: any;
    keyspace: any;
    clients: any;
  }> {
    try {
      const info = await this.redis.info();
      const memory = await this.redis.memory('usage');
      const keyspace = await this.redis.info('keyspace');
      const clients = await this.redis.info('clients');
      
      return {
        connected: true,
        memory: this.parseRedisInfo(memory),
        keyspace: this.parseRedisInfo(keyspace),
        clients: this.parseRedisInfo(clients),
      };
    } catch (error) {
      console.error('Redis stats error:', error);
      return {
        connected: false,
        memory: {},
        keyspace: {},
        clients: {},
      };
    }
  }

  private parseRedisInfo(info: string): any {
    const result: any = {};
    const lines = info.split('\r\n');
    
    for (const line of lines) {
      if (line.includes(':')) {
        const [key, value] = line.split(':');
        result[key] = isNaN(Number(value)) ? value : Number(value);
      }
    }
    
    return result;
  }
}

// Cache middleware for API routes
export function withCache(
  handler: Function,
  keyGenerator: (req: NextRequest) => string,
  ttl: number = CACHE_TTL.MEDIUM
) {
  return async (req: NextRequest, ...args: any[]) => {
    const cache = CacheManager.getInstance();
    const cacheKey = keyGenerator(req);
    
    // Try to get from cache
    const cached = await cache.get(cacheKey);
    if (cached) {
      return NextResponse.json(cached);
    }
    
    // Execute handler
    const response = await handler(req, ...args);
    
    // Cache the response if successful
    if (response.status === 200) {
      const data = await response.json();
      await cache.set(cacheKey, data, ttl);
      return NextResponse.json(data);
    }
    
    return response;
  };
}

// Rate limiting with Redis
export class RateLimiter {
  private cache: CacheManager;

  constructor() {
    this.cache = CacheManager.getInstance();
  }

  async checkLimit(
    identifier: string,
    limit: number,
    window: number
  ): Promise<{ allowed: boolean; remaining: number; resetTime: number }> {
    const key = `rate_limit:${identifier}`;
    const current = await this.cache.incr(key, window);
    
    if (current === 1) {
      // First request in window
      return {
        allowed: true,
        remaining: limit - 1,
        resetTime: Date.now() + (window * 1000),
      };
    }
    
    if (current > limit) {
      return {
        allowed: false,
        remaining: 0,
        resetTime: Date.now() + (window * 1000),
      };
    }
    
    return {
      allowed: true,
      remaining: limit - current,
      resetTime: Date.now() + (window * 1000),
    };
  }
}

export default CacheManager;

