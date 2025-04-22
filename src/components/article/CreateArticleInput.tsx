
import { Plus, Globe, Lightbulb, Mic, Paperclip } from "lucide-react";
import { Button } from "@/components/ui/button";

export function CreateArticleInput() {
  return (
    <div className="max-w-3xl mx-auto">
      <div className="relative">
        <div className="relative flex items-center gap-2 p-2 bg-background/50 border border-border/40 rounded-2xl shadow-sm backdrop-blur supports-[backdrop-filter]:bg-background/30">
          <input
            className="flex-1 px-4 py-3 bg-transparent border-none text-base placeholder:text-muted-foreground focus:outline-none"
            placeholder="Escreva algo ou use os comandos abaixo..."
          />
          
          <div className="flex items-center gap-1 px-2">
            <Button 
              variant="ghost" 
              size="icon"
              className="h-9 w-9 rounded-full text-muted-foreground hover:text-foreground"
            >
              <Plus className="h-4 w-4" />
            </Button>
            
            <Button
              variant="ghost"
              size="icon"
              className="h-9 w-9 rounded-full text-muted-foreground hover:text-foreground"
            >
              <Globe className="h-4 w-4" />
            </Button>
            
            <Button
              variant="ghost"
              size="icon"
              className="h-9 w-9 rounded-full text-muted-foreground hover:text-foreground"
            >
              <Lightbulb className="h-4 w-4" />
            </Button>
            
            <Button
              variant="ghost"
              size="icon"
              className="h-9 w-9 rounded-full text-muted-foreground hover:text-foreground"
            >
              <Paperclip className="h-4 w-4" />
            </Button>

            <div className="w-[1px] h-6 mx-2 bg-border/40" />
            
            <Button
              size="icon"
              className="h-9 w-9 rounded-full bg-primary hover:bg-primary/90"
            >
              <Mic className="h-4 w-4" />
            </Button>
          </div>
        </div>

        <div className="mt-4 min-h-[200px] p-4 bg-background/50 border border-border/40 rounded-xl">
          <p className="text-muted-foreground text-sm">
            O conteúdo gerado aparecerá aqui...
          </p>
        </div>
      </div>
    </div>
  );
}
