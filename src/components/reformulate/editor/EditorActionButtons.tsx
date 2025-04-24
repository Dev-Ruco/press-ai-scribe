
import { Button } from "@/components/ui/button";
import { Save, Clock, Check, Wand2 } from "lucide-react";
import { 
  DropdownMenu,
  DropdownMenuTrigger,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator
} from "@/components/ui/dropdown-menu";
import { 
  Tooltip,
  TooltipContent,
  TooltipTrigger,
  TooltipProvider
} from "@/components/ui/tooltip";

interface EditorActionButtonsProps {
  onReformulate: () => void;
  onSave: (status: 'Rascunho' | 'Pendente' | 'Publicado') => void;
  onGenerateTest?: () => void;
  isGenerating: boolean;
  isSaving: boolean;
  hasContent: boolean;
  showUserActions: boolean;
}

export function EditorActionButtons({
  onReformulate,
  onSave,
  onGenerateTest,
  isGenerating,
  isSaving,
  hasContent,
  showUserActions
}: EditorActionButtonsProps) {
  return (
    <div className="flex items-center gap-2">
      {showUserActions && (
        <>
          <TooltipProvider>
            <Tooltip>
              <TooltipTrigger asChild>
                <Button 
                  variant="outline"
                  size="sm"
                  className="h-9 px-3 gap-1.5 text-muted-foreground hover:text-foreground"
                  disabled={isGenerating}
                  onClick={onGenerateTest}
                >
                  <Clock className="h-4 w-4" />
                  Teste
                </Button>
              </TooltipTrigger>
              <TooltipContent>Gerar artigo de teste</TooltipContent>
            </Tooltip>
          </TooltipProvider>

          <DropdownMenu>
            <TooltipProvider>
              <Tooltip>
                <TooltipTrigger asChild>
                  <DropdownMenuTrigger asChild>
                    <Button 
                      variant="outline"
                      size="sm"
                      disabled={!hasContent || isSaving}
                      className="h-9 px-3 gap-1.5 text-muted-foreground hover:text-foreground"
                    >
                      {isSaving ? (
                        <div className="h-4 w-4 border-2 border-t-transparent border-current rounded-full animate-spin" />
                      ) : (
                        <Save className="h-4 w-4" />
                      )}
                      Salvar
                    </Button>
                  </DropdownMenuTrigger>
                </TooltipTrigger>
                <TooltipContent>Opções de salvamento</TooltipContent>
              </Tooltip>
            </TooltipProvider>

            <DropdownMenuContent align="end" className="w-56">
              <DropdownMenuItem 
                onClick={() => onSave('Rascunho')}
                className="flex items-center gap-2"
              >
                <Clock className="h-4 w-4 text-muted-foreground" />
                Salvar como Rascunho
              </DropdownMenuItem>
              
              <DropdownMenuItem 
                onClick={() => onSave('Pendente')}
                className="flex items-center gap-2"
              >
                <Clock className="h-4 w-4 text-amber-500" />
                Marcar como Pendente
              </DropdownMenuItem>
              
              <DropdownMenuSeparator />
              
              <DropdownMenuItem 
                onClick={() => onSave('Publicado')}
                className="flex items-center gap-2 text-green-600"
              >
                <Check className="h-4 w-4" />
                Publicar Agora
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </>
      )}
      
      <Button 
        size="sm"
        className="h-9 px-4 gap-2 bg-primary hover:bg-primary/90" 
        onClick={onReformulate} 
        disabled={!hasContent || isGenerating}
      >
        {isGenerating ? (
          <div className="h-4 w-4 border-2 border-t-transparent border-white rounded-full animate-spin" />
        ) : (
          <Wand2 className="h-4 w-4" />
        )}
        Reformular
      </Button>
    </div>
  );
}
