const fs = require('fs');
const path = require('path');

// Files to fix NextAuth imports
const filesToFix = [
  'app/auth/signup/page.tsx',
  'app/booking/[id]/page.tsx', 
  'app/booking/confirmation/[id]/page.tsx',
  'app/budget-planner/page.tsx',
  'app/checkout/page.tsx',
  'app/dashboard/admin/page.tsx',
  'app/dashboard/admin/users/page.tsx',
  'app/dashboard/admin/vendors/page.tsx',
  'app/dashboard/favorites/page.tsx',
  'app/dashboard/messages/messages-content.tsx',
  'app/dashboard/planner/clients/page.tsx',
  'app/dashboard/planner/page.tsx',
  'app/dashboard/planner/tasks/page.tsx',
  'app/dashboard/profile/page.tsx',
  'app/dashboard/planning/page.tsx',
  'app/dashboard/redirect/page.tsx',
  'app/dashboard/user/page.tsx',
  'app/dashboard/vendor/availability/page.tsx',
  'app/dashboard/vendor/page.tsx',
  'app/dashboard/vendor/portfolio/page.tsx',
  'app/dashboard/vendor/services/page.tsx',
  'app/messages/page.tsx',
  'app/payments/history/page.tsx',
  'app/photo-review/page.tsx',
  'app/providers.tsx',
  'app/review-reply/page.tsx',
  'app/test-auth/page.tsx',
  'app/test-credentials/page.tsx',
  'app/timeline/page.tsx',
  'app/unauthorized/page.tsx',
  'app/vendor/register/page.tsx'
];

function fixNextAuthImports(filePath) {
  try {
    if (!fs.existsSync(filePath)) {
      console.log(`File not found: ${filePath}`);
      return;
    }

    let content = fs.readFileSync(filePath, 'utf8');
    
    // Remove NextAuth imports
    content = content.replace(/import.*from ['"]next-auth\/react['"];?\n?/g, '');
    content = content.replace(/import.*useSession.*from ['"]next-auth\/react['"];?\n?/g, '');
    content = content.replace(/import.*signIn.*from ['"]next-auth\/react['"];?\n?/g, '');
    content = content.replace(/import.*signOut.*from ['"]next-auth\/react['"];?\n?/g, '');
    
    // Replace useSession with custom auth
    content = content.replace(/const\s*{\s*data:\s*session[^}]*}\s*=\s*useSession\(\);?/g, 
      'const [user, setUser] = useState(null);\n  const [status, setStatus] = useState(\'loading\');');
    
    // Replace session checks
    content = content.replace(/session\.user/g, 'user');
    content = content.replace(/!user/g, '!user');
    content = content.replace(/session\s*&&/g, 'user &&');
    content = content.replace(/session\s*\?/g, 'user ?');
    
    // Replace signOut calls
    content = content.replace(/signOut\(/g, 'fetch(\'/api/auth/signout\', { method: \'POST\' }).then(() => ');
    
    fs.writeFileSync(filePath, content);
    console.log(`Fixed: ${filePath}`);
  } catch (error) {
    console.error(`Error fixing ${filePath}:`, error.message);
  }
}

// Fix all files
filesToFix.forEach(fixNextAuthImports);

console.log('NextAuth import fixes completed!');
