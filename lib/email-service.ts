import nodemailer from 'nodemailer'
import { connectDB } from './db'

interface EmailTemplate {
  subject: string
  html: string
  text: string
}

interface EmailData {
  to: string
  template: string
  data: Record<string, any>
  attachments?: Array<{
    filename: string
    content: Buffer
    contentType: string
  }>
}

class EmailService {
  private transporter: nodemailer.Transporter | null = null

  constructor() {
    this.initializeTransporter()
  }

  private initializeTransporter() {
    // Configure email transporter
    this.transporter = nodemailer.createTransport({
      host: process.env.SMTP_HOST || 'smtp.gmail.com',
      port: parseInt(process.env.SMTP_PORT || '587'),
      secure: false,
      auth: {
        user: process.env.SMTP_USER,
        pass: process.env.SMTP_PASS
      }
    })
  }

  // Send email with template
  async sendEmail(emailData: EmailData): Promise<boolean> {
    try {
      if (!this.transporter) {
        console.error('Email transporter not initialized')
        return false
      }

      const template = await this.getEmailTemplate(emailData.template, emailData.data)
      
      const mailOptions = {
        from: process.env.SMTP_FROM || 'WeddingLK <noreply@weddinglk.com>',
        to: emailData.to,
        subject: template.subject,
        html: template.html,
        text: template.text,
        attachments: emailData.attachments
      }

      const result = await this.transporter.sendMail(mailOptions)
      console.log('✅ Email sent successfully:', result.messageId)
      return true

    } catch (error) {
      console.error('❌ Email sending failed:', error)
      return false
    }
  }

  // Get email template
  private async getEmailTemplate(templateName: string, data: Record<string, any>): Promise<EmailTemplate> {
    const templates: Record<string, EmailTemplate> = {
      welcome: {
        subject: 'Welcome to WeddingLK! 🎉',
        html: `
          <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
            <h1 style="color: #ff6b6b;">Welcome to WeddingLK!</h1>
            <p>Hi ${data.name},</p>
            <p>Welcome to WeddingLK - your complete wedding planning platform!</p>
            <p>We're excited to help you create your perfect wedding day.</p>
            <div style="background-color: #f8f9fa; padding: 20px; border-radius: 8px; margin: 20px 0;">
              <h3>Getting Started:</h3>
              <ul>
                <li>Browse venues and vendors</li>
                <li>Create your wedding timeline</li>
                <li>Connect with wedding professionals</li>
                <li>Track your budget and bookings</li>
              </ul>
            </div>
            <p>Best regards,<br>The WeddingLK Team</p>
          </div>
        `,
        text: `Welcome to WeddingLK! Hi ${data.name}, Welcome to WeddingLK - your complete wedding planning platform!`
      },

      booking_confirmation: {
        subject: 'Booking Confirmation - WeddingLK',
        html: `
          <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
            <h1 style="color: #4ecdc4;">Booking Confirmation</h1>
            <p>Hi ${data.name},</p>
            <p>Your booking has been confirmed!</p>
            <div style="background-color: #f8f9fa; padding: 20px; border-radius: 8px; margin: 20px 0;">
              <h3>Booking Details:</h3>
              <p><strong>Service:</strong> ${data.service}</p>
              <p><strong>Date:</strong> ${data.date}</p>
              <p><strong>Amount:</strong> LKR ${data.amount}</p>
              <p><strong>Status:</strong> ${data.status}</p>
            </div>
            <p>We'll keep you updated on any changes.</p>
            <p>Best regards,<br>The WeddingLK Team</p>
          </div>
        `,
        text: `Booking Confirmation - Hi ${data.name}, Your booking has been confirmed!`
      },

      payment_receipt: {
        subject: 'Payment Receipt - WeddingLK',
        html: `
          <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
            <h1 style="color: #45b7d1;">Payment Receipt</h1>
            <p>Hi ${data.name},</p>
            <p>Thank you for your payment!</p>
            <div style="background-color: #f8f9fa; padding: 20px; border-radius: 8px; margin: 20px 0;">
              <h3>Payment Details:</h3>
              <p><strong>Transaction ID:</strong> ${data.transactionId}</p>
              <p><strong>Amount:</strong> LKR ${data.amount}</p>
              <p><strong>Method:</strong> ${data.method}</p>
              <p><strong>Date:</strong> ${data.date}</p>
            </div>
            <p>Your payment has been processed successfully.</p>
            <p>Best regards,<br>The WeddingLK Team</p>
          </div>
        `,
        text: `Payment Receipt - Hi ${data.name}, Thank you for your payment!`
      },

      wedding_reminder: {
        subject: 'Wedding Countdown - ${data.daysLeft} days to go!',
        html: `
          <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
            <h1 style="color: #ffa726;">Wedding Countdown</h1>
            <p>Hi ${data.name},</p>
            <p>Only <strong>${data.daysLeft} days</strong> until your big day!</p>
            <div style="background-color: #f8f9fa; padding: 20px; border-radius: 8px; margin: 20px 0;">
              <h3>Final Checklist:</h3>
              <ul>
                <li>Confirm all vendor bookings</li>
                <li>Finalize guest list</li>
                <li>Plan rehearsal dinner</li>
                <li>Pack for honeymoon</li>
              </ul>
            </div>
            <p>Everything is going to be perfect!</p>
            <p>Best regards,<br>The WeddingLK Team</p>
          </div>
        `,
        text: `Wedding Countdown - Hi ${data.name}, Only ${data.daysLeft} days until your big day!`
      },

      vendor_inquiry: {
        subject: 'New Vendor Inquiry - WeddingLK',
        html: `
          <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
            <h1 style="color: #96ceb4;">New Vendor Inquiry</h1>
            <p>Hi ${data.vendorName},</p>
            <p>You have a new inquiry from ${data.customerName}!</p>
            <div style="background-color: #f8f9fa; padding: 20px; border-radius: 8px; margin: 20px 0;">
              <h3>Inquiry Details:</h3>
              <p><strong>Customer:</strong> ${data.customerName}</p>
              <p><strong>Email:</strong> ${data.customerEmail}</p>
              <p><strong>Phone:</strong> ${data.customerPhone}</p>
              <p><strong>Wedding Date:</strong> ${data.weddingDate}</p>
              <p><strong>Message:</strong> ${data.message}</p>
            </div>
            <p>Please respond to this inquiry as soon as possible.</p>
            <p>Best regards,<br>The WeddingLK Team</p>
          </div>
        `,
        text: `New Vendor Inquiry - Hi ${data.vendorName}, You have a new inquiry from ${data.customerName}!`
      }
    }

    const template = templates[templateName]
    if (!template) {
      throw new Error(`Email template '${templateName}' not found`)
    }

    return template
  }

  // Send welcome email
  async sendWelcomeEmail(userId: string): Promise<boolean> {
    try {
      await connectDB()
      
      // Mock user data for now
      const user = { email: 'test@example.com', name: 'Test User' }
      
      return await this.sendEmail({
        to: user.email,
        template: 'welcome',
        data: {
          name: user.name,
          email: user.email
        }
      })

    } catch (error) {
      console.error('Welcome email error:', error)
      return false
    }
  }

  // Send booking confirmation
  async sendBookingConfirmation(bookingId: string): Promise<boolean> {
    try {
      await connectDB()
      
      // Mock booking data for now
      const booking = { 
        userId: { email: 'test@example.com', name: 'Test User' },
        date: new Date(),
        totalAmount: 50000,
        status: 'confirmed'
      }
      
      const user = booking.userId as any
      
      return await this.sendEmail({
        to: user.email,
        template: 'booking_confirmation',
        data: {
          name: user.name,
          service: 'Venue Booking',
          date: booking.date.toDateString(),
          amount: booking.totalAmount,
          status: booking.status
        }
      })

    } catch (error) {
      console.error('Booking confirmation email error:', error)
      return false
    }
  }

  // Send payment receipt
  async sendPaymentReceipt(paymentId: string): Promise<boolean> {
    try {
      await connectDB()
      
      // Mock payment data for now
      const payment = { 
        userId: { email: 'test@example.com', name: 'Test User' },
        transactionId: 'txn_123456789',
        amount: 50000,
        method: 'card',
        createdAt: new Date()
      }
      
      const user = payment.userId as any
      
      return await this.sendEmail({
        to: user.email,
        template: 'payment_receipt',
        data: {
          name: user.name,
          transactionId: payment.transactionId,
          amount: payment.amount,
          method: payment.method,
          date: payment.createdAt.toDateString()
        }
      })

    } catch (error) {
      console.error('Payment receipt email error:', error)
      return false
    }
  }

  // Send wedding reminder
  async sendWeddingReminder(userId: string, daysLeft: number): Promise<boolean> {
    try {
      await connectDB()
      
      // Mock user data for now
      const user = { email: 'test@example.com', name: 'Test User' }
      
      return await this.sendEmail({
        to: user.email,
        template: 'wedding_reminder',
        data: {
          name: user.name,
          daysLeft: daysLeft,
          weddingDate: new Date().toDateString()
        }
      })

    } catch (error) {
      console.error('Wedding reminder email error:', error)
      return false
    }
  }

  // Send vendor inquiry
  async sendVendorInquiry(vendorId: string, inquiryData: any): Promise<boolean> {
    try {
      await connectDB()
      
      // Mock vendor data for now
      const vendor = { email: 'vendor@example.com', name: 'Test Vendor' }
      
      return await this.sendEmail({
        to: vendor.email,
        template: 'vendor_inquiry',
        data: {
          vendorName: vendor.name,
          customerName: inquiryData.customerName,
          customerEmail: inquiryData.customerEmail,
          customerPhone: inquiryData.customerPhone,
          weddingDate: inquiryData.weddingDate,
          message: inquiryData.message
        }
      })

    } catch (error) {
      console.error('Vendor inquiry email error:', error)
      return false
    }
  }

  // Send bulk emails
  async sendBulkEmails(emails: EmailData[]): Promise<{ success: number; failed: number }> {
    let success = 0
    let failed = 0

    for (const email of emails) {
      const result = await this.sendEmail(email)
      if (result) {
        success++
      } else {
        failed++
      }
    }

    return { success, failed }
  }

  // Send newsletter
  async sendNewsletter(subscribers: string[], newsletterData: any): Promise<{ success: number; failed: number }> {
    const emails: EmailData[] = subscribers.map(email => ({
      to: email,
      template: 'newsletter',
      data: newsletterData
    }))

    return await this.sendBulkEmails(emails)
  }

  // Test email service
  async testEmailService(): Promise<boolean> {
    try {
      return await this.sendEmail({
        to: process.env.TEST_EMAIL || 'test@example.com',
        template: 'welcome',
        data: {
          name: 'Test User',
          email: 'test@example.com'
        }
      })
    } catch (error) {
      console.error('Email service test failed:', error)
      return false
    }
  }
}

const emailService = new EmailService();

// Export the function for backward compatibility
export const sendVerificationEmail = async (email: string, token: string): Promise<boolean> => {
  const verificationUrl = `${process.env.NEXTAUTH_URL}/verify-email?token=${token}`;
  
  const html = `
    <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
      <h2>Welcome to WeddingLK!</h2>
      <p>Please verify your email address by clicking the link below:</p>
      <a href="${verificationUrl}" style="background-color: #007bff; color: white; padding: 10px 20px; text-decoration: none; border-radius: 5px;">Verify Email</a>
      <p>If you didn't create an account, please ignore this email.</p>
    </div>
  `;

  return emailService.sendEmail({
    to: email,
    template: 'welcome',
    data: { name: 'User', email }
  });
};

export default emailService; 