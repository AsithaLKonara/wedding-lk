// Database Connection Pool Manager for WeddingLK
// Provides intelligent connection pooling and monitoring

import mongoose from 'mongoose';

export interface PoolStats {
  totalConnections: number;
  activeConnections: number;
  idleConnections: number;
  pendingConnections: number;
  maxConnections: number;
  minConnections: number;
  connectionUtilization: number;
  averageResponseTime: number;
}

export interface PoolConfig {
  maxPoolSize: number;
  minPoolSize: number;
  maxIdleTimeMS: number;
  serverSelectionTimeoutMS: number;
  socketTimeoutMS: number;
  connectTimeoutMS: number;
  heartbeatFrequencyMS: number;
  maxConnecting: number;
}

export class DatabasePoolManager {
  private static instance: DatabasePoolManager;
  private poolStats: PoolStats;
  private responseTimes: number[] = [];
  private maxResponseTimeHistory = 100;

  private defaultConfig: PoolConfig = {
    maxPoolSize: 20,
    minPoolSize: 5,
    maxIdleTimeMS: 60000,
    serverSelectionTimeoutMS: 10000,
    socketTimeoutMS: 60000,
    connectTimeoutMS: 15000,
    heartbeatFrequencyMS: 10000,
    maxConnecting: 5,
  };

  private constructor() {
    this.poolStats = {
      totalConnections: 0,
      activeConnections: 0,
      idleConnections: 0,
      pendingConnections: 0,
      maxConnections: this.defaultConfig.maxPoolSize,
      minConnections: this.defaultConfig.minPoolSize,
      connectionUtilization: 0,
      averageResponseTime: 0,
    };

    this.setupEventListeners();
  }

  public static getInstance(): DatabasePoolManager {
    if (!DatabasePoolManager.instance) {
      DatabasePoolManager.instance = new DatabasePoolManager();
    }
    return DatabasePoolManager.instance;
  }

  // Configure connection pool
  public configurePool(config: Partial<PoolConfig>): void {
    const finalConfig = { ...this.defaultConfig, ...config };
    
    // Update mongoose connection options - only use valid options
    // Note: These options are set in the connection string, not via mongoose.set
    
    this.poolStats.maxConnections = finalConfig.maxPoolSize;
    this.poolStats.minConnections = finalConfig.minPoolSize;

    console.log('🔧 Database pool configured:', finalConfig);
  }

  // Setup event listeners for monitoring
  private setupEventListeners(): void {
    // #region agent log
    fetch('http://127.0.0.1:7242/ingest/ac6188d0-f3a1-4899-9380-8b8e4db474a8',{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify({location:'db-pool-manager.ts:81',message:'setupEventListeners entry',data:{connectedListeners:mongoose.connection.listenerCount('connected')},timestamp:Date.now(),sessionId:'debug-session',runId:'run1',hypothesisId:'A'})}).catch(()=>{});
    // #endregion
    mongoose.connection.on('connected', () => {
      // #region agent log
      fetch('http://127.0.0.1:7242/ingest/ac6188d0-f3a1-4899-9380-8b8e4db474a8',{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify({location:'db-pool-manager.ts:83',message:'pool manager connected event',data:{listenerCount:mongoose.connection.listenerCount('connected')},timestamp:Date.now(),sessionId:'debug-session',runId:'run1',hypothesisId:'A'})}).catch(()=>{});
      // #endregion
      this.updatePoolStats();
      console.log('✅ Database connected - Pool stats updated');
    });

    mongoose.connection.on('disconnected', () => {
      // #region agent log
      fetch('http://127.0.0.1:7242/ingest/ac6188d0-f3a1-4899-9380-8b8e4db474a8',{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify({location:'db-pool-manager.ts:88',message:'pool manager disconnected event',data:{readyState:mongoose.connection.readyState},timestamp:Date.now(),sessionId:'debug-session',runId:'run1',hypothesisId:'A'})}).catch(()=>{});
      // #endregion
      this.updatePoolStats();
      console.log('⚠️ Database disconnected - Pool stats updated');
    });

    mongoose.connection.on('error', (error) => {
      // #region agent log
      fetch('http://127.0.0.1:7242/ingest/ac6188d0-f3a1-4899-9380-8b8e4db474a8',{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify({location:'db-pool-manager.ts:93',message:'pool manager error event',data:{error:error.message},timestamp:Date.now(),sessionId:'debug-session',runId:'run1',hypothesisId:'A'})}).catch(()=>{});
      // #endregion
      console.error('❌ Database connection error:', error);
      this.updatePoolStats();
    });

    // Monitor pool events
    mongoose.connection.on('connectionCreated', () => {
      this.updatePoolStats();
    });

    mongoose.connection.on('connectionClosed', () => {
      this.updatePoolStats();
    });

    mongoose.connection.on('connectionPoolCreated', () => {
      this.updatePoolStats();
    });

    mongoose.connection.on('connectionPoolClosed', () => {
      this.updatePoolStats();
    });
    // #region agent log
    fetch('http://127.0.0.1:7242/ingest/ac6188d0-f3a1-4899-9380-8b8e4db474a8',{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify({location:'db-pool-manager.ts:113',message:'setupEventListeners exit',data:{connectedListeners:mongoose.connection.listenerCount('connected')},timestamp:Date.now(),sessionId:'debug-session',runId:'run1',hypothesisId:'A'})}).catch(()=>{});
    // #endregion
  }

  // Update pool statistics
  private updatePoolStats(): void {
    try {
      const pool = (mongoose.connection as any).pool;
      if (pool) {
        this.poolStats.totalConnections = pool.size();
        this.poolStats.activeConnections = pool.size() - pool.available();
        this.poolStats.idleConnections = pool.available();
        this.poolStats.pendingConnections = pool.pending();
        this.poolStats.connectionUtilization = (this.poolStats.activeConnections / this.poolStats.maxConnections) * 100;
      }
    } catch (error) {
      console.warn('Failed to update pool stats:', error);
    }
  }

  // Get current pool statistics
  public getPoolStats(): PoolStats {
    this.updatePoolStats();
    return { ...this.poolStats };
  }

  // Record response time for monitoring
  public recordResponseTime(responseTime: number): void {
    this.responseTimes.push(responseTime);
    
    // Keep only the last N response times
    if (this.responseTimes.length > this.maxResponseTimeHistory) {
      this.responseTimes.shift();
    }
    
    // Calculate average response time
    this.poolStats.averageResponseTime = this.responseTimes.reduce((a, b) => a + b, 0) / this.responseTimes.length;
  }

  // Get performance metrics
  public getPerformanceMetrics(): {
    averageResponseTime: number;
    responseTimeHistory: number[];
    poolUtilization: number;
    connectionEfficiency: number;
  } {
    return {
      averageResponseTime: this.poolStats.averageResponseTime,
      responseTimeHistory: [...this.responseTimes],
      poolUtilization: this.poolStats.connectionUtilization,
      connectionEfficiency: this.poolStats.idleConnections / this.poolStats.maxConnections,
    };
  }

  // Health check for the pool
  public async healthCheck(): Promise<{
    isHealthy: boolean;
    issues: string[];
    recommendations: string[];
  }> {
    const issues: string[] = [];
    const recommendations: string[] = [];

    // Check connection status
    if (mongoose.connection.readyState !== 1) {
      issues.push('Database connection is not ready');
      recommendations.push('Check database connectivity and credentials');
    }

    // Check pool utilization
    if (this.poolStats.connectionUtilization > 80) {
      issues.push('High pool utilization detected');
      recommendations.push('Consider increasing maxPoolSize or optimizing queries');
    }

    // Check response times
    if (this.poolStats.averageResponseTime > 1000) {
      issues.push('High average response time detected');
      recommendations.push('Optimize database queries and indexes');
    }

    // Check idle connections
    if (this.poolStats.idleConnections < this.poolStats.minConnections) {
      issues.push('Insufficient idle connections');
      recommendations.push('Consider increasing minPoolSize');
    }

    return {
      isHealthy: issues.length === 0,
      issues,
      recommendations,
    };
  }

  // Optimize pool based on current usage
  public async optimizePool(): Promise<void> {
    const stats = this.getPoolStats();
    const performance = this.getPerformanceMetrics();

    // Auto-adjust pool size based on utilization
    if (stats.connectionUtilization > 85 && stats.maxConnections < 50) {
      const newMaxSize = Math.min(stats.maxConnections + 5, 50);
      this.configurePool({ maxPoolSize: newMaxSize });
      console.log(`🔧 Auto-increased pool size to ${newMaxSize} due to high utilization`);
    }

    // Auto-adjust pool size if underutilized
    if (stats.connectionUtilization < 30 && stats.maxConnections > 10) {
      const newMaxSize = Math.max(stats.maxConnections - 2, 10);
      this.configurePool({ maxPoolSize: newMaxSize });
      console.log(`🔧 Auto-decreased pool size to ${newMaxSize} due to low utilization`);
    }

    // Log optimization recommendations
    if (performance.averageResponseTime > 2000) {
      console.log('💡 Performance recommendation: Consider adding database indexes');
    }

    if (stats.pendingConnections > 5) {
      console.log('💡 Performance recommendation: Consider increasing maxConnecting');
    }
  }

  // Get detailed pool information
  public getDetailedPoolInfo() {
    return {
      config: { ...this.defaultConfig },
      stats: this.getPoolStats(),
      performance: this.getPerformanceMetrics(),
      health: this.healthCheck(),
    };
  }

  // Reset pool statistics
  public resetStats(): void {
    this.responseTimes = [];
    this.poolStats.averageResponseTime = 0;
    console.log('📊 Pool statistics reset');
  }

  // Close all connections gracefully
  public async closePool(): Promise<void> {
    // #region agent log
    fetch('http://127.0.0.1:7242/ingest/ac6188d0-f3a1-4899-9380-8b8e4db474a8',{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify({location:'db-pool-manager.ts:267',message:'closePool entry',data:{readyState:mongoose.connection.readyState,listenerCount:mongoose.connection.listenerCount('connected')},timestamp:Date.now(),sessionId:'debug-session',runId:'run1',hypothesisId:'B'})}).catch(()=>{});
    // #endregion
    try {
      await mongoose.connection.close();
      // #region agent log
      fetch('http://127.0.0.1:7242/ingest/ac6188d0-f3a1-4899-9380-8b8e4db474a8',{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify({location:'db-pool-manager.ts:270',message:'After closePool close',data:{readyState:mongoose.connection.readyState,listenerCount:mongoose.connection.listenerCount('connected')},timestamp:Date.now(),sessionId:'debug-session',runId:'run1',hypothesisId:'A'})}).catch(()=>{});
      // #endregion
      console.log('🔒 Database pool closed gracefully');
    } catch (error) {
      // #region agent log
      fetch('http://127.0.0.1:7242/ingest/ac6188d0-f3a1-4899-9380-8b8e4db474a8',{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify({location:'db-pool-manager.ts:273',message:'closePool error',data:{error:error.message},timestamp:Date.now(),sessionId:'debug-session',runId:'run1',hypothesisId:'B'})}).catch(()=>{});
      // #endregion
      console.error('Error closing database pool:', error);
    }
  }
}

// Export singleton instance
export const dbPoolManager = DatabasePoolManager.getInstance(); 