#!/usr/bin/env node

import fs from 'fs';
import path from 'path';

console.log('🚀 Agile Sprint 1: Fixing critical component issues...');

// Function to fix specific critical issues
function fixCriticalIssues(filePath, fixes) {
  try {
    let content = fs.readFileSync(filePath, 'utf8');
    let modified = false;

    for (const fix of fixes) {
      if (content.match(fix.pattern)) {
        content = content.replace(fix.pattern, fix.replacement);
        modified = true;
      }
    }

    if (modified) {
      fs.writeFileSync(filePath, content);
      console.log(`✅ Fixed ${path.basename(filePath)}`);
    }

  } catch (error) {
    console.log(`⚠️  Could not process ${filePath}: ${error.message}`);
  }
}

const projectRoot = process.cwd();

// Fix theme-provider.tsx - remove suppressHydrationWarning
console.log('📝 Fixing theme-provider.tsx...');
fixCriticalIssues(path.join(projectRoot, 'components/providers/theme-provider.tsx'), [
  {
    pattern: /suppressHydrationWarning\s*=\s*{true}/g,
    replacement: ''
  }
]);

// Fix calendar.tsx - remove IconRight
console.log('📝 Fixing calendar.tsx...');
fixCriticalIssues(path.join(projectRoot, 'components/ui/calendar.tsx'), [
  {
    pattern: /IconRight:\s*\(\{\s*\.\.\.props\s*\}\)\s*=>\s*<ChevronRight\s+className="h-4 w-4"\s*\/>,/g,
    replacement: ''
  }
]);

// Fix drawer.tsx - fix shouldScaleBackground issue
console.log('📝 Fixing drawer.tsx...');
fixCriticalIssues(path.join(projectRoot, 'components/ui/drawer.tsx'), [
  {
    pattern: /shouldScaleBackground\s*=\s*true,/g,
    replacement: ''
  },
  {
    pattern: /shouldScaleBackground=\{shouldScaleBackground\}/g,
    replacement: ''
  }
]);

// Fix packages/compare/page.tsx - add index signature
console.log('📝 Fixing packages/compare/page.tsx...');
fixCriticalIssues(path.join(projectRoot, 'app/packages/compare/page.tsx'), [
  {
    pattern: /const\s+features\s*=\s*\{[^}]*\}/g,
    replacement: 'const features: { [key: string]: boolean } = {'
  }
]);

// Fix API routes - add proper types
console.log('📝 Fixing API routes...');
const apiFiles = [
  'app/api/services/route.ts',
  'app/api/tasks/route.ts'
];

for (const apiFile of apiFiles) {
  fixCriticalIssues(path.join(projectRoot, apiFile), [
    {
      pattern: /let query: any = \{\};/g,
      replacement: 'let query: Record<string, any> = {};'
    }
  ]);
}

// Fix duplicate imports in vendor and venue detail pages
console.log('📝 Fixing duplicate imports...');
fixCriticalIssues(path.join(projectRoot, 'app/vendors/[id]/page.tsx'), [
  {
    pattern: /import\s+dynamic\s+from\s+"next\/dynamic"\s*\nimport\s+dynamic\s+from\s+"next\/dynamic"/g,
    replacement: 'import dynamic from "next/dynamic"'
  }
]);

fixCriticalIssues(path.join(projectRoot, 'app/venues/[id]/page.tsx'), [
  {
    pattern: /import\s+dynamic\s+from\s+"next\/dynamic"\s*\nimport\s+dynamic\s+from\s+"next\/dynamic"/g,
    replacement: 'import dynamic from "next/dynamic"'
  }
]);

console.log('🎉 Sprint 1: Critical component issues fixed!');
console.log('🔄 Next: Test the build');
