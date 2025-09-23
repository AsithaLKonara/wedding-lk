#!/usr/bin/env node

import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Function to recursively find all TypeScript page files
function findPageFiles(dir) {
  let results = [];
  const list = fs.readdirSync(dir);
  
  list.forEach(file => {
    const filePath = path.join(dir, file);
    const stat = fs.statSync(filePath);
    
    if (stat && stat.isDirectory()) {
      if (file !== 'node_modules' && file !== '.next' && !file.startsWith('.')) {
        results = results.concat(findPageFiles(filePath));
      }
    } else {
      if (file === 'page.tsx' || file === 'layout.tsx') {
        results.push(filePath);
      }
    }
  });
  
  return results;
}

// Function to add lazy loading to a file
function addLazyLoadingToFile(filePath) {
  try {
    const content = fs.readFileSync(filePath, 'utf8');
    
    // Skip if already has dynamic imports
    if (content.includes('dynamic(') || content.includes('import dynamic')) {
      return false;
    }
    
    // Find import statements for components
    const importRegex = /import\s+\{([^}]+)\}\s+from\s+["']@\/components\/([^"']+)["']/g;
    const imports = [];
    let match;
    
    while ((match = importRegex.exec(content)) !== null) {
      const componentNames = match[1].split(',').map(name => name.trim());
      const componentPath = match[2];
      
      componentNames.forEach(name => {
        if (name && !name.includes('MainLayout')) {
          imports.push({ name, path: componentPath });
        }
      });
    }
    
    if (imports.length === 0) {
      return false;
    }
    
    // Create new content with lazy loading
    let newContent = content;
    
    // Add dynamic import
    if (!newContent.includes('import dynamic')) {
      newContent = newContent.replace(
        /("use client"\s*\n)/,
        '$1import dynamic from "next/dynamic"\n\n'
      );
    }
    
    // Replace imports with dynamic imports
    imports.forEach(({ name, path }) => {
      const dynamicImport = `const ${name} = dynamic(() => import("@/components/${path}"), { loading: () => <div className="animate-pulse bg-gray-100 dark:bg-gray-800 h-32 rounded-lg" /> })`;
      
      // Remove the original import
      newContent = newContent.replace(
        new RegExp(`import\\s+\\{[^}]*\\b${name}\\b[^}]*\\}\\s+from\\s+["']@\/components\/${path.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')}["']`, 'g'),
        ''
      );
      
      // Add dynamic import before the component
      newContent = newContent.replace(
        /export default function/,
        `${dynamicImport}\n\nexport default function`
      );
    });
    
    // Clean up empty import lines
    newContent = newContent.replace(/import\s+\{\s*\}\s+from\s+["'][^"']+["']\s*\n/g, '');
    newContent = newContent.replace(/\n\s*\n\s*\n/g, '\n\n');
    
    // Write the updated content
    fs.writeFileSync(filePath, newContent);
    return true;
    
  } catch (error) {
    console.error(`Error processing ${filePath}:`, error.message);
    return false;
  }
}

// Main execution
console.log('🚀 Starting lazy loading optimization...');

const appDir = path.join(process.cwd(), 'app');
const pageFiles = findPageFiles(appDir);

let updatedCount = 0;

pageFiles.forEach(file => {
  console.log(`📄 Processing: ${path.relative(process.cwd(), file)}`);
  if (addLazyLoadingToFile(file)) {
    updatedCount++;
    console.log(`✅ Updated: ${path.relative(process.cwd(), file)}`);
  } else {
    console.log(`⏭️  Skipped: ${path.relative(process.cwd(), file)} (already optimized or no components found)`);
  }
});

console.log(`\n🎉 Lazy loading optimization completed!`);
console.log(`📊 Updated ${updatedCount} files out of ${pageFiles.length} total page files.`);
console.log('💡 This should significantly reduce compilation time and improve performance.');
