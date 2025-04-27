
import { History, Plus, Settings } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useToast } from "@/hooks/use-toast";

interface AssistantNavigationProps {
  onNewChat?: () => void;
  onHistory?: () => void;
  onSettings?: () => void;
}

export function AssistantNavigation({ 
  onNewChat = () => {}, 
  onHistory = () => {},
  onSettings = () => {}
}: AssistantNavigationProps) {
  const { toast } = useToast();
  
  const handleNewChat = () => {
    toast({
      title: "Nova conversa",
      description: "Iniciando uma nova conversa com o assistente"
    });
    onNewChat();
  };
  
  const handleHistory = () => {
    toast({
      title: "Histórico",
      description: "Acessando histórico de conversas"
    });
    onHistory();
  };
  
  const handleSettings = () => {
    toast({
      title: "Configurações",
      description: "Abrindo configurações do assistente"
    });
    onSettings();
  };
  
  return (
    <div className="flex items-center gap-4 mb-3 border-b border-border/20 pb-2">
      <Button 
        variant="ghost" 
        size="icon" 
        className="h-8 w-8 text-muted-foreground hover:text-foreground hover:bg-accent/50"
        onClick={handleNewChat}
      >
        <Plus className="h-4 w-4" />
      </Button>

      <Button 
        variant="ghost" 
        size="icon"
        className="h-8 w-8 text-muted-foreground hover:text-foreground hover:bg-accent/50"
        onClick={handleHistory}
      >
        <History className="h-4 w-4" />
      </Button>

      <Button 
        variant="ghost" 
        size="icon"
        className="h-8 w-8 text-muted-foreground hover:text-foreground hover:bg-accent/50 ml-auto"
        onClick={handleSettings}
      >
        <Settings className="h-4 w-4" />
      </Button>
    </div>
  );
}
