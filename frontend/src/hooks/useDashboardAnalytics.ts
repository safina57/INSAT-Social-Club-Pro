import { useQuery } from '@apollo/client'
import { GET_DASHBOARD_ANALYTICS } from '../graphql/queries/dashboard'
import { 
  GetDashboardAnalyticsResponse, 
  GetDashboardAnalyticsVariables, 
  TimeFrame 
} from '../graphql/types/dashboard'

export const useDashboardAnalytics = (timeframe: TimeFrame = TimeFrame.WEEK) => {
  const { data, loading, error, refetch } = useQuery<
    GetDashboardAnalyticsResponse,
    GetDashboardAnalyticsVariables
  >(GET_DASHBOARD_ANALYTICS, {
    variables: { timeframe },
    errorPolicy: 'all',
    notifyOnNetworkStatusChange: true,
  })

  return {
    dashboardData: data?.dashboardAnalytics,
    loading,
    error,
    refetch: (newTimeframe?: TimeFrame) => 
      refetch(newTimeframe ? { timeframe: newTimeframe } : undefined),
  }
}
