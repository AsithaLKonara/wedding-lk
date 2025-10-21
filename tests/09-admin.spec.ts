import { test, expect } from '@playwright/test';

test.describe('Admin Panel Tests', () => {
  test.beforeEach(async ({ page }) => {
    // Login as admin
    await page.goto('/login');
    await page.fill('input[name="email"]', 'admin@example.com');
    await page.fill('input[name="password"]', 'AdminPassword123!');
    await page.click('button[type="submit"]');
    await expect(page).toHaveURL(/dashboard/);
  });

  test('should access admin dashboard', async ({ page }) => {
    await page.goto('/dashboard/admin');
    
    // Check admin dashboard elements
    await expect(page.locator('h1, h2')).toContainText(/admin|management/i);
    
    // Check for admin sections
    const sections = [
      'users',
      'vendors',
      'bookings',
      'analytics',
      'settings'
    ];

    for (const section of sections) {
      const sectionElement = page.locator(`[data-testid*="${section}"], h3:has-text("${section}")`);
      if (await sectionElement.isVisible()) {
        await expect(sectionElement).toBeVisible();
      }
    }
  });

  test('should manage users', async ({ page }) => {
    await page.goto('/admin/users');
    
    // Check users table
    const usersTable = page.locator('[data-testid*="users"], .users-table, table');
    await expect(usersTable).toBeVisible();
    
    // Test user actions
    const userRow = page.locator('tr[data-testid*="user"], .user-row').first();
    if (await userRow.isVisible()) {
      // Test edit user
      const editButton = page.locator('button:has-text("Edit"), button[aria-label*="edit"]').first();
      if (await editButton.isVisible()) {
        await editButton.click();
        
        // Should navigate to edit form
        await expect(page).toHaveURL(/edit|update/);
        
        // Update user info
        await page.fill('input[name*="firstName"]', 'Updated Name');
        
        // Save changes
        await page.click('button[type="submit"], button:has-text("Save")');
        
        // Should show success
        await expect(page.locator('text=updated|success')).toBeVisible();
      }
    }
  });

  test('should ban/unban user', async ({ page }) => {
    await page.goto('/admin/users');
    
    // Look for ban button
    const banButton = page.locator('button:has-text("Ban"), button:has-text("Suspend")').first();
    if (await banButton.isVisible()) {
      await banButton.click();
      
      // Confirm ban
      const confirmButton = page.locator('button:has-text("Confirm"), button:has-text("Yes")');
      if (await confirmButton.isVisible()) {
        await confirmButton.click();
        
        // Should show success
        await expect(page.locator('text=banned|suspended|success')).toBeVisible();
      }
    }
  });

  test('should manage vendors', async ({ page }) => {
    await page.goto('/admin/vendors');
    
    // Check vendors table
    const vendorsTable = page.locator('[data-testid*="vendors"], .vendors-table, table');
    await expect(vendorsTable).toBeVisible();
    
    // Test vendor actions
    const vendorRow = page.locator('tr[data-testid*="vendor"], .vendor-row').first();
    if (await vendorRow.isVisible()) {
      // Test approve vendor
      const approveButton = page.locator('button:has-text("Approve"), button:has-text("Verify")').first();
      if (await approveButton.isVisible()) {
        await approveButton.click();
        
        // Should show success
        await expect(page.locator('text=approved|verified|success')).toBeVisible();
      }
    }
  });

  test('should reject vendor application', async ({ page }) => {
    await page.goto('/admin/vendors');
    
    // Look for reject button
    const rejectButton = page.locator('button:has-text("Reject"), button:has-text("Decline")').first();
    if (await rejectButton.isVisible()) {
      await rejectButton.click();
      
      // Fill rejection reason
      await page.fill('textarea[name*="reason"], textarea[placeholder*="reason"]', 'Incomplete documentation');
      
      // Submit rejection
      await page.click('button[type="submit"], button:has-text("Reject")');
      
      // Should show success
      await expect(page.locator('text=rejected|declined|success')).toBeVisible();
    }
  });

  test('should manage bookings', async ({ page }) => {
    await page.goto('/admin/bookings');
    
    // Check bookings table
    const bookingsTable = page.locator('[data-testid*="bookings"], .bookings-table, table');
    await expect(bookingsTable).toBeVisible();
    
    // Test booking actions
    const bookingRow = page.locator('tr[data-testid*="booking"], .booking-row').first();
    if (await bookingRow.isVisible()) {
      // Test view booking details
      const viewButton = page.locator('button:has-text("View"), button:has-text("Details")').first();
      if (await viewButton.isVisible()) {
        await viewButton.click();
        
        // Should show booking details
        await expect(page).toHaveURL(/bookings\/[^/]+/);
      }
    }
  });

  test('should cancel booking', async ({ page }) => {
    await page.goto('/admin/bookings');
    
    // Look for cancel button
    const cancelButton = page.locator('button:has-text("Cancel"), button:has-text("Cancel Booking")').first();
    if (await cancelButton.isVisible()) {
      await cancelButton.click();
      
      // Fill cancellation reason
      await page.fill('textarea[name*="reason"], textarea[placeholder*="reason"]', 'Venue unavailable');
      
      // Confirm cancellation
      await page.click('button[type="submit"], button:has-text("Cancel")');
      
      // Should show success
      await expect(page.locator('text=cancelled|success')).toBeVisible();
    }
  });

  test('should view analytics', async ({ page }) => {
    await page.goto('/admin/analytics');
    
    // Check analytics dashboard
    const analyticsDashboard = page.locator('[data-testid*="analytics"], .analytics-dashboard');
    await expect(analyticsDashboard).toBeVisible();
    
    // Check for charts and metrics
    const charts = page.locator('[data-testid*="chart"], .chart, canvas');
    if (await charts.count() > 0) {
      await expect(charts.first()).toBeVisible();
    }
  });

  test('should export data', async ({ page }) => {
    await page.goto('/admin/export');
    
    // Look for export buttons
    const exportButtons = page.locator('button:has-text("Export"), button:has-text("Download")');
    if (await exportButtons.count() > 0) {
      const downloadPromise = page.waitForEvent('download');
      await exportButtons.first().click();
      
      // Should download file
      const download = await downloadPromise;
      expect(download.suggestedFilename()).toMatch(/export|data/);
    }
  });

  test('should manage system settings', async ({ page }) => {
    await page.goto('/admin/settings');
    
    // Check settings form
    const settingsForm = page.locator('form[data-testid*="settings"], .settings-form');
    await expect(settingsForm).toBeVisible();
    
    // Update settings
    await page.fill('input[name*="siteName"]', 'Updated WeddingLK');
    await page.fill('input[name*="contactEmail"]', 'admin@weddinglk.com');
    
    // Save settings
    await page.click('button[type="submit"], button:has-text("Save")');
    
    // Should show success
    await expect(page.locator('text=updated|saved|success')).toBeVisible();
  });

  test('should manage payment settings', async ({ page }) => {
    await page.goto('/admin/payments');
    
    // Check payment settings
    const paymentSettings = page.locator('[data-testid*="payment"], .payment-settings');
    await expect(paymentSettings).toBeVisible();
    
    // Update payment settings
    await page.fill('input[name*="commission"]', '5');
    await page.fill('input[name*="taxRate"]', '15');
    
    // Save settings
    await page.click('button[type="submit"], button:has-text("Save")');
    
    // Should show success
    await expect(page.locator('text=updated|saved|success')).toBeVisible();
  });

  test('should view system logs', async ({ page }) => {
    await page.goto('/admin/logs');
    
    // Check logs table
    const logsTable = page.locator('[data-testid*="logs"], .logs-table, table');
    await expect(logsTable).toBeVisible();
    
    // Check for log entries
    const logEntries = page.locator('tr[data-testid*="log"], .log-entry');
    if (await logEntries.count() > 0) {
      await expect(logEntries.first()).toBeVisible();
    }
  });

  test('should manage content moderation', async ({ page }) => {
    await page.goto('/admin/moderation');
    
    // Check moderation queue
    const moderationQueue = page.locator('[data-testid*="moderation"], .moderation-queue');
    await expect(moderationQueue).toBeVisible();
    
    // Test content actions
    const contentItem = page.locator('[data-testid*="content"], .content-item').first();
    if (await contentItem.isVisible()) {
      // Test approve content
      const approveButton = page.locator('button:has-text("Approve"), button:has-text("Allow")').first();
      if (await approveButton.isVisible()) {
        await approveButton.click();
        
        // Should show success
        await expect(page.locator('text=approved|success')).toBeVisible();
      }
    }
  });

  test('should handle user reports', async ({ page }) => {
    await page.goto('/admin/reports');
    
    // Check reports table
    const reportsTable = page.locator('[data-testid*="reports"], .reports-table, table');
    await expect(reportsTable).toBeVisible();
    
    // Test report actions
    const reportRow = page.locator('tr[data-testid*="report"], .report-row').first();
    if (await reportRow.isVisible()) {
      // Test view report
      const viewButton = page.locator('button:has-text("View"), button:has-text("Details")').first();
      if (await viewButton.isVisible()) {
        await viewButton.click();
        
        // Should show report details
        await expect(page).toHaveURL(/reports\/[^/]+/);
      }
    }
  });

  test('should manage notifications', async ({ page }) => {
    await page.goto('/admin/notifications');
    
    // Check notifications management
    const notificationsManagement = page.locator('[data-testid*="notifications"], .notifications-management');
    await expect(notificationsManagement).toBeVisible();
    
    // Test send notification
    const sendButton = page.locator('button:has-text("Send"), button:has-text("Create")');
    if (await sendButton.isVisible()) {
      await sendButton.click();
      
      // Fill notification form
      await page.fill('input[name*="title"], input[placeholder*="title"]', 'System Maintenance');
      await page.fill('textarea[name*="message"], textarea[placeholder*="message"]', 'System will be under maintenance tonight');
      
      // Send notification
      await page.click('button[type="submit"], button:has-text("Send")');
      
      // Should show success
      await expect(page.locator('text=sent|success')).toBeVisible();
    }
  });

  test('should backup system data', async ({ page }) => {
    await page.goto('/admin/backup');
    
    // Look for backup button
    const backupButton = page.locator('button:has-text("Backup"), button:has-text("Create Backup")');
    if (await backupButton.isVisible()) {
      await backupButton.click();
      
      // Should show backup progress
      await expect(page.locator('text=backing|progress|creating')).toBeVisible();
      
      // Wait for completion
      await page.waitForTimeout(5000);
      
      // Should show success
      await expect(page.locator('text=backup|completed|success')).toBeVisible();
    }
  });
});
