"use client"

import type React from "react"

import Aurora from "@/components/ui/Aurora"
import { useState } from "react"
import { Header } from "@/components/common/header"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Slider } from "@/components/ui/slider"
import { Switch } from "@/components/ui/switch"
import { Label } from "@/components/ui/label"
import { Separator } from "@/components/ui/separator"
import { Badge } from "@/components/ui/badge"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { ScrollArea } from "@/components/ui/scroll-area"
import {
  Search,
  Filter,
  MapPin,
  Clock,
  DollarSign,
  Users,
  Bookmark,
  Share2,
  ExternalLink,
  Calendar,
  Briefcase,
} from "lucide-react"
import { cn } from "@/lib/utils"

interface Job {
  id: string
  title: string
  company: string
  companyLogo: string
  location: string
  type: string
  salary: string
  description: string
  requirements: string[]
  benefits: string[]
  postedDate: string
  experienceYears: number
  remote: boolean
  urgent: boolean
  applicants: number
  tags: string[]
}

export default function JobsPage() {
  const [searchQuery, setSearchQuery] = useState("")
  const [selectedJob, setSelectedJob] = useState<Job | null>(SAMPLE_JOBS[0])
  const [filterLocation, setFilterLocation] = useState<string>("")
  const [filterJobType, setFilterJobType] = useState<string>("")
  const [filterExperience, setFilterExperience] = useState<[number, number]>([0, 10])
  const [filterRemote, setFilterRemote] = useState<boolean>(false)
  const [activeTab, setActiveTab] = useState("all")

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault()
    console.log("Searching for:", searchQuery)
  }

  const handleJobClick = (job: Job) => {
    setSelectedJob(job)
  }

  const resetFilters = () => {
    setFilterLocation("")
    setFilterJobType("")
    setFilterExperience([0, 10])
    setFilterRemote(false)
    setSearchQuery("")
  }

  // Filter jobs based on search and filters
  const filteredJobs = SAMPLE_JOBS.filter((job) => {
    const matchesSearch =
      searchQuery === "" ||
      job.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      job.company.toLowerCase().includes(searchQuery.toLowerCase()) ||
      job.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
      job.tags.some((tag) => tag.toLowerCase().includes(searchQuery.toLowerCase()))

    const matchesLocation = filterLocation === "" || job.location.toLowerCase().includes(filterLocation.toLowerCase())

    const matchesJobType = filterJobType === "" || job.type === filterJobType

    const matchesExperience = job.experienceYears >= filterExperience[0] && job.experienceYears <= filterExperience[1]

    const matchesRemote = !filterRemote || job.remote

    return matchesSearch && matchesLocation && matchesJobType && matchesExperience && matchesRemote
  })

  const formatPostedDate = (dateString: string) => {
    const date = new Date(dateString)
    const now = new Date()
    const diffInDays = Math.floor((now.getTime() - date.getTime()) / (1000 * 60 * 60 * 24))

    if (diffInDays === 0) return "Today"
    if (diffInDays === 1) return "Yesterday"
    if (diffInDays < 7) return `${diffInDays} days ago`
    if (diffInDays < 30) return `${Math.floor(diffInDays / 7)} weeks ago`
    return `${Math.floor(diffInDays / 30)} months ago`
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
          <div className="w-full lg:w-[300px] space-y-6">
            <Card className="bg-background/40 backdrop-blur-md border-white/10">
              <CardHeader>
                <CardTitle className="flex items-center">
                  <Filter className="mr-2 h-5 w-5" />
                  Filters
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="space-y-2">
                  <Label htmlFor="location">Location</Label>
                  <Select value={filterLocation} onValueChange={setFilterLocation}>
                    <SelectTrigger id="location" className="bg-secondary/50">
                      <SelectValue placeholder="Any Location" />
                    </SelectTrigger>
                    <SelectContent className="bg-background/95 backdrop-blur-md border-white/10">
                      <SelectItem value="any">Any Location</SelectItem>
                      <SelectItem value="San Francisco">San Francisco, CA</SelectItem>
                      <SelectItem value="New York">New York, NY</SelectItem>
                      <SelectItem value="Seattle">Seattle, WA</SelectItem>
                      <SelectItem value="Austin">Austin, TX</SelectItem>
                      <SelectItem value="Remote">Remote</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="job-type">Job Type</Label>
                  <Select value={filterJobType} onValueChange={setFilterJobType}>
                    <SelectTrigger id="job-type" className="bg-secondary/50">
                      <SelectValue placeholder="Any Type" />
                    </SelectTrigger>
                    <SelectContent className="bg-background/95 backdrop-blur-md border-white/10">
                      <SelectItem value="any">Any Type</SelectItem>
                      <SelectItem value="Full-time">Full-time</SelectItem>
                      <SelectItem value="Part-time">Part-time</SelectItem>
                      <SelectItem value="Contract">Contract</SelectItem>
                      <SelectItem value="Internship">Internship</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <Label>Experience Level</Label>
                    <span className="text-sm text-muted-foreground">
                      {filterExperience[0]}-{filterExperience[1]} years
                    </span>
                  </div>
                  <Slider
                    defaultValue={[0, 10]}
                    min={0}
                    max={10}
                    step={1}
                    value={filterExperience}
                    onValueChange={(value) => setFilterExperience(value as [number, number])}
                    className="py-4"
                  />
                </div>

                <div className="flex items-center space-x-2">
                  <Switch id="remote" checked={filterRemote} onCheckedChange={setFilterRemote} />
                  <Label htmlFor="remote">Remote Only</Label>
                </div>

                <Separator />

                <Button className="w-full" variant="outline" onClick={resetFilters}>
                  Reset Filters
                </Button>
              </CardContent>
            </Card>

            <Card className="bg-background/40 backdrop-blur-md border-white/10">
              <CardHeader>
                <CardTitle>Job Alerts</CardTitle>
                <CardDescription>Get notified about new jobs</CardDescription>
              </CardHeader>
              <CardContent>
                <form className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="alert-keywords">Keywords</Label>
                    <Input id="alert-keywords" placeholder="e.g., UX Designer, React" className="bg-secondary/50" />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="alert-location">Location</Label>
                    <Input id="alert-location" placeholder="e.g., San Francisco, Remote" className="bg-secondary/50" />
                  </div>
                  <Button className="w-full">Create Alert</Button>
                </form>
              </CardContent>
            </Card>
          </div>

          {/* Middle Column - Job Listings */}
          <div className="flex-1">
            <Card className="mb-6 bg-background/40 backdrop-blur-md border-white/10">
              <CardContent className="p-4">
                <form onSubmit={handleSearch} className="flex gap-2">
                  <div className="relative flex-1">
                    <Search className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                    <Input
                      placeholder="Search jobs, skills, or companies"
                      className="pl-10 bg-secondary/50"
                      value={searchQuery}
                      onChange={(e) => setSearchQuery(e.target.value)}
                    />
                  </div>
                  <Button type="submit">Search</Button>
                </form>
              </CardContent>
            </Card>

            <Tabs defaultValue="all" value={activeTab} onValueChange={setActiveTab}>
              <TabsList className="mb-6">
                <TabsTrigger value="all">All Jobs ({filteredJobs.length})</TabsTrigger>
                <TabsTrigger value="recent">Recent</TabsTrigger>
                <TabsTrigger value="saved">Saved</TabsTrigger>
                <TabsTrigger value="applied">Applied</TabsTrigger>
              </TabsList>

              <TabsContent value="all">
                <ScrollArea className="h-[calc(100vh-300px)]">
                  <div className="space-y-4 pr-4">
                    {filteredJobs.map((job) => (
                      <Card
                        key={job.id}
                        className={cn(
                          "cursor-pointer transition-all duration-200 bg-background/40 backdrop-blur-md border-white/10 hover:bg-background/60",
                          selectedJob?.id === job.id && "ring-2 ring-primary/50 bg-background/60",
                        )}
                        onClick={() => handleJobClick(job)}
                      >
                        <CardContent className="p-6">
                          <div className="flex items-start justify-between">
                            <div className="flex items-start space-x-4">
                              <Avatar className="h-12 w-12 border border-white/10">
                                <AvatarImage src={job.companyLogo || "/placeholder.svg"} alt={job.company} />
                                <AvatarFallback>{job.company.charAt(0)}</AvatarFallback>
                              </Avatar>
                              <div className="flex-1">
                                <div className="flex items-center gap-2 mb-1">
                                  <h3 className="font-semibold text-lg">{job.title}</h3>
                                  {job.urgent && (
                                    <Badge variant="destructive" className="text-xs">
                                      Urgent
                                    </Badge>
                                  )}
                                </div>
                                <p className="text-muted-foreground font-medium">{job.company}</p>
                                <div className="flex items-center gap-4 mt-2 text-sm text-muted-foreground">
                                  <div className="flex items-center">
                                    <MapPin className="mr-1 h-4 w-4" />
                                    {job.location}
                                  </div>
                                  <div className="flex items-center">
                                    <Briefcase className="mr-1 h-4 w-4" />
                                    {job.type}
                                  </div>
                                  <div className="flex items-center">
                                    <DollarSign className="mr-1 h-4 w-4" />
                                    {job.salary}
                                  </div>
                                </div>
                                <div className="flex flex-wrap gap-1 mt-3">
                                  {job.tags.slice(0, 3).map((tag, index) => (
                                    <Badge key={index} variant="secondary" className="text-xs">
                                      {tag}
                                    </Badge>
                                  ))}
                                  {job.tags.length > 3 && (
                                    <Badge variant="outline" className="text-xs">
                                      +{job.tags.length - 3} more
                                    </Badge>
                                  )}
                                </div>
                              </div>
                            </div>
                            <div className="flex flex-col items-end space-y-2">
                              <div className="flex items-center text-sm text-muted-foreground">
                                <Clock className="mr-1 h-4 w-4" />
                                {formatPostedDate(job.postedDate)}
                              </div>
                              <div className="flex items-center text-sm text-muted-foreground">
                                <Users className="mr-1 h-4 w-4" />
                                {job.applicants} applicants
                              </div>
                              <Button variant="ghost" size="icon" className="h-8 w-8">
                                <Bookmark className="h-4 w-4" />
                              </Button>
                            </div>
                          </div>
                        </CardContent>
                      </Card>
                    ))}
                  </div>
                </ScrollArea>
              </TabsContent>

              <TabsContent value="recent">
                <div className="text-center py-12 text-muted-foreground">
                  <Briefcase className="mx-auto h-12 w-12 mb-4 opacity-50" />
                  <p>No recent job views</p>
                </div>
              </TabsContent>

              <TabsContent value="saved">
                <div className="text-center py-12 text-muted-foreground">
                  <Bookmark className="mx-auto h-12 w-12 mb-4 opacity-50" />
                  <p>No saved jobs yet</p>
                </div>
              </TabsContent>

              <TabsContent value="applied">
                <div className="text-center py-12 text-muted-foreground">
                  <Calendar className="mx-auto h-12 w-12 mb-4 opacity-50" />
                  <p>No job applications yet</p>
                </div>
              </TabsContent>
            </Tabs>
          </div>

          {/* Right Column - Job Details */}
          {selectedJob && (
            <div className="w-full lg:w-[400px]">
              <Card className="bg-background/40 backdrop-blur-md border-white/10 sticky top-8">
                <CardHeader>
                  <div className="flex items-start justify-between">
                    <div className="flex items-start space-x-3">
                      <Avatar className="h-12 w-12 border border-white/10">
                        <AvatarImage src={selectedJob.companyLogo || "/placeholder.svg"} alt={selectedJob.company} />
                        <AvatarFallback>{selectedJob.company.charAt(0)}</AvatarFallback>
                      </Avatar>
                      <div>
                        <h2 className="text-xl font-bold">{selectedJob.title}</h2>
                        <p className="text-muted-foreground">{selectedJob.company}</p>
                      </div>
                    </div>
                    <Button variant="ghost" size="icon" className="h-8 w-8">
                      <Share2 className="h-4 w-4" />
                    </Button>
                  </div>
                  <div className="flex items-center gap-4 text-sm text-muted-foreground">
                    <div className="flex items-center">
                      <MapPin className="mr-1 h-4 w-4" />
                      {selectedJob.location}
                    </div>
                    <div className="flex items-center">
                      <Clock className="mr-1 h-4 w-4" />
                      {formatPostedDate(selectedJob.postedDate)}
                    </div>
                  </div>
                </CardHeader>
                <CardContent className="space-y-6">
                  <div className="flex gap-2">
                    <Button className="flex-1">Apply Now</Button>
                    <Button variant="outline" size="icon">
                      <Bookmark className="h-4 w-4" />
                    </Button>
                  </div>

                  <div>
                    <h3 className="font-semibold mb-2">Job Details</h3>
                    <div className="space-y-2 text-sm">
                      <div className="flex justify-between">
                        <span className="text-muted-foreground">Type:</span>
                        <span>{selectedJob.type}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-muted-foreground">Salary:</span>
                        <span>{selectedJob.salary}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-muted-foreground">Experience:</span>
                        <span>{selectedJob.experienceYears}+ years</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-muted-foreground">Remote:</span>
                        <span>{selectedJob.remote ? "Yes" : "No"}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-muted-foreground">Applicants:</span>
                        <span>{selectedJob.applicants}</span>
                      </div>
                    </div>
                  </div>

                  <Separator />

                  <div>
                    <h3 className="font-semibold mb-2">Description</h3>
                    <p className="text-sm text-muted-foreground whitespace-pre-line">{selectedJob.description}</p>
                  </div>

                  <div>
                    <h3 className="font-semibold mb-2">Requirements</h3>
                    <ul className="text-sm text-muted-foreground space-y-1">
                      {selectedJob.requirements.map((req, index) => (
                        <li key={index} className="flex items-start">
                          <span className="mr-2">•</span>
                          <span>{req}</span>
                        </li>
                      ))}
                    </ul>
                  </div>

                  <div>
                    <h3 className="font-semibold mb-2">Benefits</h3>
                    <ul className="text-sm text-muted-foreground space-y-1">
                      {selectedJob.benefits.map((benefit, index) => (
                        <li key={index} className="flex items-start">
                          <span className="mr-2">•</span>
                          <span>{benefit}</span>
                        </li>
                      ))}
                    </ul>
                  </div>

                  <div>
                    <h3 className="font-semibold mb-2">Skills</h3>
                    <div className="flex flex-wrap gap-1">
                      {selectedJob.tags.map((tag, index) => (
                        <Badge key={index} variant="secondary" className="text-xs">
                          {tag}
                        </Badge>
                      ))}
                    </div>
                  </div>

                  <Button className="w-full" variant="outline">
                    <ExternalLink className="mr-2 h-4 w-4" />
                    View Company Profile
                  </Button>
                </CardContent>
              </Card>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}

// Sample job data
const SAMPLE_JOBS: Job[] = [
  {
    id: "job-1",
    title: "Senior UX Designer",
    company: "TechCorp",
    companyLogo: "/placeholder.svg?height=48&width=48",
    location: "San Francisco, CA",
    type: "Full-time",
    salary: "$120k - $160k",
    description: `We're looking for a Senior UX Designer to join our growing design team. You'll be responsible for creating intuitive and engaging user experiences for our flagship products.

Key Responsibilities:
- Lead design projects from concept to implementation
- Collaborate with product managers and engineers
- Conduct user research and usability testing
- Maintain and evolve our design system`,
    requirements: [
      "5+ years of UX design experience",
      "Proficiency in Figma and design tools",
      "Strong portfolio demonstrating design process",
      "Experience with user research methodologies",
      "Bachelor's degree in Design or related field",
    ],
    benefits: [
      "Competitive salary and equity",
      "Health, dental, and vision insurance",
      "Flexible work arrangements",
      "Professional development budget",
      "Unlimited PTO",
    ],
    postedDate: "2024-01-15",
    experienceYears: 5,
    remote: true,
    urgent: false,
    applicants: 47,
    tags: ["UX Design", "Figma", "User Research", "Design Systems", "Prototyping"],
  },
  {
    id: "job-2",
    title: "Frontend Developer",
    company: "StartupXYZ",
    companyLogo: "/placeholder.svg?height=48&width=48",
    location: "Remote",
    type: "Full-time",
    salary: "$90k - $130k",
    description: `Join our fast-growing startup as a Frontend Developer. You'll work on cutting-edge web applications using modern technologies.

What you'll do:
- Build responsive web applications with React
- Collaborate with designers to implement pixel-perfect UIs
- Optimize applications for performance and scalability
- Write clean, maintainable code with proper testing`,
    requirements: [
      "3+ years of React development experience",
      "Strong JavaScript and TypeScript skills",
      "Experience with modern CSS frameworks",
      "Knowledge of testing frameworks",
      "Familiarity with Git and CI/CD",
    ],
    benefits: [
      "Stock options in a growing company",
      "Remote-first culture",
      "Learning and development stipend",
      "Top-tier equipment",
      "Flexible working hours",
    ],
    postedDate: "2024-01-14",
    experienceYears: 3,
    remote: true,
    urgent: true,
    applicants: 23,
    tags: ["React", "TypeScript", "JavaScript", "CSS", "Testing"],
  },
  {
    id: "job-3",
    title: "Product Manager",
    company: "InnovateLab",
    companyLogo: "/placeholder.svg?height=48&width=48",
    location: "New York, NY",
    type: "Full-time",
    salary: "$140k - $180k",
    description: `We're seeking an experienced Product Manager to drive product strategy and execution for our B2B platform.

Your role:
- Define product roadmap and strategy
- Work closely with engineering and design teams
- Analyze user feedback and market trends
- Drive product launches and feature releases`,
    requirements: [
      "4+ years of product management experience",
      "Experience with B2B SaaS products",
      "Strong analytical and communication skills",
      "MBA or equivalent experience preferred",
      "Knowledge of agile development methodologies",
    ],
    benefits: [
      "Competitive compensation package",
      "Comprehensive health benefits",
      "401(k) with company matching",
      "Professional growth opportunities",
      "Collaborative work environment",
    ],
    postedDate: "2024-01-13",
    experienceYears: 4,
    remote: false,
    urgent: false,
    applicants: 31,
    tags: ["Product Management", "B2B", "SaaS", "Strategy", "Analytics"],
  },
  {
    id: "job-4",
    title: "DevOps Engineer",
    company: "CloudTech",
    companyLogo: "/placeholder.svg?height=48&width=48",
    location: "Seattle, WA",
    type: "Full-time",
    salary: "$110k - $150k",
    description: `Looking for a DevOps Engineer to help scale our cloud infrastructure and improve deployment processes.

Responsibilities:
- Manage AWS cloud infrastructure
- Implement CI/CD pipelines
- Monitor system performance and reliability
- Automate deployment and scaling processes`,
    requirements: [
      "3+ years of DevOps experience",
      "Strong knowledge of AWS services",
      "Experience with Docker and Kubernetes",
      "Proficiency in scripting languages",
      "Understanding of monitoring and logging tools",
    ],
    benefits: [
      "Competitive salary and bonuses",
      "Comprehensive insurance coverage",
      "Remote work flexibility",
      "Conference and training budget",
      "Modern office with great amenities",
    ],
    postedDate: "2024-01-12",
    experienceYears: 3,
    remote: true,
    urgent: false,
    applicants: 19,
    tags: ["DevOps", "AWS", "Docker", "Kubernetes", "CI/CD"],
  },
  {
    id: "job-5",
    title: "Data Scientist",
    company: "DataDriven Inc",
    companyLogo: "/placeholder.svg?height=48&width=48",
    location: "Austin, TX",
    type: "Full-time",
    salary: "$100k - $140k",
    description: `Join our data science team to build machine learning models and derive insights from large datasets.

What you'll work on:
- Develop predictive models and algorithms
- Analyze complex datasets to identify trends
- Collaborate with product teams on data-driven features
- Present findings to stakeholders`,
    requirements: [
      "Master's degree in Data Science or related field",
      "3+ years of machine learning experience",
      "Proficiency in Python and SQL",
      "Experience with ML frameworks (TensorFlow, PyTorch)",
      "Strong statistical analysis skills",
    ],
    benefits: [
      "Competitive salary and equity",
      "Health and wellness programs",
      "Flexible PTO policy",
      "Research and conference budget",
      "Collaborative team environment",
    ],
    postedDate: "2024-01-11",
    experienceYears: 3,
    remote: true,
    urgent: false,
    applicants: 42,
    tags: ["Data Science", "Machine Learning", "Python", "SQL", "Statistics"],
  },
  {
    id: "job-6",
    title: "Marketing Manager",
    company: "GrowthCo",
    companyLogo: "/placeholder.svg?height=48&width=48",
    location: "Remote",
    type: "Full-time",
    salary: "$80k - $110k",
    description: `We're looking for a creative Marketing Manager to lead our digital marketing efforts and drive user acquisition.

Key responsibilities:
- Develop and execute marketing campaigns
- Manage social media and content strategy
- Analyze campaign performance and ROI
- Collaborate with sales and product teams`,
    requirements: [
      "3+ years of digital marketing experience",
      "Experience with marketing automation tools",
      "Strong analytical and creative skills",
      "Knowledge of SEO and SEM best practices",
      "Bachelor's degree in Marketing or related field",
    ],
    benefits: [
      "Competitive salary and performance bonuses",
      "Remote work with flexible hours",
      "Professional development opportunities",
      "Health and dental insurance",
      "Company retreats and team events",
    ],
    postedDate: "2024-01-10",
    experienceYears: 3,
    remote: true,
    urgent: false,
    applicants: 28,
    tags: ["Digital Marketing", "SEO", "SEM", "Analytics", "Content Strategy"],
  },
]
