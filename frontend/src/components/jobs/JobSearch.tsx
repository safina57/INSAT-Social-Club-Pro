import React from "react"
import { Card, CardContent } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Search } from "lucide-react"

interface JobSearchProps {
  searchQuery: string
  onSearchChange: (query: string) => void
  onSearchSubmit: (e: React.FormEvent) => void
}

export const JobSearch: React.FC<JobSearchProps> = ({
  searchQuery,
  onSearchChange,
  onSearchSubmit,
}) => {
  return (
    <Card className="mb-6 bg-background/40 backdrop-blur-md border-white/10">
      <CardContent className="p-4">
        <form onSubmit={onSearchSubmit} className="flex gap-2">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Search jobs, skills, or companies"
              className="pl-10 bg-secondary/50"
              value={searchQuery}
              onChange={(e) => onSearchChange(e.target.value)}
            />
          </div>
          <Button type="submit">Search</Button>
        </form>
      </CardContent>
    </Card>
  )
}
