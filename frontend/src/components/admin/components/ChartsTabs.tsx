import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { UserGrowthChart } from "./UserGrowthChart"
import { EngagementChart } from "./EngagementChart"
import { UserDistributionChart } from "./UserDistributionChart"
import { PlatformActivity } from "./PlatformActivity"
import { TimeRangeSelector } from "./TimeRangeSelector"
import { TimeRange, DashboardData } from "../types"

interface ChartsTabsProps {
  readonly timeRange: TimeRange
  readonly onTimeRangeChange: (range: TimeRange) => void
  readonly data?: DashboardData
}

export function ChartsTabs({ timeRange, onTimeRangeChange, data }: Readonly<ChartsTabsProps>) {
  return (
    <Tabs defaultValue="overview" className="mb-8">
      <div className="flex items-center justify-between mb-4">
        <TabsList>
          <TabsTrigger value="overview">Overview</TabsTrigger>
        </TabsList>
        <TimeRangeSelector timeRange={timeRange} onTimeRangeChange={onTimeRangeChange} />
      </div>

      <TabsContent value="overview" className="space-y-4">
        <div className="grid gap-4 md:grid-cols-2">
          <UserGrowthChart data={data?.charts.userGrowth} />
          <EngagementChart data={data?.charts.engagement} />
        </div>

        <div className="grid gap-4 md:grid-cols-3">
          <UserDistributionChart data={data?.charts.userDistribution} />
          <PlatformActivity data={data?.charts.platformActivity} />
        </div>
      </TabsContent>
    </Tabs>
  )
}
