import nodemailer from 'nodemailer'

const transporter = nodemailer.createTransport({
  host: process.env.SMTP_HOST || 'smtp.gmail.com',
  port: parseInt(process.env.SMTP_PORT || '587'),
  secure: false,
  auth: {
    user: process.env.SMTP_USER,
    pass: process.env.SMTP_PASS,
  },
})

export interface EmailOptions {
  to: string
  subject: string
  html: string
  text?: string
}

export const sendEmail = async (options: EmailOptions) => {
  try {
    const mailOptions = {
      from: process.env.SMTP_FROM || 'WeddingLK <noreply@weddinglk.com>',
      to: options.to,
      subject: options.subject,
      html: options.html,
      text: options.text,
    }

    const info = await transporter.sendMail(mailOptions)
    console.log('Email sent:', info.messageId)
    return info
  } catch (error) {
    console.error('Error sending email:', error)
    throw error
  }
}

export const sendWelcomeEmail = async (email: string, name: string) => {
  const html = `
    <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
      <h1 style="color: #333;">Welcome to WeddingLK!</h1>
      <p>Hi ${name},</p>
      <p>Thank you for joining WeddingLK! We're excited to help you plan your perfect wedding.</p>
      <p>Get started by:</p>
      <ul>
        <li>Browsing our venues and vendors</li>
        <li>Creating your wedding checklist</li>
        <li>Setting up your budget tracker</li>
      </ul>
      <p>Best regards,<br>The WeddingLK Team</p>
    </div>
  `

  return sendEmail({
    to: email,
    subject: 'Welcome to WeddingLK!',
    html,
  })
}

export const sendBookingConfirmation = async (email: string, bookingDetails: any) => {
  const html = `
    <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
      <h1 style="color: #333;">Booking Confirmation</h1>
      <p>Your booking has been confirmed!</p>
      <div style="background: #f5f5f5; padding: 20px; border-radius: 8px;">
        <h3>Booking Details:</h3>
        <p><strong>Venue/Vendor:</strong> ${bookingDetails.name}</p>
        <p><strong>Date:</strong> ${bookingDetails.date}</p>
        <p><strong>Time:</strong> ${bookingDetails.time}</p>
        <p><strong>Amount:</strong> ${bookingDetails.amount}</p>
      </div>
      <p>We'll be in touch soon with more details.</p>
      <p>Best regards,<br>The WeddingLK Team</p>
    </div>
  `

  return sendEmail({
    to: email,
    subject: 'Booking Confirmation - WeddingLK',
    html,
  })
} 