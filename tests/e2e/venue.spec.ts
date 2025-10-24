import { test, expect } from '@playwright/test';
import { faker } from '@faker-js/faker';

test.describe('Venue Management', () => {
  test('Venue search and filtering', async ({ page }) => {
    await page.goto('/venues');
    
    // Search for venues
    await page.fill('input[placeholder*="Search venues"], input[name="search"]', 'Colombo');
    await page.click('button[type="submit"], button:has-text("Search")');
    
    // Apply filters
    await page.selectOption('select[name="capacity"]', '100-200');
    await page.selectOption('select[name="priceRange"]', '50000-100000');
    await page.check('input[name="amenities"][value="parking"]');
    await page.check('input[name="amenities"][value="air-conditioning"]');
    
    await page.click('button:has-text("Apply Filters")');
    
    // Verify results
    await expect(page.locator('.venue-card, [data-testid="venue-card"]')).toHaveCount.greaterThan(0);
  });

  test('Venue details and booking inquiry', async ({ page }) => {
    await page.goto('/venues');
    
    // Click on first venue
    await page.click('.venue-card:first-child, [data-testid="venue-card"]:first-child');
    await expect(page).toHaveURL(/\/venues\/\d+/);
    
    // Check venue details
    await expect(page.locator('text=Capacity')).toBeVisible();
    await expect(page.locator('text=Pricing')).toBeVisible();
    await expect(page.locator('text=Amenities')).toBeVisible();
    await expect(page.locator('text=Gallery')).toBeVisible();
    
    // Send booking inquiry
    await page.click('button:has-text("Send Inquiry"), [data-testid="inquiry-button"]');
    
    const inquiryData = {
      name: faker.person.fullName(),
      email: faker.internet.email(),
      phone: faker.phone.number(),
      eventDate: '2026-06-15',
      guestCount: 150,
      message: 'Interested in booking for our wedding'
    };
    
    await page.fill('input[name="name"]', inquiryData.name);
    await page.fill('input[name="email"]', inquiryData.email);
    await page.fill('input[name="phone"]', inquiryData.phone);
    await page.fill('input[name="eventDate"]', inquiryData.eventDate);
    await page.fill('input[name="guestCount"]', inquiryData.guestCount.toString());
    await page.fill('textarea[name="message"]', inquiryData.message);
    
    await page.click('button[type="submit"]');
    await expect(page.locator('text=Inquiry sent successfully')).toBeVisible();
  });

  test('Venue availability calendar', async ({ page }) => {
    await page.goto('/venues');
    await page.click('.venue-card:first-child, [data-testid="venue-card"]:first-child');
    
    // Check availability calendar
    await page.click('text=Check Availability, [data-testid="availability-button"]');
    await expect(page.locator('.calendar, [data-testid="availability-calendar"]')).toBeVisible();
    
    // Select a date
    await page.click('button:has-text("15"), [data-testid="date-15"]');
    await expect(page.locator('text=Available')).toBeVisible();
  });

  test('Venue reviews and ratings', async ({ page }) => {
    await page.goto('/venues');
    await page.click('.venue-card:first-child, [data-testid="venue-card"]:first-child');
    
    // Check reviews section
    await page.click('text=Reviews, [data-testid="reviews-tab"]');
    await expect(page.locator('.review, [data-testid="review-item"]')).toHaveCount.greaterThan(0);
    
    // Check rating display
    await expect(page.locator('.rating, [data-testid="rating"]')).toBeVisible();
  });

  test('Venue owner management', async ({ page }) => {
    // Login as venue owner
    await page.goto('/login');
    await page.fill('input[name="email"]', process.env.TEST_VENUE_OWNER_EMAIL || 'venue@test.local');
    await page.fill('input[name="password"]', process.env.TEST_VENUE_OWNER_PASSWORD || 'VenuePass123!');
    await page.click('button[type="submit"]');
    await expect(page).toHaveURL(/\/dashboard/);

    // Create new venue
    await page.goto('/dashboard/venue/create');
    
    const venueData = {
      name: faker.company.name() + ' Venue',
      description: 'Beautiful wedding venue with garden and indoor facilities',
      address: faker.location.streetAddress(),
      city: 'Colombo',
      capacity: 200,
      basePrice: 75000
    };
    
    await page.fill('input[name="name"]', venueData.name);
    await page.fill('textarea[name="description"]', venueData.description);
    await page.fill('input[name="address"]', venueData.address);
    await page.fill('input[name="city"]', venueData.city);
    await page.fill('input[name="capacity"]', venueData.capacity.toString());
    await page.fill('input[name="basePrice"]', venueData.basePrice.toString());
    
    // Upload venue images
    await page.setInputFiles('input[type="file"]', [
      'tests/fixtures/venue1.jpg',
      'tests/fixtures/venue2.jpg',
      'tests/fixtures/venue3.jpg'
    ]);
    
    await page.click('button[type="submit"]');
    await expect(page.locator('text=Venue created successfully')).toBeVisible();
  });

  test('Venue booking management', async ({ page }) => {
    // Login as venue owner
    await page.goto('/login');
    await page.fill('input[name="email"]', process.env.TEST_VENUE_OWNER_EMAIL || 'venue@test.local');
    await page.fill('input[name="password"]', process.env.TEST_VENUE_OWNER_PASSWORD || 'VenuePass123!');
    await page.click('button[type="submit"]');
    await expect(page).toHaveURL(/\/dashboard/);

    // Go to bookings
    await page.goto('/dashboard/venue/bookings');
    await expect(page.locator('text=Venue Bookings')).toBeVisible();
    
    // Create test booking
    const bookingResponse = await page.request.post('/api/test/create-venue-booking', {
      data: {
        venueId: 'test-venue-id',
        date: '2026-03-20',
        time: '18:00',
        duration: 6,
        guestCount: 120,
        customer: {
          name: 'Test Couple',
          email: 'couple@test.local',
          phone: '+94771234567'
        }
      }
    });
    expect(bookingResponse.ok()).toBeTruthy();
    
    // Accept booking
    await page.reload();
    await page.click('button:has-text("Accept"), [data-testid="accept-booking"]');
    await expect(page.locator('text=Booking accepted')).toBeVisible();
  });
});
