# 🚀 **WeddingLK Production Deployment Guide**

## ✅ **Ready for Production Deployment**

WeddingLK is now ready for production deployment with comprehensive data seeding and NextAuth URL mismatch fixes.

---

## 🔧 **Environment Variables Setup**

### **Critical Variables (Must Set in Vercel Dashboard)**

```bash
# Application URLs (Fixes NextAuth URL mismatch)
NEXTAUTH_URL=https://wedding-lkcom.vercel.app
NEXT_PUBLIC_APP_URL=https://wedding-lkcom.vercel.app

# Database
MONGODB_URI=your_mongodb_atlas_connection_string

# Authentication
NEXTAUTH_SECRET=your_nextauth_secret_here

# Stripe Payments
STRIPE_SECRET_KEY=your_stripe_secret_key
STRIPE_PUBLISHABLE_KEY=your_stripe_publishable_key

# Redis Cache
REDIS_URL=your_redis_connection_string

# Cloudinary Media
CLOUDINARY_CLOUD_NAME=your_cloudinary_cloud_name
CLOUDINARY_API_KEY=your_cloudinary_api_key
CLOUDINARY_API_SECRET=your_cloudinary_api_secret
```

### **Optional Variables**

```bash
# Email Configuration
SMTP_HOST=your_smtp_host
SMTP_PORT=587
SMTP_USER=your_smtp_username
SMTP_PASS=your_smtp_password

# SMS Configuration
TWILIO_ACCOUNT_SID=your_twilio_account_sid
TWILIO_AUTH_TOKEN=your_twilio_auth_token

# Monitoring
SENTRY_DSN=your_sentry_dsn
LOG_LEVEL=info

# Social Media
FACEBOOK_APP_ID=your_facebook_app_id
GOOGLE_CLIENT_ID=your_google_client_id
GOOGLE_CLIENT_SECRET=your_google_client_secret
```

---

## 🚀 **Deployment Steps**

### **Option 1: Automated Deployment (Recommended)**

```bash
# Run the comprehensive deployment script
npm run deploy:prod
```

This script will:
- ✅ Set NextAuth URL to prevent mismatch
- ✅ Configure all environment variables
- ✅ Seed MongoDB Atlas with 1000+ records
- ✅ Build and deploy to Vercel
- ✅ Run post-deployment tests

### **Option 2: Manual Deployment**

```bash
# 1. Set environment variables in Vercel dashboard
vercel env add NEXTAUTH_URL production
vercel env add NEXT_PUBLIC_APP_URL production
vercel env add MONGODB_URI production
# ... add other variables

# 2. Seed the database
npm run seed:atlas:comprehensive

# 3. Deploy to production
vercel --prod --confirm
```

---

## 📊 **Data Seeding**

### **Comprehensive Seeding (1000+ Records)**

The seeder will create:
- **👥 1000 Users** - Realistic Sri Lankan user profiles
- **🏢 200 Vendors** - Complete vendor profiles with services
- **🏛️ 150 Venues** - Venues across all Sri Lankan districts
- **📅 800 Bookings** - Realistic booking data
- **⭐ 600 Reviews** - Multi-category reviews and ratings
- **❤️ 500 Favorites** - User wishlist and comparison data
- **🎁 200 Referrals** - Referral system data
- **👥 100 Guest Lists** - Wedding guest management
- **🔔 1000 Notifications** - Notification system data
- **⚖️ 50 Disputes** - Dispute resolution data
- **💳 150 Subscriptions** - Vendor subscription tiers
- **📊 500 Analytics** - Performance and business metrics

### **Run Seeding**

```bash
# Run comprehensive seeding
npm run seed:atlas:comprehensive
```

---

## 🔐 **NextAuth URL Mismatch Fix**

### **The Problem**
NextAuth.js requires the `NEXTAUTH_URL` environment variable to match the actual deployment URL to prevent security issues.

### **The Solution**
We've configured the deployment script to automatically set:
- `NEXTAUTH_URL=https://wedding-lkcom.vercel.app`
- `NEXT_PUBLIC_APP_URL=https://wedding-lkcom.vercel.app`

### **Verification**
After deployment, check that:
1. Authentication works without errors
2. No "NEXTAUTH_URL mismatch" errors in logs
3. Users can sign in/out successfully

---

## 🧪 **Post-Deployment Testing**

### **Automated Tests**
The deployment script runs these tests:
- ✅ API health check
- ✅ Authentication endpoints
- ✅ Vendor endpoints
- ✅ Database connectivity
- ✅ Cache functionality

### **Manual Testing Checklist**
- [ ] Homepage loads correctly
- [ ] User registration works
- [ ] User login works
- [ ] Vendor search works
- [ ] Booking flow works
- [ ] Payment integration works
- [ ] Admin dashboard accessible
- [ ] Mobile responsiveness
- [ ] Performance is acceptable

---

## 📈 **Performance Expectations**

### **Target Metrics**
- **Page Load Time**: < 2 seconds
- **API Response Time**: < 500ms
- **Database Query Time**: < 100ms
- **Cache Hit Rate**: > 80%
- **Uptime**: > 99.9%

### **Scalability**
- **Concurrent Users**: 10,000+
- **API Requests**: 100,000+ per day
- **Database Operations**: 1M+ per day
- **File Storage**: 100GB+ media files

---

## 🔍 **Monitoring & Maintenance**

### **Vercel Dashboard**
- Monitor deployment status
- View function logs
- Check performance metrics
- Manage environment variables

### **MongoDB Atlas**
- Monitor database performance
- Check connection usage
- View query performance
- Set up alerts

### **Redis Cache**
- Monitor cache hit rates
- Check memory usage
- View connection stats
- Set up alerts

---

## 🚨 **Troubleshooting**

### **Common Issues**

#### **NextAuth URL Mismatch**
```bash
# Solution: Set correct URL in Vercel
vercel env add NEXTAUTH_URL production
# Enter: https://wedding-lkcom.vercel.app
```

#### **Database Connection Issues**
```bash
# Check MongoDB Atlas connection string
# Ensure IP whitelist includes Vercel IPs
# Check database user permissions
```

#### **Build Failures**
```bash
# Check environment variables
# Verify all required variables are set
# Check for TypeScript errors
npm run type-check
```

#### **Performance Issues**
```bash
# Check Redis connection
# Monitor database queries
# Verify caching is working
# Check Vercel function limits
```

---

## 🎯 **Success Criteria**

### **Deployment Success**
- ✅ Application loads at https://wedding-lkcom.vercel.app
- ✅ No NextAuth URL mismatch errors
- ✅ All API endpoints respond correctly
- ✅ Database seeding completed successfully
- ✅ Authentication works properly

### **Performance Success**
- ✅ Page load times < 2 seconds
- ✅ API response times < 500ms
- ✅ No critical errors in logs
- ✅ Mobile responsiveness works
- ✅ All features functional

---

## 🚀 **Ready to Deploy!**

WeddingLK is now production-ready with:
- ✅ **Enterprise Features** - All advanced features implemented
- ✅ **Comprehensive Data** - 1000+ realistic records
- ✅ **NextAuth Fix** - URL mismatch issues resolved
- ✅ **Performance Optimization** - Caching and optimization
- ✅ **Monitoring** - Complete logging and analytics
- ✅ **Security** - Production-grade security measures

**Run `npm run deploy:prod` to deploy to production!** 🎉

