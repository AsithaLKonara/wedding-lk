import { test, expect, Page } from '@playwright/test';

/**
 * Critical User Journey Tests for WeddingLK
 * Tests the most important user flows that must work in production
 */

const BASE_URL = 'https://wedding-kv4wiotpq-asithalkonaras-projects.vercel.app';

// Test data
const testUser = {
  email: 'testuser@example.com',
  password: 'TestPassword123!',
  name: 'Test User'
};

const testVendor = {
  email: 'testvendor@example.com',
  password: 'TestVendor123!',
  name: 'Test Vendor'
};

const testVenue = {
  name: 'Test Wedding Venue',
  location: 'Colombo, Sri Lanka',
  capacity: 100,
  price: 50000
};

test.describe('Critical User Journeys', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto(BASE_URL);
  });

  test('Complete Wedding Planning Journey - New User', async ({ page }) => {
    // Step 1: User Registration
    await test.step('User Registration', async () => {
      await page.click('text=Sign Up');
      await page.fill('input[name="name"]', testUser.name);
      await page.fill('input[name="email"]', testUser.email);
      await page.fill('input[name="password"]', testUser.password);
      await page.fill('input[name="confirmPassword"]', testUser.password);
      await page.click('button[type="submit"]');
      
      // Wait for registration success or redirect
      await page.waitForLoadState('networkidle');
      await expect(page).toHaveURL(/.*(dashboard|login|verify)/);
    });

    // Step 2: Email Verification (simulated)
    await test.step('Email Verification', async () => {
      // In a real scenario, user would click verification link
      // For testing, we'll simulate this by checking if verification page loads
      if (page.url().includes('verify')) {
        await expect(page.locator('text=Verify your email')).toBeVisible();
        // Simulate verification by navigating to login
        await page.goto(`${BASE_URL}/login`);
      }
    });

    // Step 3: User Login
    await test.step('User Login', async () => {
      await page.fill('input[name="email"]', testUser.email);
      await page.fill('input[name="password"]', testUser.password);
      await page.click('button[type="submit"]');
      
      await page.waitForLoadState('networkidle');
      await expect(page).toHaveURL(/.*dashboard/);
    });

    // Step 4: Browse Venues
    await test.step('Browse Venues', async () => {
      await page.click('text=Venues');
      await page.waitForLoadState('networkidle');
      
      // Check if venues page loads
      await expect(page.locator('text=Venues')).toBeVisible();
      
      // Try to search for venues
      const searchInput = page.locator('input[placeholder*="search" i], input[placeholder*="venue" i]');
      if (await searchInput.isVisible()) {
        await searchInput.fill('Colombo');
        await page.keyboard.press('Enter');
        await page.waitForTimeout(1000);
      }
    });

    // Step 5: View Venue Details
    await test.step('View Venue Details', async () => {
      // Click on first venue if available
      const venueCard = page.locator('[data-testid="venue-card"], .venue-card, [class*="venue"]').first();
      if (await venueCard.isVisible()) {
        await venueCard.click();
        await page.waitForLoadState('networkidle');
        
        // Check if venue details page loads
        await expect(page.locator('text=Details, text=About, text=Gallery')).toBeVisible();
      }
    });

    // Step 6: Create Booking
    await test.step('Create Booking', async () => {
      // Look for booking button or form
      const bookButton = page.locator('text=Book, text=Reserve, button:has-text("Book")').first();
      if (await bookButton.isVisible()) {
        await bookButton.click();
        await page.waitForLoadState('networkidle');
        
        // Fill booking form if available
        const dateInput = page.locator('input[type="date"], input[name*="date"]');
        if (await dateInput.isVisible()) {
          const futureDate = new Date();
          futureDate.setDate(futureDate.getDate() + 30);
          await dateInput.fill(futureDate.toISOString().split('T')[0]);
        }
        
        const guestInput = page.locator('input[name*="guest"], input[name*="capacity"]');
        if (await guestInput.isVisible()) {
          await guestInput.fill('50');
        }
        
        // Submit booking
        const submitButton = page.locator('button[type="submit"], button:has-text("Submit")');
        if (await submitButton.isVisible()) {
          await submitButton.click();
          await page.waitForLoadState('networkidle');
        }
      }
    });

    // Step 7: Access Dashboard
    await test.step('Access Dashboard', async () => {
      await page.click('text=Dashboard, text=Profile');
      await page.waitForLoadState('networkidle');
      
      // Check if dashboard loads
      await expect(page.locator('text=Dashboard, text=Profile, text=Bookings')).toBeVisible();
    });
  });

  test('Vendor Management Journey', async ({ page }) => {
    // Step 1: Vendor Registration
    await test.step('Vendor Registration', async () => {
      await page.click('text=Sign Up, text=Register');
      await page.fill('input[name="name"]', testVendor.name);
      await page.fill('input[name="email"]', testVendor.email);
      await page.fill('input[name="password"]', testVendor.password);
      await page.fill('input[name="confirmPassword"]', testVendor.password);
      
      // Select vendor role if available
      const vendorRole = page.locator('input[value="vendor"], input[type="radio"][value*="vendor"]');
      if (await vendorRole.isVisible()) {
        await vendorRole.click();
      }
      
      await page.click('button[type="submit"]');
      await page.waitForLoadState('networkidle');
    });

    // Step 2: Vendor Login
    await test.step('Vendor Login', async () => {
      await page.goto(`${BASE_URL}/login`);
      await page.fill('input[name="email"]', testVendor.email);
      await page.fill('input[name="password"]', testVendor.password);
      await page.click('button[type="submit"]');
      
      await page.waitForLoadState('networkidle');
      await expect(page).toHaveURL(/.*dashboard/);
    });

    // Step 3: Add Venue
    await test.step('Add Venue', async () => {
      await page.click('text=Add Venue, text=Create Venue, text=Venues');
      await page.waitForLoadState('networkidle');
      
      // Fill venue form
      await page.fill('input[name="name"], input[placeholder*="name" i]', testVenue.name);
      await page.fill('input[name="location"], input[placeholder*="location" i]', testVenue.location);
      await page.fill('input[name="capacity"], input[placeholder*="capacity" i]', testVenue.capacity.toString());
      await page.fill('input[name="price"], input[placeholder*="price" i]', testVenue.price.toString());
      
      // Submit venue
      const submitButton = page.locator('button[type="submit"], button:has-text("Submit")');
      if (await submitButton.isVisible()) {
        await submitButton.click();
        await page.waitForLoadState('networkidle');
      }
    });

    // Step 4: Manage Bookings
    await test.step('Manage Bookings', async () => {
      await page.click('text=Bookings, text=Reservations');
      await page.waitForLoadState('networkidle');
      
      // Check if bookings page loads
      await expect(page.locator('text=Bookings, text=Reservations')).toBeVisible();
    });
  });

  test('Payment Processing Journey', async ({ page }) => {
    // Step 1: Login as user
    await test.step('User Login', async () => {
      await page.goto(`${BASE_URL}/login`);
      await page.fill('input[name="email"]', testUser.email);
      await page.fill('input[name="password"]', testUser.password);
      await page.click('button[type="submit"]');
      
      await page.waitForLoadState('networkidle');
    });

    // Step 2: Navigate to Payment
    await test.step('Navigate to Payment', async () => {
      // Look for payment or booking related links
      await page.click('text=Payment, text=Book, text=Checkout');
      await page.waitForLoadState('networkidle');
    });

    // Step 3: Fill Payment Form
    await test.step('Fill Payment Form', async () => {
      // Test card details (Stripe test mode)
      const cardNumber = page.locator('input[name*="card"], input[placeholder*="card"]');
      if (await cardNumber.isVisible()) {
        await cardNumber.fill('4242424242424242');
      }
      
      const expiryDate = page.locator('input[name*="expiry"], input[placeholder*="expiry"]');
      if (await expiryDate.isVisible()) {
        await expiryDate.fill('12/25');
      }
      
      const cvv = page.locator('input[name*="cvv"], input[placeholder*="cvv"]');
      if (await cvv.isVisible()) {
        await cvv.fill('123');
      }
    });

    // Step 4: Process Payment
    await test.step('Process Payment', async () => {
      const payButton = page.locator('button:has-text("Pay"), button:has-text("Submit")');
      if (await payButton.isVisible()) {
        await payButton.click();
        await page.waitForLoadState('networkidle');
        
        // Check for success message or redirect
        await expect(page.locator('text=Success, text=Payment, text=Confirmation')).toBeVisible();
      }
    });
  });

  test('AI Search and Chat Journey', async ({ page }) => {
    // Step 1: Login
    await test.step('User Login', async () => {
      await page.goto(`${BASE_URL}/login`);
      await page.fill('input[name="email"]', testUser.email);
      await page.fill('input[name="password"]', testUser.password);
      await page.click('button[type="submit"]');
      
      await page.waitForLoadState('networkidle');
    });

    // Step 2: Test AI Search
    await test.step('Test AI Search', async () => {
      await page.click('text=AI Search, text=Search');
      await page.waitForLoadState('networkidle');
      
      const searchInput = page.locator('input[placeholder*="search" i], textarea[placeholder*="search" i]');
      if (await searchInput.isVisible()) {
        await searchInput.fill('Find a beach wedding venue in Colombo');
        await page.keyboard.press('Enter');
        await page.waitForTimeout(2000);
        
        // Check for search results
        await expect(page.locator('text=Results, text=Venues, text=Found')).toBeVisible();
      }
    });

    // Step 3: Test Chat
    await test.step('Test Chat', async () => {
      await page.click('text=Chat, text=Messages');
      await page.waitForLoadState('networkidle');
      
      const chatInput = page.locator('input[placeholder*="message" i], textarea[placeholder*="message" i]');
      if (await chatInput.isVisible()) {
        await chatInput.fill('Hello, I need help with wedding planning');
        await page.keyboard.press('Enter');
        await page.waitForTimeout(1000);
        
        // Check for message sent
        await expect(page.locator('text=Hello, I need help')).toBeVisible();
      }
    });
  });

  test('Mobile Responsiveness Journey', async ({ page }) => {
    // Set mobile viewport
    await page.setViewportSize({ width: 375, height: 667 });
    
    // Step 1: Test mobile navigation
    await test.step('Mobile Navigation', async () => {
      await page.goto(BASE_URL);
      
      // Check if mobile menu exists
      const mobileMenu = page.locator('button[aria-label*="menu" i], button:has-text("Menu"), [data-testid="mobile-menu"]');
      if (await mobileMenu.isVisible()) {
        await mobileMenu.click();
        await page.waitForTimeout(500);
        
        // Check if menu items are visible
        await expect(page.locator('text=Home, text=Venues, text=Vendors')).toBeVisible();
      }
    });

    // Step 2: Test mobile forms
    await test.step('Mobile Forms', async () => {
      await page.click('text=Sign Up, text=Login');
      await page.waitForLoadState('networkidle');
      
      // Check if forms are usable on mobile
      const emailInput = page.locator('input[name="email"]');
      if (await emailInput.isVisible()) {
        await emailInput.click();
        await emailInput.fill('test@example.com');
        
        // Check if input is properly focused and visible
        await expect(emailInput).toBeFocused();
      }
    });

    // Step 3: Test mobile touch interactions
    await test.step('Mobile Touch Interactions', async () => {
      // Test scrolling
      await page.mouse.wheel(0, 500);
      await page.waitForTimeout(500);
      
      // Test touch on buttons
      const buttons = page.locator('button').first();
      if (await buttons.isVisible()) {
        await buttons.tap();
      }
    });
  });

  test('Error Handling Journey', async ({ page }) => {
    // Step 1: Test 404 page
    await test.step('Test 404 Page', async () => {
      await page.goto(`${BASE_URL}/non-existent-page`);
      await page.waitForLoadState('networkidle');
      
      // Check if 404 page loads
      await expect(page.locator('text=404, text=Not Found, text=Page not found')).toBeVisible();
    });

    // Step 2: Test invalid login
    await test.step('Test Invalid Login', async () => {
      await page.goto(`${BASE_URL}/login`);
      await page.fill('input[name="email"]', 'invalid@example.com');
      await page.fill('input[name="password"]', 'wrongpassword');
      await page.click('button[type="submit"]');
      
      // Check for error message
      await expect(page.locator('text=Invalid, text=Error, text=Failed')).toBeVisible();
    });

    // Step 3: Test form validation
    await test.step('Test Form Validation', async () => {
      await page.goto(`${BASE_URL}/register`);
      await page.click('button[type="submit"]');
      
      // Check for validation errors
      await expect(page.locator('text=Required, text=Invalid, text=Error')).toBeVisible();
    });
  });

  test('Performance and Loading Journey', async ({ page }) => {
    // Step 1: Test page load times
    await test.step('Test Page Load Times', async () => {
      const startTime = Date.now();
      await page.goto(BASE_URL);
      await page.waitForLoadState('networkidle');
      const loadTime = Date.now() - startTime;
      
      // Page should load within 3 seconds
      expect(loadTime).toBeLessThan(3000);
    });

    // Step 2: Test image loading
    await test.step('Test Image Loading', async () => {
      const images = page.locator('img');
      const imageCount = await images.count();
      
      for (let i = 0; i < Math.min(imageCount, 5); i++) {
        const img = images.nth(i);
        await expect(img).toBeVisible();
        await expect(img).toHaveAttribute('src');
      }
    });

    // Step 3: Test API response times
    await test.step('Test API Response Times', async () => {
      const response = await page.goto(`${BASE_URL}/api/venues`);
      expect(response?.status()).toBe(200);
    });
  });
});
