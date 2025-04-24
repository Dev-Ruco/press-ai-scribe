
import { Button } from "@/components/ui/button";

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
  return (
    <div className="border-t py-2 px-4 flex justify-between">
      <Button 
        variant="ghost" 
        size="sm"
        onClick={onToggleLineNumbers}
        className="text-xs text-muted-foreground"
      >
        {hasLineNumbers ? "Ocultar" : "Mostrar"} números de linha
      </Button>
      <div className="text-xs text-muted-foreground">
        {contentStats.lines} linhas | {contentStats.characters} caracteres
      </div>
    </div>
  );
}
