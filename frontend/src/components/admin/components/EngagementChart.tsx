import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { BarChart3 } from "lucide-react"
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from "recharts"
import { EngagementData } from "../types"

interface EngagementChartProps {
  readonly data?: EngagementData[]
}

export function EngagementChart({ data }: Readonly<EngagementChartProps>) {
  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center justify-between">
          Engagement Metrics
          <BarChart3 className="h-4 w-4 text-primary" />
        </CardTitle>
        <CardDescription>Posts, comments, and reactions</CardDescription>
      </CardHeader>
      <CardContent className="h-[300px]">
        {!data ? (
          <div className="flex items-center justify-center h-full">
            <div className="text-center">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto mb-2"></div>
              <p className="text-sm text-muted-foreground">Loading chart data...</p>
            </div>
          </div>
        ) : (
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={data}>
              <CartesianGrid strokeDasharray="3 3" stroke="#333" />
              <XAxis dataKey="name" stroke="#888" />
              <YAxis stroke="#888" />
              <Tooltip
                contentStyle={{ backgroundColor: "#1f1f1f", borderColor: "#333" }}
                itemStyle={{ color: "#fff" }}
              />
              <Legend />
              <Bar dataKey="posts" name="Posts" fill="#10b981" radius={[4, 4, 0, 0]} />
              <Bar dataKey="comments" name="Comments" fill="#3b82f6" radius={[4, 4, 0, 0]} />
              <Bar dataKey="likes" name="Likes" fill="#8b5cf6" radius={[4, 4, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        )}
      </CardContent>
    </Card>
  )
}
