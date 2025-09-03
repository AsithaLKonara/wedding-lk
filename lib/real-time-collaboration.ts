import { Server as SocketIOServer } from 'socket.io'
import { Server as HTTPServer } from 'http'
import { connectDB } from './db'
import { User, Booking, Task, Message } from './models'

interface CollaborationSession {
  id: string
  type: 'wedding_planning' | 'vendor_coordination' | 'task_management'
  participants: string[]
  activeUsers: Map<string, UserSession>
  documents: Map<string, DocumentState>
  comments: Comment[]
  lastActivity: Date
}

interface UserSession {
  userId: string
  socketId: string
  username: string
  role: string
  isTyping: boolean
  lastSeen: Date
}

interface DocumentState {
  id: string
  content: string
  version: number
  lastModified: Date
  lastModifiedBy: string
  collaborators: string[]
}

interface Comment {
  id: string
  userId: string
  username: string
  content: string
  timestamp: Date
  documentId?: string
  replyTo?: string
  reactions: Map<string, string>
}

interface LiveEditOperation {
  type: 'insert' | 'delete' | 'replace'
  position: number
  content?: string
  length?: number
  userId: string
  timestamp: Date
  documentId?: string
}

class RealTimeCollaborationService {
  private io: SocketIOServer | null = null
  private activeSessions: Map<string, CollaborationSession> = new Map()
  private userSessions: Map<string, UserSession> = new Map()

  initialize(server: HTTPServer) {
    this.io = new SocketIOServer(server, {
      cors: {
        origin: process.env.NEXT_PUBLIC_APP_URL || "http://localhost:3000",
        methods: ["GET", "POST"],
        credentials: true
      },
      transports: ['websocket', 'polling']
    })

    this.setupEventHandlers()
    console.log('✅ Real-time collaboration service initialized')
  }

  private setupEventHandlers() {
    if (!this.io) return

    this.io.on('connection', (socket) => {
      console.log(`🔌 User connected to collaboration service: ${socket.id}`)

      // Join collaboration session
      socket.on('join-session', async (data: { sessionId: string; userId: string }) => {
        await this.handleJoinSession(socket, data)
      })

      // Leave collaboration session
      socket.on('leave-session', (data: { sessionId: string; userId: string }) => {
        this.handleLeaveSession(socket, data)
      })

      // Live document editing
      socket.on('document-edit', (data: { sessionId: string; operation: LiveEditOperation }) => {
        this.handleDocumentEdit(socket, data)
      })

      // Add comment
      socket.on('add-comment', async (data: { sessionId: string; comment: Omit<Comment, 'id' | 'timestamp'> }) => {
        await this.handleAddComment(socket, data)
      })

      // React to comment
      socket.on('comment-reaction', (data: { sessionId: string; commentId: string; userId: string; reaction: string }) => {
        this.handleCommentReaction(socket, data)
      })

      // Typing indicators
      socket.on('typing-start', (data: { sessionId: string; userId: string }) => {
        this.handleTypingStart(socket, data)
      })

      socket.on('typing-stop', (data: { sessionId: string; userId: string }) => {
        this.handleTypingStop(socket, data)
      })

      // Task coordination
      socket.on('task-update', async (data: { sessionId: string; taskId: string; updates: any }) => {
        await this.handleTaskUpdate(socket, data)
      })

      // Real-time notifications
      socket.on('notification', (data: { sessionId: string; userId: string; message: string }) => {
        this.handleNotification(socket, data)
      })

      // Disconnect handling
      socket.on('disconnect', () => {
        this.handleDisconnect(socket)
      })
    })
  }

  private async handleJoinSession(socket: any, data: { sessionId: string; userId: string }) {
    try {
      await connectDB()
      
      const user = await User.findById(data.userId)
      if (!user) {
        socket.emit('error', { message: 'User not found' })
        return
      }

      let session = this.activeSessions.get(data.sessionId)
      if (!session) {
        session = await this.createSession(data.sessionId, data.userId)
        this.activeSessions.set(data.sessionId, session)
      }

      const userSession: UserSession = {
        userId: data.userId,
        socketId: socket.id,
        username: user.name || user.email,
        role: user.role || 'user',
        isTyping: false,
        lastSeen: new Date()
      }

      session.activeUsers.set(socket.id, userSession)
      session.participants.push(data.userId)
      this.userSessions.set(socket.id, userSession)

      socket.join(data.sessionId)
      
      // Send session data to the user
      socket.emit('session-joined', {
        sessionId: data.sessionId,
        session: this.sanitizeSession(session),
        userSession
      })

      // Notify other participants
      socket.to(data.sessionId).emit('user-joined', {
        userId: data.userId,
        username: userSession.username,
        role: userSession.role
      })

      console.log(`👤 User ${userSession.username} joined session ${data.sessionId}`)
    } catch (error) {
      console.error('Error joining session:', error)
      socket.emit('error', { message: 'Failed to join session' })
    }
  }

  private handleLeaveSession(socket: any, data: { sessionId: string; userId: string }) {
    const session = this.activeSessions.get(data.sessionId)
    if (session) {
      session.activeUsers.delete(socket.id)
      session.participants = session.participants.filter(id => id !== data.userId)
      
      if (session.participants.length === 0) {
        this.activeSessions.delete(data.sessionId)
      }
    }

    this.userSessions.delete(socket.id)
    socket.leave(data.sessionId)
    
    socket.to(data.sessionId).emit('user-left', {
      userId: data.userId
    })
  }

  private handleDocumentEdit(socket: any, data: { sessionId: string; operation: LiveEditOperation }) {
    const session = this.activeSessions.get(data.sessionId)
    if (!session) return

    const document = session.documents.get(data.operation.documentId || 'default')
    if (document) {
      // Apply operation to document
      this.applyEditOperation(document, data.operation)
      
      // Broadcast to other participants
      socket.to(data.sessionId).emit('document-updated', {
        documentId: data.operation.documentId || 'default',
        operation: data.operation,
        document: this.sanitizeDocument(document)
      })
    }
  }

  private async handleAddComment(socket: any, data: { sessionId: string; comment: Omit<Comment, 'id' | 'timestamp'> }) {
    try {
      const session = this.activeSessions.get(data.sessionId)
      if (!session) return

      const comment: Comment = {
        id: Math.random().toString(36).substr(2, 9),
        ...data.comment,
        timestamp: new Date(),
        reactions: new Map()
      }

      session.comments.push(comment)
      
      // Save comment to database if needed
      await this.saveCommentToDatabase(comment, data.sessionId)

      // Broadcast to all participants
      this.io?.to(data.sessionId).emit('comment-added', {
        comment: this.sanitizeComment(comment)
      })
    } catch (error) {
      console.error('Error adding comment:', error)
      socket.emit('error', { message: 'Failed to add comment' })
    }
  }

  private handleCommentReaction(socket: any, data: { sessionId: string; commentId: string; userId: string; reaction: string }) {
    const session = this.activeSessions.get(data.sessionId)
    if (!session) return

    const comment = session.comments.find(c => c.id === data.commentId)
    if (comment) {
      comment.reactions.set(data.userId, data.reaction)
      
      // Broadcast reaction to all participants
      this.io?.to(data.sessionId).emit('comment-reaction-updated', {
        commentId: data.commentId,
        reactions: Array.from(comment.reactions.entries())
      })
    }
  }

  private handleTypingStart(socket: any, data: { sessionId: string; userId: string }) {
    const session = this.activeSessions.get(data.sessionId)
    if (!session) return

    const userSession = session.activeUsers.get(socket.id)
    if (userSession) {
      userSession.isTyping = true
      
      socket.to(data.sessionId).emit('user-typing', {
        userId: data.userId,
        username: userSession.username
      })
    }
  }

  private handleTypingStop(socket: any, data: { sessionId: string; userId: string }) {
    const session = this.activeSessions.get(data.sessionId)
    if (!session) return

    const userSession = session.activeUsers.get(socket.id)
    if (userSession) {
      userSession.isTyping = false
      
      socket.to(data.sessionId).emit('user-stopped-typing', {
        userId: data.userId
      })
    }
  }

  private async handleTaskUpdate(socket: any, data: { sessionId: string; taskId: string; updates: any }) {
    try {
      await connectDB()
      
      // Update task in database
      const updatedTask = await Task.findByIdAndUpdate(
        data.taskId,
        { ...data.updates, updatedAt: new Date() },
        { new: true }
      )

      if (updatedTask) {
        // Broadcast task update to all participants
        this.io?.to(data.sessionId).emit('task-updated', {
          taskId: data.taskId,
          task: updatedTask
        })
      }
    } catch (error) {
      console.error('Error updating task:', error)
      socket.emit('error', { message: 'Failed to update task' })
    }
  }

  private handleNotification(socket: any, data: { sessionId: string; userId: string; message: string }) {
    // Broadcast notification to all participants
    this.io?.to(data.sessionId).emit('notification', {
      userId: data.userId,
      message: data.message,
      timestamp: new Date()
    })
  }

  private handleDisconnect(socket: any) {
    // Find and remove user from all sessions
    for (const [sessionId, session] of this.activeSessions.entries()) {
      if (session.activeUsers.has(socket.id)) {
        const userSession = session.activeUsers.get(socket.id)
        if (userSession) {
          session.activeUsers.delete(socket.id)
          session.participants = session.participants.filter(id => id !== userSession.userId)
          
          // Notify other participants
          socket.to(sessionId).emit('user-disconnected', {
            userId: userSession.userId,
            username: userSession.username
          })
          
          if (session.participants.length === 0) {
            this.activeSessions.delete(sessionId)
          }
        }
      }
    }

    this.userSessions.delete(socket.id)
    console.log(`🔌 User disconnected from collaboration service: ${socket.id}`)
  }

  // Session Management
  private async createSession(sessionId: string, creatorId: string): Promise<CollaborationSession> {
    const session: CollaborationSession = {
      id: sessionId,
      type: 'wedding_planning',
      participants: [creatorId],
      activeUsers: new Map(),
      documents: new Map(),
      comments: [],
      lastActivity: new Date()
    }

    // Initialize default document
    session.documents.set('default', {
      id: 'default',
      content: 'Welcome to your wedding planning session!',
      version: 1,
      lastModified: new Date(),
      lastModifiedBy: creatorId,
      collaborators: [creatorId]
    })

    return session
  }

  // Document Operations
  private applyEditOperation(document: DocumentState, operation: LiveEditOperation) {
    switch (operation.type) {
      case 'insert':
        document.content = document.content.slice(0, operation.position) + 
                          (operation.content || '') + 
                          document.content.slice(operation.position)
        break
      case 'delete':
        document.content = document.content.slice(0, operation.position) + 
                          document.content.slice(operation.position + (operation.length || 0))
        break
      case 'replace':
        document.content = document.content.slice(0, operation.position) + 
                          (operation.content || '') + 
                          document.content.slice(operation.position + (operation.length || 0))
        break
    }

    document.version++
    document.lastModified = new Date()
    document.lastModifiedBy = operation.userId
  }

  // Database Operations
  private async saveCommentToDatabase(comment: Comment, sessionId: string) {
    try {
      const message = new Message({
        sender: comment.userId,
        content: comment.content,
        type: 'comment',
        metadata: {
          sessionId,
          commentId: comment.id,
          replyTo: comment.replyTo
        }
      })
      
      await message.save()
    } catch (error) {
      console.error('Error saving comment to database:', error)
    }
  }

  // Utility Methods
  private sanitizeSession(session: CollaborationSession) {
    return {
      id: session.id,
      type: session.type,
      participants: session.participants,
      activeUsersCount: session.activeUsers.size,
      documentsCount: session.documents.size,
      commentsCount: session.comments.length,
      lastActivity: session.lastActivity
    }
  }

  private sanitizeDocument(document: DocumentState) {
    return {
      id: document.id,
      content: document.content,
      version: document.version,
      lastModified: document.lastModified,
      lastModifiedBy: document.lastModifiedBy,
      collaboratorsCount: document.collaborators.length
    }
  }

  private sanitizeComment(comment: Comment) {
    return {
      id: comment.id,
      userId: comment.userId,
      username: comment.username,
      content: comment.content,
      timestamp: comment.timestamp,
      documentId: comment.documentId,
      replyTo: comment.replyTo,
      reactions: Array.from(comment.reactions.entries())
    }
  }

  // Public Methods
  public getActiveSessions() {
    return Array.from(this.activeSessions.values()).map(session => this.sanitizeSession(session))
  }

  public getSessionParticipants(sessionId: string) {
    const session = this.activeSessions.get(sessionId)
    return session ? Array.from(session.activeUsers.values()) : []
  }

  public broadcastToSession(sessionId: string, event: string, data: any) {
    this.io?.to(sessionId).emit(event, data)
  }
}

export const realTimeCollaborationService = new RealTimeCollaborationService() 