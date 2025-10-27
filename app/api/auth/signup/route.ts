import { NextRequest, NextResponse } from 'next/server'
import { signUp, generateToken } from '@/lib/auth/custom-auth'
import { setSession } from '@/lib/auth/session'

export async function POST(request: NextRequest) {
  try {
    const { name, email, password, role } = await request.json()
    
    const result = await signUp(name, email, password, role)
    
    if (!result.success || !result.user) {
      return NextResponse.json(
        { success: false, error: result.error || 'Registration failed' },
        { status: 400 }
      )
    }
    
    const token = generateToken(result.user)
    await setSession(token)
    
    return NextResponse.json({ 
      success: true,
      token,
      user: result.user 
    })
  } catch (error) {
    return NextResponse.json(
      { success: false, error: 'Internal server error' },
      { status: 500 }
    )
  }
}
