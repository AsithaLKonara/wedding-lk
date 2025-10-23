'use client';

import { useState } from 'react';
// Removed NextAuth - using custom auth
import { useRouter } from 'next/navigation';
import { LogOut, User, Settings, HelpCircle } from 'lucide-react';

interface LogoutButtonProps {
  user: {
    name: string;
    email: string;
    image?: string;
    role: string;
  };
}

export function LogoutButton({ user }: LogoutButtonProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const router = useRouter();

  const handleLogout = async () => {
    setIsLoading(true);
    try {
      await signOut({ 
        callbackUrl: '/',
        redirect: true 
      });
    } catch (error) {
      console.error('Logout error:', error);
      setIsLoading(false);
    }
  };

  const handleProfileClick = () => {
    router.push('/dashboard/profile');
    setIsOpen(false);
  };

  const handleSettingsClick = () => {
    router.push('/dashboard/settings');
    setIsOpen(false);
  };

  const handleHelpClick = () => {
    router.push('/help');
    setIsOpen(false);
  };

  return (
    <div className="relative">
      {/* User Avatar Button */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="flex items-center space-x-2 text-gray-700 hover:text-gray-900 transition-colors"
      >
        {user.image ? (
          <img
            src={user.image}
            alt={user?.name || 'User'}
            className="w-8 h-8 rounded-full object-cover"
          />
        ) : (
          <div className="w-8 h-8 bg-purple-100 rounded-full flex items-center justify-center">
            <User className="w-4 h-4 text-purple-600" />
          </div>
        )}
        <span className="hidden md:block text-sm font-medium">{user?.name || 'User'}</span>
      </button>

      {/* Dropdown Menu */}
      {isOpen && (
        <>
          {/* Backdrop */}
          <div
            className="fixed inset-0 z-10"
            onClick={() => setIsOpen(false)}
          />
          
          {/* Dropdown */}
          <div className="absolute right-0 mt-2 w-64 bg-white rounded-lg shadow-lg border border-gray-200 z-20">
            {/* User Info */}
            <div className="px-4 py-3 border-b border-gray-200">
              <p className="text-sm font-medium text-gray-900">{user?.name || 'User'}</p>
              <p className="text-sm text-gray-500">{user.email}</p>
              <p className="text-xs text-purple-600 capitalize mt-1">
                {user.role.replace('_', ' ')}
              </p>
            </div>

            {/* Menu Items */}
            <div className="py-2">
              <button
                onClick={handleProfileClick}
                className="w-full px-4 py-2 text-left text-sm text-gray-700 hover:bg-gray-50 flex items-center space-x-2"
              >
                <User className="w-4 h-4" />
                <span>Profile</span>
              </button>
              
              <button
                onClick={handleSettingsClick}
                className="w-full px-4 py-2 text-left text-sm text-gray-700 hover:bg-gray-50 flex items-center space-x-2"
              >
                <Settings className="w-4 h-4" />
                <span>Settings</span>
              </button>
              
              <button
                onClick={handleHelpClick}
                className="w-full px-4 py-2 text-left text-sm text-gray-700 hover:bg-gray-50 flex items-center space-x-2"
              >
                <HelpCircle className="w-4 h-4" />
                <span>Help & Support</span>
              </button>
            </div>

            {/* Logout Button */}
            <div className="border-t border-gray-200 py-2">
              <button
                onClick={handleLogout}
                disabled={isLoading}
                className="w-full px-4 py-2 text-left text-sm text-red-600 hover:bg-red-50 flex items-center space-x-2 disabled:opacity-50"
              >
                <LogOut className="w-4 h-4" />
                <span>{isLoading ? 'Signing out...' : 'Sign out'}</span>
              </button>
            </div>
          </div>
        </>
      )}
    </div>
  );
}
