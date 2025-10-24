import { test, expect } from '@playwright/test';

test.describe('Simple Production Tests', () => {
  test.skip('DISABLED: Homepage loads and has basic content', async ({ page }) => {
    await page.goto('/');
    
    // Check that the page loads
    await expect(page).toHaveTitle(/WeddingLK/);
    
    // Check that the main heading is visible
    await expect(page.locator('h1')).toContainText('Find Your Perfect');
    
    // Check that the Wedding.lk logo is visible somewhere on the page
    await expect(page.locator('text=Wedding.lk')).toBeVisible();
  });

  test.skip('DISABLED: Page has navigation elements', async ({ page }) => {
    await page.goto('/');
    
    // Check that navigation elements exist (may be in different locations)
    await expect(page.locator('a[href="/venues"]')).toBeVisible();
    await expect(page.locator('a[href="/gallery"]')).toBeVisible();
  });

  test.skip('DISABLED: Page has footer content', async ({ page }) => {
    await page.goto('/');
    
    // Scroll to footer
    await page.evaluate(() => window.scrollTo(0, document.body.scrollHeight));
    
    // Check that footer content exists
    await expect(page.locator('text=Wedding.lk')).toBeVisible();
    await expect(page.locator('text=2024')).toBeVisible();
  });

  test.skip('DISABLED: Page is responsive', async ({ page }) => {
    // Test mobile viewport
    await page.setViewportSize({ width: 375, height: 667 });
    await page.goto('/');
    
    // Check that page loads on mobile
    await expect(page.locator('h1')).toContainText('Find Your Perfect');
    
    // Test desktop viewport
    await page.setViewportSize({ width: 1280, height: 720 });
    await page.goto('/');
    
    // Check that page loads on desktop
    await expect(page.locator('h1')).toContainText('Find Your Perfect');
  });

  test.skip('DISABLED: Page has correct metadata', async ({ page }) => {
    await page.goto('/');
    
    // Check title
    await expect(page).toHaveTitle(/WeddingLK/);
    
    // Check meta description exists
    const metaDescription = await page.locator('meta[name="description"]').getAttribute('content');
    expect(metaDescription).toBeTruthy();
    expect(metaDescription?.length).toBeGreaterThan(10);
  });
});
