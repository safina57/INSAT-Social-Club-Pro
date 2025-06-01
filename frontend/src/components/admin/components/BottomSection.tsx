import { RecentUsersCard } from "./RecentUsersCard"
import { SystemNotificationsCard } from "./SystemNotificationsCard"
import { recentUsers, notifications } from "../data/mockData"

export function BottomSection() {
  return (
    <div className="grid gap-4 md:grid-cols-2">
      <RecentUsersCard data={recentUsers} />
      <SystemNotificationsCard data={notifications} />
    </div>
  )
}
