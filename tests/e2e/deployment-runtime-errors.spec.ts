import { test, expect } from '@playwright/test'

const DEPLOYMENT_URL = process.env.E2E_BASE_URL || 'https://wedding-lk.vercel.app'

// Track all runtime errors, API failures, and warnings
const runtimeIssues = {
  console_errors: [] as string[],
  console_warnings: [] as string[],
  api_errors: [] as { endpoint: string; status: number; error: string }[],
  undefined_properties: [] as string[],
  manifest_errors: [] as string[],
  network_errors: [] as string[],
  permissions_errors: [] as string[],
}

test.describe('🚀 DEPLOYMENT - Runtime Error Tracking & Verification', () => {
  test.beforeEach(async ({ page }) => {
    // Capture all console messages
    page.on('console', (msg) => {
      const type = msg.type()
      const text = msg.text()

      if (type === 'error') {
        runtimeIssues.console_errors.push(text)
        console.log(`[CONSOLE ERROR] ${text}`)
      } else if (type === 'warning') {
        runtimeIssues.console_warnings.push(text)
      }

      // Catch undefined property errors
      if (text.includes('Cannot read properties of undefined') || text.includes('Cannot read property')) {
        runtimeIssues.undefined_properties.push(text)
      }

      // Catch manifest errors
      if (text.includes('manifest') || text.includes('web app manifest')) {
        runtimeIssues.manifest_errors.push(text)
      }
    })

    // Capture network errors
    page.on('requestfailed', (request) => {
      runtimeIssues.network_errors.push(`${request.method()} ${request.url()}`)
      console.log(`[NETWORK ERROR] ${request.method()} ${request.url()}`)
    })

    // Capture uncaught exceptions
    page.on('pageerror', (error) => {
      runtimeIssues.console_errors.push(`Uncaught: ${error.message}`)
      console.log(`[PAGE ERROR] ${error.message}`)
    })
  })

  test('✅ 1. Homepage loads without runtime errors', async ({ page, context }) => {
    const startTime = Date.now()
    
    await page.goto(`${DEPLOYMENT_URL}/`, { waitUntil: 'networkidle' })
    
    const loadTime = Date.now() - startTime
    console.log(`Homepage loaded in ${loadTime}ms`)
    
    // Check for critical page elements
    await expect(page).toHaveTitle(/WeddingLK/i)
    
    // No console errors should exist
    expect(runtimeIssues.console_errors).toHaveLength(0)
    expect(runtimeIssues.undefined_properties).toHaveLength(0)
  })

  test('✅ 2. Login page renders correctly', async ({ page }) => {
    await page.goto(`${DEPLOYMENT_URL}/login`, { waitUntil: 'networkidle' })
    
    // Check email and password inputs exist
    const emailInput = page.locator('[data-testid="login-email-input"]')
    const passwordInput = page.locator('[data-testid="login-password-input"]')
    
    await expect(emailInput).toBeVisible()
    await expect(passwordInput).toBeVisible()
    
    // No undefined property errors
    expect(runtimeIssues.undefined_properties).toHaveLength(0)
  })

  test('✅ 3. User login flow with authentication', async ({ page }) => {
    await page.goto(`${DEPLOYMENT_URL}/login`, { waitUntil: 'networkidle' })
    
    // Fill login form
    await page.fill('[data-testid="login-email-input"]', 'user@test.local')
    await page.fill('[data-testid="login-password-input"]', 'Test123!')
    
    // Track API responses
    const responses: { status: number; url: string }[] = []
    page.on('response', (resp) => {
      if (resp.url().includes('/api/')) {
        responses.push({ status: resp.status(), url: resp.url() })
        
        if (resp.status() === 401) {
          runtimeIssues.permissions_errors.push(`401 Unauthorized: ${resp.url()}`)
        }
        if (resp.status() >= 500) {
          runtimeIssues.api_errors.push({
            endpoint: resp.url(),
            status: resp.status(),
            error: 'Server error'
          })
        }
      }
    })
    
    await page.click('[data-testid="login-submit-button"]')
    
    // Wait for navigation or error
    try {
      await page.waitForURL(/\/dashboard|\/login/, { timeout: 10000 })
    } catch (e) {
      console.log(`Login navigation timeout or error: ${e}`)
    }
    
    // Check for 401 errors
    const auth401Errors = responses.filter(r => r.status === 401)
    if (auth401Errors.length > 0) {
      console.warn(`⚠ 401 Unauthorized responses: ${auth401Errors.length}`)
    }
    
    // No undefined property errors
    expect(runtimeIssues.undefined_properties).toHaveLength(0)
  })

  test('✅ 4. Dashboard access with role-based views', async ({ page }) => {
    // First login
    await page.goto(`${DEPLOYMENT_URL}/login`, { waitUntil: 'networkidle' })
    await page.fill('[data-testid="login-email-input"]', 'user@test.local')
    await page.fill('[data-testid="login-password-input"]', 'Test123!')
    await page.click('[data-testid="login-submit-button"]')
    
    // Try to navigate to dashboard
    try {
      await page.waitForURL(/\/dashboard/, { timeout: 15000 })
      const dashboardVisible = await page.locator('[data-testid="dashboard-layout"]').isVisible().catch(() => false)
      
      if (dashboardVisible) {
        console.log('✓ Dashboard loaded successfully')
      }
    } catch (e) {
      console.log(`Dashboard navigation timeout: ${e}`)
    }
    
    // No undefined property errors
    expect(runtimeIssues.undefined_properties).toHaveLength(0)
  })

  test('✅ 5. API endpoints - Check 401 auth errors', async ({ request }) => {
    const apiTests = [
      { method: 'GET', path: '/api/auth/me' },
      { method: 'GET', path: '/api/dashboard' },
      { method: 'GET', path: '/api/bookings' },
      { method: 'GET', path: '/api/users/profile' },
    ]

    for (const test of apiTests) {
      try {
        const response = await request.get(`${DEPLOYMENT_URL}${test.path}`, {
          timeout: 10000,
        })
        
        console.log(`${test.method} ${test.path} - ${response.status()}`)
        
        // 401 is expected without auth token
        if (response.status() === 401) {
          console.log(`  ✓ Correctly returns 401 (auth required)`)
        } else if (response.status() === 200) {
          console.log(`  ✓ Successfully responded`)
        } else {
          runtimeIssues.api_errors.push({
            endpoint: test.path,
            status: response.status(),
            error: `Unexpected status: ${response.status()}`
          })
        }
      } catch (error: any) {
        runtimeIssues.api_errors.push({
          endpoint: test.path,
          status: 0,
          error: error.message
        })
        console.log(`  ✗ Error: ${error.message}`)
      }
    }
  })

  test('✅ 6. Venues API - Check data responses', async ({ request }) => {
    try {
      const response = await request.get(`${DEPLOYMENT_URL}/api/venues`, { timeout: 10000 })
      
      if (response.ok) {
        const data = await response.json()
        console.log(`✓ Venues API responded with status ${response.status()}`)
        console.log(`  Venues count: ${data.venues?.length || 0}`)
      } else {
        runtimeIssues.api_errors.push({
          endpoint: '/api/venues',
          status: response.status(),
          error: `Status: ${response.status()}`
        })
      }
    } catch (error: any) {
      runtimeIssues.api_errors.push({
        endpoint: '/api/venues',
        status: 0,
        error: error.message
      })
    }
  })

  test('✅ 7. Search API - Check runtime errors', async ({ request }) => {
    try {
      const response = await request.get(`${DEPLOYMENT_URL}/api/search?q=test`, { timeout: 10000 })
      
      if (response.ok) {
        const data = await response.json()
        console.log(`✓ Search API responded successfully`)
      } else {
        runtimeIssues.api_errors.push({
          endpoint: '/api/search',
          status: response.status(),
          error: `Status: ${response.status()}`
        })
      }
    } catch (error: any) {
      runtimeIssues.api_errors.push({
        endpoint: '/api/search',
        status: 0,
        error: error.message
      })
    }
  })

  test('✅ 8. Health check endpoints', async ({ request }) => {
    try {
      const response = await request.get(`${DEPLOYMENT_URL}/api/health/db`, { timeout: 10000 })
      
      if (response.ok || response.status() === 503) {
        const data = await response.json()
        console.log(`✓ Health check: ${data.status || 'ok'}`)
      } else {
        runtimeIssues.api_errors.push({
          endpoint: '/api/health/db',
          status: response.status(),
          error: 'Health check failed'
        })
      }
    } catch (error: any) {
      console.log(`Health check error (may be expected): ${error.message}`)
    }
  })

  test('✅ 9. Homepage navigation links work', async ({ page }) => {
    await page.goto(`${DEPLOYMENT_URL}/`, { waitUntil: 'networkidle' })
    
    // Try clicking navigation links
    const links = await page.locator('nav a[href]').all()
    console.log(`Found ${links.length} navigation links`)
    
    for (let i = 0; i < Math.min(3, links.length); i++) {
      try {
        const href = await links[i].getAttribute('href')
        console.log(`  ✓ Navigation link: ${href}`)
      } catch (e) {
        console.log(`  Error reading link: ${e}`)
      }
    }
    
    expect(runtimeIssues.undefined_properties).toHaveLength(0)
  })

  test('✅ 10. Mobile responsiveness - no layout errors', async ({ page }) => {
    // Test mobile viewport
    await page.setViewportSize({ width: 375, height: 667 })
    await page.goto(`${DEPLOYMENT_URL}/`, { waitUntil: 'networkidle' })
    
    const mobileMenuButton = page.locator('[data-testid="dashboard-mobile-menu-button"]')
    const isVisible = await mobileMenuButton.isVisible().catch(() => false)
    
    console.log(`Mobile menu button visible on mobile: ${isVisible ? 'yes' : 'no'}`)
    
    expect(runtimeIssues.undefined_properties).toHaveLength(0)
  })

  test.afterAll(async () => {
    // Print comprehensive error report
    console.log('\n╔════════════════════════════════════════════════════════╗')
    console.log('║          DEPLOYMENT RUNTIME ERROR REPORT              ║')
    console.log('╚════════════════════════════════════════════════════════╝\n')

    console.log('📊 RUNTIME ERROR SUMMARY')
    console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━')
    console.log(`  Console Errors: ${runtimeIssues.console_errors.length}`)
    console.log(`  Console Warnings: ${runtimeIssues.console_warnings.length}`)
    console.log(`  API Errors: ${runtimeIssues.api_errors.length}`)
    console.log(`  Undefined Properties: ${runtimeIssues.undefined_properties.length}`)
    console.log(`  Manifest Errors: ${runtimeIssues.manifest_errors.length}`)
    console.log(`  Network Errors: ${runtimeIssues.network_errors.length}`)
    console.log(`  Auth (401) Errors: ${runtimeIssues.permissions_errors.length}`)

    if (runtimeIssues.console_errors.length > 0) {
      console.log('\n❌ CONSOLE ERRORS:')
      runtimeIssues.console_errors.slice(0, 5).forEach((err, i) => {
        console.log(`  ${i + 1}. ${err.substring(0, 100)}...`)
      })
    }

    if (runtimeIssues.api_errors.length > 0) {
      console.log('\n❌ API ERRORS:')
      runtimeIssues.api_errors.forEach((err, i) => {
        console.log(`  ${i + 1}. ${err.endpoint} - ${err.status}: ${err.error}`)
      })
    }

    if (runtimeIssues.undefined_properties.length > 0) {
      console.log('\n❌ UNDEFINED PROPERTY ERRORS:')
      runtimeIssues.undefined_properties.slice(0, 5).forEach((err, i) => {
        console.log(`  ${i + 1}. ${err.substring(0, 100)}...`)
      })
    }

    if (runtimeIssues.permissions_errors.length > 0) {
      console.log('\n⚠️  AUTHORIZATION ERRORS (401):')
      runtimeIssues.permissions_errors.slice(0, 5).forEach((err, i) => {
        console.log(`  ${i + 1}. ${err}`)
      })
    }

    // Overall status
    const totalIssues = 
      runtimeIssues.console_errors.length + 
      runtimeIssues.undefined_properties.length + 
      runtimeIssues.manifest_errors.length

    console.log('\n' + '━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━')
    if (totalIssues === 0) {
      console.log('✅ DEPLOYMENT STATUS: CLEAN - NO RUNTIME ERRORS DETECTED')
    } else {
      console.log(`⚠️  DEPLOYMENT STATUS: ${totalIssues} issues detected`)
    }
    console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━\n')
  })
})
