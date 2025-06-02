"use client"

import { useState, useRef, useEffect, useCallback } from "react"
import { useQuery } from "@apollo/client"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { ScrollArea } from "@/components/ui/scroll-area"
import { Header } from "@/components/common/header"
import { Search, Send, ChevronLeft, MessageSquare, Wifi, WifiOff } from "lucide-react"
import { cn } from "@/lib/utils"
import { GET_MY_CONVERSATIONS, GET_MESSAGES } from "@/graphql/queries/chat"
import { socketService } from "@/lib/socket"
import { Badge } from "@/components/ui/badge"
import Aurora from "@/components/ui/Aurora"

interface User {
  id: string
  username: string
  avatar?: string
  status: "online" | "offline"
}

interface Message {
  id: string
  content: string
  senderId: string
  createdAt: string
}

interface Conversation {
  id: string
  participants: User[]
  messages: Message[]
}

export default function MessagesPage() {
  const [activeConversation, setActiveConversation] = useState<string | null>(null)
  const [newMessage, setNewMessage] = useState("")
  const [searchQuery, setSearchQuery] = useState("")
  const [isMobileView, setIsMobileView] = useState(false)
  const [userToken, setUserToken] = useState<string | null>(null)
  const [currentUserId, setCurrentUserId] = useState<string | null>(null)
  const [socketConnected, setSocketConnected] = useState(false)
  const [localMessages, setLocalMessages] = useState<Message[]>([])
  const messagesEndRef = useRef<HTMLDivElement>(null)

  // Get user token from localStorage and decode user ID
  useEffect(() => {
    const token = localStorage.getItem("access_token")
    if (token) {
      setUserToken(token)

      // Decode JWT to get user ID (basic decode, in production use a proper JWT library)
      try {
        const payload = JSON.parse(atob(token.split(".")[1]))
        setCurrentUserId(payload.id || payload.sub)
      } catch (error) {
        console.error("Error decoding token:", error)
      }
    }
  }, [])

  // Socket connection management
  useEffect(() => {
    if (userToken && currentUserId) {
      const socket = socketService.connect(userToken)

      socket.on("connect", () => {
        setSocketConnected(true)
      })

      socket.on("disconnect", () => {
        setSocketConnected(false)
      })

      return () => {
        socketService.disconnect()
        setSocketConnected(false)
      }
    }
  }, [userToken, currentUserId])

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

  // GraphQL queries
  const {
    data: conversationsData,
    loading: conversationsLoading,
    error: conversationsError,
    refetch: refetchConversations,
  } = useQuery(GET_MY_CONVERSATIONS, {
    skip: !userToken,
  })

  const conversations: Conversation[] = conversationsData?.getMyConversations || []

  const otherUserId = conversations
    ?.find((c) => c.id === activeConversation)
    ?.participants.find((p) => p.id !== currentUserId)?.id || null;

  const {
    data: messagesData,
    loading: messagesLoading,
  } = useQuery(GET_MESSAGES, {
    variables: { withUserId: otherUserId },
    skip: !activeConversation || !userToken,
    context: {
      headers: {
        Authorization: userToken ? `Bearer ${userToken}` : "",
      },
    },
  })

  useEffect(() => {
    if (messagesEndRef.current) {
      messagesEndRef.current.scrollIntoView({ behavior: "smooth" })
    }
  }, [localMessages, messagesData])

  // Handle new messages via socket
  useEffect(() => {
    if (socketConnected && activeConversation && conversations.length > 0) {
      const handleNewMessage = (backendMessage: any) => {
        console.log('[Socket] Received new message:', backendMessage)
        
        try {
          // Transform backend message to frontend format
          const message: Message = {
            id: backendMessage.id,
            content: backendMessage.content,
            senderId: backendMessage.senderId || backendMessage.sender?.id,
            createdAt: backendMessage.createdAt,
          }

          // Validate message
          if (!message.id || !message.content || !message.senderId) {
            console.error('[Socket] Invalid message format:', backendMessage)
            return
          }
          
          // Find the other participant in the active conversation
          const otherParticipantId = conversations
            ?.find((c) => c.id === activeConversation)
            ?.participants.find((p) => p.id !== currentUserId)?.id

          // Only add message if it's for the active conversation
          const isForActiveConversation =
            (message.senderId === otherParticipantId) || 
            (message.senderId === currentUserId)

          console.log('[Socket] Message is for active conversation:', isForActiveConversation, {
            messageSenderId: message.senderId,
            otherParticipantId,
            currentUserId,
            activeConversation
          })

          if (isForActiveConversation) {
            setLocalMessages((prev) => {
              // Avoid duplicates
              const exists = prev.some((m) => m.id === message.id)
              if (exists) {
                console.log('[Socket] Message already exists, skipping')
                return prev
              }
              console.log('[Socket] Adding new message to local messages')
              return [...prev, message]
            })
          }
        } catch (error) {
          console.error('[Socket] Error processing message:', error)
        }
      }

      socketService.onNewMessage(handleNewMessage)

      return () => {
        socketService.offNewMessage()
      }
    }
  }, [socketConnected, activeConversation, currentUserId, conversations])

  // Reset local messages when conversation changes
  useEffect(() => {
    setLocalMessages([])
  }, [activeConversation])

  const serverMessages: Message[] = messagesData?.getMessages || []

  // Combine server messages with local messages, removing duplicates
  const allMessages = [...serverMessages, ...localMessages]
    .reduce((acc, message) => {
      const exists = acc.some((m) => m.id === message.id)
      if (!exists) {
        acc.push(message)
      }
      return acc
    }, [] as Message[])
    .sort((a, b) => new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime())

  const filteredConversations = conversations.filter((conversation) => {
    const otherParticipant = conversation.participants.find((p) => p.id !== currentUserId)
    return (
      !searchQuery ||
      otherParticipant?.username.toLowerCase().includes(searchQuery.toLowerCase()) ||
      conversation.messages[0]?.content.toLowerCase().includes(searchQuery.toLowerCase())
    )
  })

  const activeChat = conversations.find((conversation) => conversation.id === activeConversation)
  const otherParticipant = activeChat?.participants.find((p) => p.id !== currentUserId)

  const handleSendMessage = useCallback(async () => {
    if (!newMessage.trim() || !activeConversation || !socketConnected) return

    const messageContent = newMessage.trim()
    setNewMessage("")

    // Get the recipient ID (the other participant in the conversation)
    const recipientId = conversations
      ?.find((c) => c.id === activeConversation)
      ?.participants.find((p) => p.id !== currentUserId)?.id

    if (!recipientId) {
      console.error("Could not find recipient ID")
      return
    }

    // Send via socket for real-time delivery
    socketService.sendMessage(recipientId, messageContent)

    // Create optimistic message for immediate UI update
    const optimisticMessage: Message = {
      id: `temp-${Date.now()}`,
      content: messageContent,
      senderId: currentUserId!,
      createdAt: new Date().toISOString(),
    }

    setLocalMessages((prev) => [...prev, optimisticMessage])

    // Optionally refetch conversations to update last message
    setTimeout(() => {
      refetchConversations()
    }, 1000)
  }, [newMessage, activeConversation, socketConnected, currentUserId, refetchConversations, conversations])

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

  if (!userToken) {
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
        <div className="container mx-auto px-4 py-16 text-center">
          <h1 className="text-3xl font-bold mb-4">Authentication Required</h1>
          <p className="text-muted-foreground">Please sign in to access your messages.</p>
        </div>
      </div>
    )
  }

  if (conversationsError) {
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
        <div className="container mx-auto px-4 py-16 text-center">
          <h1 className="text-3xl font-bold mb-4">Error Loading Messages</h1>
          <p className="text-muted-foreground">There was an error loading your conversations. Please try again.</p>
        </div>
      </div>
    )
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
                  <div className="flex items-center justify-between mb-4">
                    <h2 className="text-xl font-semibold">Messages</h2>
                    <Badge variant={socketConnected ? "default" : "secondary"} className="text-xs">
                      {socketConnected ? (
                        <>
                          <Wifi className="h-3 w-3 mr-1" />
                          Connected
                        </>
                      ) : (
                        <>
                          <WifiOff className="h-3 w-3 mr-1" />
                          Offline
                        </>
                      )}
                    </Badge>
                  </div>
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
                    {conversationsLoading ? (
                      <div className="flex items-center justify-center py-8">
                        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
                      </div>
                    ) : filteredConversations.length === 0 ? (
                      <div className="text-center py-8 text-muted-foreground">
                        <MessageSquare className="mx-auto h-8 w-8 mb-2 opacity-50" />
                        <p>No conversations found</p>
                      </div>
                    ) : (
                      filteredConversations.map((conversation) => {
                        const participant = conversation.participants.find((p) => p.id !== currentUserId)
                        const lastMessage = conversation.messages[0]

                        return (
                          <button
                            key={conversation.id}
                            className={cn(
                              "w-full flex items-start p-3 rounded-lg mb-1 hover:bg-white/5 transition-colors text-left",
                              activeConversation === conversation.id && "bg-white/10",
                            )}
                            onClick={() => setActiveConversation(conversation.id)}
                          >
                            <div className="relative mr-3">
                              <Avatar className="h-12 w-12 border border-white/10">
                                <AvatarImage
                                  src={participant?.avatar || "/placeholder.svg"}
                                  alt={participant?.username || "User"}
                                />
                                <AvatarFallback>{participant?.username?.charAt(0) || "U"}</AvatarFallback>
                              </Avatar>
                              {participant?.status === "online" && (
                                <div className="absolute -bottom-0.5 -right-0.5 h-3 w-3 rounded-full bg-primary border-2 border-background" />
                              )}
                            </div>
                            <div className="flex-1 min-w-0">
                              <div className="flex items-center justify-between">
                                <h4 className="font-medium truncate">{participant?.username || "Unknown User"}</h4>
                                <span className="text-xs text-muted-foreground">
                                  {lastMessage && formatTimestamp(lastMessage.createdAt)}
                                </span>
                              </div>
                              <div className="flex items-center justify-between mt-1">
                                <p className="text-sm text-muted-foreground truncate max-w-[180px]">
                                  {lastMessage?.content || "No messages yet"}
                                </p>
                              </div>
                            </div>
                          </button>
                        )
                      })
                    )}
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
                      <AvatarImage
                        src={otherParticipant?.avatar || "/placeholder.svg"}
                        alt={otherParticipant?.username || "User"}
                      />
                      <AvatarFallback>{otherParticipant?.username?.charAt(0) || "U"}</AvatarFallback>
                    </Avatar>
                    <div>
                      <h3 className="font-medium">{otherParticipant?.username || "Unknown User"}</h3>
                      <p className="text-xs text-muted-foreground">
                        {otherParticipant?.status === "online" ? (
                          <span className="flex items-center">
                            <span className="h-1.5 w-1.5 rounded-full bg-primary mr-1.5"></span>
                            Online
                          </span>
                        ) : (
                          "Offline"
                        )}
                      </p>
                    </div>
                  </div>
                  <Badge variant={socketConnected ? "default" : "secondary"} className="text-xs">
                    {socketConnected ? "Real-time" : "Offline"}
                  </Badge>
                </div>

                {/* Messages */}
                <ScrollArea className="flex-1 p-4">
                  <div className="space-y-4">
                    {messagesLoading ? (
                      <div className="flex items-center justify-center py-8">
                        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
                      </div>
                    ) : allMessages.length === 0 ? (
                      <div className="text-center py-8 text-muted-foreground">
                        <MessageSquare className="mx-auto h-8 w-8 mb-2 opacity-50" />
                        <p>No messages yet. Start the conversation!</p>
                      </div>
                    ) : (
                      allMessages.map((message) => {
                        const isSentByMe = message.senderId === currentUserId
                        const isOptimistic = message.id.startsWith("temp-")

                        return (
                          <div key={message.id} className={cn("flex", isSentByMe ? "justify-end" : "justify-start")}>
                            {!isSentByMe && (
                              <Avatar className="h-8 w-8 mr-2 mt-1 flex-shrink-0 border border-white/10">
                                <AvatarImage
                                  src={otherParticipant?.avatar || "/placeholder.svg"}
                                  alt={otherParticipant?.username || "User"}
                                />
                                <AvatarFallback>{otherParticipant?.username?.charAt(0) || "U"}</AvatarFallback>
                              </Avatar>
                            )}
                            <div>
                              <div
                                className={cn(
                                  "chat-bubble",
                                  isSentByMe ? "chat-bubble-sent" : "chat-bubble-received",
                                  isOptimistic && "opacity-70",
                                )}
                              >
                                <p className="text-sm">{message.content}</p>
                              </div>
                              <div
                                className={cn(
                                  "flex items-center text-xs text-muted-foreground mt-1",
                                  isSentByMe ? "justify-end" : "justify-start",
                                )}
                              >
                                <span>{formatMessageTime(message.createdAt)}</span>
                                {isOptimistic && <span className="ml-1 text-xs">Sending...</span>}
                              </div>
                            </div>
                          </div>
                        )
                      })
                    )}
                    <div ref={messagesEndRef} />
                  </div>
                </ScrollArea>

                {/* Message Input */}
                <div className="p-4 border-t border-white/10">
                  <div className="flex items-end space-x-2">
                    <div className="flex-1 relative">
                      <Input
                        placeholder={socketConnected ? "Type a message..." : "Connecting..."}
                        className="min-h-[50px] py-6 bg-secondary/50 resize-none"
                        value={newMessage}
                        onChange={(e) => setNewMessage(e.target.value)}
                        onKeyDown={(e) => {
                          if (e.key === "Enter" && !e.shiftKey) {
                            e.preventDefault()
                            handleSendMessage()
                          }
                        }}
                        disabled={!socketConnected}
                      />
                    </div>
                    <Button
                      size="icon"
                      className="h-[50px] w-[50px] rounded-full"
                      onClick={handleSendMessage}
                      disabled={!newMessage.trim() || !socketConnected}
                    >
                      <Send className="h-5 w-5" />
                    </Button>
                  </div>
                  {!socketConnected && (
                    <p className="text-xs text-muted-foreground mt-2 text-center">
                      Reconnecting to enable real-time messaging...
                    </p>
                  )}
                </div>
              </div>
            ) : (
              <div className="flex flex-col items-center justify-center h-full p-4 text-center">
                <div className="w-16 h-16 rounded-full bg-secondary/50 flex items-center justify-center mb-4">
                  <MessageSquare className="h-8 w-8 text-muted-foreground" />
                </div>
                <h3 className="text-xl font-medium mb-2">Your Messages</h3>
                <p className="text-muted-foreground max-w-sm">
                  Select a conversation from the sidebar to start messaging
                </p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}
