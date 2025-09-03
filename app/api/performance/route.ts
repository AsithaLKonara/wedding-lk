import { NextRequest, NextResponse } from 'next/server';
import { advancedCache } from '@/lib/advanced-cache-service';
import { dbPoolManager } from '@/lib/db-pool-manager';

// Performance monitoring API
export async function GET(request: NextRequest) {
  try {
    // Get cache statistics
    const cacheStats = await advancedCache.getStats();
    const cacheHealth = await advancedCache.healthCheck();
    
    // Get database pool statistics
    const poolStats = dbPoolManager.getPoolStats();
    const poolHealth = await dbPoolManager.healthCheck();
    const poolPerformance = dbPoolManager.getPerformanceMetrics();
    
    // Get system performance metrics
    const systemMetrics = {
      uptime: process.uptime(),
      memoryUsage: process.memoryUsage(),
      cpuUsage: process.cpuUsage(),
      nodeVersion: process.version,
      platform: process.platform,
      arch: process.arch,
    };

    const performanceData = {
      timestamp: new Date().toISOString(),
      cache: {
        stats: cacheStats,
        health: cacheHealth,
      },
      database: {
        pool: poolStats,
        health: poolHealth,
        performance: poolPerformance,
      },
      system: systemMetrics,
      summary: {
        overallHealth: cacheHealth && poolHealth.isHealthy ? 'healthy' : 'degraded',
        cacheHitRate: cacheStats.hitRate,
        poolUtilization: poolStats.connectionUtilization,
        averageResponseTime: poolPerformance.averageResponseTime,
      },
    };

    return NextResponse.json({
      success: true,
      data: performanceData,
      timestamp: new Date().toISOString(),
    });

  } catch (error) {
    console.error('Error fetching performance metrics:', error);
    return NextResponse.json({
      success: false,
      error: 'Failed to fetch performance metrics',
      timestamp: new Date().toISOString(),
    }, { status: 500 });
  }
} 