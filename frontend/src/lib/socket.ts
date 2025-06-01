import { io, type Socket } from "socket.io-client"

class SocketService {
  private socket: Socket | null = null

  connect(token: string) {
    if (this.socket?.connected) {
      return this.socket
    }

    this.socket = io(import.meta.env.VITE_BACKEND_URL || "http://localhost:3000", {
      auth: {
        token: token,
      },
      transports: ["websocket"],
    })

    this.socket.on("connect", () => {
      console.log("Connected to socket server")
    })

    this.socket.on("disconnect", () => {
      console.log("Disconnected from socket server")
    })

    this.socket.on("error", (error) => {
      console.error("Socket error:", error)
    })

    return this.socket
  }

  disconnect() {
    if (this.socket) {
      this.socket.disconnect()
      this.socket = null
    }
  }

  getSocket() {
    return this.socket
  }

  isConnected() {
    return this.socket?.connected || false
  }

  // Send message via socket
  sendMessage(recipientId: string, content: string) {
    if (this.socket?.connected) {
      this.socket.emit("send_message", {
        recipientId,
        content,
      })
    }
  }

  // Listen for new messages
  onNewMessage(callback: (message: any) => void) {
    if (this.socket) {
      this.socket.on("new_message", callback)
    }
  }

  // Remove message listener
  offNewMessage() {
    if (this.socket) {
      this.socket.off("new_message")
    }
  }
}

export const socketService = new SocketService()
