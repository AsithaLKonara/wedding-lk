import UpstashRedisService from './upstash-redis';

// Performance monitoring for production
export class ProductionPerformanceMonitor {
  private static instance: ProductionPerformanceMonitor;
  private metrics: Map<string, any> = new Map();
  private startTime: number = Date.now();

  constructor() {
    this.initializeMetrics();
  }

  static getInstance(): ProductionPerformanceMonitor {
    if (!ProductionPerformanceMonitor.instance) {
      ProductionPerformanceMonitor.instance = new ProductionPerformanceMonitor();
    }
    return ProductionPerformanceMonitor.instance;
  }

  private initializeMetrics() {
    this.metrics.set('startTime', this.startTime);
    this.metrics.set('requests', {
      total: 0,
      successful: 0,
      failed: 0,
      byEndpoint: new Map()
    });
    this.metrics.set('responseTimes', {
      min: Infinity,
      max: 0,
      avg: 0,
      p95: 0,
      p99: 0,
      samples: []
    });
    this.metrics.set('cache', {
      hits: 0,
      misses: 0,
      hitRate: 0
    });
    this.metrics.set('database', {
      queries: 0,
      slowQueries: 0,
      avgQueryTime: 0
    });
    this.metrics.set('memory', {
      used: 0,
      total: 0,
      external: 0
    });
  }

  // Track API request performance
  trackRequest(endpoint: string, method: string, startTime: number, success: boolean) {
    const duration = Date.now() - startTime;
    
    // Update request counts
    const requests = this.metrics.get('requests');
    requests.total++;
    if (success) {
      requests.successful++;
    } else {
      requests.failed++;
    }

    // Track by endpoint
    const endpointKey = `${method} ${endpoint}`;
    if (!requests.byEndpoint.has(endpointKey)) {
      requests.byEndpoint.set(endpointKey, {
        count: 0,
        totalTime: 0,
        avgTime: 0,
        minTime: Infinity,
        maxTime: 0
      });
    }
    
    const endpointStats = requests.byEndpoint.get(endpointKey);
    endpointStats.count++;
    endpointStats.totalTime += duration;
    endpointStats.avgTime = endpointStats.totalTime / endpointStats.count;
    endpointStats.minTime = Math.min(endpointStats.minTime, duration);
    endpointStats.maxTime = Math.max(endpointStats.maxTime, duration);

    // Update response time metrics
    this.updateResponseTimeMetrics(duration);
  }

  // Track cache performance
  trackCache(hit: boolean) {
    const cache = this.metrics.get('cache');
    if (hit) {
      cache.hits++;
    } else {
      cache.misses++;
    }
    cache.hitRate = cache.hits / (cache.hits + cache.misses);
  }

  // Track database performance
  trackDatabaseQuery(duration: number, isSlow: boolean = false) {
    const db = this.metrics.get('database');
    db.queries++;
    if (isSlow) {
      db.slowQueries++;
    }
    
    // Update average query time
    db.avgQueryTime = ((db.avgQueryTime * (db.queries - 1)) + duration) / db.queries;
  }

  // Update memory usage
  updateMemoryUsage() {
    const memUsage = process.memoryUsage();
    const memory = this.metrics.get('memory');
    memory.used = memUsage.heapUsed;
    memory.total = memUsage.heapTotal;
    memory.external = memUsage.external;
  }

  // Update response time percentiles
  private updateResponseTimeMetrics(duration: number) {
    const responseTimes = this.metrics.get('responseTimes');
    responseTimes.samples.push(duration);
    
    // Keep only last 1000 samples for performance
    if (responseTimes.samples.length > 1000) {
      responseTimes.samples.shift();
    }
    
    // Update min/max
    responseTimes.min = Math.min(responseTimes.min, duration);
    responseTimes.max = Math.max(responseTimes.max, duration);
    
    // Calculate average
    responseTimes.avg = responseTimes.samples.reduce((a: number, b: number) => a + b, 0) / responseTimes.samples.length;
    
    // Calculate percentiles
    if (responseTimes.samples.length > 0) {
      const sorted = [...responseTimes.samples].sort((a: number, b: number) => a - b);
      responseTimes.p95 = sorted[Math.floor(sorted.length * 0.95)];
      responseTimes.p99 = sorted[Math.floor(sorted.length * 0.99)];
    }
  }

  // Get comprehensive metrics
  getMetrics() {
    this.updateMemoryUsage();
    
    const uptime = Date.now() - this.startTime;
    const requests = this.metrics.get('requests');
    const responseTimes = this.metrics.get('responseTimes');
    const cache = this.metrics.get('cache');
    const database = this.metrics.get('database');
    const memory = this.metrics.get('memory');

    return {
      uptime: {
        total: uptime,
        formatted: this.formatUptime(uptime)
      },
      requests: {
        total: requests.total,
        successful: requests.successful,
        failed: requests.failed,
        successRate: requests.total > 0 ? (requests.successful / requests.total) * 100 : 0,
        byEndpoint: Object.fromEntries(requests.byEndpoint)
      },
      responseTimes: {
        min: responseTimes.min === Infinity ? 0 : responseTimes.min,
        max: responseTimes.max,
        avg: responseTimes.avg,
        p95: responseTimes.p95,
        p99: responseTimes.p99,
        samples: responseTimes.samples.length
      },
      cache: {
        hits: cache.hits,
        misses: cache.misses,
        hitRate: cache.hitRate * 100
      },
      database: {
        queries: database.queries,
        slowQueries: database.slowQueries,
        avgQueryTime: database.avgQueryTime,
        slowQueryRate: database.queries > 0 ? (database.slowQueries / database.queries) * 100 : 0
      },
      memory: {
        used: this.formatBytes(memory.used),
        total: this.formatBytes(memory.total),
        external: this.formatBytes(memory.external),
        usagePercent: (memory.used / memory.total) * 100
      },
      system: {
        nodeVersion: process.version,
        platform: process.platform,
        arch: process.arch,
        pid: process.pid,
        uptime: process.uptime()
      }
    };
  }

  // Get performance summary
  getPerformanceSummary() {
    const metrics = this.getMetrics();
    
    return {
      status: this.getPerformanceStatus(metrics),
      recommendations: this.getRecommendations(metrics),
      alerts: this.getAlerts(metrics)
    };
  }

  // Determine performance status
  private getPerformanceStatus(metrics: any): string {
    const { responseTimes, cache, database, memory } = metrics;
    
    if (responseTimes.p95 > 5000 || cache.hitRate < 50 || memory.usagePercent > 90) {
      return 'critical';
    } else if (responseTimes.p95 > 2000 || cache.hitRate < 70 || memory.usagePercent > 80) {
      return 'warning';
    } else if (responseTimes.p95 > 1000 || cache.hitRate < 80) {
      return 'degraded';
    } else {
      return 'healthy';
    }
  }

  // Get performance recommendations
  private getRecommendations(metrics: any): string[] {
    const recommendations: string[] = [];
    const { responseTimes, cache, database, memory } = metrics;
    
    if (responseTimes.p95 > 2000) {
      recommendations.push('Consider implementing response caching for slow endpoints');
      recommendations.push('Review database query performance and add indexes if needed');
    }
    
    if (cache.hitRate < 70) {
      recommendations.push('Increase cache TTL for frequently accessed data');
      recommendations.push('Implement cache warming strategies');
    }
    
    if (database.slowQueryRate > 10) {
      recommendations.push('Review and optimize slow database queries');
      recommendations.push('Add database indexes for frequently queried fields');
    }
    
    if (memory.usagePercent > 80) {
      recommendations.push('Monitor memory usage and consider increasing container limits');
      recommendations.push('Review memory leaks in long-running processes');
    }
    
    return recommendations;
  }

  // Get performance alerts
  private getAlerts(metrics: any): any[] {
    const alerts: any[] = [];
    const { responseTimes, cache, database, memory } = metrics;
    
    if (responseTimes.p95 > 10000) {
      alerts.push({
        level: 'critical',
        message: `P95 response time is ${responseTimes.p95}ms - immediate attention required`,
        metric: 'responseTime',
        value: responseTimes.p95
      });
    }
    
    if (cache.hitRate < 50) {
      alerts.push({
        level: 'warning',
        message: `Cache hit rate is ${cache.hitRate.toFixed(1)}% - performance degradation likely`,
        metric: 'cacheHitRate',
        value: cache.hitRate
      });
    }
    
    if (memory.usagePercent > 90) {
      alerts.push({
        level: 'critical',
        message: `Memory usage is ${memory.usagePercent.toFixed(1)}% - potential OOM risk`,
        metric: 'memoryUsage',
        value: memory.usagePercent
      });
    }
    
    return alerts;
  }

  // Format uptime
  private formatUptime(ms: number): string {
    const seconds = Math.floor(ms / 1000);
    const minutes = Math.floor(seconds / 60);
    const hours = Math.floor(minutes / 60);
    const days = Math.floor(hours / 24);
    
    if (days > 0) return `${days}d ${hours % 24}h ${minutes % 60}m`;
    if (hours > 0) return `${hours}h ${minutes % 60}m`;
    if (minutes > 0) return `${minutes}m ${seconds % 60}s`;
    return `${seconds}s`;
  }

  // Format bytes
  private formatBytes(bytes: number): string {
    if (bytes === 0) return '0 B';
    const k = 1024;
    const sizes = ['B', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
  }

  // Reset metrics
  reset() {
    this.initializeMetrics();
            // Performance metrics reset
  }

  // Export metrics for Prometheus
  getPrometheusMetrics(): string {
    const metrics = this.getMetrics();
    let prometheus = '';
    
    // Add custom metrics
    prometheus += `# HELP weddinglk_requests_total Total number of requests\n`;
    prometheus += `# TYPE weddinglk_requests_total counter\n`;
    prometheus += `weddinglk_requests_total{status="total"} ${metrics.requests.total}\n`;
    prometheus += `weddinglk_requests_total{status="successful"} ${metrics.requests.successful}\n`;
    prometheus += `weddinglk_requests_total{status="failed"} ${metrics.requests.failed}\n`;
    
    prometheus += `# HELP weddinglk_response_time_seconds Response time in seconds\n`;
    prometheus += `# TYPE weddinglk_response_time_seconds histogram\n`;
    prometheus += `weddinglk_response_time_seconds{quantile="0.5"} ${metrics.responseTimes.avg / 1000}\n`;
    prometheus += `weddinglk_response_time_seconds{quantile="0.95"} ${metrics.responseTimes.p95 / 1000}\n`;
    prometheus += `weddinglk_response_time_seconds{quantile="0.99"} ${metrics.responseTimes.p99 / 1000}\n`;
    
    prometheus += `# HELP weddinglk_cache_hit_rate Cache hit rate percentage\n`;
    prometheus += `# TYPE weddinglk_cache_hit_rate gauge\n`;
    prometheus += `weddinglk_cache_hit_rate ${metrics.cache.hitRate}\n`;
    
    return prometheus;
  }
}

// Export singleton instance
export const performanceMonitor = ProductionPerformanceMonitor.getInstance();

// Export for use in other modules
export default performanceMonitor; 