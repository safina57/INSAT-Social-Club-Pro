import { Job } from "@/types/job"

export const SAMPLE_JOBS: Job[] = [
  {
    id: "1",
    title: "Senior Software Engineer",
    company: "TechCorp",
    companyLogo: "",
    location: "San Francisco, CA",
    type: "Full-time",
    salary: 120000,
    description: "We are looking for a senior software engineer to join our team...",
    requirements: ["5+ years experience", "React", "Node.js"],
    benefits: ["Health insurance", "401k", "Remote work"],
    tags: ["React", "TypeScript", "Node.js"],
    remote: true,
    urgent: false,
    experienceYears: 5,
    applicants: 15,
    postedDate: "2024-05-20T10:00:00.000Z",
    createdAt: "2024-05-20T10:00:00.000Z",
    updatedAt: "2024-05-20T10:00:00.000Z",
    companyId: "1"
  },
  {
    id: "2", 
    title: "Frontend Developer",
    company: "StartupXYZ",
    companyLogo: "",
    location: "New York, NY",
    type: "Full-time",
    salary: 85000,
    description: "Join our fast-growing startup as a frontend developer...",
    requirements: ["3+ years experience", "React", "CSS"],
    benefits: ["Equity", "Flexible hours"],
    tags: ["React", "CSS", "JavaScript"],
    remote: false,
    urgent: true,
    experienceYears: 3,
    applicants: 8,
    postedDate: "2024-05-25T14:30:00.000Z",
    createdAt: "2024-05-25T14:30:00.000Z",
    updatedAt: "2024-05-25T14:30:00.000Z",
    companyId: "2"
  }
]