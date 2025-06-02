export interface Job {
  id: string
  title: string
  description: string
  location?: string
  salary?: number
  companyId: string
  createdAt: string
  updatedAt: string
  // Extended properties for the frontend (will need to be added to backend or computed)
  company?: string
  companyLogo?: string
  type?: string
  experienceYears?: number
  remote?: boolean
  urgent?: boolean
  applicants?: number
  tags?: string[]
  requirements?: string[]
  benefits?: string[]
  postedDate?: string
}

export interface Meta {
  total: number
  page: number
  lastPage: number
  limit: number
}

export interface PaginatedJobs {
  results: Job[]
  meta: Meta
}

export interface JobFilters {
  searchQuery: string
  location: string
  jobType: string
  experience: [number, number]
  remoteOnly: boolean
  page?: number
  limit?: number
}

export interface CreateJobInput {
  title: string
  description: string
  location?: string
  salary?: number
  companyId: string
}
