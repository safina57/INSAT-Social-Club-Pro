"use client"

import { useState, useEffect } from "react"
import { useQuery, useMutation } from "@apollo/client"
import { useNavigate } from "react-router-dom"
import { Header } from "@/components/common/header"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Separator } from "@/components/ui/separator"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import {
  Pagination,
  PaginationContent,
  PaginationEllipsis,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
} from "@/components/ui/pagination"
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog"
import {
  Building2,
  ExternalLink,
  Users,
  Briefcase,
  Calendar,
  Edit,
  Trash2,
  MapPin,
  DollarSign,
  Clock,
  Loader2,
  ArrowLeft,
} from "lucide-react"
import { GET_COMPANY_BY_ID, DELETE_COMPANY, CHECK_COMPANY_PERMISSIONS } from "@/graphql/queries/company"
import { motion } from "framer-motion"
import { toast } from "@/hooks/use-toast"

interface Job {
  id: string
  title: string
  description: string
  location: string
  salary: string
  createdAt: string
  updatedAt: string
}

interface JobsPagination {
  results: Job[]
  meta: {
    total: number
    page: number
    lastPage: number
    limit: number
  }
}

interface ManagedCompany {
  id: string
  companyId: string
  role: string
  user: {
    id: string
    username: string
    email: string
    role: string
    profilePhoto: string | null
  }
}

interface Company {
  id: string
  name: string
  description: string
  website?: string
  createdAt: string
  updatedAt: string
}

interface CompanyData {
  Company: Company
  jobsByCompany: JobsPagination
  getManagedCompanies: ManagedCompany[]
}

interface PermissionsData {
  checkCompanyPermissions: {
    canEdit: boolean
    canDelete: boolean
    role: string
  }
}

export default function CompanyDetailPage({ params }: { params: { id: string } }) {
  const navigate = useNavigate()
  const [userToken, setUserToken] = useState<string | null>(null)
  const [currentPage, setCurrentPage] = useState(1)
  const [pageSize, _setPageSize] = useState(6)

  useEffect(() => {
    const token = localStorage.getItem("userToken")
    setUserToken(token)
  }, [])

  const { data, loading, error, refetch } = useQuery<CompanyData>(GET_COMPANY_BY_ID, {
    variables: {
      id: params.id,
      paginationDto: {
        page: currentPage,
        limit: pageSize,
      },
    },
    fetchPolicy: "cache-and-network",
  })

  const { data: permissionsData } = useQuery<PermissionsData>(CHECK_COMPANY_PERMISSIONS, {
    variables: { companyId: params.id },
    skip: !userToken,
    context: {
      headers: {
        Authorization: userToken ? `Bearer ${userToken}` : "",
      },
    },
  })

  const [deleteCompany, { loading: deleteLoading }] = useMutation(DELETE_COMPANY, {
    context: {
      headers: {
        Authorization: userToken ? `Bearer ${userToken}` : "",
      },
    },
    onCompleted: () => {
      toast({
        title: "Company deleted",
        description: "The company has been successfully deleted.",
      })
      navigate("/companies")
    },
    onError: (error) => {
      toast({
        title: "Error",
        description: error.message || "Failed to delete company.",
        variant: "destructive",
      })
    },
  })

  // Update when pagination changes
  useEffect(() => {
    if (data) {
      refetch({
        id: params.id,
        paginationDto: {
          page: currentPage,
          limit: pageSize,
        },
      })
    }
  }, [currentPage, pageSize, params.id, refetch, data])

  const company = data?.Company
  const jobs = data?.jobsByCompany?.results || []
  const jobsMeta = data?.jobsByCompany?.meta
  const managedCompanies = data?.getManagedCompanies || []

  // Filter managers for this specific company
  const managers = managedCompanies.filter((mc) => mc.companyId === params.id)

  const permissions = permissionsData?.checkCompanyPermissions

  const handleDelete = async () => {
    try {
      await deleteCompany({
        variables: { id: params.id },
      })
    } catch (error) {
      console.error("Delete error:", error)
    }
  }

  const formatDate = (dateString: string) => {
    const date = new Date(dateString)
    return date.toLocaleDateString("en-US", {
      year: "numeric",
      month: "long",
      day: "numeric",
    })
  }

  const formatJobDate = (dateString: string) => {
    const date = new Date(dateString)
    const now = new Date()
    const diffInDays = Math.floor((now.getTime() - date.getTime()) / (1000 * 60 * 60 * 24))

    if (diffInDays === 0) return "Today"
    if (diffInDays === 1) return "Yesterday"
    if (diffInDays < 7) return `${diffInDays} days ago`
    if (diffInDays < 30) return `${Math.floor(diffInDays / 7)} weeks ago`
    return `${Math.floor(diffInDays / 30)} months ago`
  }

  const generatePaginationItems = () => {
    if (!jobsMeta) return null

    const items = []
    const maxVisiblePages = 5
    const totalPages = jobsMeta.lastPage

    if (totalPages <= maxVisiblePages) {
      for (let i = 1; i <= totalPages; i++) {
        items.push(
          <PaginationItem key={i}>
            <PaginationLink
              href="#"
              isActive={currentPage === i}
              onClick={(e) => {
                e.preventDefault()
                setCurrentPage(i)
              }}
            >
              {i}
            </PaginationLink>
          </PaginationItem>,
        )
      }
    } else {
      // Always show first page
      items.push(
        <PaginationItem key={1}>
          <PaginationLink
            href="#"
            isActive={currentPage === 1}
            onClick={(e) => {
              e.preventDefault()
              setCurrentPage(1)
            }}
          >
            1
          </PaginationLink>
        </PaginationItem>,
      )

      // Show ellipsis if needed
      if (currentPage > 3) {
        items.push(
          <PaginationItem key="ellipsis1">
            <PaginationEllipsis />
          </PaginationItem>,
        )
      }

      // Show pages around current page
      const start = Math.max(2, currentPage - 1)
      const end = Math.min(totalPages - 1, currentPage + 1)

      for (let i = start; i <= end; i++) {
        items.push(
          <PaginationItem key={i}>
            <PaginationLink
              href="#"
              isActive={currentPage === i}
              onClick={(e) => {
                e.preventDefault()
                setCurrentPage(i)
              }}
            >
              {i}
            </PaginationLink>
          </PaginationItem>,
        )
      }

      // Show ellipsis if needed
      if (currentPage < totalPages - 2) {
        items.push(
          <PaginationItem key="ellipsis2">
            <PaginationEllipsis />
          </PaginationItem>,
        )
      }

      // Always show last page
      if (totalPages > 1) {
        items.push(
          <PaginationItem key={totalPages}>
            <PaginationLink
              href="#"
              isActive={currentPage === totalPages}
              onClick={(e) => {
                e.preventDefault()
                setCurrentPage(totalPages)
              }}
            >
              {totalPages}
            </PaginationLink>
          </PaginationItem>,
        )
      }
    }

    return items
  }

  if (loading) {
    return (
      <div className="min-h-screen w-full aurora-gradient">
        <Header />
        <div className="container mx-auto px-4 py-16 flex items-center justify-center">
          <Loader2 className="h-8 w-8 animate-spin text-primary" />
        </div>
      </div>
    )
  }

  if (error || !company) {
    return (
      <div className="min-h-screen w-full aurora-gradient">
        <Header />
        <div className="container mx-auto px-4 py-16 text-center">
          <h1 className="text-3xl font-bold mb-4">Company Not Found</h1>
          <p className="text-muted-foreground mb-8">
            The company you're looking for doesn't exist or has been removed.
          </p>
          <a href="/companies">
            <Button>
              <ArrowLeft className="mr-2 h-4 w-4" />
              Back to Companies
            </Button>
          </a>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen w-full aurora-gradient">
      <Header />
      <div className="container mx-auto px-4 py-8 content-z-index">
        {/* Header */}
        <div className="mb-8">
          <a href="/companies">
            <Button variant="ghost" className="mb-4">
              <ArrowLeft className="mr-2 h-4 w-4" />
              Back to Companies
            </Button>
          </a>

          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5 }}>
            <Card className="bg-background/40 backdrop-blur-md border-white/10">
              <CardContent className="p-8">
                <div className="flex flex-col lg:flex-row lg:items-start lg:justify-between">
                  <div className="flex items-start space-x-6">
                    <Avatar className="h-20 w-20 border-2 border-primary/50">
                      <AvatarImage src={`/placeholder.svg?height=80&width=80`} alt={company.name} />
                      <AvatarFallback>
                        <Building2 className="h-10 w-10" />
                      </AvatarFallback>
                    </Avatar>
                    <div>
                      <h1 className="text-3xl font-bold mb-2">{company.name}</h1>
                      <div className="flex flex-wrap items-center gap-4 mb-4">
                        {company.website && (
                          <a
                            href={company.website}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="flex items-center text-primary hover:text-primary/80 transition-colors"
                          >
                            <ExternalLink className="mr-1 h-4 w-4" />
                            Visit Website
                          </a>
                        )}
                        <div className="flex items-center text-muted-foreground">
                          <Briefcase className="mr-1 h-4 w-4" />
                          {jobsMeta?.total || 0} open positions
                        </div>
                        <div className="flex items-center text-muted-foreground">
                          <Users className="mr-1 h-4 w-4" />
                          {managers.length} managers
                        </div>
                      </div>
                      <div className="flex items-center text-sm text-muted-foreground">
                        <Calendar className="mr-1 h-4 w-4" />
                        Founded {formatDate(company.createdAt)}
                      </div>
                    </div>
                  </div>

                  {permissions && (permissions.canEdit || permissions.canDelete) && (
                    <div className="flex gap-2 mt-6 lg:mt-0">
                      {permissions.canEdit && (
                        <a href={`/companies/${company.id}/edit`}>
                          <Button variant="outline">
                            <Edit className="mr-2 h-4 w-4" />
                            Edit
                          </Button>
                        </a>
                      )}
                      {permissions.canDelete && (
                        <AlertDialog>
                          <AlertDialogTrigger asChild>
                            <Button variant="destructive">
                              <Trash2 className="mr-2 h-4 w-4" />
                              Delete
                            </Button>
                          </AlertDialogTrigger>
                          <AlertDialogContent className="bg-background/95 backdrop-blur-md border-white/10">
                            <AlertDialogHeader>
                              <AlertDialogTitle>Are you sure?</AlertDialogTitle>
                              <AlertDialogDescription>
                                This action cannot be undone. This will permanently delete the company "{company.name}"
                                and all associated data.
                              </AlertDialogDescription>
                            </AlertDialogHeader>
                            <AlertDialogFooter>
                              <AlertDialogCancel>Cancel</AlertDialogCancel>
                              <AlertDialogAction
                                onClick={handleDelete}
                                disabled={deleteLoading}
                                className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
                              >
                                {deleteLoading ? (
                                  <>
                                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                                    Deleting...
                                  </>
                                ) : (
                                  "Delete Company"
                                )}
                              </AlertDialogAction>
                            </AlertDialogFooter>
                          </AlertDialogContent>
                        </AlertDialog>
                      )}
                    </div>
                  )}
                </div>
              </CardContent>
            </Card>
          </motion.div>
        </div>

        {/* Content Tabs */}
        <Tabs defaultValue="overview" className="space-y-6">
          <TabsList className="bg-background/40 backdrop-blur-md border border-white/10">
            <TabsTrigger value="overview">Overview</TabsTrigger>
            <TabsTrigger value="jobs">Jobs ({jobsMeta?.total || 0})</TabsTrigger>
            <TabsTrigger value="team">Team ({managers.length})</TabsTrigger>
          </TabsList>

          <TabsContent value="overview">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.1 }}
            >
              <Card className="bg-background/40 backdrop-blur-md border-white/10">
                <CardHeader>
                  <CardTitle>About {company.name}</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-muted-foreground whitespace-pre-line leading-relaxed">{company.description}</p>
                  <Separator className="my-6" />
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                      <h4 className="font-medium mb-2">Company Details</h4>
                      <div className="space-y-2 text-sm">
                        <div className="flex justify-between">
                          <span className="text-muted-foreground">Founded:</span>
                          <span>{formatDate(company.createdAt)}</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-muted-foreground">Last Updated:</span>
                          <span>{formatDate(company.updatedAt)}</span>
                        </div>
                        {company.website && (
                          <div className="flex justify-between">
                            <span className="text-muted-foreground">Website:</span>
                            <a
                              href={company.website}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="text-primary hover:text-primary/80 transition-colors"
                            >
                              Visit
                            </a>
                          </div>
                        )}
                      </div>
                    </div>
                    <div>
                      <h4 className="font-medium mb-2">Quick Stats</h4>
                      <div className="space-y-2 text-sm">
                        <div className="flex justify-between">
                          <span className="text-muted-foreground">Open Positions:</span>
                          <span>{jobsMeta?.total || 0}</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-muted-foreground">Team Members:</span>
                          <span>{managers.length}</span>
                        </div>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </motion.div>
          </TabsContent>

          <TabsContent value="jobs">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.1 }}
            >
              {jobs.length === 0 ? (
                <Card className="bg-background/40 backdrop-blur-md border-white/10">
                  <CardContent className="p-12 text-center">
                    <Briefcase className="mx-auto h-12 w-12 text-muted-foreground/50 mb-4" />
                    <h3 className="text-xl font-medium mb-2">No Open Positions</h3>
                    <p className="text-muted-foreground">This company doesn't have any open positions at the moment.</p>
                  </CardContent>
                </Card>
              ) : (
                <>
                  <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6">
                    {jobs.map((job, index) => (
                      <motion.div
                        key={job.id}
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.3, delay: index * 0.1 }}
                      >
                        <a href={`/jobs/${job.id}`}>
                          <Card className="h-full bg-background/40 backdrop-blur-md border-white/10 hover:bg-background/60 transition-all duration-200 cursor-pointer">
                            <CardHeader>
                              <div className="flex items-start justify-between">
                                <div>
                                  <CardTitle className="text-lg line-clamp-1">{job.title}</CardTitle>
                                  <div className="flex items-center gap-4 mt-2 text-sm text-muted-foreground">
                                    <div className="flex items-center">
                                      <MapPin className="mr-1 h-3 w-3" />
                                      {job.location}
                                    </div>
                                  </div>
                                </div>
                              </div>
                            </CardHeader>
                            <CardContent>
                              <p className="text-sm text-muted-foreground line-clamp-3 mb-4">{job.description}</p>
                              <div className="flex items-center justify-between">
                                <div className="flex items-center text-sm text-muted-foreground">
                                  <DollarSign className="mr-1 h-3 w-3" />
                                  {job.salary}
                                </div>
                                <div className="flex items-center text-xs text-muted-foreground">
                                  <Clock className="mr-1 h-3 w-3" />
                                  {formatJobDate(job.createdAt)}
                                </div>
                              </div>
                            </CardContent>
                          </Card>
                        </a>
                      </motion.div>
                    ))}
                  </div>

                  {/* Jobs Pagination */}
                  {jobsMeta && jobsMeta.lastPage > 1 && (
                    <div className="flex justify-center mt-6">
                      <Pagination>
                        <PaginationContent>
                          <PaginationItem>
                            <PaginationPrevious
                              href="#"
                              onClick={(e) => {
                                e.preventDefault()
                                if (currentPage > 1) setCurrentPage(currentPage - 1)
                              }}
                              className={currentPage === 1 ? "pointer-events-none opacity-50" : ""}
                            />
                          </PaginationItem>
                          {generatePaginationItems()}
                          <PaginationItem>
                            <PaginationNext
                              href="#"
                              onClick={(e) => {
                                e.preventDefault()
                                if (currentPage < jobsMeta.lastPage) setCurrentPage(currentPage + 1)
                              }}
                              className={currentPage === jobsMeta.lastPage ? "pointer-events-none opacity-50" : ""}
                            />
                          </PaginationItem>
                        </PaginationContent>
                      </Pagination>
                    </div>
                  )}
                </>
              )}
            </motion.div>
          </TabsContent>

          <TabsContent value="team">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.1 }}
            >
              {managers.length === 0 ? (
                <Card className="bg-background/40 backdrop-blur-md border-white/10">
                  <CardContent className="p-12 text-center">
                    <Users className="mx-auto h-12 w-12 text-muted-foreground/50 mb-4" />
                    <h3 className="text-xl font-medium mb-2">No Team Members</h3>
                    <p className="text-muted-foreground">No team members are currently listed for this company.</p>
                  </CardContent>
                </Card>
              ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {managers.map((manager, index) => (
                    <motion.div
                      key={manager.id}
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ duration: 0.3, delay: index * 0.1 }}
                    >
                      <Card className="bg-background/40 backdrop-blur-md border-white/10">
                        <CardContent className="p-6 text-center">
                          <Avatar className="h-16 w-16 mx-auto mb-4 border-2 border-primary/50">
                            <AvatarImage
                              src={manager.user.profilePhoto || `/placeholder.svg?height=64&width=64`}
                              alt={manager.user.username}
                            />
                            <AvatarFallback>{manager.user.username.charAt(0).toUpperCase()}</AvatarFallback>
                          </Avatar>
                          <h3 className="font-medium mb-1">{manager.user.username}</h3>
                          <p className="text-sm text-muted-foreground mb-2">{manager.user.email}</p>
                          <Badge variant="secondary" className="text-xs">
                            {manager.role}
                          </Badge>
                        </CardContent>
                      </Card>
                    </motion.div>
                  ))}
                </div>
              )}
            </motion.div>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  )
}
