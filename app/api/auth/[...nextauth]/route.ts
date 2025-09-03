import NextAuth from 'next-auth';
import GoogleProvider from 'next-auth/providers/google';
import FacebookProvider from 'next-auth/providers/facebook';
import CredentialsProvider from 'next-auth/providers/credentials';
import { connectDB } from '@/lib/db';
import bcrypt from 'bcryptjs';
import mongoose from 'mongoose';

const providers = [];

// Add Google provider only if credentials are available
if (process.env.GOOGLE_CLIENT_ID && process.env.GOOGLE_CLIENT_SECRET) {
  providers.push(
    GoogleProvider({
      clientId: process.env.GOOGLE_CLIENT_ID,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET,
      authorization: {
        params: {
          scope: 'openid email profile',
        },
      },
    })
  );
}

// Add Facebook provider only if credentials are available
if (process.env.FACEBOOK_CLIENT_ID && process.env.FACEBOOK_CLIENT_SECRET) {
  providers.push(
    FacebookProvider({
      clientId: process.env.FACEBOOK_CLIENT_ID,
      clientSecret: process.env.FACEBOOK_CLIENT_SECRET,
    })
  );
}

console.log('🔧 NextAuth Configuration Starting...');
console.log('📋 Available providers:', providers.length);
console.log('🌍 Environment check:', {
  NODE_ENV: process.env.NODE_ENV,
  NEXTAUTH_URL: process.env.NEXTAUTH_URL,
  NEXTAUTH_SECRET: process.env.NEXTAUTH_SECRET ? 'Set' : 'Missing',
  MONGODB_URI: process.env.MONGODB_URI ? 'Set' : 'Missing'
});

const authOptions = {
  secret: process.env.NEXTAUTH_SECRET,
  providers: [
    ...providers,
    
    // Traditional credentials provider
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
          passwordLength: credentials?.password?.length,
          hasEmail: !!credentials?.email,
          hasPassword: !!credentials?.password
        });

        if (!credentials?.email || !credentials?.password) {
          console.log('❌ Missing credentials - returning null');
          return null;
        }

        try {
          console.log('🔌 Step 1: Attempting to connect to database...');
          const dbConnection = await connectDB();
          
          if (!dbConnection) {
            console.log('❌ Step 1: Database connection failed - authentication cannot proceed');
            return null;
          }
          
          console.log('✅ Step 1: Database connected successfully');

          console.log('🔍 Step 2: Looking for user:', credentials.email);
          
          // Create User model directly to avoid import issues
          const UserSchema = new mongoose.Schema({
            name: { type: String, required: true },
            email: { type: String, required: true, unique: true, lowercase: true, trim: true },
            password: { type: String, required: true },
            role: { type: String, enum: ['user', 'vendor', 'wedding_planner', 'admin', 'maintainer'], default: 'user' },
            isEmailVerified: { type: Boolean, default: true },
            isActive: { type: Boolean, default: true },
            isVerified: { type: Boolean, default: true },
            status: { type: String, enum: ['active', 'inactive', 'suspended', 'pending_verification'], default: 'active' },
            location: {
              country: { type: String, default: 'Sri Lanka' },
              state: { type: String, default: 'Western Province' },
              city: { type: String, default: 'Colombo' }
            },
            preferences: {
              language: { type: String, default: 'en' },
              currency: { type: String, default: 'LKR' },
              timezone: { type: String, default: 'Asia/Colombo' },
              notifications: {
                email: { type: Boolean, default: true },
                sms: { type: Boolean, default: false },
                push: { type: Boolean, default: true }
              },
              marketing: {
                email: { type: Boolean, default: false },
                sms: { type: Boolean, default: false },
                push: { type: Boolean, default: false }
              }
            },
            lastActiveAt: { type: Date, default: Date.now }
          }, { timestamps: true });
          
          const User = mongoose.models.User || mongoose.model('User', UserSchema);
          const user = await User.findOne({ email: credentials.email }).maxTimeMS(10000);
          
          if (!user) {
            console.log('❌ Step 2: User not found:', credentials.email);
            return null;
          }

          console.log('✅ Step 2: User found:', {
            id: user._id,
            email: user.email,
            name: user.name,
            role: user.role,
            hasPassword: !!user.password,
            passwordLength: user.password?.length
          });

          console.log('🔑 Step 3: Checking password...');
          const isValidPassword = await bcrypt.compare(credentials.password, user.password);
          
          if (!isValidPassword) {
            console.log('❌ Step 3: Invalid password for user:', credentials.email);
            return null;
          }

          console.log('✅ Step 3: Password is valid');
          console.log('🎉 Step 4: Authentication successful for user:', credentials.email);
          
          const userObject = {
            id: user._id.toString(),
            email: user.email,
            name: user.name,
            role: user.role,
            image: user.avatar || null,
          };
          
          console.log('👤 Step 4: Returning user object:', userObject);
          return userObject;
        } catch (error) {
          console.error('💥 CRITICAL ERROR in authorize function:', error);
          console.error('📊 Error details:', {
            message: error.message,
            stack: error.stack,
            name: error.name
          });
          
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
    error: '/login', // Redirect back to login page instead of error page
  },
  
  callbacks: {
    async signIn(params: any) {
      const { user, account, profile } = params;
      console.log('🔄 SIGNIN CALLBACK TRIGGERED');
      console.log('📋 SignIn params:', { 
        userEmail: user?.email, 
        provider: account?.provider,
        accountType: account?.type,
        hasUser: !!user,
        hasAccount: !!account
      });
      
      try {
        // Handle social login
        if (account?.provider !== 'credentials' && account) {
          console.log(`🌐 Social login: ${user.email} via ${account.provider}`);
          
          // Check if user exists, if not create with default role 'user' (wedding couple)
          try {
            const dbConnection = await connectDB();
            if (!dbConnection) {
              console.log('❌ Database connection failed during social login');
              return false;
            }
            
            // Create User model for social login
            const UserSchema = new mongoose.Schema({
              name: { type: String, required: true },
              email: { type: String, required: true, unique: true, lowercase: true, trim: true },
              password: { type: String },
              role: { type: String, enum: ['user', 'vendor', 'wedding_planner', 'admin', 'maintainer'], default: 'user' },
              isEmailVerified: { type: Boolean, default: true },
              isActive: { type: Boolean, default: true },
              isVerified: { type: Boolean, default: true },
              status: { type: String, enum: ['active', 'inactive', 'suspended', 'pending_verification'], default: 'active' },
              location: {
                country: { type: String, default: 'Sri Lanka' },
                state: { type: String, default: 'Western Province' },
                city: { type: String, default: 'Colombo' }
              },
              preferences: {
                language: { type: String, default: 'en' },
                currency: { type: String, default: 'LKR' },
                timezone: { type: String, default: 'Asia/Colombo' },
                notifications: {
                  email: { type: Boolean, default: true },
                  sms: { type: Boolean, default: false },
                  push: { type: Boolean, default: true }
                },
                marketing: {
                  email: { type: Boolean, default: false },
                  sms: { type: Boolean, default: false },
                  push: { type: Boolean, default: false }
                }
              },
              lastActiveAt: { type: Date, default: Date.now }
            }, { timestamps: true });
            
            const User = mongoose.models.User || mongoose.model('User', UserSchema);
            const existingUser = await User.findOne({ email: user.email }).maxTimeMS(5000);
            
            if (!existingUser) {
              console.log('👤 Creating new user for social login...');
              // Create new user with default role 'user' (wedding couple)
              const newUser = new User({
                name: user.name,
                email: user.email,
                role: 'user', // Default to wedding couple for social logins
                isEmailVerified: true,
                isActive: true,
                isVerified: true,
                status: 'active',
                location: {
                  country: 'Sri Lanka',
                  state: '',
                  city: ''
                },
                preferences: {
                  language: 'en',
                  currency: 'LKR',
                  timezone: 'Asia/Colombo',
                  notifications: {
                    email: true,
                    sms: false,
                    push: true,
                  },
                  marketing: {
                    email: false,
                    sms: false,
                    push: false,
                  },
                },
              });
              
              await newUser.save();
              console.log(`✅ New user created via social login: ${user.email} with role: user`);
            } else {
              console.log('👤 Existing user found for social login:', user.email);
            }
          } catch (dbError) {
            console.error('💥 Database error during social login:', dbError);
            return false;
          }
          
          console.log('✅ Social login successful');
          return true;
        }
        
        // Handle credentials login - if we reach here, the authorize function already validated
        console.log('🔐 Credentials login successful for:', user.email);
        console.log('👤 User object in signIn:', {
          id: user.id,
          email: user.email,
          name: user.name,
          role: user.role
        });
        return true;
      } catch (error) {
        console.error('💥 CRITICAL ERROR in signIn callback:', error);
        console.error('📊 SignIn error details:', {
          message: error.message,
          stack: error.stack,
          name: error.name
        });
        return false;
      }
    },
    
        async jwt(params: any) {
      const { token, user, account } = params;
      console.log('🎫 JWT CALLBACK TRIGGERED');
      console.log('📋 JWT params:', {
        hasToken: !!token,
        hasUser: !!user,
        hasAccount: !!account,
        userEmail: user?.email,
        provider: account?.provider
      });
      
      try {
        // Add custom claims to JWT
        if (user) {
          console.log('👤 Adding user data to JWT token');
          token.role = user.role;
          token.userId = user.id;
          token.provider = account?.provider;
          console.log('✅ JWT token updated with user data:', {
            role: token.role,
            userId: token.userId,
            provider: token.provider
          });
        }
        
        // Set default values
        if (!token.role) {
          console.log('🔧 Setting default role to user');
          token.role = 'user';
        }
        if (!token.isVerified) {
          console.log('🔧 Setting default isVerified to true');
          token.isVerified = true;
        }
        if (!token.isActive) {
          console.log('🔧 Setting default isActive to true');
          token.isActive = true;
        }
        
        console.log('🎫 Final JWT token:', {
          role: token.role,
          userId: token.userId,
          provider: token.provider,
          isVerified: token.isVerified,
          isActive: token.isActive
        });
        
        return token;
      } catch (error) {
        console.error('💥 CRITICAL ERROR in JWT callback:', error);
        console.error('📊 JWT error details:', {
          message: error.message,
          stack: error.stack,
          name: error.name
        });
        return token;
      }
    },
    
        async session(params: any) {
      const { session, token } = params;
      console.log('📱 SESSION CALLBACK TRIGGERED');
      console.log('📋 Session params:', {
        hasSession: !!session,
        hasToken: !!token,
        sessionUser: session?.user?.email,
        tokenUserId: token?.userId,
        tokenRole: token?.role
      });
      
      try {
        // Add custom data to session
        if (token && session.user) {
          console.log('👤 Adding token data to session');
          (session.user as any).id = token.userId as string;
          (session.user as any).role = token.role as string;
          (session.user as any).provider = token.provider as string;
          (session.user as any).isVerified = token.isVerified as boolean;
          (session.user as any).isActive = token.isActive as boolean;
          
          console.log('✅ Session updated with user data:', {
            id: (session.user as any).id,
            role: (session.user as any).role,
            provider: (session.user as any).provider,
            isVerified: (session.user as any).isVerified,
            isActive: (session.user as any).isActive
          });
        } else {
          console.log('⚠️ Missing token or session.user data');
        }
        
        console.log('📱 Final session object:', {
          user: session.user,
          expires: session.expires
        });
        
        return session;
      } catch (error) {
        console.error('💥 CRITICAL ERROR in session callback:', error);
        console.error('📊 Session error details:', {
          message: error.message,
          stack: error.stack,
          name: error.name
        });
        return session;
      }
    },
  },
  
  events: {
    async signIn(message: any) {
      const { user, account, profile, isNewUser } = message;
      console.log('🎉 SIGNIN EVENT TRIGGERED');
      console.log('📋 SignIn event details:', {
        userEmail: user?.email,
        provider: account?.provider,
        isNewUser: isNewUser,
        hasProfile: !!profile
      });
      console.log(`✅ User signed in: ${user.email} via ${account?.provider}`);
      if (isNewUser) {
        console.log(`🆕 New user created: ${user.email}`);
      }
    },
    
    async signOut(message: any) {
      const { session } = message;
      console.log('👋 SIGNOUT EVENT TRIGGERED');
      console.log('📋 SignOut event details:', {
        sessionUser: session?.user?.email,
        hasSession: !!session
      });
      console.log(`👋 User signed out: ${session?.user?.email}`);
    },
  },
  
  debug: true, // Enable debug mode to see detailed logs
};

console.log('🚀 Creating NextAuth handler...');
const handler = NextAuth(authOptions);
console.log('✅ NextAuth handler created successfully');

export { handler as GET, handler as POST, authOptions }; 