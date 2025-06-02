import { TabsContent } from "@/components/ui/tabs";
import type { Post, User } from "@/types/profile";
import { PostCard } from "./PostCard";

interface PostsTabProps {
  posts: Post[];
  user: User;
}

export function PostsTab({ posts, user }: PostsTabProps) {
  return (
    <TabsContent value="posts" className="space-y-6">
      {posts.map((post, index) => (
        <PostCard key={index} post={post} user={user} />
      ))}
    </TabsContent>
  );
}
