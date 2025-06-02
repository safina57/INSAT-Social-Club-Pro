// GraphQL types for job applications
export interface User {
  id: string
  firstName: string
  lastName: string
  email: string
  phone?: string
  avatar?: string
}

export interface JobApplication {
  id: string
  userId: string
  jobId: string
  createdAt: string
  status: ApplicationStatus
  decidedAt?: string
  appliedAt?: string
  coverLetter?: string
  resume?: string
  user?: User
}

export enum ApplicationStatus {
  PENDING = 'PENDING',
  ACCEPTED = 'ACCEPTED',
  REJECTED = 'REJECTED'
}

export interface ApplyJobInput {
  jobId: string
}

export interface UpdateApplicationInput {
  status: string
}
