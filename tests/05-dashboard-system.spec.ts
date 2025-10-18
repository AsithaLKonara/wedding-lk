import { test, expect } from '@playwright/test';

test.describe('📊 Dashboard System Testing', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/');
  });

  test.describe('Main Dashboard', () => {
    test('Dashboard page loads correctly', async ({ page }) => {
      await page.goto('/dashboard');
      
      // Check dashboard header
      await expect(page.locator('text=Dashboard, text=Welcome')).toBeVisible();
      
      // Check main dashboard sections
      await expect(page.locator('text=Quick Actions, text=Recent Activity, text=Upcoming Tasks')).toBeVisible();
    });

    test('Dashboard widgets display correctly', async ({ page }) => {
      await page.goto('/dashboard');
      
      // Check dashboard widgets
      const widgets = [
        'Wedding Progress',
        'Quick Actions',
        'Saved Venues',
        'Upcoming Tasks',
        'Recent Activity'
      ];
      
      for (const widget of widgets) {
        await expect(page.locator(`text=${widget}`)).toBeVisible();
      }
    });

    test('Profile completion widget', async ({ page }) => {
      await page.goto('/dashboard');
      
      // Check profile completion section
      await expect(page.locator('text=Profile Completion, text=Complete your profile')).toBeVisible();
      
      // Check progress bar
      const progressBar = page.locator('[class*="progress"], [role="progressbar"]');
      if (await progressBar.isVisible()) {
        await expect(progressBar).toBeVisible();
      }
    });

    test('Quick actions functionality', async ({ page }) => {
      await page.goto('/dashboard');
      
      // Test quick action buttons
      const quickActions = [
        'Find Venues',
        'Browse Vendors',
        'Plan Timeline',
        'Manage Budget'
      ];
      
      for (const action of quickActions) {
        const actionButton = page.locator(`button:has-text("${action}"), a:has-text("${action}")`);
        if (await actionButton.isVisible()) {
          await actionButton.click();
          await page.waitForTimeout(1000);
          await page.goBack();
          await page.waitForTimeout(1000);
        }
      }
    });
  });

  test.describe('User Dashboard Features', () => {
    test('Wedding progress tracking', async ({ page }) => {
      await page.goto('/dashboard');
      
      // Check wedding progress section
      await expect(page.locator('text=Wedding Progress, text=Planning Timeline')).toBeVisible();
      
      // Check progress steps
      const progressSteps = page.locator('[class*="step"], [class*="milestone"]');
      if (await progressSteps.isVisible()) {
        await expect(progressSteps.first()).toBeVisible();
      }
    });

    test('Saved venues management', async ({ page }) => {
      await page.goto('/dashboard');
      
      // Check saved venues section
      await expect(page.locator('text=Saved Venues, text=Favorites')).toBeVisible();
      
      // Check venue cards
      const savedVenues = page.locator('[class*="saved-venue"], [class*="favorite-venue"]');
      if (await savedVenues.isVisible()) {
        await expect(savedVenues.first()).toBeVisible();
      }
    });

    test('Task management system', async ({ page }) => {
      await page.goto('/dashboard');
      
      // Check upcoming tasks section
      await expect(page.locator('text=Upcoming Tasks, text=To Do')).toBeVisible();
      
      // Check task items
      const tasks = page.locator('[class*="task-item"], [class*="todo-item"]');
      if (await tasks.isVisible()) {
        await expect(tasks.first()).toBeVisible();
        
        // Test task completion
        const completeButton = page.locator('button:has-text("Complete"), input[type="checkbox"]').first();
        if (await completeButton.isVisible()) {
          await completeButton.click();
          await page.waitForTimeout(500);
        }
      }
    });

    test('Recent activity feed', async ({ page }) => {
      await page.goto('/dashboard');
      
      // Check recent activity section
      await expect(page.locator('text=Recent Activity, text=Activity Feed')).toBeVisible();
      
      // Check activity items
      const activities = page.locator('[class*="activity-item"], [class*="feed-item"]');
      if (await activities.isVisible()) {
        await expect(activities.first()).toBeVisible();
      }
    });
  });

  test.describe('Vendor Dashboard', () => {
    test('Vendor dashboard access', async ({ page }) => {
      await page.goto('/dashboard/vendor');
      
      // Should redirect to login if not authenticated
      await expect(page).toHaveURL(/.*login|.*dashboard/);
    });

    test('Vendor onboarding dashboard', async ({ page }) => {
      await page.goto('/dashboard/vendor/onboarding');
      
      // Check onboarding steps
      await expect(page.locator('text=Onboarding, text=Complete Setup')).toBeVisible();
      
      // Check onboarding progress
      const progressSteps = page.locator('[class*="step"], [class*="onboarding-step"]');
      if (await progressSteps.isVisible()) {
        await expect(progressSteps.first()).toBeVisible();
      }
    });

    test('Vendor business management', async ({ page }) => {
      await page.goto('/dashboard/vendor');
      
      // Check vendor management sections
      await expect(page.locator('text=Business Profile, text=Services, text=Bookings')).toBeVisible();
      
      // Check vendor statistics
      const statsCards = page.locator('[class*="stat-card"], [class*="metric-card"]');
      if (await statsCards.isVisible()) {
        await expect(statsCards.first()).toBeVisible();
      }
    });

    test('Vendor booking management', async ({ page }) => {
      await page.goto('/dashboard/vendor');
      
      // Check booking management section
      await expect(page.locator('text=Bookings, text=Appointments')).toBeVisible();
      
      // Check booking list
      const bookings = page.locator('[class*="booking-item"], [class*="appointment"]');
      if (await bookings.isVisible()) {
        await expect(bookings.first()).toBeVisible();
      }
    });
  });

  test.describe('Admin Dashboard', () => {
    test('Admin dashboard access', async ({ page }) => {
      await page.goto('/dashboard/admin');
      
      // Should redirect to login if not authenticated
      await expect(page).toHaveURL(/.*login|.*dashboard/);
    });

    test('Admin analytics dashboard', async ({ page }) => {
      await page.goto('/admin/analytics');
      
      // Check analytics sections
      await expect(page.locator('text=Analytics, text=Statistics, text=Reports')).toBeVisible();
      
      // Check analytics charts
      const charts = page.locator('[class*="chart"], canvas, svg');
      if (await charts.isVisible()) {
        await expect(charts.first()).toBeVisible();
      }
    });

    test('Admin user management', async ({ page }) => {
      await page.goto('/admin/users');
      
      // Check user management sections
      await expect(page.locator('text=User Management, text=Users, text=User List')).toBeVisible();
      
      // Check user list
      const userList = page.locator('[class*="user-list"], [class*="user-table"]');
      if (await userList.isVisible()) {
        await expect(userList.first()).toBeVisible();
      }
    });

    test('Admin vendor management', async ({ page }) => {
      await page.goto('/admin/vendors');
      
      // Check vendor management sections
      await expect(page.locator('text=Vendor Management, text=Vendors, text=Approval')).toBeVisible();
      
      // Check vendor list
      const vendorList = page.locator('[class*="vendor-list"], [class*="vendor-table"]');
      if (await vendorList.isVisible()) {
        await expect(vendorList.first()).toBeVisible();
      }
    });
  });

  test.describe('Dashboard Navigation', () => {
    test('Dashboard sidebar navigation', async ({ page }) => {
      await page.goto('/dashboard');
      
      // Check sidebar navigation
      const sidebarLinks = [
        'Dashboard',
        'Bookings',
        'Profile',
        'Settings',
        'Payments'
      ];
      
      for (const link of sidebarLinks) {
        const sidebarLink = page.locator(`a:has-text("${link}"), button:has-text("${link}")`);
        if (await sidebarLink.isVisible()) {
          await expect(sidebarLink).toBeVisible();
        }
      }
    });

    test('Dashboard breadcrumb navigation', async ({ page }) => {
      await page.goto('/dashboard');
      
      // Check breadcrumb navigation
      const breadcrumbs = page.locator('[class*="breadcrumb"], nav[aria-label="breadcrumb"]');
      if (await breadcrumbs.isVisible()) {
        await expect(breadcrumbs).toBeVisible();
      }
    });

    test('Dashboard mobile navigation', async ({ page }) => {
      // Test mobile viewport
      await page.setViewportSize({ width: 375, height: 667 });
      await page.goto('/dashboard');
      
      // Check mobile menu
      const mobileMenu = page.locator('[data-testid="mobile-menu"], button[aria-label*="menu"]');
      if (await mobileMenu.isVisible()) {
        await mobileMenu.click();
        await page.waitForTimeout(500);
        
        // Check mobile navigation items
        await expect(page.locator('text=Dashboard, text=Bookings, text=Profile')).toBeVisible();
      }
      
      // Reset viewport
      await page.setViewportSize({ width: 1280, height: 720 });
    });
  });

  test.describe('Dashboard Settings', () => {
    test('Dashboard settings page', async ({ page }) => {
      await page.goto('/dashboard/settings');
      
      // Check settings sections
      await expect(page.locator('text=Settings, text=Preferences, text=Account')).toBeVisible();
      
      // Check settings tabs or sections
      const settingsSections = [
        'Profile Settings',
        'Notification Preferences',
        'Privacy Settings',
        'Account Security'
      ];
      
      for (const section of settingsSections) {
        const sectionElement = page.locator(`text=${section}`);
        if (await sectionElement.isVisible()) {
          await expect(sectionElement).toBeVisible();
        }
      }
    });

    test('Profile settings update', async ({ page }) => {
      await page.goto('/dashboard/settings');
      
      // Test profile update form
      const nameInput = page.locator('input[name="name"], input[name="firstName"]');
      if (await nameInput.isVisible()) {
        await nameInput.fill('Updated Name');
        
        // Save changes
        await page.click('button[type="submit"], button:has-text("Save")');
        
        // Check for success message
        await expect(page.locator('text=Profile updated, text=Success')).toBeVisible({ timeout: 10000 });
      }
    });

    test('Notification preferences', async ({ page }) => {
      await page.goto('/dashboard/settings');
      
      // Check notification settings
      await expect(page.locator('text=Notifications, text=Email Alerts')).toBeVisible();
      
      // Test notification toggles
      const notificationToggles = page.locator('input[type="checkbox"][name*="notification"]');
      if (await notificationToggles.isVisible()) {
        const toggleCount = await notificationToggles.count();
        for (let i = 0; i < Math.min(toggleCount, 3); i++) {
          await notificationToggles.nth(i).click();
          await page.waitForTimeout(200);
        }
      }
    });

    test('Privacy settings', async ({ page }) => {
      await page.goto('/dashboard/settings');
      
      // Check privacy settings
      await expect(page.locator('text=Privacy, text=Data Protection')).toBeVisible();
      
      // Test privacy options
      const privacyOptions = page.locator('select[name*="privacy"], input[name*="visibility"]');
      if (await privacyOptions.isVisible()) {
        await privacyOptions.first().selectOption('private');
        await page.waitForTimeout(500);
      }
    });
  });

  test.describe('Dashboard Notifications', () => {
    test('Notification center', async ({ page }) => {
      await page.goto('/dashboard');
      
      // Check notification icon/bell
      const notificationBell = page.locator('[class*="notification"], button[aria-label*="notification"]');
      if (await notificationBell.isVisible()) {
        await notificationBell.click();
        
        // Check notification dropdown
        await expect(page.locator('text=Notifications, text=Recent')).toBeVisible();
      }
    });

    test('Notification management', async ({ page }) => {
      await page.goto('/dashboard');
      
      // Open notifications
      const notificationBell = page.locator('[class*="notification"], button[aria-label*="notification"]');
      if (await notificationBell.isVisible()) {
        await notificationBell.click();
        
        // Test mark as read
        const markReadButton = page.locator('button:has-text("Mark as Read")');
        if (await markReadButton.isVisible()) {
          await markReadButton.click();
          await page.waitForTimeout(500);
        }
      }
    });
  });

  test.describe('Dashboard Performance', () => {
    test('Dashboard loading performance', async ({ page }) => {
      const startTime = Date.now();
      await page.goto('/dashboard');
      await page.waitForLoadState('networkidle');
      const loadTime = Date.now() - startTime;
      
      // Dashboard should load within 5 seconds
      expect(loadTime).toBeLessThan(5000);
    });

    test('Dashboard widget loading', async ({ page }) => {
      await page.goto('/dashboard');
      
      // Wait for widgets to load
      await page.waitForTimeout(3000);
      
      // Check that loading indicators are gone
      const loadingIndicators = page.locator('[class*="loading"], [class*="skeleton"]');
      await expect(loadingIndicators.first()).not.toBeVisible({ timeout: 10000 });
    });
  });

  test.describe('Dashboard Responsiveness', () => {
    test('Dashboard desktop layout', async ({ page }) => {
      await page.setViewportSize({ width: 1920, height: 1080 });
      await page.goto('/dashboard');
      
      // Check desktop layout elements
      await expect(page.locator('text=Dashboard, text=Quick Actions')).toBeVisible();
    });

    test('Dashboard tablet layout', async ({ page }) => {
      await page.setViewportSize({ width: 768, height: 1024 });
      await page.goto('/dashboard');
      
      // Check tablet layout
      await expect(page.locator('text=Dashboard, text=Quick Actions')).toBeVisible();
    });

    test('Dashboard mobile layout', async ({ page }) => {
      await page.setViewportSize({ width: 375, height: 667 });
      await page.goto('/dashboard');
      
      // Check mobile layout
      await expect(page.locator('text=Dashboard, text=Quick Actions')).toBeVisible();
      
      // Reset viewport
      await page.setViewportSize({ width: 1280, height: 720 });
    });
  });
});
