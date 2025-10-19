#!/usr/bin/env node

/**
 * Runtime Error Check Script
 * This script checks for common runtime errors in the WeddingLK platform
 */

const fs = require('fs');
const path = require('path');

console.log('🔍 Checking for runtime errors...\n');

// Check for common runtime error patterns
const errorPatterns = [
  /console\.error/gi,
  /throw new Error/gi,
  /catch\s*\(/gi,
  /\.catch\s*\(/gi,
  /Error:/gi,
  /TypeError:/gi,
  /ReferenceError:/gi,
  /SyntaxError:/gi,
  /undefined/gi,
  /null/gi,
  /Cannot read property/gi,
  /Cannot access before initialization/gi,
  /Module not found/gi,
  /Cannot resolve/gi
];

// Files to check
const filesToCheck = [
  'app/venues/page.tsx',
  'app/vendors/page.tsx',
  'app/payment/page.tsx',
  'app/ai-search/page.tsx',
  'app/chat/page.tsx',
  'app/notifications/page.tsx',
  'components/templates/main-layout.tsx'
];

let totalErrors = 0;

filesToCheck.forEach(file => {
  const filePath = path.join(process.cwd(), file);
  
  if (fs.existsSync(filePath)) {
    const content = fs.readFileSync(filePath, 'utf8');
    let fileErrors = 0;
    
    errorPatterns.forEach((pattern, index) => {
      const matches = content.match(pattern);
      if (matches) {
        console.log(`⚠️  ${file}: Found ${matches.length} potential issues with pattern: ${pattern}`);
        fileErrors += matches.length;
      }
    });
    
    if (fileErrors === 0) {
      console.log(`✅ ${file}: No obvious runtime errors detected`);
    }
    
    totalErrors += fileErrors;
  } else {
    console.log(`❌ ${file}: File not found`);
  }
});

console.log(`\n📊 Summary: ${totalErrors} potential runtime issues found`);

// Check for specific common issues
console.log('\n🔧 Checking for common issues...');

// Check for missing imports
const checkImports = (filePath) => {
  if (fs.existsSync(filePath)) {
    const content = fs.readFileSync(filePath, 'utf8');
    
    // Check for import statements
    const imports = content.match(/import.*from.*['"][^'"]+['"]/g) || [];
    const relativeImports = imports.filter(imp => imp.includes('./') || imp.includes('../'));
    
    if (relativeImports.length > 0) {
      console.log(`📁 ${filePath}: Found ${relativeImports.length} relative imports`);
      relativeImports.forEach(imp => {
        console.log(`   - ${imp}`);
      });
    }
    
    // Check for dynamic imports
    const dynamicImports = content.match(/import\s*\(/g) || [];
    if (dynamicImports.length > 0) {
      console.log(`⚡ ${filePath}: Found ${dynamicImports.length} dynamic imports`);
    }
    
    // Check for useEffect dependencies
    const useEffectCount = (content.match(/useEffect\s*\(/g) || []).length;
    if (useEffectCount > 0) {
      console.log(`🔄 ${filePath}: Found ${useEffectCount} useEffect hooks`);
    }
  }
};

filesToCheck.forEach(checkImports);

console.log('\n🎯 Runtime error check completed!');
