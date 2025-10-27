import { NextRequest } from 'next/server'
import { verifyToken } from './auth/custom-auth'
import { connectDB } from './db'
import { User } from './models/user'

export async function getAuthUser(request: NextRequest) {
  try {
    const token = request.cookies.get('auth-token')?.value
    
    if (!token) {
      return null
    }

    const user = verifyToken(token)
    
    if (!user) {
      return null
    }

    // Verify user still exists and is active
    await connectDB()
    const dbUser = await User.findById(user.id)
    
    if (!dbUser || !dbUser.isActive) {
      return null
    }

    return {
      id: dbUser._id.toString(),
      email: dbUser.email,
      name: dbUser.name,
      role: dbUser.role,
      isActive: dbUser.isActive,
      isVerified: dbUser.isVerified
    }
  } catch (error) {
    console.error('[API Auth] Error getting user:', error)
    return null
  }
}

export async function requireAuth(request: NextRequest, roles?: string[]) {
  const user = await getAuthUser(request)
  
  if (!user) {
    return { authorized: false, error: 'Unauthorized' }
  }

  if (roles && !roles.includes(user.role)) {
    return { authorized: false, error: 'Forbidden', user }
  }

  return { authorized: true, user }
}

