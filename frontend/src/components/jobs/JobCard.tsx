import React from "react"
import { Job } from "@/types/job"
import { Badge } from "@/components/ui/badge"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Clock, Users, Bookmark, MapPin, Briefcase, DollarSign } from "lucide-react"
import { cn } from "@/lib/utils"
import { formatPostedDate } from "@/utils/jobUtils"

interface JobCardProps {
  job: Job
  isSelected: boolean
  onClick: (job: Job) => void
}

export const JobCard: React.FC<JobCardProps> = ({ job, isSelected, onClick }) => {
  return (
    <Card
      className={cn(
        "cursor-pointer transition-all duration-200 bg-background/40 backdrop-blur-md border-white/10 hover:bg-background/60",
        isSelected && "ring-2 ring-primary/50 bg-background/60"
      )}
      onClick={() => onClick(job)}
    >
      <CardContent className="p-6">
        <div className="flex items-start justify-between">
          <div className="flex items-start space-x-4">            <Avatar className="h-12 w-12 border border-white/10">
              <AvatarImage src={job.companyLogo || "/placeholder.svg"} alt={job.company || 'Company'} />
              <AvatarFallback>{(job.company || 'Company').charAt(0)}</AvatarFallback>
            </Avatar>
            <div className="flex-1">
              <div className="flex items-center gap-2 mb-1">
                <h3 className="font-semibold text-lg">{job.title}</h3>
                {job.urgent && (
                  <Badge variant="destructive" className="text-xs">
                    Urgent
                  </Badge>
                )}
              </div>
              <p className="text-muted-foreground font-medium">{job.company || 'Company'}</p>
              <div className="flex items-center gap-4 mt-2 text-sm text-muted-foreground">
                <div className="flex items-center">
                  <MapPin className="mr-1 h-4 w-4" />
                  {job.location || 'Remote'}
                </div>
                <div className="flex items-center">
                  <Briefcase className="mr-1 h-4 w-4" />
                  {job.type || 'Full-time'}
                </div>                <div className="flex items-center">
                  <DollarSign className="mr-1 h-4 w-4" />
                  {job.salary ? `$${job.salary.toLocaleString()}` : 'Negotiable'}
                </div>
              </div>              <div className="flex flex-wrap gap-1 mt-3">
                {job.tags && job.tags.length > 0 ? (
                  <>
                    {job.tags.slice(0, 3).map((tag) => (
                      <Badge key={tag} variant="secondary" className="text-xs">
                        {tag}
                      </Badge>
                    ))}
                    {job.tags.length > 3 && (
                      <Badge variant="outline" className="text-xs">
                        +{job.tags.length - 3} more
                      </Badge>
                    )}
                  </>
                ) : (
                  <Badge variant="outline" className="text-xs">
                    No tags
                  </Badge>
                )}
              </div>
            </div>
          </div>
          <div className="flex flex-col items-end space-y-2">
            <div className="flex items-center text-sm text-muted-foreground">
              <Clock className="mr-1 h-4 w-4" />
              {formatPostedDate(job.postedDate ?? "")}
            </div>
            <div className="flex items-center text-sm text-muted-foreground">
              <Users className="mr-1 h-4 w-4" />
              {job.applicants} applicants
            </div>
            <Button variant="ghost" size="icon" className="h-8 w-8">
              <Bookmark className="h-4 w-4" />
            </Button>
          </div>
        </div>
      </CardContent>
    </Card>
  )
}
