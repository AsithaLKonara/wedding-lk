# 🚀 WeddingLK Vercel Deployment Guide

## Overview

This guide will help you deploy the WeddingLK project to Vercel at https://wedding-lkcom.vercel.app with proper CI/CD pipeline setup to avoid NextAuth URL mismatch errors.

## 📋 Prerequisites

- [Vercel Account](https://vercel.com)
- [GitHub Repository](https://github.com)
- [MongoDB Atlas](https://mongodb.com/atlas) account
- [Redis Cloud](https://redis.com) account (optional)
- [Stripe Account](https://stripe.com) (for payments)
- [Cloudinary Account](https://cloudinary.com) (for image storage)

## 🔧 Environment Variables Setup

### Required Environment Variables

Set these in your Vercel dashboard under Project Settings > Environment Variables:

```env
# Application URLs (CRITICAL for NextAuth)
NEXTAUTH_URL=https://wedding-lkcom.vercel.app
NEXT_PUBLIC_APP_URL=https://wedding-lkcom.vercel.app

# Authentication
NEXTAUTH_SECRET=your-super-secret-key-here
GOOGLE_CLIENT_ID=your-google-client-id
GOOGLE_CLIENT_SECRET=your-google-client-secret
FACEBOOK_CLIENT_ID=your-facebook-client-id
FACEBOOK_CLIENT_SECRET=your-facebook-client-secret

# Database
MONGODB_URI=mongodb+srv://username:password@cluster.mongodb.net/weddinglk
REDIS_URL=redis://username:password@host:port

# Payment Processing
STRIPE_SECRET_KEY=sk_live_your-stripe-secret-key
STRIPE_PUBLISHABLE_KEY=pk_live_your-stripe-publishable-key

# Cloud Storage
CLOUDINARY_CLOUD_NAME=your-cloudinary-cloud-name
CLOUDINARY_API_KEY=your-cloudinary-api-key
CLOUDINARY_API_SECRET=your-cloudinary-api-secret

# AI Services
OPENAI_API_KEY=sk-your-openai-api-key

# Email Services
SMTP_HOST=smtp.gmail.com
SMTP_PORT=587
SMTP_USER=your-email@gmail.com
SMTP_PASS=your-app-password

# Security
JWT_SECRET=your-jwt-secret
ENCRYPTION_KEY=your-encryption-key

# Analytics
GOOGLE_ANALYTICS_ID=G-XXXXXXXXXX
MIXPANEL_TOKEN=your-mixpanel-token
```

## 🚀 Deployment Steps

### Step 1: Connect Repository to Vercel

1. Go to [Vercel Dashboard](https://vercel.com/dashboard)
2. Click "New Project"
3. Import your GitHub repository
4. Select the repository: `your-username/weddinglk`
5. Choose the root directory

### Step 2: Configure Build Settings

Vercel will auto-detect Next.js, but ensure these settings:

```json
{
  "buildCommand": "npm run build",
  "outputDirectory": ".next",
  "installCommand": "npm ci",
  "framework": "nextjs"
}
```

### Step 3: Set Environment Variables

1. Go to Project Settings > Environment Variables
2. Add all the environment variables listed above
3. Set them for Production, Preview, and Development environments
4. **CRITICAL**: Ensure `NEXTAUTH_URL` is set to `https://wedding-lkcom.vercel.app`

### Step 4: Configure Custom Domain (Optional)

1. Go to Project Settings > Domains
2. Add your custom domain: `wedding-lkcom.vercel.app`
3. Update DNS records as instructed by Vercel

### Step 5: Deploy

1. Push your code to the main branch
2. Vercel will automatically deploy
3. Monitor the deployment in the Vercel dashboard

## 🔄 CI/CD Pipeline Setup

### GitHub Actions Workflow

The project includes a comprehensive CI/CD pipeline (`.github/workflows/vercel-deploy.yml`) that:

1. **Tests** - Runs unit tests, type checking, and linting
2. **Builds** - Creates production build
3. **Deploys** - Deploys to Vercel
4. **Tests** - Runs post-deployment smoke tests
5. **Monitors** - Checks security and performance

### Required GitHub Secrets

Add these secrets to your GitHub repository (Settings > Secrets and variables > Actions):

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

### Getting Vercel Tokens

1. **VERCEL_TOKEN**: 
   - Go to Vercel Dashboard > Settings > Tokens
   - Create a new token with full access

2. **VERCEL_ORG_ID** and **VERCEL_PROJECT_ID**:
   - Run: `vercel link` in your project directory
   - Check `.vercel/project.json` for the IDs

## 🛠️ Manual Deployment

### Using Vercel CLI

```bash
# Install Vercel CLI
npm install -g vercel

# Login to Vercel
vercel login

# Deploy to preview
vercel

# Deploy to production
vercel --prod
```

### Using Deployment Script

```bash
# Make script executable
chmod +x scripts/deploy-vercel.sh

# Deploy to preview
./scripts/deploy-vercel.sh

# Deploy to production
./scripts/deploy-vercel.sh --prod
```

## 🔍 Troubleshooting

### NextAuth URL Mismatch Error

**Problem**: `NEXTAUTH_URL` mismatch error

**Solution**:
1. Ensure `NEXTAUTH_URL=https://wedding-lkcom.vercel.app` in Vercel environment variables
2. Check that the URL matches exactly (no trailing slash)
3. Redeploy after updating environment variables

### Build Failures

**Problem**: Build fails during deployment

**Solution**:
1. Check build logs in Vercel dashboard
2. Ensure all dependencies are in `package.json`
3. Run `npm run build` locally to test
4. Check for TypeScript errors: `npm run type-check`

### Database Connection Issues

**Problem**: Cannot connect to MongoDB

**Solution**:
1. Verify `MONGODB_URI` is correct
2. Check MongoDB Atlas IP whitelist (add 0.0.0.0/0 for Vercel)
3. Ensure database user has proper permissions

### Environment Variable Issues

**Problem**: Environment variables not loading

**Solution**:
1. Check variable names match exactly
2. Ensure variables are set for the correct environment
3. Redeploy after adding new variables
4. Check for typos in variable names

## 📊 Monitoring and Maintenance

### Health Checks

The application includes health check endpoints:

- **Health**: `https://wedding-lkcom.vercel.app/api/health`
- **Performance**: `https://wedding-lkcom.vercel.app/api/performance`

### Logs

Monitor application logs:

```bash
# View Vercel logs
vercel logs https://wedding-lkcom.vercel.app

# View specific function logs
vercel logs https://wedding-lkcom.vercel.app/api/health
```

### Performance Monitoring

- **Vercel Analytics**: Built-in performance monitoring
- **Lighthouse CI**: Automated performance testing
- **Real User Monitoring**: Track actual user performance

## 🔐 Security Considerations

### Environment Variables

- Never commit `.env` files to version control
- Use Vercel's environment variable system
- Rotate secrets regularly
- Use different secrets for different environments

### Database Security

- Use MongoDB Atlas with proper authentication
- Enable IP whitelisting
- Use connection string with credentials
- Enable SSL/TLS connections

### API Security

- Implement rate limiting
- Use HTTPS only
- Validate all inputs
- Implement proper error handling

## 📈 Scaling Considerations

### Vercel Limits

- **Functions**: 10s execution time (Pro: 60s)
- **Bandwidth**: 100GB/month (Pro: 1TB)
- **Builds**: 100 builds/month (Pro: 6000)

### Database Scaling

- Use MongoDB Atlas with auto-scaling
- Implement connection pooling
- Use Redis for caching
- Monitor database performance

### CDN and Caching

- Vercel provides global CDN
- Implement proper caching headers
- Use Redis for application caching
- Optimize images with Cloudinary

## 🎯 Post-Deployment Checklist

- [ ] Application loads at https://wedding-lkcom.vercel.app
- [ ] Authentication works (sign in/out)
- [ ] Database connection established
- [ ] All API endpoints respond correctly
- [ ] Admin dashboard accessible
- [ ] Payment processing works (if enabled)
- [ ] Image uploads work
- [ ] Email notifications work
- [ ] Performance is acceptable
- [ ] Security headers are in place
- [ ] Monitoring is set up
- [ ] Backup strategy is in place

## 📞 Support

If you encounter issues:

1. Check the [Vercel Documentation](https://vercel.com/docs)
2. Review the [Next.js Deployment Guide](https://nextjs.org/docs/deployment)
3. Check GitHub Issues for similar problems
4. Contact the development team

## 🎉 Success!

Once deployed successfully, your WeddingLK platform will be available at:

**Production URL**: https://wedding-lkcom.vercel.app

The platform includes:
- ✅ Complete CRUD operations
- ✅ User authentication and authorization
- ✅ Admin dashboard
- ✅ Payment processing
- ✅ Image uploads
- ✅ Real-time features
- ✅ Mobile responsiveness
- ✅ Performance optimization
- ✅ Security features

**Happy Deploying! 🚀**

