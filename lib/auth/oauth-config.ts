export const oauthConfig = {
  google: {
    clientId: process.env.GOOGLE_CLIENT_ID || '',
    clientSecret: process.env.GOOGLE_CLIENT_SECRET || '',
    authorizationURL: 'https://accounts.google.com/o/oauth2/v2/auth',
    tokenURL: 'https://oauth2.googleapis.com/token',
    scope: [
      'openid',
      'profile',
      'email',
      'https://www.googleapis.com/auth/user.birthday.read',
      'https://www.googleapis.com/auth/user.gender.read'
    ].join(' '),
    redirectURI: `${process.env.NEXTAUTH_URL}/api/auth/callback/google`
  },
  
  facebook: {
    clientId: process.env.FACEBOOK_CLIENT_ID || '',
    clientSecret: process.env.FACEBOOK_CLIENT_SECRET || '',
    authorizationURL: 'https://www.facebook.com/v18.0/dialog/oauth',
    tokenURL: 'https://graph.facebook.com/v18.0/oauth/access_token',
    scope: [
      'email',
      'public_profile',
      'user_birthday',
      'user_gender',
      'user_location'
    ].join(','),
    redirectURI: `${process.env.NEXTAUTH_URL}/api/auth/callback/facebook`
  },
  
  instagram: {
    clientId: process.env.INSTAGRAM_CLIENT_ID || '',
    clientSecret: process.env.INSTAGRAM_CLIENT_SECRET || '',
    authorizationURL: 'https://api.instagram.com/oauth/authorize',
    tokenURL: 'https://api.instagram.com/oauth/access_token',
    scope: 'user_profile,user_media',
    redirectURI: `${process.env.NEXTAUTH_URL}/api/auth/callback/instagram`
  },
  
  linkedin: {
    clientId: process.env.LINKEDIN_CLIENT_ID || '',
    clientSecret: process.env.LINKEDIN_CLIENT_SECRET || '',
    authorizationURL: 'https://www.linkedin.com/oauth/v2/authorization',
    tokenURL: 'https://www.linkedin.com/oauth/v2/accessToken',
    scope: [
      'r_liteprofile',
      'r_emailaddress',
      'w_member_social'
    ].join(' '),
    redirectURI: `${process.env.NEXTAUTH_URL}/api/auth/callback/linkedin`
  }
};

export const getOAuthProviderConfig = (provider: keyof typeof oauthConfig) => {
  return oauthConfig[provider];
};

export const validateOAuthConfig = () => {
  const missingProviders: string[] = [];
  
  Object.entries(oauthConfig).forEach(([provider, config]) => {
    if (!config.clientId || !config.clientSecret) {
      missingProviders.push(provider);
    }
  });
  
  return {
    isValid: missingProviders.length === 0,
    missingProviders,
    message: missingProviders.length > 0 
      ? `Missing OAuth credentials for: ${missingProviders.join(', ')}`
      : 'All OAuth providers configured'
  };
}; 