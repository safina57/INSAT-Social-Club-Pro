"use client"

import type React from "react"

import { useState, useEffect } from "react"
import { Header } from "@/components/common/header"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Badge } from "@/components/ui/badge"
import { Separator } from "@/components/ui/separator"
import { ScrollArea } from "@/components/ui/scroll-area"
import { SearchIcon, Users, FileText, Hash, Loader2, Clock, Heart, MessageCircle } from "lucide-react"
import { motion } from "framer-motion"

type SearchResult = {
  users: User[]
  posts: Post[]
  tags: Tag[]
}

interface User {
  id: string
  name: string
  role: string
  avatar: string
  connections: number
  mutualConnections?: number
}

interface Post {
  id: string
  author: {
    name: string
    avatar: string
  }
  content: string
  timestamp: string
  likes: number
  comments: number
  tags: string[]
}

interface Tag {
  id: string
  name: string
  count: number
}

export default function SearchPage() {
  const [searchQuery, setSearchQuery] = useState("")
  const [activeTab, setActiveTab] = useState("all")
  const [isSearching, setIsSearching] = useState(false)
  const [results, setResults] = useState<SearchResult>({
    users: [],
    posts: [],
    tags: [],
  })
  const [hasSearched, setHasSearched] = useState(false)

  // Simulate search functionality
  useEffect(() => {
    if (!searchQuery.trim()) {
      setResults({ users: [], posts: [], tags: [] })
      setHasSearched(false)
      return
    }

    const timer = setTimeout(() => {
      setIsSearching(true)

      // Simulate API call delay
      setTimeout(() => {
        const filteredUsers = SAMPLE_USERS.filter(
          (user) =>
            user.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
            user.role.toLowerCase().includes(searchQuery.toLowerCase()),
        )

        const filteredPosts = SAMPLE_POSTS.filter(
          (post) =>
            post.content.toLowerCase().includes(searchQuery.toLowerCase()) ||
            post.author.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
            post.tags.some((tag) => tag.toLowerCase().includes(searchQuery.toLowerCase())),
        )

        const filteredTags = SAMPLE_TAGS.filter((tag) => tag.name.toLowerCase().includes(searchQuery.toLowerCase()))

        setResults({
          users: filteredUsers,
          posts: filteredPosts,
          tags: filteredTags,
        })

        setIsSearching(false)
        setHasSearched(true)
      }, 800)
    }, 300)

    return () => clearTimeout(timer)
  }, [searchQuery])

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault()
    // Search is already handled by the useEffect
  }

  const getTotalResults = () => {
    return results.users.length + results.posts.length + results.tags.length
  }

  const getResultsForActiveTab = () => {
    switch (activeTab) {
      case "users":
        return results.users.length
      case "posts":
        return results.posts.length
      case "tags":
        return results.tags.length
      default:
        return getTotalResults()
    }
  }

  return (
    <div className="min-h-screen w-full aurora-gradient">
      <Header />
      <div className="container mx-auto px-4 py-8 content-z-index">
        <div className="max-w-4xl mx-auto">
          <div className="rounded-xl bg-background/40 backdrop-blur-md p-6 md:p-8 shadow-lg border border-white/10">
            <div className="mb-8">
              <h1 className="text-3xl font-bold mb-2">Search</h1>
              <p className="text-muted-foreground">Find people, posts, and topics across the INSAT PRO CLUB network</p>
            </div>

            <form onSubmit={handleSearch} className="relative mb-8">
              <SearchIcon className="absolute left-4 top-3.5 h-5 w-5 text-muted-foreground" />
              <Input
                type="search"
                placeholder="Search for people, posts, or tags..."
                className="pl-12 py-6 bg-secondary/50 backdrop-blur-sm border-secondary-foreground/10 text-lg"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
            </form>

            <Tabs defaultValue="all" value={activeTab} onValueChange={setActiveTab}>
              <TabsList className="grid grid-cols-4 mb-6">
                <TabsTrigger value="all" className="data-[state=active]:bg-primary/20">
                  All
                </TabsTrigger>
                <TabsTrigger value="users" className="data-[state=active]:bg-primary/20">
                  <Users className="h-4 w-4 mr-2" />
                  People
                </TabsTrigger>
                <TabsTrigger value="posts" className="data-[state=active]:bg-primary/20">
                  <FileText className="h-4 w-4 mr-2" />
                  Posts
                </TabsTrigger>
                <TabsTrigger value="tags" className="data-[state=active]:bg-primary/20">
                  <Hash className="h-4 w-4 mr-2" />
                  Tags
                </TabsTrigger>
              </TabsList>

              {isSearching ? (
                <div className="flex flex-col items-center justify-center py-16">
                  <Loader2 className="h-8 w-8 animate-spin text-primary mb-4" />
                  <p className="text-muted-foreground">Searching...</p>
                </div>
              ) : hasSearched ? (
                getResultsForActiveTab() > 0 ? (
                  <ScrollArea className="h-[calc(100vh-400px)] pr-4">
                    <TabsContent value="all" className="space-y-8 mt-0">
                      {results.users.length > 0 && (
                        <div>
                          <div className="flex items-center justify-between mb-4">
                            <h2 className="text-lg font-semibold flex items-center">
                              <Users className="h-5 w-5 mr-2 text-primary" />
                              People
                            </h2>
                            {results.users.length > 3 && (
                              <Button variant="link" onClick={() => setActiveTab("users")} className="text-primary">
                                View all ({results.users.length})
                              </Button>
                            )}
                          </div>
                          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            {results.users.slice(0, 4).map((user) => (
                              <UserCard key={user.id} user={user} />
                            ))}
                          </div>
                          {results.posts.length > 0 && <Separator className="my-8" />}
                        </div>
                      )}

                      {results.posts.length > 0 && (
                        <div>
                          <div className="flex items-center justify-between mb-4">
                            <h2 className="text-lg font-semibold flex items-center">
                              <FileText className="h-5 w-5 mr-2 text-primary" />
                              Posts
                            </h2>
                            {results.posts.length > 2 && (
                              <Button variant="link" onClick={() => setActiveTab("posts")} className="text-primary">
                                View all ({results.posts.length})
                              </Button>
                            )}
                          </div>
                          <div className="space-y-4">
                            {results.posts.slice(0, 3).map((post) => (
                              <PostCard key={post.id} post={post} />
                            ))}
                          </div>
                          {results.tags.length > 0 && <Separator className="my-8" />}
                        </div>
                      )}

                      {results.tags.length > 0 && (
                        <div>
                          <div className="flex items-center justify-between mb-4">
                            <h2 className="text-lg font-semibold flex items-center">
                              <Hash className="h-5 w-5 mr-2 text-primary" />
                              Tags
                            </h2>
                            {results.tags.length > 6 && (
                              <Button variant="link" onClick={() => setActiveTab("tags")} className="text-primary">
                                View all ({results.tags.length})
                              </Button>
                            )}
                          </div>
                          <div className="flex flex-wrap gap-2">
                            {results.tags.slice(0, 8).map((tag) => (
                              <TagBadge key={tag.id} tag={tag} />
                            ))}
                          </div>
                        </div>
                      )}
                    </TabsContent>

                    <TabsContent value="users" className="mt-0">
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        {results.users.map((user) => (
                          <UserCard key={user.id} user={user} />
                        ))}
                      </div>
                      {results.users.length === 0 && <EmptyState type="users" query={searchQuery} />}
                    </TabsContent>

                    <TabsContent value="posts" className="space-y-4 mt-0">
                      {results.posts.map((post) => (
                        <PostCard key={post.id} post={post} />
                      ))}
                      {results.posts.length === 0 && <EmptyState type="posts" query={searchQuery} />}
                    </TabsContent>

                    <TabsContent value="tags" className="mt-0">
                      <div className="flex flex-wrap gap-3">
                        {results.tags.map((tag) => (
                          <TagBadge key={tag.id} tag={tag} />
                        ))}
                      </div>
                      {results.tags.length === 0 && <EmptyState type="tags" query={searchQuery} />}
                    </TabsContent>
                  </ScrollArea>
                ) : (
                  <div className="flex flex-col items-center justify-center py-16 text-center">
                    <SearchIcon className="h-12 w-12 text-muted-foreground/50 mb-4" />
                    <h3 className="text-xl font-medium mb-2">No results found</h3>
                    <p className="text-muted-foreground max-w-md">
                      We couldn't find any matches for "{searchQuery}". Try different keywords or check your spelling.
                    </p>
                  </div>
                )
              ) : (
                <div className="flex flex-col items-center justify-center py-16 text-center">
                  <SearchIcon className="h-12 w-12 text-muted-foreground/50 mb-4" />
                  <h3 className="text-xl font-medium mb-2">Start searching</h3>
                  <p className="text-muted-foreground max-w-md">
                    Enter keywords above to search for people, posts, or tags across the network.
                  </p>
                </div>
              )}
            </Tabs>
          </div>
        </div>
      </div>
    </div>
  )
}

function UserCard({ user }: { user: User }) {
  return (
    <motion.div
      whileHover={{ y: -2 }}
      className="rounded-lg bg-secondary/30 border border-white/5 p-4 hover:bg-secondary/40 transition-colors"
    >
      <div className="flex items-center">
        <Avatar className="h-12 w-12 border border-white/10">
          <AvatarImage src={user.avatar || "/placeholder.svg"} alt={user.name} />
          <AvatarFallback>{user.name.charAt(0)}</AvatarFallback>
        </Avatar>
        <div className="ml-3">
          <h3 className="font-medium">{user.name}</h3>
          <p className="text-sm text-muted-foreground">{user.role}</p>
        </div>
      </div>
      <div className="mt-3 flex items-center justify-between">
        <div className="text-xs text-muted-foreground">
          <span>{user.connections} connections</span>
          {user.mutualConnections && <span className="ml-2">· {user.mutualConnections} mutual</span>}
        </div>
        <Button size="sm" variant="secondary" className="h-8">
          Connect
        </Button>
      </div>
    </motion.div>
  )
}

function PostCard({ post }: { post: Post }) {
  return (
    <motion.div
      whileHover={{ y: -2 }}
      className="rounded-lg bg-secondary/30 border border-white/5 p-4 hover:bg-secondary/40 transition-colors"
    >
      <div className="flex items-center">
        <Avatar className="h-8 w-8 border border-white/10">
          <AvatarImage src={post.author.avatar || "/placeholder.svg"} alt={post.author.name} />
          <AvatarFallback>{post.author.name.charAt(0)}</AvatarFallback>
        </Avatar>
        <div className="ml-2">
          <p className="text-sm font-medium">{post.author.name}</p>
          <div className="flex items-center text-xs text-muted-foreground">
            <Clock className="mr-1 h-3 w-3" />
            <span>{formatTimestamp(post.timestamp)}</span>
          </div>
        </div>
      </div>
      <p className="mt-3 text-sm line-clamp-2">{post.content}</p>
      {post.tags.length > 0 && (
        <div className="mt-2 flex flex-wrap gap-1">
          {post.tags.map((tag, index) => (
            <Badge key={index} variant="secondary" className="text-xs bg-secondary/50">
              #{tag}
            </Badge>
          ))}
        </div>
      )}
      <div className="mt-3 flex items-center text-xs text-muted-foreground space-x-4">
        <div className="flex items-center">
          <Heart className="mr-1 h-3 w-3" />
          <span>{post.likes}</span>
        </div>
        <div className="flex items-center">
          <MessageCircle className="mr-1 h-3 w-3" />
          <span>{post.comments}</span>
        </div>
      </div>
    </motion.div>
  )
}

function TagBadge({ tag }: { tag: Tag }) {
  return (
    <motion.div
      whileHover={{ scale: 1.05 }}
      className="rounded-full bg-secondary/30 border border-white/5 px-4 py-2 hover:bg-secondary/40 transition-colors cursor-pointer"
    >
      <div className="flex items-center">
        <span className="text-sm font-medium">#{tag.name}</span>
        <span className="ml-2 text-xs text-muted-foreground">{tag.count}</span>
      </div>
    </motion.div>
  )
}

function EmptyState({ type, query }: { type: string; query: string }) {
  return (
    <div className="flex flex-col items-center justify-center py-12 text-center">
      <div className="w-12 h-12 rounded-full bg-secondary/50 flex items-center justify-center mb-4">
        {type === "users" && <Users className="h-6 w-6 text-muted-foreground" />}
        {type === "posts" && <FileText className="h-6 w-6 text-muted-foreground" />}
        {type === "tags" && <Hash className="h-6 w-6 text-muted-foreground" />}
      </div>
      <h3 className="text-lg font-medium mb-1">No {type} found</h3>
      <p className="text-sm text-muted-foreground">
        We couldn't find any {type} matching "{query}"
      </p>
    </div>
  )
}

// Sample data for search results
const SAMPLE_USERS: User[] = [
  {
    id: "user-1",
    name: "Sarah Chen",
    role: "Product Designer",
    avatar: "/placeholder.svg?height=48&width=48",
    connections: 245,
    mutualConnections: 12,
  },
  {
    id: "user-2",
    name: "Alex Johnson",
    role: "Frontend Developer",
    avatar: "/placeholder.svg?height=48&width=48",
    connections: 187,
    mutualConnections: 8,
  },
  {
    id: "user-3",
    name: "Maya Patel",
    role: "UX Researcher",
    avatar: "/placeholder.svg?height=48&width=48",
    connections: 312,
    mutualConnections: 5,
  },
  {
    id: "user-4",
    name: "David Kim",
    role: "Product Manager",
    avatar: "/placeholder.svg?height=48&width=48",
    connections: 423,
  },
  {
    id: "user-5",
    name: "Jordan Taylor",
    role: "Software Architect",
    avatar: "/placeholder.svg?height=48&width=48",
    connections: 289,
    mutualConnections: 3,
  },
  {
    id: "user-6",
    name: "Sophia Rodriguez",
    role: "DevOps Engineer",
    avatar: "/placeholder.svg?height=48&width=48",
    connections: 176,
  },
  {
    id: "user-7",
    name: "Elijah Wilson",
    role: "AI Research Scientist",
    avatar: "/placeholder.svg?height=48&width=48",
    connections: 201,
    mutualConnections: 2,
  },
]

const SAMPLE_POSTS: Post[] = [
  {
    id: "post-1",
    author: {
      name: "Sarah Chen",
      avatar: "/placeholder.svg?height=32&width=32",
    },
    content:
      "Just finished working on a new design system for our enterprise clients. Excited to share more details soon! #DesignSystems #UX",
    timestamp: new Date(Date.now() - 3600000).toISOString(),
    likes: 24,
    comments: 8,
    tags: ["DesignSystems", "UX", "Enterprise"],
  },
  {
    id: "post-2",
    author: {
      name: "Jordan Taylor",
      avatar: "/placeholder.svg?height=32&width=32",
    },
    content:
      "Just published my article on microservices architecture and how we implemented it at scale. Check it out and let me know your thoughts!",
    timestamp: new Date(Date.now() - 86400000).toISOString(),
    likes: 47,
    comments: 12,
    tags: ["Microservices", "Architecture", "ScalableSystems"],
  },
  {
    id: "post-3",
    author: {
      name: "Elijah Wilson",
      avatar: "/placeholder.svg?height=32&width=32",
    },
    content:
      "Excited to announce that our paper on transformer efficiency has been accepted at NeurIPS! This work improves inference speed by 35% while maintaining accuracy.",
    timestamp: new Date(Date.now() - 172800000).toISOString(),
    likes: 89,
    comments: 23,
    tags: ["AI", "MachineLearning", "NeurIPS", "Research"],
  },
  {
    id: "post-4",
    author: {
      name: "Maya Patel",
      avatar: "/placeholder.svg?height=32&width=32",
    },
    content:
      "Just wrapped up a fascinating user research study on how professionals use collaboration tools. Some surprising insights that challenge conventional wisdom!",
    timestamp: new Date(Date.now() - 259200000).toISOString(),
    likes: 32,
    comments: 7,
    tags: ["UXResearch", "Collaboration", "ProductDesign"],
  },
  {
    id: "post-5",
    author: {
      name: "Alex Johnson",
      avatar: "/placeholder.svg?height=32&width=32",
    },
    content:
      "I've been experimenting with the new React Server Components and they're a game-changer for performance. Here's what I've learned so far...",
    timestamp: new Date(Date.now() - 345600000).toISOString(),
    likes: 56,
    comments: 14,
    tags: ["React", "WebDevelopment", "Performance"],
  },
]

const SAMPLE_TAGS: Tag[] = [
  { id: "tag-1", name: "DesignSystems", count: 1243 },
  { id: "tag-2", name: "UX", count: 982 },
  { id: "tag-3", name: "ProductDesign", count: 756 },
  { id: "tag-4", name: "WebDevelopment", count: 621 },
  { id: "tag-5", name: "AI", count: 543 },
  { id: "tag-6", name: "MachineLearning", count: 489 },
  { id: "tag-7", name: "Architecture", count: 376 },
  { id: "tag-8", name: "React", count: 352 },
  { id: "tag-9", name: "Performance", count: 298 },
  { id: "tag-10", name: "Microservices", count: 276 },
  { id: "tag-11", name: "Research", count: 245 },
  { id: "tag-12", name: "Collaboration", count: 187 },
]

function formatTimestamp(timestamp: string) {
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
