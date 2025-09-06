#!/usr/bin/env node

/**
 * Script to set Vercel environment variables with static URL
 * This ensures NextAuth callbacks work consistently
 */

const { execSync } = require('child_process');

const envVars = {
  NEXTAUTH_URL: 'https://wedding-lk.vercel.app',
  NEXTAUTH_SECRET: 'wedding-lk-secret-key-2024',
  MONGODB_URI: 'mongodb+srv://asithalakmalkonara11992081:1234@cluster0.ezztfbi.mongodb.net/weddinglk?retryWrites=true&w=majority&appName=Cluster0',
  NEXT_PUBLIC_APP_URL: 'https://wedding-lk.vercel.app',
  CORS_ORIGIN: 'https://wedding-lk.vercel.app'
};

console.log('🔧 Setting Vercel environment variables...\n');

for (const [key, value] of Object.entries(envVars)) {
  try {
    console.log(`Setting ${key}...`);
    
    // Remove existing variable if it exists
    try {
      execSync(`npx vercel env rm ${key} production --yes`, { stdio: 'pipe' });
    } catch (e) {
      // Variable might not exist, that's okay
    }
    
    // Add the new variable
    execSync(`echo "${value}" | npx vercel env add ${key} production`, { stdio: 'pipe' });
    console.log(`✅ ${key} set successfully`);
  } catch (error) {
    console.error(`❌ Failed to set ${key}:`, error.message);
  }
}

console.log('\n🎉 Environment variables configured!');
console.log('📝 Next steps:');
console.log('1. Redeploy the application: npx vercel --prod');
console.log('2. Test the static URL: https://wedding-lk.vercel.app');
console.log('3. Verify NextAuth callbacks work correctly');
