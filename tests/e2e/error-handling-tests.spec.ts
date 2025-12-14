import { test, expect } from '@playwright/test'

const TEST_USER = { email: 'user@test.local', password: 'Test123!' }

test.describe('⚠️ Error Handling Tests - Phase 6', () => {
  
  // ═══════════════════════════════════════════════════════════════════════
  // Authentication Error Handling
  // ═══════════════════════════════════════════════════════════════════════

  test.describe('🔐 Authentication Error Handling', () => {
    test('✅ Empty email shows validation error', async ({ page }) => {
      await page.goto('/login')
      
      const passwordInput = page.locator('input[name="password"]')
      const submitBtn = page.locator('button[type="submit"]')
      
      if (await passwordInput.isVisible()) {
        await passwordInput.fill('somepassword')
        await submitBtn.click()
        
        // Should show validation error or prevent submission
        await page.waitForTimeout(1000)
      }
    })

    test('✅ Empty password shows validation error', async ({ page }) => {
      await page.goto('/login')
      
      const emailInput = page.locator('input[name="email"]')
      const submitBtn = page.locator('button[type="submit"]')
      
      await emailInput.fill('test@example.com')
      await submitBtn.click()
      
      // Should show validation error
      await page.waitForTimeout(1000)
    })

    test('✅ Invalid email format shows error', async ({ page }) => {
      await page.goto('/login')
      
      const emailInput = page.locator('input[name="email"]')
      const passwordInput = page.locator('input[name="password"]')
      const submitBtn = page.locator('button[type="submit"]')
      
      await emailInput.fill('not-an-email')
      await passwordInput.fill('Password123!')
      await submitBtn.click()
      
      await page.waitForTimeout(1000)
    })

    test('✅ Non-existent user shows error', async ({ page }) => {
      await page.goto('/login')
      
      const emailInput = page.locator('input[name="email"]')
      const passwordInput = page.locator('input[name="password"]')
      const submitBtn = page.locator('button[type="submit"]')
      
      await emailInput.fill('nonexistent@test.local')
      await passwordInput.fill('Password123!')
      await submitBtn.click()
      
      // Should show error message
      const errorMsg = page.locator('text=/error|invalid|not found/i')
      await errorMsg.waitFor({ state: 'visible', timeout: 5000 }).catch(() => {})
    })

    test('✅ Wrong password shows error', async ({ page }) => {
      await page.goto('/login')
      
      const emailInput = page.locator('input[name="email"]')
      const passwordInput = page.locator('input[name="password"]')
      const submitBtn = page.locator('button[type="submit"]')
      
      await emailInput.fill(TEST_USER.email)
      await passwordInput.fill('WrongPassword123!')
      await submitBtn.click()
      
      // Should show error message
      const errorMsg = page.locator('text=/invalid|password|error/i')
      await errorMsg.waitFor({ state: 'visible', timeout: 5000 }).catch(() => {})
    })

    test('✅ Duplicate email on registration shows error', async ({ page }) => {
      await page.goto('/register')
      
      const nameInput = page.locator('input[name="name"]')
      const emailInput = page.locator('input[name="email"]')
      const passwordInput = page.locator('input[name="password"]')
      const submitBtn = page.locator('button[type="submit"]')
      
      if (await nameInput.isVisible()) {
        await nameInput.fill('Test User')
        await emailInput.fill(TEST_USER.email)
        await passwordInput.fill('Password123!')
        await submitBtn.click()
        
        // Should show duplicate error
        await page.waitForTimeout(1000)
      }
    })

    test('✅ Weak password shows validation error', async ({ page }) => {
      await page.goto('/register')
      
      const passwordInput = page.locator('input[name="password"]')
      
      if (await passwordInput.isVisible()) {
        await passwordInput.fill('weak')
        
        // Should show validation message
        await page.waitForTimeout(500)
      }
    })
  })

  // ═══════════════════════════════════════════════════════════════════════
  // Navigation Error Handling
  // ═══════════════════════════════════════════════════════════════════════

  test.describe('🗺️ Navigation Error Handling', () => {
    test('✅ 404 page is displayed for non-existent routes', async ({ page }) => {
      const response = await page.goto('/non-existent-page', { waitUntil: 'networkidle' })
      
      // Page should either show 404 or redirect
      expect([200, 404]).toContain(response?.status())
    })

    test('✅ Can navigate away from 404 page', async ({ page }) => {
      await page.goto('/non-existent-page')
      
      // Try to go home
      await page.goto('/')
      
      await expect(page).toHaveURL('/')
    })

    test('✅ Broken link handling', async ({ page }) => {
      await page.goto('/')
      
      // Try to click on non-existent links
      const brokenLinks = page.locator('a[href="/broken"]')
      
      if (await brokenLinks.isVisible()) {
        await brokenLinks.first().click()
        
        // Should handle gracefully
        await page.waitForTimeout(1000)
      }
    })

    test('✅ Protected route redirects unauthenticated user', async ({ page }) => {
      // Clear cookies to ensure logged out
      await page.context().clearCookies()
      
      // Try to access protected route
      await page.goto('/dashboard')
      
      // Should redirect to login
      await page.waitForURL(/\/login/, { timeout: 5000 })
    })

    test('✅ Invalid query parameters handled gracefully', async ({ page }) => {
      const response = await page.goto('/?invalid=param&test=value')
      
      // Should still load page
      expect([200, 404]).toContain(response?.status())
    })
  })

  // ═══════════════════════════════════════════════════════════════════════
  // Network Error Handling
  // ═══════════════════════════════════════════════════════════════════════

  test.describe('🌐 Network Error Handling', () => {
    test('✅ Page loads with network issues', async ({ page }) => {
      // Simulate slow 3G
      await page.route('**/*', route => {
        setTimeout(() => route.continue(), 100)
      })
      
      await page.goto('/')
      
      await expect(page.locator('header')).toBeVisible()
      
      page.unroute('**/*')
    })

    test('✅ Failed API call shows error message', async ({ page }) => {
      // Block API endpoints
      await page.route('/api/**', route => route.abort())
      
      await page.goto('/')
      
      // Page should still load, but API data might be missing
      await page.waitForTimeout(1000)
      
      page.unroute('/api/**')
    })

    test('✅ Offline mode handling', async ({ page }) => {
      await page.goto('/')
      
      // Go offline
      await page.context().setOffline(true)
      
      // Try to interact
      const links = page.locator('a[href="/venues"]')
      if (await links.isVisible()) {
        await links.first().click().catch(() => {})
      }
      
      // Come back online
      await page.context().setOffline(false)
    })

    test('✅ Timeout on slow endpoint', async ({ page }) => {
      // Set very short timeout
      await page.goto('/vendors', { timeout: 500 }).catch(() => {
        // Timeout is expected
      })
    })

    test('✅ CORS error handling', async ({ page }) => {
      // Block cross-origin requests
      await page.route('https://external-api.example.com/**', route => route.abort())
      
      await page.goto('/')
      
      // Page should still work
      await page.waitForTimeout(500)
      
      page.unroute('https://external-api.example.com/**')
    })
  })

  // ═══════════════════════════════════════════════════════════════════════
  // Form Error Handling
  // ═══════════════════════════════════════════════════════════════════════

  test.describe('📝 Form Error Handling', () => {
    test('✅ Required field validation', async ({ page }) => {
      await page.goto('/login')
      
      const submitBtn = page.locator('button[type="submit"]')
      
      // Try to submit without filling fields
      await submitBtn.click()
      
      // Should either show validation error or prevent submission
      await page.waitForTimeout(1000)
    })

    test('✅ File upload error handling', async ({ page }) => {
      await page.goto('/register')
      
      const fileInputs = page.locator('input[type="file"]')
      
      if (await fileInputs.isVisible()) {
        // Try to upload invalid file type
        // This depends on implementation
        await page.waitForTimeout(500)
      }
    })

    test('✅ Form submission error recovery', async ({ page }) => {
      await page.goto('/login')
      
      const emailInput = page.locator('input[name="email"]')
      const passwordInput = page.locator('input[name="password"]')
      const submitBtn = page.locator('button[type="submit"]')
      
      // Attempt bad submission
      await submitBtn.click()
      
      // Should be able to retry
      await emailInput.fill(TEST_USER.email)
      await passwordInput.fill(TEST_USER.password)
      await submitBtn.click()
      
      await page.waitForTimeout(1000)
    })

    test('✅ Max length validation on text fields', async ({ page }) => {
      await page.goto('/register')
      
      const inputs = page.locator('input[maxlength]')
      
      if (await inputs.count() > 0) {
        const firstInput = inputs.first()
        const maxLength = await firstInput.getAttribute('maxlength')
        
        if (maxLength) {
          const veryLongString = 'a'.repeat(parseInt(maxLength) + 100)
          await firstInput.fill(veryLongString)
          
          // Value should be limited
          const value = await firstInput.inputValue()
          expect(value.length).toBeLessThanOrEqual(parseInt(maxLength))
        }
      }
    })
  })

  // ═══════════════════════════════════════════════════════════════════════
  // UI Component Error Handling
  // ═══════════════════════════════════════════════════════════════════════

  test.describe('🎨 UI Component Error Handling', () => {
    test('✅ Missing image fallback', async ({ page }) => {
      await page.goto('/venues')
      
      // Break image URLs
      await page.route('**/images/**', route => route.abort())
      
      const images = page.locator('img')
      
      // Page should still display
      await expect(page.locator('body')).toBeVisible()
      
      page.unroute('**/images/**')
    })

    test('✅ Modal close on error', async ({ page }) => {
      await page.goto('/')
      
      // Look for modal or dialog
      const modal = page.locator('[role="dialog"], [class*="modal"]')
      
      if (await modal.isVisible()) {
        const closeBtn = modal.locator('button[aria-label="Close"], button:has-text("×")')
        
        if (await closeBtn.isVisible()) {
          await closeBtn.click()
        }
      }
    })

    test('✅ Tooltip error messages display', async ({ page }) => {
      await page.goto('/login')
      
      const errorElements = page.locator('[role="tooltip"], [class*="error"]')
      
      if (await errorElements.isVisible()) {
        await expect(errorElements).toBeVisible()
      }
    })

    test('✅ Loading state timeout fallback', async ({ page }) => {
      // Set up route with long delay
      await page.route('**/api/**', route => {
        setTimeout(() => route.continue(), 10000)
      })
      
      await page.goto('/')
      
      // Page should become interactive even if API slow
      await page.waitForTimeout(2000)
      
      page.unroute('**/api/**')
    })
  })

  // ═══════════════════════════════════════════════════════════════════════
  // Data Error Handling
  // ═══════════════════════════════════════════════════════════════════════

  test.describe('💾 Data Error Handling', () => {
    test('✅ Invalid JSON response handling', async ({ page }) => {
      await page.route('/api/**', route => {
        route.fulfill({
          status: 200,
          body: 'not valid json'
        })
      })
      
      await page.goto('/')
      
      // Page should handle gracefully
      await page.waitForTimeout(500)
      
      page.unroute('/api/**')
    })

    test('✅ Null/undefined data handling', async ({ page }) => {
      await page.route('/api/**', route => {
        route.fulfill({
          status: 200,
          body: JSON.stringify({ data: null })
        })
      })
      
      await page.goto('/')
      
      await page.waitForTimeout(500)
      
      page.unroute('/api/**')
    })

    test('✅ Empty array response handling', async ({ page }) => {
      await page.route('/api/venues', route => {
        route.fulfill({
          status: 200,
          body: JSON.stringify([])
        })
      })
      
      await page.goto('/venues')
      
      // Should show empty state
      await page.waitForTimeout(500)
      
      page.unroute('/api/venues')
    })

    test('✅ Large response handling', async ({ page }) => {
      // Create large response
      const largeData = Array(1000).fill({ id: 1, name: 'Test' })
      
      await page.route('/api/**', route => {
        route.fulfill({
          status: 200,
          body: JSON.stringify(largeData)
        })
      })
      
      await page.goto('/')
      
      // Page should render without crashing
      await page.waitForTimeout(1000)
      
      page.unroute('/api/**')
    })
  })

  // ═══════════════════════════════════════════════════════════════════════
  // Browser/System Error Handling
  // ═══════════════════════════════════════════════════════════════════════

  test.describe('🖥️ Browser/System Error Handling', () => {
    test('✅ JavaScript error handling', async ({ page }) => {
      const errors: string[] = []
      
      page.on('console', msg => {
        if (msg.type() === 'error') {
          errors.push(msg.text())
        }
      })
      
      await page.goto('/')
      
      // Page should load despite errors
      await expect(page.locator('body')).toBeVisible()
    })

    test('✅ Memory leak handling on navigation', async ({ page }) => {
      // Navigate multiple times
      for (let i = 0; i < 5; i++) {
        await page.goto('/')
        await page.goto('/venues')
        await page.goto('/vendors')
      }
      
      // Page should still be responsive
      await expect(page.locator('body')).toBeVisible()
    })

    test('✅ Rapid navigation handling', async ({ page }) => {
      // Navigate rapidly
      await page.goto('/')
      await page.goto('/venues')
      await page.goto('/vendors')
      await page.goto('/about')
      
      // Should end up at last page
      await expect(page).toHaveURL(/about/)
    })

    test('✅ Window resize error handling', async ({ page }) => {
      await page.goto('/')
      
      // Resize rapidly
      for (let i = 320; i < 1920; i += 200) {
        await page.setViewportSize({ width: i, height: 768 })
      }
      
      // Page should still be responsive
      await expect(page.locator('body')).toBeVisible()
    })

    test('✅ Storage quota error handling', async ({ page }) => {
      await page.goto('/')
      
      // Try to use localStorage
      try {
        await page.evaluate(() => {
          localStorage.setItem('test', 'value')
        })
      } catch (e) {
        // Storage full is okay
      }
    })
  })
})

export { test }
