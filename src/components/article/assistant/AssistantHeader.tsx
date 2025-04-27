
import { Plus, History, Settings } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { toast } from "@/hooks/use-toast";

interface AssistantHeaderProps {
  onNewChat: () => void;
}

export function AssistantHeader({ onNewChat }: AssistantHeaderProps) {
  const handleHistoryClick = () => {
    toast({
      title: "Histórico",
      description: "Funcionalidade em desenvolvimento"
    });
  };

  return (
    <div className="flex items-center gap-2 px-3 py-2 border-b">
      <Button 
        variant="ghost" 
        size="icon" 
        className="h-8 w-8 text-muted-foreground hover:text-foreground"
        onClick={onNewChat}
      >
        <Plus className="h-4 w-4" />
      </Button>

      <Button 
        variant="ghost" 
        size="icon"
        className="h-8 w-8 text-muted-foreground hover:text-foreground"
        onClick={handleHistoryClick}
      >
        <History className="h-4 w-4" />
      </Button>

      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button 
            variant="ghost" 
            size="icon"
            className="h-8 w-8 text-muted-foreground hover:text-foreground ml-auto"
          >
            <Settings className="h-4 w-4" />
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="end" className="w-56 bg-white">
          <DropdownMenuLabel>Configurações do Assistente</DropdownMenuLabel>
          <DropdownMenuSeparator />
          <DropdownMenuItem className="bg-white hover:bg-accent">
            GPT-4
          </DropdownMenuItem>
          <DropdownMenuItem className="bg-white hover:bg-accent">
            GPT-3.5 Turbo
          </DropdownMenuItem>
          <DropdownMenuSeparator />
          <DropdownMenuItem className="bg-white hover:bg-accent">
            Configurações avançadas
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>
    </div>
  );
}
