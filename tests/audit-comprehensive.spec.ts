import { test, expect, Page } from '@playwright/test'

const DEPLOY_URL = 'https://wedding-lkcom.vercel.app'

test.describe('WeddingLK Comprehensive Audit', () => {
  test.beforeEach(async ({ page }) => {
    // Set longer timeout for deployment testing
    test.setTimeout(60000)
  })

  test.describe('1. Smoke Tests & Core Navigation', () => {
    test('Homepage loads and main navigation works', async ({ page }) => {
      await page.goto(DEPLOY_URL)
      
      // Check page loads
      await expect(page).toHaveTitle(/wedding/i)
      await expect(page.locator('header')).toBeVisible()
      
      // Test main navigation
      const navItems = ['Venues', 'Vendors', 'Feed', 'Gallery', 'About']
      for (const item of navItems) {
        await page.click(`text=${item}`)
        await expect(page.locator('h1')).toBeVisible()
        await page.waitForLoadState('networkidle')
      }
    })

    test('Hero section and AI search functionality', async ({ page }) => {
      await page.goto(DEPLOY_URL)
      
      // Check hero elements
      await expect(page.locator('text=Find Your Perfect Wedding Experience')).toBeVisible()
      await expect(page.locator('input[placeholder*="Describe your dream wedding"]')).toBeVisible()
      
      // Test AI search input
      const searchInput = page.locator('input[placeholder*="Describe your dream wedding"]')
      await searchInput.fill('Beach wedding in Galle for 150 guests')
      await searchInput.press('Enter')
      
      // Wait for potential search results or navigation
      await page.waitForTimeout(2000)
    })

    test('Quick search buttons work', async ({ page }) => {
      await page.goto(DEPLOY_URL)
      
      const quickSearches = [
        'Beach wedding venues in Galle',
        'Garden wedding under 200k',
        'Luxury hotel ballrooms Colombo'
      ]
      
      for (const search of quickSearches) {
        await page.click(`text=${search}`)
        await page.waitForTimeout(1000)
        await page.goBack()
        await page.waitForLoadState('networkidle')
      }
    })
  })

  test.describe('2. Authentication Flow', () => {
    test('Login page loads and form validation works', async ({ page }) => {
      await page.goto(`${DEPLOY_URL}/login`)
      
      await expect(page.locator('h1')).toContainText(/sign in|login/i)
      
      // Test form validation
      await page.click('button[type="submit"]')
      await expect(page.locator('text=required')).toBeVisible()
      
      // Test with invalid credentials
      await page.fill('input[type="email"]', 'test@example.com')
      await page.fill('input[type="password"]', 'wrongpassword')
      await page.click('button[type="submit"]')
      
      await page.waitForTimeout(2000)
    })

    test('Registration page loads and form validation works', async ({ page }) => {
      await page.goto(`${DEPLOY_URL}/register`)
      
      await expect(page.locator('h1')).toContainText(/sign up|register|create account/i)
      
      // Test form validation
      await page.click('button[type="submit"]')
      await expect(page.locator('text=required')).toBeVisible()
      
      // Test with valid-looking data
      await page.fill('input[name*="name"], input[name*="firstName"]', 'Test User')
      await page.fill('input[type="email"]', 'test@example.com')
      await page.fill('input[type="password"]', 'password123')
      await page.click('button[type="submit"]')
      
      await page.waitForTimeout(2000)
    })
  })

  test.describe('3. Venues Page & Functionality', () => {
    test('Venues page loads with search and filters', async ({ page }) => {
      await page.goto(`${DEPLOY_URL}/venues`)
      
      await expect(page.locator('h1')).toContainText(/venue/i)
      
      // Test search functionality
      const searchInput = page.locator('input[placeholder*="search"]')
      if (await searchInput.isVisible()) {
        await searchInput.fill('Colombo')
        await page.waitForTimeout(1000)
      }
      
      // Test filters
      const filterButtons = page.locator('button').filter({ hasText: /filter|location|price/i })
      if (await filterButtons.first().isVisible()) {
        await filterButtons.first().click()
        await page.waitForTimeout(1000)
      }
      
      // Check venue cards load
      await expect(page.locator('.bg-white.rounded-lg.shadow-sm, .venue-card, [data-testid="venue-card"]')).toHaveCount({ min: 1 })
    })

    test('Individual venue page loads', async ({ page }) => {
      await page.goto(`${DEPLOY_URL}/venues`)
      
      // Click on first venue card
      const venueCard = page.locator('.bg-white.rounded-lg.shadow-sm, .venue-card, [data-testid="venue-card"]').first()
      if (await venueCard.isVisible()) {
        await venueCard.click()
        await page.waitForLoadState('networkidle')
        
        // Should navigate to venue detail page
        await expect(page.locator('h1')).toBeVisible()
      }
    })
  })

  test.describe('4. Vendors Page & Functionality', () => {
    test('Vendors page loads with category filters', async ({ page }) => {
      await page.goto(`${DEPLOY_URL}/vendors`)
      
      await expect(page.locator('h1')).toContainText(/vendor/i)
      
      // Test category filters
      const categoryButtons = page.locator('button').filter({ hasText: /photographer|caterer|florist|dj/i })
      if (await categoryButtons.first().isVisible()) {
        await categoryButtons.first().click()
        await page.waitForTimeout(1000)
      }
      
      // Check vendor cards load
      await expect(page.locator('.bg-white.rounded-lg.shadow-sm, .vendor-card, [data-testid="vendor-card"]')).toHaveCount({ min: 1 })
    })

    test('Individual vendor page loads', async ({ page }) => {
      await page.goto(`${DEPLOY_URL}/vendors`)
      
      // Click on first vendor card
      const vendorCard = page.locator('.bg-white.rounded-lg.shadow-sm, .vendor-card, [data-testid="vendor-card"]').first()
      if (await vendorCard.isVisible()) {
        await vendorCard.click()
        await page.waitForLoadState('networkidle')
        
        // Should navigate to vendor detail page
        await expect(page.locator('h1')).toBeVisible()
      }
    })
  })

  test.describe('5. Gallery Page', () => {
    test('Gallery page loads with images and filters', async ({ page }) => {
      await page.goto(`${DEPLOY_URL}/gallery`)
      
      await expect(page.locator('h1')).toContainText(/gallery/i)
      
      // Test category filters
      const categoryButtons = page.locator('button').filter({ hasText: /ceremony|reception|traditional/i })
      if (await categoryButtons.first().isVisible()) {
        await categoryButtons.first().click()
        await page.waitForTimeout(1000)
      }
      
      // Check gallery items load
      await expect(page.locator('img')).toHaveCount({ min: 1 })
    })
  })

  test.describe('6. Feed Page', () => {
    test('Feed page loads with stories and posts', async ({ page }) => {
      await page.goto(`${DEPLOY_URL}/feed`)
      
      await expect(page.locator('h1')).toContainText(/feed/i)
      
      // Check for feed content
      await expect(page.locator('.feed-item, .story, .post')).toHaveCount({ min: 1 })
    })
  })

  test.describe('7. Booking Flow', () => {
    test('Booking flow accessible from venue page', async ({ page }) => {
      await page.goto(`${DEPLOY_URL}/venues`)
      
      // Look for booking buttons
      const bookButton = page.locator('button').filter({ hasText: /book|view details|contact/i }).first()
      if (await bookButton.isVisible()) {
        await bookButton.click()
        await page.waitForLoadState('networkidle')
        
        // Should navigate to booking or contact form
        await expect(page.locator('h1')).toBeVisible()
      }
    })

    test('Payment page loads if accessible', async ({ page }) => {
      await page.goto(`${DEPLOY_URL}/payment`)
      
      // Check if payment page exists
      if (page.url().includes('/payment')) {
        await expect(page.locator('h1')).toContainText(/payment|complete booking/i)
        
        // Test payment form validation
        const submitButton = page.locator('button[type="submit"]')
        if (await submitButton.isVisible()) {
          await submitButton.click()
          await page.waitForTimeout(1000)
        }
      }
    })
  })

  test.describe('8. Dashboard Access', () => {
    test('Dashboard page loads if accessible', async ({ page }) => {
      await page.goto(`${DEPLOY_URL}/dashboard`)
      
      // Check if dashboard exists and requires auth
      if (page.url().includes('/dashboard')) {
        await expect(page.locator('h1')).toBeVisible()
      } else {
        // Should redirect to login
        await expect(page.locator('h1')).toContainText(/sign in|login/i)
      }
    })
  })

  test.describe('9. API Endpoints', () => {
    test('API endpoints respond correctly', async ({ page }) => {
      const apiEndpoints = [
        '/api/venues',
        '/api/vendors',
        '/api/services'
      ]
      
      for (const endpoint of apiEndpoints) {
        const response = await page.request.get(`${DEPLOY_URL}${endpoint}`)
        expect(response.status()).toBeLessThan(500)
      }
    })
  })

  test.describe('10. Error Handling', () => {
    test('404 page handles missing routes', async ({ page }) => {
      await page.goto(`${DEPLOY_URL}/nonexistent-page`)
      
      // Should show 404 or redirect
      await expect(page.locator('h1')).toContainText(/404|not found|page not found/i)
    })

    test('Invalid venue/vendor IDs handled', async ({ page }) => {
      await page.goto(`${DEPLOY_URL}/venues/invalid-id`)
      
      // Should show error or redirect
      await expect(page.locator('h1')).toBeVisible()
    })
  })

  test.describe('11. Mobile Responsiveness', () => {
    test('Mobile view works correctly', async ({ page }) => {
      await page.setViewportSize({ width: 375, height: 667 })
      await page.goto(DEPLOY_URL)
      
      // Check mobile navigation
      const mobileMenuButton = page.locator('button').filter({ hasText: /menu|☰/i })
      if (await mobileMenuButton.isVisible()) {
        await mobileMenuButton.click()
        await expect(page.locator('nav, .mobile-menu')).toBeVisible()
      }
      
      // Check content is responsive
      await expect(page.locator('header')).toBeVisible()
      await expect(page.locator('main, .main-content')).toBeVisible()
    })
  })

  test.describe('12. Performance & Accessibility', () => {
    test('Page loads within acceptable time', async ({ page }) => {
      const startTime = Date.now()
      await page.goto(DEPLOY_URL)
      await page.waitForLoadState('networkidle')
      const loadTime = Date.now() - startTime
      
      expect(loadTime).toBeLessThan(10000) // 10 seconds max
    })

    test('Images have alt text', async ({ page }) => {
      await page.goto(DEPLOY_URL)
      
      const images = page.locator('img')
      const count = await images.count()
      
      for (let i = 0; i < Math.min(count, 5); i++) {
        const img = images.nth(i)
        const alt = await img.getAttribute('alt')
        expect(alt).toBeTruthy()
      }
    })

    test('Forms have proper labels', async ({ page }) => {
      await page.goto(`${DEPLOY_URL}/login`)
      
      const inputs = page.locator('input')
      const count = await inputs.count()
      
      for (let i = 0; i < count; i++) {
        const input = inputs.nth(i)
        const id = await input.getAttribute('id')
        if (id) {
          const label = page.locator(`label[for="${id}"]`)
          await expect(label).toBeVisible()
        }
      }
    })
  })

  test.describe('13. New Features Audit', () => {
    test('AI Search page loads', async ({ page }) => {
      await page.goto(`${DEPLOY_URL}/ai-search`)
      
      if (page.url().includes('/ai-search')) {
        await expect(page.locator('h1')).toContainText(/ai|search|assistant/i)
      }
    })

    test('Chat system accessible', async ({ page }) => {
      await page.goto(`${DEPLOY_URL}/chat`)
      
      if (page.url().includes('/chat')) {
        await expect(page.locator('h1')).toContainText(/message|chat/i)
      }
    })

    test('Notifications page loads', async ({ page }) => {
      await page.goto(`${DEPLOY_URL}/notifications`)
      
      if (page.url().includes('/notifications')) {
        await expect(page.locator('h1')).toContainText(/notification/i)
      }
    })

    test('Vendor dashboard accessible', async ({ page }) => {
      await page.goto(`${DEPLOY_URL}/dashboard/vendor`)
      
      if (page.url().includes('/dashboard/vendor')) {
        await expect(page.locator('h1')).toContainText(/vendor|dashboard/i)
      }
    })
  })
})
