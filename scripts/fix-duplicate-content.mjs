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

function removeDuplicateContent(content) {
  const lines = content.split('\n');
  
  // Find the first 'use client' directive
  let firstUseClientIndex = -1;
  for (let i = 0; i < lines.length; i++) {
    if (lines[i].trim() === "'use client'") {
      firstUseClientIndex = i;
      break;
    }
  }
  
  if (firstUseClientIndex === -1) {
    console.log('No "use client" found, returning original content');
    return content;
  }
  
  // Find the second 'use client' directive
  let secondUseClientIndex = -1;
  for (let i = firstUseClientIndex + 1; i < lines.length; i++) {
    if (lines[i].trim() === "'use client'") {
      secondUseClientIndex = i;
      break;
    }
  }
  
  if (secondUseClientIndex === -1) {
    console.log('No duplicate content found, returning original content');
    return content;
  }
  
  // Return only the first part (before the second 'use client')
  const firstPart = lines.slice(0, secondUseClientIndex);
  return firstPart.join('\n');
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
    const cleanedContent = removeDuplicateContent(content);
    
    fs.writeFileSync(fullPath, cleanedContent);
    console.log(`✅ Fixed ${filePath}`);
  } catch (error) {
    console.error(`❌ Error fixing ${filePath}:`, error.message);
  }
}

console.log('🔧 Fixing duplicate content...\n');

for (const file of filesToFix) {
  fixFile(file);
}

console.log('\n✅ All files processed!');
