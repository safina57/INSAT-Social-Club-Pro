export const SAMPLE_POSTS: Post[] = [
  {
    id: "post-1",
    author: {
      id: "user-1",
      name: "Sarah Chen",
      avatar: "/placeholder.svg?height=40&width=40",
      role: "Product Designer",
    },
    content:
      "Just finished working on a new design system for our enterprise clients. Excited to share more details soon! #DesignSystems #UX",
    imageUrl: "/placeholder.svg?height=400&width=600",
    timestamp: new Date(Date.now() - 3600000).toISOString(),
    likes: 24,
    comments: [
      {
        id: "comment-1",
        author: {
          id: "user-2",
          name: "Alex Johnson",
          avatar: "/placeholder.svg?height=40&width=40",
          role: "Frontend Developer",
        },
        content:
          "This looks amazing! Can't wait to implement this in our next project.",
        timestamp: new Date(Date.now() - 3000000).toISOString(),
        likes: 5,
        replies: [
          {
            id: "reply-1",
            author: {
              id: "user-3",
              name: "Maya Patel",
              avatar: "/placeholder.svg?height=40&width=40",
              role: "UX Researcher",
            },
            content:
              "The color palette is particularly impressive. Great work!",
            timestamp: new Date(Date.now() - 2500000).toISOString(),
            likes: 2,
            isLiked: false,
          },
        ],
        isLiked: true,
      },
      {
        id: "comment-2",
        author: {
          id: "user-4",
          name: "David Kim",
          avatar: "/placeholder.svg?height=40&width=40",
          role: "Product Manager",
        },
        content:
          "Would love to see how this performs with our enterprise clients. Can you share some early feedback?",
        timestamp: new Date(Date.now() - 2000000).toISOString(),
        likes: 3,
        replies: [],
        isLiked: false,
      },
    ],
    isLiked: true,
  },
  {
    id: "post-2",
    author: {
      id: "user-5",
      name: "Jordan Taylor",
      avatar: "/placeholder.svg?height=40&width=40",
      role: "Software Architect",
    },
    content:
      "Just published my article on microservices architecture and how we implemented it at scale. Check it out and let me know your thoughts!\n\nThe key takeaways:\n- Start with a monolith, extract services strategically\n- Invest in robust monitoring from day one\n- Don't underestimate the complexity of distributed systems",
    linkUrl: "https://techblog.example.com/microservices-at-scale",
    timestamp: new Date(Date.now() - 86400000).toISOString(),
    likes: 47,
    comments: [
      {
        id: "comment-3",
        author: {
          id: "user-6",
          name: "Sophia Rodriguez",
          avatar: "/placeholder.svg?height=40&width=40",
          role: "DevOps Engineer",
        },
        content:
          "Great insights! Especially agree with the monitoring part - it's absolutely critical when dealing with distributed systems.",
        timestamp: new Date(Date.now() - 80000000).toISOString(),
        likes: 8,
        replies: [],
        isLiked: false,
      },
    ],
    isLiked: false,
  },
  {
    id: "post-3",
    author: {
      id: "user-7",
      name: "Elijah Wilson",
      avatar: "/placeholder.svg?height=40&width=40",
      role: "AI Research Scientist",
    },
    content:
      "Excited to announce that our paper on transformer efficiency has been accepted at NeurIPS! This work improves inference speed by 35% while maintaining accuracy.",
    timestamp: new Date(Date.now() - 172800000).toISOString(),
    likes: 89,
    comments: [],
    isLiked: false,
  },
];

export const TRENDING_TOPICS = [
  { tag: "TechInnovation", posts: 1243 },
  { tag: "AIFuture", posts: 982 },
  { tag: "ProductDesign", posts: 756 },
  { tag: "RemoteWork", posts: 621 },
  { tag: "DataScience", posts: 543 },
];
