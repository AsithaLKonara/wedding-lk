
# Production Deployment Guide

## Current Status
- **Target URL**: https://wedding-lkcom.vercel.app (needs latest code)
- **Working Deployment**: https://wedding-i8lcm8jy5-asithalkonaras-projects.vercel.app (has latest code)

## Options to Synchronize URLs

### Option 1: Update Target URL Project (Recommended)
1. Access the Vercel project that owns https://wedding-lkcom.vercel.app
2. Deploy the latest code from this repository
3. Update environment variables to match our configuration
4. Test authentication and dashboard functionality

### Option 2: Use Current Deployment
1. Update all references to use: https://wedding-i8lcm8jy5-asithalkonaras-projects.vercel.app
2. Configure custom domain if needed
3. Update OAuth providers with new URL

## Environment Variables to Set
```
NEXTAUTH_URL=https://wedding-lkcom.vercel.app
NEXT_PUBLIC_APP_URL=https://wedding-lkcom.vercel.app
CORS_ORIGIN=https://wedding-lkcom.vercel.app
```

## Test Commands
```bash
# Test authentication
curl -X POST "https://wedding-lkcom.vercel.app/api/simple-auth" \
  -H "Content-Type: application/json" \
  -d '{"email":"admin@weddinglk.com","password":"admin123"}'

# Test dashboard
curl -I "https://wedding-lkcom.vercel.app/dashboard"

# Test APIs
curl "https://wedding-lkcom.vercel.app/api/health"
```

## Next Steps
1. Choose one of the options above
2. Deploy the latest code to the target URL
3. Test all functionality
4. Update any external references
