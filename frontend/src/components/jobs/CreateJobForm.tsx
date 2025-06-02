import React, { useState } from "react"
import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import * as z from "zod"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Switch } from "@/components/ui/switch"
import { Badge } from "@/components/ui/badge"
import { Separator } from "@/components/ui/separator"
import { Loader2, Plus, X, Building2, MapPin, DollarSign, Clock } from "lucide-react"
import { useCreateJob } from "@/services/jobService"
import { toast } from "sonner"
import { CreateJobInput } from "@/graphql/types/job"

const createJobSchema = z.object({
  title: z.string().min(1, "Job title is required").max(100, "Title must be less than 100 characters"),
  description: z.string().min(10, "Description must be at least 10 characters").max(5000, "Description must be less than 5000 characters"),
  location: z.string().optional(),
  salary: z.number().optional(),
  companyId: z.string().min(1, "Company ID is required"),
  // Extended fields for better job posting
  type: z.string().optional(),
  experienceYears: z.number().min(0).max(50).optional(),
  remote: z.boolean().optional(),
  urgent: z.boolean().optional(),
  tags: z.array(z.string()).optional(),
  requirements: z.array(z.string()).optional(),
  benefits: z.array(z.string()).optional(),
})

type CreateJobFormData = z.infer<typeof createJobSchema>

interface CreateJobFormProps {
  onSuccess?: (jobId: string) => void
  onCancel?: () => void
  defaultCompanyId?: string
}

export const CreateJobForm: React.FC<CreateJobFormProps> = ({ 
  onSuccess, 
  onCancel, 
  defaultCompanyId 
}) => {
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [newTag, setNewTag] = useState("")
  const [newRequirement, setNewRequirement] = useState("")
  const [newBenefit, setNewBenefit] = useState("")
  
  const [createJob] = useCreateJob()

  const form = useForm<CreateJobFormData>({
    resolver: zodResolver(createJobSchema),
    defaultValues: {
      title: "",
      description: "",
      location: "",
      salary: undefined,
      companyId: defaultCompanyId ?? "",
      type: "Full-time",
      experienceYears: 0,
      remote: false,
      urgent: false,
      tags: [],
      requirements: [],
      benefits: [],
    },
  })

  const watchedTags = form.watch("tags") || []
  const watchedRequirements = form.watch("requirements") || []
  const watchedBenefits = form.watch("benefits") || []

  const addTag = () => {
    if (newTag.trim() && !watchedTags.includes(newTag.trim())) {
      form.setValue("tags", [...watchedTags, newTag.trim()])
      setNewTag("")
    }
  }

  const removeTag = (tagToRemove: string) => {
    form.setValue("tags", watchedTags.filter(tag => tag !== tagToRemove))
  }

  const addRequirement = () => {
    if (newRequirement.trim() && !watchedRequirements.includes(newRequirement.trim())) {
      form.setValue("requirements", [...watchedRequirements, newRequirement.trim()])
      setNewRequirement("")
    }
  }

  const removeRequirement = (reqToRemove: string) => {
    form.setValue("requirements", watchedRequirements.filter(req => req !== reqToRemove))
  }

  const addBenefit = () => {
    if (newBenefit.trim() && !watchedBenefits.includes(newBenefit.trim())) {
      form.setValue("benefits", [...watchedBenefits, newBenefit.trim()])
      setNewBenefit("")
    }
  }

  const removeBenefit = (benefitToRemove: string) => {
    form.setValue("benefits", watchedBenefits.filter(benefit => benefit !== benefitToRemove))
  }

  const onSubmit = async (data: CreateJobFormData) => {
    setIsSubmitting(true)
    try {
      // Prepare the data for the backend (only send fields that backend expects)
      const jobInput: CreateJobInput = {
        title: data.title,
        description: data.description,
        location: data.location,
        salary: data.salary,
        companyId: data.companyId,
      }

      const result = await createJob({
        variables: {
          createJobInput: jobInput
        }
      })

      if (result.data?.createJob) {
        toast.success("Job posted successfully!", {
          description: `${data.title} has been posted and is now live.`
        })
        
        form.reset()
        onSuccess?.(result.data.createJob.id)
      }
    } catch (error: any) {
      console.error('Error creating job:', error)
      toast.error("Failed to create job posting", {
        description: error.message ?? "Please check your inputs and try again."
      })
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <Card className="w-full max-w-4xl mx-auto">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Building2 className="h-5 w-5" />
          Create New Job Posting
        </CardTitle>
      </CardHeader>
      <CardContent>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
            {/* Basic Information */}
            <div className="space-y-4">
              <h3 className="text-lg font-semibold">Basic Information</h3>
              
              <FormField
                control={form.control}
                name="title"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Job Title *</FormLabel>
                    <FormControl>
                      <Input 
                        placeholder="e.g. Senior Software Engineer" 
                        {...field} 
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="description"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Job Description *</FormLabel>
                    <FormControl>
                      <Textarea 
                        placeholder="Describe the role, responsibilities, and what you're looking for in a candidate..."
                        className="min-h-32"
                        {...field}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <FormField
                  control={form.control}
                  name="location"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="flex items-center gap-1">
                        <MapPin className="h-4 w-4" />
                        Location
                      </FormLabel>
                      <FormControl>
                        <Input 
                          placeholder="e.g. San Francisco, CA" 
                          {...field} 
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="salary"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="flex items-center gap-1">
                        <DollarSign className="h-4 w-4" />
                        Annual Salary (USD)
                      </FormLabel>
                      <FormControl>
                        <Input 
                          type="number"
                          placeholder="e.g. 120000"
                          {...field}
                          onChange={(e) => field.onChange(e.target.value ? Number(e.target.value) : undefined)}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>

              <FormField
                control={form.control}
                name="companyId"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Company ID *</FormLabel>
                    <FormControl>
                      <Input 
                        placeholder="Your company identifier" 
                        {...field} 
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

            <Separator />

            {/* Job Details */}
            <div className="space-y-4">
              <h3 className="text-lg font-semibold">Job Details</h3>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <FormField
                  control={form.control}
                  name="type"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Job Type</FormLabel>
                      <Select onValueChange={field.onChange} defaultValue={field.value}>
                        <FormControl>
                          <SelectTrigger>
                            <SelectValue placeholder="Select job type" />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          <SelectItem value="Full-time">Full-time</SelectItem>
                          <SelectItem value="Part-time">Part-time</SelectItem>
                          <SelectItem value="Contract">Contract</SelectItem>
                          <SelectItem value="Freelance">Freelance</SelectItem>
                          <SelectItem value="Internship">Internship</SelectItem>
                        </SelectContent>
                      </Select>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="experienceYears"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="flex items-center gap-1">
                        <Clock className="h-4 w-4" />
                        Years of Experience Required
                      </FormLabel>
                      <FormControl>
                        <Input 
                          type="number"
                          min="0"
                          max="50"
                          placeholder="e.g. 3"
                          {...field}
                          onChange={(e) => field.onChange(e.target.value ? Number(e.target.value) : 0)}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>

              <div className="flex items-center space-x-6">
                <FormField
                  control={form.control}
                  name="remote"
                  render={({ field }) => (
                    <FormItem className="flex flex-row items-center space-x-2 space-y-0">
                      <FormControl>
                        <Switch
                          checked={field.value}
                          onCheckedChange={field.onChange}
                        />
                      </FormControl>
                      <FormLabel className="text-sm font-normal">
                        Remote Work Available
                      </FormLabel>
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="urgent"
                  render={({ field }) => (
                    <FormItem className="flex flex-row items-center space-x-2 space-y-0">
                      <FormControl>
                        <Switch
                          checked={field.value}
                          onCheckedChange={field.onChange}
                        />
                      </FormControl>
                      <FormLabel className="text-sm font-normal">
                        Urgent Hiring
                      </FormLabel>
                    </FormItem>
                  )}
                />
              </div>
            </div>

            <Separator />

            {/* Skills & Tags */}
            <div className="space-y-4">
              <h3 className="text-lg font-semibold">Skills & Technologies</h3>
              <div className="space-y-2">
                <div className="flex gap-2">
                  <Input
                    placeholder="Add a skill or technology (e.g. React, Python)"
                    value={newTag}
                    onChange={(e) => setNewTag(e.target.value)}
                    onKeyDown={(e) => {
                      if (e.key === 'Enter') {
                        e.preventDefault()
                        addTag()
                      }
                    }}
                  />
                  <Button type="button" onClick={addTag} variant="outline" size="icon">
                    <Plus className="h-4 w-4" />
                  </Button>
                </div>
                {watchedTags.length > 0 && (
                  <div className="flex flex-wrap gap-2">
                    {watchedTags.map((tag) => (
                      <Badge key={tag} variant="secondary" className="pr-1">
                        {tag}
                        <button
                          type="button"
                          onClick={() => removeTag(tag)}
                          className="ml-1 hover:bg-destructive/20 rounded-full p-0.5"
                        >
                          <X className="h-3 w-3" />
                        </button>
                      </Badge>
                    ))}
                  </div>
                )}
              </div>
            </div>

            <Separator />

            {/* Requirements */}
            <div className="space-y-4">
              <h3 className="text-lg font-semibold">Requirements</h3>
              <div className="space-y-2">
                <div className="flex gap-2">
                  <Input
                    placeholder="Add a requirement (e.g. Bachelor's degree in Computer Science)"
                    value={newRequirement}
                    onChange={(e) => setNewRequirement(e.target.value)}
                    onKeyDown={(e) => {
                      if (e.key === 'Enter') {
                        e.preventDefault()
                        addRequirement()
                      }
                    }}
                  />
                  <Button type="button" onClick={addRequirement} variant="outline" size="icon">
                    <Plus className="h-4 w-4" />
                  </Button>
                </div>
                {watchedRequirements.length > 0 && (
                  <div className="space-y-1">                    {watchedRequirements.map((req) => (
                      <div key={req} className="flex items-start gap-2 text-sm">
                        <span className="text-muted-foreground">•</span>
                        <span className="flex-1">{req}</span>
                        <button
                          type="button"
                          onClick={() => removeRequirement(req)}
                          className="text-destructive hover:bg-destructive/20 rounded p-1"
                        >
                          <X className="h-3 w-3" />
                        </button>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </div>

            <Separator />

            {/* Benefits */}
            <div className="space-y-4">
              <h3 className="text-lg font-semibold">Benefits & Perks</h3>
              <div className="space-y-2">
                <div className="flex gap-2">
                  <Input
                    placeholder="Add a benefit (e.g. Health insurance, Flexible working hours)"
                    value={newBenefit}
                    onChange={(e) => setNewBenefit(e.target.value)}
                    onKeyDown={(e) => {
                      if (e.key === 'Enter') {
                        e.preventDefault()
                        addBenefit()
                      }
                    }}
                  />
                  <Button type="button" onClick={addBenefit} variant="outline" size="icon">
                    <Plus className="h-4 w-4" />
                  </Button>
                </div>
                {watchedBenefits.length > 0 && (
                  <div className="space-y-1">                    {watchedBenefits.map((benefit) => (
                      <div key={benefit} className="flex items-start gap-2 text-sm">
                        <span className="text-muted-foreground">•</span>
                        <span className="flex-1">{benefit}</span>
                        <button
                          type="button"
                          onClick={() => removeBenefit(benefit)}
                          className="text-destructive hover:bg-destructive/20 rounded p-1"
                        >
                          <X className="h-3 w-3" />
                        </button>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </div>

            <Separator />

            {/* Action Buttons */}
            <div className="flex gap-4 pt-4">
              <Button
                type="submit"
                disabled={isSubmitting}
                className="flex-1"
              >
                {isSubmitting ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Posting Job...
                  </>
                ) : (
                  <>
                    <Building2 className="mr-2 h-4 w-4" />
                    Post Job
                  </>
                )}
              </Button>
              
              {onCancel && (
                <Button
                  type="button"
                  variant="outline"
                  onClick={onCancel}
                  disabled={isSubmitting}
                >
                  Cancel
                </Button>
              )}
            </div>
          </form>
        </Form>
      </CardContent>
    </Card>
  )
}
