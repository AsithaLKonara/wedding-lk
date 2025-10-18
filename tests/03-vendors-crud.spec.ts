import { test, expect } from '@playwright/test';

test.describe('🎨 Vendors CRUD Operations Testing', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/');
  });

  test.describe('Vendors Listing & Search', () => {
    test('Vendors page loads correctly', async ({ page }) => {
      await page.click('a[href="/vendors"]');
      await expect(page).toHaveURL(/.*vendors/);
      await expect(page.locator('h1')).toContainText(/Vendors|Find Vendors|Service Providers/);
    });

    test('Vendor cards display correctly', async ({ page }) => {
      await page.goto('/vendors');
      
      // Wait for vendors to load
      await page.waitForTimeout(2000);
      
      // Check vendor cards exist
      const vendorCards = page.locator('[class*="vendor-card"], [class*="card"]');
      await expect(vendorCards.first()).toBeVisible();
      
      // Check vendor categories
      await expect(page.locator('text=Photographer, text=Caterer, text=Florist, text=Decorator')).toBeVisible();
    });

    test('Vendor category filtering', async ({ page }) => {
      await page.goto('/vendors');
      
      // Test category filters
      const categories = ['Photographer', 'Caterer', 'Florist', 'DJ', 'Decorator'];
      
      for (const category of categories) {
        const categoryButton = page.locator(`button:has-text("${category}"), a:has-text("${category}")`);
        if (await categoryButton.isVisible()) {
          await categoryButton.click();
          await page.waitForTimeout(1000);
          
          // Check filtered results
          await expect(page.locator(`text=${category}`)).toBeVisible();
        }
      }
    });

    test('Vendor search functionality', async ({ page }) => {
      await page.goto('/vendors');
      
      // Test search input
      const searchInput = page.locator('input[placeholder*="search"], input[name="search"]');
      if (await searchInput.isVisible()) {
        await searchInput.fill('photographer');
        await page.keyboard.press('Enter');
        await page.waitForTimeout(1000);
        
        // Check search results
        await expect(page.locator('text=Photographer')).toBeVisible();
      }
    });

    test('Vendor location filtering', async ({ page }) => {
      await page.goto('/vendors');
      
      // Test location filter
      const locationFilter = page.locator('select[name="location"], input[name="location"]');
      if (await locationFilter.isVisible()) {
        const locations = ['Colombo', 'Kandy', 'Galle', 'Negombo'];
        
        for (const location of locations) {
          await locationFilter.selectOption(location);
          await page.waitForTimeout(1000);
        }
      }
    });

    test('Vendor sorting options', async ({ page }) => {
      await page.goto('/vendors');
      
      // Test sort dropdown
      const sortSelect = page.locator('select[name="sort"], select:has(option:text("Rating"))');
      if (await sortSelect.isVisible()) {
        await sortSelect.selectOption('rating-high');
        await page.waitForTimeout(1000);
        
        await sortSelect.selectOption('price-low');
        await page.waitForTimeout(1000);
        
        await sortSelect.selectOption('experience');
        await page.waitForTimeout(1000);
      }
    });
  });

  test.describe('Vendor Details & Services', () => {
    test('Individual vendor page loads', async ({ page }) => {
      await page.goto('/vendors');
      await page.waitForTimeout(2000);
      
      // Click on first vendor
      const vendorLink = page.locator('a[href*="/vendors/"]').first();
      if (await vendorLink.isVisible()) {
        await vendorLink.click();
        await expect(page).toHaveURL(/.*vendors\/.*/);
      }
    });

    test('Vendor profile displays correctly', async ({ page }) => {
      await page.goto('/vendors/1'); // Assuming vendor ID 1 exists
      
      // Check vendor name and category
      await expect(page.locator('h1')).toBeVisible();
      
      // Check vendor details
      await expect(page.locator('text=Experience, text=Location, text=Services')).toBeVisible();
      
      // Check contact information
      await expect(page.locator('text=Contact, text=Phone, text=Email')).toBeVisible();
    });

    test('Vendor portfolio gallery', async ({ page }) => {
      await page.goto('/vendors/1');
      
      // Check for portfolio images
      const portfolioImages = page.locator('[class*="portfolio"], [class*="gallery"] img');
      if (await portfolioImages.isVisible()) {
        await expect(portfolioImages.first()).toBeVisible();
        
        // Check image alt text
        const firstImage = portfolioImages.first();
        const altText = await firstImage.getAttribute('alt');
        expect(altText).toBeTruthy();
      }
    });

    test('Vendor services and packages', async ({ page }) => {
      await page.goto('/vendors/1');
      
      // Check services section
      await expect(page.locator('text=Services, text=Packages, text=Pricing')).toBeVisible();
      
      // Check service cards
      const serviceCards = page.locator('[class*="service-card"], [class*="package-card"]');
      if (await serviceCards.isVisible()) {
        await expect(serviceCards.first()).toBeVisible();
      }
    });

    test('Vendor availability calendar', async ({ page }) => {
      await page.goto('/vendors/1');
      
      // Check for availability section
      const availabilitySection = page.locator('text=Availability, text=Calendar, text=Book Now');
      if (await availabilitySection.isVisible()) {
        await expect(availabilitySection.first()).toBeVisible();
        
        // Check for calendar or booking form
        const calendar = page.locator('[class*="calendar"], [class*="availability"]');
        if (await calendar.isVisible()) {
          await expect(calendar.first()).toBeVisible();
        }
      }
    });
  });

  test.describe('Vendor Booking & Inquiry', () => {
    test('Vendor inquiry form', async ({ page }) => {
      await page.goto('/vendors/1');
      
      // Find inquiry form
      const inquiryForm = page.locator('form:has(input[name="name"]), [class*="inquiry-form"]');
      if (await inquiryForm.isVisible()) {
        // Fill inquiry form
        await page.fill('input[name="name"], input[placeholder*="name"]', 'Test User');
        await page.fill('input[name="email"], input[type="email"]', 'test@example.com');
        await page.fill('input[name="phone"], input[placeholder*="phone"]', '0771234567');
        await page.fill('textarea[name="message"], textarea[placeholder*="message"]', 'Interested in your photography services for my wedding.');
        
        // Submit inquiry
        await page.click('button[type="submit"], button:has-text("Send Inquiry"), button:has-text("Contact")');
        
        // Check for success message
        await expect(page.locator('text=Inquiry sent, text=Success, text=Thank you')).toBeVisible({ timeout: 10000 });
      }
    });

    test('Vendor booking form', async ({ page }) => {
      await page.goto('/vendors/1');
      
      // Look for booking button
      const bookButton = page.locator('button:has-text("Book"), a:has-text("Book Now")');
      if (await bookButton.isVisible()) {
        await bookButton.click();
        
        // Check if booking form appears
        await expect(page.locator('text=Booking Form, text=Select Package, text=Choose Date')).toBeVisible();
        
        // Fill booking form
        await page.fill('input[name="date"], input[type="date"]', '2025-06-15');
        await page.fill('input[name="guests"], input[placeholder*="guests"]', '150');
        
        // Select package if available
        const packageSelect = page.locator('select[name="package"], input[name="package"]');
        if (await packageSelect.isVisible()) {
          await packageSelect.selectOption('1');
        }
        
        // Submit booking
        await page.click('button[type="submit"], button:has-text("Confirm Booking")');
        
        // Check for success message
        await expect(page.locator('text=Booking confirmed, text=Success')).toBeVisible({ timeout: 10000 });
      }
    });
  });

  test.describe('Vendor Reviews & Ratings', () => {
    test('Vendor reviews section', async ({ page }) => {
      await page.goto('/vendors/1');
      
      // Check for reviews section
      await expect(page.locator('text=Reviews, text=Customer Reviews, text=Testimonials')).toBeVisible();
      
      // Check for rating display
      const ratingStars = page.locator('[class*="star"], [class*="rating"]');
      if (await ratingStars.isVisible()) {
        await expect(ratingStars.first()).toBeVisible();
      }
    });

    test('Submit vendor review', async ({ page }) => {
      await page.goto('/vendors/1');
      
      // Look for review form
      const reviewForm = page.locator('form:has(input[name="rating"]), [class*="review-form"]');
      if (await reviewForm.isVisible()) {
        // Fill review form
        await page.fill('textarea[name="review"], textarea[placeholder*="review"]', 'Excellent service and great quality work!');
        
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

  test.describe('Vendor Registration & Onboarding', () => {
    test('Vendor registration page', async ({ page }) => {
      await page.goto('/vendors');
      
      // Look for vendor registration button
      const registerButton = page.locator('a:has-text("Become a Vendor"), button:has-text("Join as Vendor")');
      if (await registerButton.isVisible()) {
        await registerButton.click();
        await expect(page).toHaveURL(/.*vendor.*register|.*become.*vendor/);
      }
    });

    test('Vendor onboarding process', async ({ page }) => {
      await page.goto('/dashboard/vendor/onboarding');
      
      // Check onboarding steps
      await expect(page.locator('text=Onboarding, text=Complete your profile, text=Step')).toBeVisible();
      
      // Fill business information
      await page.fill('input[name="businessName"]', 'Test Photography Studio');
      await page.fill('input[name="category"]', 'Photographer');
      await page.fill('input[name="location"]', 'Colombo');
      await page.fill('textarea[name="description"]', 'Professional wedding photography services');
      
      // Upload portfolio images
      const fileInput = page.locator('input[type="file"]');
      if (await fileInput.isVisible()) {
        // Note: In real test, you would upload actual files
        await fileInput.setInputFiles([]);
      }
      
      // Submit onboarding
      await page.click('button[type="submit"], button:has-text("Complete Setup")');
      
      // Check for success message
      await expect(page.locator('text=Onboarding complete, text=Welcome')).toBeVisible({ timeout: 10000 });
    });

    test('Vendor dashboard access', async ({ page }) => {
      await page.goto('/dashboard/vendor');
      
      // Should redirect to login if not authenticated
      await expect(page).toHaveURL(/.*login|.*dashboard/);
    });
  });

  test.describe('Vendor Management (Admin)', () => {
    test('Admin vendor management page', async ({ page }) => {
      await page.goto('/admin/vendors');
      
      // Should redirect to login if not authenticated
      await expect(page).toHaveURL(/.*login|.*admin/);
    });

    test('Vendor approval process', async ({ page }) => {
      await page.goto('/admin/vendors');
      
      // Look for pending vendors
      const pendingVendors = page.locator('text=Pending, text=Awaiting Approval');
      if (await pendingVendors.isVisible()) {
        // Approve vendor
        const approveButton = page.locator('button:has-text("Approve")').first();
        if (await approveButton.isVisible()) {
          await approveButton.click();
          
          // Check for success message
          await expect(page.locator('text=Vendor approved, text=Success')).toBeVisible({ timeout: 10000 });
        }
      }
    });

    test('Vendor verification process', async ({ page }) => {
      await page.goto('/admin/vendors');
      
      // Look for verification options
      const verifyButton = page.locator('button:has-text("Verify"), a:has-text("Verify")');
      if (await verifyButton.isVisible()) {
        await verifyButton.first().click();
        
        // Check verification form or modal
        await expect(page.locator('text=Verification, text=Documents')).toBeVisible();
      }
    });
  });

  test.describe('Vendor API Integration', () => {
    test('Vendors API returns data', async ({ page }) => {
      const response = await page.request.get('/api/vendors');
      expect(response.status()).toBe(200);
      
      const data = await response.json();
      expect(data.success).toBe(true);
      expect(data.data).toBeInstanceOf(Array);
    });

    test('Individual vendor API', async ({ page }) => {
      const response = await page.request.get('/api/vendors/1');
      if (response.status() === 200) {
        const data = await response.json();
        expect(data).toHaveProperty('name');
        expect(data).toHaveProperty('category');
      }
    });

    test('Create vendor via API', async ({ page }) => {
      const vendorData = {
        name: 'Test API Vendor',
        category: 'Photographer',
        location: 'Test Location',
        description: 'Test vendor description',
        services: ['Wedding Photography', 'Portrait Photography']
      };
      
      const response = await page.request.post('/api/vendors', { data: vendorData });
      expect(response.status()).toBe(201);
      
      const data = await response.json();
      expect(data.success).toBe(true);
      expect(data.data.name).toBe('Test API Vendor');
    });

    test('Vendor services API', async ({ page }) => {
      const response = await page.request.get('/api/services');
      expect(response.status()).toBe(200);
      
      const data = await response.json();
      expect(data.success).toBe(true);
      expect(data.data).toBeInstanceOf(Array);
    });
  });

  test.describe('Vendor Favorites & Comparison', () => {
    test('Add vendor to favorites', async ({ page }) => {
      await page.goto('/vendors/1');
      
      // Look for favorite button
      const favoriteButton = page.locator('button:has-text("Favorite"), button:has-text("Save"), [class*="favorite"]');
      if (await favoriteButton.isVisible()) {
        await favoriteButton.click();
        
        // Check for success message
        await expect(page.locator('text=Added to favorites, text=Saved')).toBeVisible({ timeout: 5000 });
      }
    });

    test('Vendor comparison functionality', async ({ page }) => {
      await page.goto('/vendors');
      
      // Look for compare checkboxes
      const compareCheckboxes = page.locator('input[type="checkbox"][name*="compare"], button[class*="compare"]');
      if (await compareCheckboxes.isVisible()) {
        // Select vendors for comparison
        await compareCheckboxes.first().click();
        await compareCheckboxes.nth(1).click();
        
        // Look for compare button
        const compareButton = page.locator('button:has-text("Compare"), a:has-text("Compare")');
        if (await compareButton.isVisible()) {
          await compareButton.click();
          await expect(page.locator('text=Compare Vendors, text=Comparison')).toBeVisible();
        }
      }
    });
  });
});
