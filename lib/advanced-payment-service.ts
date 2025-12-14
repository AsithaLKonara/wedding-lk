import Stripe from 'stripe'
import { connectDB } from './db'
import { Payment, User } from './models'

interface PaymentMethod {
  id: string
  type: 'card' | 'bank' | 'wallet' | 'crypto'
  brand?: string
  last4?: string
  expiryMonth?: number
  expiryYear?: number
  isDefault: boolean
  metadata: Record<string, any>
}

interface PaymentIntent {
  id: string
  amount: number
  currency: string
  status: 'pending' | 'processing' | 'succeeded' | 'failed' | 'cancelled'
  paymentMethod: string
  customer: string
  metadata: Record<string, any>
  createdAt: Date
  updatedAt: Date
}

interface Subscription {
  id: string
  customerId: string
  planId: string
  status: 'active' | 'canceled' | 'past_due' | 'unpaid' | 'trialing'
  currentPeriodStart: Date
  currentPeriodEnd: Date
  cancelAtPeriodEnd: boolean
  metadata: Record<string, any>
}

interface PaymentPlan {
  id: string
  name: string
  description: string
  price: number
  currency: string
  interval: 'month' | 'year' | 'one-time'
  features: string[]
  metadata: Record<string, any>
}

interface Refund {
  id: string
  paymentId: string
  amount: number
  reason: string
  status: 'pending' | 'succeeded' | 'failed'
  metadata: Record<string, any>
  createdAt: Date
}

class AdvancedPaymentService {
  private stripe: Stripe | null = null
  private supportedCurrencies = ['USD', 'EUR', 'GBP', 'LKR', 'INR', 'AUD', 'CAD']
  private paymentGateways = ['stripe', 'paypal', 'razorpay', 'payhere']

  constructor() {
    if (process.env.STRIPE_SECRET_KEY) {
      this.stripe = new Stripe(process.env.STRIPE_SECRET_KEY, {
        apiVersion: '2025-06-30.basil'
      })
    }
  }

  // Payment Method Management
  async createPaymentMethod(userId: string, paymentData: any): Promise<PaymentMethod> {
    try {
      await connectDB()
      
      if (!this.stripe) {
        throw new Error('Stripe not configured')
      }

      const user = await User.findById(userId)
      if (!user) {
        throw new Error('User not found')
      }

      let customerId = user.stripeCustomerId
      if (!customerId) {
        const customer = await this.stripe.customers.create({
          email: user.email,
          metadata: { userId: userId }
        })
        customerId = customer.id
        
        await User.findByIdAndUpdate(userId, { stripeCustomerId: customerId })
      }

      let paymentMethod: Stripe.PaymentMethod
      
      if (paymentData.type === 'card') {
        paymentMethod = await this.stripe.paymentMethods.create({
          type: 'card',
          card: {
            token: paymentData.token
          },
          billing_details: {
            email: user.email,
            name: user.name
          }
        })
      } else if (paymentData.type === 'bank') {
        paymentMethod = await this.stripe.paymentMethods.create({
          type: 'us_bank_account',
          us_bank_account: {
            account_number: paymentData.accountNumber,
            routing_number: paymentData.routingNumber,
            account_holder_type: paymentData.accountHolderType
          },
          billing_details: {
            email: user.email,
            name: user.name
          }
        })
      } else {
        throw new Error('Unsupported payment method type')
      }

      // Attach payment method to customer
      await this.stripe.paymentMethods.attach(paymentMethod.id, {
        customer: customerId
      })

      const paymentMethodData: PaymentMethod = {
        id: paymentMethod.id,
        type: paymentData.type as 'card' | 'bank' | 'wallet' | 'crypto',
        brand: paymentMethod.card?.brand,
        last4: paymentMethod.card?.last4,
        expiryMonth: paymentMethod.card?.exp_month || undefined,
        expiryYear: paymentMethod.card?.exp_year || undefined,
        isDefault: false,
        metadata: paymentMethod.metadata || {}
      }

      return paymentMethodData
    } catch (error) {
      console.error('Error creating payment method:', error)
      throw new Error('Failed to create payment method')
    }
  }

  async getPaymentMethods(userId: string): Promise<PaymentMethod[]> {
    try {
      await connectDB()
      
      const user = await User.findById(userId)
      if (!user?.stripeCustomerId) {
        return []
      }

      if (!this.stripe) {
        throw new Error('Stripe not configured')
      }

      const paymentMethods = await this.stripe.paymentMethods.list({
        customer: user.stripeCustomerId,
        type: 'card'
      })

      return paymentMethods.data.map(pm => ({
        id: pm.id,
        type: 'card',
        brand: pm.card?.brand,
        last4: pm.card?.last4,
        expiryMonth: pm.card?.exp_month || undefined,
        expiryYear: pm.card?.exp_year || undefined,
        isDefault: pm.metadata?.isDefault === 'true',
        metadata: pm.metadata || {}
      }))
    } catch (error) {
      console.error('Error getting payment methods:', error)
      throw new Error('Failed to get payment methods')
    }
  }

  async setDefaultPaymentMethod(userId: string, paymentMethodId: string): Promise<void> {
    try {
      await connectDB()
      
      const user = await User.findById(userId)
      if (!user?.stripeCustomerId) {
        throw new Error('User not found')
      }

      if (!this.stripe) {
        throw new Error('Stripe not configured')
      }

      // Update customer's default payment method
      await this.stripe.customers.update(user.stripeCustomerId, {
        invoice_settings: {
          default_payment_method: paymentMethodId
        }
      })

      // Update metadata for all payment methods
      const paymentMethods = await this.stripe.paymentMethods.list({
        customer: user.stripeCustomerId,
        type: 'card'
      })

      for (const pm of paymentMethods.data) {
        await this.stripe.paymentMethods.update(pm.id, {
          metadata: {
            ...pm.metadata,
            isDefault: pm.id === paymentMethodId ? 'true' : 'false'
          }
        })
      }
    } catch (error) {
      console.error('Error setting default payment method:', error)
      throw new Error('Failed to set default payment method')
    }
  }

  async deletePaymentMethod(userId: string, paymentMethodId: string): Promise<void> {
    try {
      if (!this.stripe) {
        throw new Error('Stripe not configured')
      }

      await this.stripe.paymentMethods.detach(paymentMethodId)
    } catch (error) {
      console.error('Error deleting payment method:', error)
      throw new Error('Failed to delete payment method')
    }
  }

  // Payment Processing
  async createPaymentIntent(
    userId: string,
    amount: number,
    currency: string,
    metadata: Record<string, any>
  ): Promise<PaymentIntent> {
    try {
      await connectDB()
      
      if (!this.stripe) {
        throw new Error('Stripe not configured')
      }

      if (!this.supportedCurrencies.includes(currency.toUpperCase())) {
        throw new Error('Unsupported currency')
      }

      const user = await User.findById(userId)
      if (!user) {
        throw new Error('User not found')
      }

      let customerId = user.stripeCustomerId
      if (!customerId) {
        const customer = await this.stripe.customers.create({
          email: user.email,
          metadata: { userId: userId }
        })
        customerId = customer.id
        
        await User.findByIdAndUpdate(userId, { stripeCustomerId: customerId })
      }

      const paymentIntent = await this.stripe.paymentIntents.create({
        amount: Math.round(amount * 100), // Convert to cents
        currency: currency.toLowerCase(),
        customer: customerId,
        metadata: {
          userId,
          ...metadata
        },
        automatic_payment_methods: {
          enabled: true
        }
      })

      const paymentIntentData: PaymentIntent = {
        id: paymentIntent.id,
        amount: amount,
        currency: currency,
        status: paymentIntent.status as any,
        paymentMethod: typeof paymentIntent.payment_method === 'string' ? paymentIntent.payment_method : paymentIntent.payment_method?.id || '',
        customer: customerId,
        metadata: paymentIntent.metadata,
        createdAt: new Date(paymentIntent.created * 1000),
        updatedAt: new Date()
      }

      return paymentIntentData
    } catch (error) {
      console.error('Error creating payment intent:', error)
      throw new Error('Failed to create payment intent')
    }
  }

  async confirmPayment(paymentIntentId: string, paymentMethodId?: string): Promise<PaymentIntent> {
    try {
      if (!this.stripe) {
        throw new Error('Stripe not configured')
      }

      let paymentIntent: Stripe.PaymentIntent
      
      if (paymentMethodId) {
        paymentIntent = await this.stripe.paymentIntents.confirm(paymentIntentId, {
          payment_method: paymentMethodId
        })
      } else {
        paymentIntent = await this.stripe.paymentIntents.confirm(paymentIntentId)
      }

      const paymentIntentData: PaymentIntent = {
        id: paymentIntent.id,
        amount: paymentIntent.amount / 100, // Convert from cents
        currency: paymentIntent.currency.toUpperCase(),
        status: paymentIntent.status as any,
        paymentMethod: typeof paymentIntent.payment_method === 'string' ? paymentIntent.payment_method : paymentIntent.payment_method?.id || '',
        customer: paymentIntent.customer as string,
        metadata: paymentIntent.metadata,
        createdAt: new Date(paymentIntent.created * 1000),
        updatedAt: new Date()
      }

      return paymentIntentData
    } catch (error) {
      console.error('Error confirming payment:', error)
      throw new Error('Failed to confirm payment')
    }
  }

  async processPayment(
    userId: string,
    amount: number,
    currency: string,
    paymentMethodId: string,
    metadata: Record<string, any>
  ): Promise<PaymentIntent> {
    try {
      // Create payment intent
      const paymentIntent = await this.createPaymentIntent(userId, amount, currency, metadata)
      
      // Confirm payment
      const confirmedPayment = await this.confirmPayment(paymentIntent.id, paymentMethodId)
      
      // Save payment to database
      await this.savePaymentToDatabase(confirmedPayment, userId, metadata)
      
      return confirmedPayment
    } catch (error) {
      console.error('Error processing payment:', error)
      throw new Error('Failed to process payment')
    }
  }

  // Subscription Management
  async createSubscription(
    userId: string,
    planId: string,
    paymentMethodId: string,
    metadata: Record<string, any>
  ): Promise<Subscription> {
    try {
      await connectDB()
      
      if (!this.stripe) {
        throw new Error('Stripe not configured')
      }

      const user = await User.findById(userId)
      if (!user) {
        throw new Error('User not found')
      }

      let customerId = user.stripeCustomerId
      if (!customerId) {
        const customer = await this.stripe.customers.create({
          email: user.email,
          metadata: { userId: userId }
        })
        customerId = customer.id
        
        await User.findByIdAndUpdate(userId, { stripeCustomerId: customerId })
      }

      // Create subscription
      const subscription = await this.stripe.subscriptions.create({
        customer: customerId,
        items: [{ price: planId }],
        default_payment_method: paymentMethodId,
        metadata: {
          userId,
          ...metadata
        },
        expand: ['latest_invoice.payment_intent']
      })

      const subscriptionData: Subscription = {
        id: subscription.id,
        customerId: customerId,
        planId: planId,
        status: subscription.status as any,
        currentPeriodStart: new Date((subscription as any).current_period_start * 1000),
        currentPeriodEnd: new Date((subscription as any).current_period_end * 1000),
        cancelAtPeriodEnd: subscription.cancel_at_period_end,
        metadata: subscription.metadata
      }

      return subscriptionData
    } catch (error) {
      console.error('Error creating subscription:', error)
      throw new Error('Failed to create subscription')
    }
  }

  async cancelSubscription(subscriptionId: string, cancelAtPeriodEnd: boolean = true): Promise<void> {
    try {
      if (!this.stripe) {
        throw new Error('Stripe not configured')
      }

      if (cancelAtPeriodEnd) {
        await this.stripe.subscriptions.update(subscriptionId, {
          cancel_at_period_end: true
        })
      } else {
        await this.stripe.subscriptions.cancel(subscriptionId)
      }
    } catch (error) {
      console.error('Error canceling subscription:', error)
      throw new Error('Failed to cancel subscription')
    }
  }

  async getSubscription(subscriptionId: string): Promise<Subscription | null> {
    try {
      if (!this.stripe) {
        throw new Error('Stripe not configured')
      }

      const subscription = await this.stripe.subscriptions.retrieve(subscriptionId)
      
      const subscriptionData: Subscription = {
        id: subscription.id,
        customerId: subscription.customer as string,
        planId: subscription.items.data[0]?.price.id || '',
        status: subscription.status as any,
        currentPeriodStart: new Date((subscription as any).current_period_start * 1000),
        currentPeriodEnd: new Date((subscription as any).current_period_end * 1000),
        cancelAtPeriodEnd: subscription.cancel_at_period_end,
        metadata: subscription.metadata
      }

      return subscriptionData
    } catch (error) {
      console.error('Error getting subscription:', error)
      return null
    }
  }

  // Refund Management
  async createRefund(
    paymentId: string,
    amount: number,
    reason: string,
    metadata: Record<string, any> = {}
  ): Promise<Refund> {
    try {
      if (!this.stripe) {
        throw new Error('Stripe not configured')
      }

      const refund = await this.stripe.refunds.create({
        payment_intent: paymentId,
        amount: Math.round(amount * 100), // Convert to cents
        reason: reason as any,
        metadata
      })

      const refundData: Refund = {
        id: refund.id,
        paymentId: paymentId,
        amount: amount,
        reason: reason,
        status: refund.status as any,
        metadata: refund.metadata || {},
        createdAt: new Date(refund.created * 1000)
      }

      // Save refund to database
      await this.saveRefundToDatabase(refundData)

      return refundData
    } catch (error) {
      console.error('Error creating refund:', error)
      throw new Error('Failed to create refund')
    }
  }

  // Payment Plans
  async createPaymentPlan(planData: Omit<PaymentPlan, 'id'>): Promise<PaymentPlan> {
    try {
      if (!this.stripe) {
        throw new Error('Stripe not configured')
      }

      const price = await this.stripe.prices.create({
        unit_amount: Math.round(planData.price * 100), // Convert to cents
        currency: planData.currency.toLowerCase(),
        recurring: planData.interval !== 'one-time' ? {
          interval: planData.interval as any
        } : undefined,
        product_data: {
          name: planData.name,
          metadata: planData.metadata
        }
      })

      const paymentPlan: PaymentPlan = {
        id: price.id,
        name: planData.name,
        description: planData.description,
        price: planData.price,
        currency: planData.currency,
        interval: planData.interval,
        features: planData.features,
        metadata: {
          ...planData.metadata,
          stripePriceId: price.id
        }
      }

      return paymentPlan
    } catch (error) {
      console.error('Error creating payment plan:', error)
      throw new Error('Failed to create payment plan')
    }
  }

  // Advanced Features
  async splitPayment(
    totalAmount: number,
    currency: string,
    splits: Array<{ userId: string; amount: number; percentage: number }>
  ): Promise<PaymentIntent[]> {
    try {
      const paymentIntents: PaymentIntent[] = []
      
      for (const split of splits) {
        const paymentIntent = await this.createPaymentIntent(
          split.userId,
          split.amount,
          currency,
          {
            type: 'split_payment',
            totalAmount,
            percentage: split.percentage,
            splits: splits.length
          }
        )
        paymentIntents.push(paymentIntent)
      }
      
      return paymentIntents
    } catch (error) {
      console.error('Error creating split payment:', error)
      throw new Error('Failed to create split payment')
    }
  }

  async createRecurringPayment(
    userId: string,
    amount: number,
    currency: string,
    interval: 'day' | 'week' | 'month' | 'year',
    metadata: Record<string, any>
  ): Promise<Subscription> {
    try {
      // Create a custom plan for recurring payment
      const planData: Omit<PaymentPlan, 'id'> = {
        name: `Recurring Payment - ${interval}`,
        description: `Recurring payment of ${amount} ${currency} every ${interval}`,
        price: amount,
        currency: currency,
        interval: interval as any,
        features: ['Recurring billing', 'Automatic payments'],
        metadata: {
          ...metadata,
          type: 'recurring_payment',
          interval
        }
      }

      const plan = await this.createPaymentPlan(planData)
      
      // Get user's default payment method
      const paymentMethods = await this.getPaymentMethods(userId)
      const defaultMethod = paymentMethods.find(pm => pm.isDefault)
      
      if (!defaultMethod) {
        throw new Error('No default payment method found')
      }

      // Create subscription
      const subscription = await this.createSubscription(
        userId,
        plan.id,
        defaultMethod.id,
        metadata
      )

      return subscription
    } catch (error) {
      console.error('Error creating recurring payment:', error)
      throw new Error('Failed to create recurring payment')
    }
  }

  // Database Operations
  private async savePaymentToDatabase(paymentIntent: PaymentIntent, userId: string, metadata: Record<string, any>): Promise<void> {
    try {
      const payment = new Payment({
        userId,
        amount: paymentIntent.amount,
        currency: paymentIntent.currency,
        status: paymentIntent.status,
        paymentMethod: paymentIntent.paymentMethod,
        stripePaymentIntentId: paymentIntent.id,
        metadata: {
          ...paymentIntent.metadata,
          ...metadata
        }
      })
      
      await payment.save()
    } catch (error) {
      console.error('Error saving payment to database:', error)
    }
  }

  private async saveRefundToDatabase(refund: Refund): Promise<void> {
    try {
      // Update payment status in database
      await Payment.findOneAndUpdate(
        { stripePaymentIntentId: refund.paymentId },
        { 
          status: 'refunded',
          refundedAt: new Date(),
          refundAmount: refund.amount
        }
      )
    } catch (error) {
      console.error('Error saving refund to database:', error)
    }
  }

  // Utility Methods
  public isStripeEnabled(): boolean {
    return this.stripe !== null
  }

  public getSupportedCurrencies(): string[] {
    return this.supportedCurrencies
  }

  public getPaymentGateways(): string[] {
    return this.paymentGateways
  }

  public async getPaymentStatus(paymentIntentId: string): Promise<string> {
    try {
      if (!this.stripe) {
        throw new Error('Stripe not configured')
      }

      const paymentIntent = await this.stripe.paymentIntents.retrieve(paymentIntentId)
      return paymentIntent.status
    } catch (error) {
      console.error('Error getting payment status:', error)
      throw new Error('Failed to get payment status')
    }
  }

  public async validatePaymentMethod(paymentMethodId: string): Promise<boolean> {
    try {
      if (!this.stripe) {
        throw new Error('Stripe not configured')
      }

      const paymentMethod = await this.stripe.paymentMethods.retrieve(paymentMethodId)
      return (paymentMethod as any).status === 'active'
    } catch (error) {
      console.error('Error validating payment method:', error)
      return false
    }
  }
}

export const advancedPaymentService = new AdvancedPaymentService() 