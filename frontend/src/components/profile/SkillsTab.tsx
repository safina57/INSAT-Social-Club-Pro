import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { Plus } from "lucide-react";
import type { Skill } from "@/types/profile";

interface SkillsTabProps {
  skills: Skill[];
}

export function SkillsTab({ skills }: SkillsTabProps) {
  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center justify-between">
          Skills & Endorsements
          <Button variant="ghost" size="sm" className="h-8">
            <Plus className="mr-1 h-4 w-4" />
            Add
          </Button>
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {skills.map((skill, index) => (
            <div key={index}>
              <div className="flex items-center justify-between">
                <h3 className="font-medium">{skill.name}</h3>
                <Badge variant="outline">
                  {skill.endorsements} endorsements
                </Badge>
              </div>
              <div className="mt-1 flex flex-wrap gap-2">
                {skill.endorsedBy.map((person, i) => (
                  <Avatar key={i} className="h-6 w-6 border border-white/10">
                    <AvatarImage
                      src={person.avatar || "/placeholder.svg"}
                      alt={person.name}
                    />
                    <AvatarFallback>{person.name.charAt(0)}</AvatarFallback>
                  </Avatar>
                ))}
              </div>
              {index < skills.length - 1 && <Separator className="my-4" />}
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
}
