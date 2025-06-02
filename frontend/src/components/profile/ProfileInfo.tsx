import { Separator } from "@/components/ui/separator";
import { MapPin, Briefcase } from "lucide-react";
import type { User } from "@/types/profile";

interface ProfileInfoProps {
  user: User;
}

export function ProfileInfo({ user }: ProfileInfoProps) {
  return (
    <div className="mt-20 md:mt-4 mb-8 ml-48">
      <div className="flex flex-col md:flex-row md:items-end md:justify-between">
        <div>
          <h1 className="text-3xl font-bold">{user.username}</h1>
          <p className="text-xl text-muted-foreground">
            Senior Product Designer | UX/UI Specialist
          </p>
          <div className="flex items-center mt-2 text-sm text-muted-foreground">
            <MapPin className="mr-1 h-4 w-4" />
            <span>Tunis</span>
            <span className="mx-2">•</span>
            <Briefcase className="mr-1 h-4 w-4" />
            <span>Google</span>
          </div>
        </div>
        <div className="mt-4 md:mt-0 flex items-center space-x-4">
          <div className="text-center">
            <p className="text-2xl font-bold">20</p>
            <p className="text-xs text-muted-foreground">Connections</p>
          </div>
          <Separator orientation="vertical" className="h-10" />
          <div className="text-center">
            <p className="text-2xl font-bold">50</p>
            <p className="text-xs text-muted-foreground">Posts</p>
          </div>
          <Separator orientation="vertical" className="h-10" />
          <div className="text-center">
            <p className="text-2xl font-bold">500</p>
            <p className="text-xs text-muted-foreground">Profile Views</p>
          </div>
        </div>
      </div>
    </div>
  );
}
