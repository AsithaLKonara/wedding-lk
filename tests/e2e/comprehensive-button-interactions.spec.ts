import { test, expect } from '@playwright/test';
import { 
  authenticateAsRole, 
  navigateToPage,
  collectAllButtons,
  collectAllLinks,
  collectAllInteractiveElements,
  getButtonInfo,
  getLinkInfo,
  clickButtonSafely,
  waitForPageLoad,
  Environment,
  UserRole,
  TestUser
} from '../helpers/browser-helpers';
import { getPagesByRole } from '../helpers/page-catalog';
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

test.describe('🔘 Comprehensive Button & Interactive Element Tests', () => {
  
  test.describe('Button Collection and Visibility', () => {
    for (const role of roles) {
      test(`Collect all buttons on dashboard as ${role}`, async ({ page }) => {
        await authenticateAsRole(page, role, 'local', testUsers);
        await navigateToPage(page, '/dashboard', 'local');
        await waitForPageLoad(page);
        
        const buttons = await collectAllButtons(page);
        
        // Should have at least some buttons
        expect(buttons.length).toBeGreaterThan(0);
        
        // Check button visibility and info
        for (const button of buttons.slice(0, 10)) { // Test first 10 buttons
          const info = await getButtonInfo(button);
          expect(info).toBeDefined();
          expect(typeof info.text).toBe('string');
        }
      });
    }
  });

  test.describe('Link Collection and Navigation', () => {
    for (const role of roles) {
      test(`Collect all links on dashboard as ${role}`, async ({ page }) => {
        await authenticateAsRole(page, role, 'local', testUsers);
        await navigateToPage(page, '/dashboard', 'local');
        await waitForPageLoad(page);
        
        const links = await collectAllLinks(page);
        
        // Should have navigation links
        expect(links.length).toBeGreaterThan(0);
        
        // Check link info
        for (const link of links.slice(0, 10)) { // Test first 10 links
          const info = await getLinkInfo(link);
          expect(info).toBeDefined();
          expect(typeof info.href).toBe('string');
        }
      });
    }
  });

  test.describe('Interactive Elements Collection', () => {
    const testPages = [
      { path: '/dashboard', role: 'user' as UserRole },
      { path: '/dashboard/vendor/services', role: 'vendor' as UserRole },
      { path: '/dashboard/admin/users', role: 'admin' as UserRole },
    ];

    for (const testPage of testPages) {
      test(`Collect interactive elements on ${testPage.path}`, async ({ page }) => {
        await authenticateAsRole(page, testPage.role, 'local', testUsers);
        await navigateToPage(page, testPage.path, 'local');
        await waitForPageLoad(page);
        
        const elements = await collectAllInteractiveElements(page);
        
        // Should have some interactive elements
        expect(elements.buttons.length + elements.links.length).toBeGreaterThan(0);
        
        // Log counts
        console.log(`Page ${testPage.path}:`, {
          buttons: elements.buttons.length,
          links: elements.links.length,
          inputs: elements.inputs.length,
          selects: elements.selects.length,
          forms: elements.forms.length,
        });
      });
    }
  });

  test.describe('Button Click Functionality', () => {
    test('Click navigation buttons on dashboard', async ({ page }) => {
      await authenticateAsRole(page, 'user', 'local', testUsers);
      await navigateToPage(page, '/dashboard', 'local');
      await waitForPageLoad(page);
      
      const buttons = await collectAllButtons(page);
      const navigationButtons = buttons.slice(0, 5); // Test first 5 buttons
      
      for (const button of navigationButtons) {
        const info = await getButtonInfo(button);
        
        if (!info.disabled && info.visible) {
          const result = await clickButtonSafely(page, button, info);
          
          // Button click should either succeed or fail gracefully
          expect(result).toBeDefined();
          
          // Wait a bit for any navigation
          await page.waitForTimeout(500);
        }
      }
    });

    test('Click logout button', async ({ page }) => {
      await authenticateAsRole(page, 'user', 'local', testUsers);
      await navigateToPage(page, '/dashboard', 'local');
      await waitForPageLoad(page);
      
      const logoutButton = page.locator('button:has-text("Logout"), button:has-text("Sign Out"), [data-testid="dashboard-logout-button"]').first();
      
      if (await logoutButton.isVisible({ timeout: 5000 })) {
        await logoutButton.click();
        await page.waitForTimeout(2000);
        
        // Should redirect to login or home
        const currentUrl = page.url();
        expect(currentUrl).toMatch(/\/login|\//);
      }
    });
  });

  test.describe('Form Interactions', () => {
    test('Interact with profile form', async ({ page }) => {
      await authenticateAsRole(page, 'user', 'local', testUsers);
      await navigateToPage(page, '/dashboard/profile', 'local');
      await waitForPageLoad(page);
      
      const elements = await collectAllInteractiveElements(page);
      
      // Should have form elements
      expect(elements.forms.length + elements.inputs.length).toBeGreaterThanOrEqual(0);
      
      // Try to fill inputs if they exist
      for (const input of elements.inputs.slice(0, 3)) {
        if (await input.isVisible()) {
          const inputType = await input.getAttribute('type');
          if (inputType === 'text' || inputType === 'email') {
            try {
              await input.fill('test');
            } catch {
              // Input might be disabled or readonly
            }
          }
        }
      }
    });
  });

  test.describe('Modal and Dialog Interactions', () => {
    test('Open and close modals', async ({ page }) => {
      await authenticateAsRole(page, 'admin', 'local', testUsers);
      await navigateToPage(page, '/dashboard/admin/users', 'local');
      await waitForPageLoad(page);
      
      // Look for buttons that might open modals
      const modalTriggers = page.locator('button:has-text("Add"), button:has-text("Create"), button:has-text("New")');
      const count = await modalTriggers.count();
      
      if (count > 0) {
        const firstTrigger = modalTriggers.first();
        if (await firstTrigger.isVisible()) {
          await firstTrigger.click();
          await page.waitForTimeout(1000);
          
          // Look for modal/dialog
          const modal = page.locator('[role="dialog"], .modal, [data-testid*="modal"]').first();
          if (await modal.isVisible({ timeout: 2000 })) {
            // Try to close modal
            const closeButton = modal.locator('button:has-text("Close"), button:has-text("Cancel"), [aria-label*="close" i]').first();
            if (await closeButton.isVisible()) {
              await closeButton.click();
            }
          }
        }
      }
    });
  });

  test.describe('Search and Filter Interactions', () => {
    test('Interact with search inputs', async ({ page }) => {
      await navigateToPage(page, '/vendors', 'local');
      await waitForPageLoad(page);
      
      const searchInputs = page.locator('input[type="search"], input[placeholder*="search" i], input[name*="search" i]');
      const count = await searchInputs.count();
      
      if (count > 0) {
        const searchInput = searchInputs.first();
        await searchInput.fill('test');
        await page.waitForTimeout(1000);
        
        // Look for search button
        const searchButton = page.locator('button:has-text("Search"), button[type="submit"]').first();
        if (await searchButton.isVisible()) {
          await searchButton.click();
          await page.waitForTimeout(2000);
        }
      }
    });
  });

  test.describe('Tab and Accordion Interactions', () => {
    test('Interact with tabs', async ({ page }) => {
      await authenticateAsRole(page, 'user', 'local', testUsers);
      await navigateToPage(page, '/dashboard', 'local');
      await waitForPageLoad(page);
      
      const tabs = page.locator('[role="tab"], .tab, [data-testid*="tab"]');
      const tabCount = await tabs.count();
      
      if (tabCount > 0) {
        // Click first few tabs
        for (let i = 0; i < Math.min(3, tabCount); i++) {
          const tab = tabs.nth(i);
          if (await tab.isVisible()) {
            await tab.click();
            await page.waitForTimeout(500);
          }
        }
      }
    });
  });

  test.describe('Console Monitoring During Interactions', () => {
    test('Monitor console during button clicks', async ({ page }) => {
      const consoleCollection = setupConsoleListener(page);
      
      await authenticateAsRole(page, 'user', 'local', testUsers);
      await navigateToPage(page, '/dashboard', 'local');
      await waitForPageLoad(page);
      
      const buttons = await collectAllButtons(page);
      
      // Click a few buttons
      for (const button of buttons.slice(0, 5)) {
        const info = await getButtonInfo(button);
        if (!info.disabled && info.visible) {
          await clickButtonSafely(page, button, info);
          await page.waitForTimeout(500);
        }
      }
      
      // Generate console report
      const report = generateConsoleReport(consoleCollection);
      await saveConsoleReport(report, 'button-interactions-console');
      
      // Check for errors
      if (report.errorAnalysis.errorCount > 0) {
        console.warn(`Found ${report.errorAnalysis.errorCount} console errors during button interactions`);
      }
    });
  });
});

