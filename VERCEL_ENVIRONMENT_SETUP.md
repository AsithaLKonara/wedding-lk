# 🚀 Vercel Environment Variables Setup Guide

## 📋 **Required Environment Variables**

### **🔐 Database Configuration**
```bash
MONGODB_URI=mongodb+srv://username:password@cluster.mongodb.net/weddinglk?retryWrites=true&w=majority
MONGODB_DB_NAME=weddinglk
```

### **🔑 Authentication (NextAuth.js)**
```bash
NEXTAUTH_URL=https://your-app-name.vercel.app
NEXTAUTH_SECRET=your-super-secret-key-here-min-32-characters
```

### **🌐 OAuth Providers**
```bash
# Google OAuth
GOOGLE_CLIENT_ID=your-google-client-id
GOOGLE_CLIENT_SECRET=your-google-client-secret

# Facebook OAuth
FACEBOOK_CLIENT_ID=your-facebook-app-id
FACEBOOK_CLIENT_SECRET=your-facebook-app-secret

# Instagram OAuth
INSTAGRAM_CLIENT_ID=your-instagram-app-id
INSTAGRAM_CLIENT_SECRET=your-instagram-app-secret
```

### **💳 Payment Processing (Stripe)**
```bash
STRIPE_PUBLISHABLE_KEY=pk_test_your-stripe-publishable-key
STRIPE_SECRET_KEY=sk_test_your-stripe-secret-key
STRIPE_WEBHOOK_SECRET=whsec_your-webhook-secret
```

### **☁️ Cloud Storage (Cloudinary)**
```bash
CLOUDINARY_CLOUD_NAME=your-cloudinary-cloud-name
CLOUDINARY_API_KEY=your-cloudinary-api-key
CLOUDINARY_API_SECRET=your-cloudinary-api-secret
```

### **📊 Caching (Redis/Upstash)**
```bash
UPSTASH_REDIS_REST_URL=https://your-redis-url.upstash.io
UPSTASH_REDIS_REST_TOKEN=your-redis-token
```

### **📧 Email Service**
```bash
EMAIL_SERVER_HOST=smtp.gmail.com
EMAIL_SERVER_PORT=587
EMAIL_SERVER_USER=your-email@gmail.com
EMAIL_SERVER_PASSWORD=your-app-password
EMAIL_FROM=noreply@weddinglk.com
```

### **📱 SMS Service (Optional)**
```bash
TWILIO_ACCOUNT_SID=your-twilio-account-sid
TWILIO_AUTH_TOKEN=your-twilio-auth-token
TWILIO_PHONE_NUMBER=your-twilio-phone-number
```

### **🎯 Meta Ads API (Facebook/Instagram)**
```bash
META_APP_ID=your-meta-app-id
META_APP_SECRET=your-meta-app-secret
META_ACCESS_TOKEN=your-meta-access-token
```

### **🔍 AI Services (Optional)**
```bash
OPENAI_API_KEY=your-openai-api-key
ANTHROPIC_API_KEY=your-anthropic-api-key
```

### **🌍 Application Settings**
```bash
NODE_ENV=production
NEXT_PUBLIC_APP_URL=https://your-app-name.vercel.app
NEXT_PUBLIC_APP_NAME=WeddingLK
NEXT_PUBLIC_APP_DESCRIPTION=Sri Lanka's Premier Wedding Planning Platform
```

## 🚀 **How to Set Environment Variables in Vercel**

### **Method 1: Vercel Dashboard**
1. Go to [vercel.com](https://vercel.com)
2. Select your project
3. Go to Settings → Environment Variables
4. Add each variable with the correct value
5. Set environment to "Production"

### **Method 2: Vercel CLI**
```bash
# Set individual variables
vercel env add MONGODB_URI production
vercel env add NEXTAUTH_SECRET production
vercel env add STRIPE_SECRET_KEY production

# Or add from file
vercel env add .env.production
```

### **Method 3: Bulk Import**
```bash
# Create .env.production file with all variables
# Then import
vercel env add .env.production
```

## 🔒 **Security Best Practices**

1. **Never commit secrets to Git**
2. **Use strong, unique secrets**
3. **Rotate secrets regularly**
4. **Use different secrets for different environments**
5. **Enable Vercel's security features**

## 📝 **Quick Setup Commands**

```bash
# 1. Login to Vercel
vercel login

# 2. Link project
vercel link

# 3. Set environment variables
vercel env add MONGODB_URI production
vercel env add NEXTAUTH_SECRET production
vercel env add STRIPE_SECRET_KEY production
vercel env add CLOUDINARY_CLOUD_NAME production
vercel env add UPSTASH_REDIS_REST_URL production
vercel env add UPSTASH_REDIS_REST_TOKEN production

# 4. Deploy
vercel --prod
```

## 🎯 **Priority Order for Setup**

1. **Essential (Required for basic functionality):**
   - MONGODB_URI
   - NEXTAUTH_SECRET
   - NEXTAUTH_URL

2. **Important (Required for full features):**
   - STRIPE_SECRET_KEY
   - CLOUDINARY_CLOUD_NAME
   - GOOGLE_CLIENT_ID

3. **Optional (Enhanced features):**
   - UPSTASH_REDIS_REST_URL
   - META_APP_ID
   - OPENAI_API_KEY

## 🚨 **Troubleshooting**

### **Common Issues:**
- **MongoDB Connection:** Check connection string format
- **NextAuth Issues:** Ensure NEXTAUTH_URL matches your domain
- **Stripe Errors:** Verify webhook endpoints
- **Cloudinary Uploads:** Check API credentials

### **Testing Environment Variables:**
```bash
# Test database connection
vercel env pull .env.local
npm run dev

# Check environment variables
vercel env ls
```