"use client"

import { useState, useRef, useEffect } from "react"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { ScrollArea } from "@/components/ui/scroll-area"
import { Header } from "@/components/common/header"
import {
  Search,
  Send,
  Smile,
  ChevronLeft,
  Check,
  Clock,
  MessageSquare,
} from "lucide-react"
import { cn } from "@/lib/utils"
import Aurora from "@/components/ui/Aurora"

export default function MessagesPage() {
  const [activeConversation, setActiveConversation] = useState<string | null>(null)
  const [conversations, setConversations] = useState<Conversation[]>([])
  const [newMessage, setNewMessage] = useState("")
  const [searchQuery, setSearchQuery] = useState("")
  const [isMobileView, setIsMobileView] = useState(false)
  const messagesEndRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const checkMobileView = () => {
      setIsMobileView(window.innerWidth < 768)
    }

    checkMobileView()
    window.addEventListener("resize", checkMobileView)

    return () => {
      window.removeEventListener("resize", checkMobileView)
    }
  }, [])

  useEffect(() => {
    if (messagesEndRef.current) {
      messagesEndRef.current.scrollIntoView({ behavior: "smooth" })
    }
  }, [activeConversation, conversations])

  const filteredConversations = conversations.filter(
    (conversation) =>
      conversation.user.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      conversation.lastMessage.toLowerCase().includes(searchQuery.toLowerCase()),
  )

  const activeChat = conversations.find((conversation) => conversation.id === activeConversation)

  const handleSendMessage = () => {
    if (!newMessage.trim() || !activeConversation) return

    const updatedConversations = conversations.map((conversation) => {
      if (conversation.id === activeConversation) {
        const newMessageObj: Message = {
          id: `msg-${Date.now()}`,
          content: newMessage,
          timestamp: new Date().toISOString(),
          sender: "me",
          status: "sent",
        }

        return {
          ...conversation,
          messages: [...conversation.messages, newMessageObj],
          lastMessage: newMessage,
          lastMessageTime: new Date().toISOString(),
        }
      }
      return conversation
    })

    setConversations(updatedConversations)
    setNewMessage("")

    // Simulate reply after a delay
    if (activeConversation === "conv-1") {
      setTimeout(() => {
        const updatedWithReply = updatedConversations.map((conversation) => {
          if (conversation.id === activeConversation) {
            const replyMessage: Message = {
              id: `msg-${Date.now() + 1}`,
              content: "Thanks for your message! I'll take a look at that proposal soon.",
              timestamp: new Date().toISOString(),
              sender: conversation.user.id,
              status: "delivered",
            }

            return {
              ...conversation,
              messages: [...conversation.messages, replyMessage],
              lastMessage: replyMessage.content,
              lastMessageTime: replyMessage.timestamp,
              typing: false,
            }
          }
          return conversation
        })

        setConversations(updatedWithReply)
      }, 3000)

      // Show typing indicator
      const updatedWithTyping = updatedConversations.map((conversation) => {
        if (conversation.id === activeConversation) {
          return {
            ...conversation,
            typing: true,
          }
        }
        return conversation
      })

      setTimeout(() => {
        setConversations(updatedWithTyping)
      }, 1000)
    }
  }

  const formatTimestamp = (timestamp: string) => {
    const date = new Date(timestamp)
    const now = new Date()
    const diffInDays = Math.floor((now.getTime() - date.getTime()) / (1000 * 60 * 60 * 24))

    if (diffInDays === 0) {
      return date.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })
    } else if (diffInDays === 1) {
      return "Yesterday"
    } else if (diffInDays < 7) {
      return date.toLocaleDateString([], { weekday: "short" })
    } else {
      return date.toLocaleDateString([], { month: "short", day: "numeric" })
    }
  }

  const formatMessageTime = (timestamp: string) => {
    const date = new Date(timestamp)
    return date.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })
  }

  const getMessageStatus = (status: string) => {
    switch (status) {
      case "sent":
        return <Check className="h-3 w-3 text-muted-foreground" />
      case "delivered":
        return <Check className="h-3 w-3 text-muted-foreground" />
      case "read":
        return <Check className="h-3 w-3 text-primary" />
      case "pending":
        return <Clock className="h-3 w-3 text-muted-foreground" />
      default:
        return null
    }
  }

  return (
  <div className="relative min-h-screen w-full overflow-hidden">
    {/* Aurora Background */}
    <div className="absolute inset-0 -z-10">
      <Aurora
        colorStops={[
          "#003B49", // Aqua blue
          "#003B49", // Dark green
        ]}
        blend={0.2}
        amplitude={1.2}
        speed={0.5}
      />
    </div>
      <Header />
      <div className="container mx-auto px-0 py-4 content-z-index">
        <div className="rounded-xl bg-background/40 backdrop-blur-md border border-white/10 overflow-hidden h-[calc(100vh-8rem)]">
          <div className="grid h-full md:grid-cols-[320px_1fr]">
            {/* Conversations Sidebar */}
            {(!activeConversation || !isMobileView) && (
              <div className="border-r border-white/10 h-full flex flex-col">
                <div className="p-4 border-b border-white/10">
                  <h2 className="text-xl font-semibold mb-4">Messages</h2>
                  <div className="relative">
                    <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
                    <Input
                      type="search"
                      placeholder="Search conversations..."
                      className="pl-9 bg-secondary/50"
                      value={searchQuery}
                      onChange={(e) => setSearchQuery(e.target.value)}
                    />
                  </div>
                </div>

                <ScrollArea className="flex-1">
                  <div className="px-2 py-2">
                    {filteredConversations.map((conversation) => (
                      <button
                        key={conversation.id}
                        className={cn(
                          "w-full flex items-start p-3 rounded-lg mb-1 hover:bg-white/5 transition-colors text-left",
                          activeConversation === conversation.id && "bg-white/10",
                          conversation.unread && "bg-white/5",
                        )}
                        onClick={() => setActiveConversation(conversation.id)}
                      >
                        <div className="relative mr-3">
                          <Avatar className="h-12 w-12 border border-white/10">
                            <AvatarImage
                              src={conversation.user.avatar || "/placeholder.svg"}
                              alt={conversation.user.name}
                            />
                            <AvatarFallback>{conversation.user.name.charAt(0)}</AvatarFallback>
                          </Avatar>
                          {conversation.user.status === "online" && (
                            <div className="absolute -bottom-0.5 -right-0.5 h-3 w-3 rounded-full bg-primary border-2 border-background" />
                          )}
                          {conversation.unread && (
                            <div className="absolute -top-1 -right-1 h-5 w-5 rounded-full bg-primary flex items-center justify-center text-[10px] font-medium text-primary-foreground">
                              {conversation.unreadCount}
                            </div>
                          )}
                        </div>
                        <div className="flex-1 min-w-0">
                          <div className="flex items-center justify-between">
                            <h4 className="font-medium truncate">{conversation.user.name}</h4>
                            <span className="text-xs text-muted-foreground">
                              {formatTimestamp(conversation.lastMessageTime)}
                            </span>
                          </div>
                          <div className="flex items-center justify-between mt-1">
                            <p className="text-sm text-muted-foreground truncate max-w-[180px]">
                              {conversation.typing ? (
                                <span className="typing-indicator">
                                  <span></span>
                                  <span></span>
                                  <span></span>
                                </span>
                              ) : (
                                conversation.lastMessage
                              )}
                            </p>
                            {conversation.muted && (
                              <div className="text-muted-foreground">
                                <svg
                                  xmlns="http://www.w3.org/2000/svg"
                                  width="14"
                                  height="14"
                                  viewBox="0 0 24 24"
                                  fill="none"
                                  stroke="currentColor"
                                  strokeWidth="2"
                                  strokeLinecap="round"
                                  strokeLinejoin="round"
                                >
                                  <path d="M15 8a5 5 0 0 1 0 8"></path>
                                  <path d="M17.7 5a9 9 0 0 1 0 14"></path>
                                  <line x1="3" y1="3" x2="21" y2="21"></line>
                                </svg>
                              </div>
                            )}
                          </div>
                        </div>
                      </button>
                    ))}
                  </div>
                </ScrollArea>
              </div>
            )}

            {/* Chat Area */}
            {activeChat ? (
              <div className="flex flex-col h-full">
                {/* Chat Header */}
                <div className="p-4 border-b border-white/10 flex items-center justify-between">
                  <div className="flex items-center">
                    {isMobileView && (
                      <Button
                        variant="ghost"
                        size="icon"
                        className="mr-2 h-8 w-8"
                        onClick={() => setActiveConversation(null)}
                      >
                        <ChevronLeft className="h-4 w-4" />
                      </Button>
                    )}
                    <Avatar className="h-10 w-10 mr-3 border border-white/10">
                      <AvatarImage src={activeChat.user.avatar || "/placeholder.svg"} alt={activeChat.user.name} />
                      <AvatarFallback>{activeChat.user.name.charAt(0)}</AvatarFallback>
                    </Avatar>
                    <div>
                      <h3 className="font-medium">{activeChat.user.name}</h3>
                      <p className="text-xs text-muted-foreground">
                        {activeChat.user.status === "online" ? (
                          <span className="flex items-center">
                            <span className="h-1.5 w-1.5 rounded-full bg-primary mr-1.5"></span>
                            Online
                          </span>
                        ) : (
                          "Last active 2h ago"
                        )}
                      </p>
                    </div>
                  </div>
                </div>

                {/* Messages */}
                <ScrollArea className="flex-1 p-4">
                  <div className="space-y-4">
                    {activeChat.messages.map((message) => {
                      const isSentByMe = message.sender === "me"
                      return (
                        <div key={message.id} className={cn("flex", isSentByMe ? "justify-end" : "justify-start")}>
                          {!isSentByMe && (
                            <Avatar className="h-8 w-8 mr-2 mt-1 flex-shrink-0 border border-white/10">
                              <AvatarImage
                                src={activeChat.user.avatar || "/placeholder.svg"}
                                alt={activeChat.user.name}
                              />
                              <AvatarFallback>{activeChat.user.name.charAt(0)}</AvatarFallback>
                            </Avatar>
                          )}
                          <div>
                            <div
                              className={cn("chat-bubble", isSentByMe ? "chat-bubble-sent" : "chat-bubble-received")}
                            >
                              <p className="text-sm">{message.content}</p>
                            </div>
                            <div
                              className={cn(
                                "flex items-center text-xs text-muted-foreground mt-1",
                                isSentByMe ? "justify-end" : "justify-start",
                              )}
                            >
                              <span>{formatMessageTime(message.timestamp)}</span>
                              {isSentByMe && <span className="ml-1">{getMessageStatus(message.status)}</span>}
                            </div>
                          </div>
                        </div>
                      )
                    })}
                    {activeChat.typing && (
                      <div className="flex justify-start">
                        <Avatar className="h-8 w-8 mr-2 mt-1 flex-shrink-0 border border-white/10">
                          <AvatarImage src={activeChat.user.avatar || "/placeholder.svg"} alt={activeChat.user.name} />
                          <AvatarFallback>{activeChat.user.name.charAt(0)}</AvatarFallback>
                        </Avatar>
                        <div className="chat-bubble chat-bubble-received py-3">
                          <div className="typing-indicator">
                            <span></span>
                            <span></span>
                            <span></span>
                          </div>
                        </div>
                      </div>
                    )}
                    <div ref={messagesEndRef} />
                  </div>
                </ScrollArea>

                {/* Message Input */}
                <div className="p-4 border-t border-white/10">
                  <div className="flex items-end space-x-2">
                    <div className="flex-1 relative">
                      <Input
                        placeholder="Type a message..."
                        className="min-h-[50px] py-6 pr-12 bg-secondary/50 resize-none"
                        value={newMessage}
                        onChange={(e) => setNewMessage(e.target.value)}
                        onKeyDown={(e) => {
                          if (e.key === "Enter" && !e.shiftKey) {
                            e.preventDefault()
                            handleSendMessage()
                          }
                        }}
                      />
                      <div className="absolute right-3 bottom-3 flex items-center space-x-1">
                        <Button variant="ghost" size="icon" className="h-8 w-8 text-muted-foreground">
                          <Smile className="h-5 w-5" />
                        </Button>
                      </div>
                    </div>
                    <Button
                      size="icon"
                      className="h-[50px] w-[50px] rounded-full"
                      onClick={handleSendMessage}
                      disabled={!newMessage.trim()}
                    >
                      <Send className="h-5 w-5" />
                    </Button>
                  </div>
                </div>
              </div>
            ) : (
              <div className="flex flex-col items-center justify-center h-full p-4 text-center">
                <div className="w-16 h-16 rounded-full bg-secondary/50 flex items-center justify-center mb-4">
                  <MessageSquare className="h-8 w-8 text-muted-foreground" />
                </div>
                <h3 className="text-xl font-medium mb-2">Your Messages</h3>
                <p className="text-muted-foreground max-w-sm">
                  Select a conversation from the sidebar or start a new one to begin messaging
                </p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}

// Types
interface User {
  id: string
  name: string
  avatar: string
  status: "online" | "offline" | "away"
}

interface Message {
  id: string
  content: string
  timestamp: string
  sender: string
  status: "sent" | "delivered" | "read" | "pending"
}

interface Conversation {
  id: string
  user: User
  messages: Message[]
  lastMessage: string
  lastMessageTime: string
  unread: boolean
  unreadCount: number
  muted: boolean
  typing?: boolean
}