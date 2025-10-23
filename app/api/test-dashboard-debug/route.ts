import { NextRequest, NextResponse } from 'next/server';
// Removed NextAuth - using custom auth
import { connectDB } from '@/lib/db';
import { User } from '@/lib/models/user';

export async function GET(request: NextRequest) {
  try {
    console.log('🔍 Testing dashboard debug...');
    
    await connectDB();
    
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
    
    if (!token) {
      return NextResponse.json({
        success: false,
        error: 'No authentication token found',
        message: 'Please login first',
        debug: {
          hasToken: false,
          sessionRequired: true
        }
      }, { status: 401 });
    }
    
    // Get user from database
    const user = await User.findById(token.userId).select('name email role isActive status');
    
    if (!user) {
      return NextResponse.json({
        success: false,
        error: 'User not found in database',
        debug: {
          hasToken: true,
          tokenUserId: token.userId,
          userFound: false
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
    
    // Test role-based navigation
    const navigationItems = [
      { title: "Dashboard", href: "/dashboard", roles: ["user", "vendor", "wedding_planner", "admin"] },
      { title: "Profile", href: "/dashboard/profile", roles: ["user", "vendor", "wedding_planner", "admin"] },
      { title: "Planning", href: "/dashboard/planning", roles: ["user"] },
      { title: "Favorites", href: "/dashboard/favorites", roles: ["user"] },
      { title: "Services", href: "/dashboard/vendor/services", roles: ["vendor"] },
      { title: "Boost Campaigns", href: "/dashboard/vendor/boost-campaigns", roles: ["vendor"] },
      { title: "Tasks", href: "/dashboard/planner/tasks", roles: ["wedding_planner"] },
      { title: "Clients", href: "/dashboard/planner/clients", roles: ["wedding_planner"] },
      { title: "Bookings", href: "/dashboard/bookings", roles: ["vendor", "wedding_planner"] },
      { title: "Messages", href: "/dashboard/messages", roles: ["vendor", "wedding_planner", "user"] },
      { title: "Payments", href: "/dashboard/payments", roles: ["vendor", "wedding_planner", "user"] },
      { title: "Admin Dashboard", href: "/dashboard/admin", roles: ["admin"] },
      { title: "User Management", href: "/dashboard/admin/users", roles: ["admin"] },
      { title: "Vendor Management", href: "/dashboard/admin/vendors", roles: ["admin"] },
      { title: "Reports & Analytics", href: "/dashboard/admin/reports", roles: ["admin"] },
      { title: "System Settings", href: "/dashboard/admin/settings", roles: ["admin"] },
      { title: "Settings", href: "/dashboard/settings", roles: ["user", "vendor", "wedding_planner", "admin"] }
    ];
    
    const filteredItems = navigationItems.filter(item => 
      item.roles.includes(user.role)
    );
    
    console.log('🎭 Filtered navigation items:', filteredItems.length);
    
    // Test dashboard access
    const dashboardTests = {
      canAccessDashboard: user.isActive && user.status === 'active',
      hasValidRole: ['admin', 'vendor', 'wedding_planner', 'user'].includes(user.role),
      sessionValid: !!token,
      userActive: user.isActive,
      userStatus: user.status
    };
    
    return NextResponse.json({
      success: true,
      message: 'Dashboard debug successful',
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
        navigation: {
          totalItems: navigationItems.length,
          filteredItems: filteredItems.length,
          availableItems: filteredItems.map(item => ({
            title: item.title,
            href: item.href,
            accessible: true
          }))
        },
        dashboardTests,
        recommendations: {
          canAccessDashboard: dashboardTests.canAccessDashboard,
          shouldLogin: !token,
          shouldActivateAccount: !user.isActive || user.status !== 'active',
          correctRole: dashboardTests.hasValidRole
        }
      }
    });
    
  } catch (error) {
    console.error('❌ Dashboard debug failed:', error);
    return NextResponse.json({
      success: false,
      error: error instanceof Error ? error.message : 'Unknown error',
      stack: error instanceof Error ? error.stack : undefined
    }, { status: 500 });
  }
}

