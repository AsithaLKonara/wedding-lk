"use client"

import { Button } from "@/components/ui/button"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Calendar, Bell, Settings, LogOut } from "lucide-react"

export function DashboardHeader() {
  const [user, setUser] = useState(null);
  const [status, setStatus] = useState('loading');
  const userName = user ?.user?.name || 'User'
  const userEmail = user ?.user?.email || 'user@example.com'
  const userRole = user ?.user?.role || 'user'

  const getRoleDisplayName = (role: string) => {
    switch (role) {
      case 'admin': return 'Administrator'
      case 'vendor': return 'Vendor'
      case 'planner': return 'Wedding Planner'
      default: return 'User'
    }
  }

  return (
    <div className="bg-white dark:bg-gray-800 border-b border-gray-200 dark:border-gray-700">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-4">
        <div className="flex justify-between items-center">
          <div>
            <h1 className="text-2xl font-bold text-gray-900 dark:text-white">
              Welcome back, {userName}!
            </h1>
            <p className="text-gray-600 dark:text-gray-300">
              {getRoleDisplayName(userRole)} Dashboard
            </p>
          </div>

          <div className="flex items-center space-x-4">
            <Button variant="outline" size="sm">
              <Calendar className="mr-2 h-4 w-4" />
              Today: {new Date().toLocaleDateString()}
            </Button>

            <Button variant="ghost" size="sm">
              <Bell className="h-4 w-4" />
            </Button>

            <Button variant="ghost" size="sm">
              <Settings className="h-4 w-4" />
            </Button>

            <div className="flex items-center space-x-3">
              <Avatar>
                <AvatarImage src={user ?.user?.image || "/placeholder.svg?height=40&width=40"} />
                <AvatarFallback>{userName.charAt(0).toUpperCase()}</AvatarFallback>
              </Avatar>
              <div className="text-right">
                <p className="text-sm font-medium text-gray-900 dark:text-white">{userName}</p>
                <p className="text-xs text-gray-500 dark:text-gray-400">{userRole}</p>
              </div>
              <Button 
                variant="ghost" 
                size="sm" 
                onClick={() => fetch('/api/auth/signout', { method: 'POST' }).then(() => )}
                className="text-red-600 hover:text-red-700"
              >
                <LogOut className="h-4 w-4" />
              </Button>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}


export default DashboardHeader
