import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { useAppSelector } from "@/state/store";
import { useNavigate } from "react-router-dom";

export default function ProfileCard() {
  const user = useAppSelector((state) => state.global.user);
  const navigate = useNavigate();

  // Get user initials for avatar fallback
  const getUserInitials = (username: string) => {
    return username.toUpperCase().slice(0, 2);
  };

  // Handle navigation to profile page
  const handleViewProfile = () => {
    if (user?.id) {
      navigate(`/profile/${user.id}`);
    }
  };

  return (
    <div className="rounded-xl bg-background/40 backdrop-blur-md p-6 shadow-lg border border-white/10 sticky top-8">
      <div className="flex flex-col items-center text-center">
        <div className="relative">
          <Avatar className="h-20 w-20 border-4 border-primary/50">
            <AvatarImage
              src="/placeholder.svg?height=80&width=80"
              alt={user?.username || "User"}
            />
            <AvatarFallback>
              {user ? getUserInitials(user.username) : "U"}
            </AvatarFallback>
          </Avatar>
          <div className="absolute -bottom-1 -right-1 rounded-full bg-primary p-1">
            <div className="h-3 w-3 rounded-full bg-background" />
          </div>
        </div>
        <h3 className="mt-4 text-xl font-bold">{user?.username || "User"}</h3>
        <p className="text-sm text-muted-foreground">
          {user?.role || "Member"}
        </p>

        <div className="mt-6 w-full space-y-4">
          <div className="grid grid-cols-3 gap-4 text-center">
            <div>
              <p className="text-lg font-bold">245</p>
              <p className="text-xs text-muted-foreground">Connections</p>
            </div>
            <div>
              <p className="text-lg font-bold">35</p>
              <p className="text-xs text-muted-foreground">Posts</p>
            </div>
            <div>
              <p className="text-lg font-bold">128</p>
              <p className="text-xs text-muted-foreground">Likes</p>
            </div>
          </div>

          <Separator />

          <Button
            variant="outline"
            className="w-full"
            onClick={handleViewProfile}
          >
            View Profile
          </Button>
        </div>
      </div>
    </div>
  );
}
