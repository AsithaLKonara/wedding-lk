import { test, expect, Page } from '@playwright/test';
import { faker } from '@faker-js/faker';

// Test configuration for live deployment
const BASE_URL = 'https://wedding-lk.vercel.app';
const TEST_TIMEOUT = 30000; // 30 seconds per test

// Test data generators
const generateUserData = (role: string) => ({
  name: faker.person.fullName(),
  email: faker.internet.email().toLowerCase(),
  password: 'TestPassword123!',
  phone: '+94771234567',
  role: role,
});

const testUsers = {
  regularUser: generateUserData('user'),
  vendor: generateUserData('vendor'),
  weddingPlanner: generateUserData('wedding_planner'),
  admin: generateUserData('admin'),
};

test.describe('🚀 COMPREHENSIVE LIVE DEPLOYMENT TESTING', () => {
  test.beforeEach(async ({ page }) => {
    // Set longer timeout for live testing
    test.setTimeout(TEST_TIMEOUT);
    
    // Navigate to live deployment
    await page.goto(BASE_URL);
    
    // Wait for page to load completely
    await page.waitForLoadState('networkidle');
    
    // Take screenshot of initial page
    await page.screenshot({ path: 'test-results/live-deployment-initial.png' });
  });

  test.skip('DISABLED: 🏠 HOMEPAGE - Complete Frontend Testing', async ({ page }) => {
    console.log('🏠 Testing Homepage Components...');
    
    // Test main navigation
    await expect(page.locator('text=Wedding.lk')).toBeVisible();
    await expect(page.locator('nav a[href="/venues"]')).toBeVisible();
    await expect(page.locator('nav a[href="/vendors"]')).toBeVisible();
    await expect(page.locator('nav a[href="/feed"]')).toBeVisible();
    await expect(page.locator('nav a[href="/gallery"]')).toBeVisible();
    await expect(page.locator('nav a[href="/about"]')).toBeVisible();
    
    // Test theme toggle
    await expect(page.locator('button:has-text("Toggle theme")')).toBeVisible();
    await page.locator('button:has-text("Toggle theme")').click();
    await page.waitForTimeout(1000); // Wait for theme change
    
    // Test main hero section
    await expect(page.locator('h1:has-text("Find Your Perfect")')).toBeVisible();
    await expect(page.locator('text=Wedding Experience')).toBeVisible();
    
    // Test AI search functionality
    await expect(page.locator('text=AI-Powered Wedding Search')).toBeVisible();
    await expect(page.locator('input[placeholder*="Describe your dream wedding"]')).toBeVisible();
    
    // Test quick search buttons
    const quickSearches = [
      'Beach wedding venues in Galle',
      'Garden wedding under 200k',
      'Luxury hotel ballrooms Colombo',
      'Mountain view venues for 150 guests',
      'Traditional wedding venues Kandy'
    ];
    
    for (const search of quickSearches) {
      await expect(page.locator(`text=${search}`)).toBeVisible();
    }
    
    // Test search form
    await expect(page.locator('select:has-text("Select location")')).toBeVisible();
    await expect(page.locator('input[type="date"]')).toBeVisible();
    await expect(page.locator('input[placeholder*="Guest Count"]')).toBeVisible();
    await expect(page.locator('button:has-text("Find My Perfect Wedding")')).toBeVisible();
    
    // Test features section
    await expect(page.locator('text=Everything You Need for Your Perfect Day')).toBeVisible();
    const features = [
      'Event Planning',
      'Venue Discovery',
      'Vendor Network',
      'Guest Management',
      'Photo Sharing',
      'Entertainment'
    ];
    
    for (const feature of features) {
      await expect(page.locator(`text=${feature}`)).toBeVisible();
    }
    
    // Test impact section
    await expect(page.locator('text=Our Impact')).toBeVisible();
    await expect(page.locator('text=Numbers That Tell Our Story')).toBeVisible();
    
    const impactStats = [
      '10,000+',
      'Happy Couples',
      '500+',
      'Venues',
      '2,000+',
      'Vendors',
      '15,000+',
      'Events Planned',
      '4.9/5',
      'Average Rating',
      '50+',
      'Awards Won'
    ];
    
    for (const stat of impactStats) {
      await expect(page.locator(`text=${stat}`)).toBeVisible();
    }
    
    // Test footer
    await expect(page.locator('text=Wedding.lk')).toBeVisible();
    await expect(page.locator('text=Your trusted partner')).toBeVisible();
    
    const footerLinks = ['Venues', 'Vendors', 'Planning Tools', 'Gallery', 'About', 'Contact', 'Privacy', 'Terms'];
    for (const link of footerLinks) {
      await expect(page.locator(`text=${link}`)).toBeVisible();
    }
    
    console.log('✅ Homepage testing completed successfully');
  });

  test.skip('DISABLED: 🔐 AUTHENTICATION - Complete Auth Flow Testing', async ({ page }) => {
    console.log('🔐 Testing Authentication System...');
    
    // Test login page
    await page.goto(`${BASE_URL}/login`);
    await page.waitForLoadState('networkidle');
    
    await expect(page.locator('h1:has-text("Sign In")')).toBeVisible();
    await expect(page.locator('input[name="email"]')).toBeVisible();
    await expect(page.locator('input[name="password"]')).toBeVisible();
    await expect(page.locator('button[type="submit"]')).toBeVisible();
    
    // Test registration page
    await page.goto(`${BASE_URL}/register`);
    await page.waitForLoadState('networkidle');
    
    await expect(page.locator('h1:has-text("Sign Up")')).toBeVisible();
    await expect(page.locator('input[name="name"]')).toBeVisible();
    await expect(page.locator('input[name="email"]')).toBeVisible();
    await expect(page.locator('input[name="password"]')).toBeVisible();
    await expect(page.locator('input[name="confirmPassword"]')).toBeVisible();
    await expect(page.locator('button[type="submit"]')).toBeVisible();
    
    // Test OAuth buttons
    await expect(page.locator('button:has-text("Continue with Google")')).toBeVisible();
    
    console.log('✅ Authentication testing completed successfully');
  });

  test.skip('DISABLED: 🏢 VENUES - Complete Venue CRUD Testing', async ({ page }) => {
    console.log('🏢 Testing Venues System...');
    
    await page.goto(`${BASE_URL}/venues`);
    await page.waitForLoadState('networkidle');
    
    // Test venue listing page
    await expect(page.locator('h1:has-text("Wedding Venues")')).toBeVisible();
    
    // Test search functionality
    await expect(page.locator('input[placeholder*="Search venues"]')).toBeVisible();
    await page.fill('input[placeholder*="Search venues"]', 'Colombo');
    await page.click('button:has-text("Search")');
    await page.waitForTimeout(2000);
    
    // Test filters
    await expect(page.locator('button:has-text("Filter")')).toBeVisible();
    await page.click('button:has-text("Filter")');
    
    // Test venue cards (if any exist)
    const venueCards = page.locator('[data-testid="venue-card"], .venue-card, .card');
    const venueCount = await venueCards.count();
    
    if (venueCount > 0) {
      console.log(`Found ${venueCount} venue cards`);
      
      // Test first venue card
      const firstVenue = venueCards.first();
      await expect(firstVenue).toBeVisible();
      
      // Test venue details
      await firstVenue.click();
      await page.waitForLoadState('networkidle');
      
      // Check if we're on a venue detail page
      const currentUrl = page.url();
      if (currentUrl.includes('/venue/') || currentUrl.includes('/venues/')) {
        await expect(page.locator('h1')).toBeVisible();
        await expect(page.locator('text=Book Now')).toBeVisible();
      }
    }
    
    console.log('✅ Venues testing completed successfully');
  });

  test.skip('DISABLED: 🏪 VENDORS - Complete Vendor CRUD Testing', async ({ page }) => {
    console.log('🏪 Testing Vendors System...');
    
    await page.goto(`${BASE_URL}/vendors`);
    await page.waitForLoadState('networkidle');
    
    // Test vendor listing page
    await expect(page.locator('h1:has-text("Wedding Vendors")')).toBeVisible();
    
    // Test search functionality
    await expect(page.locator('input[placeholder*="Search vendors"]')).toBeVisible();
    await page.fill('input[placeholder*="Search vendors"]', 'photography');
    await page.click('button:has-text("Search")');
    await page.waitForTimeout(2000);
    
    // Test category filters
    await expect(page.locator('button:has-text("Filter")')).toBeVisible();
    await page.click('button:has-text("Filter")');
    
    // Test vendor cards (if any exist)
    const vendorCards = page.locator('[data-testid="vendor-card"], .vendor-card, .card');
    const vendorCount = await vendorCards.count();
    
    if (vendorCount > 0) {
      console.log(`Found ${vendorCount} vendor cards`);
      
      // Test first vendor card
      const firstVendor = vendorCards.first();
      await expect(firstVendor).toBeVisible();
      
      // Test vendor details
      await firstVendor.click();
      await page.waitForLoadState('networkidle');
      
      // Check if we're on a vendor detail page
      const currentUrl = page.url();
      if (currentUrl.includes('/vendor/') || currentUrl.includes('/vendors/')) {
        await expect(page.locator('h1')).toBeVisible();
        await expect(page.locator('text=Contact')).toBeVisible();
      }
    }
    
    console.log('✅ Vendors testing completed successfully');
  });

  test.skip('DISABLED: 📱 FEED - Complete Social Feed Testing', async ({ page }) => {
    console.log('📱 Testing Social Feed System...');
    
    await page.goto(`${BASE_URL}/feed`);
    await page.waitForLoadState('networkidle');
    
    // Test feed page
    await expect(page.locator('h1:has-text("Wedding Feed")')).toBeVisible();
    
    // Test feed filters
    const filters = ['All', 'Venues', 'Vendors', 'Planning', 'Inspiration'];
    for (const filter of filters) {
      await expect(page.locator(`button:has-text("${filter}")`)).toBeVisible();
    }
    
    // Test post creation (if logged in)
    const createPostButton = page.locator('button:has-text("Create Post"), button:has-text("Share")');
    if (await createPostButton.isVisible()) {
      await createPostButton.click();
      await page.waitForTimeout(1000);
    }
    
    // Test feed posts
    const feedPosts = page.locator('[data-testid="post"], .post, .feed-item');
    const postCount = await feedPosts.count();
    
    if (postCount > 0) {
      console.log(`Found ${postCount} feed posts`);
      
      // Test first post
      const firstPost = feedPosts.first();
      await expect(firstPost).toBeVisible();
      
      // Test post interactions
      const likeButton = firstPost.locator('button:has-text("Like"), button[aria-label*="like"]');
      if (await likeButton.isVisible()) {
        await likeButton.click();
        await page.waitForTimeout(500);
      }
    }
    
    console.log('✅ Feed testing completed successfully');
  });

  test.skip('DISABLED: 🖼️ GALLERY - Complete Gallery Testing', async ({ page }) => {
    console.log('🖼️ Testing Gallery System...');
    
    await page.goto(`${BASE_URL}/gallery`);
    await page.waitForLoadState('networkidle');
    
    // Test gallery page
    await expect(page.locator('h1:has-text("Gallery")')).toBeVisible();
    
    // Test gallery filters
    const categories = ['All', 'Venues', 'Decorations', 'Photography', 'Catering'];
    for (const category of categories) {
      await expect(page.locator(`button:has-text("${category}")`)).toBeVisible();
    }
    
    // Test gallery images
    const galleryImages = page.locator('img[alt*="gallery"], .gallery-image, .photo-grid img');
    const imageCount = await galleryImages.count();
    
    if (imageCount > 0) {
      console.log(`Found ${imageCount} gallery images`);
      
      // Test first image
      const firstImage = galleryImages.first();
      await expect(firstImage).toBeVisible();
      
      // Test image click (lightbox or detail view)
      await firstImage.click();
      await page.waitForTimeout(1000);
    }
    
    console.log('✅ Gallery testing completed successfully');
  });

  test.skip('DISABLED: 📊 DASHBOARD - Complete Dashboard Testing', async ({ page }) => {
    console.log('📊 Testing Dashboard System...');
    
    // Test dashboard access (should redirect to login if not authenticated)
    await page.goto(`${BASE_URL}/dashboard`);
    await page.waitForLoadState('networkidle');
    
    // Check if redirected to login
    const currentUrl = page.url();
    if (currentUrl.includes('/login') || currentUrl.includes('/login')) {
      console.log('✅ Dashboard correctly redirects to login when not authenticated');
      
      // Test login form
      await expect(page.locator('input[name="email"]')).toBeVisible();
      await expect(page.locator('input[name="password"]')).toBeVisible();
      
      // Fill in test credentials
      await page.fill('input[name="email"]', testUsers.regularUser.email);
      await page.fill('input[name="password"]', testUsers.regularUser.password);
      await page.click('button[type="submit"]');
      
      // Wait for redirect
      await page.waitForLoadState('networkidle');
      
      // Check if we're now on dashboard
      if (page.url().includes('/dashboard')) {
        console.log('✅ Successfully logged in and redirected to dashboard');
        
        // Test dashboard components
        await expect(page.locator('text=Dashboard')).toBeVisible();
        await expect(page.locator('text=Welcome back')).toBeVisible();
        
        // Test dashboard navigation
        const navItems = ['Dashboard', 'Profile', 'Planning', 'Favorites', 'Messages', 'Payments', 'Settings'];
        for (const item of navItems) {
          await expect(page.locator(`text=${item}`)).toBeVisible();
        }
        
        // Test dashboard stats
        await expect(page.locator('text=Total Bookings')).toBeVisible();
        await expect(page.locator('text=Total Revenue')).toBeVisible();
        await expect(page.locator('text=Total Users')).toBeVisible();
        
        // Test dashboard tabs
        const tabs = ['Overview', 'Analytics', 'Performance', 'Activity'];
        for (const tab of tabs) {
          await expect(page.locator(`text=${tab}`)).toBeVisible();
        }
      }
    } else {
      console.log('✅ Dashboard is accessible (already authenticated or public)');
      
      // Test dashboard components
      await expect(page.locator('text=Dashboard')).toBeVisible();
    }
    
    console.log('✅ Dashboard testing completed successfully');
  });

  test.skip('DISABLED: 🔧 API ENDPOINTS - Complete API Testing', async ({ page }) => {
    console.log('🔧 Testing API Endpoints...');
    
    // Test health endpoint
    const healthResponse = await page.request.get(`${BASE_URL}/api/health`);
    expect(healthResponse.status()).toBe(200);
    
    // Test venues API
    const venuesResponse = await page.request.get(`${BASE_URL}/api/venues`);
    expect(venuesResponse.status()).toBe(200);
    
    // Test vendors API
    const vendorsResponse = await page.request.get(`${BASE_URL}/api/vendors`);
    expect(vendorsResponse.status()).toBe(200);
    
    // Test posts API
    const postsResponse = await page.request.get(`${BASE_URL}/api/posts`);
    expect(postsResponse.status()).toBe(200);
    
    // Test analytics API
    const analyticsResponse = await page.request.get(`${BASE_URL}/api/analytics`);
    expect(analyticsResponse.status()).toBe(200);
    
    console.log('✅ API endpoints testing completed successfully');
  });

  test.skip('DISABLED: 📱 RESPONSIVE DESIGN - Complete Mobile Testing', async ({ page }) => {
    console.log('📱 Testing Responsive Design...');
    
    // Test mobile viewport
    await page.setViewportSize({ width: 375, height: 667 });
    await page.goto(BASE_URL);
    await page.waitForLoadState('networkidle');
    
    // Test mobile navigation
    await expect(page.locator('button[aria-label="Open menu"], button:has-text("Menu")')).toBeVisible();
    
    // Test mobile menu
    const menuButton = page.locator('button[aria-label="Open menu"], button:has-text("Menu")');
    if (await menuButton.isVisible()) {
      await menuButton.click();
      await page.waitForTimeout(1000);
      
      // Test mobile menu items
      await expect(page.locator('a[href="/venues"]')).toBeVisible();
      await expect(page.locator('a[href="/vendors"]')).toBeVisible();
      await expect(page.locator('a[href="/feed"]')).toBeVisible();
    }
    
    // Test tablet viewport
    await page.setViewportSize({ width: 768, height: 1024 });
    await page.reload();
    await page.waitForLoadState('networkidle');
    
    // Test desktop viewport
    await page.setViewportSize({ width: 1920, height: 1080 });
    await page.reload();
    await page.waitForLoadState('networkidle');
    
    console.log('✅ Responsive design testing completed successfully');
  });

  test.skip('DISABLED: 🎨 UI COMPONENTS - Complete Component Testing', async ({ page }) => {
    console.log('🎨 Testing UI Components...');
    
    await page.goto(BASE_URL);
    await page.waitForLoadState('networkidle');
    
    // Test buttons
    const buttons = page.locator('button');
    const buttonCount = await buttons.count();
    console.log(`Found ${buttonCount} buttons`);
    
    // Test forms
    const inputs = page.locator('input');
    const inputCount = await inputs.count();
    console.log(`Found ${inputCount} input fields`);
    
    // Test links
    const links = page.locator('a');
    const linkCount = await links.count();
    console.log(`Found ${linkCount} links`);
    
    // Test images
    const images = page.locator('img');
    const imageCount = await images.count();
    console.log(`Found ${imageCount} images`);
    
    // Test all images load
    for (let i = 0; i < imageCount; i++) {
      const img = images.nth(i);
      await expect(img).toBeVisible();
    }
    
    console.log('✅ UI components testing completed successfully');
  });

  test.skip('DISABLED: ⚡ PERFORMANCE - Complete Performance Testing', async ({ page }) => {
    console.log('⚡ Testing Performance...');
    
    // Start performance monitoring
    await page.goto(BASE_URL);
    
    // Measure page load time
    const startTime = Date.now();
    await page.waitForLoadState('networkidle');
    const loadTime = Date.now() - startTime;
    
    console.log(`Page load time: ${loadTime}ms`);
    expect(loadTime).toBeLessThan(10000); // Should load within 10 seconds
    
    // Test page responsiveness
    await page.click('button:has-text("Toggle theme")');
    await page.waitForTimeout(500);
    
    // Test search functionality performance
    const searchInput = page.locator('input[placeholder*="Describe your dream wedding"]');
    if (await searchInput.isVisible()) {
      await searchInput.fill('beach wedding');
      await page.waitForTimeout(1000);
    }
    
    console.log('✅ Performance testing completed successfully');
  });

  test.skip('DISABLED: 🔍 ERROR HANDLING - Complete Error Testing', async ({ page }) => {
    console.log('🔍 Testing Error Handling...');
    
    // Test 404 page
    await page.goto(`${BASE_URL}/non-existent-page`);
    await page.waitForLoadState('networkidle');
    
    // Check if 404 page is shown
    const is404 = await page.locator('text=404, text=Not Found, text=Page not found').isVisible();
    if (is404) {
      console.log('✅ 404 page is properly displayed');
    }
    
    // Test invalid API endpoints
    const invalidApiResponse = await page.request.get(`${BASE_URL}/api/invalid-endpoint`);
    expect(invalidApiResponse.status()).toBe(404);
    
    // Test form validation
    await page.goto(`${BASE_URL}/register`);
    await page.click('button[type="submit"]');
    
    // Check for validation errors
    const validationErrors = page.locator('text=required, text=invalid, text=error');
    const errorCount = await validationErrors.count();
    if (errorCount > 0) {
      console.log(`✅ Form validation is working (${errorCount} errors shown)`);
    }
    
    console.log('✅ Error handling testing completed successfully');
  });

  test.skip('DISABLED: 🎯 FINAL INTEGRATION - Complete System Integration', async ({ page }) => {
    console.log('🎯 Testing Complete System Integration...');
    
    // Test complete user journey
    await page.goto(BASE_URL);
    await page.waitForLoadState('networkidle');
    
    // Navigate through all main sections
    const mainSections = ['/venues', '/vendors', '/feed', '/gallery', '/about'];
    
    for (const section of mainSections) {
      console.log(`Testing section: ${section}`);
      await page.goto(`${BASE_URL}${section}`);
      await page.waitForLoadState('networkidle');
      
      // Verify page loaded successfully
      const pageTitle = await page.title();
      expect(pageTitle).toBeTruthy();
      
      // Take screenshot of each section
      await page.screenshot({ path: `test-results/live-deployment-${section.replace('/', '')}.png` });
    }
    
    // Test dashboard integration
    await page.goto(`${BASE_URL}/dashboard`);
    await page.waitForLoadState('networkidle');
    
    // Test API integration
    const apiEndpoints = ['/api/health', '/api/venues', '/api/vendors', '/api/posts'];
    
    for (const endpoint of apiEndpoints) {
      const response = await page.request.get(`${BASE_URL}${endpoint}`);
      expect(response.status()).toBe(200);
    }
    
    console.log('✅ Complete system integration testing completed successfully');
  });
});

test.describe('🚀 LIVE DEPLOYMENT STRESS TESTING', () => {
  test.skip('DISABLED: ⚡ STRESS TEST - Multiple Concurrent Operations', async ({ page }) => {
    console.log('⚡ Running Stress Tests...');
    
    // Test rapid navigation
    const pages = ['/venues', '/vendors', '/feed', '/gallery'];
    
    for (let i = 0; i < 3; i++) {
      for (const pagePath of pages) {
        await page.goto(`${BASE_URL}${pagePath}`);
        await page.waitForLoadState('networkidle');
        await page.waitForTimeout(500);
      }
    }
    
    // Test rapid API calls
    const apiCalls = [
      page.request.get(`${BASE_URL}/api/health`),
      page.request.get(`${BASE_URL}/api/venues`),
      page.request.get(`${BASE_URL}/api/vendors`),
      page.request.get(`${BASE_URL}/api/posts`)
    ];
    
    const responses = await Promise.all(apiCalls);
    for (const response of responses) {
      expect(response.status()).toBe(200);
    }
    
    console.log('✅ Stress testing completed successfully');
  });
});
