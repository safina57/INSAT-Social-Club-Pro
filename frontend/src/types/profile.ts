export interface User {
  id: string;
  username: string;
  email: string;
  profilePhoto?: string | null;
  role: string;
  posts: Post[];
}

export interface Experience {
  title: string;
  company: string;
  companyLogo: string;
  duration: string;
  location: string;
  description: string;
}

export interface Education {
  school: string;
  schoolLogo: string;
  degree: string;
  duration: string;
  description: string;
}

export interface Skill {
  name: string;
  endorsements: number;
  endorsedBy: Person[];
}

export interface Person {
  name: string;
  avatar: string;
}

export interface Recommendation {
  author: Author;
  content: string;
}

export interface Author {
  name: string;
  title: string;
  avatar: string;
}

export interface Connection {
  name: string;
  title: string;
  avatar: string;
}

export interface Post {
  content: string;
  date: string;
  likes: number;
  comments: number;
  image?: string;
}
