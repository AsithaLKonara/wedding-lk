import bcrypt from 'bcryptjs'
import jwt from 'jsonwebtoken'
import { User } from '@/lib/models/user'
import { connectDB } from '@/lib/db'

const JWT_SECRET = process.env.NEXTAUTH_SECRET || 'your-secret-key'

export interface AuthUser {
  id: string
  email: string
  name: string
  role: 'user' | 'vendor' | 'wedding_planner' | 'admin' | 'maintainer'
}

export async function signIn(email: string, password: string): Promise<{ success: boolean; user?: AuthUser; error?: string }> {
  try {
    await connectDB()
    
    const user = await User.findOne({ email }).select('+password')
    if (!user) {
      return { success: false, error: 'Invalid credentials' }
    }

    const isValid = await bcrypt.compare(password, user.password)
    if (!isValid) {
      return { success: false, error: 'Invalid credentials' }
    }

    const authUser: AuthUser = {
      id: user._id.toString(),
      email: user.email,
      name: user.name,
      role: user.role
    }

    return { success: true, user: authUser }
  } catch (error) {
    return { success: false, error: 'Authentication failed' }
  }
}

export async function signUp(name: string, email: string, password: string, role: string = 'user'): Promise<{ success: boolean; user?: AuthUser; error?: string }> {
  try {
    await connectDB()
    
    const exists = await User.findOne({ email })
    if (exists) {
      return { success: false, error: 'Email already registered' }
    }

    const hashedPassword = await bcrypt.hash(password, 10)
    
    const user = await User.create({
      name,
      email,
      password: hashedPassword,
      role,
      isActive: true,
      isVerified: true
    })

    const authUser: AuthUser = {
      id: user._id.toString(),
      email: user.email,
      name: user.name,
      role: user.role
    }

    return { success: true, user: authUser }
  } catch (error) {
    return { success: false, error: 'Registration failed' }
  }
}

export function generateToken(user: AuthUser): string {
  return jwt.sign(user, JWT_SECRET, { expiresIn: '7d' })
}

export function verifyToken(token: string): AuthUser | null {
  try {
    return jwt.verify(token, JWT_SECRET) as AuthUser
  } catch {
    return null
  }
}
