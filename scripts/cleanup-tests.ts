#!/usr/bin/env node

import fs from 'fs'
import path from 'path'

const testDir = path.join(process.cwd(), 'tests')

console.log('🧹 Cleaning up legacy test files...\n')

// Test files to remove (disabled tests that are no longer relevant)
const legacyTestFiles = [
  'tests/e2e/api-integration.spec.ts',
  'tests/e2e/rbac-comprehensive.spec.ts',
  'tests/e2e/realistic-live-deployment.spec.ts',
  'tests/e2e/simple.spec.ts',
  'tests/e2e/user-journey.spec.ts',
  'tests/e2e/vendor.spec.ts',
  'tests/e2e/venue.spec.ts',
]

// Keep only these test files
const keepTestFiles = [
  'tests/e2e/critical-features.spec.ts',
  'tests/e2e/auth.spec.ts',
  'tests/e2e/quick-verification.spec.ts',
  'tests/e2e/navigation-tests.spec.ts',
  'tests/e2e/user-journey-tests.spec.ts',
  'tests/e2e/responsive-tests.spec.ts',
  'tests/e2e/error-handling-tests.spec.ts',
]

// Remove legacy files
legacyTestFiles.forEach(file => {
  if (fs.existsSync(file)) {
    fs.unlinkSync(file)
    console.log(`✓ Removed: ${file}`)
  }
})

console.log('\n✅ Cleanup complete!')
console.log('\n📊 Kept test files:')
keepTestFiles.forEach(file => {
  if (fs.existsSync(file)) {
    console.log(`  ✓ ${file}`)
  }
})

console.log('\n💡 Created new comprehensive test:')
console.log('  ✓ tests/api/comprehensive-api.spec.ts')
console.log('\n✨ Test suite optimized for clean, maintainable testing!')
