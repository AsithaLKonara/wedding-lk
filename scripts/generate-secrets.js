#!/usr/bin/env node

/**
 * Generate secure secrets for production deployment
 * Run with: node scripts/generate-secrets.js
 */

const crypto = require('crypto');

console.log('🔐 Generating secure secrets for production...\n');

// Generate NextAuth secret
const nextAuthSecret = crypto.randomBytes(32).toString('base64');
console.log('NEXTAUTH_SECRET=' + nextAuthSecret);

// Generate JWT secret
const jwtSecret = crypto.randomBytes(32).toString('hex');
console.log('JWT_SECRET=' + jwtSecret);

// Generate API key for internal services
const apiKey = crypto.randomBytes(24).toString('base64');
console.log('INTERNAL_API_KEY=' + apiKey);

console.log('\n✅ Copy these values to your Vercel environment variables');
console.log('⚠️  Keep these secrets secure and never commit them to Git!');
