import React from "react"
import { JobFilters } from "@/types/job"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Slider } from "@/components/ui/slider"
import { Switch } from "@/components/ui/switch"
import { Label } from "@/components/ui/label"
import { Separator } from "@/components/ui/separator"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Filter } from "lucide-react"

interface JobFiltersProps {
  filters: JobFilters
  onFiltersChange: (filters: JobFilters) => void
  onReset: () => void
}

export const JobFiltersComponent: React.FC<JobFiltersProps> = ({
  filters,
  onFiltersChange,
  onReset,
}) => {
  const updateFilter = <K extends keyof JobFilters>(key: K, value: JobFilters[K]) => {
    onFiltersChange({ ...filters, [key]: value })
  }

  return (
    <div className="space-y-6">
      <Card className="bg-background/40 backdrop-blur-md border-white/10">
        <CardHeader>
          <CardTitle className="flex items-center">
            <Filter className="mr-2 h-5 w-5" />
            Filters
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="space-y-2">
            <Label htmlFor="location">Location</Label>
            <Select 
              value={filters.location} 
              onValueChange={(value) => updateFilter("location", value)}
            >
              <SelectTrigger id="location" className="bg-secondary/50">
                <SelectValue placeholder="Any Location" />
              </SelectTrigger>
              <SelectContent className="bg-background/95 backdrop-blur-md border-white/10">
                <SelectItem value="any">Any Location</SelectItem>
                <SelectItem value="San Francisco">San Francisco, CA</SelectItem>
                <SelectItem value="New York">New York, NY</SelectItem>
                <SelectItem value="Seattle">Seattle, WA</SelectItem>
                <SelectItem value="Austin">Austin, TX</SelectItem>
                <SelectItem value="Remote">Remote</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-2">
            <Label htmlFor="job-type">Job Type</Label>
            <Select 
              value={filters.jobType} 
              onValueChange={(value) => updateFilter("jobType", value)}
            >
              <SelectTrigger id="job-type" className="bg-secondary/50">
                <SelectValue placeholder="Any Type" />
              </SelectTrigger>
              <SelectContent className="bg-background/95 backdrop-blur-md border-white/10">
                <SelectItem value="any">Any Type</SelectItem>
                <SelectItem value="Full-time">Full-time</SelectItem>
                <SelectItem value="Part-time">Part-time</SelectItem>
                <SelectItem value="Contract">Contract</SelectItem>
                <SelectItem value="Internship">Internship</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <Label>Experience Level</Label>
              <span className="text-sm text-muted-foreground">
                {filters.experience[0]}-{filters.experience[1]} years
              </span>
            </div>
            <Slider
              defaultValue={[0, 10]}
              min={0}
              max={10}
              step={1}
              value={filters.experience}
              onValueChange={(value) => updateFilter("experience", value as [number, number])}
              className="py-4"
            />
          </div>

          <div className="flex items-center space-x-2">
            <Switch 
              id="remote" 
              checked={filters.remoteOnly} 
              onCheckedChange={(checked) => updateFilter("remoteOnly", checked)} 
            />
            <Label htmlFor="remote">Remote Only</Label>
          </div>

          <Separator />

          <Button className="w-full" variant="outline" onClick={onReset}>
            Reset Filters
          </Button>
        </CardContent>
      </Card>

      <Card className="bg-background/40 backdrop-blur-md border-white/10">
        <CardHeader>
          <CardTitle>Job Alerts</CardTitle>
          <CardDescription>Get notified about new jobs</CardDescription>
        </CardHeader>
        <CardContent>
          <form className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="alert-keywords">Keywords</Label>
              <Input 
                id="alert-keywords" 
                placeholder="e.g., UX Designer, React" 
                className="bg-secondary/50" 
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="alert-location">Location</Label>
              <Input 
                id="alert-location" 
                placeholder="e.g., San Francisco, Remote" 
                className="bg-secondary/50" 
              />
            </div>
            <Button className="w-full">Create Alert</Button>
          </form>
        </CardContent>
      </Card>
    </div>
  )
}
