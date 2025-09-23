#!/usr/bin/env node

import fs from 'fs';
import path from 'path';

console.log('🔧 Final fix for dynamic imports...');

// Function to fix dynamic imports with proper typing
function fixDynamicImports(filePath) {
  try {
    let content = fs.readFileSync(filePath, 'utf8');
    let modified = false;

    // Fix dynamic imports to use proper typing
    const dynamicImportRegex = /const\s+(\w+)\s*=\s*dynamic\(\(\)\s*=>\s*import\(["']([^"']+)["']\)(?:,\s*\{[^}]*\})?\)/g;
    
    content = content.replace(dynamicImportRegex, (match, componentName, importPath) => {
      modified = true;
      return `const ${componentName} = dynamic(() => import("${importPath}").then(module => ({ default: module.default || module.${componentName} || module })))`;
    });

    // Fix duplicate imports
    const duplicateImportRegex = /import\s+dynamic\s+from\s+"next\/dynamic"\s*\nimport\s+dynamic\s+from\s+"next\/dynamic"/g;
    content = content.replace(duplicateImportRegex, 'import dynamic from "next/dynamic"');
    if (content.match(duplicateImportRegex)) {
      modified = true;
    }

    if (modified) {
      fs.writeFileSync(filePath, content);
      console.log(`✅ Fixed dynamic imports in ${path.basename(filePath)}`);
    }

  } catch (error) {
    console.log(`⚠️  Could not process ${filePath}: ${error.message}`);
  }
}

// Get all TypeScript files
function getAllTsFiles(dir) {
  const files = [];
  const items = fs.readdirSync(dir);
  
  for (const item of items) {
    const fullPath = path.join(dir, item);
    const stat = fs.statSync(fullPath);
    
    if (stat.isDirectory() && !item.startsWith('.') && item !== 'node_modules') {
      files.push(...getAllTsFiles(fullPath));
    } else if (item.endsWith('.tsx') || item.endsWith('.ts')) {
      files.push(fullPath);
    }
  }
  
  return files;
}

// Main execution
const projectRoot = process.cwd();
const tsFiles = getAllTsFiles(projectRoot);

console.log(`📁 Found ${tsFiles.length} TypeScript files to process`);

// Process each file
for (const file of tsFiles) {
  fixDynamicImports(file);
}

console.log('🎉 Dynamic imports final fixes completed!');
console.log('🔄 Run "npm run type-check" to verify fixes');
