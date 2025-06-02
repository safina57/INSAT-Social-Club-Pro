import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { UserPlus, MoreHorizontal, Edit, Settings } from "lucide-react";
import { useAppSelector } from "@/state/store";
import { useNavigate } from "react-router-dom";
import type { User } from "@/types/profile";

interface ProfileHeaderProps {
  user: User;
}

export function ProfileHeader({ user }: ProfileHeaderProps) {
  const currentUser = useAppSelector((state) => state.global.user);
  const navigate = useNavigate();
  const isOwnProfile = currentUser?.id === user.id;

  const handleEditProfile = () => {
    navigate("/profile/edit");
  };

  return (
    <div className="relative mb-2">
      <div className="h-48 md:h-64 rounded-xl bg-gradient-to-r from-primary/20 to-secondary/20 overflow-hidden"></div>
      <div className="absolute -bottom-16 left-8 flex items-end">
        <Avatar className="h-32 w-32 border-4 border-background">
          <AvatarImage
            src={user.profilePhoto || "/placeholder.svg"}
            alt={user.username}
          />
          <AvatarFallback>{user.username.charAt(0)}</AvatarFallback>
        </Avatar>
      </div>
      <div className="flex justify-end mt-4 md:absolute md:bottom-4 md:right-8 space-x-2">
        {isOwnProfile ? (
          // Buttons for own profile
          <>
            <Button
              variant="outline"
              size="sm"
              className="h-9"
              onClick={handleEditProfile}
            >
              <Edit className="mr-2 h-4 w-4" />
              Edit Profile
            </Button>
            <Button variant="outline" size="sm" className="h-9">
              <Settings className="mr-2 h-4 w-4" />
              Settings
            </Button>
          </>
        ) : (
          // Buttons for other user's profile
          <>
            <Button size="sm" className="h-9">
              <UserPlus className="mr-2 h-4 w-4" />
              Connect
            </Button>
          </>
        )}
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="outline" size="icon" className="h-9 w-9">
              <MoreHorizontal className="h-4 w-4" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent
            align="end"
            className="bg-background/95 backdrop-blur-md border-white/10"
          >
            {isOwnProfile ? (
              // Own profile dropdown options
              <>
                <DropdownMenuItem>View as Others See It</DropdownMenuItem>
                <DropdownMenuItem>Download Profile Data</DropdownMenuItem>
                <DropdownMenuItem>Privacy Settings</DropdownMenuItem>
              </>
            ) : (
              // Other user's profile dropdown options
              <>
                <DropdownMenuItem>Share Profile</DropdownMenuItem>
                <DropdownMenuItem>Report User</DropdownMenuItem>
                <DropdownMenuItem>Block User</DropdownMenuItem>
              </>
            )}
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
    </div>
  );
}
