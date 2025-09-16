import nodemailer from 'nodemailer';

interface EmailConfig {
  host: string;
  port: number;
  secure: boolean;
  auth: {
    user: string;
    pass: string;
  };
}

interface EmailOptions {
  to: string;
  subject: string;
  html: string;
  text?: string;
}

class EmailService {
  private transporter: nodemailer.Transporter | null = null;
  private isConfigured = false;

  constructor() {
    this.initializeTransporter();
  }

  private initializeTransporter() {
    try {
      const config: EmailConfig = {
        host: process.env.EMAIL_SERVER_HOST || 'smtp.gmail.com',
        port: parseInt(process.env.EMAIL_SERVER_PORT || '587'),
        secure: process.env.EMAIL_SERVER_PORT === '465',
        auth: {
          user: process.env.EMAIL_SERVER_USER || '',
          pass: process.env.EMAIL_SERVER_PASSWORD || '',
        },
      };

      if (config.auth.user && config.auth.pass) {
        this.transporter = nodemailer.createTransporter(config);
        this.isConfigured = true;
        console.log('✅ Email service configured successfully');
      } else {
        console.log('⚠️ Email service not configured - missing credentials');
      }
    } catch (error) {
      console.error('❌ Email service configuration failed:', error);
    }
  }

  async sendEmail(options: EmailOptions): Promise<boolean> {
    if (!this.isConfigured || !this.transporter) {
      console.log('📧 Email service not configured, skipping email send');
      return false;
    }

    try {
      const mailOptions = {
        from: process.env.EMAIL_FROM || 'noreply@weddinglk.com',
        to: options.to,
        subject: options.subject,
        html: options.html,
        text: options.text || this.stripHtml(options.html),
      };

      await this.transporter.sendMail(mailOptions);
      console.log(`✅ Email sent successfully to: ${options.to}`);
      return true;
    } catch (error) {
      console.error('❌ Email send failed:', error);
      return false;
    }
  }

  async sendPasswordResetEmail(email: string, resetToken: string): Promise<boolean> {
    const resetUrl = `${process.env.NEXTAUTH_URL || 'http://localhost:3000'}/auth/reset-password?token=${resetToken}`;
    
    const html = `
      <!DOCTYPE html>
      <html>
        <head>
          <meta charset="utf-8">
          <meta name="viewport" content="width=device-width, initial-scale=1.0">
          <title>Reset Your Password - WeddingLK</title>
          <style>
            body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
            .container { max-width: 600px; margin: 0 auto; padding: 20px; }
            .header { background: linear-gradient(135deg, #8B5CF6, #06B6D4); color: white; padding: 30px; text-align: center; border-radius: 10px 10px 0 0; }
            .content { background: #f9f9f9; padding: 30px; border-radius: 0 0 10px 10px; }
            .button { display: inline-block; background: linear-gradient(135deg, #8B5CF6, #06B6D4); color: white; padding: 15px 30px; text-decoration: none; border-radius: 5px; margin: 20px 0; }
            .footer { text-align: center; margin-top: 30px; color: #666; font-size: 14px; }
          </style>
        </head>
        <body>
          <div class="container">
            <div class="header">
              <h1>🔐 Password Reset Request</h1>
              <p>WeddingLK - Sri Lanka's Premier Wedding Planning Platform</p>
            </div>
            <div class="content">
              <h2>Hello!</h2>
              <p>We received a request to reset your password for your WeddingLK account.</p>
              <p>Click the button below to reset your password:</p>
              <a href="${resetUrl}" class="button">Reset My Password</a>
              <p>If the button doesn't work, copy and paste this link into your browser:</p>
              <p style="word-break: break-all; background: #e9ecef; padding: 10px; border-radius: 5px;">${resetUrl}</p>
              <p><strong>This link will expire in 1 hour for security reasons.</strong></p>
              <p>If you didn't request this password reset, please ignore this email. Your password will remain unchanged.</p>
            </div>
            <div class="footer">
              <p>© 2024 WeddingLK. All rights reserved.</p>
              <p>This email was sent from a notification-only address. Please do not reply to this email.</p>
            </div>
          </div>
        </body>
      </html>
    `;

    return this.sendEmail({
      to: email,
      subject: 'Reset Your Password - WeddingLK',
      html,
    });
  }

  async sendVerificationEmail(email: string, verificationToken: string): Promise<boolean> {
    const verificationUrl = `${process.env.NEXTAUTH_URL || 'http://localhost:3000'}/auth/verify-email?token=${verificationToken}`;
    
    const html = `
      <!DOCTYPE html>
      <html>
        <head>
          <meta charset="utf-8">
          <meta name="viewport" content="width=device-width, initial-scale=1.0">
          <title>Verify Your Email - WeddingLK</title>
          <style>
            body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
            .container { max-width: 600px; margin: 0 auto; padding: 20px; }
            .header { background: linear-gradient(135deg, #8B5CF6, #06B6D4); color: white; padding: 30px; text-align: center; border-radius: 10px 10px 0 0; }
            .content { background: #f9f9f9; padding: 30px; border-radius: 0 0 10px 10px; }
            .button { display: inline-block; background: linear-gradient(135deg, #8B5CF6, #06B6D4); color: white; padding: 15px 30px; text-decoration: none; border-radius: 5px; margin: 20px 0; }
            .footer { text-align: center; margin-top: 30px; color: #666; font-size: 14px; }
          </style>
        </head>
        <body>
          <div class="container">
            <div class="header">
              <h1>🎉 Welcome to WeddingLK!</h1>
              <p>Verify your email to get started</p>
            </div>
            <div class="content">
              <h2>Hello!</h2>
              <p>Thank you for joining WeddingLK - Sri Lanka's premier wedding planning platform!</p>
              <p>To complete your registration and start planning your perfect wedding, please verify your email address:</p>
              <a href="${verificationUrl}" class="button">Verify My Email</a>
              <p>If the button doesn't work, copy and paste this link into your browser:</p>
              <p style="word-break: break-all; background: #e9ecef; padding: 10px; border-radius: 5px;">${verificationUrl}</p>
              <p><strong>This verification link will expire in 24 hours.</strong></p>
              <p>Once verified, you'll have access to:</p>
              <ul>
                <li>✨ AI-powered vendor recommendations</li>
                <li>📊 Budget planning tools</li>
                <li>👥 Guest list management</li>
                <li>📱 Social feed & inspiration</li>
                <li>🎯 Personalized wedding planning</li>
              </ul>
            </div>
            <div class="footer">
              <p>© 2024 WeddingLK. All rights reserved.</p>
              <p>This email was sent from a notification-only address. Please do not reply to this email.</p>
            </div>
          </div>
        </body>
      </html>
    `;

    return this.sendEmail({
      to: email,
      subject: 'Welcome to WeddingLK - Verify Your Email',
      html,
    });
  }

  async sendWelcomeEmail(email: string, name: string, role: string): Promise<boolean> {
    const dashboardUrl = `${process.env.NEXTAUTH_URL || 'http://localhost:3000'}/dashboard`;
    
    const html = `
      <!DOCTYPE html>
      <html>
        <head>
          <meta charset="utf-8">
          <meta name="viewport" content="width=device-width, initial-scale=1.0">
          <title>Welcome to WeddingLK!</title>
          <style>
            body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
            .container { max-width: 600px; margin: 0 auto; padding: 20px; }
            .header { background: linear-gradient(135deg, #8B5CF6, #06B6D4); color: white; padding: 30px; text-align: center; border-radius: 10px 10px 0 0; }
            .content { background: #f9f9f9; padding: 30px; border-radius: 0 0 10px 10px; }
            .button { display: inline-block; background: linear-gradient(135deg, #8B5CF6, #06B6D4); color: white; padding: 15px 30px; text-decoration: none; border-radius: 5px; margin: 20px 0; }
            .footer { text-align: center; margin-top: 30px; color: #666; font-size: 14px; }
          </style>
        </head>
        <body>
          <div class="container">
            <div class="header">
              <h1>🎉 Welcome to WeddingLK, ${name}!</h1>
              <p>Your wedding journey starts here</p>
            </div>
            <div class="content">
              <h2>Congratulations on joining WeddingLK!</h2>
              <p>We're excited to help you plan your perfect wedding day. As a ${role.replace('_', ' ')}, you now have access to our comprehensive wedding planning platform.</p>
              <a href="${dashboardUrl}" class="button">Go to Dashboard</a>
              <p>Here's what you can do next:</p>
              <ul>
                <li>📝 Complete your profile</li>
                <li>🔍 Explore vendors and venues</li>
                <li>📊 Set up your budget</li>
                <li>👥 Start building your guest list</li>
                <li>📱 Connect with our community</li>
              </ul>
              <p>Need help getting started? Our support team is here to assist you every step of the way.</p>
            </div>
            <div class="footer">
              <p>© 2024 WeddingLK. All rights reserved.</p>
              <p>Questions? Contact us at support@weddinglk.com</p>
            </div>
          </div>
        </body>
      </html>
    `;

    return this.sendEmail({
      to: email,
      subject: 'Welcome to WeddingLK - Let\'s Plan Your Perfect Day!',
      html,
    });
  }

  private stripHtml(html: string): string {
    return html.replace(/<[^>]*>/g, '').replace(/\s+/g, ' ').trim();
  }
}

export const emailService = new EmailService();
export default emailService;
