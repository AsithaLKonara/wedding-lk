import { NextRequest, NextResponse } from 'next/server';
import { ScalingMonitoringService } from '@/lib/services/scaling-monitoring-service';
import { getUserFromRequestWithError } from '@/lib/auth/get-user-from-request';

export async function GET(req: NextRequest) {
  try {
    const { user, error } = getUserFromRequestWithError(req);
    if (error) return error;
    if (!user || user.role !== 'admin') {
      return NextResponse.json(
        { error: 'Unauthorized - Admin access required' },
        { status: 401 }
      );
    }

    const scalingService = new ScalingMonitoringService();
    const metrics = await scalingService.getScalingMetrics();

    return NextResponse.json({
      success: true,
      data: metrics
    });
  } catch (error) {
    console.error('Scaling monitoring error:', error);
    return NextResponse.json(
      { error: 'Failed to fetch scaling metrics' },
      { status: 500 }
    );
  }
}

export async function POST(req: NextRequest) {
  try {
    const { user, error } = getUserFromRequestWithError(req);
    if (error) return error;
    if (!user || user.role !== 'admin') {
      return NextResponse.json(
        { error: 'Unauthorized - Admin access required' },
        { status: 401 }
      );
    }

    const body = await req.json();
    const { action } = body;

    const scalingService = new ScalingMonitoringService();

    let result;
    switch (action) {
      case 'monitor_and_scale':
        result = await scalingService.monitorAndScale();
        break;
      case 'get_capacity_planning':
        result = await scalingService.getCapacityPlanning();
        break;
      default:
        return NextResponse.json(
          { error: 'Invalid action' },
          { status: 400 }
        );
    }

    return NextResponse.json({
      success: true,
      data: result
    });
  } catch (error) {
    console.error('Scaling action error:', error);
    return NextResponse.json(
      { error: 'Failed to execute scaling action' },
      { status: 500 }
    );
  }
}
