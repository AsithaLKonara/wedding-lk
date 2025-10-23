import { NextRequest, NextResponse } from 'next/server'
import { connectDB } from '@/lib/db'
import { User } from '@/lib/models/user'
import bcrypt from 'bcryptjs'

export async function POST(req: NextRequest) {
  try {
    await connectDB()
    
    const testUsers = [
      { email: 'user@test.local', name: 'Test User', password: 'Test123!', role: 'user' },
      { email: 'vendor@test.local', name: 'Test Vendor', password: 'Test123!', role: 'vendor' },
      { email: 'admin@test.local', name: 'Test Admin', password: 'Test123!', role: 'admin' }
    ]

    const results = []
    for (const userData of testUsers) {
      const hashedPassword = await bcrypt.hash(userData.password, 10)
      
      const user = await User.findOneAndUpdate(
        { email: userData.email },
        {
          name: userData.name,
          email: userData.email,
          password: hashedPassword,
          role: userData.role,
          isActive: true,
          isVerified: true
        },
        { upsert: true, new: true }
      )
      
      results.push({ email: user.email, role: user.role })
    }

    return NextResponse.json({ success: true, users: results })
  } catch (error) {
    console.error('Reset users error:', error)
    return NextResponse.json({ error: 'Failed to reset users' }, { status: 500 })
  }
}

