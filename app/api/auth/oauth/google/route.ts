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

    const config = getOAuthProviderConfig('google');

    // Exchange authorization code for access token
    const tokenResponse = await fetch(config.tokenURL, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded',
      },
      body: new URLSearchParams({
        code,
        client_id: config.clientId,
        client_secret: config.clientSecret,
        redirect_uri: config.redirectURI,
        grant_type: 'authorization_code',
      }),
    });

    if (!tokenResponse.ok) {
      throw new Error('Failed to exchange code for token');
    }

    const tokenData = await tokenResponse.json();

    // Get user info using access token
    const userResponse = await fetch(
      `https://www.googleapis.com/oauth2/v2/userinfo?access_token=${tokenData.access_token}`
    );

    if (!userResponse.ok) {
      throw new Error('Failed to fetch user info');
    }

    const userData = await userResponse.json();

    // Authenticate user with social data
    const authResult = await SocialAuthHandler.authenticateUser({
      id: userData.id,
      email: userData.email,
      name: userData.name,
      picture: userData.picture,
      provider: 'google',
      accessToken: tokenData.access_token,
      refreshToken: tokenData.refresh_token,
      expiresAt: tokenData.expires_in ? Date.now() + tokenData.expires_in * 1000 : undefined,
      additionalData: {
        locale: userData.locale,
        verified_email: userData.verified_email,
        hd: userData.hd
      }
    });

    if (authResult.success && authResult.token) {
      // Redirect to dashboard with token
      return NextResponse.redirect(
        `${process.env.NEXTAUTH_URL}/dashboard?token=${authResult.token}&provider=google`
      );
    } else {
      return NextResponse.redirect(
        `${process.env.NEXTAUTH_URL}/login?error=${encodeURIComponent(authResult.error || 'Authentication failed')}`
      );
    }
  } catch (error) {
    console.error('Google OAuth error:', error);
    return NextResponse.redirect(
      `${process.env.NEXTAUTH_URL}/login?error=${encodeURIComponent('Authentication failed')}`
    );
  }
} 