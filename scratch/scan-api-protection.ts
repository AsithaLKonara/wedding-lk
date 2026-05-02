import fs from 'fs';
import path from 'path';

const API_ROOT = 'app/api';

function getAllRoutes(dir: string, fileList: string[] = []): string[] {
  const files = fs.readdirSync(dir);
  files.forEach(file => {
    const filePath = path.join(dir, file);
    if (fs.statSync(filePath).isDirectory()) {
      getAllRoutes(filePath, fileList);
    } else if (file === 'route.ts') {
      fileList.push(filePath);
    }
  });
  return fileList;
}

const routes = getAllRoutes(API_ROOT);
const results: any[] = [];

routes.forEach(route => {
  const content = fs.readFileSync(route, 'utf-8');
  const protection: string[] = [];

  if (content.includes('withAuth')) protection.push('withAuth (Legacy)');
  if (content.includes('withAdmin')) protection.push('withAdmin (Legacy)');
  if (content.includes('withVendor')) protection.push('withVendor (Legacy)');
  if (content.includes('withWeddingPlanner')) protection.push('withWeddingPlanner (Legacy)');
  if (content.includes('verifyToken')) protection.push('verifyToken (Custom)');
  if (content.includes('Middleware.requireAuth')) protection.push('Middleware.requireAuth (New)');
  if (content.includes('Middleware.requireAdmin')) protection.push('Middleware.requireAdmin (New)');
  if (content.includes('requireAuth')) protection.push('requireAuth');
  if (content.includes('requireAdmin')) protection.push('requireAdmin');
  if (content.includes('RBAC.hasPermission')) protection.push('RBAC.hasPermission');
  
  // Check for NextAuth
  if (content.includes('getServerSession')) protection.push('NextAuth Session');

  results.push({
    route,
    protection: protection.length > 0 ? protection : ['UNPROTECTED']
  });
});

console.log(JSON.stringify(results, null, 2));
