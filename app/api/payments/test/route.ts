import { NextResponse } from 'next/server';
import Stripe from 'stripe';

export async function GET() {
  try {
    // Check if Stripe is configured
    if (!process.env.STRIPE_SECRET_KEY) {
      return NextResponse.json({
        success: false,
        error: 'Stripe secret key not configured',
        configured: false
      }, { status: 500 });
    }

    if (!process.env.STRIPE_PUBLISHABLE_KEY) {
      return NextResponse.json({
        success: false,
        error: 'Stripe publishable key not configured',
        configured: false
      }, { status: 500 });
    }

    // Initialize Stripe
    const stripe = new Stripe(process.env.STRIPE_SECRET_KEY, {
      apiVersion: '2024-06-20',
    });

    // Test Stripe connection by retrieving account info
    const account = await stripe.accounts.retrieve();

    return NextResponse.json({
      success: true,
      configured: true,
      stripe: {
        accountId: account.id,
        country: account.country,
        currency: account.default_currency,
        chargesEnabled: account.charges_enabled,
        payoutsEnabled: account.payouts_enabled
      },
      environment: {
        hasSecretKey: !!process.env.STRIPE_SECRET_KEY,
        hasPublishableKey: !!process.env.STRIPE_PUBLISHABLE_KEY,
        hasWebhookSecret: !!process.env.STRIPE_WEBHOOK_SECRET
      }
    });

  } catch (error) {
    console.error('Stripe test error:', error);
    return NextResponse.json({
      success: false,
      error: error.message,
      configured: false
    }, { status: 500 });
  }
}
