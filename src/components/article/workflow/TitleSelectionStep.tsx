
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Send, Sparkles, Edit, Check, ArrowUp, Loader2, RefreshCw } from "lucide-react";
import { useState, useEffect } from "react";
import { useTitleSuggestions } from "@/hooks/useTitleSuggestions";
import { useToast } from "@/hooks/use-toast";

interface TitleSelectionStepProps {
  suggestedTitles: string[];
  onTitleSelect: (title: string) => void;
  isProcessing: boolean;
  onNextStep: () => Promise<string | undefined>;
}

export function TitleSelectionStep({ suggestedTitles: defaultTitles, onTitleSelect, isProcessing, onNextStep }: TitleSelectionStepProps) {
  const { toast } = useToast();
  const [customTitle, setCustomTitle] = useState("");
  const [isEditing, setIsEditing] = useState(false);
  const [editingTitleIndex, setEditingTitleIndex] = useState<number | null>(null);
  const [isLoadingInitially, setIsLoadingInitially] = useState(true);
  
  // Buscar títulos sugeridos do backend
  const { 
    suggestedTitles: backendTitles, 
    isLoading: isLoadingTitles, 
    error, 
    refetch 
  } = useTitleSuggestions();
  
  // Estado local para os títulos editáveis
  const [editedTitles, setEditedTitles] = useState<string[]>([...defaultTitles]);
  
  // Atualizar títulos quando chegarem do backend
  useEffect(() => {
    if (backendTitles && backendTitles.length > 0) {
      setEditedTitles(backendTitles);
      setIsLoadingInitially(false);
      toast({
        title: "Títulos atualizados",
        description: `${backendTitles.length} sugestões de título foram recebidas.`,
      });
    } else {
      // Se passaram 3 segundos e não temos títulos do backend, usar os padrões
      const timer = setTimeout(() => {
        if (editedTitles.length === 0 && defaultTitles.length > 0) {
          setEditedTitles([...defaultTitles]);
        }
        setIsLoadingInitially(false);
      }, 3000);
      
      return () => clearTimeout(timer);
    }
  }, [backendTitles, toast, defaultTitles, editedTitles.length]);
  
  // Usar os títulos padrão quando não há sugestões do backend
  useEffect(() => {
    if (editedTitles.length === 0 && defaultTitles.length > 0) {
      setEditedTitles([...defaultTitles]);
      setIsLoadingInitially(false);
    }
  }, [defaultTitles, editedTitles.length]);

  // Efeito para verificar títulos automaticamente após montagem
  useEffect(() => {
    // Aguardar um pouco para verificar se temos títulos
    const timer = setTimeout(() => {
      if (editedTitles.length === 0 && backendTitles.length === 0) {
        refetch();
      }
    }, 1000);
    
    return () => clearTimeout(timer);
  }, [refetch, editedTitles.length, backendTitles.length]);

  const handleCustomTitleSubmit = async () => {
    if (customTitle.trim()) {
      await onTitleSelect(customTitle);
      onNextStep();
    }
  };

  const handleSelectTitle = async (title: string) => {
    await onTitleSelect(title);
    onNextStep();
  };

  const handleEditTitle = (index: number, newTitle: string) => {
    const newTitles = [...editedTitles];
    newTitles[index] = newTitle;
    setEditedTitles(newTitles);
  };

  const handleSaveEdit = (index: number) => {
    setEditingTitleIndex(null);
  };

  const handleRefreshTitles = () => {
    setIsLoadingInitially(true);
    refetch();
    toast({
      title: "Atualizando títulos",
      description: "Verificando se há novas sugestões de títulos...",
    });
  };

  return (
    <div className="space-y-6 border border-border/30 rounded-2xl shadow-sm p-6 bg-background">
      <div className="border-l-4 border-primary pl-4 py-2">
        <div className="flex justify-between items-center">
          <div>
            <h3 className="text-lg font-medium">Escolha o Título</h3>
            <p className="text-sm text-muted-foreground">Selecione uma sugestão ou crie seu próprio título</p>
          </div>
          <Button 
            variant="outline" 
            size="sm" 
            onClick={handleRefreshTitles}
            disabled={isLoadingTitles}
          >
            {isLoadingTitles ? (
              <Loader2 className="h-4 w-4 animate-spin mr-2" />
            ) : (
              <RefreshCw className="h-4 w-4 mr-2" />
            )}
            Atualizar
          </Button>
        </div>
      </div>

      {isEditing ? (
        <Card className="bg-card">
          <CardContent className="p-4">
            <div className="space-y-4">
              <Input
                value={customTitle}
                onChange={(e) => setCustomTitle(e.target.value)}
                placeholder="Digite seu título personalizado..."
                className="text-base"
              />
              <div className="flex justify-end gap-2">
                <Button 
                  variant="outline" 
                  onClick={() => setIsEditing(false)}
                >
                  Cancelar
                </Button>
                <Button
                  variant="outline"
                  onClick={handleCustomTitleSubmit}
                  disabled={!customTitle.trim() || isProcessing}
                >
                  <Send className="h-4 w-4 mr-2" />
                  Enviar
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>
      ) : (
        <div className="space-y-4">
          {editedTitles.length > 0 ? (
            editedTitles.map((title, index) => (
              <Card key={index} className="hover:border-primary transition-colors bg-card">
                <CardContent className="p-4">
                  <div className="flex justify-between items-center gap-4">
                    {editingTitleIndex === index ? (
                      <Input
                        value={title}
                        onChange={(e) => handleEditTitle(index, e.target.value)}
                        className="flex-1"
                        autoFocus
                      />
                    ) : (
                      <p className="text-base flex-1">{title}</p>
                    )}
                    <div className="flex gap-2">
                      {editingTitleIndex === index ? (
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => handleSaveEdit(index)}
                        >
                          <Check className="h-4 w-4 mr-1" />
                          Salvar
                        </Button>
                      ) : (
                        <>
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => setEditingTitleIndex(index)}
                          >
                            <Edit className="h-4 w-4 mr-1" />
                            Editar
                          </Button>
                          <Button
                            variant="default"
                            size="sm"
                            onClick={() => handleSelectTitle(title)}
                            disabled={isProcessing}
                          >
                            <ArrowUp className="h-4 w-4 mr-1" />
                            Usar este título
                          </Button>
                        </>
                      )}
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))
          ) : isLoadingInitially || isLoadingTitles ? (
            <div className="flex justify-center py-8">
              <div className="flex flex-col items-center">
                <Loader2 className="h-8 w-8 animate-spin text-primary mb-2" />
                <p className="text-muted-foreground">Carregando sugestões de títulos...</p>
              </div>
            </div>
          ) : (
            <div className="flex justify-center py-8">
              <div className="flex flex-col items-center">
                <p className="text-muted-foreground mb-2">Nenhuma sugestão de título disponível.</p>
                <Button 
                  variant="outline" 
                  onClick={handleRefreshTitles} 
                  className="mt-2"
                >
                  <RefreshCw className="h-4 w-4 mr-2" />
                  Verificar novamente
                </Button>
              </div>
            </div>
          )}
          
          <Button 
            variant="outline" 
            className="w-full" 
            onClick={() => setIsEditing(true)}
          >
            <Edit className="h-4 w-4 mr-2" />
            Criar Título Personalizado
          </Button>
        </div>
      )}

      <div className="bg-muted p-4 rounded-lg">
        <div className="flex items-center gap-2">
          <Sparkles className="h-5 w-5 text-primary" />
          <h4 className="font-medium">Dica do Assistente</h4>
        </div>
        <p className="text-sm text-muted-foreground mt-2">
          Um bom título deve ser conciso e informativo. Use entre 50-60 caracteres para melhor SEO.
          {backendTitles.length > 0 && " As sugestões acima foram geradas automaticamente com base no seu conteúdo."}
        </p>
      </div>
    </div>
  );
}
