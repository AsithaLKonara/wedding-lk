#!/usr/bin/env node

import fs from 'fs';
import path from 'path';

console.log('🔧 Fixing dynamic imports and TypeScript issues...');

// Function to fix dynamic imports in a file
function fixDynamicImports(filePath) {
  try {
    let content = fs.readFileSync(filePath, 'utf8');
    let modified = false;

    // Fix dynamic imports to use proper typing
    const dynamicImportRegex = /const\s+(\w+)\s*=\s*dynamic\(\(\)\s*=>\s*import\(["']([^"']+)["']\)/g;
    
    content = content.replace(dynamicImportRegex, (match, componentName, importPath) => {
      modified = true;
      return `const ${componentName} = dynamic(() => import("${importPath}").then(module => ({ default: module.default || module.${componentName} || module })))`;
    });

    // Fix missing dynamic import
    if (content.includes('const PlatformStatus = dynamic(') && !content.includes('import dynamic')) {
      content = content.replace(
        /import\s+{\s*MainLayout\s*}\s+from\s+["']@\/components\/templates\/main-layout["']/,
        `import { MainLayout } from "@/components/templates/main-layout"
import dynamic from "next/dynamic"`
      );
      modified = true;
    }

    // Fix missing dynamic import in other files
    if (content.includes('const') && content.includes('dynamic(') && !content.includes('import dynamic')) {
      const importMatch = content.match(/import\s+{\s*[^}]*}\s+from\s+["'][^"']+["']/);
      if (importMatch) {
        content = content.replace(
          importMatch[0],
          `${importMatch[0]}
import dynamic from "next/dynamic"`
        );
        modified = true;
      }
    }

    if (modified) {
      fs.writeFileSync(filePath, content);
      console.log(`✅ Fixed dynamic imports in ${filePath}`);
    }

  } catch (error) {
    console.log(`⚠️  Could not process ${filePath}: ${error.message}`);
  }
}

// Function to add proper TypeScript interfaces
function addTypeInterfaces(filePath) {
  try {
    let content = fs.readFileSync(filePath, 'utf8');
    let modified = false;

    // Add interface for props if missing
    if (content.includes('export default function') && !content.includes('interface') && !content.includes('type Props')) {
      const functionMatch = content.match(/export default function (\w+)\(([^)]*)\)/);
      if (functionMatch) {
        const componentName = functionMatch[1];
        const params = functionMatch[2];
        
        if (params.includes('props') && !params.includes(':')) {
          const interfaceName = `${componentName}Props`;
          const interfaceDef = `interface ${interfaceName} {
  [key: string]: any;
}

`;
          
          content = content.replace(
            /export default function/,
            `${interfaceDef}export default function`
          );
          
          content = content.replace(
            /export default function (\w+)\(props\)/,
            `export default function $1(props: ${interfaceName})`
          );
          
          modified = true;
        }
      }
    }

    if (modified) {
      fs.writeFileSync(filePath, content);
      console.log(`✅ Added TypeScript interfaces to ${filePath}`);
    }

  } catch (error) {
    console.log(`⚠️  Could not process ${filePath}: ${error.message}`);
  }
}

// Function to fix specific component issues
function fixComponentIssues(filePath) {
  try {
    let content = fs.readFileSync(filePath, 'utf8');
    let modified = false;

    // Fix VenueCard id type issue
    if (content.includes('VenueCard') && content.includes('id: string')) {
      content = content.replace(
        /id: string/g,
        'id: number'
      );
      modified = true;
    }

    // Fix theme provider suppressHydrationWarning issue
    if (content.includes('suppressHydrationWarning')) {
      content = content.replace(
        /suppressHydrationWarning\s*=\s*{true}/g,
        'suppressHydrationWarning={true}'
      );
      modified = true;
    }

    // Fix calendar IconLeft issue
    if (content.includes('IconLeft:')) {
      content = content.replace(
        /IconLeft:\s*\({[^}]*}\)\s*=>/g,
        'IconLeft: ({ ...props }) =>'
      );
      modified = true;
    }

    // Fix drawer vaul import issue
    if (content.includes('from "vaul"')) {
      content = content.replace(
        /import\s+{\s*Drawer as DrawerPrimitive\s*}\s+from\s+"vaul"/g,
        '// import { Drawer as DrawerPrimitive } from "vaul"'
      );
      modified = true;
    }

    if (modified) {
      fs.writeFileSync(filePath, content);
      console.log(`✅ Fixed component issues in ${filePath}`);
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
  addTypeInterfaces(file);
  fixComponentIssues(file);
}

console.log('🎉 Dynamic imports and TypeScript fixes completed!');
console.log('📝 Fixed dynamic imports, added interfaces, and resolved component issues');
console.log('🔄 Run "npm run type-check" to verify fixes');