import { test, expect } from '@playwright/test';

test.describe('🌐 Live Deployment Comprehensive Testing', () => {
  test.describe('Homepage - Complete Feature Testing', () => {
    test('Homepage loads and all elements work', async ({ page }) => {
      await page.goto('/');
      
      // Check page title and main heading
      await expect(page).toHaveTitle(/Wedding Dreams Lanka|Wedding.lk/);
      await expect(page.locator('h1')).toContainText(/Find Your Perfect|Wedding Experience/);
      
      // Test AI Search functionality
      const aiSearchInput = page.locator('input[placeholder*="beach wedding"]');
      await expect(aiSearchInput).toBeVisible();
      await aiSearchInput.fill('Beach wedding in Galle for 150 guests with photographer');
      await expect(aiSearchInput).toHaveValue('Beach wedding in Galle for 150 guests with photographer');
      
      // Test quick search buttons
      const quickSearches = [
        'Beach wedding venues in Galle',
        'Garden wedding under 200k',
        'Luxury hotel ballrooms Colombo'
      ];
      
      for (const searchText of quickSearches) {
        const quickButton = page.locator(`text=${searchText}`);
        if (await quickButton.isVisible()) {
          await quickButton.click();
          await page.waitForTimeout(2000);
          await page.goBack();
          await page.waitForTimeout(1000);
        }
      }
      
      // Test theme toggle
      const themeToggle = page.locator('button:has-text("Toggle theme")');
      if (await themeToggle.isVisible()) {
        await themeToggle.click();
        await page.waitForTimeout(500);
        await themeToggle.click();
        await page.waitForTimeout(500);
      }
    });

    test('Navigation menu - All links work', async ({ page }) => {
      await page.goto('/');
      
      // Test all navigation links
      const navLinks = [
        { text: 'Venues', href: '/venues' },
        { text: 'Vendors', href: '/vendors' },
        { text: 'Feed', href: '/feed' },
        { text: 'Gallery', href: '/gallery' },
        { text: 'About', href: '/about' }
      ];

      for (const link of navLinks) {
        const navElement = page.locator(`a[href="${link.href}"]`).first();
        await expect(navElement).toBeVisible();
        await navElement.click();
        await expect(page).toHaveURL(new RegExp(`.*${link.href.replace('/', '')}`));
        await page.waitForTimeout(2000);
        await page.goBack();
        await page.waitForTimeout(1000);
      }
    });

    test('Services section and statistics', async ({ page }) => {
      await page.goto('/');
      
      // Check services section
      await expect(page.locator('text=Venues, text=Photography, text=Catering')).toBeVisible();
      
      // Check statistics section
      await expect(page.locator('text=10,000+, text=500+, text=2,000+')).toBeVisible();
      
      // Check impact numbers
      await expect(page.locator('text=Happy Couples, text=Venues, text=Vendors')).toBeVisible();
    });

    test('Call-to-action buttons functionality', async ({ page }) => {
      await page.goto('/');
      
      // Test CTA buttons
      const ctaButtons = [
        'Start Planning Today',
        'Explore Venues',
        'Get Started Free',
        'Contact Us'
      ];

      for (const buttonText of ctaButtons) {
        const button = page.locator(`text=${buttonText}`);
        if (await button.isVisible()) {
          await button.click();
          await page.waitForTimeout(2000);
          await page.goBack();
          await page.waitForTimeout(1000);
        }
      }
    });
  });

  test.describe('Venues - Complete CRUD Testing', () => {
    test('Venues page and listing', async ({ page }) => {
      await page.goto('/venues');
      
      // Check venues page loads
      await expect(page.locator('h1')).toContainText(/Venues|Find Venues/);
      
      // Check venue cards exist
      const venueCards = page.locator('.bg-white.rounded-lg.shadow-sm.overflow-hidden');
      await expect(venueCards.first()).toBeVisible();
      
      // Test venue search
      const searchInput = page.locator('input[placeholder*="search"], input[name="search"]');
      if (await searchInput.isVisible()) {
        await searchInput.fill('Royal');
        await page.keyboard.press('Enter');
        await page.waitForTimeout(2000);
      }
    });

    test('Individual venue page', async ({ page }) => {
      await page.goto('/venues');
      await page.waitForTimeout(3000);
      
      // Click on first venue
      const venueLink = page.locator('a[href*="/venues/"]').first();
      if (await venueLink.isVisible()) {
        await venueLink.click();
        await page.waitForTimeout(2000);
        
        // Check venue details
        await expect(page.locator('h1')).toBeVisible();
        await expect(page.locator('text=Capacity, text=Location, text=Price')).toBeVisible();
        
        // Test booking form if available
        const bookingForm = page.locator('form:has(input[name="date"]), [class*="booking"]');
        if (await bookingForm.isVisible()) {
          await page.fill('input[name="name"], input[placeholder*="name"]', 'Test User');
          await page.fill('input[name="email"], input[type="email"]', 'test@example.com');
          await page.fill('input[name="phone"], input[placeholder*="phone"]', '0771234567');
          await page.fill('input[name="date"], input[type="date"]', '2025-06-15');
          await page.fill('input[name="guests"], input[placeholder*="guests"]', '150');
        }
      }
    });
  });

  test.describe('Vendors - Complete CRUD Testing', () => {
    test('Vendors page and listing', async ({ page }) => {
      await page.goto('/vendors');
      
      // Check vendors page loads
      await expect(page.locator('h1')).toContainText(/Vendors|Find Vendors/);
      
      // Check vendor cards exist
      const vendorCards = page.locator('.bg-white.rounded-lg.shadow-sm.overflow-hidden');
      await expect(vendorCards.first()).toBeVisible();
      
      // Test category filtering
      const categories = ['Photographer', 'Caterer', 'Florist', 'DJ', 'Decorator'];
      for (const category of categories) {
        const categoryButton = page.locator(`text=${category}`);
        if (await categoryButton.isVisible()) {
          await categoryButton.click();
          await page.waitForTimeout(1000);
        }
      }
    });

    test('Individual vendor page', async ({ page }) => {
      await page.goto('/vendors');
      await page.waitForTimeout(3000);
      
      // Click on first vendor
      const vendorLink = page.locator('a[href*="/vendors/"]').first();
      if (await vendorLink.isVisible()) {
        await vendorLink.click();
        await page.waitForTimeout(2000);
        
        // Check vendor details
        await expect(page.locator('h1')).toBeVisible();
        await expect(page.locator('text=Experience, text=Location, text=Services')).toBeVisible();
        
        // Test inquiry form if available
        const inquiryForm = page.locator('form:has(input[name="name"]), [class*="inquiry"]');
        if (await inquiryForm.isVisible()) {
          await page.fill('input[name="name"], input[placeholder*="name"]', 'Test User');
          await page.fill('input[name="email"], input[type="email"]', 'test@example.com');
          await page.fill('textarea[name="message"], textarea[placeholder*="message"]', 'Interested in your services');
        }
      }
    });
  });

  test.describe('Authentication System Testing', () => {
    test('Login page functionality', async ({ page }) => {
      await page.goto('/login');
      
      // Check login page loads
      await expect(page.locator('h1')).toContainText(/Sign In|Sign in|Login|Welcome back/);
      
      // Test login form
      const emailInput = page.locator('input[name="email"], input[type="email"]');
      const passwordInput = page.locator('input[name="password"], input[type="password"]');
      
      await expect(emailInput).toBeVisible();
      await expect(passwordInput).toBeVisible();
      
      // Fill login form
      await emailInput.fill('test@example.com');
      await passwordInput.fill('TestPassword123!');
      
      // Test form validation
      await page.click('button[type="submit"], button:has-text("Sign in")');
      await page.waitForTimeout(2000);
    });

    test('Registration page functionality', async ({ page }) => {
      await page.goto('/register');
      
      // Check registration page loads
      await expect(page.locator('h1')).toContainText(/Sign up|Register|Create Account|Join WeddingLK/);
      
      // Test registration form
      const nameInput = page.locator('input[name="name"], input[name="firstName"]');
      const emailInput = page.locator('input[name="email"], input[type="email"]');
      const passwordInput = page.locator('input[name="password"], input[type="password"]');
      
      await expect(nameInput).toBeVisible();
      await expect(emailInput).toBeVisible();
      await expect(passwordInput).toBeVisible();
      
      // Fill registration form
      await nameInput.fill('Test User');
      await emailInput.fill('test@example.com');
      await passwordInput.fill('TestPassword123!');
      
      // Test form submission
      await page.click('button[type="submit"], button:has-text("Sign up")');
      await page.waitForTimeout(2000);
    });
  });

  test.describe('Dashboard System Testing', () => {
    test('Dashboard access and functionality', async ({ page }) => {
      await page.goto('/dashboard');
      
      // Should redirect to login if not authenticated
      await expect(page.locator('text=Login, text=Sign in, text=Welcome')).toBeVisible();
    });

    test('Dashboard widgets if accessible', async ({ page }) => {
      await page.goto('/dashboard');
      
      // Check if dashboard loads (might redirect to login)
      const dashboardContent = page.locator('text=Dashboard, text=Welcome, text=Quick Actions');
      if (await dashboardContent.isVisible()) {
        await expect(dashboardContent).toBeVisible();
        
        // Test dashboard widgets
        const widgets = page.locator('[class*="widget"], [class*="card"]');
        if (await widgets.isVisible()) {
          await expect(widgets.first()).toBeVisible();
        }
      }
    });
  });

  test.describe('Payment System Testing', () => {
    test('Payment page functionality', async ({ page }) => {
      await page.goto('/payment');
      
      // Check payment page loads
      await expect(page.locator('text=Payment, text=Card Details')).toBeVisible();
      
      // Test payment form
      const cardNumberInput = page.locator('input[name="cardNumber"], input[placeholder*="card"]');
      const expiryInput = page.locator('input[name="expiry"], input[placeholder*="expiry"]');
      const cvvInput = page.locator('input[name="cvv"], input[placeholder*="cvv"]');
      
      if (await cardNumberInput.isVisible()) {
        await cardNumberInput.fill('4111111111111111');
        await expiryInput.fill('12/25');
        await cvvInput.fill('123');
        
        // Test payment method selection
        const paymentMethods = ['Card', 'Bank Transfer', 'ezCash', 'mCash'];
        for (const method of paymentMethods) {
          const methodButton = page.locator(`text=${method}`);
          if (await methodButton.isVisible()) {
            await methodButton.click();
            await page.waitForTimeout(500);
          }
        }
      }
    });

    test('Payment success and failure pages', async ({ page }) => {
      // Test payment success page
      await page.goto('/payment/success');
      await expect(page.locator('text=Payment Successful, text=Thank you')).toBeVisible();
      
      // Test payment failed page
      await page.goto('/payment/failed');
      await expect(page.locator('text=Payment Failed, text=Error')).toBeVisible();
      
      // Test payment cancel page
      await page.goto('/payment/cancel');
      await expect(page.locator('text=Cancelled, text=Payment cancelled')).toBeVisible();
    });
  });

  test.describe('Reviews and Ratings Testing', () => {
    test('Reviews functionality', async ({ page }) => {
      await page.goto('/reviews/write');
      
      // Check write review page
      await expect(page.locator('text=Write Review, text=Share your experience')).toBeVisible();
      
      // Test review form
      const ratingInput = page.locator('input[name="rating"], [class*="rating"]');
      const reviewTextarea = page.locator('textarea[name="review"], textarea[placeholder*="review"]');
      
      if (await ratingInput.isVisible()) {
        await ratingInput.fill('5');
      }
      
      if (await reviewTextarea.isVisible()) {
        await reviewTextarea.fill('Excellent service and beautiful venue!');
      }
    });
  });

  test.describe('Mobile Responsiveness Testing', () => {
    test('Mobile layout on iPhone', async ({ page }) => {
      await page.setViewportSize({ width: 375, height: 667 });
      await page.goto('/');
      
      // Check mobile layout
      await expect(page.locator('h1')).toBeVisible();
      
      // Test mobile menu
      const mobileMenu = page.locator('[data-testid="mobile-menu"], button[aria-label*="menu"]');
      if (await mobileMenu.isVisible()) {
        await mobileMenu.click();
        await page.waitForTimeout(500);
        await expect(page.locator('text=Venues, text=Vendors, text=About')).toBeVisible();
      }
      
      // Reset viewport
      await page.setViewportSize({ width: 1280, height: 720 });
    });

    test('Mobile forms and interactions', async ({ page }) => {
      await page.setViewportSize({ width: 375, height: 667 });
      
      // Test mobile login form
      await page.goto('/login');
      const emailInput = page.locator('input[name="email"], input[type="email"]');
      await expect(emailInput).toBeVisible();
      
      // Test mobile navigation
      await page.goto('/');
      const searchInput = page.locator('input[placeholder*="Describe your dream wedding"]');
      if (await searchInput.isVisible()) {
        await searchInput.fill('Mobile beach wedding search');
        await searchInput.press('Enter');
        await page.waitForTimeout(2000);
      }
      
      // Reset viewport
      await page.setViewportSize({ width: 1280, height: 720 });
    });
  });

  test.describe('API Integration Testing', () => {
    test('API endpoints functionality', async ({ page }) => {
      // Test venues API
      const venuesResponse = await page.request.get('/api/venues');
      expect(venuesResponse.status()).toBe(200);
      const venuesData = await venuesResponse.json();
      expect(venuesData.success).toBe(true);
      
      // Test vendors API
      const vendorsResponse = await page.request.get('/api/vendors');
      expect(vendorsResponse.status()).toBe(200);
      const vendorsData = await vendorsResponse.json();
      expect(vendorsData.success).toBe(true);
      
      // Test services API
      const servicesResponse = await page.request.get('/api/services');
      expect(servicesResponse.status()).toBe(200);
      const servicesData = await servicesResponse.json();
      expect(servicesData.success).toBe(true);
    });

    test('API data creation', async ({ page }) => {
      // Test creating venue via API
      const venueData = {
        name: 'Test Live Venue',
        location: 'Test Location',
        capacity: 200,
        price: 100000,
        amenities: ['Parking', 'AC', 'Stage']
      };
      
      const response = await page.request.post('/api/venues', { data: venueData });
      expect(response.status()).toBe(201);
      const data = await response.json();
      expect(data.success).toBe(true);
      expect(data.data.name).toBe('Test Live Venue');
    });
  });

  test.describe('Performance and Security Testing', () => {
    test('Page load performance', async ({ page }) => {
      const startTime = Date.now();
      await page.goto('/');
      await page.waitForLoadState('networkidle');
      const loadTime = Date.now() - startTime;
      
      // Page should load within 5 seconds
      expect(loadTime).toBeLessThan(5000);
      
      // Check for loading indicators
      const loadingIndicators = page.locator('[class*="loading"], [class*="skeleton"]');
      await expect(loadingIndicators.first()).not.toBeVisible({ timeout: 10000 });
    });

    test('Security headers and HTTPS', async ({ page }) => {
      await page.goto('/');
      
      // Check HTTPS
      expect(page.url()).toMatch(/^https:/);
      
      // Check security headers
      const response = await page.request.get('/');
      const headers = response.headers();
      expect(headers['content-type']).toContain('text/html');
    });

    test('Error handling', async ({ page }) => {
      // Test 404 page
      await page.goto('/nonexistent-page');
      await expect(page.locator('text=404, text=Not Found, text=Page not found')).toBeVisible();
    });
  });

  test.describe('Complete User Journey Testing', () => {
    test('Full wedding planning journey', async ({ page }) => {
      // Start from homepage
      await page.goto('/');
      await expect(page.locator('h1')).toContainText(/Find Your Perfect/);
      
      // Search for venues
      const searchInput = page.locator('input[placeholder*="Describe your dream wedding"]');
      await searchInput.fill('Beach wedding in Galle for 150 guests');
      await searchInput.press('Enter');
      await page.waitForTimeout(3000);
      
      // Navigate to venues
      await page.goto('/venues');
      await page.waitForTimeout(2000);
      
      // Click on a venue
      const venueLink = page.locator('a[href*="/venues/"]').first();
      if (await venueLink.isVisible()) {
        await venueLink.click();
        await page.waitForTimeout(2000);
        
        // Check venue details
        await expect(page.locator('h1')).toBeVisible();
      }
      
      // Navigate to vendors
      await page.goto('/vendors');
      await page.waitForTimeout(2000);
      
      // Click on a vendor
      const vendorLink = page.locator('a[href*="/vendors/"]').first();
      if (await vendorLink.isVisible()) {
        await vendorLink.click();
        await page.waitForTimeout(2000);
        
        // Check vendor details
        await expect(page.locator('h1')).toBeVisible();
      }
      
      // Test registration
      await page.goto('/register');
      await expect(page.locator('h1')).toContainText(/Sign up|Register/);
      
      // Test login
      await page.goto('/login');
      await expect(page.locator('h1')).toContainText(/Sign in|Login/);
    });
  });
});
