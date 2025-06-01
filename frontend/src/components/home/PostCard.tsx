import { useState } from "react";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  Heart,
  MessageCircle,
  Share2,
  MoreHorizontal,
  Clock,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { formatTimestamp, getCurrentUser } from "@/lib/utils/postUtils";
import CommentSection from "./CommentSection";

export default function PostCard({
  post,
  onLike,
  onDelete,
  onAddComment,
}: PostCardProps) {
  const [showComments, setShowComments] = useState(false);
  const currentUser = getCurrentUser();
  const isOwner = currentUser?.id === post.authorId;

  const toggleComments = () => {
    setShowComments(!showComments);
  };

  return (
    <div className="rounded-xl bg-background/40 backdrop-blur-md p-6 shadow-lg border border-white/10">
      {/* Post Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-3">
          <Avatar className="h-10 w-10 border-2 border-primary/50">
            {/* <AvatarImage
              src={post.author.avatar || "/placeholder.svg"}
              alt={post.author.username}
            /> */}
            <AvatarFallback>
              {post.author.username.slice(0, 2).toUpperCase()}
            </AvatarFallback>
          </Avatar>
          <div>
            <div className="flex items-center space-x-2">
              <h4 className="font-bold">{post.author.username}</h4>
              <p className="text-xs text-muted-foreground">
                • {post.author.role}
              </p>
            </div>
            <div className="flex items-center text-xs text-muted-foreground">
              <Clock className="mr-1 h-3 w-3" />
              <span>{formatTimestamp(post.createdAt)}</span>
            </div>
          </div>
        </div>

        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="ghost" size="icon" className="h-8 w-8">
              <MoreHorizontal className="h-4 w-4" />
              <span className="sr-only">More options</span>
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent
            align="end"
            className="bg-background/95 backdrop-blur-md border-white/10"
          >
            <DropdownMenuItem>Save post</DropdownMenuItem>
            <DropdownMenuItem>Report</DropdownMenuItem>
            {isOwner && onDelete && (
              <DropdownMenuItem
                onClick={() => onDelete(post.id)}
                className="text-red-400 focus:text-red-300 focus:bg-red-500/10"
              >
                Delete
              </DropdownMenuItem>
            )}
          </DropdownMenuContent>
        </DropdownMenu>
      </div>

      {/* Post Content */}
      <div className="mt-4 space-y-4">
        <p className="whitespace-pre-line">{post.content}</p>

        {post.imageUrl && (
          <div className="mt-2 rounded-lg overflow-hidden">
            <img
              src={post.imageUrl || "/placeholder.svg"}
              alt="Post content"
              className="max-h-[400px] w-full object-cover rounded-lg"
            />
          </div>
        )}
      </div>

      {/* Post Stats */}
      <div className="mt-4 flex items-center justify-between text-xs text-muted-foreground">
        <div className="flex items-center space-x-1">
          {post.likesCount > 0 && (
            <>
              <div className="flex h-4 w-4 items-center justify-center rounded-full bg-primary/20">
                <Heart className="h-2 w-2 text-primary" fill="currentColor" />
              </div>
              <span>{post.likesCount}</span>
            </>
          )}
        </div>

        {post.comments!.length > 0 && (
          <button
            onClick={toggleComments}
            className="hover:text-primary transition-colors"
          >
            {post.comments!.length}{" "}
            {post.comments!.length === 1 ? "comment" : "comments"}
          </button>
        )}
      </div>

      {/* Post Actions */}
      <div className="mt-4 grid grid-cols-3 divide-x divide-white/10">
        <Button
          variant="ghost"
          className={cn(
            "rounded-none flex items-center justify-center space-x-2 hover:bg-primary/10",
            post.isLiked && "text-primary"
          )}
          onClick={() => onLike(post.id)}
        >
          <Heart className={cn("h-4 w-4", post.isLiked && "fill-current")} />
          <span>Like</span>
        </Button>

        <Button
          variant="ghost"
          className="rounded-none flex items-center justify-center space-x-2 hover:bg-primary/10"
          onClick={toggleComments}
        >
          <MessageCircle className="h-4 w-4" />
          <span>Comment</span>
        </Button>

        <Button
          variant="ghost"
          className="rounded-none flex items-center justify-center space-x-2 hover:bg-primary/10"
        >
          <Share2 className="h-4 w-4" />
          <span>Share</span>
        </Button>
      </div>

      {/* Comments Section */}
      <CommentSection
        post={post}
        onAddComment={onAddComment}
        showComments={showComments}
      />
    </div>
  );
}
