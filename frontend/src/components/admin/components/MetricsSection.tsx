import { MetricCard } from "./MetricCard"
import { Users, FileText, MessageSquare, Flag } from "lucide-react"
import { DashboardData } from "../types"

interface MetricsSectionProps {
  readonly data?: DashboardData
}

export function MetricsSection({ data }: Readonly<MetricsSectionProps>) {
  // Use real data if available, otherwise show loading state
  if (!data) {
    return (
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4 mb-8">
        {Array.from({ length: 4 }, (_, i) => (
          <div key={`loading-${i}`} className="bg-white p-6 rounded-lg shadow animate-pulse">
            <div className="h-4 bg-gray-200 rounded w-3/4 mb-2"></div>
            <div className="h-8 bg-gray-200 rounded w-1/2 mb-2"></div>
            <div className="h-3 bg-gray-200 rounded w-1/4"></div>
          </div>
        ))}
      </div>
    )
  }

  return (
    <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4 mb-8">
      <MetricCard
        title="Total Users"
        value={data.metrics.totalUsers.toLocaleString()}
        change={`${data.metrics.userGrowth > 0 ? '+' : ''}${data.metrics.userGrowth.toFixed(1)}%`}
        trend={data.metrics.userGrowth >= 0 ? "up" : "down"}
        description="vs. previous month"
        icon={<Users className="h-5 w-5" />}
      />
      <MetricCard
        title="Total Posts"
        value={data.metrics.totalPosts.toLocaleString()}
        change={`${data.metrics.postGrowth > 0 ? '+' : ''}${data.metrics.postGrowth.toFixed(1)}%`}
        trend={data.metrics.postGrowth >= 0 ? "up" : "down"}
        description="vs. previous month"
        icon={<FileText className="h-5 w-5" />}
      />
      <MetricCard
        title="Messages"
        value={data.metrics.totalMessages.toLocaleString()}
        change={`${data.metrics.messageGrowth > 0 ? '+' : ''}${data.metrics.messageGrowth.toFixed(1)}%`}
        trend={data.metrics.messageGrowth >= 0 ? "up" : "down"}
        description="vs. previous month"
        icon={<MessageSquare className="h-5 w-5" />}
      />
      <MetricCard
        title="Reports"
        value={data.metrics.totalReports.toLocaleString()}
        change={`${data.metrics.reportGrowth > 0 ? '+' : ''}${data.metrics.reportGrowth.toFixed(1)}%`}
        trend={data.metrics.reportGrowth >= 0 ? "up" : "down"}
        description="vs. previous month"
        icon={<Flag className="h-5 w-5" />}
      />
    </div>
  )
}
