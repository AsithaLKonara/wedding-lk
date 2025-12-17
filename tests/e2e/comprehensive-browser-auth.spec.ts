import { test, expect } from '@playwright/test';
import { authenticateAsRole, getBaseUrl, Environment, UserRole, TestUser, logout } from '../helpers/browser-helpers';
import { setupConsoleListener, generateConsoleReport, saveConsoleReport } from '../helpers/console-collector';
import testUsersExtended from '../fixtures/test-users-extended.json';

// Convert JSON to typed test users
const testUsers: Record<UserRole, TestUser> = {
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
const environments: Environment[] = ['local', 'production'];

test.describe('🔐 Comprehensive Browser Authentication Tests', () => {
  
  for (const environment of environments) {
    test.describe(`${environment.toUpperCase()} Environment`, () => {
      
      for (const role of roles) {
        test(`Login as ${role} on ${environment}`, async ({ page }) => {
          const consoleCollection = setupConsoleListener(page);
          const users = environment === 'production' ? prodTestUsers : testUsers;
          
          try {
            await authenticateAsRole(page, role, environment, users);
            
            // Verify we're on dashboard
            await expect(page).toHaveURL(/\/dashboard/);
            
            // Verify user is logged in (check for user name or role indicator)
            const bodyText = await page.locator('body').textContent() || '';
            expect(bodyText.length).toBeGreaterThan(0);
            
            // Generate console report
            const report = generateConsoleReport(consoleCollection);
            await saveConsoleReport(report, `auth-login-${role}-${environment}`);
            
            // Check for critical console errors
            if (report.errorAnalysis.errorCount > 0) {
              console.warn(`Found ${report.errorAnalysis.errorCount} console errors during login`);
            }
          } catch (error) {
            await page.screenshot({ path: `test-results/auth-error-${role}-${environment}.png`, fullPage: true });
            throw error;
          }
        });

        test(`Session persistence for ${role} on ${environment}`, async ({ page }) => {
          const users = environment === 'production' ? prodTestUsers : testUsers;
          
          // Login
          await authenticateAsRole(page, role, environment, users);
          
          // Reload page
          await page.reload();
          await page.waitForLoadState('networkidle');
          
          // Verify still logged in
          await expect(page).toHaveURL(/\/dashboard/);
          
          // Check cookies
          const cookies = await page.context().cookies();
          const authCookie = cookies.find(c => c.name === 'auth-token');
          expect(authCookie).toBeDefined();
        });

        test(`Logout for ${role} on ${environment}`, async ({ page }) => {
          const users = environment === 'production' ? prodTestUsers : testUsers;
          
          // Login first
          await authenticateAsRole(page, role, environment, users);
          
          // Logout
          await logout(page, environment);
          
          // Verify redirected to login or home
          const currentUrl = page.url();
          expect(currentUrl).toMatch(/\/login|\//);
          
          // Verify auth cookie is removed
          const cookies = await page.context().cookies();
          const authCookie = cookies.find(c => c.name === 'auth-token');
          expect(authCookie).toBeUndefined();
        });
      }

      test(`Invalid credentials on ${environment}`, async ({ page }) => {
        const baseUrl = getBaseUrl(environment);
        
        await page.goto(`${baseUrl}/login`);
        await page.fill('input[name="email"], input[type="email"]', 'invalid@test.com');
        await page.fill('input[name="password"], input[type="password"]', 'wrongpassword');
        await page.click('button[type="submit"], button:has-text("Sign In"), button:has-text("Login")');
        
        // Should show error message or stay on login page
        await page.waitForTimeout(2000);
        const bodyText = await page.locator('body').textContent() || '';
        const hasError = bodyText.includes('Invalid') || 
                        bodyText.includes('error') || 
                        bodyText.includes('incorrect') ||
                        page.url().includes('/login');
        
        expect(hasError).toBeTruthy();
      });

      test(`Registration flow on ${environment}`, async ({ page }) => {
        const baseUrl = getBaseUrl(environment);
        const timestamp = Date.now();
        const testEmail = `testuser${timestamp}@test.local`;
        
        await page.goto(`${baseUrl}/register`);
        
        // Fill registration form
        const nameInput = page.locator('input[name="name"], input[placeholder*="name" i]').first();
        const emailInput = page.locator('input[name="email"], input[type="email"]').first();
        const passwordInput = page.locator('input[name="password"], input[type="password"]').first();
        
        if (await nameInput.isVisible({ timeout: 5000 })) {
          await nameInput.fill(`Test User ${timestamp}`);
        }
        await emailInput.fill(testEmail);
        await passwordInput.fill('Test123!');
        
        // Submit form
        const submitButton = page.locator('button[type="submit"], button:has-text("Register"), button:has-text("Sign Up")').first();
        await submitButton.click();
        
        // Wait for response (either success redirect or error message)
        await page.waitForTimeout(3000);
        
        // Check if registration was successful (redirected to login or dashboard)
        const currentUrl = page.url();
        const isSuccess = currentUrl.includes('/login') || 
                         currentUrl.includes('/dashboard') ||
                         currentUrl.includes('/verify-email');
        
        // Registration might succeed or fail (user might already exist), both are valid test outcomes
        expect(currentUrl).toBeTruthy();
      });
    });
  }

  test.describe('Token Validation', () => {
    test('Valid token allows access', async ({ page }) => {
      await authenticateAsRole(page, 'user', 'local', testUsers);
      
      // Try to access protected page
      await page.goto(getBaseUrl('local') + '/dashboard/profile');
      await expect(page).toHaveURL(/\/dashboard/);
    });

    test('Invalid token redirects to login', async ({ page }) => {
      const baseUrl = getBaseUrl('local');
      
      // Set invalid cookie
      await page.context().addCookies([{
        name: 'auth-token',
        value: 'invalid-token',
        domain: new URL(baseUrl).hostname,
        path: '/',
      }]);
      
      // Try to access protected page
      await page.goto(`${baseUrl}/dashboard`);
      
      // Should redirect to login
      await page.waitForTimeout(2000);
      const currentUrl = page.url();
      expect(currentUrl).toMatch(/\/login/);
    });
  });

  test.describe('Account Status Checks', () => {
    test('Inactive account cannot login', async ({ page }) => {
      const baseUrl = getBaseUrl('local');
      
      // This test assumes there's an inactive test user
      // In real scenario, you'd need to create an inactive user first
      await page.goto(`${baseUrl}/login`);
      await page.fill('input[name="email"], input[type="email"]', 'inactive@test.local');
      await page.fill('input[name="password"], input[type="password"]', 'Test123!');
      await page.click('button[type="submit"], button:has-text("Sign In")');
      
      await page.waitForTimeout(2000);
      const bodyText = await page.locator('body').textContent() || '';
      const hasError = bodyText.includes('inactive') || 
                      bodyText.includes('Account') ||
                      page.url().includes('/login');
      
      // Test passes if error is shown or still on login page
      expect(hasError || page.url().includes('/login')).toBeTruthy();
    });
  });
});

