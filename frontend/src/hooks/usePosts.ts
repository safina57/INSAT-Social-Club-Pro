import { useState, useCallback } from "react";
import {
  useCreatePostMutation,
  useLikePostMutation,
  useUnlikePostMutation,
  useCreateCommentMutation,
} from "@/api/api";
import { toast } from "sonner";

export const usePosts = () => {
  const [posts, setPosts] = useState<Post[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // API mutations
  const [createPostMutation] = useCreatePostMutation();
  const [likePostMutation] = useLikePostMutation();
  const [unlikePostMutation] = useUnlikePostMutation();
  const [createCommentMutation] = useCreateCommentMutation();

  const createPost = useCallback(
    async (content: string, image?: File | null) => {
      if (!content.trim() && !image) return;

      setLoading(true);
      setError(null);

      try {
        await createPostMutation({
          content,
          ...(image && { image }),
        }).unwrap();

        // No need to manually update posts - RTK Query will invalidate and refetch
        toast.success("Post created successfully!");
      } catch (error) {
        setError("Failed to create post");
        toast.error("Failed to create post");
        console.error("Error creating post:", error);
      } finally {
        setLoading(false);
      }
    },
    [createPostMutation]
  );

  const likePost = useCallback(
    async (postId: string) => {
      const post = posts.find((p) => p.id === postId);
      if (!post) return;

      // Optimistic update
      const optimisticUpdate = (isLiked: boolean) => {
        setPosts((prevPosts) =>
          prevPosts.map((p) => {
            if (p.id === postId) {
              return {
                ...p,
                likesCount: isLiked ? p.likesCount + 1 : p.likesCount - 1,
                likes: isLiked ? p.likesCount + 1 : p.likesCount - 1,
                isLiked: isLiked,
              };
            }
            return p;
          })
        );
      };

      try {
        if (post.isLiked) {
          // Optimistically unlike
          optimisticUpdate(false);
          await unlikePostMutation(postId).unwrap();
        } else {
          // Optimistically like
          optimisticUpdate(true);
          await likePostMutation(postId).unwrap();
        }
      } catch (error) {
        // Revert optimistic update on error
        optimisticUpdate(!!post.isLiked);
        console.error("Error toggling like:", error);
        toast.error("Failed to update like");
      }
    },
    [posts, likePostMutation, unlikePostMutation]
  );

  const addComment = useCallback(
    async (postId: string, commentText: string) => {
      if (!commentText.trim()) return;

      try {
        const result = await createCommentMutation({
          content: commentText,
          postId,
        }).unwrap();

        // Transform API response to match frontend expectations
        const newComment: CommentType = {
          ...result,
        };

        setPosts((prevPosts) =>
          prevPosts.map((post) => {
            if (post.id === postId) {
              return {
                ...post,
                comments: [...(post.comments || []), newComment],
              };
            }
            return post;
          })
        );
        toast.success("Comment added successfully!");
      } catch (error) {
        console.error("Error adding comment:", error);
        toast.error("Failed to add comment");
      }
    },
    [createCommentMutation]
  );

  // Legacy methods for backward compatibility (simplified implementations)
  const likeComment = useCallback((postId: string, commentId: string) => {
    // TODO: Implement comment liking if needed
    console.log("Like comment:", postId, commentId);
  }, []);

  const addReply = useCallback(
    (postId: string, commentId: string, replyText: string) => {
      // TODO: Implement replies if needed
      console.log("Add reply:", postId, commentId, replyText);
    },
    []
  );

  const likeReply = useCallback(
    (postId: string, commentId: string, replyId: string) => {
      // TODO: Implement reply liking if needed
      console.log("Like reply:", postId, commentId, replyId);
    },
    []
  );

  return {
    posts,
    setPosts,
    loading,
    error,
    createPost,
    likePost,
    addComment,
    likeComment,
    addReply,
    likeReply,
  };
};
