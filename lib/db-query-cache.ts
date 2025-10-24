/**
 * Simple in-memory cache for database query results
 * Provides significant performance improvements for frequently accessed data
 */

interface CacheEntry<T> {
  data: T
  timestamp: number
  ttl: number // Time to live in milliseconds
}

class QueryCache {
  private cache: Map<string, CacheEntry<any>> = new Map()
  private readonly defaultTTL = 60 * 1000 // 1 minute default

  /**
   * Get cached value if it exists and hasn't expired
   */
  get<T>(key: string): T | null {
    const entry = this.cache.get(key)
    
    if (!entry) {
      return null
    }

    // Check if cache has expired
    const now = Date.now()
    const elapsed = now - entry.timestamp
    
    if (elapsed > entry.ttl) {
      this.cache.delete(key)
      return null
    }

    console.log(`[Cache] HIT: ${key}`)
    return entry.data as T
  }

  /**
   * Set cache value with optional TTL
   */
  set<T>(key: string, data: T, ttl?: number): void {
    this.cache.set(key, {
      data,
      timestamp: Date.now(),
      ttl: ttl || this.defaultTTL
    })
    console.log(`[Cache] SET: ${key} (TTL: ${ttl || this.defaultTTL}ms)`)
  }

  /**
   * Clear specific cache entry
   */
  delete(key: string): void {
    this.cache.delete(key)
    console.log(`[Cache] DELETE: ${key}`)
  }

  /**
   * Clear all cache
   */
  clear(): void {
    const size = this.cache.size
    this.cache.clear()
    console.log(`[Cache] CLEAR: Cleared ${size} entries`)
  }

  /**
   * Get cache statistics
   */
  getStats() {
    return {
      size: this.cache.size,
      entries: Array.from(this.cache.keys())
    }
  }
}

// Export singleton instance
export const queryCache = new QueryCache()

/**
 * Cache key generators
 */
export const cacheKeys = {
  // Venues
  venues: (page?: number, limit?: number) => `venues:${page || 1}:${limit || 10}`,
  venuesByCity: (city: string) => `venues:city:${city}`,
  venueById: (id: string) => `venue:${id}`,

  // Vendors
  vendors: (page?: number, limit?: number) => `vendors:${page || 1}:${limit || 10}`,
  vendorsByCategory: (category: string) => `vendors:category:${category}`,
  vendorById: (id: string) => `vendor:${id}`,

  // Bookings
  userBookings: (userId: string) => `bookings:user:${userId}`,
  bookingById: (id: string) => `booking:${id}`,

  // Users
  userById: (id: string) => `user:${id}`,
  userByEmail: (email: string) => `user:email:${email}`,

  // Dashboard stats
  dashboardStats: (role: string) => `dashboard:stats:${role}`,
}

/**
 * TTL configurations for different data types
 */
export const cacheTTL = {
  SHORT: 5 * 60 * 1000,      // 5 minutes - for user data
  MEDIUM: 15 * 60 * 1000,    // 15 minutes - for search results
  LONG: 60 * 60 * 1000,      // 1 hour - for static data like venues/vendors
  VERY_LONG: 24 * 60 * 60 * 1000, // 24 hours - for category lists
}
