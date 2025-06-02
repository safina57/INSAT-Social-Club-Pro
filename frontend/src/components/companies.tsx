"use client"

import type React from "react"

import { useState } from "react"
import { useQuery } from "@apollo/client"
import { Header } from "@/components/common/header"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Separator } from "@/components/ui/separator"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import {
  Pagination,
  PaginationContent,
  PaginationEllipsis,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
} from "@/components/ui/pagination"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Search, Building2, ExternalLink, Users, Briefcase, Plus, Calendar, Loader2 } from "lucide-react"
import { GET_COMPANIES } from "@/graphql/queries/company"
import { motion } from "framer-motion"

interface Company {
  id: string
  name: string
  description: string
  website?: string
  createdAt: string
  updatedAt: string
  _count?: {
    jobs: number
    managers: number
  }
}

interface CompaniesData {
  Companies: {
    results: Company[]
    meta: {
      total: number
      page: number
      lastPage: number
      limit: number
    }
  }
}


export default function CompaniesPage() {
  const [currentPage, setCurrentPage] = useState(1)
  const [pageSize, setPageSize] = useState(12)
  const [searchQuery, setSearchQuery] = useState("")
  const [userToken, setUserToken] = useState<string | null>(null)

  // Get user token from localStorage
  useState(() => {
    const token = localStorage.getItem("userToken")
    setUserToken(token)
  })

    const { data, loading, error } = useQuery<CompaniesData>(GET_COMPANIES, {
    variables: {
        paginationDto: {
        page: currentPage,
        limit: pageSize,
        },
    },
    fetchPolicy: "cache-and-network",
    })

    const companies = data?.Companies.results || []
    const totalPages = data?.Companies.meta.lastPage || 0
    const totalCount = data?.Companies.meta.total || 0

  // Filter companies based on search query (client-side filtering)
  const filteredCompanies = companies.filter(
    (company) =>
      company.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      company.description.toLowerCase().includes(searchQuery.toLowerCase()),
  )

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault()
    // In a real app, you might want to implement server-side search
    console.log("Searching for:", searchQuery)
  }

  const truncateDescription = (description: string, maxLength = 150) => {
    if (description.length <= maxLength) return description
    return description.substring(0, maxLength) + "..."
  }

  const formatDate = (dateString: string) => {
    const date = new Date(dateString)
    return date.toLocaleDateString("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
    })
  }

  const generatePaginationItems = () => {
    const items = []
    const maxVisiblePages = 5

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

  if (error) {
    return (
      <div className="min-h-screen w-full aurora-gradient">
        <Header />
        <div className="container mx-auto px-4 py-16 text-center">
          <h1 className="text-3xl font-bold mb-4">Error Loading Companies</h1>
          <p className="text-muted-foreground">There was an error loading the companies. Please try again.</p>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen w-full aurora-gradient">
      <Header />
      <div className="container mx-auto px-4 py-8 content-z-index">
        <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between mb-8">
          <div>
            <h1 className="text-3xl font-bold tracking-tight mb-2">Companies</h1>
            <p className="text-muted-foreground">Discover companies and explore career opportunities</p>
          </div>
          {userToken && (
            <a href="/companies/new">
              <Button className="mt-4 lg:mt-0">
                <Plus className="mr-2 h-4 w-4" />
                Create Company
              </Button>
            </a>
          )}
        </div>

        {/* Search and Filters */}
        <Card className="mb-8 bg-background/40 backdrop-blur-md border-white/10">
          <CardContent className="p-6">
            <div className="flex flex-col md:flex-row gap-4">
              <form onSubmit={handleSearch} className="flex-1">
                <div className="relative">
                  <Search className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                  <Input
                    placeholder="Search companies..."
                    className="pl-10 bg-secondary/50"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                  />
                </div>
              </form>
              <div className="flex gap-2">
                <Select value={pageSize.toString()} onValueChange={(value) => setPageSize(Number.parseInt(value))}>
                  <SelectTrigger className="w-[120px] bg-secondary/50">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent className="bg-background/95 backdrop-blur-md border-white/10">
                    <SelectItem value="6">6 per page</SelectItem>
                    <SelectItem value="12">12 per page</SelectItem>
                    <SelectItem value="24">24 per page</SelectItem>
                    <SelectItem value="48">48 per page</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
            <div className="mt-4 flex items-center justify-between text-sm text-muted-foreground">
              <span>
                Showing {filteredCompanies.length} of {totalCount} companies
              </span>
              <span>
                Page {currentPage} of {totalPages}
              </span>
            </div>
          </CardContent>
        </Card>

        {/* Companies Grid */}
        {loading ? (
          <div className="flex items-center justify-center py-16">
            <Loader2 className="h-8 w-8 animate-spin text-primary" />
          </div>
        ) : filteredCompanies.length === 0 ? (
          <div className="text-center py-16">
            <Building2 className="mx-auto h-12 w-12 text-muted-foreground/50 mb-4" />
            <h3 className="text-xl font-medium mb-2">No companies found</h3>
            <p className="text-muted-foreground max-w-md mx-auto">
              {searchQuery
                ? `No companies match your search for "${searchQuery}"`
                : "No companies have been added yet. Be the first to create one!"}
            </p>
            {userToken && !searchQuery && (
              <a href="/companies/new">
                <Button className="mt-4">
                  <Plus className="mr-2 h-4 w-4" />
                  Create First Company
                </Button>
              </a>
            )}
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 mb-8">
            {filteredCompanies.map((company, index) => (
              <motion.div
                key={company.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.3, delay: index * 0.1 }}
              >
                <a href={`/companies/${company.id}`}>
                  <Card className="h-full bg-background/40 backdrop-blur-md border-white/10 hover:bg-background/60 transition-all duration-200 cursor-pointer group">
                    <CardHeader className="pb-3">
                      <div className="flex items-start justify-between">
                        <Avatar className="h-12 w-12 border border-white/10">
                          <AvatarImage src={`/placeholder.svg?height=48&width=48`} alt={company.name} />
                          <AvatarFallback>
                            <Building2 className="h-6 w-6" />
                          </AvatarFallback>
                        </Avatar>
                        {company.website && (
                          <Button
                            variant="ghost"
                            size="icon"
                            className="h-8 w-8 opacity-0 group-hover:opacity-100 transition-opacity"
                            onClick={(e) => {
                              e.preventDefault()
                              window.open(company.website, "_blank")
                            }}
                          >
                            <ExternalLink className="h-4 w-4" />
                          </Button>
                        )}
                      </div>
                      <div>
                        <CardTitle className="text-lg line-clamp-1">{company.name}</CardTitle>
                        <div className="flex items-center gap-4 mt-2">
                          <div className="flex items-center text-xs text-muted-foreground">
                            <Briefcase className="mr-1 h-3 w-3" />
                            {company._count?.jobs ?? 0} jobs
                          </div>
                          <div className="flex items-center text-xs text-muted-foreground">
                            <Users className="mr-1 h-3 w-3" />
                            {company._count?.managers} managers
                          </div>
                        </div>
                      </div>
                    </CardHeader>
                    <CardContent className="pt-0">
                      <CardDescription className="line-clamp-3 mb-4">
                        {truncateDescription(company.description)}
                      </CardDescription>
                      <Separator className="mb-3" />
                      <div className="flex items-center justify-between">
                        <div className="flex items-center text-xs text-muted-foreground">
                          <Calendar className="mr-1 h-3 w-3" />
                          {formatDate(company.createdAt)}
                        </div>
                        {company.website && (
                          <Badge variant="outline" className="text-xs">
                            Website
                          </Badge>
                        )}
                      </div>
                    </CardContent>
                  </Card>
                </a>
              </motion.div>
            ))}
          </div>
        )}

        {/* Pagination */}
        {totalPages > 1 && (
          <div className="flex justify-center">
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
                      if (currentPage < totalPages) setCurrentPage(currentPage + 1)
                    }}
                    className={currentPage === totalPages ? "pointer-events-none opacity-50" : ""}
                  />
                </PaginationItem>
              </PaginationContent>
            </Pagination>
          </div>
        )}
      </div>
    </div>
  )
}
