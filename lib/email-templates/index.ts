import { EmailTemplate, EmailTemplateData } from './types';

// Base email template interface
export interface EmailTemplateConfig {
  id: string;
  name: string;
  subject: string;
  htmlTemplate: string;
  textTemplate?: string;
  variables: string[];
  category: 'booking' | 'notification' | 'marketing' | 'system';
  isActive: boolean;
  createdAt: Date;
  updatedAt: Date;
}

// Email template variables
export interface EmailVariables {
  // User variables
  userName?: string;
  userEmail?: string;
  userFirstName?: string;
  userLastName?: string;
  
  // Booking variables
  bookingId?: string;
  bookingDate?: string;
  bookingTime?: string;
  bookingStatus?: string;
  bookingAmount?: string;
  packageName?: string;
  vendorName?: string;
  venueName?: string;
  
  // System variables
  siteName?: string;
  siteUrl?: string;
  supportEmail?: string;
  currentYear?: string;
  
  // Custom variables
  [key: string]: any;
}

// Default email templates
export const DEFAULT_EMAIL_TEMPLATES: EmailTemplateConfig[] = [
  {
    id: 'booking-confirmation',
    name: 'Booking Confirmation',
    subject: '🎉 Your Wedding Booking is Confirmed!',
    htmlTemplate: `
      <!DOCTYPE html>
      <html>
      <head>
        <meta charset="utf-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <title>{{subject}}</title>
        <style>
          body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; margin: 0; padding: 0; }
          .container { max-width: 600px; margin: 0 auto; background: #fff; }
          .header { background: linear-gradient(135deg, #8B5CF6 0%, #3B82F6 100%); padding: 30px; text-align: center; }
          .header h1 { color: white; margin: 0; font-size: 28px; }
          .header p { color: white; margin: 10px 0 0 0; font-size: 16px; }
          .content { padding: 30px; background: #f9fafb; }
          .booking-details { background: white; padding: 20px; border-radius: 8px; margin-bottom: 20px; }
          .detail-row { display: flex; justify-content: space-between; margin-bottom: 10px; }
          .detail-label { font-weight: bold; color: #374151; }
          .detail-value { color: #6B7280; }
          .cta-button { background: linear-gradient(135deg, #8B5CF6 0%, #3B82F6 100%); color: white; padding: 12px 30px; text-decoration: none; border-radius: 6px; display: inline-block; margin-top: 20px; }
          .footer { background: #374151; color: white; padding: 20px; text-align: center; font-size: 14px; }
        </style>
      </head>
      <body>
        <div class="container">
          <div class="header">
            <h1>🎉 Booking Confirmed!</h1>
            <p>Your wedding booking has been successfully confirmed</p>
          </div>
          
          <div class="content">
            <p>Dear {{userFirstName}},</p>
            
            <p>We're thrilled to confirm your wedding booking! Here are the details:</p>
            
            <div class="booking-details">
              <h3 style="color: #8B5CF6; margin-bottom: 15px;">{{packageName}}</h3>
              
              <div class="detail-row">
                <span class="detail-label">Booking ID:</span>
                <span class="detail-value">{{bookingId}}</span>
              </div>
              <div class="detail-row">
                <span class="detail-label">Event Date:</span>
                <span class="detail-value">{{bookingDate}}</span>
              </div>
              <div class="detail-row">
                <span class="detail-label">Event Time:</span>
                <span class="detail-value">{{bookingTime}}</span>
              </div>
              <div class="detail-row">
                <span class="detail-label">Venue:</span>
                <span class="detail-value">{{venueName}}</span>
              </div>
              <div class="detail-row">
                <span class="detail-label">Vendor:</span>
                <span class="detail-value">{{vendorName}}</span>
              </div>
              <div class="detail-row">
                <span class="detail-label">Total Amount:</span>
                <span class="detail-value" style="color: #059669; font-weight: bold;">LKR {{bookingAmount}}</span>
              </div>
            </div>
            
            <p>We'll be in touch soon with more details about your special day. If you have any questions, please don't hesitate to contact us.</p>
            
            <div style="text-align: center;">
              <a href="{{siteUrl}}/dashboard/bookings" class="cta-button">View Booking Details</a>
            </div>
          </div>
          
          <div class="footer">
            <p>© {{currentYear}} {{siteName}}. All rights reserved.</p>
            <p>Need help? Contact us at {{supportEmail}}</p>
          </div>
        </div>
      </body>
      </html>
    `,
    textTemplate: `
      Booking Confirmation - {{siteName}}
      
      Dear {{userFirstName}},
      
      Your wedding booking has been confirmed!
      
      Booking Details:
      - Booking ID: {{bookingId}}
      - Package: {{packageName}}
      - Date: {{bookingDate}}
      - Time: {{bookingTime}}
      - Venue: {{venueName}}
      - Vendor: {{vendorName}}
      - Amount: LKR {{bookingAmount}}
      
      View your booking: {{siteUrl}}/dashboard/bookings
      
      Questions? Contact us at {{supportEmail}}
      
      © {{currentYear}} {{siteName}}
    `,
    variables: ['userFirstName', 'bookingId', 'packageName', 'bookingDate', 'bookingTime', 'venueName', 'vendorName', 'bookingAmount', 'siteName', 'siteUrl', 'supportEmail', 'currentYear'],
    category: 'booking',
    isActive: true,
    createdAt: new Date(),
    updatedAt: new Date()
  },
  
  {
    id: 'booking-reminder',
    name: 'Booking Reminder',
    subject: '📅 Reminder: Your Wedding is Coming Up!',
    htmlTemplate: `
      <!DOCTYPE html>
      <html>
      <head>
        <meta charset="utf-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <title>{{subject}}</title>
        <style>
          body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; margin: 0; padding: 0; }
          .container { max-width: 600px; margin: 0 auto; background: #fff; }
          .header { background: linear-gradient(135deg, #F59E0B 0%, #EF4444 100%); padding: 30px; text-align: center; }
          .header h1 { color: white; margin: 0; font-size: 28px; }
          .content { padding: 30px; background: #f9fafb; }
          .reminder-box { background: #FEF3C7; border: 2px solid #F59E0B; padding: 20px; border-radius: 8px; margin: 20px 0; }
          .cta-button { background: linear-gradient(135deg, #8B5CF6 0%, #3B82F6 100%); color: white; padding: 12px 30px; text-decoration: none; border-radius: 6px; display: inline-block; margin-top: 20px; }
          .footer { background: #374151; color: white; padding: 20px; text-align: center; font-size: 14px; }
        </style>
      </head>
      <body>
        <div class="container">
          <div class="header">
            <h1>📅 Wedding Reminder</h1>
            <p>Your special day is approaching!</p>
          </div>
          
          <div class="content">
            <p>Dear {{userFirstName}},</p>
            
            <p>We wanted to remind you that your wedding is coming up soon!</p>
            
            <div class="reminder-box">
              <h3 style="color: #92400E; margin-top: 0;">Event Details</h3>
              <p><strong>Date:</strong> {{bookingDate}}</p>
              <p><strong>Time:</strong> {{bookingTime}}</p>
              <p><strong>Venue:</strong> {{venueName}}</p>
              <p><strong>Package:</strong> {{packageName}}</p>
            </div>
            
            <p>Please make sure to:</p>
            <ul>
              <li>Confirm all details with your vendor</li>
              <li>Check the venue requirements</li>
              <li>Prepare any special requests</li>
              <li>Contact us if you have any questions</li>
            </ul>
            
            <div style="text-align: center;">
              <a href="{{siteUrl}}/dashboard/bookings" class="cta-button">View Booking Details</a>
            </div>
          </div>
          
          <div class="footer">
            <p>© {{currentYear}} {{siteName}}. All rights reserved.</p>
            <p>Questions? Contact us at {{supportEmail}}</p>
          </div>
        </div>
      </body>
      </html>
    `,
    variables: ['userFirstName', 'bookingDate', 'bookingTime', 'venueName', 'packageName', 'siteName', 'siteUrl', 'supportEmail', 'currentYear'],
    category: 'booking',
    isActive: true,
    createdAt: new Date(),
    updatedAt: new Date()
  },
  
  {
    id: 'welcome-email',
    name: 'Welcome Email',
    subject: '🎉 Welcome to {{siteName}} - Let\'s Plan Your Perfect Wedding!',
    htmlTemplate: `
      <!DOCTYPE html>
      <html>
      <head>
        <meta charset="utf-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <title>{{subject}}</title>
        <style>
          body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; margin: 0; padding: 0; }
          .container { max-width: 600px; margin: 0 auto; background: #fff; }
          .header { background: linear-gradient(135deg, #8B5CF6 0%, #3B82F6 100%); padding: 30px; text-align: center; }
          .header h1 { color: white; margin: 0; font-size: 28px; }
          .content { padding: 30px; background: #f9fafb; }
          .feature-grid { display: grid; grid-template-columns: 1fr 1fr; gap: 20px; margin: 20px 0; }
          .feature-item { background: white; padding: 20px; border-radius: 8px; text-align: center; }
          .cta-button { background: linear-gradient(135deg, #8B5CF6 0%, #3B82F6 100%); color: white; padding: 12px 30px; text-decoration: none; border-radius: 6px; display: inline-block; margin-top: 20px; }
          .footer { background: #374151; color: white; padding: 20px; text-align: center; font-size: 14px; }
        </style>
      </head>
      <body>
        <div class="container">
          <div class="header">
            <h1>🎉 Welcome to {{siteName}}!</h1>
            <p>Your journey to the perfect wedding starts here</p>
          </div>
          
          <div class="content">
            <p>Dear {{userFirstName}},</p>
            
            <p>Welcome to {{siteName}}! We're excited to help you plan your dream wedding. Our platform connects you with the best vendors, venues, and services to make your special day unforgettable.</p>
            
            <div class="feature-grid">
              <div class="feature-item">
                <h3>🏢 Find Venues</h3>
                <p>Discover beautiful wedding venues in your area</p>
              </div>
              <div class="feature-item">
                <h3>👥 Connect Vendors</h3>
                <p>Meet professional wedding vendors and planners</p>
              </div>
              <div class="feature-item">
                <h3>📦 Wedding Packages</h3>
                <p>Choose from curated wedding packages</p>
              </div>
              <div class="feature-item">
                <h3>💬 Get Support</h3>
                <p>24/7 support for all your wedding needs</p>
              </div>
            </div>
            
            <p>Ready to start planning? Let's create your perfect wedding together!</p>
            
            <div style="text-align: center;">
              <a href="{{siteUrl}}/dashboard" class="cta-button">Start Planning</a>
            </div>
          </div>
          
          <div class="footer">
            <p>© {{currentYear}} {{siteName}}. All rights reserved.</p>
            <p>Need help? Contact us at {{supportEmail}}</p>
          </div>
        </div>
      </body>
      </html>
    `,
    variables: ['userFirstName', 'siteName', 'siteUrl', 'supportEmail', 'currentYear'],
    category: 'marketing',
    isActive: true,
    createdAt: new Date(),
    updatedAt: new Date()
  }
];

// Email template service
export class EmailTemplateService {
  private templates: Map<string, EmailTemplateConfig> = new Map();

  constructor() {
    // Load default templates
    DEFAULT_EMAIL_TEMPLATES.forEach(template => {
      this.templates.set(template.id, template);
    });
  }

  // Get template by ID
  getTemplate(templateId: string): EmailTemplateConfig | null {
    return this.templates.get(templateId) || null;
  }

  // Get all templates
  getAllTemplates(): EmailTemplateConfig[] {
    return Array.from(this.templates.values());
  }

  // Get templates by category
  getTemplatesByCategory(category: string): EmailTemplateConfig[] {
    return Array.from(this.templates.values()).filter(t => t.category === category);
  }

  // Render template with variables
  renderTemplate(templateId: string, variables: EmailVariables): { subject: string; html: string; text?: string } | null {
    const template = this.getTemplate(templateId);
    if (!template) return null;

    const defaultVariables: EmailVariables = {
      siteName: 'WeddingLK',
      siteUrl: process.env.NEXTAUTH_URL || 'https://wedding-lkcom.vercel.app',
      supportEmail: 'support@weddinglk.com',
      currentYear: new Date().getFullYear().toString(),
      ...variables
    };

    // Replace variables in templates
    const replaceVariables = (text: string): string => {
      return text.replace(/\{\{(\w+)\}\}/g, (match, key) => {
        return defaultVariables[key] || match;
      });
    };

    return {
      subject: replaceVariables(template.subject),
      html: replaceVariables(template.htmlTemplate),
      text: template.textTemplate ? replaceVariables(template.textTemplate) : undefined
    };
  }

  // Update template
  updateTemplate(templateId: string, updates: Partial<EmailTemplateConfig>): boolean {
    const template = this.getTemplate(templateId);
    if (!template) return false;

    const updatedTemplate = {
      ...template,
      ...updates,
      updatedAt: new Date()
    };

    this.templates.set(templateId, updatedTemplate);
    return true;
  }

  // Create new template
  createTemplate(template: Omit<EmailTemplateConfig, 'id' | 'createdAt' | 'updatedAt'>): string {
    const id = `custom-${Date.now()}`;
    const newTemplate: EmailTemplateConfig = {
      ...template,
      id,
      createdAt: new Date(),
      updatedAt: new Date()
    };

    this.templates.set(id, newTemplate);
    return id;
  }

  // Delete template
  deleteTemplate(templateId: string): boolean {
    return this.templates.delete(templateId);
  }
}

// Export singleton instance
export const emailTemplateService = new EmailTemplateService();
