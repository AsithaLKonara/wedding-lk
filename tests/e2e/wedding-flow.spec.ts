import { test, expect } from '@playwright/test';

test.describe('Wedding Planning Flow', () => {
  test.beforeEach(async ({ page }) => {
    // Navigate to the application
    await page.goto('https://wedding-lkcom.vercel.app');
  });

  test('Complete wedding planning journey', async ({ page }) => {
    // 1. User Registration
    await test.step('User Registration', async () => {
      await page.click('text=Sign Up');
      await page.fill('input[name="name"]', 'John Doe');
      await page.fill('input[name="email"]', 'john.doe@example.com');
      await page.fill('input[name="password"]', 'password123');
      await page.fill('input[name="phone"]', '+94771234567');
      await page.selectOption('select[name="role"]', 'user');
      await page.fill('input[name="location"]', 'Colombo, Sri Lanka');
      await page.click('button[type="submit"]');
      
      await expect(page).toHaveURL(/dashboard/);
    });

    // 2. Browse Vendors
    await test.step('Browse Vendors', async () => {
      await page.click('text=Vendors');
      await expect(page.locator('[data-testid="vendor-card"]')).toBeVisible();
      
      // Filter by category
      await page.click('text=Photography');
      await expect(page.locator('[data-testid="vendor-card"]')).toContainText('Photography');
    });

    // 3. View Vendor Details
    await test.step('View Vendor Details', async () => {
      await page.click('[data-testid="vendor-card"]:first-child');
      await expect(page).toHaveURL(/vendors\/[a-zA-Z0-9]+/);
      await expect(page.locator('[data-testid="vendor-details"]')).toBeVisible();
      await expect(page.locator('[data-testid="vendor-gallery"]')).toBeVisible();
    });

    // 4. Add to Favorites
    await test.step('Add to Favorites', async () => {
      await page.click('[data-testid="favorite-button"]');
      await expect(page.locator('[data-testid="favorite-button"]')).toHaveClass(/favorited/);
    });

    // 5. Compare Vendors
    await test.step('Compare Vendors', async () => {
      await page.goBack();
      await page.click('[data-testid="compare-button"]:first-child');
      await page.click('[data-testid="compare-button"]:nth-child(2)');
      await page.click('text=Compare');
      
      await expect(page.locator('[data-testid="comparison-modal"]')).toBeVisible();
      await expect(page.locator('[data-testid="comparison-item"]')).toHaveCount(2);
    });

    // 6. Create Booking
    await test.step('Create Booking', async () => {
      await page.click('[data-testid="book-now-button"]');
      await expect(page.locator('[data-testid="booking-form"]')).toBeVisible();
      
      await page.fill('input[name="eventDate"]', '2024-06-15');
      await page.fill('input[name="guestCount"]', '100');
      await page.fill('textarea[name="specialRequests"]', 'Outdoor ceremony photos');
      await page.click('button[type="submit"]');
      
      await expect(page.locator('[data-testid="booking-success"]')).toBeVisible();
    });

    // 7. Write Review
    await test.step('Write Review', async () => {
      await page.click('text=Write Review');
      await expect(page.locator('[data-testid="review-form"]')).toBeVisible();
      
      await page.fill('input[name="title"]', 'Excellent Photography Service');
      await page.fill('textarea[name="comment"]', 'Amazing photos and great service!');
      await page.click('[data-testid="rating-5"]');
      await page.click('button[type="submit"]');
      
      await expect(page.locator('[data-testid="review-success"]')).toBeVisible();
    });
  });

  test('Vendor Dashboard Flow', async ({ page }) => {
    // Login as vendor
    await page.click('text=Sign In');
    await page.fill('input[name="email"]', 'vendor@example.com');
    await page.fill('input[name="password"]', 'password123');
    await page.click('button[type="submit"]');
    
    await expect(page).toHaveURL(/dashboard/);

    // 1. View Dashboard
    await test.step('View Dashboard', async () => {
      await expect(page.locator('[data-testid="vendor-dashboard"]')).toBeVisible();
      await expect(page.locator('[data-testid="stats-cards"]')).toBeVisible();
    });

    // 2. Manage Bookings
    await test.step('Manage Bookings', async () => {
      await page.click('text=Bookings');
      await expect(page.locator('[data-testid="bookings-list"]')).toBeVisible();
      
      // Accept a booking
      await page.click('[data-testid="accept-booking-button"]:first-child');
      await expect(page.locator('[data-testid="booking-status"]')).toContainText('Confirmed');
    });

    // 3. Update Profile
    await test.step('Update Profile', async () => {
      await page.click('text=Profile');
      await page.fill('textarea[name="description"]', 'Updated description');
      await page.click('button[type="submit"]');
      
      await expect(page.locator('[data-testid="success-message"]')).toBeVisible();
    });

    // 4. View Analytics
    await test.step('View Analytics', async () => {
      await page.click('text=Analytics');
      await expect(page.locator('[data-testid="analytics-charts"]')).toBeVisible();
      await expect(page.locator('[data-testid="revenue-chart"]')).toBeVisible();
    });
  });

  test('Admin Management Flow', async ({ page }) => {
    // Login as admin
    await page.click('text=Sign In');
    await page.fill('input[name="email"]', 'admin@example.com');
    await page.fill('input[name="password"]', 'password123');
    await page.click('button[type="submit"]');
    
    await expect(page).toHaveURL(/dashboard/);

    // 1. User Management
    await test.step('User Management', async () => {
      await page.click('text=Users');
      await expect(page.locator('[data-testid="users-table"]')).toBeVisible();
      
      // Search users
      await page.fill('input[name="search"]', 'john');
      await page.click('button[type="submit"]');
      await expect(page.locator('[data-testid="user-row"]')).toContainText('john');
    });

    // 2. Dispute Resolution
    await test.step('Dispute Resolution', async () => {
      await page.click('text=Disputes');
      await expect(page.locator('[data-testid="disputes-list"]')).toBeVisible();
      
      // View dispute details
      await page.click('[data-testid="dispute-row"]:first-child');
      await expect(page.locator('[data-testid="dispute-details"]')).toBeVisible();
    });

    // 3. Analytics Dashboard
    await test.step('Analytics Dashboard', async () => {
      await page.click('text=Analytics');
      await expect(page.locator('[data-testid="platform-analytics"]')).toBeVisible();
      await expect(page.locator('[data-testid="revenue-chart"]')).toBeVisible();
    });
  });

  test('Mobile Responsiveness', async ({ page }) => {
    // Set mobile viewport
    await page.setViewportSize({ width: 375, height: 667 });
    
    await page.goto('https://wedding-lkcom.vercel.app');
    
    // Test mobile navigation
    await expect(page.locator('[data-testid="mobile-menu"]')).toBeVisible();
    await page.click('[data-testid="mobile-menu-button"]');
    await expect(page.locator('[data-testid="mobile-nav"]')).toBeVisible();
    
    // Test mobile vendor cards
    await page.click('text=Vendors');
    await expect(page.locator('[data-testid="vendor-card"]')).toBeVisible();
    
    // Test mobile booking form
    await page.click('[data-testid="vendor-card"]:first-child');
    await page.click('[data-testid="book-now-button"]');
    await expect(page.locator('[data-testid="booking-form"]')).toBeVisible();
  });
});

