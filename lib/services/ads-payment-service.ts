import Stripe from 'stripe';
import { connectDB } from '@/lib/db';
import { MetaAdsCampaign } from '@/lib/models/metaAds';
import { Payment } from '@/lib/models/payment';

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, {
  apiVersion: '2023-10-16',
});

export interface AdsPaymentRequest {
  campaignId: string;
  amount: number;
  currency: string;
  description: string;
  vendorId: string;
  packageId?: string;
  paymentMethod: 'card' | 'bank_transfer' | 'wallet';
  billingCycle: 'one_time' | 'monthly' | 'quarterly' | 'yearly';
}

export interface AdsPaymentResponse {
  paymentId: string;
  clientSecret?: string;
  paymentIntentId?: string;
  status: 'pending' | 'processing' | 'completed' | 'failed';
  amount: number;
  currency: string;
  createdAt: string;
}

export class AdsPaymentService {
  // Create payment intent for ads
  async createAdsPayment(paymentRequest: AdsPaymentRequest): Promise<AdsPaymentResponse> {
    try {
      await connectDB();

      // Create Stripe payment intent
      const paymentIntent = await stripe.paymentIntents.create({
        amount: Math.round(paymentRequest.amount * 100), // Convert to cents
        currency: paymentRequest.currency.toLowerCase(),
        metadata: {
          type: 'ads_payment',
          campaignId: paymentRequest.campaignId,
          vendorId: paymentRequest.vendorId,
          packageId: paymentRequest.packageId || '',
          billingCycle: paymentRequest.billingCycle,
        },
        description: paymentRequest.description,
        automatic_payment_methods: {
          enabled: true,
        },
      });

      // Create payment record in database
      const payment = new Payment({
        userId: paymentRequest.vendorId,
        amount: paymentRequest.amount,
        currency: paymentRequest.currency,
        status: 'pending',
        type: 'ads_payment',
        stripePaymentIntentId: paymentIntent.id,
        metadata: {
          campaignId: paymentRequest.campaignId,
          packageId: paymentRequest.packageId,
          billingCycle: paymentRequest.billingCycle,
          description: paymentRequest.description,
        },
        createdAt: new Date(),
        updatedAt: new Date(),
      });

      await payment.save();

      return {
        paymentId: payment._id.toString(),
        clientSecret: paymentIntent.client_secret,
        paymentIntentId: paymentIntent.id,
        status: 'pending',
        amount: paymentRequest.amount,
        currency: paymentRequest.currency,
        createdAt: payment.createdAt.toISOString(),
      };
    } catch (error) {
      console.error('Error creating ads payment:', error);
      throw new Error('Failed to create ads payment');
    }
  }

  // Confirm payment and activate campaign
  async confirmAdsPayment(paymentId: string): Promise<AdsPaymentResponse> {
    try {
      await connectDB();

      const payment = await Payment.findById(paymentId);
      if (!payment) {
        throw new Error('Payment not found');
      }

      if (payment.status !== 'pending') {
        throw new Error('Payment already processed');
      }

      // Retrieve payment intent from Stripe
      const paymentIntent = await stripe.paymentIntents.retrieve(payment.stripePaymentIntentId!);

      if (paymentIntent.status === 'succeeded') {
        // Update payment status
        payment.status = 'completed';
        payment.completedAt = new Date();
        payment.updatedAt = new Date();
        await payment.save();

        // Activate campaign if payment is for campaign
        if (payment.metadata?.campaignId) {
          await this.activateCampaignAfterPayment(payment.metadata.campaignId);
        }

        return {
          paymentId: payment._id.toString(),
          status: 'completed',
          amount: payment.amount,
          currency: payment.currency,
          createdAt: payment.createdAt.toISOString(),
        };
      } else {
        // Payment failed
        payment.status = 'failed';
        payment.updatedAt = new Date();
        await payment.save();

        throw new Error('Payment failed');
      }
    } catch (error) {
      console.error('Error confirming ads payment:', error);
      throw new Error('Failed to confirm ads payment');
    }
  }

  // Activate campaign after successful payment
  private async activateCampaignAfterPayment(campaignId: string): Promise<void> {
    try {
      const campaign = await MetaAdsCampaign.findById(campaignId);
      if (campaign) {
        campaign.status = 'ACTIVE';
        campaign.updatedAt = new Date();
        await campaign.save();
      }
    } catch (error) {
      console.error('Error activating campaign:', error);
      // Don't throw error here as payment is already confirmed
    }
  }

  // Get payment history for vendor
  async getVendorPaymentHistory(vendorId: string, limit: number = 20): Promise<Payment[]> {
    try {
      await connectDB();

      const payments = await Payment.find({
        userId: vendorId,
        type: 'ads_payment',
      })
        .sort({ createdAt: -1 })
        .limit(limit);

      return payments;
    } catch (error) {
      console.error('Error fetching payment history:', error);
      throw new Error('Failed to fetch payment history');
    }
  }

  // Calculate campaign budget recommendations
  calculateBudgetRecommendations(campaignData: any): {
    suggestedDailyBudget: number;
    suggestedLifetimeBudget: number;
    estimatedReach: number;
    estimatedClicks: number;
    estimatedConversions: number;
  } {
    const baseBudget = 50; // Base daily budget
    const multiplier = campaignData.priority === 'high' ? 2 : campaignData.priority === 'medium' ? 1.5 : 1;
    
    const suggestedDailyBudget = baseBudget * multiplier;
    const suggestedLifetimeBudget = suggestedDailyBudget * 30; // 30-day campaign
    
    // Estimate metrics based on industry averages
    const estimatedReach = Math.round(suggestedDailyBudget * 100); // $1 = 100 reach
    const estimatedClicks = Math.round(estimatedReach * 0.02); // 2% CTR
    const estimatedConversions = Math.round(estimatedClicks * 0.05); // 5% conversion rate

    return {
      suggestedDailyBudget,
      suggestedLifetimeBudget,
      estimatedReach,
      estimatedClicks,
      estimatedConversions,
    };
  }

  // Create subscription for recurring ads payments
  async createAdsSubscription(
    vendorId: string,
    campaignId: string,
    amount: number,
    billingCycle: 'monthly' | 'quarterly' | 'yearly'
  ): Promise<{ subscriptionId: string; clientSecret: string }> {
    try {
      await connectDB();

      // Create Stripe customer if not exists
      let customerId = await this.getOrCreateStripeCustomer(vendorId);

      // Create subscription
      const subscription = await stripe.subscriptions.create({
        customer: customerId,
        items: [{
          price_data: {
            currency: 'usd',
            product_data: {
              name: `Meta Ads Campaign - ${campaignId}`,
              description: 'Recurring payment for Meta Ads campaign',
            },
            unit_amount: Math.round(amount * 100),
            recurring: {
              interval: billingCycle === 'monthly' ? 'month' : 
                       billingCycle === 'quarterly' ? 'month' : 'year',
              interval_count: billingCycle === 'quarterly' ? 3 : 1,
            },
          },
        }],
        metadata: {
          type: 'ads_subscription',
          campaignId,
          vendorId,
        },
        payment_behavior: 'default_incomplete',
        payment_settings: { save_default_payment_method: 'on_subscription' },
        expand: ['latest_invoice.payment_intent'],
      });

      // Save subscription to database
      const payment = new Payment({
        userId: vendorId,
        amount,
        currency: 'USD',
        status: 'pending',
        type: 'ads_subscription',
        stripeSubscriptionId: subscription.id,
        metadata: {
          campaignId,
          billingCycle,
        },
        createdAt: new Date(),
        updatedAt: new Date(),
      });

      await payment.save();

      return {
        subscriptionId: subscription.id,
        clientSecret: (subscription.latest_invoice as any).payment_intent.client_secret,
      };
    } catch (error) {
      console.error('Error creating ads subscription:', error);
      throw new Error('Failed to create ads subscription');
    }
  }

  // Get or create Stripe customer
  private async getOrCreateStripeCustomer(vendorId: string): Promise<string> {
    try {
      // Check if customer already exists in our database
      const existingPayment = await Payment.findOne({
        userId: vendorId,
        stripeCustomerId: { $exists: true },
      });

      if (existingPayment?.stripeCustomerId) {
        return existingPayment.stripeCustomerId;
      }

      // Create new Stripe customer
      const customer = await stripe.customers.create({
        metadata: {
          vendorId,
        },
      });

      // Save customer ID to database
      await Payment.findOneAndUpdate(
        { userId: vendorId },
        { stripeCustomerId: customer.id },
        { upsert: true }
      );

      return customer.id;
    } catch (error) {
      console.error('Error creating Stripe customer:', error);
      throw new Error('Failed to create Stripe customer');
    }
  }

  // Handle webhook events
  async handleWebhookEvent(event: Stripe.Event): Promise<void> {
    try {
      await connectDB();

      switch (event.type) {
        case 'payment_intent.succeeded':
          await this.handlePaymentSuccess(event.data.object as Stripe.PaymentIntent);
          break;
        case 'payment_intent.payment_failed':
          await this.handlePaymentFailure(event.data.object as Stripe.PaymentIntent);
          break;
        case 'invoice.payment_succeeded':
          await this.handleSubscriptionPayment(event.data.object as Stripe.Invoice);
          break;
        case 'invoice.payment_failed':
          await this.handleSubscriptionFailure(event.data.object as Stripe.Invoice);
          break;
        default:
          console.log(`Unhandled event type: ${event.type}`);
      }
    } catch (error) {
      console.error('Error handling webhook event:', error);
      throw error;
    }
  }

  private async handlePaymentSuccess(paymentIntent: Stripe.PaymentIntent): Promise<void> {
    const payment = await Payment.findOne({
      stripePaymentIntentId: paymentIntent.id,
    });

    if (payment) {
      payment.status = 'completed';
      payment.completedAt = new Date();
      payment.updatedAt = new Date();
      await payment.save();

      // Activate campaign if applicable
      if (payment.metadata?.campaignId) {
        await this.activateCampaignAfterPayment(payment.metadata.campaignId);
      }
    }
  }

  private async handlePaymentFailure(paymentIntent: Stripe.PaymentIntent): Promise<void> {
    const payment = await Payment.findOne({
      stripePaymentIntentId: paymentIntent.id,
    });

    if (payment) {
      payment.status = 'failed';
      payment.updatedAt = new Date();
      await payment.save();
    }
  }

  private async handleSubscriptionPayment(invoice: Stripe.Invoice): Promise<void> {
    // Handle successful subscription payment
    console.log('Subscription payment succeeded:', invoice.id);
  }

  private async handleSubscriptionFailure(invoice: Stripe.Invoice): Promise<void> {
    // Handle failed subscription payment
    console.log('Subscription payment failed:', invoice.id);
  }
}
