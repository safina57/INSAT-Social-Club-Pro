import React from "react"
import { Job } from "@/types/job"
import { JobCard } from "./JobCard"
import { ScrollArea } from "@/components/ui/scroll-area"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Briefcase, Bookmark, Calendar } from "lucide-react"

interface JobListProps {
  jobs: Job[]
  selectedJob: Job | null
  onJobSelect: (job: Job) => void
  activeTab: string
  onTabChange: (tab: string) => void
}

const EmptyState: React.FC<{ icon: React.ReactNode; message: string }> = ({ icon, message }) => (
  <div className="text-center py-12 text-muted-foreground">
    <div className="mx-auto h-12 w-12 mb-4 opacity-50">{icon}</div>
    <p>{message}</p>
  </div>
)

export const JobList: React.FC<JobListProps> = ({
  jobs,
  selectedJob,
  onJobSelect,
  activeTab,
  onTabChange,
}) => {
  return (
    <Tabs value={activeTab} onValueChange={onTabChange}>
      <TabsList className="mb-6">
        <TabsTrigger value="all">All Jobs ({jobs.length})</TabsTrigger>
        <TabsTrigger value="recent">Recent</TabsTrigger>
        <TabsTrigger value="saved">Saved</TabsTrigger>
        <TabsTrigger value="applied">Applied</TabsTrigger>
      </TabsList>

      <TabsContent value="all">
        <ScrollArea className="h-[calc(100vh-300px)]">
          <div className="space-y-4 pr-4">
            {jobs.map((job) => (
              <JobCard
                key={job.id}
                job={job}
                isSelected={selectedJob?.id === job.id}
                onClick={onJobSelect}
              />
            ))}
          </div>
        </ScrollArea>
      </TabsContent>

      <TabsContent value="recent">
        <EmptyState 
          icon={<Briefcase className="h-full w-full" />} 
          message="No recent job views" 
        />
      </TabsContent>

      <TabsContent value="saved">
        <EmptyState 
          icon={<Bookmark className="h-full w-full" />} 
          message="No saved jobs yet" 
        />
      </TabsContent>

      <TabsContent value="applied">
        <EmptyState 
          icon={<Calendar className="h-full w-full" />} 
          message="No job applications yet" 
        />
      </TabsContent>
    </Tabs>
  )
}
