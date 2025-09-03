import { getServerSession } from '@/lib/auth-utils';

interface PushNotification {
  id: string;
  title: string;
  body: string;
  icon?: string;
  badge?: string;
  tag?: string;
  data?: any;
  actions?: Array<{
    action: string;
    title: string;
    icon?: string;
  }>;
  requireInteraction?: boolean;
  silent?: boolean;
}

interface NotificationSubscription {
  userId: string;
  endpoint: string;
  keys: {
    p256dh: string;
    auth: string;
  };
  createdAt: Date;
  lastUsed: Date;
}

class PushNotificationService {
  private vapidKeys = {
    publicKey: process.env.NEXT_PUBLIC_VAPID_KEY || '',
    privateKey: process.env.VAPID_PRIVATE_KEY || '',
  };

  // Request notification permission
  async requestPermission(): Promise<NotificationPermission> {
    if (!('Notification' in window)) {
      throw new Error('This browser does not support notifications');
    }

    if (Notification.permission === 'default') {
      const permission = await Notification.requestPermission();
      return permission;
    }

    return Notification.permission;
  }

  // Subscribe to push notifications
  async subscribeToPushNotifications(): Promise<PushSubscription | null> {
    try {
      const permission = await this.requestPermission();
      
      if (permission !== 'granted') {
        console.log('Notification permission denied');
        return null;
      }

      if (!('serviceWorker' in navigator) || !('PushManager' in window)) {
        throw new Error('Push messaging is not supported');
      }

      // Register service worker
      const registration = await navigator.serviceWorker.register('/sw.js');
      console.log('Service Worker registered');

      // Subscribe to push notifications
      const subscription = await registration.pushManager.subscribe({
        userVisibleOnly: true,
        applicationServerKey: this.urlBase64ToUint8Array(this.vapidKeys.publicKey),
      });

      // Send subscription to server
      await this.saveSubscription(subscription);

      return subscription;
    } catch (error) {
      console.error('Failed to subscribe to push notifications:', error);
      return null;
    }
  }

  // Unsubscribe from push notifications
  async unsubscribeFromPushNotifications(): Promise<boolean> {
    try {
      const registration = await navigator.serviceWorker.ready;
      const subscription = await registration.pushManager.getSubscription();
      
      if (subscription) {
        await subscription.unsubscribe();
        await this.deleteSubscription(subscription);
        return true;
      }
      
      return false;
    } catch (error) {
      console.error('Failed to unsubscribe from push notifications:', error);
      return false;
    }
  }

  // Send notification to specific user
  async sendNotificationToUser(userId: string, notification: PushNotification): Promise<boolean> {
    try {
      const response = await fetch('/api/notifications/send', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          userId,
          notification,
        }),
      });

      return response.ok;
    } catch (error) {
      console.error('Failed to send notification:', error);
      return false;
    }
  }

  // Send notification to multiple users
  async sendNotificationToUsers(userIds: string[], notification: PushNotification): Promise<boolean> {
    try {
      const response = await fetch('/api/notifications/send-bulk', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          userIds,
          notification,
        }),
      });

      return response.ok;
    } catch (error) {
      console.error('Failed to send bulk notifications:', error);
      return false;
    }
  }

  // Send notification to all users
  async sendNotificationToAll(notification: PushNotification): Promise<boolean> {
    try {
      const response = await fetch('/api/notifications/send-all', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          notification,
        }),
      });

      return response.ok;
    } catch (error) {
      console.error('Failed to send notification to all users:', error);
      return false;
    }
  }

  // Show local notification
  showLocalNotification(notification: PushNotification): void {
    if (Notification.permission === 'granted') {
      const notif = new Notification(notification.title, {
        body: notification.body,
        icon: notification.icon || '/favicon.ico',
        badge: notification.badge,
        tag: notification.tag,
        data: notification.data,
        requireInteraction: notification.requireInteraction,
        silent: notification.silent,
      });

      // Handle notification click
      notif.onclick = (event) => {
        event.preventDefault();
        window.focus();
        
        // Handle notification actions
        if (notification.data?.url) {
          window.open(notification.data.url, '_blank');
        }
        
        notif.close();
      };

      // Auto-close after 5 seconds
      setTimeout(() => {
        notif.close();
      }, 5000);
    }
  }

  // Save subscription to server
  private async saveSubscription(subscription: PushSubscription): Promise<void> {
    try {
      const response = await fetch('/api/notifications/subscribe', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          subscription: {
            endpoint: subscription.endpoint,
            keys: {
              p256dh: btoa(String.fromCharCode.apply(null, 
                Array.from(new Uint8Array(subscription.getKey('p256dh') || []))
              )),
              auth: btoa(String.fromCharCode.apply(null, 
                Array.from(new Uint8Array(subscription.getKey('auth') || []))
              )),
            },
          },
        }),
      });

      if (!response.ok) {
        throw new Error('Failed to save subscription');
      }
    } catch (error) {
      console.error('Failed to save subscription:', error);
      throw error;
    }
  }

  // Delete subscription from server
  private async deleteSubscription(subscription: PushSubscription): Promise<void> {
    try {
      const response = await fetch('/api/notifications/unsubscribe', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          endpoint: subscription.endpoint,
        }),
      });

      if (!response.ok) {
        throw new Error('Failed to delete subscription');
      }
    } catch (error) {
      console.error('Failed to delete subscription:', error);
      throw error;
    }
  }

  // Convert VAPID public key to Uint8Array
  private urlBase64ToUint8Array(base64String: string): Uint8Array {
    const padding = '='.repeat((4 - base64String.length % 4) % 4);
    const base64 = (base64String + padding)
      .replace(/-/g, '+')
      .replace(/_/g, '/');

    const rawData = window.atob(base64);
    const outputArray = new Uint8Array(rawData.length);

    for (let i = 0; i < rawData.length; ++i) {
      outputArray[i] = rawData.charCodeAt(i);
    }
    return outputArray;
  }

  // Check if notifications are supported
  isSupported(): boolean {
    return 'Notification' in window && 'serviceWorker' in navigator && 'PushManager' in window;
  }

  // Check if permission is granted
  hasPermission(): boolean {
    return Notification.permission === 'granted';
  }

  // Get current permission status
  getPermissionStatus(): NotificationPermission {
    return Notification.permission;
  }
}

// Create singleton instance
const pushNotificationService = new PushNotificationService();

export default pushNotificationService;

// Export types
export type { PushNotification, NotificationSubscription }; 