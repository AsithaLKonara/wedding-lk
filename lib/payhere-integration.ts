import * as crypto from 'crypto'

interface PayHereConfig {
  merchantId: string
  secretKey: string
  sandboxMode: boolean
}

interface PayHerePaymentRequest {
  merchant_id: string
  return_url: string
  cancel_url: string
  notify_url: string
  first_name: string
  last_name: string
  email: string
  phone: string
  address: string
  city: string
  country: string
  order_id: string
  items: string
  currency: string
  amount: number
  custom_1?: string
  custom_2?: string
  hash: string
}

interface PayHereInstallmentPlan {
  planId: string
  name: string
  installments: number
  interestRate: number
  processingFee: number
  minAmount: number
  maxAmount: number
}

export class PayHereIntegration {
  private config: PayHereConfig
  private baseUrl: string

  constructor() {
    this.config = {
      merchantId: process.env.PAYHERE_MERCHANT_ID || '',
      secretKey: process.env.PAYHERE_SECRET_KEY || '',
      sandboxMode: process.env.PAYHERE_SANDBOX_MODE === 'true'
    }
    
    this.baseUrl = this.config.sandboxMode 
      ? 'https://sandbox.payhere.lk/pay/checkout'
      : 'https://www.payhere.lk/pay/checkout'
  }

  // Create payment request for various payment methods
  async createPaymentRequest(paymentData: {
    orderId: string
    amount: number
    currency: string
    customer: {
      firstName: string
      lastName: string
      email: string
      phone: string
      address: string
      city: string
    }
    items: string
    returnUrl: string
    cancelUrl: string
    notifyUrl: string
    customFields?: Record<string, string>
  }): Promise<PayHerePaymentRequest> {
    
    const paymentRequest: PayHerePaymentRequest = {
      merchant_id: this.config.merchantId,
      return_url: paymentData.returnUrl,
      cancel_url: paymentData.cancelUrl,
      notify_url: paymentData.notifyUrl,
      first_name: paymentData.customer.firstName,
      last_name: paymentData.customer.lastName,
      email: paymentData.customer.email,
      phone: paymentData.customer.phone,
      address: paymentData.customer.address,
      city: paymentData.customer.city,
      country: 'Sri Lanka',
      order_id: paymentData.orderId,
      items: paymentData.items,
      currency: paymentData.currency,
      amount: paymentData.amount,
      custom_1: paymentData.customFields?.custom_1 || '',
      custom_2: paymentData.customFields?.custom_2 || '',
      hash: ''
    }

    // Generate hash for security
    paymentRequest.hash = this.generateHash(paymentRequest)

    return paymentRequest
  }

  // Create installment payment plan
  async createInstallmentPayment(paymentData: {
    orderId: string
    totalAmount: number
    installments: number
    customer: any
    items: string
    returnUrl: string
    cancelUrl: string
    notifyUrl: string
  }): Promise<{
    paymentUrl: string
    installmentPlan: PayHereInstallmentPlan
    monthlyPayment: number
  }> {
    
    const installmentPlan = this.getInstallmentPlan(paymentData.installments, paymentData.totalAmount)
    const monthlyPayment = this.calculateMonthlyPayment(paymentData.totalAmount, installmentPlan)

    const paymentRequest = await this.createPaymentRequest({
      orderId: `${paymentData.orderId}_INST_${installmentPlan.planId}`,
      amount: monthlyPayment,
      currency: 'LKR',
      customer: paymentData.customer,
      items: `${paymentData.items} (Installment ${installmentPlan.planId})`,
      returnUrl: paymentData.returnUrl,
      cancelUrl: paymentData.cancelUrl,
      notifyUrl: paymentData.notifyUrl,
      customFields: {
        custom_1: `installment_plan:${installmentPlan.planId}`,
        custom_2: `total_amount:${paymentData.totalAmount}:installments:${installmentPlan.installments}`
      }
    })

    const paymentUrl = this.buildPaymentUrl(paymentRequest)

    return {
      paymentUrl,
      installmentPlan,
      monthlyPayment
    }
  }

  // Create eZ Cash payment
  async createEzCashPayment(paymentData: {
    orderId: string
    amount: number
    customer: any
    items: string
    returnUrl: string
    cancelUrl: string
    notifyUrl: string
  }): Promise<{
    paymentUrl: string
    paymentMethod: string
  }> {
    
    const paymentRequest = await this.createPaymentRequest({
      orderId: `${paymentData.orderId}_EZCASH`,
      amount: paymentData.amount,
      currency: 'LKR',
      customer: paymentData.customer,
      items: `${paymentData.items} (eZ Cash)`,
      returnUrl: paymentData.returnUrl,
      cancelUrl: paymentData.cancelUrl,
      notifyUrl: paymentData.notifyUrl,
      customFields: {
        custom_1: 'payment_method:ezcash'
      }
    })

    const paymentUrl = this.buildPaymentUrl(paymentRequest)

    return {
      paymentUrl,
      paymentMethod: 'eZ Cash'
    }
  }

  // Create mCash payment
  async createMCashPayment(paymentData: {
    orderId: string
    amount: number
    customer: any
    items: string
    returnUrl: string
    cancelUrl: string
    notifyUrl: string
  }): Promise<{
    paymentUrl: string
    paymentMethod: string
  }> {
    
    const paymentRequest = await this.createPaymentRequest({
      orderId: `${paymentData.orderId}_MCASH`,
      amount: paymentData.amount,
      currency: 'LKR',
      customer: paymentData.customer,
      items: `${paymentData.items} (mCash)`,
      returnUrl: paymentData.returnUrl,
      cancelUrl: paymentData.cancelUrl,
      notifyUrl: paymentData.notifyUrl,
      customFields: {
        custom_1: 'payment_method:mcash'
      }
    })

    const paymentUrl = this.buildPaymentUrl(paymentRequest)

    return {
      paymentUrl,
      paymentMethod: 'mCash'
    }
  }

  // Create bank transfer payment
  async createBankTransferPayment(paymentData: {
    orderId: string
    amount: number
    customer: any
    items: string
    returnUrl: string
    cancelUrl: string
    notifyUrl: string
  }): Promise<{
    paymentUrl: string
    paymentMethod: string
    bankDetails: any
  }> {
    
    const paymentRequest = await this.createPaymentRequest({
      orderId: `${paymentData.orderId}_BANK`,
      amount: paymentData.amount,
      currency: 'LKR',
      customer: paymentData.customer,
      items: `${paymentData.items} (Bank Transfer)`,
      returnUrl: paymentData.returnUrl,
      cancelUrl: paymentData.cancelUrl,
      notifyUrl: paymentData.notifyUrl,
      customFields: {
        custom_1: 'payment_method:bank_transfer'
      }
    })

    const paymentUrl = this.buildPaymentUrl(paymentRequest)

    const bankDetails = {
      bankName: 'Commercial Bank of Ceylon',
      accountNumber: '1234567890',
      accountName: 'WeddingLK (Pvt) Ltd',
      branch: 'Colombo 03',
      swiftCode: 'CCEYLKLX',
      reference: paymentData.orderId
    }

    return {
      paymentUrl,
      paymentMethod: 'Bank Transfer',
      bankDetails
    }
  }

  // Verify payment notification
  verifyPaymentNotification(notificationData: any): {
    isValid: boolean
    paymentStatus: string
    orderId: string
    amount: number
    transactionId: string
  } {
    try {
      const receivedHash = notificationData.hash
      const calculatedHash = this.generateHash(notificationData)

      const isValid = receivedHash === calculatedHash

      return {
        isValid,
        paymentStatus: notificationData.payment_status || 'unknown',
        orderId: notificationData.order_id || '',
        amount: parseFloat(notificationData.payhere_amount || '0'),
        transactionId: notificationData.payment_id || ''
      }
    } catch (error) {
      console.error('Payment verification error:', error)
      return {
        isValid: false,
        paymentStatus: 'verification_failed',
        orderId: '',
        amount: 0,
        transactionId: ''
      }
    }
  }

  // Get available installment plans
  getAvailableInstallmentPlans(): PayHereInstallmentPlan[] {
    return [
      {
        planId: '3_MONTHS',
        name: '3 Months Installment',
        installments: 3,
        interestRate: 0,
        processingFee: 500,
        minAmount: 50000,
        maxAmount: 500000
      },
      {
        planId: '6_MONTHS',
        name: '6 Months Installment',
        installments: 6,
        interestRate: 2.5,
        processingFee: 750,
        minAmount: 100000,
        maxAmount: 1000000
      },
      {
        planId: '12_MONTHS',
        name: '12 Months Installment',
        installments: 12,
        interestRate: 5.0,
        processingFee: 1000,
        minAmount: 200000,
        maxAmount: 2000000
      }
    ]
  }

  // Helper methods
  private generateHash(data: any): string {
    const hashString = Object.keys(data)
      .filter(key => key !== 'hash')
      .sort()
      .map(key => `${key}=${data[key]}`)
      .join('&') + this.config.secretKey

    return crypto.createHash('md5').update(hashString).digest('hex').toUpperCase()
  }

  public buildPaymentUrl(paymentRequest: PayHerePaymentRequest): string {
    const params = new URLSearchParams()
    
    Object.entries(paymentRequest).forEach(([key, value]) => {
      if (value) {
        params.append(key, value.toString())
      }
    })

    return `${this.baseUrl}?${params.toString()}`
  }

  private getInstallmentPlan(installments: number, amount: number): PayHereInstallmentPlan {
    const plans = this.getAvailableInstallmentPlans()
    const plan = plans.find(p => p.installments === installments && 
                                amount >= p.minAmount && 
                                amount <= p.maxAmount)
    
    if (!plan) {
      throw new Error(`No suitable installment plan found for ${installments} installments and amount ${amount}`)
    }

    return plan
  }

  private calculateMonthlyPayment(totalAmount: number, plan: PayHereInstallmentPlan): number {
    const interestAmount = (totalAmount * plan.interestRate) / 100
    const totalWithInterest = totalAmount + interestAmount + plan.processingFee
    return Math.ceil(totalWithInterest / plan.installments)
  }

  // Get payment status
  async getPaymentStatus(orderId: string): Promise<{
    status: string
    amount: number
    transactionId: string
    paymentMethod: string
    paidAt?: Date
  }> {
    // This would typically make an API call to PayHere
    // For now, return mock data
    return {
      status: 'completed',
      amount: 0,
      transactionId: `txn_${Date.now()}`,
      paymentMethod: 'credit_card',
      paidAt: new Date()
    }
  }

  // Process refund
  async processRefund(transactionId: string, amount: number, reason: string): Promise<{
    success: boolean
    refundId: string
    message: string
  }> {
    // This would make an API call to PayHere for refund
    return {
      success: true,
      refundId: `refund_${Date.now()}`,
      message: 'Refund processed successfully'
    }
  }
}

export const payHereIntegration = new PayHereIntegration() 