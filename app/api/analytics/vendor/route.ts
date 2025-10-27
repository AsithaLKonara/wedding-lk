import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from '@/lib/auth-utils';
import { AnalyticsDashboard } from '@/lib/analytics-dashboard';
import { apiRateLimit } from '@/lib/rate-limiting';

// GET /api/analytics/vendor - Get vendor-specific analytics
export async function GET(request: NextRequest) {
  return apiRateLimit.check(request).then(async (rateLimitResult) => {
    if (!rateLimitResult.allowed) {
      return rateLimitResult.error!;
    }

    try {
      const session = await getServerSession();
      
      if (!session?.user?.id) {
        return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
      }

      // Check if user is a vendor
      if (session.user.role !== 'vendor') {
        return NextResponse.json({ error: 'Access denied' }, { status: 403 });
      }

      const analytics = await AnalyticsDashboard.getVendorAnalytics(session.user.id);

      return NextResponse.json({
        success: true,
        data: analytics
      });

    } catch (error) {
      console.error('Vendor analytics error:', error);
      return NextResponse.json(
        {
          success: false,
          error: 'Failed to fetch vendor analytics',
          message: 'Internal server error'
        },
        { status: 500 }
      );
    }
  });
}


