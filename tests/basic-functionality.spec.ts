import { test, expect } from '@playwright/test'

const BASE_URL = process.env.DEPLOY_URL || 'http://localhost:3002'

test.describe('Basic Functionality Tests', () => {
  test('Homepage loads successfully', async ({ page }) => {
    await page.goto(BASE_URL)
    await page.waitForLoadState('networkidle')
    
    // Check if the page loads without errors
    await expect(page).toHaveTitle(/Wedding Dreams Lanka/)
    
    // Check for main navigation
    await expect(page.locator('nav')).toBeVisible()
    
    // Check for main content
    await expect(page.locator('main')).toBeVisible()
  })
  
  test('Login page loads successfully', async ({ page }) => {
    await page.goto(`${BASE_URL}/login`)
    await page.waitForLoadState('networkidle')
    
    // Check if login form is present
    await expect(page.locator('form')).toBeVisible()
    
    // Check for email and password inputs
    await expect(page.locator('input[type="email"]')).toBeVisible()
    await expect(page.locator('input[type="password"]')).toBeVisible()
    
    // Check for submit button
    await expect(page.locator('button[type="submit"]')).toBeVisible()
  })
  
  test('Venues page loads successfully', async ({ page }) => {
    await page.goto(`${BASE_URL}/venues`)
    await page.waitForLoadState('networkidle')
    
    // Check if venues page loads
    await expect(page.locator('main')).toBeVisible()
    
    // Check for page content
    await expect(page.locator('h1, h2, h3')).toHaveCount({ min: 1 })
  })
  
  test('Vendors page loads successfully', async ({ page }) => {
    await page.goto(`${BASE_URL}/vendors`)
    await page.waitForLoadState('networkidle')
    
    // Check if vendors page loads
    await expect(page.locator('main')).toBeVisible()
    
    // Check for page content
    await expect(page.locator('h1, h2, h3')).toHaveCount({ min: 1 })
  })
  
  test('Packages page loads successfully', async ({ page }) => {
    await page.goto(`${BASE_URL}/packages`)
    await page.waitForLoadState('networkidle')
    
    // Check if packages page loads
    await expect(page.locator('main')).toBeVisible()
    
    // Check for page content
    await expect(page.locator('h1, h2, h3')).toHaveCount({ min: 1 })
  })
  
  test('AI Search page loads successfully', async ({ page }) => {
    await page.goto(`${BASE_URL}/ai-search`)
    await page.waitForLoadState('networkidle')
    
    // Check if AI search page loads
    await expect(page.locator('main')).toBeVisible()
    
    // Check for search form
    await expect(page.locator('form')).toBeVisible()
  })
  
  test('Mobile responsiveness works', async ({ page }) => {
    // Set mobile viewport
    await page.setViewportSize({ width: 375, height: 667 })
    
    await page.goto(BASE_URL)
    await page.waitForLoadState('networkidle')
    
    // Check if page is responsive
    await expect(page.locator('body')).toBeVisible()
    
    // Check for mobile navigation
    const mobileMenu = page.locator('[data-testid="mobile-menu"], .mobile-menu, button[aria-label*="menu"]')
    if (await mobileMenu.count() > 0) {
      await expect(mobileMenu.first()).toBeVisible()
    }
  })
  
  test('API endpoints are accessible', async ({ page }) => {
    // Test venues API
    const venuesResponse = await page.request.get(`${BASE_URL}/api/venues`)
    expect(venuesResponse.status()).toBeLessThan(500)
    
    // Test vendors API
    const vendorsResponse = await page.request.get(`${BASE_URL}/api/vendors`)
    expect(vendorsResponse.status()).toBeLessThan(500)
    
    // Test packages API
    const packagesResponse = await page.request.get(`${BASE_URL}/api/packages`)
    expect(packagesResponse.status()).toBeLessThan(500)
  })
})
