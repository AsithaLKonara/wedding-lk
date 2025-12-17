import { Environment } from './browser-helpers';

function getBaseUrl(environment: Environment = 'local'): string {
  return environment === 'production' 
    ? 'https://wedding-lk.vercel.app'
    : 'http://localhost:3000';
}

export async function loginTestUser(
  email: string, 
  password: string, 
  environment: Environment = 'local'
) {
  const baseUrl = getBaseUrl(environment);
  const response = await fetch(`${baseUrl}/api/auth/signin`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ email, password })
  })
  
  return response.json()
}

export async function createTestUser(
  name: string, 
  email: string, 
  password: string, 
  role: string = 'user',
  environment: Environment = 'local'
) {
  const baseUrl = getBaseUrl(environment);
  const response = await fetch(`${baseUrl}/api/auth/signup`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ name, email, password, role })
  })
  
  return response.json()
}

export async function seedTestData(
  page: any, 
  environment: Environment = 'local'
) {
  // Simple test data seeding - just ensure we have test users
  try {
    await createTestUser('Test User', 'user@test.local', 'Test123!', 'user', environment)
    await createTestUser('Test Vendor', 'vendor@test.local', 'Test123!', 'vendor', environment)
    await createTestUser('Test Admin', 'admin@test.local', 'Test123!', 'admin', environment)
    await createTestUser('Test Planner', 'planner@test.local', 'Test123!', 'wedding_planner', environment)
    await createTestUser('Test Maintainer', 'maintainer@test.local', 'Test123!', 'maintainer', environment)
  } catch (error) {
    // Users might already exist, that's okay
    console.log('Test users might already exist')
  }
}