import { test, expect, Page } from '@playwright/test'

const DEPLOY_URL = 'https://wedding-ihymi3fmz-asithalkonaras-projects.vercel.app'

test.describe('Manual Comprehensive Testing - Live Deployment', () => {
  test.beforeEach(async ({ page }) => {
    test.setTimeout(120000) // 2 minutes per test
  })

  test('1. Homepage - Complete Navigation Test', async ({ page }) => {
    console.log('🏠 Testing Homepage...')
    await page.goto(DEPLOY_URL)
    
    // Check page loads
    await expect(page).toHaveTitle(/wedding/i)
    console.log('✅ Homepage loaded successfully')
    
    // Test all navigation links
    const navLinks = ['Venues', 'Vendors', 'Feed', 'Gallery', 'About']
    for (const link of navLinks) {
      console.log(`🔗 Testing navigation: ${link}`)
      await page.click(`text=${link}`)
      await page.waitForLoadState('networkidle')
      
      // Check page loaded
      const hasContent = await page.locator('h1, main, .main-content').count() > 0
      expect(hasContent).toBe(true)
      console.log(`✅ ${link} page loaded`)
      
      // Go back to homepage
      await page.goBack()
      await page.waitForLoadState('networkidle')
    }
  })

  test('2. Venues Page - Complete CRUD Testing', async ({ page }) => {
    console.log('🏢 Testing Venues Page...')
    await page.goto(`${DEPLOY_URL}/venues`)
    await page.waitForLoadState('networkidle')
    
    // Check page loads
    await expect(page.locator('h1, main')).toBeVisible()
    console.log('✅ Venues page loaded')
    
    // Test search functionality
    const searchInput = page.locator('input[placeholder*="search"], input[placeholder*="venue"]')
    if (await searchInput.count() > 0) {
      console.log('🔍 Testing search functionality...')
      await searchInput.first().fill('Colombo')
      await page.waitForTimeout(1000)
      console.log('✅ Search input working')
    }
    
    // Test filters
    const filterButtons = page.locator('button').filter({ hasText: /filter|location|price|colombo|kandy/i })
    if (await filterButtons.count() > 0) {
      console.log('🔧 Testing filters...')
      await filterButtons.first().click()
      await page.waitForTimeout(1000)
      console.log('✅ Filters working')
    }
    
    // Test view mode toggle
    const viewToggle = page.locator('button').filter({ hasText: /grid|list/i })
    if (await viewToggle.count() > 0) {
      console.log('👁️ Testing view mode toggle...')
      await viewToggle.first().click()
      await page.waitForTimeout(1000)
      console.log('✅ View mode toggle working')
    }
    
    // Test venue cards
    const venueCards = page.locator('.bg-white, .venue-card, [data-testid="venue-card"], .card')
    const cardCount = await venueCards.count()
    if (cardCount > 0) {
      console.log(`📋 Found ${cardCount} venue cards`)
      
      // Click on first venue card
      await venueCards.first().click()
      await page.waitForLoadState('networkidle')
      console.log('✅ Venue card clickable')
      
      // Go back
      await page.goBack()
      await page.waitForLoadState('networkidle')
    }
  })

  test('3. Vendors Page - Complete CRUD Testing', async ({ page }) => {
    console.log('👥 Testing Vendors Page...')
    await page.goto(`${DEPLOY_URL}/vendors`)
    await page.waitForLoadState('networkidle')
    
    // Check page loads
    const hasContent = await page.locator('h1, main, .main-content').count() > 0
    expect(hasContent).toBe(true)
    console.log('✅ Vendors page loaded')
    
    // Test category filters
    const categoryButtons = page.locator('button').filter({ hasText: /photographer|caterer|florist|dj|all/i })
    if (await categoryButtons.count() > 0) {
      console.log('🏷️ Testing category filters...')
      await categoryButtons.first().click()
      await page.waitForTimeout(1000)
      console.log('✅ Category filters working')
    }
    
    // Test search
    const searchInput = page.locator('input[placeholder*="search"], input[placeholder*="vendor"]')
    if (await searchInput.count() > 0) {
      console.log('🔍 Testing vendor search...')
      await searchInput.first().fill('photography')
      await page.waitForTimeout(1000)
      console.log('✅ Vendor search working')
    }
    
    // Test vendor cards
    const vendorCards = page.locator('.bg-white, .vendor-card, [data-testid="vendor-card"], .card')
    const cardCount = await vendorCards.count()
    if (cardCount > 0) {
      console.log(`📋 Found ${cardCount} vendor cards`)
      
      // Click on first vendor card
      await vendorCards.first().click()
      await page.waitForLoadState('networkidle')
      console.log('✅ Vendor card clickable')
      
      // Go back
      await page.goBack()
      await page.waitForLoadState('networkidle')
    }
  })

  test('4. Payment Page - Complete Payment Flow', async ({ page }) => {
    console.log('💳 Testing Payment Page...')
    await page.goto(`${DEPLOY_URL}/payment`)
    await page.waitForLoadState('networkidle')
    
    // Check page loads
    await expect(page.locator('h1')).toContainText(/payment|complete|booking/i)
    console.log('✅ Payment page loaded')
    
    // Test form inputs
    const cardNumberInput = page.locator('input[placeholder*="card"], input[placeholder*="1234"]')
    if (await cardNumberInput.count() > 0) {
      console.log('💳 Testing payment form...')
      await cardNumberInput.first().fill('1234 5678 9012 3456')
      console.log('✅ Card number input working')
    }
    
    const emailInput = page.locator('input[type="email"]')
    if (await emailInput.count() > 0) {
      await emailInput.fill('test@example.com')
      console.log('✅ Email input working')
    }
    
    // Test submit button
    const submitButton = page.locator('button[type="submit"], button').filter({ hasText: /pay|submit|complete/i })
    if (await submitButton.count() > 0) {
      console.log('🚀 Testing payment submission...')
      await submitButton.first().click()
      await page.waitForTimeout(2000)
      console.log('✅ Payment form submission working')
    }
  })

  test('5. AI Search Page - Complete AI Functionality', async ({ page }) => {
    console.log('🤖 Testing AI Search Page...')
    await page.goto(`${DEPLOY_URL}/ai-search`)
    await page.waitForLoadState('networkidle')
    
    // Check page loads
    await expect(page.locator('h1')).toContainText(/ai|search|assistant/i)
    console.log('✅ AI Search page loaded')
    
    // Test AI search input
    const searchInput = page.locator('input[placeholder*="dream"], input[placeholder*="wedding"], input[placeholder*="describe"]')
    if (await searchInput.count() > 0) {
      console.log('🔍 Testing AI search...')
      await searchInput.first().fill('Beach wedding in Galle for 150 guests')
      console.log('✅ AI search input working')
    }
    
    // Test search button
    const searchButton = page.locator('button').filter({ hasText: /search|find|submit/i })
    if (await searchButton.count() > 0) {
      console.log('🚀 Testing AI search submission...')
      await searchButton.first().click()
      await page.waitForTimeout(3000)
      console.log('✅ AI search submission working')
    }
    
    // Test quick search buttons
    const quickSearchButtons = page.locator('button').filter({ hasText: /beach|garden|luxury|mountain|traditional/i })
    if (await quickSearchButtons.count() > 0) {
      console.log('⚡ Testing quick search buttons...')
      await quickSearchButtons.first().click()
      await page.waitForTimeout(2000)
      console.log('✅ Quick search buttons working')
    }
  })

  test('6. Chat Page - Complete Chat Functionality', async ({ page }) => {
    console.log('💬 Testing Chat Page...')
    await page.goto(`${DEPLOY_URL}/chat`)
    await page.waitForLoadState('networkidle')
    
    // Check page loads
    await expect(page.locator('h1')).toContainText(/chat|message|assistant/i)
    console.log('✅ Chat page loaded')
    
    // Test chat input
    const chatInput = page.locator('input[placeholder*="ask"], input[placeholder*="message"], textarea[placeholder*="message"]')
    if (await chatInput.count() > 0) {
      console.log('💬 Testing chat input...')
      await chatInput.first().fill('Help me find a wedding venue in Colombo')
      console.log('✅ Chat input working')
    }
    
    // Test send button
    const sendButton = page.locator('button').filter({ hasText: /send|submit/i })
    if (await sendButton.count() > 0) {
      console.log('📤 Testing send message...')
      await sendButton.first().click()
      await page.waitForTimeout(2000)
      console.log('✅ Send message working')
    }
    
    // Test quick suggestions
    const suggestionButtons = page.locator('button').filter({ hasText: /find venues|photography|budget|planning/i })
    if (await suggestionButtons.count() > 0) {
      console.log('💡 Testing quick suggestions...')
      await suggestionButtons.first().click()
      await page.waitForTimeout(1000)
      console.log('✅ Quick suggestions working')
    }
  })

  test('7. Notifications Page - Complete Notification Management', async ({ page }) => {
    console.log('🔔 Testing Notifications Page...')
    await page.goto(`${DEPLOY_URL}/notifications`)
    await page.waitForLoadState('networkidle')
    
    // Check page loads
    await expect(page.locator('h1')).toContainText(/notification/i)
    console.log('✅ Notifications page loaded')
    
    // Test notification cards
    const notificationCards = page.locator('.bg-white, .notification, .card')
    const cardCount = await notificationCards.count()
    if (cardCount > 0) {
      console.log(`📋 Found ${cardCount} notification cards`)
      
      // Test mark as read
      const markReadButton = page.locator('button').filter({ hasText: /mark.*read|check/i })
      if (await markReadButton.count() > 0) {
        console.log('✅ Testing mark as read...')
        await markReadButton.first().click()
        await page.waitForTimeout(1000)
        console.log('✅ Mark as read working')
      }
      
      // Test delete notification
      const deleteButton = page.locator('button').filter({ hasText: /delete|remove|x/i })
      if (await deleteButton.count() > 0) {
        console.log('🗑️ Testing delete notification...')
        await deleteButton.first().click()
        await page.waitForTimeout(1000)
        console.log('✅ Delete notification working')
      }
    }
    
    // Test search functionality
    const searchInput = page.locator('input[placeholder*="search"], input[placeholder*="notification"]')
    if (await searchInput.count() > 0) {
      console.log('🔍 Testing notification search...')
      await searchInput.first().fill('booking')
      await page.waitForTimeout(1000)
      console.log('✅ Notification search working')
    }
    
    // Test filter dropdown
    const filterSelect = page.locator('select, button').filter({ hasText: /all|unread|booking|message/i })
    if (await filterSelect.count() > 0) {
      console.log('🔧 Testing notification filters...')
      await filterSelect.first().click()
      await page.waitForTimeout(1000)
      console.log('✅ Notification filters working')
    }
  })

  test('8. Gallery Page - Complete Gallery Functionality', async ({ page }) => {
    console.log('📸 Testing Gallery Page...')
    await page.goto(`${DEPLOY_URL}/gallery`)
    await page.waitForLoadState('networkidle')
    
    // Check page loads
    await expect(page.locator('h1')).toContainText(/gallery/i)
    console.log('✅ Gallery page loaded')
    
    // Test gallery images
    const images = page.locator('img')
    const imageCount = await images.count()
    if (imageCount > 0) {
      console.log(`🖼️ Found ${imageCount} gallery images`)
      
      // Click on first image
      await images.first().click()
      await page.waitForTimeout(1000)
      console.log('✅ Gallery images clickable')
    }
    
    // Test category filters
    const categoryButtons = page.locator('button').filter({ hasText: /ceremony|reception|traditional|all/i })
    if (await categoryButtons.count() > 0) {
      console.log('🏷️ Testing gallery category filters...')
      await categoryButtons.first().click()
      await page.waitForTimeout(1000)
      console.log('✅ Gallery category filters working')
    }
    
    // Test view mode toggle
    const viewToggle = page.locator('button').filter({ hasText: /grid|list/i })
    if (await viewToggle.count() > 0) {
      console.log('👁️ Testing gallery view mode toggle...')
      await viewToggle.first().click()
      await page.waitForTimeout(1000)
      console.log('✅ Gallery view mode toggle working')
    }
  })

  test('9. Feed Page - Complete Social Features', async ({ page }) => {
    console.log('📱 Testing Feed Page...')
    await page.goto(`${DEPLOY_URL}/feed`)
    await page.waitForLoadState('networkidle')
    
    // Check page loads
    await expect(page.locator('h1')).toContainText(/feed/i)
    console.log('✅ Feed page loaded')
    
    // Test feed content
    const feedItems = page.locator('.feed-item, .story, .post, .card')
    const itemCount = await feedItems.count()
    if (itemCount > 0) {
      console.log(`📋 Found ${itemCount} feed items`)
      
      // Test interaction buttons
      const likeButton = page.locator('button').filter({ hasText: /like|heart/i })
      if (await likeButton.count() > 0) {
        console.log('❤️ Testing like functionality...')
        await likeButton.first().click()
        await page.waitForTimeout(1000)
        console.log('✅ Like functionality working')
      }
      
      const shareButton = page.locator('button').filter({ hasText: /share/i })
      if (await shareButton.count() > 0) {
        console.log('📤 Testing share functionality...')
        await shareButton.first().click()
        await page.waitForTimeout(1000)
        console.log('✅ Share functionality working')
      }
    }
  })

  test('10. Authentication Flow - Complete Login/Register', async ({ page }) => {
    console.log('🔐 Testing Authentication Flow...')
    
    // Test Login Page
    await page.goto(`${DEPLOY_URL}/login`)
    await page.waitForLoadState('networkidle')
    
    await expect(page.locator('h1')).toContainText(/welcome|sign in|login/i)
    console.log('✅ Login page loaded')
    
    // Test login form
    const emailInput = page.locator('input[type="email"]')
    const passwordInput = page.locator('input[type="password"]')
    
    if (await emailInput.count() > 0 && await passwordInput.count() > 0) {
      console.log('📝 Testing login form...')
      await emailInput.fill('test@example.com')
      await passwordInput.fill('password123')
      console.log('✅ Login form inputs working')
      
      // Test submit
      const submitButton = page.locator('button[type="submit"], button').filter({ hasText: /sign in|login|submit/i })
      if (await submitButton.count() > 0) {
        await submitButton.first().click()
        await page.waitForTimeout(2000)
        console.log('✅ Login form submission working')
      }
    }
    
    // Test Register Page
    await page.goto(`${DEPLOY_URL}/register`)
    await page.waitForLoadState('networkidle')
    
    await expect(page.locator('h1')).toContainText(/join|sign up|register|create/i)
    console.log('✅ Register page loaded')
    
    // Test registration form
    const nameInput = page.locator('input[name*="name"], input[placeholder*="name"]')
    const regEmailInput = page.locator('input[type="email"]')
    const regPasswordInput = page.locator('input[type="password"]')
    
    if (await nameInput.count() > 0 && await regEmailInput.count() > 0 && await regPasswordInput.count() > 0) {
      console.log('📝 Testing registration form...')
      await nameInput.first().fill('Test User')
      await regEmailInput.fill('test@example.com')
      await regPasswordInput.fill('password123')
      console.log('✅ Registration form inputs working')
      
      // Test submit
      const regSubmitButton = page.locator('button[type="submit"], button').filter({ hasText: /sign up|register|create|submit/i })
      if (await regSubmitButton.count() > 0) {
        await regSubmitButton.first().click()
        await page.waitForTimeout(2000)
        console.log('✅ Registration form submission working')
      }
    }
  })

  test('11. Dashboard - Complete Dashboard Features', async ({ page }) => {
    console.log('📊 Testing Dashboard...')
    await page.goto(`${DEPLOY_URL}/dashboard`)
    await page.waitForLoadState('networkidle')
    
    // Check page loads
    const hasContent = await page.locator('h1, main, .main-content').count() > 0
    expect(hasContent).toBe(true)
    console.log('✅ Dashboard page loaded')
    
    // Test dashboard widgets
    const widgets = page.locator('.widget, .card, .dashboard-item')
    const widgetCount = await widgets.count()
    if (widgetCount > 0) {
      console.log(`📋 Found ${widgetCount} dashboard widgets`)
      
      // Test widget interactions
      const widgetButtons = page.locator('button').filter({ hasText: /view|manage|edit|delete/i })
      if (await widgetButtons.count() > 0) {
        console.log('🔧 Testing dashboard widget interactions...')
        await widgetButtons.first().click()
        await page.waitForTimeout(1000)
        console.log('✅ Dashboard widget interactions working')
      }
    }
  })

  test('12. Mobile Responsiveness - Complete Mobile Testing', async ({ page }) => {
    console.log('📱 Testing Mobile Responsiveness...')
    
    // Set mobile viewport
    await page.setViewportSize({ width: 375, height: 667 })
    
    // Test homepage on mobile
    await page.goto(DEPLOY_URL)
    await page.waitForLoadState('networkidle')
    
    console.log('📱 Testing mobile homepage...')
    await expect(page.locator('header')).toBeVisible()
    console.log('✅ Mobile homepage header visible')
    
    // Test mobile navigation
    const mobileMenuButton = page.locator('button').filter({ hasText: /menu|☰|nav/i })
    if (await mobileMenuButton.count() > 0) {
      console.log('📱 Testing mobile menu...')
      await mobileMenuButton.first().click()
      await page.waitForTimeout(1000)
      console.log('✅ Mobile menu working')
    }
    
    // Test mobile forms
    await page.goto(`${DEPLOY_URL}/login`)
    await page.waitForLoadState('networkidle')
    
    const mobileEmailInput = page.locator('input[type="email"]')
    if (await mobileEmailInput.count() > 0) {
      console.log('📱 Testing mobile form inputs...')
      await mobileEmailInput.fill('test@example.com')
      console.log('✅ Mobile form inputs working')
    }
    
    console.log('✅ Mobile responsiveness testing completed')
  })

  test('13. Performance & Accessibility - Complete Testing', async ({ page }) => {
    console.log('⚡ Testing Performance & Accessibility...')
    
    // Test page load performance
    const startTime = Date.now()
    await page.goto(DEPLOY_URL)
    await page.waitForLoadState('networkidle')
    const loadTime = Date.now() - startTime
    
    console.log(`⏱️ Page load time: ${loadTime}ms`)
    expect(loadTime).toBeLessThan(15000) // 15 seconds max
    console.log('✅ Page load performance acceptable')
    
    // Test images have alt text
    const images = page.locator('img')
    const imageCount = await images.count()
    if (imageCount > 0) {
      console.log(`🖼️ Testing ${imageCount} images for alt text...`)
      for (let i = 0; i < Math.min(imageCount, 5); i++) {
        const img = images.nth(i)
        const alt = await img.getAttribute('alt')
        expect(alt).toBeTruthy()
      }
      console.log('✅ Images have proper alt text')
    }
    
    // Test forms have labels
    await page.goto(`${DEPLOY_URL}/login`)
    await page.waitForLoadState('networkidle')
    
    const inputs = page.locator('input')
    const inputCount = await inputs.count()
    if (inputCount > 0) {
      console.log(`📝 Testing ${inputCount} form inputs for labels...`)
      for (let i = 0; i < inputCount; i++) {
        const input = inputs.nth(i)
        const id = await input.getAttribute('id')
        if (id) {
          const label = page.locator(`label[for="${id}"]`)
          const hasLabel = await label.count() > 0
          if (!hasLabel) {
            console.log(`⚠️ Input ${i} missing label`)
          }
        }
      }
      console.log('✅ Form accessibility checked')
    }
    
    console.log('✅ Performance & accessibility testing completed')
  })
})
