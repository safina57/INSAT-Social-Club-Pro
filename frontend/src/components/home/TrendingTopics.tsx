import { Button } from "@/components/ui/button";

interface TrendingTopic {
  tag: string;
  posts: number;
}

interface TrendingTopicsProps {
  topics: TrendingTopic[];
}

export default function TrendingTopics({ topics }: TrendingTopicsProps) {
  return (
    <div className="rounded-xl bg-background/40 backdrop-blur-md p-6 shadow-lg border border-white/10 sticky top-8">
      <h3 className="text-lg font-bold mb-4">Trending Topics</h3>

      <div className="space-y-4">
        {topics.map((topic, index) => (
          <div key={index} className="group cursor-pointer">
            <p className="text-sm font-medium group-hover:text-primary transition-colors">
              #{topic.tag}
            </p>
            <p className="text-xs text-muted-foreground">{topic.posts} posts</p>
          </div>
        ))}
      </div>

      <Button variant="ghost" className="mt-4 w-full text-xs">
        Show More
      </Button>
    </div>
  );
}
