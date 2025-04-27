
import { MessageSquare } from "lucide-react";
import { Button } from "@/components/ui/button";

interface AssistantHeaderProps {
  onNewChat?: () => void;
}

export function AssistantHeader({ onNewChat }: AssistantHeaderProps) {
  return (
    <div className="flex items-center justify-between p-3 border-b bg-card/90 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="flex items-center gap-2">
        <MessageSquare className="h-4 w-4 text-primary/70" />
        <h2 className="text-sm font-medium">Assistente de Criação</h2>
      </div>
      
      {onNewChat && (
        <Button
          variant="ghost"
          size="sm"
          onClick={onNewChat}
          className="h-7 px-2 text-xs hover:bg-primary/5 hover:text-primary"
        >
          Nova conversa
        </Button>
      )}
    </div>
  );
}
