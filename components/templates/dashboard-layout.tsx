"use client"

import React from "react"
import { ReactNode, useState, useEffect } from 'react'
import { useSession } from 'next-auth/react'
import { useRouter } from 'next/navigation'
import { 
  Home, 
  Users, 
  Store, 
  Calendar, 
  Settings, 
  LogOut, 
  Menu, 
  X,
  Bell,
  MessageCircle,
  BarChart3,
  Package,
  Star,
  CreditCard,
  User,
  Shield,
  HelpCircle
} from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Card, CardContent } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Separator } from '@/components/ui/separator'
import { NotificationCenter } from '@/components/ui/notification-center'
import { useSocket } from '@/hooks/use-socket'
import { PerformanceOptimizer } from '@/components/ui/performance-optimizer'

interface DashboardLayoutProps {
  children: ReactNode
  title?: string
  description?: string
  showSidebar?: boolean
  className?: string
}

interface MenuItem {
  label: string
  href: string
  icon: ReactNode
  badge?: string | number
  role?: string[]
}

const userMenuItems: MenuItem[] = [
  { label: 'Dashboard', href: '/dashboard', icon: <Home className="h-4 w-4" /> },
  { label: 'Bookings', href: '/dashboard/bookings', icon: <Calendar className="h-4 w-4" /> },
  { label: 'Payments', href: '/dashboard/payments', icon: <CreditCard className="h-4 w-4" /> },
  { label: 'Profile', href: '/profile', icon: <User className="h-4 w-4" /> },
  { label: 'Settings', href: '/dashboard/settings', icon: <Settings className="h-4 w-4" /> },
]

const vendorMenuItems: MenuItem[] = [
  { label: 'Dashboard', href: '/dashboard/vendor', icon: <Home className="h-4 w-4" /> },
  { label: 'Bookings', href: '/dashboard/vendor?tab=bookings', icon: <Calendar className="h-4 w-4" /> },
  { label: 'Services', href: '/dashboard/vendor?tab=services', icon: <Package className="h-4 w-4" /> },
  { label: 'Reviews', href: '/dashboard/vendor?tab=reviews', icon: <Star className="h-4 w-4" /> },
  { label: 'Analytics', href: '/dashboard/vendor?tab=analytics', icon: <BarChart3 className="h-4 w-4" /> },
  { label: 'Messages', href: '/dashboard/vendor?tab=messages', icon: <MessageCircle className="h-4 w-4" /> },
  { label: 'Settings', href: '/dashboard/settings', icon: <Settings className="h-4 w-4" /> },
]

const adminMenuItems: MenuItem[] = [
  { label: 'Dashboard', href: '/dashboard/admin', icon: <Home className="h-4 w-4" /> },
  { label: 'Users', href: '/dashboard/admin?tab=users', icon: <Users className="h-4 w-4" /> },
  { label: 'Vendors', href: '/dashboard/admin?tab=vendors', icon: <Store className="h-4 w-4" /> },
  { label: 'Bookings', href: '/dashboard/admin?tab=bookings', icon: <Calendar className="h-4 w-4" /> },
  { label: 'Analytics', href: '/dashboard/admin?tab=analytics', icon: <BarChart3 className="h-4 w-4" /> },
  { label: 'Settings', href: '/dashboard/settings', icon: <Settings className="h-4 w-4" /> },
]

const plannerMenuItems: MenuItem[] = [
  { label: 'Dashboard', href: '/dashboard/planner', icon: <Home className="h-4 w-4" /> },
  { label: 'Tasks', href: '/dashboard/planner?tab=tasks', icon: <Calendar className="h-4 w-4" /> },
  { label: 'Clients', href: '/dashboard/planner?tab=clients', icon: <Users className="h-4 w-4" /> },
  { label: 'Vendors', href: '/dashboard/planner?tab=vendors', icon: <Store className="h-4 w-4" /> },
  { label: 'Analytics', href: '/dashboard/planner?tab=analytics', icon: <BarChart3 className="h-4 w-4" /> },
  { label: 'Settings', href: '/dashboard/settings', icon: <Settings className="h-4 w-4" /> },
]

export function DashboardLayout({ 
  children, 
  title = "Dashboard",
  description,
  showSidebar = true,
  className = ""
}: DashboardLayoutProps) {
  const { data: session, status } = useSession()
  const router = useRouter()
  const [sidebarOpen, setSidebarOpen] = useState(false)
  const [userRole, setUserRole] = useState<string>('user')

  const {
    notifications,
    markNotificationAsRead,
    clearNotifications,
    isConnected
  } = useSocket()

  // Determine user role and menu items
  useEffect(() => {
    if (session?.user?.role) {
      setUserRole(session.user.role)
    }
  }, [session])

  const getMenuItems = (): MenuItem[] => {
    switch (userRole) {
      case 'admin':
        return adminMenuItems
      case 'vendor':
        return vendorMenuItems
      case 'planner':
        return plannerMenuItems
      default:
        return userMenuItems
    }
  }

  const menuItems = getMenuItems()

  // Handle logout
  const handleLogout = async () => {
    try {
      await fetch('/api/auth/signout', { method: 'POST' })
      router.push('/login')
    } catch (error) {
      console.error('Logout error:', error)
    }
  }

  // Loading state
  if (status === 'loading') {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Loading dashboard...</p>
        </div>
      </div>
    )
  }

  // Not authenticated
  if (status === 'unauthenticated') {
    router.push('/login')
    return null
  }

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      {/* Mobile sidebar overlay */}
      {sidebarOpen && (
        <div 
          className="fixed inset-0 z-40 bg-black bg-opacity-50 lg:hidden"
          onClick={() => setSidebarOpen(false)}
        />
      )}

      {/* Sidebar */}
      {showSidebar && (
        <div className={`
          fixed inset-y-0 left-0 z-50 w-64 bg-white dark:bg-gray-800 shadow-lg transform transition-transform duration-300 ease-in-out lg:translate-x-0 lg:static lg:inset-0
          ${sidebarOpen ? 'translate-x-0' : '-translate-x-full'}
        `}>
          {/* Sidebar header */}
          <div className="flex items-center justify-between h-16 px-6 border-b border-gray-200 dark:border-gray-700">
            <div className="flex items-center space-x-2">
              <div className="w-8 h-8 bg-blue-600 rounded-lg flex items-center justify-center">
                <span className="text-white font-bold text-sm">W</span>
              </div>
              <span className="font-semibold text-lg">WeddingLK</span>
            </div>
            <Button
              variant="ghost"
              size="sm"
              onClick={() => setSidebarOpen(false)}
              className="lg:hidden"
            >
              <X className="h-4 w-4" />
            </Button>
          </div>

          {/* User info */}
          <div className="p-6 border-b border-gray-200 dark:border-gray-700">
            <div className="flex items-center space-x-3">
              <div className="w-10 h-10 bg-gray-300 rounded-full flex items-center justify-center">
                <User className="h-5 w-5 text-gray-600" />
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-sm font-medium text-gray-900 dark:text-white truncate">
                  {session?.user?.name || 'User'}
                </p>
                <p className="text-xs text-gray-500 truncate">
                  {session?.user?.email}
                </p>
                <div className="flex items-center mt-1">
                  <Badge variant="outline" className="text-xs">
                    {userRole.charAt(0).toUpperCase() + userRole.slice(1)}
                  </Badge>
                  {isConnected && (
                    <div className="w-2 h-2 bg-green-500 rounded-full ml-2" />
                  )}
                </div>
              </div>
            </div>
          </div>

          {/* Navigation menu */}
          <nav className="flex-1 px-4 py-6 space-y-2 overflow-y-auto">
            {menuItems.map((item) => (
              <Button
                key={item.href}
                variant="ghost"
                className="w-full justify-start h-10 px-3"
                onClick={() => {
                  router.push(item.href)
                  setSidebarOpen(false)
                }}
              >
                <span className="mr-3">{item.icon}</span>
                <span className="flex-1 text-left">{item.label}</span>
                {item.badge && (
                  <Badge variant="secondary" className="ml-auto">
                    {item.badge}
                  </Badge>
                )}
              </Button>
            ))}
          </nav>

          {/* Sidebar footer */}
          <div className="p-4 border-t border-gray-200 dark:border-gray-700">
            <Button
              variant="ghost"
              className="w-full justify-start text-red-600 hover:text-red-700 hover:bg-red-50"
              onClick={handleLogout}
            >
              <LogOut className="h-4 w-4 mr-3" />
              Logout
            </Button>
          </div>
        </div>
      )}

      {/* Main content */}
      <div className={`flex-1 ${showSidebar ? 'lg:ml-64' : ''}`}>
        {/* Top header */}
        <header className="bg-white dark:bg-gray-800 shadow-sm border-b border-gray-200 dark:border-gray-700">
          <div className="flex items-center justify-between h-16 px-6">
            <div className="flex items-center space-x-4">
              {showSidebar && (
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => setSidebarOpen(true)}
                  className="lg:hidden"
                >
                  <Menu className="h-5 w-5" />
                </Button>
              )}
              
              <div>
                <h1 className="text-xl font-semibold text-gray-900 dark:text-white">
                  {title}
                </h1>
                {description && (
                  <p className="text-sm text-gray-500">{description}</p>
                )}
              </div>
            </div>

            {/* Header actions */}
            <div className="flex items-center space-x-4">
              {/* Connection status */}
              <div className="flex items-center space-x-2 text-sm text-gray-500">
                <div className={`w-2 h-2 rounded-full ${isConnected ? 'bg-green-500' : 'bg-red-500'}`} />
                <span>{isConnected ? 'Connected' : 'Disconnected'}</span>
              </div>

              {/* Notifications */}
              <NotificationCenter />

              {/* Messages */}
              <Button variant="outline" size="icon">
                <MessageCircle className="h-4 w-4" />
                {notifications.length > 0 && (
                  <Badge variant="destructive" className="absolute -top-1 -right-1 h-5 w-5 rounded-full p-0 flex items-center justify-center text-xs">
                    {notifications.length > 99 ? '99+' : notifications.length}
                  </Badge>
                )}
              </Button>

              {/* Help */}
              <Button variant="outline" size="icon">
                <HelpCircle className="h-4 w-4" />
              </Button>
            </div>
          </div>
        </header>

        {/* Page content */}
        <main className={`p-6 ${className}`}>
          <PerformanceOptimizer>
            {children}
          </PerformanceOptimizer>
        </main>
      </div>
    </div>
  )
} 

export default DashboardLayout
