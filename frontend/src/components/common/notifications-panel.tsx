"use client"

import { useState } from "react"
import { AnimatePresence, motion } from "framer-motion"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Button } from "@/components/ui/button"
import { Bell, Check, Trash2, X, Wifi, WifiOff } from "lucide-react"
import { cn } from "@/lib/utils"
import { useNotifications } from "@/context/NotificationsContext"

export interface Notification {
  id: string
  type: "like" | "comment" | "message" | "share" | "connection"
  user: {
    name: string
    avatar: string
  }
  content: string
  timestamp: string
  read: boolean
  link?: string
}

interface NotificationsPanelProps {
  isOpen: boolean
  onClose: () => void
}

export function NotificationsPanel({ isOpen, onClose }: NotificationsPanelProps) {
  const {
    notifications,
    unreadCount,
    isConnected,
    error,
    markAsRead,
    markAllAsRead,
    clearNotification,
    clearAllNotifications,
  } = useNotifications()
  
  const [filter, setFilter] = useState<"all" | "unread">("all")

  const filteredNotifications =
    filter === "all" ? notifications : notifications.filter((notification) => !notification.read)

  const formatTimestamp = (timestamp: string) => {
    const date = new Date(timestamp)
    const now = new Date()
    const diffInSeconds = Math.floor((now.getTime() - date.getTime()) / 1000)

    if (diffInSeconds < 60) {
      return `${diffInSeconds}s ago`
    } else if (diffInSeconds < 3600) {
      return `${Math.floor(diffInSeconds / 60)}m ago`
    } else if (diffInSeconds < 86400) {
      return `${Math.floor(diffInSeconds / 3600)}h ago`
    } else {
      return date.toLocaleDateString()
    }
  }

  const getNotificationIcon = (type: Notification["type"]) => {
    switch (type) {
      case "like":
        return "❤️"
      case "comment":
        return "💬"
      case "message":
        return "✉️"
      case "share":
        return "🔄"
      case "connection":
        return "🔗"
      default:
        return "📣"
    }
  }

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -10 }}
          transition={{ duration: 0.2 }}
          className="absolute right-0 top-full mt-2 w-80 sm:w-96 rounded-xl bg-background/95 backdrop-blur-md shadow-lg border border-white/10 overflow-hidden z-50"
        >          <div className="p-4 border-b border-white/10">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <h3 className="text-lg font-semibold">Notifications</h3>
                {/* Connection status indicator */}
                <div className={cn(
                  "flex items-center gap-1 text-xs px-2 py-1 rounded-full",
                  isConnected ? "bg-green-500/20 text-green-400" : "bg-red-500/20 text-red-400"
                )}>
                  {isConnected ? (
                    <>
                      <Wifi className="h-3 w-3" />
                      <span>Live</span>
                    </>
                  ) : (
                    <>
                      <WifiOff className="h-3 w-3" />
                      <span>Offline</span>
                    </>
                  )}
                </div>
              </div>
              <Button variant="ghost" size="icon" onClick={onClose} className="h-8 w-8">
                <X className="h-4 w-4" />
                <span className="sr-only">Close</span>
              </Button>
            </div>
            
            {/* Error message */}
            {error && (
              <div className="mt-2 p-2 bg-red-500/20 text-red-400 text-xs rounded-md">
                {error}
              </div>
            )}
            <div className="flex items-center justify-between mt-2">
              <div className="flex space-x-2">
                <Button
                  variant={filter === "all" ? "default" : "ghost"}
                  size="sm"
                  onClick={() => setFilter("all")}
                  className="h-8 text-xs"
                >
                  All
                </Button>
                <Button
                  variant={filter === "unread" ? "default" : "ghost"}
                  size="sm"
                  onClick={() => setFilter("unread")}
                  className="h-8 text-xs"
                >
                  Unread {unreadCount > 0 && `(${unreadCount})`}
                </Button>
              </div>
              <div className="flex space-x-1">
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={markAllAsRead}
                  disabled={unreadCount === 0}
                  className="h-8 text-xs"
                >
                  <Check className="mr-1 h-3 w-3" />
                  Mark all read
                </Button>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={clearAllNotifications}
                  disabled={notifications.length === 0}
                  className="h-8 text-xs"
                >
                  <Trash2 className="mr-1 h-3 w-3" />
                  Clear all
                </Button>
              </div>
            </div>
          </div>

          <div className="max-h-[60vh] overflow-y-auto">
            {filteredNotifications.length === 0 ? (
              <div className="p-8 text-center text-muted-foreground">
                <Bell className="mx-auto h-8 w-8 mb-2 opacity-50" />
                <p>No notifications to display</p>
              </div>
            ) : (
              <div>
                {filteredNotifications.map((notification) => (
                  <motion.div
                    key={notification.id}
                    initial={{ opacity: 0, y: -5 }}
                    animate={{ opacity: 1, y: 0 }}
                    className={cn(
                      "p-4 border-b border-white/5 hover:bg-white/5 transition-colors relative",
                      !notification.read && "bg-white/[0.03]",
                    )}
                  >
                    {!notification.read && <div className="unread-indicator" />}
                    <div className="flex items-start">
                      <div className="flex-shrink-0 mr-4">
                        <Avatar className="h-10 w-10 border border-white/10">
                          <AvatarImage
                            src={notification.user.avatar || "/placeholder.svg"}
                            alt={notification.user.name}
                          />
                          <AvatarFallback>{notification.user.name.charAt(0)}</AvatarFallback>
                        </Avatar>
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className="flex items-start justify-between">
                          <p className="text-sm">
                            <span className="font-medium">{notification.user.name}</span>{" "}
                            <span className="text-muted-foreground">{notification.content}</span>
                          </p>
                          <span className="text-xs text-muted-foreground ml-2 whitespace-nowrap">
                            {formatTimestamp(notification.timestamp)}
                          </span>
                        </div>
                        <div className="mt-1 flex items-center text-xs">
                          <span className="mr-2">{getNotificationIcon(notification.type)}</span>
                          <span className="text-muted-foreground capitalize">{notification.type}</span>
                        </div>
                      </div>
                    </div>
                    <div className="mt-2 flex justify-end space-x-2">
                      {!notification.read && (
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => markAsRead(notification.id)}
                          className="h-7 text-xs"
                        >
                          <Check className="mr-1 h-3 w-3" />
                          Mark as read
                        </Button>
                      )}
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => clearNotification(notification.id)}
                        className="h-7 text-xs text-muted-foreground hover:text-destructive"
                      >
                        <Trash2 className="mr-1 h-3 w-3" />
                        Clear
                      </Button>
                    </div>
                  </motion.div>
                ))}
              </div>
            )}
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  )
}
