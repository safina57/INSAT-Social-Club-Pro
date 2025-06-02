import React, { useState, useEffect } from "react"
import { Job } from "@/types/job"
import { Badge } from "@/components/ui/badge"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Card, CardContent, CardHeader } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Separator } from "@/components/ui/separator"
import { Clock, MapPin, Share2, Bookmark, ExternalLink, Loader2, CheckCircle } from "lucide-react"
import { formatPostedDate } from "@/utils/jobUtils"
import { useApplyToJob, useMyApplications } from "@/services/jobService"
import { toast } from "sonner"
import { ApplicationStatus } from "@/graphql/types/jobApplication"

interface JobDetailsProps {
  job: Job
}

export const JobDetails: React.FC<JobDetailsProps> = ({ job }) => {
  const [isApplying, setIsApplying] = useState(false)
  const [hasApplied, setHasApplied] = useState(false)
  const [applicationStatus, setApplicationStatus] = useState<ApplicationStatus | null>(null)
  
  const [applyToJob] = useApplyToJob()
  const { data: applicationsData, refetch: refetchApplications } = useMyApplications()

  // Check if user has already applied to this job
  useEffect(() => {
    if (applicationsData?.myApplications) {
      const existingApplication = applicationsData.myApplications.find(
        app => app.jobId === job.id
      )
      if (existingApplication) {
        setHasApplied(true)
        setApplicationStatus(existingApplication.status)
      }
    }
  }, [applicationsData, job.id])

  const handleApplyToJob = async () => {
    if (hasApplied) return
    
    setIsApplying(true)
    try {
      const result = await applyToJob({
        variables: {
          input: {
            jobId: job.id
          }
        }
      })

      if (result.data?.applyToJob) {
        setHasApplied(true)
        setApplicationStatus(result.data.applyToJob.status)
        toast.success("Application submitted successfully!", {
          description: `You have successfully applied for ${job.title}`
        })
        // Refetch applications to update the cache
        refetchApplications()
      }    } catch (error: any) {
      console.error('Error applying to job:', error)
      toast.error("Failed to submit application", {
        description: error.message ?? "Please try again later"
      })
    } finally {
      setIsApplying(false)
    }
  }

  const getApplicationButtonContent = () => {
    if (isApplying) {
      return (
        <>
          <Loader2 className="mr-2 h-4 w-4 animate-spin" />
          Applying...
        </>
      )
    }
    
    if (hasApplied) {
      return (
        <>
          <CheckCircle className="mr-2 h-4 w-4" />
          {applicationStatus === ApplicationStatus.PENDING && "Application Pending"}
          {applicationStatus === ApplicationStatus.ACCEPTED && "Application Accepted"}
          {applicationStatus === ApplicationStatus.REJECTED && "Application Rejected"}
        </>
      )
    }
    
    return "Apply Now"
  }

  const getApplicationButtonVariant = () => {
    if (hasApplied) {
      if (applicationStatus === ApplicationStatus.ACCEPTED) return "default"
      if (applicationStatus === ApplicationStatus.REJECTED) return "destructive"
      return "secondary" // PENDING
    }
    return "default"
  }
  return (
    <Card className="bg-background/40 backdrop-blur-md border-white/10 sticky top-8">
      <CardHeader>
        <div className="flex items-start justify-between">
          <div className="flex items-start space-x-3">            <Avatar className="h-12 w-12 border border-white/10">
              <AvatarImage src={job.companyLogo ?? "/placeholder.svg"} alt={job.company ?? 'Company'} />
              <AvatarFallback>{(job.company ?? 'Company').charAt(0)}</AvatarFallback>
            </Avatar>
            <div>
              <h2 className="text-xl font-bold">{job.title}</h2>
              <p className="text-muted-foreground">{job.company ?? 'Company'}</p>
            </div>
          </div>
          <Button variant="ghost" size="icon" className="h-8 w-8">
            <Share2 className="h-4 w-4" />
          </Button>
        </div>
        <div className="flex items-center gap-4 text-sm text-muted-foreground">
          <div className="flex items-center">
            <MapPin className="mr-1 h-4 w-4" />
            {job.location}
          </div>
          <div className="flex items-center">
            <Clock className="mr-1 h-4 w-4" />
            {formatPostedDate(job.postedDate ?? "")}
          </div>
        </div>
      </CardHeader>
      <CardContent className="space-y-6">        <div className="flex gap-2">
          <Button 
            className="flex-1" 
            onClick={handleApplyToJob}
            disabled={isApplying || hasApplied}
            variant={getApplicationButtonVariant()}
          >
            {getApplicationButtonContent()}
          </Button>
          <Button variant="outline" size="icon">
            <Bookmark className="h-4 w-4" />
          </Button>
        </div>

        <div>
          <h3 className="font-semibold mb-2">Job Details</h3>
          <div className="space-y-2 text-sm">
            <div className="flex justify-between">
              <span className="text-muted-foreground">Type:</span>
              <span>{job.type}</span>
            </div>            <div className="flex justify-between">
              <span className="text-muted-foreground">Salary:</span>
              <span>{job.salary ? `$${job.salary.toLocaleString()}` : 'Negotiable'}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-muted-foreground">Experience:</span>
              <span>{job.experienceYears}+ years</span>
            </div>
            <div className="flex justify-between">
              <span className="text-muted-foreground">Remote:</span>
              <span>{job.remote ? "Yes" : "No"}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-muted-foreground">Applicants:</span>
              <span>{job.applicants}</span>
            </div>
          </div>
        </div>

        <Separator />

        <div>
          <h3 className="font-semibold mb-2">Description</h3>
          <p className="text-sm text-muted-foreground whitespace-pre-line">{job.description}</p>
        </div>        <div>
          <h3 className="font-semibold mb-2">Requirements</h3>
          {job.requirements && job.requirements.length > 0 ? (
            <ul className="text-sm text-muted-foreground space-y-1">
              {job.requirements.map((req) => (
                <li key={req} className="flex items-start">
                  <span className="mr-2">•</span>
                  <span>{req}</span>
                </li>
              ))}
            </ul>
          ) : (
            <p className="text-sm text-muted-foreground">No specific requirements listed.</p>
          )}
        </div>

        <div>
          <h3 className="font-semibold mb-2">Benefits</h3>
          {job.benefits && job.benefits.length > 0 ? (
            <ul className="text-sm text-muted-foreground space-y-1">
              {job.benefits.map((benefit) => (
                <li key={benefit} className="flex items-start">
                  <span className="mr-2">•</span>
                  <span>{benefit}</span>
                </li>
              ))}
            </ul>
          ) : (
            <p className="text-sm text-muted-foreground">No specific benefits listed.</p>
          )}
        </div>

        <div>
          <h3 className="font-semibold mb-2">Skills</h3>
          {job.tags && job.tags.length > 0 ? (
            <div className="flex flex-wrap gap-1">
              {job.tags.map((tag) => (
                <Badge key={tag} variant="secondary" className="text-xs">
                  {tag}
                </Badge>
              ))}
            </div>
          ) : (
            <p className="text-sm text-muted-foreground">No specific skills listed.</p>
          )}
        </div>

        <Button className="w-full" variant="outline">
          <ExternalLink className="mr-2 h-4 w-4" />
          View Company Profile
        </Button>
      </CardContent>
    </Card>
  )
}
