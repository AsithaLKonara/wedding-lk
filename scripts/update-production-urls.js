#!/usr/bin/env node

const fs = require('fs');

const PRODUCTION_URL = 'https://wedding-lkcom.vercel.app';

console.log('🔧 Updating all production URLs to:', PRODUCTION_URL);

// Update all environment files
const envFiles = ['env.local', '.env'];

envFiles.forEach(file => {
  if (fs.existsSync(file)) {
    let content = fs.readFileSync(file, 'utf8');
    
    // Update all URL references
    content = content.replace(/NEXTAUTH_URL=https:\/\/[^\s\n]+/g, `NEXTAUTH_URL=${PRODUCTION_URL}`);
    content = content.replace(/NEXT_PUBLIC_APP_URL=https:\/\/[^\s\n]+/g, `NEXT_PUBLIC_APP_URL=${PRODUCTION_URL}`);
    content = content.replace(/CORS_ORIGIN=https:\/\/[^\s\n]+/g, `CORS_ORIGIN=${PRODUCTION_URL}`);
    content = content.replace(/APP_INSTANCE_1=https:\/\/[^\s\n]+/g, `APP_INSTANCE_1=${PRODUCTION_URL}`);
    content = content.replace(/APP_INSTANCE_2=https:\/\/[^\s\n]+/g, `APP_INSTANCE_2=${PRODUCTION_URL}`);
    content = content.replace(/APP_INSTANCE_3=https:\/\/[^\s\n]+/g, `APP_INSTANCE_3=${PRODUCTION_URL}`);
    
    fs.writeFileSync(file, content, 'utf8');
    console.log(`✅ Updated: ${file}`);
  }
});

// Create a deployment guide
const deploymentGuide = `
# Production Deployment Guide

## Current Status
- **Target URL**: ${PRODUCTION_URL} (needs latest code)
- **Working Deployment**: https://wedding-i8lcm8jy5-asithalkonaras-projects.vercel.app (has latest code)

## Options to Synchronize URLs

### Option 1: Update Target URL Project (Recommended)
1. Access the Vercel project that owns ${PRODUCTION_URL}
2. Deploy the latest code from this repository
3. Update environment variables to match our configuration
4. Test authentication and dashboard functionality

### Option 2: Use Current Deployment
1. Update all references to use: https://wedding-i8lcm8jy5-asithalkonaras-projects.vercel.app
2. Configure custom domain if needed
3. Update OAuth providers with new URL

## Environment Variables to Set
\`\`\`
NEXTAUTH_URL=${PRODUCTION_URL}
NEXT_PUBLIC_APP_URL=${PRODUCTION_URL}
CORS_ORIGIN=${PRODUCTION_URL}
\`\`\`

## Test Commands
\`\`\`bash
# Test authentication
curl -X POST "${PRODUCTION_URL}/api/simple-auth" \\
  -H "Content-Type: application/json" \\
  -d '{"email":"admin@weddinglk.com","password":"admin123"}'

# Test dashboard
curl -I "${PRODUCTION_URL}/dashboard"

# Test APIs
curl "${PRODUCTION_URL}/api/health"
\`\`\`

## Next Steps
1. Choose one of the options above
2. Deploy the latest code to the target URL
3. Test all functionality
4. Update any external references
`;

fs.writeFileSync('DEPLOYMENT_GUIDE.md', deploymentGuide);
console.log('✅ Created: DEPLOYMENT_GUIDE.md');

console.log('\n🎯 Summary:');
console.log(`- All local files updated to use: ${PRODUCTION_URL}`);
console.log('- Deployment guide created: DEPLOYMENT_GUIDE.md');
console.log('- Ready for production deployment');
