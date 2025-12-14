'use client';

import { useState } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { 
  Home, 
  Users, 
  Building2, 
  Calendar, 
  Heart, 
  MessageSquare, 
  CreditCard, 
  Settings, 
  BarChart3, 
  Shield,
  FileText,
  Bell,
  Zap,
  Package,
  LogOut
} from 'lucide-react';

interface DashboardNavigationProps {
  userRole: string;
  unreadCount?: number;
  onLogout?: () => void;
}

interface NavigationItem {
  title: string;
  href: string;
  icon: React.ReactNode;
  badge?: string | number;
  description: string;
  roles: string[];
}

const navigationItems: NavigationItem[] = [
  // Common items for all users
  {
    title: 'Dashboard',
    href: '/dashboard',
    icon: <Home className="w-5 h-5" />,
    description: 'Overview of your account',
    roles: ['user', 'vendor', 'wedding_planner', 'admin', 'maintainer'],
  },
  {
    title: 'Profile',
    href: '/dashboard/profile',
    icon: <Users className="w-5 h-5" />,
    description: 'Manage your profile and settings',
    roles: ['user', 'vendor', 'wedding_planner', 'admin', 'maintainer'],
  },
  
  // User-specific items
  {
    title: 'Planning',
    href: '/dashboard/planning',
    icon: <Calendar className="w-5 h-5" />,
    description: 'Plan your wedding timeline',
    roles: ['user'],
  },
  {
    title: 'Favorites',
    href: '/dashboard/favorites',
    icon: <Heart className="w-5 h-5" />,
    description: 'Your saved vendors and venues',
    roles: ['user'],
  },
  
  // Vendor-specific items
  {
    title: 'Services',
    href: '/dashboard/vendor/services',
    icon: <Package className="w-5 h-5" />,
    description: 'Manage your services and pricing',
    roles: ['vendor'],
  },
  {
    title: 'Boost Campaigns',
    href: '/dashboard/vendor/boost-campaigns',
    icon: <Zap className="w-5 h-5" />,
    description: 'Manage your venue boost campaigns',
    roles: ['vendor'],
  },
  
  // Common business items
  {
    title: 'Bookings',
    href: '/dashboard/bookings',
    icon: <Calendar className="w-5 h-5" />,
    description: 'Manage your bookings and appointments',
    roles: ['vendor', 'wedding_planner'],
  },
  {
    title: 'Messages',
    href: '/dashboard/messages',
    icon: <MessageSquare className="w-5 h-5" />,
    description: 'Communicate with clients and vendors',
    roles: ['vendor', 'wedding_planner', 'user'],
  },
  {
    title: 'Payments',
    href: '/dashboard/payments',
    icon: <CreditCard className="w-5 h-5" />,
    description: 'View payment history and manage billing',
    roles: ['vendor', 'wedding_planner', 'user'],
  },
  
  // Admin items
  {
    title: 'Admin Dashboard',
    href: '/dashboard/admin',
    icon: <Shield className="w-5 h-5" />,
    description: 'Platform administration and management',
    roles: ['admin', 'maintainer'],
  },
  {
    title: 'User Management',
    href: '/dashboard/admin/users',
    icon: <Users className="w-5 h-5" />,
    description: 'Manage all users and roles',
    roles: ['admin', 'maintainer'],
  },
  {
    title: 'Vendor Management',
    href: '/dashboard/admin/vendors',
    icon: <Building2 className="w-5 h-5" />,
    description: 'Approve and manage vendors',
    roles: ['admin', 'maintainer'],
  },
  {
    title: 'Reports & Analytics',
    href: '/dashboard/admin/reports',
    icon: <BarChart3 className="w-5 h-5" />,
    description: 'Generate reports and insights',
    roles: ['admin', 'maintainer'],
  },
  {
    title: 'System Settings',
    href: '/dashboard/admin/settings',
    icon: <FileText className="w-5 h-5" />,
    description: 'Platform configuration',
    roles: ['admin'],
  },
  
  // Common settings
  {
    title: 'Settings',
    href: '/dashboard/settings',
    icon: <Settings className="w-5 h-5" />,
    description: 'Account and notification preferences',
    roles: ['user', 'vendor', 'wedding_planner', 'admin', 'maintainer'],
  },
];

export function DashboardNavigation({ userRole, unreadCount = 0, onLogout }: DashboardNavigationProps) {
  const [isCollapsed, setIsCollapsed] = useState(false);
  const pathname = usePathname();

  // Filter navigation items based on user role
  const filteredItems = navigationItems.filter(item => 
    item.roles.includes(userRole)
  );

  const toggleCollapse = () => {
    setIsCollapsed(!isCollapsed);
  };

  return (
    <nav className={`bg-white border-r border-gray-200 h-full transition-all duration-300 ${
      isCollapsed ? 'w-16' : 'w-64'
    }`}>
      <div className="flex h-full flex-col">
        {/* Header */}
        <div className="flex h-16 items-center justify-between px-4 border-b">
          {!isCollapsed && (
            <h2 className="text-lg font-semibold text-gray-900">
              {userRole === 'admin' || userRole === 'maintainer' ? 'Admin Panel' : 'Dashboard'}
            </h2>
          )}
          <Button
            variant="ghost"
            size="sm"
            onClick={toggleCollapse}
            className="p-2"
          >
            {isCollapsed ? (
              <div className="w-4 h-4 border-l-2 border-t-2 border-gray-600 transform rotate-45" />
            ) : (
              <div className="w-4 h-4 border-r-2 border-b-2 border-gray-600 transform rotate-45" />
            )}
          </Button>
        </div>

        {/* Navigation Items */}
        <div className="flex-1 overflow-y-auto py-4">
          <div className="space-y-1 px-3">
            {filteredItems.map((item) => {
              const isActive = pathname === item.href;
              const isActiveParent = pathname.startsWith(item.href) && item.href !== '/dashboard';
              
              return (
                <Link
                  key={item.href}
                  href={item.href}
                  className={`group relative flex items-center gap-3 rounded-lg px-3 py-2 text-sm font-medium transition-all duration-200 ${
                    isActive || isActiveParent
                      ? 'bg-primary text-primary-foreground shadow-sm'
                      : 'text-gray-700 hover:bg-gray-50 hover:text-gray-900'
                  }`}
                >
                  {item.icon}
                  
                  {!isCollapsed && (
                    <>
                      <span className="flex-1">{item.title}</span>
                      
                      {item.badge && (
                        <Badge 
                          variant={isActive || isActiveParent ? "secondary" : "outline"}
                          className="ml-auto"
                        >
                          {item.badge}
                        </Badge>
                      )}
                      
                      {/* Hover tooltip for collapsed state */}
                      {isCollapsed && (
                        <div className="absolute left-full ml-2 px-2 py-1 bg-gray-900 text-white text-xs rounded opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none whitespace-nowrap z-10">
                          {item.description}
                        </div>
                      )}
                    </>
                  )}
                </Link>
              );
            })}
          </div>
        </div>

        {/* Footer */}
        <div className="border-t p-4">
          <div className="space-y-3">
            {/* Notifications Summary */}
            {!isCollapsed && unreadCount > 0 && (
              <div className="flex items-center gap-2 px-3 py-2 bg-yellow-50 rounded-lg">
                <Bell className="w-4 h-4 text-yellow-600" />
                <span className="text-sm text-yellow-800">
                  {unreadCount} unread
                </span>
              </div>
            )}
            
            {/* Logout Button */}
            <Button
              variant="outline"
              onClick={onLogout}
              className={`w-full ${isCollapsed ? 'px-2' : ''}`}
            >
              <LogOut className={`w-4 h-4 ${isCollapsed ? '' : 'mr-2'}`} />
              {!isCollapsed && 'Logout'}
            </Button>
          </div>
        </div>
      </div>
    </nav>
  );
} 