import { NextResponse } from 'next/server';
import { monitoringService } from '@/lib/monitoring';
import { connectDB } from '@/lib/mongodb';

export async function GET() {
  try {
    // Get basic health status
    const healthStatus = monitoringService.getHealthStatus();
    
    // Test database connection
    let dbStatus = 'connected';
    try {
      await connectDB();
    } catch (error) {
      dbStatus = 'disconnected';
      healthStatus.status = 'unhealthy';
    }

    // Get system info
    const systemInfo = {
      nodeVersion: process.version,
      platform: process.platform,
      arch: process.arch,
      uptime: process.uptime(),
      memoryUsage: process.memoryUsage(),
      cpuUsage: process.cpuUsage(),
      env: process.env.NODE_ENV
    };

    return NextResponse.json({
      success: true,
      health: healthStatus,
      database: dbStatus,
      system: systemInfo,
      timestamp: new Date()
    });

  } catch (error) {
    console.error('Health check error:', error);
    return NextResponse.json({
      success: false,
      health: {
        status: 'unhealthy',
        error: error instanceof Error ? error.message : 'Unknown error',
        timestamp: new Date()
      }
    }, { status: 500 });
  }
}
