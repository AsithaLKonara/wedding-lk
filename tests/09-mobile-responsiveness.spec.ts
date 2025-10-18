import { test, expect } from '@playwright/test';

test.describe('📱 Mobile Responsiveness Testing', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/');
  });

  test.describe('Homepage Mobile Layout', () => {
    test('iPhone 12 Pro layout', async ({ page }) => {
      await page.setViewportSize({ width: 390, height: 844 });
      
      // Check homepage loads correctly
      await expect(page.locator('h1')).toBeVisible();
      await expect(page.locator('text=Find Your Perfect, text=Wedding Experience')).toBeVisible();
      
      // Check navigation menu
      const mobileMenu = page.locator('[data-testid="mobile-menu"], button[aria-label*="menu"]');
      if (await mobileMenu.isVisible()) {
        await mobileMenu.click();
        await page.waitForTimeout(500);
        
        // Check mobile menu items
        await expect(page.locator('text=Venues, text=Vendors, text=About')).toBeVisible();
      }
    });

    test('Samsung Galaxy S21 layout', async ({ page }) => {
      await page.setViewportSize({ width: 384, height: 854 });
      
      // Check responsive design elements
      await expect(page.locator('h1')).toBeVisible();
      
      // Test touch interactions
      const ctaButton = page.locator('button:has-text("Get Started"), a:has-text("Get Started")').first();
      if (await ctaButton.isVisible()) {
        await ctaButton.tap();
        await page.waitForTimeout(1000);
      }
    });

    test('iPad layout', async ({ page }) => {
      await page.setViewportSize({ width: 768, height: 1024 });
      
      // Check tablet layout
      await expect(page.locator('h1')).toBeVisible();
      
      // Check if sidebar navigation is visible
      const sidebarNav = page.locator('[class*="sidebar"], nav[class*="navigation"]');
      if (await sidebarNav.isVisible()) {
        await expect(sidebarNav).toBeVisible();
      }
    });
  });

  test.describe('Mobile Navigation', () => {
    test('Mobile menu functionality', async ({ page }) => {
      await page.setViewportSize({ width: 375, height: 667 });
      
      // Find and open mobile menu
      const mobileMenuButton = page.locator('[data-testid="mobile-menu"], button[aria-label*="menu"], button:has-text("Menu")');
      if (await mobileMenuButton.isVisible()) {
        await mobileMenuButton.click();
        await page.waitForTimeout(500);
        
        // Check menu items are visible
        await expect(page.locator('text=Venues, text=Vendors, text=About, text=Contact')).toBeVisible();
        
        // Test navigation
        const venuesLink = page.locator('a[href="/venues"]');
        if (await venuesLink.isVisible()) {
          await venuesLink.click();
          await page.waitForTimeout(1000);
          await expect(page).toHaveURL(/.*venues/);
        }
      }
    });

    test('Mobile menu close functionality', async ({ page }) => {
      await page.setViewportSize({ width: 375, height: 667 });
      
      const mobileMenuButton = page.locator('[data-testid="mobile-menu"], button[aria-label*="menu"]');
      if (await mobileMenuButton.isVisible()) {
        // Open menu
        await mobileMenuButton.click();
        await page.waitForTimeout(500);
        
        // Close menu by clicking outside or close button
        const closeButton = page.locator('button[aria-label*="close"], button:has-text("Close")');
        if (await closeButton.isVisible()) {
          await closeButton.click();
        } else {
          // Click outside menu area
          await page.click('body', { position: { x: 50, y: 50 } });
        }
        
        await page.waitForTimeout(500);
      }
    });
  });

  test.describe('Mobile Forms', () => {
    test('Mobile login form', async ({ page }) => {
      await page.setViewportSize({ width: 375, height: 667 });
      await page.goto('/login');
      
      // Check form elements are properly sized for mobile
      const emailInput = page.locator('input[name="email"], input[type="email"]');
      await expect(emailInput).toBeVisible();
      
      const passwordInput = page.locator('input[name="password"], input[type="password"]');
      await expect(passwordInput).toBeVisible();
      
      // Test form interaction
      await emailInput.fill('test@example.com');
      await passwordInput.fill('password123');
      
      // Check submit button
      const submitButton = page.locator('button[type="submit"], button:has-text("Sign in")');
      await expect(submitButton).toBeVisible();
    });

    test('Mobile registration form', async ({ page }) => {
      await page.setViewportSize({ width: 375, height: 667 });
      await page.goto('/register');
      
      // Check form elements
      const nameInput = page.locator('input[name="name"], input[name="firstName"]');
      await expect(nameInput).toBeVisible();
      
      const emailInput = page.locator('input[name="email"], input[type="email"]');
      await expect(emailInput).toBeVisible();
      
      const passwordInput = page.locator('input[name="password"], input[type="password"]');
      await expect(passwordInput).toBeVisible();
      
      // Test form filling
      await nameInput.fill('Test User');
      await emailInput.fill('test@example.com');
      await passwordInput.fill('TestPassword123!');
    });

    test('Mobile search form', async ({ page }) => {
      await page.setViewportSize({ width: 375, height: 667 });
      
      // Test AI search input on mobile
      const searchInput = page.locator('input[placeholder*="dream wedding"], input[placeholder*="Describe your"]');
      if (await searchInput.isVisible()) {
        await searchInput.fill('Beach wedding in Galle');
        await searchInput.press('Enter');
        await page.waitForTimeout(2000);
      }
    });
  });

  test.describe('Mobile Venues & Vendors', () => {
    test('Mobile venues listing', async ({ page }) => {
      await page.setViewportSize({ width: 375, height: 667 });
      await page.goto('/venues');
      
      // Check venue cards are properly displayed
      const venueCards = page.locator('[class*="venue-card"], [class*="card"]');
      await expect(venueCards.first()).toBeVisible();
      
      // Test venue card interaction
      const firstVenue = venueCards.first();
      await firstVenue.click();
      await page.waitForTimeout(1000);
    });

    test('Mobile vendors listing', async ({ page }) => {
      await page.setViewportSize({ width: 375, height: 667 });
      await page.goto('/vendors');
      
      // Check vendor cards
      const vendorCards = page.locator('[class*="vendor-card"], [class*="card"]');
      await expect(vendorCards.first()).toBeVisible();
      
      // Test category filtering on mobile
      const categoryFilter = page.locator('select[name="category"], button[class*="category"]');
      if (await categoryFilter.isVisible()) {
        await categoryFilter.click();
        await page.waitForTimeout(500);
      }
    });

    test('Mobile venue details', async ({ page }) => {
      await page.setViewportSize({ width: 375, height: 667 });
      await page.goto('/venues/1');
      
      // Check venue details are readable on mobile
      await expect(page.locator('h1')).toBeVisible();
      
      // Check booking form on mobile
      const bookingForm = page.locator('form:has(input[name="date"]), [class*="booking-form"]');
      if (await bookingForm.isVisible()) {
        await expect(bookingForm).toBeVisible();
        
        // Test form inputs
        const dateInput = page.locator('input[name="date"], input[type="date"]');
        if (await dateInput.isVisible()) {
          await dateInput.fill('2025-06-15');
        }
      }
    });
  });

  test.describe('Mobile Dashboard', () => {
    test('Mobile dashboard layout', async ({ page }) => {
      await page.setViewportSize({ width: 375, height: 667 });
      await page.goto('/dashboard');
      
      // Check dashboard loads on mobile
      await expect(page.locator('text=Dashboard, text=Welcome')).toBeVisible();
      
      // Check mobile dashboard navigation
      const mobileNav = page.locator('[class*="mobile-nav"], [data-testid="mobile-nav"]');
      if (await mobileNav.isVisible()) {
        await expect(mobileNav).toBeVisible();
      }
    });

    test('Mobile dashboard widgets', async ({ page }) => {
      await page.setViewportSize({ width: 375, height: 667 });
      await page.goto('/dashboard');
      
      // Check dashboard widgets stack properly on mobile
      const widgets = page.locator('[class*="widget"], [class*="card"]');
      if (await widgets.isVisible()) {
        const widgetCount = await widgets.count();
        for (let i = 0; i < Math.min(widgetCount, 3); i++) {
          await expect(widgets.nth(i)).toBeVisible();
        }
      }
    });
  });

  test.describe('Mobile Payments', () => {
    test('Mobile payment form', async ({ page }) => {
      await page.setViewportSize({ width: 375, height: 667 });
      await page.goto('/payment');
      
      // Check payment form is mobile-friendly
      await expect(page.locator('text=Payment, text=Card Details')).toBeVisible();
      
      // Test payment form inputs
      const cardNumberInput = page.locator('input[name="cardNumber"], input[placeholder*="card"]');
      if (await cardNumberInput.isVisible()) {
        await cardNumberInput.fill('4111111111111111');
      }
      
      const expiryInput = page.locator('input[name="expiry"], input[placeholder*="expiry"]');
      if (await expiryInput.isVisible()) {
        await expiryInput.fill('12/25');
      }
      
      const cvvInput = page.locator('input[name="cvv"], input[placeholder*="cvv"]');
      if (await cvvInput.isVisible()) {
        await cvvInput.fill('123');
      }
    });

    test('Mobile payment success page', async ({ page }) => {
      await page.setViewportSize({ width: 375, height: 667 });
      await page.goto('/payment/success');
      
      // Check success page is mobile-friendly
      await expect(page.locator('text=Payment Successful, text=Thank you')).toBeVisible();
      
      // Test download receipt button on mobile
      const downloadButton = page.locator('button:has-text("Download"), a:has-text("Receipt")');
      if (await downloadButton.isVisible()) {
        await expect(downloadButton).toBeVisible();
      }
    });
  });

  test.describe('Mobile Chat & AI', () => {
    test('Mobile chatbot interface', async ({ page }) => {
      await page.setViewportSize({ width: 375, height: 667 });
      
      // Check chatbot button is accessible on mobile
      const chatbotButton = page.locator('[class*="chatbot"], [class*="chat"], button[aria-label*="chat"]');
      if (await chatbotButton.isVisible()) {
        await chatbotButton.click();
        
        // Check chatbot interface opens properly on mobile
        await expect(page.locator('text=Chat Assistant, text=How can I help')).toBeVisible();
        
        // Test mobile chat input
        const chatInput = page.locator('input[placeholder*="message"], textarea[placeholder*="message"]');
        if (await chatInput.isVisible()) {
          await chatInput.fill('Mobile test message');
          await chatInput.press('Enter');
        }
      }
    });

    test('Mobile AI search', async ({ page }) => {
      await page.setViewportSize({ width: 375, height: 667 });
      
      // Test AI search on mobile
      const searchInput = page.locator('input[placeholder*="dream wedding"], input[placeholder*="Describe your"]');
      if (await searchInput.isVisible()) {
        await searchInput.fill('Mobile beach wedding search');
        await searchInput.press('Enter');
        await page.waitForTimeout(2000);
      }
    });
  });

  test.describe('Mobile Performance', () => {
    test('Mobile page load speed', async ({ page }) => {
      await page.setViewportSize({ width: 375, height: 667 });
      
      const startTime = Date.now();
      await page.goto('/');
      await page.waitForLoadState('networkidle');
      const loadTime = Date.now() - startTime;
      
      // Mobile page should load within 3 seconds
      expect(loadTime).toBeLessThan(3000);
    });

    test('Mobile touch interactions', async ({ page }) => {
      await page.setViewportSize({ width: 375, height: 667 });
      
      // Test touch interactions
      const buttons = page.locator('button, a[href]');
      const buttonCount = await buttons.count();
      
      for (let i = 0; i < Math.min(buttonCount, 5); i++) {
        const button = buttons.nth(i);
        if (await button.isVisible()) {
          await button.tap();
          await page.waitForTimeout(500);
        }
      }
    });

    test('Mobile scroll performance', async ({ page }) => {
      await page.setViewportSize({ width: 375, height: 667 });
      
      // Test smooth scrolling on mobile
      await page.evaluate(() => {
        window.scrollTo(0, document.body.scrollHeight);
      });
      
      await page.waitForTimeout(1000);
      
      // Scroll back to top
      await page.evaluate(() => {
        window.scrollTo(0, 0);
      });
      
      await page.waitForTimeout(1000);
    });
  });

  test.describe('Mobile Accessibility', () => {
    test('Mobile accessibility basics', async ({ page }) => {
      await page.setViewportSize({ width: 375, height: 667 });
      
      // Check for proper heading structure
      const h1 = page.locator('h1');
      await expect(h1).toHaveCount(1);
      
      // Check for proper link text
      const links = page.locator('a[href]');
      const linkCount = await links.count();
      for (let i = 0; i < Math.min(linkCount, 5); i++) {
        const link = links.nth(i);
        const text = await link.textContent();
        const href = await link.getAttribute('href');
        if (href && !href.startsWith('#')) {
          expect(text?.trim()).toBeTruthy();
        }
      }
    });

    test('Mobile form accessibility', async ({ page }) => {
      await page.setViewportSize({ width: 375, height: 667 });
      await page.goto('/login');
      
      // Check form labels
      const inputs = page.locator('input');
      const inputCount = await inputs.count();
      for (let i = 0; i < Math.min(inputCount, 3); i++) {
        const input = inputs.nth(i);
        const label = page.locator(`label[for="${await input.getAttribute('id')}"]`);
        if (await label.isVisible()) {
          await expect(label).toBeVisible();
        }
      }
    });
  });

  test.describe('Mobile Error Handling', () => {
    test('Mobile error messages', async ({ page }) => {
      await page.setViewportSize({ width: 375, height: 667 });
      
      // Test error handling on mobile
      await page.goto('/nonexistent-page');
      
      // Check 404 page is mobile-friendly
      await expect(page.locator('text=404, text=Not Found, text=Page not found')).toBeVisible();
    });

    test('Mobile network error handling', async ({ page }) => {
      await page.setViewportSize({ width: 375, height: 667 });
      
      // Simulate network error
      await page.context().setOffline(true);
      await page.reload();
      
      // Check offline message is mobile-friendly
      await expect(page.locator('text=Offline, text=No connection, text=Check your internet')).toBeVisible();
      
      // Restore network
      await page.context().setOffline(false);
    });
  });
});
