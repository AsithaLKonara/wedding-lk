#!/usr/bin/env node

import fs from 'fs';
import path from 'path';

console.log('🚀 Agile Sprint 1: Fixing dynamic imports...');

// Function to fix dynamic imports with proper typing
function fixDynamicImports(filePath) {
  try {
    let content = fs.readFileSync(filePath, 'utf8');
    let modified = false;

    // Fix dynamic imports to use proper typing - simplified approach
    const dynamicImportRegex = /const\s+(\w+)\s*=\s*dynamic\(\(\)\s*=>\s*import\(["']([^"']+)["']\)\.then\(module\s*=>\s*\(\{\s*default:\s*module\.default\s*\|\|\s*module\.(\w+)\s*\|\|\s*module\s*\}\)\)\)/g;
    
    content = content.replace(dynamicImportRegex, (match, componentName, importPath, fallbackName) => {
      modified = true;
      return `const ${componentName} = dynamic(() => import("${importPath}"))`;
    });

    // Fix duplicate imports
    const duplicateImportRegex = /import\s+dynamic\s+from\s+"next\/dynamic"\s*\nimport\s+dynamic\s+from\s+"next\/dynamic"/g;
    if (content.match(duplicateImportRegex)) {
      content = content.replace(duplicateImportRegex, 'import dynamic from "next/dynamic"');
      modified = true;
    }

    if (modified) {
      fs.writeFileSync(filePath, content);
      console.log(`✅ Fixed ${path.basename(filePath)}`);
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

console.log(`📁 Processing ${tsFiles.length} TypeScript files...`);

// Process each file
for (const file of tsFiles) {
  fixDynamicImports(file);
}

console.log('🎉 Sprint 1: Dynamic imports fixed!');
console.log('🔄 Next: Fix component interfaces');
