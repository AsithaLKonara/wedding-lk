#!/usr/bin/env node

import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Function to recursively find all files
function findFiles(dir, extensions = ['.js', '.ts']) {
  let results = [];
  const list = fs.readdirSync(dir);
  
  list.forEach(file => {
    const filePath = path.join(dir, file);
    const stat = fs.statSync(filePath);
    
    if (stat && stat.isDirectory()) {
      // Skip node_modules and .next
      if (file !== 'node_modules' && file !== '.next' && !file.startsWith('.')) {
        results = results.concat(findFiles(filePath, extensions));
      }
    } else {
      const ext = path.extname(file);
      if (extensions.includes(ext)) {
        results.push(filePath);
      }
    }
  });
  
  return results;
}

// Function to find duplicate API routes
function findDuplicateApiRoutes() {
  const apiDir = path.join(process.cwd(), 'app', 'api');
  const allFiles = findFiles(apiDir);
  
  const duplicates = [];
  const fileMap = new Map();
  
  allFiles.forEach(file => {
    const relativePath = path.relative(apiDir, file);
    const baseName = relativePath.replace(/\.(js|ts)$/, '');
    const ext = path.extname(file);
    
    if (!fileMap.has(baseName)) {
      fileMap.set(baseName, []);
    }
    fileMap.get(baseName).push({ file, ext });
  });
  
  // Find duplicates
  fileMap.forEach((files, baseName) => {
    if (files.length > 1) {
      duplicates.push({
        baseName,
        files: files.sort((a, b) => a.ext.localeCompare(b.ext))
      });
    }
  });
  
  return duplicates;
}

// Function to remove .js duplicates
function removeJsDuplicates() {
  const duplicates = findDuplicateApiRoutes();
  let removedCount = 0;
  
  duplicates.forEach(({ baseName, files }) => {
    const jsFile = files.find(f => f.ext === '.js');
    const tsFile = files.find(f => f.ext === '.ts');
    
    if (jsFile && tsFile) {
      console.log(`🔄 Removing duplicate: ${jsFile.file}`);
      try {
        fs.unlinkSync(jsFile.file);
        removedCount++;
        console.log(`✅ Removed: ${jsFile.file}`);
      } catch (error) {
        console.error(`❌ Error removing ${jsFile.file}:`, error.message);
      }
    }
  });
  
  return removedCount;
}

// Main execution
console.log('🧹 Starting API route duplicate cleanup...');
const removedCount = removeJsDuplicates();
console.log(`\n🎉 API cleanup completed! Removed ${removedCount} duplicate .js files.`);
console.log('💡 Keeping TypeScript (.ts) versions for better performance and type safety.');
