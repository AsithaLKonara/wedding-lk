// Database Index Optimizer for WeddingLK
// Analyzes and creates optimal indexes for slow queries

import { connectDB } from './db';
import { User, Vendor, Venue, Booking, Review, Task, Conversation } from './models';

export interface IndexDefinition {
  collection: string;
  fields: { [key: string]: 1 | -1 };
  options?: {
    unique?: boolean;
    sparse?: boolean;
    background?: boolean;
    name?: string;
  };
}

export interface QueryAnalysis {
  query: string;
  collection: string;
  executionTime: number;
  documentsExamined: number;
  documentsReturned: number;
  indexUsed?: string;
  recommendation: string;
  priority: 'high' | 'medium' | 'low';
}

export interface IndexPerformance {
  name: string;
  collection: string;
  size: number;
  usage: {
    ops: number;
    since: Date;
  };
  efficiency: number;
}

export class DatabaseIndexOptimizer {
  private indexDefinitions: IndexDefinition[] = [];
  private queryAnalyses: QueryAnalysis[] = [];

  constructor() {
    this.setupDefaultIndexes();
  }

  // Setup default indexes for common queries
  private setupDefaultIndexes() {
    // User indexes
    this.addIndexDefinition('users', { email: 1 }, { unique: true, name: 'idx_users_email_unique' });
    this.addIndexDefinition('users', { role: 1, isActive: 1 }, { name: 'idx_users_role_active' });
    this.addIndexDefinition('users', { createdAt: -1 }, { name: 'idx_users_created_desc' });

    // Vendor indexes
    this.addIndexDefinition('vendors', { businessType: 1, isActive: 1 }, { name: 'idx_vendors_type_active' });
    this.addIndexDefinition('vendors', { rating: -1, totalReviews: -1 }, { name: 'idx_vendors_rating_reviews' });
    this.addIndexDefinition('vendors', { location: 1 }, { name: 'idx_vendors_location' });
    this.addIndexDefinition('vendors', { isVerified: 1, isActive: 1 }, { name: 'idx_vendors_verified_active' });

    // Venue indexes
    this.addIndexDefinition('venues', { type: 1, isActive: 1 }, { name: 'idx_venues_type_active' });
    this.addIndexDefinition('venues', { capacity: 1 }, { name: 'idx_venues_capacity' });
    this.addIndexDefinition('venues', { location: 1 }, { name: 'idx_venues_location' });
    this.addIndexDefinition('venues', { featured: 1, isActive: 1 }, { name: 'idx_venues_featured_active' });

    // Booking indexes
    this.addIndexDefinition('bookings', { userId: 1, status: 1 }, { name: 'idx_bookings_user_status' });
    this.addIndexDefinition('bookings', { vendorId: 1, status: 1 }, { name: 'idx_bookings_vendor_status' });
    this.addIndexDefinition('bookings', { venueId: 1, status: 1 }, { name: 'idx_bookings_venue_status' });
    this.addIndexDefinition('bookings', { date: 1, status: 1 }, { name: 'idx_bookings_date_status' });
    this.addIndexDefinition('bookings', { createdAt: -1 }, { name: 'idx_bookings_created_desc' });

    // Review indexes
    this.addIndexDefinition('reviews', { vendorId: 1, isVerified: 1 }, { name: 'idx_reviews_vendor_verified' });
    this.addIndexDefinition('reviews', { venueId: 1, isVerified: 1 }, { name: 'idx_reviews_venue_verified' });
    this.addIndexDefinition('reviews', { rating: -1, createdAt: -1 }, { name: 'idx_reviews_rating_created' });
    this.addIndexDefinition('reviews', { userId: 1, createdAt: -1 }, { name: 'idx_reviews_user_created' });

    // Task indexes
    this.addIndexDefinition('tasks', { userId: 1, status: 1 }, { name: 'idx_tasks_user_status' });
    this.addIndexDefinition('tasks', { dueDate: 1, priority: 1 }, { name: 'idx_tasks_due_priority' });
    this.addIndexDefinition('tasks', { category: 1, status: 1 }, { name: 'idx_tasks_category_status' });

    // Conversation indexes
    this.addIndexDefinition('conversations', { participants: 1, lastMessageAt: -1 }, { name: 'idx_conversations_participants_last' });
    this.addIndexDefinition('conversations', { bookingId: 1 }, { name: 'idx_conversations_booking' });

    console.log('📊 Default indexes configured');
  }

  // Add index definition
  addIndexDefinition(collection: string, fields: { [key: string]: 1 | -1 }, options: any = {}) {
    this.indexDefinitions.push({
      collection,
      fields,
      options: {
        background: true,
        ...options
      }
    });
  }

  // Create all configured indexes
  async createIndexes() {
    console.log('🔧 Creating database indexes...');
    
    try {
      await connectDB();
      
      for (const indexDef of this.indexDefinitions) {
        await this.createIndex(indexDef);
      }
      
      console.log('✅ All indexes created successfully');
    } catch (error) {
      console.error('❌ Failed to create indexes:', error);
    }
  }

  // Create individual index
  private async createIndex(indexDef: IndexDefinition) {
    try {
      const collection = this.getCollection(indexDef.collection);
      if (!collection) {
        console.warn(`⚠️ Collection not found: ${indexDef.collection}`);
        return;
      }

      const indexName = indexDef.options?.name || this.generateIndexName(indexDef);
      
      // Check if index already exists
      const existingIndexes = await collection.listIndexes().toArray();
      const indexExists = existingIndexes.some((idx: any) => idx.name === indexName);
      
      if (indexExists) {
        console.log(`📋 Index already exists: ${indexName}`);
        return;
      }

      // Create index
      await collection.createIndex(indexDef.fields, indexDef.options);
      console.log(`✅ Created index: ${indexName}`);
      
    } catch (error) {
      console.error(`❌ Failed to create index for ${indexDef.collection}:`, error);
    }
  }

  // Get collection by name
  private getCollection(collectionName: string) {
    const collections: { [key: string]: any } = {
      'users': User,
      'vendors': Vendor,
      'venues': Venue,
      'bookings': Booking,
      'reviews': Review,
      'tasks': Task,
      'conversations': Conversation
    };
    
    return collections[collectionName];
  }

  // Generate index name
  private generateIndexName(indexDef: IndexDefinition): string {
    const fields = Object.keys(indexDef.fields).join('_');
    const direction = Object.values(indexDef.fields).join('');
    return `idx_${indexDef.collection}_${fields}_${direction}`;
  }

  // Analyze query performance
  async analyzeQueryPerformance() {
    console.log('📊 Analyzing query performance...');
    
    try {
      await connectDB();
      
      // Analyze common queries
      await this.analyzeUserQueries();
      await this.analyzeVendorQueries();
      await this.analyzeVenueQueries();
      await this.analyzeBookingQueries();
      await this.analyzeReviewQueries();
      
      console.log(`📊 Query analysis completed: ${this.queryAnalyses.length} queries analyzed`);
      
      // Generate recommendations
      const recommendations = this.generateRecommendations();
      console.log('💡 Index optimization recommendations:', recommendations);
      
    } catch (error) {
      console.error('❌ Failed to analyze query performance:', error);
    }
  }

  // Analyze user queries
  private async analyzeUserQueries() {
    try {
      const startTime = Date.now();
      
      // Test user search query
      const userQuery = await User.find({ role: 'user', isActive: true })
        .select('name email role lastActive')
        .limit(100)
        .explain('executionStats');
      
      const executionTime = Date.now() - startTime;
      
      this.queryAnalyses.push({
        query: 'User search by role and status',
        collection: 'users',
        executionTime,
        documentsExamined: userQuery[0]?.executionStats?.totalDocsExamined || 0,
        documentsReturned: userQuery[0]?.executionStats?.nReturned || 0,
        indexUsed: userQuery[0]?.queryPlanner?.winningPlan?.inputStage?.indexName,
        recommendation: this.getRecommendation(userQuery[0]?.executionStats || {}),
        priority: this.getPriority(userQuery[0]?.executionStats || {})
      });
      
    } catch (error) {
      console.warn('Failed to analyze user queries:', error);
    }
  }

  // Analyze vendor queries
  private async analyzeVendorQueries() {
    try {
      const startTime = Date.now();
      
      // Test vendor search query
      const vendorQuery = await Vendor.find({ businessType: 'catering', isActive: true, rating: { $gte: 4 } })
        .select('businessName businessType rating totalReviews')
        .sort({ rating: -1, totalReviews: -1 })
        .limit(50)
        .explain('executionStats');
      
      const executionTime = Date.now() - startTime;
      
      this.queryAnalyses.push({
        query: 'Vendor search by type, status, and rating',
        collection: 'vendors',
        executionTime,
        documentsExamined: vendorQuery[0]?.executionStats?.totalDocsExamined || 0,
        documentsReturned: vendorQuery[0]?.executionStats?.nReturned || 0,
        indexUsed: vendorQuery[0]?.queryPlanner?.winningPlan?.inputStage?.indexName,
        recommendation: this.getRecommendation(vendorQuery[0]?.executionStats || {}),
        priority: this.getPriority(vendorQuery[0]?.executionStats || {})
      });
      
    } catch (error) {
      console.warn('Failed to analyze vendor queries:', error);
    }
  }

  // Analyze venue queries
  private async analyzeVenueQueries() {
    try {
      const startTime = Date.now();
      
      // Test venue search query
      const venueQuery = await Venue.find({ type: 'outdoor', capacity: { $gte: 100 }, isActive: true })
        .select('name type capacity rating')
        .sort({ capacity: 1, rating: -1 })
        .limit(50)
        .explain('executionStats');
      
      const executionTime = Date.now() - startTime;
      
      this.queryAnalyses.push({
        query: 'Venue search by type, capacity, and status',
        collection: 'venues',
        executionTime,
        documentsExamined: venueQuery[0]?.executionStats?.totalDocsExamined || 0,
        documentsReturned: venueQuery[0]?.executionStats?.nReturned || 0,
        indexUsed: venueQuery[0]?.queryPlanner?.winningPlan?.inputStage?.indexName,
        recommendation: this.getRecommendation(venueQuery[0]?.executionStats || {}),
        priority: this.getPriority(venueQuery[0]?.executionStats || {})
      });
      
    } catch (error) {
      console.warn('Failed to analyze venue queries:', error);
    }
  }

  // Analyze booking queries
  private async analyzeBookingQueries() {
    try {
      const startTime = Date.now();
      
      // Test booking search query
      const bookingQuery = await Booking.find({ status: 'confirmed', date: { $gte: new Date() } })
        .select('userId vendorId venueId date status')
        .sort({ date: 1, createdAt: -1 })
        .limit(100)
        .explain('executionStats');
      
      const executionTime = Date.now() - startTime;
      
      this.queryAnalyses.push({
        query: 'Booking search by status and date',
        collection: 'bookings',
        executionTime,
        documentsExamined: bookingQuery[0]?.executionStats?.totalDocsExamined || 0,
        documentsReturned: bookingQuery[0]?.executionStats?.nReturned || 0,
        indexUsed: bookingQuery[0]?.queryPlanner?.winningPlan?.inputStage?.indexName,
        recommendation: this.getRecommendation(bookingQuery[0]?.executionStats || {}),
        priority: this.getPriority(bookingQuery[0]?.executionStats || {})
      });
      
    } catch (error) {
      console.warn('Failed to analyze booking queries:', error);
    }
  }

  // Analyze review queries
  private async analyzeReviewQueries() {
    try {
      const startTime = Date.now();
      
      // Test review search query
      const reviewQuery = await Review.find({ isVerified: true, rating: { $gte: 4 } })
        .select('rating comment createdAt')
        .sort({ rating: -1, createdAt: -1 })
        .limit(100)
        .explain('executionStats');
      
      const executionTime = Date.now() - startTime;
      
      this.queryAnalyses.push({
        query: 'Review search by verification and rating',
        collection: 'reviews',
        executionTime,
        documentsExamined: reviewQuery[0]?.executionStats?.totalDocsExamined || 0,
        documentsReturned: reviewQuery[0]?.executionStats?.nReturned || 0,
        indexUsed: reviewQuery[0]?.queryPlanner?.winningPlan?.inputStage?.indexName,
        recommendation: this.getRecommendation(reviewQuery[0]?.executionStats || {}),
        priority: this.getPriority(reviewQuery[0]?.executionStats || {})
      });
      
    } catch (error) {
      console.warn('Failed to analyze review queries:', error);
    }
  }

  // Get recommendation based on execution stats
  private getRecommendation(stats: any): string {
    const examinedRatio = stats.totalDocsExamined / Math.max(stats.nReturned, 1);
    
    if (examinedRatio > 10) {
      return 'High document examination ratio - consider compound index';
    } else if (examinedRatio > 5) {
      return 'Medium document examination ratio - consider single field index';
    } else {
      return 'Good performance - no index optimization needed';
    }
  }

  // Get priority based on execution stats
  private getPriority(stats: any): 'high' | 'medium' | 'low' {
    const examinedRatio = stats.totalDocsExamined / Math.max(stats.nReturned, 1);
    
    if (examinedRatio > 10) return 'high';
    if (examinedRatio > 5) return 'medium';
    return 'low';
  }

  // Generate index recommendations
  private generateRecommendations() {
    const highPriorityQueries = this.queryAnalyses.filter(q => q.priority === 'high');
    const mediumPriorityQueries = this.queryAnalyses.filter(q => q.priority === 'medium');
    
    const recommendations = [];
    
    if (highPriorityQueries.length > 0) {
      recommendations.push(`🚨 ${highPriorityQueries.length} high-priority optimizations needed`);
    }
    
    if (mediumPriorityQueries.length > 0) {
      recommendations.push(`⚠️ ${mediumPriorityQueries.length} medium-priority optimizations recommended`);
    }
    
    if (recommendations.length === 0) {
      recommendations.push('✅ All queries performing well - no optimizations needed');
    }
    
    return recommendations;
  }

  // Get index performance statistics
  async getIndexPerformance(): Promise<IndexPerformance[]> {
    try {
      await connectDB();
      
      const collections = ['users', 'vendors', 'venues', 'bookings', 'reviews'];
      const performance: IndexPerformance[] = [];
      
      for (const collectionName of collections) {
        const collection = this.getCollection(collectionName);
        if (!collection) continue;
        
        const indexes = await collection.listIndexes().toArray();
        
        for (const index of indexes) {
          if (index.name === '_id_') continue; // Skip default _id index
          
          performance.push({
            name: index.name,
            collection: collectionName,
            size: index.size || 0,
            usage: {
              ops: index.usage?.ops || 0,
              since: index.usage?.since || new Date()
            },
            efficiency: this.calculateIndexEfficiency(index)
          });
        }
      }
      
      return performance;
      
    } catch (error) {
      console.error('Failed to get index performance:', error);
      return [];
    }
  }

  // Calculate index efficiency
  private calculateIndexEfficiency(index: any): number {
    // Simple efficiency calculation based on usage and size
    const usageScore = Math.min(index.usage?.ops || 0, 1000) / 1000;
    const sizeScore = Math.max(0, 1 - (index.size || 0) / 1000000);
    
    return (usageScore + sizeScore) / 2;
  }

  // Get optimization statistics
  getOptimizationStats() {
    return {
      totalIndexes: this.indexDefinitions.length,
      queriesAnalyzed: this.queryAnalyses.length,
      highPriorityIssues: this.queryAnalyses.filter(q => q.priority === 'high').length,
      mediumPriorityIssues: this.queryAnalyses.filter(q => q.priority === 'medium').length,
      lowPriorityIssues: this.queryAnalyses.filter(q => q.priority === 'low').length,
      recommendations: this.generateRecommendations()
    };
  }

  // Run full optimization
  async runFullOptimization() {
    console.log('🚀 Starting full database optimization...');
    
    try {
      // Create indexes
      await this.createIndexes();
      
      // Analyze performance
      await this.analyzeQueryPerformance();
      
      // Get performance stats
      const indexPerformance = await this.getIndexPerformance();
      
      console.log('✅ Full optimization completed');
      
      return {
        indexesCreated: this.indexDefinitions.length,
        queriesAnalyzed: this.queryAnalyses.length,
        indexPerformance,
        recommendations: this.generateRecommendations()
      };
      
    } catch (error) {
      console.error('❌ Full optimization failed:', error);
      throw error;
    }
  }
}

// Export singleton instance
export const databaseIndexOptimizer = new DatabaseIndexOptimizer(); 