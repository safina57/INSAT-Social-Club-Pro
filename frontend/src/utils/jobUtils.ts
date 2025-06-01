import { Job } from "@/types/job"

export const formatPostedDate = (dateString: string): string => {
  const date = new Date(dateString)
  const now = new Date()
  const diffInDays = Math.floor((now.getTime() - date.getTime()) / (1000 * 60 * 60 * 24))

  if (diffInDays === 0) return "Today"
  if (diffInDays === 1) return "Yesterday"
  if (diffInDays < 7) return `${diffInDays} days ago`
  if (diffInDays < 30) return `${Math.floor(diffInDays / 7)} weeks ago`
  return `${Math.floor(diffInDays / 30)} months ago`
}

export const filterJobs = (
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
      job.location && job.location.toLowerCase().includes(filters.location.toLowerCase())

    const matchesJobType = 
      filters.jobType === "" || 
      filters.jobType === "any" ||
      job.type === filters.jobType

    const matchesExperience = 
      typeof job.experienceYears === "number" &&
      job.experienceYears >= filters.experience[0] && 
      job.experienceYears <= filters.experience[1]

    const matchesRemote = !filters.remoteOnly || job.remote

    return matchesSearch && matchesLocation && matchesJobType && matchesExperience && matchesRemote
  })
}
