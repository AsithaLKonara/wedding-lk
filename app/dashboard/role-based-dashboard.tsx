"use client"

import { useSession } from "next-auth/react"
import { useRouter } from "next/navigation"
import { useEffect, useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Calendar, Users, DollarSign, CheckSquare, MessageCircle, Settings, LayoutDashboard, TrendingUp, Bell, Store, Shield, UserCheck } from "lucide-react"
import Link from "next/link"

export default function RoleBasedDashboard() {
  const { data: session, status } = useSession()
  const router = useRouter()
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    if (status === 'loading') {
      setIsLoading(true)
    } else if (status === 'unauthenticated') {
      router.push('/login')
    } else {
      setIsLoading(false)
      
      // Smart routing based on user role
      if (session?.user?.role) {
        const userRole = session.user.role
        
        // Redirect users to their appropriate dashboard
        if (userRole === 'vendor' && window.location.pathname === '/dashboard') {
          router.push('/dashboard/vendor')
          return
        } else if (userRole === 'admin' && window.location.pathname === '/dashboard') {
          router.push('/dashboard/admin')
          return
        }
      }
    }
  }, [status, router, session])

  // Show loading state
  if (isLoading || status === 'loading') {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center">
          <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-blue-600 mx-auto"></div>
          <p className="mt-4 text-gray-600">Loading your dashboard...</p>
        </div>
      </div>
    )
  }

  // Show login prompt if not authenticated
  if (!session) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <Card className="w-full max-w-md">
          <CardHeader>
            <CardTitle>Authentication Required</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <Button asChild className="w-full">
              <Link href="/login">Login to Dashboard</Link>
            </Button>
            <Button variant="outline" asChild className="w-full">
              <Link href="/register">Create Account</Link>
            </Button>
          </CardContent>
        </Card>
      </div>
    )
  }

  const user = session.user
  const userRole = user.role || 'user'

  // Role-based dashboard selection
  const getRoleBasedDashboard = () => {
    switch (userRole) {
      case 'vendor':
        return {
          title: 'Vendor Dashboard',
          description: 'Manage your business, services, and bookings',
          icon: Store,
          primaryAction: '/dashboard/vendor',
          primaryActionText: 'Go to Vendor Dashboard'
        }
      case 'admin':
        return {
          title: 'Admin Dashboard',
          description: 'Platform administration and oversight',
          icon: Shield,
          primaryAction: '/dashboard/admin',
          primaryActionText: 'Go to Admin Dashboard'
        }
      default:
        return {
          title: 'Wedding Planning Dashboard',
          description: 'Plan your perfect wedding with our tools',
          icon: LayoutDashboard,
          primaryAction: '/planning',
          primaryActionText: 'Start Planning'
        }
    }
  }

  const roleDashboard = getRoleBasedDashboard()
  const RoleIcon = roleDashboard.icon

  return (
    <div className="container mx-auto py-8 px-4 md:px-6">
      {/* Role-based Header */}
      <div className="flex items-center justify-between mb-8">
        <div className="flex items-center space-x-4">
          <div className="p-3 bg-blue-100 rounded-full">
            <RoleIcon className="h-8 w-8 text-blue-600" />
          </div>
          <div>
            <h1 className="text-3xl font-bold">{roleDashboard.title}</h1>
            <p className="text-gray-600 mt-2">{roleDashboard.description}</p>
            <p className="text-sm text-gray-500 mt-1">Welcome back, {user?.name || user?.email || 'User'}!</p>
          </div>
        </div>
        <div className="flex items-center space-x-2">
          <Button variant="outline" size="icon">
            <Bell className="h-5 w-5" />
          </Button>
          <Button variant="outline" size="icon">
            <Settings className="h-5 w-5" />
          </Button>
        </div>
      </div>

      {/* Role-based Quick Actions */}
      <div className="mb-8">
        <h2 className="text-2xl font-bold mb-4">Quick Actions</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          {/* Primary Action Button */}
          <Button asChild className="h-24 flex flex-col justify-center items-center bg-blue-600 hover:bg-blue-700">
            <Link href={roleDashboard.primaryAction}>
              <RoleIcon className="h-6 w-6 mb-2" />
              {roleDashboard.primaryActionText}
            </Link>
          </Button>

          {/* Role-specific actions */}
          {userRole === 'user' && (
            <>
              <Button asChild variant="outline" className="h-24 flex flex-col justify-center items-center">
                <Link href="/planning?tab=checklist">
                  <CheckSquare className="h-6 w-6 mb-2" />
                  Wedding Checklist
                </Link>
              </Button>
              <Button asChild variant="outline" className="h-24 flex flex-col justify-center items-center">
                <Link href="/dashboard/messages">
                  <MessageCircle className="h-6 w-6 mb-2" />
                  Messages
                </Link>
              </Button>
              <Button asChild variant="outline" className="h-24 flex flex-col justify-center items-center">
                <Link href="/planning?tab=budget-tracker">
                  <DollarSign className="h-6 w-6 mb-2" />
                  Budget Tracker
                </Link>
              </Button>
            </>
          )}

          {userRole === 'vendor' && (
            <>
              <Button asChild variant="outline" className="h-24 flex flex-col justify-center items-center">
                <Link href="/dashboard/vendor?tab=bookings">
                  <Calendar className="h-6 w-6 mb-2" />
                  Manage Bookings
                </Link>
              </Button>
              <Button asChild variant="outline" className="h-24 flex flex-col justify-center items-center">
                <Link href="/dashboard/vendor?tab=services">
                  <Store className="h-6 w-6 mb-2" />
                  My Services
                </Link>
              </Button>
              <Button asChild variant="outline" className="h-24 flex flex-col justify-center items-center">
                <Link href="/dashboard/vendor?tab=analytics">
                  <TrendingUp className="h-6 w-6 mb-2" />
                  Analytics
                </Link>
              </Button>
            </>
          )}

          {userRole === 'admin' && (
            <>
              <Button asChild variant="outline" className="h-24 flex flex-col justify-center items-center">
                <Link href="/dashboard/admin?tab=users">
                  <Users className="h-6 w-6 mb-2" />
                  User Management
                </Link>
              </Button>
              <Button asChild variant="outline" className="h-24 flex flex-col justify-center items-center">
                <Link href="/dashboard/admin?tab=vendors">
                  <Store className="h-6 w-6 mb-2" />
                  Vendor Management
                </Link>
              </Button>
              <Button asChild variant="outline" className="h-24 flex flex-col justify-center items-center">
                <Link href="/dashboard/admin?tab=analytics">
                  <TrendingUp className="h-6 w-6 mb-2" />
                  Platform Analytics
                </Link>
              </Button>
            </>
          )}
        </div>
      </div>

      {/* Role-based Stats Overview */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        {userRole === 'user' && (
          <>
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Upcoming Events</CardTitle>
                <Calendar className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">2</div>
                <p className="text-xs text-muted-foreground">Next event in 3 days</p>
                <Button asChild variant="link" className="p-0 h-auto mt-2">
                  <Link href="/planning?tab=calendar">View Calendar</Link>
                </Button>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Guest List</CardTitle>
                <Users className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">150</div>
                <p className="text-xs text-muted-foreground">RSVPs received</p>
                <Button asChild variant="link" className="p-0 h-auto mt-2">
                  <Link href="/planning?tab=guest-list">Manage Guests</Link>
                </Button>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Budget Spent</CardTitle>
                <DollarSign className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">LKR 450,000</div>
                <p className="text-xs text-muted-foreground">75% of budget used</p>
                <Button asChild variant="link" className="p-0 h-auto mt-2">
                  <Link href="/planning?tab=budget-tracker">View Budget</Link>
                </Button>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Tasks Completed</CardTitle>
                <CheckSquare className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">18/25</div>
                <p className="text-xs text-muted-foreground">72% complete</p>
                <Button asChild variant="link" className="p-0 h-auto mt-2">
                  <Link href="/planning?tab=checklist">View Tasks</Link>
                </Button>
              </CardContent>
            </Card>
          </>
        )}

        {userRole === 'vendor' && (
          <>
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Total Bookings</CardTitle>
                <Calendar className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">32</div>
                <p className="text-xs text-muted-foreground">+15% from last month</p>
                <Button asChild variant="link" className="p-0 h-auto mt-2">
                  <Link href="/dashboard/vendor?tab=bookings">View Bookings</Link>
                </Button>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Total Revenue</CardTitle>
                <DollarSign className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">LKR 1,250,000</div>
                <p className="text-xs text-muted-foreground">Avg: LKR 39,000</p>
                <Button asChild variant="link" className="p-0 h-auto mt-2">
                  <Link href="/dashboard/vendor?tab=analytics">View Analytics</Link>
                </Button>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Avg Rating</CardTitle>
                <TrendingUp className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">4.7</div>
                <p className="text-xs text-muted-foreground">18 reviews</p>
                <Button asChild variant="link" className="p-0 h-auto mt-2">
                  <Link href="/dashboard/vendor?tab=reviews">View Reviews</Link>
                </Button>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Active Services</CardTitle>
                <Store className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">8</div>
                <p className="text-xs text-muted-foreground">All available</p>
                <Button asChild variant="link" className="p-0 h-auto mt-2">
                  <Link href="/dashboard/vendor?tab=services">Manage Services</Link>
                </Button>
              </CardContent>
            </Card>
          </>
        )}

        {userRole === 'admin' && (
          <>
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Total Users</CardTitle>
                <Users className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">1,247</div>
                <p className="text-xs text-muted-foreground">+12.5% from last month</p>
                <Button asChild variant="link" className="p-0 h-auto mt-2">
                  <Link href="/dashboard/admin?tab=users">Manage Users</Link>
                </Button>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Total Vendors</CardTitle>
                <Store className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">89</div>
                <p className="text-xs text-muted-foreground">23 pending approval</p>
                <Button asChild variant="link" className="p-0 h-auto mt-2">
                  <Link href="/dashboard/admin?tab=vendors">Manage Vendors</Link>
                </Button>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Total Bookings</CardTitle>
                <Calendar className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">342</div>
                <p className="text-xs text-muted-foreground">This month</p>
                <Button asChild variant="link" className="p-0 h-auto mt-2">
                  <Link href="/dashboard/admin?tab=bookings">View Bookings</Link>
                </Button>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Platform Revenue</CardTitle>
                <TrendingUp className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">LKR 1,250,000</div>
                <p className="text-xs text-muted-foreground">This month</p>
                <Button asChild variant="link" className="p-0 h-auto mt-2">
                  <Link href="/dashboard/admin?tab=analytics">View Analytics</Link>
                </Button>
              </CardContent>
            </Card>
          </>
        )}
      </div>

      {/* Role-based Recent Activity */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center">
              <TrendingUp className="h-5 w-5 mr-2" />
              Recent Activity
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {userRole === 'user' && (
                <>
                  <div className="flex items-center space-x-3">
                    <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                    <div className="flex-1">
                      <p className="text-sm font-medium">Venue booking confirmed</p>
                      <p className="text-xs text-gray-500">2 hours ago</p>
                    </div>
                  </div>
                  <div className="flex items-center space-x-3">
                    <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
                    <div className="flex-1">
                      <p className="text-sm font-medium">Photographer payment received</p>
                      <p className="text-xs text-gray-500">1 day ago</p>
                    </div>
                  </div>
                  <div className="flex items-center space-x-3">
                    <div className="w-2 h-2 bg-yellow-500 rounded-full"></div>
                    <div className="flex-1">
                      <p className="text-sm font-medium">Guest list updated</p>
                      <p className="text-xs text-gray-500">2 days ago</p>
                    </div>
                  </div>
                </>
              )}

              {userRole === 'vendor' && (
                <>
                  <div className="flex items-center space-x-3">
                    <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                    <div className="flex-1">
                      <p className="text-sm font-medium">New booking received</p>
                      <p className="text-xs text-gray-500">1 hour ago</p>
                    </div>
                  </div>
                  <div className="flex items-center space-x-3">
                    <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
                    <div className="flex-1">
                      <p className="text-sm font-medium">Payment received</p>
                      <p className="text-xs text-gray-500">3 hours ago</p>
                    </div>
                  </div>
                  <div className="flex items-center space-x-3">
                    <div className="w-2 h-2 bg-yellow-500 rounded-full"></div>
                    <div className="flex-1">
                      <p className="text-sm font-medium">New review posted</p>
                      <p className="text-xs text-gray-500">1 day ago</p>
                    </div>
                  </div>
                </>
              )}

              {userRole === 'admin' && (
                <>
                  <div className="flex items-center space-x-3">
                    <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                    <div className="flex-1">
                      <p className="text-sm font-medium">New vendor application</p>
                      <p className="text-xs text-gray-500">30 minutes ago</p>
                    </div>
                  </div>
                  <div className="flex items-center space-x-3">
                    <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
                    <div className="flex-1">
                      <p className="text-sm font-medium">User account suspended</p>
                      <p className="text-xs text-gray-500">2 hours ago</p>
                    </div>
                  </div>
                  <div className="flex items-center space-x-3">
                    <div className="w-2 h-2 bg-yellow-500 rounded-full"></div>
                    <div className="flex-1">
                      <p className="text-sm font-medium">System backup completed</p>
                      <p className="text-xs text-gray-500">6 hours ago</p>
                    </div>
                  </div>
                </>
              )}
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Quick Navigation</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {userRole === 'user' && (
                <>
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm font-medium">Wedding Planning</p>
                      <p className="text-xs text-gray-500">Manage your wedding details</p>
                    </div>
                    <Button size="sm" variant="outline" asChild>
                      <Link href="/planning">Go to Planning</Link>
                    </Button>
                  </div>
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm font-medium">Vendor Search</p>
                      <p className="text-xs text-gray-500">Find wedding services</p>
                    </div>
                    <Button size="sm" variant="outline" asChild>
                      <Link href="/vendors">Browse Vendors</Link>
                    </Button>
                  </div>
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm font-medium">Venue Search</p>
                      <p className="text-xs text-gray-500">Find wedding venues</p>
                    </div>
                    <Button size="sm" variant="outline" asChild>
                      <Link href="/venues">Browse Venues</Link>
                    </Button>
                  </div>
                </>
              )}

              {userRole === 'vendor' && (
                <>
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm font-medium">Service Management</p>
                      <p className="text-xs text-gray-500">Manage your services</p>
                    </div>
                    <Button size="sm" variant="outline" asChild>
                      <Link href="/dashboard/vendor?tab=services">Manage Services</Link>
                    </Button>
                  </div>
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm font-medium">Booking Calendar</p>
                      <p className="text-xs text-gray-500">View your schedule</p>
                    </div>
                    <Button size="sm" variant="outline" asChild>
                      <Link href="/dashboard/vendor?tab=calendar">View Calendar</Link>
                    </Button>
                  </div>
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm font-medium">Business Profile</p>
                      <p className="text-xs text-gray-500">Update your profile</p>
                    </div>
                    <Button size="sm" variant="outline" asChild>
                      <Link href="/dashboard/vendor/onboarding">Update Profile</Link>
                    </Button>
                  </div>
                </>
              )}

              {userRole === 'admin' && (
                <>
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm font-medium">User Management</p>
                      <p className="text-xs text-gray-500">Manage platform users</p>
                    </div>
                    <Button size="sm" variant="outline" asChild>
                      <Link href="/dashboard/admin?tab=users">Manage Users</Link>
                    </Button>
                  </div>
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm font-medium">Vendor Approval</p>
                      <p className="text-xs text-gray-500">Review applications</p>
                    </div>
                    <Button size="sm" variant="outline" asChild>
                      <Link href="/dashboard/admin?tab=vendors">Review Vendors</Link>
                    </Button>
                  </div>
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm font-medium">Platform Analytics</p>
                      <p className="text-xs text-gray-500">View system stats</p>
                    </div>
                    <Button size="sm" variant="outline" asChild>
                      <Link href="/dashboard/admin?tab=analytics">View Analytics</Link>
                    </Button>
                  </div>
                </>
              )}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
} 