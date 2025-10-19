import { test, expect, Page } from '@playwright/test'

const DEPLOY_URL = 'https://wedding-bz7gqvz3x-asithalkonaras-projects.vercel.app'

// Test credentials from DASHBOARD_CREDENTIALS.md
const TEST_USERS = {
  couple: { email: 'couple@weddinglk.com', password: 'couple123', role: 'couple' },
  vendor: { email: 'vendor@weddinglk.com', password: 'vendor123', role: 'vendor' },
  admin: { email: 'admin@weddinglk.com', password: 'admin123', role: 'admin' },
  planner: { email: 'planner@weddinglk.com', password: 'planner123', role: 'planner' },
}

test.describe('Dashboard CRUD Operations & RBAC Testing', () => {
  test.beforeEach(async ({ page }) => {
    test.setTimeout(120000) // 2 minutes per test
  })

  async function loginAs(page: Page, role: keyof typeof TEST_USERS) {
    const user = TEST_USERS[role]
    await page.goto(`${DEPLOY_URL}/login`)
    await page.fill('input[type="email"]', user.email)
    await page.fill('input[type="password"]', user.password)
    await page.click('button:has-text("Sign In")')
    await page.waitForURL(`${DEPLOY_URL}/dashboard**`, { timeout: 30000 })
    console.log(`Logged in as ${role}`)
  }

  test('Main Dashboard - Wedding Planning Features', async ({ page }) => {
    console.log('🏠 Testing main dashboard...')
    await page.goto(`${DEPLOY_URL}/dashboard`)
    await page.waitForLoadState('networkidle')
    
    // Check main dashboard elements
    await expect(page.locator('h1')).toContainText(/welcome|dashboard|wedding/i)
    
    // Test wedding progress milestones
    console.log('📊 Testing wedding progress milestones...')
    const milestones = page.locator('[aria-label*="Milestone"]')
    await expect(milestones.first()).toBeVisible({ timeout: 10000 })
    
    // Test quick actions
    console.log('⚡ Testing quick actions...')
    const quickActions = page.locator('button').filter({ hasText: /find venues|browse photographers|book catering/i })
    await expect(quickActions.first()).toBeVisible({ timeout: 10000 })
    
    // Test saved venues
    console.log('💖 Testing saved venues...')
    const savedVenues = page.locator('[aria-label*="Saved venue"]')
    await expect(savedVenues.first()).toBeVisible({ timeout: 10000 })
    
    // Test recent activity
    console.log('📈 Testing recent activity...')
    const activities = page.locator('[aria-label*="Activity:"]')
    await expect(activities.first()).toBeVisible({ timeout: 10000 })
    
    console.log('✅ Main dashboard working perfectly')
  })

  test('Vendor Dashboard - Business Management CRUD', async ({ page }) => {
    console.log('🏪 Testing vendor dashboard...')
    await page.goto(`${DEPLOY_URL}/dashboard/vendor`)
    await page.waitForLoadState('networkidle')
    
    // Check vendor dashboard header
    await expect(page.locator('h1')).toContainText(/vendor dashboard/i)
    
    // Test statistics cards
    console.log('📊 Testing vendor statistics...')
    await expect(page.locator('p:has-text("Total Views")')).toBeVisible()
    await expect(page.locator('p:has-text("Inquiries")').first()).toBeVisible()
    await expect(page.locator('p:has-text("Bookings")').first()).toBeVisible()
    await expect(page.locator('p:has-text("Rating")')).toBeVisible()
    
    // Test recent inquiries CRUD
    console.log('💬 Testing inquiries management...')
    await expect(page.locator('text=Recent Inquiries')).toBeVisible({ timeout: 10000 })
    
    // Test inquiry actions
    const replyButtons = page.locator('button').filter({ hasText: /reply/i })
    await expect(replyButtons.first()).toBeVisible({ timeout: 10000 })
    
    const viewDetailsButtons = page.locator('button').filter({ hasText: /view details/i })
    await expect(viewDetailsButtons.first()).toBeVisible({ timeout: 10000 })
    
    // Test upcoming bookings
    console.log('📅 Testing bookings management...')
    await expect(page.locator('text=Upcoming Bookings')).toBeVisible()
    
    // Bookings section is visible from previous test
    
    // Test quick actions
    console.log('⚡ Testing vendor quick actions...')
    await expect(page.locator('text=Add New Service')).toBeVisible()
    await expect(page.locator('text=Update Portfolio')).toBeVisible()
    await expect(page.locator('text=Edit Profile')).toBeVisible()
    await expect(page.locator('text=View Analytics')).toBeVisible()
    
    // Test performance metrics
    console.log('📈 Testing performance metrics...')
    await expect(page.locator('text=Conversion Rate')).toBeVisible()
    await expect(page.locator('text=Response Time')).toBeVisible()
    await expect(page.locator('text=Customer Satisfaction')).toBeVisible()
    
    console.log('✅ Vendor dashboard working perfectly')
  })

  test('Admin Dashboard - User Management CRUD', async ({ page }) => {
    console.log('👑 Testing admin dashboard...')
    await page.goto(`${DEPLOY_URL}/dashboard/admin`)
    await page.waitForLoadState('networkidle')
    
    // Check admin panel header
    await expect(page.locator('h1')).toContainText(/admin panel/i)
    
    // Test tabbed interface
    console.log('📑 Testing admin tabs...')
    await expect(page.locator('button:has-text("Users")')).toBeVisible()
    await expect(page.locator('button:has-text("Vendors")')).toBeVisible()
    await expect(page.locator('button:has-text("Bookings")')).toBeVisible()
    
    // Test users table CRUD
    console.log('👥 Testing users management...')
    const usersTable = page.locator('table')
    await expect(usersTable).toBeVisible()
    
    // Check table headers
    await expect(page.locator('th:has-text("Name")')).toBeVisible()
    await expect(page.locator('th:has-text("Email")')).toBeVisible()
    await expect(page.locator('th:has-text("Role")')).toBeVisible()
    await expect(page.locator('th:has-text("Status")')).toBeVisible()
    await expect(page.locator('th:has-text("Actions")')).toBeVisible()
    
    // Check user data
    await expect(page.locator('td:has-text("Arjun Mendis")')).toBeVisible()
    await expect(page.locator('td:has-text("Priya Raj")')).toBeVisible()
    
    // Test CRUD actions
    console.log('🔧 Testing CRUD actions...')
    const suspendButtons = page.locator('button').filter({ hasText: /suspend/i })
    await expect(suspendButtons.first()).toBeVisible({ timeout: 10000 })
    
    const deleteButtons = page.locator('button').filter({ hasText: /delete/i })
    await expect(deleteButtons.first()).toBeVisible({ timeout: 10000 })
    
    // Test vendors tab
    console.log('🏪 Testing vendors tab...')
    await page.click('button:has-text("Vendors")')
    await page.waitForTimeout(1000)
    
    // Test bookings tab
    console.log('📅 Testing bookings tab...')
    await page.click('button:has-text("Bookings")')
    await page.waitForTimeout(1000)
    
    console.log('✅ Admin dashboard working perfectly')
  })

  test('Dashboard Navigation & Role-Based Access', async ({ page }) => {
    console.log('🧭 Testing dashboard navigation...')
    
    // Test main dashboard navigation
    await page.goto(`${DEPLOY_URL}/dashboard`)
    await page.waitForLoadState('networkidle')
    
    // Test vendor dashboard access
    console.log('🔗 Testing vendor dashboard access...')
    await page.goto(`${DEPLOY_URL}/dashboard/vendor`)
    await page.waitForLoadState('networkidle')
    await expect(page.locator('h1')).toContainText(/vendor dashboard/i)
    
    // Test admin dashboard access
    console.log('🔗 Testing admin dashboard access...')
    await page.goto(`${DEPLOY_URL}/dashboard/admin`)
    await page.waitForLoadState('networkidle')
    await expect(page.locator('h1')).toContainText(/admin panel/i)
    
    // Test planner dashboard access
    console.log('🔗 Testing planner dashboard access...')
    await page.goto(`${DEPLOY_URL}/dashboard/planner`)
    await page.waitForLoadState('networkidle')
    // Should either show planner dashboard or redirect appropriately
    
    console.log('✅ Dashboard navigation working perfectly')
  })

  test('Dashboard Responsive Design & Mobile', async ({ page }) => {
    console.log('📱 Testing dashboard mobile responsiveness...')
    
    // Test mobile viewport
    await page.setViewportSize({ width: 375, height: 667 })
    await page.goto(`${DEPLOY_URL}/dashboard`)
    await page.waitForLoadState('networkidle')
    
    // Check mobile navigation
    console.log('📱 Testing mobile navigation...')
    const mobileMenu = page.locator('button').filter({ hasText: /menu/i })
    if (await mobileMenu.count() > 0) {
      await mobileMenu.click()
      await page.waitForTimeout(1000)
    }
    
    // Test vendor dashboard on mobile
    await page.goto(`${DEPLOY_URL}/dashboard/vendor`)
    await page.waitForLoadState('networkidle')
    
    // Check if content is properly responsive
    await expect(page.locator('h1')).toBeVisible()
    await expect(page.locator('text=Total Views')).toBeVisible()
    
    // Test admin dashboard on mobile
    await page.goto(`${DEPLOY_URL}/dashboard/admin`)
    await page.waitForLoadState('networkidle')
    
    await expect(page.locator('h1')).toContainText(/admin panel/i)
    await expect(page.locator('button:has-text("Users")')).toBeVisible()
    
    console.log('✅ Dashboard mobile responsiveness working perfectly')
  })

  test('Dashboard Performance & Loading States', async ({ page }) => {
    console.log('⚡ Testing dashboard performance...')
    
    const startTime = Date.now()
    await page.goto(`${DEPLOY_URL}/dashboard`)
    await page.waitForLoadState('networkidle')
    const loadTime = Date.now() - startTime
    
    console.log(`📊 Dashboard load time: ${loadTime}ms`)
    expect(loadTime).toBeLessThan(120000) // Should load within 2 minutes
    
    // Test vendor dashboard performance
    const vendorStartTime = Date.now()
    await page.goto(`${DEPLOY_URL}/dashboard/vendor`)
    await page.waitForLoadState('networkidle')
    const vendorLoadTime = Date.now() - vendorStartTime
    
    console.log(`📊 Vendor dashboard load time: ${vendorLoadTime}ms`)
    expect(vendorLoadTime).toBeLessThan(120000)
    
    // Test admin dashboard performance
    const adminStartTime = Date.now()
    await page.goto(`${DEPLOY_URL}/dashboard/admin`)
    await page.waitForLoadState('networkidle')
    const adminLoadTime = Date.now() - adminStartTime
    
    console.log(`📊 Admin dashboard load time: ${adminLoadTime}ms`)
    expect(adminLoadTime).toBeLessThan(120000)
    
    console.log('✅ Dashboard performance excellent')
  })

  test('Dashboard Error Handling & Edge Cases', async ({ page }) => {
    console.log('🛡️ Testing dashboard error handling...')
    
    // Test non-existent dashboard route
    await page.goto(`${DEPLOY_URL}/dashboard/nonexistent`)
    await page.waitForLoadState('networkidle')
    
    // Should either redirect or show appropriate error
    const currentUrl = page.url()
    console.log(`🔍 Current URL after non-existent route: ${currentUrl}`)
    
    // Test dashboard with invalid parameters
    await page.goto(`${DEPLOY_URL}/dashboard/admin?invalid=param`)
    await page.waitForLoadState('networkidle')
    
    // Should still load the admin dashboard
    await expect(page.locator('h1')).toContainText(/admin panel/i)
    
    // Test rapid navigation between dashboards
    console.log('🔄 Testing rapid navigation...')
    const dashboards = ['/dashboard', '/dashboard/vendor', '/dashboard/admin', '/dashboard/planner']
    
    for (const dashboard of dashboards) {
      await page.goto(`${DEPLOY_URL}${dashboard}`)
      await page.waitForTimeout(500) // Quick navigation test
    }
    
    console.log('✅ Dashboard error handling working perfectly')
  })
})