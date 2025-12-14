// Push Notifications Service
// Supports Firebase Cloud Messaging (FCM) and OneSignal

interface PushNotificationPayload {
  title: string;
  body: string;
  icon?: string;
  image?: string;
  data?: Record<string, any>;
  clickAction?: string;
  badge?: number;
  sound?: string;
  tag?: string;
}

interface PushNotificationOptions {
  priority?: 'high' | 'normal';
  timeToLive?: number;
  collapseKey?: string;
  restrictedPackageName?: string;
}

export class PushNotificationService {
  private vapidKey: string;
  private fcmServerKey: string;
  private oneSignalAppId: string;
  private oneSignalApiKey: string;

  constructor() {
    this.vapidKey = process.env.NEXT_PUBLIC_FCM_VAPID_KEY || '';
    this.fcmServerKey = process.env.FCM_SERVER_KEY || '';
    this.oneSignalAppId = process.env.ONESIGNAL_APP_ID || '';
    this.oneSignalApiKey = process.env.ONESIGNAL_API_KEY || '';
  }

  // Send to single device via FCM
  async sendToDevice(
    token: string, 
    payload: PushNotificationPayload, 
    options?: PushNotificationOptions
  ) {
    try {
      const response = await fetch('https://fcm.googleapis.com/fcm/send', {
        method: 'POST',
        headers: {
          'Authorization': `key=${this.fcmServerKey}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          to: token,
          notification: {
            title: payload.title,
            body: payload.body,
            icon: payload.icon || '/icons/icon-192x192.png',
            image: payload.image,
            click_action: payload.clickAction,
            badge: payload.badge,
            sound: payload.sound || 'default',
            tag: payload.tag,
          },
          data: payload.data,
          priority: options?.priority || 'high',
          time_to_live: options?.timeToLive || 86400, // 24 hours
          collapse_key: options?.collapseKey,
          restricted_package_name: options?.restrictedPackageName,
        }),
      });

      if (!response.ok) {
        throw new Error(`FCM Error: ${response.status}`);
      }

      return await response.json();
    } catch (error) {
      console.error('Error sending FCM notification:', error);
      throw error;
    }
  }

  // Send to multiple devices via FCM
  async sendToMultipleDevices(
    tokens: string[], 
    payload: PushNotificationPayload, 
    options?: PushNotificationOptions
  ) {
    try {
      const response = await fetch('https://fcm.googleapis.com/fcm/send', {
        method: 'POST',
        headers: {
          'Authorization': `key=${this.fcmServerKey}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          registration_ids: tokens,
          notification: {
            title: payload.title,
            body: payload.body,
            icon: payload.icon || '/icons/icon-192x192.png',
            image: payload.image,
            click_action: payload.clickAction,
            badge: payload.badge,
            sound: payload.sound || 'default',
            tag: payload.tag,
          },
          data: payload.data,
          priority: options?.priority || 'high',
          time_to_live: options?.timeToLive || 86400,
          collapse_key: options?.collapseKey,
        }),
      });

      if (!response.ok) {
        throw new Error(`FCM Error: ${response.status}`);
      }

      return await response.json();
    } catch (error) {
      console.error('Error sending FCM batch notification:', error);
      throw error;
    }
  }

  // Send via OneSignal
  async sendViaOneSignal(
    playerIds: string[], 
    payload: PushNotificationPayload, 
    options?: PushNotificationOptions
  ) {
    try {
      const response = await fetch(`https://onesignal.com/api/v1/notifications`, {
        method: 'POST',
        headers: {
          'Authorization': `Basic ${this.oneSignalApiKey}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          app_id: this.oneSignalAppId,
          include_player_ids: playerIds,
          headings: { en: payload.title },
          contents: { en: payload.body },
          big_picture: payload.image,
          small_icon: payload.icon || 'ic_notification',
          large_icon: payload.icon || 'ic_notification',
          url: payload.clickAction,
          data: payload.data,
          priority: options?.priority === 'high' ? 10 : 5,
          ttl: options?.timeToLive || 86400,
          collapse_id: options?.collapseKey,
          android_sound: payload.sound || 'default',
          ios_sound: payload.sound || 'default',
          badge: payload.badge,
          tags: payload.tag ? [{ key: 'category', relation: '=', value: payload.tag }] : undefined,
        }),
      });

      if (!response.ok) {
        throw new Error(`OneSignal Error: ${response.status}`);
      }

      return await response.json();
    } catch (error) {
      console.error('Error sending OneSignal notification:', error);
      throw error;
    }
  }

  // Send to topic/segment
  async sendToTopic(
    topic: string, 
    payload: PushNotificationPayload, 
    options?: PushNotificationOptions
  ) {
    try {
      const response = await fetch('https://fcm.googleapis.com/fcm/send', {
        method: 'POST',
        headers: {
          'Authorization': `key=${this.fcmServerKey}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          to: `/topics/${topic}`,
          notification: {
            title: payload.title,
            body: payload.body,
            icon: payload.icon || '/icons/icon-192x192.png',
            image: payload.image,
            click_action: payload.clickAction,
            badge: payload.badge,
            sound: payload.sound || 'default',
            tag: payload.tag,
          },
          data: payload.data,
          priority: options?.priority || 'high',
          time_to_live: options?.timeToLive || 86400,
          collapse_key: options?.collapseKey,
        }),
      });

      if (!response.ok) {
        throw new Error(`FCM Topic Error: ${response.status}`);
      }

      return await response.json();
    } catch (error) {
      console.error('Error sending FCM topic notification:', error);
      throw error;
    }
  }

  // Subscribe user to topic
  async subscribeToTopic(token: string, topic: string) {
    try {
      const response = await fetch(`https://iid.googleapis.com/iid/v1/${token}/rel/topics/${topic}`, {
        method: 'POST',
        headers: {
          'Authorization': `key=${this.fcmServerKey}`,
        },
      });

      if (!response.ok) {
        throw new Error(`Topic subscription error: ${response.status}`);
      }

      return true;
    } catch (error) {
      console.error('Error subscribing to topic:', error);
      throw error;
    }
  }

  // Unsubscribe user from topic
  async unsubscribeFromTopic(token: string, topic: string) {
    try {
      const response = await fetch(`https://iid.googleapis.com/iid/v1/${token}/rel/topics/${topic}`, {
        method: 'DELETE',
        headers: {
          'Authorization': `key=${this.fcmServerKey}`,
        },
      });

      if (!response.ok) {
        throw new Error(`Topic unsubscription error: ${response.status}`);
      }

      return true;
    } catch (error) {
      console.error('Error unsubscribing from topic:', error);
      throw error;
    }
  }

  // Send booking notification
  async sendBookingNotification(
    userId: string, 
    bookingData: {
      vendorName: string;
      serviceName: string;
      date: string;
      time: string;
      bookingId: string;
    }
  ) {
    const payload: PushNotificationPayload = {
      title: 'New Booking Confirmed! 🎉',
      body: `Your booking with ${bookingData.vendorName} for ${bookingData.serviceName} on ${bookingData.date} at ${bookingData.time} has been confirmed.`,
      clickAction: `/dashboard/user/bookings/${bookingData.bookingId}`,
      data: {
        type: 'booking_confirmed',
        bookingId: bookingData.bookingId,
        vendorName: bookingData.vendorName,
      },
      tag: 'booking',
    };

    // Get user's FCM tokens from database
    // This would typically be fetched from your user model
    const userTokens = await this.getUserTokens(userId);
    
    if (userTokens.length > 0) {
      return await this.sendToMultipleDevices(userTokens, payload);
    }
  }

  // Send payment notification
  async sendPaymentNotification(
    userId: string, 
    paymentData: {
      amount: number;
      currency: string;
      status: 'success' | 'failed';
      transactionId: string;
    }
  ) {
    const payload: PushNotificationPayload = {
      title: paymentData.status === 'success' 
        ? 'Payment Successful! 💳' 
        : 'Payment Failed ❌',
      body: paymentData.status === 'success'
        ? `Your payment of ${paymentData.currency} ${paymentData.amount} has been processed successfully.`
        : `Your payment of ${paymentData.currency} ${paymentData.amount} failed. Please try again.`,
      clickAction: `/dashboard/user/payments`,
      data: {
        type: 'payment',
        status: paymentData.status,
        transactionId: paymentData.transactionId,
        amount: paymentData.amount,
      },
      tag: 'payment',
    };

    const userTokens = await this.getUserTokens(userId);
    
    if (userTokens.length > 0) {
      return await this.sendToMultipleDevices(userTokens, payload);
    }
  }

  // Send social notification
  async sendSocialNotification(
    userId: string, 
    socialData: {
      type: 'like' | 'comment' | 'follow' | 'mention';
      fromUser: string;
      postId?: string;
      commentId?: string;
    }
  ) {
    const messages = {
      like: `${socialData.fromUser} liked your post`,
      comment: `${socialData.fromUser} commented on your post`,
      follow: `${socialData.fromUser} started following you`,
      mention: `${socialData.fromUser} mentioned you in a post`,
    };

    const payload: PushNotificationPayload = {
      title: 'Social Update 👥',
      body: messages[socialData.type],
      clickAction: socialData.postId ? `/feed/post/${socialData.postId}` : '/feed',
      data: {
        type: 'social',
        socialType: socialData.type,
        fromUser: socialData.fromUser,
        postId: socialData.postId,
        commentId: socialData.commentId,
      },
      tag: 'social',
    };

    const userTokens = await this.getUserTokens(userId);
    
    if (userTokens.length > 0) {
      return await this.sendToMultipleDevices(userTokens, payload);
    }
  }

  // Helper method to get user's FCM tokens
  private async getUserTokens(userId: string): Promise<string[]> {
    // This would typically fetch from your database
    // For now, returning empty array as placeholder
    return [];
  }
}

// Export singleton instance
export const pushNotificationService = new PushNotificationService();


