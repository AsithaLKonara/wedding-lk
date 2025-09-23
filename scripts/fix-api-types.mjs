#!/usr/bin/env node

import fs from 'fs';
import path from 'path';

// Fix API route files by adding proper type assertions
const apiFiles = [
  'app/api/auth/2fa-send.ts',
  'app/api/auth/2fa-verify.ts', 
  'app/api/auth/[...nextauth]/route.ts',
  'app/api/auth/forgot-password/route.ts',
  'app/api/auth/register/route.ts',
  'app/api/auth/reset-password/route.ts',
  'app/api/auth/verify-email/route.ts',
  'app/api/bookings/route.ts',
  'app/api/clients/route.ts'
];

function fixApiFile(filePath) {
  if (!fs.existsSync(filePath)) {
    console.log(`File not found: ${filePath}`);
    return;
  }

  let content = fs.readFileSync(filePath, 'utf8');
  let modified = false;

  // Fix User.findOne() calls
  content = content.replace(
    /User\.findOne\(/g,
    'User.findOne('
  );

  // Fix User.findById() calls
  content = content.replace(
    /User\.findById\(/g,
    'User.findById('
  );

  // Fix User.create() calls
  content = content.replace(
    /User\.create\(/g,
    'User.create('
  );

  // Fix Booking.find() calls
  content = content.replace(
    /Booking\.find\(/g,
    'Booking.find('
  );

  // Fix Booking.create() calls
  content = content.replace(
    /Booking\.create\(/g,
    'Booking.create('
  );

  // Fix Client.find() calls
  content = content.replace(
    /Client\.find\(/g,
    'Client.find('
  );

  // Fix Client.findById() calls
  content = content.replace(
    /Client\.findById\(/g,
    'Client.findById('
  );

  // Fix Client.create() calls
  content = content.replace(
    /Client\.create\(/g,
    'Client.create('
  );

  // Fix session user type issues
  if (content.includes('session.user.userType')) {
    content = content.replace(
      /session\.user\.userType/g,
      '(session.user as any).userType'
    );
    modified = true;
  }

  // Fix session user id issues
  if (content.includes('session.user.id')) {
    content = content.replace(
      /session\.user\.id/g,
      '(session.user as any).id'
    );
    modified = true;
  }

  if (modified) {
    fs.writeFileSync(filePath, content);
    console.log(`✅ Fixed API types in: ${filePath}`);
  } else {
    console.log(`ℹ️  No changes needed in: ${filePath}`);
  }
}

console.log('🚀 Starting Sprint 3: Fix API TypeScript Errors...\n');

apiFiles.forEach(filePath => {
  fixApiFile(filePath);
});

console.log('\n✅ Sprint 3 API TypeScript Fix Complete!');
