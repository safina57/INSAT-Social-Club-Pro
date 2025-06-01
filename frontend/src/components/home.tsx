import React from "react";
import Aurora from "@/components/ui/Aurora";
import { Header } from "@/components/common/header";
import { ScrollArea } from "@/components/ui/scroll-area";
import { usePosts } from "@/hooks/usePosts";
import { useGetPostsQuery } from "@/api/api";
import { TRENDING_TOPICS } from "@/data/sampleData";
import CreatePostForm from "@/components/home/CreatePostForm";
import PostCard from "@/components/home/PostCard";
import ProfileCard from "@/components/home/ProfileCard";
import TrendingTopics from "@/components/home/TrendingTopics";

export default function HomePage() {
  const {
    posts,
    setPosts,
    createPost,
    likePost,
    addComment,
    likeComment,
    addReply,
    likeReply,
  } = usePosts();

  // Fetch posts from API
  const {
    data: postsData,
    isLoading,
    error,
  } = useGetPostsQuery({ page: 1, limit: 20 });

  // Transform and set posts when data is loaded
  React.useEffect(() => {
    if (postsData?.results) {
      const transformedPosts: Post[] = postsData.results.map((post) => ({
        ...post,
        isLiked: false, // TODO: Determine based on current user and likes data
      }));
      setPosts(transformedPosts);
    }
  }, [postsData, setPosts]);

  return (
    <div className="relative min-h-screen w-full overflow-hidden">
      {/* Aurora Background */}
      <div className="absolute inset-0 -z-10">
        <Aurora
          colorStops={[
            "#00C9FF", // Aqua blue
            "#003B49", // Dark green
          ]}
          blend={0.2}
          amplitude={1.2}
          speed={0.5}
        />
      </div>
      <Header />
      <div className="container mx-auto px-4 py-8 content-z-index">
        <div className="grid grid-cols-1 gap-8 lg:grid-cols-12">
          {/* Left Sidebar */}
          <div className="hidden lg:col-span-3 lg:block">
            <ProfileCard />
          </div>

          {/* Main Feed */}
          <div className="lg:col-span-6">
            <div className="space-y-6">
              {/* Create Post */}
              <CreatePostForm onCreatePost={createPost} />

              {/* Posts Feed */}
              <ScrollArea className="h-[calc(100vh-220px)]">
                <div className="space-y-6 pr-4">
                  {isLoading && (
                    <div className="flex justify-center py-8">
                      <div className="text-muted-foreground">
                        Loading posts...
                      </div>
                    </div>
                  )}

                  {error && (
                    <div className="flex justify-center py-8">
                      <div className="text-red-500">
                        Failed to load posts. Please try again later.
                      </div>
                    </div>
                  )}

                  {!isLoading && !error && posts.length === 0 && (
                    <div className="flex justify-center py-8">
                      <div className="text-muted-foreground">
                        No posts yet. Create the first one!
                      </div>
                    </div>
                  )}

                  {!isLoading &&
                    !error &&
                    posts.map((post) => (
                      <PostCard
                        key={post.id}
                        post={post}
                        onLike={likePost}
                        onAddComment={addComment}
                        onLikeComment={likeComment}
                        onAddReply={addReply}
                        onLikeReply={likeReply}
                      />
                    ))}
                </div>
              </ScrollArea>
            </div>
          </div>

          {/* Right Sidebar */}
          <div className="hidden lg:col-span-3 lg:block">
            <TrendingTopics topics={TRENDING_TOPICS} />
          </div>
        </div>
      </div>
    </div>
  );
}
