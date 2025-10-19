"use client"

import { SidebarProvider, SidebarMenu, SidebarMenuButton, SidebarMenuItem, SidebarContent, SidebarHeader, SidebarFooter } from "@/components/ui/sidebar"
import { motion } from "framer-motion"
import { useState } from "react"
import { 
  Home, 
  Users, 
  Store, 
  ClipboardList,
  Settings, 
  Bell, 
  BarChart3,
  Shield,
  UserCheck,
  UserX,
  Trash2,
  CheckCircle,
  AlertCircle,
  Crown
} from "lucide-react"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"

export default function AdminDashboardPage() {
  // Mock admin data
  const adminProfile = {
    name: "Admin User",
    email: "admin@weddinglk.com",
    avatar: "/placeholder.svg?height=40&width=40",
    role: "admin"
  }

  // Admin statistics
  const stats = [
    { label: "Total Users", value: "1,247", change: "+12%", icon: Users, color: "text-blue-600" },
    { label: "Active Vendors", value: "89", change: "+8%", icon: Store, color: "text-green-600" },
    { label: "Total Bookings", value: "156", change: "+25%", icon: ClipboardList, color: "text-purple-600" },
    { label: "System Health", value: "99.9%", change: "+0.1%", icon: Shield, color: "text-yellow-600" }
  ]

  const [users, setUsers] = useState([
    { id: 1, name: "Arjun Mendis", email: "arjun@example.com", role: "user", status: "active" },
    { id: 2, name: "Priya Raj", email: "priya@example.com", role: "vendor", status: "pending" },
    { id: 3, name: "Sarah Johnson", email: "sarah@example.com", role: "couple", status: "active" },
    { id: 4, name: "Michael Chen", email: "michael@example.com", role: "planner", status: "active" }
  ])

  const [vendors, setVendors] = useState([
    { id: 1, name: "Perfect Moments Photography", email: "info@perfectmoments.lk", status: "active", category: "Photography" },
    { id: 2, name: "Delicious Catering Co.", email: "orders@deliciouscatering.lk", status: "pending", category: "Catering" },
    { id: 3, name: "Melody Makers DJ", email: "contact@melodymakers.lk", status: "active", category: "Entertainment" },
    { id: 4, name: "Blissful Blooms", email: "hello@blissfulblooms.lk", status: "pending", category: "Floral Design" }
  ])

  const [bookings, setBookings] = useState([
    { id: 1, client: "Sarah & Michael", vendor: "Perfect Moments", date: "2024-07-15", status: "pending", service: "Wedding Photography" },
    { id: 2, client: "Priya & Raj", vendor: "Delicious Catering", date: "2024-08-10", status: "confirmed", service: "Wedding Catering" },
    { id: 3, client: "Emma & David", vendor: "Melody Makers DJ", date: "2024-09-05", status: "confirmed", service: "Wedding Entertainment" },
    { id: 4, client: "Lisa & Mark", vendor: "Blissful Blooms", date: "2024-10-12", status: "pending", service: "Wedding Florals" }
  ])

  const handleUserAction = (userId: number, action: string) => {
    if (action === "suspend") {
      setUsers(users.map(user => 
        user.id === userId ? { ...user, status: "suspended" } : user
      ))
    } else if (action === "delete") {
      setUsers(users.filter(user => user.id !== userId))
    }
  }

  const handleVendorAction = (vendorId: number, action: string) => {
    if (action === "approve") {
      setVendors(vendors.map(vendor => 
        vendor.id === vendorId ? { ...vendor, status: "active" } : vendor
      ))
    } else if (action === "delete") {
      setVendors(vendors.filter(vendor => vendor.id !== vendorId))
    }
  }

  const handleBookingAction = (bookingId: number, action: string) => {
    if (action === "confirm") {
      setBookings(bookings.map(booking => 
        booking.id === bookingId ? { ...booking, status: "confirmed" } : booking
      ))
    } else if (action === "delete") {
      setBookings(bookings.filter(booking => booking.id !== bookingId))
    }
  }

  return (
    <SidebarProvider>
      <div className="flex h-screen bg-gray-50 dark:bg-gray-900">
        {/* Sidebar */}
        <SidebarContent className="bg-white dark:bg-gray-800 border-r border-gray-200 dark:border-gray-700">
          <SidebarHeader className="p-6 border-b border-gray-200 dark:border-gray-700">
            <div className="flex items-center space-x-3">
              <div className="w-8 h-8 bg-gradient-to-r from-red-500 to-orange-600 rounded-lg flex items-center justify-center">
                <Crown className="h-5 w-5 text-white" />
              </div>
              <div>
                <h2 className="text-lg font-semibold text-gray-900 dark:text-white">Admin Portal</h2>
                <p className="text-sm text-gray-500 dark:text-gray-400">System Management</p>
              </div>
            </div>
          </SidebarHeader>
          
          <div className="flex-1 overflow-y-auto p-4">
            <SidebarMenu>
              <SidebarMenuItem>
                <SidebarMenuButton className="w-full justify-start" isActive>
                  <Home className="h-4 w-4" />
                  <span>Dashboard</span>
                </SidebarMenuButton>
              </SidebarMenuItem>
              
              <SidebarMenuItem>
                <SidebarMenuButton className="w-full justify-start">
                  <Users className="h-4 w-4" />
                  <span>User Management</span>
                </SidebarMenuButton>
              </SidebarMenuItem>
              
              <SidebarMenuItem>
                <SidebarMenuButton className="w-full justify-start">
                  <Store className="h-4 w-4" />
                  <span>Vendor Management</span>
                </SidebarMenuButton>
              </SidebarMenuItem>
              
              <SidebarMenuItem>
                <SidebarMenuButton className="w-full justify-start">
                  <ClipboardList className="h-4 w-4" />
                  <span>Booking Management</span>
                </SidebarMenuButton>
              </SidebarMenuItem>
              
              <SidebarMenuItem>
                <SidebarMenuButton className="w-full justify-start">
                  <BarChart3 className="h-4 w-4" />
                  <span>Analytics & Reports</span>
                </SidebarMenuButton>
              </SidebarMenuItem>
              
              <SidebarMenuItem>
                <SidebarMenuButton className="w-full justify-start">
                  <Shield className="h-4 w-4" />
                  <span>Security & Compliance</span>
                </SidebarMenuButton>
              </SidebarMenuItem>
              
              <SidebarMenuItem>
                <SidebarMenuButton className="w-full justify-start">
                  <Bell className="h-4 w-4" />
                  <span>System Notifications</span>
                </SidebarMenuButton>
              </SidebarMenuItem>
              
              <SidebarMenuItem>
                <SidebarMenuButton className="w-full justify-start">
                  <Settings className="h-4 w-4" />
                  <span>System Settings</span>
                </SidebarMenuButton>
              </SidebarMenuItem>
            </SidebarMenu>
          </div>
          
          <SidebarFooter className="p-4 border-t border-gray-200 dark:border-gray-700">
            <div className="flex items-center space-x-3">
              <img 
                src={adminProfile.avatar} 
                alt={adminProfile.name}
                className="w-8 h-8 rounded-full"
              />
              <div className="flex-1 min-w-0">
                <p className="text-sm font-medium text-gray-900 dark:text-white truncate">
                  {adminProfile.name}
                </p>
                <p className="text-xs text-gray-500 dark:text-gray-400 truncate">
                  {adminProfile.email}
                </p>
              </div>
            </div>
          </SidebarFooter>
        </SidebarContent>

        {/* Main Content */}
        <div className="flex-1 overflow-y-auto">
          <div className="p-6">
            {/* Header */}
            <div className="mb-8">
              <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-2">
                Admin Panel
              </h1>
              <p className="text-gray-600 dark:text-gray-400">
                Manage users, vendors, bookings, and system operations.
              </p>
            </div>

            {/* Statistics Cards */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
              {stats.map((stat, index) => (
                <motion.div
                  key={stat.label}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.1 }}
                >
                  <Card>
                    <CardContent className="p-6">
                      <div className="flex items-center justify-between">
                        <div>
                          <p className="text-sm font-medium text-gray-600 dark:text-gray-400">
                            {stat.label}
                          </p>
                          <p className="text-2xl font-bold text-gray-900 dark:text-white">
                            {stat.value}
                          </p>
                          <p className="text-xs text-green-600">
                            {stat.change}
                          </p>
                        </div>
                        <div className={`p-3 rounded-lg bg-gray-100 dark:bg-gray-700`}>
                          <stat.icon className={`h-6 w-6 ${stat.color}`} />
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                </motion.div>
              ))}
            </div>

            {/* Management Tabs */}
            <Tabs defaultValue="users" className="w-full">
              <TabsList className="mb-6">
                <TabsTrigger value="users">
                  <Users className="inline mr-2 h-4 w-4" />
                  Users
                </TabsTrigger>
                <TabsTrigger value="vendors">
                  <Store className="inline mr-2 h-4 w-4" />
                  Vendors
                </TabsTrigger>
                <TabsTrigger value="bookings">
                  <ClipboardList className="inline mr-2 h-4 w-4" />
                  Bookings
                </TabsTrigger>
              </TabsList>

              {/* Users Tab */}
              <TabsContent value="users">
                <Card>
                  <CardHeader>
                    <CardTitle>User Management</CardTitle>
                    <CardDescription>
                      Manage user accounts and permissions
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    <Table>
                      <TableHeader>
                        <TableRow>
                          <TableHead>Name</TableHead>
                          <TableHead>Email</TableHead>
                          <TableHead>Role</TableHead>
                          <TableHead>Status</TableHead>
                          <TableHead>Actions</TableHead>
                        </TableRow>
                      </TableHeader>
                      <TableBody>
                        {users.map((user) => (
                          <TableRow key={user.id}>
                            <TableCell className="font-medium">{user.name}</TableCell>
                            <TableCell>{user.email}</TableCell>
                            <TableCell>
                              <Badge variant="secondary">{user.role}</Badge>
                            </TableCell>
                            <TableCell>
                              <Badge 
                                variant={user.status === 'active' ? 'default' : user.status === 'suspended' ? 'destructive' : 'secondary'}
                              >
                                {user.status}
                              </Badge>
                            </TableCell>
                            <TableCell>
                              <div className="flex space-x-2">
                                <Button 
                                  size="sm" 
                                  variant="outline"
                                  onClick={() => handleUserAction(user.id, "suspend")}
                                >
                                  <UserX className="h-4 w-4 mr-1" />
                                  Suspend
                                </Button>
                                <Button 
                                  size="sm" 
                                  variant="destructive"
                                  onClick={() => handleUserAction(user.id, "delete")}
                                >
                                  <Trash2 className="h-4 w-4 mr-1" />
                                  Delete
                                </Button>
                              </div>
                            </TableCell>
                          </TableRow>
                        ))}
                      </TableBody>
                    </Table>
                  </CardContent>
                </Card>
              </TabsContent>

              {/* Vendors Tab */}
              <TabsContent value="vendors">
                <Card>
                  <CardHeader>
                    <CardTitle>Vendor Management</CardTitle>
                    <CardDescription>
                      Manage vendor accounts and approvals
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    <Table>
                      <TableHeader>
                        <TableRow>
                          <TableHead>Name</TableHead>
                          <TableHead>Email</TableHead>
                          <TableHead>Category</TableHead>
                          <TableHead>Status</TableHead>
                          <TableHead>Actions</TableHead>
                        </TableRow>
                      </TableHeader>
                      <TableBody>
                        {vendors.map((vendor) => (
                          <TableRow key={vendor.id}>
                            <TableCell className="font-medium">{vendor.name}</TableCell>
                            <TableCell>{vendor.email}</TableCell>
                            <TableCell>
                              <Badge variant="outline">{vendor.category}</Badge>
                            </TableCell>
                            <TableCell>
                              <Badge 
                                variant={vendor.status === 'active' ? 'default' : 'secondary'}
                              >
                                {vendor.status}
                              </Badge>
                            </TableCell>
                            <TableCell>
                              <div className="flex space-x-2">
                                <Button 
                                  size="sm" 
                                  variant="outline"
                                  onClick={() => handleVendorAction(vendor.id, "approve")}
                                >
                                  <UserCheck className="h-4 w-4 mr-1" />
                                  Approve
                                </Button>
                                <Button 
                                  size="sm" 
                                  variant="destructive"
                                  onClick={() => handleVendorAction(vendor.id, "delete")}
                                >
                                  <Trash2 className="h-4 w-4 mr-1" />
                                  Delete
                                </Button>
                              </div>
                            </TableCell>
                          </TableRow>
                        ))}
                      </TableBody>
                    </Table>
                  </CardContent>
                </Card>
              </TabsContent>

              {/* Bookings Tab */}
              <TabsContent value="bookings">
                <Card>
                  <CardHeader>
                    <CardTitle>Booking Management</CardTitle>
                    <CardDescription>
                      Manage wedding bookings and confirmations
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    <Table>
                      <TableHeader>
                        <TableRow>
                          <TableHead>Client</TableHead>
                          <TableHead>Vendor</TableHead>
                          <TableHead>Service</TableHead>
                          <TableHead>Date</TableHead>
                          <TableHead>Status</TableHead>
                          <TableHead>Actions</TableHead>
                        </TableRow>
                      </TableHeader>
                      <TableBody>
                        {bookings.map((booking) => (
                          <TableRow key={booking.id}>
                            <TableCell className="font-medium">{booking.client}</TableCell>
                            <TableCell>{booking.vendor}</TableCell>
                            <TableCell>
                              <Badge variant="outline">{booking.service}</Badge>
                            </TableCell>
                            <TableCell>{booking.date}</TableCell>
                            <TableCell>
                              <Badge 
                                variant={booking.status === 'confirmed' ? 'default' : 'secondary'}
                              >
                                {booking.status}
                              </Badge>
                            </TableCell>
                            <TableCell>
                              <div className="flex space-x-2">
                                <Button 
                                  size="sm" 
                                  variant="outline"
                                  onClick={() => handleBookingAction(booking.id, "confirm")}
                                >
                                  <CheckCircle className="h-4 w-4 mr-1" />
                                  Confirm
                                </Button>
                                <Button 
                                  size="sm" 
                                  variant="destructive"
                                  onClick={() => handleBookingAction(booking.id, "delete")}
                                >
                                  <Trash2 className="h-4 w-4 mr-1" />
                                  Delete
                                </Button>
                              </div>
                            </TableCell>
                          </TableRow>
                        ))}
                      </TableBody>
                    </Table>
                  </CardContent>
                </Card>
              </TabsContent>
            </Tabs>
          </div>
        </div>
      </div>
    </SidebarProvider>
  )
}