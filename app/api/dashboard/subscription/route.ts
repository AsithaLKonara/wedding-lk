import { NextRequest, NextResponse } from 'next/server';
import { connectDB } from '@/lib/db';
import { getUserFromRequestWithError } from '@/lib/auth/get-user-from-request';
import { Subscription } from '@/lib/models';

export async function GET(request: NextRequest) {
  try {
    const { user, error } = await getUserFromRequestWithError(request);
    if (error) return error;
    if (!user || (user.role !== 'vendor' && user.role !== 'wedding_planner')) {
      return NextResponse.json({ error: "Professional access required" }, { status: 403 });
    }

    await connectDB();
    
    // Subscriptions are linked to vendors or planners. 
    // In our model it's vendorId, but for planners it might be the same field or different.
    // For now we query by vendorId (treating planners as vendors for subs if applicable).
    const subscription = await Subscription.findOne({ vendorId: user.id }).sort({ createdAt: -1 });

    if (!subscription) {
      return NextResponse.json({
        success: true,
        subscription: null,
        payments: []
      });
    }

    return NextResponse.json({
      success: true,
      subscription: {
        name: subscription.planName,
        price: subscription.price,
        status: subscription.status,
        renewsAt: subscription.nextBillingDate,
        planType: subscription.planType,
      },
      payments: subscription.payment?.paymentHistory || []
    });
  } catch (error) {
    console.error('Error fetching subscription:', error);
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}
