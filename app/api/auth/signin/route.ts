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
        { error: 'Email and password are required' },
        { status: 400 }
      )
    }
    
    // Validate email format
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
    if (!emailRegex.test(email)) {
      return NextResponse.json(
        { error: 'Invalid email format' },
        { status: 400 }
      )
    }
    
    const result = await signIn(email, password)
    
    if (!result.success || !result.user) {
      console.log(`[API] Sign in failed for ${email}: ${result.error}`)
      return NextResponse.json(
        { error: result.error || 'Authentication failed' },
        { status: 401 }
      )
    }
    
    const token = generateToken(result.user)
    await setSession(token)
    
    console.log(`[API] Sign in successful for ${email}`)
    return NextResponse.json({ 
      success: true,
      token,
      user: result.user 
    })
  } catch (error) {
    console.error('[API] Sign in error:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}
