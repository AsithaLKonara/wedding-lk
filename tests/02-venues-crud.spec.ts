import { test, expect } from '@playwright/test';

test.describe('🏢 Venues CRUD Operations Testing', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/');
  });

  test.describe('Venues Listing & Search', () => {
    test('Venues page loads correctly', async ({ page }) => {
      await page.click('a[href="/venues"]');
      await expect(page).toHaveURL(/.*venues/);
      await expect(page.locator('h1')).toContainText(/Venues|Find Venues/);
    });

    test('Venue cards display correctly', async ({ page }) => {
      await page.goto('/venues');
      
      // Wait for venues to load
      await page.waitForTimeout(2000);
      
      // Check venue cards exist
      const venueCards = page.locator('[class*="venue-card"], [class*="card"]');
      await expect(venueCards.first()).toBeVisible();
      
      // Check venue information
      await expect(page.locator('text=Royal Garden Hotel, text=Beach Paradise Resort')).toBeVisible();
    });

    test('Venue search functionality', async ({ page }) => {
      await page.goto('/venues');
      
      // Test search input
      const searchInput = page.locator('input[placeholder*="search"], input[name="search"]');
      if (await searchInput.isVisible()) {
        await searchInput.fill('Royal');
        await page.keyboard.press('Enter');
        await page.waitForTimeout(1000);
        
        // Check search results
        await expect(page.locator('text=Royal Garden Hotel')).toBeVisible();
      }
    });

    test('Venue filtering options', async ({ page }) => {
      await page.goto('/venues');
      
      // Test location filter
      const locationFilter = page.locator('select[name="location"], input[name="location"]');
      if (await locationFilter.isVisible()) {
        await locationFilter.selectOption('Colombo');
        await page.waitForTimeout(1000);
        
        // Check filtered results
        await expect(page.locator('text=Royal Garden Hotel')).toBeVisible();
      }
      
      // Test capacity filter
      const capacityFilter = page.locator('select[name="capacity"], input[name="capacity"]');
      if (await capacityFilter.isVisible()) {
        await capacityFilter.selectOption('300');
        await page.waitForTimeout(1000);
      }
      
      // Test price range filter
      const priceFilter = page.locator('input[name="price"], input[type="range"]');
      if (await priceFilter.isVisible()) {
        await priceFilter.fill('100000');
        await page.waitForTimeout(1000);
      }
    });

    test('Venue sorting options', async ({ page }) => {
      await page.goto('/venues');
      
      // Test sort dropdown
      const sortSelect = page.locator('select[name="sort"], select:has(option:text("Price"))');
      if (await sortSelect.isVisible()) {
        await sortSelect.selectOption('price-low');
        await page.waitForTimeout(1000);
        
        await sortSelect.selectOption('price-high');
        await page.waitForTimeout(1000);
        
        await sortSelect.selectOption('rating');
        await page.waitForTimeout(1000);
      }
    });
  });

  test.describe('Venue Details & Booking', () => {
    test('Individual venue page loads', async ({ page }) => {
      await page.goto('/venues');
      await page.waitForTimeout(2000);
      
      // Click on first venue
      const venueLink = page.locator('a[href*="/venues/"]').first();
      if (await venueLink.isVisible()) {
        await venueLink.click();
        await expect(page).toHaveURL(/.*venues\/.*/);
      }
    });

    test('Venue details display correctly', async ({ page }) => {
      await page.goto('/venues/1'); // Assuming venue ID 1 exists
      
      // Check venue name
      await expect(page.locator('h1')).toContainText(/Royal Garden Hotel|Beach Paradise Resort/);
      
      // Check venue details
      await expect(page.locator('text=Capacity, text=Location, text=Price')).toBeVisible();
      
      // Check amenities
      await expect(page.locator('text=Parking, text=Air Conditioning, text=Stage')).toBeVisible();
    });

    test('Venue image gallery', async ({ page }) => {
      await page.goto('/venues/1');
      
      // Check for images
      const images = page.locator('img');
      const imageCount = await images.count();
      expect(imageCount).toBeGreaterThan(0);
      
      // Check image alt text
      const firstImage = images.first();
      const altText = await firstImage.getAttribute('alt');
      expect(altText).toBeTruthy();
    });

    test('Venue booking form', async ({ page }) => {
      await page.goto('/venues/1');
      
      // Find booking form
      const bookingForm = page.locator('form, [class*="booking"]');
      if (await bookingForm.isVisible()) {
        // Test form fields
        await page.fill('input[name="name"], input[placeholder*="name"]', 'Test User');
        await page.fill('input[name="email"], input[type="email"]', 'test@example.com');
        await page.fill('input[name="phone"], input[placeholder*="phone"]', '0771234567');
        await page.fill('input[name="date"], input[type="date"]', '2025-06-15');
        await page.fill('input[name="guests"], input[placeholder*="guests"]', '150');
        
        // Submit booking
        await page.click('button[type="submit"], button:has-text("Book"), button:has-text("Submit")');
        
        // Check for success message
        await expect(page.locator('text=Booking submitted, text=Success, text=Thank you')).toBeVisible({ timeout: 10000 });
      }
    });
  });

  test.describe('Venue Reviews & Ratings', () => {
    test('Venue reviews section', async ({ page }) => {
      await page.goto('/venues/1');
      
      // Check for reviews section
      await expect(page.locator('text=Reviews, text=Ratings, text=Customer Reviews')).toBeVisible();
      
      // Check for rating display
      const ratingStars = page.locator('[class*="star"], [class*="rating"]');
      if (await ratingStars.isVisible()) {
        await expect(ratingStars.first()).toBeVisible();
      }
    });

    test('Submit venue review', async ({ page }) => {
      await page.goto('/venues/1');
      
      // Look for review form
      const reviewForm = page.locator('form:has(input[name="rating"]), [class*="review-form"]');
      if (await reviewForm.isVisible()) {
        // Fill review form
        await page.fill('textarea[name="review"], textarea[placeholder*="review"]', 'Great venue with excellent service!');
        
        // Set rating
        const ratingInput = page.locator('input[name="rating"], [class*="rating-input"]');
        if (await ratingInput.isVisible()) {
          await ratingInput.fill('5');
        }
        
        // Submit review
        await page.click('button[type="submit"], button:has-text("Submit Review")');
        
        // Check for success message
        await expect(page.locator('text=Review submitted, text=Thank you')).toBeVisible({ timeout: 10000 });
      }
    });
  });

  test.describe('Venue Favorites & Comparison', () => {
    test('Add venue to favorites', async ({ page }) => {
      await page.goto('/venues/1');
      
      // Look for favorite button
      const favoriteButton = page.locator('button:has-text("Favorite"), button:has-text("Save"), [class*="favorite"]');
      if (await favoriteButton.isVisible()) {
        await favoriteButton.click();
        
        // Check for success message or visual change
        await expect(page.locator('text=Added to favorites, text=Saved')).toBeVisible({ timeout: 5000 });
      }
    });

    test('Compare venues functionality', async ({ page }) => {
      await page.goto('/venues');
      
      // Look for compare checkboxes or buttons
      const compareCheckboxes = page.locator('input[type="checkbox"][name*="compare"], button[class*="compare"]');
      if (await compareCheckboxes.isVisible()) {
        // Select venues for comparison
        await compareCheckboxes.first().click();
        await compareCheckboxes.nth(1).click();
        
        // Look for compare button
        const compareButton = page.locator('button:has-text("Compare"), a:has-text("Compare")');
        if (await compareButton.isVisible()) {
          await compareButton.click();
          await expect(page.locator('text=Compare Venues, text=Comparison')).toBeVisible();
        }
      }
    });
  });

  test.describe('Venue Management (Admin)', () => {
    test('Admin venue management page', async ({ page }) => {
      // Try to access admin venue management
      await page.goto('/admin/venues');
      
      // Should redirect to login if not authenticated
      await expect(page).toHaveURL(/.*login|.*admin/);
    });

    test('Add new venue form', async ({ page }) => {
      await page.goto('/admin/venues');
      
      // Look for add venue button
      const addButton = page.locator('button:has-text("Add Venue"), a:has-text("Add Venue")');
      if (await addButton.isVisible()) {
        await addButton.click();
        
        // Fill venue form
        await page.fill('input[name="name"]', 'Test Venue');
        await page.fill('input[name="location"]', 'Test Location');
        await page.fill('input[name="capacity"]', '200');
        await page.fill('input[name="price"]', '100000');
        
        // Submit form
        await page.click('button[type="submit"], button:has-text("Save")');
        
        // Check for success message
        await expect(page.locator('text=Venue added, text=Success')).toBeVisible({ timeout: 10000 });
      }
    });

    test('Edit venue functionality', async ({ page }) => {
      await page.goto('/admin/venues');
      
      // Look for edit button
      const editButton = page.locator('button:has-text("Edit"), a:has-text("Edit")').first();
      if (await editButton.isVisible()) {
        await editButton.click();
        
        // Modify venue details
        await page.fill('input[name="name"]', 'Updated Venue Name');
        
        // Save changes
        await page.click('button[type="submit"], button:has-text("Save")');
        
        // Check for success message
        await expect(page.locator('text=Venue updated, text=Success')).toBeVisible({ timeout: 10000 });
      }
    });

    test('Delete venue functionality', async ({ page }) => {
      await page.goto('/admin/venues');
      
      // Look for delete button
      const deleteButton = page.locator('button:has-text("Delete"), a:has-text("Delete")').first();
      if (await deleteButton.isVisible()) {
        await deleteButton.click();
        
        // Confirm deletion
        const confirmButton = page.locator('button:has-text("Confirm"), button:has-text("Yes")');
        if (await confirmButton.isVisible()) {
          await confirmButton.click();
          
          // Check for success message
          await expect(page.locator('text=Venue deleted, text=Success')).toBeVisible({ timeout: 10000 });
        }
      }
    });
  });

  test.describe('Venue API Integration', () => {
    test('Venues API returns data', async ({ page }) => {
      const response = await page.request.get('/api/venues');
      expect(response.status()).toBe(200);
      
      const data = await response.json();
      expect(data.success).toBe(true);
      expect(data.data).toBeInstanceOf(Array);
      expect(data.data.length).toBeGreaterThan(0);
    });

    test('Individual venue API', async ({ page }) => {
      const response = await page.request.get('/api/venues/1');
      if (response.status() === 200) {
        const data = await response.json();
        expect(data).toHaveProperty('name');
        expect(data).toHaveProperty('location');
      }
    });

    test('Create venue via API', async ({ page }) => {
      const venueData = {
        name: 'Test API Venue',
        location: 'Test Location',
        capacity: 150,
        price: 75000,
        amenities: ['Parking', 'AC']
      };
      
      const response = await page.request.post('/api/venues', { data: venueData });
      expect(response.status()).toBe(201);
      
      const data = await response.json();
      expect(data.success).toBe(true);
      expect(data.data.name).toBe('Test API Venue');
    });
  });
});
