
import { useState, useEffect, useRef, useCallback } from "react";
import { ProcessingOverlay } from "../processing/ProcessingOverlay";
import { useToast } from "@/hooks/use-toast";
import { submitArticleToN8N, UploadedFile } from "@/utils/articleSubmissionUtils";
import { useAuth } from "@/contexts/AuthContext";
import { useProgressiveAuth } from "@/hooks/useProgressiveAuth";
import { useTitleSuggestions } from "@/hooks/useTitleSuggestions";

interface ArticleSubmissionHandlerProps {
  content: string;
  articleType: {
    label: string;
    id: string;
    structure?: string[];
  };
  uploadedFiles: UploadedFile[];
  savedLinks: Array<{ url: string; id: string }>;
  onWorkflowUpdate: (data: any) => void;
  onNextStep: () => void;
  children: (props: { handleSubmit: () => void; isProcessing: boolean }) => React.ReactNode;
}

export function ArticleSubmissionHandler({
  content,
  articleType,
  uploadedFiles,
  savedLinks,
  onWorkflowUpdate,
  onNextStep,
  children
}: ArticleSubmissionHandlerProps) {
  const { toast } = useToast();
  const [isProcessing, setIsProcessing] = useState(false);
  const [processingStatus, setProcessingStatus] = useState<{
    stage: 'uploading' | 'analyzing' | 'waiting' | 'completed' | 'error';
    progress: number;
    message: string;
    error?: string;
  }>({
    stage: 'uploading',
    progress: 0,
    message: ''
  });
  
  // Timer para controlar quanto tempo passou desde o início do processamento
  const [elapsedTime, setElapsedTime] = useState(0);
  const intervalRef = useRef<number | null>(null);
  
  // Referência para controlar o número de tentativas de polling
  const pollingAttemptsRef = useRef(0);
  const maxPollingAttempts = 20; // Número máximo de tentativas
  
  // Estado para armazenar um ID de timeout para limpar quando necessário
  const timeoutRef = useRef<NodeJS.Timeout | null>(null);
  
  const { user } = useAuth();
  const { requireAuth } = useProgressiveAuth();
  
  // Limpeza dos timers ao desmontar o componente
  useEffect(() => {
    return () => {
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
      }
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current);
      }
    };
  }, []);
  
  // Iniciar timer quando começar o processamento
  useEffect(() => {
    if (isProcessing) {
      setElapsedTime(0); // Resetar o tempo
      
      // Iniciar o intervalo para atualizar o tempo decorrido
      intervalRef.current = window.setInterval(() => {
        setElapsedTime(prevTime => prevTime + 1);
      }, 1000);
    } else {
      // Parar o intervalo quando não estiver mais processando
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
        intervalRef.current = null;
      }
    }
    
    return () => {
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
      }
    };
  }, [isProcessing]);
  
  // Gerar mensagens baseadas no tempo que está passando
  useEffect(() => {
    if (!isProcessing) return;
    
    if (elapsedTime === 30 && processingStatus.stage === 'analyzing') {
      updateProcessingStatus('waiting', 82, 'Aguardando resposta do servidor...');
    }
    else if (elapsedTime === 60 && processingStatus.stage === 'waiting') {
      updateProcessingStatus('waiting', 85, 'O processamento está demorando mais que o esperado. Continuamos aguardando resposta.');
    }
    else if (elapsedTime === 120 && processingStatus.stage === 'waiting') {
      updateProcessingStatus('waiting', 90, 'Processamento em andamento. A geração de títulos pode levar alguns minutos.');
    }
    else if (elapsedTime === 180 && processingStatus.stage === 'waiting') {
      updateProcessingStatus('waiting', 94, 'Quase lá! Finalizando o processamento dos dados...');
    }
  }, [elapsedTime, isProcessing, processingStatus.stage]);
  
  // Usar o callback onTitlesLoaded para reagir às atualizações de títulos
  const handleTitlesLoaded = useCallback((titles: string[]) => {
    console.log("ArticleSubmissionHandler: Títulos carregados detectados:", titles);
    
    if (titles && titles.length > 0 && isProcessing) {
      console.log("ArticleSubmissionHandler: Atualizando workflow com títulos e confirmação do agente");
      
      // Atualizar workflow com os títulos e marcar processamento como concluído
      onWorkflowUpdate({
        content: content,
        links: savedLinks.map(link => link.url),
        files: uploadedFiles,
        articleType: articleType,
        agentConfirmed: true,
        suggestedTitles: titles,
        isProcessing: false
      });
      
      // Mostrar status concluído
      updateProcessingStatus('completed', 100, 'Processamento concluído! Avançando para seleção de título...');
      
      // Finalizar processamento após um pequeno delay para o usuário ver a mensagem de sucesso
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current);
      }
      
      timeoutRef.current = setTimeout(() => {
        setIsProcessing(false);
        // Resetar o timer
        if (intervalRef.current) {
          clearInterval(intervalRef.current);
          intervalRef.current = null;
        }
      }, 1500);
    }
  }, [content, savedLinks, uploadedFiles, articleType, isProcessing, onWorkflowUpdate]);
  
  const { suggestedTitles, refetch: refetchTitles, titlesLoaded } = useTitleSuggestions(handleTitlesLoaded);

  // Monitorar titlesLoaded para responder quando os títulos estiverem disponíveis
  useEffect(() => {
    console.log("ArticleSubmissionHandler: Monitorando estado titlesLoaded:", titlesLoaded);
    console.log("ArticleSubmissionHandler: Títulos disponíveis:", suggestedTitles);
    
    if (titlesLoaded && suggestedTitles.length > 0 && isProcessing) {
      console.log("Títulos carregados durante processamento, tentando avançar workflow");
      handleTitlesLoaded(suggestedTitles);
    }
  }, [titlesLoaded, suggestedTitles, isProcessing, handleTitlesLoaded]);

  // Update processing status
  const updateProcessingStatus = (
    stage: 'uploading' | 'analyzing' | 'waiting' | 'completed' | 'error',
    progress: number,
    message: string,
    error?: string
  ) => {
    setProcessingStatus({
      stage,
      progress,
      message,
      error
    });
    
    // Only finish processing if stage is error or we explicitly choose to complete
    if (stage === 'error') {
      // Pequeno atraso antes de fechar
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current);
      }
      timeoutRef.current = setTimeout(() => setIsProcessing(false), 2500);
    }
  };

  // Função para realizar polling dos títulos
  const pollForTitles = useCallback(async () => {
    if (!isProcessing) return;
    
    // Incrementar o contador de tentativas
    pollingAttemptsRef.current += 1;
    console.log(`Polling para títulos: tentativa ${pollingAttemptsRef.current} de ${maxPollingAttempts}`);
    
    try {
      // Buscar títulos
      const titles = await refetchTitles();
      
      // Se encontrou títulos, processar e avançar
      if (titles && titles.length > 0) {
        console.log("Títulos encontrados durante polling:", titles);
        
        // Atualizar workflow
        onWorkflowUpdate({
          content: content,
          links: savedLinks.map(link => link.url),
          files: uploadedFiles,
          articleType: articleType,
          agentConfirmed: true,
          suggestedTitles: titles,
          isProcessing: false
        });
        
        // Mostrar status concluído
        updateProcessingStatus('completed', 100, 'Processamento concluído! Avançando para seleção de título...');
        
        // Atraso antes de finalizar o processamento
        if (timeoutRef.current) {
          clearTimeout(timeoutRef.current);
        }
        timeoutRef.current = setTimeout(() => {
          setIsProcessing(false);
        }, 1500);
        
        return true;
      }
      
      // Se atingiu o número máximo de tentativas sem encontrar títulos
      if (pollingAttemptsRef.current >= maxPollingAttempts) {
        console.log("Máximo de tentativas atingido. Usando títulos padrão.");
        
        // Usar títulos fallback
        const fallbackTitles = [
          "Como as energias renováveis estão transformando o setor elétrico",
          "O futuro da energia sustentável: desafios e oportunidades",
          "Inovação e sustentabilidade no setor energético",
          "Energia limpa: um caminho para o desenvolvimento sustentável",
          "Revolução energética: o papel das fontes renováveis"
        ];
        
        // Atualizar workflow com os títulos fallback
        onWorkflowUpdate({
          content: content,
          links: savedLinks.map(link => link.url),
          files: uploadedFiles,
          articleType: articleType,
          agentConfirmed: true,
          suggestedTitles: fallbackTitles,
          isProcessing: false
        });
        
        // Mostrar status completo mas com mensagem sobre fallback
        updateProcessingStatus('completed', 100, 'Processamento completado com títulos padrão.');
        
        // Atraso antes de finalizar o processamento
        if (timeoutRef.current) {
          clearTimeout(timeoutRef.current);
        }
        timeoutRef.current = setTimeout(() => {
          setIsProcessing(false);
        }, 1500);
        
        return true;
      }
      
      // Se ainda não encontrou e não atingiu o máximo, continuar tentando
      return false;
    } catch (error) {
      console.error("Erro ao buscar títulos durante polling:", error);
      
      // Se for a última tentativa, usar fallback
      if (pollingAttemptsRef.current >= maxPollingAttempts) {
        console.log("Erro no polling final, usando títulos fallback");
        
        // Usar títulos fallback
        const fallbackTitles = [
          "Como as energias renováveis estão transformando o setor elétrico",
          "O futuro da energia sustentável: desafios e oportunidades",
          "Inovação e sustentabilidade no setor energético",
          "Energia limpa: um caminho para o desenvolvimento sustentável",
          "Revolução energética: o papel das fontes renováveis"
        ];
        
        // Atualizar workflow e finalizar
        onWorkflowUpdate({
          content: content,
          links: savedLinks.map(link => link.url),
          files: uploadedFiles,
          articleType: articleType,
          agentConfirmed: true,
          suggestedTitles: fallbackTitles,
          isProcessing: false
        });
        
        updateProcessingStatus('completed', 100, 'Processamento concluído com títulos padrão.');
        
        if (timeoutRef.current) {
          clearTimeout(timeoutRef.current);
        }
        timeoutRef.current = setTimeout(() => {
          setIsProcessing(false);
        }, 1500);
        
        return true;
      }
      
      return false;
    }
  }, [isProcessing, refetchTitles, content, savedLinks, uploadedFiles, articleType, onWorkflowUpdate]);

  // Configurar polling regular
  useEffect(() => {
    if (isProcessing && (processingStatus.stage === 'analyzing' || processingStatus.stage === 'waiting')) {
      const pollInterval = setInterval(async () => {
        const success = await pollForTitles();
        if (success) {
          clearInterval(pollInterval);
        }
      }, 5000); // Verificar a cada 5 segundos
      
      return () => clearInterval(pollInterval);
    }
  }, [isProcessing, processingStatus.stage, pollForTitles]);

  const handleSubmit = () => {
    const hasContent = content.trim().length > 0;
    const hasFiles = uploadedFiles.length > 0;
    const hasLinks = savedLinks.length > 0;
    
    if (!hasContent && !hasFiles && !hasLinks) {
      toast({
        variant: "destructive",
        title: "Conteúdo vazio",
        description: "Por favor, adicione texto, arquivos ou links antes de enviar."
      });
      return;
    }
    
    // Check for incomplete uploads
    const incompleteUploads = uploadedFiles.filter(file => file.status !== 'completed');
    if (incompleteUploads.length > 0) {
      toast({
        variant: "destructive",
        title: "Uploads em andamento",
        description: `Aguarde a conclusão de ${incompleteUploads.length} upload(s) antes de enviar.`
      });
      return;
    }

    requireAuth(async () => {
      try {
        // Resetar o contador de tentativas de polling
        pollingAttemptsRef.current = 0;
        
        setIsProcessing(true);
        updateProcessingStatus('uploading', 10, 'Iniciando envio...');
        
        // Checar se já temos títulos disponíveis
        if (titlesLoaded && suggestedTitles.length > 0) {
          console.log("Já temos títulos disponíveis, atualizando workflow imediatamente");
          handleTitlesLoaded(suggestedTitles);
          return;
        }
        
        // Sequência de atualizações de status para melhorar o feedback
        updateProcessingStatus('uploading', 20, 'Preparando dados para processamento...');
        
        setTimeout(() => {
          if (isProcessing) {
            updateProcessingStatus('uploading', 35, 'Enviando conteúdo para análise...');
          }
        }, 1000);
        
        setTimeout(() => {
          if (isProcessing) {
            updateProcessingStatus('analyzing', 50, '🧠 Analisando conteúdo...');
          }
        }, 3000);
        
        setTimeout(() => {
          if (isProcessing) {
            updateProcessingStatus('analyzing', 65, '🧠 Estruturando informações...');
          }
        }, 6000);
        
        setTimeout(() => {
          if (isProcessing) {
            updateProcessingStatus('analyzing', 75, '🧠 Gerando sugestões de títulos...');
          }
        }, 10000);
        
        // Function to check for titles and advance workflow
        const checkAndAdvanceWorkflow = async (forceFetch = false) => {
          console.log("Checking for titles to advance workflow...");
          
          // If we already have titles loaded or forceFetch is true, try to get them
          let titles = suggestedTitles;
          if (forceFetch || titles.length === 0) {
            console.log("Fetching fresh titles...");
            titles = await refetchTitles();
          }
          
          // If we have titles, advance the workflow
          if (titles && titles.length > 0) {
            console.log("Títulos encontrados, atualizando workflow:", titles);
            
            // Update workflow with title suggestions and prepare to move to next step
            onWorkflowUpdate({
              content: content,
              links: savedLinks.map(link => link.url),
              files: uploadedFiles,
              articleType: articleType,
              agentConfirmed: true,
              suggestedTitles: titles,
              isProcessing: false
            });
            
            // Show completed status before advancing
            updateProcessingStatus('completed', 100, 'Processamento concluído! Avançando para seleção de título...');
            
            // Short delay before finishing processing
            if (timeoutRef.current) {
              clearTimeout(timeoutRef.current);
            }
            timeoutRef.current = setTimeout(() => {
              setIsProcessing(false);
            }, 1500);
            
            return true;
          }
          
          return false;
        };
        
        // Attempt to check for titles immediately if they're already loaded
        if (await checkAndAdvanceWorkflow()) {
          // If we already advanced, no need to continue with the submission
          console.log("Workflow advanced with existing titles");
          return;
        }
        
        // Submit to n8n for processing
        const result = await submitArticleToN8N(
          content,
          articleType.label || "Artigo",
          uploadedFiles,
          savedLinks.map(link => link.url),
          (stage, progress, message, error) => {
            // Mapear estágio do processamento para os estados do componente
            let componentStage: 'uploading' | 'analyzing' | 'waiting' | 'completed' | 'error';
            
            switch (stage) {
              case 'uploading':
                componentStage = 'uploading';
                break;
              case 'analyzing':
              case 'extracting':
              case 'organizing':
                componentStage = 'analyzing';
                break;
              case 'completed':
                componentStage = 'completed';
                break;
              case 'error':
                componentStage = 'error';
                break;
              default:
                componentStage = 'waiting';
            }
            
            updateProcessingStatus(componentStage, progress, message, error);
          },
          async (suggestedTitles) => {
            // If n8n directly returned titles, use them
            if (suggestedTitles && suggestedTitles.length > 0) {
              console.log("Títulos recebidos diretamente do n8n:", suggestedTitles);
              
              // Try to advance with these titles
              if (await checkAndAdvanceWorkflow(true)) {
                return;
              }
            } else {
              // Se n8n não retornou títulos, mudar para estado de espera
              updateProcessingStatus('waiting', 80, 'Aguardando processamento do servidor...');
            }
            
            // Configurar sistema de polling para verificar por títulos
            // (já implementado no useEffect com pollForTitles)
          }
        );
        
        // Se o fluxo chegou até aqui, mudar para o estado de espera
        // já que agora estamos aguardando por resultados do servidor
        updateProcessingStatus('waiting', 80, 'Aguardando processamento dos dados...');
        
        // If submitArticleToN8N returned an error, handle it
        if (!result.success) {
          if (timeoutRef.current) {
            clearTimeout(timeoutRef.current);
          }
          throw new Error(result.status.error || "Falha no envio");
        }
        
      } catch (error) {
        console.error('Error submitting content:', error);
        toast({
          title: "Erro",
          description: error.message || "Ocorreu um erro ao processar sua solicitação",
          variant: "destructive",
        });
        
        updateProcessingStatus('error', 0, 
          'Ocorreu um erro durante o processamento. Por favor, tente novamente.',
          error.message || "Erro desconhecido"
        );
        
        if (timeoutRef.current) {
          clearTimeout(timeoutRef.current);
        }
        timeoutRef.current = setTimeout(() => {
          setIsProcessing(false);
        }, 3000);
      }
    });
  };

  // Add retry functionality
  const handleRetry = () => {
    // Resetar contador de tentativas
    pollingAttemptsRef.current = 0;
    
    // Limpar qualquer timeout existente
    if (timeoutRef.current) {
      clearTimeout(timeoutRef.current);
      timeoutRef.current = null;
    }
    
    // Simply call handleSubmit again
    handleSubmit();
  };

  return (
    <>
      {children({ 
        handleSubmit, 
        isProcessing 
      })}
      
      {/* Processing overlay */}
      {isProcessing && (
        <ProcessingOverlay
          isVisible={isProcessing}
          currentStage={processingStatus.stage}
          progress={processingStatus.progress}
          statusMessage={processingStatus.message}
          error={processingStatus.error}
          onCancel={() => {
            if (timeoutRef.current) {
              clearTimeout(timeoutRef.current);
            }
            if (intervalRef.current) {
              clearInterval(intervalRef.current);
              intervalRef.current = null;
            }
            setIsProcessing(false);
          }}
          onRetry={handleRetry}
          elapsedTime={elapsedTime}
        />
      )}
    </>
  );
}
