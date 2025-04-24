
import { Button } from "@/components/ui/button";
import { FileText, List } from "lucide-react";

interface EditorFooterProps {
  hasLineNumbers: boolean;
  onToggleLineNumbers: () => void;
  contentStats: {
    lines: number;
    characters: number;
  };
}

export function EditorFooter({
  hasLineNumbers,
  onToggleLineNumbers,
  contentStats
}: EditorFooterProps) {
  // Calculate estimated reading time (average reading speed: 250 words per minute)
  // Improve word count calculation by analyzing actual content
  const wordCount = contentStats.characters > 0 
    ? Math.max(1, Math.ceil(contentStats.characters / 5.5)) // Average characters per word 
    : 0;
  
  const readingTimeMinutes = Math.max(1, Math.round(wordCount / 250));
  
  return (
    <div className="border-t py-2 px-4 flex justify-between items-center bg-slate-50/50">
      <Button 
        variant="ghost" 
        size="sm"
        onClick={onToggleLineNumbers}
        className="text-xs text-muted-foreground hover:bg-slate-100 flex items-center gap-1.5"
      >
        <List className="h-3.5 w-3.5" />
        {hasLineNumbers ? "Ocultar" : "Mostrar"} números de linha
      </Button>
      <div className="text-xs text-muted-foreground flex items-center gap-2">
        <div className="flex items-center gap-1">
          <FileText className="h-3.5 w-3.5 text-muted-foreground/70" />
          <span>{contentStats.lines} linhas</span>
        </div>
        <span className="text-muted-foreground/50">•</span>
        <span>{wordCount} palavras</span>
        <span className="text-muted-foreground/50">•</span>
        <span>{contentStats.characters} caracteres</span>
        {contentStats.characters > 0 && (
          <>
            <span className="text-muted-foreground/50">•</span>
            <span>Leitura: ~{readingTimeMinutes} min</span>
          </>
        )}
      </div>
    </div>
  );
}
