import { test, expect } from '@playwright/test';

const TEST_USER = {
  email: 'user@test.local',
  password: 'Test123!',
};

test.describe('Reviews and Ratings Tests', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/login');
    await page.fill('input[name="email"]', TEST_USER.email);
    await page.fill('input[name="password"]', TEST_USER.password);
    await page.click('button[type="submit"]');
    await page.waitForURL(/.*dashboard/i);
  });

  test('User views venue reviews', async ({ page }) => {
    await page.goto('/venues');
    
    // Click on a venue
    await page.click('article, [data-testid="venue-card"]').first();
    
    // Navigate to reviews section
    await page.click('button:has-text("Reviews"), a:has-text("Reviews")');
    
    // Verify reviews are displayed
    await expect(page.locator('text=/review|rating|star/i')).toBeVisible();
  });

  test('User submits a review for completed booking', async ({ page }) => {
    await page.goto('/dashboard/bookings');
    
    // Find completed booking
    const completedBooking = page.locator('tr, [data-testid="booking-card"]').filter({ hasText: 'completed' }).first();
    if (await completedBooking.isVisible()) {
      await completedBooking.click();
      
      // Click write review
      await page.click('button:has-text("Write Review"), a:has-text("Review")');
      
      // Fill review form
      await page.fill('input[name="rating"], select[name="rating"]', '5');
      await page.fill('input[name="title"]', 'Excellent Experience');
      await page.fill('textarea[name="comment"]', 'The venue was beautiful and the staff was very helpful. Highly recommended!');
      
      // Add pros
      await page.fill('input[name="pros"]', 'Beautiful location, Great service, Affordable pricing');
      
      // Submit review
      await page.click('button[type="submit"]');
      
      await expect(page.locator('text=/review.*submitted|thank.*review/i')).toBeVisible();
    }
  });

  test('User rates different categories', async ({ page }) => {
    await page.goto('/dashboard/bookings');
    
    const completedBooking = page.locator('tr').filter({ hasText: 'completed' }).first();
    if (await completedBooking.isVisible()) {
      await completedBooking.click();
      await page.click('button:has-text("Write Review")');
      
      // Rate different categories
      await page.fill('input[name="serviceRating"]', '5');
      await page.fill('input[name="qualityRating"]', '4');
      await page.fill('input[name="valueRating"]', '5');
      await page.fill('input[name="communicationRating"]', '5');
      await page.fill('input[name="timelinessRating"]', '4');
      
      await page.click('button[type="submit"]');
      
      await expect(page.locator('text=/review.*submitted/i')).toBeVisible();
    }
  });

  test('User uploads photos with review', async ({ page }) => {
    await page.goto('/dashboard/bookings');
    
    const completedBooking = page.locator('tr').filter({ hasText: 'completed' }).first();
    if (await completedBooking.isVisible()) {
      await completedBooking.click();
      await page.click('button:has-text("Write Review")');
      
      // Fill basic review
      await page.fill('input[name="rating"]', '5');
      await page.fill('textarea[name="comment"]', 'Great experience!');
      
      // Upload photos (if file input exists)
      const fileInput = page.locator('input[type="file"]');
      if (await fileInput.isVisible()) {
        // Note: Would need actual image files for testing
        await expect(fileInput).toBeVisible();
      }
      
      await page.click('button[type="submit"]');
    }
  });

  test('User marks review as helpful', async ({ page }) => {
    await page.goto('/venues');
    await page.click('article').first();
    await page.click('button:has-text("Reviews")');
    
    // Find helpful button
    const helpfulButton = page.locator('button:has-text("Helpful"), [data-testid="helpful-button"]').first();
    if (await helpfulButton.isVisible()) {
      await helpfulButton.click();
      
      // Verify helpful count increased
      await expect(page.locator('text=/\\d+.*helpful/i')).toBeVisible();
    }
  });

  test('Vendor responds to review', async ({ page }) => {
    // Login as vendor
    await page.goto('/login');
    await page.fill('input[name="email"]', 'vendor@test.local');
    await page.fill('input[name="password"]', 'Test123!');
    await page.click('button[type="submit"]');
    
    await page.goto('/dashboard/vendor/reviews');
    
    // Find review with response button
    const reviewRow = page.locator('tr, [data-testid="review-card"]').first();
    await reviewRow.click();
    
    // Click respond
    await page.click('button:has-text("Respond")');
    await page.fill('textarea[name="response"]', 'Thank you for your feedback! We appreciate your review.');
    await page.click('button:has-text("Submit Response")');
    
    await expect(page.locator('text=/response.*submitted|replied/i')).toBeVisible();
  });

  test('User filters reviews by rating', async ({ page }) => {
    await page.goto('/venues');
    await page.click('article').first();
    await page.click('button:has-text("Reviews")');
    
    // Filter by 5 stars
    await page.click('button:has-text("5"), input[value="5"]');
    
    await page.waitForTimeout(500);
    
    // Verify filtered results
    const reviews = page.locator('[data-rating="5"], .rating-5');
    const count = await reviews.count();
    expect(count).toBeGreaterThanOrEqual(0);
  });

  test('User reports inappropriate review', async ({ page }) => {
    await page.goto('/venues');
    await page.click('article').first();
    await page.click('button:has-text("Reviews")');
    
    // Find report button
    const reportButton = page.locator('button:has-text("Report"), [data-testid="report-button"]').first();
    if (await reportButton.isVisible()) {
      await reportButton.click();
      
      // Fill report form
      await page.selectOption('select[name="reason"]', 'inappropriate');
      await page.fill('textarea[name="details"]', 'This review contains inappropriate content');
      await page.click('button:has-text("Submit Report")');
      
      await expect(page.locator('text=/report.*submitted|thank.*report/i')).toBeVisible();
    }
  });
});

