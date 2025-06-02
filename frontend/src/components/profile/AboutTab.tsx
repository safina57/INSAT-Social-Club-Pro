import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Edit } from "lucide-react";

interface AboutTabProps {
  about: string;
}

export function AboutTab({ about }: AboutTabProps) {
  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center justify-between">
          About
          <Button variant="ghost" size="sm" className="h-8">
            <Edit className="mr-1 h-4 w-4" />
            Edit
          </Button>
        </CardTitle>
      </CardHeader>
      <CardContent>
        <p className="whitespace-pre-line">{about}</p>
      </CardContent>
    </Card>
  );
}
