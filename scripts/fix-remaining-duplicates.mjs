#!/usr/bin/env node

import fs from 'fs';
import path from 'path';

const filesToFix = [
  'app/search/page.tsx',
  'app/api/analytics/advanced/route.ts',
  'app/api/chat/messages/route.ts',
  'app/api/chat/rooms/route.ts',
  'app/api/chatbot/route.ts'
];

function removeDuplicateImports(content) {
  const lines = content.split('\n');
  const seenImports = new Set();
  const cleanedLines = [];
  
  for (const line of lines) {
    const trimmedLine = line.trim();
    
    // Check if it's an import statement
    if (trimmedLine.startsWith('import ')) {
      // Create a normalized version for comparison
      const normalized = trimmedLine.replace(/\s+/g, ' ').replace(/from\s+["'][^"']+["']/, 'from "..."');
      
      if (!seenImports.has(normalized)) {
        seenImports.add(normalized);
        cleanedLines.push(line);
      }
      // Skip duplicate imports
    } else {
      cleanedLines.push(line);
    }
  }
  
  return cleanedLines.join('\n');
}

function removeDuplicateFunctions(content) {
  const lines = content.split('\n');
  const cleanedLines = [];
  let foundFirstFunction = false;
  let skipUntilEnd = false;
  
  for (let i = 0; i < lines.length; i++) {
    const line = lines[i];
    
    // Check if we're starting to skip duplicate content
    if (skipUntilEnd) {
      continue;
    }
    
    // Look for function declarations that appear twice
    if (line.includes('export async function GET') || 
        line.includes('export async function POST') ||
        line.includes('export async function PUT') ||
        line.includes('export async function DELETE') ||
        line.includes('function SearchPage') ||
        line.includes('function SearchContent')) {
      
      if (foundFirstFunction) {
        // This is a duplicate, start skipping
        skipUntilEnd = true;
        continue;
      } else {
        foundFirstFunction = true;
      }
    }
    
    cleanedLines.push(line);
  }
  
  return cleanedLines.join('\n');
}

function fixFile(filePath) {
  try {
    const fullPath = path.join(process.cwd(), filePath);
    console.log(`Fixing ${filePath}...`);
    
    if (!fs.existsSync(fullPath)) {
      console.log(`File not found: ${filePath}`);
      return;
    }
    
    const content = fs.readFileSync(fullPath, 'utf8');
    let cleanedContent = removeDuplicateImports(content);
    cleanedContent = removeDuplicateFunctions(cleanedContent);
    
    fs.writeFileSync(fullPath, cleanedContent);
    console.log(`✅ Fixed ${filePath}`);
  } catch (error) {
    console.error(`❌ Error fixing ${filePath}:`, error.message);
  }
}

console.log('🔧 Fixing remaining duplicate imports and functions...\n');

for (const file of filesToFix) {
  fixFile(file);
}

console.log('\n✅ All files processed!');
