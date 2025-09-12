# 🚀 WeddingLK Deployment Instructions

## Quick Start Deployment

Based on the live site at [https://wedding-lkcom.vercel.app](https://wedding-lkcom.vercel.app), here are the complete deployment instructions:

## 🎯 Immediate Deployment Steps

### 1. Prerequisites Check
```bash
# Check if Vercel CLI is installed
vercel --version

# If not installed, install it
npm install -g vercel@latest
```

### 2. Login to Vercel
```bash
# Login to your Vercel account
npm run vercel:login
```

### 3. Link Project to Vercel
```bash
# Link this project to Vercel
npm run vercel:link
```

### 4. Set Environment Variables in Vercel Dashboard

Go to [Vercel Dashboard](https://vercel.com/dashboard) → Your Project → Settings → Environment Variables

**CRITICAL**: Add these environment variables:

```env
NEXTAUTH_URL=https://wedding-lkcom.vercel.app
NEXT_PUBLIC_APP_URL=https://wedding-lkcom.vercel.app
NEXTAUTH_SECRET=your-nextauth-secret-here
MONGODB_URI=your-mongodb-connection-string
REDIS_URL=your-redis-connection-string
STRIPE_SECRET_KEY=your-stripe-secret-key
STRIPE_PUBLISHABLE_KEY=your-stripe-publishable-key
CLOUDINARY_CLOUD_NAME=your-cloudinary-cloud-name
CLOUDINARY_API_KEY=your-cloudinary-api-key
CLOUDINARY_API_SECRET=your-cloudinary-api-secret
OPENAI_API_KEY=your-openai-api-key
```

### 5. Deploy to Production

**Option A: Quick Deploy (Recommended)**
```bash
# Deploy to production with all checks
npm run deploy:prod
```

**Option B: Manual Deploy**
```bash
# Deploy to production
npm run deploy
```

**Option C: Preview First**
```bash
# Deploy to preview first
npm run deploy:preview

# If preview works, deploy to production
npm run deploy:prod
```

## 🔧 CI/CD Pipeline Setup

### GitHub Actions Setup

1. **Add GitHub Secrets** (Repository Settings → Secrets and variables → Actions):
   ```
   VERCEL_TOKEN=your-vercel-token
   VERCEL_ORG_ID=your-vercel-org-id
   VERCEL_PROJECT_ID=your-vercel-project-id
   NEXTAUTH_SECRET=your-nextauth-secret
   MONGODB_URI=your-mongodb-uri
   REDIS_URL=your-redis-url
   STRIPE_SECRET_KEY=your-stripe-secret-key
   STRIPE_PUBLISHABLE_KEY=your-stripe-publishable-key
   CLOUDINARY_CLOUD_NAME=your-cloudinary-cloud-name
   CLOUDINARY_API_KEY=your-cloudinary-api-key
   CLOUDINARY_API_SECRET=your-cloudinary-api-secret
   OPENAI_API_KEY=your-openai-api-key
   SNYK_TOKEN=your-snyk-token
   ```

2. **Push to Main Branch**:
   ```bash
   git add .
   git commit -m "Deploy to production"
   git push origin main
   ```

3. **Monitor Deployment**:
   - Check GitHub Actions tab
   - Monitor Vercel dashboard
   - View deployment logs

## 🛠️ Troubleshooting

### NextAuth URL Mismatch Error

**Problem**: `NEXTAUTH_URL` mismatch error

**Solution**:
1. Ensure `NEXTAUTH_URL=https://wedding-lkcom.vercel.app` in Vercel
2. No trailing slash in the URL
3. Redeploy after updating environment variables

### Build Failures

**Problem**: Build fails during deployment

**Solution**:
1. Check build logs in Vercel dashboard
2. Run locally: `npm run build`
3. Check TypeScript errors: `npm run type-check`
4. Check linting: `npm run lint`

### Database Connection Issues

**Problem**: Cannot connect to MongoDB

**Solution**:
1. Verify `MONGODB_URI` is correct
2. Check MongoDB Atlas IP whitelist (add 0.0.0.0/0 for Vercel)
3. Ensure database user has proper permissions

## 📊 Post-Deployment Verification

### 1. Health Checks
```bash
# Check if the site is live
curl https://wedding-lkcom.vercel.app/api/health

# Check vendors API
curl https://wedding-lkcom.vercel.app/api/vendors

# Check venues API
curl https://wedding-lkcom.vercel.app/api/venues
```

### 2. Manual Testing
- [ ] Visit https://wedding-lkcom.vercel.app
- [ ] Test user registration/login
- [ ] Check admin dashboard
- [ ] Test vendor/venue creation
- [ ] Verify payment processing
- [ ] Test image uploads
- [ ] Check mobile responsiveness

### 3. Performance Check
```bash
# Check deployment logs
npm run vercel:logs

# Monitor performance
# Visit Vercel dashboard → Analytics
```

## 🎉 Success Indicators

When deployment is successful, you should see:

1. **Site loads** at https://wedding-lkcom.vercel.app
2. **Authentication works** (sign in/out)
3. **All APIs respond** correctly
4. **Admin dashboard** is accessible
5. **No console errors** in browser
6. **Mobile responsive** design
7. **Fast loading** times

## 📈 Monitoring

### Vercel Dashboard
- **Deployments**: View all deployments
- **Analytics**: Performance metrics
- **Functions**: API function logs
- **Domains**: Domain management

### GitHub Actions
- **CI/CD Pipeline**: Automated testing and deployment
- **Test Results**: Unit, integration, and E2E tests
- **Security Scans**: Automated security checks
- **Performance Tests**: Load and performance testing

## 🔐 Security Checklist

- [ ] Environment variables are secure
- [ ] Database connections use SSL
- [ ] API endpoints have proper validation
- [ ] Authentication is working correctly
- [ ] HTTPS is enforced
- [ ] CORS is configured properly
- [ ] Rate limiting is implemented

## 📞 Support

If you encounter issues:

1. **Check Logs**: `npm run vercel:logs`
2. **Vercel Support**: [Vercel Documentation](https://vercel.com/docs)
3. **GitHub Issues**: Check repository issues
4. **Development Team**: Contact for assistance

## 🎯 Final Notes

The WeddingLK platform is now ready for production deployment with:

- ✅ **Complete CRUD Operations** for all entities
- ✅ **Advanced Authentication** with NextAuth.js
- ✅ **Comprehensive API** with validation and error handling
- ✅ **Admin Dashboard** for management
- ✅ **Payment Processing** integration
- ✅ **Image Upload** capabilities
- ✅ **Mobile Responsive** design
- ✅ **Performance Optimized** for production
- ✅ **Security Hardened** for production use
- ✅ **CI/CD Pipeline** for automated deployment

**Ready to deploy! 🚀**

---

**Deployment URL**: https://wedding-lkcom.vercel.app
**Documentation**: [CRUD Operations Guide](docs/CRUD_OPERATIONS_GUIDE.md)
**Deployment Guide**: [Detailed Deployment Guide](docs/DEPLOYMENT_GUIDE.md)

