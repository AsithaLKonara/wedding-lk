import { NextRequest, NextResponse } from 'next/server';
import { getToken } from 'next-auth/jwt';
import { connectDB } from '@/lib/db';
import { User } from '@/lib/models/user';

export async function GET(request: NextRequest) {
  try {
    console.log('🔍 Debug Auth API called');
    
    // Test database connection
    console.log('🔌 Testing database connection...');
    await connectDB();
    console.log('✅ Database connected');
    
    // Get JWT token
    const token = await getToken({ 
      req: request,
      secret: process.env.NEXTAUTH_SECRET 
    });
    
    console.log('🔑 Token status:', token ? 'present' : 'missing');
    console.log('🔑 Token details:', token ? {
      email: token.email,
      role: token.role,
      userId: token.userId,
      name: token.name
    } : 'No token');
    
    // Test user query
    const userCount = await User.countDocuments();
    console.log(`📊 Total users: ${userCount}`);
    
    // Get sample users
    const sampleUsers = await User.find({}).limit(3).select('name email role isActive status').lean();
    console.log('👥 Sample users:', sampleUsers);
    
    // Test role-based access
    const roleTests = {
      admin: await User.countDocuments({ role: 'admin' }),
      vendor: await User.countDocuments({ role: 'vendor' }),
      wedding_planner: await User.countDocuments({ role: 'wedding_planner' }),
      user: await User.countDocuments({ role: 'user' })
    };
    
    console.log('🎭 Role distribution:', roleTests);
    
    return NextResponse.json({
      success: true,
      message: 'Debug auth successful',
      data: {
        database: {
          connected: true,
          userCount,
          sampleUsers
        },
        authentication: {
          hasToken: !!token,
          tokenDetails: token ? {
            email: token.email,
            role: token.role,
            userId: token.userId,
            name: token.name
          } : null
        },
        roles: roleTests,
        environment: {
          NEXTAUTH_URL: process.env.NEXTAUTH_URL,
          NEXTAUTH_SECRET: process.env.NEXTAUTH_SECRET ? 'Set' : 'Not set',
          MONGODB_URI: process.env.MONGODB_URI ? 'Set' : 'Not set'
        }
      }
    });
    
  } catch (error) {
    console.error('❌ Debug auth failed:', error);
    return NextResponse.json({
      success: false,
      error: error instanceof Error ? error.message : 'Unknown error',
      stack: error instanceof Error ? error.stack : undefined
    }, { status: 500 });
  }
}

