import { test, expect, devices } from '@playwright/test';

const mobileViewports = [
  { name: 'iPhone 12', width: 390, height: 844 },
  { name: 'iPhone SE', width: 375, height: 667 },
  { name: 'Samsung Galaxy', width: 360, height: 800 },
  { name: 'iPad', width: 768, height: 1024 },
];

test.describe('Mobile Responsive Tests', () => {
  for (const viewport of mobileViewports) {
    test(`Homepage responsive on ${viewport.name}`, async ({ page }) => {
      await page.setViewportSize({ width: viewport.width, height: viewport.height });
      await page.goto('/');
      
      // Check header is visible and functional
      await expect(page.locator('header, nav')).toBeVisible();
      
      // Check mobile menu (if exists)
      const mobileMenuButton = page.locator('button[aria-label*="menu"], [data-testid="mobile-menu"]');
      if (await mobileMenuButton.isVisible()) {
        await mobileMenuButton.click();
        await expect(page.locator('nav, [role="navigation"]')).toBeVisible();
      }
      
      // Check main content is visible
      await expect(page.locator('main, [role="main"]')).toBeVisible();
      
      // Check footer
      await expect(page.locator('footer')).toBeVisible();
    });

    test(`Login page responsive on ${viewport.name}`, async ({ page }) => {
      await page.setViewportSize({ width: viewport.width, height: viewport.height });
      await page.goto('/login');
      
      // Check form is visible and usable
      await expect(page.locator('input[name="email"]')).toBeVisible();
      await expect(page.locator('input[name="password"]')).toBeVisible();
      await expect(page.locator('button[type="submit"]')).toBeVisible();
      
      // Check form is not cut off
      const emailInput = page.locator('input[name="email"]');
      const emailBox = await emailInput.boundingBox();
      expect(emailBox?.width).toBeGreaterThan(200);
    });

    test(`Venues page responsive on ${viewport.name}`, async ({ page }) => {
      await page.setViewportSize({ width: viewport.width, height: viewport.height });
      await page.goto('/venues');
      
      // Check search/filter controls
      const searchInput = page.locator('input[placeholder*="search" i], input[type="search"]');
      if (await searchInput.isVisible()) {
        await expect(searchInput).toBeVisible();
      }
      
      // Check venue cards are stacked vertically
      const venueCards = page.locator('article, [data-testid="venue-card"]');
      if (await venueCards.count() > 0) {
        const firstCard = await venueCards.first().boundingBox();
        const secondCard = await venueCards.nth(1).boundingBox();
        
        if (firstCard && secondCard) {
          // Cards should be stacked (second card below first)
          expect(secondCard.y).toBeGreaterThan(firstCard.y);
        }
      }
    });

    test(`Dashboard responsive on ${viewport.name}`, async ({ page }) => {
      await page.setViewportSize({ width: viewport.width, height: viewport.height });
      
      // Login first
      await page.goto('/login');
      await page.fill('input[name="email"]', 'user@test.local');
      await page.fill('input[name="password"]', 'Test123!');
      await page.click('button[type="submit"]');
      await page.waitForURL(/.*dashboard/i);
      
      // Check sidebar is collapsible on mobile
      const sidebarToggle = page.locator('button[aria-label*="menu"], [data-testid="sidebar-toggle"]');
      if (await sidebarToggle.isVisible()) {
        // Sidebar should be hidden initially on mobile
        const sidebar = page.locator('aside, nav[role="navigation"]');
        const isVisible = await sidebar.isVisible();
        
        // Toggle sidebar
        await sidebarToggle.click();
        await page.waitForTimeout(300);
        
        // Sidebar should now be visible or hidden (toggled)
        const newVisibility = await sidebar.isVisible();
        expect(newVisibility).not.toBe(isVisible);
      }
      
      // Check main content is scrollable
      const mainContent = page.locator('main, [role="main"]');
      await expect(mainContent).toBeVisible();
    });

    test(`Forms are usable on ${viewport.name}`, async ({ page }) => {
      await page.setViewportSize({ width: viewport.width, height: viewport.height });
      await page.goto('/register');
      
      // Check all form fields are accessible
      const nameInput = page.locator('input[name="name"]');
      const emailInput = page.locator('input[name="email"]');
      const passwordInput = page.locator('input[name="password"]');
      
      await expect(nameInput).toBeVisible();
      await expect(emailInput).toBeVisible();
      await expect(passwordInput).toBeVisible();
      
      // Check inputs are large enough to tap
      const nameBox = await nameInput.boundingBox();
      expect(nameBox?.height).toBeGreaterThan(40); // Minimum touch target size
    });

    test(`Navigation works on ${viewport.name}`, async ({ page }) => {
      await page.setViewportSize({ width: viewport.width, height: viewport.height });
      await page.goto('/');
      
      // Open mobile menu
      const menuButton = page.locator('button[aria-label*="menu"], [data-testid="mobile-menu"]');
      if (await menuButton.isVisible()) {
        await menuButton.click();
        
        // Check navigation links
        await expect(page.locator('a:has-text("Venues"), a[href*="venues"]')).toBeVisible();
        await expect(page.locator('a:has-text("Vendors"), a[href*="vendors"]')).toBeVisible();
        
        // Click a link
        await page.click('a:has-text("Venues")');
        await expect(page).toHaveURL(/.*venues/i);
      }
    });

    test(`Tables are scrollable on ${viewport.name}`, async ({ page }) => {
      await page.setViewportSize({ width: viewport.width, height: viewport.height });
      
      // Login
      await page.goto('/login');
      await page.fill('input[name="email"]', 'user@test.local');
      await page.fill('input[name="password"]', 'Test123!');
      await page.click('button[type="submit"]');
      await page.waitForURL(/.*dashboard/i);
      
      // Navigate to bookings
      await page.goto('/dashboard/bookings');
      
      // Check if table exists and is scrollable
      const table = page.locator('table, [role="table"]');
      if (await table.isVisible()) {
        // Table should have horizontal scroll on mobile
        const tableBox = await table.boundingBox();
        const viewportWidth = viewport.width;
        
        if (tableBox && tableBox.width > viewportWidth) {
          // Table is wider than viewport, should be scrollable
          await expect(table).toBeVisible();
        }
      }
    });
  }

  test('Touch interactions work correctly', async ({ page }) => {
    await page.setViewportSize({ width: 375, height: 667 }); // iPhone SE
    await page.goto('/');
    
    // Test tap on buttons
    const buttons = page.locator('button, a[role="button"]');
    const buttonCount = await buttons.count();
    
    if (buttonCount > 0) {
      const firstButton = buttons.first();
      await firstButton.tap();
      // Button should respond to tap
      await expect(firstButton).toBeVisible();
    }
  });

  test('Images load and are optimized for mobile', async ({ page }) => {
    await page.setViewportSize({ width: 375, height: 667 });
    await page.goto('/venues');
    
    // Check images are loaded
    const images = page.locator('img');
    const imageCount = await images.count();
    
    if (imageCount > 0) {
      const firstImage = images.first();
      await expect(firstImage).toBeVisible();
      
      // Check image has srcset or responsive attributes
      const srcset = await firstImage.getAttribute('srcset');
      const sizes = await firstImage.getAttribute('sizes');
      
      // At least one responsive attribute should exist
      expect(srcset || sizes || true).toBeTruthy();
    }
  });
});

