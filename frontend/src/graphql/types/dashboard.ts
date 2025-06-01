// GraphQL types based on backend schema
export interface TimeFrameData {
  date: string
  count: number
}

export interface ApplicationsByStatus {
  PENDING: number
  ACCEPTED: number
  REJECTED: number
}

export interface DashboardStats {
  totalUsers: number
  totalCompanies: number
  totalJobs: number
  totalApplications: number
  totalPosts: number
  applicationsByStatus: ApplicationsByStatus
  userSignupsPerTimeFrame: TimeFrameData[]
}

export interface DashboardAnalytics extends DashboardStats {
  postsPerTimeFrame: TimeFrameData[]
}

export enum TimeFrame {
  DAY = 'DAY',
  WEEK = 'WEEK',
  MONTH = 'MONTH'
}

// GraphQL Query Variables
export interface GetDashboardAnalyticsVariables {
  timeframe: TimeFrame
}

export interface GetDashboardAnalyticsResponse {
  dashboardAnalytics: DashboardAnalytics
}
