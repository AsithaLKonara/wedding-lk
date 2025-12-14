import { connectDB } from '@/lib/db'
import { signUp } from '@/lib/auth/custom-auth'

async function seedTestUsers() {
  try {
    await connectDB()
    
    const testUsers = [
      { name: 'Test User', email: 'user@test.local', password: 'Test123!', role: 'user' },
      { name: 'Test Vendor', email: 'vendor@test.local', password: 'Test123!', role: 'vendor' },
      { name: 'Test Admin', email: 'admin@test.local', password: 'Test123!', role: 'admin' },
      { name: 'Test Planner', email: 'planner@test.local', password: 'Test123!', role: 'wedding_planner' }
    ]
    
    for (const user of testUsers) {
      try {
        await signUp(user.name, user.email, user.password, user.role)
        console.log(`✅ Created: ${user.email} (${user.role})`)
      } catch (error) {
        console.log(`⚠️  User ${user.email} might already exist: ${error}`)
      }
    }
    
    console.log('🎉 Test users seeding completed!')
  } catch (error) {
    console.error('❌ Error seeding test users:', error)
  }
}

seedTestUsers()
