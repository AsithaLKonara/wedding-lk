// Redis caching layer for API optimization
import Redis from 'ioredis'

const redis = new Redis(process.env.REDIS_URL || 'redis://localhost:6379')

export class CacheService {
  private static instance: CacheService
  private redis: Redis
  
  constructor() {
    this.redis = redis
  }
  
  static getInstance(): CacheService {
    if (!CacheService.instance) {
      CacheService.instance = new CacheService()
    }
    return CacheService.instance
  }
  
  async get<T>(key: string): Promise<T | null> {
    try {
      const cached = await this.redis.get(key)
      return cached ? JSON.parse(cached) : null
    } catch (error) {
      console.error('Cache get error:', error)
      return null
    }
  }
  
  async set(key: string, value: any, ttl: number = 300): Promise<void> {
    try {
      await this.redis.setex(key, ttl, JSON.stringify(value))
    } catch (error) {
      console.error('Cache set error:', error)
    }
  }
  
  async del(key: string): Promise<void> {
    try {
      await this.redis.del(key)
    } catch (error) {
      console.error('Cache delete error:', error)
    }
  }
  
  // Cache key generators
  static getVenuesKey(filters?: any): string {
    return `venues:${JSON.stringify(filters || {})}`
  }
  
  static getVendorsKey(filters?: any): string {
    return `vendors:${JSON.stringify(filters || {})}`
  }
  
  static getPackagesKey(filters?: any): string {
    return `packages:${JSON.stringify(filters || {})}`
  }
}

export default CacheService
