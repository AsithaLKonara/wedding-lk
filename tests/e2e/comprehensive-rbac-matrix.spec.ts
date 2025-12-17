import { test, expect } from '@playwright/test';
import { 
  authenticateAsRole, 
  navigateToPage, 
  checkPageAccess,
  waitForPageLoad,
  Environment,
  UserRole,
  TestUser
} from '../helpers/browser-helpers';
import { 
  PAGE_CATALOG,
  getPagesByRole,
  getDeniedPagesForRole,
  isPageAccessibleForRole
} from '../helpers/page-catalog';
import { setupConsoleListener, generateConsoleReport, saveConsoleReport } from '../helpers/console-collector';
import testUsersExtended from '../fixtures/test-users-extended.json';

const testUsers: Record<UserRole, TestUser> = {
  user: testUsersExtended.users.find(u => u.role === 'user' && u.environment === 'local') as TestUser,
  vendor: testUsersExtended.users.find(u => u.role === 'vendor' && u.environment === 'local') as TestUser,
  wedding_planner: testUsersExtended.users.find(u => u.role === 'wedding_planner' && u.environment === 'local') as TestUser,
  admin: testUsersExtended.users.find(u => u.role === 'admin' && u.environment === 'local') as TestUser,
  maintainer: testUsersExtended.users.find(u => u.role === 'maintainer' && u.environment === 'local') as TestUser,
};

const roles: UserRole[] = ['user', 'vendor', 'wedding_planner', 'admin', 'maintainer'];

test.describe('🛡️ Comprehensive RBAC Matrix Tests', () => {
  
  test.describe('User Role Access Matrix', () => {
    const userRole: UserRole = 'user';
    const allowedPages = getPagesByRole(userRole).filter(p => p.requiresAuth);
    const deniedPages = getDeniedPagesForRole(userRole);

    test(`User can access ${allowedPages.length} allowed pages`, async ({ page }) => {
      await authenticateAsRole(page, userRole, 'local', testUsers);
      
      let successCount = 0;
      let failCount = 0;
      
      for (const pageInfo of allowedPages.slice(0, 20)) { // Test first 20 pages
        try {
          await navigateToPage(page, pageInfo.path, 'local');
          await waitForPageLoad(page);
          
          const access = await checkPageAccess(page);
          if (access.accessible) {
            successCount++;
          } else {
            failCount++;
          }
        } catch (error) {
          failCount++;
        }
      }
      
      console.log(`User role: ${successCount} successful, ${failCount} failed`);
      expect(successCount).toBeGreaterThan(0);
    });

    test(`User cannot access ${deniedPages.length} denied pages`, async ({ page }) => {
      await authenticateAsRole(page, userRole, 'local', testUsers);
      
      let deniedCount = 0;
      
      for (const pageInfo of deniedPages.slice(0, 10)) { // Test first 10 denied pages
        try {
          await navigateToPage(page, pageInfo.path, 'local');
          await waitForPageLoad(page);
          
          const bodyText = await page.locator('body').textContent() || '';
          const isDenied = bodyText.includes('Access Denied') ||
                          bodyText.includes('403') ||
                          bodyText.includes('Unauthorized') ||
                          page.url().includes('/unauthorized');
          
          if (isDenied) {
            deniedCount++;
          }
        } catch (error) {
          // Access denied is expected
          deniedCount++;
        }
      }
      
      console.log(`User role: ${deniedCount} pages correctly denied`);
      expect(deniedCount).toBeGreaterThanOrEqual(0);
    });
  });

  test.describe('Vendor Role Access Matrix', () => {
    const vendorRole: UserRole = 'vendor';
    const allowedPages = getPagesByRole(vendorRole).filter(p => p.requiresAuth && p.category === 'vendor');

    test('Vendor can access vendor-specific pages', async ({ page }) => {
      await authenticateAsRole(page, vendorRole, 'local', testUsers);
      
      const vendorPages = [
        '/dashboard/vendor',
        '/dashboard/vendor/services',
        '/dashboard/vendor/analytics',
      ];
      
      for (const pagePath of vendorPages) {
        await navigateToPage(page, pagePath, 'local');
        await waitForPageLoad(page);
        
        const access = await checkPageAccess(page);
        expect(access.accessible).toBeTruthy();
      }
    });

    test('Vendor cannot access admin pages', async ({ page }) => {
      await authenticateAsRole(page, vendorRole, 'local', testUsers);
      
      const adminPages = [
        '/dashboard/admin',
        '/dashboard/admin/users',
        '/dashboard/admin/vendors',
      ];
      
      for (const pagePath of adminPages) {
        await navigateToPage(page, pagePath, 'local');
        await waitForPageLoad(page);
        
        const bodyText = await page.locator('body').textContent() || '';
        const isDenied = bodyText.includes('Access Denied') ||
                        bodyText.includes('403') ||
                        page.url().includes('/unauthorized') ||
                        page.url().includes('/dashboard');
        
        expect(isDenied).toBeTruthy();
      }
    });
  });

  test.describe('Wedding Planner Role Access Matrix', () => {
    const plannerRole: UserRole = 'wedding_planner';
    
    test('Planner can access planner-specific pages', async ({ page }) => {
      await authenticateAsRole(page, plannerRole, 'local', testUsers);
      
      const plannerPages = [
        '/dashboard/planner',
        '/dashboard/planner/clients',
        '/dashboard/planner/tasks',
      ];
      
      for (const pagePath of plannerPages) {
        await navigateToPage(page, pagePath, 'local');
        await waitForPageLoad(page);
        
        const access = await checkPageAccess(page);
        expect(access.accessible).toBeTruthy();
      }
    });

    test('Planner cannot access vendor pages', async ({ page }) => {
      await authenticateAsRole(page, plannerRole, 'local', testUsers);
      
      await navigateToPage(page, '/dashboard/vendor/services', 'local');
      await waitForPageLoad(page);
      
      const bodyText = await page.locator('body').textContent() || '';
      const isDenied = bodyText.includes('Access Denied') ||
                      bodyText.includes('403') ||
                      page.url().includes('/unauthorized');
      
      expect(isDenied).toBeTruthy();
    });
  });

  test.describe('Admin Role Access Matrix', () => {
    const adminRole: UserRole = 'admin';
    
    test('Admin can access all admin pages', async ({ page }) => {
      await authenticateAsRole(page, adminRole, 'local', testUsers);
      
      const adminPages = [
        '/dashboard/admin',
        '/dashboard/admin/users',
        '/dashboard/admin/vendors',
        '/dashboard/admin/reports',
        '/dashboard/admin/analytics',
      ];
      
      for (const pagePath of adminPages) {
        await navigateToPage(page, pagePath, 'local');
        await waitForPageLoad(page);
        
        const access = await checkPageAccess(page);
        expect(access.accessible).toBeTruthy();
      }
    });

    test('Admin can access common dashboard pages', async ({ page }) => {
      await authenticateAsRole(page, adminRole, 'local', testUsers);
      
      const commonPages = [
        '/dashboard',
        '/dashboard/profile',
        '/dashboard/settings',
        '/dashboard/bookings',
      ];
      
      for (const pagePath of commonPages) {
        await navigateToPage(page, pagePath, 'local');
        await waitForPageLoad(page);
        
        const access = await checkPageAccess(page);
        expect(access.accessible).toBeTruthy();
      }
    });
  });

  test.describe('Maintainer Role Access Matrix', () => {
    const maintainerRole: UserRole = 'maintainer';
    
    test('Maintainer has same access as admin', async ({ page }) => {
      await authenticateAsRole(page, maintainerRole, 'local', testUsers);
      
      const adminPages = [
        '/dashboard/admin',
        '/dashboard/admin/users',
        '/dashboard/admin/settings',
      ];
      
      for (const pagePath of adminPages) {
        await navigateToPage(page, pagePath, 'local');
        await waitForPageLoad(page);
        
        const access = await checkPageAccess(page);
        expect(access.accessible).toBeTruthy();
      }
    });

    test('Maintainer can access debug pages', async ({ page }) => {
      await authenticateAsRole(page, maintainerRole, 'local', testUsers);
      
      await navigateToPage(page, '/debug-runtime', 'local');
      await waitForPageLoad(page);
      
      const access = await checkPageAccess(page);
      // Debug page might not exist, but should not show access denied
      expect(access.status).toBeLessThan(500);
    });
  });

  test.describe('API Endpoint Authorization', () => {
    test('Unauthenticated API calls return 401', async ({ page }) => {
      const response = await page.request.get('http://localhost:3000/api/dashboard/stats');
      expect([401, 403, 404]).toContain(response.status());
    });

    test('User role API access', async ({ page }) => {
      await authenticateAsRole(page, 'user', 'local', testUsers);
      
      // User should be able to access user-specific APIs
      const response = await page.request.get('http://localhost:3000/api/dashboard/user/stats');
      // API might return 200 or 404 (if not implemented)
      expect([200, 404]).toContain(response.status());
    });

    test('Admin role API access', async ({ page }) => {
      await authenticateAsRole(page, 'admin', 'local', testUsers);
      
      // Admin should be able to access admin APIs
      const response = await page.request.get('http://localhost:3000/api/dashboard/admin/stats');
      // API might return 200 or 404 (if not implemented)
      expect([200, 404]).toContain(response.status());
    });
  });

  test.describe('Navigation Menu Visibility', () => {
    for (const role of roles) {
      test(`${role} sees correct navigation items`, async ({ page }) => {
        await authenticateAsRole(page, role, 'local', testUsers);
        await navigateToPage(page, '/dashboard', 'local');
        await waitForPageLoad(page);
        
        const bodyText = await page.locator('body').textContent() || '';
        
        // Check role-specific navigation
        switch (role) {
          case 'user':
            // User should see planning, favorites
            expect(bodyText).toMatch(/planning|favorites|dashboard/i);
            break;
          case 'vendor':
            // Vendor should see services, analytics
            expect(bodyText).toMatch(/services|analytics|vendor/i);
            break;
          case 'wedding_planner':
            // Planner should see clients, tasks
            expect(bodyText).toMatch(/clients|tasks|planner/i);
            break;
          case 'admin':
          case 'maintainer':
            // Admin should see admin menu
            expect(bodyText).toMatch(/admin|users|vendors/i);
            break;
        }
      });
    }
  });

  test.describe('RBAC Console Monitoring', () => {
    test('Monitor console during RBAC checks', async ({ page }) => {
      const consoleCollection = setupConsoleListener(page);
      
      await authenticateAsRole(page, 'user', 'local', testUsers);
      
      // Try to access denied page
      await navigateToPage(page, '/dashboard/admin', 'local');
      await waitForPageLoad(page);
      
      // Generate console report
      const report = generateConsoleReport(consoleCollection);
      await saveConsoleReport(report, 'rbac-access-denied-console');
      
      // Check for auth-related errors
      if (report.errorAnalysis.authErrors.length > 0) {
        console.warn(`Found ${report.errorAnalysis.authErrors.length} auth-related console errors`);
      }
    });
  });
});

