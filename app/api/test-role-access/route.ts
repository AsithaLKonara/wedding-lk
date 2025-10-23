import { NextRequest, NextResponse } from 'next/server';
// Removed NextAuth - using custom auth
import { connectDB } from '@/lib/db';
import { User } from '@/lib/models/user';

export async function GET(request: NextRequest) {
  try {
    console.log('🔍 Testing role-based access...');
    
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
    
    // Get user from database
    const user = await User.findById(token.userId).select('name email role isActive status');
    
    if (!user) {
      return NextResponse.json({
        success: false,
        error: 'User not found in database'
      }, { status: 404 });
    }
    
    // Test all role-based routes
    const testRoutes = [
      { path: '/dashboard/admin', requiredRole: 'admin', description: 'Admin Dashboard' },
      { path: '/dashboard/vendor', requiredRole: 'vendor', description: 'Vendor Dashboard' },
      { path: '/dashboard/planner', requiredRole: 'wedding_planner', description: 'Planner Dashboard' },
      { path: '/dashboard/user', requiredRole: 'user', description: 'User Dashboard' },
      { path: '/api/dashboard/admin', requiredRole: 'admin', description: 'Admin API' },
      { path: '/api/dashboard/vendor', requiredRole: 'vendor', description: 'Vendor API' },
      { path: '/api/dashboard/planner', requiredRole: 'wedding_planner', description: 'Planner API' },
      { path: '/api/dashboard/user', requiredRole: 'user', description: 'User API' }
    ];
    
    const accessResults = testRoutes.map(route => ({
      path: route.path,
      description: route.description,
      requiredRole: route.requiredRole,
      userRole: user.role,
      hasAccess: user.role === route.requiredRole,
      isActive: user.isActive,
      status: user.status
    }));
    
    // Test middleware logic simulation
    const middlewareSimulation = {
      userRole: user.role,
      isAuthenticated: !!token,
      isActive: user.isActive && user.status === 'active',
      shouldRedirectToLogin: !token,
      shouldRedirectToUnauthorized: false,
      allowedRoutes: testRoutes.filter(route => user.role === route.requiredRole).map(route => route.path)
    };
    
    // Get all users with different roles for testing
    const allUsers = await User.find({}).select('name email role isActive status').lean();
    const roleDistribution = allUsers.reduce((acc, user) => {
      acc[user.role] = (acc[user.role] || 0) + 1;
      return acc;
    }, {} as Record<string, number>);
    
    return NextResponse.json({
      success: true,
      message: 'Role-based access test completed',
      data: {
        currentUser: {
          id: user._id,
          name: user.name,
          email: user.email,
          role: user.role,
          isActive: user.isActive,
          status: user.status
        },
        accessResults,
        middlewareSimulation,
        roleDistribution,
        recommendations: {
          canAccessDashboard: middlewareSimulation.isAuthenticated && middlewareSimulation.isActive,
          shouldLogin: !middlewareSimulation.isAuthenticated,
          shouldActivateAccount: !middlewareSimulation.isActive,
          correctDashboardRoute: middlewareSimulation.allowedRoutes[0] || '/dashboard'
        }
      }
    });
    
  } catch (error) {
    console.error('❌ Role access test failed:', error);
    return NextResponse.json({
      success: false,
      error: error instanceof Error ? error.message : 'Unknown error',
      stack: error instanceof Error ? error.stack : undefined
    }, { status: 500 });
  }
}

