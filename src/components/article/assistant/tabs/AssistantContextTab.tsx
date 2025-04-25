
import { Plus, Copy } from "lucide-react";
import { Button } from "@/components/ui/button";
import { ScrollArea } from "@/components/ui/scroll-area";
import { ContextSuggestion } from "../types";

interface AssistantContextTabProps {
  suggestions: ContextSuggestion[];
  onUseSuggestion: (suggestion: ContextSuggestion) => void;
  onUseCitation: (text: string, source: string) => void;
}

export function AssistantContextTab({ 
  suggestions, 
  onUseSuggestion, 
  onUseCitation 
}: AssistantContextTabProps) {
  return (
    <ScrollArea className="flex-1">
      <div className="p-3 space-y-3">
        {suggestions.map((suggestion, index) => (
          <div key={index} className="border rounded-md overflow-hidden bg-card/50 backdrop-blur supports-[backdrop-filter]:bg-card/30 hover:border-primary/30 transition-colors">
            <div className="bg-muted/20 p-2 border-b">
              <h3 className="font-medium text-sm">{suggestion.title}</h3>
              <div className="text-xs text-muted-foreground">{suggestion.source}</div>
            </div>
            <div className="p-3">
              <p className="text-sm mb-2">{suggestion.excerpt}</p>
              <div className="flex justify-end gap-2">
                <Button 
                  size="sm" 
                  variant="outline"
                  className="text-xs h-7"
                  onClick={() => onUseCitation(suggestion.excerpt, suggestion.source)}
                >
                  <Copy className="h-3.5 w-3.5 mr-1.5" />
                  Citar
                </Button>
                <Button 
                  size="sm" 
                  variant="default"
                  className="text-xs h-7"
                  onClick={() => onUseSuggestion(suggestion)}
                >
                  <Plus className="h-3.5 w-3.5 mr-1.5" />
                  Usar no Artigo
                </Button>
              </div>
            </div>
          </div>
        ))}
      </div>
    </ScrollArea>
  );
}
