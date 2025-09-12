'use client';

import { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { 
  Bell, 
  Check, 
  X, 
  Mail, 
  Calendar, 
  CreditCard, 
  Star, 
  MessageSquare,
  Settings,
  Trash2,
  CheckCheck
} from 'lucide-react';
import { toast } from '@/hooks/use-toast';

interface Notification {
  id: string;
  type: 'booking' | 'payment' | 'review' | 'message' | 'system';
  title: string;
  message: string;
  isRead: boolean;
  createdAt: string;
  data?: any;
  priority: 'low' | 'medium' | 'high';
}

export default function NotificationCenter() {
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState('all');

  useEffect(() => {
    fetchNotifications();
  }, []);

  const fetchNotifications = async () => {
    try {
      const response = await fetch('/api/notifications');
      if (response.ok) {
        const data = await response.json();
        setNotifications(data.notifications || []);
      }
    } catch (error) {
      console.error('Error fetching notifications:', error);
    } finally {
      setLoading(false);
    }
  };

  const markAsRead = async (notificationId: string) => {
    try {
      const response = await fetch(`/api/notifications/${notificationId}/read`, {
        method: 'PUT'
      });

      if (response.ok) {
        setNotifications(prev => 
          prev.map(notif => 
            notif.id === notificationId 
              ? { ...notif, isRead: true }
              : notif
          )
        );
      }
    } catch (error) {
      console.error('Error marking notification as read:', error);
    }
  };

  const markAllAsRead = async () => {
    try {
      const response = await fetch('/api/notifications/read-all', {
        method: 'PUT'
      });

      if (response.ok) {
        setNotifications(prev => 
          prev.map(notif => ({ ...notif, isRead: true }))
        );
        toast({
          title: 'All notifications marked as read',
        });
      }
    } catch (error) {
      console.error('Error marking all notifications as read:', error);
    }
  };

  const deleteNotification = async (notificationId: string) => {
    try {
      const response = await fetch(`/api/notifications/${notificationId}`, {
        method: 'DELETE'
      });

      if (response.ok) {
        setNotifications(prev => prev.filter(notif => notif.id !== notificationId));
        toast({
          title: 'Notification deleted',
        });
      }
    } catch (error) {
      console.error('Error deleting notification:', error);
    }
  };

  const getNotificationIcon = (type: string) => {
    switch (type) {
      case 'booking':
        return <Calendar className="h-4 w-4 text-blue-500" />;
      case 'payment':
        return <CreditCard className="h-4 w-4 text-green-500" />;
      case 'review':
        return <Star className="h-4 w-4 text-yellow-500" />;
      case 'message':
        return <MessageSquare className="h-4 w-4 text-purple-500" />;
      case 'system':
        return <Settings className="h-4 w-4 text-gray-500" />;
      default:
        return <Bell className="h-4 w-4 text-gray-500" />;
    }
  };

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'high':
        return 'border-red-200 bg-red-50';
      case 'medium':
        return 'border-yellow-200 bg-yellow-50';
      case 'low':
        return 'border-gray-200 bg-gray-50';
      default:
        return 'border-gray-200 bg-gray-50';
    }
  };

  const filteredNotifications = notifications.filter(notif => {
    if (activeTab === 'all') return true;
    if (activeTab === 'unread') return !notif.isRead;
    return notif.type === activeTab;
  });

  const unreadCount = notifications.filter(notif => !notif.isRead).length;

  if (loading) {
    return (
      <div className="flex items-center justify-center p-8">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  return (
    <div className="w-full max-w-4xl mx-auto">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Notifications</h1>
          <p className="text-gray-600">
            {unreadCount > 0 ? `${unreadCount} unread notifications` : 'All caught up!'}
          </p>
        </div>
        {unreadCount > 0 && (
          <Button onClick={markAllAsRead} variant="outline">
            <CheckCheck className="h-4 w-4 mr-2" />
            Mark All as Read
          </Button>
        )}
      </div>

      <Tabs value={activeTab} onValueChange={setActiveTab}>
        <TabsList className="grid w-full grid-cols-5">
          <TabsTrigger value="all">
            All
            {notifications.length > 0 && (
              <Badge variant="secondary" className="ml-2">
                {notifications.length}
              </Badge>
            )}
          </TabsTrigger>
          <TabsTrigger value="unread">
            Unread
            {unreadCount > 0 && (
              <Badge variant="destructive" className="ml-2">
                {unreadCount}
              </Badge>
            )}
          </TabsTrigger>
          <TabsTrigger value="booking">Bookings</TabsTrigger>
          <TabsTrigger value="payment">Payments</TabsTrigger>
          <TabsTrigger value="review">Reviews</TabsTrigger>
        </TabsList>

        <TabsContent value={activeTab} className="mt-6">
          {filteredNotifications.length === 0 ? (
            <Card>
              <CardContent className="text-center py-12">
                <Bell className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                <h3 className="text-lg font-medium text-gray-900 mb-2">
                  {activeTab === 'unread' ? 'No unread notifications' : 'No notifications'}
                </h3>
                <p className="text-gray-600">
                  {activeTab === 'unread' 
                    ? 'You\'re all caught up!' 
                    : 'You\'ll see notifications here when you have updates.'
                  }
                </p>
              </CardContent>
            </Card>
          ) : (
            <div className="space-y-4">
              {filteredNotifications.map((notification) => (
                <Card 
                  key={notification.id} 
                  className={`transition-all hover:shadow-md ${
                    !notification.isRead ? 'border-l-4 border-l-blue-500' : ''
                  } ${getPriorityColor(notification.priority)}`}
                >
                  <CardContent className="p-4">
                    <div className="flex items-start space-x-3">
                      <div className="flex-shrink-0 mt-1">
                        {getNotificationIcon(notification.type)}
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className="flex items-start justify-between">
                          <div className="flex-1">
                            <h3 className={`text-sm font-medium ${
                              !notification.isRead ? 'text-gray-900' : 'text-gray-700'
                            }`}>
                              {notification.title}
                            </h3>
                            <p className="text-sm text-gray-600 mt-1">
                              {notification.message}
                            </p>
                            <p className="text-xs text-gray-500 mt-2">
                              {new Date(notification.createdAt).toLocaleString()}
                            </p>
                          </div>
                          <div className="flex items-center space-x-2 ml-4">
                            {!notification.isRead && (
                              <Button
                                size="sm"
                                variant="ghost"
                                onClick={() => markAsRead(notification.id)}
                              >
                                <Check className="h-4 w-4" />
                              </Button>
                            )}
                            <Button
                              size="sm"
                              variant="ghost"
                              onClick={() => deleteNotification(notification.id)}
                            >
                              <Trash2 className="h-4 w-4" />
                            </Button>
                          </div>
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          )}
        </TabsContent>
      </Tabs>
    </div>
  );
}
