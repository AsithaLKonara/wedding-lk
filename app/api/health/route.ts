import { NextResponse } from 'next/server';
import { connectDB } from '@/lib/db';
import cacheManager from '@/lib/cache-manager';

export async function GET() {
  const startTime = Date.now();
  
  try {
    // Check cache first
    const cacheKey = 'health:status';
    const cached = await cacheManager.get(cacheKey);
    
    if (cached) {
      const responseTime = Date.now() - startTime;
      return NextResponse.json({
        status: 'healthy',
        cached: true,
        responseTime: `${responseTime}ms`,
        message: 'Data served from cache - Ultra Fast! 🚀'
      });
    }

    // Connect to database
    await connectDB();
    
    // Check database connection
    const dbStatus = 'connected';
    
    // Check Redis cache
    const cacheStatus = await cacheManager.healthCheck() ? 'connected' : 'disconnected';
    
    // Check system resources
    const memoryUsage = process.memoryUsage();
    const uptime = process.uptime();
    
    const healthData = {
      status: 'healthy',
      timestamp: new Date().toISOString(),
      database: dbStatus,
      cache: cacheStatus,
      system: {
        uptime: `${Math.round(uptime)}s`,
        memory: {
          rss: `${Math.round(memoryUsage.rss / 1024 / 1024)}MB`,
          heapUsed: `${Math.round(memoryUsage.heapUsed / 1024 / 1024)}MB`,
          heapTotal: `${Math.round(memoryUsage.heapTotal / 1024 / 1024)}MB`
        }
      },
      performance: {
        responseTime: `${Date.now() - startTime}ms`,
        cached: false
      }
    };

    // Cache the health data for 30 seconds
    await cacheManager.set(cacheKey, healthData, 30);
    
    return NextResponse.json(healthData);
    
  } catch (error) {
    const responseTime = Date.now() - startTime;
    return NextResponse.json(
      {
        status: 'unhealthy',
        error: error instanceof Error ? error.message : 'Unknown error',
        responseTime: `${responseTime}ms`,
        timestamp: new Date().toISOString()
      },
      { status: 500 }
    );
  }
} 