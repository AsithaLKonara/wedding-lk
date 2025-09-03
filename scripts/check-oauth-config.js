#!/usr/bin/env node

/**
 * OAuth Configuration Checker for WeddingLK
 * This script helps verify that OAuth providers are properly configured
 */

require('dotenv').config({ path: './env.local' });

console.log('🔍 OAuth Configuration Checker');
console.log('================================\n');

// Check NextAuth configuration
console.log('📋 NextAuth Configuration:');
console.log(`   NEXTAUTH_URL: ${process.env.NEXTAUTH_URL || '❌ MISSING'}`);
console.log(`   NEXTAUTH_SECRET: ${process.env.NEXTAUTH_SECRET ? '✅ Set' : '❌ MISSING'}`);
console.log(`   NODE_ENV: ${process.env.NODE_ENV || '❌ MISSING'}\n`);

// Check Google OAuth
console.log('🔵 Google OAuth Configuration:');
console.log(`   GOOGLE_CLIENT_ID: ${process.env.GOOGLE_CLIENT_ID ? '✅ Set' : '❌ MISSING'}`);
console.log(`   GOOGLE_CLIENT_SECRET: ${process.env.GOOGLE_CLIENT_SECRET ? '✅ Set' : '❌ MISSING'}`);

if (process.env.GOOGLE_CLIENT_ID && process.env.NEXTAUTH_URL) {
  const googleRedirectUri = `${process.env.NEXTAUTH_URL}/api/auth/callback/google`;
  console.log(`   📍 Required Google Redirect URI: ${googleRedirectUri}`);
  console.log('   ⚠️  Make sure this URI is added to your Google OAuth app settings\n');
} else {
  console.log('   ❌ Cannot generate redirect URI - missing required variables\n');
}

// Check Facebook OAuth
console.log('🔵 Facebook OAuth Configuration:');
console.log(`   FACEBOOK_CLIENT_ID: ${process.env.FACEBOOK_CLIENT_ID ? '✅ Set' : '❌ MISSING'}`);
console.log(`   FACEBOOK_CLIENT_SECRET: ${process.env.FACEBOOK_CLIENT_SECRET ? '✅ Set' : '❌ MISSING'}`);

if (process.env.FACEBOOK_CLIENT_ID && process.env.NEXTAUTH_URL) {
  const facebookRedirectUri = `${process.env.NEXTAUTH_URL}/api/auth/callback/facebook`;
  console.log(`   📍 Required Facebook Redirect URI: ${facebookRedirectUri}`);
  console.log('   ⚠️  Make sure this URI is added to your Facebook App settings\n');
} else {
  console.log('   ❌ Cannot generate redirect URI - missing required variables\n');
}

// Check other important variables
console.log('🔧 Other Important Configuration:');
console.log(`   CORS_ORIGIN: ${process.env.CORS_ORIGIN || '❌ MISSING'}`);
console.log(`   NEXT_PUBLIC_APP_URL: ${process.env.NEXT_PUBLIC_APP_URL || '❌ MISSING'}`);
console.log(`   MONGODB_URI: ${process.env.MONGODB_URI ? '✅ Set' : '❌ MISSING'}\n`);

// Validation
console.log('✅ Validation Results:');
const issues = [];

if (!process.env.NEXTAUTH_URL) {
  issues.push('NEXTAUTH_URL is missing');
}

if (!process.env.NEXTAUTH_SECRET) {
  issues.push('NEXTAUTH_SECRET is missing');
}

if (!process.env.GOOGLE_CLIENT_ID || !process.env.GOOGLE_CLIENT_SECRET) {
  issues.push('Google OAuth credentials are missing');
}

if (!process.env.FACEBOOK_CLIENT_ID || !process.env.FACEBOOK_CLIENT_SECRET) {
  issues.push('Facebook OAuth credentials are missing');
}

if (process.env.NEXTAUTH_URL && !process.env.NEXTAUTH_URL.includes('localhost') && process.env.NODE_ENV === 'development') {
  issues.push('NEXTAUTH_URL should be http://localhost:3000 for local development');
}

if (issues.length === 0) {
  console.log('   🎉 All configurations look good!');
} else {
  console.log('   ⚠️  Issues found:');
  issues.forEach(issue => console.log(`      - ${issue}`));
}

console.log('\n📝 Next Steps:');
console.log('1. Make sure NEXTAUTH_URL matches your deployment URL');
console.log('2. Add the redirect URIs to your OAuth provider settings:');
if (process.env.NEXTAUTH_URL) {
  console.log(`   - Google: ${process.env.NEXTAUTH_URL}/api/auth/callback/google`);
  console.log(`   - Facebook: ${process.env.NEXTAUTH_URL}/api/auth/callback/facebook`);
}
console.log('3. Deploy your changes to Vercel');
console.log('4. Test authentication with both email/password and social login');
console.log('5. If using Vercel, make sure environment variables are set in Vercel dashboard');
