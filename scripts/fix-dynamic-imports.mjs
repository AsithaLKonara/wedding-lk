#!/usr/bin/env node

/**
 * Fix Dynamic Imports Script
 * Fixes TypeScript errors related to dynamic imports
 */

import fs from 'fs';
import path from 'path';
import { glob } from 'glob';

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

// Pattern to match dynamic imports that need fixing
const dynamicImportPattern = /const\s+(\w+)\s*=\s*dynamic\(\(\)\s*=>\s*import\("([^"]+)"\)\s*,\s*\{[^}]*\}\)/g;

function fixDynamicImport(match, componentName, importPath) {
  // Extract the component name from the path
  const pathParts = importPath.split('/');
  const fileName = pathParts[pathParts.length - 1];
  const componentNameFromPath = fileName
    .split('-')
    .map(part => part.charAt(0).toUpperCase() + part.slice(1))
    .join('');
  
  // Create the fixed dynamic import
  return `const ${componentName} = dynamic(() => import("${importPath}").then(mod => ({ default: mod.${componentNameFromPath} })), { ssr: false })`;
}

async function fixFile(filePath) {
  try {
    const content = fs.readFileSync(filePath, 'utf8');
    const originalContent = content;
    
    // Fix dynamic imports
    const fixedContent = content.replace(dynamicImportPattern, fixDynamicImport);
    
    if (fixedContent !== originalContent) {
      fs.writeFileSync(filePath, fixedContent);
      log(`✅ Fixed dynamic imports in ${filePath}`, 'green');
      return true;
    }
    
    return false;
  } catch (error) {
    log(`❌ Error fixing ${filePath}: ${error.message}`, 'red');
    return false;
  }
}

async function fixAllDynamicImports() {
  log('🔧 Fixing Dynamic Imports...', 'cyan');
  
  try {
    // Find all TypeScript/JavaScript files
    const files = await glob('**/*.{ts,tsx,js,jsx}', {
      ignore: ['node_modules/**', '.next/**', 'dist/**']
    });
    
    let fixedCount = 0;
    
    for (const file of files) {
      if (await fixFile(file)) {
        fixedCount++;
      }
    }
    
    log(`\n📊 Summary:`, 'bold');
    log(`   Files processed: ${files.length}`, 'blue');
    log(`   Files fixed: ${fixedCount}`, 'green');
    
    if (fixedCount > 0) {
      log('\n✅ Dynamic import fixes completed!', 'green');
    } else {
      log('\nℹ️  No dynamic import issues found.', 'blue');
    }
    
  } catch (error) {
    log(`❌ Error processing files: ${error.message}`, 'red');
  }
}

// Run the fix
fixAllDynamicImports();