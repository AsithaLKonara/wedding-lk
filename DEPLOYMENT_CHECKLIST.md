# WeddingLK Deployment Checklist

## Pre-Deployment Checklist

### 1. Environment Setup
- [ ] Create .env.local file with all required variables
- [ ] Set up MongoDB Atlas database
- [ ] Configure Stripe keys for payments
- [ ] Set up email service (optional)

### 2. Database Setup
- [ ] Run database seeding script
- [ ] Verify all collections are created
- [ ] Test database connections

### 3. Testing
- [ ] Run all tests: `npm run test:all`
- [ ] Test frontend integration: `node scripts/test-frontend-integration.mjs`
- [ ] Test API endpoints manually
- [ ] Test authentication flow

### 4. Build Verification
- [ ] Run production build: `npm run build`
- [ ] Check for build errors
- [ ] Verify all pages compile successfully

### 5. Performance
- [ ] Test page load times
- [ ] Check API response times
- [ ] Verify mobile responsiveness

## Deployment Steps

### 1. Vercel Deployment
```bash
# Install Vercel CLI
npm i -g vercel

# Deploy
vercel --prod
```

### 2. Environment Variables
Set the following in Vercel dashboard:
- MONGODB_URI
- NEXTAUTH_SECRET
- NEXTAUTH_URL
- STRIPE_PUBLIC_KEY
- STRIPE_SECRET_KEY
- STRIPE_WEBHOOK_SECRET

### 3. Domain Setup
- [ ] Configure custom domain (optional)
- [ ] Set up SSL certificate
- [ ] Configure redirects

## Post-Deployment

### 1. Verification
- [ ] Test all pages load correctly
- [ ] Verify API endpoints work
- [ ] Test authentication
- [ ] Check payment processing

### 2. Monitoring
- [ ] Set up error tracking
- [ ] Monitor performance metrics
- [ ] Set up uptime monitoring

## Rollback Plan
- [ ] Keep previous deployment as backup
- [ ] Document rollback procedure
- [ ] Test rollback process

## Success Criteria
- [ ] All tests passing
- [ ] No critical errors in logs
- [ ] Page load times under 3 seconds
- [ ] API response times under 1 second
- [ ] 99% uptime
