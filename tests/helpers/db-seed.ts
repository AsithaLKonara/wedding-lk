export const TEST_USERS = {
  user: {
    email: 'user@test.local',
    password: 'Test123!',
    name: 'Test User',
    role: 'user'
  },
  vendor: {
    email: 'vendor@test.local',
    password: 'Test123!',
    name: 'Test Vendor',
    role: 'vendor'
  },
  admin: {
    email: 'admin@test.local',
    password: 'Test123!',
    name: 'Test Admin',
    role: 'admin'
  }
}

export async function seedTestUsers(baseUrl: string = 'http://localhost:3000') {
  console.log('[DB Seed] Starting test user seeding...')
  
  try {
    // Reset existing test users
    const resetResponse = await fetch(`${baseUrl}/api/test/reset-users`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' }
    })
    
    if (!resetResponse.ok) {
      console.warn('[DB Seed] Reset endpoint failed, users might not exist')
    }
    
    const result = await resetResponse.json()
    console.log('[DB Seed] Test users reset:', result)
    
    return result
  } catch (error) {
    console.error('[DB Seed] Error seeding test users:', error)
    throw error
  }
}

export async function verifyTestUser(
  email: string,
  password: string,
  baseUrl: string = 'http://localhost:3000'
) {
  console.log(`[DB Seed] Verifying test user: ${email}`)
  
  try {
    const response = await fetch(`${baseUrl}/api/auth/signin`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email, password })
    })
    
    const data = await response.json()
    
    if (response.ok && data.user) {
      console.log(`[DB Seed] Test user verified: ${email} (role: ${data.user.role})`)
      return data.user
    } else {
      console.error(`[DB Seed] Failed to verify test user ${email}:`, data.error)
      return null
    }
  } catch (error) {
    console.error(`[DB Seed] Error verifying test user ${email}:`, error)
    return null
  }
}

export async function setupTestDatabase(baseUrl: string = 'http://localhost:3000') {
  console.log('[DB Seed] Setting up test database...')
  
  try {
    // Seed test users
    await seedTestUsers(baseUrl)
    
    // Verify all test users
    const users = {
      user: await verifyTestUser(TEST_USERS.user.email, TEST_USERS.user.password, baseUrl),
      vendor: await verifyTestUser(TEST_USERS.vendor.email, TEST_USERS.vendor.password, baseUrl),
      admin: await verifyTestUser(TEST_USERS.admin.email, TEST_USERS.admin.password, baseUrl)
    }
    
    const allVerified = users.user && users.vendor && users.admin
    console.log(`[DB Seed] Test setup complete. All users verified: ${allVerified}`)
    
    return allVerified ? users : null
  } catch (error) {
    console.error('[DB Seed] Error setting up test database:', error)
    throw error
  }
}
