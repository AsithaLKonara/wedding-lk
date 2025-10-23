import { NextRequest, NextResponse } from 'next/server';
import PerformanceMonitor from '@/lib/monitoring/performance-monitor';

export async function GET(req: NextRequest) {
  try {
    // Check if user is admin
    // Custom auth implementation
    const token = request.cookies.get('auth-token')?.value;
    if (!token) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }
    if (!user?.user || user.role !== 'admin') {
      return NextResponse.json(
        { error: 'Unauthorized - Admin access required' },
        { status: 401 }
      );
    }

    const monitor = PerformanceMonitor.getInstance();
    const stats = monitor.getStats();

    // Clear old metrics to prevent memory buildup
    monitor.clearOldMetrics();

    return NextResponse.json({
      success: true,
      data: {
        ...stats,
        timestamp: new Date().toISOString(),
        serverInfo: {
          uptime: process.uptime(),
          memoryUsage: process.memoryUsage(),
          nodeVersion: process.version,
          platform: process.platform
        }
      }
    });
  } catch (error) {
    console.error('Performance monitoring error:', error);
    return NextResponse.json(
      { error: 'Failed to fetch performance metrics' },
      { status: 500 }
    );
  }
}

export async function DELETE(req: NextRequest) {
  try {
    // Check if user is admin
    // Custom auth implementation
    const token = request.cookies.get('auth-token')?.value;
    if (!token) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }
    if (!user?.user || user.role !== 'admin') {
      return NextResponse.json(
        { error: 'Unauthorized - Admin access required' },
        { status: 401 }
      );
    }

    const monitor = PerformanceMonitor.getInstance();
    monitor.clearOldMetrics();

    return NextResponse.json({
      success: true,
      message: 'Performance metrics cleared'
    });
  } catch (error) {
    console.error('Performance monitoring error:', error);
    return NextResponse.json(
      { error: 'Failed to clear performance metrics' },
      { status: 500 }
    );
  }
}
