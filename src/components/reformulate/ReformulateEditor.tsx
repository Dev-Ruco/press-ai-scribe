
import { useState, useRef, useEffect } from "react";
import { Card, CardHeader, CardTitle, CardContent, CardFooter } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Wand2, Save, Clock, Upload, Check } from "lucide-react";
import { Textarea } from "@/components/ui/textarea";
import { 
  Tooltip,
  TooltipContent,
  TooltipTrigger,
  TooltipProvider
} from "@/components/ui/tooltip";
import { useAuth } from "@/contexts/AuthContext";
import { Input } from "@/components/ui/input";
import { 
  DropdownMenu,
  DropdownMenuTrigger,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator
} from "@/components/ui/dropdown-menu";

interface ReformulateEditorProps {
  onSave?: (data: {
    title: string;
    content: string;
    status: 'Rascunho' | 'Pendente' | 'Publicado';
    type?: string;
  }) => Promise<any>;
  onGenerateTest?: () => Promise<any>;
  isSaving?: boolean;
}

export function ReformulateEditor({ onSave, onGenerateTest, isSaving = false }: ReformulateEditorProps) {
  const [content, setContent] = useState("");
  const [title, setTitle] = useState("");
  const [isExpanded, setIsExpanded] = useState(false);
  const [isGenerating, setIsGenerating] = useState(false);
  const [hasLineNumbers, setHasLineNumbers] = useState(true);
  const textareaRef = useRef<HTMLTextAreaElement>(null);
  const { user } = useAuth();

  // Handle text area auto-resize
  useEffect(() => {
    if (textareaRef.current && isExpanded) {
      textareaRef.current.style.height = "auto";
      const maxHeight = window.innerHeight * 0.7;
      const newHeight = Math.min(textareaRef.current.scrollHeight, maxHeight);
      textareaRef.current.style.height = `${newHeight}px`;
    }
  }, [content, isExpanded]);

  const handleReformulate = async () => {
    if (!content.trim()) return;
    
    setIsGenerating(true);
    
    // Simulate AI processing
    const originalContent = content;
    setContent("Processando conteúdo...");
    
    setTimeout(() => {
      // Simulate reformulated content with line numbers
      const lines = originalContent.split("\n");
      const reformulatedContent = lines.map((line, i) => {
        // Simple reformulation for demo purposes
        const improved = line
          .replace(/muito/g, "extremamente")
          .replace(/bom/g, "excelente")
          .replace(/ruim/g, "inadequado")
          .replace(/grande/g, "substancial");
          
        return improved;
      }).join("\n");
      
      setContent(reformulatedContent);
      setIsGenerating(false);
    }, 2000);
  };

  const handleSaveArticle = async (status: 'Rascunho' | 'Pendente' | 'Publicado') => {
    if (!onSave) return;
    
    if (!title.trim()) {
      // Generate a title if none exists
      const generatedTitle = content.trim().split('\n')[0].slice(0, 50) + (content.trim().split('\n')[0].length > 50 ? '...' : '');
      await onSave({
        title: generatedTitle,
        content,
        status
      });
    } else {
      await onSave({
        title,
        content,
        status
      });
    }
  };

  const renderLineNumbers = () => {
    if (!hasLineNumbers) return null;
    
    const lines = content.split('\n');
    return (
      <div className="absolute left-0 top-0 pr-3 text-right text-xs text-muted-foreground select-none">
        {lines.map((_, i) => (
          <div key={i} className="h-6">
            {i + 1}
          </div>
        ))}
      </div>
    );
  };

  return (
    <Card className="h-full flex flex-col">
      <CardHeader className="border-b">
        <div className="flex items-center justify-between">
          <div className="flex-1">
            <Input
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="Título do artigo (opcional)"
              className="text-lg font-semibold bg-transparent border-0 border-b border-transparent focus:border-border/30 rounded-none px-0 focus-visible:ring-0 w-full"
            />
          </div>
          <div className="flex items-center gap-2">
            {user && (
              <>
                <TooltipProvider>
                  <Tooltip>
                    <TooltipTrigger asChild>
                      <Button 
                        variant="outline" 
                        size="sm" 
                        disabled={isGenerating}
                        onClick={onGenerateTest}
                      >
                        <Clock className="h-4 w-4 mr-1" />
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
                            disabled={!content.trim() || isSaving}
                            className="flex items-center gap-1.5"
                          >
                            {isSaving ? (
                              <div className="h-3 w-3 border-2 border-t-transparent border-current rounded-full animate-spin" />
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

                  <DropdownMenuContent align="end">
                    <DropdownMenuItem 
                      onClick={() => handleSaveArticle('Rascunho')}
                      className="flex items-center gap-2"
                    >
                      <Clock className="h-4 w-4 text-muted-foreground" />
                      Salvar como Rascunho
                    </DropdownMenuItem>
                    
                    <DropdownMenuItem 
                      onClick={() => handleSaveArticle('Pendente')}
                      className="flex items-center gap-2"
                    >
                      <Clock className="h-4 w-4 text-amber-500" />
                      Marcar como Pendente
                    </DropdownMenuItem>
                    
                    <DropdownMenuSeparator />
                    
                    <DropdownMenuItem 
                      onClick={() => handleSaveArticle('Publicado')}
                      className="flex items-center gap-2"
                    >
                      <Check className="h-4 w-4 text-green-500" />
                      Publicar Agora
                    </DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
              </>
            )}
            
            <Button className="gap-2" onClick={handleReformulate} disabled={!content.trim() || isGenerating}>
              {isGenerating ? (
                <div className="h-4 w-4 border-2 border-t-transparent border-current rounded-full animate-spin" />
              ) : (
                <Wand2 className="h-4 w-4" />
              )}
              Reformular
            </Button>
          </div>
        </div>
      </CardHeader>
      <CardContent className="flex-1 p-0 relative overflow-auto">
        <div className="relative">
          {hasLineNumbers && (
            <div className="absolute left-0 top-0 bottom-0 w-10 bg-muted/20 border-r border-border/20"></div>
          )}
          <Textarea
            ref={textareaRef}
            value={content}
            onChange={(e) => setContent(e.target.value)}
            placeholder="Cole ou digite o conteúdo que deseja reformular..."
            className={`h-full min-h-[500px] rounded-none border-0 resize-none focus-visible:ring-0 transition-all pr-4 ${hasLineNumbers ? 'pl-12' : 'pl-4'}`}
            onFocus={() => setIsExpanded(true)}
            onBlur={() => {
              if (!content) {
                setIsExpanded(false);
              }
            }}
            style={{
              height: isExpanded ? `${Math.min(textareaRef.current?.scrollHeight || 500, window.innerHeight * 0.7)}px` : '500px'
            }}
          />
        </div>
      </CardContent>
      <CardFooter className="border-t py-2 px-4 flex justify-between">
        <Button 
          variant="ghost" 
          size="sm"
          onClick={() => setHasLineNumbers(!hasLineNumbers)}
          className="text-xs text-muted-foreground"
        >
          {hasLineNumbers ? "Ocultar" : "Mostrar"} números de linha
        </Button>
        <div className="text-xs text-muted-foreground">
          {content.split('\n').length} linhas | {content.length} caracteres
        </div>
      </CardFooter>
    </Card>
  );
}
