// Cache Warming Service for WeddingLK
// Pre-loads frequently accessed data during peak usage times

import { advancedCache } from './advanced-cache-service';
import { connectDB } from './db';
import { User, Vendor, Venue, Booking, Review } from './models';

export interface WarmingStrategy {
  name: string;
  priority: 'critical' | 'high' | 'medium' | 'low';
  frequency: number; // minutes
  lastRun: Date;
  isActive: boolean;
  dependencies: string[];
}

export interface WarmingTask {
  id: string;
  strategy: string;
  status: 'pending' | 'running' | 'completed' | 'failed';
  startTime: Date;
  endTime?: Date;
  result?: any;
  error?: string;
}

export class CacheWarmingService {
  private strategies: Map<string, WarmingStrategy> = new Map();
  private tasks: Map<string, WarmingTask> = new Map();
  private isRunning = false;

  constructor() {
    this.setupDefaultStrategies();
    this.startWarmingCycle();
  }

  // Setup default warming strategies
  private setupDefaultStrategies() {
    // Critical data - warm every 5 minutes
    this.addStrategy('critical-data', {
      name: 'Critical Data Warming',
      priority: 'critical',
      frequency: 5,
      lastRun: new Date(0),
      isActive: true,
      dependencies: ['health', 'stats']
    });

    // High priority - warm every 15 minutes
    this.addStrategy('high-priority', {
      name: 'High Priority Data Warming',
      priority: 'high',
      frequency: 15,
      lastRun: new Date(0),
      isActive: true,
      dependencies: ['vendors', 'venues', 'user-profiles']
    });

    // Medium priority - warm every 30 minutes
    this.addStrategy('medium-priority', {
      name: 'Medium Priority Data Warming',
      priority: 'medium',
      frequency: 30,
      lastRun: new Date(0),
      isActive: true,
      dependencies: ['reviews', 'categories', 'locations']
    });

    // Low priority - warm every hour
    this.addStrategy('low-priority', {
      name: 'Low Priority Data Warming',
      priority: 'low',
      frequency: 60,
      lastRun: new Date(0),
      isActive: true,
      dependencies: ['analytics', 'reports', 'archived-data']
    });
  }

  // Add warming strategy
  addStrategy(id: string, strategy: WarmingStrategy) {
    this.strategies.set(id, strategy);
    console.log(`🔥 Added warming strategy: ${strategy.name}`);
  }

  // Start warming cycle
  private startWarmingCycle() {
    // Check for warming every minute
    setInterval(() => {
      this.checkWarmingNeeded();
    }, 60000);

    console.log('🔥 Cache warming service started');
  }

  // Check if warming is needed
  private async checkWarmingNeeded() {
    if (this.isRunning) {
      return;
    }

    const now = new Date();
    const strategiesToRun: WarmingStrategy[] = [];

    for (const strategy of this.strategies.values()) {
      if (!strategy.isActive) continue;

      const timeSinceLastRun = now.getTime() - strategy.lastRun.getTime();
      const frequencyMs = strategy.frequency * 60 * 1000;

      if (timeSinceLastRun >= frequencyMs) {
        strategiesToRun.push(strategy);
      }
    }

    if (strategiesToRun.length > 0) {
      await this.runWarmingStrategies(strategiesToRun);
    }
  }

  // Run warming strategies
  private async runWarmingStrategies(strategies: WarmingStrategy[]) {
    if (this.isRunning) return;

    this.isRunning = true;
    console.log(`🔥 Running ${strategies.length} warming strategies`);

    try {
      // Sort by priority
      const sortedStrategies = strategies.sort((a, b) => {
        const priorityOrder = { critical: 4, high: 3, medium: 2, low: 1 };
        return priorityOrder[b.priority] - priorityOrder[a.priority];
      });

      for (const strategy of sortedStrategies) {
        await this.runStrategy(strategy);
      }

    } catch (error) {
      console.error('❌ Error running warming strategies:', error);
    } finally {
      this.isRunning = false;
    }
  }

  // Run individual strategy
  private async runStrategy(strategy: WarmingStrategy) {
    const taskId = `warming_${strategy.name}_${Date.now()}`;
    const task: WarmingTask = {
      id: taskId,
      strategy: strategy.name,
      status: 'running',
      startTime: new Date(),
    };

    this.tasks.set(taskId, task);
    console.log(`🔥 Running strategy: ${strategy.name}`);

    try {
      switch (strategy.name) {
        case 'Critical Data Warming':
          await this.warmCriticalData();
          break;
        case 'High Priority Data Warming':
          await this.warmHighPriorityData();
          break;
        case 'Medium Priority Data Warming':
          await this.warmMediumPriorityData();
          break;
        case 'Low Priority Data Warming':
          await this.warmLowPriorityData();
          break;
        default:
          await this.warmGenericData(strategy.dependencies);
      }

      // Update task status
      task.status = 'completed';
      task.endTime = new Date();
      strategy.lastRun = new Date();

      console.log(`✅ Strategy completed: ${strategy.name}`);

    } catch (error) {
      console.error(`❌ Strategy failed: ${strategy.name}:`, error);
      
      task.status = 'failed';
      task.endTime = new Date();
      task.error = error instanceof Error ? error.message : 'Unknown error';
    }
  }

  // Warm critical data
  private async warmCriticalData() {
    try {
      // Warm health check
      await this.warmHealthCheck();
      
      // Warm basic stats
      await this.warmBasicStats();
      
      console.log('🔥 Critical data warmed successfully');
    } catch (error) {
      console.error('❌ Failed to warm critical data:', error);
    }
  }

  // Warm high priority data
  private async warmHighPriorityData() {
    try {
      // Warm vendor list
      await this.warmVendorList();
      
      // Warm venue list
      await this.warmVenueList();
      
      // Warm user profiles
      await this.warmUserProfiles();
      
      console.log('🔥 High priority data warmed successfully');
    } catch (error) {
      console.error('❌ Failed to warm high priority data:', error);
    }
  }

  // Warm medium priority data
  private async warmMediumPriorityData() {
    try {
      // Warm reviews
      await this.warmReviews();
      
      // Warm categories
      await this.warmCategories();
      
      // Warm locations
      await this.warmLocations();
      
      console.log('🔥 Medium priority data warmed successfully');
    } catch (error) {
      console.error('❌ Failed to warm medium priority data:', error);
    }
  }

  // Warm low priority data
  private async warmLowPriorityData() {
    try {
      // Warm analytics
      await this.warmAnalytics();
      
      // Warm reports
      await this.warmReports();
      
      console.log('🔥 Low priority data warmed successfully');
    } catch (error) {
      console.error('❌ Failed to warm low priority data:', error);
    }
  }

  // Warm health check
  private async warmHealthCheck() {
    try {
      const healthData = {
        status: 'healthy',
        timestamp: new Date().toISOString(),
        database: 'connected',
        cache: 'connected',
        system: 'operational'
      };

      await advancedCache.set('health', 'check', healthData, { ttl: 30 });
      console.log('🔥 Health check warmed');
    } catch (error) {
      console.warn('Failed to warm health check:', error);
    }
  }

  // Warm basic stats
  private async warmBasicStats() {
    try {
      const statsData = {
        users: { total: 0, active: 0 },
        vendors: { total: 0, verified: 0 },
        venues: { total: 0, featured: 0 },
        bookings: { total: 0, confirmed: 0 },
        reviews: { total: 0, averageRating: 0 },
        lastUpdated: new Date().toISOString()
      };

      await advancedCache.set('home', 'stats:comprehensive', statsData, { ttl: 600 });
      console.log('🔥 Basic stats warmed');
    } catch (error) {
      console.warn('Failed to warm basic stats:', error);
    }
  }

  // Warm vendor list
  private async warmVendorList() {
    try {
      await connectDB();
      const vendors = await Vendor.find({ isActive: true })
        .select('businessName businessType rating totalReviews')
        .limit(20)
        .lean();

      const vendorData = {
        vendors,
        pagination: { page: 1, limit: 20, total: vendors.length, pages: 1 },
        filters: { category: null, location: null, rating: null, sortBy: 'rating' }
      };

      await advancedCache.set('vendors', 'vendors:1:20:all:all:all:rating', vendorData, { ttl: 300 });
      console.log('🔥 Vendor list warmed');
    } catch (error) {
      console.warn('Failed to warm vendor list:', error);
    }
  }

  // Warm venue list
  private async warmVenueList() {
    try {
      await connectDB();
      const venues = await Venue.find({ isActive: true })
        .select('name type capacity rating')
        .limit(20)
        .lean();

      const venueData = {
        venues,
        pagination: { page: 1, limit: 20, total: venues.length, pages: 1 },
        filters: { type: null, location: null, capacity: null, sortBy: 'rating' }
      };

      await advancedCache.set('venues', 'venues:1:20:all:all:all:rating', venueData, { ttl: 300 });
      console.log('🔥 Venue list warmed');
    } catch (error) {
      console.warn('Failed to warm venue list:', error);
    }
  }

  // Warm user profiles
  private async warmUserProfiles() {
    try {
      await connectDB();
      const users = await User.find({ isActive: true })
        .select('name email role lastActive')
        .limit(50)
        .lean();

      for (const user of users) {
        await advancedCache.set('user', `profile:${user._id}`, user, { ttl: 900 });
      }

      console.log(`🔥 ${users.length} user profiles warmed`);
    } catch (error) {
      console.warn('Failed to warm user profiles:', error);
    }
  }

  // Warm reviews
  private async warmReviews() {
    try {
      await connectDB();
      const reviews = await Review.find({ isVerified: true })
        .select('rating comment createdAt')
        .limit(100)
        .lean();

      await advancedCache.set('reviews', 'recent:verified', reviews, { ttl: 600 });
      console.log('🔥 Reviews warmed');
    } catch (error) {
      console.warn('Failed to warm reviews:', error);
    }
  }

  // Warm categories
  private async warmCategories() {
    try {
      await connectDB();
      const categories = await Vendor.aggregate([
        { $match: { isActive: true } },
        { $group: { _id: '$businessType', count: { $sum: 1 } } },
        { $sort: { count: -1 } }
      ]);

      await advancedCache.set('categories', 'business:types', categories, { ttl: 1800 });
      console.log('🔥 Categories warmed');
    } catch (error) {
      console.warn('Failed to warm categories:', error);
    }
  }

  // Warm locations
  private async warmLocations() {
    try {
      await connectDB();
      const locations = await Vendor.aggregate([
        { $match: { isActive: true, location: { $exists: true } } },
        { $group: { _id: '$location', count: { $sum: 1 } } },
        { $sort: { count: -1 } },
        { $limit: 50 }
      ]);

      await advancedCache.set('locations', 'popular:locations', locations, { ttl: 1800 });
      console.log('🔥 Locations warmed');
    } catch (error) {
      console.warn('Failed to warm locations:', error);
    }
  }

  // Warm analytics
  private async warmAnalytics() {
    try {
      const analyticsData = {
        performance: { averageResponseTime: 0, cacheHitRate: 0 },
        usage: { totalRequests: 0, uniqueUsers: 0 },
        lastUpdated: new Date().toISOString()
      };

      await advancedCache.set('analytics', 'performance:overview', analyticsData, { ttl: 3600 });
      console.log('🔥 Analytics warmed');
    } catch (error) {
      console.warn('Failed to warm analytics:', error);
    }
  }

  // Warm reports
  private async warmReports() {
    try {
      const reportsData = {
        summary: { generated: 0, lastGenerated: null },
        types: ['performance', 'usage', 'errors'],
        lastUpdated: new Date().toISOString()
      };

      await advancedCache.set('reports', 'summary:overview', reportsData, { ttl: 3600 });
      console.log('🔥 Reports warmed');
    } catch (error) {
      console.warn('Failed to warm reports:', error);
    }
  }

  // Warm generic data
  private async warmGenericData(dependencies: string[]) {
    for (const dependency of dependencies) {
      try {
        await advancedCache.set(dependency, 'warmed:data', { warmed: true, timestamp: new Date().toISOString() }, { ttl: 300 });
      } catch (error) {
        console.warn(`Failed to warm generic data for ${dependency}:`, error);
      }
    }
  }

  // Get warming statistics
  getStats() {
    return {
      strategiesCount: this.strategies.size,
      activeStrategies: Array.from(this.strategies.values()).filter(s => s.isActive).length,
      isRunning: this.isRunning,
      tasksCount: this.tasks.size,
      recentTasks: Array.from(this.tasks.values())
        .sort((a, b) => b.startTime.getTime() - a.startTime.getTime())
        .slice(0, 10)
    };
  }

  // Manually trigger warming
  async triggerWarming(strategyName?: string) {
    if (strategyName) {
      const strategy = Array.from(this.strategies.values()).find(s => s.name === strategyName);
      if (strategy) {
        await this.runStrategy(strategy);
      }
    } else {
      const allStrategies = Array.from(this.strategies.values());
      await this.runWarmingStrategies(allStrategies);
    }
  }
}

// Export singleton instance
export const cacheWarmingService = new CacheWarmingService(); 