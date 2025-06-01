import { Button } from "@/components/ui/button"
import { Calendar, Download } from "lucide-react"

interface DashboardHeaderProps {
  readonly onDownloadReport?: () => void
}

export function DashboardHeader({ onDownloadReport }: Readonly<DashboardHeaderProps>) {
  return (
    <div className="flex items-center justify-between mb-8">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Dashboard</h1>
        <p className="text-muted-foreground">Platform overview and key metrics</p>
      </div>
      <div className="flex items-center gap-4">
        <Button variant="outline" size="sm" className="h-9">
          <Calendar className="mr-2 h-4 w-4" />
          April 24, 2025
        </Button>
        <Button size="sm" className="h-9" onClick={onDownloadReport}>
          <Download className="mr-2 h-4 w-4" />
          Download Report
        </Button>
      </div>
    </div>
  )
}
