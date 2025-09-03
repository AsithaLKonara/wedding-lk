# 🚀 Vercel Setup Guide for WeddingLK

This guide helps you set up a stable Vercel deployment that won't change URLs with each deployment.

## 🎯 **The Problem**
- Vercel preview URLs change with each deployment
- This breaks OAuth authentication
- You need a stable URL for production

## ✅ **The Solution**
Use Vercel's stable production URL or set up a custom domain.

## 📋 **Quick Setup (Recommended)**

### **Step 1: Install Vercel CLI**
```bash
npm install -g vercel
```

### **Step 2: Run the Setup Script**
```bash
./scripts/setup-vercel.sh
```

### **Step 3: Get Your Stable URL**
```bash
node scripts/get-stable-url.js
```

### **Step 4: Update OAuth Providers**
Use the stable URL from Step 3 to update your OAuth provider settings.

## 🔧 **Manual Setup**

### **1. Login and Link Project**
```bash
vercel login
vercel link
```

### **2. Set Environment Variables**
```bash
# Core variables
vercel env add NODE_ENV production
vercel env add NEXTAUTH_SECRET "your-secret-here"
vercel env add JWT_SECRET "your-jwt-secret"

# OAuth Providers
vercel env add GOOGLE_CLIENT_ID "your-google-client-id"
vercel env add GOOGLE_CLIENT_SECRET "your-google-client-secret"
vercel env add FACEBOOK_CLIENT_ID "your-facebook-client-id"
vercel env add FACEBOOK_CLIENT_SECRET "your-facebook-client-secret"

# Database
vercel env add MONGODB_URI "your-mongodb-uri"
vercel env add REDIS_URL "your-redis-url"

# Add all other environment variables from your env.local
```

### **3. Deploy to Production**
```bash
vercel --prod
```

### **4. Get Stable URL**
After deployment, you'll get a stable URL like:
`https://your-project-name.vercel.app`

## 🌐 **Custom Domain Setup (Optional)**

### **Option 1: Vercel Subdomain (Free)**
```bash
./scripts/setup-custom-domain.sh
# Choose option 1
```

### **Option 2: Your Own Domain**
```bash
./scripts/setup-custom-domain.sh
# Choose option 2
# Enter your domain (e.g., weddinglk.com)
```

## 🔄 **OAuth Provider Updates**

### **Google OAuth Console**
1. Go to [Google Cloud Console](https://console.cloud.google.com/)
2. Navigate to APIs & Services > Credentials
3. Edit your OAuth 2.0 Client ID
4. Add redirect URI: `https://your-stable-url.vercel.app/api/auth/callback/google`

### **Facebook Developer Console**
1. Go to [Facebook Developers](https://developers.facebook.com/)
2. Select your app
3. Go to Facebook Login > Settings
4. Add redirect URI: `https://your-stable-url.vercel.app/api/auth/callback/facebook`

## 🚀 **Deployment Workflow**

### **For Development**
```bash
vercel  # Deploys to preview URL
```

### **For Production**
```bash
vercel --prod  # Deploys to stable production URL
```

### **Automatic Deployments**
- Push to `main` branch → Auto-deploys to production
- Push to other branches → Auto-deploys to preview

## 🔧 **Environment Variables Management**

### **Add New Variable**
```bash
vercel env add VARIABLE_NAME "value"
```

### **List All Variables**
```bash
vercel env ls
```

### **Remove Variable**
```bash
vercel env rm VARIABLE_NAME
```

## 📊 **Monitoring & Debugging**

### **View Logs**
```bash
vercel logs
```

### **Check Deployment Status**
```bash
vercel ls
```

### **Inspect Deployment**
```bash
vercel inspect [deployment-url]
```

## 🎯 **Best Practices**

1. **Always use production URL for OAuth**: `vercel --prod`
2. **Set up custom domain**: More professional and stable
3. **Use environment variables**: Never hardcode secrets
4. **Test locally first**: Use `vercel dev` for local testing
5. **Monitor deployments**: Check logs for any issues

## 🆘 **Troubleshooting**

### **Authentication Still Failing?**
1. Check OAuth redirect URIs match exactly
2. Verify environment variables are set in Vercel
3. Check Vercel logs: `vercel logs`
4. Test with stable production URL

### **Environment Variables Not Working?**
1. Redeploy after adding variables: `vercel --prod`
2. Check variable names match exactly
3. Verify no typos in values

### **Custom Domain Not Working?**
1. Check DNS propagation (can take 24-48 hours)
2. Verify DNS records are correct
3. Check domain status in Vercel dashboard

## 📞 **Support**

- Vercel Documentation: https://vercel.com/docs
- Vercel CLI Help: `vercel --help`
- Project Issues: Check the GitHub repository

---

**🎉 Once set up, your authentication will work consistently across all deployments!**
