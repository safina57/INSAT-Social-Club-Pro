import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import {
  PieChart,
  Pie,
  Cell,
  Tooltip,
  ResponsiveContainer,
} from "recharts"
import { UserDistributionData } from "../types"
import { CHART_COLORS } from "../data/mockData"

interface UserDistributionChartProps {
  readonly data?: UserDistributionData[]
}

export function UserDistributionChart({ data }: Readonly<UserDistributionChartProps>) {
  return (
    <Card>
      <CardHeader>
        <CardTitle>User Distribution</CardTitle>
        <CardDescription>By role and industry</CardDescription>
      </CardHeader>
      <CardContent className="h-[250px]">
        {!data ? (
          <div className="flex items-center justify-center h-full">
            <div className="text-center">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto mb-2"></div>
              <p className="text-sm text-muted-foreground">Loading chart data...</p>
            </div>
          </div>
        ) : (
          <ResponsiveContainer width="100%" height="100%">
            <PieChart>
              <Pie
                data={data}
                cx="50%"
                cy="50%"
                labelLine={false}
                outerRadius={80}
                fill="#8884d8"
                dataKey="value"
                label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
              >
                {data.map((_, index) => (
                  <Cell key={`cell-${index}`} fill={CHART_COLORS[index % CHART_COLORS.length]} />
                ))}
              </Pie>
              <Tooltip
                contentStyle={{ backgroundColor: "#1f1f1f", borderColor: "#333" }}
                itemStyle={{ color: "#fff" }}
              />
            </PieChart>
          </ResponsiveContainer>
        )}
      </CardContent>
    </Card>
  )
}
