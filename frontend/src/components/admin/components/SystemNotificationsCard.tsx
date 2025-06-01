import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { ScrollArea } from "@/components/ui/scroll-area"
import { Bell, Flag, Activity, Users } from "lucide-react"
import { NotificationData } from "../types"

interface SystemNotificationsCardProps {
  readonly data: NotificationData[]
}

const getIcon = (iconName: string) => {
  switch (iconName) {
    case "bell":
      return <Bell className="h-5 w-5" />
    case "flag":
      return <Flag className="h-5 w-5" />
    case "activity":
      return <Activity className="h-5 w-5" />
    case "users":
      return <Users className="h-5 w-5" />
    default:
      return <Bell className="h-5 w-5" />
  }
}

const getNotificationStyle = (type: "info" | "warning" | "error") => {
  if (type === "warning") return "bg-amber-500/20 text-amber-500"
  if (type === "error") return "bg-red-500/20 text-red-500"
  return "bg-primary/20 text-primary"
}

export function SystemNotificationsCard({ data }: Readonly<SystemNotificationsCardProps>) {
  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between">
        <div>
          <CardTitle>System Notifications</CardTitle>
          <CardDescription>Recent alerts and notifications</CardDescription>
        </div>
        <Button variant="ghost" size="sm" className="text-primary">
          Mark All Read
        </Button>
      </CardHeader>
      <CardContent>
        <ScrollArea className="h-[300px]">
          <div className="space-y-4">
            {data.map((notification, i) => (
              <div key={`notification-${notification.title}-${i}`} className="flex items-start gap-4 pb-4 border-b border-border last:border-0">
                <div className={`h-9 w-9 rounded-full flex items-center justify-center ${getNotificationStyle(notification.type)}`}>
                  {getIcon(notification.iconName)}
                </div>
                <div className="flex-1 space-y-1">
                  <p className="text-sm font-medium">{notification.title}</p>
                  <p className="text-sm text-muted-foreground">{notification.description}</p>
                  <p className="text-xs text-muted-foreground">{notification.time}</p>
                </div>
              </div>
            ))}
          </div>
        </ScrollArea>
      </CardContent>
    </Card>
  )
}
