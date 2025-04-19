
import { History, Plus, Settings } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Tooltip, TooltipContent, TooltipTrigger } from "@/components/ui/tooltip";
import { useToast } from "@/hooks/use-toast";

export function AssistantNavigation() {
  const { toast } = useToast();

  const handleNewChat = () => {
    toast({
      title: "Nova conversa iniciada",
      description: "Uma nova sessão de chat foi criada"
    });
  };

  const handleHistory = () => {
    toast({
      title: "Histórico",
      description: "Visualizando histórico de conversas"
    });
  };

  const handleSettings = () => {
    toast({
      title: "Configurações",
      description: "Abrindo configurações do assistente"
    });
  };

  return (
    <div className="flex items-center gap-1 mb-3 border-b border-border/20 pb-2">
      <Tooltip>
        <TooltipTrigger asChild>
          <Button 
            variant="ghost" 
            size="icon" 
            className="h-8 w-8 text-muted-foreground hover:text-foreground hover:bg-accent/50"
            onClick={handleNewChat}
          >
            <Plus className="h-4 w-4" />
          </Button>
        </TooltipTrigger>
        <TooltipContent>Nova conversa</TooltipContent>
      </Tooltip>

      <Tooltip>
        <TooltipTrigger asChild>
          <Button 
            variant="ghost" 
            size="icon"
            className="h-8 w-8 text-muted-foreground hover:text-foreground hover:bg-accent/50"
            onClick={handleHistory}
          >
            <History className="h-4 w-4" />
          </Button>
        </TooltipTrigger>
        <TooltipContent>Histórico</TooltipContent>
      </Tooltip>

      <Tooltip>
        <TooltipTrigger asChild>
          <Button 
            variant="ghost" 
            size="icon"
            className="h-8 w-8 ml-auto text-muted-foreground hover:text-foreground hover:bg-accent/50"
            onClick={handleSettings}
          >
            <Settings className="h-4 w-4" />
          </Button>
        </TooltipTrigger>
        <TooltipContent>Configurações</TooltipContent>
      </Tooltip>
    </div>
  );
}
