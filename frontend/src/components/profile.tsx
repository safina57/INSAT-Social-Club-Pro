"use client"

import { useState } from "react"
import { Header } from "@/components/common/header"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Button } from "@/components/ui/button"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Badge } from "@/components/ui/badge"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Separator } from "@/components/ui/separator"
import { ScrollArea } from "@/components/ui/scroll-area"
import {
  UserPlus,
  Mail,
  MessageSquare,
  MoreHorizontal,
  MapPin,
  Briefcase,
  ThumbsUp,
  MessageCircle,
  Share2,
  Edit,
  Plus,
} from "lucide-react"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"

export default function ProfilePage({ params }: { params: { username: string } }) {
  const [activeTab, setActiveTab] = useState("posts")
  const username = params.username
  const user = getUserData(username)

  if (!user) {
    return (
      <div className="min-h-screen w-full aurora-gradient">
        <Header />
        <div className="container mx-auto px-4 py-16 text-center">
          <h1 className="text-3xl font-bold mb-4">User not found</h1>
          <p className="text-muted-foreground">The profile you're looking for doesn't exist or has been removed.</p>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen w-full aurora-gradient">
      <Header />
      <div className="container mx-auto px-4 py-8 content-z-index">
        {/* Profile Header */}
        <div className="relative mb-8">
          <div className="h-48 md:h-64 rounded-xl bg-gradient-to-r from-primary/20 to-secondary/20 overflow-hidden">
            {user.coverImage && (
              <img src={user.coverImage || "/placeholder.svg"} alt="Cover" className="w-full h-full object-cover" />
            )}
          </div>
          <div className="absolute -bottom-16 left-8 flex items-end">
            <Avatar className="h-32 w-32 border-4 border-background">
              <AvatarImage src={user.avatar || "/placeholder.svg"} alt={user.name} />
              <AvatarFallback>{user.name.charAt(0)}</AvatarFallback>
            </Avatar>
          </div>
          <div className="flex justify-end mt-4 md:absolute md:bottom-4 md:right-8 space-x-2">
            <Button variant="outline" size="sm" className="h-9">
              <MessageSquare className="mr-2 h-4 w-4" />
              Message
            </Button>
            <Button variant="outline" size="sm" className="h-9">
              <Mail className="mr-2 h-4 w-4" />
              Email
            </Button>
            <Button size="sm" className="h-9">
              <UserPlus className="mr-2 h-4 w-4" />
              Connect
            </Button>
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="outline" size="icon" className="h-9 w-9">
                  <MoreHorizontal className="h-4 w-4" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end" className="bg-background/95 backdrop-blur-md border-white/10">
                <DropdownMenuItem>Share Profile</DropdownMenuItem>
                <DropdownMenuItem>Report User</DropdownMenuItem>
                <DropdownMenuItem>Block User</DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        </div>

        {/* Profile Info */}
        <div className="mt-20 md:mt-0 mb-8">
          <div className="flex flex-col md:flex-row md:items-end md:justify-between">
            <div>
              <h1 className="text-3xl font-bold">{user.name}</h1>
              <p className="text-xl text-muted-foreground">{user.headline}</p>
              <div className="flex items-center mt-2 text-sm text-muted-foreground">
                <MapPin className="mr-1 h-4 w-4" />
                <span>{user.location}</span>
                <span className="mx-2">•</span>
                <Briefcase className="mr-1 h-4 w-4" />
                <span>{user.company}</span>
              </div>
            </div>
            <div className="mt-4 md:mt-0 flex items-center space-x-4">
              <div className="text-center">
                <p className="text-2xl font-bold">{user.connections}</p>
                <p className="text-xs text-muted-foreground">Connections</p>
              </div>
              <Separator orientation="vertical" className="h-10" />
              <div className="text-center">
                <p className="text-2xl font-bold">{user.posts}</p>
                <p className="text-xs text-muted-foreground">Posts</p>
              </div>
              <Separator orientation="vertical" className="h-10" />
              <div className="text-center">
                <p className="text-2xl font-bold">{user.views}</p>
                <p className="text-xs text-muted-foreground">Profile Views</p>
              </div>
            </div>
          </div>
        </div>

        {/* Profile Tabs */}
        <Tabs defaultValue="posts" value={activeTab} onValueChange={setActiveTab} className="mb-8">
          <TabsList className="grid grid-cols-5 md:w-[600px]">
            <TabsTrigger value="posts">Posts</TabsTrigger>
            <TabsTrigger value="about">About</TabsTrigger>
            <TabsTrigger value="experience">Experience</TabsTrigger>
            <TabsTrigger value="education">Education</TabsTrigger>
            <TabsTrigger value="skills">Skills</TabsTrigger>
          </TabsList>

          <div className="mt-8">
            <TabsContent value="posts" className="space-y-6">
              {user.recentPosts.map((post, index) => (
                <Card key={index}>
                  <CardContent className="p-6">
                    <div className="flex items-center justify-between mb-4">
                      <div className="flex items-center">
                        <Avatar className="h-10 w-10 mr-3">
                          <AvatarImage src={user.avatar || "/placeholder.svg"} alt={user.name} />
                          <AvatarFallback>{user.name.charAt(0)}</AvatarFallback>
                        </Avatar>
                        <div>
                          <p className="font-medium">{user.name}</p>
                          <p className="text-xs text-muted-foreground">{post.date}</p>
                        </div>
                      </div>
                      <Button variant="ghost" size="icon" className="h-8 w-8">
                        <MoreHorizontal className="h-4 w-4" />
                      </Button>
                    </div>
                    <p className="mb-4">{post.content}</p>
                    {post.image && (
                      <div className="mb-4 rounded-lg overflow-hidden">
                        <img src={post.image || "/placeholder.svg"} alt="Post" className="w-full" />
                      </div>
                    )}
                    <div className="flex items-center justify-between">
                      <div className="flex space-x-4">
                        <Button variant="ghost" size="sm" className="h-8 px-2">
                          <ThumbsUp className="mr-1 h-4 w-4" />
                          <span>{post.likes}</span>
                        </Button>
                        <Button variant="ghost" size="sm" className="h-8 px-2">
                          <MessageCircle className="mr-1 h-4 w-4" />
                          <span>{post.comments}</span>
                        </Button>
                      </div>
                      <Button variant="ghost" size="sm" className="h-8 px-2">
                        <Share2 className="mr-1 h-4 w-4" />
                        <span>Share</span>
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </TabsContent>

            <TabsContent value="about">
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center justify-between">
                    About
                    <Button variant="ghost" size="sm" className="h-8">
                      <Edit className="mr-1 h-4 w-4" />
                      Edit
                    </Button>
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="whitespace-pre-line">{user.about}</p>
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="experience" className="space-y-6">
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center justify-between">
                    Experience
                    <Button variant="ghost" size="sm" className="h-8">
                      <Plus className="mr-1 h-4 w-4" />
                      Add
                    </Button>
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-6">
                    {user.experience.map((exp, index) => (
                      <div key={index} className="flex">
                        <div className="mr-4 mt-1">
                          <Avatar className="h-12 w-12">
                            <AvatarImage src={exp.companyLogo || "/placeholder.svg"} alt={exp.company} />
                            <AvatarFallback>{exp.company.charAt(0)}</AvatarFallback>
                          </Avatar>
                        </div>
                        <div>
                          <h3 className="font-medium">{exp.title}</h3>
                          <p className="text-sm">{exp.company}</p>
                          <p className="text-sm text-muted-foreground">{exp.duration}</p>
                          <p className="text-sm text-muted-foreground">{exp.location}</p>
                          <p className="mt-2">{exp.description}</p>
                          {index < user.experience.length - 1 && <Separator className="my-4" />}
                        </div>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="education" className="space-y-6">
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center justify-between">
                    Education
                    <Button variant="ghost" size="sm" className="h-8">
                      <Plus className="mr-1 h-4 w-4" />
                      Add
                    </Button>
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-6">
                    {user.education.map((edu, index) => (
                      <div key={index} className="flex">
                        <div className="mr-4 mt-1">
                          <Avatar className="h-12 w-12">
                            <AvatarImage src={edu.schoolLogo || "/placeholder.svg"} alt={edu.school} />
                            <AvatarFallback>{edu.school.charAt(0)}</AvatarFallback>
                          </Avatar>
                        </div>
                        <div>
                          <h3 className="font-medium">{edu.school}</h3>
                          <p className="text-sm">{edu.degree}</p>
                          <p className="text-sm text-muted-foreground">{edu.duration}</p>
                          <p className="mt-2">{edu.description}</p>
                          {index < user.education.length - 1 && <Separator className="my-4" />}
                        </div>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="skills" className="space-y-6">
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center justify-between">
                    Skills & Endorsements
                    <Button variant="ghost" size="sm" className="h-8">
                      <Plus className="mr-1 h-4 w-4" />
                      Add
                    </Button>
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {user.skills.map((skill, index) => (
                      <div key={index}>
                        <div className="flex items-center justify-between">
                          <h3 className="font-medium">{skill.name}</h3>
                          <Badge variant="outline">{skill.endorsements} endorsements</Badge>
                        </div>
                        <div className="mt-1 flex flex-wrap gap-2">
                          {skill.endorsedBy.map((person, i) => (
                            <Avatar key={i} className="h-6 w-6 border border-white/10">
                              <AvatarImage src={person.avatar || "/placeholder.svg"} alt={person.name} />
                              <AvatarFallback>{person.name.charAt(0)}</AvatarFallback>
                            </Avatar>
                          ))}
                        </div>
                        {index < user.skills.length - 1 && <Separator className="my-4" />}
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </TabsContent>
          </div>
        </Tabs>

        {/* Recommendations and Connections */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <Card className="md:col-span-2">
            <CardHeader>
              <CardTitle>Recommendations</CardTitle>
              <CardDescription>Professional recommendations and testimonials</CardDescription>
            </CardHeader>
            <CardContent>
              <ScrollArea className="h-[300px]">
                <div className="space-y-6">
                  {user.recommendations.map((rec, index) => (
                    <div key={index} className="pb-4 border-b border-border last:border-0">
                      <div className="flex items-start space-x-4">
                        <Avatar>
                          <AvatarImage src={rec.author.avatar || "/placeholder.svg"} alt={rec.author.name} />
                          <AvatarFallback>{rec.author.name.charAt(0)}</AvatarFallback>
                        </Avatar>
                        <div>
                          <h4 className="font-medium">{rec.author.name}</h4>
                          <p className="text-sm text-muted-foreground">{rec.author.title}</p>
                          <p className="mt-2">{rec.content}</p>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </ScrollArea>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Connections</CardTitle>
              <CardDescription>People in your professional network</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-3 gap-2">
                {user.topConnections.map((connection, index) => (
                  <div key={index} className="flex flex-col items-center text-center">
                    <Avatar className="h-14 w-14 mb-2">
                      <AvatarImage src={connection.avatar || "/placeholder.svg"} alt={connection.name} />
                      <AvatarFallback>{connection.name.charAt(0)}</AvatarFallback>
                    </Avatar>
                    <p className="text-xs font-medium truncate w-full">{connection.name}</p>
                    <p className="text-xs text-muted-foreground truncate w-full">{connection.title}</p>
                  </div>
                ))}
              </div>
              <Button variant="outline" className="w-full mt-4">
                See all connections
              </Button>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
}


function getUserData(_username: string) {
  return {
    name: "Sarah Chen",
    headline: "Senior Product Designer | UX/UI Specialist",
    avatar: "/placeholder.svg?height=128&width=128",
    coverImage: "/placeholder.svg?height=256&width=1024",
    location: "San Francisco, CA",
    company: "Design Systems Inc.",
    connections: 542,
    posts: 87,
    views: 1243,
    about:
      "Product designer with over 8 years of experience specializing in creating intuitive digital experiences. I focus on user-centered design principles to build products that are both beautiful and functional.\n\nCurrently leading design initiatives at Design Systems Inc., where I work on enterprise-level design systems that serve millions of users worldwide. Previously, I helped scale design operations at TechCorp and contributed to award-winning products at InnovateLab.",
    experience: [
      {
        title: "Senior Product Designer",
        company: "Design Systems Inc.",
        companyLogo: "/placeholder.svg?height=48&width=48",
        duration: "Jan 2021 - Present",
        location: "San Francisco, CA",
        description:
          "Leading the design system team responsible for creating and maintaining a comprehensive design system used by over 200 designers and developers. Implemented a new component library that reduced design inconsistencies by 65% and accelerated product development cycles.",
      },
      {
        title: "UX Designer",
        company: "TechCorp",
        companyLogo: "/placeholder.svg?height=48&width=48",
        duration: "Mar 2018 - Dec 2020",
        location: "San Francisco, CA",
        description:
          "Designed user experiences for flagship products with over 5 million monthly active users. Conducted user research and usability testing to inform design decisions. Collaborated with product managers and engineers to deliver high-quality features.",
      },
      {
        title: "UI Designer",
        company: "InnovateLab",
        companyLogo: "/placeholder.svg?height=48&width=48",
        duration: "Jun 2015 - Feb 2018",
        location: "Seattle, WA",
        description:
          "Created visual designs for web and mobile applications. Developed style guides and design patterns to ensure consistency across products. Mentored junior designers and contributed to company design culture.",
      },
    ],
    education: [
      {
        school: "Rhode Island School of Design",
        schoolLogo: "/placeholder.svg?height=48&width=48",
        degree: "BFA, Graphic Design",
        duration: "2011 - 2015",
        description: "Graduated with honors. Specialized in digital media and interactive design.",
      },
      {
        school: "Interaction Design Foundation",
        schoolLogo: "/placeholder.svg?height=48&width=48",
        degree: "UX Design Certification",
        duration: "2016",
        description: "Completed advanced certification in user experience design methodologies.",
      },
    ],
    skills: [
      {
        name: "UX Design",
        endorsements: 87,
        endorsedBy: [
          { name: "Alex Johnson", avatar: "/placeholder.svg?height=24&width=24" },
          { name: "Maya Patel", avatar: "/placeholder.svg?height=24&width=24" },
          { name: "David Kim", avatar: "/placeholder.svg?height=24&width=24" },
        ],
      },
      {
        name: "Design Systems",
        endorsements: 64,
        endorsedBy: [
          { name: "Jordan Taylor", avatar: "/placeholder.svg?height=24&width=24" },
          { name: "Sophia Rodriguez", avatar: "/placeholder.svg?height=24&width=24" },
          { name: "Elijah Wilson", avatar: "/placeholder.svg?height=24&width=24" },
        ],
      },
      {
        name: "Figma",
        endorsements: 92,
        endorsedBy: [
          { name: "Alex Johnson", avatar: "/placeholder.svg?height=24&width=24" },
          { name: "Maya Patel", avatar: "/placeholder.svg?height=24&width=24" },
          { name: "Jordan Taylor", avatar: "/placeholder.svg?height=24&width=24" },
        ],
      },
    ],
    recommendations: [
      {
        author: {
          name: "Alex Johnson",
          title: "Engineering Manager at TechCorp",
          avatar: "/placeholder.svg?height=48&width=48",
        },
        content:
          "Sarah is an exceptional designer who brings both creativity and strategic thinking to every project. During our time working together at TechCorp, she consistently delivered designs that were not only visually stunning but also thoughtfully considered user needs and technical constraints. Her collaborative approach made her a favorite among cross-functional teams.",
      },
      {
        author: {
          name: "Maya Patel",
          title: "Product Manager at Design Systems Inc.",
          avatar: "/placeholder.svg?height=48&width=48",
        },
        content:
          "Working with Sarah has been transformative for our product team. Her deep understanding of design systems has elevated our entire product experience and streamlined our development process. She's a natural leader who empowers others while maintaining incredibly high standards for the work.",
      },
      {
        author: {
          name: "Jordan Taylor",
          title: "CEO at InnovateLab",
          avatar: "/placeholder.svg?height=48&width=48",
        },
        content:
          "Sarah was one of our most talented designers during her time at InnovateLab. Her ability to translate complex problems into elegant, intuitive interfaces set her apart. Years later, I still reference her work as an example of excellence in design thinking and execution.",
      },
    ],
    topConnections: [
      {
        name: "Alex Johnson",
        title: "Engineering Manager",
        avatar: "/placeholder.svg?height=56&width=56",
      },
      {
        name: "Maya Patel",
        title: "Product Manager",
        avatar: "/placeholder.svg?height=56&width=56",
      },
      {
        name: "David Kim",
        title: "Product Manager",
        avatar: "/placeholder.svg?height=56&width=56",
      },
      {
        name: "Jordan Taylor",
        title: "CEO",
        avatar: "/placeholder.svg?height=56&width=56",
      },
      {
        name: "Sophia Rodriguez",
        title: "DevOps Engineer",
        avatar: "/placeholder.svg?height=56&width=56",
      },
      {
        name: "Elijah Wilson",
        title: "AI Researcher",
        avatar: "/placeholder.svg?height=56&width=56",
      },
    ],
    recentPosts: [
      {
        content:
          "Just published my article on creating scalable design systems for enterprise applications. Check it out and let me know your thoughts!",
        date: "2 days ago",
        likes: 87,
        comments: 23,
        image: "/placeholder.svg?height=400&width=600",
      },
      {
        content:
          "Excited to share that our design team has been nominated for the Annual Design Excellence Award for our work on the new user onboarding experience!",
        date: "1 week ago",
        likes: 124,
        comments: 36,
      },
      {
        content:
          "I'll be speaking at the upcoming UX Conference about 'Building Design Systems That Scale'. Hope to see some of you there!",
        date: "2 weeks ago",
        likes: 56,
        comments: 12,
      },
    ],
  }
}
