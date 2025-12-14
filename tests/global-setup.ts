import { chromium, FullConfig } from '@playwright/test'
import { seedTestUsers, verifyTestUser, TEST_USERS } from './helpers/db-seed'

async function globalSetup(config: FullConfig) {
  console.log('\n╔════════════════════════════════════════════════════════╗')
  console.log('║         🌍 GLOBAL TEST SETUP STARTING                  ║')
  console.log('╚════════════════════════════════════════════════════════╝\n')

  const baseUrl = process.env.E2E_BASE_URL || 'https://wedding-86gvvuikv-asithalkonaras-projects.vercel.app'
  
  try {
    // Step 1: Verify server is reachable
    console.log('📡 Checking server connectivity...')
    const maxRetries = 10
    let isServerReady = false
    
    for (let i = 0; i < maxRetries; i++) {
      try {
        const controller = new AbortController();
        const timeoutId = setTimeout(() => controller.abort(), 5000);
        const response = await fetch(`${baseUrl}/`, { signal: controller.signal });
        clearTimeout(timeoutId);
        if (response.ok || response.status === 200) {
          isServerReady = true
          console.log('✓ Server is reachable')
          break
        }
      } catch (error) {
        if (i < maxRetries - 1) {
          console.log(`⏳ Server not ready, retrying... (${i + 1}/${maxRetries})`)
          await new Promise(resolve => setTimeout(resolve, 1000))
        }
      }
    }
    
    if (!isServerReady) {
      console.error('✗ Server is not reachable after maximum retries')
      throw new Error('Test server is not responding')
    }

    // Step 2: Seed test users
    console.log('\n🌱 Seeding test users...')
    const seedResult = await seedTestUsers(baseUrl)
    console.log('✓ Test users seeded')

    // Step 3: Verify all test users
    console.log('\n✓ Verifying test users...')
    const verifications = {
      user: await verifyTestUser(TEST_USERS.user.email, TEST_USERS.user.password, baseUrl),
      vendor: await verifyTestUser(TEST_USERS.vendor.email, TEST_USERS.vendor.password, baseUrl),
      admin: await verifyTestUser(TEST_USERS.admin.email, TEST_USERS.admin.password, baseUrl)
    }

    const allVerified = verifications.user && verifications.vendor && verifications.admin
    
    if (allVerified) {
      console.log('✓ All test users verified successfully')
    } else {
      console.warn('⚠ Some test users failed verification:', {
        user: verifications.user ? 'OK' : 'FAILED',
        vendor: verifications.vendor ? 'OK' : 'FAILED',
        admin: verifications.admin ? 'OK' : 'FAILED'
      })
    }

    // Step 4: Verify API endpoints
    console.log('\n🔌 Verifying critical API endpoints...')
    const criticalEndpoints = [
      '/api/auth/me',
      '/api/dashboard',
      '/api/health/db'
    ]

    for (const endpoint of criticalEndpoints) {
      try {
        const controller = new AbortController();
        const timeoutId = setTimeout(() => controller.abort(), 5000);
        const response = await fetch(`${baseUrl}${endpoint}`, {
          headers: { 'Content-Type': 'application/json' },
          signal: controller.signal
        });
        clearTimeout(timeoutId);
        const status = response.ok ? '✓' : '⚠'
        console.log(`${status} ${endpoint} - ${response.status}`)
      } catch (error) {
        console.log(`⚠ ${endpoint} - Not accessible`)
      }
    }

    console.log('\n╔════════════════════════════════════════════════════════╗')
    console.log('║      ✓ GLOBAL SETUP COMPLETE - READY FOR TESTS        ║')
    console.log('╚════════════════════════════════════════════════════════╝\n')
  } catch (error) {
    console.error('\n╔════════════════════════════════════════════════════════╗')
    console.error('║          ✗ GLOBAL SETUP FAILED                        ║')
    console.error('╚════════════════════════════════════════════════════════╝')
    console.error('\nSetup Error:', error)
    throw error
  }
}

export default globalSetup
