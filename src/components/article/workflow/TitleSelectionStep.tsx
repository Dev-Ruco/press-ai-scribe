
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Send, Sparkles, Edit, Check, ArrowUp, Loader2, RefreshCw, AlertTriangle } from "lucide-react";
import { useState, useEffect } from "react";
import { useTitleSuggestions } from "@/hooks/useTitleSuggestions";
import { useToast } from "@/hooks/use-toast";
import { Skeleton } from "@/components/ui/skeleton";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";

interface TitleSelectionStepProps {
  suggestedTitles: string[];
  onTitleSelect: (title: string) => void;
  isProcessing: boolean;
  onNextStep: () => Promise<string | undefined>;
}

export function TitleSelectionStep({ 
  suggestedTitles: defaultTitles, 
  onTitleSelect, 
  isProcessing, 
  onNextStep 
}: TitleSelectionStepProps) {
  const { toast } = useToast();
  const [customTitle, setCustomTitle] = useState("");
  const [isEditing, setIsEditing] = useState(false);
  const [editingTitleIndex, setEditingTitleIndex] = useState<number | null>(null);
  const [selectedTitle, setSelectedTitle] = useState<string | null>(null);
  const [refreshCount, setRefreshCount] = useState(0);
  const [hasShownErrorToast, setHasShownErrorToast] = useState(false);
  
  // Buscar títulos sugeridos diretamente do endpoint
  const { 
    suggestedTitles: backendTitles, 
    isLoading: isLoadingTitles, 
    error, 
    refetch,
    titlesLoaded 
  } = useTitleSuggestions((titles) => {
    // Quando títulos são carregados, atualizar o estado local
    if (titles && titles.length > 0) {
      setEditedTitles(titles);
      
      // Notificar somente na primeira carga ou quando solicitado um refresh manual
      if (refreshCount > 0) {
        toast({
          title: "Títulos atualizados",
          description: `${titles.length} sugestões de título foram recebidas.`,
        });
      }
    }
  });
  
  // Estado local para os títulos editáveis
  const [editedTitles, setEditedTitles] = useState<string[]>([]);
  
  // Show error toast only once
  useEffect(() => {
    if (error && !hasShownErrorToast) {
      toast({
        title: "Erro ao carregar títulos",
        description: "Usando títulos padrão. Você pode tentar atualizar ou criar seu próprio título.",
        variant: "destructive"
      });
      setHasShownErrorToast(true);
    }
  }, [error, hasShownErrorToast, toast]);
  
  // Log para debug na montagem do componente
  useEffect(() => {
    console.log("TitleSelectionStep montado com:", { 
      defaultTitles, 
      backendTitles, 
      titlesLoaded,
      isProcessing,
      editedTitles
    });
  }, [defaultTitles, backendTitles, titlesLoaded, isProcessing, editedTitles]);
  
  // Inicializar com os títulos padrão se disponíveis
  useEffect(() => {
    if (defaultTitles && defaultTitles.length > 0 && editedTitles.length === 0) {
      console.log("Inicializando com títulos padrão:", defaultTitles);
      setEditedTitles(defaultTitles);
    }
  }, [defaultTitles, editedTitles.length]);
  
  // Atualizar títulos quando chegarem do endpoint
  useEffect(() => {
    if (backendTitles && backendTitles.length > 0) {
      console.log("Atualizando títulos da seleção:", backendTitles);
      setEditedTitles(backendTitles);
    }
  }, [backendTitles]);

  // Força uma atualização imediata ao montar o componente
  useEffect(() => {
    console.log("Forçando busca inicial de títulos");
    refetch();
  }, [refetch]);

  const handleCustomTitleSubmit = async () => {
    if (customTitle.trim()) {
      setSelectedTitle(customTitle);
      await onTitleSelect(customTitle);
      onNextStep();
    }
  };

  const handleSelectTitle = async (title: string) => {
    setSelectedTitle(title);
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
    setRefreshCount(prev => prev + 1);
    setHasShownErrorToast(false);
    toast({
      title: "Atualizando títulos",
      description: "Verificando se há novas sugestões de títulos...",
    });
    refetch();
  };

  // Renderizar o estado de carregamento adequado
  const renderLoadingState = () => {
    return (
      <div className="space-y-4">
        {[1, 2, 3].map((i) => (
          <Card key={i} className="hover:border-primary/20 transition-colors bg-card/50">
            <CardContent className="p-4">
              <div className="flex justify-between items-center gap-4">
                <Skeleton className="h-6 flex-1" />
                <div className="flex gap-2">
                  <Skeleton className="h-8 w-16" />
                  <Skeleton className="h-8 w-16" />
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    );
  };

  // Renderizar estado de erro com botão para criar título customizado
  const renderErrorState = () => {
    return (
      <Alert variant="destructive" className="mb-4">
        <AlertTriangle className="h-4 w-4" />
        <AlertTitle>Erro ao carregar títulos</AlertTitle>
        <AlertDescription>
          Não foi possível obter sugestões de títulos do servidor. Você pode criar seu próprio título ou tentar atualizar.
        </AlertDescription>
        <div className="flex gap-2 mt-4 justify-end">
          <Button 
            variant="outline" 
            onClick={handleRefreshTitles} 
            size="sm"
          >
            <RefreshCw className="h-4 w-4 mr-2" />
            Tentar novamente
          </Button>
          <Button
            variant="default"
            onClick={() => setIsEditing(true)}
            size="sm"
          >
            <Edit className="h-4 w-4 mr-2" />
            Criar título
          </Button>
        </div>
      </Alert>
    );
  };

  const hasNoTitles = !isLoadingTitles && editedTitles.length === 0;
  
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

      {/* Show error message if there's an error and we couldn't load titles */}
      {error && editedTitles.length === 0 && renderErrorState()}

      {isEditing ? (
        <Card className="bg-card">
          <CardContent className="p-4">
            <div className="space-y-4">
              <Input
                value={customTitle}
                onChange={(e) => setCustomTitle(e.target.value)}
                placeholder="Digite seu título personalizado..."
                className="text-base"
                autoFocus
              />
              <div className="flex justify-end gap-2">
                <Button 
                  variant="outline" 
                  onClick={() => setIsEditing(false)}
                >
                  Cancelar
                </Button>
                <Button
                  variant="default"
                  onClick={handleCustomTitleSubmit}
                  disabled={!customTitle.trim() || isProcessing}
                >
                  <Send className="h-4 w-4 mr-2" />
                  Usar este título
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>
      ) : (
        <div className="space-y-4">
          {isLoadingTitles ? (
            renderLoadingState()
          ) : editedTitles.length > 0 ? (
            editedTitles.map((title, index) => (
              <Card key={index} className={`hover:border-primary transition-colors bg-card ${selectedTitle === title ? 'border-primary border-2' : ''}`}>
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
          ) : error ? (
            <div className="flex justify-center py-8">
              <div className="flex flex-col items-center text-center">
                <p className="text-destructive mb-2">Erro ao carregar títulos sugeridos</p>
                <p className="text-muted-foreground text-sm mb-4">{error}</p>
                <Button 
                  variant="outline" 
                  onClick={handleRefreshTitles} 
                  className="mt-2"
                >
                  <RefreshCw className="h-4 w-4 mr-2" />
                  Tentar novamente
                </Button>
              </div>
            </div>
          ) : (
            <div className="flex justify-center py-8">
              <div className="flex flex-col items-center">
                <p className="text-muted-foreground mb-2">Nenhuma sugestão de título disponível no momento.</p>
                <p className="text-muted-foreground text-xs mb-4">Estamos aguardando o processamento do seu conteúdo.</p>
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
          {editedTitles.length > 0 && " As sugestões acima foram geradas automaticamente com base no seu conteúdo."}
        </p>
      </div>
    </div>
  );
}
