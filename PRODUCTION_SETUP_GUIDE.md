# Production Setup Guide

## 🚀 Deployment Successful!

Your WeddingLK platform has been successfully deployed to:
**https://wedding-1hlk8nv0f-asithalkonaras-projects.vercel.app**

## 📋 Next Steps - Production Configuration

### 1. Set Up Environment Variables on Vercel

1. Go to your Vercel dashboard: https://vercel.com/asithalkonaras-projects/wedding-lk
2. Navigate to Settings → Environment Variables
3. Add the following variables:

#### Required Environment Variables:

```bash
# Database
MONGODB_URI=mongodb+srv://weddinglk:your-password@weddinglk-prod.xxxxx.mongodb.net/weddinglk-prod?retryWrites=true&w=majority

# NextAuth.js
NEXTAUTH_URL=https://wedding-1hlk8nv0f-asithalkonaras-projects.vercel.app
NEXTAUTH_SECRET=your-production-nextauth-secret-key-here

# Google OAuth (Production)
GOOGLE_CLIENT_ID=your-production-google-client-id
GOOGLE_CLIENT_SECRET=your-production-google-client-secret

# Stripe (Production)
STRIPE_PUBLISHABLE_KEY=pk_live_your-production-stripe-publishable-key
STRIPE_SECRET_KEY=sk_live_your-production-stripe-secret-key
STRIPE_WEBHOOK_SECRET=whsec_your-production-webhook-secret

# Redis (Production)
REDIS_URL=your-production-redis-url

# OpenAI
OPENAI_API_KEY=your-production-openai-api-key

# Email Service (Production)
EMAIL_SERVER_HOST=smtp.gmail.com
EMAIL_SERVER_PORT=587
EMAIL_SERVER_USER=your-production-email@gmail.com
EMAIL_SERVER_PASSWORD=your-production-email-password
EMAIL_FROM=noreply@weddinglk.com

# File Upload
MAX_FILE_SIZE=10485760
UPLOAD_DIR=/tmp/uploads

# Security
CORS_ORIGIN=https://wedding-1hlk8nv0f-asithalkonaras-projects.vercel.app
ALLOWED_HOSTS=wedding-1hlk8nv0f-asithalkonaras-projects.vercel.app
```

### 2. Create MongoDB Atlas Production Cluster

1. Go to https://cloud.mongodb.com/
2. Create a new cluster named "weddinglk-prod"
3. Create a database user:
   - Username: `weddinglk`
   - Password: Generate a strong password
4. Whitelist IP addresses (add 0.0.0.0/0 for Vercel)
5. Get the connection string and update MONGODB_URI

### 3. Set Up Stripe Production Account

1. Go to https://dashboard.stripe.com/
2. Switch to "Live mode"
3. Get your live API keys:
   - Publishable key (starts with pk_live_)
   - Secret key (starts with sk_live_)
4. Set up webhook endpoint:
   - URL: `https://wedding-1hlk8nv0f-asithalkonaras-projects.vercel.app/api/payments/webhook`
   - Events: `payment_intent.succeeded`, `payment_intent.payment_failed`

### 4. Set Up Redis (Upstash)

1. Go to https://console.upstash.com/
2. Create a new Redis database
3. Get the connection URL
4. Update REDIS_URL in Vercel environment variables

### 5. Configure Google OAuth

1. Go to https://console.developers.google.com/
2. Create a new project or use existing
3. Enable Google+ API
4. Create OAuth 2.0 credentials:
   - Application type: Web application
   - Authorized redirect URIs:
     - `https://wedding-1hlk8nv0f-asithalkonaras-projects.vercel.app/api/auth/callback/google`
5. Get Client ID and Client Secret

### 6. Set Up Email Service

1. Create a Gmail account for production emails
2. Enable 2-factor authentication
3. Generate an App Password
4. Update EMAIL_SERVER_USER and EMAIL_SERVER_PASSWORD

### 7. Test Production Deployment

After setting up all environment variables:

1. Redeploy the application:
   ```bash
   vercel --prod
   ```

2. Test key features:
   - User registration and login
   - Vendor registration
   - Package browsing and booking
   - Payment processing
   - Messaging system
   - Search functionality

### 8. Populate Sample Data

Run the content population script to add sample data:

```bash
# Access your production URL
curl -X POST https://wedding-1hlk8nv0f-asithalkonaras-projects.vercel.app/api/admin/comprehensive-seed
```

## 🎯 Current Status

✅ **Completed:**
- Platform deployment to production
- All core functionality implemented
- Database models created
- API routes implemented
- UI components built
- Authentication system ready

🔄 **In Progress:**
- Production environment configuration

⏳ **Next Steps:**
- MongoDB Atlas setup
- Stripe configuration
- Email service setup
- Production testing
- Content population
- Launch preparation

## 📞 Support

If you encounter any issues during setup, check:
1. Vercel deployment logs
2. Environment variable configuration
3. Database connection status
4. API endpoint responses

Your WeddingLK platform is now live and ready for production configuration! 🎉
