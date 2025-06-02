import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Separator } from "@/components/ui/separator";
import { Plus } from "lucide-react";
import type { Experience } from "@/types/profile";

interface ExperienceTabProps {
  experience: Experience[];
}

export function ExperienceTab({ experience }: ExperienceTabProps) {
  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center justify-between">
          Experience
          <Button variant="ghost" size="sm" className="h-8">
            <Plus className="mr-1 h-4 w-4" />
            Add
          </Button>
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-6">
          {experience.map((exp, index) => (
            <div key={index} className="flex">
              <div className="mr-4 mt-1">
                <Avatar className="h-12 w-12">
                  <AvatarImage
                    src={exp.companyLogo || "/placeholder.svg"}
                    alt={exp.company}
                  />
                  <AvatarFallback>{exp.company.charAt(0)}</AvatarFallback>
                </Avatar>
              </div>
              <div>
                <h3 className="font-medium">{exp.title}</h3>
                <p className="text-sm">{exp.company}</p>
                <p className="text-sm text-muted-foreground">{exp.duration}</p>
                <p className="text-sm text-muted-foreground">{exp.location}</p>
                <p className="mt-2">{exp.description}</p>
                {index < experience.length - 1 && (
                  <Separator className="my-4" />
                )}
              </div>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
}
