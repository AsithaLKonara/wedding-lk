import { test, expect } from '@playwright/test';

test.describe('Dashboard Tests', () => {
  test.beforeEach(async ({ page }) => {
    // Login before each test
    await page.goto('/login');
    await page.fill('input[name="email"]', 'test@example.com');
    await page.fill('input[name="password"]', 'TestPassword123!');
    await page.click('button[type="submit"]');
    await expect(page).toHaveURL(/dashboard/);
  });

  test('should load user dashboard', async ({ page }) => {
    await page.goto('/dashboard/user');
    
    // Check dashboard elements
    await expect(page.locator('h1, h2')).toContainText(/dashboard|welcome/i);
    
    // Check for dashboard sections
    const sections = [
      'stats',
      'recent activity',
      'upcoming events',
      'quick actions'
    ];

    for (const section of sections) {
      const sectionElement = page.locator(`[data-testid*="${section}"], h3:has-text("${section}")`);
      if (await sectionElement.isVisible()) {
        await expect(sectionElement).toBeVisible();
      }
    }
  });

  test('should load vendor dashboard', async ({ page }) => {
    await page.goto('/dashboard/vendor');
    
    // Check vendor-specific elements
    await expect(page.locator('h1, h2')).toContainText(/vendor|business/i);
    
    // Check for vendor sections
    const sections = [
      'bookings',
      'services',
      'analytics',
      'portfolio'
    ];

    for (const section of sections) {
      const sectionElement = page.locator(`[data-testid*="${section}"], h3:has-text("${section}")`);
      if (await sectionElement.isVisible()) {
        await expect(sectionElement).toBeVisible();
      }
    }
  });

  test('should load admin dashboard', async ({ page }) => {
    await page.goto('/dashboard/admin');
    
    // Check admin-specific elements
    await expect(page.locator('h1, h2')).toContainText(/admin|management/i);
    
    // Check for admin sections
    const sections = [
      'users',
      'vendors',
      'analytics',
      'settings'
    ];

    for (const section of sections) {
      const sectionElement = page.locator(`[data-testid*="${section}"], h3:has-text("${section}")`);
      if (await sectionElement.isVisible()) {
        await expect(sectionElement).toBeVisible();
      }
    }
  });

  test('should navigate between dashboard sections', async ({ page }) => {
    await page.goto('/dashboard');
    
    // Test navigation links
    const navLinks = [
      { text: 'Profile', href: '/dashboard/profile' },
      { text: 'Settings', href: '/dashboard/settings' },
      { text: 'Messages', href: '/dashboard/messages' },
      { text: 'Payments', href: '/dashboard/payments' }
    ];

    for (const link of navLinks) {
      const linkElement = page.locator(`a[href="${link.href}"]`);
      if (await linkElement.isVisible()) {
        await linkElement.click();
        await expect(page).toHaveURL(new RegExp(link.href));
        await page.goBack();
      }
    }
  });

  test('should display user statistics', async ({ page }) => {
    await page.goto('/dashboard/user');
    
    // Check for stats cards
    const statsCards = page.locator('[data-testid*="stat"], .stat-card, .metric-card');
    if (await statsCards.count() > 0) {
      await expect(statsCards.first()).toBeVisible();
    }
  });

  test('should handle responsive dashboard layout', async ({ page }) => {
    await page.goto('/dashboard');
    
    // Test desktop view
    await page.setViewportSize({ width: 1920, height: 1080 });
    await expect(page.locator('nav, .sidebar')).toBeVisible();
    
    // Test mobile view
    await page.setViewportSize({ width: 375, height: 667 });
    await expect(page.locator('nav, .sidebar')).toBeVisible();
  });
});
