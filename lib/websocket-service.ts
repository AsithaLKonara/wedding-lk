import { Server as SocketIOServer } from 'socket.io'
import { Server as HTTPServer } from 'http'

// WebSocket event types
export enum SocketEvents {
  // Connection events
  CONNECT = 'connect',
  DISCONNECT = 'disconnect',
  
  // Chat events
  JOIN_ROOM = 'join_room',
  LEAVE_ROOM = 'leave_room',
  SEND_MESSAGE = 'send_message',
  RECEIVE_MESSAGE = 'receive_message',
  TYPING_START = 'typing_start',
  TYPING_STOP = 'typing_stop',
  
  // Notification events
  SEND_NOTIFICATION = 'send_notification',
  RECEIVE_NOTIFICATION = 'receive_notification',
  MARK_READ = 'mark_read',
  
  // Booking events
  BOOKING_UPDATE = 'booking_update',
  BOOKING_CREATED = 'booking_created',
  BOOKING_CANCELLED = 'booking_cancelled',
  
  // Payment events
  PAYMENT_UPDATE = 'payment_update',
  PAYMENT_SUCCESS = 'payment_success',
  PAYMENT_FAILED = 'payment_failed',
  
  // System events
  SYSTEM_MESSAGE = 'system_message',
  ERROR = 'error',
}

// Message interface
export interface ChatMessage {
  id: string
  roomId: string
  senderId: string
  senderName: string
  content: string
  timestamp: Date
  type: 'text' | 'image' | 'file' | 'system'
  metadata?: Record<string, any>
}

// Notification interface
export interface Notification {
  id: string
  userId: string
  title: string
  message: string
  type: 'info' | 'success' | 'warning' | 'error' | 
         'booking_request' | 'booking_status_update' | 'new_review' |
         'payment_received' | 'new_message' | 'service_updated' |
         'user_status_changed' | 'vendor_approved' | 'vendor_rejected'
  timestamp: Date
  read: boolean
  actionUrl?: string
  metadata?: Record<string, any>
}

// User session interface
export interface UserSession {
  userId: string
  socketId: string
  rooms: string[]
  lastSeen: Date
}

// WebSocket service class
export class WebSocketService {
  private io: SocketIOServer | null = null
  private userSessions: Map<string, UserSession> = new Map()
  private roomUsers: Map<string, Set<string>> = new Map()

  // Initialize WebSocket server
  initialize(server: HTTPServer) {
    this.io = new SocketIOServer(server, {
      cors: {
        origin: process.env.NEXT_PUBLIC_BASE_URL || 'http://localhost:3000',
        methods: ['GET', 'POST'],
        credentials: true,
      },
      transports: ['websocket', 'polling'],
    })

    this.setupEventHandlers()
    // WebSocket server initialized
  }

  // Setup event handlers
  private setupEventHandlers() {
    if (!this.io) return

    this.io.on(SocketEvents.CONNECT, (socket) => {
      // Client connected

      // Handle user authentication
      socket.on('authenticate', (data: { userId: string }) => {
        this.authenticateUser(socket, data.userId)
      })

      // Handle room joining
      socket.on(SocketEvents.JOIN_ROOM, (data: { roomId: string }) => {
        this.joinRoom(socket, data.roomId)
      })

      // Handle room leaving
      socket.on(SocketEvents.LEAVE_ROOM, (data: { roomId: string }) => {
        this.leaveRoom(socket, data.roomId)
      })

      // Handle message sending
      socket.on(SocketEvents.SEND_MESSAGE, (data: ChatMessage) => {
        this.handleMessage(socket, data)
      })

      // Handle typing indicators
      socket.on(SocketEvents.TYPING_START, (data: { roomId: string; userId: string }) => {
        this.handleTypingStart(socket, data)
      })

      socket.on(SocketEvents.TYPING_STOP, (data: { roomId: string; userId: string }) => {
        this.handleTypingStop(socket, data)
      })

      // Handle notifications
      socket.on(SocketEvents.MARK_READ, (data: { notificationId: string }) => {
        this.markNotificationRead(socket, data.notificationId)
      })

      // Handle disconnection
      socket.on(SocketEvents.DISCONNECT, () => {
        this.handleDisconnect(socket)
      })
    })
  }

  // Authenticate user
  private authenticateUser(socket: any, userId: string) {
    const session: UserSession = {
      userId,
      socketId: socket.id,
      rooms: [],
      lastSeen: new Date(),
    }

    this.userSessions.set(userId, session)
    socket.userId = userId
    socket.join(`user_${userId}`)

            // User authenticated
    socket.emit('authenticated', { success: true })
  }

  // Join room
  private joinRoom(socket: any, roomId: string) {
    if (!socket.userId) {
      socket.emit(SocketEvents.ERROR, { message: 'User not authenticated' })
      return
    }

    socket.join(roomId)
    
    // Update user session
    const session = this.userSessions.get(socket.userId)
    if (session) {
      session.rooms.push(roomId)
      session.lastSeen = new Date()
    }

    // Update room users
    if (!this.roomUsers.has(roomId)) {
      this.roomUsers.set(roomId, new Set())
    }
    this.roomUsers.get(roomId)?.add(socket.userId)

    console.log(`👥 User ${socket.userId} joined room: ${roomId}`)
    socket.emit(SocketEvents.JOIN_ROOM, { roomId, success: true })
  }

  // Leave room
  private leaveRoom(socket: any, roomId: string) {
    if (!socket.userId) return

    socket.leave(roomId)
    
    // Update user session
    const session = this.userSessions.get(socket.userId)
    if (session) {
      session.rooms = session.rooms.filter(room => room !== roomId)
      session.lastSeen = new Date()
    }

    // Update room users
    this.roomUsers.get(roomId)?.delete(socket.userId)

    console.log(`👋 User ${socket.userId} left room: ${roomId}`)
    socket.emit(SocketEvents.LEAVE_ROOM, { roomId, success: true })
  }

  // Handle message
  private handleMessage(socket: any, message: ChatMessage) {
    if (!socket.userId) {
      socket.emit(SocketEvents.ERROR, { message: 'User not authenticated' })
      return
    }

    // Broadcast message to room
    this.io?.to(message.roomId).emit(SocketEvents.RECEIVE_MESSAGE, {
      ...message,
      timestamp: new Date(),
    })

    console.log(`💬 Message sent in room ${message.roomId}: ${message.content}`)
  }

  // Handle typing start
  private handleTypingStart(socket: any, data: { roomId: string; userId: string }) {
    socket.to(data.roomId).emit(SocketEvents.TYPING_START, {
      roomId: data.roomId,
      userId: data.userId,
    })
  }

  // Handle typing stop
  private handleTypingStop(socket: any, data: { roomId: string; userId: string }) {
    socket.to(data.roomId).emit(SocketEvents.TYPING_STOP, {
      roomId: data.roomId,
      userId: data.userId,
    })
  }

  // Mark notification as read
  private markNotificationRead(socket: any, notificationId: string) {
    // In a real implementation, this would update the database
    console.log(`📖 Notification marked as read: ${notificationId}`)
    socket.emit(SocketEvents.MARK_READ, { notificationId, success: true })
  }

  // Handle disconnection
  private handleDisconnect(socket: any) {
    if (socket.userId) {
      this.userSessions.delete(socket.userId)
      
      // Remove user from all rooms
      this.roomUsers.forEach((users, roomId) => {
        users.delete(socket.userId)
      })

      console.log(`🔌 User disconnected: ${socket.userId}`)
    }
  }

  // Send notification to user
  sendNotification(userId: string, notification: Notification) {
    this.io?.to(`user_${userId}`).emit(SocketEvents.RECEIVE_NOTIFICATION, notification)
    console.log(`📢 Notification sent to user ${userId}: ${notification.title}`)
  }

  // Send notification to multiple users
  sendNotificationToUsers(userIds: string[], notification: Notification) {
    userIds.forEach(userId => {
      this.sendNotification(userId, notification)
    })
  }

  // Send system message to room
  sendSystemMessage(roomId: string, message: string, metadata?: Record<string, any>) {
    const systemMessage: ChatMessage = {
      id: `sys_${Date.now()}`,
      roomId,
      senderId: 'system',
      senderName: 'System',
      content: message,
      timestamp: new Date(),
      type: 'system',
      metadata,
    }

    this.io?.to(roomId).emit(SocketEvents.RECEIVE_MESSAGE, systemMessage)
    console.log(`🔔 System message sent to room ${roomId}: ${message}`)
  }

  // Send booking update
  sendBookingUpdate(userId: string, bookingId: string, status: string, data?: any) {
    this.io?.to(`user_${userId}`).emit(SocketEvents.BOOKING_UPDATE, {
      bookingId,
      status,
      timestamp: new Date(),
      data,
    })
    console.log(`📅 Booking update sent to user ${userId}: ${status}`)
  }

  // Send payment update
  sendPaymentUpdate(userId: string, paymentId: string, status: string, data?: any) {
    this.io?.to(`user_${userId}`).emit(SocketEvents.PAYMENT_UPDATE, {
      paymentId,
      status,
      timestamp: new Date(),
      data,
    })
    console.log(`💳 Payment update sent to user ${userId}: ${status}`)
  }

  // Get connected users in room
  getRoomUsers(roomId: string): string[] {
    return Array.from(this.roomUsers.get(roomId) || [])
  }

  // Get all connected users
  getConnectedUsers(): UserSession[] {
    return Array.from(this.userSessions.values())
  }

  // Get user session
  getUserSession(userId: string): UserSession | undefined {
    return this.userSessions.get(userId)
  }

  // Check if user is online
  isUserOnline(userId: string): boolean {
    return this.userSessions.has(userId)
  }

  // Get server instance
  getServer(): SocketIOServer | null {
    return this.io
  }
}

// Export singleton instance
export const webSocketService = new WebSocketService() 