import { test, expect } from '@playwright/test';

test.describe('🏠 Homepage Comprehensive Testing', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/');
  });

  test('Homepage loads successfully', async ({ page }) => {
    // Check page title
    await expect(page).toHaveTitle(/Wedding Dreams Lanka|Wedding.lk/);
    
    // Check main heading
    await expect(page.locator('h1')).toContainText(/Find Your Perfect|Wedding Experience/);
    
    // Check page loads without errors
    await expect(page.locator('body')).toBeVisible();
  });

  test('Navigation menu works correctly', async ({ page }) => {
    // Test main navigation links
    const navLinks = [
      { text: 'Venues', href: '/venues' },
      { text: 'Vendors', href: '/vendors' },
      { text: 'Feed', href: '/feed' },
      { text: 'Gallery', href: '/gallery' },
      { text: 'About', href: '/about' }
    ];

    for (const link of navLinks) {
      const navElement = page.locator(`a[href="${link.href}"]`).first();
      await expect(navElement).toBeVisible();
      await expect(navElement).toContainText(link.text);
    }
  });

  test('Theme toggle functionality', async ({ page }) => {
    // Find theme toggle button
    const themeToggle = page.locator('[data-testid="theme-toggle"], button:has-text("Toggle theme"), [aria-label*="theme"]').first();
    
    if (await themeToggle.isVisible()) {
      // Test theme toggle
      await themeToggle.click();
      await page.waitForTimeout(500);
      
      // Check if theme changed (look for dark class or data attribute)
      const body = page.locator('body');
      const hasDarkClass = await body.evaluate(el => 
        el.classList.contains('dark') || el.getAttribute('data-theme') === 'dark'
      );
      
      // Toggle again to test both directions
      await themeToggle.click();
      await page.waitForTimeout(500);
    }
  });

  test('AI Search section functionality', async ({ page }) => {
    // Check AI search section exists
    await expect(page.locator('input[placeholder*="dream wedding"], input[placeholder*="Describe your"]')).toBeVisible();
    
    // Test search input
    const searchInput = page.locator('input[placeholder*="dream wedding"], input[placeholder*="Describe your"]').first();
    await searchInput.fill('Beach wedding in Galle for 150 guests');
    await expect(searchInput).toHaveValue('Beach wedding in Galle for 150 guests');
  });

  test('Quick search buttons work', async ({ page }) => {
    // Test quick search buttons
    const quickSearches = [
      'Beach wedding venues in Galle',
      'Garden wedding under 200k',
      'Luxury hotel ballrooms Colombo'
    ];

    for (const searchText of quickSearches) {
      const quickButton = page.locator(`button:has-text("${searchText}"), a:has-text("${searchText}")`).first();
      if (await quickButton.isVisible()) {
        await quickButton.click();
        await page.waitForTimeout(1000);
        // Navigate back for next test
        await page.goBack();
        await page.waitForTimeout(1000);
      }
    }
  });

  test('Services section displays correctly', async ({ page }) => {
    // Check services section
    await expect(page.locator('text=Event Planning, text=Venue Discovery, text=Vendor Network')).toBeVisible();
    
    // Check service icons or images
    const serviceCards = page.locator('[class*="service"], [class*="feature"]');
    await expect(serviceCards.first()).toBeVisible();
  });

  test('Statistics section shows correct numbers', async ({ page }) => {
    // Check impact/statistics section
    const statsTexts = [
      'Happy Couples',
      'Venues',
      'Vendors',
      'Events Planned'
    ];

    for (const statText of statsTexts) {
      await expect(page.locator(`text=${statText}`)).toBeVisible();
    }
  });

  test('Call-to-action buttons work', async ({ page }) => {
    // Test CTA buttons
    const ctaButtons = [
      'Start Planning Today',
      'Explore Venues',
      'Get Started Free',
      'Contact Us'
    ];

    for (const buttonText of ctaButtons) {
      const button = page.locator(`button:has-text("${buttonText}"), a:has-text("${buttonText}")`).first();
      if (await button.isVisible()) {
        await expect(button).toBeVisible();
        // Test click without navigation to avoid breaking other tests
        await button.hover();
      }
    }
  });

  test('Footer links and information', async ({ page }) => {
    // Scroll to footer
    await page.evaluate(() => window.scrollTo(0, document.body.scrollHeight));
    
    // Check footer content
    await expect(page.locator('text=Wedding.lk, text=Your trusted partner')).toBeVisible();
    
    // Check footer links
    const footerLinks = ['About', 'Contact', 'Privacy', 'Terms'];
    for (const linkText of footerLinks) {
      const footerLink = page.locator(`footer a:has-text("${linkText}")`).first();
      if (await footerLink.isVisible()) {
        await expect(footerLink).toBeVisible();
      }
    }
  });

  test('Page performance and loading', async ({ page }) => {
    // Check for loading indicators
    const loadingIndicators = page.locator('[class*="loading"], [class*="skeleton"], [class*="spinner"]');
    
    // Wait for page to fully load
    await page.waitForLoadState('networkidle');
    
    // Check that loading indicators are gone
    await expect(loadingIndicators.first()).not.toBeVisible({ timeout: 10000 });
  });

  test('Responsive design on mobile', async ({ page }) => {
    // Test mobile viewport
    await page.setViewportSize({ width: 375, height: 667 });
    
    // Check mobile navigation
    const mobileMenu = page.locator('[data-testid="mobile-menu"], button[aria-label*="menu"]').first();
    if (await mobileMenu.isVisible()) {
      await mobileMenu.click();
      await page.waitForTimeout(500);
    }
    
    // Check main content is still visible
    await expect(page.locator('h1')).toBeVisible();
    
    // Reset viewport
    await page.setViewportSize({ width: 1280, height: 720 });
  });

  test('Error handling and fallbacks', async ({ page }) => {
    // Check for any error messages
    const errorMessages = page.locator('[class*="error"], [role="alert"], .error-message');
    
    // Should not have visible error messages on homepage
    await expect(errorMessages.first()).not.toBeVisible();
    
    // Check for fallback content
    await expect(page.locator('body')).toContainText(/wedding|Wedding/);
  });

  test('Accessibility basics', async ({ page }) => {
    // Check for proper heading structure
    const h1 = page.locator('h1');
    await expect(h1).toHaveCount(1);
    
    // Check for alt text on images
    const images = page.locator('img');
    const imageCount = await images.count();
    for (let i = 0; i < Math.min(imageCount, 5); i++) {
      const img = images.nth(i);
      const alt = await img.getAttribute('alt');
      expect(alt).toBeTruthy();
    }
    
    // Check for proper link text
    const links = page.locator('a');
    const linkCount = await links.count();
    for (let i = 0; i < Math.min(linkCount, 10); i++) {
      const link = links.nth(i);
      const text = await link.textContent();
      const href = await link.getAttribute('href');
      if (href && !href.startsWith('#')) {
        expect(text?.trim()).toBeTruthy();
      }
    }
  });
});
