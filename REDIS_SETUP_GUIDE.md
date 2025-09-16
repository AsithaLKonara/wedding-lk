# Redis (Upstash) Production Setup Guide

## 🚀 Setting Up Redis for WeddingLK Production

### Step 1: Create Upstash Account
1. Go to https://console.upstash.com/
2. Sign up or log in to your account
3. Complete account verification

### Step 2: Create Redis Database
1. Click "Create Database"
2. Database name: "weddinglk-prod"
3. Region: Choose closest to your users (e.g., Asia Pacific)
4. Type: "Regional" (for better performance)
5. Click "Create"

### Step 3: Get Connection Details
1. Click on your database
2. Go to "Details" tab
3. Copy the **Redis URL**
4. Copy the **Redis Token** (if needed)

### Step 4: Configure Redis Settings
1. Go to "Settings" tab
2. Configure memory limit (start with 256MB)
3. Set up backup settings
4. Configure monitoring alerts

### Step 5: Update Vercel Environment Variables
Go to https://vercel.com/asithalkonaras-projects/wedding-lk/settings/environment-variables

Add this environment variable:

```bash
REDIS_URL=redis://default:your_token@your_endpoint.upstash.io:6379
```

### Step 6: Test Redis Connection
Your WeddingLK platform includes Redis integration for:
- Session storage
- Caching
- Real-time features
- Rate limiting

## 🔧 Redis Integration Features

### Caching System:
- User session caching
- API response caching
- Search result caching
- Image optimization caching

### Real-time Features:
- Live notifications
- Real-time messaging
- Live booking updates
- Real-time search

### Performance Optimization:
- Database query caching
- Static content caching
- API response caching
- User preference caching

## 📊 Redis Usage Patterns

### Session Management:
```typescript
// Store user sessions
await redis.set(`session:${sessionId}`, JSON.stringify(sessionData), 'EX', 3600);

// Retrieve user sessions
const sessionData = await redis.get(`session:${sessionId}`);
```

### Caching:
```typescript
// Cache API responses
await redis.setex(`cache:${key}`, 300, JSON.stringify(data));

// Retrieve cached data
const cachedData = await redis.get(`cache:${key}`);
```

### Real-time Features:
```typescript
// Publish notifications
await redis.publish('notifications', JSON.stringify(notification));

// Subscribe to updates
await redis.subscribe('notifications');
```

## 🎯 Next Steps After Redis Setup

1. ✅ Redis configured
2. ⏳ Test caching functionality
3. ⏳ Set up email service
4. ⏳ Test real-time features
5. ⏳ Configure monitoring
6. ⏳ Test performance improvements
7. ⏳ Populate sample data

## 🔗 Useful Links

- [Upstash Console](https://console.upstash.com/)
- [Redis Documentation](https://redis.io/documentation)
- [Vercel Environment Variables](https://vercel.com/asithalkonaras-projects/wedding-lk/settings/environment-variables)

## 📞 Support

If you encounter issues:
1. Check Upstash dashboard for errors
2. Verify connection string format
3. Test Redis commands
4. Check Vercel deployment logs
5. Review Redis configuration
