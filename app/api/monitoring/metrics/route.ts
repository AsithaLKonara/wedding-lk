import { NextRequest, NextResponse } from 'next/server';
import { monitoringService } from '@/lib/monitoring';
import { getUserFromRequestWithError } from '@/lib/auth/get-user-from-request';

export async function GET(request: NextRequest) {
  try {
    const { user, error } = getUserFromRequestWithError(request);
    if (error) return error;
    if (!user || user.role !== 'admin') {
      return NextResponse.json({ error: 'Unauthorized - Admin access required' }, { status: 401 });
    }

    const { searchParams } = new URL(request.url);
    const type = searchParams.get('type') || 'api';
    const hours = parseInt(searchParams.get('hours') || '24');

    const timeRange = {
      start: new Date(Date.now() - hours * 60 * 60 * 1000),
      end: new Date()
    };

    let metrics;
    switch (type) {
      case 'api':
        metrics = monitoringService.getApiMetrics(timeRange);
        break;
      case 'performance':
        metrics = monitoringService.getPerformanceMetrics(timeRange);
        break;
      case 'business':
        metrics = monitoringService.getBusinessMetrics(timeRange);
        break;
      default:
        return NextResponse.json({ error: 'Invalid metrics type' }, { status: 400 });
    }

    return NextResponse.json({
      success: true,
      type,
      timeRange,
      metrics
    });

  } catch (error) {
    console.error('Error fetching metrics:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
