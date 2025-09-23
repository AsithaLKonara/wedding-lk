#!/usr/bin/env node

import fs from 'fs';
import path from 'path';

console.log('🔧 Fixing dynamic import syntax...');

// Function to fix malformed dynamic imports
function fixDynamicSyntax(filePath) {
  try {
    let content = fs.readFileSync(filePath, 'utf8');
    let modified = false;

    // Fix the malformed dynamic import syntax
    // Pattern: const Component = dynamic(() => import("path").then(module => ({ default: module.default || module.Component || module }))), { loading: () => <div /> })
    const malformedRegex = /const\s+(\w+)\s*=\s*dynamic\(\(\)\s*=>\s*import\(["']([^"']+)["']\)\.then\(module\s*=>\s*\(\{\s*default:\s*module\.default\s*\|\|\s*module\.(\w+)\s*\|\|\s*module\s*\}\)\)\),\s*\{\s*loading:\s*\(\)\s*=>\s*<[^>]+>\s*\}\)/g;
    
    content = content.replace(malformedRegex, (match, componentName, importPath, fallbackName) => {
      modified = true;
      return `const ${componentName} = dynamic(() => import("${importPath}"), { loading: () => <div className="animate-pulse bg-gray-100 dark:bg-gray-800 h-32 rounded-lg" /> })`;
    });

    // Fix simpler malformed patterns
    const simpleMalformedRegex = /const\s+(\w+)\s*=\s*dynamic\(\(\)\s*=>\s*import\(["']([^"']+)["']\)\.then\(module\s*=>\s*\(\{\s*default:\s*module\.default\s*\|\|\s*module\.(\w+)\s*\|\|\s*module\s*\}\)\)\)/g;
    
    content = content.replace(simpleMalformedRegex, (match, componentName, importPath, fallbackName) => {
      modified = true;
      return `const ${componentName} = dynamic(() => import("${importPath}"))`;
    });

    // Fix the specific pattern with loading and ssr options
    const complexPattern = /const\s+(\w+)\s*=\s*dynamic\(\(\)\s*=>\s*import\(["']([^"']+)["']\)\.then\(module\s*=>\s*\(\{\s*default:\s*module\.default\s*\|\|\s*module\.(\w+)\s*\|\|\s*module\s*\}\)\)\),\s*\{\s*loading:\s*\(\)\s*=>\s*<SkeletonLoader[^>]+>,\s*ssr:\s*true,\s*\}\)/g;
    
    content = content.replace(complexPattern, (match, componentName, importPath, fallbackName) => {
      modified = true;
      return `const ${componentName} = dynamic(() => import("${importPath}"), { 
  loading: () => <SkeletonLoader variant="card" className="h-96" />,
  ssr: true,
})`;
    });

    if (modified) {
      fs.writeFileSync(filePath, content);
      console.log(`✅ Fixed dynamic syntax in ${path.basename(filePath)}`);
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
  fixDynamicSyntax(file);
}

console.log('🎉 Dynamic import syntax fixes completed!');
console.log('🔄 Run "npm run type-check" to verify fixes');
