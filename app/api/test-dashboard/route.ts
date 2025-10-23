import { NextRequest, NextResponse } from 'next/server';
// Removed NextAuth - using custom auth
import { connectDB } from '@/lib/db';
import { User } from '@/lib/models/user';

export async function GET(request: NextRequest) {
  try {
    console.log('🔍 Testing dashboard access...');
    
    await connectDB();
    
    // Get JWT token
    const token = await getToken({ 
      req: request,
      secret: process.env.NEXTAUTH_SECRET 
    });
    
    if (!token) {
      return NextResponse.json({
        success: false,
        error: 'No authentication token found',
        message: 'Please login first'
      }, { status: 401 });
    }
    
    console.log('🔑 Token found:', {
      email: token.email,
      role: token.role,
      userId: token.userId
    });
    
    // Get user from database
    const user = await User.findById(token.userId).select('name email role isActive status');
    
    if (!user) {
      return NextResponse.json({
        success: false,
        error: 'User not found in database',
        token: {
          email: token.email,
          role: token.role,
          userId: token.userId
        }
      }, { status: 404 });
    }
    
    console.log('👤 User found:', {
      id: user._id,
      name: user.name,
      email: user.email,
      role: user.role,
      isActive: user.isActive,
      status: user.status
    });
    
    // Test role-based access
    const roleTests = {
      canAccessAdmin: user.role === 'admin',
      canAccessVendor: user.role === 'vendor',
      canAccessPlanner: user.role === 'wedding_planner',
      canAccessUser: user.role === 'user',
      isActive: user.isActive,
      isVerified: user.status === 'active'
    };
    
    // Determine dashboard route
    let dashboardRoute = '/dashboard';
    switch (user.role) {
      case 'admin':
        dashboardRoute = '/dashboard/admin';
        break;
      case 'vendor':
        dashboardRoute = '/dashboard/vendor';
        break;
      case 'wedding_planner':
        dashboardRoute = '/dashboard/planner';
        break;
      case 'user':
        dashboardRoute = '/dashboard/user';
        break;
      default:
        dashboardRoute = '/dashboard';
    }
    
    // Test middleware logic
    const middlewareTests = {
      shouldRedirectToLogin: !token,
      shouldRedirectToUnauthorized: false,
      hasValidRole: ['admin', 'vendor', 'wedding_planner', 'user'].includes(user.role),
      isActiveUser: user.isActive && user.status === 'active'
    };
    
    return NextResponse.json({
      success: true,
      message: 'Dashboard access test successful',
      data: {
        user: {
          id: user._id,
          name: user.name,
          email: user.email,
          role: user.role,
          isActive: user.isActive,
          status: user.status
        },
        token: {
          email: token.email,
          role: token.role,
          userId: token.userId,
          name: token.name
        },
        roleTests,
        dashboardRoute,
        middlewareTests,
        recommendations: {
          canAccessDashboard: middlewareTests.hasValidRole && middlewareTests.isActiveUser,
          shouldLogin: !token,
          shouldActivateAccount: !user.isActive || user.status !== 'active',
          correctDashboardRoute: dashboardRoute
        }
      }
    });
    
  } catch (error) {
    console.error('❌ Dashboard test failed:', error);
    return NextResponse.json({
      success: false,
      error: error instanceof Error ? error.message : 'Unknown error',
      stack: error instanceof Error ? error.stack : undefined
    }, { status: 500 });
  }
}

