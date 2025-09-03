import NextAuth from 'next-auth';
import CredentialsProvider from 'next-auth/providers/credentials';

// Hardcoded credentials for testing - bypass database
const hardcodedUsers = [
  // Admins
  { email: 'admin1@wedding.lk', password: 'admin123', name: 'Admin 1', role: 'admin' },
  { email: 'admin2@wedding.lk', password: 'admin123', name: 'Admin 2', role: 'admin' },
  { email: 'admin3@wedding.lk', password: 'admin123', name: 'Admin 3', role: 'admin' },
  
  // Users (Wedding Couples)
  { email: 'user1@example.com', password: 'user123', name: 'User 1', role: 'user' },
  { email: 'user2@example.com', password: 'user123', name: 'User 2', role: 'user' },
  { email: 'user3@example.com', password: 'user123', name: 'User 3', role: 'user' },
  
  // Vendors
  { email: 'vendor1@example.com', password: 'vendor123', name: 'Vendor 1', role: 'vendor' },
  { email: 'vendor2@example.com', password: 'vendor123', name: 'Vendor 2', role: 'vendor' },
  { email: 'vendor3@example.com', password: 'vendor123', name: 'Vendor 3', role: 'vendor' },
  
  // Wedding Planners
  { email: 'planner1@example.com', password: 'planner123', name: 'Planner 1', role: 'wedding_planner' },
  { email: 'planner2@example.com', password: 'planner123', name: 'Planner 2', role: 'wedding_planner' },
  { email: 'planner3@example.com', password: 'planner123', name: 'Planner 3', role: 'wedding_planner' },
];

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

        // Check hardcoded credentials
        const hardcodedUser = hardcodedUsers.find(
          user => user.email === credentials.email && user.password === credentials.password
        );

        if (hardcodedUser) {
          console.log('✅ Hardcoded user found:', hardcodedUser.email, 'Role:', hardcodedUser.role);
          return {
            id: hardcodedUser.email,
            email: hardcodedUser.email,
            name: hardcodedUser.name,
            role: hardcodedUser.role,
            image: null,
          };
        }

        console.log('❌ User not found in hardcoded list:', credentials.email);
        return null;
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