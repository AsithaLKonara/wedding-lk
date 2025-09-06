import { NextResponse } from 'next/server';
import { connectDB } from '@/lib/db';

export async function GET() {
  const startTime = Date.now();
  
  try {
    // Connect to database
    await connectDB();
    
    // Check database connection
    const dbStatus = 'connected';
    
    // Check system resources
    const memoryUsage = process.memoryUsage();
    const uptime = process.uptime();
    
                // Check Redis connection
            let cacheStatus = 'disabled';
            try {
              const { default: redisService } = await import('@/lib/upstash-redis');
              const redis = redisService.getInstance();
              const isRedisReady = await redis.isReady();
              cacheStatus = isRedisReady ? 'connected' : 'disconnected';
            } catch (error) {
              console.log('Redis check failed:', error);
              cacheStatus = 'error';
            }

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
                cached: cacheStatus === 'connected'
              }
            };
    
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