
import { Card, CardContent } from "@/components/ui/card";
import { Bell } from "lucide-react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

export function FeatureAnnouncement() {
  return (
    <Card className="bg-gradient-to-r from-primary/5 to-blue-500/5 border-primary/10 overflow-hidden relative backdrop-blur-sm">
      <div className="absolute inset-0 bg-grid-white/5 [mask-image:linear-gradient(0deg,white,rgba(255,255,255,0.5))] pointer-events-none" />
      
      <div className="absolute h-20 w-20 bg-blue-500/10 rounded-full blur-xl right-0 top-0 translate-x-1/2 -translate-y-1/2" />
      <div className="absolute h-8 w-32 bg-primary/10 rounded-full blur-lg left-10 bottom-0 translate-y-1/2" />
      
      <CardContent className="p-4 relative">
        <div className="flex items-start gap-3">
          <div className="p-2 rounded-full bg-gradient-to-br from-primary/20 to-blue-500/20 relative group">
            <div className={cn(
              "absolute inset-0 rounded-full animate-ping bg-primary/10 duration-1000",
              "group-hover:bg-primary/20 group-hover:animate-none"
            )} />
            <Bell className="h-5 w-5 text-primary relative" />
          </div>
          <div className="flex-1">
            <h3 className="font-medium text-sm mb-1 text-primary-dark">Nova funcionalidade disponível!</h3>
            <p className="text-sm text-muted-foreground mb-3">
              Teste hoje a pré-visualização inline de multimédia!
            </p>
            <Button 
              variant="outline" 
              size="sm"
              className="border-primary/20 hover:border-primary/40 bg-gradient-to-r from-transparent to-primary/5 hover:bg-gradient-to-r hover:from-transparent hover:to-primary/10 transition-all"
            >
              Experimentar
            </Button>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
