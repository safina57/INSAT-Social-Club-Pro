import { gql } from '@apollo/client'

export const GET_DASHBOARD_ANALYTICS = gql`
  query GetDashboardAnalytics($timeframe: TimeFrame!) {
    dashboardAnalytics(timeframe: $timeframe) {
      totalUsers
      totalCompanies
      totalJobs
      totalApplications
      totalPosts
      applicationsByStatus {
        PENDING
        ACCEPTED
        REJECTED
      }
      userSignupsPerTimeFrame {
        date
        count
      }
      postsPerTimeFrame {
        date
        count
      }
    }
  }
`
