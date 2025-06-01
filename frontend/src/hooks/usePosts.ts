import { useState, useCallback, useEffect } from "react";
import {
  useCreatePostMutation,
  useLikePostMutation,
  useUnlikePostMutation,
  useDeletePostMutation,
  useCreateCommentMutation,
  useGetPostsQuery,
} from "@/api/api";
import { toast } from "sonner";

interface PostsPaginationState {
  page: number;
  hasNextPage: boolean;
  isLoadingMore: boolean;
  totalPages: number;
}

export const usePosts = () => {
  const [posts, setPosts] = useState<Post[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [pagination, setPagination] = useState<PostsPaginationState>({
    page: 1,
    hasNextPage: true,
    isLoadingMore: false,
    totalPages: 1,
  });

  // Fetch initial posts
  const {
    data: initialData,
    isLoading: isLoadingInitial,
    error: initialError,
    refetch,
  } = useGetPostsQuery({ page: 1, limit: 10 });

  // Initialize posts when initial data loads
  useEffect(() => {
    if (initialData?.results) {
      const transformedPosts: Post[] = initialData.results.map(
        (post: {
          id: string;
          content: string;
          imageUrl?: string;
          createdAt: string;
          updatedAt: string;
          likesCount: number;
          author: {
            id: string;
            username: string;
            email: string;
            role: string;
          };
          authorId: string;
          comments: CommentType[];
        }) => ({
          ...post,
          isLiked: false, // TODO: Determine based on current user and likes data
        })
      );
      setPosts(transformedPosts);
      setPagination({
        page: 1,
        hasNextPage: initialData.meta.page < initialData.meta.lastPage,
        isLoadingMore: false,
        totalPages: initialData.meta.lastPage,
      });
    }
  }, [initialData]);

  // Handle loading and error states from initial query
  useEffect(() => {
    setLoading(isLoadingInitial);
    setError(initialError ? "Failed to load posts" : null);
  }, [isLoadingInitial, initialError]);

  // Function to load more posts
  const loadMorePosts = useCallback(async () => {
    if (!pagination.hasNextPage || pagination.isLoadingMore) return;

    const nextPage = pagination.page + 1;
    setPagination((prev) => ({ ...prev, isLoadingMore: true }));

    try {
      // Use fetch to get more posts
      const response = await fetch(
        import.meta.env.VITE_BACKEND_URL + "/graphql",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${localStorage.getItem("access_token")}`,
          },
          body: JSON.stringify({
            query: `
            query Posts($page: Int!, $limit: Int!) {
              posts(paginationDto: { page: $page, limit: $limit }) {
                results {
                  id
                  content
                  imageUrl
                  createdAt
                  updatedAt
                  likesCount
                  author {
                    id
                    username
                    email
                    role
                  }
                  authorId
                  comments {
                    id
                    content
                    createdAt
                    updatedAt
                    author {
                      id
                      username
                      email
                      role
                    }
                    authorId
                  }
                }
                meta {
                  total
                  page
                  lastPage
                  limit
                }
              }
            }
          `,
            variables: { page: nextPage, limit: 10 },
          }),
        }
      );

      const result = await response.json();

      if (result.data?.posts) {
        const newPosts: Post[] = result.data.posts.results.map(
          (post: {
            id: string;
            content: string;
            imageUrl?: string;
            createdAt: string;
            updatedAt: string;
            likesCount: number;
            author: {
              id: string;
              username: string;
              email: string;
              role: string;
            };
            authorId: string;
            comments: CommentType[];
          }) => ({
            ...post,
            isLiked: false,
          })
        );

        setPosts((prevPosts) => [...prevPosts, ...newPosts]);
        setPagination((prev) => ({
          ...prev,
          page: nextPage,
          hasNextPage: nextPage < result.data.posts.meta.lastPage,
          totalPages: result.data.posts.meta.lastPage,
          isLoadingMore: false,
        }));
      }
    } catch (fetchError) {
      console.error("Error loading more posts:", fetchError);
      toast.error("Failed to load more posts");
      setPagination((prev) => ({ ...prev, isLoadingMore: false }));
    }
  }, [pagination.hasNextPage, pagination.isLoadingMore, pagination.page]);

  // Refresh posts (reload from first page)
  const refreshPosts = useCallback(() => {
    setPagination({
      page: 1,
      hasNextPage: true,
      isLoadingMore: false,
      totalPages: 1,
    });
    refetch();
  }, [refetch]);

  // API mutations
  const [createPostMutation] = useCreatePostMutation();
  const [likePostMutation] = useLikePostMutation();
  const [unlikePostMutation] = useUnlikePostMutation();
  const [createCommentMutation] = useCreateCommentMutation();
  const [deletePostMutation] = useDeletePostMutation();

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

        // Refresh posts after creating a new one
        refreshPosts();
        toast.success("Post created successfully!");
      } catch (error) {
        setError("Failed to create post");
        toast.error("Failed to create post");
        console.error("Error creating post:", error);
      } finally {
        setLoading(false);
      }
    },
    [createPostMutation, refreshPosts]
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

  const deletePost = useCallback(
    async (postId: string) => {
      try {
        await deletePostMutation(postId).unwrap();

        // Remove the post from the local state
        setPosts((prevPosts) => prevPosts.filter((post) => post.id !== postId));

        toast.success("Post deleted successfully!");
      } catch (error) {
        console.error("Error deleting post:", error);
        toast.error("Failed to delete post");
      }
    },
    [deletePostMutation]
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
    pagination,
    createPost,
    likePost,
    addComment,
    likeComment,
    addReply,
    likeReply,
    loadMorePosts,
    refreshPosts,
    deletePost,
  };
};
