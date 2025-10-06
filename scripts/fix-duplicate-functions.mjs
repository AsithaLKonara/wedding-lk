#!/usr/bin/env node

import fs from 'fs';
import path from 'path';

const filesToFix = [
  'app/payment/cancel/page.tsx',
  'app/payment/failed/page.tsx', 
  'app/payment/success/page.tsx',
  'app/profile/[id]/page.tsx',
  'app/reviews/write/page.tsx'
];

function removeDuplicateFunctions(content) {
  const lines = content.split('\n');
  const cleanedLines = [];
  let foundFirstFunction = false;
  let braceCount = 0;
  let inFirstFunction = false;
  let skipUntilEnd = false;
  
  for (let i = 0; i < lines.length; i++) {
    const line = lines[i];
    
    // Check if we're starting to skip duplicate content
    if (skipUntilEnd) {
      continue;
    }
    
    // Look for function declarations that appear twice
    if (line.includes('function PaymentCancelContent') || 
        line.includes('function PaymentFailedContent') ||
        line.includes('function PaymentSuccessContent') ||
        line.includes('function WriteReviewContent') ||
        line.includes('function UserProfilePage') ||
        line.includes('export default function')) {
      
      if (foundFirstFunction) {
        // This is a duplicate, start skipping
        skipUntilEnd = true;
        continue;
      } else {
        foundFirstFunction = true;
      }
    }
    
    cleanedLines.push(line);
  }
  
  return cleanedLines.join('\n');
}

function fixFile(filePath) {
  try {
    const fullPath = path.join(process.cwd(), filePath);
    console.log(`Fixing ${filePath}...`);
    
    if (!fs.existsSync(fullPath)) {
      console.log(`File not found: ${filePath}`);
      return;
    }
    
    const content = fs.readFileSync(fullPath, 'utf8');
    const cleanedContent = removeDuplicateFunctions(content);
    
    fs.writeFileSync(fullPath, cleanedContent);
    console.log(`✅ Fixed ${filePath}`);
  } catch (error) {
    console.error(`❌ Error fixing ${filePath}:`, error.message);
  }
}

console.log('🔧 Fixing duplicate functions...\n');

for (const file of filesToFix) {
  fixFile(file);
}

console.log('\n✅ All files processed!');
