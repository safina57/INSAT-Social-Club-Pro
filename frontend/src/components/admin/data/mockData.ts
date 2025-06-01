import { 
  UserData, 
  EngagementData, 
  UserDistributionData, 
  ActivityData, 
  RecentUser, 
  NotificationData 
} from "../types"

// Sample data for charts
export const userData: UserData[] = [
  { name: "Jan", newUsers: 400, activeUsers: 2400 },
  { name: "Feb", newUsers: 300, activeUsers: 1398 },
  { name: "Mar", newUsers: 200, activeUsers: 9800 },
  { name: "Apr", newUsers: 278, activeUsers: 3908 },
  { name: "May", newUsers: 189, activeUsers: 4800 },
  { name: "Jun", newUsers: 239, activeUsers: 3800 },
  { name: "Jul", newUsers: 349, activeUsers: 4300 },
]

export const engagementData: EngagementData[] = [
  { name: "Jan", posts: 400, comments: 240, likes: 2400 },
  { name: "Feb", posts: 300, comments: 138, likes: 1398 },
  { name: "Mar", posts: 200, comments: 980, likes: 9800 },
  { name: "Apr", posts: 278, comments: 390, likes: 3908 },
  { name: "May", posts: 189, comments: 480, likes: 4800 },
  { name: "Jun", posts: 239, comments: 380, likes: 3800 },
  { name: "Jul", posts: 349, comments: 430, likes: 4300 },
]

export const CHART_COLORS = ["#10b981", "#3b82f6", "#8b5cf6", "#ec4899", "#f59e0b", "#ef4444"]

export const userDistributionData: UserDistributionData[] = [
  { name: "Engineering", value: 35 },
  { name: "Design", value: 25 },
  { name: "Marketing", value: 18 },
  { name: "Management", value: 15 },
  { name: "Other", value: 7 },
]

export const activityData: ActivityData[] = [
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

export const recentUsers: RecentUser[] = [
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

export const notifications: NotificationData[] = [
  {
    title: "System Update",
    description: "Platform will undergo maintenance in 24 hours",
    time: "Just now",
    type: "info",
    iconName: "bell",
  },
  {
    title: "Unusual Login Activity",
    description: "Multiple failed login attempts detected",
    time: "30 minutes ago",
    type: "warning",
    iconName: "flag",
  },
  {
    title: "Database Error",
    description: "Temporary issue with message storage resolved",
    time: "2 hours ago",
    type: "error",
    iconName: "activity",
  },
  {
    title: "New Feature Deployed",
    description: "Group messaging feature is now live",
    time: "Yesterday",
    type: "info",
    iconName: "bell",
  },
  {
    title: "User Milestone",
    description: "Platform has reached 10,000 registered users",
    time: "2 days ago",
    type: "info",
    iconName: "users",
  },
]
