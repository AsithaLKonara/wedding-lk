#!/usr/bin/env node

/**
 * Get Stable Vercel URL Script
 * This script helps you get the stable production URL for your Vercel deployment
 */

const { execSync } = require('child_process');

console.log('🔍 Getting stable Vercel URL...');
console.log('================================\n');

try {
  // Get the production URL
  const output = execSync('vercel --prod --confirm', { encoding: 'utf8' });
  
  // Extract URL from output
  const urlMatch = output.match(/https:\/\/[^\s]+\.vercel\.app/);
  
  if (urlMatch) {
    const stableUrl = urlMatch[0];
    console.log('✅ Stable Vercel URL found:');
    console.log(`   ${stableUrl}\n`);
    
    console.log('🔧 OAuth Redirect URIs to add:');
    console.log(`   Google: ${stableUrl}/api/auth/callback/google`);
    console.log(`   Facebook: ${stableUrl}/api/auth/callback/facebook\n`);
    
    console.log('📝 Next steps:');
    console.log('1. Update your OAuth provider settings with the redirect URIs above');
    console.log('2. Update your env.local with the stable URL:');
    console.log(`   NEXTAUTH_URL=${stableUrl}`);
    console.log(`   CORS_ORIGIN=${stableUrl}`);
    console.log(`   NEXT_PUBLIC_APP_URL=${stableUrl}`);
    console.log('3. Set up a custom domain for even more stability (optional)');
    
    // Update env.local automatically
    const fs = require('fs');
    const path = require('path');
    
    const envPath = path.join(__dirname, '..', 'env.local');
    if (fs.existsSync(envPath)) {
      let envContent = fs.readFileSync(envPath, 'utf8');
      
      // Update URLs
      envContent = envContent.replace(
        /NEXTAUTH_URL=.*/,
        `NEXTAUTH_URL=${stableUrl}`
      );
      envContent = envContent.replace(
        /CORS_ORIGIN=.*/,
        `CORS_ORIGIN=${stableUrl}`
      );
      envContent = envContent.replace(
        /NEXT_PUBLIC_APP_URL=.*/,
        `NEXT_PUBLIC_APP_URL=${stableUrl}`
      );
      
      fs.writeFileSync(envPath, envContent);
      console.log('\n✅ env.local updated automatically!');
    }
    
  } else {
    console.log('❌ Could not extract URL from Vercel output');
    console.log('Please run: vercel --prod --confirm');
    console.log('And manually copy the URL');
  }
  
} catch (error) {
  console.error('❌ Error getting Vercel URL:', error.message);
  console.log('\n📝 Manual steps:');
  console.log('1. Run: vercel --prod --confirm');
  console.log('2. Copy the production URL from the output');
  console.log('3. Update your OAuth provider settings');
  console.log('4. Update your env.local file');
}
