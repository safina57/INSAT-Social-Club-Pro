import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { ScrollArea } from "@/components/ui/scroll-area"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Badge } from "@/components/ui/badge"
import { Activity } from "lucide-react"
import { ActivityData } from "../types"

interface PlatformActivityProps {
  readonly data?: ActivityData[]
}

export function PlatformActivity({ data }: Readonly<PlatformActivityProps>) {
  return (
    <Card className="col-span-2">
      <CardHeader>
        <CardTitle className="flex items-center justify-between">
          Platform Activity
          <Activity className="h-4 w-4 text-primary" />
        </CardTitle>
        <CardDescription>Real-time platform activity</CardDescription>
      </CardHeader>
      <CardContent>
        {!data ? (
          <div className="flex items-center justify-center h-[250px]">
            <div className="text-center">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto mb-2"></div>
              <p className="text-sm text-muted-foreground">Loading activity data...</p>
            </div>
          </div>
        ) : (
          <ScrollArea className="h-[250px]">
            <div className="space-y-4">
              {data.map((activity, i) => (
                <div key={i} className="flex items-start gap-4 pb-4 border-b border-border last:border-0">
                  <Avatar className="h-9 w-9">
                    <AvatarImage src={activity.user.avatar || "/placeholder.svg"} alt={activity.user.name} />
                    <AvatarFallback>{activity.user.name.charAt(0)}</AvatarFallback>
                  </Avatar>
                  <div className="flex-1 space-y-1">
                    <p className="text-sm">
                      <span className="font-medium">{activity.user.name}</span>{" "}
                      <span className="text-muted-foreground">{activity.action}</span>
                    </p>
                    <div className="flex items-center text-xs text-muted-foreground">
                      <span>{activity.time}</span>
                      {activity.category && (
                        <>
                          <span className="mx-1">•</span>
                          <Badge variant="outline" className="text-xs">
                            {activity.category}
                          </Badge>
                        </>
                      )}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </ScrollArea>
        )}
      </CardContent>
    </Card>
  )
}
