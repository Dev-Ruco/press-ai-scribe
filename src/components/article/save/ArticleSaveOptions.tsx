
import { Button } from "@/components/ui/button";

interface ArticleSaveOptionsProps {
  showOptions: boolean;
  hasMessages: boolean;
  isProcessing: boolean;
  onSave: (status: 'Rascunho' | 'Pendente' | 'Publicado') => void;
}

export function ArticleSaveOptions({ 
  showOptions, 
  hasMessages, 
  isProcessing,
  onSave 
}: ArticleSaveOptionsProps) {
  if (!showOptions || !hasMessages) return null;

  return (
    <div className="flex flex-wrap gap-2 justify-end mt-4 border-t pt-4">
      <Button
        variant="outline" 
        size="sm"
        onClick={() => onSave('Rascunho')}
        disabled={isProcessing}
        className="text-sm"
      >
        Salvar como rascunho
      </Button>
      
      <Button
        variant="outline"
        size="sm"
        onClick={() => onSave('Pendente')}
        disabled={isProcessing}
        className="text-sm"
      >
        Marcar como pendente
      </Button>
      
      <Button
        variant="default"
        size="sm"
        onClick={() => onSave('Publicado')}
        disabled={isProcessing}
        className="text-sm"
      >
        Publicar
      </Button>
    </div>
  );
}
