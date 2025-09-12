import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from '@/lib/auth-utils';
import Stripe from 'stripe';
import { connectDB } from '@/lib/db';
import { User } from '@/lib/models/user';
import { Payment } from '@/lib/models/Payment';

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, {
  apiVersion: '2025-06-30.basil',
});

export async function POST(request: NextRequest) {
  try {
    const session = await getServerSession();
    if (!session?.user?.email) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    await connectDB();

    const user = await User.findOne({ email: session.user.email });
    if (!user) {
      return NextResponse.json({ error: 'User not found' }, { status: 404 });
    }

    const { items, total } = await request.json();

    if (!items || !Array.isArray(items) || items.length === 0) {
      return NextResponse.json({ 
        error: 'Items are required' 
      }, { status: 400 });
    }

    if (!total || total <= 0) {
      return NextResponse.json({ 
        error: 'Invalid total amount' 
      }, { status: 400 });
    }

    // Validate items
    for (const item of items) {
      if (!item.name || !item.price || !item.quantity) {
        return NextResponse.json({ 
          error: 'Invalid item data' 
        }, { status: 400 });
      }
    }

    // Create Stripe checkout session
    const checkoutSession = await stripe.checkout.sessions.create({
      payment_method_types: ['card'],
      line_items: items.map((item: any) => ({
        price_data: {
          currency: 'lkr',
          product_data: {
            name: item.name,
            description: item.description || '',
          },
          unit_amount: Math.round(item.price * 100), // Convert to cents
        },
        quantity: item.quantity,
      })),
      mode: 'payment',
      success_url: `${process.env.NEXTAUTH_URL}/payments/success?session_id={CHECKOUT_SESSION_ID}`,
      cancel_url: `${process.env.NEXTAUTH_URL}/payments/cancel`,
      customer_email: user.email,
      metadata: {
        userId: user._id.toString(),
        userEmail: user.email,
        totalAmount: total.toString(),
        itemCount: items.length.toString(),
      },
      // Add shipping if needed
      shipping_address_collection: {
        allowed_countries: ['LK'], // Sri Lanka only
      },
      // Add billing address collection
      billing_address_collection: 'required',
    });

    // Create pending payment record
    const payment = new Payment({
      user: user._id,
      amount: total,
      currency: 'LKR',
      status: 'pending',
      paymentMethod: 'card',
      transactionId: `TXN${Date.now()}`,
      stripeSessionId: checkoutSession.id,
      metadata: {
        items: items,
        checkoutSessionId: checkoutSession.id,
      },
    });

    await payment.save();

    return NextResponse.json({ 
      success: true,
      sessionId: checkoutSession.id,
      paymentId: payment._id,
      url: checkoutSession.url
    });

  } catch (error) {
    console.error('Checkout session creation error:', error);
    return NextResponse.json({
      success: false,
      error: 'Failed to create checkout session',
      message: error instanceof Error ? error.message : 'Unknown error'
    }, { status: 500 });
  }
}
