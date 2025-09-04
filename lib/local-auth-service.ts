import bcrypt from 'bcryptjs';
import LocalDatabase from './local-database';

export interface LocalUser {
  id: string;
  name: string;
  email: string;
  password: string;
  phone: string;
  role: 'user' | 'vendor' | 'wedding_planner' | 'admin';
  isVerified: boolean;
  isActive: boolean;
  status: 'active' | 'inactive' | 'suspended' | 'pending_verification';
  location: {
    country: string;
    state: string;
    city: string;
    zipCode?: string;
  };
  preferences: {
    language: string;
    currency: string;
    timezone: string;
    notifications: {
      email: boolean;
      sms: boolean;
      push: boolean;
    };
    marketing: {
      email: boolean;
      sms: boolean;
      push: boolean;
    };
  };
  createdAt: string;
  updatedAt: string;
}

export class LocalAuthService {
  // Find user by email
  static async findUserByEmail(email: string): Promise<LocalUser | null> {
    const users = LocalDatabase.read<LocalUser>('users');
    return users.find(user => user.email.toLowerCase() === email.toLowerCase()) || null;
  }

  // Find user by ID
  static async findUserById(id: string): Promise<LocalUser | null> {
    return LocalDatabase.readById<LocalUser>('users', id);
  }

  // Create new user
  static async createUser(userData: {
    name: string;
    email: string;
    password: string;
    phone: string;
    role: 'user' | 'vendor' | 'wedding_planner';
    location: {
      country?: string;
      state: string;
      city: string;
      zipCode?: string;
    };
  }): Promise<LocalUser | null> {
    // Check if user already exists
    const existingUser = await this.findUserByEmail(userData.email);
    if (existingUser) {
      throw new Error('User with this email already exists');
    }

    // Hash password
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(userData.password, salt);

    // Create user object
    const newUser = {
      name: userData.name,
      email: userData.email.toLowerCase(),
      password: hashedPassword,
      phone: userData.phone,
      role: userData.role,
      isVerified: userData.role === 'user',
      isActive: true,
      status: userData.role === 'user' ? 'active' : 'pending_verification',
      location: {
        country: userData.location.country || 'Sri Lanka',
        state: userData.location.state,
        city: userData.location.city,
        zipCode: userData.location.zipCode || '',
      },
      preferences: {
        language: 'en',
        currency: 'LKR',
        timezone: 'Asia/Colombo',
        notifications: {
          email: true,
          sms: false,
          push: true,
        },
        marketing: {
          email: false,
          sms: false,
          push: false,
        },
      },
    };

    return LocalDatabase.create<LocalUser>('users', newUser);
  }

  // Verify password
  static async verifyPassword(plainPassword: string, hashedPassword: string): Promise<boolean> {
    return bcrypt.compare(plainPassword, hashedPassword);
  }

  // Authenticate user
  static async authenticateUser(email: string, password: string): Promise<LocalUser | null> {
    const user = await this.findUserByEmail(email);
    if (!user) {
      return null;
    }

    const isPasswordValid = await this.verifyPassword(password, user.password);
    if (!isPasswordValid) {
      return null;
    }

    // Return user without password
    const { password: _, ...userWithoutPassword } = user;
    return userWithoutPassword as LocalUser;
  }

  // Update user
  static async updateUser(id: string, updates: Partial<LocalUser>): Promise<LocalUser | null> {
    return LocalDatabase.update<LocalUser>('users', id, updates);
  }

  // Get all users (for admin)
  static async getAllUsers(): Promise<LocalUser[]> {
    return LocalDatabase.read<LocalUser>('users');
  }

  // Search users
  static async searchUsers(query: string): Promise<LocalUser[]> {
    return LocalDatabase.search<LocalUser>('users', query, ['name', 'email', 'role']);
  }

  // Get users by role
  static async getUsersByRole(role: string): Promise<LocalUser[]> {
    return LocalDatabase.readByField<LocalUser>('users', 'role', role);
  }

  // Delete user
  static async deleteUser(id: string): Promise<boolean> {
    return LocalDatabase.delete<LocalUser>('users', id);
  }

  // Get user statistics
  static async getUserStats(): Promise<{
    total: number;
    byRole: Record<string, number>;
    active: number;
    pending: number;
  }> {
    const users = await this.getAllUsers();
    const stats = {
      total: users.length,
      byRole: {} as Record<string, number>,
      active: 0,
      pending: 0,
    };

    users.forEach(user => {
      // Count by role
      stats.byRole[user.role] = (stats.byRole[user.role] || 0) + 1;
      
      // Count by status
      if (user.status === 'active') {
        stats.active++;
      } else if (user.status === 'pending_verification') {
        stats.pending++;
      }
    });

    return stats;
  }
}

export default LocalAuthService;
