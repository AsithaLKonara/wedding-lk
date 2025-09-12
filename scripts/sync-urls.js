#!/usr/bin/env node

const fs = require('fs');
const path = require('path');

const TARGET_URL = 'https://wedding-lkcom.vercel.app';

console.log('🔧 Syncing all URLs to:', TARGET_URL);

// Files to update
const filesToUpdate = [
  'env.local',
  '.env',
  'next.config.mjs',
  'app/api/auth/[...nextauth]/route.ts'
];

// URL patterns to replace
const urlPatterns = [
  {
    pattern: /NEXTAUTH_URL=https:\/\/[^\s\n]+/g,
    replacement: `NEXTAUTH_URL=${TARGET_URL}`
  },
  {
    pattern: /NEXT_PUBLIC_APP_URL=https:\/\/[^\s\n]+/g,
    replacement: `NEXT_PUBLIC_APP_URL=${TARGET_URL}`
  },
  {
    pattern: /CORS_ORIGIN=https:\/\/[^\s\n]+/g,
    replacement: `CORS_ORIGIN=${TARGET_URL}`
  },
  {
    pattern: /APP_INSTANCE_1=https:\/\/[^\s\n]+/g,
    replacement: `APP_INSTANCE_1=${TARGET_URL}`
  },
  {
    pattern: /APP_INSTANCE_2=https:\/\/[^\s\n]+/g,
    replacement: `APP_INSTANCE_2=${TARGET_URL}`
  },
  {
    pattern: /APP_INSTANCE_3=https:\/\/[^\s\n]+/g,
    replacement: `APP_INSTANCE_3=${TARGET_URL}`
  }
];

function updateFile(filePath) {
  if (!fs.existsSync(filePath)) {
    console.log(`⚠️  File not found: ${filePath}`);
    return false;
  }

  try {
    let content = fs.readFileSync(filePath, 'utf8');
    let updated = false;

    urlPatterns.forEach(({ pattern, replacement }) => {
      if (pattern.test(content)) {
        content = content.replace(pattern, replacement);
        updated = true;
      }
    });

    if (updated) {
      fs.writeFileSync(filePath, content, 'utf8');
      console.log(`✅ Updated: ${filePath}`);
      return true;
    } else {
      console.log(`ℹ️  No changes needed: ${filePath}`);
      return false;
    }
  } catch (error) {
    console.error(`❌ Error updating ${filePath}:`, error.message);
    return false;
  }
}

// Update all files
let totalUpdated = 0;
filesToUpdate.forEach(file => {
  if (updateFile(file)) {
    totalUpdated++;
  }
});

console.log(`\n📊 Summary: Updated ${totalUpdated} files`);

// Verify the main configuration
console.log('\n🔍 Verifying configuration...');
const envLocal = fs.readFileSync('env.local', 'utf8');
const lines = envLocal.split('\n');
const urlLines = lines.filter(line => 
  line.includes('NEXTAUTH_URL') || 
  line.includes('NEXT_PUBLIC_APP_URL') || 
  line.includes('CORS_ORIGIN')
);

console.log('Current URL configurations:');
urlLines.forEach(line => {
  if (line.trim()) {
    console.log(`  ${line}`);
  }
});

console.log('\n✅ URL synchronization complete!');
console.log('Next steps:');
console.log('1. Deploy to production: vercel --prod');
console.log('2. Test authentication on the working domain');
console.log('3. Verify all dashboard features work correctly');

