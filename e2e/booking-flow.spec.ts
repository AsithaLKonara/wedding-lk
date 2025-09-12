import { test, expect } from '@playwright/test';

test.describe('Booking Flow', () => {
  test.beforeEach(async ({ page }) => {
    // Mock user session
    await page.addInitScript(() => {
      window.localStorage.setItem('user', JSON.stringify({
        id: 'user-id',
        name: 'Test User',
        email: 'test@example.com',
        role: 'user'
      }));
    });
  });

  test('should complete full booking flow', async ({ page }) => {
    // Mock API responses
    await page.route('**/api/venues', async route => {
      await route.fulfill({
        status: 200,
        contentType: 'application/json',
        body: JSON.stringify({
          success: true,
          data: [
            {
              _id: 'venue-id-1',
              name: 'Grand Ballroom',
              description: 'Elegant ballroom for weddings',
              location: 'Colombo',
              capacity: 200,
              pricePerHour: 50000,
              images: ['https://example.com/venue1.jpg'],
              amenities: ['parking', 'catering', 'sound-system']
            }
          ]
        })
      });
    });

    await page.route('**/api/bookings', async route => {
      if (route.request().method() === 'POST') {
        await route.fulfill({
          status: 201,
          contentType: 'application/json',
          body: JSON.stringify({
            success: true,
            data: {
              _id: 'booking-id-1',
              venueId: 'venue-id-1',
              userId: 'user-id',
              eventDate: '2024-12-25T10:00:00Z',
              startTime: '10:00',
              endTime: '18:00',
              guestCount: 150,
              totalAmount: 500000,
              status: 'pending'
            }
          })
        });
      } else {
        await route.fulfill({
          status: 200,
          contentType: 'application/json',
          body: JSON.stringify({
            success: true,
            data: []
          })
        });
      }
    });

    // Step 1: Browse venues
    await page.goto('/venues');
    await expect(page.locator('text=Grand Ballroom')).toBeVisible();
    
    // Step 2: View venue details
    await page.click('text=Grand Ballroom');
    await expect(page).toHaveURL(/\/venues\/.*/);
    await expect(page.locator('text=Elegant ballroom for weddings')).toBeVisible();
    
    // Step 3: Start booking process
    await page.click('text=Book Now');
    
    // Step 4: Fill booking form
    await page.fill('input[name="eventDate"]', '2024-12-25');
    await page.fill('input[name="startTime"]', '10:00');
    await page.fill('input[name="endTime"]', '18:00');
    await page.fill('input[name="guestCount"]', '150');
    await page.fill('textarea[name="specialRequests"]', 'Vegetarian menu required');
    
    // Step 5: Submit booking
    await page.click('button[type="submit"]');
    
    // Step 6: Verify booking confirmation
    await expect(page.locator('text=Booking Confirmed')).toBeVisible();
    await expect(page.locator('text=LKR 500,000')).toBeVisible();
  });

  test('should handle booking validation errors', async ({ page }) => {
    await page.goto('/venues/venue-id-1/book');
    
    // Try to submit empty form
    await page.click('button[type="submit"]');
    
    // Check for validation errors
    await expect(page.locator('text=Event date is required')).toBeVisible();
    await expect(page.locator('text=Start time is required')).toBeVisible();
    await expect(page.locator('text=End time is required')).toBeVisible();
    await expect(page.locator('text=Guest count is required')).toBeVisible();
  });

  test('should handle booking API errors', async ({ page }) => {
    // Mock failed booking API response
    await page.route('**/api/bookings', async route => {
      await route.fulfill({
        status: 400,
        contentType: 'application/json',
        body: JSON.stringify({
          success: false,
          error: 'Venue not available for selected date'
        })
      });
    });

    await page.goto('/venues/venue-id-1/book');
    
    // Fill valid booking data
    await page.fill('input[name="eventDate"]', '2024-12-25');
    await page.fill('input[name="startTime"]', '10:00');
    await page.fill('input[name="endTime"]', '18:00');
    await page.fill('input[name="guestCount"]', '150');
    
    await page.click('button[type="submit"]');
    
    // Should show error message
    await expect(page.locator('text=Venue not available for selected date')).toBeVisible();
  });

  test('should display booking history', async ({ page }) => {
    // Mock bookings API response
    await page.route('**/api/bookings', async route => {
      await route.fulfill({
        status: 200,
        contentType: 'application/json',
        body: JSON.stringify({
          success: true,
          data: [
            {
              _id: 'booking-id-1',
              venue: {
                name: 'Grand Ballroom',
                location: 'Colombo'
              },
              eventDate: '2024-12-25T10:00:00Z',
              startTime: '10:00',
              endTime: '18:00',
              guestCount: 150,
              totalAmount: 500000,
              status: 'confirmed'
            }
          ]
        })
      });
    });

    await page.goto('/dashboard/user/bookings');
    
    await expect(page.locator('text=Grand Ballroom')).toBeVisible();
    await expect(page.locator('text=Colombo')).toBeVisible();
    await expect(page.locator('text=Dec 25, 2024')).toBeVisible();
    await expect(page.locator('text=LKR 500,000')).toBeVisible();
    await expect(page.locator('text=confirmed')).toBeVisible();
  });

  test('should allow booking cancellation', async ({ page }) => {
    // Mock cancel booking API response
    await page.route('**/api/bookings/booking-id-1/cancel', async route => {
      await route.fulfill({
        status: 200,
        contentType: 'application/json',
        body: JSON.stringify({
          success: true,
          message: 'Booking cancelled successfully'
        })
      });
    });

    await page.goto('/dashboard/user/bookings');
    
    // Click cancel button
    await page.click('button:has-text("Cancel")');
    
    // Confirm cancellation
    await page.click('button:has-text("Confirm")');
    
    // Should show success message
    await expect(page.locator('text=Booking cancelled successfully')).toBeVisible();
  });
});

test.describe('Payment Integration', () => {
  test.beforeEach(async ({ page }) => {
    // Mock user session
    await page.addInitScript(() => {
      window.localStorage.setItem('user', JSON.stringify({
        id: 'user-id',
        name: 'Test User',
        email: 'test@example.com',
        role: 'user'
      }));
    });
  });

  test('should redirect to payment page after booking', async ({ page }) => {
    // Mock successful booking creation
    await page.route('**/api/bookings', async route => {
      await route.fulfill({
        status: 201,
        contentType: 'application/json',
        body: JSON.stringify({
          success: true,
          data: {
            _id: 'booking-id-1',
            totalAmount: 500000,
            status: 'pending_payment'
          }
        })
      });
    });

    await page.goto('/venues/venue-id-1/book');
    
    // Fill and submit booking form
    await page.fill('input[name="eventDate"]', '2024-12-25');
    await page.fill('input[name="startTime"]', '10:00');
    await page.fill('input[name="endTime"]', '18:00');
    await page.fill('input[name="guestCount"]', '150');
    await page.click('button[type="submit"]');
    
    // Should redirect to payment page
    await expect(page).toHaveURL('/checkout');
    await expect(page.locator('text=LKR 500,000')).toBeVisible();
  });

  test('should handle payment success', async ({ page }) => {
    // Mock payment success
    await page.route('**/api/payments/session/session-id', async route => {
      await route.fulfill({
        status: 200,
        contentType: 'application/json',
        body: JSON.stringify({
          success: true,
          data: {
            id: 'payment-id-1',
            amount: 500000,
            status: 'completed',
            bookingId: 'booking-id-1'
          }
        })
      });
    });

    await page.goto('/payments/success?session_id=session-id');
    
    await expect(page.locator('text=Payment Successful')).toBeVisible();
    await expect(page.locator('text=LKR 500,000')).toBeVisible();
  });

  test('should handle payment cancellation', async ({ page }) => {
    await page.goto('/payments/cancel');
    
    await expect(page.locator('text=Payment Cancelled')).toBeVisible();
    await expect(page.locator('text=Try Again')).toBeVisible();
  });
});


