#!/usr/bin/env node

/**
 * Fix Component Exports Script
 * Ensures all components have proper default exports for dynamic imports
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

// List of components that need default exports
const componentsToFix = [
  'contact-form',
  'contact-info',
  'favorites-tabs',
  'wedding-checklist',
  'wedding-timeline',
  'budget-tracker',
  'guest-list',
  'premium-couple-features',
  'cultural-wedding-tools',
  'profile-header',
  'profile-tabs',
  'platform-status',
  'subscription-plans',
  'commission-tracker',
  'login-form',
  'register-form',
  'venue-hero',
  'venue-details',
  'venue-gallery',
  'venue-reviews',
  'similar-venues'
];

async function fixComponentExport(componentPath) {
  try {
    const content = fs.readFileSync(componentPath, 'utf8');
    
    // Check if component already has default export
    if (content.includes('export default')) {
      return false; // Already has default export
    }
    
    // Check if component has named export
    const namedExportMatch = content.match(/export\s+(?:function|const)\s+(\w+)/);
    if (!namedExportMatch) {
      return false; // No named export found
    }
    
    const componentName = namedExportMatch[1];
    
    // Add default export at the end
    const newContent = content + `\n\nexport default ${componentName};\n`;
    
    fs.writeFileSync(componentPath, newContent);
    log(`✅ Added default export to ${path.basename(componentPath)}`, 'green');
    return true;
    
  } catch (error) {
    log(`❌ Error fixing ${componentPath}: ${error.message}`, 'red');
    return false;
  }
}

async function fixAllComponentExports() {
  log('🔧 Fixing Component Exports...', 'cyan');
  
  let fixedCount = 0;
  
  for (const componentName of componentsToFix) {
    const pattern = `components/**/${componentName}.tsx`;
    const files = await glob(pattern);
    
    for (const file of files) {
      if (await fixComponentExport(file)) {
        fixedCount++;
      }
    }
  }
  
  log(`\n📊 Summary:`, 'bold');
  log(`   Components processed: ${componentsToFix.length}`, 'blue');
  log(`   Components fixed: ${fixedCount}`, 'green');
  
  if (fixedCount > 0) {
    log('\n✅ Component export fixes completed!', 'green');
  } else {
    log('\nℹ️  No component export issues found.', 'blue');
  }
}

// Run the fix
fixAllComponentExports();
