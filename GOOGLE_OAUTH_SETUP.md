# Google OAuth Production Setup Guide

## 🔐 Setting Up Google OAuth for WeddingLK Production

### Step 1: Create Google Cloud Project
1. Go to https://console.developers.google.com/
2. Click "Select a project" → "New Project"
3. Project name: "WeddingLK Production"
4. Organization: Select your organization (if applicable)
5. Location: Choose appropriate location
6. Click "Create"

### Step 2: Enable Google+ API
1. In your project dashboard, go to "APIs & Services" → "Library"
2. Search for "Google+ API"
3. Click on "Google+ API"
4. Click "Enable"

### Step 3: Configure OAuth Consent Screen
1. Go to "APIs & Services" → "OAuth consent screen"
2. Choose "External" user type
3. Fill in required information:
   - App name: "WeddingLK"
   - User support email: your-email@gmail.com
   - Developer contact information: your-email@gmail.com
4. Add scopes:
   - `../auth/userinfo.email`
   - `../auth/userinfo.profile`
   - `openid`
5. Add test users (your email addresses)
6. Save and continue

### Step 4: Create OAuth 2.0 Credentials
1. Go to "APIs & Services" → "Credentials"
2. Click "Create Credentials" → "OAuth 2.0 Client IDs"
3. Application type: "Web application"
4. Name: "WeddingLK Production"
5. Authorized JavaScript origins:
   ```
   https://wedding-1hlk8nv0f-asithalkonaras-projects.vercel.app
   ```
6. Authorized redirect URIs:
   ```
   https://wedding-1hlk8nv0f-asithalkonaras-projects.vercel.app/api/auth/callback/google
   ```
7. Click "Create"
8. Copy the **Client ID** and **Client Secret**

### Step 5: Update Vercel Environment Variables
Go to https://vercel.com/asithalkonaras-projects/wedding-lk/settings/environment-variables

Add these environment variables:

```bash
GOOGLE_CLIENT_ID=your_google_client_id_here
GOOGLE_CLIENT_SECRET=your_google_client_secret_here
```

### Step 6: Configure NextAuth.js
Your WeddingLK platform already includes NextAuth.js configuration in `lib/auth.ts`:

```typescript
GoogleProvider({
  clientId: process.env.GOOGLE_CLIENT_ID!,
  clientSecret: process.env.GOOGLE_CLIENT_SECRET!,
})
```

### Step 7: Test OAuth Flow
1. Redeploy your application: `vercel --prod`
2. Go to: https://wedding-1hlk8nv0f-asithalkonaras-projects.vercel.app/auth/signin
3. Click "Sign in with Google"
4. Complete the OAuth flow
5. Verify user creation in database

## 🔧 OAuth Integration Features

### Authentication Pages:
- `app/auth/signin/page.tsx` - Sign in page
- `app/auth/signup/page.tsx` - Sign up page
- `app/auth/forgot-password/page.tsx` - Password reset
- `app/auth/reset-password/page.tsx` - Password reset form
- `app/auth/verify-email/page.tsx` - Email verification

### API Routes:
- `app/api/auth/[...nextauth]/route.ts` - NextAuth.js handler
- `app/api/auth/logout/route.ts` - Logout endpoint
- `app/api/auth/send-verification/route.ts` - Email verification
- `app/api/auth/validate-reset-token/route.ts` - Token validation

### User Management:
- Automatic user creation on first login
- Profile data synchronization
- Role-based access control
- Session management

## 👥 User Roles and Permissions

### Default Roles:
- **user** - Regular wedding couples
- **vendor** - Service providers
- **planner** - Wedding planners
- **admin** - Platform administrators

### Role-Based Features:
- **Users**: Browse, book, message, review
- **Vendors**: Manage profile, services, bookings
- **Planners**: Manage clients, tasks, coordination
- **Admins**: Platform management, moderation

## 🔒 Security Configuration

### OAuth Scopes:
- `email` - Access to user's email address
- `profile` - Access to user's basic profile information
- `openid` - OpenID Connect authentication

### Security Features:
- CSRF protection
- Secure session management
- Role-based route protection
- Secure cookie configuration

## 🧪 Testing OAuth Integration

### Test Scenarios:
1. **New User Registration**:
   - Sign in with Google
   - Verify account creation
   - Check profile data

2. **Existing User Login**:
   - Sign in with existing account
   - Verify session creation
   - Check role permissions

3. **Role Assignment**:
   - Test different user roles
   - Verify access control
   - Check dashboard access

### Test Users:
Create test Google accounts for different roles:
- test-user@gmail.com (user role)
- test-vendor@gmail.com (vendor role)
- test-planner@gmail.com (planner role)
- test-admin@gmail.com (admin role)

## 📊 User Analytics

### Google Analytics Integration:
- User registration tracking
- Authentication flow analytics
- User behavior tracking
- Conversion rate monitoring

### Custom Analytics:
- User role distribution
- Authentication method usage
- Session duration tracking
- User engagement metrics

## 🎯 Next Steps After Google OAuth Setup

1. ✅ Google OAuth configured
2. ⏳ Test authentication flow
3. ⏳ Set up Redis caching
4. ⏳ Configure email service
5. ⏳ Test user registration
6. ⏳ Test role-based access
7. ⏳ Populate sample data

## 🔗 Useful Links

- [Google Cloud Console](https://console.developers.google.com/)
- [Google OAuth Documentation](https://developers.google.com/identity/protocols/oauth2)
- [NextAuth.js Documentation](https://next-auth.js.org/)
- [Vercel Environment Variables](https://vercel.com/asithalkonaras-projects/wedding-lk/settings/environment-variables)

## 📞 Support

If you encounter issues:
1. Check Google Cloud Console for errors
2. Verify redirect URIs are correct
3. Test OAuth flow step by step
4. Check Vercel deployment logs
5. Review NextAuth.js configuration
