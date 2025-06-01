import { useQuery, useMutation } from '@apollo/client'
import { GET_JOBS, GET_JOB, GET_JOBS_BY_COMPANY, CREATE_JOB } from '@/graphql/queries/job'
import { Job as GraphQLJob, PaginatedJobs as GraphQLPaginatedJobs, CreateJobInput } from '@/graphql/types/job'
import { Job } from '@/types/job'

interface PaginationDto {
  page?: number
  limit?: number
}

export const useJobs = (paginationDto?: PaginationDto) => {
  return useQuery<{ jobs: GraphQLPaginatedJobs }>(GET_JOBS, {
    variables: { paginationDto },
    errorPolicy: 'all',
  })
}

export const useJob = (id: string) => {
  return useQuery<{ job: GraphQLJob }>(GET_JOB, {
    variables: { id },
    errorPolicy: 'all',
  })
}

export const useJobsByCompany = (companyId: string, paginationDto?: PaginationDto) => {
  return useQuery<{ jobsByCompany: GraphQLPaginatedJobs }>(GET_JOBS_BY_COMPANY, {
    variables: { companyId, paginationDto },
    errorPolicy: 'all',
  })
}

export const useCreateJob = () => {
  return useMutation<{ createJob: GraphQLJob }, { createJobInput: CreateJobInput }>(CREATE_JOB)
}

// Job service utility functions
export const jobService = {  // Transform backend job data to frontend format
  transformJob: (backendJob: GraphQLJob): Job => {
    return {
      id: backendJob.id,
      title: backendJob.title,
      description: backendJob.description,
      location: backendJob.location,
      salary: backendJob.salary,
      companyId: backendJob.companyId,
      createdAt: backendJob.createdAt,
      updatedAt: backendJob.updatedAt,
      // Add default values for properties that might not exist in backend
      company: backendJob.company || `Company ${backendJob.companyId.slice(-4)}`, // Use last 4 chars of companyId as fallback
      companyLogo: backendJob.companyLogo || '',
      type: backendJob.type || 'Full-time',
      experienceYears: backendJob.experienceYears || 0,
      remote: backendJob.remote || false,
      urgent: backendJob.urgent || false,
      applicants: backendJob.applicants || 0,
      tags: backendJob.tags || [],
      requirements: backendJob.requirements || [],
      benefits: backendJob.benefits || [],
      postedDate: backendJob.postedDate || backendJob.createdAt,
    }
  },
  // Transform pagination response
  transformPaginatedJobs: (response: GraphQLPaginatedJobs) => {
    return {
      ...response,
      results: response.results.map(jobService.transformJob),
    }
  },

  // Client-side filtering (can be moved to backend later)
  filterJobs: (
    jobs: Job[],
    filters: {
      searchQuery: string
      location: string
      jobType: string
      experience: [number, number]
      remoteOnly: boolean
    }
  ): Job[] => {
    return jobs.filter((job) => {
      const matchesSearch =
        filters.searchQuery === "" ||
        job.title.toLowerCase().includes(filters.searchQuery.toLowerCase()) ||
        (job.company && job.company.toLowerCase().includes(filters.searchQuery.toLowerCase())) ||
        job.description.toLowerCase().includes(filters.searchQuery.toLowerCase()) ||
        (job.tags && job.tags.some((tag) => tag.toLowerCase().includes(filters.searchQuery.toLowerCase())))

      const matchesLocation = 
        filters.location === "" || 
        filters.location === "any" ||
        (job.location && job.location.toLowerCase().includes(filters.location.toLowerCase()))

      const matchesJobType = 
        filters.jobType === "" || 
        filters.jobType === "any" ||
        job.type === filters.jobType

      const matchesExperience = 
        !job.experienceYears ||
        (job.experienceYears >= filters.experience[0] && 
         job.experienceYears <= filters.experience[1])

      const matchesRemote = !filters.remoteOnly || job.remote

      return matchesSearch && matchesLocation && matchesJobType && matchesExperience && matchesRemote
    })
  }
}
