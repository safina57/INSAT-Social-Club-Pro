// Type definitions for admin dashboard components

export interface MetricCardProps {
  title: string
  value: string
  change: string
  trend: "up" | "down"
  description: string
  icon: React.ReactNode
}

export interface ChartDataPoint {
  name: string
  [key: string]: any
}

export interface UserData extends ChartDataPoint {
  newUsers: number
  activeUsers: number
}

export interface EngagementData extends ChartDataPoint {
  posts: number
  comments: number
  likes: number
}

export interface UserDistributionData {
  name: string
  value: number
}

export interface ActivityUser {
  name: string
  avatar: string
}

export interface ActivityData {
  user: ActivityUser
  action: string
  time: string
  category: string
}

export interface RecentUser {
  name: string
  role: string
  avatar: string
  status: "Verified" | "Pending"
}

export interface NotificationData {
  title: string
  description: string
  time: string
  type: "info" | "warning" | "error"
  iconName: "bell" | "flag" | "activity" | "users"
}

export type TimeRange = "day" | "week" | "month"

// Structured dashboard data for components
export interface DashboardMetrics {
  totalUsers: number
  totalPosts: number
  totalMessages: number
  totalReports: number
  userGrowth: number
  postGrowth: number
  messageGrowth: number
  reportGrowth: number
}

export interface DashboardCharts {
  userGrowth?: UserData[]
  engagement?: EngagementData[]
  userDistribution?: UserDistributionData[]
  platformActivity?: ActivityData[]
}

export interface DashboardData {
  metrics: DashboardMetrics
  charts: DashboardCharts
}
