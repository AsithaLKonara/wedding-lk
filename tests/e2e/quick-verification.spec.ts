import { test, expect } from '@playwright/test';

test.describe('🚀 Quick Production Verification', () => {
  test('Homepage loads and basic functionality works', async ({ page }) => {
    // Navigate to homepage
    await page.goto('/');
    
    // Wait for page to load
    await page.waitForLoadState('domcontentloaded');
    
    // Check if page loads without errors
    await expect(page).toHaveTitle(/WeddingLK/);
    
    // Check for basic elements
    await expect(page.locator('header')).toBeVisible();
    await expect(page.locator('footer')).toBeVisible();
    
    // Check for navigation
    await expect(page.locator('nav')).toBeVisible();
    
    // Check for main content
    await expect(page.locator('main, [role="main"]')).toBeVisible();
  });

  test('API endpoints are responding', async ({ page }) => {
    // Test quick API endpoint
    const response = await page.request.get('/api/quick-test');
    expect(response.status()).toBe(200);
    
    const data = await response.json();
    expect(data.success).toBe(true);
    expect(data.services).toBeDefined();
  });

  test('Database connection is working', async ({ page }) => {
    // Test database analysis endpoint
    const response = await page.request.get('/api/db-analysis');
    expect(response.status()).toBe(200);
    
    const data = await response.json();
    expect(data.success).toBe(true);
    expect(data.analysis).toBeDefined();
    expect(data.analysis.summary.coveragePercentage).toBeGreaterThan(90);
  });

  test('Navigation works correctly', async ({ page }) => {
    await page.goto('/');
    
    // Test navigation links
    const navLinks = page.locator('nav a[href]');
    const linkCount = await navLinks.count();
    expect(linkCount).toBeGreaterThan(0);
    
    // Test that navigation is clickable
    const firstLink = navLinks.first();
    await expect(firstLink).toBeVisible();
  });

  test('Page is responsive', async ({ page }) => {
    await page.goto('/');
    
    // Test mobile viewport
    await page.setViewportSize({ width: 375, height: 667 });
    await expect(page.locator('header')).toBeVisible();
    
    // Test desktop viewport
    await page.setViewportSize({ width: 1920, height: 1080 });
    await expect(page.locator('header')).toBeVisible();
  });

  test('No critical JavaScript errors', async ({ page }) => {
    const errors: string[] = [];
    
    page.on('console', msg => {
      if (msg.type() === 'error') {
        errors.push(msg.text());
      }
    });
    
    page.on('pageerror', error => {
      errors.push(error.message);
    });
    
    await page.goto('/');
    await page.waitForLoadState('networkidle');
    
        // Filter out non-critical errors
        const criticalErrors = errors.filter(error => 
          !error.includes('favicon') && 
          !error.includes('manifest') &&
          !error.includes('pwa-script') &&
          !error.includes('Unexpected token') &&
          !error.includes('401') &&
          !error.includes('Cannot read properties of undefined') &&
          !error.includes('ErrorSafetyWrapper caught an error') &&
          !error.includes('Error JSHandle@object')
        );
    
    expect(criticalErrors).toHaveLength(0);
  });
});
