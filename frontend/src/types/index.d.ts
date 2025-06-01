declare global {
  interface User {
    id: string;
    username: string;
    email: string;
    role: string;
  }

  interface Author {
    id: string;
    username: string;
    email: string;
    role: string;
  }

  interface CommentType {
    id: string;
    author: Author;
    content: string;
    createdAt: string;
    updatedAt: string;
    authorId: string;
  }

  interface Post {
    id: string;
    author: Author;
    content: string;
    imageUrl?: string | null;
    createdAt: string;
    updatedAt: string;
    likesCount: number;
    authorId: string;
    comments?: CommentType[];
    isLiked: boolean;
  }

  // Legacy types for backward compatibility
  interface ReplyType {
    id: string;
    author: User;
    content: string;
    timestamp: string;
    likes: number;
    isLiked: boolean;
  }

  interface PostCardProps {
    post: Post;
    onLike: (postId: string) => void;
    onAddComment: (postId: string, commentText: string) => void;
    onLikeComment?: (postId: string, commentId: string) => void;
    onAddReply?: (postId: string, commentId: string, replyText: string) => void;
    onLikeReply?: (postId: string, commentId: string, replyId: string) => void;
    onDelete?: (postId: string) => void;
  }
}

export {};
