// WebSocket utility for real-time feed updates
// This is a client-side implementation for real-time features

export class FeedWebSocket {
  private ws: WebSocket | null = null;
  private reconnectAttempts = 0;
  private maxReconnectAttempts = 5;
  private reconnectDelay = 1000;
  private listeners: Map<string, Function[]> = new Map();

  constructor(private url: string) {
    this.connect();
  }

  private connect() {
    try {
      this.ws = new WebSocket(this.url);

      this.ws.onopen = () => {
        console.log('WebSocket connected');
        this.reconnectAttempts = 0;
        this.emit('connected');
      };

      this.ws.onmessage = (event) => {
        try {
          const data = JSON.parse(event.data);
          this.emit('message', data);
          
          // Emit specific event types
          if (data.type) {
            this.emit(data.type, data);
          }
        } catch (error) {
          console.error('Error parsing WebSocket message:', error);
        }
      };

      this.ws.onclose = () => {
        console.log('WebSocket disconnected');
        this.emit('disconnected');
        this.reconnect();
      };

      this.ws.onerror = (error) => {
        console.error('WebSocket error:', error);
        this.emit('error', error);
      };

    } catch (error) {
      console.error('Error creating WebSocket connection:', error);
      this.reconnect();
    }
  }

  private reconnect() {
    if (this.reconnectAttempts >= this.maxReconnectAttempts) {
      console.error('Max reconnection attempts reached');
      this.emit('maxReconnectAttemptsReached');
      return;
    }

    this.reconnectAttempts++;
    const delay = this.reconnectDelay * Math.pow(2, this.reconnectAttempts - 1);
    
    console.log(`Reconnecting in ${delay}ms (attempt ${this.reconnectAttempts})`);
    
    setTimeout(() => {
      this.connect();
    }, delay);
  }

  public on(event: string, callback: Function) {
    if (!this.listeners.has(event)) {
      this.listeners.set(event, []);
    }
    this.listeners.get(event)!.push(callback);
  }

  public off(event: string, callback: Function) {
    const callbacks = this.listeners.get(event);
    if (callbacks) {
      const index = callbacks.indexOf(callback);
      if (index > -1) {
        callbacks.splice(index, 1);
      }
    }
  }

  private emit(event: string, data?: any) {
    const callbacks = this.listeners.get(event);
    if (callbacks) {
      callbacks.forEach(callback => callback(data));
    }
  }

  public send(data: any) {
    if (this.ws && this.ws.readyState === WebSocket.OPEN) {
      this.ws.send(JSON.stringify(data));
    } else {
      console.warn('WebSocket is not connected');
    }
  }

  public disconnect() {
    if (this.ws) {
      this.ws.close();
      this.ws = null;
    }
  }

  public isConnected(): boolean {
    return this.ws?.readyState === WebSocket.OPEN;
  }
}

// Feed-specific WebSocket events
export const FeedEvents = {
  NEW_POST: 'new_post',
  POST_LIKED: 'post_liked',
  POST_COMMENTED: 'post_commented',
  POST_SHARED: 'post_shared',
  POST_DELETED: 'post_deleted',
  USER_ONLINE: 'user_online',
  USER_OFFLINE: 'user_offline',
  NOTIFICATION: 'notification'
} as const;

// React hook for WebSocket
export function useFeedWebSocket(url: string) {
  const [ws, setWs] = useState<FeedWebSocket | null>(null);
  const [isConnected, setIsConnected] = useState(false);

  useEffect(() => {
    const websocket = new FeedWebSocket(url);
    setWs(websocket);

    websocket.on('connected', () => setIsConnected(true));
    websocket.on('disconnected', () => setIsConnected(false));

    return () => {
      websocket.disconnect();
    };
  }, [url]);

  return { ws, isConnected };
}

// Feed update types
export interface FeedUpdate {
  type: string;
  data: {
    postId: string;
    userId: string;
    timestamp: string;
    [key: string]: any;
  };
}

export interface NewPostUpdate extends FeedUpdate {
  type: 'new_post';
  data: {
    post: any;
    author: any;
  };
}

export interface PostInteractionUpdate extends FeedUpdate {
  type: 'post_liked' | 'post_commented' | 'post_shared';
  data: {
    postId: string;
    userId: string;
    interaction: {
      likes: number;
      comments: number;
      shares: number;
    };
  };
}

// Utility functions for feed updates
export const FeedUtils = {
  // Subscribe to new posts from followed users
  subscribeToNewPosts: (ws: FeedWebSocket, callback: (post: any) => void) => {
    ws.on(FeedEvents.NEW_POST, callback);
  },

  // Subscribe to post interactions
  subscribeToPostInteractions: (ws: FeedWebSocket, callback: (update: PostInteractionUpdate) => void) => {
    ws.on(FeedEvents.POST_LIKED, callback);
    ws.on(FeedEvents.POST_COMMENTED, callback);
    ws.on(FeedEvents.POST_SHARED, callback);
  },

  // Subscribe to notifications
  subscribeToNotifications: (ws: FeedWebSocket, callback: (notification: any) => void) => {
    ws.on(FeedEvents.NOTIFICATION, callback);
  },

  // Send post interaction
  sendPostInteraction: (ws: FeedWebSocket, postId: string, type: 'like' | 'comment' | 'share') => {
    ws.send({
      type: 'post_interaction',
      data: {
        postId,
        interactionType: type,
        timestamp: new Date().toISOString()
      }
    });
  },

  // Send new post notification
  sendNewPost: (ws: FeedWebSocket, post: any) => {
    ws.send({
      type: 'new_post',
      data: {
        post,
        timestamp: new Date().toISOString()
      }
    });
  }
};

// Import React for the hook
import { useState, useEffect } from 'react';


