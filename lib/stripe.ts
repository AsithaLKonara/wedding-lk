import Stripe from 'stripe';

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY || '', {
  apiVersion: '2025-06-30.basil',
});

interface PaymentIntentRequest {
  amount: number;
  currency?: string;
}

interface CustomerRequest {
  email: string;
  name: string;
}

export const createPaymentIntent = async (amount: number, currency: string = 'lkr') => {
  try {
    const paymentIntent = await stripe.paymentIntents.create({
      amount,
      currency,
      automatic_payment_methods: {
        enabled: true,
      },
    });
    return paymentIntent;
  } catch (error) {
    if (process.env.NODE_ENV === 'development') {
      console.error('Stripe payment intent error:', error);
    }
    throw error;
  }
};

export const createCustomer = async (email: string, name: string) => {
  try {
    const customer = await stripe.customers.create({
      email,
      name,
    });
    return customer;
  } catch (error) {
    if (process.env.NODE_ENV === 'development') {
      console.error('Stripe customer creation error:', error);
    }
    throw error;
  }
};

export const createSubscription = async (customerId: string, priceId: string) => {
  try {
    const subscription = await stripe.subscriptions.create({
      customer: customerId,
      items: [{ price: priceId }],
      payment_behavior: 'default_incomplete',
      payment_settings: { save_default_payment_method: 'on_subscription' },
      expand: ['latest_invoice.payment_intent'],
    })
    return subscription
  } catch (error) {
    console.error('Error creating subscription:', error)
    throw error
  }
} 