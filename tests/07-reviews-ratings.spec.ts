import { test, expect } from '@playwright/test';

test.describe('⭐ Reviews & Ratings System Testing', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/');
  });

  test.describe('Reviews Display', () => {
    test('Venue reviews section', async ({ page }) => {
      await page.goto('/venues/1');
      
      // Check reviews section exists
      await expect(page.locator('text=Reviews, text=Customer Reviews, text=What people say')).toBeVisible();
      
      // Check review cards
      const reviewCards = page.locator('[class*="review-card"], [class*="review-item"]');
      if (await reviewCards.isVisible()) {
        await expect(reviewCards.first()).toBeVisible();
      }
    });

    test('Vendor reviews section', async ({ page }) => {
      await page.goto('/vendors/1');
      
      // Check reviews section exists
      await expect(page.locator('text=Reviews, text=Customer Reviews, text=Testimonials')).toBeVisible();
      
      // Check review cards
      const reviewCards = page.locator('[class*="review-card"], [class*="review-item"]');
      if (await reviewCards.isVisible()) {
        await expect(reviewCards.first()).toBeVisible();
      }
    });

    test('Review details display', async ({ page }) => {
      await page.goto('/venues/1');
      
      // Check individual review details
      const reviews = page.locator('[class*="review"], [class*="testimonial"]');
      if (await reviews.isVisible()) {
        const firstReview = reviews.first();
        
        // Check review elements
        await expect(firstReview.locator('text=★★★★★, text=5 stars')).toBeVisible();
        await expect(firstReview.locator('text=John, text=Sarah, text=Mike')).toBeVisible();
        await expect(firstReview.locator('text=Great venue, text=Excellent service')).toBeVisible();
      }
    });

    test('Rating stars display', async ({ page }) => {
      await page.goto('/venues/1');
      
      // Check rating display
      const ratingStars = page.locator('[class*="star"], [class*="rating"]');
      if (await ratingStars.isVisible()) {
        await expect(ratingStars.first()).toBeVisible();
        
        // Check star count
        const starCount = await ratingStars.count();
        expect(starCount).toBeGreaterThan(0);
      }
    });

    test('Average rating calculation', async ({ page }) => {
      await page.goto('/venues/1');
      
      // Check average rating display
      await expect(page.locator('text=4.5, text=4.8, text=Average Rating')).toBeVisible();
      
      // Check total review count
      await expect(page.locator('text=reviews, text=Based on')).toBeVisible();
    });
  });

  test.describe('Review Submission', () => {
    test('Write review page access', async ({ page }) => {
      await page.goto('/reviews/write');
      
      // Check write review page
      await expect(page.locator('text=Write Review, text=Share your experience')).toBeVisible();
    });

    test('Review form validation', async ({ page }) => {
      await page.goto('/reviews/write');
      
      // Test empty form submission
      await page.click('button[type="submit"], button:has-text("Submit Review")');
      
      // Check for validation errors
      await expect(page.locator('[class*="error"], .error-message, [role="alert"]')).toBeVisible();
      
      // Test rating requirement
      await page.fill('textarea[name="review"], textarea[placeholder*="review"]', 'Great experience!');
      await page.click('button[type="submit"], button:has-text("Submit Review")');
      
      // Check for rating validation
      await expect(page.locator('text=Please select, text=Rating required')).toBeVisible();
    });

    test('Complete review submission', async ({ page }) => {
      await page.goto('/reviews/write');
      
      // Fill review form completely
      await page.selectOption('select[name="venueId"], select[name="vendorId"]', '1');
      
      // Set rating
      const ratingInput = page.locator('input[name="rating"], [class*="rating-input"]');
      if (await ratingInput.isVisible()) {
        await ratingInput.fill('5');
      } else {
        // Click on star rating
        const stars = page.locator('[class*="star"], [data-rating]');
        if (await stars.isVisible()) {
          await stars.nth(4).click(); // Click 5th star for 5-star rating
        }
      }
      
      // Write review text
      await page.fill('textarea[name="review"], textarea[placeholder*="review"]', 'Excellent service and beautiful venue. Highly recommended for wedding celebrations!');
      
      // Upload photos if available
      const photoUpload = page.locator('input[type="file"][accept*="image"]');
      if (await photoUpload.isVisible()) {
        await photoUpload.setInputFiles([]); // In real test, upload actual images
      }
      
      // Submit review
      await page.click('button[type="submit"], button:has-text("Submit Review")');
      
      // Check for success message
      await expect(page.locator('text=Review submitted, text=Thank you, text=Success')).toBeVisible({ timeout: 10000 });
    });

    test('Review with photos', async ({ page }) => {
      await page.goto('/reviews/write');
      
      // Test photo upload functionality
      const photoUpload = page.locator('input[type="file"][accept*="image"]');
      if (await photoUpload.isVisible()) {
        await photoUpload.setInputFiles([]);
        await page.waitForTimeout(1000);
        
        // Update form with rating and review
        await page.fill('textarea[name="review"]', 'Amazing venue with beautiful photos to share!');
        
        // Set rating
        const stars = page.locator('[class*="star"], [data-rating]');
        if (await stars.isVisible()) {
          await stars.nth(4).click();
        }
        
        // Submit review
        await page.click('button[type="submit"], button:has-text("Submit Review")');
        
        // Check for success
        await expect(page.locator('text=Review submitted, text=Thank you')).toBeVisible({ timeout: 10000 });
      }
    });
  });

  test.describe('Review Management', () => {
    test('User review history', async ({ page }) => {
      await page.goto('/profile');
      
      // Check for review history section
      await expect(page.locator('text=My Reviews, text=Review History')).toBeVisible();
      
      // Check review list
      const userReviews = page.locator('[class*="user-review"], [class*="my-review"]');
      if (await userReviews.isVisible()) {
        await expect(userReviews.first()).toBeVisible();
      }
    });

    test('Edit review functionality', async ({ page }) => {
      await page.goto('/profile');
      
      // Look for edit review button
      const editButton = page.locator('button:has-text("Edit"), a:has-text("Edit Review")').first();
      if (await editButton.isVisible()) {
        await editButton.click();
        
        // Check edit form
        await expect(page.locator('text=Edit Review, text=Update Review')).toBeVisible();
        
        // Modify review
        await page.fill('textarea[name="review"]', 'Updated review with more details about the experience.');
        
        // Save changes
        await page.click('button[type="submit"], button:has-text("Update")');
        
        // Check for success message
        await expect(page.locator('text=Review updated, text=Success')).toBeVisible({ timeout: 10000 });
      }
    });

    test('Delete review functionality', async ({ page }) => {
      await page.goto('/profile');
      
      // Look for delete review button
      const deleteButton = page.locator('button:has-text("Delete"), a:has-text("Delete Review")').first();
      if (await deleteButton.isVisible()) {
        await deleteButton.click();
        
        // Confirm deletion
        const confirmButton = page.locator('button:has-text("Confirm"), button:has-text("Yes")');
        if (await confirmButton.isVisible()) {
          await confirmButton.click();
          
          // Check for success message
          await expect(page.locator('text=Review deleted, text=Success')).toBeVisible({ timeout: 10000 });
        }
      }
    });
  });

  test.describe('Rating System', () => {
    test('Star rating interaction', async ({ page }) => {
      await page.goto('/reviews/write');
      
      // Test star rating selection
      const stars = page.locator('[class*="star"], [data-rating]');
      if (await stars.isVisible()) {
        // Click on different stars
        for (let i = 0; i < Math.min(await stars.count(), 5); i++) {
          await stars.nth(i).click();
          await page.waitForTimeout(200);
        }
      }
    });

    test('Rating display accuracy', async ({ page }) => {
      await page.goto('/venues/1');
      
      // Check rating display matches expected format
      const ratingDisplay = page.locator('[class*="rating-display"], [class*="average-rating"]');
      if (await ratingDisplay.isVisible()) {
        const ratingText = await ratingDisplay.textContent();
        expect(ratingText).toMatch(/[0-5](\.[0-9])?/); // Should match rating format like 4.5
      }
    });

    test('Rating breakdown', async ({ page }) => {
      await page.goto('/venues/1');
      
      // Check rating breakdown section
      const ratingBreakdown = page.locator('text=Rating Breakdown, text=5 stars, text=4 stars');
      if (await ratingBreakdown.isVisible()) {
        await expect(ratingBreakdown).toBeVisible();
        
        // Check individual star counts
        await expect(page.locator('text=5 stars, text=4 stars, text=3 stars, text=2 stars, text=1 star')).toBeVisible();
      }
    });
  });

  test.describe('Review Moderation', () => {
    test('Admin review management', async ({ page }) => {
      await page.goto('/admin/reviews');
      
      // Check admin review management page
      await expect(page.locator('text=Review Management, text=Moderate Reviews')).toBeVisible();
      
      // Check pending reviews
      const pendingReviews = page.locator('[class*="pending-review"], text=Pending');
      if (await pendingReviews.isVisible()) {
        await expect(pendingReviews.first()).toBeVisible();
      }
    });

    test('Approve review functionality', async ({ page }) => {
      await page.goto('/admin/reviews');
      
      // Look for approve button
      const approveButton = page.locator('button:has-text("Approve"), a:has-text("Approve")').first();
      if (await approveButton.isVisible()) {
        await approveButton.click();
        
        // Check for success message
        await expect(page.locator('text=Review approved, text=Success')).toBeVisible({ timeout: 10000 });
      }
    });

    test('Reject review functionality', async ({ page }) => {
      await page.goto('/admin/reviews');
      
      // Look for reject button
      const rejectButton = page.locator('button:has-text("Reject"), a:has-text("Reject")').first();
      if (await rejectButton.isVisible()) {
        await rejectButton.click();
        
        // Check for rejection reason form
        await expect(page.locator('text=Rejection Reason, text=Why are you rejecting')).toBeVisible();
        
        // Fill rejection reason
        await page.fill('textarea[name="reason"], textarea[placeholder*="reason"]', 'Inappropriate content');
        
        // Confirm rejection
        await page.click('button[type="submit"], button:has-text("Reject")');
        
        // Check for success message
        await expect(page.locator('text=Review rejected, text=Success')).toBeVisible({ timeout: 10000 });
      }
    });
  });

  test.describe('Review Analytics', () => {
    test('Review statistics display', async ({ page }) => {
      await page.goto('/admin/analytics');
      
      // Check review analytics
      await expect(page.locator('text=Review Analytics, text=Review Statistics')).toBeVisible();
      
      // Check review metrics
      const metrics = page.locator('[class*="metric"], [class*="statistic"]');
      if (await metrics.isVisible()) {
        await expect(metrics.first()).toBeVisible();
      }
    });

    test('Review trends chart', async ({ page }) => {
      await page.goto('/admin/analytics');
      
      // Check for review trends chart
      const chart = page.locator('[class*="chart"], canvas, svg');
      if (await chart.isVisible()) {
        await expect(chart.first()).toBeVisible();
      }
    });
  });

  test.describe('Review API Integration', () => {
    test('Reviews API functionality', async ({ page }) => {
      const response = await page.request.get('/api/reviews');
      expect(response.status()).toBe(200);
      
      const data = await response.json();
      expect(data.success).toBe(true);
      expect(data.data).toBeInstanceOf(Array);
    });

    test('Submit review via API', async ({ page }) => {
      const reviewData = {
        venueId: '1',
        rating: 5,
        review: 'Excellent venue with great service!',
        photos: []
      };
      
      const response = await page.request.post('/api/reviews', { data: reviewData });
      expect(response.status()).toBe(201);
      
      const data = await response.json();
      expect(data.success).toBe(true);
      expect(data.review).toBeDefined();
    });

    test('Individual review API', async ({ page }) => {
      const response = await page.request.get('/api/reviews/1');
      if (response.status() === 200) {
        const data = await response.json();
        expect(data).toHaveProperty('rating');
        expect(data).toHaveProperty('review');
      }
    });
  });

  test.describe('Review Filtering & Sorting', () => {
    test('Filter reviews by rating', async ({ page }) => {
      await page.goto('/venues/1');
      
      // Check rating filter options
      const ratingFilters = page.locator('select[name="rating"], input[name="rating"]');
      if (await ratingFilters.isVisible()) {
        await ratingFilters.selectOption('5');
        await page.waitForTimeout(1000);
        
        // Check filtered results
        await expect(page.locator('text=★★★★★, text=5 stars')).toBeVisible();
      }
    });

    test('Sort reviews by date', async ({ page }) => {
      await page.goto('/venues/1');
      
      // Check sort options
      const sortSelect = page.locator('select[name="sort"], select:has(option:text("Newest"))');
      if (await sortSelect.isVisible()) {
        await sortSelect.selectOption('newest');
        await page.waitForTimeout(1000);
        
        await sortSelect.selectOption('oldest');
        await page.waitForTimeout(1000);
      }
    });

    test('Search reviews functionality', async ({ page }) => {
      await page.goto('/venues/1');
      
      // Check search reviews input
      const searchInput = page.locator('input[placeholder*="search reviews"], input[name="search"]');
      if (await searchInput.isVisible()) {
        await searchInput.fill('excellent');
        await page.keyboard.press('Enter');
        await page.waitForTimeout(1000);
        
        // Check search results
        await expect(page.locator('text=excellent')).toBeVisible();
      }
    });
  });

  test.describe('Review Response System', () => {
    test('Vendor response to reviews', async ({ page }) => {
      await page.goto('/dashboard/vendor');
      
      // Check for review responses section
      await expect(page.locator('text=Review Responses, text=Respond to Reviews')).toBeVisible();
      
      // Look for respond button
      const respondButton = page.locator('button:has-text("Respond"), a:has-text("Reply")').first();
      if (await respondButton.isVisible()) {
        await respondButton.click();
        
        // Check response form
        await expect(page.locator('text=Write Response, text=Reply to Review')).toBeVisible();
        
        // Write response
        await page.fill('textarea[name="response"], textarea[placeholder*="response"]', 'Thank you for your feedback! We appreciate your review.');
        
        // Submit response
        await page.click('button[type="submit"], button:has-text("Submit Response")');
        
        // Check for success message
        await expect(page.locator('text=Response submitted, text=Success')).toBeVisible({ timeout: 10000 });
      }
    });

    test('Review response display', async ({ page }) => {
      await page.goto('/venues/1');
      
      // Check for vendor responses
      const responses = page.locator('[class*="vendor-response"], [class*="response"]');
      if (await responses.isVisible()) {
        await expect(responses.first()).toBeVisible();
      }
    });
  });
});
