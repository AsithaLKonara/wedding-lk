"use client"

import { MainLayout } from "@/components/templates/main-layout"
import { useState } from "react"
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Input } from "@/components/ui/input"
import { 
  Bell, 
  Search, 
  Filter, 
  Check, 
  X, 
  Heart, 
  Calendar, 
  MessageCircle, 
  Star, 
  Gift,
  AlertCircle,
  Info,
  CheckCircle,
  Clock
} from "lucide-react"
import { motion } from "framer-motion"

interface Notification {
  id: string
  title: string
  message: string
  type: 'booking' | 'message' | 'reminder' | 'promotion' | 'system'
  timestamp: Date
  read: boolean
  priority: 'high' | 'medium' | 'low'
  actionUrl?: string
  actionText?: string
}

export default function NotificationsPage() {
  const [searchQuery, setSearchQuery] = useState('')
  const [filterType, setFilterType] = useState<'all' | 'unread' | 'booking' | 'message' | 'reminder' | 'promotion' | 'system'>('all')
  const [notifications, setNotifications] = useState<Notification[]>([
    {
      id: '1',
      title: 'New Booking Confirmation',
      message: 'Your booking at Grand Ballroom Hotel for March 15, 2024 has been confirmed.',
      type: 'booking',
      timestamp: new Date(Date.now() - 1000 * 60 * 30), // 30 minutes ago
      read: false,
      priority: 'high',
      actionUrl: '/dashboard/bookings',
      actionText: 'View Booking'
    },
    {
      id: '2',
      title: 'Photography Quote Ready',
      message: 'Elegant Photography Studio has sent you a custom quote for your wedding.',
      type: 'message',
      timestamp: new Date(Date.now() - 1000 * 60 * 60 * 2), // 2 hours ago
      read: false,
      priority: 'medium',
      actionUrl: '/messages',
      actionText: 'View Quote'
    },
    {
      id: '3',
      title: 'Wedding Planning Reminder',
      message: 'Don\'t forget to finalize your catering menu by next week.',
      type: 'reminder',
      timestamp: new Date(Date.now() - 1000 * 60 * 60 * 6), // 6 hours ago
      read: true,
      priority: 'medium',
      actionUrl: '/dashboard/planner',
      actionText: 'View Planner'
    },
    {
      id: '4',
      title: 'Special Promotion Available',
      message: 'Get 20% off on floral arrangements this month. Limited time offer!',
      type: 'promotion',
      timestamp: new Date(Date.now() - 1000 * 60 * 60 * 24), // 1 day ago
      read: true,
      priority: 'low',
      actionUrl: '/vendors?category=flowers',
      actionText: 'View Offer'
    },
    {
      id: '5',
      title: 'System Maintenance',
      message: 'Scheduled maintenance will occur tonight from 2 AM to 4 AM. Some features may be temporarily unavailable.',
      type: 'system',
      timestamp: new Date(Date.now() - 1000 * 60 * 60 * 24 * 2), // 2 days ago
      read: true,
      priority: 'low'
    },
    {
      id: '6',
      title: 'Vendor Review Request',
      message: 'Please rate your experience with Hearing Photography Studio.',
      type: 'system',
      timestamp: new Date(Date.now() - 1000 * 60 * 60 * 24 * 3), // 3 days ago
      read: false,
      priority: 'medium',
      actionUrl: '/reviews/write',
      actionText: 'Write Review'
    }
  ])

  const getNotificationIcon = (type: string) => {
    switch (type) {
      case 'booking':
        return <Calendar className="w-5 h-5 text-green-500" />
      case 'message':
        return <MessageCircle className="w-5 h-5 text-blue-500" />
      case 'reminder':
        return <Clock className="w-5 h-5 text-orange-500" />
      case 'promotion':
        return <Gift className="w-5 h-5 text-purple-500" />
      case 'system':
        return <Info className="w-5 h-5 text-gray-500" />
      default:
        return <Bell className="w-5 h-5 text-gray-500" />
    }
  }

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'high':
        return 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200'
      case 'medium':
        return 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200'
      case 'low':
        return 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200'
      default:
        return 'bg-gray-100 text-gray-800 dark:bg-gray-900 dark:text-gray-200'
    }
  }

  const markAsRead = (id: string) => {
    setNotifications(prev => 
      prev.map(notification => 
        notification.id === id 
          ? { ...notification, read: true }
          : notification
      )
    )
  }

  const markAllAsRead = () => {
    setNotifications(prev => 
      prev.map(notification => ({ ...notification, read: true }))
    )
  }

  const deleteNotification = (id: string) => {
    setNotifications(prev => prev.filter(notification => notification.id !== id))
  }

  const filteredNotifications = notifications.filter(notification => {
    const matchesSearch = notification.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         notification.message.toLowerCase().includes(searchQuery.toLowerCase())
    
    const matchesFilter = filterType === 'all' || 
                         (filterType === 'unread' && !notification.read) ||
                         notification.type === filterType
    
    return matchesSearch && matchesFilter
  })

  const unreadCount = notifications.filter(n => !n.read).length

  return (
    <MainLayout>
      <div className="min-h-screen bg-gray-50 dark:bg-gray-900 py-8">
        <div className="container mx-auto px-4 max-w-4xl">
          {/* Header */}
          <div className="flex items-center justify-between mb-8">
            <div>
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6 }}
              >
                <div className="flex items-center gap-2 mb-2">
                  <Bell className="h-8 w-8 text-blue-500" />
                  <h1 className="text-4xl font-bold text-gray-900 dark:text-white">
                    Notifications
                  </h1>
                  {unreadCount > 0 && (
                    <Badge className="bg-red-500 text-white">
                      {unreadCount}
                    </Badge>
                  )}
                </div>
                <p className="text-lg text-gray-600 dark:text-gray-400">
                  Stay updated with your wedding planning progress
                </p>
              </motion.div>
            </div>
            
            <div className="flex gap-2">
              <Button 
                variant="outline" 
                size="sm"
                onClick={markAllAsRead}
                disabled={unreadCount === 0}
              >
                <Check className="w-4 h-4 mr-2" />
                Mark All Read
              </Button>
            </div>
          </div>

          {/* Search and Filter */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="mb-6"
          >
            <Card>
              <CardContent className="pt-6">
                <div className="flex flex-col md:flex-row gap-4">
                  <div className="flex-1 relative">
                    <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                    <Input
                      placeholder="Search notifications..."
                      value={searchQuery}
                      onChange={(e) => setSearchQuery(e.target.value)}
                      className="pl-10"
                    />
                  </div>
                  
                  <div className="flex gap-2">
                    <select
                      value={filterType}
                      onChange={(e) => setFilterType(e.target.value as any)}
                      className="px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md bg-white dark:bg-gray-800 text-gray-900 dark:text-white"
                    >
                      <option value="all">All Notifications</option>
                      <option value="unread">Unread Only</option>
                      <option value="booking">Bookings</option>
                      <option value="message">Messages</option>
                      <option value="reminder">Reminders</option>
                      <option value="promotion">Promotions</option>
                      <option value="system">System</option>
                    </select>
                  </div>
                </div>
              </CardContent>
            </Card>
          </motion.div>

          {/* Notifications List */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.4 }}
            className="space-y-4"
          >
            {filteredNotifications.length === 0 ? (
              <Card>
                <CardContent className="pt-6 text-center py-12">
                  <Bell className="h-16 w-16 text-gray-400 mx-auto mb-4" />
                  <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-2">
                    No notifications found
                  </h3>
                  <p className="text-gray-600 dark:text-gray-400">
                    {searchQuery || filterType !== 'all' 
                      ? 'Try adjusting your search or filter criteria.'
                      : 'You\'re all caught up! New notifications will appear here.'
                    }
                  </p>
                </CardContent>
              </Card>
            ) : (
              filteredNotifications.map((notification, index) => (
                <motion.div
                  key={notification.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.3, delay: index * 0.1 }}
                >
                  <Card className={`${!notification.read ? 'border-l-4 border-l-blue-500 bg-blue-50 dark:bg-blue-900/20' : ''}`}>
                    <CardContent className="pt-6">
                      <div className="flex items-start gap-4">
                        <div className="flex-shrink-0">
                          {getNotificationIcon(notification.type)}
                        </div>
                        
                        <div className="flex-1 min-w-0">
                          <div className="flex items-start justify-between">
                            <div className="flex-1">
                              <div className="flex items-center gap-2 mb-1">
                                <h3 className={`text-lg font-semibold ${!notification.read ? 'text-gray-900 dark:text-white' : 'text-gray-600 dark:text-gray-400'}`}>
                                  {notification.title}
                                </h3>
                                <Badge className={getPriorityColor(notification.priority)}>
                                  {notification.priority}
                                </Badge>
                              </div>
                              
                              <p className={`text-gray-600 dark:text-gray-400 mb-2 ${!notification.read ? 'font-medium' : ''}`}>
                                {notification.message}
                              </p>
                              
                              <div className="flex items-center gap-4 text-sm text-gray-500 dark:text-gray-400">
                                <span>{notification.timestamp.toLocaleString()}</span>
                                {notification.actionUrl && notification.actionText && (
                                  <Button 
                                    variant="link" 
                                    size="sm" 
                                    className="p-0 h-auto text-blue-600 hover:text-blue-800"
                                  >
                                    {notification.actionText}
                                  </Button>
                                )}
                              </div>
                            </div>
                            
                            <div className="flex items-center gap-2 ml-4">
                              {!notification.read && (
                                <Button
                                  variant="ghost"
                                  size="sm"
                                  onClick={() => markAsRead(notification.id)}
                                  className="text-green-600 hover:text-green-800"
                                >
                                  <Check className="w-4 h-4" />
                                </Button>
                              )}
                              
                              <Button
                                variant="ghost"
                                size="sm"
                                onClick={() => deleteNotification(notification.id)}
                                className="text-red-600 hover:text-red-800"
                              >
                                <X className="w-4 h-4" />
                              </Button>
                            </div>
                          </div>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                </motion.div>
              ))
            )}
          </motion.div>

          {/* Stats */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.6 }}
            className="mt-8"
          >
            <Card>
              <CardHeader>
                <CardTitle>Notification Summary</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                  <div className="text-center">
                    <div className="text-2xl font-bold text-blue-600">{unreadCount}</div>
                    <div className="text-sm text-gray-600 dark:text-gray-400">Unread</div>
                  </div>
                  <div className="text-center">
                    <div className="text-2xl font-bold text-green-600">{notifications.filter(n => n.read).length}</div>
                    <div className="text-sm text-gray-600 dark:text-gray-400">Read</div>
                  </div>
                  <div className="text-center">
                    <div className="text-2xl font-bold text-purple-600">{notifications.filter(n => n.type === 'booking').length}</div>
                    <div className="text-sm text-gray-600 dark:text-gray-400">Bookings</div>
                  </div>
                  <div className="text-center">
                    <div className="text-2xl font-bold text-orange-600">{notifications.filter(n => n.type === 'message').length}</div>
                    <div className="text-sm text-gray-600 dark:text-gray-400">Messages</div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </motion.div>
        </div>
      </div>
    </MainLayout>
  )
}