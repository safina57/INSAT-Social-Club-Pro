export interface Job {
  id: string
  title: string
  description: string
  location?: string
  salary?: number
  companyId: string
  createdAt: string
  updatedAt: string
  // Extended properties for the frontend
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

export interface JobFilters {
  searchQuery: string
  location: string
  jobType: string
  experience: [number, number]
  remoteOnly: boolean
  page?: number
  limit?: number
}
