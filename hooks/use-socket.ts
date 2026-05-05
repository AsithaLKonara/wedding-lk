import { useEffect, useRef, useState, useCallback } from 'react';
import { io, Socket } from 'socket.io-client';
import { useAuth } from '@/lib/hooks/use-auth';

interface Message {
  id: string;
  senderId: string;
  receiverId: string;
  content: string;
  timestamp: Date;
  type: 'text' | 'image' | 'file';
}

interface Notification {
  id: string;
  userId: string;
  title: string;
  message: string;
  type: 'info' | 'success' | 'warning' | 'error' | 
         'booking_request' | 'booking_status_update' | 'new_review' |
         'payment_received' | 'new_message' | 'service_updated' |
         'user_status_changed' | 'vendor_approved' | 'vendor_rejected';
  timestamp: Date;
  read: boolean;
  data?: any;
}

interface TypingIndicator {
  senderId: string;
  isTyping: boolean;
}

interface SocketState {
  isConnected: boolean;
  isAuthenticated: boolean;
  error: string | null;
}

export const useSocket = () => {
  const { user, loading: authLoading } = useAuth();
  const socketRef = useRef<Socket | null>(null);
  const [socketState, setSocketState] = useState<SocketState>({
    isConnected: false,
    isAuthenticated: false,
    error: null,
  });

  // Message state
  const [messages, setMessages] = useState<Message[]>([]);
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [typingUsers, setTypingUsers] = useState<Set<string>>(new Set());

  // Initialize socket connection
  const initializeSocket = useCallback(() => {
    if (!user?.email) return;

    const socket = io(process.env.NEXT_PUBLIC_SOCKET_URL || 'http://localhost:3000', {
      transports: ['websocket', 'polling'],
      autoConnect: true,
    });

    socketRef.current = socket;

    // Connection events
    socket.on('connect', () => {
      console.log('🔌 Socket connected');
      setSocketState(prev => ({ ...prev, isConnected: true, error: null }));

      // Authenticate with user data
      if (user) {
        socket.emit('authenticate', {
          userId: user.id || user.email,
          email: user.email,
          role: user.role || 'user'
        });
      }
    });

    socket.on('disconnect', () => {
      console.log('🔌 Socket disconnected');
      setSocketState(prev => ({ ...prev, isConnected: false }));
    });

    socket.on('connect_error', (error) => {
      console.error('🔌 Socket connection error:', error);
      setSocketState(prev => ({ ...prev, error: error.message }));
    });

    // Authentication events
    socket.on('authenticated', (data) => {
      if (data.success) {
        console.log('✅ Socket authenticated');
        setSocketState(prev => ({ ...prev, isAuthenticated: true }));
        
        // Join user's personal room
        if (user?.id || user?.email) {
          socket.emit('join-user-room', user.id || user.email);
        }
      }
    });

    // Message events
    const handleNewMessage = (message: any) => {
      console.log('💬 New message received:', message);
      // Map server message format to hook Message format if needed
      const mappedMessage: Message = {
        id: message.id || message.messageId || message._id || Date.now().toString(),
        senderId: message.senderId || (typeof message.sender === 'object' ? message.sender._id : message.sender) || '',
        receiverId: message.receiverId || message.recipientId || (typeof message.recipient === 'object' ? message.recipient._id : message.recipient) || '',
        content: message.content || '',
        timestamp: message.timestamp ? new Date(message.timestamp) : new Date(),
        type: message.type || message.messageType || 'text'
      };
      setMessages(prev => {
        // Prevent duplicate messages
        if (prev.some(m => m.id === mappedMessage.id)) return prev;
        return [...prev, mappedMessage];
      });
    };

    socket.on('new-message', handleNewMessage);
    socket.on('new_message', handleNewMessage);

    const handleMessageSent = (message: any) => {
      console.log('✅ Message sent successfully:', message);
    };
    socket.on('message-sent', handleMessageSent);
    socket.on('message_sent', handleMessageSent);

    // Typing indicators
    const handleTyping = (data: any) => {
      const senderId = data.senderId || data.userId;
      const isTyping = data.isTyping !== undefined ? data.isTyping : true;
      if (senderId) {
        setTypingUsers(prev => {
          const newSet = new Set(prev);
          if (isTyping) {
            newSet.add(senderId);
          } else {
            newSet.delete(senderId);
          }
          return newSet;
        });
      }
    };
    socket.on('typing-indicator', handleTyping);
    socket.on('user_typing', handleTyping);

    // Notification events
    const handleNewNotification = (notification: any) => {
      console.log('🔔 New notification:', notification);
      const mappedNotification: Notification = {
        id: notification.id || notification._id || Date.now().toString(),
        userId: notification.userId || notification.recipientId || '',
        title: notification.title || 'New Notification',
        message: notification.message || '',
        type: notification.type || 'info',
        timestamp: notification.timestamp ? new Date(notification.timestamp) : new Date(),
        read: notification.read || notification.isRead || false,
        data: notification.data
      };
      setNotifications(prev => {
        if (prev.some(n => n.id === mappedNotification.id)) return prev;
        return [mappedNotification, ...prev];
      });
    };
    socket.on('new-notification', handleNewNotification);
    socket.on('new_notification', handleNewNotification);

    // Read receipts
    socket.on('read-receipt', (data: { messageId: string; readBy: string }) => {
      console.log('📖 Read receipt:', data);
    });
    socket.on('notification_updated', (data: any) => {
      console.log('🔔 Notification updated:', data);
    });

    // Error handling
    socket.on('error', (error) => {
      console.error('🔌 Socket error:', error);
      setSocketState(prev => ({ ...prev, error: error.message }));
    });

    return socket;
  }, [user]);

  // Cleanup socket connection
  const disconnectSocket = useCallback(() => {
    if (socketRef.current) {
      socketRef.current.disconnect();
      socketRef.current = null;
      setSocketState({
        isConnected: false,
        isAuthenticated: false,
        error: null,
      });
    }
  }, []);

  // Join vendor room
  const joinVendorRoom = useCallback((vendorId: string) => {
    if (socketRef.current && socketState.isAuthenticated) {
      socketRef.current.emit('join-vendor-room', vendorId);
      console.log(`🏢 Joined vendor room: ${vendorId}`);
    }
  }, [socketState.isAuthenticated]);

  // Join venue room
  const joinVenueRoom = useCallback((venueId: string) => {
    if (socketRef.current && socketState.isAuthenticated) {
      socketRef.current.emit('join-venue-room', venueId);
      console.log(`🏛️ Joined venue room: ${venueId}`);
    }
  }, [socketState.isAuthenticated]);

  // Send message
  const sendMessage = useCallback((message: Omit<Message, 'id' | 'timestamp'>) => {
    if (socketRef.current && socketState.isConnected) {
      const fullMessage: Message = {
        ...message,
        id: Date.now().toString(), // Temporary ID
        timestamp: new Date(),
      };
      // Emit hyphenated format
      socketRef.current.emit('send-message', fullMessage);
      // Emit underscore format
      socketRef.current.emit('send_message', {
        recipientId: message.receiverId,
        content: message.content,
        type: message.type
      });
      return fullMessage;
    }
    return null;
  }, [socketState.isConnected]);

  // Send typing indicator
  const sendTypingIndicator = useCallback((receiverId: string, isTyping: boolean) => {
    if (socketRef.current && socketState.isConnected) {
      // Emit hyphenated format
      socketRef.current.emit(isTyping ? 'typing-start' : 'typing-stop', {
        receiverId,
        senderId: user?.id || user?.email
      });
      // Emit underscore format
      socketRef.current.emit(isTyping ? 'typing_start' : 'typing_stop', {
        recipientId: receiverId
      });
    }
  }, [socketState.isConnected, user]);

  // Mark message as read
  const markMessageAsRead = useCallback((messageId: string) => {
    if (socketRef.current && socketState.isConnected) {
      socketRef.current.emit('mark-read', messageId);
      socketRef.current.emit('mark_read', { messageId });
    }
  }, [socketState.isConnected]);

  // Mark notification as read
  const markNotificationAsRead = useCallback((notificationId: string) => {
    if (socketRef.current && socketState.isConnected) {
      socketRef.current.emit('notification-read', notificationId);
      socketRef.current.emit('mark_notification_read', { notificationId });
    }
  }, [socketState.isConnected]);

  // Clear notifications
  const clearNotifications = useCallback(() => {
    setNotifications([]);
  }, []);

  // Initialize socket when user changes
  useEffect(() => {
    if (user?.email) {
      initializeSocket();
    } else {
      disconnectSocket();
    }

    return () => {
      disconnectSocket();
    };
  }, [user, initializeSocket, disconnectSocket]);

  return {
    // Socket state
    isConnected: socketState.isConnected,
    isAuthenticated: socketState.isAuthenticated,
    error: socketState.error,
    
    // Data
    messages,
    notifications,
    typingUsers,
    
    // Actions
    sendMessage,
    sendTypingIndicator,
    markMessageAsRead,
    markNotificationAsRead,
    joinVendorRoom,
    joinVenueRoom,
    clearNotifications,
    
    // Connection management
    disconnectSocket,
  };
}; 