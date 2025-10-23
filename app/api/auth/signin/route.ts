import { NextRequest, NextResponse } from 'next/server'
import { signIn, generateToken } from '@/lib/auth/custom-auth'
import { setSession } from '@/lib/auth/session'

export async function POST(request: NextRequest) {
  try {
    const { email, password } = await request.json()
    
    const result = await signIn(email, password)
    
    if (!result.success || !result.user) {
      return NextResponse.json(
        { error: result.error || 'Authentication failed' },
        { status: 401 }
      )
    }
    
    const token = generateToken(result.user)
    await setSession(token)
    
    return NextResponse.json({ user: result.user })
  } catch (error) {
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}
