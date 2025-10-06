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

function removeDuplicateImports(content) {
  const lines = content.split('\n');
  const seenImports = new Set();
  const cleanedLines = [];
  
  for (const line of lines) {
    const trimmedLine = line.trim();
    
    // Check if it's an import statement
    if (trimmedLine.startsWith('import ')) {
      // Create a normalized version for comparison
      const normalized = trimmedLine.replace(/\s+/g, ' ').replace(/from\s+["'][^"']+["']/, 'from "..."');
      
      if (!seenImports.has(normalized)) {
        seenImports.add(normalized);
        cleanedLines.push(line);
      }
      // Skip duplicate imports
    } else {
      cleanedLines.push(line);
    }
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
    const cleanedContent = removeDuplicateImports(content);
    
    fs.writeFileSync(fullPath, cleanedContent);
    console.log(`✅ Fixed ${filePath}`);
  } catch (error) {
    console.error(`❌ Error fixing ${filePath}:`, error.message);
  }
}

console.log('🔧 Fixing duplicate imports...\n');

for (const file of filesToFix) {
  fixFile(file);
}

console.log('\n✅ All files processed!');
