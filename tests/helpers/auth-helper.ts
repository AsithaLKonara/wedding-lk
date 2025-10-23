import { Page } from '@playwright/test';

export interface TestUser {
  email: string;
  password: string;
  role: string;
  name: string;
}

export const TEST_USERS: Record<string, TestUser> = {
  user: {
    email: 'user@test.local',
    password: 'UserPass123!',
    role: 'user',
    name: 'Test User'
  },
  vendor: {
    email: 'vendor@test.local',
    password: 'VendorPass123!',
    role: 'vendor',
    name: 'Test Vendor'
  },
  planner: {
    email: 'planner@test.local',
    password: 'PlannerPass123!',
    role: 'wedding_planner',
    name: 'Test Planner'
  },
  admin: {
    email: 'admin@test.local',
    password: 'AdminPass123!',
    role: 'admin',
    name: 'Test Admin'
  }
};

/**
 * Login as a specific user type
 */
export async function loginAsUser(page: Page, userType: keyof typeof TEST_USERS): Promise<void> {
  const user = TEST_USERS[userType];
  await page.goto('/login');
  await page.fill('input[name="email"]', user.email);
  await page.fill('input[name="password"]', user.password);
  await page.click('button[type="submit"]');
  await page.waitForURL(/\/dashboard/);
}

/**
 * Login with custom credentials
 */
export async function loginWithCredentials(page: Page, email: string, password: string): Promise<void> {
  await page.goto('/login');
  await page.fill('input[name="email"]', email);
  await page.fill('input[name="password"]', password);
  await page.click('button[type="submit"]');
  await page.waitForURL(/\/dashboard/);
}

/**
 * Logout from the application
 */
export async function logout(page: Page): Promise<void> {
  // Try different logout button selectors
  const logoutSelectors = [
    'button[aria-label="Logout"]',
    '[data-testid="logout-button"]',
    'button:has-text("Logout")',
    'button:has-text("Sign Out")',
    'a[href*="logout"]'
  ];

  for (const selector of logoutSelectors) {
    try {
      if (await page.locator(selector).isVisible()) {
        await page.click(selector);
        await page.waitForURL(/\/login|\/auth\/signin/);
        return;
      }
    } catch (error) {
      // Continue to next selector
    }
  }

  // Fallback: navigate to logout URL
  await page.goto('/api/auth/logout');
  await page.waitForURL(/\/login|\/auth\/signin/);
}

/**
 * Check if user is logged in
 */
export async function isLoggedIn(page: Page): Promise<boolean> {
  try {
    // Check for dashboard URL
    const currentUrl = page.url();
    if (currentUrl.includes('/dashboard')) {
      return true;
    }

    // Check for user-specific elements
    const userElements = [
      '[data-testid="user-menu"]',
      '.user-avatar',
      'button[aria-label="Logout"]',
      'text=Welcome'
    ];

    for (const selector of userElements) {
      if (await page.locator(selector).isVisible()) {
        return true;
      }
    }

    return false;
  } catch (error) {
    return false;
  }
}

/**
 * Get current user role from the page
 */
export async function getCurrentUserRole(page: Page): Promise<string | null> {
  try {
    // Try to find role in various places
    const roleSelectors = [
      '[data-testid="user-role"]',
      '.user-role',
      'text=Role:',
      'text=Admin',
      'text=Vendor',
      'text=User'
    ];

    for (const selector of roleSelectors) {
      const element = page.locator(selector);
      if (await element.isVisible()) {
        const text = await element.textContent();
        if (text) {
          if (text.includes('Admin')) return 'admin';
          if (text.includes('Vendor')) return 'vendor';
          if (text.includes('Planner')) return 'wedding_planner';
          if (text.includes('User')) return 'user';
        }
      }
    }

    // Check URL for role indicators
    const currentUrl = page.url();
    if (currentUrl.includes('/admin')) return 'admin';
    if (currentUrl.includes('/vendor')) return 'vendor';
    if (currentUrl.includes('/planner')) return 'wedding_planner';

    return null;
  } catch (error) {
    return null;
  }
}

/**
 * Seed test data before running tests
 */
export async function seedTestData(page: Page): Promise<void> {
  try {
    const response = await page.request.post('/api/test/seed-test-data');
    if (!response.ok()) {
      console.warn('Failed to seed test data:', await response.text());
    }
  } catch (error) {
    console.warn('Error seeding test data:', error);
  }
}

/**
 * Create a test user
 */
export async function createTestUser(page: Page, userData: Partial<TestUser>): Promise<TestUser> {
  const response = await page.request.post('/api/test/create-test-user', {
    data: userData
  });
  
  if (!response.ok()) {
    throw new Error(`Failed to create test user: ${await response.text()}`);
  }
  
  const result = await response.json();
  return result.user;
}

/**
 * Wait for authentication to complete
 */
export async function waitForAuth(page: Page, timeout: number = 10000): Promise<void> {
  try {
    await page.waitForFunction(() => {
      return document.querySelector('input[name="email"]') === null || 
             document.querySelector('[data-testid="user-menu"]') !== null;
    }, { timeout });
  } catch (error) {
    // Auth might not be required, continue
  }
}
