import { useState } from "react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Separator } from "@/components/ui/separator";
import { Send } from "lucide-react";
import { formatTimestamp } from "@/lib/utils/postUtils";

interface CommentSectionProps {
  post: Post;
  onAddComment: (postId: string, commentText: string) => void;
  showComments: boolean;
}

export default function CommentSection({
  post,
  onAddComment,
  showComments,
}: CommentSectionProps) {
  const [newComment, setNewComment] = useState("");

  const handleSubmitComment = () => {
    if (newComment.trim()) {
      onAddComment(post.id, newComment);
      setNewComment("");
    }
  };

  if (!showComments && post.comments!.length === 0) {
    return null;
  }

  return (
    <div className="mt-4 space-y-4">
      <Separator />

      {/* New Comment Input */}
      <div className="flex items-start space-x-3">
        <Avatar className="h-8 w-8">
          <AvatarImage
            src="/placeholder.svg?height=32&width=32"
            alt="Current User"
          />
          <AvatarFallback>CU</AvatarFallback>
        </Avatar>
        <div className="relative flex-1">
          <Textarea
            placeholder="Write a comment..."
            className="min-h-[60px] bg-background/60 border-white/10 focus:border-primary/50 resize-none pr-10 transition-all text-sm"
            value={newComment}
            onChange={(e) => setNewComment(e.target.value)}
          />
          <Button
            size="icon"
            className="absolute bottom-2 right-2 h-6 w-6 rounded-full bg-primary/20 hover:bg-primary/40 text-primary"
            onClick={handleSubmitComment}
            disabled={!newComment.trim()}
          >
            <Send className="h-3 w-3" />
            <span className="sr-only">Send comment</span>
          </Button>
        </div>
      </div>

      {/* Comments List */}
      {post.comments!.length > 0 && (
        <div className="space-y-4">
          {post.comments!.map((comment) => (
            <div key={comment.id} className="space-y-4">
              {/* Comment */}
              <div className="flex items-start space-x-3">
                <Avatar className="h-8 w-8">
                  {/* <AvatarImage
                    src={comment.author.avatar || "/placeholder.svg"}
                    alt={comment.author.name}
                  /> */}
                  <AvatarFallback>
                    {comment.author.username.slice(0, 2).toUpperCase()}
                  </AvatarFallback>
                </Avatar>
                <div className="flex-1 space-y-1">
                  <div className="rounded-lg bg-secondary/30 p-3">
                    <div className="flex items-center space-x-2">
                      <h5 className="text-sm font-medium">
                        {comment.author.username}
                      </h5>
                      <p className="text-xs text-muted-foreground">
                        {formatTimestamp(comment.createdAt)}
                      </p>
                    </div>
                    <p className="mt-1 text-sm">{comment.content}</p>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
