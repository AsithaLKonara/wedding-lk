# 🔐 OAuth Setup Guide for WeddingLK

This guide will help you configure OAuth providers for social authentication in WeddingLK.

## 📋 Prerequisites

- Node.js 18+ installed
- MongoDB database
- OAuth provider accounts (Google, Facebook, etc.)

## 🚀 Quick Setup

### 1. Environment Variables

Add these variables to your `.env.local` file:

```bash
# OAuth Provider Configuration
GOOGLE_CLIENT_ID=your-google-client-id
GOOGLE_CLIENT_SECRET=your-google-client-secret
FACEBOOK_CLIENT_ID=your-facebook-client-id
FACEBOOK_CLIENT_SECRET=your-facebook-client-secret

# NextAuth Configuration
NEXTAUTH_URL=http://localhost:3000
NEXTAUTH_SECRET=your-nextauth-secret-key

# Database
MONGODB_URI=your-mongodb-connection-string
```

### 2. Generate NextAuth Secret

```bash
openssl rand -base64 32
```

## 🔧 Provider Setup

### Google OAuth 2.0

1. **Go to Google Cloud Console**
   - Visit: https://console.developers.google.com/
   - Create a new project or select existing one

2. **Enable Google+ API**
   - Go to "APIs & Services" > "Library"
   - Search for "Google+ API" and enable it

3. **Create OAuth 2.0 Credentials**
   - Go to "APIs & Services" > "Credentials"
   - Click "Create Credentials" > "OAuth 2.0 Client IDs"
   - Application type: "Web application"
   - Authorized redirect URIs:
     - `http://localhost:3000/api/auth/callback/google` (development)
     - `https://yourdomain.com/api/auth/callback/google` (production)

4. **Get Credentials**
   - Copy Client ID and Client Secret
   - Add to your `.env.local` file

### Facebook OAuth

1. **Go to Facebook Developers**
   - Visit: https://developers.facebook.com/
   - Create a new app

2. **Configure Facebook Login**
   - Add "Facebook Login" product
   - Go to "Facebook Login" > "Settings"
   - Valid OAuth Redirect URIs:
     - `http://localhost:3000/api/auth/callback/facebook` (development)
     - `https://yourdomain.com/api/auth/callback/facebook` (production)

3. **Get App Credentials**
   - Go to "Settings" > "Basic"
   - Copy App ID and App Secret
   - Add to your `.env.local` file

### Instagram Basic Display API

1. **Use Facebook App**
   - Use the same Facebook app from above
   - Add "Instagram Basic Display" product

2. **Configure Instagram**
   - Go to "Instagram Basic Display" > "Basic Display"
   - Valid OAuth Redirect URIs:
     - `http://localhost:3000/api/auth/callback/instagram` (development)
     - `https://yourdomain.com/api/auth/callback/instagram` (production)

3. **Get Credentials**
   - Use the same App ID and App Secret from Facebook
   - Add to your `.env.local` file

### LinkedIn OAuth 2.0

1. **Go to LinkedIn Developers**
   - Visit: https://www.linkedin.com/developers/
   - Create a new app

2. **Configure OAuth 2.0**
   - Go to "Auth" tab
   - Authorized redirect URLs:
     - `http://localhost:3000/api/auth/callback/linkedin` (development)
     - `https://yourdomain.com/api/auth/callback/linkedin` (production)

3. **Get Credentials**
   - Copy Client ID and Client Secret
   - Add to your `.env.local` file

## 🧪 Testing

### 1. Start the Development Server

```bash
npm run dev
```

### 2. Test Social Login

1. Go to `http://localhost:3000/auth/signin`
2. Click on social login buttons
3. Complete OAuth flow
4. Verify user creation in database

### 3. Test Account Management

1. Go to user dashboard
2. Navigate to "Social Accounts" section
3. Test linking/unlinking accounts
4. Test password setting for social-only users

## 🔍 Troubleshooting

### Common Issues

1. **"OAuthAccountNotLinked" Error**
   - User already exists with different provider
   - Solution: Link accounts or use original sign-in method

2. **"Invalid Redirect URI" Error**
   - Check redirect URIs in OAuth provider settings
   - Ensure exact match with callback URLs

3. **"Invalid Client" Error**
   - Check Client ID and Secret
   - Ensure they're correctly set in environment variables

4. **Database Connection Issues**
   - Verify MongoDB connection string
   - Check if database is accessible

### Debug Mode

Enable debug mode in development:

```bash
NODE_ENV=development
```

This will show detailed OAuth flow logs in the console.

## 📱 Mobile App Integration

The OAuth implementation works with the mobile app:

1. **React Native Configuration**
   - Use the same OAuth credentials
   - Configure deep linking for OAuth callbacks
   - Handle OAuth flow in mobile app

2. **API Integration**
   - Mobile app can use the same API endpoints
   - Social account management works on mobile
   - Push notifications for account changes

## 🔒 Security Considerations

1. **Environment Variables**
   - Never commit OAuth secrets to version control
   - Use different credentials for development/production
   - Rotate secrets regularly

2. **Redirect URIs**
   - Only add necessary redirect URIs
   - Use HTTPS in production
   - Validate redirect URIs on server side

3. **User Data**
   - Only request necessary OAuth scopes
   - Handle user data according to privacy policies
   - Implement proper data retention policies

## 📚 Additional Resources

- [NextAuth.js Documentation](https://next-auth.js.org/)
- [Google OAuth 2.0 Guide](https://developers.google.com/identity/protocols/oauth2)
- [Facebook Login Documentation](https://developers.facebook.com/docs/facebook-login/)
- [LinkedIn OAuth Guide](https://docs.microsoft.com/en-us/linkedin/shared/authentication/authorization-code-flow)

## 🆘 Support

If you encounter issues:

1. Check the console logs for detailed error messages
2. Verify all environment variables are set correctly
3. Test with a fresh OAuth app if needed
4. Check OAuth provider documentation for updates

---

**Note**: This implementation includes fallback mechanisms and error handling to ensure the application works even if OAuth providers are temporarily unavailable.
