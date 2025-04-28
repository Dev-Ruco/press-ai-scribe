
import { MessageSquare, Settings, History, Plus } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useLanguage } from "@/contexts/LanguageContext";

interface AssistantHeaderProps {
  onNewChat?: () => void;
}

export function AssistantHeader({ onNewChat }: AssistantHeaderProps) {
  const { t } = useLanguage();
  
  return (
    <div className="flex flex-col border-b bg-card/90 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="flex items-center justify-between p-3 border-b">
        <div className="flex items-center gap-2">
          <MessageSquare className="h-4 w-4 text-primary/70" />
          <h2 className="text-sm font-medium">
            {t('aiAssistant')}
          </h2>
        </div>
        
        <div className="flex items-center gap-1">
          <Button
            variant="ghost"
            size="icon"
            className="h-7 w-7 text-muted-foreground hover:text-foreground"
            onClick={() => {}}
          >
            <History className="h-4 w-4" />
          </Button>
          <Button
            variant="ghost"
            size="icon"
            className="h-7 w-7 text-muted-foreground hover:text-foreground"
            onClick={() => {}}
          >
            <Settings className="h-4 w-4" />
          </Button>
        </div>
      </div>
      
      {onNewChat && (
        <div className="px-3 py-2 flex justify-end border-b/50">
          <Button
            variant="ghost"
            size="sm"
            onClick={onNewChat}
            className="h-7 px-2 text-xs gap-1.5 hover:bg-primary/5 hover:text-primary"
          >
            <Plus className="h-3.5 w-3.5" />
            {t('newConversation')}
          </Button>
        </div>
      )}
    </div>
  );
}
