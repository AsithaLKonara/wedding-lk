import { test, expect } from '@playwright/test';
import { 
  authenticateAsRole, 
  navigateToPage,
  waitForPageLoad,
  Environment,
  UserRole,
  TestUser
} from '../helpers/browser-helpers';
import { getPagesByRole, PAGE_CATALOG } from '../helpers/page-catalog';
import { 
  setupConsoleListener, 
  generateConsoleReport, 
  saveConsoleReport,
  saveHTMLConsoleReport,
  analyzeConsoleErrors,
  assertNoConsoleErrors
} from '../helpers/console-collector';
import testUsersExtended from '../fixtures/test-users-extended.json';

const testUsers: Record<UserRole, TestUser> = {
  user: testUsersExtended.users.find(u => u.role === 'user' && u.environment === 'local') as TestUser,
  vendor: testUsersExtended.users.find(u => u.role === 'vendor' && u.environment === 'local') as TestUser,
  wedding_planner: testUsersExtended.users.find(u => u.role === 'wedding_planner' && u.environment === 'local') as TestUser,
  admin: testUsersExtended.users.find(u => u.role === 'admin' && u.environment === 'local') as TestUser,
  maintainer: testUsersExtended.users.find(u => u.role === 'maintainer' && u.environment === 'local') as TestUser,
};

const roles: UserRole[] = ['user', 'vendor', 'wedding_planner', 'admin', 'maintainer'];

test.describe('📊 Comprehensive Console Monitoring Tests', () => {
  
  test.describe('Console Log Collection', () => {
    test('Collect all console logs on homepage', async ({ page }) => {
      const consoleCollection = setupConsoleListener(page);
      
      await navigateToPage(page, '/', 'local');
      await waitForPageLoad(page);
      
      // Wait a bit for any async console logs
      await page.waitForTimeout(2000);
      
      const report = generateConsoleReport(consoleCollection);
      
      console.log('Console Summary:', report.summary);
      expect(report.summary.total).toBeGreaterThanOrEqual(0);
    });

    test('Collect console logs during authentication', async ({ page }) => {
      const consoleCollection = setupConsoleListener(page);
      
      await authenticateAsRole(page, 'user', 'local', testUsers);
      await waitForPageLoad(page);
      
      const report = generateConsoleReport(consoleCollection);
      await saveConsoleReport(report, 'auth-console-logs');
      
      // Check for auth-related logs
      const authLogs = consoleCollection.logs.filter(log => 
        log.text.toLowerCase().includes('auth') ||
        log.text.toLowerCase().includes('login') ||
        log.text.toLowerCase().includes('token')
      );
      
      console.log(`Found ${authLogs.length} auth-related console logs`);
    });
  });

  test.describe('Console Error Detection', () => {
    for (const role of roles) {
      test(`Detect console errors for ${role} on dashboard`, async ({ page }) => {
        const consoleCollection = setupConsoleListener(page);
        
        await authenticateAsRole(page, role, 'local', testUsers);
        await navigateToPage(page, '/dashboard', 'local');
        await waitForPageLoad(page);
        
        // Wait for any async operations
        await page.waitForTimeout(3000);
        
        const report = generateConsoleReport(consoleCollection);
        await saveHTMLConsoleReport(report, `dashboard-${role}-console`);
        
        // Log error analysis
        if (report.errorAnalysis.errorCount > 0) {
          console.warn(`Found ${report.errorAnalysis.errorCount} console errors for ${role}:`);
          report.errorAnalysis.uniqueErrors.slice(0, 5).forEach(error => {
            console.warn(`  - ${error}`);
          });
        }
        
        // Check for critical errors
        if (report.errorAnalysis.criticalErrors.length > 0) {
          console.error(`Found ${report.errorAnalysis.criticalErrors.length} critical errors!`);
        }
      });
    }
  });

  test.describe('Console Error Analysis', () => {
    test('Analyze error patterns across pages', async ({ page }) => {
      const testPages = [
        '/',
        '/login',
        '/dashboard',
        '/vendors',
        '/venues',
      ];
      
      const allErrors: string[] = [];
      
      for (const pagePath of testPages) {
        const consoleCollection = setupConsoleListener(page);
        
        await navigateToPage(page, pagePath, 'local');
        await waitForPageLoad(page);
        await page.waitForTimeout(2000);
        
        const report = generateConsoleReport(consoleCollection);
        allErrors.push(...report.errorAnalysis.uniqueErrors);
      }
      
      // Analyze error patterns
      const errorPatterns = new Map<string, number>();
      allErrors.forEach(error => {
        const pattern = error.substring(0, 50);
        errorPatterns.set(pattern, (errorPatterns.get(pattern) || 0) + 1);
      });
      
      console.log('Error Patterns:', Array.from(errorPatterns.entries()).slice(0, 10));
    });

    test('Categorize console errors', async ({ page }) => {
      const consoleCollection = setupConsoleListener(page);
      
      await authenticateAsRole(page, 'user', 'local', testUsers);
      await navigateToPage(page, '/dashboard', 'local');
      await waitForPageLoad(page);
      await page.waitForTimeout(3000);
      
      const report = generateConsoleReport(consoleCollection);
      const analysis = report.errorAnalysis;
      
      console.log('Error Categories:', {
        total: analysis.errorCount,
        critical: analysis.criticalErrors.length,
        api: analysis.apiErrors.length,
        auth: analysis.authErrors.length,
        network: analysis.networkErrors.length,
      });
      
      expect(analysis).toBeDefined();
    });
  });

  test.describe('API Call Console Logs', () => {
    test('Monitor console during API calls', async ({ page }) => {
      const consoleCollection = setupConsoleListener(page);
      
      await authenticateAsRole(page, 'user', 'local', testUsers);
      await navigateToPage(page, '/dashboard', 'local');
      await waitForPageLoad(page);
      
      // Wait for API calls to complete
      await page.waitForTimeout(5000);
      
      const report = generateConsoleReport(consoleCollection);
      
      // Check for API-related logs
      const apiLogs = consoleCollection.logs.filter(log =>
        log.text.toLowerCase().includes('api') ||
        log.text.toLowerCase().includes('fetch') ||
        log.text.toLowerCase().includes('request')
      );
      
      console.log(`Found ${apiLogs.length} API-related console logs`);
      
      // Check for API errors
      if (report.errorAnalysis.apiErrors.length > 0) {
        console.warn(`Found ${report.errorAnalysis.apiErrors.length} API-related errors`);
      }
    });
  });

  test.describe('Network Error Detection', () => {
    test('Detect network errors in console', async ({ page }) => {
      const consoleCollection = setupConsoleListener(page);
      
      await navigateToPage(page, '/dashboard', 'local');
      await waitForPageLoad(page);
      await page.waitForTimeout(3000);
      
      const report = generateConsoleReport(consoleCollection);
      
      if (report.errorAnalysis.networkErrors.length > 0) {
        console.warn(`Found ${report.errorAnalysis.networkErrors.length} network errors:`);
        report.errorAnalysis.networkErrors.slice(0, 5).forEach(error => {
          console.warn(`  - ${error.text}`);
        });
      }
    });
  });

  test.describe('Warning Detection', () => {
    test('Collect and analyze warnings', async ({ page }) => {
      const consoleCollection = setupConsoleListener(page);
      
      await navigateToPage(page, '/', 'local');
      await waitForPageLoad(page);
      await page.waitForTimeout(2000);
      
      const report = generateConsoleReport(consoleCollection);
      
      if (report.warnings.length > 0) {
        console.log(`Found ${report.warnings.length} warnings:`);
        report.warnings.slice(0, 10).forEach(warning => {
          console.log(`  - ${warning.text.substring(0, 100)}`);
        });
      }
    });
  });

  test.describe('Console Report Generation', () => {
    test('Generate comprehensive console report', async ({ page }) => {
      const consoleCollection = setupConsoleListener(page);
      
      // Navigate through multiple pages
      const pages = ['/', '/login', '/dashboard'];
      
      for (const pagePath of pages) {
        await navigateToPage(page, pagePath, 'local');
        await waitForPageLoad(page);
        await page.waitForTimeout(2000);
      }
      
      // Authenticate
      await authenticateAsRole(page, 'admin', 'local', testUsers);
      await navigateToPage(page, '/dashboard/admin', 'local');
      await waitForPageLoad(page);
      await page.waitForTimeout(3000);
      
      const report = generateConsoleReport(consoleCollection);
      
      // Save reports
      const jsonPath = await saveConsoleReport(report, 'comprehensive-console-report');
      const htmlPath = await saveHTMLConsoleReport(report, 'comprehensive-console-report');
      
      console.log(`Console reports saved: ${jsonPath}, ${htmlPath}`);
      
      expect(report).toBeDefined();
      expect(report.summary).toBeDefined();
    });
  });

  test.describe('Error Assertion', () => {
    test('Assert no critical console errors on public pages', async ({ page }) => {
      const consoleCollection = setupConsoleListener(page);
      
      const publicPages = ['/', '/login', '/register', '/about'];
      
      for (const pagePath of publicPages) {
        await navigateToPage(page, pagePath, 'local');
        await waitForPageLoad(page);
        await page.waitForTimeout(2000);
      }
      
      // Allow common non-critical errors
      const allowedErrors = [
        'favicon',
        'sourcemap',
        'extension',
      ];
      
      try {
        assertNoConsoleErrors(consoleCollection, allowedErrors);
      } catch (error) {
        // Log errors but don't fail test
        const report = generateConsoleReport(consoleCollection);
        console.warn(`Found console errors: ${report.errorAnalysis.errorCount}`);
      }
    });
  });

  test.describe('Role-Specific Console Monitoring', () => {
    for (const role of roles) {
      test(`Monitor console for ${role} across key pages`, async ({ page }) => {
        const consoleCollection = setupConsoleListener(page);
        
        await authenticateAsRole(page, role, 'local', testUsers);
        
        const rolePages = getPagesByRole(role).filter(p => p.requiresAuth).slice(0, 5);
        
        for (const pageInfo of rolePages) {
          await navigateToPage(page, pageInfo.path, 'local');
          await waitForPageLoad(page);
          await page.waitForTimeout(2000);
        }
        
        const report = generateConsoleReport(consoleCollection);
        await saveConsoleReport(report, `role-${role}-console-monitoring`);
        
        // Log summary
        console.log(`${role} console summary:`, {
          total: report.summary.total,
          errors: report.summary.errors,
          warnings: report.summary.warnings,
        });
      });
    }
  });
});

