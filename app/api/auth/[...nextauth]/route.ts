import NextAuth from 'next-auth';
import GoogleProvider from 'next-auth/providers/google';
import FacebookProvider from 'next-auth/providers/facebook';
import CredentialsProvider from 'next-auth/providers/credentials';
import { connectDB } from '@/lib/db';
import { User } from '@/lib/models/user';
import { handleSocialLogin, createUserFromSocialLogin, linkSocialAccount } from '@/lib/auth/social-login-handler';

const authOptions = {
  providers: [
    // Google OAuth Provider
    GoogleProvider({
      clientId: process.env.GOOGLE_CLIENT_ID!,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET!,
      authorization: {
        params: {
          scope: 'openid email profile',
        },
      },
    }),
    
    // Facebook OAuth Provider
    FacebookProvider({
      clientId: process.env.FACEBOOK_CLIENT_ID!,
      clientSecret: process.env.FACEBOOK_CLIENT_SECRET!,
    }),
    
    // Traditional credentials provider
    CredentialsProvider({
      name: 'credentials',
      credentials: {
        email: { label: 'Email', type: 'email' },
        password: { label: 'Password', type: 'password' },
      },
      async authorize(credentials) {
        if (credentials?.email && credentials?.password) {
          try {
            await connectDB();
            
            // Find user by email
            const user = await User.findOne({ email: credentials.email });
            
            if (user && user.password) {
              // In a real implementation, you would hash and compare passwords
              // For now, we'll use a simple check for development
              if (user.password === credentials.password) {
                return {
                  id: user._id.toString(),
                  email: user.email,
                  name: user.name,
                  role: user.role,
                  image: user.avatar,
                };
              }
            }
          } catch (error) {
            console.error('Credentials authentication error:', error);
          }
        }
        return null;
      },
    }),
  ],
  
  session: { 
    strategy: 'jwt' as const,
    maxAge: 30 * 24 * 60 * 60, // 30 days
  },
  
    pages: {
    signIn: '/auth/signin',
    error: '/auth/error',
  },
  
  callbacks: {
    async signIn(params: any) {
      const { user, account, profile } = params;
      try {
        // Handle social login
        if (account?.provider !== 'credentials' && account) {
          return await handleSocialLogin(user, account, profile);
        }
        
        // Handle credentials login
        return true;
      } catch (error) {
        console.error('SignIn callback error:', error);
        return false;
      }
    },
    
    async jwt(params: any) {
      const { token, user, account } = params;
      try {
        // Add custom claims to JWT
        if (user) {
          token.role = user.role;
          token.userId = user.id;
          token.provider = account?.provider;
        }
        
        // Refresh user data from database
        if (token.userId) {
          await connectDB();
          const dbUser = await User.findById(token.userId);
          if (dbUser) {
            token.role = dbUser.role;
            token.isVerified = dbUser.isVerified;
            token.isActive = dbUser.isActive;
          }
        }
        
        return token;
      } catch (error) {
        console.error('JWT callback error:', error);
        return token;
      }
    },
    
    async session(params: any) {
      const { session, token } = params;
      try {
        // Add custom data to session
        if (token && session.user) {
          (session.user as any).id = token.userId as string;
          (session.user as any).role = token.role as string;
          (session.user as any).provider = token.provider as string;
          (session.user as any).isVerified = token.isVerified as boolean;
          (session.user as any).isActive = token.isActive as boolean;
        }
        
        return session;
      } catch (error) {
        console.error('Session callback error:', error);
        return session;
      }
    },
  },
  
  events: {
    async signIn(message: any) {
      const { user, account, profile, isNewUser } = message;
      console.log(`✅ User signed in: ${user.email} via ${account?.provider}`);
      if (isNewUser) {
        console.log(`🆕 New user created: ${user.email}`);
      }
    },
    
    async signOut(message: any) {
      const { session } = message;
      console.log(`👋 User signed out: ${session?.user?.email}`);
    },
  },
  
  debug: process.env.NODE_ENV === 'development',
};

const handler = NextAuth(authOptions);
export { handler as GET, handler as POST, authOptions }; 