import bcrypt from 'bcryptjs'
import { User } from '@/lib/models/user'
import { connectDB } from '@/lib/db'
import { AuthUser } from './tokens'

const JWT_SECRET = process.env.JWT_SECRET || process.env.NEXTAUTH_SECRET || 'your-secret-key'

// Re-export AuthUser for compatibility
export type { AuthUser }

export async function signIn(email: string, password: string): Promise<{ success: boolean; user?: AuthUser; error?: string }> {
  try {
    await connectDB()
    
    // Validate input
    if (!email || !password) {
      return { success: false, error: 'Email and password are required' }
    }
    
    const user = await User.findOne({ email }).select('+password')
    if (!user) {
      console.warn(`[Auth] Login attempt with non-existent email: ${email}`)
      return { success: false, error: 'Invalid credentials' }
    }

    // Check if user is active
    if (!user.isActive) {
      console.warn(`[Auth] Login attempt for inactive user: ${email}`)
      return { success: false, error: 'Account is inactive' }
    }

    // Verify password
    const isValid = await bcrypt.compare(password, user.password)
    if (!isValid) {
      console.warn(`[Auth] Invalid password for user: ${email}`)
      return { success: false, error: 'Invalid credentials' }
    }

    const authUser: AuthUser = {
      id: user._id.toString(),
      email: user.email,
      name: user.name,
      role: user.role,
      isActive: user.isActive,
      isVerified: user.isVerified
    }

    console.log(`[Auth] Successful login for user: ${email} (role: ${user.role})`)
    return { success: true, user: authUser }
  } catch (error) {
    console.error('[Auth] Sign in error:', error)
    return { success: false, error: 'Authentication failed' }
  }
}

export async function signUp(name: string, email: string, password: string, role: string = 'user'): Promise<{ success: boolean; user?: AuthUser; error?: string }> {
  try {
    await connectDB()
    
    // Validate input
    if (!name || !email || !password) {
      return { success: false, error: 'Name, email, and password are required' }
    }
    
    // Validate email format
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
    if (!emailRegex.test(email)) {
      return { success: false, error: 'Invalid email format' }
    }
    
    // Validate password strength
    if (password.length < 6) {
      return { success: false, error: 'Password must be at least 6 characters' }
    }
    
    const exists = await User.findOne({ email })
    if (exists) {
      console.warn(`[Auth] Registration attempt with existing email: ${email}`)
      return { success: false, error: 'Email already registered' }
    }

    const hashedPassword = await bcrypt.hash(password, 10)
    
    const user = await User.create({
      name,
      email,
      password: hashedPassword,
      role: role as any,
      isActive: true,
      isVerified: true
    })

    const authUser: AuthUser = {
      id: user._id.toString(),
      email: user.email,
      name: user.name,
      role: user.role,
      isActive: user.isActive,
      isVerified: user.isVerified
    }

    console.log(`[Auth] New user registered: ${email} (role: ${role})`)
    return { success: true, user: authUser }
  } catch (error) {
    console.error('[Auth] Sign up error:', error)
    return { success: false, error: 'Registration failed' }
  }
}

// Token functions moved to lib/auth/tokens.ts
export { generateToken, verifyToken } from './tokens'
