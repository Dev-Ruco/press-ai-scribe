
import { MessageSquare, Settings, History, Plus } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useLanguage } from "@/contexts/LanguageContext";
import { 
  Tooltip,
  TooltipContent,
  TooltipTrigger 
} from "@/components/ui/tooltip";
import { cn } from "@/lib/utils";

interface AssistantHeaderProps {
  onNewChat?: () => void;
}

export function AssistantHeader({ onNewChat }: AssistantHeaderProps) {
  const { t } = useLanguage();
  
  return (
    <div className="flex flex-col border-b bg-card/90 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="flex items-center justify-between p-2 border-b">
        <div className="flex items-center gap-1.5">
          <MessageSquare className="h-4 w-4 text-primary/70" />
          <h2 className="text-sm font-medium truncate">
            {t('aiAssistant')}
          </h2>
        </div>
        
        <div className="flex items-center gap-1">
          <Tooltip>
            <TooltipTrigger asChild>
              <Button
                variant="ghost"
                size="icon"
                className="h-6 w-6 text-muted-foreground hover:text-foreground"
                onClick={() => {}}
              >
                <History className="h-3.5 w-3.5" />
              </Button>
            </TooltipTrigger>
            <TooltipContent>
              <p>{t('history')}</p>
            </TooltipContent>
          </Tooltip>
          
          <Tooltip>
            <TooltipTrigger asChild>
              <Button
                variant="ghost"
                size="icon"
                className="h-6 w-6 text-muted-foreground hover:text-foreground"
                onClick={() => {}}
              >
                <Settings className="h-3.5 w-3.5" />
              </Button>
            </TooltipTrigger>
            <TooltipContent>
              <p>{t('settings')}</p>
            </TooltipContent>
          </Tooltip>
        </div>
      </div>
      
      {onNewChat && (
        <div className={cn(
          "px-2 py-1.5 flex justify-end border-b/50"
        )}>
          <Button
            variant="ghost"
            size="sm"
            onClick={onNewChat}
            className="h-6 px-2 text-xs gap-1 hover:bg-primary/5 hover:text-primary"
          >
            <Plus className="h-3 w-3" />
            <span className="truncate">{t('newConversation')}</span>
          </Button>
        </div>
      )}
    </div>
  );
}
