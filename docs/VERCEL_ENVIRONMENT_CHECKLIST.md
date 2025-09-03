# 🚀 Vercel Deployment Environment Checklist

## ❌ **Critical Issues in Your Current env.local:**

### 1. **Missing OAuth Provider Credentials**
```bash
# ADD THESE TO VERCEL ENVIRONMENT VARIABLES:
GOOGLE_CLIENT_ID=your-google-client-id
GOOGLE_CLIENT_SECRET=your-google-client-secret
FACEBOOK_CLIENT_ID=your-facebook-client-id
FACEBOOK_CLIENT_SECRET=your-facebook-client-secret
```

### 2. **Missing OpenAI API Key**
```bash
# REQUIRED for AI features:
OPENAI_API_KEY=your-openai-api-key
```

### 3. **Update URLs for Production**
```bash
# CHANGE THESE:
NEXTAUTH_URL=https://your-domain.vercel.app
CORS_ORIGIN=https://your-domain.vercel.app
NEXT_PUBLIC_APP_URL=https://your-domain.vercel.app
```

### 4. **Redis Configuration**
```bash
# Your current: redis://localhost:6379 (won't work on Vercel)
# Use: Upstash Redis or Redis Cloud
REDIS_URL=redis://your-production-redis-url:6379
```

### 5. **Generate Production Secrets**
```bash
# Generate new secrets for production:
NEXTAUTH_SECRET=your-production-secret-key
JWT_SECRET=your-production-jwt-secret
```

## ✅ **What's Already Good:**

- ✅ MongoDB Atlas connection string
- ✅ Cloudinary configuration
- ✅ Stripe keys (use live keys for production)
- ✅ SMTP configuration (update email for production)

## 🔧 **Step-by-Step Vercel Setup:**

### 1. **Get OAuth Credentials**

#### Google OAuth:
1. Go to [Google Cloud Console](https://console.developers.google.com/)
2. Create OAuth 2.0 credentials
3. Add redirect URI: `https://your-domain.vercel.app/api/auth/callback/google`

#### Facebook OAuth:
1. Go to [Facebook Developers](https://developers.facebook.com/)
2. Create app with Facebook Login
3. Add redirect URI: `https://your-domain.vercel.app/api/auth/callback/facebook`

### 2. **Get OpenAI API Key**
1. Go to [OpenAI Platform](https://platform.openai.com/)
2. Create API key
3. Add to Vercel environment variables

### 3. **Set Up Redis (Choose One)**

#### Option A: Upstash Redis (Recommended)
1. Go to [Upstash](https://upstash.com/)
2. Create Redis database
3. Copy connection string

#### Option B: Redis Cloud
1. Go to [Redis Cloud](https://redis.com/redis-enterprise-cloud/)
2. Create database
3. Copy connection string

### 4. **Vercel Environment Variables**

Add these to your Vercel project settings:

```bash
# Required
NODE_ENV=production
NEXTAUTH_URL=https://your-domain.vercel.app
NEXTAUTH_SECRET=your-production-secret
JWT_SECRET=your-production-jwt-secret
MONGODB_URI=mongodb+srv://asithalakmalkonara11992081:1234@cluster0.ezztfbi.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0
REDIS_URL=redis://your-production-redis-url:6379

# OAuth Providers
GOOGLE_CLIENT_ID=your-google-client-id
GOOGLE_CLIENT_SECRET=your-google-client-secret
FACEBOOK_CLIENT_ID=your-facebook-client-id
FACEBOOK_CLIENT_SECRET=your-facebook-client-secret

# AI Services
OPENAI_API_KEY=your-openai-api-key

# Payment
STRIPE_SECRET_KEY=sk_live_your-live-stripe-secret-key
STRIPE_PUBLISHABLE_KEY=pk_live_your-live-stripe-publishable-key
STRIPE_WEBHOOK_SECRET=whsec_your-stripe-webhook-secret

# Cloudinary (keep your existing)
CLOUDINARY_CLOUD_NAME=dl2h9t0le
CLOUDINARY_API_KEY=136527429911654
CLOUDINARY_API_SECRET=rLy6xSu_3pXaB0GFgHUH3oRCXM8
CLOUDINARY_URL=cloudinary://136527429911654:rLy6xSu_3pXaB0GFgHUH3oRCXM8@dl2h9t0le

# Email
SMTP_HOST=smtp.gmail.com
SMTP_PORT=587
SMTP_USER=your-production-email@gmail.com
SMTP_PASS=your-production-app-password
SMTP_FROM=WeddingLK <noreply@weddinglk.com>

# Security
CORS_ORIGIN=https://your-domain.vercel.app
NEXT_PUBLIC_APP_URL=https://your-domain.vercel.app
RATE_LIMIT_WINDOW_MS=900000
RATE_LIMIT_MAX_REQUESTS=100

# Performance
REDIS_CACHE_TTL=3600
MONGODB_POOL_SIZE=10
MONGODB_SERVER_SELECTION_TIMEOUT_MS=5000
MONGODB_SOCKET_TIMEOUT_MS=45000

# Monitoring
ENABLE_HEALTH_CHECKS=true
ENABLE_PERFORMANCE_MONITORING=true
LOG_LEVEL=info
SKIP_AUTH=false
SKIP_HEALTH_CHECKS=false
```

## 🚨 **Security Notes:**

1. **Never commit production secrets to Git**
2. **Use Vercel's environment variables for all secrets**
3. **Generate new secrets for production (don't use dev secrets)**
4. **Use live Stripe keys only for production**
5. **Update email credentials for production**

## 🧪 **Testing After Deployment:**

1. Test OAuth login (Google/Facebook)
2. Test AI features
3. Test file uploads (Cloudinary)
4. Test email functionality
5. Test payment processing
6. Check Redis caching

## 📞 **Need Help?**

If you encounter issues:
1. Check Vercel function logs
2. Verify all environment variables are set
3. Test OAuth redirect URIs
4. Check database connectivity
