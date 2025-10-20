import { test, expect } from '@playwright/test'

const BASE_URL = process.env.DEPLOY_URL || 'http://localhost:3001'

test.describe('Quick Fix Verification', () => {
  test('Packages API works', async ({ page }) => {
    const response = await page.request.get(`${BASE_URL}/api/packages`)
    expect(response.status()).toBe(200)
    
    const data = await response.json()
    expect(Array.isArray(data)).toBe(true)
  })
  
  test('Packages page loads', async ({ page }) => {
    await page.goto(`${BASE_URL}/packages`)
    await page.waitForLoadState('networkidle')
    
    // Check if page loads without 404
    expect(page.url()).toContain('/packages')
    
    // Check for main content
    const mainContent = page.locator('main, .container, h1')
    await expect(mainContent.first()).toBeVisible({ timeout: 10000 })
  })
  
  test('AI Search page loads', async ({ page }) => {
    await page.goto(`${BASE_URL}/ai-search`)
    await page.waitForLoadState('networkidle')
    
    // Check if page loads without 404
    expect(page.url()).toContain('/ai-search')
    
    // Check for main content
    const mainContent = page.locator('main, .container, h1')
    await expect(mainContent.first()).toBeVisible({ timeout: 10000 })
  })
  
  test('Homepage loads with static assets', async ({ page }) => {
    await page.goto(BASE_URL)
    await page.waitForLoadState('networkidle')
    
    // Check if page loads
    await expect(page.locator('body')).toBeVisible()
    
    // Check for title
    await expect(page).toHaveTitle(/Wedding Dreams Lanka/)
  })
})
