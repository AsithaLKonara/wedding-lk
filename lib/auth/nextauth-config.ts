import type { NextAuthOptions } from "next-auth";
import { getServerSession } from "next-auth";
import GoogleProvider from "next-auth/providers/google";
import CredentialsProvider from "next-auth/providers/credentials";
import { connectDB } from "@/lib/db";
import { User } from "@/lib/models/user";
import bcrypt from "bcryptjs";

// Get the correct URL based on environment
function getAuthUrl(): string {
  // Production URL - update this with your actual domain
  if (process.env.NODE_ENV === "production") {
    return process.env.NEXTAUTH_URL || "https://wedding-qf17jbjer-asithalkonaras-projects.vercel.app";
  }
  // Vercel preview deployments
  if (process.env.VERCEL_URL) {
    return `https://${process.env.VERCEL_URL}`;
  }
  // Local development
  return process.env.NEXTAUTH_URL || "http://localhost:3000";
}

export const authOptions: NextAuthOptions = {
  providers: [
    GoogleProvider({
      clientId: process.env.GOOGLE_CLIENT_ID || "dummy-client-id",
      clientSecret: process.env.GOOGLE_CLIENT_SECRET || "dummy-client-secret",
    }),
    CredentialsProvider({
      id: "credentials",
      name: "credentials",
      credentials: {
        email: { label: "Email", type: "email" },
        password: { label: "Password", type: "password" }
      },
      async authorize(credentials) {
        if (!credentials?.email || !credentials?.password) {
          return null;
        }

        try {
          await connectDB();
          const user = await User.findOne({ email: credentials.email });
          
          if (!user || !user.password) {
            return null;
          }

          const isPasswordValid = await bcrypt.compare(credentials.password, user.password || '');
          
          if (!isPasswordValid) {
            return null;
          }

          return {
            id: user._id.toString(),
            email: user.email,
            name: user.name,
            role: user.role,
            image: user.avatar,
          };
        } catch (error) {
          console.error("Auth error:", error);
          // Return a test user for development
          if (process.env.NODE_ENV === 'development') {
            return {
              id: 'test-user-id',
              email: credentials.email,
              name: 'Test User',
              role: 'user',
              image: null,
            };
          }
          return null;
        }
      }
    })
  ],
  session: {
    strategy: "jwt",
    maxAge: 30 * 24 * 60 * 60, // 30 days
  },
  callbacks: {
    async jwt({ token, user, account }: any) {
      // Initial sign in
      if (account && user) {
        token.role = user.role;
        token.id = user.id;
        token.accessToken = account.access_token;
      }
      
      // Refresh user data from database
      if (token.id) {
        try {
          await connectDB();
          const dbUser = await User.findById(token.id);
          if (dbUser) {
            token.role = dbUser.role;
            token.name = dbUser.name;
            token.email = dbUser.email;
            token.image = dbUser.avatar;
          }
        } catch (error) {
          console.error("JWT callback error:", error);
        }
      }
      
      return token;
    },
    async session({ session, token }: any) {
      if (token) {
        session.user.id = token.id as string;
        session.user.role = token.role as string;
        session.user.name = token.name as string;
        session.user.email = token.email as string;
        session.user.image = token.image as string;
        session.accessToken = token.accessToken;
      }
      return session;
    },
    async redirect({ url, baseUrl }: any) {
      // Handle redirects properly for Vercel
      if (url.startsWith("/")) {
        return `${baseUrl}${url}`;
      }
      if (url.startsWith(baseUrl)) {
        return url;
      }
      return baseUrl;
    },
    async signIn({ user, account, profile }: any) {
      // Handle Google OAuth sign in
      if (account?.provider === "google") {
        try {
          await connectDB();
          
          // Check if user exists
          const existingUser = await User.findOne({ email: user.email });
          
          if (!existingUser) {
            // Create new user from Google profile
            const newUser = new User({
              name: user.name,
              email: user.email,
              avatar: user.image,
              role: 'user',
              status: 'active',
              isVerified: true,
              isActive: true,
              isEmailVerified: true,
              socialAccounts: [{
                provider: 'google',
                providerId: account.providerAccountId,
                accessToken: account.access_token,
                refreshToken: account.refresh_token,
                expiresAt: account.expires_at ? new Date(account.expires_at * 1000) : undefined,
                scope: account.scope,
                idToken: account.id_token,
                linkedAt: new Date(),
                lastUsed: new Date()
              }]
            });
            
            await newUser.save();
            user.id = newUser._id.toString();
            user.role = 'user';
          } else {
            // Update existing user's social account info
            const socialAccountIndex = existingUser.socialAccounts.findIndex(
              (sa: any) => sa.provider === 'google'
            );
            
            if (socialAccountIndex >= 0) {
              existingUser.socialAccounts[socialAccountIndex] = {
                provider: 'google',
                providerId: account.providerAccountId,
                accessToken: account.access_token,
                refreshToken: account.refresh_token,
                expiresAt: account.expires_at ? new Date(account.expires_at * 1000) : undefined,
                scope: account.scope,
                idToken: account.id_token,
                linkedAt: existingUser.socialAccounts[socialAccountIndex].linkedAt,
                lastUsed: new Date()
              };
            } else {
              existingUser.socialAccounts.push({
                provider: 'google',
                providerId: account.providerAccountId,
                accessToken: account.access_token,
                refreshToken: account.refresh_token,
                expiresAt: account.expires_at ? new Date(account.expires_at * 1000) : undefined,
                scope: account.scope,
                idToken: account.id_token,
                linkedAt: new Date(),
                lastUsed: new Date()
              });
            }
            
            await existingUser.save();
            user.id = existingUser._id.toString();
            user.role = existingUser.role;
          }
          
          return true;
        } catch (error) {
          console.error("Google sign in error:", error);
          return false;
        }
      }
      
      return true;
    }
  },
  pages: {
    signIn: "/auth/signin",
    signUp: "/auth/signup",
    error: "/auth/error",
  },
  secret: process.env.NEXTAUTH_SECRET || "fallback-secret-for-development",
  debug: process.env.NODE_ENV === "development",
};

// Export the URL for use in other parts of the app
export const authUrl = getAuthUrl();

// Export getServerSession for use in API routes
export { getServerSession };
