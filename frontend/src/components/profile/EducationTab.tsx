import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Separator } from "@/components/ui/separator";
import { Plus } from "lucide-react";
import type { Education } from "@/types/profile";

interface EducationTabProps {
  education: Education[];
}

export function EducationTab({ education }: EducationTabProps) {
  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center justify-between">
          Education
          <Button variant="ghost" size="sm" className="h-8">
            <Plus className="mr-1 h-4 w-4" />
            Add
          </Button>
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-6">
          {education.map((edu, index) => (
            <div key={index} className="flex">
              <div className="mr-4 mt-1">
                <Avatar className="h-12 w-12">
                  <AvatarImage
                    src={edu.schoolLogo || "/placeholder.svg"}
                    alt={edu.school}
                  />
                  <AvatarFallback>{edu.school.charAt(0)}</AvatarFallback>
                </Avatar>
              </div>
              <div>
                <h3 className="font-medium">{edu.school}</h3>
                <p className="text-sm">{edu.degree}</p>
                <p className="text-sm text-muted-foreground">{edu.duration}</p>
                <p className="mt-2">{edu.description}</p>
                {index < education.length - 1 && <Separator className="my-4" />}
              </div>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
}
