"use client"

import React, { useState, useEffect } from "react"
import Aurora from "@/components/ui/Aurora"
import { Header } from "@/components/common/header"
import { Job, JobFilters } from "@/types/job"
import { useJobs, jobService } from "@/services/jobService"
import { SAMPLE_JOBS } from "@/data/sampleJobs"
import { JobSearch } from "@/components/jobs/JobSearch"
import { JobFiltersComponent } from "@/components/jobs/JobFiltersComponent"
import { JobList } from "@/components/jobs/JobList"
import { JobDetails } from "@/components/jobs/JobDetails"

export default function JobsPage() {
  const [selectedJob, setSelectedJob] = useState<Job | null>(null)
  const [activeTab, setActiveTab] = useState("all")
  const [filters, setFilters] = useState<JobFilters>({
    searchQuery: "",
    location: "",
    jobType: "",
    experience: [0, 10],
    remoteOnly: false,
    page: 1,
    limit: 10,
  })  // Fetch jobs from backend
  const { data, loading, error, refetch } = useJobs({
    page: filters.page,
    limit: filters.limit,
  })

  // Debug logging
  console.log('Jobs Query - Loading:', loading)
  console.log('Jobs Query - Error:', error)
  console.log('Jobs Query - Data:', data)
  console.log('Jobs Query - Raw Response:', data?.jobs)
  // Set initial selected job when data loads
  useEffect(() => {
    if (data?.jobs?.results?.length && !selectedJob) {
      setSelectedJob(data.jobs.results[0])
    }
  }, [data, selectedJob])

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault()
    // Refetch with current filters
    refetch()
  }

  const handleJobClick = (job: Job) => {
    setSelectedJob(job)
  }
  const resetFilters = () => {
    setFilters({
      searchQuery: "",
      location: "",
      jobType: "",
      experience: [0, 10],
      remoteOnly: false,
      page: 1,
      limit: 10,
    })
  }

  const updateSearchQuery = (query: string) => {
    setFilters(prev => ({ ...prev, searchQuery: query }))
  }  // Get jobs from API response and transform them, or use sample data as fallback
  const allJobs = data?.jobs?.results 
    ? data.jobs.results.map(jobService.transformJob) 
    : (error && error.message.includes('Unauthorized')) 
      ? SAMPLE_JOBS 
      : []
  
  // Apply client-side filtering
  const baseFilteredJobs = jobService.filterJobs(allJobs, filters)
  
  // Apply tab filtering
  const filteredJobs = activeTab === "all" ? baseFilteredJobs : baseFilteredJobs.filter(job => {
    switch (activeTab) {
      case "remote":
        return job.remote
      case "recent": {
        const recentDate = new Date()
        recentDate.setDate(recentDate.getDate() - 7)
        return new Date(job.postedDate || job.createdAt) >= recentDate
      }
      case "urgent":
        return job.urgent
      default:
        return true
    }
  })

  // Handle loading and error states
  if (loading) {
    return (
      <div className="relative min-h-screen w-full overflow-hidden">
        <div className="absolute inset-0 -z-10">
          <Aurora
            colorStops={[
              "#003B49", // Aqua blue
              "#003B49", // Dark green
            ]}
            blend={0.2}
            amplitude={1.2}
            speed={0.5}
          />
        </div>
        <Header />
        <div className="container mx-auto px-4 py-8 content-z-index">
          <div className="flex items-center justify-center h-64">
            <div className="text-lg">Loading jobs...</div>
          </div>
        </div>
      </div>
    )
  }

  if (error) {
    return (
      <div className="relative min-h-screen w-full overflow-hidden">
        <div className="absolute inset-0 -z-10">
          <Aurora
            colorStops={[
              "#003B49", // Aqua blue
              "#003B49", // Dark green
            ]}
            blend={0.2}
            amplitude={1.2}
            speed={0.5}
          />
        </div>
        <Header />
        <div className="container mx-auto px-4 py-8 content-z-index">
          <div className="flex items-center justify-center h-64">
            <div className="text-lg text-red-500">Error loading jobs: {error.message}</div>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="relative min-h-screen w-full overflow-hidden">
      {/* Aurora Background */}
      <div className="absolute inset-0 -z-10">
        <Aurora
          colorStops={[
            "#003B49", // Aqua blue
            "#003B49", // Dark green
          ]}
          blend={0.2}
          amplitude={1.2}
          speed={0.5}
        />
      </div>
      <Header />
      <div className="container mx-auto px-4 py-8 content-z-index">
        <div className="flex flex-col lg:flex-row gap-6">
          {/* Left Column - Filters */}
          <div className="w-full lg:w-[300px]">
            <JobFiltersComponent
              filters={filters}
              onFiltersChange={setFilters}
              onReset={resetFilters}
            />
          </div>

          {/* Middle Column - Job Listings */}
          <div className="flex-1">
            <JobSearch
              searchQuery={filters.searchQuery}
              onSearchChange={updateSearchQuery}
              onSearchSubmit={handleSearch}
            />

            <JobList
              jobs={filteredJobs}
              selectedJob={selectedJob}
              onJobSelect={handleJobClick}
              activeTab={activeTab}
              onTabChange={setActiveTab}
            />
          </div>

          {/* Right Column - Job Details */}
          {selectedJob && (
            <div className="w-full lg:w-[400px]">
              <JobDetails job={selectedJob} />
            </div>
          )}
        </div>
      </div>    </div>
  )
}
