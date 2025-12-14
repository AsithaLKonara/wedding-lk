// Cache Invalidation Service for WeddingLK
// Provides intelligent cache invalidation strategies

import { advancedCache } from './advanced-cache-service';

export interface InvalidationRule {
  pattern: string;
  ttl: number;
  priority: 'high' | 'medium' | 'low';
  dependencies: string[];
}

export interface InvalidationEvent {
  type: 'create' | 'update' | 'delete';
  entity: string;
  entityId: string;
  timestamp: Date;
  metadata?: any;
}

export class CacheInvalidationService {
  private invalidationRules: Map<string, InvalidationRule> = new Map();
  private invalidationQueue: InvalidationEvent[] = [];
  private isProcessing = false;

  constructor() {
    this.setupDefaultRules();
    this.startProcessingQueue();
  }

  // Setup default invalidation rules
  private setupDefaultRules() {
    // User-related cache invalidation
    this.addRule('users', {
      pattern: 'user:*',
      ttl: 300,
      priority: 'high',
      dependencies: ['user:profile', 'user:preferences', 'user:bookings']
    });

    // Vendor-related cache invalidation
    this.addRule('vendors', {
      pattern: 'vendor:*',
      ttl: 600,
      priority: 'medium',
      dependencies: ['vendors:list', 'vendor:search', 'vendor:stats']
    });

    // Venue-related cache invalidation
    this.addRule('venues', {
      pattern: 'venue:*',
      ttl: 600,
      priority: 'medium',
      dependencies: ['venues:list', 'venue:search', 'venue:stats']
    });

    // Booking-related cache invalidation
    this.addRule('bookings', {
      pattern: 'booking:*',
      ttl: 300,
      priority: 'high',
      dependencies: ['user:bookings', 'vendor:bookings', 'booking:stats']
    });

    // Review-related cache invalidation
    this.addRule('reviews', {
      pattern: 'review:*',
      ttl: 300,
      priority: 'medium',
      dependencies: ['vendor:rating', 'venue:rating', 'review:stats']
    });

    // Stats-related cache invalidation
    this.addRule('stats', {
      pattern: 'stats:*',
      ttl: 900,
      priority: 'low',
      dependencies: ['home:stats', 'dashboard:stats', 'analytics:stats']
    });
  }

  // Add invalidation rule
  addRule(name: string, rule: InvalidationRule) {
    this.invalidationRules.set(name, rule);
    console.log(`📋 Added invalidation rule: ${name}`);
  }

  // Invalidate cache based on entity changes
  async invalidateCache(event: InvalidationEvent) {
    console.log(`🔄 Cache invalidation event: ${event.type} ${event.entity}:${event.entityId}`);
    
    // Add to processing queue
    this.invalidationQueue.push(event);
    
    // Process queue if not already processing
    if (!this.isProcessing) {
      this.processQueue();
    }
  }

  // Process invalidation queue
  private async processQueue() {
    if (this.isProcessing || this.invalidationQueue.length === 0) {
      return;
    }

    this.isProcessing = true;
    console.log(`📋 Processing invalidation queue: ${this.invalidationQueue.length} events`);

    try {
      // Sort by priority
      const sortedEvents = this.invalidationQueue.sort((a, b) => {
        const aRule = this.getRuleForEntity(a.entity);
        const bRule = this.getRuleForEntity(b.entity);
        const priorityOrder = { high: 3, medium: 2, low: 1 };
        return (priorityOrder[bRule?.priority || 'low']) - (priorityOrder[aRule?.priority || 'low']);
      });

      // Process events
      for (const event of sortedEvents) {
        await this.processInvalidationEvent(event);
      }

      // Clear processed events
      this.invalidationQueue = [];
      console.log('✅ Invalidation queue processed successfully');

    } catch (error) {
      console.error('❌ Error processing invalidation queue:', error);
    } finally {
      this.isProcessing = false;
      
      // Process remaining events if any were added during processing
      if (this.invalidationQueue.length > 0) {
        setTimeout(() => this.processQueue(), 100);
      }
    }
  }

  // Process individual invalidation event
  private async processInvalidationEvent(event: InvalidationEvent) {
    const rule = this.getRuleForEntity(event.entity);
    if (!rule) {
      console.log(`⚠️ No invalidation rule found for entity: ${event.entity}`);
      return;
    }

    try {
      // Invalidate specific entity cache
      await this.invalidateEntityCache(event.entity, event.entityId);
      
      // Invalidate dependent caches
      await this.invalidateDependentCaches(rule.dependencies);
      
      console.log(`✅ Cache invalidated for ${event.entity}:${event.entityId}`);

    } catch (error) {
      console.error(`❌ Failed to invalidate cache for ${event.entity}:${event.entityId}:`, error);
    }
  }

  // Invalidate entity-specific cache
  private async invalidateEntityCache(entity: string, entityId: string) {
    const patterns = [
      `${entity}:${entityId}`,
      `${entity}:${entityId}:*`,
      `${entity}:list:*`,
      `${entity}:search:*`,
    ];

    for (const pattern of patterns) {
      try {
        await advancedCache.clearNamespace(pattern);
      } catch (error) {
        console.warn(`Failed to invalidate pattern ${pattern}:`, error);
      }
    }
  }

  // Invalidate dependent caches
  private async invalidateDependentCaches(dependencies: string[]) {
    for (const dependency of dependencies) {
      try {
        await advancedCache.clearNamespace(dependency);
        console.log(`🗑️ Invalidated dependent cache: ${dependency}`);
      } catch (error) {
        console.warn(`Failed to invalidate dependent cache ${dependency}:`, error);
      }
    }
  }

  // Get rule for entity
  private getRuleForEntity(entity: string): InvalidationRule | undefined {
    for (const [name, rule] of this.invalidationRules) {
      if (entity.startsWith(name) || name.startsWith(entity)) {
        return rule;
      }
    }
    return undefined;
  }

  // Bulk invalidation for multiple entities
  async bulkInvalidate(events: InvalidationEvent[]) {
    console.log(`🔄 Bulk cache invalidation: ${events.length} events`);
    
    for (const event of events) {
      await this.invalidateCache(event);
    }
  }

  // Invalidate all cache
  async invalidateAll() {
    console.log('🗑️ Invalidating all cache');
    
    try {
      await advancedCache.clearNamespace('weddinglk');
      console.log('✅ All cache invalidated successfully');
    } catch (error) {
      console.error('❌ Failed to invalidate all cache:', error);
    }
  }

  // Get invalidation statistics
  getStats() {
    return {
      rulesCount: this.invalidationRules.size,
      queueLength: this.invalidationQueue.length,
      isProcessing: this.isProcessing,
      rules: Array.from(this.invalidationRules.entries()).map(([name, rule]) => ({
        name,
        pattern: rule.pattern,
        priority: rule.priority,
        dependenciesCount: rule.dependencies.length
      }))
    };
  }

  // Start processing queue
  private startProcessingQueue() {
    // Process queue every 5 seconds
    setInterval(() => {
      if (this.invalidationQueue.length > 0 && !this.isProcessing) {
        this.processQueue();
      }
    }, 5000);
  }
}

// Export singleton instance
export const cacheInvalidationService = new CacheInvalidationService(); 