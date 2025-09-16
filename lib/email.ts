import nodemailer from 'nodemailer'

// Email configuration
const transporter = nodemailer.createTransporter({
  host: process.env.EMAIL_SERVER_HOST,
  port: parseInt(process.env.EMAIL_SERVER_PORT || '587'),
  secure: false,
  auth: {
    user: process.env.EMAIL_SERVER_USER,
    pass: process.env.EMAIL_SERVER_PASSWORD,
  },
})

export interface EmailOptions {
  to: string
  subject: string
  html: string
  text?: string
}

export async function sendEmail({ to, subject, html, text }: EmailOptions) {
  try {
    const info = await transporter.sendMail({
      from: process.env.EMAIL_FROM || 'noreply@weddinglk.com',
      to,
      subject,
      html,
      text: text || html.replace(/<[^>]*>/g, ''),
    })

    console.log('Email sent:', info.messageId)
    return { success: true, messageId: info.messageId }
  } catch (error) {
    console.error('Email sending error:', error)
    return { success: false, error: error.message }
  }
}

// Email templates
export const emailTemplates = {
  bookingConfirmation: (booking: any, packageData: any) => ({
    subject: `Booking Confirmed - ${packageData.name}`,
    html: `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
        <div style="background: linear-gradient(135deg, #8B5CF6 0%, #3B82F6 100%); padding: 30px; text-align: center;">
          <h1 style="color: white; margin: 0; font-size: 28px;">Booking Confirmed!</h1>
          <p style="color: white; margin: 10px 0 0 0; font-size: 16px;">Your wedding booking has been confirmed</p>
        </div>
        
        <div style="padding: 30px; background: #f9fafb;">
          <h2 style="color: #374151; margin-bottom: 20px;">Booking Details</h2>
          
          <div style="background: white; padding: 20px; border-radius: 8px; margin-bottom: 20px;">
            <h3 style="color: #8B5CF6; margin-bottom: 15px;">${packageData.name}</h3>
            <p style="color: #6B7280; margin-bottom: 10px;">${packageData.description}</p>
            
            <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 15px; margin-top: 20px;">
              <div>
                <strong style="color: #374151;">Event Date:</strong><br>
                <span style="color: #6B7280;">${new Date(booking.eventDate).toLocaleDateString()}</span>
              </div>
              <div>
                <strong style="color: #374151;">Event Time:</strong><br>
                <span style="color: #6B7280;">${booking.eventTime}</span>
              </div>
              <div>
                <strong style="color: #374151;">Guest Count:</strong><br>
                <span style="color: #6B7280;">${booking.guestCount} guests</span>
              </div>
              <div>
                <strong style="color: #374151;">Total Amount:</strong><br>
                <span style="color: #059669; font-weight: bold;">LKR ${booking.totalPrice.toLocaleString()}</span>
              </div>
            </div>
          </div>
          
          <div style="text-align: center; margin-top: 30px;">
            <a href="${process.env.NEXTAUTH_URL}/booking/confirmation/${booking._id}" 
               style="background: linear-gradient(135deg, #8B5CF6 0%, #3B82F6 100%); color: white; padding: 12px 30px; text-decoration: none; border-radius: 6px; display: inline-block;">
              View Booking Details
            </a>
          </div>
        </div>
      </div>
    `
  })
}

export async function sendBookingConfirmationEmail(booking: any, packageData: any, customerEmail: string) {
  const template = emailTemplates.bookingConfirmation(booking, packageData)
  return await sendEmail({
    to: customerEmail,
    subject: template.subject,
    html: template.html
  })
}