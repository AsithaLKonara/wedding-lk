"use client"

import React, { useState, useEffect, useMemo } from "react"
import { useRouter, usePathname } from "next/navigation"
import type { AuthUser, NavigationItem, UserRole } from "@/lib/rbac"
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
  Server,
  User,
  Search,
  LayoutDashboard,
  HelpCircle,
  CheckCircle,
  AlertCircle
} from "lucide-react"
import { RBACManager } from "@/lib/rbac"
import { useAuth } from "@/lib/hooks/use-auth"

interface UnifiedDashboardLayoutProps {
  children: React.ReactNode
}

function UnifiedDashboardLayoutComponent({ children }: UnifiedDashboardLayoutProps) {
  const [user, setUser] = useState<AuthUser | null>(null)
  const [loading, setLoading] = useState(true)
  const router = useRouter()
  const pathname = usePathname()
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false)
  const [sidebarOpen, setSidebarOpen] = useState(false)
  
  // Navigation items with proper RBAC
  const navigationItems: NavigationItem[] = useMemo(() => [
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
    {
      title: "Planning",
      href: "/dashboard/planning",
      icon: <Calendar className="w-5 h-5" />,
      description: "Plan your wedding timeline",
      roles: ["user"],
      permissions: ["dashboard:read"]
    },
    {
      title: "Budget",
      href: "/dashboard/user/budget",
      icon: <DollarSign className="w-5 h-5" />,
      description: "Manage your wedding budget",
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
    {
      title: "Messages",
      href: "/dashboard/messages",
      icon: <MessageSquare className="w-5 h-5" />,
      description: "Chat with vendors and planners",
      roles: ["user", "vendor", "wedding_planner"],
      permissions: ["dashboard:read"]
    },
    {
      title: "My Services",
      href: "/dashboard/vendor/services",
      icon: <Package className="w-5 h-5" />,
      description: "Manage your offered services",
      roles: ["vendor"],
      permissions: ["vendors:write"]
    },
    {
      title: "Bookings",
      href: "/dashboard/vendor/bookings",
      icon: <Calendar className="w-5 h-5" />,
      description: "Manage client bookings",
      roles: ["vendor"],
      permissions: ["bookings:read"]
    },
    {
      title: "Tasks",
      href: "/dashboard/planner/tasks",
      icon: <CheckSquare className="w-5 h-5" />,
      description: "Manage wedding tasks",
      roles: ["wedding_planner"],
      permissions: ["dashboard:read"]
    },
    {
      title: "Clients",
      href: "/dashboard/planner/clients",
      icon: <Users className="w-5 h-5" />,
      description: "Manage your clients",
      roles: ["wedding_planner"],
      permissions: ["users:read"]
    },
    {
      title: "Vendor Management",
      href: "/dashboard/admin/vendors",
      icon: <Building2 className="w-5 h-5" />,
      description: "Approve and manage vendors",
      roles: ["admin", "maintainer"],
      permissions: ["vendors:read"]
    },
    {
      title: "User Management",
      href: "/dashboard/admin/users",
      icon: <Shield className="w-5 h-5" />,
      description: "Manage platform users",
      roles: ["admin", "maintainer"],
      permissions: ["users:read"]
    },
    {
      title: "Platform Analytics",
      href: "/dashboard/admin/analytics",
      icon: <BarChart3 className="w-5 h-5" />,
      description: "View platform growth metrics",
      roles: ["admin", "maintainer"],
      permissions: ["analytics:read"]
    },
    {
      title: "System Settings",
      href: "/dashboard/admin/settings",
      icon: <Settings className="w-5 h-5" />,
      description: "Configure platform behavior",
      roles: ["admin", "maintainer"],
      permissions: ["settings:write"]
    }
  ], [])

  useEffect(() => {
    const savedState = localStorage.getItem('sidebarCollapsed')
    if (savedState !== null) {
      setSidebarCollapsed(savedState === 'true')
    }
  }, [])

  useEffect(() => {
    localStorage.setItem('sidebarCollapsed', sidebarCollapsed.toString())
  }, [sidebarCollapsed])

  useEffect(() => {
    fetch('/api/auth/me')
      .then(res => res.json())
      .then(data => {
        if (data.user) {
          setUser(data.user)
        } else {
          router.push('/login')
        }
      })
      .catch(() => router.push('/login'))
      .finally(() => setLoading(false))
  }, [router])

  if (loading) {
    return (
      <div className="h-screen w-full flex items-center justify-center bg-[#050208] text-white">
        <div className="flex flex-col items-center gap-4">
          <div className="h-12 w-12 animate-spin rounded-full border-4 border-purple-600 border-t-transparent" />
          <p className="text-gray-400 font-medium animate-pulse text-sm uppercase tracking-widest">Initializing Dashboard...</p>
        </div>
      </div>
    )
  }

  if (!user) return null

  const filteredItems = RBACManager.filterNavigation(navigationItems, user)
  const roleDisplayName = RBACManager.getRoleDisplayName(user.role)

  return (
    <div className="flex h-screen bg-[#050208] overflow-hidden selection:bg-purple-500/30">
      {/* Mobile Sidebar Overlay */}
      {sidebarOpen && (
        <div 
          className="fixed inset-0 bg-black/60 backdrop-blur-sm z-40 lg:hidden"
          onClick={() => setSidebarOpen(false)}
        />
      )}

      {/* Sidebar */}
      <aside 
        className={`
          fixed lg:static inset-y-0 left-0 z-50
          ${sidebarCollapsed ? 'w-20' : 'w-72'} 
          ${sidebarOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'}
          bg-[#0e0918]/80 backdrop-blur-xl border-r border-white/5
          transition-all duration-300 ease-in-out flex flex-col
        `}
      >
        {/* Brand Logo */}
        <div className="h-20 flex items-center px-6 border-b border-white/5 flex-shrink-0">
          <div className="flex items-center space-x-3">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-purple-600 to-pink-600 flex items-center justify-center shadow-lg shadow-purple-500/20">
              <Zap className="w-6 h-6 text-white" />
            </div>
            {!sidebarCollapsed && (
              <span className="text-xl font-black text-white tracking-tighter uppercase italic">
                Wedding<span className="text-purple-500">LK</span>
              </span>
            )}
          </div>
        </div>

        {/* User Info - Premium Card Style */}
        <div className="p-4 border-b border-white/5 flex-shrink-0">
          <div className={`flex items-center space-x-3 p-3 rounded-2xl bg-white/5 border border-white/5 transition-all ${sidebarCollapsed ? 'justify-center px-0' : ''}`}>
            <Avatar className="h-10 w-10 ring-2 ring-purple-500/30">
              <AvatarImage src={user?.image || undefined} />
              <AvatarFallback className="bg-gradient-to-br from-purple-500 to-pink-500 text-white font-bold">
                {user?.name?.charAt(0).toUpperCase() || "U"}
              </AvatarFallback>
            </Avatar>
            {!sidebarCollapsed && (
              <div className="flex-1 min-w-0">
                <p className="text-sm font-semibold text-white truncate">
                  {user?.name}
                </p>
                <div className="flex items-center mt-1">
                  <Badge className={`text-[10px] py-0 px-1.5 h-4 bg-purple-500/20 text-purple-300 border-none uppercase font-black`}>
                    {roleDisplayName}
                  </Badge>
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Navigation Items - Scrollable */}
        <nav className="flex-1 overflow-y-auto py-6 px-3 custom-scrollbar">
          <div className="space-y-1.5">
            {filteredItems.map((item) => {
              const isActive = pathname === item.href;
              return (
                <Button
                  key={item.href}
                  variant="ghost"
                  className={`
                    w-full justify-start h-11 px-3 text-left transition-all duration-200 group
                    ${isActive 
                      ? "bg-gradient-to-r from-purple-600/20 to-pink-600/5 text-white border-l-2 border-purple-500" 
                      : "text-gray-400 hover:text-white hover:bg-white/5"}
                    ${sidebarCollapsed && "justify-center px-0"}
                  `}
                  onClick={() => {
                    router.push(item.href)
                    setSidebarOpen(false)
                  }}
                >
                  <div className={`flex items-center ${sidebarCollapsed ? 'justify-center' : 'space-x-3'} w-full`}>
                    <div className={`${isActive ? 'text-purple-400' : 'group-hover:text-white'}`}>
                      {item.icon}
                    </div>
                    {!sidebarCollapsed && (
                      <span className="text-xs font-bold uppercase tracking-widest">{item.title}</span>
                    )}
                  </div>
                </Button>
              )
            })}
          </div>
        </nav>

        {/* Sidebar Footer */}
        <div className="p-4 border-t border-white/5 flex-shrink-0">
          <Button 
            variant="ghost" 
            className={`w-full h-11 text-gray-400 hover:text-red-400 hover:bg-red-500/10 transition-all rounded-xl ${sidebarCollapsed ? 'px-0 justify-center' : 'px-3 justify-start space-x-3'}`}
            onClick={() => {
              fetch('/api/auth/signout', { method: 'POST' }).then(() => router.push('/'))
            }}
          >
            <LogOut className="w-5 h-5" />
            {!sidebarCollapsed && <span className="text-xs font-bold uppercase tracking-widest">Logout</span>}
          </Button>
        </div>
      </aside>

      {/* Main Content Area */}
      <main className="flex-1 flex flex-col min-w-0 relative">
        {/* Top Header */}
        <header className="h-20 flex items-center justify-between px-8 border-b border-white/5 bg-[#050208]/50 backdrop-blur-md z-30 sticky top-0">
          <div className="flex items-center gap-4">
            <Button
              variant="ghost"
              size="icon"
              className="lg:hidden text-white hover:bg-white/5"
              onClick={() => setSidebarOpen(true)}
            >
              <Menu className="w-6 h-6" />
            </Button>
            <Button
              variant="ghost"
              size="icon"
              className="hidden lg:flex text-gray-500 hover:text-white hover:bg-white/5 rounded-xl h-10 w-10"
              onClick={() => setSidebarCollapsed(!sidebarCollapsed)}
            >
              {sidebarCollapsed ? <ChevronRight className="w-5 h-5" /> : <ChevronLeft className="w-5 h-5" />}
            </Button>
            <div className="hidden sm:block">
              <h2 className="text-sm font-black text-gray-500 uppercase tracking-[0.2em]">Dashboard</h2>
            </div>
          </div>

          <div className="flex items-center space-x-4">
            <div className="hidden md:flex items-center bg-white/5 border border-white/5 rounded-xl px-3 py-1.5">
              <Search className="w-4 h-4 text-gray-500 mr-2" />
              <input 
                type="text" 
                placeholder="Quick search..." 
                className="bg-transparent border-none focus:outline-none text-xs text-white w-40 placeholder:text-gray-600 font-medium"
              />
            </div>
            <Button variant="ghost" size="icon" className="relative text-gray-400 hover:text-white hover:bg-white/5 rounded-xl h-10 w-10">
              <Bell className="w-5 h-5" />
              <span className="absolute top-2.5 right-2.5 w-2 h-2 bg-red-500 rounded-full border-2 border-[#050208]" />
            </Button>
            <Button variant="ghost" size="icon" className="text-gray-400 hover:text-white hover:bg-white/5 rounded-xl h-10 w-10">
              <Settings className="w-5 h-5" />
            </Button>
          </div>
        </header>

        {/* Content Wrapper */}
        <div className="flex-1 overflow-y-auto p-8 custom-scrollbar">
          <div className="max-w-7xl mx-auto animate-in fade-in duration-700">
            {children}
          </div>
        </div>
      </main>

      <style jsx global>{`
        .custom-scrollbar::-webkit-scrollbar {
          width: 6px;
        }
        .custom-scrollbar::-webkit-scrollbar-track {
          background: transparent;
        }
        .custom-scrollbar::-webkit-scrollbar-thumb {
          background: rgba(255, 255, 255, 0.05);
          border-radius: 10px;
        }
        .custom-scrollbar::-webkit-scrollbar-thumb:hover {
          background: rgba(139, 92, 246, 0.3);
        }
      `}</style>
    </div>
  )
}

export const UnifiedDashboardLayout = UnifiedDashboardLayoutComponent;
