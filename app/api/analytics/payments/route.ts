import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth/nextauth-config';
import { PaymentAnalyticsService } from '@/lib/services/payment-analytics-service';

export async function GET(req: NextRequest) {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      );
    }

    const { searchParams } = new URL(req.url);
    const vendorId = searchParams.get('vendorId');
    const startDate = searchParams.get('startDate');
    const endDate = searchParams.get('endDate');
    const type = searchParams.get('type') || 'analytics';

    const paymentAnalyticsService = new PaymentAnalyticsService();

    let result;
    const dateRange = startDate && endDate ? {
      start: new Date(startDate),
      end: new Date(endDate)
    } : undefined;

    switch (type) {
      case 'analytics':
        result = await paymentAnalyticsService.getPaymentAnalytics(
          vendorId || undefined,
          dateRange
        );
        break;
      case 'conversions':
        result = await paymentAnalyticsService.getConversionMetrics(
          vendorId || undefined,
          dateRange
        );
        break;
      case 'insights':
        result = await paymentAnalyticsService.getPaymentInsights(
          vendorId || undefined,
          dateRange
        );
        break;
      default:
        return NextResponse.json(
          { error: 'Invalid analytics type' },
          { status: 400 }
        );
    }

    return NextResponse.json({
      success: true,
      data: result
    });
  } catch (error) {
    console.error('Payment analytics error:', error);
    return NextResponse.json(
      { error: 'Failed to fetch payment analytics' },
      { status: 500 }
    );
  }
}
