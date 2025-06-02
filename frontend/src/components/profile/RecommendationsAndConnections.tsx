import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { ScrollArea } from "@/components/ui/scroll-area";
import type { Recommendation, Connection } from "@/types/profile";

interface RecommendationsAndConnectionsProps {
  recommendations: Recommendation[];
  topConnections: Connection[];
}

export function RecommendationsAndConnections({
  recommendations,
  topConnections,
}: RecommendationsAndConnectionsProps) {
  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
      <Card className="md:col-span-2">
        <CardHeader>
          <CardTitle>Recommendations</CardTitle>
          <CardDescription>
            Professional recommendations and testimonials
          </CardDescription>
        </CardHeader>
        <CardContent>
          <ScrollArea className="h-[300px]">
            <div className="space-y-6">
              {recommendations.map((rec, index) => (
                <div
                  key={index}
                  className="pb-4 border-b border-border last:border-0"
                >
                  <div className="flex items-start space-x-4">
                    <Avatar>
                      <AvatarImage
                        src={rec.author.avatar || "/placeholder.svg"}
                        alt={rec.author.name}
                      />
                      <AvatarFallback>
                        {rec.author.name.charAt(0)}
                      </AvatarFallback>
                    </Avatar>
                    <div>
                      <h4 className="font-medium">{rec.author.name}</h4>
                      <p className="text-sm text-muted-foreground">
                        {rec.author.title}
                      </p>
                      <p className="mt-2">{rec.content}</p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </ScrollArea>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Connections</CardTitle>
          <CardDescription>People in your professional network</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-3 gap-2">
            {topConnections.map((connection, index) => (
              <div
                key={index}
                className="flex flex-col items-center text-center"
              >
                <Avatar className="h-14 w-14 mb-2">
                  <AvatarImage
                    src={connection.avatar || "/placeholder.svg"}
                    alt={connection.name}
                  />
                  <AvatarFallback>{connection.name.charAt(0)}</AvatarFallback>
                </Avatar>
                <p className="text-xs font-medium truncate w-full">
                  {connection.name}
                </p>
                <p className="text-xs text-muted-foreground truncate w-full">
                  {connection.title}
                </p>
              </div>
            ))}
          </div>
          <Button variant="outline" className="w-full mt-4">
            See all connections
          </Button>
        </CardContent>
      </Card>
    </div>
  );
}
