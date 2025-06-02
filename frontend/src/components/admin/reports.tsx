"use client"

import { useState, useEffect } from "react"
import { Header } from "../common/header"
import { AdminSidebar } from "./admin-sidebar"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "../ui/table"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "../ui/select"
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
} from "../ui/alert-dialog"
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from "../ui/dialog"
import { Button } from "../ui/button"
import { Badge } from "../ui/badge"
import { Input } from "../ui/input"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "../ui/card"
import {
  Trash2,
  Eye,
  Filter,
  Search,
  Calendar,
  Mail,
  User,
  MessageSquare,
  Tag,
  Clock,
  AlertCircle,
  CheckCircle2,
  Loader2,
} from "lucide-react"

enum Category {
  General_Inquiry = "General_Inquiry",
  Technical_Support = "Technical_Support",
  Feedback = "Feedback",
  Bug_Report = "Bug_Report",
  Feature_Request = "Feature_Request",
}

enum Status {
  Pending = "Pending",
  Being_Treated = "Being_Treated",
  Treated = "Treated",
}

interface ContactReport {
  id: string
  fullName: string
  email: string
  subject: string
  category: Category
  message: string
  status: Status
  createdAt: string
}


export default function AdminReports() {
  const [reports, setReports] = useState<ContactReport[]>([])
  const [filteredReports, setFilteredReports] = useState<ContactReport[]>([])
  const [searchTerm, setSearchTerm] = useState("")
  const [statusFilter, setStatusFilter] = useState<string>("all")
  const [categoryFilter, setCategoryFilter] = useState<string>("all")
  const [selectedReport, setSelectedReport] = useState<ContactReport | null>(null)
  const [isLoading, setIsLoading] = useState(false)
  const [stats, setStats] = useState({
    total: 0,
    pending: 0,
    beingTreated: 0,
    treated: 0,
  });
  const [page, setPage] = useState(1);
  const limit = 5;
  const [lastPage, setLastPage] = useState(1);

  const fetchReports = async () => {
    setIsLoading(true);
    try {
      const params = new URLSearchParams({
        page: String(page),
        limit: String(limit),
        status: statusFilter,
        category: categoryFilter,
        searchTerm,
      });
      const res = await fetch(
        `${import.meta.env.VITE_BACKEND_URL}/contact-reports?${params.toString()}`,
        {
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${localStorage.getItem('access_token') || ''}`,
          },
        }
      );
      if (!res.ok) throw new Error('Failed to fetch reports');
      const json = await res.json();
      setReports(json.results);
      setLastPage(json.meta.lastPage);
    } catch (err) {
      console.error(err);
    } finally {
      setIsLoading(false);
    }
  };

  // Fetch stats
  const fetchStats = async () => {
    try {
      const res = await fetch(
        `${import.meta.env.VITE_BACKEND_URL}/contact-reports/stats`,
        {
          headers: { Authorization: `Bearer ${localStorage.getItem('access_token') || ''}` },
        }
      );
      if (!res.ok) throw new Error('Failed to fetch stats');
      const s = await res.json();
      setStats(s);
    } catch (err) {
      console.error(err);
    }
  };
  useEffect(() => {
    fetchReports();
  }, [page, statusFilter, categoryFilter, searchTerm]);

  useEffect(() => {
    fetchStats();
  }, []);

  const handleStatusChange = async (reportId: string, newStatus: Status) => {
    setIsLoading(true)
    try {
      const backendUrl = import.meta.env.VITE_BACKEND_URL
      const accessToken = localStorage.getItem('access_token') || ''
      const res = await fetch(`${backendUrl}/contact-reports/${reportId}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${accessToken}`,
        },
        body: JSON.stringify({ status: newStatus }),
      })
      if (!res.ok) throw new Error('Status update failed')
      await fetchReports()
    } catch (error) {
      console.error(error)
    } finally {
      setIsLoading(false)
    }
  }

  const handleDeleteReport = async (reportId: string) => {
    setIsLoading(true)
    try {
      const backendUrl = import.meta.env.VITE_BACKEND_URL
      const accessToken = localStorage.getItem('access_token') || ''
      const res = await fetch(`${backendUrl}/contact-reports/${reportId}`, {
        method: 'DELETE',
        headers: {
          Authorization: `Bearer ${accessToken}`,
        },
      })
      if (!res.ok) throw new Error('Delete failed')
      await fetchReports()
    } catch (error) {
      console.error(error)
    } finally {
      setIsLoading(false)
    }
  }

  const getStatusBadge = (status: Status) => {
    switch (status) {
      case Status.Pending:
        return (
          <Badge variant="secondary" className="bg-yellow-100 text-yellow-800 hover:bg-yellow-200">
            <Clock className="w-3 h-3 mr-1" />
            Pending
          </Badge>
        )
      case Status.Being_Treated:
        return (
          <Badge variant="secondary" className="bg-blue-100 text-blue-800 hover:bg-blue-200">
            <AlertCircle className="w-3 h-3 mr-1" />
            Being Treated
          </Badge>
        )
      case Status.Treated:
        return (
          <Badge variant="secondary" className="bg-green-100 text-green-800 hover:bg-green-200">
            <CheckCircle2 className="w-3 h-3 mr-1" />
            Treated
          </Badge>
        )
    }
  }

  const getCategoryBadge = (category: Category) => {
    const categoryColors = {
      [Category.General_Inquiry]: "bg-gray-100 text-gray-800",
      [Category.Technical_Support]: "bg-red-100 text-red-800",
      [Category.Feedback]: "bg-purple-100 text-purple-800",
      [Category.Bug_Report]: "bg-orange-100 text-orange-800",
      [Category.Feature_Request]: "bg-indigo-100 text-indigo-800",
    }

    return (
      <Badge variant="outline" className={categoryColors[category]}>
        {category.replace("_", " ")}
      </Badge>
    )
  }

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    })
  }

  const getStatusCounts = () => {
    return {
      total: reports.length,
      pending: reports.filter((r) => r.status === Status.Pending).length,
      beingTreated: reports.filter((r) => r.status === Status.Being_Treated).length,
      treated: reports.filter((r) => r.status === Status.Treated).length,
    }
  }

  const statusCounts = getStatusCounts()

  return (
    <div className="min-h-screen w-full bg-background">
      <Header />
      <div className="flex">
        <AdminSidebar />
        <main className="flex-1 p-6 overflow-auto">
          <div className="space-y-6">
            {/* Header */}
            <div className="flex items-center justify-between">
              <div>
                <h1 className="text-3xl font-bold tracking-tight">Reports Management</h1>
                <p className="text-muted-foreground">Manage and respond to user reports and inquiries</p>
              </div>
            </div>

            {/* Stats Cards */}
            <div className="grid gap-4 md:grid-cols-4">
              <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">Total Reports</CardTitle>
                  <MessageSquare className="h-4 w-4 text-muted-foreground" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">{stats.total}</div>
                </CardContent>
              </Card>
              <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">Pending</CardTitle>
                  <Clock className="h-4 w-4 text-yellow-600" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold text-yellow-600">{stats.pending}</div>
                </CardContent>
              </Card>
              <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">Being Treated</CardTitle>
                  <AlertCircle className="h-4 w-4 text-blue-600" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold text-blue-600">{stats.beingTreated}</div>
                </CardContent>
              </Card>
              <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">Treated</CardTitle>
                  <CheckCircle2 className="h-4 w-4 text-green-600" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold text-green-600">{stats.treated}</div>
                </CardContent>
              </Card>
            </div>

            {/* Filters */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Filter className="h-5 w-5" />
                  Filters
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="flex flex-col sm:flex-row gap-4">
                  <div className="flex-1">
                    <div className="relative">
                      <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4" />
                      <Input
                        placeholder="Search reports..."
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                        className="pl-10"
                      />
                    </div>
                  </div>
                  <Select value={statusFilter} onValueChange={setStatusFilter}>
                    <SelectTrigger className="w-full sm:w-[180px]">
                      <SelectValue placeholder="Filter by status" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">All Statuses</SelectItem>
                      <SelectItem value={Status.Pending}>Pending</SelectItem>
                      <SelectItem value={Status.Being_Treated}>Being Treated</SelectItem>
                      <SelectItem value={Status.Treated}>Treated</SelectItem>
                    </SelectContent>
                  </Select>
                  <Select value={categoryFilter} onValueChange={setCategoryFilter}>
                    <SelectTrigger className="w-full sm:w-[180px]">
                      <SelectValue placeholder="Filter by category" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">All Categories</SelectItem>
                      <SelectItem value={Category.General_Inquiry}>General Inquiry</SelectItem>
                      <SelectItem value={Category.Technical_Support}>Technical Support</SelectItem>
                      <SelectItem value={Category.Feedback}>Feedback</SelectItem>
                      <SelectItem value={Category.Bug_Report}>Bug Report</SelectItem>
                      <SelectItem value={Category.Feature_Request}>Feature Request</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </CardContent>
            </Card>

            {/* Reports Table */}
            <Card>
              <CardHeader>
                <CardTitle>Reports (Page {page} of {lastPage})</CardTitle>
                <CardDescription>Manage user reports and inquiries</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="rounded-md border">
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead>Reporter</TableHead>
                        <TableHead>Subject</TableHead>
                        <TableHead>Category</TableHead>
                        <TableHead>Status</TableHead>
                        <TableHead>Date</TableHead>
                        <TableHead className="text-right">Actions</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {reports.length === 0 ? (
                        <TableRow>
                          <TableCell colSpan={6} className="text-center py-8 text-muted-foreground">
                            No reports found matching your criteria
                          </TableCell>
                        </TableRow>
                      ) : (
                        reports.map((report) => (
                          <TableRow key={report.id}>
                            <TableCell>
                              <div className="flex flex-col">
                                <span className="font-medium">{report.fullName}</span>
                                <span className="text-sm text-muted-foreground">{report.email}</span>
                              </div>
                            </TableCell>
                            <TableCell>
                              <div className="max-w-[200px] truncate" title={report.subject}>
                                {report.subject}
                              </div>
                            </TableCell>
                            <TableCell>{getCategoryBadge(report.category)}</TableCell>
                            <TableCell>{getStatusBadge(report.status)}</TableCell>
                            <TableCell>
                              <div className="flex items-center gap-1 text-sm text-muted-foreground">
                                <Calendar className="h-3 w-3" />
                                {formatDate(report.createdAt)}
                              </div>
                            </TableCell>
                            <TableCell className="text-right">
                              <div className="flex items-center justify-end gap-2">
                                {/* View Details */}
                                <Dialog>
                                  <DialogTrigger asChild>
                                    <Button variant="ghost" size="icon" onClick={() => setSelectedReport(report)}>
                                      <Eye className="h-4 w-4" />
                                    </Button>
                                  </DialogTrigger>
                                  <DialogContent className="max-w-2xl">
                                    <DialogHeader>
                                      <DialogTitle>Report Details</DialogTitle>
                                      <DialogDescription>View and manage this report</DialogDescription>
                                    </DialogHeader>
                                    {selectedReport && (
                                      <div className="space-y-4">
                                        <div className="grid grid-cols-2 gap-4">
                                          <div>
                                            <label className="text-sm font-medium text-muted-foreground">
                                              Reporter
                                            </label>
                                            <div className="flex items-center gap-2 mt-1">
                                              <User className="h-4 w-4 text-muted-foreground" />
                                              <span>{selectedReport.fullName}</span>
                                            </div>
                                          </div>
                                          <div>
                                            <label className="text-sm font-medium text-muted-foreground">Email</label>
                                            <div className="flex items-center gap-2 mt-1">
                                              <Mail className="h-4 w-4 text-muted-foreground" />
                                              <span>{selectedReport.email}</span>
                                            </div>
                                          </div>
                                          <div>
                                            <label className="text-sm font-medium text-muted-foreground">
                                              Category
                                            </label>
                                            <div className="flex items-center gap-2 mt-1">
                                              <Tag className="h-4 w-4 text-muted-foreground" />
                                              {getCategoryBadge(selectedReport.category)}
                                            </div>
                                          </div>
                                          <div>
                                            <label className="text-sm font-medium text-muted-foreground">Status</label>
                                            <div className="mt-1">
                                              <Select
                                                value={selectedReport.status}
                                                onValueChange={(value) =>
                                                  handleStatusChange(selectedReport.id, value as Status)
                                                }
                                                disabled={isLoading}
                                              >
                                                <SelectTrigger className="w-full">
                                                  <SelectValue />
                                                </SelectTrigger>
                                                <SelectContent>
                                                  <SelectItem value={Status.Pending}>Pending</SelectItem>
                                                  <SelectItem value={Status.Being_Treated}>Being Treated</SelectItem>
                                                  <SelectItem value={Status.Treated}>Treated</SelectItem>
                                                </SelectContent>
                                              </Select>
                                            </div>
                                          </div>
                                        </div>
                                        <div>
                                          <label className="text-sm font-medium text-muted-foreground">Subject</label>
                                          <p className="mt-1 font-medium">{selectedReport.subject}</p>
                                        </div>
                                        <div>
                                          <label className="text-sm font-medium text-muted-foreground">Message</label>
                                          <div className="mt-1 p-3 bg-muted rounded-md">
                                            <p className="whitespace-pre-wrap">{selectedReport.message}</p>
                                          </div>
                                        </div>
                                        <div>
                                          <label className="text-sm font-medium text-muted-foreground">Submitted</label>
                                          <p className="mt-1 text-sm">{formatDate(selectedReport.createdAt)}</p>
                                        </div>
                                      </div>
                                    )}
                                  </DialogContent>
                                </Dialog>

                                {/* Status Change */}
                                <Select
                                  value={report.status}
                                  onValueChange={(value) => handleStatusChange(report.id, value as Status)}
                                  disabled={isLoading}
                                >
                                  <SelectTrigger className="w-[130px] h-8">
                                    <SelectValue />
                                  </SelectTrigger>
                                  <SelectContent>
                                    <SelectItem value={Status.Pending}>Pending</SelectItem>
                                    <SelectItem value={Status.Being_Treated}>Being Treated</SelectItem>
                                    <SelectItem value={Status.Treated}>Treated</SelectItem>
                                  </SelectContent>
                                </Select>

                                {/* Delete */}
                                <AlertDialog>
                                  <AlertDialogTrigger asChild>
                                    <Button
                                      variant="ghost"
                                      size="icon"
                                      className="text-destructive hover:text-destructive"
                                    >
                                      <Trash2 className="h-4 w-4" />
                                    </Button>
                                  </AlertDialogTrigger>
                                  <AlertDialogContent>
                                    <AlertDialogHeader>
                                      <AlertDialogTitle>Delete Report</AlertDialogTitle>
                                      <AlertDialogDescription>
                                        Are you sure you want to delete this report? This action cannot be undone.
                                      </AlertDialogDescription>
                                    </AlertDialogHeader>
                                    <AlertDialogFooter>
                                      <AlertDialogCancel>Cancel</AlertDialogCancel>
                                      <AlertDialogAction
                                        onClick={() => handleDeleteReport(report.id)}
                                        className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
                                        disabled={isLoading}
                                      >
                                        {isLoading ? (
                                          <>
                                            <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                                            Deleting...
                                          </>
                                        ) : (
                                          "Delete"
                                        )}
                                      </AlertDialogAction>
                                    </AlertDialogFooter>
                                  </AlertDialogContent>
                                </AlertDialog>
                              </div>
                            </TableCell>
                          </TableRow>
                        ))
                      )}
                    </TableBody>
                  </Table>
                  <div className="flex items-center justify-between p-4">
                    <Button
                      variant="outline"
                      onClick={() => setPage(page - 1)}
                      disabled={page <= 1}
                    >
                      Previous
                    </Button>

                    <span className="text-sm text-muted-foreground">
                      Page {page} of {lastPage}
                    </span>

                    <Button
                      variant="outline"
                      onClick={() => setPage(page + 1)}
                      disabled={page >= lastPage}
                    >
                      Next
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </main>
      </div>
    </div>
  )
}
