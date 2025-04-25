
import { Card, CardContent } from "@/components/ui/card";
import { Bell } from "lucide-react";
import { Button } from "@/components/ui/button";

export function FeatureAnnouncement() {
  return (
    <Card className="bg-primary/5 border-primary/10">
      <CardContent className="p-4">
        <div className="flex items-start gap-3">
          <div className="p-2 rounded-full bg-primary/10">
            <Bell className="h-5 w-5 text-primary" />
          </div>
          <div className="flex-1">
            <h3 className="font-medium text-sm mb-1">Nova funcionalidade disponível!</h3>
            <p className="text-sm text-muted-foreground mb-3">
              Teste hoje a pré-visualização inline de multimédia!
            </p>
            <Button variant="outline" size="sm">
              Experimentar
            </Button>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
