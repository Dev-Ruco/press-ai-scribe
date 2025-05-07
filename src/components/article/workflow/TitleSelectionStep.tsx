
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Send, Sparkles, Edit, Check, ArrowUp, Loader2, RefreshCw, AlertTriangle, PlusCircle } from "lucide-react";
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
  const [retryCount, setRetryCount] = useState(0);
  
  // Fetch suggested titles directly from endpoint
  const { 
    suggestedTitles: backendTitles, 
    isLoading: isLoadingTitles, 
    error, 
    refetch,
    titlesLoaded 
  } = useTitleSuggestions((titles) => {
    // When titles are loaded, update local state
    if (titles && titles.length > 0) {
      setEditedTitles(titles);
      
      // Only notify on first load or when manually refreshed
      if (refreshCount > 0) {
        toast({
          title: "Títulos atualizados",
          description: `${titles.length} sugestões de título foram recebidas.`,
        });
      }
    }
  });
  
  // Local state for editable titles
  const [editedTitles, setEditedTitles] = useState<string[]>([]);
  
  // Show error toast only once
  useEffect(() => {
    if (error && !hasShownErrorToast) {
      toast({
        title: "Utilizando títulos armazenados localmente",
        description: "Não foi possível conectar ao servidor para obter novas sugestões.",
        variant: "default" // Changed from destructive to be less alarming
      });
      setHasShownErrorToast(true);
    }
  }, [error, hasShownErrorToast, toast]);
  
  // Debug log on component mount
  useEffect(() => {
    console.log("TitleSelectionStep montado com:", { 
      defaultTitles, 
      backendTitles, 
      titlesLoaded,
      isProcessing,
      editedTitles,
      error
    });
  }, [defaultTitles, backendTitles, titlesLoaded, isProcessing, editedTitles, error]);
  
  // Initialize with default titles if available
  useEffect(() => {
    if (defaultTitles && defaultTitles.length > 0 && editedTitles.length === 0) {
      console.log("Inicializando com títulos padrão:", defaultTitles);
      setEditedTitles(defaultTitles);
    }
  }, [defaultTitles, editedTitles.length]);
  
  // Update titles when they arrive from endpoint
  useEffect(() => {
    if (backendTitles && backendTitles.length > 0) {
      console.log("Atualizando títulos da seleção:", backendTitles);
      setEditedTitles(backendTitles);
    }
  }, [backendTitles]);

  // Force an immediate update on component mount, with retry logic
  useEffect(() => {
    console.log("Forçando busca inicial de títulos");
    
    // Staggered retries with exponential backoff
    const retryTimes = [500, 2000, 5000]; // 0.5s, 2s, 5s
    
    // Clear any existing timers on component mount/unmount
    const timers: NodeJS.Timeout[] = [];
    
    // Schedule initial fetch after a small delay
    const initialTimer = setTimeout(() => {
      refetch().catch(console.error);
    }, retryTimes[0]);
    
    timers.push(initialTimer);
    
    // If we still don't have titles after the first attempt, try again with increasing delays
    if (retryCount < retryTimes.length - 1) {
      const nextRetryTimer = setTimeout(() => {
        console.log(`Retry ${retryCount + 1} for titles`);
        setRetryCount(prev => prev + 1);
        refetch().catch(console.error);
      }, retryTimes[retryCount + 1]);
      
      timers.push(nextRetryTimer);
    }
    
    // Cleanup function to clear all timers
    return () => {
      timers.forEach(timer => clearTimeout(timer));
    };
  }, [refetch, retryCount]);

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

  const handleCreateTitle = () => {
    setIsEditing(true);
    setCustomTitle("");
  };

  // Render appropriate loading state
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

  // Render error state with button to create custom title
  const renderErrorState = () => {
    return (
      <Alert variant="default" className="mb-4 border-amber-500 bg-amber-50 dark:bg-amber-950/30">
        <AlertTriangle className="h-4 w-4 text-amber-600" />
        <AlertTitle className="text-amber-700">Usando títulos armazenados localmente</AlertTitle>
        <AlertDescription className="text-amber-600">
          Não foi possível obter novas sugestões de títulos do servidor. Você pode continuar usando as sugestões atuais, criar seu próprio título ou tentar atualizar.
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
            onClick={handleCreateTitle}
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
          <div className="flex gap-2">
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
            <Button
              variant="default"
              size="sm"
              onClick={handleCreateTitle}
              className="whitespace-nowrap"
            >
              <PlusCircle className="h-4 w-4 mr-2" />
              Criar Título
            </Button>
          </div>
        </div>
      </div>

      {/* Show warning message if there's an error but we have fallback titles */}
      {error && editedTitles.length > 0 && renderErrorState()}
      
      {/* Show error message if there's an error and we have no titles at all */}
      {error && editedTitles.length === 0 && (
        <Alert variant="destructive" className="mb-4">
          <AlertTriangle className="h-4 w-4" />
          <AlertTitle>Erro ao carregar títulos</AlertTitle>
          <AlertDescription>
            Não foi possível obter sugestões de títulos. Crie seu próprio título ou tente atualizar.
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
              onClick={handleCreateTitle}
              size="sm"
            >
              <Edit className="h-4 w-4 mr-2" />
              Criar título
            </Button>
          </div>
        </Alert>
      )}

      {isEditing ? (
        <Card className="bg-card/70 border-primary/30">
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
          {isLoadingTitles && editedTitles.length === 0 ? (
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
                    <div className="flex gap-2 flex-shrink-0">
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
          ) : (
            <div className="flex justify-center py-8">
              <div className="flex flex-col items-center">
                <p className="text-muted-foreground mb-2">Nenhuma sugestão de título disponível no momento.</p>
                <p className="text-muted-foreground text-xs mb-4">Crie seu próprio título ou tente atualizar.</p>
                <div className="flex gap-2">
                  <Button 
                    variant="outline" 
                    onClick={handleRefreshTitles} 
                    className="mt-2"
                  >
                    <RefreshCw className="h-4 w-4 mr-2" />
                    Verificar novamente
                  </Button>
                  <Button
                    variant="default"
                    onClick={handleCreateTitle}
                    className="mt-2"
                  >
                    <Edit className="h-4 w-4 mr-2" />
                    Criar título
                  </Button>
                </div>
              </div>
            </div>
          )}
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
