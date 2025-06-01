import { DashboardAnalytics, TimeFrameData } from '../graphql/types/dashboard'
import { 
  UserData, 
  EngagementData, 
  UserDistributionData, 
  ActivityData, 
  RecentUser, 
  NotificationData 
} from '../components/admin/types'

// Transform backend data to frontend chart data
export class DashboardDataTransformer {
    static transformUserGrowthData(userSignupsPerTimeFrame: TimeFrameData[]): UserData[] {
    return userSignupsPerTimeFrame.map((item) => ({
      name: this.formatDateLabel(item.date),
      newUsers: item.count,
      // For now, we'll use a calculated active users value based on new users
      // In the future, you might want to add this to the backend query
      activeUsers: item.count * 3 + Math.floor(Math.random() * 1000),
    }))
  }

  static transformEngagementData(postsPerTimeFrame: TimeFrameData[]): EngagementData[] {
    return postsPerTimeFrame.map((item) => ({
      name: this.formatDateLabel(item.date),
      posts: item.count,
      // These would ideally come from backend as well
      comments: Math.floor(item.count * 0.6),
      likes: Math.floor(item.count * 2.8),
    }))
  }

  static transformMetricsData(analytics: DashboardAnalytics) {
    const userGrowth = analytics.userSignupsPerTimeFrame
    const currentPeriod = userGrowth[userGrowth.length - 1]?.count || 0
    const previousPeriod = userGrowth[userGrowth.length - 2]?.count || 0
    const userGrowthPercent = previousPeriod === 0 ? 100 : 
      ((currentPeriod - previousPeriod) / previousPeriod * 100)

    const postGrowth = analytics.postsPerTimeFrame
    const currentPosts = postGrowth[postGrowth.length - 1]?.count || 0
    const previousPosts = postGrowth[postGrowth.length - 2]?.count || 0
    const postGrowthPercent = previousPosts === 0 ? 100 : 
      ((currentPosts - previousPosts) / previousPosts * 100)

    return {
      totalUsers: analytics.totalUsers.toLocaleString(),
      totalPosts: analytics.totalPosts.toLocaleString(),
      totalMessages: "N/A", // Not available from backend yet
      totalReports: "N/A", // Not available from backend yet
      userGrowth: `${userGrowthPercent >= 0 ? '+' : ''}${userGrowthPercent.toFixed(1)}%`,
      postGrowth: `${postGrowthPercent >= 0 ? '+' : ''}${postGrowthPercent.toFixed(1)}%`,
      messageGrowth: "N/A",
      reportChange: "N/A",
    }
  }

  static transformUserDistributionData(analytics: DashboardAnalytics): UserDistributionData[] {
    // This is placeholder data since we don't have user distribution by role in backend yet
    // You would need to add this query to the backend
    return [
      { name: "Job Seekers", value: Math.floor(analytics.totalUsers * 0.6) },
      { name: "Companies", value: analytics.totalCompanies },
      { name: "Recruiters", value: Math.floor(analytics.totalUsers * 0.15) },
      { name: "Other", value: Math.floor(analytics.totalUsers * 0.25) },
    ]
  }

  private static formatDateLabel(dateString: string): string {
    const date = new Date(dateString)
    return date.toLocaleDateString('en-US', { 
      month: 'short',
      day: 'numeric'
    })
  }

  // Generate mock activity data since this isn't available from backend yet
  static generateMockActivityData(): ActivityData[] {
    return [
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
    ]
  }

  // Generate mock recent users data since this isn't available from backend yet
  static generateMockRecentUsers(): RecentUser[] {
    return [
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
    ]
  }

  // Generate mock notifications data since this isn't available from backend yet
  static generateMockNotifications(): NotificationData[] {
    return [
      {
        title: "System Update",
        description: "Platform will undergo maintenance in 24 hours",
        time: "Just now",
        type: "info",
        iconName: "bell",
      },
      {
        title: "New Job Applications",
        description: "15 new applications received today",
        time: "30 minutes ago",
        type: "info",
        iconName: "users",
      },
      {
        title: "Server Performance",
        description: "All systems operating normally",
        time: "2 hours ago",        type: "info",
        iconName: "activity",
      },
    ]
  }
  // Main method to transform dashboard data from backend to frontend format
  static transformDashboardData(data: DashboardAnalytics) {
    const metrics = this.transformMetricsData(data)
    
    return {
      metrics: {
        totalUsers: data.totalUsers,
        totalPosts: data.totalPosts,
        totalMessages: 0, // Not available in backend yet
        totalReports: 0, // Not available in backend yet
        userGrowth: parseFloat(metrics.userGrowth.replace(/[+%]/g, '')),
        postGrowth: parseFloat(metrics.postGrowth.replace(/[+%]/g, '')),
        messageGrowth: 0, // Not available in backend yet
        reportGrowth: 0, // Not available in backend yet
      },
      charts: {
        userGrowth: this.transformUserGrowthData(data.userSignupsPerTimeFrame),
        engagement: this.transformEngagementData(data.postsPerTimeFrame),
        userDistribution: this.transformUserDistributionData(data),
        platformActivity: this.generateMockActivityData(),
      }
    }
  }
}

// Main transform function that converts backend data to frontend format
export const transformDashboardData = (data: DashboardAnalytics) => {
  return DashboardDataTransformer.transformDashboardData(data)
}
