import { NextRequest, NextResponse } from 'next/server';
import { connectDB } from '@/lib/db';
import { User } from '@/lib/models/user';
import { getUserFromRequest } from '@/lib/auth/get-user-from-request';

export async function GET(request: NextRequest) {
  try {
    console.log('🔍 Testing dashboard access...');
    
    await connectDB();
    
    // Get authentication user
    const authUser = getUserFromRequest(request);
    
    if (!authUser) {
      return NextResponse.json({
        success: false,
        error: 'No authentication found',
        message: 'Please login first'
      }, { status: 401 });
    }
    
    console.log('🔑 User found:', {
      email: authUser.email,
      role: authUser.role,
      id: authUser.id
    });
    
    // Get user from database
    const user = await User.findById(authUser.id).select('name email role isActive status');
    
    if (!user) {
      return NextResponse.json({
        success: false,
        error: 'User not found in database',
        auth: {
          email: authUser.email,
          role: authUser.role,
          id: authUser.id
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
      shouldRedirectToLogin: !authUser,
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
        auth: {
          email: authUser.email,
          role: authUser.role,
          id: authUser.id,
          name: authUser.name
        },
        roleTests,
        dashboardRoute,
        middlewareTests,
        recommendations: {
          canAccessDashboard: middlewareTests.hasValidRole && middlewareTests.isActiveUser,
          shouldLogin: !authUser,
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

