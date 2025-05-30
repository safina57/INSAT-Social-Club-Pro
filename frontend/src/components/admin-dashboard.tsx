"use client"

import type React from "react"

import { useState } from "react"
import { Header } from "@/components/common/header"
import { AdminSidebar } from "@/components/admin/admin-sidebar"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Button } from "@/components/ui/button"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Badge } from "@/components/ui/badge"
import { ScrollArea } from "@/components/ui/scroll-area"
import {
  ArrowUpRight,
  Users,
  FileText,
  MessageSquare,
  Bell,
  Flag,
  TrendingUp,
  Calendar,
  BarChart3,
  Activity,
  UserPlus,
  Download,
} from "lucide-react"
import {
  LineChart,
  Line,
  BarChart,
  Bar,
  PieChart,
  Pie,
  Cell,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from "recharts"

export default function AdminDashboard() {
  const [timeRange, setTimeRange] = useState<"day" | "week" | "month" | "year">("week")

  return (
    <div className="min-h-screen w-full bg-background">
      <Header />
      <div className="flex">
        <AdminSidebar />
        <main className="flex-1 p-6 overflow-auto">
          <div className="flex items-center justify-between mb-8">
            <div>
              <h1 className="text-3xl font-bold tracking-tight">Dashboard</h1>
              <p className="text-muted-foreground">Platform overview and key metrics</p>
            </div>
            <div className="flex items-center gap-4">
              <Button variant="outline" size="sm" className="h-9">
                <Calendar className="mr-2 h-4 w-4" />
                April 24, 2025
              </Button>
              <Button size="sm" className="h-9">
                <Download className="mr-2 h-4 w-4" />
                Download Report
              </Button>
            </div>
          </div>

          {/* Key Metrics */}
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4 mb-8">
            <MetricCard
              title="Total Users"
              value="12,486"
              change="+14.6%"
              trend="up"
              description="vs. previous month"
              icon={<Users className="h-5 w-5" />}
            />
            <MetricCard
              title="Total Posts"
              value="8,642"
              change="+7.2%"
              trend="up"
              description="vs. previous month"
              icon={<FileText className="h-5 w-5" />}
            />
            <MetricCard
              title="Messages"
              value="24,853"
              change="+32.1%"
              trend="up"
              description="vs. previous month"
              icon={<MessageSquare className="h-5 w-5" />}
            />
            <MetricCard
              title="Reports"
              value="42"
              change="-8.3%"
              trend="down"
              description="vs. previous month"
              icon={<Flag className="h-5 w-5" />}
            />
          </div>

          {/* Charts Section */}
          <Tabs defaultValue="overview" className="mb-8">
            <div className="flex items-center justify-between mb-4">
              <TabsList>
                <TabsTrigger value="overview">Overview</TabsTrigger>
              </TabsList>

              <div className="flex items-center gap-2">
                <Button
                  variant={timeRange === "day" ? "default" : "outline"}
                  size="sm"
                  onClick={() => setTimeRange("day")}
                >
                  Day
                </Button>
                <Button
                  variant={timeRange === "week" ? "default" : "outline"}
                  size="sm"
                  onClick={() => setTimeRange("week")}
                >
                  Week
                </Button>
                <Button
                  variant={timeRange === "month" ? "default" : "outline"}
                  size="sm"
                  onClick={() => setTimeRange("month")}
                >
                  Month
                </Button>
                <Button
                  variant={timeRange === "year" ? "default" : "outline"}
                  size="sm"
                  onClick={() => setTimeRange("year")}
                >
                  Year
                </Button>
              </div>
            </div>

            <TabsContent value="overview" className="space-y-4">
              <div className="grid gap-4 md:grid-cols-2">
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center justify-between">
                      User Growth
                      <TrendingUp className="h-4 w-4 text-primary" />
                    </CardTitle>
                    <CardDescription>New user registrations over time</CardDescription>
                  </CardHeader>
                  <CardContent className="h-[300px]">
                    <ResponsiveContainer width="100%" height="100%">
                      <LineChart data={userData}>
                        <CartesianGrid strokeDasharray="3 3" stroke="#333" />
                        <XAxis dataKey="name" stroke="#888" />
                        <YAxis stroke="#888" />
                        <Tooltip
                          contentStyle={{ backgroundColor: "#1f1f1f", borderColor: "#333" }}
                          itemStyle={{ color: "#fff" }}
                        />
                        <Legend />
                        <Line
                          type="monotone"
                          dataKey="newUsers"
                          name="New Users"
                          stroke="#10b981"
                          strokeWidth={2}
                          activeDot={{ r: 8 }}
                        />
                        <Line
                          type="monotone"
                          dataKey="activeUsers"
                          name="Active Users"
                          stroke="#3b82f6"
                          strokeWidth={2}
                        />
                      </LineChart>
                    </ResponsiveContainer>
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center justify-between">
                      Engagement Metrics
                      <BarChart3 className="h-4 w-4 text-primary" />
                    </CardTitle>
                    <CardDescription>Posts, comments, and reactions</CardDescription>
                  </CardHeader>
                  <CardContent className="h-[300px]">
                    <ResponsiveContainer width="100%" height="100%">
                      <BarChart data={engagementData}>
                        <CartesianGrid strokeDasharray="3 3" stroke="#333" />
                        <XAxis dataKey="name" stroke="#888" />
                        <YAxis stroke="#888" />
                        <Tooltip
                          contentStyle={{ backgroundColor: "#1f1f1f", borderColor: "#333" }}
                          itemStyle={{ color: "#fff" }}
                        />
                        <Legend />
                        <Bar dataKey="posts" name="Posts" fill="#10b981" radius={[4, 4, 0, 0]} />
                        <Bar dataKey="comments" name="Comments" fill="#3b82f6" radius={[4, 4, 0, 0]} />
                        <Bar dataKey="likes" name="Likes" fill="#8b5cf6" radius={[4, 4, 0, 0]} />
                      </BarChart>
                    </ResponsiveContainer>
                  </CardContent>
                </Card>
              </div>

              <div className="grid gap-4 md:grid-cols-3">
                <Card>
                  <CardHeader>
                    <CardTitle>User Distribution</CardTitle>
                    <CardDescription>By role and industry</CardDescription>
                  </CardHeader>
                  <CardContent className="h-[250px]">
                    <ResponsiveContainer width="100%" height="100%">
                      <PieChart>
                        <Pie
                          data={userDistributionData}
                          cx="50%"
                          cy="50%"
                          labelLine={false}
                          outerRadius={80}
                          fill="#8884d8"
                          dataKey="value"
                          label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
                        >
                          {userDistributionData.map((_, index) => (
                            <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                          ))}
                        </Pie>
                        <Tooltip
                          contentStyle={{ backgroundColor: "#1f1f1f", borderColor: "#333" }}
                          itemStyle={{ color: "#fff" }}
                        />
                      </PieChart>
                    </ResponsiveContainer>
                  </CardContent>
                </Card>

                <Card className="col-span-2">
                  <CardHeader>
                    <CardTitle className="flex items-center justify-between">
                      Platform Activity
                      <Activity className="h-4 w-4 text-primary" />
                    </CardTitle>
                    <CardDescription>Real-time platform activity</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <ScrollArea className="h-[250px]">
                      <div className="space-y-4">
                        {activityData.map((activity, i) => (
                          <div key={i} className="flex items-start gap-4 pb-4 border-b border-border last:border-0">
                            <Avatar className="h-9 w-9">
                              <AvatarImage src={activity.user.avatar || "/placeholder.svg"} alt={activity.user.name} />
                              <AvatarFallback>{activity.user.name.charAt(0)}</AvatarFallback>
                            </Avatar>
                            <div className="flex-1 space-y-1">
                              <p className="text-sm">
                                <span className="font-medium">{activity.user.name}</span>{" "}
                                <span className="text-muted-foreground">{activity.action}</span>
                              </p>
                              <div className="flex items-center text-xs text-muted-foreground">
                                <span>{activity.time}</span>
                                {activity.category && (
                                  <>
                                    <span className="mx-1">•</span>
                                    <Badge variant="outline" className="text-xs">
                                      {activity.category}
                                    </Badge>
                                  </>
                                )}
                              </div>
                            </div>
                          </div>
                        ))}
                      </div>
                    </ScrollArea>
                  </CardContent>
                </Card>
              </div>
            </TabsContent>
          </Tabs>

          {/* Recent Users & Notifications */}
          <div className="grid gap-4 md:grid-cols-2">
            <Card>
              <CardHeader className="flex flex-row items-center justify-between">
                <div>
                  <CardTitle>Recent Users</CardTitle>
                  <CardDescription>Newly registered platform users</CardDescription>
                </div>
                <Button variant="ghost" size="sm" className="text-primary">
                  View All
                </Button>
              </CardHeader>
              <CardContent>
                <ScrollArea className="h-[300px]">
                  <div className="space-y-4">
                    {recentUsers.map((user, i) => (
                      <div
                        key={i}
                        className="flex items-center justify-between pb-3 border-b border-border last:border-0"
                      >
                        <div className="flex items-center gap-3">
                          <Avatar>
                            <AvatarImage src={user.avatar || "/placeholder.svg"} alt={user.name} />
                            <AvatarFallback>{user.name.charAt(0)}</AvatarFallback>
                          </Avatar>
                          <div>
                            <p className="font-medium">{user.name}</p>
                            <p className="text-sm text-muted-foreground">{user.role}</p>
                          </div>
                        </div>
                        <div className="flex items-center gap-2">
                          <Badge variant={user.status === "Verified" ? "default" : "secondary"}>{user.status}</Badge>
                          <Button variant="ghost" size="icon" className="h-8 w-8">
                            <UserPlus className="h-4 w-4" />
                          </Button>
                        </div>
                      </div>
                    ))}
                  </div>
                </ScrollArea>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="flex flex-row items-center justify-between">
                <div>
                  <CardTitle>System Notifications</CardTitle>
                  <CardDescription>Recent alerts and notifications</CardDescription>
                </div>
                <Button variant="ghost" size="sm" className="text-primary">
                  Mark All Read
                </Button>
              </CardHeader>
              <CardContent>
                <ScrollArea className="h-[300px]">
                  <div className="space-y-4">
                    {notifications.map((notification, i) => (
                      <div key={i} className="flex items-start gap-4 pb-4 border-b border-border last:border-0">
                        <div
                          className={`h-9 w-9 rounded-full flex items-center justify-center ${
                            notification.type === "warning"
                              ? "bg-amber-500/20 text-amber-500"
                              : notification.type === "error"
                                ? "bg-red-500/20 text-red-500"
                                : "bg-primary/20 text-primary"
                          }`}
                        >
                          {notification.icon}
                        </div>
                        <div className="flex-1 space-y-1">
                          <p className="text-sm font-medium">{notification.title}</p>
                          <p className="text-sm text-muted-foreground">{notification.description}</p>
                          <p className="text-xs text-muted-foreground">{notification.time}</p>
                        </div>
                      </div>
                    ))}
                  </div>
                </ScrollArea>
              </CardContent>
            </Card>
          </div>
        </main>
      </div>
    </div>
  )
}

function MetricCard({
  title,
  value,
  change,
  trend,
  description,
  icon,
}: {
  title: string
  value: string
  change: string
  trend: "up" | "down"
  description: string
  icon: React.ReactNode
}) {
  return (
    <Card>
      <CardContent className="p-6">
        <div className="flex items-center justify-between">
          <div className="h-12 w-12 rounded-full bg-primary/20 flex items-center justify-center text-primary">
            {icon}
          </div>
          <div
            className={`flex items-center ${
              trend === "up" ? "text-emerald-500" : "text-red-500"
            } bg-opacity-20 rounded-full px-2 py-1 text-xs font-medium`}
          >
            {change}
            <ArrowUpRight className={`h-3 w-3 ml-1 ${trend === "down" ? "rotate-180" : ""}`} />
          </div>
        </div>
        <div className="mt-4">
          <h3 className="text-3xl font-bold">{value}</h3>
          <p className="text-sm text-muted-foreground mt-1 flex items-center">
            {title}
            <span className="text-xs ml-2 opacity-70">{description}</span>
          </p>
        </div>
      </CardContent>
    </Card>
  )
}

// Sample data for charts
const userData = [
  { name: "Jan", newUsers: 400, activeUsers: 2400 },
  { name: "Feb", newUsers: 300, activeUsers: 1398 },
  { name: "Mar", newUsers: 200, activeUsers: 9800 },
  { name: "Apr", newUsers: 278, activeUsers: 3908 },
  { name: "May", newUsers: 189, activeUsers: 4800 },
  { name: "Jun", newUsers: 239, activeUsers: 3800 },
  { name: "Jul", newUsers: 349, activeUsers: 4300 },
]

const engagementData = [
  { name: "Jan", posts: 400, comments: 240, likes: 2400 },
  { name: "Feb", posts: 300, comments: 138, likes: 1398 },
  { name: "Mar", posts: 200, comments: 980, likes: 9800 },
  { name: "Apr", posts: 278, comments: 390, likes: 3908 },
  { name: "May", posts: 189, comments: 480, likes: 4800 },
  { name: "Jun", posts: 239, comments: 380, likes: 3800 },
  { name: "Jul", posts: 349, comments: 430, likes: 4300 },
]

const COLORS = ["#10b981", "#3b82f6", "#8b5cf6", "#ec4899", "#f59e0b", "#ef4444"]

const userDistributionData = [
  { name: "Engineering", value: 35 },
  { name: "Design", value: 25 },
  { name: "Marketing", value: 18 },
  { name: "Management", value: 15 },
  { name: "Other", value: 7 },
]

const activityData = [
  {
    user: {
      name: "Sarah Chen",
      avatar: "/placeholder.svg?height=36&width=36",
    },
    action: "created a new post about design systems",
    time: "2 minutes ago",
    category: "Post",
  },
  {
    user: {
      name: "Alex Johnson",
      avatar: "/placeholder.svg?height=36&width=36",
    },
    action: "commented on Maya Patel's post",
    time: "15 minutes ago",
    category: "Comment",
  },
  {
    user: {
      name: "Jordan Taylor",
      avatar: "/placeholder.svg?height=36&width=36",
    },
    action: "reported a post for inappropriate content",
    time: "32 minutes ago",
    category: "Report",
  },
  {
    user: {
      name: "Maya Patel",
      avatar: "/placeholder.svg?height=36&width=36",
    },
    action: "updated their profile information",
    time: "1 hour ago",
    category: "Profile",
  },
  {
    user: {
      name: "David Kim",
      avatar: "/placeholder.svg?height=36&width=36",
    },
    action: "joined the platform",
    time: "2 hours ago",
    category: "Registration",
  },
  {
    user: {
      name: "Sophia Rodriguez",
      avatar: "/placeholder.svg?height=36&width=36",
    },
    action: "connected with 3 new professionals",
    time: "3 hours ago",
    category: "Connection",
  },
]

const recentUsers = [
  {
    name: "Olivia Martinez",
    role: "UX Designer",
    avatar: "/placeholder.svg?height=40&width=40",
    status: "Verified",
  },
  {
    name: "Ethan Wilson",
    role: "Software Engineer",
    avatar: "/placeholder.svg?height=40&width=40",
    status: "Pending",
  },
  {
    name: "Ava Thompson",
    role: "Product Manager",
    avatar: "/placeholder.svg?height=40&width=40",
    status: "Verified",
  },
  {
    name: "Noah Garcia",
    role: "Data Scientist",
    avatar: "/placeholder.svg?height=40&width=40",
    status: "Verified",
  },
  {
    name: "Isabella Brown",
    role: "Marketing Specialist",
    avatar: "/placeholder.svg?height=40&width=40",
    status: "Pending",
  },
  {
    name: "Liam Johnson",
    role: "Frontend Developer",
    avatar: "/placeholder.svg?height=40&width=40",
    status: "Verified",
  },
]

const notifications = [
  {
    title: "System Update",
    description: "Platform will undergo maintenance in 24 hours",
    time: "Just now",
    type: "info",
    icon: <Bell className="h-5 w-5" />,
  },
  {
    title: "Unusual Login Activity",
    description: "Multiple failed login attempts detected",
    time: "30 minutes ago",
    type: "warning",
    icon: <Flag className="h-5 w-5" />,
  },
  {
    title: "Database Error",
    description: "Temporary issue with message storage resolved",
    time: "2 hours ago",
    type: "error",
    icon: <Activity className="h-5 w-5" />,
  },
  {
    title: "New Feature Deployed",
    description: "Group messaging feature is now live",
    time: "Yesterday",
    type: "info",
    icon: <Bell className="h-5 w-5" />,
  },
  {
    title: "User Milestone",
    description: "Platform has reached 10,000 registered users",
    time: "2 days ago",
    type: "info",
    icon: <Users className="h-5 w-5" />,
  },
]
