const fs = require('fs');
const path = require('path');

// Find all files that still reference nextauth-config
function findNextAuthConfigFiles(dir) {
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
          if (content.includes('nextauth-config') || content.includes('authOptions') || content.includes('getServerSession')) {
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

function fixNextAuthConfigFile(filePath) {
  try {
    let content = fs.readFileSync(filePath, 'utf8');
    
    // Remove nextauth-config imports
    content = content.replace(/import.*from ['"]@\/lib\/auth\/nextauth-config['"];?\n?/g, '');
    content = content.replace(/import.*authOptions.*from ['"]@\/lib\/auth\/nextauth-config['"];?\n?/g, '');
    content = content.replace(/import.*getServerSession.*from ['"]next-auth\/react['"];?\n?/g, '');
    content = content.replace(/import.*getServerSession.*from ['"]next-auth['"];?\n?/g, '');
    
    // Replace getServerSession calls with custom auth
    content = content.replace(/const session = await getServerSession\(authOptions\);?/g, 
      '// Custom auth implementation\n    const token = request.cookies.get(\'auth-token\')?.value;\n    if (!token) {\n      return NextResponse.json({ error: \'Unauthorized\' }, { status: 401 });\n    }');
    
    // Replace session checks
    content = content.replace(/!token/g, '!token');
    content = content.replace(/session\s*&&/g, 'token &&');
    content = content.replace(/session\s*\?/g, 'token ?');
    
    fs.writeFileSync(filePath, content);
    console.log(`Fixed: ${filePath}`);
  } catch (error) {
    console.error(`Error fixing ${filePath}:`, error.message);
  }
}

// Find and fix all nextauth-config files
const nextAuthConfigFiles = findNextAuthConfigFiles('.');
console.log(`Found ${nextAuthConfigFiles.length} files with nextauth-config references`);

nextAuthConfigFiles.forEach(fixNextAuthConfigFile);

console.log('NextAuth config reference fixes completed!');
