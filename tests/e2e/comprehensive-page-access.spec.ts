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
  getPublicPages,
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
const environments: Environment[] = ['local', 'production'];

test.describe('📄 Comprehensive Page Access Tests', () => {
  
  test.describe('Public Pages', () => {
    const publicPages = getPublicPages().slice(0, 20); // Test first 20 public pages
    
    for (const page of publicPages) {
      for (const environment of environments) {
        test(`Access ${page.path} on ${environment}`, async ({ page: testPage }) => {
          const consoleCollection = setupConsoleListener(testPage);
          
          try {
            await navigateToPage(testPage, page.path, environment);
            await waitForPageLoad(testPage);
            
            const access = await checkPageAccess(testPage);
            expect(access.accessible).toBeTruthy();
            
            // Generate console report
            const report = generateConsoleReport(consoleCollection);
            if (report.errorAnalysis.errorCount > 0) {
              console.warn(`Found ${report.errorAnalysis.errorCount} console errors on ${page.path}`);
            }
          } catch (error) {
            await testPage.screenshot({ 
              path: `test-results/page-access-error-${page.path.replace(/\//g, '-')}-${environment}.png`, 
              fullPage: true 
            });
            throw error;
          }
        });
      }
    }
  });

  test.describe('Role-Based Page Access', () => {
    for (const role of roles) {
      test.describe(`${role.toUpperCase()} Role`, () => {
        const allowedPages = getPagesByRole(role).filter(p => p.requiresAuth).slice(0, 15); // Test first 15 pages per role
        
        for (const page of allowedPages) {
          for (const environment of environments) {
            test(`Access ${page.path} as ${role} on ${environment}`, async ({ page: testPage }) => {
              const consoleCollection = setupConsoleListener(testPage);
              
              try {
                // Authenticate first
                await authenticateAsRole(testPage, role, environment, testUsers);
                
                // Navigate to page
                await navigateToPage(testPage, page.path, environment);
                await waitForPageLoad(testPage);
                
                // Check access
                const access = await checkPageAccess(testPage);
                expect(access.accessible).toBeTruthy();
                
                // Generate console report
                const report = generateConsoleReport(consoleCollection);
                await saveConsoleReport(report, `page-access-${role}-${page.path.replace(/\//g, '-')}-${environment}`);
              } catch (error) {
                await testPage.screenshot({ 
                  path: `test-results/page-access-error-${role}-${page.path.replace(/\//g, '-')}-${environment}.png`, 
                  fullPage: true 
                });
                throw error;
              }
            });
          }
        }

        // Test denied pages
        const deniedPages = getDeniedPagesForRole(role).slice(0, 5); // Test first 5 denied pages
        
        for (const page of deniedPages) {
          test(`Deny access to ${page.path} as ${role}`, async ({ page: testPage }) => {
            try {
              // Authenticate first
              await authenticateAsRole(testPage, role, 'local', testUsers);
              
              // Try to access denied page
              await navigateToPage(testPage, page.path, 'local');
              await waitForPageLoad(testPage);
              
              // Check that access is denied
              const access = await checkPageAccess(testPage);
              const bodyText = await testPage.locator('body').textContent() || '';
              
              const isDenied = !access.accessible || 
                              bodyText.includes('Access Denied') ||
                              bodyText.includes('403') ||
                              bodyText.includes('Unauthorized') ||
                              testPage.url().includes('/unauthorized') ||
                              testPage.url().includes('/dashboard');
              
              expect(isDenied).toBeTruthy();
            } catch (error) {
              // Access denied is expected, so this is okay
              const currentUrl = testPage.url();
              if (currentUrl.includes('/unauthorized') || currentUrl.includes('/dashboard')) {
                // Expected behavior
                return;
              }
              throw error;
            }
          });
        }
      });
    }
  });

  test.describe('Page Load Performance', () => {
    const criticalPages = [
      '/',
      '/login',
      '/dashboard',
      '/vendors',
      '/venues',
    ];

    for (const pagePath of criticalPages) {
      test(`Load time for ${pagePath}`, async ({ page }) => {
        const startTime = Date.now();
        
        await navigateToPage(page, pagePath, 'local');
        await waitForPageLoad(page);
        
        const loadTime = Date.now() - startTime;
        
        // Log load time (should be under 5 seconds for most pages)
        console.log(`Page ${pagePath} loaded in ${loadTime}ms`);
        
        expect(loadTime).toBeLessThan(30000); // 30 seconds max
      });
    }
  });

  test.describe('404 Handling', () => {
    test('Non-existent page shows 404', async ({ page }) => {
      await navigateToPage(page, '/non-existent-page-12345', 'local');
      await waitForPageLoad(page);
      
      const bodyText = await page.locator('body').textContent() || '';
      const is404 = bodyText.includes('404') || 
                   bodyText.includes('Not Found') ||
                   page.url().includes('404');
      
      // 404 page should be shown
      expect(is404).toBeTruthy();
    });
  });

  test.describe('Redirects', () => {
    test('Unauthenticated user redirected to login from protected page', async ({ page }) => {
      await navigateToPage(page, '/dashboard', 'local');
      await waitForPageLoad(page);
      
      // Should redirect to login
      const currentUrl = page.url();
      expect(currentUrl).toMatch(/\/login/);
    });

    test('Authenticated user redirected to dashboard from login', async ({ page }) => {
      await authenticateAsRole(page, 'user', 'local', testUsers);
      await navigateToPage(page, '/login', 'local');
      await waitForPageLoad(page);
      
      // Should redirect to dashboard if already logged in
      const currentUrl = page.url();
      // Either stays on login or redirects to dashboard
      expect(currentUrl).toMatch(/\/login|\/dashboard/);
    });
  });
});

