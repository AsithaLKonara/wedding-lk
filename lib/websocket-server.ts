import { Server as SocketIOServer } from 'socket.io'
import { createServer } from 'http'
import { connectDB } from '@/lib/db'
import User from '@/lib/models/user'
import { Message } from '@/lib/models/message'
import { Notification } from '@/lib/models/notification'

interface AuthenticatedSocket {
  userId: string
  userRole: string
  userEmail: string
}

class WebSocketServer {
  private io: SocketIOServer | null = null
  private connectedUsers = new Map<string, AuthenticatedSocket>()

  initialize(server: ReturnType<typeof createServer>) {
    this.io = new SocketIOServer(server, {
      cors: {
        origin: process.env.NEXT_PUBLIC_BASE_URL || "http://localhost:3000",
        methods: ["GET", "POST"],
        credentials: true
      },
      transports: ['websocket', 'polling']
    })

    this.setupEventHandlers()
    console.log('✅ WebSocket server initialized')
  }

  private setupEventHandlers() {
    if (!this.io) return

    this.io.on('connection', async (socket) => {
      console.log(`🔌 New socket connection: ${socket.id}`)

      // Authentication middleware
      socket.on('authenticate', async (data: { token: string }) => {
        try {
          await connectDB()
          
          // In a real implementation, verify JWT token
          // For now, we'll use a simple user lookup
          const user = await User.findOne({ email: data.token })
          
          if (user) {
            const userData: AuthenticatedSocket = {
              userId: user._id.toString(),
              userRole: user.role,
              userEmail: user.email
            }
            
            this.connectedUsers.set(socket.id, userData)
            socket.emit('authenticated', { success: true, user: userData })
            
            // Join user-specific rooms
            socket.join(`user:${user._id}`)
            socket.join(`role:${user.role}`)
            
            // Notify others that user is online
            socket.broadcast.emit('user_online', {
              userId: user._id,
              userEmail: user.email
            })
            
            console.log(`✅ User authenticated: ${user.email}`)
          } else {
            socket.emit('authentication_error', { message: 'Invalid token' })
          }
        } catch (error) {
          console.error('Authentication error:', error)
          socket.emit('authentication_error', { message: 'Authentication failed' })
        }
      })

      // Real-time messaging
      socket.on('send_message', async (data: {
        recipientId: string
        content: string
        type: 'text' | 'image' | 'file'
      }) => {
        try {
          const userData = this.connectedUsers.get(socket.id)
          if (!userData) {
            socket.emit('error', { message: 'Not authenticated' })
            return
          }

          await connectDB()
          
          // Save message to database
          const message = new Message({
            senderId: userData.userId,
            recipientId: data.recipientId,
            content: data.content,
            type: data.type,
            status: 'sent'
          })
          
          await message.save()

          // Send to recipient if online
          const recipientSocket = this.findSocketByUserId(data.recipientId)
          if (recipientSocket) {
            this.io!.to(recipientSocket).emit('new_message', {
              messageId: message._id,
              senderId: userData.userId,
              senderEmail: userData.userEmail,
              content: data.content,
              type: data.type,
              timestamp: new Date()
            })
          }

          // Send confirmation to sender
          socket.emit('message_sent', {
            messageId: message._id,
            status: 'sent'
          })

        } catch (error) {
          console.error('Message sending error:', error)
          socket.emit('error', { message: 'Failed to send message' })
        }
      })

      // Typing indicators
      socket.on('typing_start', (data: { recipientId: string }) => {
        const recipientSocket = this.findSocketByUserId(data.recipientId)
        if (recipientSocket) {
          this.io!.to(recipientSocket).emit('user_typing', {
            userId: this.connectedUsers.get(socket.id)?.userId,
            isTyping: true
          })
        }
      })

      socket.on('typing_stop', (data: { recipientId: string }) => {
        const recipientSocket = this.findSocketByUserId(data.recipientId)
        if (recipientSocket) {
          this.io!.to(recipientSocket).emit('user_typing', {
            userId: this.connectedUsers.get(socket.id)?.userId,
            isTyping: false
          })
        }
      })

      // Real-time notifications
      socket.on('mark_notification_read', async (data: { notificationId: string }) => {
        try {
          await connectDB()
          
          await Notification.findByIdAndUpdate(data.notificationId, {
            isRead: true,
            readAt: new Date()
          })

          socket.emit('notification_updated', {
            notificationId: data.notificationId,
            isRead: true
          })

        } catch (error) {
          console.error('Notification update error:', error)
        }
      })

      // Room management for group chats
      socket.on('join_room', (data: { roomId: string }) => {
        socket.join(data.roomId)
        socket.emit('room_joined', { roomId: data.roomId })
      })

      socket.on('leave_room', (data: { roomId: string }) => {
        socket.leave(data.roomId)
        socket.emit('room_left', { roomId: data.roomId })
      })

      // Disconnect handling
      socket.on('disconnect', () => {
        const userData = this.connectedUsers.get(socket.id)
        if (userData) {
          this.connectedUsers.delete(socket.id)
          
          // Notify others that user is offline
          socket.broadcast.emit('user_offline', {
            userId: userData.userId,
            userEmail: userData.userEmail
          })
          
          console.log(`🔌 User disconnected: ${userData.userEmail}`)
        }
      })
    })
  }

  private findSocketByUserId(userId: string): string | null {
    for (const [socketId, userData] of this.connectedUsers.entries()) {
      if (userData.userId === userId) {
        return socketId
      }
    }
    return null
  }

  // Public methods for server-side events
  sendNotification(userId: string, notification: any) {
    if (!this.io) return

    const socketId = this.findSocketByUserId(userId)
    if (socketId) {
      this.io.to(socketId).emit('new_notification', notification)
    }
  }

  broadcastToRole(role: string, event: string, data: any) {
    if (!this.io) return
    this.io.to(`role:${role}`).emit(event, data)
  }

  broadcastToAll(event: string, data: any) {
    if (!this.io) return
    this.io.emit(event, data)
  }

  getConnectedUsersCount(): number {
    return this.connectedUsers.size
  }

  getConnectedUsers(): AuthenticatedSocket[] {
    return Array.from(this.connectedUsers.values())
  }
}

// Singleton instance
const webSocketServer = new WebSocketServer()
export default webSocketServer 