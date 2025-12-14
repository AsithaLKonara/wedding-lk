import { NextRequest } from 'next/server';

// Monitoring metrics interface
export interface MonitoringMetrics {
  timestamp: Date;
  endpoint: string;
  method: string;
  statusCode: number;
  responseTime: number;
  userAgent?: string;
  ip?: string;
  userId?: string;
  error?: string;
}

// Performance metrics
export interface PerformanceMetrics {
  timestamp: Date;
  cpuUsage: number;
  memoryUsage: number;
  activeConnections: number;
  requestCount: number;
  errorCount: number;
  averageResponseTime: number;
}

// Business metrics
export interface BusinessMetrics {
  timestamp: Date;
  totalUsers: number;
  activeUsers: number;
  totalBookings: number;
  totalRevenue: number;
  conversionRate: number;
  averageBookingValue: number;
}

// Monitoring service
export class MonitoringService {
  private metrics: MonitoringMetrics[] = [];
  private performanceMetrics: PerformanceMetrics[] = [];
  private businessMetrics: BusinessMetrics[] = [];
  private maxMetricsHistory = 1000; // Keep last 1000 metrics

  // Log API request
  logRequest(request: NextRequest, responseTime: number, statusCode: number, error?: string) {
    const metric: MonitoringMetrics = {
      timestamp: new Date(),
      endpoint: request.nextUrl.pathname,
      method: request.method,
      statusCode,
      responseTime,
      userAgent: request.headers.get('user-agent') || undefined,
      ip: request.headers.get('x-forwarded-for') || request.headers.get('x-real-ip') || undefined,
      userId: request.headers.get('x-user-id') || undefined,
      error
    };

    this.metrics.push(metric);
    
    // Keep only recent metrics
    if (this.metrics.length > this.maxMetricsHistory) {
      this.metrics = this.metrics.slice(-this.maxMetricsHistory);
    }
  }

  // Get API metrics
  getApiMetrics(timeRange?: { start: Date; end: Date }) {
    let filteredMetrics = this.metrics;
    
    if (timeRange) {
      filteredMetrics = this.metrics.filter(m => 
        m.timestamp >= timeRange.start && m.timestamp <= timeRange.end
      );
    }

    const totalRequests = filteredMetrics.length;
    const errorCount = filteredMetrics.filter(m => m.statusCode >= 400).length;
    const successRate = totalRequests > 0 ? ((totalRequests - errorCount) / totalRequests) * 100 : 0;
    const averageResponseTime = totalRequests > 0 ? 
      filteredMetrics.reduce((sum, m) => sum + m.responseTime, 0) / totalRequests : 0;

    // Group by endpoint
    const endpointStats = filteredMetrics.reduce((acc, metric) => {
      const key = `${metric.method} ${metric.endpoint}`;
      if (!acc[key]) {
        acc[key] = {
          endpoint: metric.endpoint,
          method: metric.method,
          count: 0,
          errors: 0,
          totalResponseTime: 0,
          averageResponseTime: 0
        };
      }
      acc[key].count++;
      acc[key].totalResponseTime += metric.responseTime;
      if (metric.statusCode >= 400) {
        acc[key].errors++;
      }
      acc[key].averageResponseTime = acc[key].totalResponseTime / acc[key].count;
      return acc;
    }, {} as Record<string, any>);

    // Status code distribution
    const statusCodeDistribution = filteredMetrics.reduce((acc, metric) => {
      const status = Math.floor(metric.statusCode / 100) * 100; // Group by hundreds
      acc[status] = (acc[status] || 0) + 1;
      return acc;
    }, {} as Record<number, number>);

    return {
      totalRequests,
      errorCount,
      successRate: Math.round(successRate * 100) / 100,
      averageResponseTime: Math.round(averageResponseTime * 100) / 100,
      endpointStats: Object.values(endpointStats),
      statusCodeDistribution,
      recentErrors: filteredMetrics
        .filter(m => m.statusCode >= 400)
        .slice(-10)
        .map(m => ({
          timestamp: m.timestamp,
          endpoint: m.endpoint,
          method: m.method,
          statusCode: m.statusCode,
          error: m.error
        }))
    };
  }

  // Log performance metrics
  logPerformanceMetrics(metrics: Omit<PerformanceMetrics, 'timestamp'>) {
    const performanceMetric: PerformanceMetrics = {
      timestamp: new Date(),
      ...metrics
    };

    this.performanceMetrics.push(performanceMetric);
    
    if (this.performanceMetrics.length > this.maxMetricsHistory) {
      this.performanceMetrics = this.performanceMetrics.slice(-this.maxMetricsHistory);
    }
  }

  // Get performance metrics
  getPerformanceMetrics(timeRange?: { start: Date; end: Date }) {
    let filteredMetrics = this.performanceMetrics;
    
    if (timeRange) {
      filteredMetrics = this.performanceMetrics.filter(m => 
        m.timestamp >= timeRange.start && m.timestamp <= timeRange.end
      );
    }

    if (filteredMetrics.length === 0) {
      return {
        averageCpuUsage: 0,
        averageMemoryUsage: 0,
        averageActiveConnections: 0,
        totalRequests: 0,
        totalErrors: 0,
        averageResponseTime: 0,
        trends: {
          cpuUsage: [],
          memoryUsage: [],
          responseTime: []
        }
      };
    }

    const averageCpuUsage = filteredMetrics.reduce((sum, m) => sum + m.cpuUsage, 0) / filteredMetrics.length;
    const averageMemoryUsage = filteredMetrics.reduce((sum, m) => sum + m.memoryUsage, 0) / filteredMetrics.length;
    const averageActiveConnections = filteredMetrics.reduce((sum, m) => sum + m.activeConnections, 0) / filteredMetrics.length;
    const totalRequests = filteredMetrics.reduce((sum, m) => sum + m.requestCount, 0);
    const totalErrors = filteredMetrics.reduce((sum, m) => sum + m.errorCount, 0);
    const averageResponseTime = filteredMetrics.reduce((sum, m) => sum + m.averageResponseTime, 0) / filteredMetrics.length;

    // Get trends (last 10 data points)
    const recentMetrics = filteredMetrics.slice(-10);
    const trends = {
      cpuUsage: recentMetrics.map(m => ({ timestamp: m.timestamp, value: m.cpuUsage })),
      memoryUsage: recentMetrics.map(m => ({ timestamp: m.timestamp, value: m.memoryUsage })),
      responseTime: recentMetrics.map(m => ({ timestamp: m.timestamp, value: m.averageResponseTime }))
    };

    return {
      averageCpuUsage: Math.round(averageCpuUsage * 100) / 100,
      averageMemoryUsage: Math.round(averageMemoryUsage * 100) / 100,
      averageActiveConnections: Math.round(averageActiveConnections * 100) / 100,
      totalRequests,
      totalErrors,
      averageResponseTime: Math.round(averageResponseTime * 100) / 100,
      trends
    };
  }

  // Log business metrics
  logBusinessMetrics(metrics: Omit<BusinessMetrics, 'timestamp'>) {
    const businessMetric: BusinessMetrics = {
      timestamp: new Date(),
      ...metrics
    };

    this.businessMetrics.push(businessMetric);
    
    if (this.businessMetrics.length > this.maxMetricsHistory) {
      this.businessMetrics = this.businessMetrics.slice(-this.maxMetricsHistory);
    }
  }

  // Get business metrics
  getBusinessMetrics(timeRange?: { start: Date; end: Date }) {
    let filteredMetrics = this.businessMetrics;
    
    if (timeRange) {
      filteredMetrics = this.businessMetrics.filter(m => 
        m.timestamp >= timeRange.start && m.timestamp <= timeRange.end
      );
    }

    if (filteredMetrics.length === 0) {
      return {
        totalUsers: 0,
        activeUsers: 0,
        totalBookings: 0,
        totalRevenue: 0,
        conversionRate: 0,
        averageBookingValue: 0,
        trends: {
          users: [],
          bookings: [],
          revenue: []
        }
      };
    }

    const latest = filteredMetrics[filteredMetrics.length - 1];
    const totalUsers = latest.totalUsers;
    const activeUsers = latest.activeUsers;
    const totalBookings = latest.totalBookings;
    const totalRevenue = latest.totalRevenue;
    const conversionRate = latest.conversionRate;
    const averageBookingValue = latest.averageBookingValue;

    // Get trends (last 10 data points)
    const recentMetrics = filteredMetrics.slice(-10);
    const trends = {
      users: recentMetrics.map(m => ({ timestamp: m.timestamp, value: m.totalUsers })),
      bookings: recentMetrics.map(m => ({ timestamp: m.timestamp, value: m.totalBookings })),
      revenue: recentMetrics.map(m => ({ timestamp: m.timestamp, value: m.totalRevenue }))
    };

    return {
      totalUsers,
      activeUsers,
      totalBookings,
      totalRevenue,
      conversionRate: Math.round(conversionRate * 100) / 100,
      averageBookingValue: Math.round(averageBookingValue * 100) / 100,
      trends
    };
  }

  // Get health status
  getHealthStatus() {
    const recentMetrics = this.metrics.slice(-100); // Last 100 requests
    const recentErrors = recentMetrics.filter(m => m.statusCode >= 400);
    const errorRate = recentMetrics.length > 0 ? (recentErrors.length / recentMetrics.length) * 100 : 0;
    const averageResponseTime = recentMetrics.length > 0 ? 
      recentMetrics.reduce((sum, m) => sum + m.responseTime, 0) / recentMetrics.length : 0;

    let status = 'healthy';
    if (errorRate > 10 || averageResponseTime > 2000) {
      status = 'degraded';
    }
    if (errorRate > 25 || averageResponseTime > 5000) {
      status = 'unhealthy';
    }

    return {
      status,
      errorRate: Math.round(errorRate * 100) / 100,
      averageResponseTime: Math.round(averageResponseTime * 100) / 100,
      uptime: process.uptime(),
      timestamp: new Date()
    };
  }

  // Clear old metrics
  clearOldMetrics(olderThanHours: number = 24) {
    const cutoff = new Date(Date.now() - olderThanHours * 60 * 60 * 1000);
    
    this.metrics = this.metrics.filter(m => m.timestamp > cutoff);
    this.performanceMetrics = this.performanceMetrics.filter(m => m.timestamp > cutoff);
    this.businessMetrics = this.businessMetrics.filter(m => m.timestamp > cutoff);
  }
}

// Export singleton instance
export const monitoringService = new MonitoringService();

// Middleware for automatic request logging
export function withMonitoring(handler: Function) {
  return async (request: NextRequest, ...args: any[]) => {
    const startTime = Date.now();
    let statusCode = 200;
    let error: string | undefined;

    try {
      const response = await handler(request, ...args);
      statusCode = response.status || 200;
      return response;
    } catch (err) {
      statusCode = 500;
      error = err instanceof Error ? err.message : 'Unknown error';
      throw err;
    } finally {
      const responseTime = Date.now() - startTime;
      monitoringService.logRequest(request, responseTime, statusCode, error);
    }
  };
}
