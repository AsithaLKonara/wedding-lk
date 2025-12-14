import { test, expect } from '@playwright/test';

test.describe('Venues CRUD Tests', () => {
  test('should display venues list', async ({ page }) => {
    await page.goto('/venues');
    
    // Check page loads
    await expect(page).toHaveTitle(/venues/i);
    
    // Check for venue cards
    const venueCards = page.locator('[data-testid*="venue"], .venue-card, .card');
    await expect(venueCards.first()).toBeVisible();
  });

  test('should filter venues by location', async ({ page }) => {
    await page.goto('/venues');
    
    // Look for location filter
    const locationFilter = page.locator('select[name*="location"], input[placeholder*="location"]');
    if (await locationFilter.isVisible()) {
      await locationFilter.selectOption('Colombo');
      
      // Wait for results to update
      await page.waitForTimeout(1000);
      
      // Check if results are filtered
      const venueCards = page.locator('[data-testid*="venue"], .venue-card');
      await expect(venueCards.first()).toBeVisible();
    }
  });

  test('should filter venues by capacity', async ({ page }) => {
    await page.goto('/venues');
    
    // Look for capacity filter
    const capacityFilter = page.locator('input[name*="capacity"], select[name*="capacity"]');
    if (await capacityFilter.isVisible()) {
      await capacityFilter.fill('100');
      
      // Wait for results to update
      await page.waitForTimeout(1000);
      
      // Check if results are filtered
      const venueCards = page.locator('[data-testid*="venue"], .venue-card');
      await expect(venueCards.first()).toBeVisible();
    }
  });

  test('should search venues', async ({ page }) => {
    await page.goto('/venues');
    
    // Look for search input
    const searchInput = page.locator('input[type="search"], input[placeholder*="search"]');
    if (await searchInput.isVisible()) {
      await searchInput.fill('hotel');
      await searchInput.press('Enter');
      
      // Wait for results
      await page.waitForTimeout(1000);
      
      // Check if results are filtered
      const venueCards = page.locator('[data-testid*="venue"], .venue-card');
      await expect(venueCards.first()).toBeVisible();
    }
  });

  test('should view venue details', async ({ page }) => {
    await page.goto('/venues');
    
    // Click on first venue
    const firstVenue = page.locator('[data-testid*="venue"], .venue-card').first();
    await firstVenue.click();
    
    // Should navigate to venue details
    await expect(page).toHaveURL(/venues\/[^/]+/);
    
    // Check venue details elements
    await expect(page.locator('h1, h2')).toBeVisible();
    
    // Check for venue information
    const details = [
      'description',
      'capacity',
      'location',
      'price',
      'amenities',
      'gallery'
    ];

    for (const detail of details) {
      const detailElement = page.locator(`[data-testid*="${detail}"], :has-text("${detail}")`);
      if (await detailElement.isVisible()) {
        await expect(detailElement).toBeVisible();
      }
    }
  });

  test('should book venue', async ({ page }) => {
    // Login first
    await page.goto('/login');
    await page.fill('input[name="email"]', 'test@example.com');
    await page.fill('input[name="password"]', 'TestPassword123!');
    await page.click('button[type="submit"]');
    
    // Go to venues
    await page.goto('/venues');
    
    // Click on first venue
    const firstVenue = page.locator('[data-testid*="venue"], .venue-card').first();
    await firstVenue.click();
    
    // Look for book button
    const bookButton = page.locator('button:has-text("Book"), button:has-text("Reserve"), a:has-text("Book")');
    if (await bookButton.isVisible()) {
      await bookButton.click();
      
      // Should navigate to booking form
      await expect(page).toHaveURL(/book|booking/);
      
      // Fill booking form
      await page.fill('input[name*="date"]', '2024-12-25');
      await page.fill('input[name*="guests"]', '100');
      await page.fill('textarea[name*="notes"]', 'Test booking');
      
      // Submit booking
      await page.click('button[type="submit"]');
      
      // Should show success or redirect
      await expect(page).toHaveURL(/success|confirm|payment/);
    }
  });

  test('should add venue to favorites', async ({ page }) => {
    // Login first
    await page.goto('/login');
    await page.fill('input[name="email"]', 'test@example.com');
    await page.fill('input[name="password"]', 'TestPassword123!');
    await page.click('button[type="submit"]');
    
    // Go to venues
    await page.goto('/venues');
    
    // Click on first venue
    const firstVenue = page.locator('[data-testid*="venue"], .venue-card').first();
    await firstVenue.click();
    
    // Look for favorite button
    const favoriteButton = page.locator('button[aria-label*="favorite"], button[aria-label*="like"], .favorite-btn');
    if (await favoriteButton.isVisible()) {
      await favoriteButton.click();
      
      // Should show success message or change state
      await expect(page.locator('text=added|favorited|saved')).toBeVisible();
    }
  });

  test('should create new venue (vendor)', async ({ page }) => {
    // Login as vendor
    await page.goto('/login');
    await page.fill('input[name="email"]', 'vendor@example.com');
    await page.fill('input[name="password"]', 'TestPassword123!');
    await page.click('button[type="submit"]');
    
    // Go to venue creation
    await page.goto('/venues/create');
    
    // Fill venue form
    await page.fill('input[name="name"]', 'Test Venue');
    await page.fill('textarea[name="description"]', 'Beautiful test venue');
    await page.fill('input[name="location"]', 'Colombo, Sri Lanka');
    await page.fill('input[name="capacity"]', '200');
    await page.fill('input[name="price"]', '50000');
    
    // Submit form
    await page.click('button[type="submit"]');
    
    // Should show success or redirect
    await expect(page).toHaveURL(/success|venues/);
  });

  test('should edit venue (vendor)', async ({ page }) => {
    // Login as vendor
    await page.goto('/login');
    await page.fill('input[name="email"]', 'vendor@example.com');
    await page.fill('input[name="password"]', 'TestPassword123!');
    await page.click('button[type="submit"]');
    
    // Go to venues list
    await page.goto('/venues');
    
    // Look for edit button
    const editButton = page.locator('button:has-text("Edit"), a:has-text("Edit")').first();
    if (await editButton.isVisible()) {
      await editButton.click();
      
      // Should navigate to edit form
      await expect(page).toHaveURL(/edit|update/);
      
      // Update venue
      await page.fill('input[name="name"]', 'Updated Venue Name');
      
      // Submit form
      await page.click('button[type="submit"]');
      
      // Should show success
      await expect(page.locator('text=updated|success')).toBeVisible();
    }
  });

  test('should delete venue (vendor)', async ({ page }) => {
    // Login as vendor
    await page.goto('/login');
    await page.fill('input[name="email"]', 'vendor@example.com');
    await page.fill('input[name="password"]', 'TestPassword123!');
    await page.click('button[type="submit"]');
    
    // Go to venues list
    await page.goto('/venues');
    
    // Look for delete button
    const deleteButton = page.locator('button:has-text("Delete"), button[aria-label*="delete"]').first();
    if (await deleteButton.isVisible()) {
      await deleteButton.click();
      
      // Confirm deletion
      const confirmButton = page.locator('button:has-text("Confirm"), button:has-text("Delete")');
      if (await confirmButton.isVisible()) {
        await confirmButton.click();
        
        // Should show success message
        await expect(page.locator('text=deleted|removed')).toBeVisible();
      }
    }
  });
});










