import { User, VendorProfile, WeddingPlannerProfile } from '@/lib/models';
import { getOAuthProviderConfig, validateOAuthConfig } from './oauth-config';
import { generateJWT } from './jwt-utils';

export interface SocialUserData {
  id: string;
  email: string;
  name: string;
  picture?: string;
  provider: string;
  accessToken: string;
  refreshToken?: string;
  expiresAt?: number;
  additionalData?: Record<string, any>;
}

export interface SocialAuthResult {
  success: boolean;
  user?: any;
  token?: string;
  error?: string;
  isNewUser?: boolean;
}

export class SocialAuthHandler {
  private static instance: SocialAuthHandler;

  static getInstance(): SocialAuthHandler {
    if (!SocialAuthHandler.instance) {
      SocialAuthHandler.instance = new SocialAuthHandler();
    }
    return SocialAuthHandler.instance;
  }

  async authenticateUser(socialData: SocialUserData): Promise<SocialAuthResult> {
    try {
      // Validate OAuth configuration
      const configValidation = validateOAuthConfig();
      if (!configValidation.isValid) {
        return {
          success: false,
          error: `OAuth configuration error: ${configValidation.message}`
        };
      }

      // Check if user already exists
      let user = await User.findOne({ email: socialData.email });

      if (user) {
        // User exists - update social account info
        await this.updateSocialAccount(user._id, socialData);
        const token = generateJWT(user);
        
        return {
          success: true,
          user,
          token,
          isNewUser: false
        };
      } else {
        // New user - create account
        user = await this.createSocialUser(socialData);
        const token = generateJWT(user);
        
        return {
          success: true,
          user,
          token,
          isNewUser: true
        };
      }
    } catch (error) {
      console.error('Social authentication error:', error);
      return {
        success: false,
        error: error instanceof Error ? error.message : 'Authentication failed'
      };
    }
  }

  private async createSocialUser(socialData: SocialUserData): Promise<any> {
    // Create base user
    const user = new User({
      email: socialData.email,
      name: socialData.name,
      avatar: socialData.picture,
      isVerified: true, // Social accounts are pre-verified
      socialAccounts: [{
        provider: socialData.provider,
        providerId: socialData.id,
        accessToken: socialData.accessToken,
        refreshToken: socialData.refreshToken,
        expiresAt: socialData.expiresAt,
        additionalData: socialData.additionalData
      }],
      lastLogin: new Date(),
      loginAttempts: 0
    });

    await user.save();

    // Create profile based on role (default to user)
    await this.createUserProfile(user._id, 'user');

    return user;
  }

  private async updateSocialAccount(userId: any, socialData: SocialUserData): Promise<void> {
    const user = await User.findById(userId);
    if (!user) return;

    // Update social account info
    const existingAccountIndex = user.socialAccounts?.findIndex(
      (account: any) => account.provider === socialData.provider
    );

    if (existingAccountIndex !== -1 && existingAccountIndex !== undefined) {
      // Update existing account
      user.socialAccounts[existingAccountIndex] = {
        provider: socialData.provider,
        providerId: socialData.id,
        accessToken: socialData.accessToken,
        refreshToken: socialData.refreshToken,
        expiresAt: socialData.expiresAt,
        additionalData: socialData.additionalData
      };
    } else {
      // Add new social account
      user.socialAccounts = user.socialAccounts || [];
      user.socialAccounts.push({
        provider: socialData.provider,
        providerId: socialData.id,
        accessToken: socialData.accessToken,
        refreshToken: socialData.refreshToken,
        expiresAt: socialData.expiresAt,
        additionalData: socialData.additionalData
      });
    }

    user.lastLogin = new Date();
    await user.save();
  }

  private async createUserProfile(userId: any, role: string): Promise<void> {
    switch (role) {
      case 'vendor': {
        const vendorProfile = new VendorProfile({
          userId,
          businessName: '',
          category: '',
          servicesOffered: [],
          location: {},
          contact: {},
          description: '',
          portfolio: [],
          pricing: {},
          availability: [],
          documents: [],
          isVerified: false,
          verificationStatus: 'pending'
        });
        await vendorProfile.save();
        break;
      }

      case 'wedding_planner': {
        const plannerProfile = new WeddingPlannerProfile({
          userId,
          companyName: '',
          experienceYears: 0,
          specialties: [],
          location: {},
          contact: {},
          description: '',
          portfolio: [],
          pricing: {},
          availability: [],
          documents: [],
          isVerified: false,
          verificationStatus: 'pending'
        });
        await plannerProfile.save();
        break;
      }

      default:
        // Regular user - no additional profile needed
        break;
    }
  }

  async refreshAccessToken(userId: string, provider: string): Promise<string | null> {
    try {
      const user = await User.findById(userId);
      if (!user?.socialAccounts) return null;

      const socialAccount = user.socialAccounts.find(
        (account: any) => account.provider === provider
      );

      if (!socialAccount?.refreshToken) return null;

      // Implement token refresh logic for each provider
      const newAccessToken = await this.refreshProviderToken(provider, socialAccount.refreshToken);
      
      if (newAccessToken) {
        // Update the access token in the database
        await User.updateOne(
          { _id: userId, 'socialAccounts.provider': provider },
          { $set: { 'socialAccounts.$.accessToken': newAccessToken } }
        );
        return newAccessToken;
      }

      return null;
    } catch (error) {
      console.error('Token refresh error:', error);
      return null;
    }
  }

  private async refreshProviderToken(provider: string, refreshToken: string): Promise<string | null> {
    try {
      const config = getOAuthProviderConfig(provider as keyof typeof import('./oauth-config').oauthConfig);
      
      switch (provider) {
        case 'google':
          return await this.refreshGoogleToken(refreshToken, config);
        case 'facebook':
          return await this.refreshFacebookToken(refreshToken, config);
        case 'instagram':
          return await this.refreshInstagramToken(refreshToken, config);
        case 'linkedin':
          return await this.refreshLinkedinToken(refreshToken, config);
        default:
          return null;
      }
    } catch (error) {
      console.error(`Error refreshing ${provider} token:`, error);
      return null;
    }
  }

  private async refreshGoogleToken(refreshToken: string, config: any): Promise<string | null> {
    const response = await fetch(config.tokenURL, {
      method: 'POST',
      headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
      body: new URLSearchParams({
        client_id: config.clientId,
        client_secret: config.clientSecret,
        refresh_token: refreshToken,
        grant_type: 'refresh_token'
      })
    });

    if (response.ok) {
      const data = await response.json();
      return data.access_token;
    }
    return null;
  }

  private async refreshFacebookToken(refreshToken: string, config: any): Promise<string | null> {
    // Facebook tokens are long-lived, but we can extend them
    const response = await fetch(`https://graph.facebook.com/oauth/access_token?grant_type=fb_exchange_token&client_id=${config.clientId}&client_secret=${config.clientSecret}&fb_exchange_token=${refreshToken}`);
    
    if (response.ok) {
      const data = await response.json();
      return data.access_token;
    }
    return null;
  }

  private async refreshInstagramToken(refreshToken: string, config: any): Promise<string | null> {
    // Instagram Basic Display API doesn't support refresh tokens
    // Users need to re-authenticate
    return null;
  }

  private async refreshLinkedinToken(refreshToken: string, config: any): Promise<string | null> {
    const response = await fetch(config.tokenURL, {
      method: 'POST',
      headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
      body: new URLSearchParams({
        grant_type: 'refresh_token',
        refresh_token: refreshToken,
        client_id: config.clientId,
        client_secret: config.clientSecret
      })
    });

    if (response.ok) {
      const data = await response.json();
      return data.access_token;
    }
    return null;
  }

  async unlinkSocialAccount(userId: string, provider: string): Promise<boolean> {
    try {
      await User.updateOne(
        { _id: userId },
        { $pull: { socialAccounts: { provider } } }
      );
      return true;
    } catch (error) {
      console.error('Error unlinking social account:', error);
      return false;
    }
  }

  async getSocialAccounts(userId: string): Promise<any[]> {
    try {
      const user = await User.findById(userId).select('socialAccounts');
      return user?.socialAccounts || [];
    } catch (error) {
      console.error('Error getting social accounts:', error);
      return [];
    }
  }
}

export default SocialAuthHandler.getInstance(); 