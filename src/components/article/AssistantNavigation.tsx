
import { History, Plus, Settings } from "lucide-react";
import { Button } from "@/components/ui/button";

export function AssistantNavigation() {
  return (
    <div className="flex items-center gap-4 mb-3 border-b border-border/20 pb-2">
      <Button 
        variant="ghost" 
        size="icon" 
        className="h-8 w-8 text-muted-foreground hover:text-foreground hover:bg-accent/50"
      >
        <Plus className="h-4 w-4" />
      </Button>

      <Button 
        variant="ghost" 
        size="icon"
        className="h-8 w-8 text-muted-foreground hover:text-foreground hover:bg-accent/50"
      >
        <History className="h-4 w-4" />
      </Button>

      <Button 
        variant="ghost" 
        size="icon"
        className="h-8 w-8 text-muted-foreground hover:text-foreground hover:bg-accent/50 ml-auto"
      >
        <Settings className="h-4 w-4" />
      </Button>
    </div>
  );
}
