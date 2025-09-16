# 🚀 **WeddingLK Platform - Production Deployment Guide**

## 📋 **Pre-Deployment Checklist**

### **✅ Environment Setup**
- [ ] Production environment variables configured
- [ ] MongoDB Atlas production cluster created
- [ ] Stripe production account configured
- [ ] Email service configured (Gmail/SendGrid)
- [ ] Domain name purchased and configured
- [ ] SSL certificates configured

### **✅ Security Configuration**
- [ ] Production API keys secured
- [ ] CORS origins configured
- [ ] Content Security Policy updated
- [ ] Rate limiting configured
- [ ] Input validation implemented

### **✅ Database Setup**
- [ ] MongoDB Atlas cluster created
- [ ] Database indexes created
- [ ] Sample data populated
- [ ] Backup strategy implemented

---

## 🔧 **Step 1: Environment Configuration**

### **1.1 Create Production Environment File**
```bash
# Copy the template
cp env.production.template .env.production

# Edit with your production values
nano .env.production
```

### **1.2 Required Environment Variables**
```env
# Database
MONGODB_URI=mongodb+srv://username:password@cluster.mongodb.net/weddinglk-prod

# NextAuth.js
NEXTAUTH_URL=https://yourdomain.com
NEXTAUTH_SECRET=your-production-secret-key

# Google OAuth
GOOGLE_CLIENT_ID=your-production-google-client-id
GOOGLE_CLIENT_SECRET=your-production-google-client-secret

# Stripe
STRIPE_PUBLISHABLE_KEY=pk_live_your-production-key
STRIPE_SECRET_KEY=sk_live_your-production-key
STRIPE_WEBHOOK_SECRET=whsec_your-webhook-secret

# Email Service
EMAIL_SERVER_HOST=smtp.gmail.com
EMAIL_SERVER_PORT=587
EMAIL_SERVER_USER=your-email@gmail.com
EMAIL_SERVER_PASSWORD=your-app-password
EMAIL_FROM=noreply@yourdomain.com
```

---

## 🗄️ **Step 2: Database Setup**

### **2.1 MongoDB Atlas Configuration**
1. **Create Cluster**
   - Go to [MongoDB Atlas](https://cloud.mongodb.com)
   - Create new cluster (M10 or higher for production)
   - Choose region closest to your users

2. **Configure Security**
   - Create database user with read/write permissions
   - Whitelist your server IP addresses
   - Enable network access

3. **Create Indexes**
```javascript
// Run in MongoDB shell or Atlas interface
db.users.createIndex({ email: 1 }, { unique: true })
db.vendors.createIndex({ userId: 1 })
db.vendors.createIndex({ businessType: 1 })
db.vendors.createIndex({ location: 1 })
db.venues.createIndex({ location: 1 })
db.venues.createIndex({ capacity: 1 })
db.bookings.createIndex({ userId: 1 })
db.bookings.createIndex({ vendorId: 1 })
db.bookings.createIndex({ eventDate: 1 })
db.payments.createIndex({ userId: 1 })
db.payments.createIndex({ stripePaymentIntentId: 1 })
db.messages.createIndex({ conversationId: 1 })
db.messages.createIndex({ senderId: 1 })
db.notifications.createIndex({ userId: 1 })
db.notifications.createIndex({ read: 1 })
```

### **2.2 Populate Sample Data**
```bash
# Run the content population script
npm run populate-content
```

---

## 💳 **Step 3: Stripe Configuration**

### **3.1 Stripe Account Setup**
1. **Create Production Account**
   - Go to [Stripe Dashboard](https://dashboard.stripe.com)
   - Complete account verification
   - Enable live mode

2. **Configure Webhooks**
   - Go to Webhooks section
   - Add endpoint: `https://yourdomain.com/api/payments/webhook`
   - Select events: `payment_intent.succeeded`, `payment_intent.payment_failed`
   - Copy webhook secret

3. **Test Payments**
   - Use Stripe test cards in development
   - Test with real cards in production (small amounts)

### **3.2 Stripe Keys**
```env
# Production Keys
STRIPE_PUBLISHABLE_KEY=pk_live_...
STRIPE_SECRET_KEY=sk_live_...
STRIPE_WEBHOOK_SECRET=whsec_...
```

---

## 📧 **Step 4: Email Service Setup**

### **4.1 Gmail Configuration**
1. **Enable 2FA** on your Gmail account
2. **Generate App Password**
   - Go to Google Account settings
   - Security → 2-Step Verification → App passwords
   - Generate password for "Mail"

3. **Configure SMTP**
```env
EMAIL_SERVER_HOST=smtp.gmail.com
EMAIL_SERVER_PORT=587
EMAIL_SERVER_USER=your-email@gmail.com
EMAIL_SERVER_PASSWORD=your-app-password
EMAIL_FROM=noreply@yourdomain.com
```

### **4.2 Alternative: SendGrid**
```env
EMAIL_SERVER_HOST=smtp.sendgrid.net
EMAIL_SERVER_PORT=587
EMAIL_SERVER_USER=apikey
EMAIL_SERVER_PASSWORD=your-sendgrid-api-key
```

---

## 🌐 **Step 5: Domain & SSL Setup**

### **5.1 Domain Configuration**
1. **Purchase Domain**
   - Buy domain from registrar (GoDaddy, Namecheap, etc.)
   - Configure DNS settings

2. **DNS Records**
```
A Record: @ → Your server IP
CNAME: www → yourdomain.com
CNAME: api → yourdomain.com
```

### **5.2 SSL Certificate**
- Vercel automatically provides SSL certificates
- For custom domains, ensure HTTPS is enabled

---

## 🚀 **Step 6: Vercel Deployment**

### **6.1 Deploy to Vercel**
```bash
# Install Vercel CLI
npm i -g vercel

# Login to Vercel
vercel login

# Deploy to production
vercel --prod

# Set environment variables
vercel env add MONGODB_URI
vercel env add NEXTAUTH_SECRET
vercel env add STRIPE_SECRET_KEY
# ... add all production environment variables
```

### **6.2 Vercel Configuration**
```json
{
  "version": 2,
  "builds": [
    {
      "src": "package.json",
      "use": "@vercel/next"
    }
  ],
  "env": {
    "NODE_ENV": "production"
  },
  "functions": {
    "app/api/**/*.ts": {
      "maxDuration": 30
    }
  }
}
```

---

## 🧪 **Step 7: Testing**

### **7.1 Pre-Launch Testing**
```bash
# Run tests
npm test

# Test API endpoints
npm run test:api

# Test payment flow
npm run test:payments

# Test email notifications
npm run test:emails
```

### **7.2 User Acceptance Testing**
- [ ] User registration and login
- [ ] Vendor registration and approval
- [ ] Package browsing and search
- [ ] Booking flow and payment
- [ ] Messaging system
- [ ] Email notifications
- [ ] Mobile responsiveness

---

## 📊 **Step 8: Monitoring & Analytics**

### **8.1 Vercel Analytics**
```bash
# Install Vercel Analytics
npm install @vercel/analytics

# Add to your app
import { Analytics } from '@vercel/analytics/react'

export default function App() {
  return (
    <>
      {/* Your app */}
      <Analytics />
    </>
  )
}
```

### **8.2 Error Monitoring**
```bash
# Install Sentry
npm install @sentry/nextjs

# Configure Sentry
npx @sentry/nextjs init
```

### **8.3 Performance Monitoring**
- Vercel Speed Insights
- Google Analytics
- Custom performance metrics

---

## 🔒 **Step 9: Security Hardening**

### **9.1 Security Headers**
```javascript
// next.config.mjs
const securityHeaders = [
  {
    key: 'X-DNS-Prefetch-Control',
    value: 'on'
  },
  {
    key: 'Strict-Transport-Security',
    value: 'max-age=63072000; includeSubDomains; preload'
  },
  {
    key: 'X-XSS-Protection',
    value: '1; mode=block'
  },
  {
    key: 'X-Frame-Options',
    value: 'SAMEORIGIN'
  },
  {
    key: 'X-Content-Type-Options',
    value: 'nosniff'
  },
  {
    key: 'Referrer-Policy',
    value: 'origin-when-cross-origin'
  }
]
```

### **9.2 Rate Limiting**
```javascript
// Implement rate limiting for API routes
import rateLimit from 'express-rate-limit'

const limiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 100 // limit each IP to 100 requests per windowMs
})
```

---

## 📈 **Step 10: Launch Strategy**

### **10.1 Soft Launch**
- [ ] Deploy to production
- [ ] Test with limited users
- [ ] Monitor performance
- [ ] Fix any issues

### **10.2 Marketing Launch**
- [ ] Social media announcement
- [ ] Press release
- [ ] Influencer partnerships
- [ ] SEO optimization

### **10.3 Post-Launch**
- [ ] Monitor user feedback
- [ ] Track analytics
- [ ] Plan feature updates
- [ ] Scale infrastructure

---

## 🆘 **Troubleshooting**

### **Common Issues**

#### **Database Connection**
```bash
# Check MongoDB connection
mongosh "mongodb+srv://username:password@cluster.mongodb.net/weddinglk-prod"
```

#### **Stripe Webhooks**
```bash
# Test webhook endpoint
curl -X POST https://yourdomain.com/api/payments/webhook \
  -H "Content-Type: application/json" \
  -d '{"type": "payment_intent.succeeded"}'
```

#### **Email Delivery**
```bash
# Test email sending
node -e "
const { sendEmail } = require('./lib/email');
sendEmail({
  to: 'test@example.com',
  subject: 'Test Email',
  html: '<h1>Test</h1>'
});
"
```

---

## 📞 **Support & Maintenance**

### **Monitoring Checklist**
- [ ] Daily: Check error logs
- [ ] Weekly: Review performance metrics
- [ ] Monthly: Update dependencies
- [ ] Quarterly: Security audit

### **Backup Strategy**
- [ ] Database backups (daily)
- [ ] File uploads backup (daily)
- [ ] Configuration backup (weekly)
- [ ] Disaster recovery plan

---

## 🎉 **Launch Checklist**

### **Final Pre-Launch**
- [ ] All environment variables set
- [ ] Database populated with sample data
- [ ] Payment processing tested
- [ ] Email notifications working
- [ ] SSL certificate active
- [ ] Domain configured
- [ ] Analytics tracking
- [ ] Error monitoring active
- [ ] Performance optimized
- [ ] Security headers configured
- [ ] Rate limiting enabled
- [ ] Backup strategy implemented

### **Launch Day**
- [ ] Deploy to production
- [ ] Test all functionality
- [ ] Monitor error logs
- [ ] Check performance metrics
- [ ] Announce launch
- [ ] Monitor user feedback

**🚀 Your WeddingLK platform is now live and ready to serve couples planning their dream weddings!**