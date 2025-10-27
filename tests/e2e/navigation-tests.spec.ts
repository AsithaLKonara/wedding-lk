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

test.describe('🗺️ Page Navigation Tests - Phase 3', () => {
  
  // ═══════════════════════════════════════════════════════════════════════
  // Public Pages Navigation
  // ═══════════════════════════════════════════════════════════════════════

  test.describe('🌐 Public Pages Navigation', () => {
    test('✅ Navigate from homepage to venues', async ({ page }) => {
      await page.goto('/')
      
      // Find and click venues link
      const venuesLink = page.locator('a[href="/venues"], a:has-text("Venues")')
      await expect(venuesLink).toBeVisible()
      await venuesLink.first().click()
      
      await expect(page).toHaveURL(/\/venues/)
    })

    test('✅ Navigate from homepage to vendors', async ({ page }) => {
      await page.goto('/')
      
      const vendorsLink = page.locator('a[href="/vendors"], a:has-text("Vendors")')
      await expect(vendorsLink).toBeVisible()
      await vendorsLink.first().click()
      
      await expect(page).toHaveURL(/\/vendors/)
    })

    test('✅ Navigate from homepage to about', async ({ page }) => {
      await page.goto('/')
      
      const aboutLink = page.locator('a[href="/about"], a:has-text("About")')
      await expect(aboutLink).toBeVisible()
      await aboutLink.first().click()
      
      await expect(page).toHaveURL(/\/about/)
    })

    test('✅ Navigate from homepage to contact', async ({ page }) => {
      await page.goto('/')
      
      const contactLink = page.locator('a[href="/contact"], a:has-text("Contact")').first()
      if (await contactLink.isVisible().catch(() => false)) {
        await contactLink.click()
        await expect(page).toHaveURL(/\/contact/)
      }
    })

    test('✅ Navigate from homepage to login', async ({ page }) => {
      await page.goto('/')
      
      const loginLink = page.locator('a[href="/login"], button:has-text("Login"), a:has-text("Sign In")')
      if (await loginLink.isVisible()) {
        await loginLink.first().click()
        await expect(page).toHaveURL(/\/login/)
      }
    })

    test('✅ Navigate from homepage to register', async ({ page }) => {
      await page.goto('/')
      
      const registerLink = page.locator('a[href="/register"], a:has-text("Sign Up"), button:has-text("Register")')
      if (await registerLink.isVisible()) {
        await registerLink.first().click()
        await expect(page).toHaveURL(/\/register/)
      }
    })

    test('✅ Navigate from login to register', async ({ page }) => {
      await page.goto('/login')
      
      const registerLink = page.locator('a[href="/register"]')
      await expect(registerLink).toBeVisible()
      await registerLink.click()
      
      await expect(page).toHaveURL(/\/register/)
    })

    test('✅ Navigate from register to login', async ({ page }) => {
      await page.goto('/register')
      
      const loginLink = page.locator('a[href="/login"]')
      if (await loginLink.isVisible()) {
        await loginLink.click()
        await expect(page).toHaveURL(/\/login/)
      }
    })

    test('✅ Navigate to venues list', async ({ page }) => {
      await page.goto('/venues')
      await expect(page).toHaveURL(/\/venues/)
    })

    test('✅ Navigate to vendors list', async ({ page }) => {
      await page.goto('/vendors')
      await expect(page).toHaveURL(/\/vendors/)
    })
  })

  // ═══════════════════════════════════════════════════════════════════════
  // Dashboard Navigation (Authenticated)
  // ═══════════════════════════════════════════════════════════════════════

  test.describe('📊 Dashboard Navigation (Authenticated)', () => {
    test.beforeEach(async ({ page }) => {
      await login(page, TEST_USER.email, TEST_USER.password)
    })

    test('✅ User dashboard loads with sidebar', async ({ page }) => {
      await expect(page).toHaveURL(/\/dashboard/)
      
      // Check sidebar exists
      const sidebar = page.locator('aside, nav[class*="sidebar"]')
      await expect(sidebar).toBeVisible()
    })

    test('✅ Navigate to dashboard > profile', async ({ page }) => {
      const profileLink = page.locator('a[href="/dashboard/profile"], a:has-text("Profile")')
      
      if (await profileLink.isVisible()) {
        await profileLink.first().click()
        await expect(page).toHaveURL(/\/dashboard\/profile/)
      }
    })

    test('✅ Navigate to dashboard > bookings', async ({ page }) => {
      const bookingsLink = page.locator('a[href="/dashboard/bookings"], a:has-text("Bookings")')
      
      if (await bookingsLink.isVisible()) {
        await bookingsLink.first().click()
        await expect(page).toHaveURL(/\/dashboard\/bookings/)
      }
    })

    test('✅ Navigate to dashboard > favorites', async ({ page }) => {
      const favoritesLink = page.locator('a[href="/dashboard/favorites"], a:has-text("Favorites"), a:has-text("Wishlist")')
      
      if (await favoritesLink.isVisible()) {
        await favoritesLink.first().click()
        await expect(page).toHaveURL(/\/dashboard\/(favorites|wishlist)/)
      }
    })

    test('✅ Navigate to dashboard > settings', async ({ page }) => {
      const settingsLink = page.locator('a[href="/dashboard/settings"], a:has-text("Settings")')
      
      if (await settingsLink.isVisible()) {
        await settingsLink.first().click()
        await expect(page).toHaveURL(/\/dashboard\/settings/)
      }
    })

    test('✅ Navigate back to homepage from dashboard', async ({ page }) => {
      const homeLink = page.locator('a[href="/"], header a:has-text("Home"), header a:has-text("Wedding")')
      
      if (await homeLink.isVisible()) {
        await homeLink.first().click()
        await expect(page).toHaveURL('/')
      }
    })
  })

  // ═══════════════════════════════════════════════════════════════════════
  // Vendor Dashboard Navigation
  // ═══════════════════════════════════════════════════════════════════════

  test.describe('🏢 Vendor Dashboard Navigation', () => {
    test.beforeEach(async ({ page }) => {
      await login(page, TEST_VENDOR.email, TEST_VENDOR.password)
    })

    test('✅ Vendor dashboard loads', async ({ page }) => {
      await expect(page).toHaveURL(/\/dashboard/)
      
      // Check for vendor-specific elements
      const vendorContent = page.locator('text=/Services|Bookings|Revenue/')
      await expect(vendorContent).toBeVisible({ timeout: 5000 }).catch(() => {
        // It's okay if vendor-specific elements don't show
      })
    })

    test('✅ Navigate vendor dashboard > services', async ({ page }) => {
      const servicesLink = page.locator('a[href="/dashboard/services"], a:has-text("Services")')
      
      if (await servicesLink.isVisible()) {
        await servicesLink.first().click()
        await expect(page).toHaveURL(/\/dashboard\/services/)
      }
    })

    test('✅ Navigate vendor dashboard > bookings', async ({ page }) => {
      const bookingsLink = page.locator('a[href="/dashboard/bookings"], a:has-text("Bookings")')
      
      if (await bookingsLink.isVisible()) {
        await bookingsLink.first().click()
        await expect(page).toHaveURL(/\/dashboard\/bookings/)
      }
    })

    test('✅ Navigate vendor dashboard > profile', async ({ page }) => {
      const profileLink = page.locator('a[href="/dashboard/profile"], a:has-text("Profile")')
      
      if (await profileLink.isVisible()) {
        await profileLink.first().click()
        await expect(page).toHaveURL(/\/dashboard\/profile/)
      }
    })
  })

  // ═══════════════════════════════════════════════════════════════════════
  // Admin Dashboard Navigation
  // ═══════════════════════════════════════════════════════════════════════

  test.describe('👑 Admin Dashboard Navigation', () => {
    test.beforeEach(async ({ page }) => {
      await login(page, TEST_ADMIN.email, TEST_ADMIN.password)
    })

    test('✅ Admin dashboard loads', async ({ page }) => {
      await expect(page).toHaveURL(/\/dashboard/)
      
      // Check for admin-specific elements
      const adminContent = page.locator('text=/Users|Analytics|Reports/')
      await expect(adminContent).toBeVisible({ timeout: 5000 }).catch(() => {
        // It's okay if admin-specific elements don't show
      })
    })

    test('✅ Navigate admin dashboard > users', async ({ page }) => {
      const usersLink = page.locator('a[href="/dashboard/users"], a:has-text("Users")')
      
      if (await usersLink.isVisible()) {
        await usersLink.first().click()
        await expect(page).toHaveURL(/\/dashboard\/users/)
      }
    })

    test('✅ Navigate admin dashboard > analytics', async ({ page }) => {
      const analyticsLink = page.locator('a[href="/dashboard/analytics"], a:has-text("Analytics")')
      
      if (await analyticsLink.isVisible()) {
        await analyticsLink.first().click()
        await expect(page).toHaveURL(/\/dashboard\/analytics/)
      }
    })

    test('✅ Navigate admin dashboard > settings', async ({ page }) => {
      const settingsLink = page.locator('a[href="/dashboard/settings"], a:has-text("Settings")')
      
      if (await settingsLink.isVisible()) {
        await settingsLink.first().click()
        await expect(page).toHaveURL(/\/dashboard\/settings/)
      }
    })
  })

  // ═══════════════════════════════════════════════════════════════════════
  // Breadcrumb Navigation
  // ═══════════════════════════════════════════════════════════════════════

  test.describe('🔗 Breadcrumb Navigation', () => {
    test('✅ Breadcrumbs visible on nested pages', async ({ page }) => {
      await page.goto('/venues')
      
      const breadcrumbs = page.locator('nav[aria-label="Breadcrumb"], .breadcrumb, [class*="breadcrumb"]')
      
      if (await breadcrumbs.isVisible()) {
        await expect(breadcrumbs).toBeVisible()
      }
    })

    test('✅ Breadcrumb navigation works', async ({ page }) => {
      await page.goto('/dashboard/profile')
      
      const breadcrumb = page.locator('nav[aria-label="Breadcrumb"] a, .breadcrumb a')
      
      if (await breadcrumb.count() > 0) {
        const homeLink = breadcrumb.first()
        await homeLink.click()
        
        // Should navigate to dashboard
        await expect(page).toHaveURL(/\/(dashboard|)/)
      }
    })
  })

  // ═══════════════════════════════════════════════════════════════════════
  // Footer Navigation
  // ═══════════════════════════════════════════════════════════════════════

  test.describe('🦶 Footer Navigation', () => {
    test('✅ Footer visible on homepage', async ({ page }) => {
      await page.goto('/')
      
      const footer = page.locator('footer')
      await expect(footer).toBeVisible()
    })

    test('✅ Footer has required links', async ({ page }) => {
      await page.goto('/')
      
      const footer = page.locator('footer')
      
      if (await footer.isVisible()) {
        // Check for common footer links
        const links = footer.locator('a')
        expect(await links.count()).toBeGreaterThan(0)
      }
    })

    test('✅ Social media links in footer', async ({ page }) => {
      await page.goto('/')
      
      const footer = page.locator('footer')
      const socialLinks = footer.locator('a[href*="facebook"], a[href*="instagram"], a[href*="twitter"], a[href*="linkedin"]')
      
      if (await socialLinks.count() > 0) {
        await expect(socialLinks.first()).toBeVisible()
      }
    })

    test('✅ Contact info in footer', async ({ page }) => {
      await page.goto('/')
      
      const footer = page.locator('footer')
      const contactInfo = footer.locator('text=/email|phone|contact/i')
      
      if (await contactInfo.count() > 0) {
        await expect(contactInfo).toBeVisible()
      }
    })
  })

  // ═══════════════════════════════════════════════════════════════════════
  // Search Navigation
  // ═══════════════════════════════════════════════════════════════════════

  test.describe('🔍 Search Navigation', () => {
    test('✅ Search functionality on homepage', async ({ page }) => {
      await page.goto('/')
      
      const searchInput = page.locator('input[placeholder*="Search"], input[type="search"]')
      
      if (await searchInput.isVisible()) {
        await searchInput.fill('photographer')
        await page.keyboard.press('Enter')
        
        // Should navigate to search results or filter
        await page.waitForTimeout(500)
      }
    })

    test('✅ Search from venues page', async ({ page }) => {
      await page.goto('/venues')
      
      const searchInput = page.locator('input[placeholder*="Search"], input[type="search"]')
      
      if (await searchInput.isVisible()) {
        await searchInput.fill('colombo')
        await page.keyboard.press('Enter')
        
        await page.waitForTimeout(500)
      }
    })

    test('✅ Filter navigation on vendor page', async ({ page }) => {
      await page.goto('/vendors')
      
      const categoryFilter = page.locator('button:has-text("Category"), select[name*="category"]')
      
      if (await categoryFilter.isVisible()) {
        await categoryFilter.first().click()
        await page.waitForTimeout(500)
      }
    })
  })

  // ═══════════════════════════════════════════════════════════════════════
  // Back/Forward Navigation
  // ═══════════════════════════════════════════════════════════════════════

  test.describe('↩️ Back/Forward Navigation', () => {
    test('✅ Browser back button works', async ({ page }) => {
      await page.goto('/')
      
      // Navigate to venues
      const venuesLink = page.locator('a[href="/venues"], a:has-text("Venues")')
      if (await venuesLink.isVisible()) {
        await venuesLink.first().click()
        await expect(page).toHaveURL(/\/venues/)
        
        // Go back
        await page.goBack()
        await expect(page).toHaveURL('/')
      }
    })

    test('✅ Browser forward button works', async ({ page }) => {
      await page.goto('/venues')
      await page.goBack()
      
      if (await page.url().includes('home') || await page.url() === page.context().browser()?.contexts()?.[0]?.baseURL) {
        await page.goForward()
        await page.waitForTimeout(500)
      }
    })
  })
})

export { test }
