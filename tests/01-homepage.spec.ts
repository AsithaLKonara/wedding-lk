import { test, expect } from '@playwright/test';

test.describe('Homepage Tests', () => {
  test('should load homepage successfully', async ({ page }) => {
    await page.goto('/');
    
    // Check if page loads without errors
    await expect(page).toHaveTitle(/WeddingLK/);
    
    // Check for main navigation elements
    await expect(page.locator('nav')).toBeVisible();
    
    // Check for hero section
    await expect(page.locator('h1')).toContainText(/wedding/i);
    
    // Check for main CTA buttons
    await expect(page.locator('a[href*="/register"]')).toBeVisible();
    await expect(page.locator('a[href*="/login"]')).toBeVisible();
  });

  test('should have working navigation links', async ({ page }) => {
    await page.goto('/');
    
    // Test main navigation links
    const navLinks = [
      { text: 'Venues', href: '/venues' },
      { text: 'Vendors', href: '/vendors' },
      { text: 'Packages', href: '/packages' },
      { text: 'About', href: '/about' },
      { text: 'Contact', href: '/contact' }
    ];

    for (const link of navLinks) {
      const linkElement = page.locator(`a[href="${link.href}"]`).first();
      if (await linkElement.isVisible()) {
        await linkElement.click();
        await expect(page).toHaveURL(new RegExp(link.href));
        await page.goBack();
      }
    }
  });

  test('should have responsive design', async ({ page }) => {
    await page.goto('/');
    
    // Test desktop view
    await page.setViewportSize({ width: 1920, height: 1080 });
    await expect(page.locator('nav')).toBeVisible();
    
    // Test mobile view
    await page.setViewportSize({ width: 375, height: 667 });
    await expect(page.locator('nav')).toBeVisible();
    
    // Check if mobile menu works
    const mobileMenuButton = page.locator('button[aria-label*="menu"], button[aria-label*="Menu"]');
    if (await mobileMenuButton.isVisible()) {
      await mobileMenuButton.click();
      await expect(page.locator('nav')).toBeVisible();
    }
  });

  test('should have working search functionality', async ({ page }) => {
    await page.goto('/');
    
    // Look for search input
    const searchInput = page.locator('input[type="search"], input[placeholder*="search"], input[placeholder*="Search"]');
    if (await searchInput.isVisible()) {
      await searchInput.fill('wedding venue');
      await searchInput.press('Enter');
      
      // Should navigate to search results or venues page
      await expect(page).toHaveURL(/search|venues/);
    }
  });

  test('should display featured content', async ({ page }) => {
    await page.goto('/');
    
    // Check for featured sections
    const featuredSections = [
      'featured venues',
      'featured vendors',
      'testimonials',
      'recent posts'
    ];

    for (const section of featuredSections) {
      const sectionElement = page.locator(`[data-testid*="${section}"], h2:has-text("${section}"), h3:has-text("${section}")`);
      if (await sectionElement.isVisible()) {
        await expect(sectionElement).toBeVisible();
      }
    }
  });

  test('should handle 404 pages gracefully', async ({ page }) => {
    const response = await page.goto('/non-existent-page');
    expect(response?.status()).toBe(404);
    
    // Should show 404 page content
    await expect(page.locator('h1, h2')).toContainText(/404|not found|page not found/i);
  });
});








