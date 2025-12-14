'use client';

import { useState } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { 
  Users, 
  Building2, 
  Calendar, 
  BarChart3, 
  Settings, 
  Shield, 
  FileText, 
  MessageSquare,
  Bell,
  LogOut,
  Menu,
  X
} from 'lucide-react';

interface AdminNavigationProps {
  userRole: string;
  unreadNotifications?: number;
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
  {
    title: 'Dashboard',
    href: '/dashboard/admin',
    icon: <BarChart3 className="w-5 h-5" />,
    description: 'Platform overview and analytics',
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
    title: 'Wedding Planners',
    href: '/dashboard/admin/planners',
    icon: <Calendar className="w-5 h-5" />,
    description: 'Manage wedding planner accounts',
    roles: ['admin', 'maintainer'],
  },
  {
    title: 'Verification Requests',
    href: '/dashboard/admin/verifications',
    icon: <Shield className="w-5 h-5" />,
    description: 'Review verification documents',
    roles: ['admin', 'maintainer'],
  },
  {
    title: 'Reports & Analytics',
    href: '/dashboard/admin/reports',
    icon: <FileText className="w-5 h-5" />,
    description: 'Generate reports and insights',
    roles: ['admin', 'maintainer'],
  },
  {
    title: 'System Settings',
    href: '/dashboard/admin/settings',
    icon: <Settings className="w-5 h-5" />,
    description: 'Platform configuration',
    roles: ['admin'],
  },
  {
    title: 'Messages',
    href: '/dashboard/admin/messages',
    icon: <MessageSquare className="w-5 h-5" />,
    description: 'System-wide communications',
    roles: ['admin', 'maintainer'],
  },
  {
    title: 'Notifications',
    href: '/dashboard/admin/notifications',
    icon: <Bell className="w-5 h-5" />,
    description: 'Manage system notifications',
    roles: ['admin', 'maintainer'],
  },
];

export function AdminNavigation({ userRole, unreadNotifications = 0, onLogout }: AdminNavigationProps) {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const pathname = usePathname();

  // Filter navigation items based on user role
  const filteredItems = navigationItems.filter(item => 
    item.roles.includes(userRole)
  );

  const toggleMobileMenu = () => {
    setIsMobileMenuOpen(!isMobileMenuOpen);
  };

  const closeMobileMenu = () => {
    setIsMobileMenuOpen(false);
  };

  return (
    <>
      {/* Mobile Menu Button */}
      <div className="lg:hidden">
        <Button
          variant="ghost"
          size="sm"
          onClick={toggleMobileMenu}
          className="p-2"
        >
          {isMobileMenuOpen ? (
            <X className="w-5 h-5" />
          ) : (
            <Menu className="w-5 h-5" />
          )}
        </Button>
      </div>

      {/* Mobile Navigation Overlay */}
      {isMobileMenuOpen && (
        <div className="fixed inset-0 z-50 lg:hidden">
          <div className="fixed inset-0 bg-black/50" onClick={closeMobileMenu} />
          <div className="fixed left-0 top-0 h-full w-80 bg-white shadow-xl">
            <div className="flex h-full flex-col">
              {/* Mobile Header */}
              <div className="flex h-16 items-center justify-between px-6 border-b">
                <h2 className="text-lg font-semibold">Admin Navigation</h2>
                <Button variant="ghost" size="sm" onClick={closeMobileMenu}>
                  <X className="w-5 h-5" />
                </Button>
              </div>

              {/* Mobile Navigation Items */}
              <nav className="flex-1 overflow-y-auto p-6">
                <div className="space-y-2">
                  {filteredItems.map((item) => (
                    <Link
                      key={item.href}
                      href={item.href}
                      onClick={closeMobileMenu}
                      className={`flex items-center gap-3 rounded-lg px-3 py-2 text-sm font-medium transition-colors ${
                        pathname === item.href
                          ? 'bg-primary text-primary-foreground'
                          : 'text-gray-700 hover:bg-gray-100'
                      }`}
                    >
                      {item.icon}
                      <span>{item.title}</span>
                      {item.badge && (
                        <Badge variant="secondary" className="ml-auto">
                          {item.badge}
                        </Badge>
                      )}
                    </Link>
                  ))}
                </div>
              </nav>

              {/* Mobile Footer */}
              <div className="border-t p-6">
                <Button
                  variant="outline"
                  onClick={onLogout}
                  className="w-full"
                >
                  <LogOut className="w-4 h-4 mr-2" />
                  Logout
                </Button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Desktop Navigation */}
      <nav className="hidden lg:block w-64 bg-white border-r border-gray-200 h-full">
        <div className="flex h-full flex-col">
          {/* Desktop Header */}
          <div className="flex h-16 items-center justify-between px-6 border-b">
            <h2 className="text-lg font-semibold text-gray-900">Admin Panel</h2>
            <Badge variant="secondary" className="text-xs">
              {userRole}
            </Badge>
          </div>

          {/* Desktop Navigation Items */}
          <div className="flex-1 overflow-y-auto p-4">
            <div className="space-y-2">
              {filteredItems.map((item) => (
                <Link
                  key={item.href}
                  href={item.href}
                  className={`group relative flex items-center gap-3 rounded-lg px-3 py-2 text-sm font-medium transition-all duration-200 ${
                    pathname === item.href
                      ? 'bg-primary text-primary-foreground shadow-sm'
                      : 'text-gray-700 hover:bg-gray-50 hover:text-gray-900'
                  }`}
                >
                  {item.icon}
                  <span>{item.title}</span>
                  {item.badge && (
                    <Badge 
                      variant={pathname === item.href ? "secondary" : "outline"}
                      className="ml-auto"
                    >
                      {item.badge}
                    </Badge>
                  )}
                  
                  {/* Hover tooltip */}
                  <div className="absolute left-full ml-2 px-2 py-1 bg-gray-900 text-white text-xs rounded opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none whitespace-nowrap z-10">
                    {item.description}
                  </div>
                </Link>
              ))}
            </div>
          </div>

          {/* Desktop Footer */}
          <div className="border-t p-4">
            <div className="space-y-3">
              {/* Notifications Summary */}
              {unreadNotifications > 0 && (
                <div className="flex items-center gap-2 px-3 py-2 bg-yellow-50 rounded-lg">
                  <Bell className="w-4 h-4 text-yellow-600" />
                  <span className="text-sm text-yellow-800">
                    {unreadNotifications} unread notification{unreadNotifications !== 1 ? 's' : ''}
                  </span>
                </div>
              )}
              
              {/* Logout Button */}
              <Button
                variant="outline"
                onClick={onLogout}
                className="w-full"
              >
                <LogOut className="w-4 h-4 mr-2" />
                Logout
              </Button>
            </div>
          </div>
        </div>
      </nav>
    </>
  );
} 