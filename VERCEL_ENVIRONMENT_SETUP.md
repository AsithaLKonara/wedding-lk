# Vercel Environment Variables Setup Guide

## 🚨 Critical Issue
The production deployment is missing essential environment variables, causing database connection failures and empty API responses.

## ✅ Current Status
- ✅ Database is properly seeded with all data (300 reviews, 500 notifications, 50 vendors, 200 bookings)
- ✅ Local database connection works perfectly
- ❌ Production APIs return empty results due to missing environment variables
- ❌ Health endpoint times out due to database connection issues

## 🔧 Required Environment Variables in Vercel Dashboard

You need to set these environment variables in your Vercel project dashboard:

### 1. Go to Vercel Dashboard
- Visit: https://vercel.com/dashboard
- Select your project: `wedding-lk`
- Go to Settings → Environment Variables

### 2. Add These Variables

| Variable Name | Value | Environment |
|---------------|-------|-------------|
| `MONGODB_URI` | `mongodb+srv://asithalakmalkonara11992081:1234@cluster0.ezztfbi.mongodb.net/weddinglk?retryWrites=true&w=majority&appName=Cluster0` | Production, Preview, Development |
| `NEXTAUTH_SECRET` | `your-nextauth-secret-here` | Production, Preview, Development |
| `NEXTAUTH_URL` | `https://wedding-lkcom.vercel.app` | Production, Preview, Development |
| `GOOGLE_CLIENT_ID` | `your-google-client-id` | Production, Preview, Development |
| `GOOGLE_CLIENT_SECRET` | `your-google-client-secret` | Production, Preview, Development |
| `REDIS_URL` | `your-redis-url` | Production, Preview, Development |
| `NODE_ENV` | `production` | Production, Preview, Development |

### 3. After Adding Variables
1. **Redeploy** the project (trigger a new deployment)
2. **Test** the APIs to verify data is accessible

## 🧪 Test Commands

After setting up environment variables, test these endpoints:

```bash
# Test Reviews API
curl "https://wedding-lkcom.vercel.app/api/reviews"

# Test Notifications API  
curl "https://wedding-lkcom.vercel.app/api/notifications"

# Test Health Check
curl "https://wedding-lkcom.vercel.app/api/health"

# Test Vendors API
curl "https://wedding-lkcom.vercel.app/api/vendors"
```

## 📊 Expected Results

With proper environment variables, you should see:
- **Reviews API**: 300 reviews with pagination
- **Notifications API**: 500 notifications with pagination  
- **Vendors API**: 50 vendors with full details
- **Health API**: Database connection status and collection counts

## 🔍 Verification

The database contains:
- ✅ 300 Reviews
- ✅ 500 Notifications
- ✅ 50 Vendors
- ✅ 200 Bookings
- ✅ 100 Users
- ✅ 30 Venues
- ✅ 400 Messages
- ✅ 150 Payments

All data is properly seeded and ready for production use.

## 🚀 Next Steps

1. Set environment variables in Vercel dashboard
2. Trigger redeployment
3. Test all APIs
4. Verify data is accessible
5. Run comprehensive production tests
