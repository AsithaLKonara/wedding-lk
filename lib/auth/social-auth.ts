import { User } from '@/lib/models/user';
import { VendorProfile } from '@/lib/models/vendorProfile';
import { WeddingPlannerProfile } from '@/lib/models/weddingPlannerProfile';

export interface SocialProfile {
  id: string;
  email: string;
  name: string;
  picture?: string;
  provider: string;
  [key: string]: any;
}

export interface SocialAuthResult {
  success: boolean;
  user?: any;
  isNewUser: boolean;
  message: string;
}

export async function handleSocialLogin(profile: SocialProfile): Promise<SocialAuthResult> {
  try {
    const { email, provider } = profile;
    
    // Check if user exists by email
    const user = await User.findOne({ email });
    
    if (user) {
      // Link social account to existing user
      await linkSocialAccount(user._id, provider, profile);
      return {
        success: true,
        user,
        isNewUser: false,
        message: 'Social account linked successfully',
      };
    } else {
      // Create new user with social account
      const newUser = await createUserFromSocialLogin(profile);
      return {
        success: true,
        user: newUser,
        isNewUser: true,
        message: 'New user created with social account',
      };
    }
  } catch (error) {
    console.error('Social login error:', error);
    return {
      success: false,
      isNewUser: false,
      message: 'Social login failed',
    };
  }
}

async function createUserFromSocialLogin(profile: SocialProfile) {
  const userData = {
    email: profile.email,
    name: profile.name,
    avatar: profile.picture,
    role: 'user', // Default role for social login users
    isEmailVerified: true, // Social accounts are pre-verified
    status: 'active',
    socialAccounts: {
      [profile.provider]: {
        id: profile.id,
        email: profile.email,
        name: profile.name,
        picture: profile.picture,
      },
    },
    location: {
      country: 'Unknown',
      state: 'Unknown',
      city: 'Unknown',
    },
    preferences: {
      language: 'en',
      currency: 'USD',
      timezone: 'UTC',
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
  
  const user = new User(userData);
  await user.save();
  
  return user;
}

async function linkSocialAccount(userId: string, provider: string, profile: SocialProfile) {
  const updateData = {
    [`socialAccounts.${provider}`]: {
      id: profile.id,
      email: profile.email,
      name: profile.name,
      picture: profile.picture,
    },
  };
  
  await User.findByIdAndUpdate(userId, updateData);
}

export async function verifySocialToken(provider: string, token: string): Promise<SocialProfile | null> {
  try {
    switch (provider) {
      case 'google':
        return await verifyGoogleToken(token);
      case 'facebook':
        return await verifyFacebookToken(token);
      case 'instagram':
        return await verifyInstagramToken(token);
      case 'linkedin':
        return await verifyLinkedInToken(token);
      default:
        throw new Error(`Unsupported provider: ${provider}`);
    }
  } catch (error) {
    console.error(`Error verifying ${provider} token:`, error);
    return null;
  }
}

async function verifyGoogleToken(token: string): Promise<SocialProfile | null> {
  try {
    const response = await fetch(`https://www.googleapis.com/oauth2/v3/tokeninfo?access_token=${token}`);
    
    if (!response.ok) {
      throw new Error('Invalid Google token');
    }
    
    const data = await response.json();
    
    // Get user info from Google
    const userResponse = await fetch('https://www.googleapis.com/oauth2/v2/userinfo', {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
    
    if (!userResponse.ok) {
      throw new Error('Failed to get Google user info');
    }
    
    const userData = await userResponse.json();
    
    return {
      id: userData.id,
      email: userData.email,
      name: userData.name,
      picture: userData.picture,
      provider: 'google',
    };
  } catch (error) {
    console.error('Google token verification error:', error);
    return null;
  }
}

async function verifyFacebookToken(token: string): Promise<SocialProfile | null> {
  try {
    const response = await fetch(`https://graph.facebook.com/me?fields=id,name,email,picture&access_token=${token}`);
    
    if (!response.ok) {
      throw new Error('Invalid Facebook token');
    }
    
    const data = await response.json();
    
    return {
      id: data.id,
      email: data.email,
      name: data.name,
      picture: data.picture?.data?.url,
      provider: 'facebook',
    };
  } catch (error) {
    console.error('Facebook token verification error:', error);
    return null;
  }
}

async function verifyInstagramToken(token: string): Promise<SocialProfile | null> {
  try {
    const response = await fetch(`https://graph.instagram.com/me?fields=id,username,account_type&access_token=${token}`);
    
    if (!response.ok) {
      throw new Error('Invalid Instagram token');
    }
    
    const data = await response.json();
    
    // Instagram Basic Display API doesn't provide email, so we'll use username
    return {
      id: data.id,
      email: `${data.username}@instagram.user`, // Placeholder email
      name: data.username,
      picture: undefined,
      provider: 'instagram',
    };
  } catch (error) {
    console.error('Instagram token verification error:', error);
    return null;
  }
}

async function verifyLinkedInToken(token: string): Promise<SocialProfile | null> {
  try {
    const response = await fetch('https://api.linkedin.com/v2/me?projection=(id,firstName,lastName,profilePicture)', {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
    
    if (!response.ok) {
      throw new Error('Invalid LinkedIn token');
    }
    
    const data = await response.json();
    
    // Get email from LinkedIn
    const emailResponse = await fetch('https://api.linkedin.com/v2/emailAddress?q=members&projection=(elements*(handle~))', {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
    
    let email = 'unknown@linkedin.user';
    if (emailResponse.ok) {
      const emailData = await emailResponse.json();
      if (emailData.elements && emailData.elements[0]) {
        email = emailData.elements[0]['handle~'].emailAddress;
      }
    }
    
    return {
      id: data.id,
      email,
      name: `${data.firstName.localized.en_US} ${data.lastName.localized.en_US}`,
      picture: data.profilePicture?.['displayImage~']?.elements?.[0]?.identifiers?.[0]?.identifier,
      provider: 'linkedin',
    };
  } catch (error) {
    console.error('LinkedIn token verification error:', error);
    return null;
  }
}

export async function unlinkSocialAccount(userId: string, provider: string): Promise<boolean> {
  try {
    const updateData = {
      $unset: { [`socialAccounts.${provider}`]: 1 },
    };
    
    await User.findByIdAndUpdate(userId, updateData);
    return true;
  } catch (error) {
    console.error('Error unlinking social account:', error);
    return false;
  }
}

export async function getSocialAccounts(userId: string): Promise<any> {
  try {
    const user = await User.findById(userId).select('socialAccounts');
    return user?.socialAccounts || {};
  } catch (error) {
    console.error('Error getting social accounts:', error);
    return {};
  }
} 