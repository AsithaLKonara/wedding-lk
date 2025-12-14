export async function loginTestUser(email: string, password: string) {
  const response = await fetch('http://localhost:3000/api/auth/signin', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ email, password })
  })
  
  return response.json()
}

export async function createTestUser(name: string, email: string, password: string, role: string = 'user') {
  const response = await fetch('http://localhost:3000/api/auth/signup', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ name, email, password, role })
  })
  
  return response.json()
}

export async function seedTestData(page: any) {
  // Simple test data seeding - just ensure we have test users
  try {
    await createTestUser('Test User', 'user@test.local', 'Test123!', 'user')
    await createTestUser('Test Vendor', 'vendor@test.local', 'Test123!', 'vendor')
    await createTestUser('Test Admin', 'admin@test.local', 'Test123!', 'admin')
  } catch (error) {
    // Users might already exist, that's okay
    console.log('Test users might already exist')
  }
}