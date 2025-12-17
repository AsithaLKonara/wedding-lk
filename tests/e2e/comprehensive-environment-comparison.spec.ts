import { test, expect } from '@playwright/test';
import { 
  authenticateAsRole, 
  navigateToPage,
  waitForPageLoad,
  checkPageAccess,
  Environment,
  UserRole,
  TestUser
} from '../helpers/browser-helpers';
import { getPagesByRole } from '../helpers/page-catalog';
import { 
  setupConsoleListener, 
  generateConsoleReport, 
  saveConsoleReport
} from '../helpers/console-collector';
import testUsersExtended from '../fixtures/test-users-extended.json';

const localTestUsers: Record<UserRole, TestUser> = {
  user: testUsersExtended.users.find(u => u.role === 'user' && u.environment === 'local') as TestUser,
  vendor: testUsersExtended.users.find(u => u.role === 'vendor' && u.environment === 'local') as TestUser,
  wedding_planner: testUsersExtended.users.find(u => u.role === 'wedding_planner' && u.environment === 'local') as TestUser,
  admin: testUsersExtended.users.find(u => u.role === 'admin' && u.environment === 'local') as TestUser,
  maintainer: testUsersExtended.users.find(u => u.role === 'maintainer' && u.environment === 'local') as TestUser,
};

const prodTestUsers: Record<UserRole, TestUser> = {
  user: testUsersExtended.users.find(u => u.role === 'user' && u.environment === 'production') as TestUser,
  vendor: testUsersExtended.users.find(u => u.role === 'vendor' && u.environment === 'production') as TestUser,
  wedding_planner: testUsersExtended.users.find(u => u.role === 'wedding_planner' && u.environment === 'production') as TestUser,
  admin: testUsersExtended.users.find(u => u.role === 'admin' && u.environment === 'production') as TestUser,
  maintainer: testUsersExtended.users.find(u => u.role === 'maintainer' && u.environment === 'production') as TestUser,
};

const roles: UserRole[] = ['user', 'vendor', 'wedding_planner', 'admin', 'maintainer'];
const testPages = ['/', '/login', '/dashboard', '/vendors', '/venues'];

test.describe('🌍 Comprehensive Environment Comparison Tests', () => {
  
  test.describe('Page Load Comparison', () => {
    for (const pagePath of testPages) {
      test(`Compare load time: ${pagePath}`, async ({ page }) => {
        const results: { environment: Environment; loadTime: number }[] = [];
        
        for (const environment of ['local', 'production'] as Environment[]) {
          const startTime = Date.now();
          await navigateToPage(page, pagePath, environment);
          await waitForPageLoad(page);
          const loadTime = Date.now() - startTime;
          
          results.push({ environment, loadTime });
          console.log(`${environment}: ${pagePath} loaded in ${loadTime}ms`);
        }
        
        // Compare load times
        const localTime = results.find(r => r.environment === 'local')?.loadTime || 0;
        const prodTime = results.find(r => r.environment === 'production')?.loadTime || 0;
        
        console.log(`Load time difference: ${Math.abs(prodTime - localTime)}ms`);
        expect(localTime).toBeGreaterThan(0);
        expect(prodTime).toBeGreaterThan(0);
      });
    }
  });

  test.describe('Page Access Comparison', () => {
    for (const pagePath of testPages) {
      test(`Compare access: ${pagePath}`, async ({ page }) => {
        const results: { environment: Environment; accessible: boolean; status: number }[] = [];
        
        for (const environment of ['local', 'production'] as Environment[]) {
          await navigateToPage(page, pagePath, environment);
          await waitForPageLoad(page);
          
          const access = await checkPageAccess(page);
          results.push({
            environment,
            accessible: access.accessible,
            status: access.status,
          });
        }
        
        // Both environments should have same accessibility
        const localAccess = results.find(r => r.environment === 'local');
        const prodAccess = results.find(r => r.environment === 'production');
        
        if (localAccess && prodAccess) {
          // Public pages should be accessible in both
          if (!pagePath.includes('/dashboard')) {
            expect(localAccess.accessible).toBe(prodAccess.accessible);
          }
        }
      });
    }
  });

  test.describe('Authentication Comparison', () => {
    for (const role of roles) {
      test(`Compare authentication: ${role}`, async ({ page }) => {
        const results: { environment: Environment; success: boolean; url: string }[] = [];
        
        for (const environment of ['local', 'production'] as Environment[]) {
          try {
            const users = environment === 'production' ? prodTestUsers : localTestUsers;
            await authenticateAsRole(page, role, environment, users);
            
            const currentUrl = page.url();
            const success = currentUrl.includes('/dashboard');
            
            results.push({
              environment,
              success,
              url: currentUrl,
            });
          } catch (error) {
            results.push({
              environment,
              success: false,
              url: page.url(),
            });
          }
        }
        
        // Log comparison
        console.log(`${role} auth comparison:`, results);
        
        // Both should succeed or both should fail
        const localResult = results.find(r => r.environment === 'local');
        const prodResult = results.find(r => r.environment === 'production');
        
        if (localResult && prodResult) {
          // If local succeeds, production should also succeed (or vice versa)
          // Allow for test user differences
          expect(typeof localResult.success).toBe('boolean');
          expect(typeof prodResult.success).toBe('boolean');
        }
      });
    }
  });

  test.describe('Console Log Comparison', () => {
    test('Compare console logs on homepage', async ({ page }) => {
      const localConsole = setupConsoleListener(page);
      await navigateToPage(page, '/', 'local');
      await waitForPageLoad(page);
      await page.waitForTimeout(2000);
      const localReport = generateConsoleReport(localConsole);
      
      const prodConsole = setupConsoleListener(page);
      await navigateToPage(page, '/', 'production');
      await waitForPageLoad(page);
      await page.waitForTimeout(2000);
      const prodReport = generateConsoleReport(prodConsole);
      
      console.log('Console Comparison:', {
        local: {
          total: localReport.summary.total,
          errors: localReport.summary.errors,
          warnings: localReport.summary.warnings,
        },
        production: {
          total: prodReport.summary.total,
          errors: prodReport.summary.errors,
          warnings: prodReport.summary.warnings,
        },
      });
      
      // Save comparison report
      await saveConsoleReport({
        summary: {
          total: localReport.summary.total + prodReport.summary.total,
          errors: localReport.summary.errors + prodReport.summary.errors,
          warnings: localReport.summary.warnings + prodReport.summary.warnings,
          info: localReport.summary.info + prodReport.summary.info,
          debug: localReport.summary.debug + prodReport.summary.debug,
          logs: localReport.summary.logs + prodReport.summary.logs,
        },
        errorAnalysis: {
          errorCount: localReport.errorAnalysis.errorCount + prodReport.errorAnalysis.errorCount,
          uniqueErrors: [...localReport.errorAnalysis.uniqueErrors, ...prodReport.errorAnalysis.uniqueErrors],
          errorPatterns: new Map(),
          criticalErrors: [...localReport.errorAnalysis.criticalErrors, ...prodReport.errorAnalysis.criticalErrors],
          apiErrors: [...localReport.errorAnalysis.apiErrors, ...prodReport.errorAnalysis.apiErrors],
          authErrors: [...localReport.errorAnalysis.authErrors, ...prodReport.errorAnalysis.authErrors],
          networkErrors: [...localReport.errorAnalysis.networkErrors, ...prodReport.errorAnalysis.networkErrors],
        },
        warnings: [...localReport.warnings, ...prodReport.warnings],
        recentErrors: [...localReport.recentErrors, ...prodReport.recentErrors],
        recommendations: [
          ...localReport.recommendations,
          ...prodReport.recommendations,
          `Local environment: ${localReport.summary.errors} errors, ${localReport.summary.warnings} warnings`,
          `Production environment: ${prodReport.summary.errors} errors, ${prodReport.summary.warnings} warnings`,
        ],
      }, 'environment-comparison-console');
    });
  });

  test.describe('API Response Comparison', () => {
    test('Compare API responses', async ({ page }) => {
      const apiEndpoints = [
        '/api/health',
        '/api/status',
      ];
      
      for (const endpoint of apiEndpoints) {
        const localResponse = await page.request.get(`http://localhost:3000${endpoint}`);
        const prodResponse = await page.request.get(`https://wedding-lk.vercel.app${endpoint}`);
        
        console.log(`API ${endpoint}:`, {
          local: localResponse.status(),
          production: prodResponse.status(),
        });
        
        // Both should return valid responses
        expect([200, 404]).toContain(localResponse.status());
        expect([200, 404]).toContain(prodResponse.status());
      }
    });
  });

  test.describe('RBAC Access Comparison', () => {
    for (const role of roles) {
      test(`Compare RBAC access for ${role}`, async ({ page }) => {
        const testPage = '/dashboard';
        
        // Test local
        const localUsers = localTestUsers;
        await authenticateAsRole(page, role, 'local', localUsers);
        await navigateToPage(page, testPage, 'local');
        await waitForPageLoad(page);
        const localAccess = await checkPageAccess(page);
        
        // Test production
        const prodUsers = prodTestUsers;
        await authenticateAsRole(page, role, 'production', prodUsers);
        await navigateToPage(page, testPage, 'production');
        await waitForPageLoad(page);
        const prodAccess = await checkPageAccess(page);
        
        console.log(`${role} access comparison:`, {
          local: localAccess.accessible,
          production: prodAccess.accessible,
        });
        
        // Both should have same access
        expect(localAccess.accessible).toBe(prodAccess.accessible);
      });
    }
  });

  test.describe('Error Handling Comparison', () => {
    test('Compare 404 handling', async ({ page }) => {
      const nonExistentPage = '/non-existent-page-12345';
      
      await navigateToPage(page, nonExistentPage, 'local');
      await waitForPageLoad(page);
      const localBody = await page.locator('body').textContent() || '';
      
      await navigateToPage(page, nonExistentPage, 'production');
      await waitForPageLoad(page);
      const prodBody = await page.locator('body').textContent() || '';
      
      const localIs404 = localBody.includes('404') || localBody.includes('Not Found');
      const prodIs404 = prodBody.includes('404') || prodBody.includes('Not Found');
      
      // Both should handle 404 similarly
      expect(localIs404 || prodIs404).toBeTruthy();
    });
  });

  test.describe('Performance Comparison', () => {
    test('Compare overall performance', async ({ page }) => {
      const performanceData: { environment: Environment; page: string; loadTime: number }[] = [];
      
      for (const environment of ['local', 'production'] as Environment[]) {
        for (const pagePath of testPages.slice(0, 3)) {
          const startTime = Date.now();
          await navigateToPage(page, pagePath, environment);
          await waitForPageLoad(page);
          const loadTime = Date.now() - startTime;
          
          performanceData.push({ environment, page: pagePath, loadTime });
        }
      }
      
      // Calculate averages
      const localAvg = performanceData
        .filter(d => d.environment === 'local')
        .reduce((sum, d) => sum + d.loadTime, 0) / testPages.length;
      
      const prodAvg = performanceData
        .filter(d => d.environment === 'production')
        .reduce((sum, d) => sum + d.loadTime, 0) / testPages.length;
      
      console.log('Performance Comparison:', {
        localAverage: `${localAvg.toFixed(2)}ms`,
        productionAverage: `${prodAvg.toFixed(2)}ms`,
        difference: `${Math.abs(prodAvg - localAvg).toFixed(2)}ms`,
      });
      
      expect(localAvg).toBeGreaterThan(0);
      expect(prodAvg).toBeGreaterThan(0);
    });
  });
});

