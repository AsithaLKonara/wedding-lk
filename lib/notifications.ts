import { io, Socket } from "socket.io-client"

export interface Notification {
  id: string
  type: "info" | "success" | "warning" | "error"
  title: string
  message: string
  timestamp: Date
  read: boolean
  actionUrl?: string
  userId: string
}

class NotificationService {
  private socket: Socket | null = null
  private listeners: Map<string, (notification: Notification) => void> = new Map()

  connect(userId: string) {
    if (this.socket) return

    // In production, use your actual server URL
    this.socket = io(process.env.NEXT_PUBLIC_SOCKET_URL || "http://localhost:3001", {
      auth: {
        userId
      }
    })

    this.socket.on("connect", () => {
      console.log("Connected to notification service")
    })

    this.socket.on("notification", (notification: Notification) => {
      this.notifyListeners(notification)
    })

    this.socket.on("disconnect", () => {
      console.log("Disconnected from notification service")
    })
  }

  disconnect() {
    if (this.socket) {
      this.socket.disconnect()
      this.socket = null
    }
  }

  subscribe(callback: (notification: Notification) => void): string {
    const id = Math.random().toString(36).substr(2, 9)
    this.listeners.set(id, callback)
    return id
  }

  unsubscribe(id: string) {
    this.listeners.delete(id)
  }

  private notifyListeners(notification: Notification) {
    this.listeners.forEach(callback => {
      try {
        callback(notification)
      } catch (error) {
        console.error("Error in notification callback:", error)
      }
    })
  }

  // Send notification to server (for testing)
  sendNotification(notification: Omit<Notification, "id" | "timestamp" | "read">) {
    if (this.socket) {
      this.socket.emit("send-notification", notification)
    }
  }

  // Mark notification as read
  markAsRead(notificationId: string) {
    if (this.socket) {
      this.socket.emit("mark-read", { notificationId })
    }
  }
}

export const notificationService = new NotificationService()

