"use client"

import type React from "react"

import Aurora from "@/components/ui/Aurora"
import { Header } from "@/components/common/header"
import { useState, useRef } from "react"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Button } from "@/components/ui/button"
import { Textarea } from "@/components/ui/textarea"
import { Separator } from "@/components/ui/separator"
import { ScrollArea } from "@/components/ui/scroll-area"
import {
  Heart,
  MessageCircle,
  Share2,
  ImageIcon,
  LinkIcon,
  Send,
  MoreHorizontal,
  Clock,
  ThumbsUp,
  LucideReply,
  Trash2,
} from "lucide-react"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"
import { cn } from "@/lib/utils"

export default function HomePage() {
  const [posts, setPosts] = useState<Post[]>(SAMPLE_POSTS)
  const [newPostText, setNewPostText] = useState("")
  const [newPostImage, setNewPostImage] = useState<string | null>(null)
  const fileInputRef = useRef<HTMLInputElement>(null)

  const handleCreatePost = () => {
    if (!newPostText.trim() && !newPostImage) return

    const newPost: Post = {
      id: `post-${Date.now()}`,
      author: {
        id: "current-user",
        name: "Current User",
        avatar: "/placeholder.svg?height=40&width=40",
        role: "Software Engineer",
      },
      content: newPostText,
      imageUrl: newPostImage,
      timestamp: new Date().toISOString(),
      likes: 0,
      comments: [],
      isLiked: false,
    }

    setPosts([newPost, ...posts])
    setNewPostText("")
    setNewPostImage(null)
  }

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (file) {
      // In a real app, you would upload to a server
      // For demo purposes, we'll use a local URL
      const imageUrl = URL.createObjectURL(file)
      setNewPostImage(imageUrl)
    }
  }

  const handleLikePost = (postId: string) => {
    setPosts(
      posts.map((post) => {
        if (post.id === postId) {
          return {
            ...post,
            likes: post.isLiked ? post.likes - 1 : post.likes + 1,
            isLiked: !post.isLiked,
          }
        }
        return post
      }),
    )
  }

  const handleAddComment = (postId: string, commentText: string) => {
    if (!commentText.trim()) return

    setPosts(
      posts.map((post) => {
        if (post.id === postId) {
          const newComment: Comment = {
            id: `comment-${Date.now()}`,
            author: {
              id: "current-user",
              name: "Current User",
              avatar: "/placeholder.svg?height=40&width=40",
              role: "Software Engineer",
            },
            content: commentText,
            timestamp: new Date().toISOString(),
            likes: 0,
            replies: [],
            isLiked: false,
          }

          return {
            ...post,
            comments: [...post.comments, newComment],
          }
        }
        return post
      }),
    )
  }

  const handleLikeComment = (postId: string, commentId: string) => {
    setPosts(
      posts.map((post) => {
        if (post.id === postId) {
          const updatedComments = post.comments.map((comment) => {
            if (comment.id === commentId) {
              return {
                ...comment,
                likes: comment.isLiked ? comment.likes - 1 : comment.likes + 1,
                isLiked: !comment.isLiked,
              }
            }
            return comment
          })

          return {
            ...post,
            comments: updatedComments,
          }
        }
        return post
      }),
    )
  }

  const handleAddReply = (postId: string, commentId: string, replyText: string) => {
    if (!replyText.trim()) return

    setPosts(
      posts.map((post) => {
        if (post.id === postId) {
          const updatedComments = post.comments.map((comment) => {
            if (comment.id === commentId) {
              const newReply: ReplyType = {
                id: `reply-${Date.now()}`,
                author: {
                  id: "current-user",
                  name: "Current User",
                  avatar: "/placeholder.svg?height=40&width=40",
                  role: "Software Engineer",
                },
                content: replyText,
                timestamp: new Date().toISOString(),
                likes: 0,
                isLiked: false,
              }

              return {
                ...comment,
                replies: [...comment.replies, newReply],
              }
            }
            return comment
          })

          return {
            ...post,
            comments: updatedComments,
          }
        }
        return post
      }),
    )
  }

  const handleLikeReply = (postId: string, commentId: string, replyId: string) => {
    setPosts(
      posts.map((post) => {
        if (post.id === postId) {
          const updatedComments = post.comments.map((comment) => {
            if (comment.id === commentId) {
              const updatedReplies = comment.replies.map((reply) => {
                if (reply.id === replyId) {
                  return {
                    ...reply,
                    likes: reply.isLiked ? reply.likes - 1 : reply.likes + 1,
                    isLiked: !reply.isLiked,
                  }
                }
                return reply
              })

              return {
                ...comment,
                replies: updatedReplies,
              }
            }
            return comment
          })

          return {
            ...post,
            comments: updatedComments,
          }
        }
        return post
      }),
    )
  }

  return (
  <div className="relative min-h-screen w-full overflow-hidden">
    {/* Aurora Background */}
    <div className="absolute inset-0 -z-10">
      <Aurora
        colorStops={[
          "#00C9FF", // Aqua blue
          "#003B49", // Dark green
        ]}
        blend={0.2}
        amplitude={1.2}
        speed={0.5}
      />
    </div>
      <Header />
      <div className="container mx-auto px-4 py-8 content-z-index">
        <div className="grid grid-cols-1 gap-8 lg:grid-cols-12">
          {/* Left Sidebar */}
          <div className="hidden lg:col-span-3 lg:block">
            <ProfileCard />
          </div>

          {/* Main Feed */}
          <div className="lg:col-span-6">
            <div className="space-y-6">
              {/* Create Post */}
              <div className="rounded-xl bg-background/40 backdrop-blur-md p-4 shadow-lg border border-white/10">
                <div className="flex items-start space-x-4">
                  <Avatar className="h-10 w-10 border-2 border-primary/50">
                    <AvatarImage src="/placeholder.svg?height=40&width=40" alt="Current User" />
                    <AvatarFallback>CU</AvatarFallback>
                  </Avatar>
                  <div className="flex-1 space-y-4">
                    <Textarea
                      placeholder="Share something with your network..."
                      className="min-h-[100px] bg-background/60 border-white/10 focus:border-primary/50 resize-none transition-all"
                      value={newPostText}
                      onChange={(e) => setNewPostText(e.target.value)}
                    />

                    {newPostImage && (
                      <div className="relative mt-2 rounded-lg overflow-hidden">
                        <img
                          src={newPostImage || "/placeholder.svg"}
                          alt="Post preview"
                          className="max-h-[300px] w-full object-cover rounded-lg"
                        />
                        <Button
                          variant="destructive"
                          size="icon"
                          className="absolute top-2 right-2 h-8 w-8 rounded-full opacity-80 hover:opacity-100"
                          onClick={() => setNewPostImage(null)}
                        >
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </div>
                    )}

                    <div className="flex items-center justify-between">
                      <div className="flex space-x-2">
                        <Button
                          variant="ghost"
                          size="sm"
                          className="text-muted-foreground hover:text-primary hover:bg-primary/10"
                          onClick={() => fileInputRef.current?.click()}
                        >
                          <ImageIcon className="mr-2 h-4 w-4" />
                          Image
                        </Button>
                        <input
                          type="file"
                          ref={fileInputRef}
                          className="hidden"
                          accept="image/*"
                          onChange={handleImageUpload}
                        />
                        <Button
                          variant="ghost"
                          size="sm"
                          className="text-muted-foreground hover:text-primary hover:bg-primary/10"
                        >
                          <LinkIcon className="mr-2 h-4 w-4" />
                          Link
                        </Button>
                      </div>
                      <Button
                        className="glow-on-hover"
                        onClick={handleCreatePost}
                        disabled={!newPostText.trim() && !newPostImage}
                      >
                        Post
                      </Button>
                    </div>
                  </div>
                </div>
              </div>

              {/* Posts Feed */}
              <ScrollArea className="h-[calc(100vh-220px)]">
                <div className="space-y-6 pr-4">
                  {posts.map((post) => (
                    <PostCard
                      key={post.id}
                      post={post}
                      onLike={handleLikePost}
                      onAddComment={handleAddComment}
                      onLikeComment={handleLikeComment}
                      onAddReply={handleAddReply}
                      onLikeReply={handleLikeReply}
                    />
                  ))}
                </div>
              </ScrollArea>
            </div>
          </div>

          {/* Right Sidebar */}
          <div className="hidden lg:col-span-3 lg:block">
            <TrendingTopics />
          </div>
        </div>
      </div>
    </div>
  )
}

// Profile Card Component
function ProfileCard() {
  return (
    <div className="rounded-xl bg-background/40 backdrop-blur-md p-6 shadow-lg border border-white/10 sticky top-8">
      <div className="flex flex-col items-center text-center">
        <div className="relative">
          <Avatar className="h-20 w-20 border-4 border-primary/50">
            <AvatarImage src="/placeholder.svg?height=80&width=80" alt="Current User" />
            <AvatarFallback>CU</AvatarFallback>
          </Avatar>
          <div className="absolute -bottom-1 -right-1 rounded-full bg-primary p-1">
            <div className="h-3 w-3 rounded-full bg-background" />
          </div>
        </div>
        <h3 className="mt-4 text-xl font-bold">Current User</h3>
        <p className="text-sm text-muted-foreground">Software Engineer</p>

        <div className="mt-6 w-full space-y-4">
          <div className="grid grid-cols-3 gap-4 text-center">
            <div>
              <p className="text-lg font-bold">245</p>
              <p className="text-xs text-muted-foreground">Connections</p>
            </div>
            <div>
              <p className="text-lg font-bold">35</p>
              <p className="text-xs text-muted-foreground">Posts</p>
            </div>
            <div>
              <p className="text-lg font-bold">128</p>
              <p className="text-xs text-muted-foreground">Likes</p>
            </div>
          </div>

          <Separator />

          <Button variant="outline" className="w-full">
            View Profile
          </Button>
        </div>
      </div>
    </div>
  )
}

// Trending Topics Component
function TrendingTopics() {
  return (
    <div className="rounded-xl bg-background/40 backdrop-blur-md p-6 shadow-lg border border-white/10 sticky top-8">
      <h3 className="text-lg font-bold mb-4">Trending Topics</h3>

      <div className="space-y-4">
        {TRENDING_TOPICS.map((topic, index) => (
          <div key={index} className="group cursor-pointer">
            <p className="text-sm font-medium group-hover:text-primary transition-colors">#{topic.tag}</p>
            <p className="text-xs text-muted-foreground">{topic.posts} posts</p>
          </div>
        ))}
      </div>

      <Button variant="ghost" className="mt-4 w-full text-xs">
        Show More
      </Button>
    </div>
  )
}

// Post Card Component
function PostCard({ post, onLike, onAddComment, onLikeComment, onAddReply, onLikeReply }: PostCardProps) {
  const [showComments, setShowComments] = useState(false)
  const [newComment, setNewComment] = useState("")
  const [replyingTo, setReplyingTo] = useState<string | null>(null)
  const [replyText, setReplyText] = useState("")

  const toggleComments = () => {
    setShowComments(!showComments)
  }

  const handleSubmitComment = () => {
    if (newComment.trim()) {
      onAddComment(post.id, newComment)
      setNewComment("")
    }
  }

  const handleSubmitReply = (commentId: string) => {
    if (replyText.trim()) {
      onAddReply(post.id, commentId, replyText)
      setReplyText("")
      setReplyingTo(null)
    }
  }

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

  return (
    <div className="rounded-xl bg-background/40 backdrop-blur-md p-6 shadow-lg border border-white/10">
      {/* Post Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-3">
          <Avatar className="h-10 w-10 border-2 border-primary/50">
            <AvatarImage src={post.author.avatar || "/placeholder.svg"} alt={post.author.name} />
            <AvatarFallback>{post.author.name.charAt(0)}</AvatarFallback>
          </Avatar>
          <div>
            <div className="flex items-center space-x-2">
              <h4 className="font-bold">{post.author.name}</h4>
              <p className="text-xs text-muted-foreground">• {post.author.role}</p>
            </div>
            <div className="flex items-center text-xs text-muted-foreground">
              <Clock className="mr-1 h-3 w-3" />
              <span>{formatTimestamp(post.timestamp)}</span>
            </div>
          </div>
        </div>

        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="ghost" size="icon" className="h-8 w-8">
              <MoreHorizontal className="h-4 w-4" />
              <span className="sr-only">More options</span>
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end" className="bg-background/95 backdrop-blur-md border-white/10">
            <DropdownMenuItem>Save post</DropdownMenuItem>
            <DropdownMenuItem>Hide post</DropdownMenuItem>
            <DropdownMenuItem>Report</DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>

      {/* Post Content */}
      <div className="mt-4 space-y-4">
        <p className="whitespace-pre-line">{post.content}</p>

        {post.imageUrl && (
          <div className="mt-2 rounded-lg overflow-hidden">
            <img
              src={post.imageUrl || "/placeholder.svg"}
              alt="Post content"
              className="max-h-[400px] w-full object-cover rounded-lg"
            />
          </div>
        )}

        {post.linkUrl && (
          <a
            href={post.linkUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="block mt-2 rounded-lg border border-white/10 p-4 hover:bg-white/5 transition-colors"
          >
            <div className="flex items-center space-x-2">
              <LinkIcon className="h-4 w-4 text-primary" />
              <span className="text-sm text-primary truncate">{post.linkUrl}</span>
            </div>
          </a>
        )}
      </div>

      {/* Post Stats */}
      <div className="mt-4 flex items-center justify-between text-xs text-muted-foreground">
        <div className="flex items-center space-x-1">
          {post.likes > 0 && (
            <>
              <div className="flex h-4 w-4 items-center justify-center rounded-full bg-primary/20">
                <Heart className="h-2 w-2 text-primary" fill="currentColor" />
              </div>
              <span>{post.likes}</span>
            </>
          )}
        </div>

        {post.comments.length > 0 && (
          <button onClick={toggleComments} className="hover:text-primary transition-colors">
            {post.comments.length} {post.comments.length === 1 ? "comment" : "comments"}
          </button>
        )}
      </div>

      {/* Post Actions */}
      <div className="mt-4 grid grid-cols-3 divide-x divide-white/10">
        <Button
          variant="ghost"
          className={cn(
            "rounded-none flex items-center justify-center space-x-2 hover:bg-primary/10",
            post.isLiked && "text-primary",
          )}
          onClick={() => onLike(post.id)}
        >
          <Heart className={cn("h-4 w-4", post.isLiked && "fill-current")} />
          <span>Like</span>
        </Button>

        <Button
          variant="ghost"
          className="rounded-none flex items-center justify-center space-x-2 hover:bg-primary/10"
          onClick={toggleComments}
        >
          <MessageCircle className="h-4 w-4" />
          <span>Comment</span>
        </Button>

        <Button variant="ghost" className="rounded-none flex items-center justify-center space-x-2 hover:bg-primary/10">
          <Share2 className="h-4 w-4" />
          <span>Share</span>
        </Button>
      </div>

      {/* Comments Section */}
      {(showComments || post.comments.length > 0) && (
        <div className="mt-4 space-y-4">
          <Separator />

          {/* New Comment Input */}
          <div className="flex items-start space-x-3">
            <Avatar className="h-8 w-8">
              <AvatarImage src="/placeholder.svg?height=32&width=32" alt="Current User" />
              <AvatarFallback>CU</AvatarFallback>
            </Avatar>
            <div className="relative flex-1">
              <Textarea
                placeholder="Write a comment..."
                className="min-h-[60px] bg-background/60 border-white/10 focus:border-primary/50 resize-none pr-10 transition-all text-sm"
                value={newComment}
                onChange={(e) => setNewComment(e.target.value)}
              />
              <Button
                size="icon"
                className="absolute bottom-2 right-2 h-6 w-6 rounded-full bg-primary/20 hover:bg-primary/40 text-primary"
                onClick={handleSubmitComment}
                disabled={!newComment.trim()}
              >
                <Send className="h-3 w-3" />
                <span className="sr-only">Send comment</span>
              </Button>
            </div>
          </div>

          {/* Comments List */}
          <div className="space-y-4">
            {post.comments.map((comment) => (
              <div key={comment.id} className="space-y-4">
                {/* Comment */}
                <div className="flex items-start space-x-3">
                  <Avatar className="h-8 w-8">
                    <AvatarImage src={comment.author.avatar || "/placeholder.svg"} alt={comment.author.name} />
                    <AvatarFallback>{comment.author.name.charAt(0)}</AvatarFallback>
                  </Avatar>
                  <div className="flex-1 space-y-1">
                    <div className="rounded-lg bg-secondary/30 p-3">
                      <div className="flex items-center space-x-2">
                        <h5 className="text-sm font-medium">{comment.author.name}</h5>
                        <p className="text-xs text-muted-foreground">{formatTimestamp(comment.timestamp)}</p>
                      </div>
                      <p className="mt-1 text-sm">{comment.content}</p>
                    </div>

                    <div className="flex items-center space-x-4 pl-1">
                      <button
                        className={cn(
                          "text-xs flex items-center space-x-1 hover:text-primary transition-colors",
                          comment.isLiked && "text-primary",
                        )}
                        onClick={() => onLikeComment(post.id, comment.id)}
                      >
                        <ThumbsUp className={cn("h-3 w-3", comment.isLiked && "fill-current")} />
                        <span>{comment.likes > 0 ? comment.likes : "Like"}</span>
                      </button>

                      <button
                        className="text-xs flex items-center space-x-1 hover:text-primary transition-colors"
                        onClick={() => setReplyingTo(replyingTo === comment.id ? null : comment.id)}
                      >
                        <LucideReply className="h-3 w-3" />
                        <span>Reply</span>
                      </button>
                    </div>

                    {/* Reply Input */}
                    {replyingTo === comment.id && (
                      <div className="flex items-start space-x-3 mt-2">
                        <Avatar className="h-6 w-6">
                          <AvatarImage src="/placeholder.svg?height=24&width=24" alt="Current User" />
                          <AvatarFallback>CU</AvatarFallback>
                        </Avatar>
                        <div className="relative flex-1">
                          <Textarea
                            placeholder={`Reply to ${comment.author.name}...`}
                            className="min-h-[50px] bg-background/60 border-white/10 focus:border-primary/50 resize-none pr-10 transition-all text-xs"
                            value={replyText}
                            onChange={(e) => setReplyText(e.target.value)}
                          />
                          <Button
                            size="icon"
                            className="absolute bottom-2 right-2 h-5 w-5 rounded-full bg-primary/20 hover:bg-primary/40 text-primary"
                            onClick={() => handleSubmitReply(comment.id)}
                            disabled={!replyText.trim()}
                          >
                            <Send className="h-2 w-2" />
                            <span className="sr-only">Send reply</span>
                          </Button>
                        </div>
                      </div>
                    )}

                    {/* Replies */}
                    {comment.replies.length > 0 && (
                      <div className="ml-6 space-y-3 mt-3">
                        {comment.replies.map((reply) => (
                          <div key={reply.id} className="flex items-start space-x-3">
                            <Avatar className="h-6 w-6">
                              <AvatarImage src={reply.author.avatar || "/placeholder.svg"} alt={reply.author.name} />
                              <AvatarFallback>{reply.author.name.charAt(0)}</AvatarFallback>
                            </Avatar>
                            <div className="flex-1 space-y-1">
                              <div className="rounded-lg bg-secondary/20 p-2">
                                <div className="flex items-center space-x-2">
                                  <h5 className="text-xs font-medium">{reply.author.name}</h5>
                                  <p className="text-xs text-muted-foreground">{formatTimestamp(reply.timestamp)}</p>
                                </div>
                                <p className="mt-1 text-xs">{reply.content}</p>
                              </div>

                              <div className="flex items-center space-x-4 pl-1">
                                <button
                                  className={cn(
                                    "text-xs flex items-center space-x-1 hover:text-primary transition-colors",
                                    reply.isLiked && "text-primary",
                                  )}
                                  onClick={() => onLikeReply(post.id, comment.id, reply.id)}
                                >
                                  <ThumbsUp className={cn("h-2 w-2", reply.isLiked && "fill-current")} />
                                  <span className="text-xs">{reply.likes > 0 ? reply.likes : "Like"}</span>
                                </button>
                              </div>
                            </div>
                          </div>
                        ))}
                      </div>
                    )}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  )
}

// Types
interface User {
  id: string
  name: string
  avatar: string
  role: string
}

interface ReplyType {
  id: string
  author: User
  content: string
  timestamp: string
  likes: number
  isLiked: boolean
}

interface Comment {
  id: string
  author: User
  content: string
  timestamp: string
  likes: number
  replies: ReplyType[]
  isLiked: boolean
}

interface Post {
  id: string
  author: User
  content: string
  imageUrl?: string | null
  linkUrl?: string
  timestamp: string
  likes: number
  comments: Comment[]
  isLiked: boolean
}

interface PostCardProps {
  post: Post
  onLike: (postId: string) => void
  onAddComment: (postId: string, commentText: string) => void
  onLikeComment: (postId: string, commentId: string) => void
  onAddReply: (postId: string, commentId: string, replyText: string) => void
  onLikeReply: (postId: string, commentId: string, replyId: string) => void
}

// Sample Data
const SAMPLE_POSTS: Post[] = [
  {
    id: "post-1",
    author: {
      id: "user-1",
      name: "Sarah Chen",
      avatar: "/placeholder.svg?height=40&width=40",
      role: "Product Designer",
    },
    content:
      "Just finished working on a new design system for our enterprise clients. Excited to share more details soon! #DesignSystems #UX",
    imageUrl: "/placeholder.svg?height=400&width=600",
    timestamp: new Date(Date.now() - 3600000).toISOString(),
    likes: 24,
    comments: [
      {
        id: "comment-1",
        author: {
          id: "user-2",
          name: "Alex Johnson",
          avatar: "/placeholder.svg?height=40&width=40",
          role: "Frontend Developer",
        },
        content: "This looks amazing! Can't wait to implement this in our next project.",
        timestamp: new Date(Date.now() - 3000000).toISOString(),
        likes: 5,
        replies: [
          {
            id: "reply-1",
            author: {
              id: "user-3",
              name: "Maya Patel",
              avatar: "/placeholder.svg?height=40&width=40",
              role: "UX Researcher",
            },
            content: "The color palette is particularly impressive. Great work!",
            timestamp: new Date(Date.now() - 2500000).toISOString(),
            likes: 2,
            isLiked: false,
          },
        ],
        isLiked: true,
      },
      {
        id: "comment-2",
        author: {
          id: "user-4",
          name: "David Kim",
          avatar: "/placeholder.svg?height=40&width=40",
          role: "Product Manager",
        },
        content: "Would love to see how this performs with our enterprise clients. Can you share some early feedback?",
        timestamp: new Date(Date.now() - 2000000).toISOString(),
        likes: 3,
        replies: [],
        isLiked: false,
      },
    ],
    isLiked: true,
  },
  {
    id: "post-2",
    author: {
      id: "user-5",
      name: "Jordan Taylor",
      avatar: "/placeholder.svg?height=40&width=40",
      role: "Software Architect",
    },
    content:
      "Just published my article on microservices architecture and how we implemented it at scale. Check it out and let me know your thoughts!\n\nThe key takeaways:\n- Start with a monolith, extract services strategically\n- Invest in robust monitoring from day one\n- Don't underestimate the complexity of distributed systems",
    linkUrl: "https://techblog.example.com/microservices-at-scale",
    timestamp: new Date(Date.now() - 86400000).toISOString(),
    likes: 47,
    comments: [
      {
        id: "comment-3",
        author: {
          id: "user-6",
          name: "Sophia Rodriguez",
          avatar: "/placeholder.svg?height=40&width=40",
          role: "DevOps Engineer",
        },
        content:
          "Great insights! Especially agree with the monitoring part - it's absolutely critical when dealing with distributed systems.",
        timestamp: new Date(Date.now() - 80000000).toISOString(),
        likes: 8,
        replies: [],
        isLiked: false,
      },
    ],
    isLiked: false,
  },
  {
    id: "post-3",
    author: {
      id: "user-7",
      name: "Elijah Wilson",
      avatar: "/placeholder.svg?height=40&width=40",
      role: "AI Research Scientist",
    },
    content:
      "Excited to announce that our paper on transformer efficiency has been accepted at NeurIPS! This work improves inference speed by 35% while maintaining accuracy.",
    timestamp: new Date(Date.now() - 172800000).toISOString(),
    likes: 89,
    comments: [],
    isLiked: false,
  },
]

const TRENDING_TOPICS = [
  { tag: "TechInnovation", posts: 1243 },
  { tag: "AIFuture", posts: 982 },
  { tag: "ProductDesign", posts: 756 },
  { tag: "RemoteWork", posts: 621 },
  { tag: "DataScience", posts: 543 },
]
