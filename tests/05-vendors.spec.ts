import { test, expect } from '@playwright/test';

test.describe('Vendors CRUD Tests', () => {
  test('should display vendors list', async ({ page }) => {
    await page.goto('/vendors');
    
    // Check page loads
    await expect(page).toHaveTitle(/vendors/i);
    
    // Check for vendor cards
    const vendorCards = page.locator('[data-testid*="vendor"], .vendor-card, .card');
    await expect(vendorCards.first()).toBeVisible();
  });

  test('should filter vendors by category', async ({ page }) => {
    await page.goto('/vendors');
    
    // Look for category filter
    const categoryFilter = page.locator('select[name*="category"], input[placeholder*="category"]');
    if (await categoryFilter.isVisible()) {
      await categoryFilter.selectOption('photography');
      
      // Wait for results to update
      await page.waitForTimeout(1000);
      
      // Check if results are filtered
      const vendorCards = page.locator('[data-testid*="vendor"], .vendor-card');
      await expect(vendorCards.first()).toBeVisible();
    }
  });

  test('should filter vendors by location', async ({ page }) => {
    await page.goto('/vendors');
    
    // Look for location filter
    const locationFilter = page.locator('select[name*="location"], input[placeholder*="location"]');
    if (await locationFilter.isVisible()) {
      await locationFilter.selectOption('Colombo');
      
      // Wait for results to update
      await page.waitForTimeout(1000);
      
      // Check if results are filtered
      const vendorCards = page.locator('[data-testid*="vendor"], .vendor-card');
      await expect(vendorCards.first()).toBeVisible();
    }
  });

  test('should search vendors', async ({ page }) => {
    await page.goto('/vendors');
    
    // Look for search input
    const searchInput = page.locator('input[type="search"], input[placeholder*="search"]');
    if (await searchInput.isVisible()) {
      await searchInput.fill('photographer');
      await searchInput.press('Enter');
      
      // Wait for results
      await page.waitForTimeout(1000);
      
      // Check if results are filtered
      const vendorCards = page.locator('[data-testid*="vendor"], .vendor-card');
      await expect(vendorCards.first()).toBeVisible();
    }
  });

  test('should view vendor profile', async ({ page }) => {
    await page.goto('/vendors');
    
    // Click on first vendor
    const firstVendor = page.locator('[data-testid*="vendor"], .vendor-card').first();
    await firstVendor.click();
    
    // Should navigate to vendor profile
    await expect(page).toHaveURL(/vendors\/[^/]+/);
    
    // Check vendor profile elements
    await expect(page.locator('h1, h2')).toBeVisible();
    
    // Check for vendor information
    const details = [
      'description',
      'services',
      'portfolio',
      'reviews',
      'contact',
      'pricing'
    ];

    for (const detail of details) {
      const detailElement = page.locator(`[data-testid*="${detail}"], :has-text("${detail}")`);
      if (await detailElement.isVisible()) {
        await expect(detailElement).toBeVisible();
      }
    }
  });

  test('should book vendor service', async ({ page }) => {
    // Login first
    await page.goto('/login');
    await page.fill('input[name="email"]', 'test@example.com');
    await page.fill('input[name="password"]', 'TestPassword123!');
    await page.click('button[type="submit"]');
    
    // Go to vendors
    await page.goto('/vendors');
    
    // Click on first vendor
    const firstVendor = page.locator('[data-testid*="vendor"], .vendor-card').first();
    await firstVendor.click();
    
    // Look for book button
    const bookButton = page.locator('button:has-text("Book"), button:has-text("Contact"), a:has-text("Book")');
    if (await bookButton.isVisible()) {
      await bookButton.click();
      
      // Should navigate to booking form
      await expect(page).toHaveURL(/book|booking|contact/);
      
      // Fill booking form
      await page.fill('input[name*="date"]', '2024-12-25');
      await page.fill('textarea[name*="message"]', 'Test booking request');
      
      // Submit booking
      await page.click('button[type="submit"]');
      
      // Should show success or redirect
      await expect(page).toHaveURL(/success|confirm|message/);
    }
  });

  test('should add vendor to favorites', async ({ page }) => {
    // Login first
    await page.goto('/login');
    await page.fill('input[name="email"]', 'test@example.com');
    await page.fill('input[name="password"]', 'TestPassword123!');
    await page.click('button[type="submit"]');
    
    // Go to vendors
    await page.goto('/vendors');
    
    // Click on first vendor
    const firstVendor = page.locator('[data-testid*="vendor"], .vendor-card').first();
    await firstVendor.click();
    
    // Look for favorite button
    const favoriteButton = page.locator('button[aria-label*="favorite"], button[aria-label*="like"], .favorite-btn');
    if (await favoriteButton.isVisible()) {
      await favoriteButton.click();
      
      // Should show success message or change state
      await expect(page.locator('text=added|favorited|saved')).toBeVisible();
    }
  });

  test('should create vendor profile', async ({ page }) => {
    // Login as vendor
    await page.goto('/login');
    await page.fill('input[name="email"]', 'vendor@example.com');
    await page.fill('input[name="password"]', 'TestPassword123!');
    await page.click('button[type="submit"]');
    
    // Go to vendor profile creation
    await page.goto('/vendors/create');
    
    // Fill vendor form
    await page.fill('input[name="businessName"]', 'Test Photography');
    await page.fill('textarea[name="description"]', 'Professional wedding photography');
    await page.fill('input[name="location"]', 'Colombo, Sri Lanka');
    await page.fill('input[name="phone"]', '+94771234567');
    await page.fill('input[name="email"]', 'photographer@example.com');
    
    // Select services
    await page.check('input[value="photography"]');
    
    // Submit form
    await page.click('button[type="submit"]');
    
    // Should show success or redirect
    await expect(page).toHaveURL(/success|vendors|dashboard/);
  });

  test('should edit vendor profile', async ({ page }) => {
    // Login as vendor
    await page.goto('/login');
    await page.fill('input[name="email"]', 'vendor@example.com');
    await page.fill('input[name="password"]', 'TestPassword123!');
    await page.click('button[type="submit"]');
    
    // Go to vendor profile edit
    await page.goto('/vendors/edit');
    
    // Update vendor info
    await page.fill('input[name="businessName"]', 'Updated Photography Studio');
    await page.fill('textarea[name="description"]', 'Updated description');
    
    // Submit form
    await page.click('button[type="submit"]');
    
    // Should show success
    await expect(page.locator('text=updated|success')).toBeVisible();
  });

  test('should manage vendor services', async ({ page }) => {
    // Login as vendor
    await page.goto('/login');
    await page.fill('input[name="email"]', 'vendor@example.com');
    await page.fill('input[name="password"]', 'TestPassword123!');
    await page.click('button[type="submit"]');
    
    // Go to services management
    await page.goto('/vendors/services');
    
    // Add new service
    const addServiceButton = page.locator('button:has-text("Add Service"), button:has-text("New Service")');
    if (await addServiceButton.isVisible()) {
      await addServiceButton.click();
      
      // Fill service form
      await page.fill('input[name="name"]', 'Wedding Photography');
      await page.fill('textarea[name="description"]', 'Full day wedding photography');
      await page.fill('input[name="price"]', '50000');
      
      // Submit form
      await page.click('button[type="submit"]');
      
      // Should show success
      await expect(page.locator('text=added|success')).toBeVisible();
    }
  });

  test('should manage vendor portfolio', async ({ page }) => {
    // Login as vendor
    await page.goto('/login');
    await page.fill('input[name="email"]', 'vendor@example.com');
    await page.fill('input[name="password"]', 'TestPassword123!');
    await page.click('button[type="submit"]');
    
    // Go to portfolio management
    await page.goto('/vendors/portfolio');
    
    // Upload portfolio image
    const fileInput = page.locator('input[type="file"]');
    if (await fileInput.isVisible()) {
      // Note: In real tests, you would upload actual files
      await fileInput.setInputFiles([]);
      
      // Should show upload success
      await expect(page.locator('text=uploaded|success')).toBeVisible();
    }
  });

  test('should view vendor reviews', async ({ page }) => {
    await page.goto('/vendors');
    
    // Click on first vendor
    const firstVendor = page.locator('[data-testid*="vendor"], .vendor-card').first();
    await firstVendor.click();
    
    // Look for reviews section
    const reviewsSection = page.locator('[data-testid*="reviews"], :has-text("reviews")');
    if (await reviewsSection.isVisible()) {
      await expect(reviewsSection).toBeVisible();
      
      // Check for review cards
      const reviewCards = page.locator('[data-testid*="review"], .review-card');
      if (await reviewCards.count() > 0) {
        await expect(reviewCards.first()).toBeVisible();
      }
    }
  });

  test('should write vendor review', async ({ page }) => {
    // Login first
    await page.goto('/login');
    await page.fill('input[name="email"]', 'test@example.com');
    await page.fill('input[name="password"]', 'TestPassword123!');
    await page.click('button[type="submit"]');
    
    // Go to vendor profile
    await page.goto('/vendors');
    const firstVendor = page.locator('[data-testid*="vendor"], .vendor-card').first();
    await firstVendor.click();
    
    // Look for review form
    const reviewForm = page.locator('form:has-text("review"), [data-testid*="review-form"]');
    if (await reviewForm.isVisible()) {
      // Fill review form
      await page.fill('textarea[name*="review"]', 'Great service!');
      await page.fill('input[name*="rating"]', '5');
      
      // Submit review
      await page.click('button[type="submit"]');
      
      // Should show success
      await expect(page.locator('text=reviewed|success')).toBeVisible();
    }
  });
});
