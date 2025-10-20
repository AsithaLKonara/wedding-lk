#!/usr/bin/env node

/**
 * Environment Setup Script for WeddingLK
 * Creates .env.local with all required environment variables
 */

import fs from 'fs';
import path from 'path';

const colors = {
  green: '\x1b[32m',
  red: '\x1b[31m',
  yellow: '\x1b[33m',
  blue: '\x1b[34m',
  cyan: '\x1b[36m',
  reset: '\x1b[0m',
  bold: '\x1b[1m'
};

function log(message, color = 'reset') {
  console.log(`${colors[color]}${message}${colors.reset}`);
}

const envContent = `# Database Configuration
MONGODB_URI=mongodb+srv://testuser:testpass@cluster0.mongodb.net/weddinglk?retryWrites=true&w=majority

# NextAuth Configuration
NEXTAUTH_SECRET=your-super-secret-nextauth-secret-key-here-make-it-long-and-random-32-chars-min
NEXTAUTH_URL=http://localhost:3000

# Stripe Configuration (Test Mode)
STRIPE_SECRET_KEY=sk_test_your_stripe_secret_key_here
STRIPE_PUBLISHABLE_KEY=pk_test_your_stripe_publishable_key_here

# Email Configuration
EMAIL_SERVER_HOST=smtp.gmail.com
EMAIL_SERVER_PORT=587
EMAIL_SERVER_USER=your-email@gmail.com
EMAIL_SERVER_PASSWORD=your-app-password
EMAIL_FROM=noreply@weddinglk.com

# App Configuration
NODE_ENV=development
NEXT_PUBLIC_APP_URL=http://localhost:3000
NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY=pk_test_your_stripe_publishable_key_here

# Analytics (Optional)
NEXT_PUBLIC_GA_ID=G-XXXXXXXXXX

# File Upload (Optional)
NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME=your-cloudinary-name
CLOUDINARY_API_KEY=your-cloudinary-api-key
CLOUDINARY_API_SECRET=your-cloudinary-api-secret

# Chat Configuration
NEXT_PUBLIC_SOCKET_URL=http://localhost:3001

# Admin Configuration
ADMIN_EMAIL=admin@weddinglk.com
ADMIN_PASSWORD=admin123456

# Security
JWT_SECRET=your-jwt-secret-key-here-make-it-long-and-random
ENCRYPTION_KEY=your-32-character-encryption-key-here

# Rate Limiting
RATE_LIMIT_WINDOW_MS=900000
RATE_LIMIT_MAX_REQUESTS=100

# Cache Configuration
REDIS_URL=redis://localhost:6379
CACHE_TTL=3600
`;

function createEnvFile() {
  const envPath = '.env.local';
  
  if (fs.existsSync(envPath)) {
    log('⚠️  .env.local already exists. Creating backup...', 'yellow');
    const backupPath = `.env.local.backup.${Date.now()}`;
    fs.copyFileSync(envPath, backupPath);
    log(`✅ Backup created: ${backupPath}`, 'green');
  }
  
  try {
    fs.writeFileSync(envPath, envContent);
    log('✅ .env.local file created successfully!', 'green');
    log('\n📋 Next steps:', 'cyan');
    log('1. Update the database connection string (MONGODB_URI)', 'blue');
    log('2. Generate a secure NEXTAUTH_SECRET (32+ characters)', 'blue');
    log('3. Add your Stripe API keys', 'blue');
    log('4. Configure email settings', 'blue');
    log('5. Update other values as needed', 'blue');
    
    return true;
  } catch (error) {
    log(`❌ Failed to create .env.local: ${error.message}`, 'red');
    return false;
  }
}

function generateSecureSecret(length = 32) {
  const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789!@#$%^&*';
  let result = '';
  for (let i = 0; i < length; i++) {
    result += chars.charAt(Math.floor(Math.random() * chars.length));
  }
  return result;
}

function showSecurityRecommendations() {
  log('\n🔒 Security Recommendations:', 'cyan');
  log('1. Use a strong, unique NEXTAUTH_SECRET (32+ characters)', 'yellow');
  log('2. Use a secure MongoDB connection string', 'yellow');
  log('3. Never commit .env.local to version control', 'yellow');
  log('4. Use environment-specific values for production', 'yellow');
  log('5. Regularly rotate secrets and API keys', 'yellow');
  
  log('\n🔑 Generated secure secrets:', 'cyan');
  log(`NEXTAUTH_SECRET=${generateSecureSecret(32)}`, 'green');
  log(`JWT_SECRET=${generateSecureSecret(32)}`, 'green');
  log(`ENCRYPTION_KEY=${generateSecureSecret(32)}`, 'green');
}

function main() {
  log('🚀 WeddingLK Environment Setup', 'bold');
  log('================================', 'bold');
  
  const success = createEnvFile();
  
  if (success) {
    showSecurityRecommendations();
    log('\n✅ Environment setup completed!', 'green');
    log('Run "npm run dev" to start the development server.', 'blue');
  } else {
    log('\n❌ Environment setup failed!', 'red');
    process.exit(1);
  }
}

main();
