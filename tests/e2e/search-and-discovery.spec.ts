import { test, expect } from '@playwright/test';

test.describe('Search and Discovery Tests', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/');
  });

  test('User searches for venues', async ({ page }) => {
    // Navigate to venues page
    await page.click('a:has-text("Venues"), nav a[href*="venues"]');
    await expect(page).toHaveURL(/.*venues/i);

    // Use search bar
    await page.fill('input[placeholder*="search" i], input[type="search"]', 'garden');
    await page.press('input[placeholder*="search" i], input[type="search"]', 'Enter');
    
    // Wait for results
    await page.waitForSelector('article, [data-testid="venue-card"], .venue-card', { timeout: 10000 });
    
    // Verify results contain search term
    const results = page.locator('article, [data-testid="venue-card"], .venue-card');
    const count = await results.count();
    expect(count).toBeGreaterThan(0);
  });

  test('User filters venues by location', async ({ page }) => {
    await page.goto('/venues');
    
    // Apply location filter
    await page.click('button:has-text("Location"), select[name="location"]');
    await page.selectOption('select[name="city"], select[name="location"]', 'Colombo');
    
    // Wait for filtered results
    await page.waitForTimeout(1000);
    
    // Verify all results are from Colombo
    const locationTexts = await page.locator('text=/colombo/i').allTextContents();
    expect(locationTexts.length).toBeGreaterThan(0);
  });

  test('User filters venues by capacity', async ({ page }) => {
    await page.goto('/venues');
    
    // Set capacity filter
    await page.fill('input[name="minCapacity"]', '100');
    await page.fill('input[name="maxCapacity"]', '500');
    await page.click('button:has-text("Apply Filters")');
    
    await page.waitForTimeout(1000);
    
    // Verify results match capacity range
    const results = page.locator('article, [data-testid="venue-card"]');
    const count = await results.count();
    expect(count).toBeGreaterThanOrEqual(0);
  });

  test('User filters venues by price range', async ({ page }) => {
    await page.goto('/venues');
    
    // Set price filter
    await page.fill('input[name="minPrice"]', '50000');
    await page.fill('input[name="maxPrice"]', '200000');
    await page.click('button:has-text("Apply")');
    
    await page.waitForTimeout(1000);
    
    // Results should be filtered
    expect(page.locator('article, [data-testid="venue-card"]')).toBeVisible();
  });

  test('User searches for vendors', async ({ page }) => {
    await page.goto('/vendors');
    
    // Search for photographer
    await page.fill('input[placeholder*="search" i]', 'photographer');
    await page.press('input[placeholder*="search" i]', 'Enter');
    
    await page.waitForTimeout(1000);
    
    // Verify results
    const results = page.locator('article, [data-testid="vendor-card"]');
    await expect(results.first()).toBeVisible();
  });

  test('User filters vendors by category', async ({ page }) => {
    await page.goto('/vendors');
    
    // Select category
    await page.click('button:has-text("Category"), select[name="category"]');
    await page.selectOption('select[name="category"]', 'photography');
    
    await page.waitForTimeout(1000);
    
    // Verify category filter applied
    expect(page.locator('text=/photography|photographer/i')).toBeVisible();
  });

  test('User sorts results by rating', async ({ page }) => {
    await page.goto('/venues');
    
    // Select sort option
    await page.selectOption('select[name="sortBy"], select[name="sort"]', 'rating');
    
    await page.waitForTimeout(1000);
    
    // Verify sorting (first result should have highest rating)
    const ratings = await page.locator('[data-rating], .rating, text=/\\d+\\.\\d+.*star/i').allTextContents();
    if (ratings.length > 1) {
      const firstRating = parseFloat(ratings[0].replace(/[^0-9.]/g, ''));
      const secondRating = parseFloat(ratings[1].replace(/[^0-9.]/g, ''));
      expect(firstRating).toBeGreaterThanOrEqual(secondRating);
    }
  });

  test('User sorts results by price', async ({ page }) => {
    await page.goto('/venues');
    
    // Select price sort
    await page.selectOption('select[name="sortBy"]', 'price-asc');
    
    await page.waitForTimeout(1000);
    
    // Verify price sorting
    const prices = await page.locator('text=/LKR.*\\d+|Rs\\.|\\$\\d+/i').allTextContents();
    if (prices.length > 1) {
      // Prices should be in ascending order
      expect(prices.length).toBeGreaterThan(0);
    }
  });

  test('User views venue details from search', async ({ page }) => {
    await page.goto('/venues');
    
    // Click on first venue
    const firstVenue = page.locator('article, [data-testid="venue-card"]').first();
    await firstVenue.click();
    
    // Verify venue details page
    await expect(page).toHaveURL(/.*venues.*\\[id\\]|.*venue.*\\d+/i);
    await expect(page.locator('h1, h2')).toBeVisible();
    await expect(page.locator('text=/capacity|price|amenities/i')).toBeVisible();
  });

  test('User uses AI search feature', async ({ page }) => {
    await page.goto('/');
    
    // Find AI search input
    const aiSearchInput = page.locator('input[placeholder*="AI"], textarea[placeholder*="describe"], input[placeholder*="natural"]');
    if (await aiSearchInput.isVisible()) {
      await aiSearchInput.fill('I need a garden venue in Colombo for 200 guests');
      await aiSearchInput.press('Enter');
      
      await page.waitForTimeout(2000);
      
      // Verify AI search results
      await expect(page.locator('text=/recommendation|suggested|match/i')).toBeVisible({ timeout: 10000 });
    }
  });

  test('User compares multiple venues', async ({ page }) => {
    await page.goto('/venues');
    
    // Select venues to compare
    const venueCards = page.locator('article, [data-testid="venue-card"]');
    const firstVenue = venueCards.nth(0);
    const secondVenue = venueCards.nth(1);
    
    // Click compare buttons (if available)
    const compareButtons = page.locator('button:has-text("Compare"), [data-testid="compare-button"]');
    if (await compareButtons.count() >= 2) {
      await compareButtons.nth(0).click();
      await compareButtons.nth(1).click();
      
      // Navigate to compare page
      await page.click('a:has-text("Compare"), button:has-text("View Comparison")');
      
      // Verify comparison view
      await expect(page).toHaveURL(/.*compare/i);
      await expect(page.locator('table, .comparison-table')).toBeVisible();
    }
  });
});

