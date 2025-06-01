"use client"

import { useState } from "react"
import { Header } from "@/components/common/header"
import { AdminSidebar } from "@/components/admin/admin-sidebar"
import { Loader2 } from "lucide-react"

// Import GraphQL hook
import { useDashboardAnalytics } from "@/hooks/useDashboardAnalytics"
import { TimeFrame } from "@/graphql/types/dashboard"

// Import our modular components
import { DashboardHeader } from "@/components/admin/components/DashboardHeader"
import { MetricsSection } from "@/components/admin/components/MetricsSection"
import { ChartsTabs } from "@/components/admin/components/ChartsTabs"
import { BottomSection } from "@/components/admin/components/BottomSection"

// Import data transformer
import { DashboardDataTransformer } from "@/utils/dashboardDataTransformer"

// Temporary debug import
import { DebugApollo } from "@/components/debug-apollo"

export default function AdminDashboard() {
  const [timeRange, setTimeRange] = useState<TimeFrame>(TimeFrame.WEEK)

  // Fetch dashboard data from GraphQL
  const { dashboardData, loading, error, refetch } = useDashboardAnalytics(timeRange)

  const handleTimeRangeChange = (newTimeRange: TimeFrame) => {
    setTimeRange(newTimeRange)
    refetch(newTimeRange)
  }

  if (loading) {
    return (
      <div className="min-h-screen w-full bg-background">
        <Header />
        <div className="flex">
          <AdminSidebar />
          <main className="flex-1 p-6 flex items-center justify-center">
            <div className="flex items-center gap-2 text-muted-foreground">
              <Loader2 className="h-6 w-6 animate-spin" />
              <span>Loading dashboard data...</span>
            </div>
          </main>
        </div>
      </div>
    )
  }
  if (error) {
    return (
      <div className="min-h-screen w-full bg-background">
        <Header />
        <div className="flex">
          <AdminSidebar />          <main className="flex-1 p-6">
            <DebugApollo />
            <div className="max-w-md mx-auto mt-8 p-4 border border-red-200 bg-red-50 rounded-lg text-red-700">
              Failed to load dashboard data: {error.message}
            </div>
          </main>
        </div>
      </div>
    )
  }

  if (!dashboardData) {
    return (
      <div className="min-h-screen w-full bg-background">
        <Header />
        <div className="flex">
          <AdminSidebar />
          <main className="flex-1 p-6">
            <div className="max-w-md mx-auto mt-8 p-4 border border-yellow-200 bg-yellow-50 rounded-lg text-yellow-700">
              No dashboard data available
            </div>
          </main>
        </div>
      </div>
    )
  }
  // Transform GraphQL data for components
  const dashboardTransformedData = DashboardDataTransformer.transformDashboardData(dashboardData)

  return (
    <div className="min-h-screen w-full bg-background">
      <Header />
      <div className="flex">
        <AdminSidebar />
        <main className="flex-1 p-6 overflow-auto">
          <DashboardHeader />
          
          <MetricsSection 
            data={dashboardTransformedData}
          />
          
          <ChartsTabs
            timeRange={timeRange as any} // Convert TimeFrame to TimeRange
            onTimeRangeChange={(range: any) => handleTimeRangeChange(TimeFrame[range.toUpperCase() as keyof typeof TimeFrame])}
            data={dashboardTransformedData}
          />
          
          <BottomSection />
        </main>
      </div>
    </div>
  )
}
