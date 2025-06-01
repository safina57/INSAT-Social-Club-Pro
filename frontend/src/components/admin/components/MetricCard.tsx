import { Card, CardContent } from "@/components/ui/card"
import { ArrowUpRight } from "lucide-react"
import { MetricCardProps } from "../types"

export function MetricCard({
  title,
  value,
  change,
  trend,
  description,
  icon,
}: Readonly<MetricCardProps>) {
  return (
    <Card>
      <CardContent className="p-6">
        <div className="flex items-center justify-between">
          <div className="h-12 w-12 rounded-full bg-primary/20 flex items-center justify-center text-primary">
            {icon}
          </div>
          <div
            className={`flex items-center ${
              trend === "up" ? "text-emerald-500" : "text-red-500"
            } bg-opacity-20 rounded-full px-2 py-1 text-xs font-medium`}
          >
            {change}
            <ArrowUpRight className={`h-3 w-3 ml-1 ${trend === "down" ? "rotate-180" : ""}`} />
          </div>
        </div>
        <div className="mt-4">
          <h3 className="text-3xl font-bold">{value}</h3>
          <p className="text-sm text-muted-foreground mt-1 flex items-center">
            {title}
            <span className="text-xs ml-2 opacity-70">{description}</span>
          </p>
        </div>
      </CardContent>
    </Card>
  )
}
