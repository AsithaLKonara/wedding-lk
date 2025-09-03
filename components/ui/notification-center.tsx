"use client"

import React from "react"
import { useState, useEffect } from 'react'
import { Bell, X, Check, Trash2, MessageCircle, Calendar, Star, DollarSign, Package, Users, Settings } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog'
import { ScrollArea } from '@/components/ui/scroll-area'
import { Separator } from '@/components/ui/separator'
import { useSocket } from '@/hooks/use-socket'
import { Notification } from '@/lib/socket'

interface NotificationCenterProps {
  className?: string
  showBadge?: boolean
  maxNotifications?: number
}

const getNotificationIcon = (type: Notification['type']) => {
  switch (type) {
    case 'booking_request':
    case 'booking_status_update':
      return <Calendar className="h-4 w-4" />
    case 'new_review':
      return <Star className="h-4 w-4" />
    case 'payment_received':
      return <DollarSign className="h-4 w-4" />
    case 'new_message':
      return <MessageCircle className="h-4 w-4" />
    case 'service_updated':
      return <Package className="h-4 w-4" />
    case 'user_status_changed':
      return <Users className="h-4 w-4" />
    default:
      return <Bell className="h-4 w-4" />
  }
}

const getNotificationColor = (type: Notification['type']) => {
  switch (type) {
    case 'booking_request':
      return 'text-blue-600 bg-blue-50 border-blue-200'
    case 'booking_status_update':
      return 'text-green-600 bg-green-50 border-green-200'
    case 'new_review':
      return 'text-yellow-600 bg-yellow-50 border-yellow-200'
    case 'payment_received':
      return 'text-emerald-600 bg-emerald-50 border-emerald-200'
    case 'new_message':
      return 'text-purple-600 bg-purple-50 border-purple-200'
    case 'service_updated':
      return 'text-orange-600 bg-orange-50 border-orange-200'
    case 'user_status_changed':
      return 'text-gray-600 bg-gray-50 border-gray-200'
    default:
      return 'text-gray-600 bg-gray-50 border-gray-200'
  }
}

const formatTimeAgo = (timestamp: string) => {
  const now = new Date()
  const notificationTime = new Date(timestamp)
  const diffInSeconds = Math.floor((now.getTime() - notificationTime.getTime()) / 1000)

  if (diffInSeconds < 60) {
    return 'Just now'
  } else if (diffInSeconds < 3600) {
    const minutes = Math.floor(diffInSeconds / 60)
    return `${minutes}m ago`
  } else if (diffInSeconds < 86400) {
    const hours = Math.floor(diffInSeconds / 3600)
    return `${hours}h ago`
  } else {
    const days = Math.floor(diffInSeconds / 86400)
    return `${days}d ago`
  }
}

export function NotificationCenter({ 
  className = "", 
  showBadge = true, 
  maxNotifications = 10 
}: NotificationCenterProps) {
  const [isOpen, setIsOpen] = useState(false)
  const [notifications, setNotifications] = useState<Notification[]>([])
  const [filter, setFilter] = useState<'all' | 'unread' | 'read'>('all')

  const {
    notifications: socketNotifications,
    markNotificationAsRead,
    clearNotifications,
    isConnected
  } = useSocket()

  // Calculate unread count from notifications
  const unreadCount = notifications.filter(n => !n.read).length

  // Sync notifications from socket
  useEffect(() => {
    setNotifications(socketNotifications.slice(0, maxNotifications))
  }, [socketNotifications, maxNotifications])

  const filteredNotifications = notifications.filter(notification => {
    if (filter === 'unread') return !notification.read
    if (filter === 'read') return notification.read
    return true
  })

  const handleMarkAsRead = (notificationId: string) => {
    markNotificationAsRead(notificationId)
  }

  const handleMarkAllAsRead = () => {
    notifications.forEach(notification => {
      if (!notification.read) {
        markNotificationAsRead(notification.id)
      }
    })
  }

  const handleClearAll = () => {
    clearNotifications()
    setNotifications([])
  }

  const handleNotificationClick = (notification: Notification) => {
    if (!notification.read) {
      markNotificationAsRead(notification.id)
    }
    
    // Handle navigation based on notification type
    switch (notification.type) {
      case 'booking_request':
      case 'booking_status_update':
        // Navigate to bookings page
        window.location.href = '/dashboard/bookings'
        break
      case 'new_review':
        // Navigate to reviews section
        window.location.href = '/dashboard/vendor?tab=reviews'
        break
      case 'payment_received':
        // Navigate to payments page
        window.location.href = '/dashboard/payments'
        break
      case 'new_message':
        // Open messaging interface
        window.location.href = '/dashboard/vendor?tab=messages'
        break
      default:
        break
    }
  }

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogTrigger asChild>
        <Button variant="outline" size="icon" className={`relative ${className}`}>
          <Bell className="h-4 w-4" />
          {showBadge && unreadCount > 0 && (
            <Badge 
              className="absolute -top-1 -right-1 h-5 w-5 rounded-full p-0 text-xs bg-red-500 text-white"
            >
              {unreadCount > 99 ? '99+' : unreadCount}
            </Badge>
          )}
        </Button>
      </DialogTrigger>
      
      <DialogContent className="max-w-md max-h-[600px] p-0">
        <DialogHeader className="p-4 pb-2">
          <div className="flex items-center justify-between">
            <DialogTitle className="text-lg font-semibold">Notifications</DialogTitle>
            <div className="flex items-center gap-2">
              {isConnected && (
                <div className="w-2 h-2 bg-green-500 rounded-full" title="Connected" />
              )}
              <Button
                variant="ghost"
                size="sm"
                onClick={handleMarkAllAsRead}
                disabled={unreadCount === 0}
              >
                <Check className="h-4 w-4" />
              </Button>
              <Button
                variant="ghost"
                size="sm"
                onClick={handleClearAll}
                disabled={notifications.length === 0}
              >
                <Trash2 className="h-4 w-4" />
              </Button>
            </div>
          </div>
          
          {/* Filter tabs */}
          <div className="flex gap-1 mt-3">
            <Button
              variant={filter === 'all' ? 'default' : 'ghost'}
              size="sm"
              onClick={() => setFilter('all')}
              className="text-xs"
            >
              All ({notifications.length})
            </Button>
            <Button
              variant={filter === 'unread' ? 'default' : 'ghost'}
              size="sm"
              onClick={() => setFilter('unread')}
              className="text-xs"
            >
              Unread ({unreadCount})
            </Button>
            <Button
              variant={filter === 'read' ? 'default' : 'ghost'}
              size="sm"
              onClick={() => setFilter('read')}
              className="text-xs"
            >
              Read ({notifications.length - unreadCount})
            </Button>
          </div>
        </DialogHeader>
        
        <Separator />
        
        <ScrollArea className="h-[400px]">
          <div className="p-2">
            {filteredNotifications.length === 0 ? (
              <div className="text-center py-8 text-gray-500">
                <Bell className="h-8 w-8 mx-auto mb-2 opacity-50" />
                <p className="text-sm">No notifications</p>
              </div>
            ) : (
              <div className="space-y-2">
                {filteredNotifications.map((notification) => (
                  <Card
                    key={notification.id}
                    className={`cursor-pointer transition-all hover:shadow-md ${
                      !notification.read ? 'border-l-4 border-l-blue-500' : ''
                    }`}
                    onClick={() => handleNotificationClick(notification)}
                  >
                    <CardContent className="p-3">
                      <div className="flex items-start gap-3">
                        <div className={`p-2 rounded-full ${getNotificationColor(notification.type)}`}>
                          {getNotificationIcon(notification.type)}
                        </div>
                        
                        <div className="flex-1 min-w-0">
                          <div className="flex items-start justify-between gap-2">
                            <h4 className="font-medium text-sm leading-tight">
                              {notification.title}
                            </h4>
                            <div className="flex items-center gap-1">
                              {!notification.read && (
                                <div className="w-2 h-2 bg-blue-500 rounded-full" />
                              )}
                              <Button
                                variant="ghost"
                                size="sm"
                                onClick={(e) => {
                                  e.stopPropagation()
                                  handleMarkAsRead(notification.id)
                                }}
                                className="h-6 w-6 p-0"
                              >
                                <X className="h-3 w-3" />
                              </Button>
                            </div>
                          </div>
                          
                          <p className="text-sm text-gray-600 mt-1 line-clamp-2">
                            {notification.message}
                          </p>
                          
                          <p className="text-xs text-gray-400 mt-2">
                            {formatTimeAgo(notification.timestamp.toString())}
                          </p>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            )}
          </div>
        </ScrollArea>
        
        {notifications.length > 0 && (
          <>
            <Separator />
            <div className="p-3 text-center">
              <Button
                variant="outline"
                size="sm"
                onClick={() => setIsOpen(false)}
                className="w-full"
              >
                Close
              </Button>
            </div>
          </>
        )}
      </DialogContent>
    </Dialog>
  )
} 

export default NotificationCenter
