"use client"

import { useState } from "react"
import { useSession } from "next-auth/react"
import { useRouter } from "next/navigation"
import { signOut } from "next-auth/react"
import dynamic from "next/dynamic"
import { Button } from "@/components/ui/button"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Badge } from "@/components/ui/badge"
import { Separator } from "@/components/ui/separator"
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
  LogOut,
  Menu,
  X,
  CheckSquare,
  TrendingUp,
  DollarSign,
  Star,
  ChevronLeft,
  ChevronRight,
  Activity,
  Target,
  Award,
  Clock,
  Database,
  Globe,
  Server
} from "lucide-react"
import { RBACManager, AuthHelpers, type UserRole, type NavigationItem } from "@/lib/rbac"

interface UnifiedDashboardLayoutProps {
  children: React.ReactNode
}

// Unified navigation items with proper RBAC
const navigationItems: NavigationItem[] = [
  // Common items for all users
  {
    title: "Dashboard",
    href: "/dashboard",
    icon: <Home className="w-5 h-5" />,
    description: "Overview of your account",
    roles: ["user", "vendor", "wedding_planner", "admin", "maintainer"],
    permissions: ["dashboard:read"]
  },
  {
    title: "Profile",
    href: "/dashboard/profile",
    icon: <Users className="w-5 h-5" />,
    description: "Manage your profile and settings",
    roles: ["user", "vendor", "wedding_planner", "admin", "maintainer"],
    permissions: ["settings:read"]
  },
  
  // User-specific items
  {
    title: "Planning",
    href: "/dashboard/planning",
    icon: <Calendar className="w-5 h-5" />,
    description: "Plan your wedding timeline",
    roles: ["user"],
    permissions: ["dashboard:read"]
  },
  {
    title: "Favorites",
    href: "/dashboard/favorites",
    icon: <Heart className="w-5 h-5" />,
    description: "Your saved vendors and venues",
    roles: ["user"],
    permissions: ["dashboard:read"]
  },
  
  // Vendor-specific items
  {
    title: "Services",
    href: "/dashboard/vendor/services",
    icon: <Package className="w-5 h-5" />,
    description: "Manage your services and pricing",
    roles: ["vendor"],
    permissions: ["dashboard:write"]
  },
  {
    title: "Boost Campaigns",
    href: "/dashboard/vendor/boost-campaigns",
    icon: <Zap className="w-5 h-5" />,
    description: "Manage your venue boost campaigns",
    roles: ["vendor"],
    permissions: ["dashboard:write"]
  },
  
  // Planner-specific items
  {
    title: "Tasks",
    href: "/dashboard/planner/tasks",
    icon: <CheckSquare className="w-5 h-5" />,
    description: "Manage planning tasks",
    roles: ["wedding_planner"],
    permissions: ["dashboard:write"]
  },
  {
    title: "Clients",
    href: "/dashboard/planner/clients",
    icon: <Users className="w-5 h-5" />,
    description: "Manage client relationships",
    roles: ["wedding_planner"],
    permissions: ["users:read"]
  },
  
  // Common business items
  {
    title: "Bookings",
    href: "/dashboard/bookings",
    icon: <Calendar className="w-5 h-5" />,
    description: "Manage your bookings and appointments",
    roles: ["vendor", "wedding_planner"],
    permissions: ["bookings:read"]
  },
  {
    title: "Messages",
    href: "/dashboard/messages",
    icon: <MessageSquare className="w-5 h-5" />,
    description: "Communicate with clients and vendors",
    roles: ["vendor", "wedding_planner", "user"],
    permissions: ["dashboard:read"]
  },
  {
    title: "Payments",
    href: "/dashboard/payments",
    icon: <CreditCard className="w-5 h-5" />,
    description: "View payment history and manage billing",
    roles: ["vendor", "wedding_planner", "user"],
    permissions: ["dashboard:read"]
  },
  
  // Admin items
  {
    title: "Admin Dashboard",
    href: "/dashboard/admin",
    icon: <Shield className="w-5 h-5" />,
    description: "Platform administration and management",
    roles: ["admin", "maintainer"],
    permissions: ["admin:read"]
  },
  {
    title: "User Management",
    href: "/dashboard/admin/users",
    icon: <Users className="w-5 h-5" />,
    description: "Manage all users and roles",
    roles: ["admin", "maintainer"],
    permissions: ["users:read", "users:write"]
  },
  {
    title: "Vendor Management",
    href: "/dashboard/admin/vendors",
    icon: <Building2 className="w-5 h-5" />,
    description: "Approve and manage vendors",
    roles: ["admin", "maintainer"],
    permissions: ["vendors:read", "vendors:write"]
  },
  {
    title: "Analytics",
    href: "/dashboard/admin/analytics",
    icon: <BarChart3 className="w-5 h-5" />,
    description: "Platform analytics and insights",
    roles: ["admin", "maintainer"],
    permissions: ["analytics:read"]
  },
  {
    title: "Performance",
    href: "/dashboard/admin/performance",
    icon: <Activity className="w-5 h-5" />,
    description: "System performance monitoring",
    roles: ["admin", "maintainer"],
    permissions: ["admin:read"]
  },
  {
    title: "System Settings",
    href: "/dashboard/admin/settings",
    icon: <FileText className="w-5 h-5" />,
    description: "Platform configuration",
    roles: ["admin", "maintainer"],
    permissions: ["settings:read", "settings:write"]
  },
  
  // Common settings
  {
    title: "Settings",
    href: "/dashboard/settings",
    icon: <Settings className="w-5 h-5" />,
    description: "Account and notification preferences",
    roles: ["user", "vendor", "wedding_planner", "admin", "maintainer"],
    permissions: ["settings:read"]
  },
]

function UnifiedDashboardLayoutComponent({ children }: UnifiedDashboardLayoutProps) {
  const { data: session } = useSession()
  const router = useRouter()
  const [sidebarOpen, setSidebarOpen] = useState(false)
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false)

  if (!session) {
    return null
  }

  const user = session.user
  const userRole = user?.role as UserRole || 'user'
  const theme = RBACManager.getRoleTheme(userRole)
  const roleDisplayName = RBACManager.getRoleDisplayName(userRole)

  // Filter navigation items based on user role and permissions
  const filteredItems = RBACManager.filterNavigation(navigationItems, {
    id: user?.id || '',
    name: user?.name || '',
    email: user?.email || '',
    role: userRole,
    image: user?.image
  })

  const handleLogout = async () => {
    await signOut({ callbackUrl: "/login" })
  }

  return (
    <div className="h-screen flex bg-gray-50 overflow-hidden">
      {/* Mobile sidebar overlay */}
      {sidebarOpen && (
        <div 
          className="fixed inset-0 z-40 bg-black bg-opacity-50 lg:hidden"
          onClick={() => setSidebarOpen(false)}
        />
      )}

      {/* Sidebar - Fixed height and position */}
      <div className={`
        fixed inset-y-0 left-0 z-50 w-64 bg-white border-r border-gray-200 transform transition-transform duration-300 ease-in-out lg:translate-x-0 lg:static lg:inset-0 flex flex-col
        ${sidebarOpen ? "translate-x-0" : "-translate-x-full"}
        ${sidebarCollapsed && "lg:w-16"}
      `}>
        {/* Sidebar Header */}
        <div className="flex h-16 items-center justify-between px-4 border-b border-gray-200 flex-shrink-0">
          {!sidebarCollapsed && (
            <div className="flex items-center space-x-2">
              <div className={`p-2 rounded-lg ${theme.bg}`}>
                <Shield className={`h-6 w-6 ${theme.text}`} />
              </div>
              <h2 className="text-lg font-semibold text-gray-900">
                {userRole === "admin" || userRole === "maintainer" ? "Admin Panel" : "Dashboard"}
              </h2>
            </div>
          )}
          <div className="flex items-center space-x-2">
            <Button
              variant="ghost"
              size="sm"
              onClick={() => setSidebarCollapsed(!sidebarCollapsed)}
              className="hidden lg:flex p-2"
            >
              {sidebarCollapsed ? (
                <ChevronRight className="h-4 w-4" />
              ) : (
                <ChevronLeft className="h-4 w-4" />
              )}
            </Button>
            <Button
              variant="ghost"
              size="sm"
              onClick={() => setSidebarOpen(false)}
              className="lg:hidden p-2"
            >
              <X className="h-4 w-4" />
            </Button>
          </div>
        </div>

        {/* User Info */}
        <div className="p-4 border-b border-gray-200 flex-shrink-0">
          <div className="flex items-center space-x-3">
            <Avatar className="h-10 w-10">
              <AvatarImage src={user?.image || ""} />
              <AvatarFallback>
                {user?.name?.charAt(0).toUpperCase() || "U"}
              </AvatarFallback>
            </Avatar>
            {!sidebarCollapsed && (
              <div className="flex-1 min-w-0">
                <p className="text-sm font-medium text-gray-900 truncate">
                  {user?.name}
                </p>
                <Badge variant="outline" className={`text-xs ${theme.text} ${theme.border}`}>
                  {roleDisplayName}
                </Badge>
              </div>
            )}
          </div>
        </div>

        {/* Navigation Items - Scrollable */}
        <nav className="flex-1 overflow-y-auto py-4">
          <div className="space-y-1 px-3">
            {filteredItems.map((item) => (
              <Button
                key={item.href}
                variant="ghost"
                className={`
                  w-full justify-start h-auto p-3 text-left
                  ${sidebarCollapsed && "px-2"}
                `}
                onClick={() => {
                  router.push(item.href)
                  setSidebarOpen(false)
                }}
              >
                <div className="flex items-center space-x-3 w-full">
                  {item.icon}
                  {!sidebarCollapsed && (
                    <>
                      <span className="flex-1 text-sm font-medium">
                        {item.title}
                      </span>
                      {item.badge && (
                        <Badge variant="secondary" className="ml-auto">
                          {item.badge}
                        </Badge>
                      )}
                    </>
                  )}
                </div>
              </Button>
            ))}
          </div>
        </nav>

        {/* Logout Button - Fixed at bottom */}
        <div className="border-t border-gray-200 p-4 flex-shrink-0">
          <Button
            variant="outline"
            onClick={handleLogout}
            className={`
              w-full justify-start
              ${sidebarCollapsed && "px-2"}
            `}
          >
            <LogOut className="h-4 w-4" />
            {!sidebarCollapsed && <span className="ml-2">Logout</span>}
          </Button>
        </div>
      </div>

      {/* Main content area */}
      <div className="flex-1 flex flex-col overflow-hidden">
        {/* Top header - Fixed */}
        <header className="bg-white border-b border-gray-200 px-4 py-4 flex-shrink-0">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <Button
                variant="ghost"
                size="sm"
                onClick={() => setSidebarOpen(true)}
                className="lg:hidden"
              >
                <Menu className="h-5 w-5" />
              </Button>
              
              {/* User Avatar in navbar left corner */}
              <Avatar className="h-8 w-8">
                <AvatarImage src={user?.image || ""} />
                <AvatarFallback>
                  {user?.name?.charAt(0).toUpperCase() || "U"}
                </AvatarFallback>
              </Avatar>
              
              <div>
                <h1 className="text-2xl font-bold text-gray-900">
                  Welcome back, {user?.name}!
                </h1>
                <p className="text-gray-600">
                  {roleDisplayName} Dashboard
                </p>
              </div>
            </div>
            
            <div className="flex items-center space-x-4">
              <Button variant="outline" size="sm">
                <Bell className="h-4 w-4 mr-2" />
                Notifications
              </Button>
              <Button variant="outline" size="sm">
                <Settings className="h-4 w-4 mr-2" />
                Settings
              </Button>
            </div>
          </div>
        </header>

        {/* Page content - Scrollable */}
        <main className="flex-1 overflow-y-auto p-6">
          {children}
        </main>
      </div>
    </div>
  )
}

export const UnifiedDashboardLayout = dynamic(() => Promise.resolve(UnifiedDashboardLayoutComponent), { ssr: false });
