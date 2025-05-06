
import { useState, useEffect } from "react";
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
    stage: 'uploading' | 'analyzing' | 'completed' | 'error';
    progress: number;
    message: string;
    error?: string;
  }>({
    stage: 'uploading',
    progress: 0,
    message: ''
  });
  
  const { user } = useAuth();
  const { requireAuth } = useProgressiveAuth();
  
  // Usar o callback onTitlesLoaded para reagir às atualizações de títulos
  const handleTitlesLoaded = (titles: string[]) => {
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
      
      // Finalizar processamento e avançar
      setTimeout(() => {
        setIsProcessing(false);
      }, 500);
    }
  };
  
  const { suggestedTitles, refetch: refetchTitles, titlesLoaded } = useTitleSuggestions(handleTitlesLoaded);

  // Monitorar titlesLoaded para responder quando os títulos estiverem disponíveis
  useEffect(() => {
    console.log("ArticleSubmissionHandler: Monitorando estado titlesLoaded:", titlesLoaded);
    console.log("ArticleSubmissionHandler: Títulos disponíveis:", suggestedTitles);
    
    if (titlesLoaded && suggestedTitles.length > 0 && isProcessing) {
      console.log("Títulos carregados durante processamento, tentando avançar workflow");
      handleTitlesLoaded(suggestedTitles);
    }
  }, [titlesLoaded, suggestedTitles, isProcessing]);

  // Update processing status
  const updateProcessingStatus = (
    stage: 'uploading' | 'analyzing' | 'completed' | 'error',
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
      setTimeout(() => setIsProcessing(false), 1500);
    }
  };

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
        setIsProcessing(true);
        updateProcessingStatus('uploading', 0, 'Iniciando envio...');
        
        // Checar se já temos títulos disponíveis
        if (titlesLoaded && suggestedTitles.length > 0) {
          console.log("Já temos títulos disponíveis, atualizando workflow imediatamente");
          handleTitlesLoaded(suggestedTitles);
          return;
        }
        
        // Simulação de progresso incremental enquanto espera resposta do N8N
        let progressInterval = setInterval(() => {
          setProcessingStatus(prev => {
            // Não ultrapassa 95% antes de receber resposta
            const newProgress = prev.progress < 95 ? prev.progress + 1 : prev.progress;
            const stage = newProgress < 40 ? 'uploading' : 'analyzing';
            const message = stage === 'uploading' 
              ? `Enviando conteúdo... ${newProgress}%` 
              : `🧠 Analisando e estruturando conteúdo... ${newProgress}%`;
              
            return {
              ...prev,
              stage,
              progress: newProgress,
              message
            };
          });
        }, 300);
        
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
            clearInterval(progressInterval);
            
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
            setTimeout(() => {
              setIsProcessing(false);
            }, 500);
            
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
          updateProcessingStatus,
          async (suggestedTitles) => {
            // If n8n directly returned titles, use them
            if (suggestedTitles && suggestedTitles.length > 0) {
              console.log("Títulos recebidos diretamente do n8n:", suggestedTitles);
              
              // Try to advance with these titles
              if (await checkAndAdvanceWorkflow(true)) {
                return;
              }
            }
            
            // Set up a retry mechanism to check for titles
            let retryCount = 0;
            const maxRetries = 5;
            const retryInterval = setInterval(async () => {
              retryCount++;
              console.log(`Tentativa ${retryCount} de ${maxRetries} para buscar títulos...`);
              
              // Try to advance with fresh titles
              if (await checkAndAdvanceWorkflow(true)) {
                clearInterval(retryInterval);
                return;
              }
              
              // Stop retrying after max attempts
              if (retryCount >= maxRetries) {
                clearInterval(retryInterval);
                console.log("Máximo de tentativas excedido. Usando fallback.");
                
                // Use fallback titles if we couldn't get any
                const fallbackTitles = [
                  "Como as energias renováveis estão transformando o setor elétrico",
                  "O futuro da energia sustentável: desafios e oportunidades",
                  "Inovação e sustentabilidade no setor energético",
                  "Energia limpa: um caminho para o desenvolvimento sustentável",
                  "Revolução energética: o papel das fontes renováveis"
                ];
                
                // Update workflow with fallback titles
                onWorkflowUpdate({
                  content: content,
                  links: savedLinks.map(link => link.url),
                  files: uploadedFiles,
                  articleType: articleType,
                  agentConfirmed: true,
                  suggestedTitles: fallbackTitles,
                  isProcessing: false
                });
                
                // Show completed status
                updateProcessingStatus('completed', 100, 'Processamento concluído com títulos padrão.');
                
                // Short delay before moving to next step
                setTimeout(() => {
                  setIsProcessing(false);
                }, 500);
              }
            }, 3000); // Check every 3 seconds
          }
        );
        
        // If submitArticleToN8N returned an error, handle it
        if (!result.success) {
          clearInterval(progressInterval);
          throw new Error(result.status.error || "Falha no envio");
        }
        
      } catch (error) {
        console.error('Error submitting content:', error);
        toast({
          title: "Erro",
          description: error.message || "Ocorreu um erro ao processar sua solicitação",
          variant: "destructive",
        });
        setIsProcessing(false);
      }
    });
  };

  // Add retry functionality
  const handleRetry = () => {
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
          onCancel={() => setIsProcessing(false)}
          onRetry={handleRetry}
        />
      )}
    </>
  );
}
