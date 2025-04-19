
import { History, Plus, Settings } from "lucide-react";
import { Button } from "@/components/ui/button";
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
    <div className="flex items-center gap-4 mb-3 border-b border-border/20 pb-2">
      <div className="flex flex-col items-center">
        <Button 
          variant="ghost" 
          size="icon" 
          className="h-8 w-8 text-muted-foreground hover:text-foreground hover:bg-accent/50"
          onClick={handleNewChat}
        >
          <Plus className="h-4 w-4" />
        </Button>
        <span className="text-xs text-muted-foreground mt-1">Nova conversa</span>
      </div>

      <div className="flex flex-col items-center">
        <Button 
          variant="ghost" 
          size="icon"
          className="h-8 w-8 text-muted-foreground hover:text-foreground hover:bg-accent/50"
          onClick={handleHistory}
        >
          <History className="h-4 w-4" />
        </Button>
        <span className="text-xs text-muted-foreground mt-1">Histórico</span>
      </div>

      <div className="flex flex-col items-center ml-auto">
        <Button 
          variant="ghost" 
          size="icon"
          className="h-8 w-8 text-muted-foreground hover:text-foreground hover:bg-accent/50"
          onClick={handleSettings}
        >
          <Settings className="h-4 w-4" />
        </Button>
        <span className="text-xs text-muted-foreground mt-1">Configurações</span>
      </div>
    </div>
  );
}
