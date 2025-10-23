'use client';

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Badge } from '@/components/ui/badge';
import { 
  DropdownMenu, 
  DropdownMenuContent, 
  DropdownMenuItem, 
  DropdownMenuLabel, 
  DropdownMenuSeparator, 
  DropdownMenuTrigger 
} from '@/components/ui/dropdown-menu';
import { Bell, Settings, User, LogOut, Shield, Crown } from 'lucide-react';

interface AdminHeaderProps {
  unreadNotifications?: number;
}

export function AdminHeader({ unreadNotifications = 0 }: AdminHeaderProps) {
  const [user, setUser] = useState(null);
  const [status, setStatus] = useState('loading');
  const [isNotificationsOpen, setIsNotificationsOpen] = useState(false);

  const handleLogout = () => {
    fetch('/api/auth/signout', { method: 'POST' }).then(() => { callbackUrl: '/' });
  };

  const getRoleIcon = (role: string) => {
    switch (role) {
      case 'admin':
        return <Crown className="w-4 h-4 text-yellow-600" />;
      case 'maintainer':
        return <Shield className="w-4 h-4 text-blue-600" />;
      default:
        return <User className="w-4 h-4 text-gray-600" />;
    }
  };

  const getRoleColor = (role: string) => {
    switch (role) {
      case 'admin':
        return 'bg-yellow-100 text-yellow-800 border-yellow-200';
      case 'maintainer':
        return 'bg-blue-100 text-blue-800 border-blue-200';
      default:
        return 'bg-gray-100 text-gray-800 border-gray-200';
    }
  };

  if (!user?.user) {
    return null;
  }

  return (
    <header className="bg-white border-b border-gray-200 px-6 py-4">
      <div className="flex items-center justify-between">
        {/* Left Section - Brand and Title */}
        <div className="flex items-center gap-4">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-gradient-to-br from-purple-600 to-pink-600 rounded-lg flex items-center justify-center">
              <Shield className="w-6 h-6 text-white" />
            </div>
            <div>
              <h1 className="text-xl font-bold text-gray-900">WeddingLK Admin</h1>
              <p className="text-sm text-gray-500">Platform Management Console</p>
            </div>
          </div>
        </div>

        {/* Center Section - Quick Stats */}
        <div className="hidden md:flex items-center gap-6">
          <div className="text-center">
            <div className="text-2xl font-bold text-gray-900">
              {user.role === 'admin' ? 'Full Access' : 'Limited Access'}
            </div>
            <div className="text-sm text-gray-500">Admin Privileges</div>
          </div>
        </div>

        {/* Right Section - User Menu and Actions */}
        <div className="flex items-center gap-4">
          {/* Notifications */}
          <div className="relative">
            <Button
              variant="ghost"
              size="sm"
              className="relative p-2"
              onClick={() => setIsNotificationsOpen(!isNotificationsOpen)}
            >
              <Bell className="w-5 h-5" />
              {unreadNotifications > 0 && (
                <Badge 
                  variant="destructive" 
                  className="absolute -top-1 -right-1 h-5 w-5 rounded-full p-0 text-xs flex items-center justify-center"
                >
                  {unreadNotifications > 99 ? '99+' : unreadNotifications}
                </Badge>
              )}
            </Button>
          </div>

          {/* User Profile Dropdown */}
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" className="relative h-10 w-10 rounded-full">
                <Avatar className="h-10 w-10">
                  <AvatarImage src={user.image || ''} alt={user.name || ''} />
                  <AvatarFallback className="bg-gradient-to-br from-purple-600 to-pink-600 text-white">
                    {user.name?.charAt(0).toUpperCase() || 'A'}
                  </AvatarFallback>
                </Avatar>
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent className="w-56" align="end" forceMount>
              <DropdownMenuLabel className="font-normal">
                <div className="flex flex-col space-y-1">
                  <p className="text-sm font-medium leading-none">
                    {user.name || 'Admin User'}
                  </p>
                  <p className="text-xs leading-none text-muted-foreground">
                    {user.email || 'admin@weddinglk.com'}
                  </p>
                </div>
              </DropdownMenuLabel>
              <DropdownMenuSeparator />
              
              {/* Role Display */}
              <div className="px-2 py-1.5">
                <div className="flex items-center gap-2">
                  {getRoleIcon(user.role || 'admin')}
                  <Badge 
                    variant="outline" 
                    className={`text-xs ${getRoleColor(user.role || 'admin')}`}
                  >
                    {user.role || 'admin'}
                  </Badge>
                </div>
              </div>
              
              <DropdownMenuSeparator />
              
              <DropdownMenuItem asChild>
                <a href="/dashboard/admin/profile" className="cursor-pointer">
                  <User className="mr-2 h-4 w-4" />
                  <span>Profile</span>
                </a>
              </DropdownMenuItem>
              
              <DropdownMenuItem asChild>
                <a href="/dashboard/admin/settings" className="cursor-pointer">
                  <Settings className="mr-2 h-4 w-4" />
                  <span>Settings</span>
                </a>
              </DropdownMenuItem>
              
              <DropdownMenuSeparator />
              
              <DropdownMenuItem onClick={handleLogout} className="cursor-pointer">
                <LogOut className="mr-2 h-4 w-4" />
                <span>Log out</span>
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </div>

      {/* Mobile Quick Stats */}
      <div className="md:hidden mt-4 pt-4 border-t border-gray-200">
        <div className="flex items-center justify-between">
          <div className="text-center">
            <div className="text-lg font-semibold text-gray-900">
              {user.role === 'admin' ? 'Full Access' : 'Limited Access'}
            </div>
            <div className="text-xs text-gray-500">Admin Privileges</div>
          </div>
          <div className="flex items-center gap-2">
            {getRoleIcon(user.role || 'admin')}
            <Badge 
              variant="outline" 
              className={`text-xs ${getRoleColor(user.role || 'admin')}`}
            >
              {user.role || 'admin'}
            </Badge>
          </div>
        </div>
      </div>
    </header>
  );
} 