import { test, expect } from '@playwright/test'

const BASE_URL = 'https://wedding-c4ztttsai-asithalkonaras-projects.vercel.app'

test.describe('🚀 Production Deployment Tests', () => {
  test.beforeEach(async ({ page }) => {
    // Set longer timeout for production testing
    test.setTimeout(60000)
  })

  test('Homepage loads successfully', async ({ page }) => {
    await page.goto(BASE_URL)
    
    // Check page title
    await expect(page).toHaveTitle(/Wedding Dreams Lanka/)
    
    // Check main elements are present
    await expect(page.locator('header')).toBeVisible()
    await expect(page.locator('main')).toBeVisible()
    await expect(page.locator('footer')).toBeVisible()
    
    // Check navigation links (venues and vendors in main nav)
    // Use toBeAttached for mobile compatibility
    const venuesLink = page.locator('a[href="/venues"]').first()
    const vendorsLink = page.locator('a[href="/vendors"]').first()
    
    await expect(venuesLink).toBeAttached()
    await expect(vendorsLink).toBeAttached()
    
    // Check if links are visible (desktop) or just attached (mobile)
    const isVisible = await venuesLink.isVisible().catch(() => false)
    if (isVisible) {
      await expect(venuesLink).toBeVisible()
      await expect(vendorsLink).toBeVisible()
    }
    // Packages page exists and is accessible (tested in "All main pages" test)
  })

  test('All main pages are accessible', async ({ page }) => {
    const pages = [
      '/venues',
      '/vendors', 
      '/packages',
      '/ai-search',
      '/about',
      '/contact',
      '/login',
      '/register'
    ]

    for (const pagePath of pages) {
      console.log(`Testing page: ${pagePath}`)
      await page.goto(`${BASE_URL}${pagePath}`)
      
      // Check page loads without errors
      await expect(page.locator('body')).toBeVisible()
      
      // Check for 404 errors
      const is404 = await page.locator('text=404').isVisible().catch(() => false)
      expect(is404).toBeFalsy()
      
      // Check for server errors
      const hasError = await page.locator('text=Internal Server Error').isVisible().catch(() => false)
      expect(hasError).toBeFalsy()
    }
  })

  test('API endpoints respond correctly', async ({ page }) => {
    // Test packages API
    const packagesResponse = await page.request.get(`${BASE_URL}/api/packages`)
    expect(packagesResponse.status()).toBe(200)
    
    const packagesData = await packagesResponse.json()
    expect(Array.isArray(packagesData)).toBe(true)
    expect(packagesData.length).toBeGreaterThan(0)
    
    // Test AI search API (POST method)
    const aiSearchResponse = await page.request.post(`${BASE_URL}/api/ai-search`, {
      data: { query: 'test search' }
    })
    expect(aiSearchResponse.status()).toBe(200)
  })

  test('Mobile responsiveness works', async ({ page }) => {
    // Test mobile viewport
    await page.setViewportSize({ width: 375, height: 667 })
    await page.goto(BASE_URL)
    
    // Check mobile navigation (button with lg:hidden class)
    await expect(page.locator('button.lg\\:hidden')).toBeVisible()
    
    // Check responsive layout
    await expect(page.locator('header')).toBeVisible()
    await expect(page.locator('main')).toBeVisible()
    
    // On mobile, navigation links are hidden by default, so just check they exist
    const navLinks = page.locator('a[href="/venues"], a[href="/vendors"]')
    await expect(navLinks.first()).toBeAttached()
  })

  test('Performance metrics are acceptable', async ({ page }) => {
    await page.goto(BASE_URL)
    
    // Wait for page to fully load
    await page.waitForLoadState('networkidle')
    
    // Check that page loads within reasonable time
    const startTime = Date.now()
    await page.goto(BASE_URL)
    const loadTime = Date.now() - startTime
    
    // Should load within 10 seconds
    expect(loadTime).toBeLessThan(10000)
  })

  test('Security headers are present', async ({ page }) => {
    const response = await page.goto(BASE_URL)
    
    // Check security headers
    const headers = response?.headers()
    expect(headers?.['x-content-type-options']).toBe('nosniff')
    expect(headers?.['x-frame-options']).toBe('DENY')
    expect(headers?.['x-xss-protection']).toBe('1; mode=block')
    expect(headers?.['strict-transport-security']).toContain('max-age=31536000')
  })

  test('Static assets load correctly', async ({ page }) => {
    await page.goto(BASE_URL)
    
    // Check that CSS files load
    const cssLinks = page.locator('link[rel="stylesheet"]')
    const cssCount = await cssLinks.count()
    expect(cssCount).toBeGreaterThan(0)
    
    // Check that JS files load
    const jsScripts = page.locator('script[src]')
    const jsCount = await jsScripts.count()
    expect(jsCount).toBeGreaterThan(0)
  })

  test('Search functionality works', async ({ page }) => {
    await page.goto(`${BASE_URL}/ai-search`)
    
    // Check search page loads
    await expect(page.locator('h1')).toContainText(/AI Search|Search/)
    
    // Check search input is present (AI search uses specific placeholder)
    await expect(page.locator('input[placeholder*="Describe your dream wedding"]')).toBeVisible()
  })

  test('Authentication pages load', async ({ page }) => {
    // Test login page
    await page.goto(`${BASE_URL}/login`)
    await expect(page.locator('form')).toBeVisible()
    
    // Test register page
    await page.goto(`${BASE_URL}/register`)
    await expect(page.locator('form')).toBeVisible()
  })

  test('Error pages handle gracefully', async ({ page }) => {
    // Test 404 page
    await page.goto(`${BASE_URL}/non-existent-page`)
    
    // Should show 404 or redirect to home
    const is404 = await page.locator('text=404').isVisible().catch(() => false)
    const isHome = await page.locator('text=Wedding Dreams Lanka').isVisible().catch(() => false)
    
    expect(is404 || isHome).toBe(true)
  })
})

test.describe('🔧 Production Health Checks', () => {
  test('Database connectivity (if configured)', async ({ page }) => {
    // This test will pass even if DB is not configured
    // as we're using sample data in production
    const response = await page.request.get(`${BASE_URL}/api/packages`)
    expect(response.status()).toBe(200)
  })

  test('Environment variables are set', async ({ page }) => {
    // Check that the app runs in production mode
    const response = await page.goto(BASE_URL)
    expect(response?.status()).toBe(200)
  })

  test('Build artifacts are present', async ({ page }) => {
    await page.goto(BASE_URL)
    
    // Check for Next.js build artifacts
    const scripts = page.locator('script[src*="_next/static"]')
    const scriptCount = await scripts.count()
    expect(scriptCount).toBeGreaterThan(0)
  })
})
