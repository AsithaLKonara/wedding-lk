import { test, expect, Page } from '@playwright/test';

// Production URL
const PRODUCTION_URL = 'https://wedding-9f2773v90-asithalkonaras-projects.vercel.app';

// Test data
const testUser = {
  email: 'test@weddinglk.com',
  password: 'TestPassword123!',
  name: 'Test User',
  phone: '+94771234567',
};

const testVendor = {
  businessName: 'Test Photography Studio',
  email: 'vendor@weddinglk.com',
  password: 'VendorPassword123!',
  category: 'photography',
  description: 'Professional wedding photography services',
};

test.describe('WeddingLK Production E2E Tests', () => {
  test.beforeEach(async ({ page }) => {
    // Navigate to production site
    await page.goto(PRODUCTION_URL);
    
    // Wait for page to load
    await page.waitForLoadState('networkidle');
  });

  test('Homepage loads correctly', async ({ page }) => {
    // Check page title
    await expect(page).toHaveTitle(/WeddingLK/);
    
    // Check main heading
    await expect(page.locator('h1')).toContainText('Find Your Perfect');
    
    // Check navigation menu
    await expect(page.locator('nav a[href="/venues"]')).toBeVisible();
    await expect(page.locator('nav a[href="/vendors"]')).toBeVisible();
    await expect(page.locator('nav a[href="/feed"]')).toBeVisible();
    
    // Check CTA buttons
    await expect(page.locator('a[href="/login"]')).toBeVisible();
    await expect(page.locator('a[href="/register"]')).toBeVisible();
  });

  test('User Registration Flow', async ({ page }) => {
    // Click register button
    await page.click('a[href="/register"]');
    await page.waitForURL('**/register');
    
    // Fill registration form
    await page.fill('input[name="name"]', testUser.name);
    await page.fill('input[name="email"]', testUser.email);
    await page.fill('input[name="password"]', testUser.password);
    await page.fill('input[name="phone"]', testUser.phone);
    
    // Submit form
    await page.click('button[type="submit"]');
    
    // Wait for redirect or success message
    await page.waitForTimeout(3000);
    
    // Check if redirected to dashboard or shows success message
    const currentUrl = page.url();
    expect(currentUrl).toMatch(/dashboard|profile|success/);
  });

  test('User Login Flow', async ({ page }) => {
    // Click login button
    await page.click('a[href="/login"]');
    await page.waitForURL('**/login');
    
    // Fill login form
    await page.fill('input[name="email"]', testUser.email);
    await page.fill('input[name="password"]', testUser.password);
    
    // Submit form
    await page.click('button[type="submit"]');
    
    // Wait for redirect
    await page.waitForTimeout(3000);
    
    // Check if redirected to dashboard
    const currentUrl = page.url();
    expect(currentUrl).toMatch(/dashboard|profile/);
  });

  test('Vendor Search and Filtering', async ({ page }) => {
    // Navigate to vendors page
    await page.click('a[href="/vendors"]');
    await page.waitForURL('**/vendors');
    
    // Check vendors are loaded
    await expect(page.locator('[data-testid="vendor-card"]')).toBeVisible();
    
    // Test search functionality
    await page.fill('input[placeholder*="search"]', 'photography');
    await page.press('input[placeholder*="search"]', 'Enter');
    
    // Wait for search results
    await page.waitForTimeout(2000);
    
    // Check if results are filtered
    const vendorCards = page.locator('[data-testid="vendor-card"]');
    await expect(vendorCards).toHaveCount({ min: 1 });
  });

  test('Venue Discovery', async ({ page }) => {
    // Navigate to venues page
    await page.click('a[href="/venues"]');
    await page.waitForURL('**/venues');
    
    // Check venues are loaded
    await expect(page.locator('[data-testid="venue-card"]')).toBeVisible();
    
    // Test location filter
    await page.click('button[data-testid="location-filter"]');
    await page.click('text=Colombo');
    
    // Wait for filtered results
    await page.waitForTimeout(2000);
    
    // Check if results are filtered by location
    const venueCards = page.locator('[data-testid="venue-card"]');
    await expect(venueCards).toHaveCount({ min: 1 });
  });

  test('Booking Flow (Authenticated)', async ({ page }) => {
    // Login first
    await page.click('a[href="/login"]');
    await page.fill('input[name="email"]', testUser.email);
    await page.fill('input[name="password"]', testUser.password);
    await page.click('button[type="submit"]');
    await page.waitForTimeout(3000);
    
    // Navigate to a vendor
    await page.click('a[href="/vendors"]');
    await page.waitForURL('**/vendors');
    
    // Click on first vendor
    await page.click('[data-testid="vendor-card"]:first-child');
    await page.waitForURL('**/vendors/**');
    
    // Click book now button
    await page.click('button:has-text("Book Now")');
    
    // Fill booking form
    await page.fill('input[name="eventDate"]', '2024-12-25');
    await page.fill('input[name="guestCount"]', '100');
    await page.fill('textarea[name="specialRequests"]', 'Test booking request');
    
    // Submit booking
    await page.click('button[type="submit"]');
    
    // Wait for confirmation
    await page.waitForTimeout(3000);
    
    // Check if booking was created
    await expect(page.locator('text=Booking confirmed')).toBeVisible();
  });

  test('Review System', async ({ page }) => {
    // Login first
    await page.click('a[href="/login"]');
    await page.fill('input[name="email"]', testUser.email);
    await page.fill('input[name="password"]', testUser.password);
    await page.click('button[type="submit"]');
    await page.waitForTimeout(3000);
    
    // Navigate to a vendor
    await page.click('a[href="/vendors"]');
    await page.click('[data-testid="vendor-card"]:first-child');
    
    // Click on reviews tab
    await page.click('button:has-text("Reviews")');
    
    // Click write review button
    await page.click('button:has-text("Write Review")');
    
    // Fill review form
    await page.fill('input[name="title"]', 'Great service!');
    await page.fill('textarea[name="comment"]', 'Excellent photography service, highly recommended!');
    await page.click('input[name="overallRating"][value="5"]');
    
    // Submit review
    await page.click('button[type="submit"]');
    
    // Wait for confirmation
    await page.waitForTimeout(3000);
    
    // Check if review was submitted
    await expect(page.locator('text=Review submitted')).toBeVisible();
  });

  test('Wishlist Functionality', async ({ page }) => {
    // Login first
    await page.click('a[href="/login"]');
    await page.fill('input[name="email"]', testUser.email);
    await page.fill('input[name="password"]', testUser.password);
    await page.click('button[type="submit"]');
    await page.waitForTimeout(3000);
    
    // Navigate to vendors
    await page.click('a[href="/vendors"]');
    
    // Add vendor to wishlist
    await page.click('[data-testid="vendor-card"]:first-child button[data-testid="wishlist-button"]');
    
    // Check if added to wishlist
    await expect(page.locator('text=Added to wishlist')).toBeVisible();
    
    // Navigate to wishlist
    await page.click('a[href="/wishlist"]');
    
    // Check if vendor is in wishlist
    await expect(page.locator('[data-testid="wishlist-item"]')).toHaveCount({ min: 1 });
  });

  test('Guest List Management', async ({ page }) => {
    // Login first
    await page.click('a[href="/login"]');
    await page.fill('input[name="email"]', testUser.email);
    await page.fill('input[name="password"]', testUser.password);
    await page.click('button[type="submit"]');
    await page.waitForTimeout(3000);
    
    // Navigate to guest list
    await page.click('a[href="/guest-list"]');
    
    // Add guest
    await page.click('button:has-text("Add Guest")');
    
    // Fill guest form
    await page.fill('input[name="name"]', 'John Doe');
    await page.fill('input[name="email"]', 'john@example.com');
    await page.fill('input[name="phone"]', '+94771234567');
    await page.selectOption('select[name="relationship"]', 'friend');
    
    // Submit guest
    await page.click('button[type="submit"]');
    
    // Check if guest was added
    await expect(page.locator('text=John Doe')).toBeVisible();
  });

  test('Admin Dashboard Access', async ({ page }) => {
    // Try to access admin dashboard without login
    await page.goto(`${PRODUCTION_URL}/admin`);
    
    // Should be redirected to login
    await expect(page).toHaveURL(/login/);
    
    // Login as admin (if admin user exists)
    await page.fill('input[name="email"]', 'admin@weddinglk.com');
    await page.fill('input[name="password"]', 'AdminPassword123!');
    await page.click('button[type="submit"]');
    await page.waitForTimeout(3000);
    
    // Try to access admin dashboard again
    await page.goto(`${PRODUCTION_URL}/admin`);
    
    // Should now have access (if admin user exists)
    const currentUrl = page.url();
    if (currentUrl.includes('/admin')) {
      await expect(page.locator('h1')).toContainText('Admin Dashboard');
    }
  });

  test('Mobile Responsiveness', async ({ page }) => {
    // Set mobile viewport
    await page.setViewportSize({ width: 375, height: 667 });
    
    // Check if mobile menu is visible
    await expect(page.locator('button[data-testid="mobile-menu"]')).toBeVisible();
    
    // Click mobile menu
    await page.click('button[data-testid="mobile-menu"]');
    
    // Check if navigation is visible
    await expect(page.locator('nav[data-testid="mobile-nav"]')).toBeVisible();
    
    // Check if main content is still visible
    await expect(page.locator('h1')).toBeVisible();
  });

  test('Error Handling', async ({ page }) => {
    // Try to access non-existent page
    await page.goto(`${PRODUCTION_URL}/non-existent-page`);
    
    // Should show 404 page
    await expect(page.locator('h1')).toContainText('404');
    
    // Try to access API endpoint without authentication
    const response = await page.request.get(`${PRODUCTION_URL}/api/admin/analytics`);
    expect(response.status()).toBe(401);
  });

  test('Performance Check', async ({ page }) => {
    // Measure page load time
    const startTime = Date.now();
    await page.goto(PRODUCTION_URL);
    await page.waitForLoadState('networkidle');
    const loadTime = Date.now() - startTime;
    
    // Page should load within 5 seconds
    expect(loadTime).toBeLessThan(5000);
    
    // Check for console errors
    const errors: string[] = [];
    page.on('console', msg => {
      if (msg.type() === 'error') {
        errors.push(msg.text());
      }
    });
    
    // Navigate around the site
    await page.click('a[href="/vendors"]');
    await page.waitForLoadState('networkidle');
    
    // Should have minimal console errors
    expect(errors.length).toBeLessThan(5);
  });
});

