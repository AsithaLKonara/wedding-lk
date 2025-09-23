#!/usr/bin/env node

import fs from 'fs';
import path from 'path';

const filesToFix = [
  'app/contact/page.tsx',
  'app/dashboard/settings/page.tsx',
  'app/debug/page.tsx',
  'app/favorites/page.tsx',
  'app/feed/page.tsx',
  'app/planning/page.tsx',
  'app/premium/page.tsx',
  'app/profile/page.tsx',
  'app/register/page.tsx',
  'app/status/page.tsx',
  'app/subscription/page.tsx',
  'app/test-demo/page.tsx',
  'app/vendors/[id]/page.tsx',
  'app/vendors/page.tsx',
  'app/venues/[id]/page.tsx'
];

function fixDynamicImports(filePath) {
  if (!fs.existsSync(filePath)) {
    console.log(`File not found: ${filePath}`);
    return;
  }

  let content = fs.readFileSync(filePath, 'utf8');
  let modified = false;

  // Fix dynamic import syntax
  const dynamicImportRegex = /const\s+(\w+)\s*=\s*dynamic\(\(\)\s*=>\s*import\("([^"]+)"\)\)/g;
  
  content = content.replace(dynamicImportRegex, (match, componentName, importPath) => {
    modified = true;
    return `const ${componentName} = dynamic(() => import("${importPath}"), { ssr: false })`;
  });

  // Fix duplicate dynamic imports
  const lines = content.split('\n');
  const seenImports = new Set();
  const filteredLines = lines.filter(line => {
    if (line.includes('import dynamic from "next/dynamic"')) {
      if (seenImports.has('dynamic')) {
        return false; // Remove duplicate
      }
      seenImports.add('dynamic');
    }
    return true;
  });
  
  if (filteredLines.length !== lines.length) {
    modified = true;
    content = filteredLines.join('\n');
  }

  if (modified) {
    fs.writeFileSync(filePath, content);
    console.log(`✅ Fixed dynamic imports in: ${filePath}`);
  } else {
    console.log(`ℹ️  No changes needed in: ${filePath}`);
  }
}

console.log('🚀 Starting Sprint 3: Fix Dynamic Imports...\n');

filesToFix.forEach(filePath => {
  fixDynamicImports(filePath);
});

console.log('\n✅ Sprint 3 Dynamic Imports Fix Complete!');
