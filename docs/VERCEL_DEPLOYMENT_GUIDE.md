# 🚀 Vercel Deployment Guide for WeddingLK

## 📋 **Prerequisites**

1. **Vercel Account**: Sign up at [vercel.com](https://vercel.com)
2. **GitHub Repository**: Push your code to GitHub
3. **Environment Variables**: Set up all required environment variables

## 🔧 **Environment Variables Setup**

### **Required Environment Variables**

Set these in your Vercel project settings:

```bash
# Database
MONGODB_URI=mongodb+srv://username:password@cluster.mongodb.net/weddinglk

# NextAuth.js
NEXTAUTH_URL=https://your-domain.vercel.app
NEXTAUTH_SECRET=your-secret-key-here

# OAuth Providers
GOOGLE_CLIENT_ID=your-google-client-id
GOOGLE_CLIENT_SECRET=your-google-client-secret
FACEBOOK_CLIENT_ID=your-facebook-client-id
FACEBOOK_CLIENT_SECRET=your-facebook-client-secret

# OpenAI API
OPENAI_API_KEY=your-openai-api-key

# Redis (for caching)
REDIS_URL=redis://your-redis-url

# Email Service
SMTP_HOST=smtp.gmail.com
SMTP_PORT=587
SMTP_USER=your-email@gmail.com
SMTP_PASS=your-app-password
SMTP_FROM=WeddingLK <noreply@weddinglk.com>

# Cloudinary (for file uploads)
CLOUDINARY_CLOUD_NAME=your-cloud-name
CLOUDINARY_API_KEY=your-api-key
CLOUDINARY_API_SECRET=your-api-secret

# Payment Gateway
PAYHERE_MERCHANT_ID=your-merchant-id
PAYHERE_MERCHANT_SECRET=your-merchant-secret

# App Configuration
NEXT_PUBLIC_APP_URL=https://your-domain.vercel.app
NODE_ENV=production
```

## 🚀 **Deployment Steps**

### **1. Connect to Vercel**

1. Go to [vercel.com](https://vercel.com)
2. Click "New Project"
3. Import your GitHub repository
4. Vercel will automatically detect it's a Next.js project

### **2. Configure Build Settings**

- **Framework Preset**: Next.js
- **Root Directory**: `./` (default)
- **Build Command**: `npm run build`
- **Output Directory**: `.next` (default)
- **Install Command**: `npm install`

### **3. Set Environment Variables**

1. Go to your project settings
2. Navigate to "Environment Variables"
3. Add all the environment variables listed above
4. Make sure to set them for all environments (Production, Preview, Development)

### **4. Deploy**

1. Click "Deploy"
2. Wait for the build to complete
3. Your app will be available at `https://your-project.vercel.app`

## 🔧 **Post-Deployment Configuration**

### **1. Update OAuth Redirect URLs**

Update your OAuth provider settings:

**Google OAuth:**
- Go to [Google Cloud Console](https://console.cloud.google.com)
- Update authorized redirect URIs:
  - `https://your-domain.vercel.app/api/auth/callback/google`

**Facebook OAuth:**
- Go to [Facebook Developers](https://developers.facebook.com)
- Update Valid OAuth Redirect URIs:
  - `https://your-domain.vercel.app/api/auth/callback/facebook`

### **2. Database Setup**

**MongoDB Atlas:**
1. Create a MongoDB Atlas cluster
2. Whitelist Vercel IP addresses
3. Create a database user
4. Update `MONGODB_URI` in Vercel environment variables

### **3. Redis Setup**

**Redis Cloud:**
1. Create a Redis Cloud account
2. Create a new database
3. Update `REDIS_URL` in Vercel environment variables

### **4. Domain Configuration**

**Custom Domain:**
1. Go to your Vercel project settings
2. Navigate to "Domains"
3. Add your custom domain
4. Update DNS records as instructed

## 📊 **Performance Optimization**

### **1. Enable Vercel Analytics**

```bash
npm install @vercel/analytics
```

Add to your `app/layout.tsx`:
```tsx
import { Analytics } from '@vercel/analytics/react';

export default function RootLayout({ children }) {
  return (
    <html>
      <body>
        {children}
        <Analytics />
      </body>
    </html>
  );
}
```

### **2. Enable Vercel Speed Insights**

```bash
npm install @vercel/speed-insights
```

Add to your `app/layout.tsx`:
```tsx
import { SpeedInsights } from '@vercel/speed-insights/next';

export default function RootLayout({ children }) {
  return (
    <html>
      <body>
        {children}
        <SpeedInsights />
      </body>
    </html>
  );
}
```

### **3. Optimize Images**

The project already includes Next.js Image Optimization. Ensure all images use the `next/image` component.

### **4. Enable Edge Functions**

For better performance, consider moving some API routes to Edge Functions:

```typescript
// app/api/example/route.ts
export const runtime = 'edge';
```

## 🔒 **Security Configuration**

### **1. Security Headers**

The `vercel.json` file already includes security headers. Review and customize as needed.

### **2. Rate Limiting**

The project includes rate limiting. Adjust limits in environment variables:
- `RATE_LIMIT_WINDOW_MS`: Time window in milliseconds
- `RATE_LIMIT_MAX_REQUESTS`: Maximum requests per window

### **3. CORS Configuration**

Update CORS settings in `vercel.json` if needed for your domain.

## 📱 **Mobile App Integration**

### **1. PWA Configuration**

The project includes PWA support. Update `public/manifest.json` with your app details.

### **2. Mobile API Endpoints**

Ensure mobile API endpoints are accessible:
- `/api/mobile/` - Mobile-specific endpoints
- `/api/ai-search-enhanced/` - AI search for mobile

## 🔍 **Monitoring & Analytics**

### **1. Error Tracking**

Consider adding error tracking:
```bash
npm install @sentry/nextjs
```

### **2. Performance Monitoring**

Use Vercel's built-in analytics and consider additional monitoring tools.

## 🚨 **Troubleshooting**

### **Common Issues:**

1. **Build Failures:**
   - Check environment variables are set correctly
   - Ensure all dependencies are in `package.json`
   - Review build logs in Vercel dashboard

2. **Database Connection Issues:**
   - Verify MongoDB Atlas connection string
   - Check IP whitelist settings
   - Ensure database user has correct permissions

3. **OAuth Issues:**
   - Verify redirect URLs are correct
   - Check client IDs and secrets
   - Ensure OAuth apps are properly configured

4. **API Errors:**
   - Check function timeout settings
   - Review API route implementations
   - Monitor Vercel function logs

### **Debug Mode:**

Enable debug mode by setting:
```bash
NODE_ENV=development
```

## 📈 **Scaling Considerations**

### **1. Database Scaling**

- Use MongoDB Atlas for automatic scaling
- Implement database connection pooling
- Consider read replicas for heavy read workloads

### **2. Caching Strategy**

- Redis for session storage and caching
- Vercel Edge Network for static assets
- Implement CDN for global content delivery

### **3. Function Scaling**

- Vercel automatically scales functions
- Consider Edge Functions for better performance
- Monitor function execution times

## 🎉 **Success Checklist**

- [ ] Project deployed to Vercel
- [ ] Environment variables configured
- [ ] Database connected and working
- [ ] OAuth providers configured
- [ ] Custom domain set up (optional)
- [ ] Analytics enabled
- [ ] Security headers configured
- [ ] Performance optimized
- [ ] Error monitoring set up
- [ ] Mobile app integration working

## 📞 **Support**

For deployment issues:
1. Check Vercel documentation
2. Review build logs
3. Test locally with production environment variables
4. Contact Vercel support if needed

---

**Your WeddingLK app is now ready for production! 🎉**
