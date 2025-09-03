import Stripe from 'stripe'
import crypto from 'crypto'

// Initialize Stripe
const stripe = new Stripe(process.env.STRIPE_SECRET_KEY || '', {
  apiVersion: '2025-06-30.basil',
})

// PayHere configuration
const PAYHERE_MERCHANT_ID = process.env.PAYHERE_MERCHANT_ID || ''
const PAYHERE_SECRET_KEY = process.env.PAYHERE_SECRET_KEY || ''
const PAYHERE_SANDBOX = process.env.PAYHERE_SANDBOX === 'true'

// Payment types
export type PaymentMethod = 'stripe' | 'payhere' | 'ezcash' | 'mcash' | 'bank_transfer'
export type PaymentStatus = 'pending' | 'processing' | 'completed' | 'failed' | 'cancelled'

// Payment request interface
export interface PaymentRequest {
  amount: number
  currency: string
  description: string
  customerEmail: string
  customerName?: string
  customerPhone?: string
  metadata?: Record<string, string>
  paymentMethod: PaymentMethod
  returnUrl?: string
  cancelUrl?: string
}

// Payment response interface
export interface PaymentResponse {
  success: boolean
  paymentId: string
  status: PaymentStatus
  paymentUrl?: string
  error?: string
  metadata?: Record<string, any>
}

// Stripe payment processor
export class StripePaymentProcessor {
  static async createPaymentIntent(request: PaymentRequest): Promise<PaymentResponse> {
    try {
      const paymentIntent = await stripe.paymentIntents.create({
        amount: request.amount * 100, // Convert to cents
        currency: request.currency.toLowerCase(),
        description: request.description,
        metadata: {
          customerEmail: request.customerEmail,
          customerName: request.customerName || '',
          ...request.metadata
        },
        receipt_email: request.customerEmail,
      })

      return {
        success: true,
        paymentId: paymentIntent.id,
        status: 'pending',
        metadata: {
          clientSecret: paymentIntent.client_secret,
          amount: paymentIntent.amount,
          currency: paymentIntent.currency,
        }
      }
    } catch (error) {
      return {
        success: false,
        paymentId: '',
        status: 'failed',
        error: error instanceof Error ? error.message : 'Stripe payment failed'
      }
    }
  }

  static async confirmPayment(paymentIntentId: string): Promise<PaymentResponse> {
    try {
      const paymentIntent = await stripe.paymentIntents.retrieve(paymentIntentId)
      
      return {
        success: paymentIntent.status === 'succeeded',
        paymentId: paymentIntent.id,
        status: paymentIntent.status === 'succeeded' ? 'completed' : 'failed',
        metadata: {
          amount: paymentIntent.amount,
          currency: paymentIntent.currency,
          status: paymentIntent.status
        }
      }
    } catch (error) {
      return {
        success: false,
        paymentId: paymentIntentId,
        status: 'failed',
        error: error instanceof Error ? error.message : 'Payment confirmation failed'
      }
    }
  }
}

// PayHere payment processor
export class PayHerePaymentProcessor {
  static generateSignature(params: Record<string, string>): string {
    const sortedParams = Object.keys(params)
      .filter(key => key !== 'signature')
      .sort()
      .map(key => `${key}=${params[key]}`)
      .join('&')

    return crypto
      .createHmac('sha256', PAYHERE_SECRET_KEY)
      .update(sortedParams)
      .digest('hex')
  }

  static async createPayment(request: PaymentRequest): Promise<PaymentResponse> {
    try {
      const orderId = `order_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`
      
      const params: Record<string, string> = {
        merchant_id: PAYHERE_MERCHANT_ID,
        return_url: request.returnUrl || `${process.env.NEXT_PUBLIC_BASE_URL}/payment/success`,
        cancel_url: request.cancelUrl || `${process.env.NEXT_PUBLIC_BASE_URL}/payment/cancel`,
        notify_url: `${process.env.NEXT_PUBLIC_BASE_URL}/api/payments/webhook`,
        order_id: orderId,
        items: request.description,
        currency: request.currency,
        amount: request.amount.toString(),
        first_name: request.customerName?.split(' ')[0] || 'Customer',
        last_name: request.customerName?.split(' ').slice(1).join(' ') || '',
        email: request.customerEmail,
        phone: request.customerPhone || '',
        address: '',
        city: '',
        country: 'Sri Lanka',
        custom_1: JSON.stringify(request.metadata || {}),
      }

      const signature = this.generateSignature(params)
      params.signature = signature

      const baseUrl = PAYHERE_SANDBOX 
        ? 'https://sandbox.payhere.lk/pay/checkout'
        : 'https://www.payhere.lk/pay/checkout'

      const paymentUrl = `${baseUrl}?${new URLSearchParams(params).toString()}`

      return {
        success: true,
        paymentId: orderId,
        status: 'pending',
        paymentUrl,
        metadata: {
          orderId,
          amount: request.amount,
          currency: request.currency,
          sandbox: PAYHERE_SANDBOX
        }
      }
    } catch (error) {
      return {
        success: false,
        paymentId: '',
        status: 'failed',
        error: error instanceof Error ? error.message : 'PayHere payment failed'
      }
    }
  }

  static verifyWebhook(data: any, signature: string): boolean {
    try {
      const calculatedSignature = this.generateSignature(data)
      return calculatedSignature === signature
    } catch (error) {
      return false
    }
  }
}

// eZ Cash payment processor
export class EzCashPaymentProcessor {
  static async createPayment(request: PaymentRequest): Promise<PaymentResponse> {
    try {
      const paymentId = `ez_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`
      
      // Mock eZ Cash payment creation
      // In production, this would integrate with eZ Cash API
      return {
        success: true,
        paymentId,
        status: 'pending',
        metadata: {
          amount: request.amount,
          currency: request.currency,
          customerPhone: request.customerPhone,
          paymentMethod: 'ezcash'
        }
      }
    } catch (error) {
      return {
        success: false,
        paymentId: '',
        status: 'failed',
        error: error instanceof Error ? error.message : 'eZ Cash payment failed'
      }
    }
  }
}

// mCash payment processor
export class MCashPaymentProcessor {
  static async createPayment(request: PaymentRequest): Promise<PaymentResponse> {
    try {
      const paymentId = `mc_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`
      
      // Mock mCash payment creation
      // In production, this would integrate with mCash API
      return {
        success: true,
        paymentId,
        status: 'pending',
        metadata: {
          amount: request.amount,
          currency: request.currency,
          customerPhone: request.customerPhone,
          paymentMethod: 'mcash'
        }
      }
    } catch (error) {
      return {
        success: false,
        paymentId: '',
        status: 'failed',
        error: error instanceof Error ? error.message : 'mCash payment failed'
      }
    }
  }
}

// Bank transfer payment processor
export class BankTransferProcessor {
  static async createPayment(request: PaymentRequest): Promise<PaymentResponse> {
    try {
      const paymentId = `bt_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`
      
      // Generate bank transfer details
      const bankDetails = {
        accountNumber: '1234567890',
        accountName: 'WeddingLK Ltd',
        bank: 'Commercial Bank of Ceylon',
        branch: 'Colombo',
        reference: paymentId,
        amount: request.amount,
        currency: request.currency
      }

      return {
        success: true,
        paymentId,
        status: 'pending',
        metadata: {
          bankDetails,
          paymentMethod: 'bank_transfer'
        }
      }
    } catch (error) {
      return {
        success: false,
        paymentId: '',
        status: 'failed',
        error: error instanceof Error ? error.message : 'Bank transfer failed'
      }
    }
  }
}

// Main payment gateway class
export class PaymentGateway {
  static async processPayment(request: PaymentRequest): Promise<PaymentResponse> {
    try {
      switch (request.paymentMethod) {
        case 'stripe':
          return await StripePaymentProcessor.createPaymentIntent(request)
        
        case 'payhere':
          return await PayHerePaymentProcessor.createPayment(request)
        
        case 'ezcash':
          return await EzCashPaymentProcessor.createPayment(request)
        
        case 'mcash':
          return await MCashPaymentProcessor.createPayment(request)
        
        case 'bank_transfer':
          return await BankTransferProcessor.createPayment(request)
        
        default:
          throw new Error(`Unsupported payment method: ${request.paymentMethod}`)
      }
    } catch (error) {
      return {
        success: false,
        paymentId: '',
        status: 'failed',
        error: error instanceof Error ? error.message : 'Payment processing failed'
      }
    }
  }

  static async confirmPayment(paymentId: string, paymentMethod: PaymentMethod): Promise<PaymentResponse> {
    try {
      switch (paymentMethod) {
        case 'stripe':
          return await StripePaymentProcessor.confirmPayment(paymentId)
        
        default:
          // For other payment methods, return a mock confirmation
          return {
            success: true,
            paymentId,
            status: 'completed',
            metadata: {
              confirmedAt: new Date().toISOString(),
              paymentMethod
            }
          }
      }
    } catch (error) {
      return {
        success: false,
        paymentId,
        status: 'failed',
        error: error instanceof Error ? error.message : 'Payment confirmation failed'
      }
    }
  }
} 