"use client"

import { SidebarProvider, SidebarMenu, SidebarMenuButton, SidebarMenuItem, SidebarContent, SidebarHeader, SidebarFooter } from "@/components/ui/sidebar"
import { motion } from "framer-motion"
import { useState } from "react"
import { 
  Home, 
  Users, 
  ListChecks, 
  BarChart2,
  Settings, 
  Bell, 
  Calendar,
  CheckCircle,
  Clock,
  Plus,
  Edit,
  Trash2,
  ClipboardList
} from "lucide-react"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"

export default function PlannerDashboardPage() {
  // Mock planner data
  const plannerProfile = {
    name: "Wedding Planner Pro",
    email: "planner@weddinglk.com",
    avatar: "/placeholder.svg?height=40&width=40",
    role: "planner"
  }

  // Planner statistics
  const stats = [
    { label: "Active Clients", value: "12", change: "+3", icon: Users, color: "text-blue-600" },
    { label: "Tasks Completed", value: "34", change: "+12", icon: CheckCircle, color: "text-green-600" },
    { label: "Upcoming Weddings", value: "4", change: "+1", icon: Calendar, color: "text-purple-600" },
    { label: "Success Rate", value: "98%", change: "+2%", icon: BarChart2, color: "text-yellow-600" }
  ]

  const [tasks, setTasks] = useState([
    { id: 1, task: "Venue Visit with Sarah & Michael", date: "2024-06-20", status: "pending", client: "Sarah & Michael" },
    { id: 2, task: "Menu Tasting for Priya & Raj", date: "2024-07-01", status: "pending", client: "Priya & Raj" },
    { id: 3, task: "Dress Fitting for Emma & David", date: "2024-07-10", status: "done", client: "Emma & David" }
  ])

  const [clients, setClients] = useState([
    { id: 1, name: "Sarah & Michael", email: "sarah.michael@example.com", weddingDate: "2024-08-15", status: "active" },
    { id: 2, name: "Priya & Raj", email: "priya.raj@example.com", weddingDate: "2024-09-20", status: "active" },
    { id: 3, name: "Emma & David", email: "emma.david@example.com", weddingDate: "2024-10-10", status: "planning" }
  ])

  const handleTaskStatus = (taskId: number) => {
    setTasks(tasks.map(task => 
      task.id === taskId ? { ...task, status: task.status === 'pending' ? 'done' : 'pending' } : task
    ))
  }

  return (
    <SidebarProvider>
      <div className="flex h-screen bg-gray-50 dark:bg-gray-900">
        {/* Sidebar */}
        <SidebarContent className="bg-white dark:bg-gray-800 border-r border-gray-200 dark:border-gray-700">
          <SidebarHeader className="p-6 border-b border-gray-200 dark:border-gray-700">
            <div className="flex items-center space-x-3">
              <div className="w-8 h-8 bg-gradient-to-r from-blue-500 to-green-600 rounded-lg flex items-center justify-center">
                <Calendar className="h-5 w-5 text-white" />
              </div>
              <div>
                <h2 className="text-lg font-semibold text-gray-900 dark:text-white">Planner Portal</h2>
                <p className="text-sm text-gray-500 dark:text-gray-400">Wedding Management</p>
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
                  <span>Client Management</span>
                </SidebarMenuButton>
              </SidebarMenuItem>
              
              <SidebarMenuItem>
                <SidebarMenuButton className="w-full justify-start">
                  <ListChecks className="h-4 w-4" />
                  <span>Task Management</span>
                </SidebarMenuButton>
              </SidebarMenuItem>
              
              <SidebarMenuItem>
                <SidebarMenuButton className="w-full justify-start">
                  <Calendar className="h-4 w-4" />
                  <span>Wedding Timeline</span>
                </SidebarMenuButton>
              </SidebarMenuItem>
              
              <SidebarMenuItem>
                <SidebarMenuButton className="w-full justify-start">
                  <BarChart2 className="h-4 w-4" />
                  <span>Analytics</span>
                </SidebarMenuButton>
              </SidebarMenuItem>
              
              <SidebarMenuItem>
                <SidebarMenuButton className="w-full justify-start">
                  <Bell className="h-4 w-4" />
                  <span>Notifications</span>
                </SidebarMenuButton>
              </SidebarMenuItem>
              
              <SidebarMenuItem>
                <SidebarMenuButton className="w-full justify-start">
                  <Settings className="h-4 w-4" />
                  <span>Settings</span>
                </SidebarMenuButton>
              </SidebarMenuItem>
            </SidebarMenu>
          </div>
          
          <SidebarFooter className="p-4 border-t border-gray-200 dark:border-gray-700">
            <div className="flex items-center space-x-3">
              <img 
                src={plannerProfile.avatar} 
                alt={plannerProfile.name}
                className="w-8 h-8 rounded-full"
              />
              <div className="flex-1 min-w-0">
                <p className="text-sm font-medium text-gray-900 dark:text-white truncate">
                  {plannerProfile.name}
                </p>
                <p className="text-xs text-gray-500 dark:text-gray-400 truncate">
                  {plannerProfile.email}
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
                Planner Dashboard
              </h1>
              <p className="text-gray-600 dark:text-gray-400">
                Manage your wedding planning clients and tasks efficiently.
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
            <Tabs defaultValue="clients" className="w-full">
              <TabsList className="mb-6">
                <TabsTrigger value="clients">
                  <Users className="inline mr-2 h-4 w-4" />
                  Clients
                </TabsTrigger>
                <TabsTrigger value="tasks">
                  <ListChecks className="inline mr-2 h-4 w-4" />
                  Tasks
                </TabsTrigger>
                <TabsTrigger value="analytics">
                  <BarChart2 className="inline mr-2 h-4 w-4" />
                  Analytics
                </TabsTrigger>
              </TabsList>

              {/* Clients Tab */}
              <TabsContent value="clients">
                <Card>
                  <CardHeader>
                    <CardTitle>Client Management</CardTitle>
                    <CardDescription>
                      Manage your wedding planning clients
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    <Table>
                      <TableHeader>
                        <TableRow>
                          <TableHead>Client</TableHead>
                          <TableHead>Email</TableHead>
                          <TableHead>Wedding Date</TableHead>
                          <TableHead>Status</TableHead>
                          <TableHead>Actions</TableHead>
                        </TableRow>
                      </TableHeader>
                      <TableBody>
                        {clients.map((client) => (
                          <TableRow key={client.id}>
                            <TableCell className="font-medium">{client.name}</TableCell>
                            <TableCell>{client.email}</TableCell>
                            <TableCell>{client.weddingDate}</TableCell>
                            <TableCell>
                              <Badge 
                                variant={client.status === 'active' ? 'default' : 'secondary'}
                              >
                                {client.status}
                              </Badge>
                            </TableCell>
                            <TableCell>
                              <div className="flex space-x-2">
                                <Button size="sm" variant="outline">
                                  <Edit className="h-4 w-4 mr-1" />
                                  Edit
                                </Button>
                                <Button size="sm" variant="outline">
                                  <ClipboardList className="h-4 w-4 mr-1" />
                                  Tasks
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

              {/* Tasks Tab */}
              <TabsContent value="tasks">
                <Card>
                  <CardHeader>
                    <CardTitle>Task Management</CardTitle>
                    <CardDescription>
                      Track and manage wedding planning tasks
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    <Table>
                      <TableHeader>
                        <TableRow>
                          <TableHead>Task</TableHead>
                          <TableHead>Client</TableHead>
                          <TableHead>Date</TableHead>
                          <TableHead>Status</TableHead>
                          <TableHead>Actions</TableHead>
                        </TableRow>
                      </TableHeader>
                      <TableBody>
                        {tasks.map((task) => (
                          <TableRow key={task.id}>
                            <TableCell className="font-medium">{task.task}</TableCell>
                            <TableCell>{task.client}</TableCell>
                            <TableCell>{task.date}</TableCell>
                            <TableCell>
                              <Badge 
                                variant={task.status === 'done' ? 'default' : 'secondary'}
                              >
                                {task.status}
                              </Badge>
                            </TableCell>
                            <TableCell>
                              <div className="flex space-x-2">
                                <Button 
                                  size="sm" 
                                  variant="outline"
                                  onClick={() => handleTaskStatus(task.id)}
                                >
                                  {task.status === 'pending' ? (
                                    <>
                                      <CheckCircle className="h-4 w-4 mr-1" />
                                      Mark Done
                                    </>
                                  ) : (
                                    <>
                                      <Clock className="h-4 w-4 mr-1" />
                                      Mark Pending
                                    </>
                                  )}
                                </Button>
                                <Button size="sm" variant="outline">
                                  <Edit className="h-4 w-4 mr-1" />
                                  Edit
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

              {/* Analytics Tab */}
              <TabsContent value="analytics">
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                  <Card>
                    <CardHeader>
                      <CardTitle className="text-lg">Total Clients</CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="text-3xl font-bold">12</div>
                    </CardContent>
                  </Card>
                  <Card>
                    <CardHeader>
                      <CardTitle className="text-lg">Tasks Completed</CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="text-3xl font-bold">34</div>
                    </CardContent>
                  </Card>
                  <Card>
                    <CardHeader>
                      <CardTitle className="text-lg">Upcoming Weddings</CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="text-3xl font-bold">4</div>
                    </CardContent>
                  </Card>
                </div>
              </TabsContent>
            </Tabs>
          </div>
        </div>
      </div>
    </SidebarProvider>
  )
}