import { test, expect } from '@playwright/test';

test.describe('Production Site Tests', () => {
  test('Homepage loads correctly', async ({ page }) => {
    await page.goto('/');
    
    // Check that the main heading is visible
    await expect(page.locator('h1')).toContainText('Find Your Perfect');
    
    // Check that the Wedding.lk logo is visible (be more specific to avoid multiple matches)
    await expect(page.locator('header span:has-text("Wedding.lk")')).toBeVisible();
    
    // Check that navigation links are present
    await expect(page.locator('nav a[href="/venues"]')).toBeVisible();
    await expect(page.locator('nav a[href="/vendors"]')).toBeVisible();
    await expect(page.locator('nav a[href="/gallery"]')).toBeVisible();
  });

  test('Navigation works correctly', async ({ page }) => {
    await page.goto('/');
    
    // Test venues navigation - use a more robust approach
    await page.locator('nav a[href="/venues"]').first().click();
    
    // Wait for navigation to complete
    await page.waitForLoadState('networkidle');
    
    // Check that we're on the venues page (it may redirect or show loading)
    const currentUrl = page.url();
    expect(currentUrl).toContain('venues');
    
    // Go back to home
    await page.goto('/');
    await expect(page.locator('h1')).toContainText('Find Your Perfect');
  });

  test('Search functionality is present', async ({ page }) => {
    await page.goto('/');
    
    // Check that the search input is present (try different placeholder text)
    await expect(page.locator('input[placeholder*="dream wedding"]')).toBeVisible();
    
    // Check that the search button is present
    await expect(page.locator('button:has-text("Find My Perfect Wedding")')).toBeVisible();
  });

  test('Footer links are present', async ({ page }) => {
    await page.goto('/');
    
    // Scroll to footer
    await page.evaluate(() => window.scrollTo(0, document.body.scrollHeight));
    
    // Check footer links (be more specific to avoid multiple matches)
    await expect(page.locator('footer a[href="/venues"]')).toBeVisible();
    await expect(page.locator('footer a[href="/vendors"]')).toBeVisible();
    await expect(page.locator('footer a[href="/gallery"]')).toBeVisible();
    // Check for about link in footer (may be in different section)
    await expect(page.locator('footer a[href="/about"], footer a[href="/contact"]')).toBeVisible();
  });

  test('Responsive design works', async ({ page }) => {
    // Test mobile viewport
    await page.setViewportSize({ width: 375, height: 667 });
    await page.goto('/');
    
    // Check that mobile menu button is visible
    await expect(page.locator('button:has(svg.lucide-menu)')).toBeVisible();
    
    // Test desktop viewport
    await page.setViewportSize({ width: 1280, height: 720 });
    await page.goto('/');
    
    // Check that desktop navigation is visible
    await expect(page.locator('nav')).toBeVisible();
  });

  test('Page metadata is correct', async ({ page }) => {
    await page.goto('/');
    
    // Check title
    await expect(page).toHaveTitle(/WeddingLK/);
    
    // Check meta description (use the actual text from the site)
    const metaDescription = await page.locator('meta[name="description"]').getAttribute('content');
    expect(metaDescription).toContain('vendors');
  });
});
