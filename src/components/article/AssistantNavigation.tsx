
import { History, Plus, Settings } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";

export function AssistantNavigation() {
  return (
    <div className="flex items-center gap-4 mb-3 border-b border-border/20 pb-2">
      <div className="flex flex-col items-center">
        <Popover>
          <PopoverTrigger asChild>
            <Button 
              variant="ghost" 
              size="icon" 
              className="h-8 w-8 text-muted-foreground hover:text-foreground hover:bg-accent/50"
            >
              <Plus className="h-4 w-4" />
            </Button>
          </PopoverTrigger>
          <PopoverContent className="w-48 p-2">
            <p className="text-sm">Iniciar uma nova sessão de conversa</p>
          </PopoverContent>
        </Popover>
        <span className="text-xs text-muted-foreground mt-1">Nova conversa</span>
      </div>

      <div className="flex flex-col items-center">
        <Popover>
          <PopoverTrigger asChild>
            <Button 
              variant="ghost" 
              size="icon"
              className="h-8 w-8 text-muted-foreground hover:text-foreground hover:bg-accent/50"
            >
              <History className="h-4 w-4" />
            </Button>
          </PopoverTrigger>
          <PopoverContent className="w-48 p-2">
            <p className="text-sm">Visualizar histórico de conversas anteriores</p>
          </PopoverContent>
        </Popover>
        <span className="text-xs text-muted-foreground mt-1">Histórico</span>
      </div>

      <div className="flex flex-col items-center ml-auto">
        <Popover>
          <PopoverTrigger asChild>
            <Button 
              variant="ghost" 
              size="icon"
              className="h-8 w-8 text-muted-foreground hover:text-foreground hover:bg-accent/50"
            >
              <Settings className="h-4 w-4" />
            </Button>
          </PopoverTrigger>
          <PopoverContent className="w-48 p-2">
            <p className="text-sm">Ajustar configurações do assistente</p>
          </PopoverContent>
        </Popover>
        <span className="text-xs text-muted-foreground mt-1">Configurações</span>
      </div>
    </div>
  );
}
