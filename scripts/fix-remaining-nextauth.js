const fs = require('fs');
const path = require('path');

// Find all files that still have NextAuth imports
function findNextAuthFiles(dir) {
  const files = [];
  
  function scanDirectory(currentDir) {
    const items = fs.readdirSync(currentDir);
    
    for (const item of items) {
      const fullPath = path.join(currentDir, item);
      const stat = fs.statSync(fullPath);
      
      if (stat.isDirectory() && !item.startsWith('.') && item !== 'node_modules') {
        scanDirectory(fullPath);
      } else if (stat.isFile() && (item.endsWith('.tsx') || item.endsWith('.ts') || item.endsWith('.js'))) {
        try {
          const content = fs.readFileSync(fullPath, 'utf8');
          if (content.includes('next-auth/react') || content.includes('next-auth')) {
            files.push(fullPath);
          }
        } catch (error) {
          // Skip files that can't be read
        }
      }
    }
  }
  
  scanDirectory(dir);
  return files;
}

function fixNextAuthFile(filePath) {
  try {
    let content = fs.readFileSync(filePath, 'utf8');
    
    // Remove all NextAuth imports
    content = content.replace(/import.*from ['"]next-auth\/react['"];?\n?/g, '');
    content = content.replace(/import.*from ['"]next-auth['"];?\n?/g, '');
    content = content.replace(/import.*useSession.*from ['"]next-auth\/react['"];?\n?/g, '');
    content = content.replace(/import.*signIn.*from ['"]next-auth\/react['"];?\n?/g, '');
    content = content.replace(/import.*signOut.*from ['"]next-auth\/react['"];?\n?/g, '');
    content = content.replace(/import.*getSession.*from ['"]next-auth\/react['"];?\n?/g, '');
    
    // Replace useSession with custom auth
    content = content.replace(/const\s*{\s*data:\s*session[^}]*}\s*=\s*useSession\(\);?/g, 
      'const [user, setUser] = useState(null);\n  const [status, setStatus] = useState(\'loading\');');
    
    // Replace session checks
    content = content.replace(/session\.user/g, 'user');
    content = content.replace(/!user/g, '!user');
    content = content.replace(/session\s*&&/g, 'user &&');
    content = content.replace(/session\s*\?/g, 'user ?');
    content = content.replace(/session\s*===/g, 'user ===');
    content = content.replace(/session\s*!==/g, 'user !==');
    
    // Replace signOut calls
    content = content.replace(/signOut\(/g, 'fetch(\'/api/auth/signout\', { method: \'POST\' }).then(() => ');
    
    // Add useState import if not present
    if (content.includes('useState') && !content.includes("import { useState }")) {
      content = content.replace(/import { ([^}]+) } from ['"]react['"];?/g, (match, imports) => {
        if (!imports.includes('useState')) {
          return `import { ${imports}, useState } from "react";`;
        }
        return match;
      });
    }
    
    fs.writeFileSync(filePath, content);
    console.log(`Fixed: ${filePath}`);
  } catch (error) {
    console.error(`Error fixing ${filePath}:`, error.message);
  }
}

// Find and fix all NextAuth files
const nextAuthFiles = findNextAuthFiles('.');
console.log(`Found ${nextAuthFiles.length} files with NextAuth imports`);

nextAuthFiles.forEach(fixNextAuthFile);

console.log('NextAuth import fixes completed!');
