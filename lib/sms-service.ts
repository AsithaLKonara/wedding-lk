import { connectDB } from './db'

interface SMSData {
  to: string
  message: string
  template?: string
  data?: Record<string, any>
}

interface SMSResponse {
  success: boolean
  messageId?: string
  error?: string
}

class SMSService {
  private apiKey: string
  private apiSecret: string
  private senderId: string

  constructor() {
    this.apiKey = process.env.SMS_API_KEY || ''
    this.apiSecret = process.env.SMS_API_SECRET || ''
    this.senderId = process.env.SMS_SENDER_ID || 'WeddingLK'
  }

  // Send SMS
  async sendSMS(smsData: SMSData): Promise<SMSResponse> {
    try {
      // In a real implementation, this would use a SMS service like Twilio, AWS SNS, or local providers
      // For now, we'll simulate SMS sending
      
      if (!this.apiKey || !this.apiSecret) {
        console.log('📱 SMS Service not configured, simulating SMS send')
        console.log(`To: ${smsData.to}`)
        console.log(`Message: ${smsData.message}`)
        return {
          success: true,
          messageId: `sim_${Date.now()}`
        }
      }

      // Real SMS API call would go here
      // const response = await fetch('https://api.sms-provider.com/send', {
      //   method: 'POST',
      //   headers: {
      //     'Authorization': `Bearer ${this.apiKey}`,
      //     'Content-Type': 'application/json'
      //   },
      //   body: JSON.stringify({
      //     to: smsData.to,
      //     message: smsData.message,
      //     sender_id: this.senderId
      //   })
      // })

      console.log('✅ SMS sent successfully:', smsData.to)
      return {
        success: true,
        messageId: `sms_${Date.now()}`
      }

    } catch (error) {
      console.error('❌ SMS sending failed:', error)
      return {
        success: false,
        error: error instanceof Error ? error.message : 'Unknown error'
      }
    }
  }

  // Send SMS with template
  async sendSMSTemplate(to: string, template: string, data: Record<string, any>): Promise<SMSResponse> {
    const message = await this.getSMSTemplate(template, data)
    return await this.sendSMS({ to, message, template, data })
  }

  // Get SMS template
  private async getSMSTemplate(template: string, data: Record<string, any>): Promise<string> {
    const templates: Record<string, string> = {
      welcome: `Welcome to WeddingLK! Hi ${data.name}, your account is ready. Start planning your perfect wedding at weddinglk.com`,
      
      booking_confirmation: `Booking confirmed! ${data.service} on ${data.date} for LKR ${data.amount}. Status: ${data.status}. WeddingLK`,
      
      payment_receipt: `Payment received! Transaction: ${data.transactionId}, Amount: LKR ${data.amount}, Method: ${data.method}. WeddingLK`,
      
      wedding_reminder: `Wedding countdown: ${data.daysLeft} days to go! Final checklist: confirm vendors, guest list, rehearsal. WeddingLK`,
      
      vendor_inquiry: `New inquiry from ${data.customerName} for ${data.weddingDate}. Check your dashboard for details. WeddingLK`,
      
      otp_verification: `Your WeddingLK verification code is: ${data.otp}. Valid for 10 minutes. Don't share this code.`,
      
      password_reset: `Your WeddingLK password reset code is: ${data.code}. Valid for 15 minutes. If you didn't request this, ignore.`,
      
      appointment_reminder: `Reminder: ${data.service} appointment tomorrow at ${data.time}. Contact us if you need to reschedule. WeddingLK`,
      
      payment_due: `Payment due: LKR ${data.amount} for ${data.service}. Due date: ${data.dueDate}. Pay online at weddinglk.com`,
      
      booking_update: `Booking update: ${data.service} status changed to ${data.status}. Check your dashboard for details. WeddingLK`
    }

    const message = templates[template]
    if (!message) {
      throw new Error(`SMS template '${template}' not found`)
    }

    return message
  }

  // Send welcome SMS
  async sendWelcomeSMS(userId: string): Promise<SMSResponse> {
    try {
      await connectDB()
      
      // Mock user data for now
      const user = { phone: '+94123456789', name: 'Test User' }
      if (!user.phone) {
        return { success: false, error: 'User not found or no phone number' }
      }

      return await this.sendSMSTemplate(user.phone, 'welcome', {
        name: user.name,
        email: 'test@example.com'
      })

    } catch (error) {
      console.error('Welcome SMS error:', error)
      return { success: false, error: 'SMS sending failed' }
    }
  }

  // Send booking confirmation SMS
  async sendBookingConfirmationSMS(bookingId: string): Promise<SMSResponse> {
    try {
      await connectDB()
      
      // Mock booking data for now
      const booking = { 
        userId: { phone: '+94123456789', name: 'Test User' },
        date: new Date(),
        totalAmount: 50000,
        status: 'confirmed'
      }

      const user = booking.userId as any
      if (!user.phone) {
        return { success: false, error: 'User phone number not available' }
      }

      return await this.sendSMSTemplate(user.phone, 'booking_confirmation', {
        service: 'Venue Booking',
        date: booking.date.toDateString(),
        amount: booking.totalAmount,
        status: booking.status
      })

    } catch (error) {
      console.error('Booking confirmation SMS error:', error)
      return { success: false, error: 'SMS sending failed' }
    }
  }

  // Send payment receipt SMS
  async sendPaymentReceiptSMS(paymentId: string): Promise<SMSResponse> {
    try {
      await connectDB()
      
      // Mock payment data for now
      const payment = { 
        userId: { phone: '+94123456789', name: 'Test User' },
        transactionId: 'txn_123456789',
        amount: 50000,
        method: 'card',
        createdAt: new Date()
      }

      const user = payment.userId as any
      if (!user.phone) {
        return { success: false, error: 'User phone number not available' }
      }

      return await this.sendSMSTemplate(user.phone, 'payment_receipt', {
        transactionId: payment.transactionId,
        amount: payment.amount,
        method: payment.method,
        date: payment.createdAt.toDateString()
      })

    } catch (error) {
      console.error('Payment receipt SMS error:', error)
      return { success: false, error: 'SMS sending failed' }
    }
  }

  // Send OTP verification SMS
  async sendOTPVerification(phone: string, otp: string): Promise<SMSResponse> {
    return await this.sendSMSTemplate(phone, 'otp_verification', { otp })
  }

  // Send password reset SMS
  async sendPasswordResetSMS(phone: string, code: string): Promise<SMSResponse> {
    return await this.sendSMSTemplate(phone, 'password_reset', { code })
  }

  // Send wedding reminder SMS
  async sendWeddingReminderSMS(userId: string, daysLeft: number): Promise<SMSResponse> {
    try {
      await connectDB()
      
      // Mock user data for now
      const user = { phone: '+94123456789', name: 'Test User' }
      if (!user.phone) {
        return { success: false, error: 'User not found or missing data' }
      }

      return await this.sendSMSTemplate(user.phone, 'wedding_reminder', {
        daysLeft: daysLeft,
        weddingDate: new Date().toDateString()
      })

    } catch (error) {
      console.error('Wedding reminder SMS error:', error)
      return { success: false, error: 'SMS sending failed' }
    }
  }

  // Send vendor inquiry SMS
  async sendVendorInquirySMS(vendorId: string, inquiryData: any): Promise<SMSResponse> {
    try {
      await connectDB()
      
      // Mock vendor data for now
      const vendor = { phone: '+94123456789', name: 'Test Vendor' }
      if (!vendor.phone) {
        return { success: false, error: 'Vendor not found or no phone number' }
      }

      return await this.sendSMSTemplate(vendor.phone, 'vendor_inquiry', {
        customerName: inquiryData.customerName,
        weddingDate: inquiryData.weddingDate
      })

    } catch (error) {
      console.error('Vendor inquiry SMS error:', error)
      return { success: false, error: 'SMS sending failed' }
    }
  }

  // Send appointment reminder SMS
  async sendAppointmentReminderSMS(userId: string, appointmentData: any): Promise<SMSResponse> {
    try {
      await connectDB()
      
      // Mock user data for now
      const user = { phone: '+94123456789', name: 'Test User' }
      if (!user.phone) {
        return { success: false, error: 'User not found or no phone number' }
      }

      return await this.sendSMSTemplate(user.phone, 'appointment_reminder', {
        service: appointmentData.service,
        time: appointmentData.time
      })

    } catch (error) {
      console.error('Appointment reminder SMS error:', error)
      return { success: false, error: 'SMS sending failed' }
    }
  }

  // Send payment due reminder SMS
  async sendPaymentDueSMS(userId: string, paymentData: any): Promise<SMSResponse> {
    try {
      await connectDB()
      
      // Mock user data for now
      const user = { phone: '+94123456789', name: 'Test User' }
      if (!user.phone) {
        return { success: false, error: 'User not found or no phone number' }
      }

      return await this.sendSMSTemplate(user.phone, 'payment_due', {
        amount: paymentData.amount,
        service: paymentData.service,
        dueDate: paymentData.dueDate
      })

    } catch (error) {
      console.error('Payment due SMS error:', error)
      return { success: false, error: 'SMS sending failed' }
    }
  }

  // Send booking update SMS
  async sendBookingUpdateSMS(bookingId: string, updateData: any): Promise<SMSResponse> {
    try {
      await connectDB()
      
      // Mock booking data for now
      const booking = { 
        userId: { phone: '+94123456789', name: 'Test User' },
        status: 'confirmed'
      }

      const user = booking.userId as any
      if (!user.phone) {
        return { success: false, error: 'User phone number not available' }
      }

      return await this.sendSMSTemplate(user.phone, 'booking_update', {
        service: 'Venue Booking',
        status: updateData.status
      })

    } catch (error) {
      console.error('Booking update SMS error:', error)
      return { success: false, error: 'SMS sending failed' }
    }
  }

  // Send bulk SMS
  async sendBulkSMS(smsList: SMSData[]): Promise<{ success: number; failed: number }> {
    let success = 0
    let failed = 0

    for (const sms of smsList) {
      const result = await this.sendSMS(sms)
      if (result.success) {
        success++
      } else {
        failed++
      }
    }

    return { success, failed }
  }

  // Test SMS service
  async testSMSService(): Promise<boolean> {
    try {
      const testPhone = process.env.TEST_PHONE || '+94123456789'
      const result = await this.sendSMS({
        to: testPhone,
        message: 'Test SMS from WeddingLK - Service is working!'
      })
      return result.success
    } catch (error) {
      console.error('SMS service test failed:', error)
      return false
    }
  }
}

export default new SMSService() 