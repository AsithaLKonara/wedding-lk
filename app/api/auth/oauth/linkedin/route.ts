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

    const config = getOAuthProviderConfig('linkedin');

    // Exchange authorization code for access token
    const tokenResponse = await fetch(config.tokenURL, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded',
      },
      body: new URLSearchParams({
        grant_type: 'authorization_code',
        code,
        redirect_uri: config.redirectURI,
        client_id: config.clientId,
        client_secret: config.clientSecret,
      }),
    });

    if (!tokenResponse.ok) {
      throw new Error('Failed to exchange code for token');
    }

    const tokenData = await tokenResponse.json();

    // Get user info using access token
    const userResponse = await fetch(
      'https://api.linkedin.com/v2/me?projection=(id,firstName,lastName,profilePicture(displayImage~:playableStreams))',
      {
        headers: {
          'Authorization': `Bearer ${tokenData.access_token}`,
          'X-Restli-Protocol-Version': '2.0.0'
        }
      }
    );

    if (!userResponse.ok) {
      throw new Error('Failed to fetch user info');
    }

    const userData = await userResponse.json();

    // Get email address
    const emailResponse = await fetch(
      'https://api.linkedin.com/v2/emailAddress?q=members&projection=(elements*(handle~))',
      {
        headers: {
          'Authorization': `Bearer ${tokenData.access_token}`,
          'X-Restli-Protocol-Version': '2.0.0'
        }
      }
    );

    let email = '';
    if (emailResponse.ok) {
      const emailData = await emailResponse.json();
      email = emailData.elements?.[0]?.['handle~']?.emailAddress || '';
    }

    // Extract profile picture
    let profilePicture = '';
    if (userData.profilePicture && userData.profilePicture['displayImage~'] && userData.profilePicture['displayImage~'].elements) {
      const imageElements = userData.profilePicture['displayImage~'].elements;
      const largestImage = imageElements[imageElements.length - 1];
      profilePicture = largestImage?.identifiers?.[0]?.identifier || '';
    }

    // Authenticate user with social data
    const authResult = await SocialAuthHandler.authenticateUser({
      id: userData.id,
      email: email || `${userData.id}@linkedin.com`,
      name: `${userData.firstName?.localized?.en_US || ''} ${userData.lastName?.localized?.en_US || ''}`.trim(),
      picture: profilePicture,
      provider: 'linkedin',
      accessToken: tokenData.access_token,
      expiresAt: tokenData.expires_in ? Date.now() + tokenData.expires_in * 1000 : undefined,
      additionalData: {
        firstName: userData.firstName?.localized?.en_US,
        lastName: userData.lastName?.localized?.en_US,
        profilePicture: userData.profilePicture
      }
    });

    if (authResult.success && authResult.token) {
      // Redirect to dashboard with token
      return NextResponse.redirect(
        `${process.env.NEXTAUTH_URL}/dashboard?token=${authResult.token}&provider=linkedin`
      );
    } else {
      return NextResponse.redirect(
        `${process.env.NEXTAUTH_URL}/login?error=${encodeURIComponent(authResult.error || 'Authentication failed')}`
      );
    }
  } catch (error) {
    console.error('LinkedIn OAuth error:', error);
    return NextResponse.redirect(
      `${process.env.NEXTAUTH_URL}/login?error=${encodeURIComponent('Authentication failed')}`
    );
  }
} 