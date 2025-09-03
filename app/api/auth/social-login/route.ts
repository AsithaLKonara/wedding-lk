import { NextRequest, NextResponse } from 'next/server';
import { connectDB } from '@/lib/db';
import { User } from '@/lib/models/user';
import { verifySocialToken, handleSocialLogin } from '@/lib/auth/social-auth';
import { generateJWT } from '@/lib/auth/jwt-utils';

export async function POST(request: NextRequest) {
  try {
    await connectDB();
    
    const body = await request.json();
    const { provider, token, role } = body;
    
    // Validate required fields
    if (!provider || !token) {
      return NextResponse.json(
        { error: 'Provider and token are required' },
        { status: 400 }
      );
    }
    
    // Validate provider
    const validProviders = ['google', 'facebook', 'instagram', 'linkedin'];
    if (!validProviders.includes(provider)) {
      return NextResponse.json(
        { error: 'Invalid provider', validProviders },
        { status: 400 }
      );
    }
    
    // Verify social token
    const profile = await verifySocialToken(provider, token);
    if (!profile) {
      return NextResponse.json(
        { error: 'Invalid social token' },
        { status: 401 }
      );
    }
    
    // Handle social login
    const result = await handleSocialLogin(profile);
    
    if (!result.success) {
      return NextResponse.json(
        { error: 'Social login failed', message: result.message },
        { status: 500 }
      );
    }
    
    // Generate JWT token
    const jwtToken = generateJWT(result.user);
    
    // Update last login
    await result.user.updateLastActive();
    
    return NextResponse.json({
      success: true,
      token: jwtToken,
      user: {
        id: result.user._id,
        email: result.user.email,
        name: result.user.name,
        role: result.user.role,
        avatar: result.user.avatar,
        isEmailVerified: result.user.isEmailVerified,
        status: result.user.status,
      },
      isNewUser: result.isNewUser,
      message: result.message,
    });
    
  } catch (error) {
    console.error('Social login error:', error);
    return NextResponse.json(
      { error: 'Social login failed', message: 'Internal server error' },
      { status: 500 }
    );
  }
}

// GET endpoint to check available social providers
export async function GET() {
  try {
    const providers = [
      {
        id: 'google',
        name: 'Google',
        icon: '🔍',
        description: 'Sign in with your Google account',
        color: '#4285F4',
      },
      {
        id: 'facebook',
        name: 'Facebook',
        icon: '📘',
        description: 'Sign in with your Facebook account',
        color: '#1877F2',
      },
      {
        id: 'instagram',
        name: 'Instagram',
        icon: '📷',
        description: 'Sign in with your Instagram account',
        color: '#E4405F',
      },
      {
        id: 'linkedin',
        name: 'LinkedIn',
        icon: '💼',
        description: 'Sign in with your LinkedIn account',
        color: '#0A66C2',
      },
    ];
    
    return NextResponse.json({
      success: true,
      providers,
    });
    
  } catch (error) {
    console.error('Error getting social providers:', error);
    return NextResponse.json(
      { error: 'Failed to get social providers' },
      { status: 500 }
    );
  }
} 