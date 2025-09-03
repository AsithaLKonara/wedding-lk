import { io } from "socket.io-client";
class NotificationService {
    constructor() {
        this.socket = null;
        this.listeners = new Map();
    }
    connect(userId) {
        if (this.socket)
            return;
        // In production, use your actual server URL
        this.socket = io(process.env.NEXT_PUBLIC_SOCKET_URL || "http://localhost:3001", {
            auth: {
                userId
            }
        });
        this.socket.on("connect", () => {
            console.log("Connected to notification service");
        });
        this.socket.on("notification", (notification) => {
            this.notifyListeners(notification);
        });
        this.socket.on("disconnect", () => {
            console.log("Disconnected from notification service");
        });
    }
    disconnect() {
        if (this.socket) {
            this.socket.disconnect();
            this.socket = null;
        }
    }
    subscribe(callback) {
        const id = Math.random().toString(36).substr(2, 9);
        this.listeners.set(id, callback);
        return id;
    }
    unsubscribe(id) {
        this.listeners.delete(id);
    }
    notifyListeners(notification) {
        this.listeners.forEach(callback => {
            try {
                callback(notification);
            }
            catch (error) {
                console.error("Error in notification callback:", error);
            }
        });
    }
    // Send notification to server (for testing)
    sendNotification(notification) {
        if (this.socket) {
            this.socket.emit("send-notification", notification);
        }
    }
    // Mark notification as read
    markAsRead(notificationId) {
        if (this.socket) {
            this.socket.emit("mark-read", { notificationId });
        }
    }
}
export const notificationService = new NotificationService();
