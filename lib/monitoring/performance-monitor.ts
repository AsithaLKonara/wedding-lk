import { NextRequest, NextResponse } from 'next/server';

interface PerformanceMetrics {
  timestamp: number;
  endpoint: string;
  method: string;
  duration: number;
  statusCode: number;
  userAgent?: string;
  ip?: string;
  memoryUsage?: NodeJS.MemoryUsage;
}

interface DatabaseMetrics {
  timestamp: number;
  operation: string;
  collection: string;
  duration: number;
  documentsAffected: number;
}

class PerformanceMonitor {
  private static instance: PerformanceMonitor;
  private metrics: PerformanceMetrics[] = [];
  private dbMetrics: DatabaseMetrics[] = [];
  private maxMetrics = 1000; // Keep last 1000 metrics

  private constructor() {}

  static getInstance(): PerformanceMonitor {
    if (!PerformanceMonitor.instance) {
      PerformanceMonitor.instance = new PerformanceMonitor();
    }
    return PerformanceMonitor.instance;
  }

  // API Performance Monitoring
  recordApiCall(metrics: PerformanceMetrics): void {
    this.metrics.push(metrics);
    
    // Keep only the last maxMetrics entries
    if (this.metrics.length > this.maxMetrics) {
      this.metrics = this.metrics.slice(-this.maxMetrics);
    }

    // Log slow API calls
    if (metrics.duration > 2000) { // 2 seconds
      console.warn(`🐌 Slow API Call: ${metrics.method} ${metrics.endpoint} - ${metrics.duration}ms`);
    }
  }

  // Database Performance Monitoring
  recordDbOperation(metrics: DatabaseMetrics): void {
    this.dbMetrics.push(metrics);
    
    // Keep only the last maxMetrics entries
    if (this.dbMetrics.length > this.maxMetrics) {
      this.dbMetrics = this.dbMetrics.slice(-this.maxMetrics);
    }

    // Log slow database operations
    if (metrics.duration > 1000) { // 1 second
      console.warn(`🐌 Slow DB Operation: ${metrics.operation} on ${metrics.collection} - ${metrics.duration}ms`);
    }
  }

  // Get Performance Statistics
  getStats(): {
    apiStats: {
      totalCalls: number;
      averageResponseTime: number;
      slowCalls: number;
      errorRate: number;
      topEndpoints: Array<{ endpoint: string; calls: number; avgDuration: number }>;
    };
    dbStats: {
      totalOperations: number;
      averageOperationTime: number;
      slowOperations: number;
      topCollections: Array<{ collection: string; operations: number; avgDuration: number }>;
    };
  } {
    const apiStats = this.calculateApiStats();
    const dbStats = this.calculateDbStats();

    return { apiStats, dbStats };
  }

  private calculateApiStats() {
    if (this.metrics.length === 0) {
      return {
        totalCalls: 0,
        averageResponseTime: 0,
        slowCalls: 0,
        errorRate: 0,
        topEndpoints: []
      };
    }

    const totalCalls = this.metrics.length;
    const averageResponseTime = this.metrics.reduce((sum, m) => sum + m.duration, 0) / totalCalls;
    const slowCalls = this.metrics.filter(m => m.duration > 2000).length;
    const errorRate = this.metrics.filter(m => m.statusCode >= 400).length / totalCalls;

    // Group by endpoint
    const endpointGroups = this.metrics.reduce((acc, metric) => {
      const key = `${metric.method} ${metric.endpoint}`;
      if (!acc[key]) {
        acc[key] = { calls: 0, totalDuration: 0 };
      }
      acc[key].calls++;
      acc[key].totalDuration += metric.duration;
      return acc;
    }, {} as Record<string, { calls: number; totalDuration: number }>);

    const topEndpoints = Object.entries(endpointGroups)
      .map(([endpoint, data]) => ({
        endpoint,
        calls: data.calls,
        avgDuration: data.totalDuration / data.calls
      }))
      .sort((a, b) => b.calls - a.calls)
      .slice(0, 10);

    return {
      totalCalls,
      averageResponseTime: Math.round(averageResponseTime),
      slowCalls,
      errorRate: Math.round(errorRate * 100) / 100,
      topEndpoints
    };
  }

  private calculateDbStats() {
    if (this.dbMetrics.length === 0) {
      return {
        totalOperations: 0,
        averageOperationTime: 0,
        slowOperations: 0,
        topCollections: []
      };
    }

    const totalOperations = this.dbMetrics.length;
    const averageOperationTime = this.dbMetrics.reduce((sum, m) => sum + m.duration, 0) / totalOperations;
    const slowOperations = this.dbMetrics.filter(m => m.duration > 1000).length;

    // Group by collection
    const collectionGroups = this.dbMetrics.reduce((acc, metric) => {
      if (!acc[metric.collection]) {
        acc[metric.collection] = { operations: 0, totalDuration: 0 };
      }
      acc[metric.collection].operations++;
      acc[metric.collection].totalDuration += metric.duration;
      return acc;
    }, {} as Record<string, { operations: number; totalDuration: number }>);

    const topCollections = Object.entries(collectionGroups)
      .map(([collection, data]) => ({
        collection,
        operations: data.operations,
        avgDuration: data.totalDuration / data.operations
      }))
      .sort((a, b) => b.operations - a.operations)
      .slice(0, 10);

    return {
      totalOperations,
      averageOperationTime: Math.round(averageOperationTime),
      slowOperations,
      topCollections
    };
  }

  // Clear old metrics (call this periodically)
  clearOldMetrics(): void {
    const oneHourAgo = Date.now() - (60 * 60 * 1000);
    this.metrics = this.metrics.filter(m => m.timestamp > oneHourAgo);
    this.dbMetrics = this.dbMetrics.filter(m => m.timestamp > oneHourAgo);
  }
}

// Middleware for API performance monitoring
export function withPerformanceMonitoring(handler: Function) {
  return async (req: NextRequest, ...args: any[]) => {
    const start = Date.now();
    const monitor = PerformanceMonitor.getInstance();

    try {
      const response = await handler(req, ...args);
      const duration = Date.now() - start;

      monitor.recordApiCall({
        timestamp: Date.now(),
        endpoint: req.nextUrl.pathname,
        method: req.method,
        duration,
        statusCode: response?.status || 200,
        userAgent: req.headers.get('user-agent') || undefined,
        ip: req.headers.get('x-forwarded-for') || req.headers.get('x-real-ip') || undefined,
        memoryUsage: process.memoryUsage()
      });

      return response;
    } catch (error) {
      const duration = Date.now() - start;

      monitor.recordApiCall({
        timestamp: Date.now(),
        endpoint: req.nextUrl.pathname,
        method: req.method,
        duration,
        statusCode: 500,
        userAgent: req.headers.get('user-agent') || undefined,
        ip: req.headers.get('x-forwarded-for') || req.headers.get('x-real-ip') || undefined,
        memoryUsage: process.memoryUsage()
      });

      throw error;
    }
  };
}

// Database operation wrapper
export function withDbMonitoring<T>(
  operation: string,
  collection: string,
  fn: () => Promise<T>
): Promise<T> {
  const start = Date.now();
  const monitor = PerformanceMonitor.getInstance();

  return fn().then(
    (result) => {
      const duration = Date.now() - start;
      monitor.recordDbOperation({
        timestamp: Date.now(),
        operation,
        collection,
        duration,
        documentsAffected: Array.isArray(result) ? result.length : 1
      });
      return result;
    },
    (error) => {
      const duration = Date.now() - start;
      monitor.recordDbOperation({
        timestamp: Date.now(),
        operation: `${operation}_error`,
        collection,
        duration,
        documentsAffected: 0
      });
      throw error;
    }
  );
}

export default PerformanceMonitor;
