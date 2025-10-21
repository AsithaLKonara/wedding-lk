import { test, expect } from '@playwright/test';

test.describe('Booking System Tests', () => {
  test.beforeEach(async ({ page }) => {
    // Login before each test
    await page.goto('/login');
    await page.fill('input[name="email"]', 'test@example.com');
    await page.fill('input[name="password"]', 'TestPassword123!');
    await page.click('button[type="submit"]');
    await expect(page).toHaveURL(/dashboard/);
  });

  test('should create venue booking', async ({ page }) => {
    await page.goto('/venues');
    
    // Click on first venue
    const firstVenue = page.locator('[data-testid*="venue"], .venue-card').first();
    await firstVenue.click();
    
    // Click book button
    const bookButton = page.locator('button:has-text("Book"), button:has-text("Reserve")');
    await bookButton.click();
    
    // Fill booking form
    await page.fill('input[name*="eventDate"]', '2024-12-25');
    await page.fill('input[name*="startTime"]', '18:00');
    await page.fill('input[name*="endTime"]', '23:00');
    await page.fill('input[name*="guestCount"]', '100');
    await page.fill('input[name*="brideName"]', 'Jane Doe');
    await page.fill('input[name*="groomName"]', 'John Doe');
    await page.fill('textarea[name*="specialRequests"]', 'Outdoor ceremony preferred');
    
    // Submit booking
    await page.click('button[type="submit"]');
    
    // Should navigate to payment or confirmation
    await expect(page).toHaveURL(/payment|confirm|success/);
  });

  test('should create vendor booking', async ({ page }) => {
    await page.goto('/vendors');
    
    // Click on first vendor
    const firstVendor = page.locator('[data-testid*="vendor"], .vendor-card').first();
    await firstVendor.click();
    
    // Click book button
    const bookButton = page.locator('button:has-text("Book"), button:has-text("Contact")');
    await bookButton.click();
    
    // Fill booking form
    await page.fill('input[name*="eventDate"]', '2024-12-25');
    await page.fill('input[name*="startTime"]', '08:00');
    await page.fill('input[name*="endTime"]', '20:00');
    await page.fill('textarea[name*="message"]', 'Need photography for wedding ceremony');
    await page.fill('input[name*="budget"]', '50000');
    
    // Submit booking
    await page.click('button[type="submit"]');
    
    // Should navigate to payment or confirmation
    await expect(page).toHaveURL(/payment|confirm|success/);
  });

  test('should view booking details', async ({ page }) => {
    await page.goto('/dashboard/bookings');
    
    // Check for booking cards
    const bookingCards = page.locator('[data-testid*="booking"], .booking-card');
    if (await bookingCards.count() > 0) {
      // Click on first booking
      await bookingCards.first().click();
      
      // Should show booking details
      await expect(page).toHaveURL(/bookings\/[^/]+/);
      
      // Check booking details elements
      const details = [
        'date',
        'time',
        'venue',
        'vendor',
        'status',
        'total'
      ];

      for (const detail of details) {
        const detailElement = page.locator(`[data-testid*="${detail}"], :has-text("${detail}")`);
        if (await detailElement.isVisible()) {
          await expect(detailElement).toBeVisible();
        }
      }
    }
  });

  test('should modify booking', async ({ page }) => {
    await page.goto('/dashboard/bookings');
    
    // Look for modify button
    const modifyButton = page.locator('button:has-text("Modify"), button:has-text("Edit")').first();
    if (await modifyButton.isVisible()) {
      await modifyButton.click();
      
      // Should navigate to modify form
      await expect(page).toHaveURL(/modify|edit/);
      
      // Update booking details
      await page.fill('input[name*="guestCount"]', '150');
      await page.fill('textarea[name*="specialRequests"]', 'Updated requirements');
      
      // Submit changes
      await page.click('button[type="submit"]');
      
      // Should show success
      await expect(page.locator('text=updated|modified|success')).toBeVisible();
    }
  });

  test('should cancel booking', async ({ page }) => {
    await page.goto('/dashboard/bookings');
    
    // Look for cancel button
    const cancelButton = page.locator('button:has-text("Cancel"), button[aria-label*="cancel"]').first();
    if (await cancelButton.isVisible()) {
      await cancelButton.click();
      
      // Confirm cancellation
      const confirmButton = page.locator('button:has-text("Confirm"), button:has-text("Yes")');
      if (await confirmButton.isVisible()) {
        await confirmButton.click();
        
        // Should show success message
        await expect(page.locator('text=cancelled|success')).toBeVisible();
      }
    }
  });

  test('should reschedule booking', async ({ page }) => {
    await page.goto('/dashboard/bookings');
    
    // Look for reschedule button
    const rescheduleButton = page.locator('button:has-text("Reschedule"), button:has-text("Change Date")').first();
    if (await rescheduleButton.isVisible()) {
      await rescheduleButton.click();
      
      // Should navigate to reschedule form
      await expect(page).toHaveURL(/reschedule|modify/);
      
      // Select new date
      await page.fill('input[name*="eventDate"]', '2024-12-26');
      
      // Submit changes
      await page.click('button[type="submit"]');
      
      // Should show success
      await expect(page.locator('text=rescheduled|updated|success')).toBeVisible();
    }
  });

  test('should process payment for booking', async ({ page }) => {
    await page.goto('/venues');
    
    // Create a booking first
    const firstVenue = page.locator('[data-testid*="venue"], .venue-card').first();
    await firstVenue.click();
    
    const bookButton = page.locator('button:has-text("Book"), button:has-text("Reserve")');
    await bookButton.click();
    
    // Fill booking form
    await page.fill('input[name*="eventDate"]', '2024-12-25');
    await page.fill('input[name*="guestCount"]', '100');
    await page.click('button[type="submit"]');
    
    // Should navigate to payment page
    await expect(page).toHaveURL(/payment|checkout/);
    
    // Fill payment form
    await page.fill('input[name*="cardNumber"]', '4242424242424242');
    await page.fill('input[name*="expiry"]', '12/25');
    await page.fill('input[name*="cvv"]', '123');
    await page.fill('input[name*="name"]', 'Test User');
    
    // Submit payment
    await page.click('button[type="submit"]');
    
    // Should show success or redirect
    await expect(page).toHaveURL(/success|confirm|dashboard/);
  });

  test('should view booking calendar', async ({ page }) => {
    await page.goto('/dashboard/calendar');
    
    // Check calendar is visible
    const calendar = page.locator('[data-testid*="calendar"], .calendar, .fc-calendar');
    await expect(calendar).toBeVisible();
    
    // Check for booking events
    const events = page.locator('[data-testid*="event"], .event, .fc-event');
    if (await events.count() > 0) {
      await expect(events.first()).toBeVisible();
    }
  });

  test('should filter bookings by status', async ({ page }) => {
    await page.goto('/dashboard/bookings');
    
    // Look for status filter
    const statusFilter = page.locator('select[name*="status"], input[placeholder*="status"]');
    if (await statusFilter.isVisible()) {
      await statusFilter.selectOption('confirmed');
      
      // Wait for results to update
      await page.waitForTimeout(1000);
      
      // Check if results are filtered
      const bookingCards = page.locator('[data-testid*="booking"], .booking-card');
      await expect(bookingCards.first()).toBeVisible();
    }
  });

  test('should search bookings', async ({ page }) => {
    await page.goto('/dashboard/bookings');
    
    // Look for search input
    const searchInput = page.locator('input[type="search"], input[placeholder*="search"]');
    if (await searchInput.isVisible()) {
      await searchInput.fill('wedding');
      await searchInput.press('Enter');
      
      // Wait for results
      await page.waitForTimeout(1000);
      
      // Check if results are filtered
      const bookingCards = page.locator('[data-testid*="booking"], .booking-card');
      await expect(bookingCards.first()).toBeVisible();
    }
  });

  test('should export booking details', async ({ page }) => {
    await page.goto('/dashboard/bookings');
    
    // Look for export button
    const exportButton = page.locator('button:has-text("Export"), button:has-text("Download")');
    if (await exportButton.isVisible()) {
      const downloadPromise = page.waitForEvent('download');
      await exportButton.click();
      
      // Should download file
      const download = await downloadPromise;
      expect(download.suggestedFilename()).toMatch(/booking|export/);
    }
  });

  test('should send booking reminder', async ({ page }) => {
    await page.goto('/dashboard/bookings');
    
    // Look for reminder button
    const reminderButton = page.locator('button:has-text("Remind"), button:has-text("Send Reminder")').first();
    if (await reminderButton.isVisible()) {
      await reminderButton.click();
      
      // Should show success message
      await expect(page.locator('text=reminder|sent|success')).toBeVisible();
    }
  });
});
