import NextAuth from 'next-auth';
import CredentialsProvider from 'next-auth/providers/credentials';
import LocalAuthService from '@/lib/local-auth-service';

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
          // Authenticate using local database
          const user = await LocalAuthService.authenticateUser(
            credentials.email,
            credentials.password
          );

          if (user) {
            console.log('✅ User authenticated:', user.email, 'Role:', user.role);
            return {
              id: user.id,
              email: user.email,
              name: user.name,
              role: user.role,
              image: null,
            };
          }

          console.log('❌ Authentication failed for:', credentials.email);
          return null;
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
    async jwt({ token, user }) {
      if (user) {
        token.role = user.role;
        token.userId = user.id;
      }
      return token;
    },
    
    async session({ session, token }) {
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