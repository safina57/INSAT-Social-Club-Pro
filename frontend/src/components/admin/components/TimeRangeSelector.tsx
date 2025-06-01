import { Button } from "@/components/ui/button"
import { TimeRange } from "../types"

interface TimeRangeSelectorProps {
  readonly timeRange: TimeRange
  readonly onTimeRangeChange: (range: TimeRange) => void
}

const TIME_RANGES: { value: TimeRange; label: string }[] = [
  { value: "day", label: "Day" },
  { value: "week", label: "Week" },
  { value: "month", label: "Month" },
]

export function TimeRangeSelector({ timeRange, onTimeRangeChange }: Readonly<TimeRangeSelectorProps>) {
  return (
    <div className="flex items-center gap-2">
      {TIME_RANGES.map((range) => (
        <Button
          key={range.value}
          variant={timeRange === range.value ? "default" : "outline"}
          size="sm"
          onClick={() => onTimeRangeChange(range.value)}
        >
          {range.label}
        </Button>
      ))}
    </div>
  )
}
