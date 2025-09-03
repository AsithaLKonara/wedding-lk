import { connectDB } from '@/lib/db';
import { User } from '@/lib/models/user';
import bcrypt from 'bcryptjs';

interface SocialProfile {
  id: string;
  email: string;
  name: string;
  picture?: string;
  given_name?: string;
  family_name?: string;
  locale?: string;
  verified_email?: boolean;
}

interface SocialAccount {
  provider: string;
  providerAccountId: string;
  access_token?: string;
  refresh_token?: string;
  expires_at?: number;
  scope?: string;
  id_token?: string;
}

/**
 * Handle social login authentication
 */
export async function handleSocialLogin(
  user: any,
  account: SocialAccount,
  profile: SocialProfile
): Promise<boolean> {
  try {
    await connectDB();
    
    const { email, name, picture, given_name, family_name, verified_email } = profile;
    
    if (!email) {
      console.error('No email provided in social profile');
      return false;
    }

    // Check if user exists
    const existingUser = await User.findOne({ email });
    
    if (existingUser) {
      // Link social account to existing user
      await linkSocialAccount(existingUser._id, account, profile);
      return true;
    } else {
      // Create new user with social account
      await createUserFromSocialLogin(profile, account);
      return true;
    }
  } catch (error) {
    console.error('Social login error:', error);
    return false;
  }
}

/**
 * Create a new user from social login
 */
export async function createUserFromSocialLogin(
  profile: SocialProfile,
  account: SocialAccount
): Promise<any> {
  try {
    const { email, name, picture, given_name, family_name, verified_email } = profile;
    
    // Generate a random password for social users
    const randomPassword = Math.random().toString(36).slice(-12);
    const hashedPassword = await bcrypt.hash(randomPassword, 12);
    
    // Create user data
    const userData = {
      name: name || `${given_name || ''} ${family_name || ''}`.trim() || 'Social User',
      email,
      password: hashedPassword,
      avatar: picture || '',
      role: 'user',
      isVerified: verified_email || false,
      isActive: true,
      socialAccounts: [{
        provider: account.provider,
        providerId: account.providerAccountId,
        accessToken: account.access_token,
        refreshToken: account.refresh_token,
        expiresAt: account.expires_at ? new Date(account.expires_at * 1000) : null,
        scope: account.scope,
        idToken: account.id_token,
        linkedAt: new Date()
      }],
      preferences: {
        language: profile.locale || 'en',
        notifications: {
          email: true,
          push: true,
          sms: false
        }
      },
      lastLogin: new Date(),
      loginCount: 1
    };

    const newUser = new User(userData);
    await newUser.save();
    
    console.log(`✅ New user created via ${account.provider}: ${email}`);
    return newUser;
  } catch (error) {
    console.error('Error creating user from social login:', error);
    throw error;
  }
}

/**
 * Link social account to existing user
 */
export async function linkSocialAccount(
  userId: string,
  account: SocialAccount,
  profile: SocialProfile
): Promise<void> {
  try {
    const user = await User.findById(userId);
    if (!user) {
      throw new Error('User not found');
    }

    // Check if social account is already linked
    const existingSocialAccount = user.socialAccounts?.find(
      (sa: any) => sa.provider === account.provider && sa.providerId === account.providerAccountId
    );

    if (existingSocialAccount) {
      // Update existing social account
      existingSocialAccount.accessToken = account.access_token;
      existingSocialAccount.refreshToken = account.refresh_token;
      existingSocialAccount.expiresAt = account.expires_at ? new Date(account.expires_at * 1000) : null;
      existingSocialAccount.scope = account.scope;
      existingSocialAccount.idToken = account.id_token;
      existingSocialAccount.lastUsed = new Date();
    } else {
      // Add new social account
      if (!user.socialAccounts) {
        user.socialAccounts = [];
      }
      
      user.socialAccounts.push({
        provider: account.provider,
        providerId: account.providerAccountId,
        accessToken: account.access_token,
        refreshToken: account.refresh_token,
        expiresAt: account.expires_at ? new Date(account.expires_at * 1000) : null,
        scope: account.scope,
        idToken: account.id_token,
        linkedAt: new Date(),
        lastUsed: new Date()
      });
    }

    // Update user profile if needed
    if (profile.picture && !user.avatar) {
      user.avatar = profile.picture;
    }
    
    if (profile.verified_email && !user.isVerified) {
      user.isVerified = true;
    }

    // Update last login
    user.lastLogin = new Date();
    user.loginCount = (user.loginCount || 0) + 1;

    await user.save();
    
    console.log(`✅ Social account linked: ${account.provider} for user ${user.email}`);
  } catch (error) {
    console.error('Error linking social account:', error);
    throw error;
  }
}

/**
 * Unlink social account from user
 */
export async function unlinkSocialAccount(
  userId: string,
  provider: string
): Promise<boolean> {
  try {
    const user = await User.findById(userId);
    if (!user) {
      throw new Error('User not found');
    }

    if (user.socialAccounts && user.socialAccounts.length > 0) {
      user.socialAccounts = user.socialAccounts.filter(
        (sa: any) => sa.provider !== provider
      );
      
      await user.save();
      console.log(`✅ Social account unlinked: ${provider} for user ${user.email}`);
      return true;
    }
    
    return false;
  } catch (error) {
    console.error('Error unlinking social account:', error);
    return false;
  }
}

/**
 * Get user's linked social accounts
 */
export async function getUserSocialAccounts(userId: string): Promise<any[]> {
  try {
    const user = await User.findById(userId).select('socialAccounts');
    return user?.socialAccounts || [];
  } catch (error) {
    console.error('Error getting user social accounts:', error);
    return [];
  }
}

/**
 * Check if user has password set (for account security)
 */
export async function hasPasswordSet(userId: string): Promise<boolean> {
  try {
    const user = await User.findById(userId).select('password');
    return !!(user?.password);
  } catch (error) {
    console.error('Error checking password status:', error);
    return false;
  }
}

/**
 * Set password for social-only users
 */
export async function setPasswordForSocialUser(
  userId: string,
  newPassword: string
): Promise<boolean> {
  try {
    const hashedPassword = await bcrypt.hash(newPassword, 12);
    
    await User.findByIdAndUpdate(userId, {
      password: hashedPassword,
      updatedAt: new Date()
    });
    
    console.log(`✅ Password set for social user: ${userId}`);
    return true;
  } catch (error) {
    console.error('Error setting password for social user:', error);
    return false;
  }
}
