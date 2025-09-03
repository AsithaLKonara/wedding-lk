import { NextRequest, NextResponse } from 'next/server';
import { getOAuthProviderConfig } from '@/lib/auth/oauth-config';
import SocialAuthHandler from '@/lib/auth/socialAuthHandler';

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const code = searchParams.get('code');
    const error = searchParams.get('error');

    if (error) {
      return NextResponse.redirect(
        `${process.env.NEXTAUTH_URL}/login?error=${encodeURIComponent(error)}`
      );
    }

    if (!code) {
      return NextResponse.redirect(
        `${process.env.NEXTAUTH_URL}/login?error=${encodeURIComponent('Authorization code not received')}`
      );
    }

    const config = getOAuthProviderConfig('facebook');

    // Exchange authorization code for access token
    const tokenResponse = await fetch(config.tokenURL, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
      },
    });

    if (!tokenResponse.ok) {
      throw new Error('Failed to exchange code for token');
    }

    const tokenData = await tokenResponse.json();

    // Get user info using access token
    const userResponse = await fetch(
      `https://graph.facebook.com/me?fields=id,name,email,picture.type(large)&access_token=${tokenData.access_token}`
    );

    if (!userResponse.ok) {
      throw new Error('Failed to fetch user info');
    }

    const userData = await userResponse.json();

    // Get additional user data
    const additionalDataResponse = await fetch(
      `https://graph.facebook.com/me?fields=birthday,gender,location&access_token=${tokenData.access_token}`
    );

    let additionalData = {};
    if (additionalDataResponse.ok) {
      additionalData = await additionalDataResponse.json();
    }

    // Authenticate user with social data
    const authResult = await SocialAuthHandler.authenticateUser({
      id: userData.id,
      email: userData.email,
      name: userData.name,
      picture: userData.picture?.data?.url,
      provider: 'facebook',
      accessToken: tokenData.access_token,
      expiresAt: tokenData.expires_in ? Date.now() + tokenData.expires_in * 1000 : undefined,
      additionalData: {
        ...additionalData,
        picture_data: userData.picture
      }
    });

    if (authResult.success && authResult.token) {
      // Redirect to dashboard with token
      return NextResponse.redirect(
        `${process.env.NEXTAUTH_URL}/dashboard?token=${authResult.token}&provider=facebook`
      );
    } else {
      return NextResponse.redirect(
        `${process.env.NEXTAUTH_URL}/login?error=${encodeURIComponent(authResult.error || 'Authentication failed')}`
      );
    }
  } catch (error) {
    console.error('Facebook OAuth error:', error);
    return NextResponse.redirect(
      `${process.env.NEXTAUTH_URL}/login?error=${encodeURIComponent('Authentication failed')}`
    );
  }
} 