import * as jose from 'jose'

const JWT_SECRET = new TextEncoder().encode(
  process.env.JWT_SECRET || process.env.NEXTAUTH_SECRET || 'your-secret-key'
)

export interface AuthUser {
  id: string
  email: string
  name: string
  role: 'user' | 'vendor' | 'wedding_planner' | 'admin' | 'maintainer'
  image?: string
  avatar?: string
  isActive?: boolean
  isVerified?: boolean
}

export async function generateToken(user: AuthUser): Promise<string> {
  const token = await new jose.SignJWT({
    id: user.id,
    email: user.email,
    name: user.name,
    role: user.role,
    isActive: user.isActive,
    isVerified: user.isVerified
  })
    .setProtectedHeader({ alg: 'HS256' })
    .setIssuedAt()
    .setExpirationTime('7d')
    .sign(JWT_SECRET)
  
  return token
}

export async function verifyToken(token: string): Promise<AuthUser | null> {
  try {
    const { payload } = await jose.jwtVerify(token, JWT_SECRET)
    return {
      id: payload.id as string,
      email: payload.email as string,
      name: payload.name as string,
      role: payload.role as any,
      isActive: payload.isActive as boolean,
      isVerified: payload.isVerified as boolean
    }
  } catch (error) {
    return null
  }
}

// Sync version for non-async contexts if needed (but jose is async)
// For client side, we usually don't verify tokens locally anyway, 
// we just check if they exist and trust the API.
