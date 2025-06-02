import React, { useState } from "react"
import { useParams, useNavigate } from "react-router-dom"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { 
  ArrowLeft,
  Users, 
  Calendar, 
  MapPin, 
  Mail,
  Phone,
  CheckCircle,
  XCircle,
  Clock,
  Download,
  Search
} from "lucide-react"
import { useGetApplicantsForJob, useUpdateApplication, useJob } from "@/services/jobService"
import { ApplicationStatus } from "@/graphql/types/jobApplication"
import { toast } from "sonner"
import { formatPostedDate } from "@/utils/jobUtils"

export const JobApplicantsPage: React.FC = () => {
  const { jobId } = useParams<{ jobId: string }>()
  const navigate = useNavigate()
  const [searchQuery, setSearchQuery] = useState("")
  const [statusFilter, setStatusFilter] = useState<ApplicationStatus | "ALL">("ALL")
  
  const { data: jobData, loading: jobLoading } = useJob(jobId!)
  const { data: applicantsData, loading: applicantsLoading, refetch } = useGetApplicantsForJob(jobId!)
  const [updateApplication] = useUpdateApplication()

  const job = jobData?.job
  const applicants = applicantsData?.applicantsForJob || []
  const filteredApplicants = applicants.filter(app => {
    const matchesSearch = 
      app.user?.firstName?.toLowerCase().includes(searchQuery.toLowerCase()) ??
      app.user?.lastName?.toLowerCase().includes(searchQuery.toLowerCase()) ??
      app.user?.email?.toLowerCase().includes(searchQuery.toLowerCase()) ??
      false
    
    const matchesStatus = statusFilter === "ALL" || app.status === statusFilter
    
    return matchesSearch && matchesStatus
  })

  const handleStatusUpdate = async (applicationId: string, newStatus: ApplicationStatus) => {
    try {
      await updateApplication({
        variables: {
          applicationId,
          updatedApplication: { status: newStatus }
        }
      })
      
      toast.success(`Application ${newStatus.toLowerCase()} successfully`)
      refetch()
    } catch (error) {
      console.error('Error updating application:', error)
      toast.error('Failed to update application status')
    }
  }

  const getStatusColor = (status: ApplicationStatus) => {
    switch (status) {
      case ApplicationStatus.ACCEPTED:
        return "bg-green-100 text-green-800 hover:bg-green-200"
      case ApplicationStatus.REJECTED:
        return "bg-red-100 text-red-800 hover:bg-red-200"
      case ApplicationStatus.PENDING:
        return "bg-yellow-100 text-yellow-800 hover:bg-yellow-200"
      default:
        return "bg-gray-100 text-gray-800 hover:bg-gray-200"
    }
  }

  const getStatusIcon = (status: ApplicationStatus) => {
    switch (status) {
      case ApplicationStatus.ACCEPTED:
        return <CheckCircle className="h-4 w-4" />
      case ApplicationStatus.REJECTED:
        return <XCircle className="h-4 w-4" />
      case ApplicationStatus.PENDING:
        return <Clock className="h-4 w-4" />
      default:
        return <Clock className="h-4 w-4" />
    }
  }

  const statusCounts = {
    total: applicants.length,
    pending: applicants.filter(app => app.status === ApplicationStatus.PENDING).length,
    accepted: applicants.filter(app => app.status === ApplicationStatus.ACCEPTED).length,
    rejected: applicants.filter(app => app.status === ApplicationStatus.REJECTED).length,
  }

  if (jobLoading || applicantsLoading) {
    return (
      <div className="w-full max-w-6xl mx-auto p-6">
        <div className="flex items-center justify-center h-64">
          <div className="text-lg text-muted-foreground">Loading applicants...</div>
        </div>
      </div>
    )
  }

  if (!job) {
    return (
      <div className="w-full max-w-6xl mx-auto p-6">
        <div className="flex items-center justify-center h-64">
          <div className="text-lg text-red-500">Job not found</div>
        </div>
      </div>
    )
  }

  return (
    <div className="w-full max-w-6xl mx-auto p-6 space-y-6">
      {/* Header */}
      <div className="flex items-center gap-4">
        <Button
          variant="outline"
          size="sm"
          onClick={() => navigate(-1)}
          className="gap-2"
        >
          <ArrowLeft className="h-4 w-4" />
          Back
        </Button>
        <div>
          <h1 className="text-3xl font-bold">Applicants for {job.title}</h1>
          <p className="text-muted-foreground mt-1">
            Manage applications for this job posting
          </p>
        </div>
      </div>

      {/* Job Summary */}
      <Card>
        <CardContent className="p-6">
          <div className="flex items-start justify-between">
            <div>
              <h2 className="text-xl font-semibold mb-2">{job.title}</h2>
              <div className="flex items-center gap-4 text-sm text-muted-foreground">
                {job.location && (
                  <div className="flex items-center gap-1">
                    <MapPin className="h-4 w-4" />
                    {job.location}
                  </div>
                )}
                <div className="flex items-center gap-1">
                  <Calendar className="h-4 w-4" />
                  Posted {formatPostedDate(job.createdAt)}
                </div>
                <div className="flex items-center gap-1">
                  <Users className="h-4 w-4" />
                  {statusCounts.total} applications
                </div>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-muted-foreground">Total</p>
                <p className="text-2xl font-bold">{statusCounts.total}</p>
              </div>
              <Users className="h-8 w-8 text-muted-foreground" />
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-muted-foreground">Pending</p>
                <p className="text-2xl font-bold text-yellow-600">{statusCounts.pending}</p>
              </div>
              <Clock className="h-8 w-8 text-yellow-600" />
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-muted-foreground">Accepted</p>
                <p className="text-2xl font-bold text-green-600">{statusCounts.accepted}</p>
              </div>
              <CheckCircle className="h-8 w-8 text-green-600" />
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-muted-foreground">Rejected</p>
                <p className="text-2xl font-bold text-red-600">{statusCounts.rejected}</p>
              </div>
              <XCircle className="h-8 w-8 text-red-600" />
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Search and Filters */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Search className="h-5 w-5" />
            Search & Filter Applicants
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex gap-4">
            <div className="flex-1">
              <Label htmlFor="search">Search Applicants</Label>
              <Input
                id="search"
                placeholder="Search by name or email..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="mt-1"
              />
            </div>
            <div>
              <Label htmlFor="status">Filter by Status</Label>
              <select
                id="status"
                value={statusFilter}
                onChange={(e) => setStatusFilter(e.target.value as ApplicationStatus | "ALL")}
                className="mt-1 w-40 px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                <option value="ALL">All Status</option>
                <option value={ApplicationStatus.PENDING}>Pending</option>
                <option value={ApplicationStatus.ACCEPTED}>Accepted</option>
                <option value={ApplicationStatus.REJECTED}>Rejected</option>
              </select>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Applicants List */}
      <Card>
        <CardHeader>
          <CardTitle>Applications ({filteredApplicants.length})</CardTitle>
        </CardHeader>
        <CardContent>
          {filteredApplicants.length === 0 ? (
            <div className="text-center py-12">
              <Users className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
              <h3 className="text-lg font-semibold mb-2">No applications found</h3>
              <p className="text-muted-foreground">
                {applicants.length === 0 
                  ? "No one has applied for this job yet."
                  : "No applications match your search criteria."
                }
              </p>
            </div>
          ) : (
            <div className="space-y-4">
              {filteredApplicants.map((application) => (
                <Card key={application.id} className="hover:shadow-md transition-shadow">
                  <CardContent className="p-6">
                    <div className="flex items-start justify-between">
                      <div className="flex items-start gap-4 flex-1">                        <Avatar className="h-12 w-12">
                          <AvatarImage src={application.user?.avatar} />
                          <AvatarFallback>
                            {application.user?.firstName?.[0] ?? 'U'}{application.user?.lastName?.[0] ?? 'N'}
                          </AvatarFallback>
                        </Avatar>
                        
                        <div className="flex-1">
                          <div className="flex items-center gap-2 mb-2">
                            <h3 className="text-lg font-semibold">
                              {application.user?.firstName ?? 'Unknown'} {application.user?.lastName ?? 'User'}
                            </h3>
                            <Badge 
                              className={`gap-1 ${getStatusColor(application.status)}`}
                            >
                              {getStatusIcon(application.status)}
                              {application.status}
                            </Badge>
                          </div>
                          
                          <div className="space-y-1 text-sm text-muted-foreground mb-3">
                            <div className="flex items-center gap-1">
                              <Mail className="h-4 w-4" />
                              {application.user?.email ?? 'No email provided'}
                            </div>
                            {application.user?.phone && (
                              <div className="flex items-center gap-1">
                                <Phone className="h-4 w-4" />
                                {application.user.phone}
                              </div>
                            )}
                            <div className="flex items-center gap-1">
                              <Calendar className="h-4 w-4" />
                              Applied on {formatPostedDate(application.appliedAt ?? application.createdAt)}
                            </div>
                          </div>
                            {application.coverLetter && (
                            <div>
                              <p className="text-sm font-medium mb-1">Cover Letter:</p>
                              <p className="text-sm text-muted-foreground line-clamp-3">
                                {application.coverLetter}
                              </p>
                            </div>
                          )}
                        </div>
                      </div>
                      
                      <div className="flex flex-col gap-2 ml-4">
                        {application.resume && (
                          <Button 
                            variant="outline"
                            size="sm"
                            className="gap-2"
                            onClick={() => window.open(application.resume, '_blank')}
                          >
                            <Download className="h-4 w-4" />
                            Resume
                          </Button>
                        )}
                        
                        {application.status === ApplicationStatus.PENDING && (
                          <div className="flex gap-2">
                            <Button
                              size="sm"
                              onClick={() => handleStatusUpdate(application.id, ApplicationStatus.ACCEPTED)}
                              className="gap-1 bg-green-600 hover:bg-green-700"
                            >
                              <CheckCircle className="h-4 w-4" />
                              Accept
                            </Button>
                            <Button
                              size="sm"
                              variant="destructive"
                              onClick={() => handleStatusUpdate(application.id, ApplicationStatus.REJECTED)}
                              className="gap-1"
                            >
                              <XCircle className="h-4 w-4" />
                              Reject
                            </Button>
                          </div>
                        )}
                        
                        {application.status !== ApplicationStatus.PENDING && (
                          <Button
                            size="sm"
                            variant="outline"
                            onClick={() => handleStatusUpdate(application.id, ApplicationStatus.PENDING)}
                            className="gap-1"
                          >
                            <Clock className="h-4 w-4" />
                            Reset to Pending
                          </Button>
                        )}
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  )
}
