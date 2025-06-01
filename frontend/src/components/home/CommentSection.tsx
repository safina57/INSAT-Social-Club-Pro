import { useState } from "react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Separator } from "@/components/ui/separator";
import { Send, ThumbsUp, LucideReply } from "lucide-react";
import { cn } from "@/lib/utils";
import { formatTimestamp } from "@/lib/utils/postUtils";

interface CommentSectionProps {
  post: Post;
  onAddComment: (postId: string, commentText: string) => void;
  onLikeComment: (postId: string, commentId: string) => void;
  onAddReply: (postId: string, commentId: string, replyText: string) => void;
  onLikeReply: (postId: string, commentId: string, replyId: string) => void;
  showComments: boolean;
}

export default function CommentSection({
  post,
  onAddComment,
  onLikeComment,
  onAddReply,
  onLikeReply,
  showComments,
}: CommentSectionProps) {
  const [newComment, setNewComment] = useState("");
  const [replyingTo, setReplyingTo] = useState<string | null>(null);
  const [replyText, setReplyText] = useState("");

  const handleSubmitComment = () => {
    if (newComment.trim()) {
      onAddComment(post.id, newComment);
      setNewComment("");
    }
  };

  const handleSubmitReply = (commentId: string) => {
    if (replyText.trim()) {
      onAddReply(post.id, commentId, replyText);
      setReplyText("");
      setReplyingTo(null);
    }
  };

  if (!showComments && post.comments.length === 0) {
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
      {post.comments.length > 0 && (
        <div className="space-y-4">
          {post.comments.map((comment) => (
            <div key={comment.id} className="space-y-4">
              {/* Comment */}
              <div className="flex items-start space-x-3">
                <Avatar className="h-8 w-8">
                  <AvatarImage
                    src={comment.author.avatar || "/placeholder.svg"}
                    alt={comment.author.name}
                  />
                  <AvatarFallback>
                    {comment.author.name.charAt(0)}
                  </AvatarFallback>
                </Avatar>
                <div className="flex-1 space-y-1">
                  <div className="rounded-lg bg-secondary/30 p-3">
                    <div className="flex items-center space-x-2">
                      <h5 className="text-sm font-medium">
                        {comment.author.name}
                      </h5>
                      <p className="text-xs text-muted-foreground">
                        {formatTimestamp(comment.timestamp)}
                      </p>
                    </div>
                    <p className="mt-1 text-sm">{comment.content}</p>
                  </div>

                  <div className="flex items-center space-x-4 pl-1">
                    <button
                      className={cn(
                        "text-xs flex items-center space-x-1 hover:text-primary transition-colors",
                        comment.isLiked && "text-primary"
                      )}
                      onClick={() => onLikeComment(post.id, comment.id)}
                    >
                      <ThumbsUp
                        className={cn(
                          "h-3 w-3",
                          comment.isLiked && "fill-current"
                        )}
                      />
                      <span>{comment.likes > 0 ? comment.likes : "Like"}</span>
                    </button>

                    <button
                      className="text-xs flex items-center space-x-1 hover:text-primary transition-colors"
                      onClick={() =>
                        setReplyingTo(
                          replyingTo === comment.id ? null : comment.id
                        )
                      }
                    >
                      <LucideReply className="h-3 w-3" />
                      <span>Reply</span>
                    </button>
                  </div>

                  {/* Reply Input */}
                  {replyingTo === comment.id && (
                    <div className="flex items-start space-x-3 mt-2">
                      <Avatar className="h-6 w-6">
                        <AvatarImage
                          src="/placeholder.svg?height=24&width=24"
                          alt="Current User"
                        />
                        <AvatarFallback>CU</AvatarFallback>
                      </Avatar>
                      <div className="relative flex-1">
                        <Textarea
                          placeholder={`Reply to ${comment.author.name}...`}
                          className="min-h-[50px] bg-background/60 border-white/10 focus:border-primary/50 resize-none pr-10 transition-all text-xs"
                          value={replyText}
                          onChange={(e) => setReplyText(e.target.value)}
                        />
                        <Button
                          size="icon"
                          className="absolute bottom-2 right-2 h-5 w-5 rounded-full bg-primary/20 hover:bg-primary/40 text-primary"
                          onClick={() => handleSubmitReply(comment.id)}
                          disabled={!replyText.trim()}
                        >
                          <Send className="h-2 w-2" />
                          <span className="sr-only">Send reply</span>
                        </Button>
                      </div>
                    </div>
                  )}

                  {/* Replies */}
                  {comment.replies.length > 0 && (
                    <div className="ml-6 space-y-3 mt-3">
                      {comment.replies.map((reply) => (
                        <div
                          key={reply.id}
                          className="flex items-start space-x-3"
                        >
                          <Avatar className="h-6 w-6">
                            <AvatarImage
                              src={reply.author.avatar || "/placeholder.svg"}
                              alt={reply.author.name}
                            />
                            <AvatarFallback>
                              {reply.author.name.charAt(0)}
                            </AvatarFallback>
                          </Avatar>
                          <div className="flex-1 space-y-1">
                            <div className="rounded-lg bg-secondary/20 p-2">
                              <div className="flex items-center space-x-2">
                                <h5 className="text-xs font-medium">
                                  {reply.author.name}
                                </h5>
                                <p className="text-xs text-muted-foreground">
                                  {formatTimestamp(reply.timestamp)}
                                </p>
                              </div>
                              <p className="mt-1 text-xs">{reply.content}</p>
                            </div>

                            <div className="flex items-center space-x-4 pl-1">
                              <button
                                className={cn(
                                  "text-xs flex items-center space-x-1 hover:text-primary transition-colors",
                                  reply.isLiked && "text-primary"
                                )}
                                onClick={() =>
                                  onLikeReply(post.id, comment.id, reply.id)
                                }
                              >
                                <ThumbsUp
                                  className={cn(
                                    "h-2 w-2",
                                    reply.isLiked && "fill-current"
                                  )}
                                />
                                <span className="text-xs">
                                  {reply.likes > 0 ? reply.likes : "Like"}
                                </span>
                              </button>
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
