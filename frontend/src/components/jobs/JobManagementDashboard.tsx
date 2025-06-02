import React, { useState } from "react"
import { useNavigate } from "react-router-dom"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { 
  Building2, 
  Users, 
  Plus, 
  Eye, 
  MapPin, 
  DollarSign,
  Clock,
  Search,
  Filter
} from "lucide-react"
import { useJobsByCompany, jobService } from "@/services/jobService"
import { formatPostedDate } from "@/utils/jobUtils"
import { SAMPLE_JOBS } from "@/data/sampleJobs"

interface JobManagementDashboardProps {
  companyId: string
}

export const JobManagementDashboard: React.FC<JobManagementDashboardProps> = ({ 
  companyId 
}) => {
  const navigate = useNavigate()
  const [searchQuery, setSearchQuery] = useState("")
  const [currentPage, setCurrentPage] = useState(1)
  
  // Debug logging
  console.log('JobManagementDashboard - Company ID:', companyId)
  
  const { data, loading, error } = useJobsByCompany(companyId, {
    page: currentPage,
    limit: 10
  })

  // Debug logging
  console.log('JobsByCompany Query - Loading:', loading)
  console.log('JobsByCompany Query - Error:', error)
  console.log('JobsByCompany Query - Data:', data)
  console.log('JobsByCompany Query - Raw Response:', data?.jobsByCompany)
  const jobs = (() => {
    if (data?.jobsByCompany?.results) {
      return data.jobsByCompany.results.map(jobService.transformJob)
    }
    // Fallback to sample jobs filtered by company ID
    if (error || !data) {
      return SAMPLE_JOBS.filter(job => job.companyId === companyId)
    }
    return []
  })()

  console.log('Transformed Jobs:', jobs)
  const filteredJobs = jobs.filter(job =>
    job.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
    job.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
    job.location?.toLowerCase().includes(searchQuery.toLowerCase())
  )

  const handleCreateJob = () => {
    navigate("/jobs/create", { state: { defaultCompanyId: companyId } })
  }

  const handleViewJob = (jobId: string) => {
    navigate(`/jobs?jobId=${jobId}`)
  }

  if (loading) {
    return (
      <div className="w-full max-w-6xl mx-auto p-6">
        <div className="flex items-center justify-center h-64">
          <div className="text-lg text-muted-foreground">Loading jobs...</div>
        </div>
      </div>
    )
  }

  if (error) {
    return (
      <div className="w-full max-w-6xl mx-auto p-6">
        <div className="flex items-center justify-center h-64">
          <div className="text-lg text-red-500">Error loading jobs: {error.message}</div>
        </div>
      </div>
    )
  }

  return (
    <div className="w-full max-w-6xl mx-auto p-6 space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold flex items-center gap-2">
            <Building2 className="h-8 w-8" />
            Job Management
          </h1>
          <p className="text-muted-foreground mt-1">
            Manage your company's job postings
          </p>
        </div>
        <Button onClick={handleCreateJob} className="gap-2">
          <Plus className="h-4 w-4" />
          Post New Job
        </Button>
      </div>

      {/* Search and Filters */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Search className="h-5 w-5" />
            Search & Filter
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex gap-4">
            <div className="flex-1">
              <Label htmlFor="search">Search Jobs</Label>
              <Input
                id="search"
                placeholder="Search by title, description, or location..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="mt-1"
              />
            </div>
            <div className="flex items-end">
              <Button variant="outline" className="gap-2">
                <Filter className="h-4 w-4" />
                Filters
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-muted-foreground">
                  Total Jobs
                </p>
                <p className="text-2xl font-bold">{jobs.length}</p>
              </div>
              <Building2 className="h-8 w-8 text-muted-foreground" />
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-muted-foreground">
                  Active Postings
                </p>
                <p className="text-2xl font-bold">{jobs.length}</p>
              </div>
              <Eye className="h-8 w-8 text-muted-foreground" />
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-muted-foreground">
                  Total Applicants
                </p>                <p className="text-2xl font-bold">
                  {jobs.reduce((sum, job) => sum + (job.applicants ?? 0), 0)}
                </p>
              </div>
              <Users className="h-8 w-8 text-muted-foreground" />
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Jobs List */}
      <Card>
        <CardHeader>
          <CardTitle>Your Job Postings</CardTitle>
        </CardHeader>
        <CardContent>
          {filteredJobs.length === 0 ? (
            <div className="text-center py-12">
              <Building2 className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
              <h3 className="text-lg font-semibold mb-2">No jobs found</h3>
              <p className="text-muted-foreground mb-4">
                {jobs.length === 0 
                  ? "You haven't posted any jobs yet. Create your first job posting!"
                  : "No jobs match your search criteria."
                }
              </p>
              {jobs.length === 0 && (
                <Button onClick={handleCreateJob} className="gap-2">
                  <Plus className="h-4 w-4" />
                  Post Your First Job
                </Button>
              )}
            </div>
          ) : (
            <div className="space-y-4">
              {filteredJobs.map((job) => (
                <Card key={job.id} className="hover:shadow-md transition-shadow">
                  <CardContent className="p-6">
                    <div className="flex items-start justify-between">
                      <div className="flex-1">
                        <div className="flex items-center gap-2 mb-2">
                          <h3 className="text-lg font-semibold">{job.title}</h3>
                          <Badge variant="secondary">{job.type}</Badge>
                          {job.urgent && <Badge variant="destructive">Urgent</Badge>}
                          {job.remote && <Badge variant="outline">Remote</Badge>}
                        </div>
                        
                        <div className="flex items-center gap-4 text-sm text-muted-foreground mb-3">
                          {job.location && (
                            <div className="flex items-center gap-1">
                              <MapPin className="h-4 w-4" />
                              {job.location}
                            </div>
                          )}
                          {job.salary && (
                            <div className="flex items-center gap-1">
                              <DollarSign className="h-4 w-4" />
                              ${job.salary.toLocaleString()}
                            </div>
                          )}
                          <div className="flex items-center gap-1">
                            <Clock className="h-4 w-4" />
                            {formatPostedDate(job.postedDate ?? job.createdAt)}
                          </div>                          <div className="flex items-center gap-1">
                            <Users className="h-4 w-4" />
                            {job.applicants ?? 0} applicants
                          </div>
                        </div>
                        
                        <p className="text-sm text-muted-foreground line-clamp-2 mb-3">
                          {job.description}
                        </p>
                        
                        {job.tags && job.tags.length > 0 && (
                          <div className="flex flex-wrap gap-1">
                            {job.tags.slice(0, 5).map((tag) => (
                              <Badge key={tag} variant="outline" className="text-xs">
                                {tag}
                              </Badge>
                            ))}
                            {job.tags.length > 5 && (
                              <Badge variant="outline" className="text-xs">
                                +{job.tags.length - 5} more
                              </Badge>
                            )}
                          </div>
                        )}
                      </div>
                      
                      <div className="flex flex-col gap-2 ml-4">
                        <Button 
                          onClick={() => handleViewJob(job.id)}
                          variant="outline"
                          size="sm"
                          className="gap-2"
                        >
                          <Eye className="h-4 w-4" />
                          View
                        </Button>                        <Button 
                          onClick={() => navigate(`/jobs/${job.id}/applicants`)}
                          variant="outline"
                          size="sm"
                          className="gap-2"
                        >
                          <Users className="h-4 w-4" />
                          Applicants ({job.applicants ?? 0})
                        </Button>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          )}
        </CardContent>
      </Card>

      {/* Pagination */}
      {data?.jobsByCompany?.meta && data.jobsByCompany.meta.lastPage > 1 && (
        <div className="flex justify-center gap-2">
          <Button
            variant="outline"
            onClick={() => setCurrentPage(prev => Math.max(1, prev - 1))}
            disabled={currentPage === 1}
          >
            Previous
          </Button>
          <span className="flex items-center px-4">
            Page {currentPage} of {data.jobsByCompany.meta.lastPage}
          </span>
          <Button
            variant="outline"
            onClick={() => setCurrentPage(prev => prev + 1)}
            disabled={currentPage >= data.jobsByCompany.meta.lastPage}
          >
            Next
          </Button>
        </div>
      )}
    </div>
  )
}
