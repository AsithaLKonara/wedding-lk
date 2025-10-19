"use client"

import { MainLayout } from "@/components/templates/main-layout"
import { useState, useEffect } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Input } from "@/components/ui/input"
import { Switch } from "@/components/ui/switch"
import { 
  Bell, 
  BellOff, 
  Search, 
  Filter,
  Mail,
  MessageCircle,
  Calendar,
  CreditCard,
  Star,
  Heart,
  AlertCircle,
  CheckCircle,
  Clock,
  Settings,
  Trash2,
  CheckCircle2
} from "lucide-react"

interface Notification {
  id: string
  type: 'booking' | 'message' | 'payment' | 'reminder' | 'review' | 'system'
  title: string
  message: string
  timestamp: Date
  isRead: boolean
  isImportant: boolean
  actionUrl?: string
  metadata?: any
}

export default function NotificationsPage() {
  const [notifications, setNotifications] = useState<Notification[]>([
    {
      id: '1',
      type: 'booking',
      title: 'New Booking Request',
      message: 'Sarah & John have requested to book your photography services for their wedding on June 15, 2024.',
      timestamp: new Date(Date.now() - 30 * 60 * 1000),
      isRead: false,
      isImportant: true,
      actionUrl: '/dashboard/vendor/bookings',
      metadata: { coupleName: 'Sarah & John', eventDate: '2024-06-15' }
    },
    {
      id: '2',
      type: 'message',
      title: 'New Message from Royal Garden Hotel',
      message: 'We have availability for your preferred date. Shall we schedule a site visit?',
      timestamp: new Date(Date.now() - 2 * 60 * 60 * 1000),
      isRead: false,
      isImportant: false,
      actionUrl: '/chat'
    },
    {
      id: '3',
      type: 'payment',
      title: 'Payment Received',
      message: 'Payment of LKR 120,000 has been received for your booking with Emma & David.',
      timestamp: new Date(Date.now() - 4 * 60 * 60 * 1000),
      isRead: true,
      isImportant: false,
      actionUrl: '/dashboard/payments'
    },
    {
      id: '4',
      type: 'reminder',
      title: 'Upcoming Wedding Reminder',
      message: 'You have a wedding photography session tomorrow at 10:00 AM with Nisha & Kumar.',
      timestamp: new Date(Date.now() - 6 * 60 * 60 * 1000),
      isRead: false,
      isImportant: true,
      actionUrl: '/dashboard/schedule'
    },
    {
      id: '5',
      type: 'review',
      title: 'New Review Received',
      message: 'Priya & Raj left a 5-star review for your photography services. "Absolutely amazing work!"',
      timestamp: new Date(Date.now() - 24 * 60 * 60 * 1000),
      isRead: true,
      isImportant: false,
      actionUrl: '/reviews'
    },
    {
      id: '6',
      type: 'system',
      title: 'Profile Update Required',
      message: 'Complete your vendor profile to get more bookings. You\'re missing portfolio images.',
      timestamp: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000),
      isRead: false,
      isImportant: false,
      actionUrl: '/dashboard/vendor/settings'
    }
  ])

  const [searchQuery, setSearchQuery] = useState('')
  const [filterType, setFilterType] = useState<string>('all')
  const [showUnreadOnly, setShowUnreadOnly] = useState(false)
  const [notificationSettings, setNotificationSettings] = useState({
    email: true,
    push: true,
    sms: false,
    bookingAlerts: true,
    messageAlerts: true,
    paymentAlerts: true,
    reminderAlerts: true,
    reviewAlerts: true,
    systemAlerts: false
  })

  const filteredNotifications = notifications.filter(notification => {
    const matchesSearch = notification.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         notification.message.toLowerCase().includes(searchQuery.toLowerCase())
    const matchesFilter = filterType === 'all' || notification.type === filterType
    const matchesUnread = !showUnreadOnly || !notification.isRead
    
    return matchesSearch && matchesFilter && matchesUnread
  })

  const unreadCount = notifications.filter(n => !n.isRead).length

  const getNotificationIcon = (type: string) => {
    switch (type) {
      case 'booking': return <Calendar className="h-4 w-4" />
      case 'message': return <MessageCircle className="h-4 w-4" />
      case 'payment': return <CreditCard className="h-4 w-4" />
      case 'reminder': return <Clock className="h-4 w-4" />
      case 'review': return <Star className="h-4 w-4" />
      case 'system': return <AlertCircle className="h-4 w-4" />
      default: return <Bell className="h-4 w-4" />
    }
  }

  const getNotificationColor = (type: string) => {
    switch (type) {
      case 'booking': return 'text-blue-500'
      case 'message': return 'text-green-500'
      case 'payment': return 'text-green-600'
      case 'reminder': return 'text-orange-500'
      case 'review': return 'text-yellow-500'
      case 'system': return 'text-gray-500'
      default: return 'text-gray-500'
    }
  }

  const markAsRead = (id: string) => {
    setNotifications(prev => 
      prev.map(notification => 
        notification.id === id 
          ? { ...notification, isRead: true }
          : notification
      )
    )
  }

  const markAllAsRead = () => {
    setNotifications(prev => 
      prev.map(notification => ({ ...notification, isRead: true }))
    )
  }

  const deleteNotification = (id: string) => {
    setNotifications(prev => prev.filter(notification => notification.id !== id))
  }

  const formatTime = (date: Date) => {
    const now = new Date()
    const diffTime = Math.abs(now.getTime() - date.getTime())
    const diffMinutes = Math.ceil(diffTime / (1000 * 60))
    const diffHours = Math.ceil(diffTime / (1000 * 60 * 60))
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24))

    if (diffMinutes < 60) return `${diffMinutes}m ago`
    if (diffHours < 24) return `${diffHours}h ago`
    if (diffDays < 7) return `${diffDays}d ago`
    return date.toLocaleDateString()
  }

  return (
    <MainLayout>
      <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
        <div className="container mx-auto px-4 py-8">
          <div className="max-w-6xl mx-auto">
            {/* Header */}
            <div className="flex justify-between items-center mb-8">
              <div>
                <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-2">
                  Notifications
                </h1>
                <p className="text-gray-600 dark:text-gray-400">
                  Stay updated with your wedding planning activities
                </p>
              </div>
              <div className="flex gap-3">
                {unreadCount > 0 && (
                  <Button variant="outline" onClick={markAllAsRead}>
                    <CheckCircle2 className="h-4 w-4 mr-2" />
                    Mark All Read
                  </Button>
                )}
                <Button variant="outline">
                  <Settings className="h-4 w-4 mr-2" />
                  Settings
                </Button>
              </div>
            </div>

            <div className="grid lg:grid-cols-4 gap-8">
              {/* Filters & Settings */}
              <div className="lg:col-span-1 space-y-6">
                {/* Search & Filters */}
                <Card>
                  <CardHeader>
                    <CardTitle className="text-lg">Filters</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="space-y-2">
                      <div className="relative">
                        <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                        <Input
                          placeholder="Search notifications..."
                          value={searchQuery}
                          onChange={(e) => setSearchQuery(e.target.value)}
                          className="pl-10"
                        />
                      </div>
                    </div>

                    <div className="space-y-2">
                      <label className="text-sm font-medium">Type</label>
                      <select
                        value={filterType}
                        onChange={(e) => setFilterType(e.target.value)}
                        className="w-full p-2 border border-gray-300 dark:border-gray-600 rounded-md bg-white dark:bg-gray-800"
                      >
                        <option value="all">All Types</option>
                        <option value="booking">Bookings</option>
                        <option value="message">Messages</option>
                        <option value="payment">Payments</option>
                        <option value="reminder">Reminders</option>
                        <option value="review">Reviews</option>
                        <option value="system">System</option>
                      </select>
                    </div>

                    <div className="flex items-center space-x-2">
                      <Switch
                        checked={showUnreadOnly}
                        onCheckedChange={setShowUnreadOnly}
                      />
                      <label className="text-sm">Unread only</label>
                    </div>
                  </CardContent>
                </Card>

                {/* Notification Settings */}
                <Card>
                  <CardHeader>
                    <CardTitle className="text-lg">Notification Settings</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="space-y-3">
                      <div className="flex items-center justify-between">
                        <span className="text-sm">Email Notifications</span>
                        <Switch
                          checked={notificationSettings.email}
                          onCheckedChange={(checked) => 
                            setNotificationSettings(prev => ({ ...prev, email: checked }))
                          }
                        />
                      </div>
                      <div className="flex items-center justify-between">
                        <span className="text-sm">Push Notifications</span>
                        <Switch
                          checked={notificationSettings.push}
                          onCheckedChange={(checked) => 
                            setNotificationSettings(prev => ({ ...prev, push: checked }))
                          }
                        />
                      </div>
                      <div className="flex items-center justify-between">
                        <span className="text-sm">SMS Notifications</span>
                        <Switch
                          checked={notificationSettings.sms}
                          onCheckedChange={(checked) => 
                            setNotificationSettings(prev => ({ ...prev, sms: checked }))
                          }
                        />
                      </div>
                    </div>

                    <div className="border-t pt-4">
                      <h4 className="font-medium text-sm mb-3">Alert Types</h4>
                      <div className="space-y-2">
                        {[
                          { key: 'bookingAlerts', label: 'Booking Alerts' },
                          { key: 'messageAlerts', label: 'Message Alerts' },
                          { key: 'paymentAlerts', label: 'Payment Alerts' },
                          { key: 'reminderAlerts', label: 'Reminder Alerts' },
                          { key: 'reviewAlerts', label: 'Review Alerts' },
                          { key: 'systemAlerts', label: 'System Alerts' }
                        ].map(({ key, label }) => (
                          <div key={key} className="flex items-center justify-between">
                            <span className="text-xs">{label}</span>
                            <Switch
                              checked={notificationSettings[key as keyof typeof notificationSettings]}
                              onCheckedChange={(checked) => 
                                setNotificationSettings(prev => ({ ...prev, [key]: checked }))
                              }
                            />
                          </div>
                        ))}
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </div>

              {/* Notifications List */}
              <div className="lg:col-span-3">
                <Card>
                  <CardHeader>
                    <div className="flex items-center justify-between">
                      <CardTitle className="flex items-center gap-2">
                        <Bell className="h-5 w-5" />
                        Notifications
                        {unreadCount > 0 && (
                          <Badge variant="destructive">{unreadCount} unread</Badge>
                        )}
                      </CardTitle>
                      <div className="flex gap-2">
                        <Button variant="outline" size="sm">
                          <Filter className="h-4 w-4 mr-2" />
                          Sort
                        </Button>
                      </div>
                    </div>
                  </CardHeader>
                  
                  <CardContent className="p-0">
                    {filteredNotifications.length === 0 ? (
                      <div className="text-center py-12">
                        <BellOff className="h-16 w-16 text-gray-400 mx-auto mb-4" />
                        <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">
                          No notifications found
                        </h3>
                        <p className="text-gray-600 dark:text-gray-400">
                          {searchQuery || filterType !== 'all' || showUnreadOnly
                            ? 'Try adjusting your filters to see more notifications.'
                            : 'You\'re all caught up! New notifications will appear here.'
                          }
                        </p>
                      </div>
                    ) : (
                      <div className="divide-y divide-gray-200 dark:divide-gray-700">
                        {filteredNotifications.map((notification) => (
                          <div
                            key={notification.id}
                            className={`p-4 hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors ${
                              !notification.isRead ? 'bg-blue-50/50 dark:bg-blue-900/10' : ''
                            }`}
                          >
                            <div className="flex items-start gap-3">
                              <div className={`p-2 rounded-full ${
                                notification.isImportant ? 'bg-red-100 dark:bg-red-900/20' : 'bg-gray-100 dark:bg-gray-800'
                              }`}>
                                <div className={getNotificationColor(notification.type)}>
                                  {getNotificationIcon(notification.type)}
                                </div>
                              </div>
                              
                              <div className="flex-1 min-w-0">
                                <div className="flex items-start justify-between mb-1">
                                  <h4 className={`font-semibold ${
                                    !notification.isRead ? 'text-gray-900 dark:text-white' : 'text-gray-700 dark:text-gray-300'
                                  }`}>
                                    {notification.title}
                                  </h4>
                                  <div className="flex items-center gap-2 ml-4">
                                    <span className="text-xs text-gray-500">
                                      {formatTime(notification.timestamp)}
                                    </span>
                                    {!notification.isRead && (
                                      <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
                                    )}
                                  </div>
                                </div>
                                
                                <p className={`text-sm mb-3 ${
                                  !notification.isRead ? 'text-gray-700 dark:text-gray-300' : 'text-gray-600 dark:text-gray-400'
                                }`}>
                                  {notification.message}
                                </p>
                                
                                <div className="flex items-center gap-2">
                                  {notification.actionUrl && (
                                    <Button size="sm" variant="outline">
                                      View Details
                                    </Button>
                                  )}
                                  {!notification.isRead && (
                                    <Button 
                                      size="sm" 
                                      variant="ghost"
                                      onClick={() => markAsRead(notification.id)}
                                    >
                                      Mark as Read
                                    </Button>
                                  )}
                                  <Button 
                                    size="sm" 
                                    variant="ghost"
                                    onClick={() => deleteNotification(notification.id)}
                                    className="text-red-600 hover:text-red-700"
                                  >
                                    <Trash2 className="h-3 w-3" />
                                  </Button>
                                </div>
                              </div>
                            </div>
                          </div>
                        ))}
                      </div>
                    )}
                  </CardContent>
                </Card>
              </div>
            </div>
          </div>
        </div>
      </div>
    </MainLayout>
  )
}
