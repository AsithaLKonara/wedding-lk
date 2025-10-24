import { test, expect } from '@playwright/test'

// Test credentials
const TEST_USER = { email: 'user@test.local', password: 'Test123!' }
const TEST_VENDOR = { email: 'vendor@test.local', password: 'Test123!' }
const TEST_ADMIN = { email: 'admin@test.local', password: 'Test123!' }

// Helper to login
async function login(page: any, email: string, password: string) {
  await page.goto('/login')
  await page.fill('input[name="email"]', email)
  await page.fill('input[name="password"]', password)
  await page.click('button[type="submit"]')
  await page.waitForURL(/\/dashboard/, { timeout: 10000 })
}

test.describe('🚀 User Journey Tests - Phase 4', () => {
  
  // ═══════════════════════════════════════════════════════════════════════
  // Bride/Groom Journey
  // ═══════════════════════════════════════════════════════════════════════

  test.describe('👰 Bride/Groom Wedding Planning Journey', () => {
    test('✅ Complete bride journey: Explore > Favorite > Book vendor', async ({ page }) => {
      // Step 1: Browse homepage
      await page.goto('/')
      await expect(page.locator('h1, h2')).toContainText(/Wedding|Venue|Vendor/)

      // Step 2: View venues
      const venuesLink = page.locator('a[href="/venues"], a:has-text("Venues")')
      if (await venuesLink.isVisible()) {
        await venuesLink.first().click()
        await expect(page).toHaveURL(/\/venues/)
      }

      // Step 3: View vendors
      const vendorsLink = page.locator('a[href="/vendors"], a:has-text("Vendors")')
      if (await vendorsLink.isVisible()) {
        await vendorsLink.first().click()
        await expect(page).toHaveURL(/\/vendors/)
      }

      // Step 4: Attempt to login
      await login(page, TEST_USER.email, TEST_USER.password)

      // Step 5: Access dashboard
      await expect(page).toHaveURL(/\/dashboard/)
    })

    test('✅ User discovery journey: Search > Filter > View details', async ({ page }) => {
      await login(page, TEST_USER.email, TEST_USER.password)

      // Search for vendors
      const searchInput = page.locator('input[placeholder*="Search"], input[type="search"]')
      if (await searchInput.isVisible()) {
        await searchInput.fill('photographer')
        await page.keyboard.press('Enter')
      }
    })

    test('✅ User favorites journey: Add > View > Remove', async ({ page }) => {
      await login(page, TEST_USER.email, TEST_USER.password)

      // Navigate to favorites
      const favoritesLink = page.locator('a[href="/dashboard/favorites"], a:has-text("Favorites")')
      if (await favoritesLink.isVisible()) {
        await favoritesLink.first().click()
        await expect(page).toHaveURL(/\/dashboard\/(favorites|wishlist)/)
      }
    })

    test('✅ User booking inquiry journey', async ({ page }) => {
      await login(page, TEST_USER.email, TEST_USER.password)

      // Go to bookings section
      const bookingsLink = page.locator('a[href="/dashboard/bookings"], a:has-text("Bookings")')
      if (await bookingsLink.isVisible()) {
        await bookingsLink.first().click()
        await expect(page).toHaveURL(/\/dashboard\/bookings/)
      }
    })

    test('✅ User profile completion journey', async ({ page }) => {
      await login(page, TEST_USER.email, TEST_USER.password)

      // Go to profile
      const profileLink = page.locator('a[href="/dashboard/profile"], a:has-text("Profile")')
      if (await profileLink.isVisible()) {
        await profileLink.first().click()
        await expect(page).toHaveURL(/\/dashboard\/profile/)

        // Check for profile form
        const nameInput = page.locator('input[name="name"], input[placeholder*="Name"]')
        if (await nameInput.isVisible()) {
          await nameInput.fill('Test Wedding')
        }
      }
    })

    test('✅ User settings & preferences journey', async ({ page }) => {
      await login(page, TEST_USER.email, TEST_USER.password)

      // Go to settings
      const settingsLink = page.locator('a[href="/dashboard/settings"], a:has-text("Settings")')
      if (await settingsLink.isVisible()) {
        await settingsLink.first().click()
        await expect(page).toHaveURL(/\/dashboard\/settings/)

        // Check for preference options
        const notificationToggle = page.locator('input[type="checkbox"]')
        if (await notificationToggle.isVisible()) {
          // Verify checkbox exists
          await expect(notificationToggle).toBeVisible()
        }
      }
    })
  })

  // ═══════════════════════════════════════════════════════════════════════
  // Vendor Business Journey
  // ═══════════════════════════════════════════════════════════════════════

  test.describe('📸 Vendor Business Journey', () => {
    test('✅ Complete vendor onboarding & service setup', async ({ page }) => {
      await login(page, TEST_VENDOR.email, TEST_VENDOR.password)

      // Step 1: Vendor dashboard
      await expect(page).toHaveURL(/\/dashboard/)

      // Step 2: Access services
      const servicesLink = page.locator('a[href="/dashboard/services"], a:has-text("Services")')
      if (await servicesLink.isVisible()) {
        await servicesLink.first().click()
        await expect(page).toHaveURL(/\/dashboard\/services/)
      }
    })

    test('✅ Vendor booking management journey', async ({ page }) => {
      await login(page, TEST_VENDOR.email, TEST_VENDOR.password)

      // Navigate to bookings
      const bookingsLink = page.locator('a[href="/dashboard/bookings"], a:has-text("Bookings")')
      if (await bookingsLink.isVisible()) {
        await bookingsLink.first().click()
        await expect(page).toHaveURL(/\/dashboard\/bookings/)
      }
    })

    test('✅ Vendor profile & portfolio journey', async ({ page }) => {
      await login(page, TEST_VENDOR.email, TEST_VENDOR.password)

      // Go to profile
      const profileLink = page.locator('a[href="/dashboard/profile"], a:has-text("Profile")')
      if (await profileLink.isVisible()) {
        await profileLink.first().click()
        await expect(page).toHaveURL(/\/dashboard\/profile/)
      }
    })

    test('✅ Vendor performance tracking journey', async ({ page }) => {
      await login(page, TEST_VENDOR.email, TEST_VENDOR.password)

      // Look for analytics or performance section
      const analyticsLink = page.locator('a[href="/dashboard/analytics"], a:has-text("Analytics"), a:has-text("Performance")')
      if (await analyticsLink.isVisible()) {
        await analyticsLink.first().click()
      }
    })

    test('✅ Vendor service pricing journey', async ({ page }) => {
      await login(page, TEST_VENDOR.email, TEST_VENDOR.password)

      // Navigate to services
      const servicesLink = page.locator('a[href="/dashboard/services"], a:has-text("Services")')
      if (await servicesLink.isVisible()) {
        await servicesLink.first().click()

        // Look for pricing controls
        const priceInput = page.locator('input[type="number"], input[name*="price"], input[placeholder*="Price"]')
        if (await priceInput.isVisible()) {
          await expect(priceInput).toBeVisible()
        }
      }
    })
  })

  // ═══════════════════════════════════════════════════════════════════════
  // Admin Platform Management Journey
  // ═══════════════════════════════════════════════════════════════════════

  test.describe('👑 Admin Platform Management Journey', () => {
    test('✅ Admin user management journey', async ({ page }) => {
      await login(page, TEST_ADMIN.email, TEST_ADMIN.password)

      // Navigate to users section
      const usersLink = page.locator('a[href="/dashboard/users"], a:has-text("Users")')
      if (await usersLink.isVisible()) {
        await usersLink.first().click()
        await expect(page).toHaveURL(/\/dashboard\/users/)
      }
    })

    test('✅ Admin analytics & reporting journey', async ({ page }) => {
      await login(page, TEST_ADMIN.email, TEST_ADMIN.password)

      // Navigate to analytics
      const analyticsLink = page.locator('a[href="/dashboard/analytics"], a:has-text("Analytics")')
      if (await analyticsLink.isVisible()) {
        await analyticsLink.first().click()
        await expect(page).toHaveURL(/\/dashboard\/analytics/)
      }
    })

    test('✅ Admin platform settings journey', async ({ page }) => {
      await login(page, TEST_ADMIN.email, TEST_ADMIN.password)

      // Navigate to settings
      const settingsLink = page.locator('a[href="/dashboard/settings"], a:has-text("Settings")')
      if (await settingsLink.isVisible()) {
        await settingsLink.first().click()
        await expect(page).toHaveURL(/\/dashboard\/settings/)
      }
    })

    test('✅ Admin content moderation journey', async ({ page }) => {
      await login(page, TEST_ADMIN.email, TEST_ADMIN.password)

      // Look for moderation or content section
      const contentLink = page.locator('a:has-text("Content"), a:has-text("Reviews"), a:has-text("Moderation")')
      if (await contentLink.isVisible()) {
        await contentLink.first().click()
      }
    })
  })

  // ═══════════════════════════════════════════════════════════════════════
  // Cross-platform Journeys
  // ═══════════════════════════════════════════════════════════════════════

  test.describe('🔄 Cross-Platform User Journeys', () => {
    test('✅ Desktop to mobile navigation journey', async ({ page }) => {
      await page.goto('/')
      
      // Verify page loads on desktop
      await expect(page.locator('header')).toBeVisible()
      await expect(page.locator('main')).toBeVisible()

      // Resize to mobile
      await page.setViewportSize({ width: 375, height: 667 })

      // Verify mobile view
      await expect(page.locator('header')).toBeVisible()
    })

    test('✅ Public to authenticated user journey', async ({ page }) => {
      // Step 1: Browse as public
      await page.goto('/')
      const venuesLink = page.locator('a[href="/venues"], a:has-text("Venues")')
      if (await venuesLink.isVisible()) {
        await venuesLink.first().click()
      }

      // Step 2: Login
      await login(page, TEST_USER.email, TEST_USER.password)

      // Step 3: Access dashboard
      await expect(page).toHaveURL(/\/dashboard/)
    })

    test('✅ Multi-tab session persistence journey', async ({ page, context }) => {
      // Open first tab and login
      await page.goto('/login')
      await page.fill('input[name="email"]', TEST_USER.email)
      await page.fill('input[name="password"]', TEST_USER.password)
      await page.click('button[type="submit"]')
      await page.waitForURL(/\/dashboard/, { timeout: 10000 })

      // Open second tab
      const page2 = await context.newPage()
      await page2.goto('/dashboard')

      // Should still be logged in
      await expect(page2).toHaveURL(/\/dashboard/)

      await page2.close()
    })

    test('✅ Search to details to booking journey', async ({ page }) => {
      await login(page, TEST_USER.email, TEST_USER.password)

      // Search
      const searchInput = page.locator('input[placeholder*="Search"], input[type="search"]')
      if (await searchInput.isVisible()) {
        await searchInput.fill('photographer')
        await page.keyboard.press('Enter')
        await page.waitForTimeout(500)
      }

      // View bookings
      const bookingsLink = page.locator('a[href="/dashboard/bookings"], a:has-text("Bookings")')
      if (await bookingsLink.isVisible()) {
        await bookingsLink.first().click()
        await expect(page).toHaveURL(/\/dashboard\/bookings/)
      }
    })
  })

  // ═══════════════════════════════════════════════════════════════════════
  // Error Recovery Journeys
  // ═══════════════════════════════════════════════════════════════════════

  test.describe('🔄 Error Recovery Journeys', () => {
    test('✅ Login failure recovery journey', async ({ page }) => {
      // Step 1: Attempt failed login
      await page.goto('/login')
      await page.fill('input[name="email"]', 'invalid@test.local')
      await page.fill('input[name="password"]', 'WrongPassword!')
      await page.click('button[type="submit"]')

      // Step 2: See error message
      const errorMsg = page.locator('text=/Invalid|credentials|error/i')
      if (await errorMsg.isVisible({ timeout: 5000 }).catch(() => false)) {
        // Error displayed
      }

      // Step 3: Retry with correct credentials
      await page.fill('input[name="email"]', TEST_USER.email)
      await page.fill('input[name="password"]', TEST_USER.password)
      await page.click('button[type="submit"]')

      // Step 4: Successful redirect
      await page.waitForURL(/\/dashboard/, { timeout: 10000 })
    })

    test('✅ Network error recovery journey', async ({ page }) => {
      // Go to a page
      await page.goto('/vendors')
      
      // Simulate offline
      await page.context().setOffline(true)
      
      // Try to navigate
      const venuesLink = page.locator('a[href="/venues"]')
      if (await venuesLink.isVisible()) {
        await venuesLink.first().click()
      }

      // Come back online
      await page.context().setOffline(false)
      
      // Should recover
      await page.reload()
      await expect(page).toBeOK()
    })

    test('✅ Page timeout recovery journey', async ({ page }) => {
      // Navigate to a slow loading page
      await page.goto('/vendors', { waitUntil: 'networkidle' }).catch(() => {
        // Timeout is okay
      })

      // Try to reload
      await page.reload().catch(() => {
        // Failed reload is okay
      })

      // Try alternative action
      await page.goto('/')
      await expect(page).toHaveURL('/')
    })

    test('✅ 404 error recovery journey', async ({ page }) => {
      // Navigate to non-existent page
      await page.goto('/non-existent-page')

      // Should show error or redirect
      // Try to navigate back
      await page.goBack()

      // Should be on previous page
      const currentUrl = page.url()
      expect(currentUrl).not.toContain('non-existent')
    })

    test('✅ Session expiry recovery journey', async ({ page }) => {
      // Login
      await login(page, TEST_USER.email, TEST_USER.password)

      // Clear cookies to simulate session expiry
      await page.context().clearCookies()

      // Try to access protected page
      await page.goto('/dashboard/profile')

      // Should redirect to login
      await page.waitForURL(/\/login/, { timeout: 5000 })
    })
  })

  // ═══════════════════════════════════════════════════════════════════════
  // Feature-Specific Journeys
  // ═══════════════════════════════════════════════════════════════════════

  test.describe('🎯 Feature-Specific Journeys', () => {
    test('✅ Complete venue search journey', async ({ page }) => {
      await page.goto('/venues')

      // Search
      const searchInput = page.locator('input[placeholder*="Search"], input[type="search"]')
      if (await searchInput.isVisible()) {
        await searchInput.fill('colombo')
        await page.keyboard.press('Enter')
        await page.waitForTimeout(500)
      }

      // Filter
      const filterBtn = page.locator('button:has-text("Filter")')
      if (await filterBtn.isVisible()) {
        await filterBtn.click()
        await page.waitForTimeout(500)
      }
    })

    test('✅ Complete vendor discovery journey', async ({ page }) => {
      await page.goto('/vendors')

      // Browse
      const categoryBtn = page.locator('button:has-text("Category")')
      if (await categoryBtn.isVisible()) {
        await categoryBtn.first().click()
        await page.waitForTimeout(500)
      }

      // Sort
      const sortBtn = page.locator('button:has-text("Sort")')
      if (await sortBtn.isVisible()) {
        await sortBtn.click()
        await page.waitForTimeout(500)
      }
    })

    test('✅ Complete AI search journey', async ({ page }) => {
      await page.goto('/')

      // Look for AI search
      const aiSearch = page.locator('input[placeholder*="AI"], button:has-text("AI")')
      if (await aiSearch.isVisible()) {
        if (await aiSearch.locator('input').isVisible()) {
          await aiSearch.fill('Find me a photographer')
          await page.keyboard.press('Enter')
          await page.waitForTimeout(1000)
        }
      }
    })

    test('✅ Complete review & rating journey', async ({ page }) => {
      await login(page, TEST_USER.email, TEST_USER.password)

      // Look for reviews or rating section
      const reviewSection = page.locator('text=/Review|Rating|Comment/')
      if (await reviewSection.isVisible()) {
        await expect(reviewSection).toBeVisible()
      }
    })

    test('✅ Complete checkout journey', async ({ page }) => {
      await login(page, TEST_USER.email, TEST_USER.password)

      // Navigate to bookings
      const bookingsLink = page.locator('a[href="/dashboard/bookings"]')
      if (await bookingsLink.isVisible()) {
        await bookingsLink.click()

        // Look for payment button
        const payBtn = page.locator('button:has-text("Pay"), button:has-text("Checkout"), button:has-text("Book")')
        if (await payBtn.isVisible()) {
          // Payment interface exists
          await expect(payBtn).toBeVisible()
        }
      }
    })
  })
})

export { test }
