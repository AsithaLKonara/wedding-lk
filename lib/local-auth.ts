import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import { LocalDatabase } from './local-database';

export interface User {
  id: string;
  name: string;
  email: string;
  password: string;
  role: 'admin' | 'user' | 'vendor' | 'wedding_planner';
  isVerified: boolean;
  isActive: boolean;
  phone?: string;
  address?: string;
  preferences?: {
    notifications: boolean;
    emailUpdates: boolean;
    smsUpdates: boolean;
  };
  createdAt: string;
  updatedAt: string;
}

export interface AuthResult {
  success: boolean;
  user?: Omit<User, 'password'>;
  token?: string;
  error?: string;
}

export class LocalAuth {
  private static JWT_SECRET = process.env.JWT_SECRET || 'super-secret-jwt-key';
  private static JWT_EXPIRES_IN = '30d';

  // Register a new user
  static async register(userData: {
    name: string;
    email: string;
    password: string;
    role: 'admin' | 'user' | 'vendor' | 'wedding_planner';
    phone?: string;
    address?: string;
  }): Promise<AuthResult> {
    try {
      // Check if user already exists
      const existingUsers = LocalDatabase.readByField<User>('users', 'email', userData.email);
      if (existingUsers.length > 0) {
        return {
          success: false,
          error: 'User with this email already exists'
        };
      }

      // Hash password
      const hashedPassword = await bcrypt.hash(userData.password, 12);

      // Create user
      const newUser = LocalDatabase.create<User>('users', {
        ...userData,
        password: hashedPassword,
        isVerified: true,
        isActive: true,
        preferences: {
          notifications: true,
          emailUpdates: true,
          smsUpdates: false
        }
      });

      if (!newUser) {
        return {
          success: false,
          error: 'Failed to create user'
        };
      }

      // Generate JWT token
      const token = jwt.sign(
        { 
          id: newUser.id, 
          email: newUser.email, 
          role: newUser.role 
        },
        this.JWT_SECRET,
        { expiresIn: this.JWT_EXPIRES_IN }
      );

      // Return user without password
      const { password, ...userWithoutPassword } = newUser;

      return {
        success: true,
        user: userWithoutPassword,
        token
      };
    } catch (error) {
      console.error('Registration error:', error);
      return {
        success: false,
        error: 'Registration failed'
      };
    }
  }

  // Login user
  static async login(email: string, password: string): Promise<AuthResult> {
    try {
      // Find user by email
      const users = LocalDatabase.readByField<User>('users', 'email', email);
      if (users.length === 0) {
        return {
          success: false,
          error: 'Invalid credentials'
        };
      }

      const user = users[0];

      // Check if user is active
      if (!user.isActive) {
        return {
          success: false,
          error: 'Account is deactivated'
        };
      }

      // Verify password
      const isPasswordValid = await bcrypt.compare(password, user.password);
      if (!isPasswordValid) {
        return {
          success: false,
          error: 'Invalid credentials'
        };
      }

      // Generate JWT token
      const token = jwt.sign(
        { 
          id: user.id, 
          email: user.email, 
          role: user.role 
        },
        this.JWT_SECRET,
        { expiresIn: this.JWT_EXPIRES_IN }
      );

      // Update last login
      LocalDatabase.update('users', user.id, {
        lastLogin: new Date().toISOString()
      });

      // Return user without password
      const { password: _, ...userWithoutPassword } = user;

      return {
        success: true,
        user: userWithoutPassword,
        token
      };
    } catch (error) {
      console.error('Login error:', error);
      return {
        success: false,
        error: 'Login failed'
      };
    }
  }

  // Verify JWT token
  static async verifyToken(token: string): Promise<AuthResult> {
    try {
      const decoded = jwt.verify(token, this.JWT_SECRET) as any;
      
      // Find user by ID
      const user = LocalDatabase.readById<User>('users', decoded.id);
      if (!user) {
        return {
          success: false,
          error: 'User not found'
        };
      }

      // Check if user is active
      if (!user.isActive) {
        return {
          success: false,
          error: 'Account is deactivated'
        };
      }

      // Return user without password
      const { password, ...userWithoutPassword } = user;

      return {
        success: true,
        user: userWithoutPassword
      };
    } catch (error) {
      console.error('Token verification error:', error);
      return {
        success: false,
        error: 'Invalid token'
      };
    }
  }

  // Get user by ID
  static async getUserById(id: string): Promise<Omit<User, 'password'> | null> {
    try {
      const user = LocalDatabase.readById<User>('users', id);
      if (!user) {
        return null;
      }

      const { password, ...userWithoutPassword } = user;
      return userWithoutPassword;
    } catch (error) {
      console.error('Get user error:', error);
      return null;
    }
  }

  // Update user
  static async updateUser(id: string, updates: Partial<Omit<User, 'id' | 'password' | 'createdAt'>>): Promise<Omit<User, 'password'> | null> {
    try {
      const updatedUser = LocalDatabase.update<User>('users', id, updates);
      if (!updatedUser) {
        return null;
      }

      const { password, ...userWithoutPassword } = updatedUser;
      return userWithoutPassword;
    } catch (error) {
      console.error('Update user error:', error);
      return null;
    }
  }

  // Change password
  static async changePassword(id: string, currentPassword: string, newPassword: string): Promise<AuthResult> {
    try {
      const user = LocalDatabase.readById<User>('users', id);
      if (!user) {
        return {
          success: false,
          error: 'User not found'
        };
      }

      // Verify current password
      const isCurrentPasswordValid = await bcrypt.compare(currentPassword, user.password);
      if (!isCurrentPasswordValid) {
        return {
          success: false,
          error: 'Current password is incorrect'
        };
      }

      // Hash new password
      const hashedNewPassword = await bcrypt.hash(newPassword, 12);

      // Update password
      const updatedUser = LocalDatabase.update<User>('users', id, {
        password: hashedNewPassword
      });

      if (!updatedUser) {
        return {
          success: false,
          error: 'Failed to update password'
        };
      }

      return {
        success: true
      };
    } catch (error) {
      console.error('Change password error:', error);
      return {
        success: false,
        error: 'Failed to change password'
      };
    }
  }

  // Get all users (admin only)
  static async getAllUsers(): Promise<Omit<User, 'password'>[]> {
    try {
      const users = LocalDatabase.read<User>('users');
      return users.map(({ password, ...user }) => user);
    } catch (error) {
      console.error('Get all users error:', error);
      return [];
    }
  }

  // Delete user (admin only)
  static async deleteUser(id: string): Promise<boolean> {
    try {
      return LocalDatabase.delete('users', id);
    } catch (error) {
      console.error('Delete user error:', error);
      return false;
    }
  }
}

export default LocalAuth;
