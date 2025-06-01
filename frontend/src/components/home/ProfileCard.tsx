import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";

export default function ProfileCard() {
  return (
    <div className="rounded-xl bg-background/40 backdrop-blur-md p-6 shadow-lg border border-white/10 sticky top-8">
      <div className="flex flex-col items-center text-center">
        <div className="relative">
          <Avatar className="h-20 w-20 border-4 border-primary/50">
            <AvatarImage
              src="/placeholder.svg?height=80&width=80"
              alt="Current User"
            />
            <AvatarFallback>CU</AvatarFallback>
          </Avatar>
          <div className="absolute -bottom-1 -right-1 rounded-full bg-primary p-1">
            <div className="h-3 w-3 rounded-full bg-background" />
          </div>
        </div>
        <h3 className="mt-4 text-xl font-bold">Current User</h3>
        <p className="text-sm text-muted-foreground">Software Engineer</p>

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

          <Button variant="outline" className="w-full">
            View Profile
          </Button>
        </div>
      </div>
    </div>
  );
}
