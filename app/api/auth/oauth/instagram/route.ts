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

    const config = getOAuthProviderConfig('instagram');

    // Exchange authorization code for access token
    const tokenResponse = await fetch(config.tokenURL, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded',
      },
      body: new URLSearchParams({
        client_id: config.clientId,
        client_secret: config.clientSecret,
        grant_type: 'authorization_code',
        redirect_uri: config.redirectURI,
        code,
      }),
    });

    if (!tokenResponse.ok) {
      throw new Error('Failed to exchange code for token');
    }

    const tokenData = await tokenResponse.json();

    // Get user info using access token
    const userResponse = await fetch(
      `https://graph.instagram.com/me?fields=id,username,account_type&access_token=${tokenData.access_token}`
    );

    if (!userResponse.ok) {
      throw new Error('Failed to fetch user info');
    }

    const userData = await userResponse.json();

    // Get user media for profile picture
    const mediaResponse = await fetch(
      `https://graph.instagram.com/me/media?fields=id,media_type,media_url,thumbnail_url&access_token=${tokenData.access_token}`
    );

    let profilePicture = '';
    if (mediaResponse.ok) {
      const mediaData = await mediaResponse.json();
      const firstImage = mediaData.data?.find((item: Record<string, unknown>) => 
        item.media_type === 'IMAGE' || item.media_type === 'CAROUSEL_ALBUM'
      );
      if (firstImage) {
        profilePicture = firstImage.media_url || firstImage.thumbnail_url;
      }
    }

    // Authenticate user with social data
    const authResult = await SocialAuthHandler.authenticateUser({
      id: userData.id,
      email: `${userData.username}@instagram.com`, // Instagram doesn't provide email
      name: userData.username,
      picture: profilePicture,
      provider: 'instagram',
      accessToken: tokenData.access_token,
      expiresAt: tokenData.expires_in ? Date.now() + tokenData.expires_in * 1000 : undefined,
      additionalData: {
        username: userData.username,
        account_type: userData.account_type
      }
    });

    if (authResult.success && authResult.token) {
      // Redirect to dashboard with token
      return NextResponse.redirect(
        `${process.env.NEXTAUTH_URL}/dashboard?token=${authResult.token}&provider=instagram`
      );
    } else {
      return NextResponse.redirect(
        `${process.env.NEXTAUTH_URL}/login?error=${encodeURIComponent(authResult.error || 'Authentication failed')}`
      );
    }
  } catch (error) {
    console.error('Instagram OAuth error:', error);
    return NextResponse.redirect(
      `${process.env.NEXTAUTH_URL}/login?error=${encodeURIComponent('Authentication failed')}`
    );
  }
} 