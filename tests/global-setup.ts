import { chromium, FullConfig } from '@playwright/test'
import testUsers from './fixtures/test-users.json'
import testUsersExtended from './fixtures/test-users-extended.json'
import * as fs from 'fs'
import * as path from 'path'

async function globalSetup(config: FullConfig) {
  console.log('\n╔════════════════════════════════════════════════════════╗')
  console.log('║         🌍 GLOBAL TEST SETUP STARTING                  ║')
  console.log('║    Comprehensive Browser Testing Suite                 ║')
  console.log('╚════════════════════════════════════════════════════════╝\n')

  // Determine environment
  const environment = process.env.E2E_ENVIRONMENT || 'local'
  const baseUrl = process.env.E2E_BASE_URL || (environment === 'production' 
    ? 'https://wedding-lk.vercel.app' 
    : 'http://localhost:3000')
  
  try {
    // Step 1: Create test results directories
    console.log('📁 Creating test results directories...')
    const testResultsDirs = [
      'test-results',
      'test-results/console-reports',
      'playwright-report',
    ]
    
    for (const dir of testResultsDirs) {
      if (!fs.existsSync(dir)) {
        fs.mkdirSync(dir, { recursive: true })
      }
    }
    console.log('✓ Test results directories created')

    // Step 2: Verify server is reachable
    console.log(`📡 Checking server connectivity (${baseUrl})...`)
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
      console.warn('⚠ Server is not reachable - tests may fail')
      console.warn('  Make sure the server is running or set E2E_BASE_URL')
    }

    // Step 3: Seed test users
    console.log('\n🌱 Seeding test users...')
    // Seed test database if TEST_DB_URI is set
    if (process.env.TEST_DB_URI) {
      try {
      const { seedTestDatabase } = require('./helpers/db-seed');
      await seedTestDatabase();
        console.log('✓ Test database seeded')
      } catch (error) {
        console.warn('⚠ Database seeding failed (may already be seeded):', error)
      }
    } else {
      console.log('⚠ TEST_DB_URI not set - skipping database seeding')
    }

    // Step 4: Verify test users exist in configuration
    console.log('\n✓ Test users ready for testing')
    console.log(`  - ${testUsers.users.length} basic test users configured`)
    console.log(`  - ${testUsersExtended.users.length} extended test users configured`)
    console.log(`  - ${testUsers.vendors.length} test vendors configured`)
    console.log(`  - ${testUsers.venues.length} test venues configured`)

    // Log role distribution
    const roleCounts = testUsersExtended.users.reduce((acc, user) => {
      acc[user.role] = (acc[user.role] || 0) + 1
      return acc
    }, {} as Record<string, number>)
    console.log('  Role distribution:', roleCounts)

    // Step 5: Verify API endpoints
    console.log('\n🔌 Verifying critical API endpoints...')
    const criticalEndpoints = [
      '/api/auth/signin',
      '/api/auth/signup',
      '/api/health',
      '/api/status',
    ]

    let endpointSuccessCount = 0
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
        if (response.ok) endpointSuccessCount++
      } catch (error) {
        console.log(`⚠ ${endpoint} - Not accessible`)
      }
    }

    // Step 6: Console monitoring setup info
    console.log('\n📊 Console monitoring enabled')
    console.log('  - All console.log, error, warn, info will be captured')
    console.log('  - Reports will be saved to test-results/console-reports/')

    console.log('\n╔════════════════════════════════════════════════════════╗')
    console.log('║      ✓ GLOBAL SETUP COMPLETE - READY FOR TESTS        ║')
    console.log(`║      Environment: ${environment.padEnd(40)}║`)
    console.log(`║      Base URL: ${baseUrl.substring(0, 40).padEnd(40)}║`)
    console.log(`║      API Endpoints: ${endpointSuccessCount}/${criticalEndpoints.length} accessible${' '.repeat(20 - String(endpointSuccessCount).length)}║`)
    console.log('╚════════════════════════════════════════════════════════╝\n')
  } catch (error) {
    console.error('\n╔════════════════════════════════════════════════════════╗')
    console.error('║          ✗ GLOBAL SETUP FAILED                        ║')
    console.error('╚════════════════════════════════════════════════════════╝')
    console.error('\nSetup Error:', error)
    // Don't throw - allow tests to run even if setup has warnings
    console.warn('⚠ Continuing with tests despite setup warnings...\n')
  }
}

export default globalSetup
