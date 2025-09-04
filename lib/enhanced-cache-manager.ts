// Enhanced Cache Manager for WeddingLK
// Multi-layer caching with intelligent invalidation

import { Redis } from 'ioredis';
import { advancedCache } from './advanced-cache-service';

export interface CacheLayer {
  name: string;
  priority: number;
  ttl: number;
  maxSize: number;
  enabled: boolean;
}

export interface CacheOptions {
  ttl?: number;
  layer?: string;
  tags?: string[];
  compress?: boolean;
  serialize?: boolean;
  fallback?: boolean;
}

export interface CacheStats {
  hits: number;
  misses: number;
  hitRate: number;
  totalRequests: number;
  memoryUsage: string;
  layerStats: Record<string, { hits: number; misses: number; size: number }>;
}

export class EnhancedCacheManager {
  private static instance: EnhancedCacheManager;
  private redis: Redis;
  private memoryCache: Map<string, { data: any; timestamp: number; ttl: number }> = new Map();
  private stats: CacheStats;
  private layers: Map<string, CacheLayer> = new Map();

  private constructor() {
    // DISABLED: Redis connection - using local cache instead
    console.log('⚠️ Redis connection disabled - using local cache service');
    this.redis = null as any; // Disable Redis

    this.stats = {
      hits: 0,
      misses: 0,
      hitRate: 0,
      totalRequests: 0,
      memoryUsage: '0B',
      layerStats: {}
    };

    this.initializeLayers();
    this.setupEventListeners();
  }

  public static getInstance(): EnhancedCacheManager {
    if (!EnhancedCacheManager.instance) {
      EnhancedCacheManager.instance = new EnhancedCacheManager();
    }
    return EnhancedCacheManager.instance;
  }

  private initializeLayers(): void {
    // Layer 1: Memory Cache (fastest, smallest)
    this.layers.set('memory', {
      name: 'memory',
      priority: 1,
      ttl: 300, // 5 minutes
      maxSize: 1000, // 1000 items
      enabled: true
    });

    // Layer 2: Redis Cache (fast, medium size)
    this.layers.set('redis', {
      name: 'redis',
      priority: 2,
      ttl: 3600, // 1 hour
      maxSize: 10000, // 10,000 items
      enabled: true
    });

    // Layer 3: Database Cache (slowest, largest)
    this.layers.set('database', {
      name: 'database',
      priority: 3,
      ttl: 86400, // 24 hours
      maxSize: 100000, // 100,000 items
      enabled: true
    });
  }

  private setupEventListeners(): void {
    this.redis.on('error', (err) => {
      console.error('Enhanced Cache Redis error:', err);
    });

    this.redis.on('connect', () => {
      console.log('✅ Enhanced Cache Redis connected');
    });
  }

  // Get data from cache with multi-layer fallback
  async get<T>(key: string, options: CacheOptions = {}): Promise<T | null> {
    this.stats.totalRequests++;

    // Try each layer in priority order
    const sortedLayers = Array.from(this.layers.values())
      .filter(layer => layer.enabled)
      .sort((a, b) => a.priority - b.priority);

    for (const layer of sortedLayers) {
      try {
        const data = await this.getFromLayer<T>(key, layer.name, options);
        if (data !== null) {
          this.stats.hits++;
          this.updateLayerStats(layer.name, 'hit');
          this.updateHitRate();
          return data;
        }
      } catch (error) {
        console.warn(`Cache layer ${layer.name} failed for key ${key}:`, error);
      }
    }

    this.stats.misses++;
    this.updateHitRate();
    return null;
  }

  // Set data in cache with multi-layer storage
  async set<T>(key: string, value: T, options: CacheOptions = {}): Promise<void> {
    const ttl = options.ttl || this.getDefaultTTL(options.layer);
    const tags = options.tags || [];

    // Store in all enabled layers
    const promises: Promise<void>[] = [];

    for (const layer of this.layers.values()) {
      if (layer.enabled) {
        promises.push(this.setInLayer(key, value, layer.name, ttl, options));
      }
    }

    // Store tags for invalidation
    if (tags.length > 0) {
      promises.push(this.storeTags(key, tags));
    }

    await Promise.allSettled(promises);
  }

  // Get data from specific layer
  private async getFromLayer<T>(key: string, layerName: string, options: CacheOptions): Promise<T | null> {
    switch (layerName) {
      case 'memory':
        return this.getFromMemory<T>(key);
      case 'redis':
        return this.getFromRedis<T>(key);
      case 'database':
        return this.getFromDatabase<T>(key);
      default:
        return null;
    }
  }

  // Set data in specific layer
  private async setInLayer<T>(key: string, value: T, layerName: string, ttl: number, options: CacheOptions): Promise<void> {
    switch (layerName) {
      case 'memory':
        await this.setInMemory(key, value, ttl);
        break;
      case 'redis':
        await this.setInRedis(key, value, ttl, options);
        break;
      case 'database':
        await this.setInDatabase(key, value, ttl);
        break;
    }
  }

  // Memory cache operations
  private getFromMemory<T>(key: string): T | null {
    const item = this.memoryCache.get(key);
    if (!item) return null;

    const now = Date.now();
    if (now - item.timestamp > item.ttl * 1000) {
      this.memoryCache.delete(key);
      return null;
    }

    return item.data;
  }

  private setInMemory<T>(key: string, value: T, ttl: number): void {
    // Check memory limit
    if (this.memoryCache.size >= this.layers.get('memory')!.maxSize) {
      this.evictOldestMemoryItem();
    }

    this.memoryCache.set(key, {
      data: value,
      timestamp: Date.now(),
      ttl
    });
  }

  private evictOldestMemoryItem(): void {
    let oldestKey = '';
    let oldestTime = Date.now();

    for (const [key, item] of this.memoryCache.entries()) {
      if (item.timestamp < oldestTime) {
        oldestTime = item.timestamp;
        oldestKey = key;
      }
    }

    if (oldestKey) {
      this.memoryCache.delete(oldestKey);
    }
  }

  // Redis cache operations
  private async getFromRedis<T>(key: string): Promise<T | null> {
    try {
      const data = await this.redis.get(key);
      return data ? JSON.parse(data) : null;
    } catch (error) {
      console.warn('Redis get error:', error);
      return null;
    }
  }

  private async setInRedis<T>(key: string, value: T, ttl: number, options: CacheOptions): Promise<void> {
    try {
      const data = options.compress ? this.compress(JSON.stringify(value)) : JSON.stringify(value);
      await this.redis.setex(key, ttl, data);
    } catch (error) {
      console.warn('Redis set error:', error);
    }
  }

  // Database cache operations (simplified - would use actual DB)
  private async getFromDatabase<T>(key: string): Promise<T | null> {
    // In a real implementation, you'd query a cache table in your database
    // For now, return null to indicate cache miss
    return null;
  }

  private async setInDatabase<T>(key: string, value: T, ttl: number): Promise<void> {
    // In a real implementation, you'd store in a cache table
    // For now, do nothing
  }

  // Tag-based invalidation
  private async storeTags(key: string, tags: string[]): Promise<void> {
    for (const tag of tags) {
      await this.redis.sadd(`tag:${tag}`, key);
      await this.redis.expire(`tag:${tag}`, 86400); // 24 hours
    }
  }

  // Invalidate by tags
  async invalidateByTags(tags: string[]): Promise<void> {
    const promises: Promise<void>[] = [];

    for (const tag of tags) {
      promises.push(this.invalidateTag(tag));
    }

    await Promise.allSettled(promises);
  }

  private async invalidateTag(tag: string): Promise<void> {
    try {
      const keys = await this.redis.smembers(`tag:${tag}`);
      if (keys.length > 0) {
        // Delete from all layers
        await Promise.all([
          this.redis.del(...keys),
          this.deleteFromMemory(keys),
          this.deleteFromDatabase(keys)
        ]);
        
        // Remove tag
        await this.redis.del(`tag:${tag}`);
        
        console.log(`🗑️ Invalidated ${keys.length} keys for tag: ${tag}`);
      }
    } catch (error) {
      console.warn(`Tag invalidation failed for ${tag}:`, error);
    }
  }

  private deleteFromMemory(keys: string[]): void {
    keys.forEach(key => this.memoryCache.delete(key));
  }

  private deleteFromDatabase(keys: string[]): Promise<void> {
    // In a real implementation, delete from database cache table
    return Promise.resolve();
  }

  // Cache warming
  async warmCache<T>(key: string, fetchFunction: () => Promise<T>, options: CacheOptions = {}): Promise<T> {
    try {
      const data = await fetchFunction();
      await this.set(key, data, options);
      console.log(`🔥 Cache warmed: ${key}`);
      return data;
    } catch (error) {
      console.warn(`Cache warming failed for ${key}:`, error);
      throw error;
    }
  }

  // Cache with fallback
  async getWithFallback<T>(
    key: string, 
    fetchFunction: () => Promise<T>, 
    options: CacheOptions = {}
  ): Promise<T> {
    // Try to get from cache first
    const cached = await this.get<T>(key, options);
    if (cached !== null) {
      return cached;
    }

    // Fetch fresh data
    try {
      const data = await fetchFunction();
      await this.set(key, data, options);
      return data;
    } catch (error) {
      console.error(`Fallback fetch failed for ${key}:`, error);
      throw error;
    }
  }

  // Clear all cache
  async clear(): Promise<void> {
    const promises: Promise<void>[] = [
      Promise.resolve(this.clearMemory()),
      this.clearRedis(),
      this.clearDatabase()
    ];

    await Promise.allSettled(promises);
    console.log('🧹 All cache layers cleared');
  }

  private clearMemory(): void {
    this.memoryCache.clear();
  }

  private async clearRedis(): Promise<void> {
    await this.redis.flushdb();
  }

  private async clearDatabase(): Promise<void> {
    // In a real implementation, clear database cache table
    return Promise.resolve();
  }

  // Get cache statistics
  getStats(): CacheStats {
    return { ...this.stats };
  }

  // Update layer statistics
  private updateLayerStats(layerName: string, type: 'hit' | 'miss'): void {
    if (!this.stats.layerStats[layerName]) {
      this.stats.layerStats[layerName] = { hits: 0, misses: 0, size: 0 };
    }

    if (type === 'hit') {
      this.stats.layerStats[layerName].hits++;
    } else {
      this.stats.layerStats[layerName].misses++;
    }

    // Update size based on layer
    if (layerName === 'memory') {
      this.stats.layerStats[layerName].size = this.memoryCache.size;
    }
  }

  // Update hit rate
  private updateHitRate(): void {
    this.stats.hitRate = this.stats.totalRequests > 0 
      ? (this.stats.hits / this.stats.totalRequests) * 100 
      : 0;
  }

  // Get default TTL for layer
  private getDefaultTTL(layer?: string): number {
    if (layer && this.layers.has(layer)) {
      return this.layers.get(layer)!.ttl;
    }
    return 3600; // Default 1 hour
  }

  // Simple compression (in a real implementation, use proper compression)
  private compress(data: string): string {
    // Placeholder - would use actual compression like gzip
    return data;
  }

  // Health check
  async healthCheck(): Promise<{ status: string; layers: Record<string, boolean> }> {
    const layers: Record<string, boolean> = {};

    // Check memory layer
    layers.memory = true; // Always available

    // Check Redis layer
    try {
      await this.redis.ping();
      layers.redis = true;
    } catch {
      layers.redis = false;
    }

    // Check database layer
    layers.database = true; // Simplified

    const allHealthy = Object.values(layers).every(status => status);
    
    return {
      status: allHealthy ? 'healthy' : 'degraded',
      layers
    };
  }

  // Close connections
  async close(): Promise<void> {
    await this.redis.quit();
    this.memoryCache.clear();
  }
}

// Export singleton instance
export const enhancedCacheManager = EnhancedCacheManager.getInstance();
