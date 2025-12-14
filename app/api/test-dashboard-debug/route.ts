import { NextRequest, NextResponse } from 'next/server';
import { connectDB } from '@/lib/db';
import { User } from '@/lib/models/user';
import { getUserFromRequest } from '@/lib/auth/get-user-from-request';

export async function GET(request: NextRequest) {
  try {
    console.log('🔍 Testing dashboard debug...');
    
    await connectDB();
    
    // Get authentication user
    const authUser = getUserFromRequest(request);
    
    console.log('🔑 Auth status:', authUser ? 'authenticated' : 'not authenticated');
    console.log('🔑 User details:', authUser ? {
      email: authUser.email,
      role: authUser.role,
      id: authUser.id,
      name: authUser.name
    } : 'No user');
    
    if (!authUser) {
      return NextResponse.json({
        success: false,
        error: 'No authentication token found',
        message: 'Please login first',
        debug: {
          isAuthenticated: false,
          sessionRequired: true
        }
      }, { status: 401 });
    }
    
    // Get user from database
    const user = await User.findById(authUser.id).select('name email role isActive status');
    
    if (!user) {
      return NextResponse.json({
        success: false,
        error: 'User not found in database',
        debug: {
          isAuthenticated: true,
          userId: authUser.id,
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
      isAuthenticated: !!authUser,
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
        auth: {
          email: authUser.email,
          role: authUser.role,
          id: authUser.id,
          name: authUser.name
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
          shouldLogin: !authUser,
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

