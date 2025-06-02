import React from "react"
import { useNavigate, useLocation } from "react-router-dom"
import { CreateJobForm } from "@/components/jobs/CreateJobForm"
import { Button } from "@/components/ui/button"
import { ArrowLeft } from "lucide-react"

const CreateJobPage: React.FC = () => {
  const navigate = useNavigate()
  const location = useLocation()
  
  // Get default company ID from location state
  const defaultCompanyId = location.state?.defaultCompanyId

  const handleSuccess = (jobId: string) => {
    // Navigate to the jobs page or to the specific job
    navigate("/jobs", { 
      state: { 
        message: "Job posted successfully!", 
        jobId 
      } 
    })
  }

  const handleCancel = () => {
    navigate("/jobs")
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-background/95 to-background/90 p-4">
      <div className="max-w-6xl mx-auto space-y-6">
        {/* Header */}
        <div className="flex items-center gap-4">
          <Button
            variant="ghost"
            size="icon"
            onClick={() => navigate("/jobs")}
            className="h-10 w-10"
          >
            <ArrowLeft className="h-4 w-4" />
          </Button>
          <div>
            <h1 className="text-3xl font-bold">Create Job Posting</h1>
            <p className="text-muted-foreground">
              Post a new job opportunity for candidates to discover
            </p>
          </div>
        </div>        {/* Job Creation Form */}
        <CreateJobForm
          onSuccess={handleSuccess}
          onCancel={handleCancel}
          defaultCompanyId={defaultCompanyId}
        />
      </div>
    </div>
  )
}

export default CreateJobPage
