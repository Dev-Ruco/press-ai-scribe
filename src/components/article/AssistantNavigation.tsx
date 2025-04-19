
import { History, Plus, Settings } from "lucide-react";
import { Button } from "@/components/ui/button";

export function AssistantNavigation() {
  return (
    <div className="flex items-center gap-1 mb-3 border-b border-border/20 pb-2">
      <Button 
        variant="ghost" 
        size="icon" 
        className="h-8 w-8 text-muted-foreground hover:text-foreground"
      >
        <Plus className="h-4 w-4" />
      </Button>
      <Button 
        variant="ghost" 
        size="icon"
        className="h-8 w-8 text-muted-foreground hover:text-foreground"
      >
        <History className="h-4 w-4" />
      </Button>
      <Button 
        variant="ghost" 
        size="icon"
        className="h-8 w-8 ml-auto text-muted-foreground hover:text-foreground"
      >
        <Settings className="h-4 w-4" />
      </Button>
    </div>
  );
}
