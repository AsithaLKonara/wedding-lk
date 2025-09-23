#!/usr/bin/env node

import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Function to recursively find all files
function findFiles(dir, extensions = ['.jsx', '.tsx']) {
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

// Function to find duplicate pages
function findDuplicatePages() {
  const appDir = path.join(process.cwd(), 'app');
  const allFiles = findFiles(appDir);
  
  const duplicates = [];
  const fileMap = new Map();
  
  allFiles.forEach(file => {
    const relativePath = path.relative(appDir, file);
    const baseName = relativePath.replace(/\.(jsx|tsx)$/, '');
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

// Function to remove .jsx duplicates
function removeJsxDuplicates() {
  const duplicates = findDuplicatePages();
  let removedCount = 0;
  
  duplicates.forEach(({ baseName, files }) => {
    const jsxFile = files.find(f => f.ext === '.jsx');
    const tsxFile = files.find(f => f.ext === '.tsx');
    
    if (jsxFile && tsxFile) {
      console.log(`🔄 Removing duplicate: ${jsxFile.file}`);
      try {
        fs.unlinkSync(jsxFile.file);
        removedCount++;
        console.log(`✅ Removed: ${jsxFile.file}`);
      } catch (error) {
        console.error(`❌ Error removing ${jsxFile.file}:`, error.message);
      }
    }
  });
  
  return removedCount;
}

// Main execution
console.log('🧹 Starting duplicate file cleanup...');
const removedCount = removeJsxDuplicates();
console.log(`\n🎉 Cleanup completed! Removed ${removedCount} duplicate .jsx files.`);
console.log('💡 Keeping TypeScript (.tsx) versions for better performance and type safety.');
