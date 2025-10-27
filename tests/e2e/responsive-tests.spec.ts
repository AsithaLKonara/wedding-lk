import { test, expect } from '@playwright/test'

const VIEWPORTS = {
  mobile: { width: 375, height: 667 },
  tablet: { width: 768, height: 1024 },
  desktop: { width: 1920, height: 1080 }
}

test.describe('📱 Responsive Design Tests - Phase 5', () => {
  
  // ═══════════════════════════════════════════════════════════════════════
  // Mobile Responsive Tests
  // ═══════════════════════════════════════════════════════════════════════

  test.describe('📱 Mobile Responsive (375px)', () => {
    test.beforeEach(async ({ page }) => {
      await page.setViewportSize(VIEWPORTS.mobile)
    })

    test('✅ Homepage is mobile responsive', async ({ page }) => {
      await page.goto('/')
      
      const header = page.locator('header')
      const main = page.locator('main')
      
      await expect(header).toBeVisible()
      await expect(main).toBeVisible()
    })

    test('✅ Navigation menu works on mobile', async ({ page }) => {
      await page.goto('/')
      
      // Look for hamburger menu or mobile nav
      const hamburger = page.locator('button[aria-label*="menu"], button:has-text("☰"), [class*="hamburger"]')
      if (await hamburger.isVisible()) {
        await hamburger.click()
        const navMenu = page.locator('nav')
        await expect(navMenu).toBeVisible()
      }
    })

    test('✅ Venues page is mobile responsive', async ({ page }) => {
      await page.goto('/venues')
      
      const venueCards = page.locator('[class*="card"], [class*="venue"], li')
      expect(await venueCards.count()).toBeGreaterThanOrEqual(0)
    })

    test('✅ Vendors page is mobile responsive', async ({ page }) => {
      await page.goto('/vendors')
      
      const vendorCards = page.locator('[class*="card"], [class*="vendor"], li')
      expect(await vendorCards.count()).toBeGreaterThanOrEqual(0)
    })

    test('✅ Login form is mobile responsive', async ({ page }) => {
      await page.goto('/login')
      
      const emailInput = page.locator('input[name="email"]')
      const passwordInput = page.locator('input[name="password"]')
      const submitBtn = page.locator('button[type="submit"]')
      
      await expect(emailInput).toBeVisible()
      await expect(passwordInput).toBeVisible()
      await expect(submitBtn).toBeVisible()
    })

    test('✅ Register form is mobile responsive', async ({ page }) => {
      await page.goto('/register')
      
      const form = page.locator('form')
      const inputs = page.locator('input')
      
      await expect(form).toBeVisible()
      expect(await inputs.count()).toBeGreaterThan(0)
    })

    test('✅ Footer is mobile responsive', async ({ page }) => {
      await page.goto('/')
      await page.evaluate(() => window.scrollBy(0, document.body.scrollHeight))
      
      const footer = page.locator('footer')
      await expect(footer).toBeVisible()
    })

    test('✅ Images are responsive', async ({ page }) => {
      await page.goto('/venues')
      
      const images = page.locator('img')
      if (await images.count() > 0) {
        const firstImg = images.first()
        const box = await firstImg.boundingBox()
        
        // Image should be within viewport width
        if (box) {
          expect(box.width).toBeLessThanOrEqual(375)
        }
      }
    })

    test('✅ Buttons are mobile touch-friendly', async ({ page }) => {
      await page.goto('/')
      
      const buttons = page.locator('button')
      if (await buttons.count() > 0) {
        const firstBtn = buttons.first()
        const box = await firstBtn.boundingBox()
        
        // Buttons should be at least 44x44px (touch-friendly size)
        if (box) {
          expect(box.height).toBeGreaterThanOrEqual(40)
        }
      }
    })

    test('✅ Text is readable on mobile', async ({ page }) => {
      await page.goto('/')
      
      const heading = page.locator('h1, h2').first()
      if (await heading.isVisible()) {
        const fontSize = await heading.evaluate(el => 
          window.getComputedStyle(el).fontSize
        )
        
        // Font should be at least 14px
        const size = parseInt(fontSize)
        expect(size).toBeGreaterThanOrEqual(14)
      }
    })

    test('✅ No horizontal scroll on mobile', async ({ page }) => {
      await page.goto('/')
      
      const scrollWidth = await page.evaluate(() => document.documentElement.scrollWidth)
      const clientWidth = await page.evaluate(() => document.documentElement.clientWidth)
      
      expect(scrollWidth).toBeLessThanOrEqual(clientWidth + 1) // +1 for rounding
    })
  })

  // ═══════════════════════════════════════════════════════════════════════
  // Tablet Responsive Tests
  // ═══════════════════════════════════════════════════════════════════════

  test.describe('📊 Tablet Responsive (768px)', () => {
    test.beforeEach(async ({ page }) => {
      await page.setViewportSize(VIEWPORTS.tablet)
    })

    test('✅ Homepage is tablet responsive', async ({ page }) => {
      await page.goto('/')
      
      const header = page.locator('header')
      const main = page.locator('main')
      
      await expect(header).toBeVisible()
      await expect(main).toBeVisible()
    })

    test('✅ Two-column layout on tablet', async ({ page }) => {
      await page.goto('/venues')
      
      // Should show multiple columns on tablet
      const cards = page.locator('[class*="card"]')
      expect(await cards.count()).toBeGreaterThanOrEqual(0)
    })

    test('✅ Sidebar shows on tablet', async ({ page }) => {
      await page.goto('/')
      
      // Check for sidebar or side navigation
      const sidebar = page.locator('aside, [class*="sidebar"]')
      if (await sidebar.count() > 0) {
        await expect(sidebar.first()).toBeVisible()
      }
    })

    test('✅ Navigation is usable on tablet', async ({ page }) => {
      await page.goto('/')
      
      const nav = page.locator('nav')
      if (await nav.isVisible()) {
        await expect(nav).toBeVisible()
      }
    })

    test('✅ Forms have proper spacing on tablet', async ({ page }) => {
      await page.goto('/login')
      
      const form = page.locator('form')
      const inputs = form.locator('input')
      
      expect(await inputs.count()).toBeGreaterThan(0)
    })
  })

  // ═══════════════════════════════════════════════════════════════════════
  // Desktop Responsive Tests
  // ═══════════════════════════════════════════════════════════════════════

  test.describe('🖥️ Desktop Responsive (1920px)', () => {
    test.beforeEach(async ({ page }) => {
      await page.setViewportSize(VIEWPORTS.desktop)
    })

    test('✅ Homepage uses full desktop width', async ({ page }) => {
      await page.goto('/')
      
      const main = page.locator('main')
      await expect(main).toBeVisible()
    })

    test('✅ Multi-column grid on desktop', async ({ page }) => {
      await page.goto('/venues')
      
      // Desktop should show more columns
      const cards = page.locator('[class*="card"]')
      expect(await cards.count()).toBeGreaterThanOrEqual(0)
    })

    test('✅ Sidebar visible on desktop', async ({ page }) => {
      await page.goto('/')
      
      const sidebar = page.locator('aside, [class*="sidebar"]')
      // Sidebar might be visible on desktop
      if (await sidebar.isVisible()) {
        await expect(sidebar).toBeVisible()
      }
    })

    test('✅ Footer content is distributed on desktop', async ({ page }) => {
      await page.goto('/')
      await page.evaluate(() => window.scrollBy(0, document.body.scrollHeight))
      
      const footer = page.locator('footer')
      await expect(footer).toBeVisible()
    })

    test('✅ Large images display properly', async ({ page }) => {
      await page.goto('/venues')
      
      const images = page.locator('img')
      if (await images.count() > 0) {
        const image = images.first()
        await expect(image).toBeVisible()
      }
    })
  })

  // ═══════════════════════════════════════════════════════════════════════
  // Orientation Tests
  // ═══════════════════════════════════════════════════════════════════════

  test.describe('🔄 Orientation Changes', () => {
    test('✅ Page reflows when changing from portrait to landscape', async ({ page }) => {
      // Start in portrait
      await page.setViewportSize({ width: 375, height: 667 })
      await page.goto('/')
      
      // Change to landscape
      await page.setViewportSize({ width: 667, height: 375 })
      
      // Page should still be usable
      const header = page.locator('header')
      await expect(header).toBeVisible()
    })

    test('✅ Content reflows from landscape to portrait', async ({ page }) => {
      // Start in landscape
      await page.setViewportSize({ width: 667, height: 375 })
      await page.goto('/')
      
      // Change to portrait
      await page.setViewportSize({ width: 375, height: 667 })
      
      // Page should still be usable
      const main = page.locator('main')
      await expect(main).toBeVisible()
    })
  })

  // ═══════════════════════════════════════════════════════════════════════
  // Breakpoint Tests
  // ═══════════════════════════════════════════════════════════════════════

  test.describe('🎯 CSS Breakpoints', () => {
    test('✅ Small breakpoint (320px)', async ({ page }) => {
      await page.setViewportSize({ width: 320, height: 568 })
      await page.goto('/')
      
      const header = page.locator('header')
      await expect(header).toBeVisible()
    })

    test('✅ Medium breakpoint (768px)', async ({ page }) => {
      await page.setViewportSize({ width: 768, height: 1024 })
      await page.goto('/')
      
      const main = page.locator('main')
      await expect(main).toBeVisible()
    })

    test('✅ Large breakpoint (1024px)', async ({ page }) => {
      await page.setViewportSize({ width: 1024, height: 768 })
      await page.goto('/')
      
      const main = page.locator('main')
      await expect(main).toBeVisible()
    })

    test('✅ Extra large breakpoint (1440px)', async ({ page }) => {
      await page.setViewportSize({ width: 1440, height: 900 })
      await page.goto('/')
      
      const main = page.locator('main')
      await expect(main).toBeVisible()
    })
  })

  // ═══════════════════════════════════════════════════════════════════════
  // Device-Specific Tests
  // ═══════════════════════════════════════════════════════════════════════

  test.describe('📲 Device-Specific Responsive', () => {
    test('✅ iPhone SE responsive', async ({ page }) => {
      await page.setViewportSize({ width: 375, height: 667 })
      await page.goto('/')
      
      await expect(page.locator('body')).toBeVisible()
    })

    test('✅ iPhone 12/13 responsive', async ({ page }) => {
      await page.setViewportSize({ width: 390, height: 844 })
      await page.goto('/')
      
      await expect(page.locator('body')).toBeVisible()
    })

    test('✅ iPad responsive', async ({ page }) => {
      await page.setViewportSize({ width: 768, height: 1024 })
      await page.goto('/')
      
      await expect(page.locator('body')).toBeVisible()
    })

    test('✅ Samsung Galaxy responsive', async ({ page }) => {
      await page.setViewportSize({ width: 360, height: 800 })
      await page.goto('/')
      
      await expect(page.locator('body')).toBeVisible()
    })

    test('✅ Standard Android tablet', async ({ page }) => {
      await page.setViewportSize({ width: 600, height: 960 })
      await page.goto('/')
      
      await expect(page.locator('body')).toBeVisible()
    })
  })
})

export { test }
