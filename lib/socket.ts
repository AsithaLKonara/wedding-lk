import { Server as SocketIOServer } from 'socket.io';
import { Server as HTTPServer } from 'http';
import { NextApiRequest, NextApiResponse } from 'next';

interface SocketUser {
  userId: string;
  email: string;
  role: string;
  socketId: string;
}

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

class SocketService {
  private io: SocketIOServer | null = null;
  private connectedUsers: Map<string, SocketUser> = new Map();
  private userSockets: Map<string, string[]> = new Map();

  initialize(server: HTTPServer) {
    this.io = new SocketIOServer(server, {
      cors: {
        origin: process.env.NEXT_PUBLIC_APP_URL || "http://localhost:3000",
        methods: ["GET", "POST"],
        credentials: true
      }
    });

    this.setupEventHandlers();
    console.log('✅ Socket.IO server initialized');
  }

  private setupEventHandlers() {
    if (!this.io) return;

    this.io.on('connection', (socket) => {
      console.log(`🔌 User connected: ${socket.id}`);

      // User authentication
      socket.on('authenticate', (data: { userId: string; email: string; role: string }) => {
        this.handleAuthentication(socket, data);
      });

      // Join user to their personal room
      socket.on('join-user-room', (userId: string) => {
        socket.join(`user:${userId}`);
        console.log(`👤 User ${userId} joined personal room`);
      });

      // Join vendor/venue room
      socket.on('join-vendor-room', (vendorId: string) => {
        socket.join(`vendor:${vendorId}`);
        console.log(`🏢 Vendor ${vendorId} room joined`);
      });

      // Join venue room
      socket.on('join-venue-room', (venueId: string) => {
        socket.join(`venue:${venueId}`);
        console.log(`🏛️ Venue ${venueId} room joined`);
      });

      // Handle private messages
      socket.on('send-message', (message: Message) => {
        this.handlePrivateMessage(socket, message);
      });

      // Handle typing indicators
      socket.on('typing-start', (data: { receiverId: string; senderId: string }) => {
        this.handleTypingIndicator(socket, data, true);
      });

      socket.on('typing-stop', (data: { receiverId: string; senderId: string }) => {
        this.handleTypingIndicator(socket, data, false);
      });

      // Handle read receipts
      socket.on('mark-read', (messageId: string) => {
        this.handleReadReceipt(socket, messageId);
      });

      // Handle notifications
      socket.on('notification-read', (notificationId: string) => {
        this.handleNotificationRead(socket, notificationId);
      });

      // Handle disconnection
      socket.on('disconnect', () => {
        this.handleDisconnection(socket);
      });
    });
  }

  private handleAuthentication(socket: any, data: { userId: string; email: string; role: string }) {
    const user: SocketUser = {
      userId: data.userId,
      email: data.email,
      role: data.role,
      socketId: socket.id
    };

    this.connectedUsers.set(socket.id, user);
    
    if (!this.userSockets.has(data.userId)) {
      this.userSockets.set(data.userId, []);
    }
    this.userSockets.get(data.userId)?.push(socket.id);

    socket.emit('authenticated', { success: true });
    console.log(`✅ User authenticated: ${data.email} (${data.role})`);
  }

  private handlePrivateMessage(socket: any, message: Message) {
    const sender = this.connectedUsers.get(socket.id);
    if (!sender) {
      socket.emit('error', { message: 'User not authenticated' });
      return;
    }

    // Emit to receiver if online
    const receiverSockets = this.userSockets.get(message.receiverId);
    if (receiverSockets) {
      receiverSockets.forEach(socketId => {
        this.io?.to(socketId).emit('new-message', {
          ...message,
          senderId: sender.userId,
          timestamp: new Date()
        });
      });
    }

    // Emit back to sender for confirmation
    socket.emit('message-sent', {
      ...message,
      timestamp: new Date()
    });

    console.log(`💬 Message sent from ${sender.userId} to ${message.receiverId}`);
  }

  private handleTypingIndicator(socket: any, data: { receiverId: string; senderId: string }, isTyping: boolean) {
    const sender = this.connectedUsers.get(socket.id);
    if (!sender) return;

    const receiverSockets = this.userSockets.get(data.receiverId);
    if (receiverSockets) {
      receiverSockets.forEach(socketId => {
        this.io?.to(socketId).emit('typing-indicator', {
          senderId: sender.userId,
          isTyping
        });
      });
    }
  }

  private handleReadReceipt(socket: any, messageId: string) {
    const user = this.connectedUsers.get(socket.id);
    if (!user) return;

    // Emit read receipt to message sender
    socket.emit('read-receipt', { messageId, readBy: user.userId });
  }

  private handleNotificationRead(socket: any, notificationId: string) {
    const user = this.connectedUsers.get(socket.id);
    if (!user) return;

    // Handle notification read logic here
    console.log(`📖 Notification ${notificationId} marked as read by ${user.userId}`);
  }

  private handleDisconnection(socket: any) {
    const user = this.connectedUsers.get(socket.id);
    if (user) {
      // Remove from connected users
      this.connectedUsers.delete(socket.id);
      
      // Remove socket from user's socket list
      const userSockets = this.userSockets.get(user.userId);
      if (userSockets) {
        const updatedSockets = userSockets.filter(id => id !== socket.id);
        if (updatedSockets.length === 0) {
          this.userSockets.delete(user.userId);
        } else {
          this.userSockets.set(user.userId, updatedSockets);
        }
      }
      
      console.log(`🔌 User disconnected: ${user.email}`);
    }
  }

  // Public methods for sending notifications and updates

  sendNotification(userId: string, notification: Notification) {
    const userSockets = this.userSockets.get(userId);
    if (userSockets) {
      userSockets.forEach(socketId => {
        this.io?.to(socketId).emit('new-notification', notification);
      });
    }
  }

  sendToUser(userId: string, event: string, data: any) {
    const userSockets = this.userSockets.get(userId);
    if (userSockets) {
      userSockets.forEach(socketId => {
        this.io?.to(socketId).emit(event, data);
      });
    }
  }

  sendToVendor(vendorId: string, event: string, data: any) {
    this.io?.to(`vendor:${vendorId}`).emit(event, data);
  }

  sendToVenue(venueId: string, event: string, data: any) {
    this.io?.to(`venue:${venueId}`).emit(event, data);
  }

  broadcastToAll(event: string, data: any) {
    this.io?.emit(event, data);
  }

  getConnectedUsersCount(): number {
    return this.connectedUsers.size;
  }

  isUserOnline(userId: string): boolean {
    return this.userSockets.has(userId);
  }

  getOnlineUsers(): string[] {
    return Array.from(this.userSockets.keys());
  }
}

// Create singleton instance
const socketService = new SocketService();

export default socketService;

// Export types for use in other files
export type { SocketUser, Message, Notification }; 