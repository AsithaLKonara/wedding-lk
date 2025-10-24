import { test, expect } from '@playwright/test'
import { faker } from '@faker-js/faker'

// Test users for critical path testing
const TEST_USER = {
  email: 'user@test.local',
  password: 'Test123!',
  role: 'user'
}

const TEST_VENDOR = {
  email: 'vendor@test.local',
  password: 'Test123!',
  role: 'vendor'
}

const TEST_ADMIN = {
  email: 'admin@test.local',
  password: 'Test123!',
  role: 'admin'
}

test.describe('🔐 Critical Features - Phase 1 Tests', () => {
  test.beforeEach(async ({ page }) => {
    // Reset to production URL
    await page.goto('/')
  })

  // ═══════════════════════════════════════════════════════════════════════
  // Authentication System Tests
  // ═══════════════════════════════════════════════════════════════════════

  test('✅ Homepage loads without authentication', async ({ page }) => {
    await page.goto('/')
    
    // Check key sections are present
    await expect(page.locator('header')).toBeVisible()
    await expect(page.locator('main')).toBeVisible()
    await expect(page.locator('footer')).toBeVisible()
    
    // Check title and description
    const title = page.locator('h1')
    await expect(title).toContainText(/Find Your Perfect|Wedding/)
  })

  test('✅ Login page renders with email/password fields', async ({ page }) => {
    await page.goto('/login')
    
    // Check page title
    await expect(page.locator('text=Welcome Back')).toBeVisible()
    
    // Check email field using data-testid
    const emailInput = page.locator('[data-testid="login-email-input"]')
    await expect(emailInput).toBeVisible()
    await expect(emailInput).toHaveAttribute('type', 'email')
    
    // Check password field using data-testid
    const passwordInput = page.locator('[data-testid="login-password-input"]')
    await expect(passwordInput).toBeVisible()
    await expect(passwordInput).toHaveAttribute('type', 'password')
    
    // Check submit button using data-testid
    const submitButton = page.locator('[data-testid="login-submit-button"]')
    await expect(submitButton).toBeVisible()
    await expect(submitButton).toContainText(/Sign In|Login/)
  })

  test('✅ Registration page accessible', async ({ page }) => {
    await page.goto('/register')
    
    // Check page is loaded
    await expect(page.locator('text=/Register|Sign Up/')).toBeVisible()
    
    // Check form fields exist
    await expect(page.locator('input[type="email"]')).toBeVisible()
    await expect(page.locator('input[type="password"]')).toBeVisible()
  })

  test('✅ User can login with valid credentials', async ({ page }) => {
    await page.goto('/login')
    
    // Fill in credentials using data-testid
    await page.fill('[data-testid="login-email-input"]', TEST_USER.email)
    await page.fill('[data-testid="login-password-input"]', TEST_USER.password)
    
    // Click submit using data-testid
    await page.click('[data-testid="login-submit-button"]')
    
    // Wait for navigation
    await page.waitForURL(/\/dashboard/, { timeout: 10000 })
    
    // Verify we're on dashboard
    await expect(page.url()).toContain('/dashboard')
  })

  test('✅ Invalid login shows error message', async ({ page }) => {
    await page.goto('/login')
    
    // Fill in invalid credentials using data-testid
    await page.fill('[data-testid="login-email-input"]', 'invalid@test.local')
    await page.fill('[data-testid="login-password-input"]', 'WrongPassword123!')
    
    // Click submit using data-testid
    await page.click('[data-testid="login-submit-button"]')
    
    // Look for error message using data-testid
    const errorMessage = page.locator('[data-testid="login-error-message"]')
    await expect(errorMessage).toBeVisible({ timeout: 5000 })
  })

  test('✅ Authenticated user can access dashboard', async ({ page }) => {
    // Login first
    await page.goto('/login')
    await page.fill('[data-testid="login-email-input"]', TEST_USER.email)
    await page.fill('[data-testid="login-password-input"]', TEST_USER.password)
    await page.click('[data-testid="login-submit-button"]')
    
    // Wait for dashboard
    await page.waitForURL(/\/dashboard/, { timeout: 10000 })
    
    // Check dashboard elements
    await expect(page.locator('[data-testid="dashboard-layout"]')).toBeVisible({ timeout: 5000 })
  })

  test('✅ Unauthenticated users redirected to login', async ({ page }) => {
    // Clear cookies to remove any existing session
    await page.context().clearCookies()
    
    // Try to access dashboard
    await page.goto('/dashboard')
    
    // Should redirect to login
    await expect(page.url()).toContain('/login')
  })

  test('✅ User can logout and return to login', async ({ page }) => {
    // Login first
    await page.goto('/login')
    await page.fill('[data-testid="login-email-input"]', TEST_USER.email)
    await page.fill('[data-testid="login-password-input"]', TEST_USER.password)
    await page.click('[data-testid="login-submit-button"]')
    
    // Wait for dashboard
    await page.waitForURL(/\/dashboard/, { timeout: 10000 })
    
    // Find logout button using data-testid
    const logoutButton = page.locator('[data-testid="dashboard-logout-button"]')
    
    if (await logoutButton.isVisible({ timeout: 2000 }).catch(() => false)) {
      await logoutButton.click()
      await page.waitForURL(/\/login/, { timeout: 5000 })
      await expect(page.url()).toContain('/login')
    }
  })

  // ═══════════════════════════════════════════════════════════════════════
  // Role-Based Access Control (RBAC) Tests
  // ═══════════════════════════════════════════════════════════════════════

  test('✅ User role gets correct dashboard', async ({ page }) => {
    // Login as user
    await page.goto('/login')
    await page.fill('[data-testid="login-email-input"]', TEST_USER.email)
    await page.fill('[data-testid="login-password-input"]', TEST_USER.password)
    await page.click('[data-testid="login-submit-button"]')
    
    // Wait for dashboard
    await page.waitForURL(/\/dashboard/, { timeout: 10000 })
    
    // Check URL contains user dashboard path
    const url = page.url()
    expect(url).toMatch(/\/dashboard\/(user|)$/)
  })

  test('✅ Vendor role gets vendor dashboard', async ({ page }) => {
    // Login as vendor
    await page.goto('/login')
    await page.fill('[data-testid="login-email-input"]', TEST_VENDOR.email)
    await page.fill('[data-testid="login-password-input"]', TEST_VENDOR.password)
    await page.click('[data-testid="login-submit-button"]')
    
    // Wait for dashboard
    await page.waitForURL(/\/dashboard/, { timeout: 10000 })
    
    // Verify vendor dashboard or role indicator
    const url = page.url()
    expect(url).toMatch(/\/dashboard\/(vendor|)$/)
  })

  test('✅ Admin role gets admin dashboard', async ({ page }) => {
    // Login as admin
    await page.goto('/login')
    await page.fill('[data-testid="login-email-input"]', TEST_ADMIN.email)
    await page.fill('[data-testid="login-password-input"]', TEST_ADMIN.password)
    await page.click('[data-testid="login-submit-button"]')
    
    // Wait for dashboard
    await page.waitForURL(/\/dashboard/, { timeout: 10000 })
    
    // Verify admin dashboard or role indicator
    const url = page.url()
    expect(url).toMatch(/\/dashboard\/(admin|)$/)
  })

  test('✅ User cannot access admin routes without permission', async ({ page }) => {
    // Login as regular user
    await page.goto('/login')
    await page.fill('[data-testid="login-email-input"]', TEST_USER.email)
    await page.fill('[data-testid="login-password-input"]', TEST_USER.password)
    await page.click('[data-testid="login-submit-button"]')
    
    // Wait for dashboard
    await page.waitForURL(/\/dashboard/, { timeout: 10000 })
    
    // Try to access admin dashboard directly
    await page.goto('/dashboard/admin')
    
    // Should be redirected or show unauthorized
    const url = page.url()
    const isUnauthorized = url.includes('/unauthorized') || 
                          url.includes('/login') || 
                          !url.includes('/admin')
    expect(isUnauthorized).toBeTruthy()
  })

  // ═══════════════════════════════════════════════════════════════════════
  // Core Features Tests
  // ═══════════════════════════════════════════════════════════════════════

  test('✅ AI search section visible on homepage', async ({ page }) => {
    await page.goto('/')
    
    // Look for AI search section
    const aiSearchSection = page.locator(
      'text=/AI|Artificial Intelligence|Search|Find/',
      'input:has-text("Describe")',
      '[class*="ai-search"]'
    )
    
    await expect(aiSearchSection).toBeVisible({ timeout: 5000 })
  })

  test('✅ Venue search accessible from homepage', async ({ page }) => {
    await page.goto('/')
    
    // Look for venues link or button
    const venuesLink = page.locator(
      'text=/Venues|Explore Venues/i',
      'a[href="/venues"]'
    )
    
    await expect(venuesLink).toBeVisible({ timeout: 5000 })
    
    // Click and verify navigation
    await venuesLink.first().click()
    await page.waitForURL(/\/venues/, { timeout: 5000 })
    await expect(page.url()).toContain('/venues')
  })

  test('✅ Vendor search accessible from homepage', async ({ page }) => {
    await page.goto('/')
    
    // Look for vendors link or button
    const vendorsLink = page.locator(
      'text=/Vendors|Explore Vendors|Vendors Marketplace/i',
      'a[href="/vendors"]'
    )
    
    await expect(vendorsLink).toBeVisible({ timeout: 5000 })
    
    // Click and verify navigation
    await vendorsLink.first().click()
    await page.waitForURL(/\/vendors/, { timeout: 5000 })
    await expect(page.url()).toContain('/vendors')
  })

  test('✅ Navigation menu accessible', async ({ page }) => {
    await page.goto('/')
    
    // Check header navigation
    const header = page.locator('header')
    await expect(header).toBeVisible()
    
    // Check for main navigation links
    const navLinks = page.locator('nav a, [role="navigation"] a')
    const count = await navLinks.count()
    expect(count).toBeGreaterThan(0)
  })

  test('✅ Footer present on all pages', async ({ page }) => {
    // Test on homepage
    await page.goto('/')
    let footer = page.locator('footer')
    await expect(footer).toBeVisible()
    
    // Test on login page
    await page.goto('/login')
    footer = page.locator('footer')
    await expect(footer).toBeVisible()
    
    // Test on venues page
    await page.goto('/venues')
    footer = page.locator('footer')
    await expect(footer).toBeVisible()
  })
})

// Export for CI/CD integration
export { test }
