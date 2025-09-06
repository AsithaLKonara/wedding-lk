import NextAuth from 'next-auth';
import CredentialsProvider from 'next-auth/providers/credentials';
import { connectDB } from '@/lib/db';
import { User } from '@/lib/models';
import bcrypt from 'bcryptjs';

const authOptions = {
  secret: process.env.NEXTAUTH_SECRET,
  providers: [
    CredentialsProvider({
      name: 'credentials',
      credentials: {
        email: { label: 'Email', type: 'email' },
        password: { label: 'Password', type: 'password' },
      },
      async authorize(credentials) {
        console.log('🔐 AUTHORIZE FUNCTION CALLED');
        console.log('📧 Credentials received:', {
          email: credentials?.email,
          hasEmail: !!credentials?.email,
          hasPassword: !!credentials?.password
        });

        if (!credentials?.email || !credentials?.password) {
          console.log('❌ Missing credentials - returning null');
          return null;
        }

        try {
          await connectDB();

          // Find user in MongoDB Atlas
          const user = await User.findOne({ email: credentials.email });
          
          if (!user) {
            console.log('❌ User not found:', credentials.email);
            return null;
          }

          // Check if user is active
          if (!user.isActive || user.status !== 'active') {
            console.log('❌ User account is inactive:', credentials.email);
            return null;
          }

          // Verify password
          const isPasswordValid = await user.comparePassword(credentials.password);
          
          if (!isPasswordValid) {
            console.log('❌ Invalid password for:', credentials.email);
            return null;
          }

          // Update last login
          await user.updateLastActive();

          console.log('✅ User authenticated:', user.email, 'Role:', user.role);
          return {
            id: user._id.toString(),
            email: user.email,
            name: user.name,
            role: user.role,
            image: user.avatar || null,
          };
        } catch (error) {
          console.error('❌ Authentication error:', error);
          return null;
        }
      },
    }),
  ],
  
  session: { 
    strategy: 'jwt' as const,
    maxAge: 30 * 24 * 60 * 60, // 30 days
  },
  
  pages: {
    signIn: '/login',
    error: '/login',
  },
  
  callbacks: {
    async jwt({ token, user }: { token: any; user: any }) {
      if (user) {
        token.role = user.role;
        token.userId = user.id;
      }
      return token;
    },
    
    async session({ session, token }: { session: any; token: any }) {
      if (token && session.user) {
        (session.user as any).id = token.userId as string;
        (session.user as any).role = token.role as string;
      }
      return session;
    },
  },
  
  debug: true,
};

const handler = NextAuth(authOptions);

export { handler as GET, handler as POST, authOptions };