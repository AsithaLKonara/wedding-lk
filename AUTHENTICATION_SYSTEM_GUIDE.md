# WeddingLK Authentication System Guide

## Overview

WeddingLK uses NextAuth.js v4.24.11 for comprehensive authentication with multiple providers, role-based access control, email verification, and password reset functionality.

## 🔐 Authentication Features

### ✅ Implemented Features

1. **Multi-Provider Authentication**
   - Google OAuth (Social Login)
   - Credentials Provider (Email/Password)
   - JWT-based sessions

2. **User Registration**
   - Multi-step registration form
   - Role-based registration (User, Vendor, Wedding Planner)
   - Email verification required
   - Role-specific profile creation

3. **Email Services**
   - Password reset emails
   - Email verification
   - Welcome emails
   - Professional HTML templates

4. **Security Features**
   - Password hashing (bcrypt)
   - JWT tokens with expiration
   - Email verification tokens
   - Password reset tokens
   - Session management

5. **Admin Features**
   - User management dashboard
   - Role-based access control
   - User status management
   - Bulk operations

6. **UI/UX**
   - Responsive authentication pages
   - Loading states and error handling
   - Professional design
   - Mobile-friendly interface

## 🚀 Quick Start

### 1. Environment Variables

Create `.env.local` with:

```bash
# Database
MONGODB_URI=mongodb+srv://username:password@cluster.mongodb.net/weddinglk

# NextAuth
NEXTAUTH_URL=https://your-domain.vercel.app
NEXTAUTH_SECRET=your-secret-key

# Google OAuth
GOOGLE_CLIENT_ID=your-google-client-id
GOOGLE_CLIENT_SECRET=your-google-client-secret

# Email Service (Optional)
EMAIL_SERVER_HOST=smtp.gmail.com
EMAIL_SERVER_PORT=587
EMAIL_SERVER_USER=your-email@gmail.com
EMAIL_SERVER_PASSWORD=your-app-password
EMAIL_FROM=noreply@weddinglk.com
```

### 2. Google OAuth Setup

1. Go to [Google Cloud Console](https://console.cloud.google.com/)
2. Create a new project or select existing
3. Enable Google+ API
4. Create OAuth 2.0 credentials
5. Add authorized redirect URIs:
   - `https://your-domain.vercel.app/api/auth/callback/google`
   - `http://localhost:3000/api/auth/callback/google` (for development)

### 3. Email Service Setup (Optional)

For Gmail:
1. Enable 2-factor authentication
2. Generate App Password
3. Use App Password in `EMAIL_SERVER_PASSWORD`

## 📁 File Structure

```
lib/
├── auth/
│   └── nextauth-config.ts          # NextAuth configuration
├── middleware/
│   └── auth-middleware.ts           # Route protection middleware
├── services/
│   └── email-service.ts             # Email service
└── models/
    └── user.ts                     # User model with auth fields

app/
├── auth/
│   ├── signin/page.tsx             # Sign in page
│   ├── signup/page.tsx             # Sign up page
│   ├── forgot-password/page.tsx     # Password reset request
│   ├── reset-password/page.tsx     # Password reset form
│   └── verify-email/page.tsx       # Email verification
├── api/auth/
│   ├── [...nextauth]/route.ts      # NextAuth API routes
│   ├── register/route.ts            # User registration
│   ├── forgot-password/route.ts     # Password reset request
│   ├── reset-password/route.ts      # Password reset
│   ├── verify-email/route.ts        # Email verification
│   └── send-verification/route.ts  # Resend verification
└── admin/
    └── users/page.tsx              # Admin user management

components/
├── molecules/
│   └── logout-button.tsx           # User dropdown with logout
└── organisms/
    └── header.tsx                  # Updated with auth state
```

## 🔧 API Endpoints

### Authentication

| Method | Endpoint | Description |
|--------|----------|-------------|
| POST | `/api/auth/register` | Register new user |
| POST | `/api/auth/forgot-password` | Request password reset |
| POST | `/api/auth/reset-password` | Reset password with token |
| POST | `/api/auth/verify-email` | Verify email with token |
| POST | `/api/auth/send-verification` | Resend verification email |

### Admin

| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/api/admin/users` | Get all users (Admin only) |
| PATCH | `/api/admin/users/[id]` | Update user (Admin only) |
| DELETE | `/api/admin/users/[id]` | Suspend user (Admin only) |

## 🛡️ Middleware Usage

### Route Protection

```typescript
import { withAuth, withAdmin, withRole } from '@/lib/middleware/auth-middleware';

// Require authentication
export const GET = withAuth(async (req) => {
  // req.user is available
  return NextResponse.json({ user: req.user });
});

// Require admin role
export const POST = withAdmin(async (req) => {
  // Only admins can access
  return NextResponse.json({ message: 'Admin action' });
});

// Require specific roles
export const PUT = withRole(['vendor', 'admin'])(async (req) => {
  // Only vendors and admins can access
  return NextResponse.json({ message: 'Vendor/Admin action' });
});
```

### Client-Side Protection

```typescript
import { useSession } from 'next-auth/react';
import { useRouter } from 'next/navigation';

export default function ProtectedPage() {
  const { data: session, status } = useSession();
  const router = useRouter();

  useEffect(() => {
    if (status === 'loading') return;
    if (!session) {
      router.push('/auth/signin');
      return;
    }
  }, [session, status, router]);

  if (status === 'loading') {
    return <div>Loading...</div>;
  }

  if (!session) {
    return null;
  }

  return <div>Protected content</div>;
}
```

## 👥 User Roles

### Role Hierarchy

1. **User** - Basic wedding planning features
2. **Vendor** - Business listing and management
3. **Wedding Planner** - Professional planning services
4. **Admin** - Full system access
5. **Maintainer** - System maintenance (same as admin)

### Role-Specific Features

- **Users**: Dashboard, planning tools, vendor search
- **Vendors**: Business profile, package management, bookings
- **Wedding Planners**: Client management, portfolio, scheduling
- **Admins**: User management, system settings, analytics

## 📧 Email Templates

### Password Reset Email
- Professional HTML template
- Secure reset link (1-hour expiration)
- Clear instructions and branding

### Email Verification
- Welcome message with platform benefits
- Verification link (24-hour expiration)
- Feature highlights

### Welcome Email
- Personalized greeting
- Role-specific onboarding
- Dashboard access link

## 🔒 Security Features

### Password Security
- Minimum 8 characters
- bcrypt hashing (12 rounds)
- Password reset tokens
- Account lockout after failed attempts

### Session Security
- JWT tokens with expiration
- Secure HTTP-only cookies
- CSRF protection
- Session invalidation on logout

### Email Security
- Verification required for new accounts
- Secure token generation
- Token expiration
- Rate limiting on email sends

## 🚀 Deployment

### Vercel Configuration

The system is configured for Vercel deployment with:

```json
{
  "env": {
    "MONGODB_URI": "@mongodb-uri",
    "NEXTAUTH_SECRET": "@nextauth-secret",
    "GOOGLE_CLIENT_ID": "@google-client-id",
    "GOOGLE_CLIENT_SECRET": "@google-client-secret"
  }
}
```

### Environment Variables

Set these in Vercel dashboard:

1. `MONGODB_URI` - MongoDB Atlas connection string
2. `NEXTAUTH_SECRET` - Random secret for JWT signing
3. `GOOGLE_CLIENT_ID` - Google OAuth client ID
4. `GOOGLE_CLIENT_SECRET` - Google OAuth client secret
5. `EMAIL_SERVER_*` - Email service credentials (optional)

## 🧪 Testing

### Test User Creation

```bash
# Create test user via API
curl -X POST https://your-domain.vercel.app/api/auth/register \
  -H "Content-Type: application/json" \
  -d '{
    "firstName": "Test",
    "lastName": "User",
    "email": "test@example.com",
    "password": "password123",
    "role": "user"
  }'
```

### Password Reset Test

```bash
# Request password reset
curl -X POST https://your-domain.vercel.app/api/auth/forgot-password \
  -H "Content-Type: application/json" \
  -d '{"email": "test@example.com"}'
```

## 🔧 Troubleshooting

### Common Issues

1. **Google OAuth Not Working**
   - Check redirect URIs in Google Console
   - Verify client ID/secret in environment variables
   - Ensure Google+ API is enabled

2. **Email Not Sending**
   - Check email service credentials
   - Verify SMTP settings
   - Check spam folder

3. **Session Issues**
   - Verify NEXTAUTH_SECRET is set
   - Check NEXTAUTH_URL matches deployment
   - Clear browser cookies

4. **Database Connection**
   - Verify MONGODB_URI is correct
   - Check MongoDB Atlas IP whitelist
   - Ensure database user has proper permissions

### Debug Mode

Enable debug mode in development:

```bash
NODE_ENV=development
```

This will show detailed NextAuth logs and return tokens in API responses for testing.

## 📚 Additional Resources

- [NextAuth.js Documentation](https://next-auth.js.org/)
- [Google OAuth Setup](https://developers.google.com/identity/protocols/oauth2)
- [MongoDB Atlas Setup](https://docs.atlas.mongodb.com/)
- [Vercel Environment Variables](https://vercel.com/docs/concepts/projects/environment-variables)

## 🎯 Next Steps

### Planned Features

1. **Two-Factor Authentication (2FA)**
   - SMS-based 2FA
   - Authenticator app support
   - Backup codes

2. **Advanced Security**
   - Device management
   - Login history
   - Suspicious activity detection

3. **Social Login Expansion**
   - Facebook login
   - Apple Sign-In
   - LinkedIn integration

4. **Admin Enhancements**
   - Bulk user operations
   - Advanced filtering
   - User analytics

---

**Production URL**: https://wedding-9x5op5u4o-asithalkonaras-projects.vercel.app

**Status**: ✅ Fully Deployed and Functional
