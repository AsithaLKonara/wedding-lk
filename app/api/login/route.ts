import { NextRequest, NextResponse } from 'next/server'
import { signIn, generateToken } from '@/lib/auth/custom-auth'
import { setSession } from '@/lib/auth/session'

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { email, password } = body
    
    // Validate input
    if (!email || !password) {
      return NextResponse.json(
        { success: false, error: 'Email and password are required' },
        { status: 400 }
      )
    }
    
    // Validate email format
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
    if (!emailRegex.test(email)) {
      return NextResponse.json(
        { success: false, error: 'Invalid email format' },
        { status: 400 }
      )
    }
    
    const result = await signIn(email, password)
    
    if (!result.success || !result.user) {
      console.log(`[API] Login failed for ${email}: ${result.error}`)
      return NextResponse.json(
        { success: false, error: result.error || 'Authentication failed' },
        { status: 401 }
      )
    }
    
    const token = generateToken(result.user)
    await setSession(token)
    
    console.log(`[API] Login successful for ${email}`)
    return NextResponse.json({ 
      success: true,
      token,
      user: {
        id: result.user.id,
        name: result.user.name,
        email: result.user.email,
        role: result.user.role,
        isActive: result.user.isActive,
        isVerified: result.user.isVerified
      }
    })
  } catch (error) {
    console.error('[API] Login error:', error)
    return NextResponse.json(
      { success: false, error: 'Internal server error' },
      { status: 500 }
    )
  }
}

