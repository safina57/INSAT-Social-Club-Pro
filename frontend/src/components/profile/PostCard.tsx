import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { ThumbsUp, MessageCircle, Share2, MoreHorizontal } from "lucide-react";
import type { Post, User } from "@/types/profile";

interface PostCardProps {
  post: Post;
  user: User;
}

export function PostCard({ post, user }: PostCardProps) {
  return (
    <Card>
      <CardContent className="p-6">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center">
            <Avatar className="h-10 w-10 mr-3">
              <AvatarImage
                src={user.profilePhoto || "/placeholder.svg"}
                alt={user.username}
              />
              <AvatarFallback>{user.username.charAt(0)}</AvatarFallback>
            </Avatar>
            <div>
              <p className="font-medium">{user.username}</p>
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
            <img
              src={post.image || "/placeholder.svg"}
              alt="Post"
              className="w-full"
            />
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
        </div>
      </CardContent>
    </Card>
  );
}
