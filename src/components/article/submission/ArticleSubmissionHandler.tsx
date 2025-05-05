import { useState } from "react";
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
  const { refetch: refetchTitles } = useTitleSuggestions();

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
        
        // Flag to track if we've received titles
        let titlesReceived = false;
        
        // Function to handle successful title reception
        const handleTitlesReceived = (suggestedTitles: string[]) => {
          titlesReceived = true;
          
          // Clear the progress interval since we have a response
          clearInterval(progressInterval);
          
          // Update workflow with title suggestions and move to next step
          console.log("Sugestões de títulos recebidas:", suggestedTitles);
          
          onWorkflowUpdate({
            step: "title-selection",
            content: content,
            links: savedLinks.map(link => link.url),
            files: uploadedFiles,
            articleType: articleType,
            agentConfirmed: true,
            suggestedTitles: suggestedTitles || [] // Add the suggested titles
          });
          
          // Move to next step automatically after receiving the titles
          updateProcessingStatus('completed', 100, 'Processamento concluído! Avançando para seleção de título...');
          
          // Short delay before completing the process
          setTimeout(() => {
            setIsProcessing(false);
            onNextStep();
          }, 1000);
        };
        
        // Set a timeout to check if titles were received after a reasonable time
        const receiveTimeout = setTimeout(() => {
          if (!titlesReceived) {
            // If titles not received yet, trigger a refetch
            refetchTitles().then(fetchedTitles => {
              if (fetchedTitles && fetchedTitles.length > 0) {
                handleTitlesReceived(fetchedTitles);
              } else {
                // Still waiting message
                setProcessingStatus(prev => ({
                  ...prev,
                  progress: 95,
                  message: "Aguardando resposta do servidor... Isto pode levar alguns minutos."
                }));
                
                // Keep progress at 95% and continue to wait
                // We don't clear the interval, it will continue to show activity
              }
            });
          }
        }, 15000); // Check after 15 seconds
        
        // Submit to n8n with callback for titles
        const result = await submitArticleToN8N(
          content,
          articleType.label || "Artigo",
          uploadedFiles,
          savedLinks.map(link => link.url),
          updateProcessingStatus,
          (suggestedTitles) => {
            // Clear timeout since we got titles
            clearTimeout(receiveTimeout);
            
            // Handle the received titles
            if (suggestedTitles && suggestedTitles.length > 0) {
              handleTitlesReceived(suggestedTitles);
            } else {
              // If n8n didn't return titles, try to fetch them
              refetchTitles().then(fetchedTitles => {
                if (fetchedTitles && fetchedTitles.length > 0) {
                  handleTitlesReceived(fetchedTitles);
                } else {
                  // No titles could be found, show error
                  updateProcessingStatus(
                    'error', 
                    0, 
                    'Não foi possível gerar títulos. Por favor, tente novamente.',
                    'Não foi possível obter sugestões de títulos.'
                  );
                  
                  // Clear interval and timeouts
                  clearInterval(progressInterval);
                }
              });
            }
          }
        );
        
        // If submitArticleToN8N returned an error, handle it
        if (!result.success) {
          clearInterval(progressInterval);
          clearTimeout(receiveTimeout);
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
