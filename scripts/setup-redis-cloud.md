# Redis Cloud Setup Guide

## 🚀 **Step 1: Create Redis Cloud Account**

1. Go to [Redis Cloud](https://redis.com/try-free/)
2. Sign up for a free account
3. Create a new database subscription

## 🔧 **Step 2: Configure Database**

1. **Database Name**: `weddinglk-cache`
2. **Cloud Provider**: AWS (recommended)
3. **Region**: Choose closest to your users
4. **Memory Limit**: 30MB (free tier)

## 🔑 **Step 3: Get Connection Details**

After creating the database, you'll get:
- **Endpoint**: `redis-12345.c1.us-east-1-1.ec2.cloud.redislabs.com`
- **Port**: `12345`
- **Password**: `weddinglk2024` (or generate a secure one)

## 📝 **Step 4: Update Environment Variables**

Update your `.env.local` file with the real Redis Cloud URL:

```bash
REDIS_URL=redis://default:YOUR_PASSWORD@YOUR_ENDPOINT:YOUR_PORT
```

Example:
```bash
REDIS_URL=redis://default:weddinglk2024@redis-12345.c1.us-east-1-1.ec2.cloud.redislabs.com:12345
```

## 🧪 **Step 5: Test Connection**

Run the test script:
```bash
node scripts/test-redis-connection.js
```

## 🚀 **Step 6: Deploy with Redis**

After confirming the connection works locally:
```bash
npm run build
npx vercel --prod
```

## 📊 **Redis Features Enabled**

- ✅ **Session Caching**: Faster authentication
- ✅ **API Response Caching**: Reduced database queries
- ✅ **Real-time Features**: Chat, notifications
- ✅ **Performance Monitoring**: Cache hit/miss ratios
- ✅ **Rate Limiting**: Enhanced security

## 🔒 **Security Notes**

- Use strong passwords
- Enable TLS in production
- Restrict access by IP if possible
- Monitor usage and costs

## 💰 **Pricing**

- **Free Tier**: 30MB, 30 connections
- **Paid Plans**: Start at $7/month for 250MB
- **Usage**: Monitor in Redis Cloud dashboard
