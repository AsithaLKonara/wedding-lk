/**
 * Email Service
 * Handles email sending via SMTP
 */

import nodemailer from 'nodemailer';

interface EmailOptions {
  to: string | string[];
  subject: string;
  text?: string;
  html?: string;
  from?: string;
}

let transporter: nodemailer.Transporter | null = null;

/**
 * Initialize email transporter
 */
function getTransporter(): nodemailer.Transporter {
  if (transporter) {
    return transporter;
  }

  transporter = nodemailer.createTransporter({
    host: process.env.SMTP_HOST || 'smtp.gmail.com',
    port: parseInt(process.env.SMTP_PORT || '587'),
    secure: false, // true for 465, false for other ports
    auth: {
      user: process.env.SMTP_USER || 'asithalakmalkonara11992081@gmail.com',
      pass: process.env.SMTP_PASS || 'xddgtmbfxkgzkrun'
    }
  });

  return transporter;
}

/**
 * Send email
 */
export async function sendEmail(options: EmailOptions): Promise<boolean> {
  try {
    const transporter = getTransporter();
    
    const mailOptions = {
      from: options.from || process.env.SMTP_USER || 'asithalakmalkonara11992081@gmail.com',
      to: Array.isArray(options.to) ? options.to.join(', ') : options.to,
      subject: options.subject,
      text: options.text,
      html: options.html
    };

    const result = await transporter.sendMail(mailOptions);
    console.log('✅ Email sent successfully:', result.messageId);
    return true;
  } catch (error) {
    console.error('❌ Email sending failed:', error);
    return false;
  }
}

/**
 * Send welcome email
 */
export async function sendWelcomeEmail(userEmail: string, userName: string): Promise<boolean> {
  const html = `
    <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
      <h2 style="color: #8B5CF6;">Welcome to WeddingLK! 🎉</h2>
      <p>Hi ${userName},</p>
      <p>Welcome to Sri Lanka's premier wedding planning platform! We're excited to help you plan your perfect day.</p>
      <p>Here's what you can do:</p>
      <ul>
        <li>Browse and book venues</li>
        <li>Find trusted vendors</li>
        <li>Plan your wedding timeline</li>
        <li>Connect with wedding planners</li>
      </ul>
      <p>Get started by exploring our <a href="https://wedding-lk.vercel.app/venues">venues</a> and <a href="https://wedding-lk.vercel.app/vendors">vendors</a>.</p>
      <p>Best regards,<br>The WeddingLK Team</p>
    </div>
  `;

  return sendEmail({
    to: userEmail,
    subject: 'Welcome to WeddingLK - Your Wedding Planning Journey Starts Here!',
    html
  });
}

/**
 * Send booking confirmation email
 */
export async function sendBookingConfirmation(
  userEmail: string, 
  userName: string, 
  bookingDetails: any
): Promise<boolean> {
  const html = `
    <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
      <h2 style="color: #8B5CF6;">Booking Confirmation ✅</h2>
      <p>Hi ${userName},</p>
      <p>Your booking has been confirmed! Here are the details:</p>
      <div style="background: #f8f9fa; padding: 20px; border-radius: 8px; margin: 20px 0;">
        <h3>Booking Details</h3>
        <p><strong>Venue:</strong> ${bookingDetails.venueName || 'N/A'}</p>
        <p><strong>Date:</strong> ${bookingDetails.eventDate || 'N/A'}</p>
        <p><strong>Time:</strong> ${bookingDetails.eventTime || 'N/A'}</p>
        <p><strong>Total:</strong> LKR ${bookingDetails.totalPrice || '0'}</p>
      </div>
      <p>We'll be in touch soon with more details about your booking.</p>
      <p>Best regards,<br>The WeddingLK Team</p>
    </div>
  `;

  return sendEmail({
    to: userEmail,
    subject: 'Booking Confirmation - WeddingLK',
    html
  });
}

/**
 * Test email connection
 */
export async function testEmailConnection(): Promise<{ success: boolean; error?: string }> {
  try {
    const transporter = getTransporter();
    await transporter.verify();
    return { success: true };
  } catch (error) {
    return { 
      success: false, 
      error: error instanceof Error ? error.message : 'Unknown email error' 
    };
  }
}

export default {
  sendEmail,
  sendWelcomeEmail,
  sendBookingConfirmation,
  testEmailConnection
};